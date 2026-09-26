import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { OrderCustomer } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Truck,
  Building,
  Smartphone,
  QrCode,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  X,
} from 'lucide-react';

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi NCR',
  'Tamil Nadu',
  'Telangana',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Kerala',
  'Uttar Pradesh',
  'Haryana',
  'Punjab',
  'Goa',
  'Madhya Pradesh',
];

const UPI_HANDLES = ['@okhdfcbank', '@oksbi', '@okicici', '@okaxis', '@paytm', '@ybl'];

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', handle: '@okhdfcbank', color: '#1a73e8' },
  { id: 'phonepe', name: 'PhonePe', handle: '@ybl', color: '#5f259f' },
  { id: 'paytm', name: 'Paytm UPI', handle: '@paytm', color: '#00b9f5' },
  { id: 'bhim', name: 'BHIM NPCI', handle: '@upi', color: '#00796b' },
  { id: 'cred', name: 'CRED UPI', handle: '@axisbank', color: '#191918' },
];

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    appliedPromo,
    shippingFee,
    shippingMethod,
    tax,
    total,
    isGiftWrap,
    placeOrder,
    setActiveView,
  } = useCart();

  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@gmail.com',
    phone: '9845012345',
    address: '42, 12th Main Road, HAL 2nd Stage, Indiranagar',
    apartment: 'Flat 302, Palm Meadows',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    paymentMethod: 'upi',
    upiId: 'ananya@oksbi',
  });

  // UPI specific states
  const [upiMode, setUpiMode] = useState<'vpa' | 'qr'>('vpa');
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay');
  const [isVpaVerified, setIsVpaVerified] = useState<boolean>(true);
  const [vpaError, setVpaError] = useState<string | null>(null);

  // UPI Interactive Collect Screen states
  const [showUpiCollectModal, setShowUpiCollectModal] = useState<boolean>(false);
  const [upiTimer, setUpiTimer] = useState<number>(300); // 5 mins in seconds
  const [isSimulatingPayment, setIsSimulatingPayment] = useState<boolean>(false);
  const [paymentApprovedSuccess, setPaymentApprovedSuccess] = useState<boolean>(false);

  // Cards & NetBanking
  const [cardNumber, setCardNumber] = useState('5241 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('628');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // UPI countdown effect when collect modal is open
  useEffect(() => {
    let interval: any = null;
    if (showUpiCollectModal && upiTimer > 0 && !paymentApprovedSuccess) {
      interval = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showUpiCollectModal, upiTimer, paymentApprovedSuccess]);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-serif font-semibold mb-2">No items to checkout</h2>
        <p className="text-xs text-neutral-500 mb-6">Your shopping bag is currently empty.</p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-2.5 bg-[#191918] text-white text-xs uppercase tracking-wider rounded"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Handle VPA Suffix Pill click
  const handleApplyHandle = (suffix: string) => {
    const current = formData.upiId || 'username';
    const usernamePart = current.includes('@') ? current.split('@')[0] : current;
    const newVpa = `${usernamePart.trim() || 'user'}${suffix}`;
    setFormData((prev) => ({ ...prev, upiId: newVpa }));
    setIsVpaVerified(true);
    setVpaError(null);
  };

  // Verify VPA Address
  const handleVerifyVpa = () => {
    setVpaError(null);
    const vpa = (formData.upiId || '').trim();
    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/;

    if (!vpa) {
      setVpaError('Please enter your Virtual Payment Address (VPA).');
      setIsVpaVerified(false);
      return;
    }

    if (!vpaRegex.test(vpa)) {
      setVpaError('Invalid UPI VPA format. Standard format: username@bank (e.g. mobile@upi).');
      setIsVpaVerified(false);
      return;
    }

    setIsVpaVerified(true);
  };

  const handleSelectUpiApp = (app: (typeof UPI_APPS)[0]) => {
    setSelectedUpiApp(app.id);
    const current = formData.upiId || 'username';
    const usernamePart = current.includes('@') ? current.split('@')[0] : current;
    setFormData((prev) => ({ ...prev, upiId: `${usernamePart || 'user'}${app.handle}` }));
    setIsVpaVerified(true);
    setVpaError(null);
  };

  // Submit checkout form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.postalCode.trim()) {
      setValidationError('Please complete all required fields including your 10-digit mobile number and PIN code.');
      return;
    }

    if (formData.phone.length < 10) {
      setValidationError('Please enter a valid 10-digit Indian mobile number for courier OTP updates.');
      return;
    }

    // Integrated UPI flow trigger
    if (formData.paymentMethod === 'upi') {
      const vpa = (formData.upiId || '').trim();
      const vpaRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9]{2,32}$/;

      if (upiMode === 'vpa' && (!vpa || !vpaRegex.test(vpa))) {
        setValidationError('Please enter and verify a valid UPI Virtual Payment Address (VPA).');
        setVpaError('Format: username@bank (e.g. yourname@okhdfcbank)');
        return;
      }

      // Launch UPI Interactive Collect Request Screen!
      setShowUpiCollectModal(true);
      setUpiTimer(300);
      return;
    }

    // Cards / NetBanking / COD execution
    setIsSubmitting(true);
    setTimeout(async () => {
      await placeOrder({
        ...formData,
        cardNumberMasked: formData.paymentMethod === 'card' ? `•••• ${cardNumber.slice(-4)}` : undefined,
      });
      setIsSubmitting(false);
    }, 700);
  };

  // Approve simulated UPI payment
  const handleApproveUpiPayment = async () => {
    setIsSimulatingPayment(true);
    setTimeout(async () => {
      setPaymentApprovedSuccess(true);
      setTimeout(async () => {
        setShowUpiCollectModal(false);
        await placeOrder({
          ...formData,
          paymentMethod: 'upi',
          upiId: formData.upiId || 'vanya@upi',
        });
      }, 900);
    }, 1400);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 animate-in fade-in duration-200">
      {/* Top back link */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveView('cart')}
          className="text-xs font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Secure & NPCI UPI-Enabled 256-Bit Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Indian Customer & Delivery Information */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
                <span>01.</span>
                <span>Delivery Address (Pan-India)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded p-2.5 text-xs outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Mobile Number * (for Courier SMS OTP)
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 bg-neutral-200 border border-r-0 border-neutral-300 rounded-l text-xs font-mono text-neutral-700">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-r p-2.5 text-xs outline-none focus:border-black focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address * (for Tax Invoice & Consignment Waybill)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded p-2.5 text-xs outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    House / Flat No., Building & Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded p-2.5 text-xs outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded p-2.5 text-xs outline-none focus:border-black focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded p-2.5 text-xs outline-none focus:border-black focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    State / UT *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded p-2.5 text-xs outline-none focus:border-black focus:bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="India (Bharat)"
                    className="w-full bg-neutral-100 border border-neutral-300 rounded p-2.5 text-xs text-neutral-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Integrated Indian Payment Options (UPI VPA Highlighted) */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span>02.</span>
                  <span>Payment Mode</span>
                </div>
                <span className="text-[11px] font-normal text-emerald-700 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant UPI Zero Gateway Fee</span>
                </span>
              </h2>

              <div className="space-y-4">
                
                {/* 1. INTEGRATED UPI PAYMENT FLOW (WITH VPA & APP SELECTION) */}
                <div
                  className={`p-4 rounded-lg border transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'border-[#191918] bg-neutral-50/60 ring-1 ring-[#191918]'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">
                            UPI (Unified Payments Interface)
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">
                            Instant & Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Seamless Indian mobile payments via Virtual Payment Address (VPA) or Dynamic QR
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-800 font-mono font-bold text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>BHIM UPI</span>
                    </div>
                  </div>

                  {formData.paymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-neutral-200/90 space-y-4 animate-in fade-in duration-200">
                      
                      {/* Integrated UPI App Selector */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-2">
                          Select Preferred UPI Mobile App:
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => handleSelectUpiApp(app)}
                              className={`p-2 rounded border text-xs font-medium transition-all flex flex-col items-center justify-center text-center gap-1 ${
                                selectedUpiApp === app.id
                                  ? 'border-[#191918] bg-white shadow-xs ring-1 ring-black'
                                  : 'border-neutral-200 bg-white hover:border-neutral-300'
                              }`}
                            >
                              <span className="font-semibold text-neutral-900 text-[11px]">{app.name}</span>
                              <span className="text-[10px] font-mono text-neutral-400">{app.handle}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mode Toggle: VPA ID or Dynamic QR Code */}
                      <div className="flex items-center gap-2 bg-neutral-200/60 p-1 rounded text-xs font-medium">
                        <button
                          type="button"
                          onClick={() => setUpiMode('vpa')}
                          className={`flex-1 py-1.5 rounded transition-all text-center ${
                            upiMode === 'vpa'
                              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                              : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          Enter UPI ID (VPA)
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiMode('qr')}
                          className={`flex-1 py-1.5 rounded transition-all text-center flex items-center justify-center gap-1.5 ${
                            upiMode === 'qr'
                              ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                              : 'text-neutral-600 hover:text-black'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Scan Dynamic UPI QR</span>
                        </button>
                      </div>

                      {/* VPA Input Mode */}
                      {upiMode === 'vpa' ? (
                        <div className="space-y-3 bg-white p-3.5 rounded border border-neutral-200">
                          <label className="block text-xs font-semibold text-neutral-800">
                            Virtual Payment Address (VPA):
                          </label>

                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={formData.upiId || ''}
                                onChange={(e) => {
                                  setFormData({ ...formData, upiId: e.target.value.toLowerCase().trim() });
                                  setIsVpaVerified(false);
                                  setVpaError(null);
                                }}
                                placeholder="yourname@okhdfcbank or 9845012345@paytm"
                                className="w-full bg-neutral-50 border border-neutral-300 rounded px-3 py-2 text-xs font-mono outline-none focus:border-black focus:bg-white"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleVerifyVpa}
                              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-medium transition-colors border border-neutral-300 shrink-0"
                            >
                              Verify VPA
                            </button>
                          </div>

                          {/* Quick Handle Suffix Chips */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-medium">
                              Popular Bank VPA Suffixes:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {UPI_HANDLES.map((handle) => (
                                <button
                                  key={handle}
                                  type="button"
                                  onClick={() => handleApplyHandle(handle)}
                                  className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-mono rounded border border-neutral-200 transition-colors"
                                >
                                  {handle}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* VPA Verification Status Indicator */}
                          {isVpaVerified ? (
                            <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-medium">
                                Verified VPA: <strong className="font-mono">{formData.upiId}</strong> ({formData.fullName.split(' ')[0]} · NPCI Registered)
                              </span>
                            </div>
                          ) : vpaError ? (
                            <div className="flex items-center gap-1.5 p-2 bg-rose-50 rounded border border-rose-200 text-xs text-rose-700">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>{vpaError}</span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-neutral-500">
                              A payment collect request for <strong>₹{total.toLocaleString('en-IN')}</strong> will be routed directly to your UPI mobile app.
                            </p>
                          )}
                        </div>
                      ) : (
                        /* Dynamic QR Code Mode Preview */
                        <div className="bg-white p-4 rounded border border-neutral-200 flex flex-col items-center text-center space-y-3">
                          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                            {/* Stylized high-contrast UPI QR */}
                            <div className="w-36 h-36 bg-white p-2 rounded border border-neutral-300 flex flex-col items-center justify-center relative shadow-xs">
                              <div className="grid grid-cols-4 gap-1 w-full h-full opacity-90 p-1">
                                {[...Array(16)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`rounded-xs ${
                                      i % 2 === 0 || i % 5 === 0 ? 'bg-black' : 'bg-neutral-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-[#191918] text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                  BHIM UPI
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-neutral-900 block">
                              Scan with any Indian UPI App
                            </span>
                            <span className="text-[11px] text-neutral-500 block">
                              Google Pay · PhonePe · Paytm · BHIM · Any Banking App
                            </span>
                            <span className="text-xs font-mono font-bold text-neutral-900 block pt-1">
                              Amount: ₹{total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>

                {/* 2. Credit / Debit Cards (Rupay, Visa, Mastercard) */}
                <div
                  className={`p-4 rounded-lg border transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#191918] bg-neutral-50/60 ring-1 ring-[#191918]'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900">
                          Credit / Debit Card (RuPay, Visa, Mastercard)
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Indian & International credit or debit cards
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4 text-neutral-500" />
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-neutral-200/90 grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-[11px] text-neutral-600 mb-1 font-medium">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="5241 0000 0000 0000"
                          className="w-full bg-white border border-neutral-300 rounded p-2 text-xs font-mono outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-600 mb-1 font-medium">
                          Valid Thru (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-neutral-300 rounded p-2 text-xs font-mono outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-600 mb-1 font-medium">
                          CVV / CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full bg-white border border-neutral-300 rounded p-2 text-xs font-mono outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. NetBanking */}
                <div
                  className={`p-4 rounded-lg border transition-all ${
                    formData.paymentMethod === 'netbanking'
                      ? 'border-[#191918] bg-neutral-50/60 ring-1 ring-[#191918]'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'netbanking' })}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'netbanking'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'netbanking' })}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-xs font-bold text-neutral-900">
                        NetBanking (All Indian Scheduled Banks)
                      </span>
                    </div>
                    <Building className="w-4 h-4 text-neutral-400" />
                  </div>

                  {formData.paymentMethod === 'netbanking' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200/90">
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded p-2 text-xs outline-none focus:border-black"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 4. Cash on Delivery (COD) */}
                <div
                  className={`p-4 rounded-lg border transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#191918] bg-neutral-50/60 ring-1 ring-[#191918]'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900">
                          Cash on Delivery (COD) / Pay upon Courier Inspection
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Inspect handcrafted pieces in person before handing cash or scanning courier QR.
                        </p>
                      </div>
                    </div>
                    <Truck className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>

              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Authorize Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#191918] hover:bg-neutral-800 disabled:opacity-50 text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Securing Order with Artisan Guild...</span>
              ) : formData.paymentMethod === 'upi' ? (
                <span>Continue to UPI Payment · ₹{total.toLocaleString('en-IN')}</span>
              ) : (
                <span>Authorize & Place Order · ₹{total.toLocaleString('en-IN')}</span>
              )}
            </button>
          </form>
        </div>

        {/* Order Review Sticky Sidebar (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-serif font-semibold text-[#191918] pb-3 border-b border-neutral-200">
              Review Bag ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h3>

            {/* Itemized preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-neutral-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        Qty: {item.quantity} · ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums text-neutral-800 font-medium shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Line Items */}
            <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900 font-medium">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span className="font-mono tabular-nums font-medium">
                    -₹{discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {isGiftWrap && (
                <div className="flex justify-between text-neutral-700">
                  <span>Handloom Mulmul Potli</span>
                  <span className="font-mono tabular-nums font-medium">+₹149</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Pan-India Courier ({shippingMethod})</span>
                <span className="font-mono tabular-nums text-neutral-900 font-medium">
                  {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated GST (12%)</span>
                <span className="font-mono tabular-nums text-neutral-900 font-medium">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-base font-semibold text-[#191918]">
                <span>Total Amount Due</span>
                <span className="text-xl font-mono tabular-nums font-bold">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="p-3 bg-neutral-50 rounded border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Insured pan-India transit via Bluedart / Delhivery. Free return pickups available if any defect occurs during shipping.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INTEGRATED UPI COLLECT PAYMENT MODAL / FLOW */}
      {showUpiCollectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-7 border border-neutral-200 shadow-2xl space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-serif text-lg font-semibold text-neutral-900">
                  UPI Payment Request Sent
                </h3>
              </div>
              <button
                onClick={() => setShowUpiCollectModal(false)}
                className="text-neutral-400 hover:text-black p-1 transition-colors"
                aria-label="Close UPI collect modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Target & Timer Box */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 text-center space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                Amount to Authorize
              </div>
              <div className="text-3xl font-mono font-bold text-neutral-900 tabular-nums">
                ₹{total.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-neutral-600 flex items-center justify-center gap-1 font-mono">
                <span>VPA:</span>
                <span className="font-semibold text-black bg-white px-2 py-0.5 rounded border border-neutral-200">
                  {formData.upiId}
                </span>
              </div>
              <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-amber-700 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Expires in: <strong>{formatTimer(upiTimer)}</strong></span>
              </div>
            </div>

            {/* Action Instructions */}
            <div className="space-y-2 text-xs text-neutral-600 bg-neutral-50/70 p-3.5 rounded border border-neutral-200/80">
              <div className="font-semibold text-neutral-900 text-xs mb-1">
                Steps to approve on your phone:
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>Open your <strong>{selectedUpiApp.toUpperCase()}</strong> or bank app on your phone.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>Accept the collect request from <strong>Vanya Living Crafts (NPCI ID: vanya@merchant)</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>Enter your 4 or 6-digit secure UPI PIN to authorize.</span>
              </div>
            </div>

            {/* Simulation Action CTA */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleApproveUpiPayment}
                disabled={isSimulatingPayment || paymentApprovedSuccess}
                className="w-full py-3.5 px-4 bg-[#191918] hover:bg-neutral-800 disabled:opacity-75 text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                {paymentApprovedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>UPI Payment Verified · Finalizing Order...</span>
                  </>
                ) : isSimulatingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Contacting NPCI Switch & Confirming Bank Authorization...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Approve & Authorize in UPI App (Simulate)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowUpiCollectModal(false)}
                className="w-full py-2 text-xs text-neutral-500 hover:text-black transition-colors text-center"
              >
                Cancel / Modify VPA Address
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

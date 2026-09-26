import React, { useState } from 'react';
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

  const [cardNumber, setCardNumber] = useState('5241 •••• •••• 9012');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('628');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

    setIsSubmitting(true);
    setTimeout(async () => {
      await placeOrder({
        ...formData,
        cardNumberMasked: formData.paymentMethod === 'card' ? `•••• ${cardNumber.slice(-4)}` : undefined,
      });
      setIsSubmitting(false);
    }, 700);
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
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Secure & RBI-Compliant 256-Bit Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Indian Customer & Delivery Information */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-4">
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
                    Mobile Number * (for Bluedart / Delhivery OTP)
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
                    Email Address * (for tax invoice & order tracking)
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

            {/* 2. Indian Payment Methods: UPI, Cards, NetBanking, COD */}
            <div className="bg-white p-6 rounded border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
                <span>02.</span>
                <span>Payment Option</span>
              </h2>

              <div className="space-y-3">
                {/* 1. UPI Payment (Google Pay / PhonePe / Paytm / BHIM) */}
                <label
                  className={`block p-4 rounded border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'upi'
                      ? 'border-[#191918] bg-neutral-50/70'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900">
                          Instant UPI (Google Pay, PhonePe, Paytm, BHIM)
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Instant zero-fee payment with UPI ID or Scan QR
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <span className="text-[11px] font-mono font-bold">UPI</span>
                    </div>
                  </div>

                  {formData.paymentMethod === 'upi' && (
                    <div className="mt-4 pt-3 border-t border-neutral-200/80 space-y-2">
                      <label className="block text-[11px] text-neutral-600 font-medium">
                        Enter UPI VPA ID (e.g. mobile@upi or username@okhdfcbank):
                      </label>
                      <input
                        type="text"
                        value={formData.upiId || ''}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        placeholder="yourname@okhdfcbank"
                        className="w-full bg-white border border-neutral-300 rounded p-2 text-xs font-mono outline-none focus:border-black"
                      />
                      <div className="flex items-center gap-2 text-[11px] text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Instant payment request will be sent to your UPI app on authorization.</span>
                      </div>
                    </div>
                  )}
                </label>

                {/* 2. Credit / Debit Cards (Rupay, Visa, Mastercard) */}
                <label
                  className={`block p-4 rounded border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'card'
                      ? 'border-[#191918] bg-neutral-50/70'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900">
                          Credit / Debit Card (RuPay, Visa, Mastercard)
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Indian & International cards supported
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4 text-neutral-500" />
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-neutral-200/80 grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2">
                        <label className="block text-[11px] text-neutral-600 mb-1">
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
                        <label className="block text-[11px] text-neutral-600 mb-1">
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
                        <label className="block text-[11px] text-neutral-600 mb-1">
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
                </label>

                {/* 3. NetBanking */}
                <label
                  className={`block p-4 rounded border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'netbanking'
                      ? 'border-[#191918] bg-neutral-50/70'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'netbanking'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'netbanking' })}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-xs font-semibold text-neutral-900">
                        NetBanking (All Indian Scheduled Banks)
                      </span>
                    </div>
                    <Building className="w-4 h-4 text-neutral-400" />
                  </div>

                  {formData.paymentMethod === 'netbanking' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200/80">
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
                </label>

                {/* 4. Cash on Delivery (COD) */}
                <label
                  className={`block p-4 rounded border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#191918] bg-neutral-50/70'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <span className="text-xs font-semibold text-neutral-900">
                          Cash on Delivery (COD) / Pay upon Courier Inspection
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Inspect handcrafted pieces in person before handing cash or scanning courier QR.
                        </p>
                      </div>
                    </div>
                    <Truck className="w-4 h-4 text-neutral-400" />
                  </div>
                </label>
              </div>
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
                {validationError}
              </div>
            )}

            {/* Authorize Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#191918] hover:bg-neutral-800 disabled:opacity-50 text-white rounded text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Securing Order with Artisan Guild...</span>
              ) : (
                <span>Authorize & Place Order · ₹{total.toLocaleString('en-IN')}</span>
              )}
            </button>
          </form>
        </div>

        {/* Order Review Sticky Sidebar (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded border border-neutral-200 p-6 shadow-sm space-y-6">
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
    </div>
  );
};

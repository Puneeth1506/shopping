import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { buildShipmentForOrderedItem } from '../data/shipments';
import { OrderSummary, CartItem } from '../types';
import {
  Search,
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Phone,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  BellRing,
  HelpCircle,
  ShoppingBag,
} from 'lucide-react';

interface OrderedItemRef {
  key: string;
  order: OrderSummary;
  item: CartItem;
}

export const OrderTracking: React.FC = () => {
  const { orderHistory, trackingOrderId, setTrackingOrderId, setActiveView } = useCart();

  // Extract all ordered items across user's order history
  const allOrderedItems: OrderedItemRef[] = useMemo(() => {
    const list: OrderedItemRef[] = [];
    orderHistory.forEach((order) => {
      order.items.forEach((item, idx) => {
        list.push({
          key: `${order.orderId}-${item.product.id}-${idx}`,
          order,
          item,
        });
      });
    });
    return list;
  }, [orderHistory]);

  // Selected ordered item
  const [selectedKey, setSelectedKey] = useState<string>(() => {
    if (allOrderedItems.length === 0) return '';
    // If trackingOrderId was set, try to find matching item or order
    if (trackingOrderId) {
      const match = allOrderedItems.find(
        (o) =>
          o.order.orderId.toLowerCase() === trackingOrderId.toLowerCase() ||
          o.item.product.name.toLowerCase().includes(trackingOrderId.toLowerCase()) ||
          trackingOrderId.toLowerCase().includes(o.item.product.name.toLowerCase())
      );
      if (match) return match.key;
    }
    return allOrderedItems[0].key;
  });

  const [searchInput, setSearchInput] = useState<string>('');
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Sync selectedKey if trackingOrderId changes externally
  useEffect(() => {
    if (trackingOrderId && allOrderedItems.length > 0) {
      const match = allOrderedItems.find(
        (o) =>
          o.order.orderId.toLowerCase() === trackingOrderId.toLowerCase() ||
          o.item.product.name.toLowerCase().includes(trackingOrderId.toLowerCase()) ||
          trackingOrderId.toLowerCase().includes(o.item.product.name.toLowerCase())
      );
      if (match) {
        setSelectedKey(match.key);
      }
    }
  }, [trackingOrderId, allOrderedItems]);

  // Filter ordered items strictly based on user's search
  const filteredOrderedItems = useMemo(() => {
    if (!searchInput.trim()) return allOrderedItems;
    const q = searchInput.trim().toLowerCase();
    return allOrderedItems.filter(
      (o) =>
        o.item.product.name.toLowerCase().includes(q) ||
        o.order.orderId.toLowerCase().includes(q) ||
        o.item.product.craftOrigin.toLowerCase().includes(q) ||
        o.order.customer.city.toLowerCase().includes(q)
    );
  }, [allOrderedItems, searchInput]);

  const activeOrderedRef =
    allOrderedItems.find((o) => o.key === selectedKey) ||
    allOrderedItems[0] ||
    null;

  // Build shipment data strictly for the selected ordered item
  const activeShipment = useMemo(() => {
    if (!activeOrderedRef) return null;
    return buildShipmentForOrderedItem(activeOrderedRef.order, activeOrderedRef.item);
  }, [activeOrderedRef]);

  const handleCopyAwb = (awb: string) => {
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const getStageStep = (stage: string) => {
    switch (stage) {
      case 'order_confirmed': return 1;
      case 'artisan_packed': return 2;
      case 'dispatched_hub': return 3;
      case 'in_transit': return 4;
      case 'out_for_delivery': return 5;
      case 'delivered': return 6;
      default: return 2;
    }
  };

  const currentStep = activeShipment ? getStageStep(activeShipment.currentStage) : 2;

  // If user has zero orders placed
  if (allOrderedItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[#191918] mb-2">
          No Ordered Items Found
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto mb-6 leading-relaxed">
          You currently have no active orders to track. Once you purchase handcrafted pieces through our checkout, their live regional Indian courier status will appear here.
        </p>
        <button
          onClick={() => setActiveView('shop')}
          className="px-6 py-3 bg-[#191918] hover:bg-neutral-800 text-white rounded text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm"
        >
          Explore Master Works & Order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveView('shop')}
          className="text-xs font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalog</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
          <Truck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Live Regional Indian Logistics Portal</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold mb-1">
          Your Ordered Consignments · Pan-India
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#191918]">
          Track Your Ordered Pieces
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-normal leading-relaxed">
          Showing only your purchased handcrafted items. Select any piece below to inspect its live workshop production, regional transit hub, and delivery status.
        </p>
      </div>

      {/* Ordered Products Selector & Search Filter */}
      <div className="bg-white rounded-lg p-5 sm:p-6 border border-neutral-200 shadow-xs mb-8 space-y-4">
        
        {/* Search within ordered items */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search within your ordered pieces (e.g. 'Brass', 'Razai', 'Kaapi')..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded pl-10 pr-4 py-2.5 text-xs outline-none focus:border-black focus:bg-white transition-colors"
          />
        </div>

        {/* Ordered Items Grid / Chips — Strictly ONLY user's purchased items */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2.5 flex items-center justify-between">
            <span>Your Purchased Pieces ({allOrderedItems.length}):</span>
            <span className="text-neutral-400 font-normal">Click an item to view live shipment</span>
          </div>

          {filteredOrderedItems.length === 0 ? (
            <div className="p-4 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-600 text-center">
              No ordered item matching "{searchInput}".{' '}
              <button
                onClick={() => setSearchInput('')}
                className="text-black font-semibold underline ml-1"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredOrderedItems.map((entry) => {
                const isSelected = entry.key === activeOrderedRef?.key;
                const courierName =
                  entry.order.shippingMethod === 'express'
                    ? 'Blue Dart Express'
                    : entry.order.shippingMethod === 'courier'
                    ? 'Shadowfax Metro'
                    : 'Delhivery';

                return (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => {
                      setSelectedKey(entry.key);
                      setTrackingOrderId(entry.item.product.name);
                    }}
                    className={`p-3 rounded-lg border text-left text-xs transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-[#191918] bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-neutral-50/80 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {/* Item Thumbnail */}
                    <div className="w-11 h-11 rounded bg-white/20 shrink-0 overflow-hidden border border-neutral-200/50">
                      <img
                        src={entry.item.product.image}
                        alt={entry.item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Meta */}
                    <div className="truncate flex-1">
                      <div className="font-semibold truncate">
                        {entry.item.product.name}
                      </div>
                      <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        Qty: {entry.item.quantity} · {courierName}
                      </div>
                      <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                        {entry.order.orderId} · {entry.order.customer.city}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Shipment Results for Selected Ordered Item */}
      {activeShipment && activeOrderedRef && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Status Header Overview Card */}
          <div className="bg-white rounded-lg p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-6">
            
            {/* Tracked Product Feature Banner */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 overflow-hidden">
                <img
                  src={activeOrderedRef.item.product.image}
                  alt={activeOrderedRef.item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded object-cover border border-neutral-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="truncate">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-bold block">
                    Ordered Handcrafted Piece
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                    {activeOrderedRef.item.product.name}
                  </h3>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                    <span>Origin: {activeOrderedRef.item.product.craftOrigin}</span>
                    <span>·</span>
                    <span>Quantity: {activeOrderedRef.item.quantity}</span>
                    {activeOrderedRef.item.selectedColor && (
                      <>
                        <span>·</span>
                        <span>{activeOrderedRef.item.selectedColor}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-neutral-600 font-mono shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div>Order Ref: <strong className="text-neutral-900">{activeOrderedRef.order.orderId}</strong></div>
                <div className="text-neutral-500">Booked via Vanya Living</div>
              </div>
            </div>

            {/* Courier partner & AWB */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-neutral-900 text-white rounded text-[11px] font-semibold uppercase tracking-wider">
                    {activeShipment.courierName}
                  </span>
                  {activeShipment.currentStage === 'out_for_delivery' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Out for Delivery Today</span>
                    </span>
                  )}
                  {activeShipment.currentStage === 'in_transit' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <span>In Zonal Hub Transit</span>
                    </span>
                  )}
                  {activeShipment.currentStage === 'artisan_packed' && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      <span>Artisan Packaged · Awaiting Pickup</span>
                    </span>
                  )}
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  Destined for: <strong className="text-neutral-900">{activeShipment.deliveryAddress.recipientName}</strong>
                </div>
              </div>

              {/* AWB with 1-click Copy */}
              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded px-3 py-1.5 text-xs">
                <span className="text-neutral-500 font-mono text-[11px]">AWB Waybill:</span>
                <span className="font-mono font-bold text-neutral-900">{activeShipment.awbNumber}</span>
                <button
                  onClick={() => handleCopyAwb(activeShipment.awbNumber)}
                  className="ml-1 text-neutral-500 hover:text-black p-1 transition-colors"
                  title="Copy Waybill Number"
                  aria-label="Copy Waybill Number"
                >
                  {copiedAwb ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="pt-2">
              <div className="hidden sm:grid grid-cols-5 gap-2 text-center text-xs mb-3">
                {[
                  'Order Placed',
                  'Artisan Packaged',
                  'Dispatched to Hub',
                  'In Transit',
                  'Out for Delivery',
                ].map((stepLabel, idx) => {
                  const stepNum = idx + 1;
                  const isDone = stepNum <= currentStep;
                  const isCurrent = stepNum === currentStep;
                  return (
                    <div
                      key={stepLabel}
                      className={`text-[11px] font-medium leading-tight ${
                        isCurrent
                          ? 'text-[#191918] font-bold'
                          : isDone
                          ? 'text-neutral-700'
                          : 'text-neutral-400'
                      }`}
                    >
                      <span>{stepLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#191918] z-0 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 4) * 100))}%` }}
                />

                {[1, 2, 3, 4, 5].map((stepNum) => {
                  const isDone = stepNum <= currentStep;
                  const isCurrent = stepNum === currentStep;
                  return (
                    <div
                      key={stepNum}
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                        isCurrent
                          ? 'bg-[#191918] text-white ring-4 ring-neutral-200 scale-110 font-bold'
                          : isDone
                          ? 'bg-[#191918] text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}
                    >
                      {isDone && !isCurrent ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        stepNum
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Bar: Estimated arrival & destination */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded border border-neutral-200/80 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    Estimated Doorstep Arrival
                  </div>
                  <div className="font-semibold text-neutral-900 text-sm">
                    {activeShipment.estimatedDelivery}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    Destination Address
                  </div>
                  <div className="font-semibold text-neutral-900">
                    {activeShipment.deliveryAddress.city}, {activeShipment.deliveryAddress.state} - {activeShipment.deliveryAddress.pincode}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    Carrier Support Desk
                  </div>
                  <div className="font-medium text-neutral-800 text-[11px]">
                    {activeShipment.courierContact}
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Agent Card if Out For Delivery */}
            {activeShipment.deliveryAgent && activeShipment.currentStage === 'out_for_delivery' && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {activeShipment.deliveryAgent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">
                      Assigned Courier Executive: {activeShipment.deliveryAgent.name}
                    </div>
                    <div className="text-neutral-600 text-[11px]">
                      Contact: {activeShipment.deliveryAgent.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-amber-300 text-amber-900 font-mono text-[11px] shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>4-Digit Delivery OTP required upon doorstep arrival</span>
                </div>
              </div>
            )}

          </div>

          {/* Two-Column Grid: Live Checkpoints Timeline & Package Manifest */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Checkpoint Event Log (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-lg p-6 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="font-serif text-base font-semibold text-[#191918] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-600" />
                  <span>Regional Checkpoint History</span>
                </h2>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {activeShipment.checkpoints.length} events logged
                </span>
              </div>

              {/* Timeline Container */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
                {activeShipment.checkpoints.map((cp, idx) => (
                  <div key={cp.id || idx} className="relative flex items-start gap-4 text-xs">
                    {/* Circle Node */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        cp.isCurrent
                          ? 'bg-[#191918] text-white ring-4 ring-neutral-200'
                          : cp.completed
                          ? 'bg-neutral-800 text-white'
                          : 'bg-white border-2 border-neutral-300 text-neutral-400'
                      }`}
                    >
                      {cp.completed ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className={`font-semibold ${cp.isCurrent ? 'text-black text-sm' : 'text-neutral-900'}`}>
                          {cp.status}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          {cp.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-[#8C7A6B]">
                        {cp.location}
                      </div>
                      <p className="text-neutral-600 text-xs leading-relaxed">
                        {cp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SMS Notification Toggle */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-neutral-500" />
                  <span>Receive WhatsApp & SMS transit alerts</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    smsAlertsEnabled ? 'bg-[#191918]' : 'bg-neutral-300'
                  }`}
                  aria-label="Toggle live SMS alerts"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      smsAlertsEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right: Package Manifest & Destination Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Items in Consignment */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-serif text-sm font-semibold text-neutral-900 pb-2 border-b border-neutral-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-600" />
                  <span>Ordered Piece Manifest</span>
                </h3>

                <div className="flex items-center gap-3 text-xs">
                  <div className="w-14 h-14 rounded bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0">
                    <img
                      src={activeOrderedRef.item.product.image}
                      alt={activeOrderedRef.item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="truncate flex-1">
                    <div className="font-semibold text-neutral-900 truncate">
                      {activeOrderedRef.item.product.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      Quantity: {activeOrderedRef.item.quantity} · Price: ₹{(activeOrderedRef.item.product.price * activeOrderedRef.item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Origin: {activeOrderedRef.item.product.craftOrigin}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Destination Address */}
              <div className="bg-white rounded-lg p-5 border border-neutral-200 shadow-xs space-y-2 text-xs">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Delivery Address</span>
                </div>
                <div className="font-semibold text-neutral-900 text-sm">
                  {activeOrderedRef.order.customer.fullName}
                </div>
                <div className="text-neutral-600">
                  {activeOrderedRef.order.customer.address}
                </div>
                <div className="text-neutral-600">
                  {activeOrderedRef.order.customer.city}, {activeOrderedRef.order.customer.state}
                </div>
                <div className="font-mono text-neutral-700">
                  PIN Code: {activeOrderedRef.order.customer.postalCode} (India)
                </div>
              </div>

              {/* Support & Escalation Card */}
              <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200/80 text-xs space-y-3">
                <div className="flex items-center gap-2 font-semibold text-neutral-800">
                  <HelpCircle className="w-4 h-4 text-[#8C7A6B]" />
                  <span>Delivery Support Concierge</span>
                </div>
                <p className="text-neutral-600 leading-relaxed text-[11px]">
                  Order reference <strong>{activeOrderedRef.order.orderId}</strong> is under direct artisan cluster supervision. Need help?
                </p>
                <button
                  type="button"
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-2 bg-white hover:bg-neutral-100 text-neutral-800 rounded border border-neutral-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Contact Delivery Concierge</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Support Drawer / Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-neutral-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-serif text-base font-semibold text-neutral-900">
                Vanya Regional Logistics Concierge
              </h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-neutral-400 hover:text-black text-sm p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We provide dedicated liaison support with all Indian regional carrier partners. Reference your Order ID <strong>{activeShipment?.orderId}</strong> when reaching out.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-[11px] text-neutral-400 uppercase block font-mono">Toll-Free Priority</span>
                <span className="font-bold text-neutral-900">1800-419-VANYA (82692)</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <span className="text-[11px] text-neutral-400 uppercase block font-mono">WhatsApp Desk</span>
                <span className="font-bold text-neutral-900">+91 98450 12345 (9 AM – 8 PM IST)</span>
              </div>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 bg-[#191918] text-white rounded text-xs uppercase tracking-wider font-medium"
            >
              Close Concierge Desk
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

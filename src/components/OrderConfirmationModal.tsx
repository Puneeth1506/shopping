import React from 'react';
import { useCart } from '../context/CartContext';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Printer,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { lastCompletedOrder, setActiveView, openTrackingForOrder } = useCart();

  if (!lastCompletedOrder) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-serif font-semibold mb-2">No recent order found</h2>
        <button
          onClick={() => setActiveView('shop')}
          className="mt-4 px-6 py-2.5 bg-[#191918] text-white text-xs uppercase tracking-wider rounded"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const order = lastCompletedOrder;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg border border-neutral-200/90 shadow-lg p-6 sm:p-10 space-y-8">
        
        {/* Header with Success Check */}
        <div className="text-center space-y-3 pb-6 border-b border-neutral-200">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold">
            Order Confirmed · Preparing Artisan Packing
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#191918]">
            Dhanyavaad, {order.customer.fullName.split(' ')[0]}.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            Your handcrafted order has been logged with our artisan guild clusters.
            Tax invoice & Bluedart tracking updates have been sent to <strong className="text-neutral-800">{order.customer.email}</strong> and SMS to <strong className="text-neutral-800">+91 {order.customer.phone}</strong>.
          </p>
        </div>

        {/* Order Details Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded border border-neutral-200/80 text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Order Reference</span>
            <span className="font-mono font-bold text-neutral-900">{order.orderId}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Estimated Delivery</span>
            <span className="font-semibold text-neutral-900">{order.estimatedDelivery}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Courier Partner</span>
            <span className="capitalize font-medium text-neutral-900">Bluedart Priority Air</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px] uppercase tracking-wider">Payment Mode</span>
            <span className="capitalize font-medium text-neutral-900">
              {order.customer.paymentMethod === 'upi'
                ? `UPI (${order.customer.upiId || 'Instant'})`
                : order.customer.paymentMethod === 'card'
                ? `Card (${order.customer.cardNumberMasked || '••••'})`
                : order.customer.paymentMethod === 'cod'
                ? 'Cash on Delivery (Pay upon arrival)'
                : 'NetBanking'}
            </span>
          </div>
        </div>

        {/* Itemized Order Table */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
            Handcrafted pieces in this shipment
          </h3>
          <div className="divide-y divide-neutral-100 border border-neutral-200 rounded overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-neutral-900">{item.product.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      <span>Origin: {item.product.craftOrigin}</span>
                      {item.selectedColor && <span> · {item.selectedColor}</span>}
                      {item.selectedSize && <span> · {item.selectedSize}</span>}
                      <span> · Qty: {item.quantity}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono font-semibold tabular-nums text-neutral-900 shrink-0">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown & Shipping Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Destination */}
          <div className="p-4 bg-neutral-50 rounded border border-neutral-200/80 text-xs space-y-1.5">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-600" />
              <span>Pan-India Delivery Address</span>
            </span>
            <p className="font-semibold text-neutral-900 pt-1">{order.customer.fullName}</p>
            <p className="text-neutral-600">{order.customer.address}</p>
            <p className="text-neutral-600">
              {order.customer.city}, {order.customer.state} - {order.customer.postalCode}
            </p>
            <p className="text-neutral-500 font-mono text-[11px]">Phone: +91 {order.customer.phone}</p>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-neutral-900 font-medium">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promo Discount ({order.appliedPromoCode})</span>
                <span className="font-mono tabular-nums font-medium">
                  -₹{order.discount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {order.isGiftWrap && (
              <div className="flex justify-between">
                <span>Handloom Mulmul Potli</span>
                <span className="font-mono tabular-nums font-medium">+₹149</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Pan-India Courier</span>
              <span className="font-mono tabular-nums text-neutral-900 font-medium">
                {order.shippingCost === 0 ? 'Complimentary' : `₹${order.shippingCost}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (12% tax invoice)</span>
              <span className="font-mono tabular-nums text-neutral-900 font-medium">
                ₹{order.tax.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm font-semibold text-[#191918]">
              <span>Total Paid / Payable</span>
              <span className="text-lg font-mono tabular-nums font-bold">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openTrackingForOrder(order.orderId)}
              className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-3.5 h-3.5 text-[#E0A865]" />
              <span>Track Live Consignment</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <button
            onClick={() => setActiveView('shop')}
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

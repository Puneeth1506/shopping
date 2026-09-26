import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  Bookmark,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Gift,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';

export const FullCartPage: React.FC = () => {
  const {
    cart,
    savedItems,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    progressToFreeShipping,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCartFromSaved,
    removeSavedItem,
    appliedPromo,
    applyPromo,
    removePromo,
    shippingMethod,
    setShippingMethod,
    isGiftWrap,
    setIsGiftWrap,
    orderNote,
    setOrderNote,
    setActiveView,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 animate-in fade-in duration-200">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveView('shop')}
          className="text-xs font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Exploring Catalog</span>
        </button>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-neutral-400 hover:text-rose-600 transition-colors"
          >
            Clear Entire Bag
          </button>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#191918] mb-8">
        Your Shopping Bag
      </h1>

      {cart.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-lg border border-neutral-200/80 p-8 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-semibold text-neutral-900 mb-2">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-neutral-500 mb-6 max-w-md mx-auto leading-relaxed">
            Discover hand-cast Kumbakonam brassware, Jaipur block-printed mulmul throws, and heirloom artisan crafts.
          </p>
          <button
            onClick={() => setActiveView('shop')}
            className="px-6 py-3 bg-[#191918] text-white text-xs uppercase tracking-wider rounded font-medium hover:bg-neutral-800 transition-colors"
          >
            Browse Master Works
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Cart Items List & Options (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Items Table */}
            <div className="bg-white rounded border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
              <div className="p-4 bg-neutral-50/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 grid grid-cols-12 gap-4">
                <div className="col-span-6 sm:col-span-7">Handcrafted Item</div>
                <div className="col-span-3 sm:col-span-2 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {cart.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 grid grid-cols-12 gap-4 items-center">
                  {/* Product Details */}
                  <div className="col-span-6 sm:col-span-7 flex gap-3.5">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-100 rounded shrink-0 overflow-hidden border border-neutral-200/60 relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-[#191918] leading-snug">
                          {item.product.name}
                        </h3>
                        <div className="text-[11px] text-neutral-500 mt-1 flex flex-wrap gap-x-2">
                          <span>Origin: {item.product.craftOrigin}</span>
                          {item.selectedColor && <span>· Finish: {item.selectedColor}</span>}
                          {item.selectedSize && <span>· Size: {item.selectedSize}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 text-[11px] text-neutral-500">
                        <button
                          onClick={() => saveForLater(item.id)}
                          className="hover:text-black transition-colors flex items-center gap-1"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Save for later</span>
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hover:text-rose-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="col-span-3 sm:col-span-2 flex justify-center">
                    <div className="flex items-center border border-neutral-300 rounded bg-white text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 sm:px-2.5 py-1 text-neutral-600 hover:text-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 sm:w-7 text-center font-mono font-medium tabular-nums text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stockCount}
                        className="px-2 sm:px-2.5 py-1 text-neutral-600 hover:text-black disabled:opacity-30 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-3 text-right">
                    <span className="text-sm font-semibold font-mono tabular-nums text-[#191918]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indian Packaging & Special Instructions */}
            <div className="bg-white p-5 rounded border border-neutral-200/80 space-y-4 shadow-xs">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-800">
                Gift Packaging & Delivery Instructions
              </h3>

              {/* Handloom Gift Wrap Toggle */}
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-neutral-50 rounded border border-neutral-200/60 hover:bg-neutral-100/50 transition-colors">
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={(e) => setIsGiftWrap(e.target.checked)}
                  className="mt-0.5 rounded text-neutral-900 focus:ring-black"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-medium text-neutral-900">
                    <span className="flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Heritage Handloom Mulmul Potli & Handmade Paper Card</span>
                    </span>
                    <span className="font-mono font-semibold">+₹149</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Includes reusable organic cotton bag, brass bell trinket, and handwritten gift calligraphy note.
                  </p>
                </div>
              </label>

              {/* Special Note */}
              <div>
                <label className="block text-xs text-neutral-600 mb-1.5 font-medium">
                  Delivery instructions or gift note (optional):
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Please call before delivery or write: 'Wishing you joyous celebrations...'"
                  rows={2}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded p-3 text-xs outline-none focus:border-black focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Saved for Later Section */}
            {savedItems.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-neutral-500" />
                  <span>Saved for Later ({savedItems.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedItems.map((saved) => (
                    <div
                      key={saved.id}
                      className="bg-white p-3.5 rounded border border-neutral-200 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={saved.product.image}
                          alt={saved.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="truncate">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {saved.product.name}
                          </p>
                          <p className="text-xs font-mono tabular-nums text-neutral-600 mt-0.5">
                            ₹{saved.product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => moveToCartFromSaved(saved.id)}
                          className="px-3 py-1.5 bg-[#191918] text-white text-xs rounded hover:bg-neutral-800 transition-colors"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => removeSavedItem(saved.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove saved item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Order Summary & Shipping Config (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded border border-neutral-200 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-serif font-semibold text-[#191918] pb-3 border-b border-neutral-200">
                Order Summary
              </h2>

              {/* Free Shipping Meter */}
              <div className="bg-neutral-50 p-3.5 rounded border border-neutral-200/80 text-xs">
                {amountNeededForFreeShipping > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-neutral-700">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Truck className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Pan-India Free Shipping</span>
                      </span>
                      <span className="font-mono tabular-nums text-neutral-800">
                        ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} away
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#191918] h-full transition-all duration-300 ease-out"
                        style={{ width: `${progressToFreeShipping}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Complimentary Shipping Unlocked!</span>
                  </div>
                )}
              </div>

              {/* Shipping Method Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                  Select Delivery Courier:
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3 rounded border text-xs cursor-pointer transition-colors ${
                      shippingMethod === 'standard'
                        ? 'border-[#191918] bg-neutral-50/80'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-semibold text-neutral-900">Standard Surface Delivery</div>
                        <div className="text-[11px] text-neutral-500">3–5 business days</div>
                      </div>
                    </div>
                    <div className="font-mono font-medium">
                      {subtotal >= freeShippingThreshold ? 'FREE' : '₹99'}
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded border text-xs cursor-pointer transition-colors ${
                      shippingMethod === 'express'
                        ? 'border-[#191918] bg-neutral-50/80'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-semibold text-neutral-900">Bluedart Priority Air</div>
                        <div className="text-[11px] text-neutral-500">1–2 business days</div>
                      </div>
                    </div>
                    <div className="font-mono font-medium">₹199</div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded border text-xs cursor-pointer transition-colors ${
                      shippingMethod === 'courier'
                        ? 'border-[#191918] bg-neutral-50/80'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'courier'}
                        onChange={() => setShippingMethod('courier')}
                        className="text-black focus:ring-black"
                      />
                      <div>
                        <div className="font-semibold text-neutral-900">Metro Express Courier</div>
                        <div className="text-[11px] text-neutral-500">Bengaluru, Mumbai, Delhi-NCR</div>
                      </div>
                    </div>
                    <div className="font-mono font-medium">₹349</div>
                  </label>
                </div>
              </div>

              {/* Promo Code Form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <div>
                        <span className="font-bold font-mono tracking-wider">{appliedPromo.code}</span>
                        <span className="text-[11px] text-emerald-700 ml-1.5">
                          (-₹{discount.toLocaleString('en-IN')})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-neutral-500 hover:text-rose-700 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError(null);
                        }}
                        placeholder="Coupon code (e.g. NAMASTE10)"
                        className="flex-1 bg-white border border-neutral-300 rounded px-3 py-2 text-xs outline-none focus:border-black uppercase placeholder:normal-case font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#191918] hover:bg-neutral-800 text-white text-xs rounded font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-rose-600">{promoError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-neutral-900 font-medium">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono tabular-nums font-medium">
                      -₹{discount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {isGiftWrap && (
                  <div className="flex justify-between text-neutral-700">
                    <span>Handloom Potli Packaging</span>
                    <span className="font-mono tabular-nums font-medium">+₹149</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping ({shippingMethod})</span>
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

              {/* Checkout CTA */}
              <button
                onClick={() => setActiveView('checkout')}
                className="w-full py-3.5 px-4 bg-[#191918] hover:bg-neutral-800 text-white rounded text-xs uppercase tracking-wider font-medium transition-colors shadow-sm flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust markers */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>100% Artisan Direct</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                  <span>15-day craft exchange</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

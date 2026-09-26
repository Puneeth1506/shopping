import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Bookmark,
  ArrowRight,
  Truck,
  CheckCircle2,
  Tag,
  ShoppingBag,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    savedItems,
    isCartOpen,
    setIsCartOpen,
    totalItemsCount,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    amountNeededForFreeShipping,
    progressToFreeShipping,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCartFromSaved,
    removeSavedItem,
    appliedPromo,
    applyPromo,
    removePromo,
    setActiveView,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [showSavedItems, setShowSavedItems] = useState(false);

  if (!isCartOpen) return null;

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

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
  };

  const handleGoToFullCart = () => {
    setIsCartOpen(false);
    setActiveView('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-neutral-800" />
              <h2 className="font-serif text-lg font-semibold tracking-wide text-[#191918]">
                Shopping Bag
              </h2>
              <span className="text-xs font-mono text-neutral-500 tabular-nums">
                ({totalItemsCount})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black rounded transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (₹1,499 threshold) */}
          <div className="px-5 py-3.5 bg-neutral-100/80 border-b border-neutral-200/80 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Pan-India Free Delivery</span>
                  </span>
                  <span className="font-mono tabular-nums text-neutral-800">
                    Add <strong className="text-black font-semibold">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more
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
                <span>You've unlocked complimentary Pan-India shipping!</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-200/60 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="font-serif text-base text-neutral-700 font-medium">
                  Your shopping bag is currently empty
                </p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore master brassware from Kumbakonam, hand-quilted mulmul razais, and teak acoustics.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-block px-5 py-2 text-xs uppercase tracking-wider bg-[#191918] text-white rounded hover:bg-neutral-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-neutral-200/80">
                {cart.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-neutral-200 rounded shrink-0 overflow-hidden relative border border-neutral-200/80">
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

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-semibold text-[#191918] leading-tight">
                            {item.product.name}
                          </h4>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {item.selectedColor && <span>{item.selectedColor}</span>}
                            {item.selectedColor && item.selectedSize && <span> · </span>}
                            {item.selectedSize && <span>{item.selectedSize}</span>}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-mono font-semibold tabular-nums text-[#191918]">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-neutral-400 font-mono">
                              ₹{item.product.price.toLocaleString('en-IN')} each
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stepper & Secondary Actions */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-neutral-300 rounded bg-white text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-neutral-600 hover:text-black transition-colors"
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-medium tabular-nums text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stockCount}
                            className="px-2 py-1 text-neutral-600 hover:text-black disabled:opacity-30 transition-colors"
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="hover:text-black transition-colors flex items-center gap-1"
                            title="Save for later"
                          >
                            <Bookmark className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="hover:text-rose-600 transition-colors p-1"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Saved for later toggle */}
            {savedItems.length > 0 && (
              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={() => setShowSavedItems(!showSavedItems)}
                  className="w-full flex items-center justify-between text-xs text-neutral-700 font-medium py-2 hover:text-black"
                >
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved for Later ({savedItems.length})</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 underline">
                    {showSavedItems ? 'Hide' : 'View'}
                  </span>
                </button>

                {showSavedItems && (
                  <div className="mt-3 space-y-3 bg-white p-3 rounded border border-neutral-200/80">
                    {savedItems.map((saved) => (
                      <div key={saved.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={saved.product.image}
                            alt={saved.product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded shrink-0 bg-neutral-100"
                          />
                          <div className="truncate">
                            <p className="font-semibold text-neutral-900 truncate">{saved.product.name}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">₹{saved.product.price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => moveToCartFromSaved(saved.id)}
                            className="text-[11px] px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded font-medium transition-colors"
                          >
                            Move to Bag
                          </button>
                          <button
                            onClick={() => removeSavedItem(saved.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1"
                            aria-label="Remove saved item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Promo Code Input */}
            {cart.length > 0 && (
              <div className="pt-2">
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
                        className="flex-1 bg-white border border-neutral-300 rounded px-3 py-1.5 text-xs outline-none focus:border-black uppercase placeholder:normal-case font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs rounded font-medium transition-colors"
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
            )}
          </div>

          {/* Footer & Checkout Total Breakdown */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-neutral-200 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
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

                <div className="flex justify-between">
                  <span>Pan-India Shipping</span>
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

                <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm font-semibold text-[#191918]">
                  <span>Total Amount Due</span>
                  <span className="text-base font-mono tabular-nums">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3 px-4 bg-[#191918] hover:bg-neutral-800 text-white rounded text-xs font-medium uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Checkout · UPI / Cards / COD</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleGoToFullCart}
                  className="w-full py-2 text-xs font-medium text-neutral-600 hover:text-black transition-colors text-center"
                >
                  View Full Cart & Edit Details
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

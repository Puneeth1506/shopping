import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Check, ShoppingBag, ShieldCheck, RefreshCw, Truck, MapPin } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForModal, setSelectedProductForModal, addToCart, setIsCartOpen } = useCart();
  const product = selectedProductForModal;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.availableColors?.[0]?.name
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.availableSizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  
  // Indian Pincode Delivery Checker
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedProductForModal(null);
      setIsCartOpen(true);
    }, 450);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus('Delivery available in 2–3 business days with Bluedart Priority. Cash on Delivery supported.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-500 hover:text-black bg-white/80 backdrop-blur-md rounded-full border border-neutral-200 transition-colors"
          aria-label="Close product view"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery / Image Stage */}
          <div className="relative aspect-square md:aspect-auto bg-[#F4F2EE] flex items-center justify-center p-6 md:p-8 border-b md:border-b-0 md:border-r border-neutral-200">
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: product.fallbackBg }}
            />
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="relative z-10 w-full max-h-[380px] object-contain rounded"
            />
            {product.tag && (
              <div className="absolute top-4 left-4 z-20 bg-white/95 px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase text-neutral-800 border border-neutral-200">
                {product.tag}
              </div>
            )}
          </div>

          {/* Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category, Origin & Status */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                <span>{product.craftOrigin}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">{product.stockCount} units available</span>
              </div>

              <h2 className="text-2xl font-serif font-semibold text-[#191918] mb-2 leading-tight">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-neutral-100">
                <span className="text-2xl font-mono tabular-nums font-semibold text-[#191918]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono tabular-nums text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-neutral-500 font-normal">
                  (Inclusive of all taxes & GST)
                </span>
                <div className="ml-auto text-xs text-neutral-600 flex items-center gap-1 font-mono">
                  <span className="text-amber-500">★</span>
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-neutral-400">({product.reviewCount})</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-normal">
                {product.description}
              </p>

              {/* Color Swatches if available */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                    Craft Finish: <span className="font-normal text-neutral-500">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.availableColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          selectedColor === c.name
                            ? 'border-[#191918] scale-110 shadow-xs'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={`Select ${c.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options if available */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                    Size / Volume:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                          selectedSize === s
                            ? 'bg-[#191918] text-white border-[#191918]'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Indian Pincode Delivery Check */}
              <div className="mb-6 p-3 bg-neutral-50 rounded border border-neutral-200/80">
                <form onSubmit={handleCheckPincode} className="space-y-1.5">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700">
                    Check Pan-India Delivery & COD
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value);
                        setPincodeStatus(null);
                      }}
                      placeholder="e.g. 560038 or 400050"
                      className="flex-1 bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs outline-none focus:border-black font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#191918] text-white text-xs rounded hover:bg-neutral-800 transition-colors"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeStatus && (
                    <p className={`text-[11px] leading-tight ${pincodeStatus.includes('valid') ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {pincodeStatus}
                    </p>
                  )}
                </form>
              </div>

              {/* Technical Specifications */}
              <div className="mb-6 bg-neutral-50 p-3.5 rounded border border-neutral-100">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-600 mb-2">
                  Artisanal Specifications
                </div>
                <div className="space-y-1.5 text-xs">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-neutral-600">
                      <span className="text-neutral-500">{spec.label}</span>
                      <span className="font-medium text-neutral-800 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-300 rounded bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-neutral-600 hover:text-black disabled:opacity-30 text-sm font-medium"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    disabled={quantity >= product.stockCount}
                    className="px-3 py-2 text-neutral-600 hover:text-black disabled:opacity-30 text-sm font-medium"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add To Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={addedSuccess}
                  className="flex-1 py-3 px-4 bg-[#191918] hover:bg-neutral-800 text-white rounded text-xs font-medium uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Free transit &gt; ₹1,499
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> 15-day artisanal exchange
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

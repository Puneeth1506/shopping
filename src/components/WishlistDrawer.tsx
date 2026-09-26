import React from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  Truck,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    setSelectedProductForModal,
    openTrackingForOrder,
    setIsCartOpen,
  } = useCart();

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (product: any) => {
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  const handleTrackProduct = (productName: string) => {
    setIsWishlistOpen(false);
    openTrackingForOrder(productName);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600 fill-current" />
              <h2 className="font-serif text-lg font-semibold tracking-wide text-[#191918]">
                Personal Wishlist Collection
              </h2>
              <span className="text-xs font-mono text-neutral-500 tabular-nums">
                ({wishlist.length})
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black rounded transition-colors"
              aria-label="Close wishlist drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader info strip */}
          <div className="px-5 py-2.5 bg-neutral-100/90 border-b border-neutral-200/80 text-[11px] text-neutral-600 flex items-center justify-between">
            <span>Saved to your browser storage</span>
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-neutral-400 hover:text-rose-600 underline transition-colors"
              >
                Clear Collection
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400">
                  <Heart className="w-6 h-6" />
                </div>
                <p className="font-serif text-base text-neutral-800 font-semibold">
                  Your collection is currently empty
                </p>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Click the heart icon on any handcrafted piece in our catalog to save it to your personal wishlist.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-3 inline-block px-5 py-2 text-xs uppercase tracking-wider bg-[#191918] text-white rounded hover:bg-neutral-800 transition-colors"
                >
                  Explore Master Works
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-neutral-200/80">
                {wishlist.map((product) => (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                    {/* Thumbnail */}
                    <div
                      onClick={() => {
                        setSelectedProductForModal(product);
                        setIsWishlistOpen(false);
                      }}
                      className="w-20 h-20 bg-neutral-200 rounded shrink-0 overflow-hidden relative border border-neutral-200/80 cursor-pointer group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4
                            onClick={() => {
                              setSelectedProductForModal(product);
                              setIsWishlistOpen(false);
                            }}
                            className="text-xs font-semibold text-[#191918] leading-tight hover:underline cursor-pointer"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-neutral-400 hover:text-rose-600 p-0.5 ml-1 transition-colors"
                            aria-label={`Remove ${product.name} from wishlist`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          <span>{product.craftOrigin}</span>
                        </div>

                        <div className="text-xs font-mono font-bold text-neutral-900 mt-1 tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleMoveToBag(product)}
                          className="flex-1 py-1.5 px-3 bg-[#191918] hover:bg-neutral-800 text-white text-[11px] font-medium rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>

                        <button
                          onClick={() => handleTrackProduct(product.name)}
                          className="py-1.5 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium rounded transition-colors flex items-center gap-1"
                          title="Track delivery status for this product"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 bg-white border-t border-neutral-200">
              <button
                onClick={() => {
                  wishlist.forEach((p) => addToCart(p, 1));
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 bg-[#191918] hover:bg-neutral-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Add All {wishlist.length} Items to Bag</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductForModal } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => setSelectedProductForModal(product)}
      className="group cursor-pointer flex flex-col bg-white border border-neutral-200/70 rounded hover:border-neutral-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out overflow-hidden"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F2EE] flex items-center justify-center">
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: product.fallbackBg }}
        />

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`relative z-10 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Quiet editorial tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase text-neutral-800 border border-neutral-200/80 shadow-xs">
            {product.tag}
          </div>
        )}

        {/* Hover Quick Actions Bar */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded tracking-wide transition-all shadow-md ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#191918] hover:bg-neutral-800 text-white'
            }`}
            aria-label={`Quick add ${product.name} to bag`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            className="p-2 bg-white/95 hover:bg-white text-neutral-800 rounded shadow-md border border-neutral-200 transition-colors"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content & Metadata Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
            <span>{product.craftOrigin}</span>
            <span aria-hidden="true">·</span>
            <span>{product.stockCount} units</span>
          </div>

          <h3 className="text-[15px] font-semibold text-[#191918] group-hover:text-black transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Ratings Row */}
        <div className="pt-2 border-t border-neutral-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold font-mono tabular-nums text-[#191918]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-mono tabular-nums text-neutral-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono tabular-nums">
            <span className="text-amber-500">★</span>
            <span className="text-neutral-700 font-medium">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
};

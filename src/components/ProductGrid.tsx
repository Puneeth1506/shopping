import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

const CATEGORIES = ['All', 'Brassware', 'Textiles', 'Ceramics', 'Acoustic', 'Copperware'];

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onClearSearch,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.craftOrigin.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-4 border-b border-neutral-200">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold mb-1">
            Artisanal Guilds Catalog
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#191918]">
            Selected Works & Rare Editions
          </h2>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100/90 rounded border border-neutral-200/80 overflow-x-auto max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#191918] text-[#FAF9F5] shadow-xs'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-200/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 bg-white border border-neutral-200/80 rounded px-2.5 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-neutral-800 outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Feedback Indicator */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between bg-neutral-100 px-4 py-2.5 rounded text-xs text-neutral-700">
          <span>
            Showing results for <span className="font-semibold text-black">"{searchQuery}"</span> ({filteredProducts.length} items)
          </span>
          <button
            onClick={onClearSearch}
            className="text-neutral-500 hover:text-black underline font-medium"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded border border-neutral-200 p-8 max-w-md mx-auto">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-semibold text-neutral-800 mb-1">
            No matching craft pieces found
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Try adjusting your search criteria or switching categories.
          </p>
          <button
            onClick={() => {
              onCategoryChange('All');
              onClearSearch();
            }}
            className="px-4 py-2 bg-[#191918] text-white text-xs rounded hover:bg-neutral-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};

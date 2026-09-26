import React, { useState } from 'react';
import { CUSTOMER_STORIES } from '../data/products';
import { CustomerStory } from '../types';
import { CheckCircle2, Star, Quote, MapPin, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

export const CustomerStories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredStories = selectedCategory === 'All'
    ? CUSTOMER_STORIES
    : CUSTOMER_STORIES.filter((s) => {
        if (selectedCategory === 'Kitchen & Kaapi') {
          return s.productName.includes('Coffee') || s.productName.includes('Copper') || s.productName.includes('Terracotta');
        }
        if (selectedCategory === 'Textiles') {
          return s.productName.includes('Razai') || s.productName.includes('Mulmul');
        }
        if (selectedCategory === 'Living & Audio') {
          return s.productName.includes('Speaker') || s.productName.includes('Incense');
        }
        return true;
      });

  return (
    <section id="customer-stories" className="bg-[#F6F4EE] border-y border-neutral-200/80 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Quantitative Rigor */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-neutral-200">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Patron Experiences · Social Proof</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#191918] tracking-tight">
              Customer Stories from Indian Homes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl font-normal leading-relaxed">
              Read uncensored feedback from architects, homemakers, and craft purists across 48 Indian cities who have welcomed Vanya pieces into their daily living.
            </p>
          </div>

          {/* Quantitative Proof Strip */}
          <div className="flex items-center gap-6 sm:gap-8 bg-white/80 backdrop-blur-xs px-5 py-3 rounded border border-neutral-200/90 text-xs">
            <div>
              <div className="flex items-center gap-1 text-neutral-900 font-bold font-mono text-base tabular-nums">
                <span>4.94</span>
                <span className="text-amber-500 text-xs">★</span>
              </div>
              <div className="text-[11px] text-neutral-500">2,400+ Verified Reviews</div>
            </div>
            <div className="h-7 w-[1px] bg-neutral-200" />
            <div>
              <div className="text-neutral-900 font-bold font-mono text-base tabular-nums">
                98.6%
              </div>
              <div className="text-[11px] text-neutral-500">Damage-Free Transit</div>
            </div>
            <div className="h-7 w-[1px] bg-neutral-200" />
            <div>
              <div className="text-neutral-900 font-bold font-mono text-base tabular-nums">
                48 Cities
              </div>
              <div className="text-[11px] text-neutral-500">Pan-India Courier Network</div>
            </div>
          </div>
        </div>

        {/* Story Category Tabs (Functional buttons) */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {['All', 'Kitchen & Kaapi', 'Textiles', 'Living & Audio'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#191918] text-[#FAF9F5] shadow-xs'
                  : 'bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              {/* Top Row: Product, Stars, Tag */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-[11px] font-mono text-neutral-500 ml-1.5">
                      5.0 Verified Purchase
                    </span>
                  </div>

                  {/* Clean unboxed tag */}
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#8C7A6B]">
                    {story.highlightTag}
                  </span>
                </div>

                {/* Editorial Headline */}
                <h3 className="font-serif text-lg font-semibold text-[#191918] leading-snug">
                  {story.headline}
                </h3>

                {/* Full Review Text */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  {story.review}
                </p>
              </div>

              {/* Bottom Row: Customer Identity & Product Attributed */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {story.avatar ? (
                    <img
                      src={story.avatar}
                      alt={story.author}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#EAE5DC] text-[#191918] font-serif font-semibold text-sm flex items-center justify-center shrink-0">
                      {story.author.charAt(0)}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-neutral-900">
                        {story.author}
                      </span>
                      {story.verifiedBuyer && (
                        <span title="Verified Customer" className="inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>{story.city}, {story.state}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-neutral-500 max-w-[160px] truncate">
                  <span className="text-neutral-400 block text-[10px] uppercase">Purchased</span>
                  <span className="font-medium text-neutral-800 truncate block">
                    {story.productName}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Artisan Direct Commitment Banner */}
        <div className="mt-12 bg-white rounded p-6 sm:p-8 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-neutral-200 flex items-center justify-center text-[#8C7A6B] shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-semibold text-neutral-900">
                100% Artisan Direct — Preserving Indian Craft Guilds
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
                72% of every rupee spent goes directly to generational clusters in Kumbakonam, Sanganer, Bhuj, and Bastar. No middlemen, no machine counterfeit duplicates.
              </p>
            </div>
          </div>

          <a
            href="#collection"
            className="px-5 py-2.5 bg-[#191918] hover:bg-neutral-800 text-[#FAF9F5] rounded text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-colors"
          >
            Explore Master Works
          </a>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { HERO_IMAGE } from '../data/products';
import { ArrowDown, MessageSquareQuote, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onStoriesClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onStoriesClick }) => {
  return (
    <section className="relative border-b border-neutral-200/80 overflow-hidden bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Refined Editorial Indian Heritage Copy */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold">
              Heritage Craft Guilds of India · 2026 Edition
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#191918] leading-[1.1] tracking-tight [text-wrap:balance]">
              Heirloom crafts engineered for contemporary living.
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg font-normal">
              Heavy virgin brassware from Kumbakonam, hand-quilted Sanganer mulmul throws, and acoustics encased in Nilgiri plantation teak. Direct from generational artisan clusters to your doorstep.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={onExploreClick}
                className="bg-[#191918] hover:bg-neutral-800 text-[#FAF9F5] px-6 py-3 rounded text-xs uppercase tracking-wider font-medium transition-colors shadow-sm flex items-center gap-2 group"
              >
                <span>Explore Catalog</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onStoriesClick}
                className="bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 px-5 py-3 rounded text-xs uppercase tracking-wider font-medium transition-colors shadow-xs flex items-center gap-2"
              >
                <MessageSquareQuote className="w-4 h-4 text-[#8C7A6B]" />
                <span>Customer Stories</span>
              </button>
            </div>

            {/* Adjacency Proof Strip */}
            <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-3 gap-4 text-xs text-neutral-600">
              <div className="flex flex-col gap-1">
                <span className="font-mono tabular-nums text-sm font-semibold text-[#191918]">100% Pure</span>
                <span className="text-[11px] leading-snug">Virgin brass & organic mulmul</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono tabular-nums text-sm font-semibold text-[#191918]">Pan-India</span>
                <span className="text-[11px] leading-snug">Safe transit across 48 cities</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono tabular-nums text-sm font-semibold text-[#191918]">COD / UPI</span>
                <span className="text-[11px] leading-snug">Instant 1-click & Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor with Fallback */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded bg-[#ECE7DE] shadow-md">
              <img
                src={HERO_IMAGE}
                alt="Contemporary Indian living room featuring teak wood credenza, brass urli, and Jaipur hand-block printed textiles"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700 ease-out"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {/* Quiet editorial vignette badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded text-[11px] text-neutral-800 tracking-wide border border-neutral-200/60 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Craft Cluster Archive · Curated in Bengaluru</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

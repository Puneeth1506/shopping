import React, { useState } from 'react';
import { ArrowRight, Check, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="bg-[#141413] text-[#FAF9F5] pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-neutral-800/80">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-2xl uppercase tracking-[0.18em] font-bold text-white">
              Vanya
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Dedicated to the preservation and contemporary elevation of Indian craft guilds. Sourcing directly from generational artisan clusters in Kumbakonam, Sanganer, Bhuj, Wayanad, and Bastar.
            </p>
            <div className="text-[11px] text-neutral-500 font-mono pt-2">
              Bengaluru Studio · Jaipur Workshop · Wayanad Guild
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
              Heritage Guilds
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#collection" className="hover:text-white transition-colors">Kumbakonam Brassware</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Jaipur Mulmul Blockprints</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Kutch Earthen Terracotta</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Bastar Dhokra Cast Bronze</a></li>
              <li><a href="#collection" className="hover:text-white transition-colors">Nilgiri Teak Acoustics</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
              Pan-India Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><a href="#customer-stories" className="hover:text-white transition-colors">Customer Stories (2,400+)</a></li>
              <li><span className="text-neutral-400">Free Pan-India Delivery &gt; ₹1,499</span></li>
              <li><span className="text-neutral-400">Cash on Delivery & Instant UPI</span></li>
              <li><span className="text-neutral-400">15-Day Safe Exchange Guarantee</span></li>
              <li><span className="text-neutral-400">100% Zero Single-Use Plastics</span></li>
            </ul>
          </div>

          {/* Newsletter / Journal dispatch */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
              Artisan Dispatches & Rare Firings
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Receive notifications on seasonal pit firings, limited brass casting runs, and special festive releases.
            </p>
            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for craft updates"
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-neutral-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-200 text-xs font-medium rounded transition-colors flex items-center justify-center shrink-0"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 mt-1">Thank you. You are subscribed to Vanya Artisan Dispatches.</p>
              )}
            </form>
          </div>

        </div>

        {/* Footer Base Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span>Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>in India · © {new Date().getFullYear()} Vanya Living & Crafts Pvt. Ltd.</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-neutral-300 cursor-pointer">GST Compliance</span>
            <span className="hover:text-neutral-300 cursor-pointer">Artisan Transparency</span>
            <span className="hover:text-neutral-300 cursor-pointer">Shipping & Returns</span>
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

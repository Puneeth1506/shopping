import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, X, Menu, ShieldCheck, Heart } from 'lucide-react';

interface NavbarProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onCategorySelect?: (cat: string) => void;
  onStoriesClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchQuery,
  onCategorySelect,
  onStoriesClick,
}) => {
  const {
    totalItemsCount,
    subtotal,
    setIsCartOpen,
    setActiveView,
    activeView,
    openTrackingForOrder,
    wishlistCount,
    setIsWishlistOpen,
  } = useCart();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (categoryName?: string) => {
    setActiveView('shop');
    if (categoryName && onCategorySelect) {
      onCategorySelect(categoryName);
    }
    setMobileMenuOpen(false);
  };

  const handleStoriesNav = () => {
    setActiveView('shop');
    setMobileMenuOpen(false);
    if (onStoriesClick) {
      onStoriesClick();
    } else {
      const el = document.getElementById('customer-stories');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      {/* Indian E-Commerce Promotional Ribbon */}
      <div className="bg-[#191918] text-[#FAF9F5] py-1.5 px-4 text-center text-[11px] font-medium tracking-wider uppercase flex items-center justify-center gap-2">
        <span>Complimentary Pan-India Delivery On Orders Over ₹1,499</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span className="opacity-80">Cash on Delivery & Instant UPI Available</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span className="text-[#E0A865] font-semibold">Code: NAMASTE10</span>
      </div>

      {/* Strict 1-row, 3-zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-800 p-1 hover:text-black focus-visible:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => handleNavClick()}
            className="text-xl sm:text-2xl font-serif tracking-[0.18em] uppercase font-bold text-[#191918] hover:opacity-85 transition-opacity"
          >
            Vanya
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-[12px] font-medium tracking-wider uppercase text-neutral-600">
          <button
            onClick={() => handleNavClick()}
            className={`hover:text-[#191918] transition-colors py-1 ${activeView === 'shop' && !searchQuery ? 'text-[#191918] font-semibold' : ''}`}
          >
            All Works
          </button>
          <button
            onClick={() => handleNavClick('Brassware')}
            className="hover:text-[#191918] transition-colors py-1"
          >
            Brassware
          </button>
          <button
            onClick={() => handleNavClick('Textiles')}
            className="hover:text-[#191918] transition-colors py-1"
          >
            Jaipur Textiles
          </button>
          <button
            onClick={() => handleNavClick('Ceramics')}
            className="hover:text-[#191918] transition-colors py-1"
          >
            Earthenware
          </button>
          <button
            onClick={() => handleNavClick('Acoustic')}
            className="hover:text-[#191918] transition-colors py-1"
          >
            Teak Acoustics
          </button>
          <button
            onClick={handleStoriesNav}
            className="hover:text-[#191918] transition-colors py-1 text-[#8C7A6B] font-semibold"
          >
            Customer Stories
          </button>
          <button
            onClick={() => {
              openTrackingForOrder();
              setMobileMenuOpen(false);
            }}
            className={`hover:text-[#191918] transition-colors py-1 flex items-center gap-1 ${
              activeView === 'tracking' ? 'text-[#191918] font-bold underline underline-offset-4' : ''
            }`}
          >
            <span>Track Order</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Interactive Search toggle */}
          {showSearchInput ? (
            <div className="flex items-center bg-white border border-neutral-300 rounded px-2.5 py-1 text-xs shadow-sm animate-in fade-in duration-150">
              <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search brassware, quilts, chai..."
                className="w-32 sm:w-48 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400 text-xs"
                autoFocus
              />
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchInput(false);
                }}
                className="text-neutral-400 hover:text-neutral-700 ml-1 p-0.5"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="text-neutral-700 hover:text-black p-2 rounded transition-colors focus-visible:outline-none"
              aria-label="Open search input"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Wishlist Heart Action */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-neutral-700 hover:text-rose-600 rounded transition-colors focus-visible:outline-none"
            aria-label={`View personal wishlist, ${wishlistCount} items`}
            title="Personal Wishlist Collection"
          >
            <Heart className={`w-4 h-4 transition-colors ${wishlistCount > 0 ? 'text-rose-600 fill-current' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Direct Cart Bag Action */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-[#191918] text-[#FAF9F5] hover:bg-neutral-800 transition-colors px-3.5 py-2 rounded text-xs font-medium tracking-wide whitespace-nowrap shadow-sm group"
            aria-label={`Open shopping bag, ${totalItemsCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D19B53] text-[#191918] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums font-mono text-[11px] opacity-90 border-l border-neutral-700 pl-2">
              ₹{subtotal.toLocaleString('en-IN')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-[#FAF9F5] px-6 py-4 flex flex-col gap-3 text-sm font-medium animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick()}
            className="text-left py-1 text-neutral-800 hover:text-black"
          >
            All Works
          </button>
          <button
            onClick={() => handleNavClick('Brassware')}
            className="text-left py-1 text-neutral-800 hover:text-black"
          >
            Brassware (Kumbakonam & Bastar)
          </button>
          <button
            onClick={() => handleNavClick('Textiles')}
            className="text-left py-1 text-neutral-800 hover:text-black"
          >
            Jaipur Block-Print Textiles
          </button>
          <button
            onClick={() => handleNavClick('Ceramics')}
            className="text-left py-1 text-neutral-800 hover:text-black"
          >
            Kutch Earthenware
          </button>
          <button
            onClick={() => handleNavClick('Acoustic')}
            className="text-left py-1 text-neutral-800 hover:text-black"
          >
            Nilgiri Teak Acoustics
          </button>
          <button
            onClick={handleStoriesNav}
            className="text-left py-1 text-[#8C7A6B] font-semibold"
          >
            Customer Stories & Reviews
          </button>
          <button
            onClick={() => {
              openTrackingForOrder();
              setMobileMenuOpen(false);
            }}
            className="text-left py-1 text-neutral-800 hover:text-black font-semibold flex items-center gap-1.5"
          >
            <span>Track Order (AWB / Bluedart / Delhivery)</span>
          </button>
        </div>
      )}
    </header>
  );
};

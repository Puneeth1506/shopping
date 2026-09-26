/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { CustomerStories } from './components/CustomerStories';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { FullCartPage } from './components/FullCartPage';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setActiveView('shop');
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStoriesClick = () => {
    setActiveView('shop');
    setTimeout(() => {
      const el = document.getElementById('customer-stories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#191918]">
      {/* Strict 1-row, 3-zone Top Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCategorySelect={handleCategorySelect}
        onStoriesClick={handleStoriesClick}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'shop' && (
          <>
            <HeroSection
              onExploreClick={handleExploreClick}
              onStoriesClick={handleStoriesClick}
            />
            <ProductGrid
              products={PRODUCTS}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
            {/* Customer Stories & Testimonials Social Proof Section */}
            <CustomerStories />
          </>
        )}

        {activeView === 'cart' && <FullCartPage />}
        {activeView === 'checkout' && <CheckoutModal />}
        {activeView === 'confirmation' && <OrderConfirmationModal />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Product Quick View / Detail Modal */}
      <ProductDetailModal />

      {/* Responsive Toast Feedback */}
      <ToastContainer />

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

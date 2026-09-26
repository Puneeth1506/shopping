import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, SavedItem, PromoCode, OrderSummary, OrderCustomer } from '../types';
import { PRODUCTS, PROMO_CODES } from '../data/products';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CartContextType {
  cart: CartItem[];
  savedItems: SavedItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeView: 'shop' | 'cart' | 'checkout' | 'confirmation' | 'tracking';
  setActiveView: (view: 'shop' | 'cart' | 'checkout' | 'confirmation' | 'tracking') => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  openTrackingForOrder: (idOrProductName?: string) => void;
  
  // Wishlist Feature
  wishlist: Product[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  
  // Save for later
  saveForLater: (itemId: string) => void;
  moveToCartFromSaved: (savedId: string) => void;
  removeSavedItem: (savedId: string) => void;
  
  // Promo code
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  
  // Options
  shippingMethod: 'standard' | 'express' | 'courier';
  setShippingMethod: (method: 'standard' | 'express' | 'courier') => void;
  isGiftWrap: boolean;
  setIsGiftWrap: (wrap: boolean) => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  
  // Computations
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  progressToFreeShipping: number;
  tax: number;
  total: number;
  
  // Checkout & Orders
  orderHistory: OrderSummary[];
  lastCompletedOrder: OrderSummary | null;
  placeOrder: (customer: OrderCustomer) => Promise<OrderSummary>;
  
  // Product Detail Modal
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (product: Product | null) => void;
  
  // Notifications
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'vanya_indian_cart_v2';
const SAVED_STORAGE_KEY = 'vanya_indian_saved_v2';
const ORDER_STORAGE_KEY = 'vanya_indian_last_order_v2';
const ORDER_HISTORY_KEY = 'vanya_indian_order_history_v2';
const WISHLIST_STORAGE_KEY = 'vanya_indian_wishlist_v2';

const DEMO_PLACED_ORDER: OrderSummary = {
  orderId: 'ORD-VAN-84920',
  items: [
    {
      id: `${PRODUCTS[0].id}-Traditional Polished Brass-Medium (350ml)`,
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: 'Traditional Polished Brass',
      selectedSize: 'Medium (350ml)',
    },
  ],
  subtotal: 2490,
  discount: 0,
  shippingCost: 0,
  shippingMethod: 'express',
  tax: 298,
  total: 2788,
  customer: {
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@gmail.com',
    phone: '9845012345',
    address: '42, 12th Main Road, HAL 2nd Stage, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    paymentMethod: 'upi',
    upiId: 'ananya@oksbi',
  },
  createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  estimatedDelivery: 'Today by 4:30 PM',
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Pre-populate with 2 realistic sample items so user immediately sees a rich cart!
    return [
      {
        id: `${PRODUCTS[0].id}-${PRODUCTS[0].availableColors?.[0].name || 'default'}`,
        product: PRODUCTS[0],
        quantity: 1,
        selectedColor: PRODUCTS[0].availableColors?.[0].name,
        selectedSize: PRODUCTS[0].availableSizes?.[0],
      },
      {
        id: `${PRODUCTS[2].id}-${PRODUCTS[2].availableColors?.[0].name || 'default'}`,
        product: PRODUCTS[2],
        quantity: 1,
        selectedColor: PRODUCTS[2].availableColors?.[0].name,
      }
    ];
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Wishlist state initialized from localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Pre-seed with 1 crafted piece so wishlist immediately feels alive!
    return [PRODUCTS[1]]; // Sanganer Botanical Indigo Mulmul Razai Throw
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<'shop' | 'cart' | 'checkout' | 'confirmation' | 'tracking'>('shop');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  const openTrackingForOrder = (idOrProductName?: string) => {
    if (idOrProductName) {
      setTrackingOrderId(idOrProductName);
    } else if (lastCompletedOrder) {
      setTrackingOrderId(lastCompletedOrder.orderId);
    }
    setActiveView('tracking');
    setIsCartOpen(false);
    setIsWishlistOpen(false);
  };
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'courier'>('standard');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderSummary[]>(() => {
    try {
      const saved = localStorage.getItem(ORDER_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [DEMO_PLACED_ORDER];
  });

  const [lastCompletedOrder, setLastCompletedOrder] = useState<OrderSummary | null>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_PLACED_ORDER;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync order history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orderHistory));
    } catch {
      // ignore
    }
  }, [orderHistory]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync saved items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
    } catch {
      // ignore
    }
  }, [savedItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Wishlist operations
  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from personal collection`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        addToast(`Added "${product.name}" to your wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const item = prev.find((p) => p.id === productId);
      if (item) {
        addToast(`Removed "${item.name}" from wishlist`, 'info');
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    addToast('Wishlist collection cleared', 'info');
  };

  const wishlistCount = wishlist.length;

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const chosenColor = color || (product.availableColors ? product.availableColors[0]?.name : undefined);
    const chosenSize = size || (product.availableSizes ? product.availableSizes[0] : undefined);
    const itemId = `${product.id}-${chosenColor || 'def'}-${chosenSize || 'def'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockCount) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          selectedColor: chosenColor,
          selectedSize: chosenSize,
        },
      ];
    });

    addToast(`Added "${product.name}" to shopping bag`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    if (item) {
      addToast(`Removed "${item.product.name}" from shopping bag`, 'info');
    }
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const clamped = Math.min(newQty, item.product.stockCount);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast('Shopping bag cleared', 'info');
  };

  // Save for later
  const saveForLater = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    // Remove from cart
    setCart((prev) => prev.filter((i) => i.id !== itemId));

    // Add to saved
    setSavedItems((prev) => {
      const exists = prev.find((s) => s.id === item.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: item.id,
          product: item.product,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          savedAt: Date.now(),
        },
      ];
    });

    addToast(`Moved "${item.product.name}" to saved items`, 'info');
  };

  const moveToCartFromSaved = (savedId: string) => {
    const saved = savedItems.find((s) => s.id === savedId);
    if (!saved) return;

    setSavedItems((prev) => prev.filter((s) => s.id !== savedId));
    addToCart(saved.product, 1, saved.selectedColor, saved.selectedSize);
  };

  const removeSavedItem = (savedId: string) => {
    setSavedItems((prev) => prev.filter((s) => s.id !== savedId));
    addToast('Removed from saved items', 'info');
  };

  // Promo Code Engine
  const applyPromo = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code === normalized);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try NAMASTE10 or VANYA500.' };
    }

    if (found.minSpend && subtotal < found.minSpend) {
      return {
        success: false,
        message: `Code ${found.code} requires a minimum order of ₹${found.minSpend.toLocaleString('en-IN')}.`,
      };
    }

    setAppliedPromo(found);
    addToast(`Promo coupon ${found.code} applied!`, 'success');
    return { success: true, message: `Applied: ${found.description}` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    addToast('Coupon code removed', 'info');
  };

  // Calculations
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedPromo) {
    if (!appliedPromo.minSpend || subtotal >= appliedPromo.minSpend) {
      if (appliedPromo.type === 'percentage') {
        discount = Math.round((subtotal * appliedPromo.value) / 100);
      } else {
        discount = Math.min(appliedPromo.value, subtotal);
      }
    }
  }

  // Free shipping threshold: ₹1499
  const freeShippingThreshold = 1499;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Shipping Fee in INR
  let shippingFee = 0;
  if (shippingMethod === 'standard') {
    shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  } else if (shippingMethod === 'express') {
    shippingFee = 199;
  } else if (shippingMethod === 'courier') {
    shippingFee = 349;
  }

  const giftWrapFee = isGiftWrap ? 149 : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.12); // 12% GST standard
  const total = Math.max(0, taxableAmount + shippingFee + giftWrapFee + tax);

  // Checkout submission
  const placeOrder = async (customer: OrderCustomer): Promise<OrderSummary> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-VAN-${randomSuffix}`;

    const now = new Date();
    const estDeliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const formattedEst = estDeliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const summary: OrderSummary = {
      orderId,
      items: [...cart],
      subtotal,
      discount,
      appliedPromoCode: appliedPromo?.code,
      shippingCost: shippingFee,
      shippingMethod,
      tax,
      total,
      customer,
      orderNote: orderNote || undefined,
      isGiftWrap,
      createdAt: now.toISOString(),
      estimatedDelivery: formattedEst,
    };

    setLastCompletedOrder(summary);
    setOrderHistory((prev) => [summary, ...prev.filter((o) => o.orderId !== summary.orderId)]);
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(summary));
    } catch {
      // ignore
    }

    // Reset active cart
    setCart([]);
    setAppliedPromo(null);
    setOrderNote('');
    setIsGiftWrap(false);
    setActiveView('confirmation');
    setIsCartOpen(false);

    addToast(`Order ${orderId} placed successfully!`, 'success');
    return summary;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        savedItems,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount,
        activeView,
        setActiveView,
        trackingOrderId,
        setTrackingOrderId,
        openTrackingForOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCartFromSaved,
        removeSavedItem,
        appliedPromo,
        applyPromo,
        removePromo,
        shippingMethod,
        setShippingMethod,
        isGiftWrap,
        setIsGiftWrap,
        orderNote,
        setOrderNote,
        totalItemsCount,
        subtotal,
        discount,
        shippingFee,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        progressToFreeShipping,
        tax,
        total,
        orderHistory,
        lastCompletedOrder,
        placeOrder,
        selectedProductForModal,
        setSelectedProductForModal,
        toasts,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

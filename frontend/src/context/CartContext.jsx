import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { toNumber } from '../utils/format';

/**
 * The cart, and the only place cart state lives.
 *
 * The app previously had two independent cart implementations: this context,
 * and a `utils/cart.js` module that wrote the same localStorage key directly.
 * The shop used the context, the cart and checkout pages used the utility, and
 * the navbar listened for a `cartUpdate` event while the context dispatched
 * `cartUpdated` — so the navbar badge never updated when an item was added.
 * There is now one reducer, one storage key and no custom events.
 */

const STORAGE_KEY = 'bluewell.cart';
const LEGACY_STORAGE_KEY = 'cart';
const MAX_QUANTITY = 99;

const CartContext = createContext(null);

function clampQuantity(quantity) {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
}

/** Keeps only the fields the cart needs, so stale product data is not cached. */
function toCartItem(product, quantity) {
  return {
    id: product.id,
    name: product.name,
    price: toNumber(product.price),
    image: product.image,
    category: product.category,
    quantity: clampQuantity(quantity),
  };
}

function readStoredCart() {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Corrupt or partial entries used to crash the cart page on render.
    return parsed
      .filter((item) => item && item.id != null)
      .map((item) => toCartItem(item, toNumber(item.quantity, 1) || 1));
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity = 1 } = action;
      const existing = state.find((item) => item.id === product.id);
      if (existing) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
            : item,
        );
      }
      return [...state, toCartItem(product, quantity)];
    }

    case 'setQuantity': {
      if (action.quantity < 1) return state.filter((item) => item.id !== action.id);
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: clampQuantity(action.quantity) } : item,
      );
    }

    case 'remove':
      return state.filter((item) => item.id !== action.id);

    case 'clear':
      return [];

    case 'replace':
      return action.items;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // A full or disabled storage quota must not break checkout.
    }
  }, [items]);

  // Keep the cart in step when the customer has the site open in two tabs.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key && event.key !== STORAGE_KEY) return;
      dispatch({ type: 'replace', items: readStoredCart() });
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addItem = useCallback((product, quantity = 1) => dispatch({ type: 'add', product, quantity }), []);
  const setQuantity = useCallback((id, quantity) => dispatch({ type: 'setQuantity', id, quantity }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(() => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const quantities = new Map(items.map((item) => [item.id, item.quantity]));

    return {
      items,
      count,
      subtotal,
      isEmpty: items.length === 0,
      maxQuantity: MAX_QUANTITY,
      quantityOf: (id) => quantities.get(id) ?? 0,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    };
  }, [items, addItem, setQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside a CartProvider');
  return context;
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "@/lib/types";

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  cartCount: number;
  getCartProductQuantity: (productId: string) => number;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "decotable-cart";
const WISHLIST_KEY = "decotable-wishlist";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_KEY);
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      addToCart(productId, quantity = 1) {
        setCart((current) => {
          const existing = current.find((item) => item.productId === productId);
          if (existing) {
            return current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [...current, { productId, quantity }];
        });
      },
      updateCartItem(productId, quantity) {
        setCart((current) =>
          current
            .map((item) => (item.productId === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeFromCart(productId) {
        setCart((current) => current.filter((item) => item.productId !== productId));
      },
      toggleWishlist(productId) {
        setWishlist((current) =>
          current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        );
      },
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      getCartProductQuantity(productId) {
        return cart.find((item) => item.productId === productId)?.quantity ?? 0;
      },
    }),
    [cart, wishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}

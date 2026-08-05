'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, volume: string, quantity?: number) => void;
  removeItem: (productId: string, volume: string) => void;
  updateQuantity: (productId: string, volume: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      addItem: (product, volume, quantity = 1) => {
        set(state => {
          const existingIndex = state.items.findIndex(
            item => item.product.id === product.id && item.selectedVolume === volume
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity, selectedVolume: volume }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, volume) => {
        set(state => ({
          items: state.items.filter(
            item => !(item.product.id === productId && item.selectedVolume === volume)
          ),
        }));
      },

      updateQuantity: (productId, volume, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, volume);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId && item.selectedVolume === volume
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'swiss-signature-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

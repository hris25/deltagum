import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Cart, CartItem, CartStore } from '@/types'
import { calculateCartTotal, calculateCartItemsCount } from '@/lib/utils'

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: initialCart,

      addItem: (newItem: Omit<CartItem, 'id'>) => {
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            (item) => item.productId === newItem.productId && item.variantId === newItem.variantId
          )

          let updatedItems: CartItem[]

          if (existingItemIndex >= 0) {
            // L'article existe déjà, augmenter la quantité
            updatedItems = state.cart.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          } else {
            // Nouvel article, l'ajouter avec un ID unique
            const newCartItem: CartItem = {
              ...newItem,
              id: `${newItem.productId}-${newItem.variantId}-${Date.now()}`,
            }
            updatedItems = [...state.cart.items, newCartItem]
          }

          const totalItems = calculateCartItemsCount(updatedItems)
          const totalAmount = calculateCartTotal(updatedItems)

          return {
            cart: {
              items: updatedItems,
              totalItems,
              totalAmount,
            },
          }
        })
      },

      removeItem: (itemId: string) => {
        set((state) => {
          const updatedItems = state.cart.items.filter((item) => item.id !== itemId)
          const totalItems = calculateCartItemsCount(updatedItems)
          const totalAmount = calculateCartTotal(updatedItems)

          return {
            cart: {
              items: updatedItems,
              totalItems,
              totalAmount,
            },
          }
        })
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => {
          const updatedItems = state.cart.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
          const totalItems = calculateCartItemsCount(updatedItems)
          const totalAmount = calculateCartTotal(updatedItems)

          return {
            cart: {
              items: updatedItems,
              totalItems,
              totalAmount,
            },
          }
        })
      },

      clearCart: () => {
        set({ cart: initialCart })
      },

      getTotalItems: () => {
        return get().cart.totalItems
      },

      getTotalAmount: () => {
        return get().cart.totalAmount
      },
    }),
    {
      name: 'deltagum-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }),
    }
  )
)

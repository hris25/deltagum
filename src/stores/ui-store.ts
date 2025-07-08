import { create } from 'zustand'

interface UIStore {
  // États des modales
  isCartOpen: boolean
  isMenuOpen: boolean
  isCheckoutOpen: boolean
  isAuthModalOpen: boolean
  
  // États de chargement
  isLoading: boolean
  loadingMessage: string
  
  // États de l'interface
  isMobile: boolean
  scrollY: number
  
  // Actions pour les modales
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  
  openCheckout: () => void
  closeCheckout: () => void
  
  openAuthModal: () => void
  closeAuthModal: () => void
  
  // Actions pour le chargement
  setLoading: (loading: boolean, message?: string) => void
  
  // Actions pour l'interface
  setIsMobile: (isMobile: boolean) => void
  setScrollY: (scrollY: number) => void
  
  // Action pour fermer toutes les modales
  closeAllModals: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  // États initiaux
  isCartOpen: false,
  isMenuOpen: false,
  isCheckoutOpen: false,
  isAuthModalOpen: false,
  isLoading: false,
  loadingMessage: '',
  isMobile: false,
  scrollY: 0,

  // Actions pour le panier
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  // Actions pour le menu
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  // Actions pour le checkout
  openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  // Actions pour l'authentification
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  // Actions pour le chargement
  setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),

  // Actions pour l'interface
  setIsMobile: (isMobile) => set({ isMobile }),
  setScrollY: (scrollY) => set({ scrollY }),

  // Fermer toutes les modales
  closeAllModals: () => set({
    isCartOpen: false,
    isMenuOpen: false,
    isCheckoutOpen: false,
    isAuthModalOpen: false,
  }),
}))

// Hook personnalisé pour l'UI
export const useUI = () => {
  const {
    isCartOpen,
    isMenuOpen,
    isCheckoutOpen,
    isAuthModalOpen,
    isLoading,
    loadingMessage,
    isMobile,
    scrollY,
    openCart,
    closeCart,
    toggleCart,
    openMenu,
    closeMenu,
    toggleMenu,
    openCheckout,
    closeCheckout,
    openAuthModal,
    closeAuthModal,
    setLoading,
    setIsMobile,
    setScrollY,
    closeAllModals,
  } = useUIStore()

  return {
    // États
    isCartOpen,
    isMenuOpen,
    isCheckoutOpen,
    isAuthModalOpen,
    isLoading,
    loadingMessage,
    isMobile,
    scrollY,
    
    // Actions
    openCart,
    closeCart,
    toggleCart,
    openMenu,
    closeMenu,
    toggleMenu,
    openCheckout,
    closeCheckout,
    openAuthModal,
    closeAuthModal,
    setLoading,
    setIsMobile,
    setScrollY,
    closeAllModals,
  }
}

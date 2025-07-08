import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Customer, CustomerStore } from '@/types'

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customer: null,
      loading: false,
      error: null,

      setCustomer: (customer: Customer) => {
        set({ customer, error: null })
      },

      updateCustomer: async (data: Partial<Customer>) => {
        const currentCustomer = get().customer
        if (!currentCustomer) {
          set({ error: 'Aucun client connecté' })
          return
        }

        set({ loading: true, error: null })

        try {
          const response = await fetch(`/api/customers/${currentCustomer.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const result = await response.json()

          if (result.success) {
            set({ 
              customer: result.data,
              loading: false 
            })
          } else {
            throw new Error(result.error || 'Erreur lors de la mise à jour')
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            loading: false 
          })
        }
      },

      clearCustomer: () => {
        set({ customer: null, error: null })
      },
    }),
    {
      name: 'deltagum-customer',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ customer: state.customer }),
    }
  )
)

// Hook personnalisé pour utiliser le store des clients
export const useCustomer = () => {
  const {
    customer,
    loading,
    error,
    setCustomer,
    updateCustomer,
    clearCustomer,
  } = useCustomerStore()

  return {
    customer,
    loading,
    error,
    setCustomer,
    updateCustomer,
    clearCustomer,
  }
}

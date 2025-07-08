import { useState, useEffect } from 'react'
import { UseLocalStorageReturn } from '@/types'
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '@/lib/utils'

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getFromLocalStorage(key, initialValue)
  })

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour avoir la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Sauvegarder l'état
      setStoredValue(valueToStore)
      
      // Sauvegarder dans localStorage
      setToLocalStorage(key, valueToStore)
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Fonction pour supprimer la valeur
  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      removeFromLocalStorage(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  // Écouter les changements dans localStorage (pour la synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return { value: storedValue, setValue, removeValue }
}

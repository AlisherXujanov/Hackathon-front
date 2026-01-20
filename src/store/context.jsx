// Store context for single-source-of-truth JSON data
import { createContext, useContext, useState, useEffect } from 'react'

const StoreContext = createContext()

export function StoreProvider({ children }) {
  const [store, setStore] = useState({
    user: null,
    classes: [],
    tasks: [],
    leaderboard: [],
    analytics: {},
  })

  // Load initial data from JSON files
  useEffect(() => {
    // This will be populated with actual JSON data loading logic
    // For now, it's a placeholder structure
  }, [])

  const updateStore = (key, value) => {
    setStore((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <StoreContext.Provider value={{ store, updateStore }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}

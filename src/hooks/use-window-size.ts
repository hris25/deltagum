import { useState, useEffect } from 'react'
import { throttle } from '@/lib/utils'

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 100)

    // Initialiser la taille
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

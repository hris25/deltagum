import { useState, useEffect } from 'react'
import { throttle } from '@/lib/utils'

interface ScrollPosition {
  x: number
  y: number
}

export function useScrollPosition(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const updatePosition = throttle(() => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset,
      })
    }, 100)

    window.addEventListener('scroll', updatePosition)
    updatePosition() // Initialiser la position

    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

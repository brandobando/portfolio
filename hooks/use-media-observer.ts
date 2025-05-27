"use client"

import { useState, useEffect, useRef } from "react"

interface UseMediaObserverProps {
  threshold?: number
  rootMargin?: string
}

export function useMediaObserver({ threshold = 0.1, rootMargin = "0px" }: UseMediaObserverProps = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element becomes visible
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once we've seen it, no need to observe anymore
          observer.unobserve(currentRef)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return { ref, isVisible, isLoaded, setIsLoaded }
}

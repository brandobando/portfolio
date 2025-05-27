"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface GifPlayerProps {
  src: string
  width?: number
  height?: number
}

export default function GifPlayer({ src, width, height }: GifPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt="Animated GIF"
        onLoad={handleImageLoad}
        className={cn(
          "w-full h-full object-cover",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100 transition-opacity duration-300",
        )}
      />
    </div>
  )
}

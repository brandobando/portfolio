"use client"

import { cn } from "@/lib/utils"

import { useRef, useEffect, useState } from "react"

interface VideoPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

export default function VideoPlayer({
  src,
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoaded = () => {
      setIsLoaded(true)
    }

    video.addEventListener("loadeddata", handleLoaded)

    return () => {
      video.removeEventListener("loadeddata", handleLoaded)
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        className={cn(
          "w-full h-full object-cover",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100 transition-opacity duration-300",
        )}
      />
    </div>
  )
}

// Helper functions for optimized media loading

// Preload critical media assets
export function preloadCriticalAssets(assets: string[]) {
  if (typeof window === "undefined") return

  assets.forEach((asset) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.href = asset

    // Set appropriate as attribute based on file extension
    if (asset.endsWith(".mp4")) {
      link.as = "video"
    } else if (asset.endsWith(".gif") || asset.endsWith(".png") || asset.endsWith(".jpg") || asset.endsWith(".jpeg")) {
      link.as = "image"
    }

    document.head.appendChild(link)
  })
}

// Determine if media should be lazy loaded based on viewport
export function shouldLazyLoad(elementPosition: number, viewportHeight: number) {
  if (typeof window === "undefined") return true

  const scrollPosition = window.scrollY
  const buffer = viewportHeight * 1.5 // Load when 1.5x viewport away

  return elementPosition > scrollPosition + buffer
}

// Get optimized video format based on browser support
export function getOptimizedVideoFormat() {
  if (typeof window === "undefined") return "mp4"

  const video = document.createElement("video")

  if (video.canPlayType("video/webm")) {
    return "webm"
  } else {
    return "mp4"
  }
}

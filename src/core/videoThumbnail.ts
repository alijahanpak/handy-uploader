import type { FileData } from '../types'
import { getMimeTypeFromExtension } from './fileUtils'

type VideoSource = Pick<FileData, 'name' | 'format' | 'base64'>

/** Builds a playable data URL for a stored video attachment. */
export function getVideoDataUrl(file: VideoSource): string {
  const cleanBase64 = file.base64?.replace(/^data:[^;]+;base64,/, '') || ''
  let mimeType: string
  if (file.format.startsWith('video/')) {
    mimeType = file.format
  } else {
    mimeType = getMimeTypeFromExtension(file.name)
    if (!mimeType.startsWith('video/')) mimeType = `video/${file.format}`
  }
  return `data:${mimeType};base64,${cleanBase64}`
}

/**
 * Captures a frame (at 1s or 10% of the duration, whichever is earlier) and returns
 * it as a JPEG data URL. Browser only.
 */
export function generateVideoThumbnail(file: VideoSource): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'
    video.muted = true

    video.onloadedmetadata = () => {
      if (video.duration === 0 || isNaN(video.duration)) {
        reject(new Error('Invalid video duration'))
        return
      }
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        reject(new Error('Invalid video dimensions'))
        return
      }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    video.onseeked = () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      } catch (error) {
        reject(error)
      }
    }

    video.onabort = () => reject(new Error('Video loading aborted'))
    video.onerror = () => reject(new Error('Video failed to load for thumbnail generation'))

    video.src = getVideoDataUrl(file)
  })
}

export interface VideoThumbnailCache {
  /** Returns the cached thumbnail, or starts generating it and returns undefined. */
  get(file: VideoSource): string | undefined
  /** Drops a cached thumbnail so the next get() regenerates it. */
  invalidate(file: VideoSource): void
}

/**
 * Caches generated thumbnails and de-duplicates in-flight work. `onUpdate` fires when a
 * thumbnail becomes available, so a UI layer can re-render (bump a Vue ref, set React
 * state, …). Failed generations are not cached, so they are retried on the next get().
 */
export function createVideoThumbnailCache(
  onUpdate: () => void,
  generate: (file: VideoSource) => Promise<string> = generateVideoThumbnail
): VideoThumbnailCache {
  const cache = new Map<string, string>()
  const pending = new Set<string>()
  const keyOf = (file: VideoSource) => `${file.name}_${file.base64?.substring(0, 50)}`

  return {
    get(file) {
      const key = keyOf(file)
      if (cache.has(key)) return cache.get(key)
      if (pending.has(key)) return undefined

      pending.add(key)
      generate(file)
        .then((url) => {
          cache.set(key, url)
          onUpdate()
        })
        .catch((error) => {
          console.warn('handy-uploader: video thumbnail failed for', file.name, error)
        })
        .finally(() => pending.delete(key))
      return undefined
    },
    invalidate(file) {
      cache.delete(keyOf(file))
    }
  }
}

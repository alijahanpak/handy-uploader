import { describe, expect, it, vi } from 'vitest'
import { createVideoThumbnailCache, getVideoDataUrl } from './videoThumbnail'

const video = { name: 'clip.mp4', format: 'mp4', base64: 'AAAA' }
const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('getVideoDataUrl', () => {
  it('derives the MIME type from the file name', () => {
    expect(getVideoDataUrl(video)).toBe('data:video/mp4;base64,AAAA')
  })

  it('uses format when it is already a video MIME type and strips existing prefixes', () => {
    expect(
      getVideoDataUrl({ name: 'x', format: 'video/webm', base64: 'data:video/webm;base64,BBBB' })
    ).toBe('data:video/webm;base64,BBBB')
  })

  it('falls back to video/<format> for unknown extensions', () => {
    expect(getVideoDataUrl({ name: 'x.mkv', format: 'mkv', base64: 'C' })).toBe(
      'data:video/mkv;base64,C'
    )
  })
})

describe('createVideoThumbnailCache', () => {
  it('generates once, notifies, then serves from cache', async () => {
    const generate = vi.fn().mockResolvedValue('data:image/jpeg;base64,THUMB')
    const onUpdate = vi.fn()
    const cache = createVideoThumbnailCache(onUpdate, generate)

    expect(cache.get(video)).toBeUndefined()
    expect(cache.get(video)).toBeUndefined() // in flight: no duplicate work
    await flush()

    expect(generate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(cache.get(video)).toBe('data:image/jpeg;base64,THUMB')
  })

  it('does not cache failures, so the next get retries', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const generate = vi
      .fn()
      .mockRejectedValueOnce(new Error('nope'))
      .mockResolvedValue('data:image/jpeg;base64,OK')
    const onUpdate = vi.fn()
    const cache = createVideoThumbnailCache(onUpdate, generate)

    cache.get(video)
    await flush()
    expect(onUpdate).not.toHaveBeenCalled()

    cache.get(video)
    await flush()
    expect(generate).toHaveBeenCalledTimes(2)
    expect(cache.get(video)).toBe('data:image/jpeg;base64,OK')
  })

  it('regenerates after invalidate', async () => {
    const generate = vi.fn().mockResolvedValue('t')
    const cache = createVideoThumbnailCache(() => {}, generate)
    cache.get(video)
    await flush()
    cache.invalidate(video)
    expect(cache.get(video)).toBeUndefined()
    await flush()
    expect(generate).toHaveBeenCalledTimes(2)
  })
})

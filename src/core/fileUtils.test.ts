import { describe, expect, it } from 'vitest'
import { constructImageDataUrl } from './fileUtils'

describe('constructImageDataUrl', () => {
  it.each([
    ['png', 'data:image/png;base64,AAA'],
    ['jpg', 'data:image/jpeg;base64,AAA'],
    ['svg', 'data:image/svg+xml;base64,AAA'],
    ['image/webp', 'data:image/webp;base64,AAA'],
    ['heic', 'data:image/heic;base64,AAA']
  ])('builds a data URL for %s', (format, expected) => {
    expect(constructImageDataUrl('AAA', format)).toBe(expected)
  })

  it('strips an existing data-URL prefix', () => {
    expect(constructImageDataUrl('data:image/svg+xml;base64,AAA', 'svg')).toBe(
      'data:image/svg+xml;base64,AAA'
    )
  })
})

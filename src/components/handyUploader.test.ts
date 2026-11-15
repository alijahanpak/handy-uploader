// The Vuetify HandyUploader ('handy-uploader/vuetify'). Only the Insert button is tested here;
// the rest is covered by the e2e tests (e2e/components), which run it in a real browser.
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import type { DocumentAttachment } from '../types'
import HandyUploader from './handyUploader.vue'

// Vuetify measures layouts with ResizeObserver, which jsdom doesn't have.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

const stored = (name: string): DocumentAttachment => ({
  file: {
    name,
    format: name.split('.').pop()!,
    base64: '',
    size: 2048,
    tags: [],
    description: '',
    showDetailState: false
  }
})

const mountUploader = (props: Record<string, unknown>) =>
  mount(HandyUploader, {
    props: { documentAttachment: [], lang: 'en', ...props },
    global: { plugins: [createVuetify({ components })] }
  })

const insertButton = (wrapper: ReturnType<typeof mountUploader>) =>
  wrapper.findAll('button').find((b) => b.text() === 'Insert File')

describe('Vuetify HandyUploader: Insert button', () => {
  it('is shown by default', () => {
    expect(insertButton(mountUploader({}))?.exists()).toBe(true)
  })

  it('is hidden when insertPermission is false', () => {
    expect(insertButton(mountUploader({ insertPermission: false }))).toBeUndefined()
  })

  it('is disabled once maxFileCount is reached', async () => {
    const below = mountUploader({ documentAttachment: [stored('a.pdf')], maxFileCount: 2 })
    expect(insertButton(below)?.attributes('disabled')).toBeUndefined()

    const full = mountUploader({
      documentAttachment: [stored('a.pdf'), stored('b.pdf')],
      maxFileCount: 2
    })
    expect(insertButton(full)?.attributes('disabled')).toBeDefined()

    const fullNoBadge = mountUploader({
      documentAttachment: [stored('a.pdf'), stored('b.pdf')],
      maxFileCount: 2,
      badgeCounter: false
    })
    expect(insertButton(fullNoBadge)?.attributes('disabled')).toBeDefined()
  })
})

describe('Vuetify HandyUploader: thumb', () => {
  // A 1×1 PNG.
  const image: DocumentAttachment = {
    file: {
      ...stored('dot.png').file,
      format: 'png',
      base64:
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    }
  }

  for (const view of ['thumbnail', 'simple']) {
    it(`${view} view: shows image previews only when thumb is on`, () => {
      const on = mountUploader({ documentAttachment: [image], fileUploaderType: view })
      expect(on.find('img, .v-img').exists()).toBe(true)
      const off = mountUploader({
        documentAttachment: [image],
        fileUploaderType: view,
        thumb: false
      })
      expect(off.find('img, .v-img').exists()).toBe(false)
    })
  }
})

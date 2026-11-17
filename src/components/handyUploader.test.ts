// The Vuetify HandyUploader ('handy-uploader/vuetify'). Only the Insert button is tested here;
// the rest is covered by the e2e tests (e2e/components), which run it in a real browser.
import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
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
// Vuetify's snackbar positions itself with visualViewport, which jsdom doesn't have either.
globalThis.visualViewport ??= Object.assign(new EventTarget(), {
  width: 1024,
  height: 768
}) as unknown as VisualViewport

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

  it('turns the badge red at the limit, and also above it', () => {
    const badge = (count: number) =>
      mountUploader({
        documentAttachment: Array.from({ length: count }, (_, i) => stored(`${i}.pdf`)),
        maxFileCount: 2
      }).find('.v-badge__badge')
    expect(badge(1).classes()).toContain('bg-success')
    expect(badge(2).classes()).toContain('bg-error')
    expect(badge(3).classes()).toContain('bg-error')
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

describe('Vuetify HandyUploader: fileAccept', () => {
  it('rejects files that bypass the picker with a message and stages only the others', async () => {
    const wrapper = mount(HandyUploader, {
      props: { documentAttachment: [], lang: 'en', fileAccept: '.pdf,image/*' },
      global: { plugins: [createVuetify({ components })] },
      attachTo: document.body
    })
    await insertButton(wrapper)!.trigger('click')
    await flushPromises()

    // Set the files the way a drop or a script does, so the accept attribute doesn't apply.
    const input = document.querySelector<HTMLInputElement>('.v-dialog input[type=file]')!
    const files = [
      new File(['text'], 'notes.txt', { type: 'text/plain' }),
      new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' })
    ]
    Object.defineProperty(input, 'files', { value: files })
    input.dispatchEvent(new Event('change'))
    await vi.waitFor(() => {
      expect(document.querySelectorAll('.v-dialog .v-list-item')).toHaveLength(1)
    })

    expect(document.querySelector('.v-dialog .v-list-item')!.textContent).toContain('doc.pdf')
    expect(document.querySelector('.v-snackbar')!.textContent).toContain(
      'notes.txt: File type is not allowed'
    )
    wrapper.unmount()
  })
})

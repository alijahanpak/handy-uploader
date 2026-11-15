import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import type { DocumentAttachment } from '../types'
import './index'
import { defineHandyUploader } from './index'

const file = (name: string, size = 10) => new File(['x'.repeat(size)], name)
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

type El = HTMLElement & { files: DocumentAttachment[] }

async function mountEl(html: string): Promise<El> {
  document.body.innerHTML = html
  const el = document.body.firstElementChild as El
  await nextTick()
  return el
}

/** Uses the element like a user would: Insert → pick files → Add. */
async function addThroughDialog(el: El, files: File[]) {
  ;(el.querySelector('.hu-toolbar button') as HTMLButtonElement).click()
  await nextTick()
  const input = el.querySelector('dialog input[type="file"]') as HTMLInputElement
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  input.dispatchEvent(new Event('change'))
  await vi.waitFor(() => expect(el.querySelectorAll('.hu-staged__item').length).toBe(files.length))
  const add = [...el.querySelectorAll('dialog button')].find((b) => b.textContent?.trim() === 'Add')
  ;(add as HTMLButtonElement).click()
  await vi.waitFor(() => expect(el.querySelector('dialog[open]')).toBeNull())
}

describe('<handy-uploader> Web Component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('registers itself and injects the default theme once', () => {
    expect(customElements.get('handy-uploader')).toBeDefined()
    defineHandyUploader() // calling again is harmless
    expect(document.querySelectorAll('#handy-uploader-theme')).toHaveLength(1)
  })

  it('renders in the light DOM (no Shadow DOM), so page CSS applies', async () => {
    const el = await mountEl('<handy-uploader></handy-uploader>')
    expect(el.shadowRoot).toBeNull()
    expect(el.querySelector('.hu-uploader')).not.toBeNull()
  })

  it('reads string attributes as the right types', async () => {
    const el = await mountEl(
      '<handy-uploader file-uploader-type="table" max-file-count="1" badge-counter="false" lang="fr"></handy-uploader>'
    )
    el.files = [stored('a.pdf')]
    await nextTick()
    expect(el.querySelector('table.hu-table')).not.toBeNull()
    expect(el.querySelector('.hu-count')).toBeNull() // badge-counter="false" really is false
    expect((el.querySelector('.hu-toolbar button') as HTMLButtonElement).disabled).toBe(true) // limit 1 reached
    expect(el.textContent).toContain('Insérer') // French
  })

  it('keeps the built-in defaults for attributes that are not set', async () => {
    const el = await mountEl('<handy-uploader></handy-uploader>')
    el.files = [stored('a.pdf')]
    await nextTick()
    expect(el.querySelector('.hu-files--thumbnail')).not.toBeNull() // default view
    expect(el.querySelector('.hu-count')).not.toBeNull() // badgeCounter defaults to true
    expect(el.querySelector('.hu-icon-button--danger')).not.toBeNull() // deletePermission default
  })

  it('accepts tags as a comma-separated attribute', async () => {
    const el = await mountEl(
      '<handy-uploader add-file-tag tags="invoice, contract"></handy-uploader>'
    )
    ;(el.querySelector('.hu-toolbar button') as HTMLButtonElement).click()
    const input = el.querySelector('dialog input[type="file"]') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file('a.pdf')], configurable: true })
    input.dispatchEvent(new Event('change'))
    await vi.waitFor(() => expect(el.querySelectorAll('.hu-tag--selectable')).toHaveLength(2))
  })

  it('dispatches hu-change and hu-add events and updates el.files', async () => {
    const el = await mountEl('<handy-uploader></handy-uploader>')
    const changes: DocumentAttachment[][] = []
    const adds: DocumentAttachment[][] = []
    document.body.addEventListener('hu-change', (e) => changes.push((e as CustomEvent).detail.files))
    // Native change events from the inner inputs must not look like ours
    const nativeChanges: Event[] = []
    el.addEventListener('change', (e) => nativeChanges.push(e))
    el.addEventListener('hu-add', (e) => adds.push((e as CustomEvent).detail.added))

    await addThroughDialog(el, [file('report.pdf')])

    const last = changes.at(-1)!
    expect(changes).toHaveLength(1)
    expect(nativeChanges.every((e) => !(e instanceof CustomEvent))).toBe(true)
    expect(last.map((a) => a.file.name)).toEqual(['report.pdf']) // bubbled to <body>
    expect(adds[0].map((a) => a.file.name)).toEqual(['report.pdf'])
    expect(el.files.map((a) => a.file.name)).toEqual(['report.pdf'])
  })

  it('dispatches hu-remove after the delete confirmation', async () => {
    const el = await mountEl('<handy-uploader></handy-uploader>')
    el.files = [stored('a.pdf'), stored('b.pdf')]
    await nextTick()
    const removed: { index: number; name: string }[] = []
    el.addEventListener('hu-remove', (e) => {
      const d = (e as CustomEvent).detail
      removed.push({ index: d.index, name: d.attachment.file.name })
    })

    ;(el.querySelector('button[aria-label="Delete a.pdf"]') as HTMLButtonElement).click()
    await nextTick()
    const confirm = [...el.querySelectorAll('dialog button')].filter((b) => b.textContent?.trim() === 'Delete').at(-1)
    ;(confirm as HTMLButtonElement).click()
    await nextTick()

    expect(removed).toEqual([{ index: 0, name: 'a.pdf' }])
    expect(el.files.map((a) => a.file.name)).toEqual(['b.pdf'])
  })

  it('dispatches hu-error for rejected files', async () => {
    const el = await mountEl('<handy-uploader file-accept=".pdf"></handy-uploader>')
    const errors: string[] = []
    el.addEventListener('hu-error', (e) => errors.push(...(e as unknown as CustomEvent).detail.errors.map((x: { code: string }) => x.code)))
    ;(el.querySelector('.hu-toolbar button') as HTMLButtonElement).click()
    const input = el.querySelector('dialog input[type="file"]') as HTMLInputElement
    Object.defineProperty(input, 'files', { value: [file('virus.exe')], configurable: true })
    input.dispatchEvent(new Event('change'))
    await vi.waitFor(() => expect(errors).toEqual(['fileType']))
  })
})

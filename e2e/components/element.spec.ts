// <handy-uploader>: its DOM events, attributes, properties and methods.
//
// The stories load the element, so the tests run on a story page: either on the story's own
// element, or on a fresh one created there, configured only with attributes as in plain HTML.
import type { Locator, Page } from '@playwright/test'
import type { HandyUploaderElement } from '../../src/element/types'
import { expect, test } from '../fixtures'
import { pdf, png, serialisable, txt, type TestFile } from '../support/files'
import { flavourById, storyUrl } from './flavours'

const element = flavourById('element')

type RecordedEvent = { type: string; detail: Record<string, unknown> }
type Recording = HTMLElement & { recorded: RecordedEvent[] }

/** Starts recording the hu-* events of `el`, with their detail (as JSON). */
async function record(el: Locator) {
  await el.evaluate((node) => {
    const recording = node as Recording
    recording.recorded = []
    for (const type of ['hu-change', 'hu-add', 'hu-remove', 'hu-error']) {
      node.addEventListener(type, (event) => {
        const detail = JSON.parse(JSON.stringify((event as CustomEvent).detail))
        recording.recorded.push({ type, detail })
      })
    }
  })
}

const recorded = (el: Locator) => el.evaluate((node) => (node as Recording).recorded)
const names = (list: unknown) => (list as { file: { name: string } }[]).map((a) => a.file.name)
const fileNames = (el: Locator) =>
  el.evaluate((node) => (node as HandyUploaderElement).files.map((a) => a.file.name))

/** A new <handy-uploader> on the page, set up with attributes only. */
async function createElement(page: Page, attributes: Record<string, string>) {
  await page.goto(storyUrl(element.prefix, 'playground'))
  await expect(page.locator('handy-uploader')).toHaveCount(1)
  await page.evaluate((attributes) => {
    const el = document.createElement('handy-uploader')
    el.id = 'under-test'
    for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value)
    document.body.append(el)
  }, attributes)
  const el = page.locator('#under-test')
  await expect(el.locator('.hu-uploader')).toBeVisible()
  await record(el)
  return el
}

/** Calls el.addFiles(...) with generated files; resolves with the names of the added ones. */
const addFiles = (el: Locator, files: TestFile[]) =>
  el.evaluate(async (node, items) => {
    const list = items.map(({ name, mimeType, base64 }) => {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      return new File([bytes], name, { type: mimeType })
    })
    const added = await (node as HandyUploaderElement).addFiles(list)
    return added.map((a) => a.file.name)
  }, files.map(serialisable))

test.describe('<handy-uploader> events', () => {
  test('hu-add and hu-change when files are added in the dialog', async ({ page }) => {
    const uploader = await element.open(page, 'playground')
    const el = page.locator('handy-uploader')
    await record(el)

    await uploader.add([png('photo.png'), pdf('report.pdf')])

    const events = await recorded(el)
    expect(events.map((e) => e.type)).toEqual(['hu-change', 'hu-add'])
    expect(names(events[0].detail.files)).toEqual(['photo.png', 'report.pdf'])
    expect(names(events[1].detail.added)).toEqual(['photo.png', 'report.pdf'])
    expect(await fileNames(el)).toEqual(['photo.png', 'report.pdf'])

    // The story's event log shows them too.
    const log = page.getByRole('list', { name: 'Events' })
    await expect(log.getByRole('listitem')).toHaveText([
      'hu-add: added photo.png, report.pdf',
      'hu-change: 2 files: photo.png, report.pdf'
    ])
  })

  test('hu-remove and hu-change when a file is deleted', async ({ page }) => {
    const uploader = await element.open(page, 'thumbnail-view')
    const el = page.locator('handy-uploader')
    await record(el)

    await uploader.remove('vue-upload-mockup.svg')

    const events = await recorded(el)
    expect(events.map((e) => e.type)).toEqual(['hu-change', 'hu-remove'])
    expect(names(events[0].detail.files)).toEqual(['project-proposal.pdf', 'data-analysis.xlsx'])
    expect(events[1].detail.index).toBe(1)
    expect(names([events[1].detail.attachment])).toEqual(['vue-upload-mockup.svg'])
    expect(await fileNames(el)).toEqual(['project-proposal.pdf', 'data-analysis.xlsx'])
  })

  test('hu-change when a file is edited', async ({ page }) => {
    const uploader = await element.open(page, 'thumbnail-view')
    const el = page.locator('handy-uploader')
    await record(el)

    await uploader.editButton('data-analysis.xlsx').click()
    await uploader.fillEdit({ name: 'numbers.xlsx' })
    await uploader.editSaveButton.click()

    await expect(uploader.item('numbers.xlsx')).toHaveCount(1)
    const events = await recorded(el)
    expect(events.map((e) => e.type)).toEqual(['hu-change'])
    expect(names(events[0].detail.files)).toEqual([
      'project-proposal.pdf',
      'vue-upload-mockup.svg',
      'numbers.xlsx'
    ])
  })

  test('hu-error when files are rejected', async ({ page }) => {
    const uploader = await element.open(page, 'restricted-file-types')
    const el = page.locator('handy-uploader')
    await record(el)

    await uploader.pick([txt('notes.txt')])
    await expect(uploader.error).toBeVisible()

    expect(await recorded(el)).toEqual([
      { type: 'hu-error', detail: { errors: [{ code: 'fileType', fileName: 'notes.txt' }] } }
    ])
    await expect(page.getByRole('list', { name: 'Events' })).toContainText(
      'hu-error: fileType (notes.txt)'
    )
  })
})

test.describe('<handy-uploader> attributes and properties', () => {
  test('max-file-count, badge-counter="false" and tags="a, b"', async ({ page }) => {
    const el = await createElement(page, {
      'max-file-count': '2',
      'badge-counter': 'false',
      'add-file-tag': '',
      tags: 'a, b'
    })
    const insert = el.locator('.hu-toolbar').getByRole('button')
    const dialog = el.getByRole('dialog')

    await insert.click()
    await dialog.locator('input[type=file]').setInputFiles([txt('one.txt')])
    const staged = dialog.locator('.hu-staged__item')
    await expect(staged.getByRole('checkbox')).toHaveCount(2)
    await staged.getByRole('checkbox', { name: 'b' }).check()
    await dialog.locator('.hu-dialog__actions .hu-button--primary').click()
    await expect(dialog).toBeHidden()

    await expect(el.locator('.hu-card')).toHaveCount(1)
    await expect(el.locator('.hu-count')).toHaveCount(0) // badge-counter="false"
    await expect(insert).toBeEnabled()
    const files = await el.evaluate((node) => (node as HandyUploaderElement).files)
    expect(files[0].file.tags).toEqual(['b'])

    await addFiles(el, [txt('two.txt')])
    await expect(el.locator('.hu-card')).toHaveCount(2)
    await expect(insert).toBeDisabled() // max-file-count="2"
  })

  test('its own id, class and data-* stay on the element', async ({ page }) => {
    const el = await createElement(page, { class: 'mine', 'data-test': 'up', title: 'Files' })
    await expect(page.locator('#under-test')).toHaveCount(1)
    const inner = el.locator('.hu-uploader')
    await expect(inner).toHaveAttribute('class', 'hu-uploader')
    for (const name of ['id', 'title', 'data-test', 'datatest']) {
      expect(await inner.getAttribute(name)).toBeNull()
    }
  })

  test('changing attributes re-renders', async ({ page }) => {
    const el = await createElement(page, { lang: 'fr' })
    const insert = el.locator('.hu-toolbar').getByRole('button')
    await expect(insert).toHaveText('Insérer un fichier')

    await el.evaluate((node) => node.setAttribute('lang', 'fa'))
    await expect(insert).toHaveText('افزودن فایل')
    await expect(el.locator('.hu-uploader')).toHaveAttribute('dir', 'rtl')

    await el.evaluate((node) => node.setAttribute('insert-permission', 'false'))
    await expect(el.locator('.hu-toolbar')).toHaveCount(0)
  })

  test('the files property sets and reflects the list', async ({ page }) => {
    const el = await createElement(page, { 'file-uploader-type': 'table' })
    await el.evaluate((node) => {
      const file = (name: string) => ({
        file: {
          name,
          format: name.split('.').pop()!,
          base64: '',
          size: 1000,
          tags: [],
          description: '',
          showDetailState: false
        }
      })
      ;(node as HandyUploaderElement).files = [file('a.pdf'), file('b.txt')]
    })
    await expect(el.locator('.hu-table tbody tr')).toHaveCount(2)
    expect(await fileNames(el)).toEqual(['a.pdf', 'b.txt'])

    // A property set as a JS property, not an attribute.
    await el.evaluate((node) => {
      ;(node as HandyUploaderElement).fileUploaderType = 'simple'
    })
    await expect(el.locator('.hu-card--simple')).toHaveCount(2)

    await el.evaluate((node) => {
      ;(node as HandyUploaderElement).files = []
    })
    await expect(el.locator('.hu-card')).toHaveCount(0)
    // Setting the property is not a user change, so no event.
    expect(await recorded(el)).toEqual([])
  })
})

test.describe('<handy-uploader> methods', () => {
  test('addFiles validates, adds and resolves with the added files', async ({ page }) => {
    const el = await createElement(page, { 'file-accept': 'image/*,.pdf' })

    const added = await addFiles(el, [png('photo.png'), txt('notes.txt'), pdf('report.pdf')])

    expect(added).toEqual(['photo.png', 'report.pdf'])
    await expect(el.locator('.hu-card')).toHaveCount(2)
    await expect(el.locator('.hu-count')).toHaveText('2')
    expect(await fileNames(el)).toEqual(['photo.png', 'report.pdf'])
    const events = await recorded(el)
    expect(events.map((e) => e.type).sort()).toEqual(['hu-add', 'hu-change', 'hu-error'])
    const error = events.find((e) => e.type === 'hu-error')!
    expect(error.detail.errors).toEqual([{ code: 'fileType', fileName: 'notes.txt' }])
    await expect(el.getByRole('alert')).toContainText('notes.txt: File type is not allowed')
  })

  test('removeAt removes without asking; openInsert opens the dialog', async ({ page }) => {
    const el = await createElement(page, {})
    await addFiles(el, [txt('one.txt'), txt('two.txt')])
    await expect(el.locator('.hu-card')).toHaveCount(2)
    await el.evaluate((node) => (node as Recording).recorded.splice(0))

    await el.evaluate((node) => (node as HandyUploaderElement).removeAt(0))
    await expect(el.locator('.hu-card')).toHaveCount(1)
    await expect(el.getByRole('dialog')).toBeHidden()
    const events = await recorded(el)
    expect(events.map((e) => e.type)).toEqual(['hu-change', 'hu-remove'])
    expect(events[1].detail.index).toBe(0)
    expect(await fileNames(el)).toEqual(['two.txt'])

    await el.evaluate((node) => (node as HandyUploaderElement).openInsert())
    await expect(el.getByRole('dialog')).toBeVisible()
  })
})

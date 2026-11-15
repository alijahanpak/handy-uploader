// Page objects for the three flavours of the uploader, so one spec can drive them all.
//
//   vue      'Vue (any CSS)/HandyUploader'          the framework-free Vue component (hu-* DOM)
//   element  'Web Component/<handy-uploader>'       the same component inside <handy-uploader>
//   vuetify  'Vue + Vuetify/HandyUploader'          the legacy Vuetify components (v-* DOM)
//
// Locators use roles, labels and text where the markup has them. The Vuetify buttons are
// icon-only without accessible names, so those are found by their mdi-* icon.
import { expect, type Locator, type Page } from '@playwright/test'
import { serialisable, type TestFile } from '../support/files'

export type FlavourId = 'vue' | 'element' | 'vuetify'

export type StoryName =
  | 'playground'
  | 'thumbnail-view'
  | 'simple-view'
  | 'table-view'
  | 'restricted-file-types'
  | 'read-only-mode'
  | 'minimal-features'
  | 'rtl-support'
  | 'french-language'

/** Story args to change after the story has rendered. */
export type StoryArgs = Record<string, string | number | boolean | string[]>

export const storyUrl = (prefix: string, story: StoryName) =>
  `iframe.html?id=${prefix}--${story}&viewMode=story`

type StorybookChannel = {
  emit(event: string, payload: unknown): void
  once(event: string, listener: () => void): void
}

/**
 * Changes story args the way the Controls panel does, and waits for the story to re-render.
 * (The `args` URL parameter can't be used: Storybook ignores it for props whose inferred type
 * is a union, like `lang` and `fileUploaderType` of the Vue components.)
 */
export async function updateArgs(page: Page, storyId: string, args: StoryArgs) {
  await page.evaluate(
    ({ storyId, args }) =>
      new Promise<void>((resolve) => {
        const channel = (window as unknown as { __STORYBOOK_ADDONS_CHANNEL__: StorybookChannel })
          .__STORYBOOK_ADDONS_CHANNEL__
        channel.once('storyRendered', () => requestAnimationFrame(() => resolve()))
        channel.emit('updateStoryArgs', { storyId, updatedArgs: args })
      }),
    { storyId, args }
  )
}

export abstract class Uploader {
  constructor(readonly page: Page) {}

  /** The uploader itself. */
  abstract readonly root: Locator
  abstract readonly insertButton: Locator
  /** The file count on the Insert button. */
  abstract readonly badge: Locator
  /** One card (thumbnail/simple view) or table row per file. */
  abstract readonly items: Locator
  /** The open dialog (insert, edit or delete). */
  abstract readonly dialog: Locator
  /** The validation message(s). */
  abstract readonly error: Locator

  item(name: string) {
    return this.items.filter({ hasText: name })
  }

  /** The preview image of a file (not its file-type icon). */
  abstract thumbnail(name: string): Locator
  abstract deleteButton(name: string): Locator
  abstract editButton(name: string): Locator
  /** The staged files in the insert dialog. */
  abstract readonly staged: Locator
  abstract readonly addButton: Locator

  async openInsert() {
    await this.insertButton.click()
    await expect(this.dialog).toBeVisible()
  }

  /** Opens the insert dialog and picks `files` with the file input. */
  async pick(files: TestFile[]) {
    await this.openInsert()
    await this.dialog.locator('input[type=file]').setInputFiles(files)
  }

  /** Opens the insert dialog and drops `files` on its drop target. */
  async drop(files: TestFile[]) {
    await this.openInsert()
    const payload = files.map(serialisable)
    await this.dropTarget.evaluate((target, items) => {
      const dataTransfer = new DataTransfer()
      for (const item of items) {
        const bytes = Uint8Array.from(atob(item.base64), (c) => c.charCodeAt(0))
        dataTransfer.items.add(new File([bytes], item.name, { type: item.mimeType }))
      }
      for (const type of ['dragenter', 'dragover', 'drop']) {
        target.dispatchEvent(
          new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true })
        )
      }
    }, payload)
  }

  protected abstract readonly dropTarget: Locator

  /** Picks `files` and adds them, as a user would with the default settings. */
  async add(files: TestFile[]) {
    await this.pick(files)
    await expect(this.staged).toHaveCount(files.length)
    await this.confirmAdd()
  }

  async confirmAdd() {
    await this.addButton.click()
    await expect(this.dialog).toBeHidden()
  }

  /** A button at the bottom of the open dialog, e.g. "Delete" or "cancel". */
  abstract dialogButton(name: string): Locator

  /** Clicks the delete button of `name` and confirms. */
  async remove(name: string) {
    await this.deleteButton(name).click()
    await expect(this.dialog).toBeVisible()
    await this.dialogButton('Delete').click()
    await expect(this.dialog).toBeHidden()
  }

  /** In the insert dialog: name, description and tags of the staged file at `index`. */
  abstract fillStaged(
    index: number,
    fields: { name?: string; description?: string; tags?: string[] }
  ): Promise<void>

  /** In the edit dialog: change name and/or description. */
  abstract fillEdit(fields: { name?: string; description?: string }): Promise<void>
  abstract readonly editSaveButton: Locator

  /** Shows the tags and description of a card. */
  abstract expandDetails(name: string): Promise<void>
}

/** The framework-free component, as a Vue component or inside <handy-uploader>. */
class HuUploader extends Uploader {
  readonly root = this.page.locator('.hu-uploader').first()
  readonly insertButton = this.root.locator('.hu-toolbar').getByRole('button')
  readonly badge = this.root.locator('.hu-count')
  readonly items = this.root.locator('.hu-card, .hu-table tbody tr')
  readonly dialog = this.page.getByRole('dialog')
  readonly error = this.page.getByRole('alert')
  readonly staged = this.dialog.locator('.hu-staged__item')
  readonly addButton = this.dialog.locator('.hu-dialog__actions .hu-button--primary')
  readonly editSaveButton = this.addButton
  protected readonly dropTarget = this.dialog.locator('.hu-dropzone')

  thumbnail(name: string) {
    return this.item(name).locator('img')
  }
  // The dialog's close (×) button is also named "cancel", so only the footer is searched.
  dialogButton(name: string) {
    return this.dialog.locator('.hu-dialog__actions').getByRole('button', { name, exact: true })
  }
  // By class rather than accessible name ("Delete <file>"), so they work in every language.
  deleteButton(name: string) {
    return this.item(name).locator('button.hu-icon-button--danger')
  }
  editButton(name: string) {
    return this.item(name).locator('button.hu-icon-button--edit')
  }

  async fillStaged(
    index: number,
    fields: { name?: string; description?: string; tags?: string[] }
  ) {
    const item = this.staged.nth(index)
    if (fields.name !== undefined) await item.getByLabel('File Name').fill(fields.name)
    if (fields.description !== undefined)
      await item.getByLabel('File Description').fill(fields.description)
    for (const tag of fields.tags ?? []) await item.getByRole('checkbox', { name: tag }).check()
  }

  async fillEdit(fields: { name?: string; description?: string }) {
    if (fields.name !== undefined) await this.dialog.getByLabel('File Name').fill(fields.name)
    if (fields.description !== undefined)
      await this.dialog.getByLabel('File Description').fill(fields.description)
  }

  async expandDetails(name: string) {
    await this.item(name).getByRole('button', { name: 'File Description / File Tags' }).click()
  }
}

/** The legacy Vuetify components. */
class VuetifyUploader extends Uploader {
  readonly root = this.page.locator('#storybook-root .v-container').first()
  // The Insert button is the only one with the mb-4 class (it has no other distinct markup).
  readonly insertButton = this.root.locator('button.v-btn.mb-4')
  readonly badge = this.root.locator('.v-badge__badge')
  readonly items = this.root.locator('.v-card.mx-auto, .v-card.file-card, tbody tr')
  // Dialogs are teleported out of the uploader into Vuetify's overlay container.
  readonly dialog = this.page.locator('.v-overlay--active.v-dialog')
  readonly error = this.page.locator('.v-snackbar--active .v-snackbar__content')
  readonly staged = this.dialog.locator('.v-expansion-panel, .v-list-item')
  readonly addButton = this.dialog.getByRole('button', { name: 'Add', exact: true })
  readonly editSaveButton = this.dialog.getByRole('button', { name: 'Edit', exact: true })
  protected readonly dropTarget = this.dialog.locator('.v-file-input .v-field')

  thumbnail(name: string) {
    return this.item(name).locator('img')
  }
  dialogButton(name: string) {
    return this.dialog.getByRole('button', { name, exact: true })
  }
  deleteButton(name: string) {
    return this.item(name).locator(
      'button:has(.mdi-trash-can-outline), button:has(.mdi-delete-outline), button:has(.mdi-delete)'
    )
  }
  editButton(name: string) {
    return this.item(name).locator('button:has(.mdi-pencil-outline)')
  }

  async fillStaged(
    index: number,
    fields: { name?: string; description?: string; tags?: string[] }
  ) {
    const panel = this.staged.nth(index)
    await panel.locator('.v-expansion-panel-title').click()
    if (fields.name !== undefined) await panel.getByLabel('File Name').fill(fields.name)
    if (fields.description !== undefined)
      await panel.getByLabel('File Description').fill(fields.description)
    if (fields.tags?.length) {
      await panel.getByLabel('File Tags').click()
      for (const tag of fields.tags) {
        await this.page.getByRole('option', { name: tag, exact: true }).click()
      }
      await this.page.keyboard.press('Escape')
    }
  }

  async fillEdit(fields: { name?: string; description?: string }) {
    if (fields.name !== undefined) await this.dialog.getByLabel('File Name').fill(fields.name)
    if (fields.description !== undefined)
      await this.dialog.getByLabel('File Description').fill(fields.description)
  }

  async expandDetails(name: string) {
    await this.item(name).locator('button:has(.mdi-chevron-down)').click()
  }
}

export interface Flavour {
  id: FlavourId
  title: string
  /** Storybook id prefix of the flavour's stories (see storybook-static/index.json). */
  prefix: string
  open(page: Page, story: StoryName, args?: StoryArgs): Promise<Uploader>
}

function flavour(
  id: FlavourId,
  title: string,
  prefix: string,
  Driver: new (page: Page) => Uploader
): Flavour {
  return {
    id,
    title,
    prefix,
    async open(page, story, args) {
      await page.goto(storyUrl(prefix, story))
      const uploader = new Driver(page)
      await expect(uploader.root).toBeVisible()
      if (args) await updateArgs(page, `${prefix}--${story}`, args)
      return uploader
    }
  }
}

export const flavours: Flavour[] = [
  flavour('vue', 'Vue (any CSS)', 'vue-any-css-handyuploader', HuUploader),
  flavour('element', 'Web Component', 'web-component-handy-uploader', HuUploader),
  flavour('vuetify', 'Vue + Vuetify', 'vue-vuetify-handyuploader', VuetifyUploader)
]

export const flavourById = (id: FlavourId) => flavours.find((f) => f.id === id)!

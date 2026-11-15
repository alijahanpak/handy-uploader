// The behaviour every flavour shares, run against the Vue, Web Component and Vuetify stories.
import { expect, test } from '../fixtures'
import { bigPdf, pdf, png, txt } from '../support/files'
import { flavours } from './flavours'

const SAMPLES = ['project-proposal.pdf', 'vue-upload-mockup.svg', 'data-analysis.xlsx']

for (const flavour of flavours) {
  const hu = flavour.id !== 'vuetify'

  test.describe(flavour.title, () => {
    test.describe('renders the sample files', () => {
      for (const story of ['thumbnail-view', 'simple-view', 'table-view'] as const) {
        test(story, async ({ page }) => {
          const uploader = await flavour.open(page, story)
          await expect(uploader.items).toHaveCount(SAMPLES.length)
          // The Vuetify table shortens long names, so only the start is checked there.
          for (const name of SAMPLES) {
            await expect(
              uploader.item(story === 'table-view' ? name.slice(0, 10) : name)
            ).toHaveCount(1)
          }
          await expect(uploader.badge).toHaveText('3')
          await expect(uploader.insertButton).toBeEnabled()
        })
      }

      test('table view has a header row', async ({ page }) => {
        const uploader = await flavour.open(page, 'table-view')
        const headers = uploader.root.getByRole('columnheader')
        await expect(headers).toHaveText(['Thumb', 'Name', 'Size', 'Action'])
      })
    })

    test('shows a preview image for an image file', async ({ page }) => {
      const uploader = await flavour.open(page, 'thumbnail-view')
      const thumbnail = uploader.thumbnail('vue-upload-mockup.svg')
      await expect(thumbnail).toBeVisible()
      await expect
        .poll(() => thumbnail.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0)
      // Other files get a file-type icon, not an image.
      await expect(uploader.thumbnail('project-proposal.pdf')).toHaveCount(0)
    })

    test('shows file-type icons and no badge with thumb and badgeCounter off', async ({ page }) => {
      // MinimalFeatures: thumb, badgeCounter and all editing features off.
      for (const view of ['thumbnail', 'simple', 'table']) {
        const uploader = await flavour.open(page, 'minimal-features', { fileUploaderType: view })
        await expect(uploader.items).toHaveCount(3)
        await expect(uploader.thumbnail('vue-upload')).toHaveCount(0)
        await expect(uploader.badge).toHaveCount(0)
      }
    })

    test('adds files through the Insert dialog', async ({ page }) => {
      const uploader = await flavour.open(page, 'playground')
      await expect(uploader.items).toHaveCount(0)
      await expect(uploader.badge).toHaveCount(0)

      await uploader.add([png('photo.png'), pdf('report.pdf'), txt('notes.txt')])

      await expect(uploader.items).toHaveCount(3)
      for (const name of ['photo.png', 'report.pdf', 'notes.txt']) {
        await expect(uploader.item(name)).toHaveCount(1)
      }
      await expect(uploader.badge).toHaveText('3')
      // The added image gets a preview.
      const thumbnail = uploader.thumbnail('photo.png')
      await expect(thumbnail).toBeVisible()
      await expect
        .poll(() => thumbnail.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBe(8)

      // A second batch adds to the first.
      await uploader.add([txt('more.txt')])
      await expect(uploader.items).toHaveCount(4)
      await expect(uploader.badge).toHaveText('4')
    })

    test('adds files dropped on the dialog', async ({ page }) => {
      const uploader = await flavour.open(page, 'playground')
      await uploader.drop([pdf('dropped.pdf'), txt('dropped.txt')])
      await expect(uploader.staged).toHaveCount(2)
      await uploader.confirmAdd()
      await expect(uploader.items).toHaveCount(2)
      await expect(uploader.item('dropped.pdf')).toHaveCount(1)
      await expect(uploader.item('dropped.txt')).toHaveCount(1)
    })

    test('sets name, description and tags when adding', async ({ page }) => {
      const uploader = await flavour.open(page, 'playground')
      await uploader.pick([pdf('report.pdf')])
      await expect(uploader.staged).toHaveCount(1)
      await uploader.fillStaged(0, {
        name: 'q3-report',
        description: 'Quarterly numbers',
        tags: ['invoice', 'data']
      })
      await uploader.confirmAdd()

      const card = uploader.item('q3-report.pdf')
      await expect(card).toHaveCount(1)
      await uploader.expandDetails('q3-report.pdf')
      await expect(card).toContainText('Quarterly numbers')
      await expect(card).toContainText('invoice')
      await expect(card).toContainText('data')
    })

    test('edits a file in the edit dialog', async ({ page }) => {
      const uploader = await flavour.open(page, 'thumbnail-view')
      await uploader.editButton('project-proposal.pdf').click()
      await expect(uploader.dialog).toBeVisible()
      await uploader.fillEdit({ name: 'final-proposal.pdf', description: 'Signed version' })
      await uploader.editSaveButton.click()
      await expect(uploader.dialog).toBeHidden()

      await expect(uploader.item('project-proposal.pdf')).toHaveCount(0)
      await expect(uploader.item('final-proposal.pdf')).toHaveCount(1)
      await uploader.expandDetails('final-proposal.pdf')
      await expect(uploader.item('final-proposal.pdf')).toContainText('Signed version')
      await expect(uploader.items).toHaveCount(3)
    })

    test('deletes a file after confirmation', async ({ page }) => {
      const uploader = await flavour.open(page, 'thumbnail-view')

      // Cancelling keeps the file.
      await uploader.deleteButton('data-analysis.xlsx').click()
      await expect(uploader.dialog).toContainText('Are you sure you want to delete the file?')
      await uploader.dialogButton('cancel').click()
      await expect(uploader.dialog).toBeHidden()
      await expect(uploader.items).toHaveCount(3)

      await uploader.remove('data-analysis.xlsx')
      await expect(uploader.items).toHaveCount(2)
      await expect(uploader.item('data-analysis.xlsx')).toHaveCount(0)
      await expect(uploader.badge).toHaveText('2')
    })

    test('hides insert, edit and delete without permissions', async ({ page }) => {
      const uploader = await flavour.open(page, 'read-only-mode')
      await expect(uploader.items).toHaveCount(3)
      for (const name of SAMPLES) {
        await expect(uploader.deleteButton(name)).toHaveCount(0)
        await expect(uploader.editButton(name)).toHaveCount(0)
      }
      await expect(uploader.insertButton).toHaveCount(0)
    })

    test('shows edit and delete with permissions', async ({ page }) => {
      const uploader = await flavour.open(page, 'read-only-mode', {
        editPermission: true,
        deletePermission: true
      })
      for (const name of SAMPLES) {
        await expect(uploader.deleteButton(name)).toBeVisible()
        await expect(uploader.editButton(name)).toBeVisible()
      }
      if (hu) {
        // Icon buttons are named after their file.
        await expect(page.getByRole('button', { name: `Delete ${SAMPLES[0]}` })).toBeVisible()
        await expect(page.getByRole('button', { name: `Edit ${SAMPLES[0]}` })).toBeVisible()
      }
    })

    test('disables Insert once maxFileCount is reached', async ({ page }) => {
      const uploader = await flavour.open(page, 'thumbnail-view', { maxFileCount: 4 })
      await expect(uploader.insertButton).toBeEnabled()
      await uploader.add([txt('fourth.txt')])
      await expect(uploader.items).toHaveCount(4)
      await expect(uploader.badge).toHaveText('4')
      await expect(uploader.insertButton).toBeDisabled()
    })

    test('rejects files over maxFileSize with a message', async ({ page }) => {
      // RestrictedFileTypes: .pdf/.doc/.docx/.jpg/.png, at most 2 MB and 5 files.
      const uploader = await flavour.open(page, 'restricted-file-types')
      await uploader.pick([bigPdf('huge.pdf', 2_500_000), pdf('small.pdf')])
      if (hu) {
        // Rejected while picking; the other file is still staged.
        await expect(uploader.error).toContainText('huge.pdf: Max file Size is')
        await expect(uploader.staged).toHaveCount(1)
      } else {
        // Rejected when adding, with a snackbar.
        await expect(uploader.staged).toHaveCount(2)
      }
      await uploader.confirmAdd()
      await expect(uploader.items).toHaveCount(1)
      await expect(uploader.item('small.pdf')).toHaveCount(1)
      if (!hu) await expect(uploader.error).toContainText('Max file Size is 1.9 MB')
    })

    test('rejects files not matching fileAccept with a message', async ({ page }) => {
      test.fixme(
        !hu,
        'Vuetify flavour: fileAccept only sets the input’s accept attribute; files that bypass ' +
          'the picker (drop, setInputFiles) are added anyway, without the documented message.'
      )
      const uploader = await flavour.open(page, 'restricted-file-types')
      await uploader.pick([txt('notes.txt'), png('photo.png')])
      await expect(uploader.error).toContainText('notes.txt: File type is not allowed')
      await expect(uploader.staged).toHaveCount(1)
      await uploader.confirmAdd()
      await expect(uploader.items).toHaveCount(1)
      await expect(uploader.item('photo.png')).toHaveCount(1)
    })

    test('shows French texts with lang="fr"', async ({ page }) => {
      const uploader = await flavour.open(page, 'french-language')
      await expect(uploader.insertButton).toHaveText('Insérer un fichier')
      await expect(uploader.root.getByRole('columnheader').nth(1)).toHaveText('Nom')
      await uploader.deleteButton(SAMPLES[0].slice(0, 10)).click()
      await expect(uploader.dialog).toContainText('Voulez-vous vraiment supprimer le fichier?')
      await uploader.dialogButton('Annuler').click()
      await expect(uploader.dialog).toBeHidden()
    })

    test.describe('right-to-left languages', () => {
      // The Vuetify flavour leaves RTL to Vuetify's own setting (see the rtlSupport docs).
      test.skip(!hu, 'RTL is Vuetify’s own setting in the Vuetify flavour')

      test('fa with rtlSupport', async ({ page }) => {
        const uploader = await flavour.open(page, 'rtl-support')
        await expect(uploader.root).toHaveAttribute('dir', 'rtl')
        await expect(uploader.insertButton).toHaveText('افزودن فایل')
      })

      test('ar is right-to-left automatically', async ({ page }) => {
        const uploader = await flavour.open(page, 'thumbnail-view', { lang: 'ar' })
        await expect(uploader.root).toHaveAttribute('dir', 'rtl')
        await expect(uploader.insertButton).toHaveText('إدراج ملف')
      })

      test('en is left-to-right', async ({ page }) => {
        const uploader = await flavour.open(page, 'thumbnail-view')
        await expect(uploader.root).not.toHaveAttribute('dir', 'rtl')
      })
    })
  })
}

// Every app in examples/ with the freshly packed library (examples.setup.ts) installed, built,
// served and checked in Chromium:
//
//   first render with one saved file (`files`) ⇒ 1 card, app state "1 files: welcome.txt"
//   "Clear" (app sets its state to [])         ⇒ 0 cards (the `files` property reached it)
//   Insert → report.pdf + notes.txt → Add      ⇒ 2 cards, and the app's own state says so
//   "Add sample" (el.addFiles)                 ⇒ 3 cards, app state updated
//   no page errors, no console errors (the pageErrors fixture in ../fixtures.ts)
//
// Pick examples with --grep: `npm run test:examples -- --grep "react-19|svelte-5"`.
import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '../fixtures'
import { serve, type StaticServer } from '../support/static-server'
import { pdf, txt } from '../support/files'
import { examples, examplesDir, root, run, tarball } from './shared'

for (const name of examples) {
  test.describe(name, () => {
    const dir = path.join(examplesDir, name)
    let server: StaticServer | undefined

    test.beforeAll(async () => {
      test.setTimeout(10 * 60_000) // npm ci + an Angular build take a while

      // Framework versions come from the committed lockfile; the library is the fresh tarball,
      // installed without touching package.json or the lockfile.
      await test.step('npm ci + npm install --no-save <tarball>', async () => {
        await run('npm', ['ci', '--no-audit', '--no-fund'], dir)
        await run('npm', ['install', '--no-save', '--no-audit', '--no-fund', tarball], dir)
      })
      await test.step('the installed library is the fresh build', () => {
        const installed = fs.readFileSync(
          path.join(dir, 'node_modules/handy-uploader/dist/element.mjs')
        )
        const built = fs.readFileSync(path.join(root, 'dist/element.mjs'))
        expect(installed.equals(built), 'installed element.mjs is not the fresh build').toBe(true)
      })

      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
      let outDir = dir // no build step (plain HTML)
      if (pkg.scripts?.build) {
        await test.step('npm run build', async () => {
          fs.rmSync(path.join(dir, 'dist'), { recursive: true, force: true })
          await run('npm', ['run', 'build'], dir)
        })
        outDir = path.join(dir, 'dist')
        if (fs.existsSync(path.join(outDir, 'browser/index.html')))
          outDir = path.join(outDir, 'browser') // Angular
      }
      server = await serve(outDir)
    })

    test.afterAll(async () => {
      await server?.close()
    })

    test('uploader works in the app', async ({ page }) => {
      const uploader = page.locator('handy-uploader')
      const cards = uploader.locator('.hu-card')
      const state = page.locator('#state')
      const insert = uploader.locator('.hu-toolbar button')

      await page.goto(server!.url)
      await expect(insert).toBeVisible({ timeout: 10_000 })

      // The app starts with one saved file, passed in as the `files` property on first render
      await test.step('initial files property → 1 card', async () => {
        await expect(cards).toHaveCount(1)
      })
      await test.step('initial app state', async () => {
        await expect(state).toHaveText('1 files: welcome.txt')
      })

      // The app sets its state to [] and passes it down as the `files` property again
      await page.locator('#clear').click()
      await test.step('files property → 0 cards', async () => {
        await expect(cards).toHaveCount(0)
      })
      await test.step('cleared app state', async () => {
        await expect(state).toHaveText('0 files')
      })

      // Insert → pick two files → Add
      await insert.first().click()
      const dialog = uploader.locator('dialog[open]')
      await dialog.locator('input[type=file]').setInputFiles([pdf('report.pdf'), txt('notes.txt')])
      await expect(uploader.locator('.hu-staged__item')).toHaveCount(2)
      await dialog.locator('.hu-dialog__actions .hu-button--primary').click()
      await expect(dialog).toHaveCount(0)
      await test.step('2 cards after Add', async () => {
        await expect(cards).toHaveCount(2)
      })
      await test.step('hu-change → app state', async () => {
        await expect(state).toHaveText('2 files: report.pdf, notes.txt')
      })

      // A button in the app calling el.addFiles(...)
      await page.locator('#add-sample').click()
      await test.step('addFiles → 3 cards', async () => {
        await expect(cards).toHaveCount(3)
      })
      await test.step('addFiles → app state', async () => {
        await expect(state).toHaveText('3 files: report.pdf, notes.txt, sample.txt')
      })
      // No page or console errors: checked by the pageErrors fixture after the test.
    })
  })
}

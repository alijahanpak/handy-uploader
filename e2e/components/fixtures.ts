// `test` for the component specs: each worker serves the static Storybook build
// (storybook-static/, from `npm run build-storybook`) and uses it as baseURL. A fixture rather
// than a global webServer, so runs without component tests never need storybook-static.
import fs from 'node:fs'
import path from 'node:path'
import { test as base } from '../fixtures'
import { serve } from '../support/static-server'

export { expect } from '../fixtures'

const STORYBOOK_DIR = path.resolve(__dirname, '../../storybook-static')

export const test = base.extend<object, { storybookUrl: string }>({
  storybookUrl: [
    async ({}, use) => {
      if (!fs.existsSync(path.join(STORYBOOK_DIR, 'index.json'))) {
        throw new Error(
          'No Storybook build in storybook-static/. Run `npm run build-storybook` first ' +
            '(`npm run test:e2e:components` does).'
        )
      }
      const server = await serve(STORYBOOK_DIR)
      await use(server.url)
      await server.close()
    },
    { scope: 'worker' }
  ],
  baseURL: async ({ storybookUrl }, use) => {
    await use(storybookUrl)
  }
})

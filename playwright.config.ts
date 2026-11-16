import { defineConfig, devices } from '@playwright/test'

// Two projects:
//
//   components  the uploader stories (Vue, Vuetify, Web Component) in a static Storybook build,
//               served by a worker fixture (e2e/components/fixtures.ts). Build it first:
//               `npm run build-storybook` (`npm run test:e2e:components` does).
//   examples    the framework example apps in examples/, each with the freshly packed library
//               installed. `examples-setup` builds and packs the library first.
//
// npm run test:e2e              both (builds Storybook first)
// npm run test:e2e:run          both, without building anything (SKIP_BUILD=1 for examples)
// npm run test:e2e:components   components only
// npm run test:examples         examples only; pick some with `-- --grep "react-19|svelte-5"`,
//                               reuse the current dist/ with SKIP_BUILD=1

const CI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Another Chrome/Chromium instead of Playwright's own (`npx playwright install chromium`).
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined }
  },
  projects: [
    {
      name: 'components',
      testDir: './e2e/components',
      fullyParallel: true
    },
    {
      // Builds the library and packs it into examples/.handy-uploader.tgz.
      name: 'examples-setup',
      testDir: './e2e/examples',
      testMatch: 'examples.setup.ts',
      timeout: 5 * 60_000
    },
    {
      // Each example installs, builds (Angular takes a while) and is served in a beforeAll.
      name: 'examples',
      testDir: './e2e/examples',
      testMatch: '*.spec.ts',
      dependencies: ['examples-setup'],
      fullyParallel: true,
      timeout: 60_000
    }
  ]
})

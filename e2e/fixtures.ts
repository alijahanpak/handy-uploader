import { test as base, expect } from '@playwright/test'

export { expect }

/**
 * `test` for every e2e spec: any uncaught page error or console.error fails the test. The
 * collected messages are available as the `pageErrors` fixture, e.g. to assert on them early.
 */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(`console.error: ${message.text()}`)
      })
      await use(errors)
      expect(errors, 'no page errors or console errors').toEqual([])
    },
    { auto: true }
  ]
})

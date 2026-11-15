#!/usr/bin/env node
// Builds handy-uploader, installs the packed tarball into every app in examples/, builds and
// serves each app, and checks <handy-uploader> in a real Chromium:
//
//   first render with one saved file (files property) ⇒ 1 card, app state "1 files: welcome.txt"
//   "Clear" button (app sets its state to [])          ⇒ 0 cards (files property reached the element)
//   Insert → pick report.pdf + notes.txt → Add         ⇒ 2 cards, and the app's own state says so
//   "Add sample" button (el.addFiles)                  ⇒ 3 cards, app state updated
//   no page errors, no console errors
//
// Usage:
//   npm run test:examples                     # all examples
//   npm run test:examples -- react-19 svelte-5  # only some
//   npm run test:examples -- --skip-build     # reuse the current dist/ (no library build)
//   npm run test:examples -- --headed         # watch it
//
// Browser: CHROMIUM_PATH=/path/to/chrome, or Playwright's own Chromium
// (install it once with `npx playwright-core install chromium`).
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const examplesDir = path.join(root, 'examples')
const tarball = path.join(examplesDir, '.handy-uploader.tgz')

const args = process.argv.slice(2)
const flags = new Set(args.filter((a) => a.startsWith('--')))
const only = args.filter((a) => !a.startsWith('--'))
const all = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(examplesDir, d.name, 'package.json')))
  .map((d) => d.name)
  .sort()
const unknown = only.filter((name) => !all.includes(name))
if (unknown.length) {
  console.error(`Unknown example(s): ${unknown.join(', ')}. Available: ${all.join(', ')}`)
  process.exit(2)
}
const examples = only.length ? only : all

const started = Date.now()
const secs = (ms) => `${(ms / 1000).toFixed(1)}s`
const log = (msg) => console.log(`\n▶ ${msg}`)

function run(cmd, cmdArgs, cwd) {
  const res = spawnSync(cmd, cmdArgs, {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    // HUSKY=0: `npm pack` runs the `prepare` script (husky), which isn't needed here.
    env: { ...process.env, HUSKY: '0', CI: process.env.CI ?? '1' },
    maxBuffer: 64 * 1024 * 1024
  })
  if (res.status !== 0) {
    const out = `${res.stdout ?? ''}${res.stderr ?? ''}`.trim().split('\n').slice(-40).join('\n')
    throw new Error(
      `\`${cmd} ${cmdArgs.join(' ')}\` failed in ${path.relative(root, cwd) || '.'}:\n${out}`
    )
  }
  return res.stdout
}

// ---------------------------------------------------------------------------------------------
// 1. Build and pack the library, exactly as it would be published.
if (!flags.has('--skip-build')) {
  log('Building the library (npm run build)')
  run('npm', ['run', 'build'], root)
}
log('Packing the library (npm pack)')
const packDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hu-pack-'))
const packOut = run('npm', ['pack', '--json', '--pack-destination', packDir], root)
// The `prepare` script may print before the JSON.
const packed = JSON.parse(packOut.slice(packOut.indexOf('[\n')))[0]
fs.copyFileSync(path.join(packDir, packed.filename), tarball)
fs.rmSync(packDir, { recursive: true, force: true })
console.log(`  ${packed.filename} → examples/.handy-uploader.tgz (${packed.entryCount} files)`)

// ---------------------------------------------------------------------------------------------
// A tiny static file server (SPA fallback to index.html), so every example is served the same.
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
}
function serve(dir) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let file = path.join(dir, urlPath)
    if (!file.startsWith(dir)) return res.writeHead(403).end()
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    if (!fs.existsSync(file)) file = path.join(dir, 'index.html')
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  return new Promise((resolve) =>
    server.listen(0, '127.0.0.1', () =>
      resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() })
    )
  )
}

// ---------------------------------------------------------------------------------------------
// The browser check, the same for every example.
const PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n'
)
const TXT = Buffer.from('Some notes\n')

async function checkInBrowser(browser, url) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`)
  })
  const checks = []
  const check = (name, ok, info = '') => {
    checks.push({ name, ok, info })
    if (!ok) throw new Error(`${name}${info ? ` (${info})` : ''}`)
  }
  const cards = () => page.locator('handy-uploader .hu-card').count()
  const state = () => page.locator('#state').innerText()
  const waitFor = async (fn, expected, timeout = 5000) => {
    const end = Date.now() + timeout
    let value
    while (Date.now() < end) {
      value = await fn()
      if (value === expected) return value
      await page.waitForTimeout(50)
    }
    return value
  }

  try {
    await page.goto(url)
    await page.locator('handy-uploader .hu-toolbar button').waitFor({ timeout: 10000 })

    // The app starts with one saved file, passed in as the `files` property on first render
    const expected1 = '1 files: welcome.txt'
    check(
      'initial files property → 1 card',
      (await waitFor(cards, 1)) === 1,
      `${await cards()} cards`
    )
    check('initial app state', (await waitFor(state, expected1)) === expected1, await state())

    // The app sets its state to [] and passes it down as the `files` property again
    await page.locator('#clear').click()
    check('files property → 0 cards', (await waitFor(cards, 0)) === 0, `${await cards()} cards`)
    check('cleared app state', (await waitFor(state, '0 files')) === '0 files', await state())

    // Insert → pick two files → Add
    await page.locator('handy-uploader .hu-toolbar button').first().click()
    const input = page.locator('handy-uploader dialog[open] input[type=file]')
    await input.waitFor({ state: 'attached', timeout: 5000 })
    await input.setInputFiles([
      { name: 'report.pdf', mimeType: 'application/pdf', buffer: PDF },
      { name: 'notes.txt', mimeType: 'text/plain', buffer: TXT }
    ])
    await page.locator('handy-uploader .hu-staged__item').nth(1).waitFor({ timeout: 5000 })
    await page
      .locator('handy-uploader dialog[open] .hu-dialog__actions .hu-button--primary')
      .click()
    await page.locator('handy-uploader dialog[open]').waitFor({ state: 'detached', timeout: 5000 })

    check('2 cards after Add', (await waitFor(cards, 2)) === 2, `${await cards()} cards`)
    const expected2 = '2 files: report.pdf, notes.txt'
    check('hu-change → app state', (await waitFor(state, expected2)) === expected2, await state())

    // A button in the app calling el.addFiles(...)
    await page.locator('#add-sample').click()
    check('addFiles → 3 cards', (await waitFor(cards, 3)) === 3, `${await cards()} cards`)
    const expected3 = '3 files: report.pdf, notes.txt, sample.txt'
    check('addFiles → app state', (await waitFor(state, expected3)) === expected3, await state())

    await page.waitForTimeout(100) // let any late errors surface
    check('no page/console errors', errors.length === 0, errors.join(' | '))
  } catch (err) {
    if (!checks.length || checks.at(-1).ok) {
      checks.push({ name: 'browser flow', ok: false, info: err.message.split('\n')[0] })
    }
    if (errors.length && !checks.some((c) => c.name.startsWith('no page'))) {
      checks.push({ name: 'no page/console errors', ok: false, info: errors.join(' | ') })
    }
  } finally {
    await page.close()
  }
  return checks
}

// ---------------------------------------------------------------------------------------------
// 2. Per example: install the tarball, build, serve, check.
const executablePath = process.env.CHROMIUM_PATH || undefined
let browser
try {
  browser = await chromium.launch({ executablePath, headless: !flags.has('--headed') })
} catch (err) {
  console.error(
    `\nCould not start Chromium: ${err.message.split('\n')[0]}\n` +
      'Set CHROMIUM_PATH to a Chrome/Chromium binary, or run `npx playwright-core install chromium`.'
  )
  process.exit(1)
}

const distElement = fs.readFileSync(path.join(root, 'dist/element.mjs'))
const results = []
for (const name of examples) {
  const dir = path.join(examplesDir, name)
  const t0 = Date.now()
  const result = { name, status: 'FAIL', detail: '', time: '' }
  results.push(result)
  let server
  try {
    log(`${name}: npm install`)
    // A fresh install of the new tarball: the lockfile pins the old tarball's integrity.
    fs.rmSync(path.join(dir, 'package-lock.json'), { force: true })
    fs.rmSync(path.join(dir, 'node_modules/handy-uploader'), { recursive: true, force: true })
    run('npm', ['install', '--no-audit', '--no-fund'], dir)
    const installed = fs.readFileSync(
      path.join(dir, 'node_modules/handy-uploader/dist/element.mjs')
    )
    if (!installed.equals(distElement))
      throw new Error('installed element.mjs is not the fresh build')

    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
    let outDir = dir // no build step (plain HTML)
    if (pkg.scripts?.build) {
      log(`${name}: npm run build`)
      fs.rmSync(path.join(dir, 'dist'), { recursive: true, force: true })
      run('npm', ['run', 'build'], dir)
      outDir = path.join(dir, 'dist')
      if (fs.existsSync(path.join(outDir, 'browser/index.html')))
        outDir = path.join(outDir, 'browser') // Angular
    }

    server = await serve(outDir)
    log(`${name}: checking ${server.url} in Chromium`)
    const checks = await checkInBrowser(browser, server.url)
    for (const c of checks)
      console.log(`  ${c.ok ? '✓' : '✗'} ${c.name}${c.ok || !c.info ? '' : `: ${c.info}`}`)
    const failed = checks.find((c) => !c.ok)
    result.status = failed ? 'FAIL' : 'PASS'
    result.detail = failed ? `${failed.name}: ${failed.info}` : `${checks.length} checks`
  } catch (err) {
    result.detail = err.message
    console.log(`  ✗ ${err.message}`)
  } finally {
    server?.close()
    result.time = secs(Date.now() - t0)
  }
}
await browser.close()

// ---------------------------------------------------------------------------------------------
const w = Math.max(...results.map((r) => r.name.length), 7)
console.log(`\n${'Example'.padEnd(w)}  Result  Time    Detail`)
console.log(`${'-'.repeat(w)}  ------  ------  ${'-'.repeat(40)}`)
for (const r of results) {
  const detail = r.detail.split('\n')[0].slice(0, 160)
  console.log(`${r.name.padEnd(w)}  ${r.status.padEnd(6)}  ${r.time.padEnd(6)}  ${detail}`)
}
const failed = results.filter((r) => r.status !== 'PASS').length
console.log(
  `\n${failed ? `${failed} of ${results.length} failed` : `All ${results.length} passed`} in ${secs(Date.now() - started)}`
)
process.exit(failed ? 1 : 0)

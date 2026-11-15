// Builds handy-uploader and packs it exactly as it would be published, into
// examples/.handy-uploader.tgz, for the example apps to install (examples.spec.ts).
// SKIP_BUILD=1 packs the current dist/ without building.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test as setup } from '@playwright/test'
import { root, run, tarball } from './shared'

setup('build and pack the library', async () => {
  if (!process.env.SKIP_BUILD) {
    await setup.step('npm run build', () => {
      run('npm', ['run', 'build'], root)
    })
  }
  await setup.step('npm pack', () => {
    const packDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hu-pack-'))
    const packOut = run('npm', ['pack', '--json', '--pack-destination', packDir], root)
    // The `prepare` script may print before the JSON.
    const packed = JSON.parse(packOut.slice(packOut.indexOf('[\n')))[0]
    fs.copyFileSync(path.join(packDir, packed.filename), tarball)
    fs.rmSync(packDir, { recursive: true, force: true })
    console.log(`${packed.filename} → examples/.handy-uploader.tgz (${packed.entryCount} files)`)
  })
})

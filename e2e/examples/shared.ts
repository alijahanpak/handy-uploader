import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export const root = path.resolve(__dirname, '../..')
export const examplesDir = path.join(root, 'examples')
/** The packed library, installed into every example. */
export const tarball = path.join(examplesDir, '.handy-uploader.tgz')

/** Every folder in examples/ with a package.json. */
export const examples = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(examplesDir, d.name, 'package.json')))
  .map((d) => d.name)
  .sort()

/** Runs a command and returns its stdout; throws with the end of its output when it fails. */
export function run(cmd: string, args: string[], cwd: string): string {
  const res = spawnSync(cmd, args, {
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
      `\`${cmd} ${args.join(' ')}\` failed in ${path.relative(root, cwd) || '.'}:\n${out}`
    )
  }
  return res.stdout
}

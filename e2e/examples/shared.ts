import { spawn, type ChildProcess } from 'node:child_process'
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

// Commands still running, killed if the worker exits early (e.g. when a hook times out).
const running = new Set<ChildProcess>()
process.on('exit', () => {
  for (const child of running) child.kill()
})

/**
 * Runs a command and resolves with its stdout; rejects with the end of its output when it fails.
 * Asynchronous, so Playwright's timeouts still fire while it runs.
 */
export function run(cmd: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: process.platform === 'win32',
      // HUSKY=0: `npm pack` runs the `prepare` script (husky), which isn't needed here.
      env: { ...process.env, HUSKY: '0', CI: process.env.CI ?? '1' }
    })
    running.add(child)
    let stdout = ''
    let output = ''
    child.stdout.setEncoding('utf8').on('data', (chunk: string) => {
      stdout += chunk
      output += chunk
    })
    child.stderr.setEncoding('utf8').on('data', (chunk: string) => {
      output += chunk
    })
    child.on('error', (error) => {
      running.delete(child)
      reject(error)
    })
    child.on('close', (code) => {
      running.delete(child)
      if (code === 0) return resolve(stdout)
      const tail = output.trim().split('\n').slice(-40).join('\n')
      const where = path.relative(root, cwd) || '.'
      reject(new Error(`\`${cmd} ${args.join(' ')}\` failed in ${where}:\n${tail}`))
    })
  })
}

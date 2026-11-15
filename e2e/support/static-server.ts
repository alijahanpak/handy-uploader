// A tiny static file server with an SPA fallback to index.html, so every example app is
// served the same way, whatever its build tool.
import fs from 'node:fs'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import path from 'node:path'

const MIME: Record<string, string> = {
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

export interface StaticServer {
  url: string
  close: () => Promise<void>
}

/** Serves `dir` on 127.0.0.1 at a free port. */
export function serve(dir: string): Promise<StaticServer> {
  const root = path.resolve(dir)
  const server = http.createServer((req, res) => {
    let urlPath: string
    try {
      urlPath = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
    } catch {
      res.writeHead(400).end()
      return
    }
    let file = path.join(root, urlPath)
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end()
      return
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    if (!fs.existsSync(file)) file = path.join(root, 'index.html')
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo
      resolve({
        url: `http://127.0.0.1:${port}/`,
        close: () => new Promise<void>((done) => server.close(() => done()))
      })
    })
  })
}

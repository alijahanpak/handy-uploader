# `<handy-uploader>` example apps

Minimal apps that use the `<handy-uploader>` Web Component (`handy-uploader/element`) the
idiomatic way for each framework. Each one sets a few attributes, passes the file list as the
`files` property (starting with one saved file), keeps its own state in sync from `hu-change`,
and has buttons that call `el.addFiles(...)` and reset the list.

| Folder       | Stack                                                     |
| ------------ | --------------------------------------------------------- |
| `plain-html` | One HTML file, import map, no build step                  |
| `react-19`   | Vite + React 19 (`files` prop, `onhu-change`)             |
| `react-18`   | Vite + React 18 (ref + `addEventListener`)                |
| `svelte-5`   | Vite + Svelte 5 (`files` prop, `onhu-change`)             |
| `angular`    | Angular 20 standalone, zoneless, `CUSTOM_ELEMENTS_SCHEMA` |

They are not part of the published package and are not linted, type-checked or tested by the
root config.

## Browser test

```bash
npx playwright-core install chromium   # once, or set CHROMIUM_PATH=/path/to/chrome
npm run test:examples                  # all examples
npm run test:examples -- react-19      # only some
npm run test:examples -- --skip-build  # reuse the current dist/
```

`scripts/test-examples.mjs` builds the library, packs it with `npm pack`, installs each example's
pinned dependencies from its committed lockfile (`npm ci`) and then the packed library on top
(`npm install --no-save ../.handy-uploader.tgz`, as a real install would, without touching
`package.json` or the lockfile), builds each example, serves it and drives Chromium through the
uploader: the saved file shows, clearing the app state empties the uploader, two files added
through the Insert dialog show as two cards and in the app's own state, and `addFiles` adds a
third. Any page or console error fails the example.

## Running an example by hand

`handy-uploader` is deliberately not in the examples' `package.json`, so the lockfiles stay
stable. Run `npm run test:examples` once (it creates `examples/.handy-uploader.tgz`), then in
the example's folder:

```bash
npm ci
npm install --no-save ../.handy-uploader.tgz   # or the published one: npm install handy-uploader
npm run dev                                    # every example has a dev script
```

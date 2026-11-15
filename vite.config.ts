import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  const isElement = mode === 'element'

  return {
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    ...(isLib && {
      build: {
        lib: {
          // 'handy-uploader' (framework-free) and 'handy-uploader/vuetify'
          entry: {
            'handy-uploader': resolve(__dirname, 'src/lib/index.ts'),
            vuetify: resolve(__dirname, 'src/lib/vuetify.ts')
          },
          fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`,
          cssFileName: 'handy-uploader',
          formats: ['es', 'cjs']
        },
        rollupOptions: {
          external: ['vue', 'vuetify', 'vuetify/components', 'vuetify/directives'],
          output: {
            exports: 'named'
          }
        },
        cssCodeSplit: false,
        emptyOutDir: true
      }
    }),
    // 'handy-uploader/element': the <handy-uploader> Web Component. Self-contained (Vue is
    // bundled, in production mode) so React, Svelte, Angular or plain HTML need nothing else.
    // Runs after the lib build and must not empty dist/.
    ...(isElement && {
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      },
      build: {
        lib: {
          entry: resolve(__dirname, 'src/element/index.ts'),
          fileName: () => 'element.mjs',
          formats: ['es']
        },
        minify: 'esbuild',
        emptyOutDir: false
      }
    })
  }
})

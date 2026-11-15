import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  
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
    })
  }
})

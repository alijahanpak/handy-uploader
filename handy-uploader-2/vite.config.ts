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
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'HandyUploaderVue',
          fileName: (format) => `handy-uploader.${format}.js`,
          formats: ['es', 'umd']
        },
        rollupOptions: {
          external: ['vue', 'vuetify', 'vuetify/components', 'vuetify/directives'],
          output: {
            exports: 'named',
            globals: {
              vue: 'Vue',
              vuetify: 'Vuetify'
            }
          }
        },
        cssCodeSplit: false,
        emptyOutDir: true
      }
    })
  }
})

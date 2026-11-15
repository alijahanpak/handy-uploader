import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

setup((app) => {
  app.use(vuetify)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: 'todo'
    },
    options: {
      storySort: {
        order: [
          'Guide',
          [
            'Getting Started',
            'Feature Tour',
            'Styling & Theming',
            'Build Your Own UI',
            'Framework Support',
            'Upgrading from 2.x'
          ],
          'Vue (any CSS)',
          'Vue + Vuetify'
        ]
      }
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff'
        },
        {
          name: 'dark',
          value: '#1e1e1e'
        }
      ]
    }
  }
}

export default preview

import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/storybook-static/**']
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    name: 'app/core-is-framework-agnostic',
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['vue', 'vue/*', '@vue/*'], message: 'src/core must stay framework-agnostic.' },
            { group: ['vuetify', 'vuetify/*'], message: 'src/core must stay framework-agnostic.' },
            { group: ['@/components/*', '../components/*', '*.vue'], message: 'src/core must not import UI components.' }
          ]
        }
      ]
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]

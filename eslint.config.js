import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import globals from 'globals'

const languageOptions = { globals: { ...globals.browser, ...globals.node }, parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } }
export default [
  { ignores: ['**/dist/**', '**/node_modules/**', 'apps/web/src/generated/**'] },
  { files: ['**/*.{js,mjs}'], ...js.configs.recommended, languageOptions, rules: { ...js.configs.recommended.rules, 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], 'no-empty': ['error', { allowEmptyCatch: true }] } },
  { files: ['**/*.ts'], languageOptions: { ...languageOptions, parser: tseslint.parser }, plugins: { '@typescript-eslint': tseslint.plugin }, rules: { ...tseslint.configs.recommended.rules, '@typescript-eslint/no-explicit-any': 'off' } },
  { files: ['**/*.vue'], languageOptions: { ...languageOptions, parser: vueParser }, plugins: { vue }, rules: { 'vue/no-dupe-keys': 'error', 'vue/no-mutating-props': 'error', 'vue/no-v-html': 'off' } }
]

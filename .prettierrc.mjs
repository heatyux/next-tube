import pluginSortImports from '@trivago/prettier-plugin-sort-imports'
import { parsers as tailwindPluginParsers } from 'prettier-plugin-tailwindcss'

/**
 * @refs  https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/31#issuecomment-1195411734
 */
/** @type {import("prettier").Parser}  */
const bothParser = {
  ...tailwindPluginParsers.typescript,
  preprocess: pluginSortImports.parsers.typescript.preprocess,
}

/** @type {import("prettier").Plugin}  */
const mixedPlugin = {
  parsers: {
    typescript: bothParser,
  },
  options: {
    ...pluginSortImports.options,
  },
}

const config = {
  plugins: [mixedPlugin],
  semi: false,
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  importOrder: ['^react$', '<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

export default config

import config from '@vainjs/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

const nuxtManagedConfigNames = new Set([
  'import/recommended',
  'typescript-eslint/base',
])
const sharedConfig = config.filter(
  ({ name }) => !name || !nuxtManagedConfigNames.has(name)
)

export default withNuxt(...sharedConfig)

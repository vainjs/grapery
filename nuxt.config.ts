import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.less'],
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', 'nuxtjs-naive-ui'],
  ssr: false,
  vite: {
    plugins: [
      AutoImport({
        dts: '.nuxt/naive-auto-imports.d.ts',
        packagePresets: ['naive-ui'],
      }),
      Components({
        dts: '.nuxt/naive-components.d.ts',
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
})

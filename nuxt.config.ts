import svgLoader from 'vite-svg-loader'
import { resolve } from 'path'
export default defineNuxtConfig({

  modules: ["@nuxtjs/tailwindcss",
    '@pinia/nuxt'
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  tailwindcss: {
    config: {
      darkMode: "class",
    },
  },
  vite: {
    plugins: [
      svgLoader()
    ],
    resolve: {
      alias: {
        '#shared': resolve(__dirname, 'shared'),
      },
    },
  },
  css: ['~/assets/styles/main.scss'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "fa",
        dir: "rtl",
      },
      title: "قهوه‌فروشی | Coffee Store",
      meta: [
        { name: "description", content: "فروشگاه تخصصی قهوه با انواع قهوه‌های اسپرسو، لاته، کاپوچینو و دانه‌های قهوه عربیکا با بهترین کیفیت" },
        { name: "keywords", content: "قهوه, فروشگاه قهوه, اسپرسو, لاته, کاپوچینو, عربیکا, قهوه ترک, دانه قهوه" },
        { property: "og:title", content: "قهوه‌فروشی | Coffee Store" },
        { property: "og:description", content: "فروشگاه تخصصی قهوه با انواع قهوه‌های اسپرسو، لاته، کاپوچینو و دانه‌های قهوه عربیکا" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fa_IR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "قهوه‌فروشی | Coffee Store" },
        { name: "twitter:description", content: "فروشگاه تخصصی قهوه با بهترین کیفیت" },
        { property: "og:image", content: "/og-image.jpg" },
        { name: "twitter:image", content: "/og-image.jpg" },
      ],

      link: [
        { rel: "icon", type: "image/x-icons", href: "/favicon.ico" },
      ],
    },
  },
})

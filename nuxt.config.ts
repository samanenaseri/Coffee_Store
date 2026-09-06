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
      title: "Bean House | فروشگاه تخصصی قهوه",
      meta: [
        { name: "description", content: "فروشگاه تخصصی قهوه Bean House با انواع قهوه، دانه قهوه و محصولات باکیفیت" },
        { property: "og:title", content: "Bean House | فروشگاه تخصصی قهوه" },
        { property: "og:description", content: "خرید قهوه و دانه‌های قهوه باکیفیت از Bean House" },
        { property: "og:site_name", content: "Bean House" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "fa_IR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Bean House | فروشگاه تخصصی قهوه" },
        { name: "twitter:description", content: "خرید قهوه و دانه‌های قهوه باکیفیت از Bean House" },
        { property: "og:image", content: "/images/great-coffee-bean.jpeg" },
        { name: "twitter:image", content: "/images/great-coffee-bean.jpeg" },
      ],

      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
})

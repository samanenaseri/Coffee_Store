import svgLoader from 'vite-svg-loader'
export default defineNuxtConfig({

  modules: ["@nuxtjs/tailwindcss"],
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
    ]
  },
  css: ['~/assets/styles/main.scss'],

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
      ],

      link: [
        { rel: "icon", type: "image/x-icons", href: "/favicon.ico" },
      ],
    },
  },
})

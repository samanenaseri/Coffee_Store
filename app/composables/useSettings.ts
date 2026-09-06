import { ref } from 'vue'

interface Settings {
  store_name: string
  store_slogan: string
  store_logo: string
  /** Optional alternate logo after scroll on homepage; falls back to store_logo */
  store_dark_logo: string
  /** Logo for inner pages in dark mode (light logo on dark bg) */
  store_inner_logo: string
  /** Logo for inner pages in light mode (dark logo on light bg) */
  store_inner_dark_logo: string
  store_phone: string
  store_mobile: string
  store_email: string
  store_address: string
  store_working_hours: string
  store_instagram: string
  store_telegram: string
  store_description: string
  footer_background: string
  footer_links: { label: string; url: string }[]
  header_links: { label: string; url: string }[]
  // About page
  about_title: string
  about_description: string
  about_main_image: string
  about_second_image: string
  about_staff_heading: string
  about_staff_description: string
  // Contact page
  contact_hero_image: string
  contact_title: string
  contact_hero_description: string
  contact_info_title: string
  contact_info_description: string
  contact_form_title: string
  contact_form_description: string
  contact_map_background: string
  contact_map_title: string
  contact_map_description: string
  // SEO
  site_url: string
  default_meta_title: string
  default_meta_description: string
  default_og_image: string
  site_favicon: string
  google_analytics_id: string
  google_search_console_id: string
  // Card-to-card payment
  bank_card_number: string
  bank_card_holder: string
  bank_name: string
}

const defaultSettings = (): Settings => ({
  store_name: 'کافه استور',
  store_slogan: 'طعمی متفاوت از زندگی',
  store_logo: '',
  store_dark_logo: '',
  store_inner_logo: '',
  store_inner_dark_logo: '',
  store_phone: '02112345678',
  store_mobile: '09121234567',
  store_email: 'info@coffee-store.com',
  store_address: 'تهران، خیابان ولیعصر، نبش کوچه گل',
  store_working_hours: '۸ صبح تا ۱۲ شب',
  store_instagram: '@coffeestore_ir',
  store_telegram: '@coffeestore',
  store_description: '',
  footer_background: '/images/footer.webp',
  footer_links: [
    { label: 'محصولات', url: '/products' },
    { label: 'درباره ما', url: '/about' },
    { label: 'تماس با ما', url: '/contact' },
  ],
  header_links: [
    { label: 'خانه', url: '/' },
    { label: 'محصولات', url: '/products' },
    { label: 'مقالات', url: '/articles' },
    { label: 'درباره ما', url: '/about' },
    { label: 'تماس', url: '/contact' },
  ],
  about_title: 'درباره ما',
  about_description: 'ما یک فروشگاه تخصصی قهوه هستیم که با افتخار بهترین دانه‌های قهوه را از نقاط مختلف جهان انتخاب و به شما عزیزان ارائه می‌دهیم.',
  about_main_image: '/images/about/about-main.jpg',
  about_second_image: '/images/about/about-second.jpg',
  about_staff_heading: 'تیم ما',
  about_staff_description: 'با اعضای حرفه‌ای قهوه‌فروشی ما آشنا شوید',
  contact_hero_image: '/images/cup-about.png',
  contact_title: 'تماس با ما',
  contact_hero_description: 'اگر سوالی درباره محصولات، سفارش‌ها یا انتخاب قهوه مناسب دارید، خوشحال می‌شویم با ما در ارتباط باشید.',
  contact_info_title: 'اطلاعات تماس',
  contact_info_description: 'برای ثبت سفارش، پیگیری خرید یا دریافت مشاوره انتخاب قهوه، از راه‌های زیر با ما در ارتباط باشید.',
  contact_form_title: 'ارسال پیام',
  contact_form_description: 'پیامتون رو از این قسمت برای ما ارسال کنید.',
  contact_map_background: '/images/footer.webp',
  contact_map_title: 'موقعیت فروشگاه روی نقشه',
  contact_map_description: 'بعداً می‌تونی این قسمت رو با Google Map یا Leaflet جایگزین کنی.',
  site_url: 'https://beanhouse.ir',
  default_meta_title: 'کافه استور | فروشگاه تخصصی قهوه',
  default_meta_description: 'کافه استور با بیش از ۵ سال تجربه، بهترین قهوه‌ها و دسرهای تازه را با کیفیت بالا و قیمت مناسب ارائه می‌دهد.',
  default_og_image: '/images/great-coffee-bean.jpeg',
  site_favicon: '/favicon.ico',
  google_analytics_id: '',
  google_search_console_id: '',
  bank_card_number: '6037-9911-1234-5678',
  bank_card_holder: 'فروشگاه قهوه استور',
  bank_name: 'کارت مقصد فروشگاه',
})

const settings = ref<Settings>(defaultSettings())
const loaded = ref(false)
const loading = ref(false)

export function useSettings() {
  const { public: config } = useRuntimeConfig()
  const apiBase = (config.apiBase as string) || 'http://localhost:8000/api/v1'

  async function fetchSettings(options?: { force?: boolean }) {
    if (loaded.value && !options?.force) return
    if (loading.value) return

    loading.value = true
    try {
      const res = await $fetch<Record<string, unknown>>(apiBase.replace(/\/$/, '') + '/settings')
      // API returns flat key/value map (not wrapped in { data })
      const data = (res && typeof res === 'object' && 'data' in res && res.data && typeof res.data === 'object')
        ? (res.data as Record<string, unknown>)
        : (res as Record<string, unknown>)

      if (data) {
        for (const [key, value] of Object.entries(data)) {
          if (!(key in settings.value)) continue

          if (typeof value === 'string') {
            // Keep previous/default when API sends empty string for optional media
            if (
              value === ''
              && (
                key.endsWith('_image')
                || key.endsWith('_logo')
                || key.endsWith('_background')
                || key.endsWith('_favicon')
                || key === 'site_favicon'
              )
            ) {
              continue
            }
            ;(settings.value as any)[key] = value
          } else if (value != null && (key === 'footer_links' || key === 'header_links')) {
            // already handled below if string
          } else if (value != null && typeof value !== 'object') {
            ;(settings.value as any)[key] = String(value)
          }
        }

        // parse JSON fields — keep defaults if API returns empty
        if (data.footer_links && typeof data.footer_links === 'string') {
          try {
            const parsed = JSON.parse(data.footer_links)
            if (Array.isArray(parsed) && parsed.length > 0) {
              settings.value.footer_links = parsed
            }
          } catch { /* ignore */ }
        }
        if (data.header_links && typeof data.header_links === 'string') {
          try {
            const parsed = JSON.parse(data.header_links)
            if (Array.isArray(parsed) && parsed.length > 0) {
              settings.value.header_links = parsed
            }
          } catch { /* ignore */ }
        }
      }

      loaded.value = true
    } catch (e) {
      console.warn('Failed to load settings from API, using defaults', e)
      // keep defaults
    } finally {
      loading.value = false
    }
  }

  return { settings, fetchSettings, loaded, loading }
}

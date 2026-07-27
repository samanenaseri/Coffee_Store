import axios, { AxiosHeaders, type AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

/** Keep base64 under PHP post_max_size (base64 adds ~33% overhead). */
const BASE64_MAX_BYTES = 1.5 * 1024 * 1024
/** Compress raster images above this size before upload. */
const COMPRESS_ABOVE_BYTES = 800 * 1024
/** Absolute max source file size accepted on client (before compress). */
const MAX_SOURCE_BYTES = 40 * 1024 * 1024
/** Target max size after compression. */
const MAX_OUTPUT_BYTES = 8 * 1024 * 1024
/** Resize long edge for photos before upload (SVG skipped). */
const MAX_IMAGE_EDGE = 1920
const JPEG_QUALITY = 0.82

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers = AxiosHeaders.from(config.headers || {})
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    const headers = AxiosHeaders.from(config.headers || {})
    headers.delete('Content-Type')
    headers.delete('content-type')
    config.headers = headers
  } else if (
    config.data &&
    typeof config.data === 'object' &&
    !(config.data instanceof FormData)
  ) {
    const headers = AxiosHeaders.from(config.headers || {})
    if (!headers.get('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    config.headers = headers
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

function isSvg(file: File): boolean {
  return (
    file.type === 'image/svg+xml' ||
    file.type === 'image/svg' ||
    /\.svg$/i.test(file.name)
  )
}

function isRasterImage(file: File): boolean {
  if (isSvg(file)) return false
  return file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name)
}

/** Detect original image format so we never rewrite the extension. */
function getOriginalImageFormat(file: File): {
  ext: string
  mime: string
  /** Formats that canvas can re-encode safely */
  canReencode: boolean
  usesQuality: boolean
} {
  const name = (file.name || '').toLowerCase()
  const type = (file.type || '').toLowerCase()
  const fromName = (name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase()

  if (type.includes('png') || fromName === 'png') {
    return { ext: 'png', mime: 'image/png', canReencode: true, usesQuality: false }
  }
  if (type.includes('webp') || fromName === 'webp') {
    return { ext: 'webp', mime: 'image/webp', canReencode: true, usesQuality: true }
  }
  if (type.includes('gif') || fromName === 'gif') {
    // Canvas flattens animation — keep original bytes + extension
    return { ext: 'gif', mime: 'image/gif', canReencode: false, usesQuality: false }
  }
  if (type.includes('bmp') || fromName === 'bmp') {
    return { ext: 'bmp', mime: 'image/bmp', canReencode: false, usesQuality: false }
  }
  if (type.includes('icon') || fromName === 'ico') {
    return { ext: 'ico', mime: type || 'image/x-icon', canReencode: false, usesQuality: false }
  }
  if (type.includes('jpeg') || type.includes('jpg') || fromName === 'jpg' || fromName === 'jpeg') {
    // Keep jpeg vs jpg exactly as uploaded
    const ext = fromName === 'jpeg' ? 'jpeg' : fromName === 'jpg' ? 'jpg' : 'jpg'
    return { ext, mime: 'image/jpeg', canReencode: true, usesQuality: true }
  }

  if (fromName && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'ico'].includes(fromName)) {
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp',
      ico: 'image/x-icon',
    }
    return {
      ext: fromName,
      mime: mimeMap[fromName] || type || 'application/octet-stream',
      canReencode: fromName === 'png' || fromName === 'webp' || fromName === 'jpg' || fromName === 'jpeg',
      usesQuality: fromName === 'jpg' || fromName === 'jpeg' || fromName === 'webp',
    }
  }

  // Unknown raster: do not invent a new extension
  return {
    ext: fromName || 'bin',
    mime: type || 'application/octet-stream',
    canReencode: false,
    usesQuality: false,
  }
}

/**
 * Optionally compress large JPEG photos only.
 * PNG / WebP / GIF / BMP / SVG are ALWAYS returned as the original File
 * so the extension and bytes never change.
 */
async function prepareFileForUpload(
  file: File,
  options?: { keepOriginal?: boolean },
): Promise<File> {
  // Absolute: no processing — keep name, mime, bytes as selected by user
  if (options?.keepOriginal) {
    return file
  }

  if (!isRasterImage(file)) {
    return file
  }

  const format = getOriginalImageFormat(file)

  // Never convert / re-encode non-JPEG formats (prevents png → jpg)
  if (format.ext !== 'jpg' && format.ext !== 'jpeg') {
    return file
  }

  // Small enough already — keep exact original file + extension
  if (file.size <= COMPRESS_ABOVE_BYTES) {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    let edge = MAX_IMAGE_EDGE
    // More aggressive resize for very large sources
    if (file.size > 8 * 1024 * 1024) {
      edge = 1600
    }
    if (file.size > 15 * 1024 * 1024) {
      edge = 1400
    }

    const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    let quality = JPEG_QUALITY
    let blob: Blob | null = null

    for (let attempt = 0; attempt < 4; attempt++) {
      blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality)
      })
      if (!blob) break
      if (blob.size <= MAX_OUTPUT_BYTES) break
      quality = Math.max(0.55, quality - 0.12)
      // If still huge, shrink canvas further
      if (blob.size > MAX_OUTPUT_BYTES && attempt >= 1) {
        const shrink = 0.85
        const sw = Math.max(1, Math.round(canvas.width * shrink))
        const sh = Math.max(1, Math.round(canvas.height * shrink))
        const tmp = document.createElement('canvas')
        tmp.width = sw
        tmp.height = sh
        const tctx = tmp.getContext('2d')
        if (tctx) {
          tctx.drawImage(canvas, 0, 0, sw, sh)
          canvas.width = sw
          canvas.height = sh
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, sw, sh)
          ctx.drawImage(tmp, 0, 0)
        }
      }
    }

    if (!blob) {
      return file
    }

    // Keep original jpg vs jpeg suffix from the uploaded file
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'upload'
    return new File([blob], `${baseName}.${format.ext}`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}

async function parseJsonResponse(res: Response): Promise<any> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    // PHP sometimes returns plain text like: The POST data is too large.
    return { message: text.trim() }
  }
}

async function uploadMultipart(
  file: File,
  folder: string,
  token: string,
): Promise<{ url: string; path: string }> {
  const formData = new FormData()
  formData.append('file', file, file.name)
  formData.append('folder', folder)

  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      // no Content-Type — browser sets multipart boundary
    },
    body: formData,
  })

  const data = await parseJsonResponse(res)

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/login'
    throw new Error('نشست منقضی شده است. دوباره وارد شوید.')
  }

  if (!res.ok) {
    const message = data?.message || `آپلود ناموفق بود (کد ${res.status})`
    const error: any = new Error(message)
    error.response = { status: res.status, data }
    throw error
  }

  if (!data?.url) {
    throw new Error('پاسخ سرور فاقد آدرس تصویر است')
  }

  return { url: data.url, path: data.path }
}

async function uploadBase64(
  file: File,
  folder: string,
  token: string,
): Promise<{ url: string; path: string }> {
  if (file.size > BASE64_MAX_BYTES) {
    throw new Error(
      'حجم فایل برای این روش آپلود زیاد است. لطفاً تصویر کوچک‌تری انتخاب کنید (حداکثر حدود ۱.۵ مگابایت).',
    )
  }

  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('خواندن فایل ناموفق بود'))
    reader.readAsDataURL(file)
  })

  if (!content.startsWith('data:')) {
    throw new Error('خواندن فایل برای آپلود ناموفق بود')
  }

  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      folder,
      filename: file.name || 'upload.png',
      content,
    }),
  })

  const data = await parseJsonResponse(res)

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/login'
    throw new Error('نشست منقضی شده است. دوباره وارد شوید.')
  }

  if (!res.ok) {
    const rawMsg = String(data?.message || '')
    if (/post data is too large/i.test(rawMsg)) {
      throw new Error(
        'حجم داده ارسالی بیش از حد مجاز سرور است. تصویر کوچک‌تری انتخاب کنید یا سرور PHP را ری‌استارت کنید.',
      )
    }
    const message = rawMsg || `آپلود ناموفق بود (کد ${res.status})`
    const error: any = new Error(message)
    error.response = { status: res.status, data }
    throw error
  }

  if (!data?.url) {
    throw new Error('پاسخ سرور فاقد آدرس تصویر است')
  }

  return { url: data.url, path: data.path }
}

export type UploadAdminFileOptions = {
  /**
   * When true, the file is uploaded exactly as selected
   * (no compress / resize / format change). Use for logos.
   */
  keepOriginal?: boolean
}

/**
 * Upload image/svg for admin.
 * 1) Optionally compress large JPEG only (never converts PNG→JPG)
 * 2) Try multipart (efficient)
 * 3) Fallback to base64 for small files only
 */
export async function uploadAdminFile(
  file: File,
  folder = 'uploads',
  options?: UploadAdminFileOptions,
): Promise<{ url: string; path: string }> {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    throw new Error('وارد حساب مدیریت نشده‌اید. دوباره وارد شوید.')
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('حجم فایل بیشتر از ۴۰ مگابایت است. لطفاً تصویر کوچک‌تری انتخاب کنید.')
  }

  // Ensure the original filename/extension is present for the server
  const format = getOriginalImageFormat(file)
  let source = file
  if (!/\.[a-z0-9]+$/i.test(file.name) && format.ext && format.ext !== 'bin') {
    source = new File([file], `upload.${format.ext}`, {
      type: format.mime || file.type,
      lastModified: file.lastModified,
    })
  }

  const prepared = await prepareFileForUpload(source, {
    keepOriginal: options?.keepOriginal === true,
  })

  if (prepared.size > MAX_OUTPUT_BYTES && !options?.keepOriginal) {
    throw new Error(
      'پس از فشرده‌سازی هنوز حجم فایل زیاد است. لطفاً تصویر کوچک‌تری انتخاب کنید.',
    )
  }

  if (prepared.size > 20 * 1024 * 1024) {
    throw new Error('حجم فایل نباید بیشتر از ۲۰ مگابایت باشد.')
  }

  try {
    return await uploadMultipart(prepared, folder, token)
  } catch (multipartError: any) {
    const msg = String(multipartError?.message || '')
    // Only fallback when multipart parsing failed / empty file — not for auth/size validation
    const canFallback =
      prepared.size <= BASE64_MAX_BYTES &&
      (/فایل ارسال نشده/i.test(msg) ||
        /ارسال نشده/i.test(msg) ||
        multipartError?.response?.status === 422)

    if (!canFallback) {
      throw multipartError
    }

    try {
      return await uploadBase64(prepared, folder, token)
    } catch (base64Error: any) {
      // Prefer clearer of the two messages
      const bmsg = String(base64Error?.message || '')
      if (/post data is too large/i.test(bmsg)) {
        throw new Error(
          'حجم تصویر زیاد است. یک فایل کوچک‌تر (زیر ۲ مگابایت) یا SVG انتخاب کنید.',
        )
      }
      throw base64Error
    }
  }
}

export function useAdminApi() {
  return api
}

export default api

export type { AxiosRequestConfig }

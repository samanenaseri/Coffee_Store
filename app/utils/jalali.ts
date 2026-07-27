/**
 * Jalali (Persian) calendar helpers.
 * Conversions based on the well-known algorithm used by jalaali-js.
 */

export interface JalaliDate {
  jy: number
  jm: number
  jd: number
}

export interface GregorianDate {
  gy: number
  gm: number
  gd: number
}

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const

const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const

const PERSIAN_WEEKDAYS_FULL = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
] as const

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d)
}

export function getPersianMonthName(month: number): string {
  return PERSIAN_MONTHS[month - 1] ?? ''
}

export function getPersianWeekdays(): readonly string[] {
  return PERSIAN_WEEKDAYS
}

export function getPersianWeekdaysFull(): readonly string[] {
  return PERSIAN_WEEKDAYS_FULL
}

export function getPersianMonths(): readonly string[] {
  return PERSIAN_MONTHS
}

function div(a: number, b: number): number {
  return Math.trunc(a / b)
}

export function toJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let jy = gy <= 1600 ? 0 : 979
  let gy2 = gy <= 1600 ? gy - 621 : gy - 1600
  const days =
    365 * gy2
    + div(gy2 + 3, 4)
    - div(gy2 + 99, 100)
    + div(gy2 + 399, 400)
    - 80
    + gd
    + g_d_m[gm - 1]!
    + (gm > 2 && ((gy2 % 4 === 0 && gy2 % 100 !== 0) || gy2 % 400 === 0) ? 1 : 0)

  jy += 33 * div(days, 12053)
  let remaining = days % 12053
  jy += 4 * div(remaining, 1461)
  remaining %= 1461

  if (remaining > 365) {
    jy += div(remaining - 1, 365)
    remaining = (remaining - 1) % 365
  }

  let jm: number
  let jd: number
  if (remaining < 186) {
    jm = 1 + div(remaining, 31)
    jd = 1 + (remaining % 31)
  } else {
    jm = 7 + div(remaining - 186, 30)
    jd = 1 + ((remaining - 186) % 30)
  }

  return { jy, jm, jd }
}

export function toGregorian(jy: number, jm: number, jd: number): GregorianDate {
  let gy = jy <= 979 ? 621 : 1600
  const jy2 = jy <= 979 ? jy : jy - 979

  let days =
    365 * jy2
    + div(jy2, 33) * 8
    + div((jy2 % 33) + 3, 4)
    + 78
    + jd
    + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186)

  gy += 400 * div(days, 146097)
  days %= 146097

  if (days > 36524) {
    gy += 100 * div(--days, 36524)
    days %= 36524
    if (days >= 365) days++
  }

  gy += 4 * div(days, 1461)
  days %= 1461

  if (days > 365) {
    gy += div(days - 1, 365)
    days = (days - 1) % 365
  }

  let gd = days + 1
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ]

  let gm = 0
  for (gm = 1; gm <= 12 && gd > sal_a[gm]!; gm++) {
    gd -= sal_a[gm]!
  }

  return { gy, gm, gd }
}

export function isJalaliLeap(jy: number): boolean {
  const r = (((jy - (jy > 0 ? 474 : 473)) % 2820) + 474 + 38) * 682
  return (r % 2816) < 682
}

export function jalaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31
  if (jm <= 11) return 30
  return isJalaliLeap(jy) ? 30 : 29
}

/** Saturday = 0 … Friday = 6 (Persian week start) */
export function jalaliWeekday(jy: number, jm: number, jd: number): number {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  // JS: 0=Sun … 6=Sat → Persian: 0=Sat … 6=Fri
  const jsDay = new Date(gy, gm - 1, gd).getDay()
  return (jsDay + 1) % 7
}

export function dateToGregorianString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseGregorianString(value: string): GregorianDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) return null
  const gy = Number(match[1])
  const gm = Number(match[2])
  const gd = Number(match[3])
  if (!gy || gm < 1 || gm > 12 || gd < 1 || gd > 31) return null
  return { gy, gm, gd }
}

export function gregorianStringToJalali(value: string): JalaliDate | null {
  const g = parseGregorianString(value)
  if (!g) return null
  return toJalali(g.gy, g.gm, g.gd)
}

export function jalaliToGregorianString(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd)
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`
}

export function formatJalaliDisplay(value: string, withWeekday = false): string {
  const j = gregorianStringToJalali(value)
  if (!j) return ''
  const datePart = toPersianDigits(
    `${j.jd} ${getPersianMonthName(j.jm)} ${j.jy}`,
  )
  if (!withWeekday) return datePart
  const wd = jalaliWeekday(j.jy, j.jm, j.jd)
  return `${PERSIAN_WEEKDAYS_FULL[wd]}، ${datePart}`
}

export function todayGregorianString(): string {
  return dateToGregorianString(new Date())
}

export function compareGregorianStrings(a: string, b: string): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}

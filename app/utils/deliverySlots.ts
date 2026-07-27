/**
 * Delivery date/slot helpers for checkout.
 * - First available day is at least 3 business days after today
 * - Business days exclude Friday (جمعه) as non-working
 * - Each day has two slots: morning 08:00–13:00, afternoon 13:00–21:00
 */

export type DeliverySlotKey = 'morning' | 'afternoon'

export interface DeliverySlotOption {
  /** Stored in orders.delivery_day: YYYY-MM-DD_morning|afternoon */
  value: string
  date: string // YYYY-MM-DD
  slot: DeliverySlotKey
  weekdayLabel: string
  dateLabel: string
  slotLabel: string
  fullLabel: string
}

const WEEKDAY_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه']

function toYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Friday = non-working (Iran weekend) */
export function isBusinessDay(d: Date): boolean {
  return d.getDay() !== 5 // 5 = Friday
}

/**
 * First calendar day that is the N-th business day after `from` (exclusive of today).
 * Example: from Monday, minBusinessDays=3 → Thursday.
 */
export function firstAvailableDeliveryDate(
  from: Date = new Date(),
  minBusinessDays = 3,
): Date {
  let cursor = startOfLocalDay(from)
  // start counting from tomorrow
  cursor = addDays(cursor, 1)

  let counted = 0
  // safety cap
  for (let i = 0; i < 60; i++) {
    if (isBusinessDay(cursor)) {
      counted++
      if (counted >= minBusinessDays) {
        return cursor
      }
    }
    cursor = addDays(cursor, 1)
  }
  return cursor
}

function slotLabel(slot: DeliverySlotKey): string {
  return slot === 'morning' ? '۸ صبح تا ۱ ظهر' : '۱ ظهر تا ۹ شب'
}

function formatFaDate(d: Date): string {
  try {
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return toYmd(d)
  }
}

function weekdayLabel(d: Date): string {
  return WEEKDAY_FA[d.getDay()] || ''
}

/**
 * Build selectable delivery options: N business days starting from first available,
 * each with morning + afternoon slots.
 */
export function buildDeliverySlotOptions(
  options?: {
    minBusinessDays?: number
    businessDaysCount?: number
    from?: Date
  },
): DeliverySlotOption[] {
  const minBusinessDays = options?.minBusinessDays ?? 3
  const businessDaysCount = options?.businessDaysCount ?? 10
  const from = options?.from ?? new Date()

  let day = firstAvailableDeliveryDate(from, minBusinessDays)
  const result: DeliverySlotOption[] = []
  let daysCollected = 0

  for (let i = 0; i < 60 && daysCollected < businessDaysCount; i++) {
    if (isBusinessDay(day)) {
      const date = toYmd(day)
      const wLabel = weekdayLabel(day)
      const dLabel = formatFaDate(day)

      for (const slot of ['morning', 'afternoon'] as DeliverySlotKey[]) {
        const sLabel = slotLabel(slot)
        result.push({
          value: `${date}_${slot}`,
          date,
          slot,
          weekdayLabel: wLabel,
          dateLabel: dLabel,
          slotLabel: sLabel,
          fullLabel: `${wLabel} ${dLabel} — ${sLabel}`,
        })
      }
      daysCollected++
    }
    day = addDays(day, 1)
  }

  return result
}

export function parseDeliverySlotValue(value: string | null | undefined): {
  date: string | null
  slot: DeliverySlotKey | null
  label: string
} {
  if (!value) {
    return { date: null, slot: null, label: '' }
  }

  // New format: YYYY-MM-DD_morning
  const m = value.match(/^(\d{4}-\d{2}-\d{2})_(morning|afternoon)$/)
  if (m) {
    const date = m[1]
    const slot = m[2] as DeliverySlotKey
    const d = new Date(date + 'T12:00:00')
    return {
      date,
      slot,
      label: `${weekdayLabel(d)} ${formatFaDate(d)} — ${slotLabel(slot)}`,
    }
  }

  // Legacy weekday-only values
  const legacy: Record<string, string> = {
    saturday: 'شنبه',
    sunday: 'یکشنبه',
    monday: 'دوشنبه',
    tuesday: 'سه‌شنبه',
    wednesday: 'چهارشنبه',
    thursday: 'پنجشنبه',
    friday: 'جمعه',
  }
  return {
    date: null,
    slot: null,
    label: legacy[value] || value,
  }
}

<script setup lang="ts">
import {
  compareGregorianStrings,
  formatJalaliDisplay,
  getPersianMonthName,
  getPersianMonths,
  getPersianWeekdays,
  gregorianStringToJalali,
  jalaliMonthLength,
  jalaliToGregorianString,
  jalaliWeekday,
  toPersianDigits,
  todayGregorianString,
} from '~/utils/jalali'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    /** Gregorian YYYY-MM-DD — defaults to today */
    max?: string | null
    /** Gregorian YYYY-MM-DD */
    min?: string | null
    placeholder?: string
    disabled?: boolean
    hasError?: boolean
    id?: string
  }>(),
  {
    modelValue: '',
    max: null,
    min: null,
    placeholder: 'انتخاب تاریخ',
    disabled: false,
    hasError: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const maxDate = computed(() => props.max ?? todayGregorianString())
const minDate = computed(() => props.min ?? null)

const displayText = computed(() => {
  if (!props.modelValue) return ''
  return formatJalaliDisplay(props.modelValue, true)
})

const initialJalali = computed(() => {
  const fromValue = props.modelValue ? gregorianStringToJalali(props.modelValue) : null
  if (fromValue) return fromValue
  const fromMax = gregorianStringToJalali(maxDate.value)
  return fromMax ?? { jy: 1403, jm: 1, jd: 1 }
})

const viewYear = ref(initialJalali.value.jy)
const viewMonth = ref(initialJalali.value.jm)

watch(
  () => props.modelValue,
  (val) => {
    const j = val ? gregorianStringToJalali(val) : null
    if (j) {
      viewYear.value = j.jy
      viewMonth.value = j.jm
    }
  },
)

const weekdays = getPersianWeekdays()
const months = getPersianMonths()

const calendarCells = computed(() => {
  const jy = viewYear.value
  const jm = viewMonth.value
  const length = jalaliMonthLength(jy, jm)
  const firstWeekday = jalaliWeekday(jy, jm, 1)

  const cells: Array<{
    key: string
    day: number | null
    gregorian: string | null
    disabled: boolean
    selected: boolean
    isToday: boolean
  }> = []

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({
      key: `empty-${i}`,
      day: null,
      gregorian: null,
      disabled: true,
      selected: false,
      isToday: false,
    })
  }

  const today = todayGregorianString()

  for (let day = 1; day <= length; day++) {
    const gregorian = jalaliToGregorianString(jy, jm, day)
    let disabled = false
    if (maxDate.value && compareGregorianStrings(gregorian, maxDate.value) > 0) {
      disabled = true
    }
    if (minDate.value && compareGregorianStrings(gregorian, minDate.value) < 0) {
      disabled = true
    }

    cells.push({
      key: gregorian,
      day,
      gregorian,
      disabled,
      selected: props.modelValue === gregorian,
      isToday: gregorian === today,
    })
  }

  return cells
})

const headerLabel = computed(() =>
  toPersianDigits(`${getPersianMonthName(viewMonth.value)} ${viewYear.value}`),
)

function prevMonth() {
  if (viewMonth.value === 1) {
    viewMonth.value = 12
    viewYear.value -= 1
  } else {
    viewMonth.value -= 1
  }
}

function nextMonth() {
  if (viewMonth.value === 12) {
    viewMonth.value = 1
    viewYear.value += 1
  } else {
    viewMonth.value += 1
  }
}

function selectDay(cell: { gregorian: string | null; disabled: boolean }) {
  if (!cell.gregorian || cell.disabled) return
  emit('update:modelValue', cell.gregorian)
  emit('change', cell.gregorian)
  open.value = false
}

function selectToday() {
  const today = todayGregorianString()
  if (maxDate.value && compareGregorianStrings(today, maxDate.value) > 0) return
  if (minDate.value && compareGregorianStrings(today, minDate.value) < 0) return
  emit('update:modelValue', today)
  emit('change', today)
  const j = gregorianStringToJalali(today)
  if (j) {
    viewYear.value = j.jy
    viewMonth.value = j.jm
  }
  open.value = false
}

function clearValue() {
  emit('update:modelValue', '')
  emit('change', '')
  open.value = false
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    const j = props.modelValue
      ? gregorianStringToJalali(props.modelValue)
      : gregorianStringToJalali(maxDate.value)
    if (j) {
      viewYear.value = j.jy
      viewMonth.value = j.jm
    }
  }
}

function onDocClick(e: MouseEvent) {
  if (!open.value) return
  const el = rootRef.value
  if (el && !el.contains(e.target as Node)) {
    open.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      :id="id"
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-xl border bg-background px-4 py-3 text-right text-text outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20 disabled:cursor-not-allowed disabled:opacity-60"
      :class="hasError ? 'border-red-400' : (open ? 'border-amber-700 ring-2 ring-amber-700/20' : 'border-input')"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <span
        class="truncate text-sm sm:text-base"
        :class="displayText ? 'text-text font-medium' : 'text-lightText'"
      >
        {{ displayText || placeholder }}
      </span>
      <span class="shrink-0 text-lightText" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </span>
    </button>

    <div
      v-if="open"
      class="absolute z-50 mt-2 w-full min-w-[18rem] rounded-2xl border border-input bg-menu p-3 shadow-xl"
      role="dialog"
      aria-label="تقویم شمسی"
      dir="rtl"
    >
      <!-- Month navigation -->
      <div class="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          class="flex size-9 items-center justify-center rounded-xl border border-input text-text hover:bg-background transition"
          aria-label="ماه قبل"
          @click="prevMonth"
        >
          ›
        </button>
        <div class="text-sm font-bold text-text">
          {{ headerLabel }}
        </div>
        <button
          type="button"
          class="flex size-9 items-center justify-center rounded-xl border border-input text-text hover:bg-background transition"
          aria-label="ماه بعد"
          @click="nextMonth"
        >
          ‹
        </button>
      </div>

      <!-- Month quick select -->
      <div class="mb-3">
        <select
          v-model.number="viewMonth"
          class="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-text outline-none focus:border-amber-700"
        >
          <option
            v-for="(name, idx) in months"
            :key="name"
            :value="idx + 1"
          >
            {{ name }}
          </option>
        </select>
      </div>

      <!-- Weekdays -->
      <div class="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-lightText">
        <span
          v-for="wd in weekdays"
          :key="wd"
          class="py-1"
        >
          {{ wd }}
        </span>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="cell in calendarCells"
          :key="cell.key"
          type="button"
          class="aspect-square rounded-lg text-sm transition"
          :class="{
            'invisible pointer-events-none': cell.day == null,
            'text-lightText/40 cursor-not-allowed': cell.day != null && cell.disabled,
            'bg-amber-800 text-white font-bold shadow-sm': cell.selected,
            'ring-1 ring-amber-600/50 font-medium': cell.isToday && !cell.selected,
            'hover:bg-amber-50 dark:hover:bg-amber-950/30 text-text': cell.day != null && !cell.disabled && !cell.selected,
          }"
          :disabled="cell.day == null || cell.disabled"
          @click="selectDay(cell)"
        >
          <span v-if="cell.day != null">{{ toPersianDigits(cell.day) }}</span>
        </button>
      </div>

      <!-- Actions -->
      <div class="mt-3 flex items-center justify-between gap-2 border-t border-input pt-3">
        <button
          type="button"
          class="text-xs text-lightText hover:text-text transition"
          @click="clearValue"
        >
          پاک کردن
        </button>
        <button
          type="button"
          class="rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-900 transition"
          @click="selectToday"
        >
          امروز
        </button>
      </div>
    </div>
  </div>
</template>

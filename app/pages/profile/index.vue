<script setup lang="ts">
import { reactive, watch } from "vue"
import {
  RiMailLine,
  RiPhoneLine,
  RiSaveLine,
  RiUserLine,
} from "@remixicon/vue"

definePageMeta({
  layout: "profile",
})

const userStore = useUserStore()

const form = reactive({
  name: userStore.user.name,
  phone: userStore.user.phone,
  email: userStore.user.email,
  birthDate: userStore.user.birthDate,
})

const errors = reactive({
  name: "",
  phone: "",
  email: "",
})

const successMessage = ref("")

const validateForm = () => {
  let valid = true

  errors.name = ""
  errors.phone = ""
  errors.email = ""
  successMessage.value = ""

  const name = form.name.trim()
  const phone = form.phone.trim()
  const email = form.email.trim()

  if (!name) {
    errors.name = "نام و نام خانوادگی الزامی است"
    valid = false
  }

  if (!phone) {
    errors.phone = "شماره موبایل الزامی است"
    valid = false
  } else if (!/^09\d{9}$/.test(phone)) {
    errors.phone = "شماره موبایل معتبر نیست"
    valid = false
  }

  if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "ایمیل واردشده معتبر نیست"
    valid = false
  }

  return valid
}

const saveProfile = () => {
  if (!validateForm()) return

  userStore.setUser({
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    birthDate: form.birthDate,
    isGuest: false,
  })

  successMessage.value = "اطلاعات کاربری با موفقیت ذخیره شد"
}

watch(
    () => form.name,
    value => {
      if (value.trim()) {
        errors.name = ""
      }

      successMessage.value = ""
    },
)

watch(
    () => form.phone,
    value => {
      if (/^09\d{9}$/.test(value.trim())) {
        errors.phone = ""
      }

      successMessage.value = ""
    },
)

watch(
    () => form.email,
    value => {
      if (
          !value.trim() ||
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ) {
        errors.email = ""
      }

      successMessage.value = ""
    },
)
</script>

<template>
  <section>
    <!-- عنوان -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-text">
        اطلاعات کاربری
      </h1>

      <p class="mt-2 text-sm leading-7 text-lightText">
        اطلاعات شخصی خود را مشاهده و ویرایش کنید.
      </p>
    </div>

    <!-- خلاصه کاربر -->
    <div
        class="mb-8 flex flex-col gap-4 rounded-2xl bg-menu p-5 sm:flex-row sm:items-center"
    >
      <div
          class="flex size-16 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      >
        <RiUserLine class="size-8" />
      </div>

      <div class="min-w-0">
        <h2 class="truncate text-lg font-bold text-text">
          {{ form.name || "کاربر فروشگاه" }}
        </h2>

        <div
            class="mt-2 flex flex-col gap-2 text-sm text-lightText sm:flex-row sm:gap-5"
        >
          <span class="flex items-center gap-2">
            <RiPhoneLine class="size-4" />
            {{ form.phone || "شماره موبایل ثبت نشده" }}
          </span>

          <span
              v-if="form.email"
              class="flex items-center gap-2"
          >
            <RiMailLine class="size-4" />
            {{ form.email }}
          </span>
        </div>
      </div>
    </div>

    <!-- فرم -->
    <form
        class="max-w-2xl space-y-5"
        @submit.prevent="saveProfile"
    >
      <BaseInput
          v-model="form.name"
          label="نام و نام خانوادگی"
          placeholder="نام و نام خانوادگی"
          :error="errors.name"
      />

      <BaseInput
          v-model="form.phone"
          label="شماره موبایل"
          type="tel"
          inputmode="numeric"
          maxlength="11"
          placeholder="09123456789"
          :error="errors.phone"
      />

      <BaseInput
          v-model="form.email"
          label="ایمیل"
          type="email"
          placeholder="example@email.com"
          :error="errors.email"
      />

      <BaseInput
          v-model="form.birthDate"
          label="تاریخ تولد"
          type="date"
      />

      <div
          v-if="successMessage"
          class="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400"
      >
        {{ successMessage }}
      </div>

      <BaseButton
          type="submit"
          variant="primary"
          size="sm"
          :start-icon="RiSaveLine"
      >
        ذخیره تغییرات
      </BaseButton>
    </form>
  </section>
</template>
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
  middleware: ['auth'],
})

const { user: authUser } = useAuth()
const userStore = useUserStore()
const notification = useNotification()

const authUserData = computed(() => authUser.value as Record<string, any> || {})

const form = reactive({
  name: authUserData.value.name || "",
  phone: authUserData.value.phone || "",
  email: authUserData.value.email || "",
})

const errors = reactive({
  name: "",
  email: "",
})

const pending = ref(false)

const validateForm = () => {
  let valid = true

  errors.name = ""
  errors.email = ""

  const name = form.name.trim()

  if (!name) {
    errors.name = "نام و نام خانوادگی الزامی است"
    valid = false
  }

  const email = form.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "ایمیل واردشده معتبر نیست"
    valid = false
  }

  return valid
}

const saveProfile = async () => {
  if (!validateForm()) return

  pending.value = true
  try {
    await userStore.updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
    })
    // success(title, message?) — only the main text is shown as title when message is omitted
    notification.success('اطلاعات کاربری با موفقیت ذخیره شد')
  } catch (e: any) {
    notification.error(
      e?.data?.message || e?.message || 'ذخیره اطلاعات با خطا مواجه شد',
    )
  } finally {
    pending.value = false
  }
}

watch(
  () => form.name,
  (value) => {
    if (value.trim()) {
      errors.name = ""
    }
  },
)

watch(
  () => form.email,
  (value) => {
    if (!value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      errors.email = ""
    }
  },
)
</script>

<template>
  <section>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-text">
        اطلاعات کاربری
      </h1>

      <p class="mt-2 text-sm leading-7 text-lightText">
        اطلاعات شخصی خود را مشاهده و ویرایش کنید.
      </p>
    </div>

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
              v-if="form.email && !form.email.endsWith('@phone.coffeestore.local')"
              class="flex items-center gap-2"
          >
            <RiMailLine class="size-4" />
            {{ form.email }}
          </span>
        </div>
      </div>
    </div>

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
          :model-value="form.phone"
          label="شماره موبایل"
          type="tel"
          inputmode="numeric"
          maxlength="11"
          placeholder="09123456789"
          disabled
      />

      <BaseInput
          v-model="form.email"
          label="ایمیل"
          type="email"
          placeholder="example@email.com"
          :error="errors.email"
      />

      <BaseButton
          type="submit"
          variant="primary"
          size="sm"
          :start-icon="RiSaveLine"
          :disabled="pending"
      >
        {{ pending ? "در حال ذخیره..." : "ذخیره تغییرات" }}
      </BaseButton>
    </form>
  </section>
</template>

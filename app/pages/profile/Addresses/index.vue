<script setup lang="ts">
import type { Address } from '#shared/address'
import EditAddressModal from '~/components/profile/address/EditAddressModal.vue'

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})

useSeoMeta({
  title: 'آدرس‌های من',
  robots: 'noindex, nofollow',
})

const addressStore = useAddressStore()
const notification = useNotification()

const {
  items,
  pending,
  submitting,
  error,
  actionError,
  totalItems,
} = storeToRefs(addressStore)


const deleteModalOpen = ref(false)
const selectedAddressId = ref<number | null>(null)
const editModalOpen = ref(false)
const selectedAddress = computed(() => {
  if (!selectedAddressId.value) {
    return null
  }

  return addressStore.getAddressById(
      selectedAddressId.value,
  )
})
const submitEdit = async (payload: Address & { id: number }) => {
  const { id, ...fields } = payload
  if (!id) {
    notification.error('خطا', 'شناسه آدرس نامعتبر است')
    return
  }

  const response = await addressStore.updateAddress(id, fields)

  if (!response) {
    notification.error(addressStore.actionError || 'ویرایش آدرس ناموفق بود')
    return
  }

  editModalOpen.value = false
  selectedAddressId.value = null
  notification.success('آدرس با موفقیت ویرایش شد')
}

const openDeleteModal = (id: number) => {
  selectedAddressId.value = id
  addressStore.clearActionError()
  deleteModalOpen.value = true
}

const closeDeleteModal = () => {
  if (submitting.value) {
    return
  }

  selectedAddressId.value = null
  deleteModalOpen.value = false
  addressStore.clearActionError()
}

const confirmDelete = async () => {
  if (!selectedAddressId.value) {
    return
  }

  const response = await addressStore.deleteAddress(
      selectedAddressId.value,
  )

  if (!response) {
    notification.error(
        'حذف آدرس ناموفق بود',
        actionError.value,
    )

    return
  }

  notification.success(
      'آدرس حذف شد',
      response.message,
  )

  closeDeleteModal()
}

const setAsDefault = async (id: number) => {
  const response = await addressStore.setDefaultAddress(id)

  if (!response) {
    notification.error(
        'تغییر آدرس پیش‌فرض ناموفق بود',
        actionError.value,
    )

    return
  }

  notification.success(
      'آدرس پیش‌فرض تغییر کرد',
      response.message,
  )
}
import type { CreateAddressPayload } from '#shared/address'
import CreateAddressModal from '~/components/profile/address/CreateAddressModal.vue'

const createModalOpen = ref(false)

const openCreateModal = () => {
  addressStore.clearActionError()
  createModalOpen.value = true
}

const submitCreate = async (
    payload: CreateAddressPayload,
) => {
  const response = await addressStore.createAddress(payload)

  if (!response) {
    notification.error(
        'ثبت آدرس ناموفق بود',
        actionError.value,
    )

    return
  }

  createModalOpen.value = false

  notification.success(
      'آدرس ثبت شد',
      response.message,
  )
}

onMounted(() => {
  addressStore.fetchAddresses()
})
</script>

<template>
  <section>
    <!-- عنوان صفحه -->
    <header
        class="mb-6 flex flex-wrap items-start justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-text">
          آدرس‌های من
        </h1>

        <p class="mt-2 text-sm text-lightText">
          آدرس‌های مورد استفاده برای ارسال سفارش‌ها را مدیریت کنید.
        </p>
      </div>

      <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800"
          @click="openCreateModal"
      >
        افزودن آدرس جدید
      </button>
    </header>

    <!-- تعداد آدرس‌ها -->
    <div
        v-if="!pending && !error"
        class="mb-5 text-sm text-lightText"
    >
      {{ totalItems }} آدرس ثبت‌شده
    </div>

    <!-- loading -->
    <div
        v-if="pending"
        class="grid gap-5 lg:grid-cols-2"
    >
      <div
          v-for="item in 4"
          :key="item"
          class="rounded-2xl border border-gray-200 bg-bg p-5 dark:border-gray-700"
      >
        <div
            class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
        />

        <div class="mt-5 space-y-3">
          <div
              class="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
          />

          <div
              class="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800"
          />

          <div
              class="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
          />
        </div>
      </div>
    </div>

    <!-- خطای دریافت -->
    <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20"
    >
      <p class="text-sm text-red-600 dark:text-red-300">
        {{ error }}
      </p>

      <button
          type="button"
          class="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          @click="addressStore.fetchAddresses(true)"
      >
        تلاش دوباره
      </button>
    </div>

    <!-- حالت خالی -->
    <div
        v-else-if="items.length === 0"
        class="rounded-2xl border border-dashed border-gray-300 px-5 py-16 text-center dark:border-gray-700"
    >
      <div
          class="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-50 text-3xl text-amber-700 dark:bg-amber-950/20"
      >
        📍
      </div>

      <h2 class="mt-5 text-lg font-bold text-text">
        هنوز آدرسی ثبت نکرده‌اید
      </h2>

      <p class="mx-auto mt-2 max-w-md text-sm leading-7 text-lightText">
        برای ثبت سفارش و انتخاب محل تحویل، اولین آدرس خود را اضافه کنید.
      </p>

      <button
          type="button"
          class="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-800"
          @click="openCreateModal"
      >
        افزودن اولین آدرس
      </button>
    </div>

    <!-- لیست آدرس‌ها -->
    <div
        v-else
        class="grid items-start gap-5 lg:grid-cols-2"
    >
      <article
          v-for="address in items"
          :key="address.id"
          class="relative rounded-2xl border bg-bg p-5 transition"
          :class="
          address.isDefault
            ? 'border-amber-500 shadow-sm'
            : 'border-gray-200 dark:border-gray-700'
        "
      >
        <!-- سربرگ کارت -->
        <div
            class="flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-bold text-text">
                {{ address.title }}
              </h2>

              <span
                  v-if="address.isDefault"
                  class="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/20 dark:text-amber-300"
              >
                پیش‌فرض
              </span>
            </div>

            <p class="mt-2 text-sm text-lightText">
              {{ address.receiverName }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <div
                v-if="!address.isDefault"
            >
              <button
                  type="button"
                  :disabled="submitting"
                  class="rounded-lg border border-amber-500 px-3 py-2 text-xs font-medium text-amber-600 transition hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
                  @click="setAsDefault(address.id)"
              >
                آدرس پیش‌فرض
              </button>

            </div>

            <button
                type="button"
                class="rounded-lg border border-green-300 px-3 py-2 text-xs font-medium text-green-500 transition hover:bg-green-100 dark:border-green-700 dark:hover:bg-green-900"
                @click="selectedAddressId = address.id; editModalOpen = true"
            >
              ویرایش
            </button>

            <button
                type="button"
                class="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                @click="openDeleteModal(address.id)"
            >
              حذف
            </button>
          </div>
        </div>

        <!-- جزئیات آدرس -->
        <div class="mt-5 space-y-4 text-sm">
          <div>
            <p class="text-lightText">
              شماره تماس
            </p>

            <p
                class="mt-1 text-right font-medium text-text"
                dir="ltr"
            >
              {{ address.phone }}
            </p>
          </div>

          <div>
            <p class="text-lightText">
              نشانی
            </p>

            <p class="mt-1 leading-7 text-text">
              {{ address.province }}،
              {{ address.city }}،
              {{ address.address }}

              <template v-if="address.plaque">
                ، پلاک {{ address.plaque }}
              </template>

              <template v-if="address.unit">
                ، واحد {{ address.unit }}
              </template>
            </p>
          </div>

          <div>
            <p class="text-lightText">
              کدپستی
            </p>

            <p
                class="mt-1 text-right font-medium text-text"
                dir="ltr"
            >
              {{ address.postalCode }}
            </p>
          </div>
        </div>

        <!-- عملیات پایین کارت -->

      </article>
    </div>

    <!-- مودال ویرایش -->
    <EditAddressModal
        v-model="editModalOpen"
        :address="selectedAddress"
        :pending="submitting"
        :error-message="actionError || ''"
        @submit="submitEdit"
    />
    <!-- مودال آدرس جدید -->
    <CreateAddressModal
        v-model="createModalOpen"
        :pending="submitting"
        :error-message="actionError"
        @submit="submitCreate"
    />
    <!-- مودال حذف -->
    <Teleport to="body">
      <Transition name="address-modal">
        <div
            v-if="deleteModalOpen"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <button
              type="button"
              aria-label="بستن مودال"
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="closeDeleteModal"
          />

          <section
              class="relative z-10 w-full max-w-md rounded-2xl bg-bg p-6 shadow-2xl"
          >
            <h2 class="text-lg font-bold text-text">
              حذف آدرس
            </h2>

            <p class="mt-3 text-sm leading-7 text-lightText">
              آیا از حذف آدرس
              <strong class="text-text">
                {{ selectedAddress?.title }}
              </strong>
              مطمئن هستید؟
            </p>

            <div
                v-if="actionError"
                class="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-300"
            >
              {{ actionError }}
            </div>

            <div class="mt-6 flex flex-wrap justify-end gap-3">
              <button
                  type="button"
                  :disabled="submitting"
                  class="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-text transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  @click="closeDeleteModal"
              >
                انصراف
              </button>

              <button
                  type="button"
                  :disabled="submitting"
                  class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  @click="confirmDelete"
              >
                {{ submitting ? 'در حال حذف...' : 'حذف آدرس' }}
              </button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.address-modal-enter-active,
.address-modal-leave-active {
  transition: opacity 0.2s ease;
}

.address-modal-enter-active section,
.address-modal-leave-active section {
  transition:
      transform 0.2s ease,
      opacity 0.2s ease;
}

.address-modal-enter-from,
.address-modal-leave-to {
  opacity: 0;
}

.address-modal-enter-from section,
.address-modal-leave-to section {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>

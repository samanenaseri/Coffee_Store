<script setup lang="ts">
definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
})

const route = useRoute()
const addressStore = useAddressStore()
const notification = useNotification()

const addressId = Number(route.params.id)

const form = reactive({
  title: '',
  receiverName: '',
  phone: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
})

onMounted(() => {
  const address = addressStore.getAddressById(addressId)

  if (!address) return

  Object.assign(form, address)
})

const submit = async () => {
  const response = await addressStore.updateAddress(
      addressId,
      form,
  )

  if (!response) {
    notification.error('خطا', addressStore.actionError)
    return
  }

  notification.success('موفق', 'آدرس ویرایش شد')
}
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold mb-6">
      ویرایش آدرس
    </h1>

    <div class="space-y-4">
      <input v-model="form.title" placeholder="عنوان" class="input" />
      <input v-model="form.receiverName" placeholder="نام گیرنده" class="input" />
      <input v-model="form.phone" placeholder="تلفن" class="input" />
      <input v-model="form.city" placeholder="شهر" class="input" />
      <input v-model="form.address" placeholder="آدرس" class="input" />
      <input v-model="form.postalCode" placeholder="کدپستی" class="input" />

      <button
          class="bg-amber-700 text-white px-4 py-2 rounded-xl"
          @click="submit"
      >
        ذخیره تغییرات
      </button>
    </div>
  </section>
</template>
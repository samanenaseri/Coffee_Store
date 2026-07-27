<!--<script setup lang="ts">-->
<!--import type { Address } from '#shared/address'-->

<!--const props = defineProps<{-->
<!--  address: Address-->
<!--}>()-->

<!--const emit = defineEmits<{-->
<!--  (e: 'edit', address: Address): void-->
<!--  (e: 'delete', id: number): void-->
<!--}>()-->
<!--</script>-->

<!--<template>-->
<!--  <div class="flex items-center gap-2">-->

<!--    &lt;!&ndash; Edit &ndash;&gt;-->
<!--    <button-->
<!--        type="button"-->
<!--        class="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-text transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"-->
<!--        @click="emit('edit', address)"-->
<!--    >-->
<!--      ویرایش-->
<!--    </button>-->

<!--    &lt;!&ndash; Delete &ndash;&gt;-->
<!--    <button-->
<!--        type="button"-->
<!--        class="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20"-->
<!--        @click="emit('delete', address.id)"-->
<!--    >-->
<!--      حذف-->
<!--    </button>-->

<!--  </div>-->
<!--</template>-->
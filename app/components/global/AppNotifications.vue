<script setup lang="ts">
const {
  notifications,
  removeNotification,
} = useNotification()

const notificationClass = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
}

const notificationIcon = {
  success: '✓',
  error: '×',
  warning: '!',
  info: 'i',
}
</script>

<template>
  <Teleport to="body">
    <div
        class="fixed left-4 top-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
    >
      <TransitionGroup name="notification">
        <article
            v-for="notification in notifications"
            :key="notification.id"
            class="flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur"
            :class="notificationClass[notification.type]"
        >
          <div
              class="flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold"
          >
            {{ notificationIcon[notification.type] }}
          </div>

          <div class="min-w-0 flex-1">
            <h3
                v-if="notification.title"
                class="text-sm font-bold leading-6"
            >
              {{ notification.title }}
            </h3>

            <p
                v-if="notification.message"
                class="text-xs leading-6 opacity-90"
                :class="notification.title ? 'mt-1' : 'text-sm font-medium opacity-100'"
            >
              {{ notification.message }}
            </p>
          </div>

          <button
              type="button"
              class="shrink-0 text-lg opacity-60 transition hover:opacity-100"
              aria-label="بستن اعلان"
              @click="removeNotification(notification.id)"
          >
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition:
      opacity 300ms ease,
      transform 300ms ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
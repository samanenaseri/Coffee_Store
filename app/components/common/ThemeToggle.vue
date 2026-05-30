<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    :aria-label="isDark ? 'تغییر به تم روشن' : 'تغییر به تم تیره'"
    :title="isDark ? 'تم روشن' : 'تم تیره'"
    class="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100 transition-colors"
    @click="toggle"
  >
    <span v-if="isDark" class="text-lg">☀️</span>
    <span v-else class="text-lg">🌙</span>
  </button>
</template>

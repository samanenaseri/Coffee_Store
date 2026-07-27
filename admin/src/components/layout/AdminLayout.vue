<template>
  <div class="min-h-screen flex bg-gray-50">
    <Toast />
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <div class="flex-1 flex flex-col transition-all duration-300" :class="sidebarCollapsed ? 'mr-16' : 'mr-64'">
      <AdminHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Toast from 'primevue/toast'
import AdminSidebar from './AdminSidebar.vue'
import AdminHeader from './AdminHeader.vue'

const sidebarCollapsed = ref(false)
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
  <AppNotifications />
</template>

<script setup lang="ts">
useHead({
    script: [
        {
            innerHTML: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
        },
    ],
})
</script>

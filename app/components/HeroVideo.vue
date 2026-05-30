<template>
  <section id="hero" class="relative w-full h-[500vh]">
    <div class="sticky top-0 h-screen overflow-hidden">
      <video
          ref="videoRef"
          class="absolute inset-0 w-full h-full object-cover scale-110"
          muted
          playsinline
          preload="auto"
      >
        <source src="/videos/scroll-video-final.mp4" type="video/mp4" />
      </video>

      <div
          class="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90"
      />

      <div
          class="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
      >
        <h1
            class="text-5xl md:text-7xl font-bold text-white tracking-wider"
        >
          عطر قهوه
        </h1>

        <p class="text-stone-200 mt-4 text-lg md:text-2xl">
          هر فنجان، یک داستان
        </p>

        <p class="absolute bottom-10 text-stone-300/70 animate-bounce">
          اسکرول کنید ↓
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const videoRef = ref(null)

onMounted(() => {
  const video = videoRef.value

  const updateVideo = () => {
    if (!video?.duration) return

    const heroSection = document.getElementById('hero')
    if (!heroSection) return

    const rect = heroSection.getBoundingClientRect()
    const scrollTop = window.scrollY
    const start = heroSection.offsetTop
    const end = start + heroSection.offsetHeight - window.innerHeight

    const progress = Math.min(
        Math.max((scrollTop - start) / (end - start), 0),
        1
    )

    video.currentTime = progress * video.duration
  }

  video.addEventListener('loadedmetadata', updateVideo)

  window.addEventListener('scroll', updateVideo)

  onUnmounted(() => {
    window.removeEventListener('scroll', updateVideo)
  })
})
</script>
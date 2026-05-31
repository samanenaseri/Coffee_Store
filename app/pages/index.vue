<script setup lang="ts">
import MainBody from "~/components/ui/MainBody.vue";
import Gallery from "~/pages/gallery.vue";

useSeoMeta({
  title: "قهوه‌فروشی | Coffee Store",
  ogTitle: "قهوه‌فروشی | Coffee Store",
  description: "فروشگاه تخصصی قهوه با انواع قهوه‌های اسپرسو، لاته، کاپوچینو و دانه‌های قهوه عربیکا",
  ogDescription: "بهترین قهوه‌ها را از ما بخواهید - فروشگاه تخصصی قهوه",
})
</script>


  <template>
    <section>
      <HeroVideo />
      <MainBody></MainBody>
      <gallery></gallery>
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl font-bold text-stone-800 text-center">
          به قهوه‌فروشی خوش آمدید
        </h1>

        <p class="text-stone-600 text-center mt-4 text-lg">
          بهترین قهوه‌ها را از ما بخواهید
        </p>
      </div>
    </section>
  </template>



<script setup lang="ts">
import DescribeSection from "~/components/ui/mainPage/DescribeSection.vue";
import Gallery from "~/pages/gallery.vue";
import OrderSection from "~/components/ui/mainPage/orderSection.vue";
import PicSection from "~/components/ui/mainPage/PicSection.vue";
import MenuSection from "~/components/ui/mainPage/MenuSection.vue";
import ProductSection from "~/components/ui/mainPage/productSection.vue";
import TestimonialSection from "~/components/ui/mainPage/testimonialSection.vue";
import ArticlesSection from "~/components/ui/mainPage/articlesSection.vue";

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
      <DescribeSection></DescribeSection>
      <productSection></productSection>
      <OrderSection></OrderSection>
      <MenuSection></MenuSection>
      <TestimonialSection></TestimonialSection>
      <gallery></gallery>
      <PicSection></PicSection>
      <articlesSection></articlesSection>
    </section>
  </template>



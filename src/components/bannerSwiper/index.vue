<template>
  <swiper
    :modules="modules"
    :pagination="{ clickable: true }"
    :autoplay="{ delay: 3000 }"
    :loop="true"
    v-if="bannerData.length"
  >
    <!-- @swiper="onSwiper"
    @slideChange="onSlideChange" -->
    <swiper-slide v-for="(carousel, index) of bannerData" :key="carousel.id">
      <div class="showPic">
        <img :src="carousel.pic" />
      </div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
// Swiper7以下版本
// import { Swiper, SwiperSlide } from "vue-awesome-swiper";

// import swiper module styles
import "swiper/css";

// more module style...

export default {
  name: "BannerSwiper",

  components: {
    Swiper,
    SwiperSlide,
  },
  props: ["bannerData"],
  setup(props) {
    // const onSwiper = (swiper) => {
    //   // console.log(swiper);
    // };
    // const onSlideChange = () => {
    //   console.log("slide change");
    // };
    return {
      // onSwiper,
      // onSlideChange,
      modules: [Autoplay],
    };
  },
};
</script>

<style lang="scss" scoped>
.showPic {
  width: 100%;
  > img {
    width: 100%;
    object-fit: contain;
  }
}
</style>

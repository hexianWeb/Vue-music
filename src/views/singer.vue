<template>
  <div class="singer" v-loading="!singers.length">
    <indexList :data="singers" @select="selectSinger"></indexList>
    <router-view v-slot="{ Component }">
      <!-- 使用animate的动画 -->
      <transition
        appear
        name="animate__animated "
        enter-active-class="animate__fadeInRight"
        leave-active-class="animate__fadeOutLeft"
      >
        <!-- is 指向component即可 -->
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
// import {useRouter} from 'vue';
import { getSingerList } from "@/service/singer";
import indexList from "@/components/index-list/index-list.vue";
//  // localStorage
//  storage.set(key,val)

//  storage.get(key, def)

//  // sessionStorage
//  storage.session.set(key, val)

//  storage.session.get(key, val)
// 一个简易的storage库 用法如上
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
export default {
  name: "singer",
  components: {
    indexList,
  },
  data() {
    return {
      singers: [],
      selectedSinger: null,
    };
  },
  async created() {
    const res = await getSingerList();
    this.singers = res.singers;
  },
  methods: {
    selectSinger(singer) {
      // debugger
      this.selectedSinger = singer;
      this.cacheSinger(singer);
      this.$router.push({
        path: `/singer/${singer.mid}`,
      });
    },

    // 向session里存入singer
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    },
  },
};
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 88px;
  bottom: 0;
}
</style>

<template>
  <div class="singer-detail">
    <music-list
      :loading="loading"
      :title="title"
      :pic="pic"
      :songs="songs"
    ></music-list>
  </div>
</template>

<script>
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
import { getSingerDetail } from "@/service/singer";
import { processSongs } from "@/service/song";
import musicList from "@/components/musicList/musicList.vue";
export default {
  name: "singer-detail",
  components: {
    musicList,
  },
  props: {
    singer: Object,
  },
  data() {
    return {
      songs: [],
      loading: true,
    };
  },
  computed: {
    // 获取singer 包含跳转来源与session来源
    computedSinger() {
      let res = null;
      const singer = this.singer;
      if (singer) {
        res = singer;
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY);
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          res = cachedSinger;
        }
      }
      return res;
    },
    pic() {
      const singer = this.computedSinger;
      return singer && singer.pic;
    },
    title() {
      const singer = this.computedSinger;
      return singer && singer.name;
    },
  },
  async created() {
    if (!this.computedSinger) {
      const path = this.$route.matched[0].path;
      this.$router.push(path);
      return;
    }
    const res = await getSingerDetail(this.computedSinger);
    this.songs = await processSongs(res.songs);
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  z-index: 2;
}
</style>

<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <!-- 背景图 -->
    <div class="bg-image" :style="bgImgStyle" ref="bgImg">
      <!-- 半透明蒙层 -->
      <div class="filter" :style="filterStyle"></div>
      <!-- 播放按钮 -->
      <div
        class="play-btn-wrapper"
        v-show="songs.length > 0"
        :style="playBtnStyle"
      >
        <div class="play-btn" @click="playMode">
          <i class="icon-play">
            <span class="text"> 随机播放全部 </span>
          </i>
        </div>
      </div>
    </div>
    <!-- 歌单列表 -->
    <scroll
      class="list"
      v-loading="loading"
      v-noresult="noResult"
      :style="scrollStyle"
      :probeType="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <songe-list :songs="songs" @select="selectItem" :rank="rank">
        </songe-list>
      </div>
    </scroll>
  </div>
</template>

<script>
// import Scroll from "@/components/scroll/scroll.vue";
import Scroll from "@/components/wrap-scroll";
import SongeList from "@/components/base/songList/songList.vue";
import { mapActions, mapState } from "vuex";
const RESERVED_HEIGHT = 40;
export default {
  name: "musicList",
  components: {
    Scroll,
    SongeList,
  },
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    title: String,
    pic: String,
    loading: Boolean,
    rank: Boolean,
  },
  setup(props) {
    // console.log(props);
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
    };
  },
  computed: {
    noResult() {
      // 完成加载后不存在歌曲
      return !this.loading && !this.songs.length;
    },
    bgImgStyle() {
      const scrollY = this.scrollY;
      let zIndex = 0;
      let paddingTop = "70%";
      let height = 0;
      if (scrollY > this.maxTranslateY) {
        zIndex = 1;
        paddingTop = 0;
        height = `${RESERVED_HEIGHT}px`;
      }

      let scale = 1;
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight);
      }
      return {
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale})`,
        backgroundImage: `url(${this.pic})`,
      };
    },
    scrollStyle() {
      const bottom = this.playList.length ? "60px" : "0";
      return {
        top: `${this.imageHeight}px`,
        bottom,
      };
    },
    filterStyle() {
      let blur = 0;
      // 当你取一个变量大于一次时 你应该用一个临时变量存储 这是一个好习惯
      const scrollY = this.scrollY;
      const imageHeight = this.imageHeight;
      if (scrollY >= 0) {
        blur =
          Math.min(scrollY / imageHeight, this.maxTranslateY / imageHeight) *
          15;
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      };
    },
    playBtnStyle() {
      let display = "";
      if (this.scrollY >= this.maxTranslateY) {
        // debugger;
        display = "none";
      }
      return {
        display: `${display}`,
      };
    },
    ...mapState(["playList"]),
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
    },
    selectItem({ song, index }) {
      // debugger;
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    playMode() {
      this.randomPlay(this.songs);
    },
    ...mapActions(["selectPlay", "randomPlay"]),
  },
  mounted() {
    this.imageHeight = this.$refs.bgImg.clientHeight;
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT;
  },
};
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 3;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 3;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    // padding-top: 70%;
    // height: 0;
    transform-origin: top;
    background-size: cover;
    z-index: 1;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 3;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  //   歌曲列表
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background-color: $color-background;
    }
  }
}
</style>

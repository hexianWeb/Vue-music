<template>
  <transition
    name="animate__animated "
    enter-active-class="animate__fadeInUp"
    leave-active-class="animate__fadeOutDown"
  >
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            :src="currentSong.pic"
            :class="cdStyle"
            width="40"
            height="40"
            ref="cdImageRef"
          />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">
              {{ song.name }}
            </h2>
            <p class="desc">
              {{ song.singer }}
            </p>
          </div>
        </div>
      </div>
      <div class="control">
        <progressCircle :radius="32" :progress="progress">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progressCircle>
      </div>
      <div class="control" @click.stop="showPlayList">
        <i class="icon-playlist"> </i>
      </div>
      <PlayList ref="playListRef"> </PlayList>
    </div>
  </transition>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";

// hooks
import useCD from "./useCD";
import useSlider from "./useSlider";
// components
import progressCircle from "@/components/player/progress-circle.vue";
import PlayList from "./playList.vue";
export default {
  name: "miniPlayer",
  components: {
    progressCircle,
    PlayList,
  },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    togglePlay: Function,
  },
  setup() {
    // ref
    const playListRef = ref(null);
    const store = useStore();

    // store
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.playing);
    const playList = computed(() => store.state.playList);
    // hooks
    const { cdStyle, cdRef, cdImageRef } = useCD();
    const { sliderWrapperRef } = useSlider();
    // functions
    function showNormalPlayer() {
      store.commit("setFullScreen", true);
    }
    function showPlayList() {
      playListRef.value.show();
    }
    // style
    const miniPlayIcon = computed(() => {
      return playing.value ? "icon-pause-mini" : "icon-play-mini";
    });

    return {
      // ref
      sliderWrapperRef,
      playListRef,

      fullScreen,
      currentSong,
      playList,
      // cd hooks
      cdStyle,
      cdRef,
      cdImageRef,

      // functions
      showNormalPlayer,
      showPlayList,
      // style
      miniPlayIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 6;
  width: 100%;
  height: 60px;
  background-color: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>

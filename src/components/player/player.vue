<template>
  <div class="player" v-show="playList.length">
    <!-- 常规播放器 -->
    <transition
      name="animate__animated "
      enter-active-class="animate__backInUp"
      leave-active-class="animate__backOutDown"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <!-- 顶层 -->
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <!-- 顶层结束 -->
        <!-- 中层 -->
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <!-- <swiper :observer="true" :observeParents="true"> -->
          <!-- <swiper-slide> -->
          <!-- 唱片层 -->
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper">
              <div class="cd" ref="cdRef">
                <img
                  ref="cdImageRef"
                  :src="currentSong.pic"
                  :class="cdStyle"
                  class="image"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{ playingLyric }}
              </div>
            </div>
          </div>
          <!-- 唱片层结束 -->
          <!-- </swiper-slide> -->
          <!-- 歌词层 -->
          <!-- <swiper-slide> -->
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div class="" v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="currentLineNum === index ? 'current' : ''"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </scroll>
          <!-- </swiper-slide> -->
          <!-- 歌词层结束 -->
          <!-- </swiper> -->
        </div>
        <!-- 中层结束 -->
        <!-- 底部播放器 -->
        <div class="bottom">
          <!-- dot显示层级 -->
          <div class="dot-wrapper">
            <span class="dot" :class="currentShow === 'cd' ? 'active' : ''">
            </span>
            <span class="dot" :class="currentShow === 'lyric' ? 'active' : ''">
            </span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">
              {{ formatTime(currentTime) }}
            </span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
                :progress="progress"
              >
              </progress-bar>
            </div>
            <span class="time time-r">
              {{ formatTime(currentSong.duration) }}
            </span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="ModeIcon"> </i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"> </i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="changePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                class="icon-not-favorite"
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              >
              </i>
            </div>
          </div>
        </div>
        <!-- 底部播放器END -->
      </div>
    </transition>
    <!-- 迷你播放器 -->
    <miniPlay :progress="progress" :togglePlay="changePlay"> </miniPlay>
    <!-- 歌曲 流式加载  -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
// hooksFunctions
import useMode from "./useMode";
import useCD from "./useCD";
import useLyric from "./useLyric";
import useFavorite from "./useFavorite";
import useInterActive from "./useInteractive";
import usePlayHistory from "./use-play-history";
// Components
import progressBar from "./progress-bar.vue";
import Scroll from "@/components/scroll/scroll.vue";
import miniPlay from "@/components/player/miniPlay.vue";
import { useStore } from "vuex";
import { computed, watch, ref, nextTick } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
// 静态JS
import { formatTime } from "@/assets/js/util.js";
import { PLAY_MODE } from "@/assets/js/constant";

import "swiper/css";

export default {
  name: "player",
  components: {
    progressBar,
    Scroll,
    Swiper,
    SwiperSlide,
    miniPlay,
  },
  setup() {
    const store = useStore();
    // data
    const audioRef = ref(null);
    const barRef = ref(null);
    const songReady = ref(false);
    const currentTime = ref(0);
    const changingFlag = ref(false);
    // vuex
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const currentIndex = computed(() => store.state.currentIndex);
    const playing = computed(() => store.state.playing);
    const playList = computed(() => store.state.playList);
    // 进度条
    const progress = computed(
      () => currentTime.value / currentSong.value.duration
    );
    // computed
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });
    const disableCls = computed(() => {
      return songReady.value ? "" : "disable";
    });
    const playMode = computed(() => {
      return store.state.playMode;
    });
    // hooks
    const { ModeIcon, changeMode } = useMode();
    const { toggleFavorite, getFavoriteIcon } = useFavorite();
    const { cdStyle, cdRef, cdImageRef } = useCD();
    const { savePlay } = usePlayHistory();
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playLyric,
      stopLyric,
      playingLyric,
    } = useLyric({
      songReady,
      currentTime,
    });
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useInterActive();
    // watch

    watch(currentSong, (newVal) => {
      // watch监视歌曲播放属性是否更新
      if (!newVal.id && !newVal.url) {
        return;
      }
      // 每次切换歌曲 重新加载 songReady为false
      songReady.value = false;
      // 并且把播放时间重置为0
      currentTime.value = 0;
      // 获取audio实例 随后播放歌曲
      const audioEl = audioRef.value;
      audioEl.src = newVal.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });

    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        barRef.value.setOffset(progress.value);
      }
    });
    watch(playing, (newVal) => {
      // 等待加载再播放
      if (!songReady.value) {
        return;
      }
      // debugger;
      const audioEl = audioRef.value;
      if (newVal) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });

    // function
    function goBack() {
      store.commit("setFullScreen", false);
    }

    // 修改播放状态
    function changePlay() {
      // if (!songReady.value) {
      //   return;
      // }
      store.commit("setPlayingState", !playing.value);
    }

    function prev() {
      const length = playList.value.length;
      // 做边界情况保护
      if (!songReady.value || !length) {
        return;
      }
      if (length === 1) {
      } else {
        let index = currentIndex.value - 1;
        // 考虑边界情况
        if (index === -1) {
          index = length - 1;
        }
        store.commit("setCurrentIndex", index);
        // if (!playing.value) {
        //   store.commit("setPlayingState", true);
        // }
      }
    }

    function next() {
      // debugger;
      const length = playList.value.length;
      if (!songReady.value || !length) {
        return;
      }
      if (length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        // 考虑边界情况
        if (index === length - 1) {
          index = 0;
        }
        store.commit("setCurrentIndex", index);
        // if (!playing.value) {
        //   store.commit("setPlayingState", true);
        // }
      }
    }
    // 从头播放 无限循环
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }
    // 除了用户手动暂停歌曲 我们监听audio的pause事件也可以更改歌曲播放状态
    // 这样在手机退出页面 黑屏 待机等 也能及时更改播放状态
    function pause() {
      store.commit("setPlayingState", false);
    }
    // 多次缓冲 但ready不需要多次执行
    // canplay 浏览器已经可以播放媒体，但是预测已加载的数据不足以在不暂停的情况下顺利将其播放到结尾（即预测会在播放时暂停以获取更多的缓冲区内容）
    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }
    //
    function error() {
      songReady.value = true;
    }

    // 更新audio currentTime
    function updateTime(e) {
      // 因为updateTime 与 onProgressChanging都能设置currentTime的属性 为了防止错写发送 需要设立flag值
      if (!changingFlag.value) {
        currentTime.value = e.target.currentTime;
      }
    }

    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }
    // 节流 在onProgressChanging中只更改 页面的currentTime 不对vuex与audio造成影响
    function onProgressChanging(progress) {
      changingFlag.value = true;
      currentTime.value = currentSong.value.duration * progress;
      // 修改currentTime的同时 同步歌词进度
      playLyric();
      // 但是不需要歌词继续播放
      stopLyric();
    }
    function onProgressChanged(progress) {
      changingFlag.value = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;

      // 拖动完毕 自动播放
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }
    return {
      // data
      audioRef,
      barRef,
      currentTime,
      playList,
      // vuex
      fullScreen,
      currentSong,
      progress,

      goBack,

      playIcon,
      changePlay,
      pause,
      prev,
      next,
      ready,
      end,
      disableCls,
      error,
      ModeIcon,
      changeMode,
      // favorite
      toggleFavorite,
      getFavoriteIcon,
      // progress
      updateTime,
      formatTime,
      onProgressChanging,
      onProgressChanged,
      // cd
      cdStyle,
      cdRef,
      cdImageRef,
      // lyric
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      // middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  z-index: 20;
  .normal-player {
    // 铺全屏
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 5;
    background-color: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 5;
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      // bottom: 170px;
      bottom: 210px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        width: 100%;
        padding-top: 80%;
        height: 0;
        position: relative;
        vertical-align: top;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        // padding-top: 80%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      // dot
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          margin: 0 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-l;
          }
        }
      }
      // 进度条
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          width: 100%;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        // 特例 需要大一点
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>

<template>
  <scroll class="index-list" :probeType="3" @scroll="onScroll" ref="scrollRef">
    <!-- 歌手列表 -->
    <div>
      <ul ref="groupRef">
        <li class="group" v-for="group in data" :key="group.title">
          <h2 class="title">{{ group.title }}</h2>
          <ul>
            <li
              class="item"
              v-for="singer in group.list"
              :key="singer.id"
              @click="onItemClick(singer)"
            >
              <img class="avatar" v-lazy="singer.pic" :alt="singer.name" />
              <span class="name">{{ singer.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 顶部标签随滑动更换 -->
    <div class="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{ fixedTitle }}</div>
    </div>
    <!-- 右侧字母表 -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortCutTouchStart"
      @touchmove.stop.prevent="onShortCutTouchMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortCutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="currentIndex === index ? 'current' : ''"
        >
          {{ item }}
        </li>
        <!-- <li>A</li>
        <li>B</li> -->
      </ul>
    </div>
  </scroll>
</template>

<script>
// 注册使用scroll组件
import useFixed from "./use-fixed";
import useShortCut from "./use-shortcut";
import Scroll from "@/components/scroll/scroll.vue";
export default {
  name: "singer-list",
  components: { Scroll },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ["select"],
  setup(props, { emit }) {
    const { groupRef, onScroll, fixedTitle, currentIndex } = useFixed(props);
    const {
      shortCutList,
      onShortCutTouchStart,
      scrollRef,
      onShortCutTouchMove,
    } = useShortCut(props, groupRef);
    function onItemClick(singer) {
      // debugger;
      emit("select", singer);
    }
    return {
      // 歌手列表DOM
      groupRef,
      // 滚动组件DOM
      scrollRef,
      // 当前选择标题
      fixedTitle,
      shortCutList,
      currentIndex,
      onScroll,
      onShortCutTouchStart,
      onShortCutTouchMove,
      onItemClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background-color: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    .item {
      padding: 3px;
      // 就是line-height = font-size
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: red;
      }
    }
  }
}
</style>

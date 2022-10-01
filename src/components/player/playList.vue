<template>
  <!--  -->
  <teleport to="body">
    <transition
      name="animate__animated "
      enter-active-class="animate__fadeIn"
      leave-active-class="animate__fadeOutDown"
    >
      <div class="playlist" v-show="visible && playList.length" @click="hide">
        <!-- @click.stop阻止点击hide时冒泡 -->
        <div class="list-wrapper" @click.stop>
          <!-- 播放模式 -->
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="ModeIcon" @click.stop="changeMode"></i>
              <span class="text">{{ ModeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <!-- 希望删除的时候列表有过渡效果 所以使用该标签 -->
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"> </i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  @click.stop="removeSong(song)"
                  :class="removing ? 'disable' : ''"
                >
                  <i class="icon-delete"> </i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></confirm>
        <AddSong ref="addSongRef"></AddSong>
      </div>
    </transition>
  </teleport>
</template>

<script>
// components
import Scroll from "@/components/scroll/scroll.vue";
import Confirm from "@/components/base/confirm/confirm.vue";

import { computed, nextTick, ref, watch } from "vue";
import { useStore } from "vuex";

// hooks
import useMode from "./useMode";
import useFavorite from "./useFavorite";
import AddSong from "../addSong/addSong.vue";

export default {
  name: "playList",
  components: {
    Scroll,
    Confirm,
    AddSong,
  },
  setup() {
    //   data
    const visible = ref(false);
    const removing = ref(false);
    // data-ref
    const scrollRef = ref(null);
    const listRef = ref(null);
    const confirmRef = ref(null);
    const addSongRef = ref(null);
    // store state
    const store = useStore();
    const playList = computed(() => store.state.playList);
    const sequenceList = computed(() => store.state.sequenceList);
    const currentSong = computed(() => store.getters.currentSong);
    watch(currentSong, async (newSong) => {
      if (!visible.value || !newSong.id) {
        return;
      }
      await nextTick();
      scrollToCurrent();
    });

    // hooks
    const { ModeIcon, ModeText, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();

    // functions
    function hide() {
      visible.value = false;
    }
    async function show() {
      visible.value = true;
      await nextTick();
      refreshScroll();
    }

    function selectItem(song) {
      const index = playList.value.findIndex((item) => {
        return song.id === item.id;
      });
      store.commit("setCurrentIndex", index);
      store.commit("setPlayingState", true);
    }

    function refreshScroll() {
      scrollRef.value.scroll.refresh();
      scrollToCurrent();
    }

    function scrollToCurrent() {
      const index = sequenceList.value.findIndex((song) => {
        return currentSong.value.id === song.id;
      });
      if (index === -1) {
        return;
      }
      const target = listRef.value.$el.children[index];

      scrollRef.value.scroll.scrollToElement(target, 300);
    }

    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return "icon-play";
      }
    }

    function removeSong(song) {
      if (removing.value) {
        return;
      }
      removing.value = true;
      store.dispatch("removeSong", song);
      if (!playList.value.length) {
        hide();
        store.commit("setPlayingState", false);
      }
      setTimeout(() => {
        removing.value = false;
      }, 300);
    }
    // functions - -clear
    function showConfirm() {
      confirmRef.value.show();
    }

    function confirmClear() {
      store.dispatch("clearSongList");
      hide();
    }

    function showAddSong() {
      addSongRef.value.show();
    }
    return {
      // data
      visible,
      playList,
      sequenceList,
      scrollRef,
      listRef,
      confirmRef,
      addSongRef,
      removing,
      // hooks
      // useMode
      ModeIcon,
      ModeText,
      changeMode,
      //   useFavorite
      getFavoriteIcon,
      toggleFavorite,
      //   functions
      hide,
      show,
      getCurrentIcon,
      selectItem,
      removeSong,

      showConfirm,
      confirmClear,
      showAddSong,
    };
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 7;
  background-color: $color-background-d;
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 8;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>

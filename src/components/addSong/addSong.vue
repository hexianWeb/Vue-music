<template>
  <teleport to="body">
    <transition
      name="animate__animated "
      enter-active-class="animate__fadeIn"
      leave-active-class="animate__fadeOutDown"
    >
      <div class="add-song" v-show="visable">
        <!-- 添加歌曲头部 -->
        <div class="header">
          <h1 class="title">
            添加歌曲到列表
            <div class="close" @click="hide">
              <i class="icon-close"> </i>
            </div>
          </h1>
        </div>
        <!-- 添加歌曲搜索部 -->
        <div class="search-input-wrapper">
          <search-input placeholder="请输入搜索歌曲" v-model="query">
          </search-input>
        </div>
        <!-- 歌单列表展示 -->
        <div v-show="!query">
          <switches :items="['最近播放', '搜索历史']" v-model="currentIndex">
          </switches>
          <div class="list-wrapper">
            <scroll
              v-if="currentIndex == 0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <songList :songs="playHistory" @select="selectSongBySongList">
                </songList>
              </div>
            </scroll>
            <scroll
              v-if="currentIndex === 1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <searchList
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                ></searchList>
              </div>
            </scroll>
          </div>
        </div>
        <!-- 定都搜索栏结果 -->
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :show-singer="false"
            @select-song="selectSongBySuggest"
          >
          </suggest>
        </div>

        <Message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Switches from "../base/switches/switches.vue";
import searchInput from "../search/search-input.vue";
import suggest from "../search/suggest.vue";
import Scroll from "@/components/scroll/scroll.vue";
import songList from "../base/songList/songList.vue";
import searchList from "../search/search-list.vue";
import Message from "@/components/base/message/message.vue";
import { computed, ref, nextTick, watch } from "vue";
import { useStore } from "vuex";
import useSearchHistory from "../search/use-search-history";
export default {
  name: "addSong",
  components: {
    searchInput,
    suggest,
    Switches,
    Scroll,
    songList,
    searchList,
    Message,
  },
  setup() {
    // data
    const visable = ref(false);
    const query = ref("");
    const currentIndex = ref(0);
    const scrollRef = ref(null);
    const messageRef = ref(null);
    const store = useStore();

    // computed
    const searchHistory = computed(() => store.state.searchHistory);
    const playHistory = computed(() => store.state.playHistory);

    // watch
    watch(query, async () => {
      await nextTick();
      refreshScroll;
    });
    // hooks
    const { saveSearch } = useSearchHistory();
    // function
    async function show() {
      visable.value = true;
      await nextTick();
      refreshScroll();
    }
    function hide() {
      visable.value = false;
    }

    function addQuery(res) {
      query.value = res;
    }

    function selectSongBySongList({ song }) {
      addSong(song);
    }
    function refreshScroll() {
      scrollRef.value.scroll.refresh();
    }
    function selectSongBySuggest(song) {
      addSong(song);
      saveSearch(query.value);
    }

    function addSong(song) {
      store.dispatch("addSong", song);
      showMessage();
    }
    function showMessage() {
      messageRef.value.show();
    }
    return {
      // data
      visable,
      query,
      currentIndex,
      searchHistory,
      playHistory,
      messageRef,
      scrollRef,
      // function
      show,
      hide,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
  background-color: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}
.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;

  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }

  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>

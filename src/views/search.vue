<template>
  <div class="search">
    <div class="search-input-wrapper">
      <searchInput v-model="query"></searchInput>
    </div>
    <Scroll class="search-content" v-show="!query">
      <div>
        <!-- 热词 -->
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <!-- 搜索历史 -->
        <div class="search-history">
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <confirm
              ref="confirmRef"
              text="是否清空所有搜索历史"
              confirm-btn-text="清空"
              @confirm="clearSearch"
            ></confirm>
            <searchList
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteSearch"
            >
            </searchList>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition
        appear
        name="animate__animated "
        enter-active-class="animate__fadeInRight"
        leave-active-class="animate__fadeOutLeft"
      >
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
// 组件
import Suggest from "@/components/search/suggest";
import SearchInput from "@/components/search/search-input.vue";
import Scroll from "@/components/wrap-scroll";
import searchList from "@/components/search/search-list.vue";
import Confirm from "@/components/base/confirm/confirm.vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// hooks
import useSearchHistory from "@/components/search/use-search-history";
// API
import { getHotKeys } from "@/service/search";
// 第三方组件库
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
import SearchList from "@/components/search/search-list.vue";
export default {
  name: "search",
  components: {
    SearchInput,
    searchList,
    Confirm,
    Suggest,
    Scroll,
    SearchList,
  },
  setup() {
    //vue
    const store = useStore();
    const router = useRouter();
    // data-ref
    const query = ref("");
    const selectedSinger = ref("");
    const hotKeys = ref([{ key: "周杰伦" }, { key: "陈冠希" }]);

    // computed
    const searchHistory = computed(() => store.state.searchHistory);
    // fixme:接口已经失效
    getHotKeys().then((result) => {
      if (result) {
        hotKeys.value = result.hotKeys;
      }
    });

    // function
    // hooks-function
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory();
    function addQuery(res) {
      debugger;
      query.value = res;
    }
    function selectSong(song) {
      saveSearch(query.value);
      store.dispatch("addSong", song);
    }
    function selectSinger(singer) {
      saveSearch(query.value);
      selectedSinger.value = singer;
      cacheSinger(singer);
      router.push({
        path: `/search/${singer.mid}`,
      });
    }
    // 向session里存入singer
    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    }
    return {
      // data
      query,
      hotKeys,
      searchHistory,
      selectedSinger,
      // function
      addQuery,
      selectSong,
      selectSinger,

      // hooks-function
      deleteSearch,
      clearSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        align-content: center;
      }
      .text {
        flex: 1;
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
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>

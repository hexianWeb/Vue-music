<template>
  <div class="search">
    <div class="search-input-wrapper">
      <searchInput v-model="query"></searchInput>
    </div>
    <Scroll class="search-content" v-show="!query">
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
    </Scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
  </div>
</template>

<script>
// 组件
// 搜索结果组件
import Suggest from "@/components/search/suggest";
// 搜索输入框
import SearchInput from "@/components/search/search-input.vue";
import Scroll from "@/components/wrap-scroll";
import { ref } from "vue";
import { getHotKeys } from "@/service/search";
export default {
  name: "search",
  components: {
    SearchInput,
    Suggest,
    Scroll,
  },
  setup() {
    const query = ref("");
    const hotKeys = ref([{ key: "周杰伦" }, { key: "陈冠希" }]);
    // 接口已经失效
    getHotKeys().then((result) => {
      if (result) {
        hotKeys.value = result.hotKeys;
      }
    });

    function addQuery(res) {
      query.value = res;
    }
    return {
      // data
      query,
      hotKeys,
      addQuery,
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
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>

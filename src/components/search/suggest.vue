<template>
  <div
    class="suggest"
    v-loading:[loadingText]="loading"
    v-noresult:[noResultText]="noResult"
    ref="rootRef"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { search } from "@/service/search";
import { processSongs } from "@/service/song";
import usePullUpLoad from "./use-pull-up-load";

export default {
  name: "suggest",
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["select-song", "select-singer"],
  setup(props, { emit }) {
    // data
    const singer = ref(null);
    const songs = ref([]);
    const hasMore = ref(true);
    const page = ref(1);
    const loadingText = ref("");
    const noResultText = ref("");
    // hooks
    const { isPullUpLoad, rootRef, scroll } = usePullUpLoad(
      searchMore
      // preventPullUpload
    );
    // watch
    watch(
      () => props.query,
      async (newQuery) => {
        if (!newQuery) {
          return;
        }
        await searchFirst();
      }
    );

    // computed
    const onResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value;
    });

    const loading = computed(() => {
      return !singer.value && !songs.value.length;
    });

    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value;
    });
    // 第一次搜索
    async function searchFirst() {
      if (!props.query) {
        return;
      }
      // 重置
      page.value = 1;
      songs.value = [];
      singer.value = null;
      hasMore.value = true;
      const result = await search(props.query);
      // 获取歌曲的Url
      songs.value = await processSongs(result.songs);
      singer.value = result.singer[0];
      hasMore.value = result.hasMore;

      // await nextTick();
      // await makeItScrollable();
    }

    // fixme:接口已被弃用
    //#region
    // async function searchMore() {
    //   if (!hasMore.value || !props.query) {
    //     return;
    //   }
    //   page.value++;
    //   const result = await search(props.query, page.value, props.showSinger);
    //   songs.value = songs.value.concat(await processSongs(result.songs));
    //   await nextTick();
    //   await makeItScrollable();
    // }

    // async function makeItScrollable() {
    //   if (scroll.value.maxScrollY >= -1) {
    //     manualLoading.value = true;
    //     await searchMore();
    //     manualLoading.value = false;
    //   }
    // }
    //#endregion
    async function searchMore() {
      // 接口变更 原来的接口无效
      hasMore.value = false;
      if (!hasMore.value || !props.query) {
        return;
      }
    }
    function selectSong(song) {
      emit("select-song", song);
    }

    function selectSinger(singer) {
      emit("select-singer", singer);
    }

    return {
      // data
      singer,
      songs,
      // data-dierction
      loadingText,
      noResultText,
      // data Ref
      rootRef,
      // computed
      onResult,
      loading,
      pullUpLoading,
      // function
      selectSong,
      selectSinger,
    };
  },
};
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>

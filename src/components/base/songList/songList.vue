<template>
  <ul class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <!-- 排行页面时显示 -->
      <div class="rank">
        <span class="text"> 1 </span>
      </div>
      <!-- 内容 -->
      <div class="content">
        <h2 class="name">{{ song.name }}</h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "songList",
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ["select"],
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", { song, index });
    },
  },
};
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }

      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>

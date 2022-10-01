<template>
  <div class="search-list">
    <transition-group tag="ul" name="list">
      <li
        class="search-item"
        v-for="item in searches"
        :key="item"
        @click="selectItem(item)"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" v-if="showDelete" @click.stop="deleteItem(item)">
          <i class="icon-delete"> </i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: "searchList",
  props: {
    searches: {
      type: Array,
      default() {
        return [];
      },
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["select", "delete"],
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    .text {
      flex: 1;
      color: $color-text-l;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>

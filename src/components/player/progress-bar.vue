<template>
  <div class="progress-bar">
    <!-- 主条 -->
    <div class="bar-inner" @click="onClick">
      <!-- 已过进程条 -->
      <div class="progress" ref="progress" :style="progressStyle"></div>
      <!-- 按钮 -->
      <div
        class="progress-btn-wrapper"
        :style="progressBtnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const PROGRESS_BTN_WIDTH = 16;
export default {
  name: "progress-bar",
  props: {
    progress: {
      type: Number,
      dafault: 0,
    },
  },
  data() {
    return {
      offset: 0,
    };
  },
  emits: ["progress-changing", "progress-changed"],
  computed: {
    progressStyle() {
      return `width:${this.offset}px`;
    },
    progressBtnStyle() {
      return `transform:translateX(${this.offset}px)`;
    },
  },
  watch: {
    progress(newProgress) {
      // 总长度 * 进度 = 偏移量
      // const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH;
      // this.offset = barWidth * newProgress;
      this.setOffset(newProgress);
    },
  },
  created() {
    // 仅仅只为共享数据 没有必要把他作为响应式
    this.touch = {};
  },
  methods: {
    onTouchStart(e) {
      // 获取初始横坐标 以及点击横坐标（有两种不重叠的业务场景 所以需要分开存）
      this.touch.x1 = e.touches[0].pageX;
      this.touch.beginWidth = this.$refs.progress.clientWidth;
    },
    onTouchMove(e) {
      // 鼠标位移距离
      const delta = e.touches[0].pageX - this.touch.x1;
      // 元素目前距离
      const tempWidth = this.touch.beginWidth + delta;
      // 播放条总长度
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH;
      // 算出歌曲进度
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
      // 计算偏移量
      this.offset = barWidth * progress;
      this.$emit("progress-changing", progress);
    },
    onTouchEnd() {
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH;
      const progress = this.$refs.progress.clientWidth / barWidth;
      this.$emit("progress-changed", progress);
    },
    onClick(e) {
      // 其提供了元素的大小及其相对于视口的位置。
      const rect = this.$el.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH;
      const progress = offsetWidth / barWidth;
      this.$emit("progress-changed", progress);
    },
    setOffset(newProgress) {
      // 总长度 * 进度 = 偏移量
      const barWidth = this.$el.clientWidth - PROGRESS_BTN_WIDTH;
      this.offset = barWidth * newProgress;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background-color: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border: 3px solid $color-text;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>

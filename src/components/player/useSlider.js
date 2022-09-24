import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated,
} from "vue";
import { useStore } from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

BScroll.use(Slide);
// slider API https://better-scroll.github.io/docs/zh-CN/plugins/slide.html#%E4%BD%BF%E7%94%A8

export default function useSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);

  const store = useStore();
  //   store
  const fullScreen = computed(() => store.state.fullScreen);
  const playlist = computed(() => store.state.playList);
  const currentIndex = computed(() => store.state.currentIndex);

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value;
  });

  onMounted(() => {
    let sliderVal;

    // 刚进入歌手界面 但没有点击歌曲时 miniPlay不会挂载 所有这时无需初始化此组件
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal) {
          // 初始化
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });

          sliderVal.on("slidePageChanged", ({ pageX }) => {
            // debugger;
            store.commit("setCurrentIndex", pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0);
      }
    });

    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });

  onActivated(() => {
    slider.value.enable();
    slider.value.refresh();
  });

  onDeactivated(() => {
    slider.value.disable();
  });

  return {
    slider,
    sliderWrapperRef,
  };
}

import Scroll from "@/components/scroll/scroll.vue";
import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  nextTick,
  watch,
} from "vue";
import { useStore } from "vuex";

export default {
  name: "wrap-scroll",
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps({ ref: "scrollRef" }, ctx.$props, {
        onScroll: (e) => {
          ctx.$emit("scroll", e);
        },
      }),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => {
      return scrollRef.value.scroll;
    });

    const store = useStore();
    const playlist = computed(() => store.state.playList);

    watch(playlist, async () => {
      await nextTick();
      scroll.value.refresh();
    });

    return {
      scrollRef,
      scroll,
    };
  },
};

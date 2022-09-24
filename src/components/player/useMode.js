import { useStore } from "vuex";
import { computed } from "vue";
import { PLAY_MODE } from "@/assets/js/constant";

export default function useMode() {
  const store = useStore();
  const playMode = computed(() => store.state.playMode);

  const ModeIcon = computed(() => {
    // debugger;
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "icon-sequence"
      : playModeVal === PLAY_MODE.random
      ? "icon-random"
      : "icon-loop";
  });

  const ModeText = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PLAY_MODE.sequence
      ? "顺序播放"
      : playModeVal === PLAY_MODE.random
      ? "随机播放"
      : "单曲循环";
  });
  function changeMode() {
    // debugger;
    const mode = (playMode.value + 1) % 3;
    store.dispatch("changeMode", mode);
  }
  return {
    ModeIcon,
    ModeText,
    changeMode,
  };
}

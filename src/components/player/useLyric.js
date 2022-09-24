import { useStore } from "vuex";
import { computed, watch, ref } from "vue";
import { getLyric } from "@/service/song";
import Lyric from "lyric-parser";
// https://github.com/ustbhuangyi/lyric-parser API相关介绍
//
export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null);
  const currentLineNum = ref(0);
  const pureLyric = ref("");
  const playingLyric = ref("");
  // ref
  const lyricScrollRef = ref(null);
  const lyricListRef = ref(null);

  const store = useStore();

  // computed
  const currentSong = computed(() => store.getters.currentSong);

  // watch
  // 监视当前歌曲是否发生改变
  watch(currentSong, async (song) => {
    if (!song.url || !song.id) {
      return;
    }
    // 切换歌曲后不需要播放歌词 否则currentTime会影响到下一首歌曲
    stopLyric();
    currentLyric.value = null;
    currentLineNum.value = 0;
    // 获取新歌的歌词
    const lyric = await getLyric(song);
    // 为对应歌曲添加歌词缓存
    store.commit("addSongLyric", { song: currentSong.value, lyric });

    if (currentSong.value.lyric !== lyric) {
      debugger;
      // 防止连续切换重复构建新的 Lyric消耗性能
      return;
    }
    currentLyric.value = new Lyric(lyric, handleLyric);
    // 验证是否存在歌词
    const hasLyric = currentLyric.value.lines.length;
    if (hasLyric) {
      if (songReady.value) {
        playLyric();
      }
    } else {
      pureLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, "");
    }
    if (songReady.value) {
      playLyric();
    }
  });
  // 歌词播放函数 根据当前歌曲播放时间
  function playLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000);
    }
  }

  // 歌词停止函数
  function stopLyric() {
    const currentLyricVal = currentLyric.value;
    if (currentLyricVal) {
      currentLyricVal.stop();
    }
  }
  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    const scrollComponent = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    // 当歌词列表元素不存在时 需要禁止scroll元素操作
    if (!listEl) {
      return;
    }
    // 5行之后 歌词居中
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5];
      scrollComponent.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollComponent.scroll.scrollTo(0, 0, 1000);
    }
  }
  return {
    currentLyric,
    currentLineNum,
    playingLyric,
    lyricScrollRef,
    lyricListRef,
    playLyric,
    stopLyric,
  };
}

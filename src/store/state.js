import { PLAY_MODE } from "@/assets/js/constant";
const state = {
  // 顺序播放列表
  sequenceList: [],
  // 真实播放列表
  playList: [],
  // 播放状态
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 当前播放的下标
  currentIndex: 0,
  fullScreen: false,
};

export default state;

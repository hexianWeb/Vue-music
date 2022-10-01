import {
  PLAY_MODE,
  FAVORITE_KEY,
  SEARCH_KEY,
  PLAY_KEY,
} from "@/assets/js/constant";
import { load } from "@/assets/js/array-store";
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
  // 初始设置为加载本地数据
  favoriteList: load(FAVORITE_KEY) || [],
  searchHistory: load(SEARCH_KEY) || [],
  playHistory: load(PLAY_KEY) || [],
};

export default state;

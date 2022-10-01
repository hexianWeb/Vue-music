import { PLAY_MODE } from "@/assets/js/constant";
import { shuffle } from "@/assets/js/util";
export function selectPlay({ commit, state }, { list, index }) {
  commit("setPlayMode", PLAY_MODE.sequence);
  commit("setSequenceList", list);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
  commit("setPlayList", list);
  commit("setCurrentIndex", index);
}

export function randomPlay({ commit }, list) {
  commit("setPlayMode", PLAY_MODE.sequence);
  commit("setSequenceList", list);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
  commit("setPlayList", shuffle(list));
  commit("setCurrentIndex", 0);
}

// 更改播放模式 除了随机模式需要shuffle 其余都可以沿用正常列表
export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id;
  if (mode === PLAY_MODE.random) {
    commit("setPlayList", shuffle(state.sequenceList));
  } else {
    commit("setPlayList", state.sequenceList);
  }
  commit("setPlayMode", mode);

  // 随机播放时 原先的歌曲列表被shuffle了 但是索引没有改变
  // 所以需要重新找到当前播放的歌曲
  const index = state.playList.findIndex((song) => {
    return song.id === currentId;
  });

  commit("setCurrentIndex", index);
}

export function removeSong({ commit, state }, song) {
  // 因为无法在action中对state进行操作 可以选择对数组进行备份 然后调用mutation中的 setList相关方法
  const sequenceList = state.sequenceList.slice();
  const playList = state.playList.slice();

  const sequenceIndex = findIndex(sequenceList, song);
  const playIndex = findIndex(playList, song);
  if (sequenceIndex < 0 || playIndex < 0) {
    return;
  }
  sequenceList.splice(sequenceIndex, 1);
  playList.splice(playIndex, 1);

  let currentIndex = state.currentIndex;

  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--;
  }
  commit("setSequenceList", sequenceList);
  commit("setPlayList", playList);
  commit("setCurrentIndex", currentIndex);
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}
export function clearSongList({ commit }) {
  commit("setSequenceList", []);
  commit("setPlayList", []);
  commit("setCurrentIndex", 0);
  commit("setPlayingState", false);
}

export function addSong({ commit, state }, song) {
  if (typeof song.singer !== "string") {
    song.singer = song.singer[0].name;
  }
  const playList = state.playList.slice();
  const sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  const playIndex = findIndex(playList, song);

  // 存在与歌单
  if (playIndex > -1) {
    currentIndex = playIndex;
    // 不存在与歌单
  } else {
    playList.push(song);
    currentIndex = playList.length - 1;
  }

  const sequenceIndex = findIndex(sequenceList, song);
  if (sequenceIndex === -1) {
    sequenceList.push(song);
  }

  // 提交状态
  commit("setSequenceList", sequenceList);
  commit("setPlayList", playList);
  commit("setCurrentIndex", currentIndex);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
}

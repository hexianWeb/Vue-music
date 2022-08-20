// 当前播放歌曲
export const currentSong = (state) => {
  // 默认挂载在APP.js下 在初始化时需要提前给赋予空对象 不然App.js初始化时会报错
  return state.playList[state.currentIndex] || {};
};

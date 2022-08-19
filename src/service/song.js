import { get } from "./base";
export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }

  // 批量根据song的id获取其对应的url并赋予给它
  return get("/api/getSongsUrl", {
    mid: songs.map((song) => {
      return song.mid;
    }),
  }).then((res) => {
    const map = res.map;
    return songs
      .map((song) => {
        // 向song里传入url
        song.url = map[song.mid];
        return song;
      })
      .filter((song) => {
        // 由于第三方API会对某些歌曲进行加密 所以需要有vkey的才能正常播放 其余不能
        return song.url.indexOf("vkey") > -1;
      });
  });
}

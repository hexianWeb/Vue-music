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

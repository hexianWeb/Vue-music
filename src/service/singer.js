import { get } from "./base";
import axios from "axios";
export function getSingerList() {
  return get("/api/getSingerList");
}

export function getSingerDetail(singer) {
  return get("/api/getSingerDetail", {
    mid: singer.mid,
  });
}

export function getSingerPicByName(name) {
  return get("/api/searchSinger", {
    name,
  });
}

// import MusicList from '@/components/music-list/music-list'

import musicList from "@/components/musicList/musicList.vue";
import storage from "good-storage";
import { processSongs } from "@/service/song";
import { SINGER_KEY } from "@/assets/js/constant";

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: { musicList },
    props: {
      data: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      };
    },
    computed: {
      computedData() {
        let ret = null;
        const data = this.data;
        // debugger;
        if (data) {
          ret = data;
        } else {
          const cached = storage.session.get(key);
          if (
            cached &&
            (cached.mid || cached.id + "") === this.$route.params.id
          ) {
            ret = cached;
          }
        }
        return ret;
      },
      pic() {
        const data = this.computedData;
        console.log(data);
        return data && (data.pic || this.songs[0].pic);
      },
      title() {
        const data = this.computedData;
        return data && (data.name || data.title);
      },
    },
    async created() {
      // debugger;
      const data = this.computedData;
      if (!data) {
        const path = this.$route.matched[0].path;
        this.$router.push({
          path,
        });
        return;
      }
      const result = await fetch(data);
      this.songs = await processSongs(result.songs);
      // fixme: 写入后台
      if (!Object.prototype.hasOwnProperty.call(data, "pic")) {
        console.log("我没有歌手图片");
        console.log(data.name);
      }
      this.loading = false;
    },
    methods: {
      // 向session里存入singer
      cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer);
      },
    },
  };
}

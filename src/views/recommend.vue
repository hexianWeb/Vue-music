<template>
  <!-- 推荐页面 -->
  <div class="recommend" v-loading:[loadingText]="loading">
    <!-- scroll容器 -->
    <scroll class="recommend-content">
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper">
          <div class="slier-content">
            <BannerSwiper :bannerData="carouseList"></BannerSwiper>
          </div>
        </div>
        <!-- recommend-list -->
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item of albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <!-- 跳转歌单 -->
    <router-view v-slot="{ Component }">
      <transition
        name="animate__animated "
        enter-active-class="animate__fadeInRight"
        leave-active-class="animate__fadeOutLeft"
      >
        <component :is="Component" :data="selectedAlbum" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BannerSwiper from "@/components/bannerSwiper/index.vue";
import { getRecommend } from "@/service/recommend";
import { onBeforeMount } from "@vue/runtime-core";
import storage from "good-storage";
import { ALBUM_KEY } from "@/assets/js/constant";
// 注册使用scroll组件
// import Scroll from "@/components/scroll/scroll.vue";
import Scroll from "@/components/wrap-scroll";
export default {
  name: "recommend",
  components: {
    BannerSwiper,
    Scroll,
  },

  // 实际上也可以在setup里写 这也是我随后的写法
  // async created() {
  //   const res = await getRecommend();
  //   console.log(res);
  // },
  setup() {
    // 轮播图变量
    const carouseList = ref([]);
    const albums = ref([]);
    const selectedAlbum = ref(null);
    const loadingText = "正在载入";

    // router
    const router = useRouter();
    // computed
    const loading = computed(() => {
      return !carouseList.value.length && !albums.value.length;
    });
    onBeforeMount(async () => {
      let data = await getRecommend();
      carouseList.value = data.sliders;
      albums.value = data.albums;
    });

    function selectItem(album) {
      selectedAlbum.value = album;
      cacheAlbum(album);
      router.push({
        path: `/recommend/${album.id}`,
      });
    }
    // 持久层 防止刷新丢失数据
    function cacheAlbum(album) {
      storage.session.set(ALBUM_KEY, album);
    }
    return {
      // data
      loading,
      carouseList,
      albums,
      selectedAlbum,
      loadingText,
      selectItem,
    };
  },
};
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    // height: 817px;/
    overflow: hidden;
    .slider-wrapper {
      .slider-content {
        width: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        color: $color-theme;
        text-align: center;
        font-size: $font-size-medium;
      }
      .item {
        display: flex;
        align-content: center;
        box-sizing: border-box;
        padding: 0 20px 20px 20px;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          // 占用除了图片padding的剩余空间
          flex: 1;
          // 定义父盒子为弹性盒子
          display: flex;
          // 更改布局朝向
          flex-direction: column;
          // 修改字体大小
          line-height: 20px;
          font-size: $font-size-medium;
          overflow: hidden;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>

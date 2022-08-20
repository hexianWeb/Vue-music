<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
  <player></player>
</template>

<script>
import Header from "@/components/header/header.vue";
import Tab from "@/components/tab";
import Player from "@/components/player/player.vue";
export default {
  components: {
    MHeader: Header,
    Tab,
    Player,
  },
};
</script>

<style></style>

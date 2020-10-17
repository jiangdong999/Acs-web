
<template>
  <!-- <scroll-bar> -->
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <!-- <div class="logo-container">
      <div v-show="!isCollapse">
        <span class="logo" :style="'background-image:url('+system.systemUrl+')'"></span>
      </div>
      <div v-show="isCollapse">
        <span class="logo-collapse"></span>
      </div>
    </div> -->
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse"
             background-color="#223040"
             text-color="#bfcbd9"
             active-text-color="#007ee4"
             class="menu-scroll-wrapper"
             unique-opened>
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
  <!-- </scroll-bar> -->
</template>

<script>
  import {mapGetters} from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    components: {SidebarItem, ScrollBar},
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar',
        'community',
        'system'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    },
  }
</script>

<style scoped>
  /* .logo {
    display: inline-block;
    width: 180px;
    height: 30px;
    vertical-align: middle;
    line-height: 50px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50% 50%;

    background: url("../../../../assets/logo.png") center center/contain no-repeat;
  }
  .logo-collapse {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    line-height: 50px;
    background: url("../../../../assets/logo-icon.png") center center/contain no-repeat;
  } */
</style>

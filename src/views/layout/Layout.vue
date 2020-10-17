<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <navbar @reloadAppMain="reloadAppMain"></navbar>
    <div class="main-container">
      <sidebar class="sidebar-container"></sidebar>
      <!-- <tags-view></tags-view> -->
      <app-main v-if="reload && communityList.length>0"></app-main>
      <!-- <app-footer></app-footer> -->
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView, AppFooter } from './components'
import {mapGetters} from 'vuex'

export default {
  name: 'layout',
  data(){
    return {
      reload: false
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
    // TagsView,
    AppFooter
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    ...mapGetters([
      'communityList',
    ]),
  },
  methods:{
    reloadAppMain(){
      this.reload = false
      this.$nextTick(() => (this.reload = true))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    background-color: #F0F2F5;
  }
</style>

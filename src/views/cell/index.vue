<template>
  <div>
    <transition name="fade-transform" mode="out-in">
    <div class="header" v-show="showHeader">
      <span>房屋列表</span>
      <span class="control-left" style="margin-left:20px">
        <el-button type="primary" @click="openRoomChart()">房屋管理</el-button>
        <el-button type="primary" @click="showImport=true" :disabled="disabled">批量导入住户</el-button>
      </span>
    </div>
    </transition>
    
    <transition name="fade-transform" mode="out-in">
      <router-view class="view" v-if="active" @disabled="disabled=true"></router-view>
    </transition>

    <div v-if="showImport">
      <el-dialog
        title="批量导入住户"
        :show-close="true"
        :visible.sync="showImport"
        width="550px"
        :close-on-click-modal="true">
        <exp/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import exp from "../personnel/import.vue";
  import {mapGetters} from 'vuex'

export default {
  components: {
    exp
  },
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  watch:{
    'community':function(newValue, oldValue){
      if(newValue !== oldValue){
        // this.active = false
        this.$router.replace('/business/cell/area')
        // this.$nextTick(() => (this.active = true))
      }
  },
    $route(to) {
      this.showHeader = !to.meta.hideHeader
    },
  },
  data(){
    return {
      showImport: false,
      showHeader:true,
      active: true,
      disabled:false
    }
  },
  methods:{
    handleClose(){
      this.showAction = false
      this.showImport = false
      this.reload()
    },
    reload(){
      this.active = false
      this.$nextTick(() => (this.active = true))
    },
    openRoomChart(){
      this.$router.push('/business/cell/roomNodes')
    }
  },
  created(){
    this.showHeader = !this.$route.meta.hideHeader
  }
}
</script>

<style scoped>
  @import '../../styles/cell.scss' ;
  
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(100%);
    opacity: 0;
  }
  /* .view{
    height: calc(100vh - 150px);
    overflow-y: auto;
  } */
</style>

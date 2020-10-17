<template>
  <div style="min-height:100%">
    <el-container class="app-main">
      <el-main class="content-main">
        <div class="main-notice-wrap" v-show="hasNotice">
          <div class="main-notice-content" ref="noticeContent">
            <div @click="showAnnouncement=true" 
              ref="noticeText" 
              :class="{'animation-carousel': isRolling}">
              {{notice.content}}
            </div>
          </div>
          <i class="el-alert__closebtn el-icon-close" @click="hiddenNotice"></i>
        </div>

        <transition name="fade-transform" mode="out-in">
          <div class="content-view" :class="{'systemNotice': hasNotice}">
            <!-- <keep-alive :include="includeRoute">
              <router-view v-if="isRouterAlive" @reloadMain=reloadMain()></router-view>
            </keep-alive> -->
            <keep-alive>
              <router-view v-if="keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!keepAlive"></router-view>
          </div>
        </transition>
        
      </el-main>
      <el-dialog
        title="系统通知"
        :visible.sync="showAnnouncement"
        top="15vh"
        width="30%"
        :close-on-click-modal="true">
        <el-card shadow="always">
          {{notice.content}}
        </el-card>
      </el-dialog>
    </el-container>
    <app-footer></app-footer>
  </div>
</template>

<script>
import  AppFooter from './Footer'
import {mapGetters} from 'vuex'
import {getSystemNotice, hiddenSystemNotice} from '@/api/notice'

export default {
  name: 'AppMain',
  components:{
    AppFooter,
  },
  data(){
    return {
      isRouterAlive:true,
      isRolling: false,
      showAnnouncement: false,
      keepAlive: false,
      // includeRoute: [],
      notice: { content: ''}
    }
  },
  computed: {
    hasNotice(){
      return this.notice.content!=''
    },
    ...mapGetters([
      'version'
    ])
  },
  watch:{
    $route(to){
      this.keepAlive = to.meta.keepAlive

      // route路由配置的name需要与组件定义的name对应
      // this.cacheView(to)
    }
  },
  methods:{
    // reloadMain(){
    //   this.isRouterAlive = false
    //   this.$nextTick(() => (this.isRouterAlive = true)) 
    // },
    // cacheView(route) {    
    //   let keepAlive = route.meta.keepAlive;
    //   if(keepAlive && this.includeRoute.indexOf(route.name) == -1){
    //     this.includeRoute.push(route.name)
    //   }
    // },
    needScroll: function() {
      let self = this
      let maxWidth = self.$refs.noticeContent.offsetWidth
      let textWidth = self.$refs.noticeText.offsetWidth
      self.isRolling = textWidth>maxWidth
    },
    getNotice(){
      let self = this
      getSystemNotice().then(function (response) {
        if (response.data && response.data.code === 1 && response.data.data) {
          self.notice = response.data.data
          self.needScroll()
          self.$nextTick(()=> self.needScroll())
        }
      }).catch(function (a) {
        self.loading = false;
      })
    },
    hiddenNotice(){
      this.$confirm('是否隐藏该条系统通知(时效一天)?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this
        hiddenSystemNotice({
          id: self.notice.id
        }).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.notice = { content: '' }
          }
        }).catch(function (a) {
          self.loading = false;
        })
      }).catch(() => {});
    }
  },
  mounted() {
    // this.cacheView(this.$route)
    this.getNotice()
  }
}
</script>
<style lang="scss" scoped>
  .app-main{
    width: 100%;
    // height: calc(100vh - 80px);
    min-height: calc(100vh - 80px)
  }
  .content-main{
    padding:0;
    height: 100%;
    scroll-behavior: smooth;
    position: relative;
    transition: all .3s;
  }
  @media screen and (max-width: 1200px) {
    .content-main {
      // height: calc(100vh - 35px);
      min-height: 100%;
    }
  }
  // .content-view{
  //   min-height: calc(100vh - 80px);
  //   background: #F0F2F5;
  //   overflow-y: auto;
  // }
  .jdDIV{
    height: calc(100vh - 80px) ;
    background: #F0F2F5;
    overflow-y: auto;
  }
  // .systemNotice.content-view{
  //   height: calc(100vh - 80px);
  //   background: #F0F2F5;
  //   overflow-y: auto;
  // }
  .main-notice-wrap{
    position: relative;
    background-color: #fff;
    color: #FF6767;
    font-size: 12px;
    z-index: 1000;
    padding: 5px 10px;
    cursor: default;
    line-height: 25px;
    .main-notice-content{
      background-color: rgba(255,108,108,.1);
      // padding: 0 20px;
      margin-right: 20px;
      overflow: hidden;
      white-space: nowrap;
      position: relative;
      height: 25px;
      >div{
        width: max-content;
        margin: 0 auto;
        cursor: pointer;
        text-align: center;
        &:hover{
          animation-play-state:paused;
        }
      }
    }
    .el-alert__closebtn{
      top: 11.5px;
      right: 15px;
    }
  }
  //文字滚动通知
  .animation-carousel{
    animation: carousel 30s linear infinite;
    transform: translateX(100%);
  }
  @keyframes carousel
  {
    from {transform: translateX(100%);}
    to {transform: translateX(-100%);}
  }
  .main-footer-container {
    // z-index: 200;
    // position: absolute;
    // bottom: 0;
    // left: 90px; //sidebar是 180px宽，这里 左平移90px 是相对全宽度
    height: 30px;
    vertical-align: middle;
    text-align: center;
    line-height: 30px;
    background: #F0F2F5;
    font-size: 14px;
    color: #aaaaaa;
    width: 100%;
  }

  .main-footer {
    letter-spacing: 1px;
    span {
      padding: 0 10px;
    }
  }
</style>

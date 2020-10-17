<template>
<div class="navbar-container">
  <el-menu class="navbar" mode="horizontal">
    <div class="logo-container" v-show="sidebar.opened">
      <span class="logo" :style="'background-image:url('+system.systemUrl+')'"></span>
    </div>
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu clearfix fixed">
      <el-tooltip effect="dark" content="在此切换小区" placement="left">
        <span v-show="showCommunityFilter">
          <el-select v-model="currentCommunity" class="v-top" filterable placeholder="请选择小区" slot="reference" value-key="communityId" @change="setCommunity($event)">
            <el-option
              v-for="item in communityList"
              :key="item.communityId"
              :label="item.communityName"
              :value="item">
            </el-option>
          </el-select>
        </span>
      </el-tooltip>
      
      <!-- <error-log class="errLog-container right-menu-item"></error-log>
      <span>
        <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
          <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>
      </span> -->
      <!-- <span>
        <svg-icon class-name="navbar-svg" icon-class="config"/>
      </span> -->
      <span @click="logout" class="logout">
        <el-tooltip effect="dark" :content="$t('navbar.logOut')" placement="bottom">
          <svg-icon class-name="navbar-svg" icon-class="logout"/>
        </el-tooltip>
      </span>
    </div>
    
  </el-menu>

 <div v-if="showCommunityForm">
    <el-dialog
      title="添加小区"
      :visible.sync="showCommunityForm"
      top="10vh"
      width="60%"
      @close="checkCommunity"
      :close-on-click-modal="false">
        <community-form @close="showCommunityForm=false"/>
    </el-dialog>
  </div> 
<!-- <div v-if="showPhoneForm">
    <el-dialog
      title="绑定手机号"
      :visible.sync="showPhoneForm"
      top="10vh"
      width="40%"
       @close="closeHavePhone"
      :close-on-click-modal="false">
        <phone-form @close="showPhoneForm=false"/>
    </el-dialog>
  </div> -->
 
</div>
  
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import CommunityForm from "../../community/components/form.vue";
  import PhoneForm from "../../layout/components/form.vue";
  // import guide from '@/components/guide'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      // guide
      CommunityForm,
      PhoneForm
    },
    watch: {
      $route(to) {
        this.showCommunityFilter = !to.meta.hideCommunityFilter
      },
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'communityList',
        'community',
        'system'
      ]),
      hasCommunityAuthority(){
        return this.communityList.length > 0
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$confirm('确认退出吗？')
          .then(_ => {
            this.$store.dispatch('LogOut').then(() => {
              location.reload()// In order to re-instantiate the vue-router object to avoid bugs
            })
          })
          .catch(_ => {
          });
      },
      about() {
        this.aboutDialogVisible = true;
      },
      setCommunity(community) {
        this.$store.commit('SET_COMMUNITY', community)
        community.communityId && this.getCommunityConfig(community.communityId)
      },
      getCommunityConfig(communityId) {
        this.$store.dispatch('getCommunityConfig', communityId).then(()=>{
        }).finally(_=>{
          this.$emit('reloadAppMain')
        })
      },
      getDoorType(){
        this.$store.dispatch('getDeviceTypeList').then(()=>{
        }).finally(_=>{
          this.$emit('reloadAppMain')
        })
      },
      checkCommunity(){
        if(this.communityList.length == 0){
          this.$alert('是否马上新建？', '该机构帐号暂未绑定小区', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
            showClose: false,
            callback: action => {
              if(action == 'confirm'){
                this.showCommunityForm = true
              }else{
                this.$store.dispatch('LogOut').then(() => {
                  location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
              }
            }
          });
        }
      },
      checkHavePhone(){
          if(this.$store.state.user.havePhone != 1){
            this.showPhoneForm = true
          }
      },
      closeHavePhone(){
          if(this.$store.state.user.havePhone != 1){
            this.$store.dispatch('LogOut').then(() => {
                location.reload()// In order to re-instantiate the vue-router object to avoid bugs
              })
          }
      }
    },
    data() {
      return {
        aboutDialogVisible: false,
        showCommunityFilter: true,
        showCommunityForm: false,
        showPhoneForm: false,
        currentCommunity: {}
      }
    },
    mounted(){
      this.showCommunityFilter = !this.$route.meta.hideCommunityFilter
      this.currentCommunity = this.community
      this.getCommunityConfig(this.community.communityId)
      this.checkHavePhone()
      this.checkCommunity()
      this.getDoorType()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../../styles/variables.scss';
  .logo-container {
    height: 50px;
    font-size: 12px;
    color: white;
    text-align: center;
    line-height: 50px;
    overflow: hidden;
    display: inline-block;
    width: 180px;
    float: left;
  }
  .logo {
    display: inline-block;
    width: 154px;
    height: 26px;
    vertical-align: middle;
    line-height: 50px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50% 50%;

    /* background: url("../../../../assets/logo.png") center center/contain no-repeat; */
  }
  .navbar-container{
    height: 50px;
  }
  .navbar {
    background: $--color-primary;
    /*color: #fff;*/
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    border: none !important;
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 2000;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: middle;
    }
    .right-menu {
      float: right;
      // height: 100%;
      // padding:0 30px;
      vertical-align: middle;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .logout {
        position: relative;
        top: 3px;
        margin-left: 10px;
      }
    }
  }
  @media (max-width:1400px) { 
    .fixed{
      position: fixed;
      z-index: 100;
      top: 0;
      right: 30px;
    }
  }
  .v-top{
    vertical-align: top
  }
</style>

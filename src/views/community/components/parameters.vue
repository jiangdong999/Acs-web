<template>
  <div class="deploy-form" v-loading="loading">
    <div class="header">
      <label>{{data.communityName}}</label>
      <span>{{data.communityAccount}}</span>
    </div>
    <div>
      <el-tabs v-model="activeName" v-if="!loading" :before-leave="beforeLeave">
        <el-tab-pane label="基本信息" name="baseInfo">
          <baseInfo ref="baseInfo" :data="form" @close="$emit('close')" @submit="$emit('submit')" class="form"/>
        </el-tab-pane>
        <el-tab-pane label="APP配置" name="app" lazy>
          <appSetting ref="app" :data="form" @close="$emit('close')" @submit="$emit('submit')" class="form"/>
        </el-tab-pane>
        <el-tab-pane label="刷脸配置" name="face">
          <faceSetting ref="face" :data="form" @close="$emit('close')" @submit="$emit('submit')" class="form"/>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import { queryCommunity } from "@/api/community";
import baseInfo from './components/deploy-baseInfo'
import appSetting from './components/deploy-appSetting'
import faceSetting from './components/deploy-faceSetting'
export default {
  components:{
    baseInfo,
    appSetting,
    faceSetting
  },
  props:['data'],
  data(){
    return {
      activeName: 'baseInfo',
      loading:false,
      form:{},
    }
  },
  methods:{
    loadCommunityParameters(){
      let self = this;
      self.loading = true;
      queryCommunity({communityId: this.data.communityId}).then(function (response) {
        if (response.data && response.data.code==1) {
          self.form = response.data.data
          // console.log('aaa',self.form)
          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    beforeLeave(activeName, oldActiveName){

      return new Promise((resolve, reject) => {
        
        if(!this.$refs[oldActiveName].checkFormChange()){
          
          this.$confirm('是否提交已修改的信息?', '提示', {
            confirmButtonText: '提交',
            cancelButtonText: '不提交',
            type: 'warning'
          }).then(() => {
            this.$refs[oldActiveName].submit(resolve)
          }).catch(()=>{
            resolve()
          })
        } else { resolve() }
      })
    }
  },
  mounted(){
    this.loadCommunityParameters()
  }
}
</script>

<style scoped>
  .deploy-form{
    padding: 20px;
    min-height: 50%
  }
  .header{
    line-height: 50px;
    color: #333333;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header>label{
    font-size: 26px;
  }
  .header>span{
    font-size: 15px;
    margin-left: 30px;
  }
  .form{
    margin-top: 30px;
  }
</style>

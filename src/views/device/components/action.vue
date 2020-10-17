<template>
  <div class="action-list">
    <div class="action-item">
      <el-image :src="openUrl" ></el-image>
      <p>远程开门</p>
      <el-button type="primary" round @click="openDoor()" :loading="loading1">点击开门</el-button>
    </div>
    <div class="action-item">
      <el-image :src="applicationUrl"></el-image>
      <p>应用重启</p>
      <el-button type="primary" round @click="restartApp()" :loading="loading4">点击重启</el-button>
    </div>
    <div class="action-item">
      <el-image :src="equipmentUrl"></el-image>
      <p>设备重启</p>
      <el-button type="primary" round @click="restartDevice()" :loading="loading2">点击重启</el-button>
    </div>
    <div class="action-item">
      <el-image :src="upgradeUrl"></el-image>
      <p>设备升级</p>
      <el-button @click="handleUp()" :class="{'disabled': device.upgradeStatus != '1'}" :loading="loading3">
        {{ device.upgradeStatus | transUpgradeStatus }}
      </el-button>
    </div>
    <div class="action-item">
      <el-image :src="upgradeUrl"></el-image>
      <p>2.0版本升级</p>
      <el-button @click="handleUp3()"  :loading="loading5">
        升级3.0
      </el-button>
    </div>
  </div>
</template>

<script>
// import {upDevice, restartDevice, restartApp, openDoor} from "@/api/device";
import {deviceControl} from '@/api/devicev1';
import openUrl from "@/assets/icon/icon_open.png";
import equipmentUrl from "@/assets/icon/img_equipment.png";
import upgradeUrl from "@/assets/icon/img_upgrade.png";
import applicationUrl from "@/assets/icon/iocn_application.png";

export default {
  props:['device'],
  filters:{
    transUpgradeStatus(status){
      switch(status){
        case '0': return '无新版本';break;
        case '1': return '点击升级';break;
        case '2': return '升级中';break;
      }
    }
  },
  data(){
    return {
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      openUrl,
      equipmentUrl,
      upgradeUrl,
      applicationUrl
    }
  },
  methods:{
    handleUp(){
      if(this.device.upgradeStatus !== '1') return;

      let self = this;
      self.$confirm('确定升级该设备吗？')
        .then(_ => {
          self.loading3 = true;
          deviceControl({
            deviceCode: self.device.deviceCode,
            control:9,
            latestVersion:self.device.doorVersion
          }).then(res=>{
            if(res.data&&res.data.status === 0){
              self.$message({
                message: res.data.message,
                type:'success'
              })
            }
          }).catch(e=>{
          }).finally(_=>{
            self.loading3 = false
          })
          // 
          // upDevice({id: self.device.doorId}).then(function (response) {
          //   if (response.data && response.data.code === 1) {
          //     self.device.upgradeStatus = '2'
          //     self.$message({
          //       message: response.data.message,
          //       type: 'success'
          //     });
          //   }
          // }).catch(function (a) {
          // }).finally(_=>{
          //   self.loading3 = false;
          // })
        })
        .catch((a) => {
        });
    },
    handleUp3(){
      let self = this;
      self.$confirm('确定升级该设备吗？')
        .then(_ => {
          self.loading5 = true;
          deviceControl({
            deviceCode:self.device.deviceCode,
            control:9,
            latestVersion:self.device.doorVersion,
          }).then(res=>{
            if(res.data&&res.data.status === 0){
              self.device.upgradeStatus = '2'
              self.$message({
                message: res.data.message,
                type: 'success'
              });
            }
          }).finally(_=>{
            self.loading5 = false
          })
          // upDevice({id: self.device.doorId}).then(function (response) {
          //   if (response.data && response.data.code === 1) {
          //     self.device.upgradeStatus = '2'
          //     self.$message({
          //       message: response.data.message,
          //       type: 'success'
          //     });
          //   }
          // }).catch(function (a) {
          // }).finally(_=>{
          //   self.loading5 = false;
          // })
        })
        .catch((a) => {
        });
    },
    openDoor(){
      let self = this;
      self.$confirm('确定开门吗？')
        .then(_ => {
          self.loading1 = true;
          deviceControl({
            deviceCode: self.device.deviceCode,
            control:6
          }).then(res=>{
            self.loading1 = false;
            if(res.data&&res.data.status === 0){
              self.$message({
                message: res.data.message,
                type:'success'
              })
            }
          }).catch(e=>{
            self.loading1 = false
          }).finally(_=>{
            self.loading1 = false
          })

          // openDoor({
          //   doorName:self.device.doorName,
          //   communityId:self.device.communityId,
          //   doorDeviceId: self.device.doorDeviceId
          // }).then(function (response) {
          //   self.loading1 = false;
          //   if (response.data && response.data.code === 1) {
          //     self.$message({
          //       message: response.data.message,
          //       type: 'success'
          //     });
          //   }
          // }).catch(function (a) {
          //   self.loading1 = false;
          // }).finally(_=>{
          //   self.loading1 = false;
          // })
        })
        .catch((a) => {
          self.loading1 = false;
        });
    },
    //应用重启
    restartApp(){
      let self = this;
      self.$confirm('确定重启应用吗？')
        .then(_ => {
          self.loading4 = true;
          deviceControl({
            deviceCode: self.device.deviceCode,
            control:8,
          }).then(res=>{
            if(res.data&&res.data.status === 0){
              self.$message({
                message: res.data.message,
                type:'success'
              })
            }
          }).catch(e=>{
          }).finally(_=>{
            self.loading4 = false
          })
          // restartApp({
          //   // doorName:self.device.doorName,
          //   // communityId:self.device.communityId,
          //   doorDeviceId: self.device.doorDeviceId
          // }).then(function (response) {
          //   self.loading4 = false;
          //   if (response.data && response.data.code === 1) {
          //     self.$message({
          //       message: response.data.message,
          //       type: 'success'
          //     });
          //   }
          // }).catch(function (a) {
          //   self.loading4 = false;
          // }).finally(_=>{
          //   self.loading4 = false;
          // })
        })
        .catch((a) => {
          self.loading2 = false;
        });
    },
    restartDevice(){
      let self = this;
      self.$confirm('确定重启门禁机吗？')
        .then(_ => {
          self.loading2 = true;
          deviceControl({
            deviceCode: self.device.deviceCode,
            control:7,
          }).then(res=>{
            if(res.data&&res.data.status === 0){
              self.$message({
                message: res.data.message,
                type:'success'
              })
            }
          }).catch(e=>{
          }).finally(_=>{
            self.loading2 = false
          })
          // restartDevice({
          //   doorName:self.device.doorName,
          //   communityId:self.device.communityId,
          //   doorDeviceId: self.device.doorDeviceId
          // }).then(function (response) {
          //   self.loading2 = false;
          //   if (response.data && response.data.code === 1) {
          //     self.$message({
          //       message: response.data.message,
          //       type: 'success'
          //     });
          //   }
          // }).catch(function (a) {
          //   self.loading2 = false;
          // }).finally(_=>{
          //   self.loading2 = false;
          // })
        })
        .catch((a) => {
          self.loading2 = false;
        });
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .action-list{
    width: 100%;
    margin: 0 auto;
    // padding: 0px 30px;
  }
  .action-item{
    padding: 14px 20px;
    background-color: #F2F5F5;
    border-radius: 4px;
    margin-bottom: 10px;
    // line-height: 70px;
    height: 70px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    vertical-align: top;
    .iconfont{
      font-size: 42px;
      color: #7F97B7;
      float: left;
      margin-right: 15px;
      font-weight: 500;
    }
    p{
      display: inline-block;
      // line-height: 70px;
      margin: 0;
      vertical-align: top;
      line-height: 45px;
    }
    >button{
      line-height: 16px;
      background-color: #007BE7;
      color: #fff;
      text-align: center;
      float: right;
      border-radius: 18px;
      font-size: 14px;
      cursor: pointer;
      font-weight: normal;
      transition: .3s all;
      &:hover{
        opacity: .7;
      }
    }
    >.disabled{
      cursor: not-allowed;
      background-color: #ADADAD;
    }
  }

</style>
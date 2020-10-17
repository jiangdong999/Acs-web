<template>
  <div class="action-list">
    <div class="action-item">
      <el-image :src="openUrl"></el-image>
      <p>远程开门</p> 
      <el-button type="primary" round @click="openDoor()" :loading="loading1">点击开门</el-button>
    </div>
    <div class="action-item">
      <el-image :src="equipmentUrl"></el-image>
      <p>设备重启</p> 
      <el-button type="primary" round @click="restartDevice()" :loading="loading4">点击重启</el-button>
    </div>
  </div>
</template>

<script>
import {upDevice, restartDevice, openDoor} from "@/api/device";
import openUrl from "@/assets/icon/icon_open.png";
import equipmentUrl from "@/assets/icon/img_equipment.png";
export default {
  props:['device'],
  data(){
    return {
      loading: false,
      openUrl,
      equipmentUrl
    }
  },
  methods:{
    openDoor(){
      let self = this;
      self.$confirm('确定开门吗？')
        .then(_ => {
          openDoor({
            doorName:self.device.doorName,
            communityId:self.device.communityId,
            doorDeviceId: self.device.doorDeviceId
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
            }
          }).catch(function (a) {
          }).finally(_=>{
          })
        })
        .catch((a) => {
        });
    },
    restartDevice(){
      let self = this;
      self.$confirm('确定重启门禁机吗？')
        .then(_ => {
          self.loading = true;
          restartDevice({
            doorName:self.device.doorName,
            communityId:self.device.communityId,
            doorDeviceId: self.device.doorDeviceId
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
            }
          }).catch(function (a) {
          }).finally(_=>{
            self.loading = false;
          })
        })
        .catch((a) => {
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
    line-height: 40px;
    height: 70px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
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
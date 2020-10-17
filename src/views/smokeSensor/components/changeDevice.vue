<template>
  <el-form ref="form" :rules="rules" :model="form">
    <div class="dialog-form">
      <p>{{device.doorName}}</p>
      <label>更换设备为</label>
      <div class="input">
        <el-form-item prop="doorDeviceId" :show-message="false">
          <el-input v-model="form.doorDeviceId" @input="toLowerCase" :maxlength="32" clearable placeholder="请输入设备编号"/>
        </el-form-item>
      </div>
      <div class="form-dialog-control-area">
        <el-button @click="$parent.handleClose()">取消</el-button>
        <el-button @click="handleSubmit()" type="primary" :loading="loading">确定</el-button>
      </div>
    </div>
  </el-form>
</template>

<script>
import {replaceDevice} from "@/api/device";
import {validateNumberAndLetter} from "@/utils/rules";

export default {
  props:['device'],
  data(){
    return {
      loading: false,
      form:{
        doorDeviceId:''
      },
      rules: {
        doorDeviceId: [
          {required: true, message: '请输入设备编号', trigger: 'blur'},
          {message: '请输入数字与字母，不能输入其他字符', validator: validateNumberAndLetter}
        ]
      }
    }
  },
  methods:{
    toLowerCase(string){
      this.form.doorDeviceId = string.toLowerCase()
    },
    handleSubmit(data){
      let self = this

      self.$refs.form.validate((valid,error) => {
        if(valid){
          self.loading = true
          replaceDevice({
            oldDoorDeviceId: self.device.doorDeviceId,
            doorName: self.device.doorName,
            communityId: self.device.communityId,
            doorId: self.device.doorId,
            doorDeviceId: self.form.doorDeviceId
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.$emit('submit')
            }
          }).catch(function (a) {
          }).finally(_=>{
            self.loading = false;
          })
        }else{
          self.$message({
            message: error.doorDeviceId[0].message,
            type: 'error'
          });
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-form{
    text-align: left;
    >p{
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin: 0;
      margin-bottom: 15px;
    }
    >label{
      font-size: 14px;
      line-height: 22px;
      color: #999;
    }
    >.input{
      margin: 10px 0 40px 0;
    }
    >.info-sync{
      margin: 40px 0;
      text-align: center;
      >div{
        width: 220px;
        display: inline-block;
        padding: 0 30px;
        h3{
          font-size: 30px;
          margin: 10px 0;
          span{
            color: #FF5555;
          }
        }
      }
    }
  }
  /deep/.el-input{
    width: 320px;
    height: 36px;
  }
</style>

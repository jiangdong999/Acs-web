<template>
  <div class="container">
    <div class="header">
      <span>物业管理处</span>
      <span class="control-right">
        <el-button type="primary" plain @click="$router.back()">返回</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
      </span>
    </div>
    <div class="content" v-loading="loading">
      <el-form :model="form" label-width="120px">
        <el-form-item label="电话开门号码" class="form-item">
          <el-switch
            v-model="form.pstnStatus"
            active-value="1"
            inactive-value="0"
            :active-text="statusText">
          </el-switch>
        </el-form-item>
        <el-form-item label="电话开门号码" class="form-item">
          <el-input v-model="form.timeoutCallNumber" placeholder="请输入" :maxlength="11"/>
        </el-form-item>
        <el-form-item label="物业手机号" class="form-item">
          <el-input v-model="form.phone" placeholder="请输入" :maxlength="11"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addManagementSetting, managementDetail } from "@/api/room";
import {mapGetters} from 'vuex'

export default {
  computed:{
    ...mapGetters([
      'community'
    ]),
    statusText(){
      return this.form.pstnStatus == '1'?'已启用': '未启用'
    }
  },
  data(){
    return {
      loading: false,
      form:{
        pstnStatus: '0',
        timeoutCallNumber:'',
        phone:''
      }
    }
  },
  methods:{
    loadDetails(){
      let self = this;
      self.loading = true;

      managementDetail({
        roomNodeId: self.$route.query.roomNodeId
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          let data = response.data.data
          self.form.pstnStatus = data.pstnStatus
          self.form.timeoutCallNumber = data.timeoutCallNumber
          self.form.phone = data.phone
          self.loading = false;
        }
      })
      .catch(function(a) {
        console.error(a);
      })
    },
    handleSubmit(){
      let self = this;
      self.loading = true;

      addManagementSetting({
        ...self.community,
        ...self.$route.query,
        ...self.form
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          self.$message.success(response.data.message)
          self.$router.back()
        }
      })
      .catch(function(a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      });
    }
  },
  mounted(){
    this.loadDetails()
  }
}
</script>

<style lang="scss" scoped>
  .header{
    line-height: 70px;
    padding: 0 50px;
    background-color: #fff;
    font-weight: 900;
    cursor: default;
  }
  .header>.control-right{
    font-size: 13px;
  }
  .content{
    margin-top: 30px;
    padding: 20px 10px;
  }
  .form-item{
    width: 320px;
  }
  .container /deep/.el-form-item--medium .el-form-item__label{
    padding-top: 10px;
  }
</style>

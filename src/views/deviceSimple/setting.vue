<template>
  <div v-loading="loading">
    <div class="topBar">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
      <div>{{form.doorName}}</div>
      <span>{{form.communityAddress}}</span>
    </div>

    <div class="device-content normal-width-input">
      <div class="module">
        <div class="module-title">
          <mallki class="mallki-text" text="门禁机设置"></mallki>
        </div>
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="门禁机名称" prop="doorName" :rules="[{required: true, message: '门禁机名称不能为空'}]">
            <el-input type="text" v-model="form.doorName" :maxlength="30" placeholder="请输入门禁机名称" clearable/>
          </el-form-item>
          <el-form-item label="工程密码" prop="engineeringModeLoginPassword">
            <el-input type="text" placeholder="初始工程密码为000000" v-model="form.engineeringModeLoginPassword" disabled clearable/>
          </el-form-item>
          <!-- <el-form-item label="刷脸类型" prop="faceStatus">
            <el-select v-model="form.faceStatus" placeholder="请选择">
              <el-option value="1" label="在线（默认）"/>
              <el-option value="2" label="云离线"/>
              <el-option value="3" label="脱机"/>
              <el-option value="4" label="抓拍"/>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="人脸底库" prop="facePassVersion" v-if="form.faceStatus!='1'">
            <el-select v-model="form.facePassVersion" placeholder="请选择">
              <el-option value="0" label="使用小区配置"/>
              <el-option value="1" label="2000底库"/>
              <el-option value="3" label="5000底库"/>
            </el-select>
          </el-form-item> -->
          <el-form-item label="刷脸方式" prop="isCloudCooperate">
            <el-radio v-model="form.isCloudCooperate" :label="0">配合</el-radio>
            <el-radio v-model="form.isCloudCooperate" :label="1">非配合</el-radio>
          </el-form-item>
            <div class="form-control">
              <el-button type="default" @click="$router.back()">取消</el-button>
              <el-button type="primary" @click="handleSubmit()" :loading="btnLoading">保存</el-button>
            </div>
        </el-form>
      </div>
      <div class="hr"></div>
      <div class="module">
        <div class="module-title">
          <mallki class="mallki-text" text="开门密码"></mallki>
          <div class="set-btn" @click="showPW=true">点击设置</div>
        </div>
      </div>
    </div>
    <div v-if="showPW">
      <el-dialog
        title="开门密码"
        width="512px"
        :visible.sync="showPW"
        :close-on-click-modal="true">
        <passWord @successCallback="showPW=false" :doorId="$route.query.id"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import passWord from "./components/passWord.vue";
import {detailDevice, modifyDevice} from "@/api/device";
export default {
  components:{
    passWord
  },
  data(){
    return {
      loading: false,
      btnLoading: false,
      showPW: false,
      form: {
        doorName: '',
        engineeringModeLoginPassword: '',
        faceStatus: '',
        facePassVersion:'',
        isCloudCooperate: ''
      },
    }
  },
  methods:{
    handleSubmit: function (formName) {
      let self = this;
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.btnLoading = true
          modifyDevice(self.form).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
            }
          }).catch(function (a) {
            console.error(a)
          }).finally(_=>{
            self.btnLoading = false
          });
        }
      });
    },
    initDevice: function () {
      let self = this;
      self.loading = true;
      detailDevice({id: self.$route.query.id}).then(function (response) {
        if (response.data && response.data.code ==1) {
          self.form = response.data.data
          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a)
      });
    }
  },
  mounted(){
    this.initDevice()
  }
}
</script>

<style scoped>
.hr{
  height: 1px;
  background-color: #DCDFE6;
  margin: 30px 0;
}
.topBar {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #fff;
  font-size: 14px;
}
.topBar > div {
  font-size: 16px;
  color: #000;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
.topBar > span {
  color: rgba(136, 136, 136, 1);
}
.device-content{
  background-color: #fff;
  margin: 20px 30px;
  padding: 20px 100px;
  border-radius: 4px;
}
.module{
  background-color: #fff;
  margin: 0;
}
.module-title{
  margin-bottom: 30px
}
.form-control{
  text-align: right;
}
.set-btn{
  display: inline-block;
  margin-left: 30px;
  width: 100px;
  line-height: 40px;
  background-color: #007BE7;
  color: #fff;
  text-align: center;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: normal;
  transition: .3s all;
}
.set-btn:hover{
  opacity: .7;
}
</style>

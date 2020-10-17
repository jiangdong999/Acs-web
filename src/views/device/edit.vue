<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="运维手机" prop="maintenanceNumber">
        <el-input v-model="form.maintenanceNumber" placeholder="请输入手机号码" :maxlength="11" type="tel"  clearable/>
      </el-form-item>
      <el-form-item label="门禁机名称" prop="doorName">
        <el-input type="text" v-model="form.doorName" :maxlength="20" placeholder="请输入门禁机名称" clearable/>
      </el-form-item>
      <el-form-item label="设备编号" prop="doorDeviceId">
        <el-input type="text" v-model="form.doorDeviceId" :maxlength="32" placeholder="请输入设备编号" clearable/>
      </el-form-item>
      <el-form-item label="门禁机位置" prop="communityAddress">
        <el-input type="text" v-model="form.communityAddress" disabled clearable/>
      </el-form-item>
      <el-form-item label="工程密码" prop="engineeringModeLoginPassword">
        <el-input type="text" placeholder="门禁机初始工程密码为000000" v-model="form.engineeringModeLoginPassword" disabled clearable/>
      </el-form-item>
      <el-form-item label="刷脸方式" prop="faceStatus">
        <el-select v-model="form.faceStatus" placeholder="请选择">
          <el-option value="1" label="在线（默认）"/>
          <el-option value="2" label="云离线"/>
          <el-option value="3" label="脱机"/>
          <el-option value="4" label="抓拍"/>
        </el-select>
      </el-form-item>
      <el-form-item label="人脸底库" prop="facePassVersion" v-if="form.faceStatus!='1'">
        <el-select v-model="form.facePassVersion" placeholder="请选择">
          <el-option value="0" label="使用小区配置"/>
          <el-option value="1" label="2000底库"/>
          <el-option value="3" label="5000底库"/>
        </el-select>
      </el-form-item>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {modifyDevice, detailDevice} from "@/api/device";
  import {validateNumberAndLetter, validateMobile} from "@/utils/rules";

  export default {
    name: "device-edit",
    props: {
      data: {
        type: [Number, Object, String],
      }
    },

    data() {
      return {
        form: {
          communityName: '',
          communityId: '',
          communityAddress: '',
          maintenanceNumber: '',
          doorDeviceId: '',
          buildingUse: '',
          engineeringModeLoginPassword:'',
          faceStatus:'1',
          facePassVersion:'0'
        },
        propertyList: [],
        communityList: [],
        nodeOptions: [],
        rules: {
          doorName: [
            {required: true, message: '请输入门禁机名称', trigger: 'blur'}
          ],
          maintenanceNumber: [
            {required: true, message: '请输入管理处负责人电话', trigger: 'blur'},
            {message: '请输入正确的手机号', validator: validateMobile}
          ],
          doorDeviceId: [
            {required: true, message: '请输入设备编号', trigger: 'blur'},
            {message: '请输入数字与字母，不能输入其他字符', validator: validateNumberAndLetter}
          ]
        },
      }
    },
    methods: {
      handleSubmit: function (formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            modifyDevice(self.form).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
              }

              self.$parent.$parent.handleClose();
            }).catch(function (a) {
              console.error(a)
            });
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      handleClose: function () {
        this.$parent.handleClose();
      },
      initDevice: function () {
        let self = this;
        if (self.data) {
          detailDevice({id: self.data}).then(function (response) {
            if (response && response.data) {
              self.form = {...self.form, ...response.data.data};
              self.loading = false;
            }
          }).catch(function (a) {
            console.error(a)
          });
        }
      }
    },
    mounted() {
      this.initDevice();
    },
  }
</script>

<style scoped>

</style>

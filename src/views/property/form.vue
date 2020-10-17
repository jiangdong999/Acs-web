<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <!--<div v-if="editMode">-->
        <el-form-item v-loading="loading" label="帐号" prop="propertyAccount">
          <el-input v-model="form.propertyAccount"/>
        </el-form-item>
      <!--</div>-->
      <el-form-item label="单位全称" prop="propertyFullName">
        <el-input v-model="form.propertyFullName" maxlength="30" placeholder="请输入小区名称" clearable/>
      </el-form-item>
      <el-form-item label="单位简称" prop="propertyName">
        <el-input v-model="form.propertyName" maxlength="30" placeholder="请输入小区名称" clearable/>
      </el-form-item>
      <el-form-item label="帐号类型" prop="accountType">
        <el-select v-model="form.accountType" filterable placeholder="请选择">
          <el-option
            v-for="item in accountTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input type="password" :maxlength="16" v-model="form.password" placeholder="请输入密码" clearable/>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input type="password" :maxlength="16" v-model="form.passwordConfirm" placeholder="请再次输入密码进行确认" clearable/>
      </el-form-item>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {generateAccount, saveProperty} from "@/api/property";

  export default {
    name: "property-form",
    props: {
      editMode: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const passwordCheck = (rule, value, callback) => {
        let password = this.form.password;
        if (password) {
          if (this.form.passwordConfirm !== password) {
            callback(new Error('输入的两个密码不一致，请检查'));
            return;
          }
        }
        callback();
      };
      return {
        form: {
          propertyName: '',
          propertyFullName: '',
          propertyAccount: '',
          accountType: '',
          password: '',
          passwordConfirm: '',
        },
        loading: true,
        rules: {
          propertyName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          propertyFullName: [
            {required: true, message: '请输入单位全称', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min:6, message: '密码位数不能低于6位', trigger: 'blur'},
            {max: 16, message: '密码位数不能多于16位', trigger: 'blur'},
          ],
          passwordConfirm: [
            {required: true, message: '请确认密码', trigger: 'blur'},
            {validator: passwordCheck, trigger: 'blur'}
          ],
          accountType: [
            {required: true, message: '请选择帐号类型', trigger: 'blur'},
          ]
        },
        accountTypeOptions: [
          {value: '1', label: '正式'},
          {value: '2', label: '演示'},
          {value: '3', label: '其他'},
        ],
      }
    },
    methods: {
      initAccount: function () {
        let self = this;
        if (!self.editMode) {
          return generateAccount().then(function (response) {
            if (response && response.data) {
              self.form.propertyAccount = response.data.data.propertyAccount;
              self.loading = false;
            }
          }).catch(function (a) {
            console.error(a)
          });
        }
      },
      handleSubmit: function (formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            saveProperty(self.form).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
                self.$parent.$parent.handleClose();
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }

            }).catch(function (a) {
              console.error(a)
            });
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      handleCancel: function(done) {
        let self = this;
        this.$confirm('确认关闭？')
          .then(_ => {
            self.$parent.handleClose();
          })
          .catch(_ => {
          });
      },
    },
    mounted() {
      this.initAccount();
    },
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <!--<div v-if="editMode">-->
      <el-form-item label="帐号" prop="propertyAccount">
        <el-input v-model="form.propertyAccount" disabled/>
      </el-form-item>
      <!--</div>-->
      <el-form-item label="单位全称" prop="propertyFullName">
        <el-input v-model="form.propertyFullName" maxlength="30" placeholder="请输入小区名称" clearable/>
      </el-form-item>
      <el-form-item label="单位简称" prop="propertyName">
        <el-input v-model="form.propertyName" maxlength="30" placeholder="请输入小区名称" clearable/>
      </el-form-item>
      <div>
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
      </div>
      <div>
        <p class="text-center">
          <a @click="togglePassword">修改密码
            <svg-icon iconClass="icon_arrow-up-double"/>
          </a>
        </p>
      </div>
      <div v-if="showPassword">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" :maxlength="16" v-model="form.oldPassword" placeholder="请输入原密码" clearable/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" :maxlength="16" v-model="form.password" placeholder="请输入密码" clearable/>
        </el-form-item>
        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input type="password" :maxlength="16" v-model="form.passwordConfirm" placeholder="请再次输入密码进行确认" clearable/>
        </el-form-item>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {generateAccount, modifyProperty} from "@/api/property";
  import permission from "@/directive/permission/index";

  export default {
    name: "property-edit",
    props: {
      editMode: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: {}
      }
    },
    directives: {
      permission
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
          accountType: '3',
          oldPassword: '',
          password: '',
          passwordConfirm: '',
        },
        showPassword: false,
        loading: true,
        rules: {
          propertyName: [
            {required: true, message: '请输入单位名称', trigger: 'blur'}
          ],
          propertyFullName: [
            {required: true, message: '请输入单位全称', trigger: 'blur'}
          ],
          oldPassword: [
            {required: true, message: '请输入原密码', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码位数不能少于6位', trigger: 'blur'},
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
      handleSubmit: function (formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {

            modifyProperty(self.form).then(function (response) {
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
                self.form.oldPassword = '';
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
      handleCancel: function () {
        let self = this;
        self.$parent.handleClose();
      },
      togglePassword: function () {
        let self = this;
        self.showPassword = !self.showPassword;
      }
    },
    mounted() {
      if (this.data) {
        this.form = Object.assign(this.form, this.data);
      }
    },
  }
</script>

<style scoped>

</style>

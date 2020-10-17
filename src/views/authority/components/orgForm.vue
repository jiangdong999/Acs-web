<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构帐号" prop="account">
            <el-input v-model.trim="form.account" clearable placeholder="请填写机构帐号" @change="verifyAccount" maxlength="20">
              <template slot="prepend">JG-</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帐号密码" prop="password">
            <el-input v-model.trim="form.password" placeholder="请填写帐号密码" maxlength="16" :type="pswVisibility?'type':'password'">
              <i slot="suffix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名" prop="orgName">
            <el-input v-model.trim="form.orgName" maxlength="20" clearable placeholder="请填写机构名"/>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="机构编码" prop="orgCode">
            <el-input v-model.trim="form.orgCode" clearable placeholder="请填写机构前缀" @change="verifyOrgCode"/>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="机构负责人" prop="leaderName">
            <el-input v-model.trim="form.leaderName" maxlength="20" clearable placeholder="请填写机构负责人"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人电话" prop="leaderPhone">
            <el-input v-model.trim="form.leaderPhone" clearable placeholder="请填写负责人电话" maxlength="11" @input="verifyPhone"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import { createTopOrg, isOrgCodeExist, isAccountExist, isPhoneExist } from "@/api/authority";
  import { validateMobile, validateNumberAndLetter } from "@/utils/rules";
  import { getRandomString } from "@/utils/index";

  export default {
    data() {
      return {
        loading:false,
        pswVisibility: true,
        form: {
          account: '',
          password: '',
          orgName: '',
          orgCode: '',
          leaderName: '',
          leaderPhone: '',
        },
        rules:{
          account: [
            {required: true, message: '请填写机构帐号', trigger: 'blur'},
            {validator: validateNumberAndLetter, message: '请填写正确的机构帐号'},
            { min: 2, max: 20, message: '请填入2-20位格式的机构帐号' },
          ],
          password: [
            {required: true, message: '请填写机构帐号密码', trigger: 'blur'},
            { min: 6, max: 16, message: '请填入6-16位的机构帐号密码' },
            {validator: validateNumberAndLetter, message: '请填写正确的机构帐号密码'},
          ],
          orgName: [
            {required: true, message: '请填写机构名称', trigger: 'blur'},
            { min: 2, max: 20, message: '请填入2-20位格式的机构名称' },
          ],
          orgCode: [
            {required: true, message: '请填写机构前缀', trigger: 'blur'},
            { min: 2, max: 6, message: '请填入2-6位格式的机构编码' }
          ],
          leaderName: [
            // {required: true, message: '请填写机构负责人名称', trigger: 'blur'},
            { min: 2, max: 10, message: '请填入2-10位格式的机构负责人名称' }
          ],
          leaderPhone: [
            // {required: true, message: '请填写机构负责人手机号', trigger: 'blur'},
            {validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleSubmit(){
        let self = this;
        
        this.$refs.form.validate(valid => {
          if(valid){
            self.loading = true;
            let params = { ...self.form }
            params.account = 'JG-'+self.form.account
            createTopOrg(params).then(function (response) {
              if (response && response.data.code === 1) {
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.$emit('close')
              }
            }).catch(function (a) {
              console.error(a);
            }).finally(_=>{
              self.loading = false;
            })
          }
        })
      },
      verifyAccount(value){
        let self = this
        isAccountExist({
          account: 'JG-'+value
        }).then(function (response) {
          if (response && response.data.code === 1) {
            if(response.data.data.isExist){
              self.$message({
                message: '存在重复帐号',
                type: 'error'
              })
              self.form.account=''
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      verifyOrgCode(value){
        let self = this
        isOrgCodeExist({
          orgCode: value
        }).then(function (response) {
          if (response && response.data.code === 1) {
            if(response.data.data.isExist){
              self.$message({
                message: '存在重复编码',
                type: 'error'
              })
              self.form.orgCode=''
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      verifyPhone(value){
        if(value.length<11){
          return
        }
        let self = this
        isPhoneExist({
          phone: value
        }).then(function (response) {
          if (response && response.data.code === 1) {
            if(response.data.data.isExist){
              self.$message({
                message: '存在重复联系电话',
                type: 'error'
              })
              self.form.leaderPhone=''
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      reset(){
        this.form.password = getRandomString(6)
      }
    },
    created(){
      this.reset()
    }
  }
</script>
<style scoped>
</style>


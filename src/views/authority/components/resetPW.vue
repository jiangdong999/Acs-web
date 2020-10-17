<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" class="content">
      <div class="info">
        {{data.orgInfo.leaderName}} &emsp;{{data.orgInfo.orgName}}
      </div>
      <div class="password">
        <el-button type="text" @click="getRandomPassword">点击重置</el-button> &emsp;新密码
        <el-form-item prop="password" :show-message="false">
          <el-input v-model.trim="form.password" placeholder="请填写帐号密码" maxlength="16" :type="pswVisibility?'type':'password'">
            <i slot="suffix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    
    <div class="form-dialog-control-area">
      <el-button type="primary" @click="reset" :loading="loading">确定</el-button>
    </div>
  </div>

</template>

<script>
  import { resetPassword } from "@/api/authority";
  import { validateNumberAndLetter } from "@/utils/rules";
  import { getRandomString } from "@/utils/index";

  export default {
    props:['data'],
    data() {
      return {
        loading:false,
        pswVisibility: true,
        form: {
          password: ''
        },
        rules: {
          password: [
            {required: true, message: '请填写登录密码', trigger: 'blur'},
            {validator: validateNumberAndLetter, message: '请填写正确登录密码'},
            { min: 6, max: 16, message: '请输入6-16位的登录密码' }
          ],
        }
      }
    },
    methods: {
      getRandomPassword(){
        this.form.password = getRandomString(6)
      },
      reset(){
        this.$refs.form.validate((valid,error) => {
        if(valid){
          this.loading = true
          resetPassword({
            account:this.data.account,
            password: this.form.password
          }).then((response) =>{
            if (response.data && response.data.code === 1) {
              this.form.password = response.data.data

              this.$message({
                message: response.data.message,
                type: 'success'
              });
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_=>{
            this.loading = false;
          })
        }else{
          this.$message({
            message: error.password[0].message,
            type: 'error'
          });
        }
      })
      },
    },
    created() {
      this.getRandomPassword()
    },
  }
</script>
<style scoped>
  .content{
    text-align: center;
    color: #333333;
    margin-bottom: 30px;
  }
  .info{
    font-size: 18px;
    line-height: 50px;
    margin-bottom: 20px;
  }
  .password{
    font-size: 12px;
  }
  .password>span{
    color: #4A90E2;
    text-decoration: underline;
    cursor: pointer;
  }
  .password>p{
    font-size: 36px;
    line-height: 60px;
    color: #ff0000;
    margin: 0;
  }
</style>


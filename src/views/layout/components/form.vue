<template>
  <div @click="showDialog=false">
    <el-form ref="form" :rules="rules" :model="form">
      <div class="top">
        <div class="t">当前帐号 {{userName}}</div>
        <div class="f">为提升安全保障等级，后续将统一使用手机号登录。</div>
        <div class="f">您的帐号暂未绑定手机号，请绑定后再使用。</div>
      </div>
      <div class="middle">
        <el-form-item prop="phone" key="phone">
          <div class="row-code">
            <span>
              <div class="tips">手机验证码</div> 
              <el-input name="vcode" type="number" :maxlength="6" clearable @keyup.enter.native="handleLogin('form')"
                  v-model="form.vcode" placeholder="输入验证码">
                <i slot="prefix" class="iconfont icon-duanxin"></i>
              </el-input>
            </span> 
            <span>
              <el-button type="primary" :loading="codeLoading" class="primary" size="small" @click="getCode(form.phone)" :disabled="!show">{{show? '获取验证码': count+'s后重新获取'}}</el-button>
            </span>
          </div>
        </el-form-item>

        <el-form-item prop="vcode" key="vcode" >
          <span>
            <div class="tips">手机验证码</div> 
              <el-input name="vcode" type="number" :maxlength="6" clearable @keyup.enter.native="handleLogin('form')"
                    v-model="form.vcode" placeholder="输入验证码">
                <i slot="prefix" class="iconfont icon-duanxin"></i>
              </el-input>
            </span>
        </el-form-item>
        <div class="form-dialog-control-area">
          <el-button type="default" @click="handleClose">暂不登录</el-button>
          <el-button type="primary" @click="handleLogin('form')" :loading="loading">绑定手机</el-button>
          <!-- <el-button type="default" @click="handleClose">取消</el-button> -->
        </div>  
      </div>
     
    </el-form>
  </div>

</template>

<script>
  import { validateMobile } from "@/utils/rules";
  import { sendCode,registPhone } from '@/api/login'
  import {setHavePhone} from '@/utils/auth'

  export default {
    name: "phone-form",
    data() {

      return {
        loading:false,
        showDialog:false,
        show: true,
        codeLoading: false,
        count: '',
        userName: this.$store.state.user.userName,
        form: {
          account: '',
          phone: '',
          vcode: ''
        },
        rules: {
          phone: [
            {required: true, message: '请输入正确手机号', trigger: 'blur'},
            {validator: validateMobile, message: '请输入正确手机号', trigger: 'blur'}
          ],
          vcode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {max:6, message: '请输入正确验证码', trigger: 'blur'}
          ]
        }
      }
    },
     methods: {
      handleLogin(formName) {
         let _this = this
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            registPhone({
              phone: _this.form.phone,
              verifyCode: _this.form.vcode
            }).then(function(response){

               _this.loading = false
               if (response.data && response.data.code === 1) {
                  _this.$message({
                  message: response.data.message,
                  type: 'success'
                });
                  _this.$store.commit("SET_HAVE_PHONE", 1);
                  setHavePhone(1)
                _this.$parent.handleClose();
               }
            }).catch(function (a) {
              console.error(a);
            }).finally(_=>{
              _this.codeLoading = false
            })
            // this.$store.dispatch('LoginByUsername', data).then(() => {

            //   this.loading = false
            //   this.$router.push({path: '/'})
            // }).catch(() => {
            //   this.loading = false
            // })
          } else {
            return false
          }
        })
      },
      getCode(phone){
        let self = this
        let no = /^1(3|4|5|6|7|8|9)\d{9}$/g;
        if (!phone || !no.test(phone)) {
          self.$message.error('请输入正确的手机号码')
          return;
        } 

        self.codeLoading = true
        sendCode({
          phone: phone,
          messageType: '1', //2为语音验证
          useType: '2'
        }).then(function (response) {
          if (response && response.data.code === 1) {
            const TIME_COUNT = 60;
            if (!self.timer) {
              self.count = TIME_COUNT;
              self.show = false;
              self.timer = setInterval(() => {
                if (self.count > 0 && self.count <= TIME_COUNT) {
                  self.count--;
                } else {
                  self.show = true;
                  clearInterval(self.timer);
                  self.timer = null;
                }
              }, 1000)
            }
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          self.codeLoading = false
        })
      },
      handleClose: function () {
        // this.$parent.handleClose();
        this.$store.dispatch('LogOut').then(() => {
              location.reload()// In order to re-instantiate the vue-router object to avoid bugs
            })
      }
    }
  }
</script>
<style scoped>
  .amap-box{
    height: 570px;
    border: 1px solid #4FD3D1;
    position: relative;
  }
  .amap-btns{
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
  .btn{
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
  }
  .top{
    width:368px;
    height:44px;
    margin:auto;
    font-size:16px;
    line-height:22px;
  }
  .middle{
    width:300px;
    margin:80px auto 0px auto;
  }
  .t{
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 20px;
    margin-bottom:10px;
  }
  .f{
    color:#999999;
    font-weight: 500;
  }
  .form-dialog-control-area{
    margin-top: 50px;
    margin-bottom: 30px;
    border-top: 0px;
    text-align: center !important;
  }
  .el-form-item {margin-bottom: 10px;}   
  /* input type number去掉上下箭头 */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
 
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
<style>
/* element样式重置 start */
/* 去掉input尾部上下小箭头 start */
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  -o-appearance: none !important;
  -ms-appearance: none !important;
  appearance: none !important;
  margin: 0;
}
input[type="number"]{
  -webkit-appearance:textfield;
  -moz-appearance:textfield;
  -o-appearance:textfield;
  -ms-appearance:textfield;
  appearance:textfield;
}
/* 去掉input尾部上下小箭头 end */
</style>
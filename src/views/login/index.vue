<template>
  <div class="login-container jd_login">
    <el-tabs v-model="loginForm.loginType" class="login-form">
    <p class="login-header">为提升安全保障等级，现统一使用手机号登录<br>如您在登录过程中遇到问题，请咨询客服热线4009-110-110</p>
      <el-tab-pane label="手机号登录" name="2">
        <el-form auto-complete="on" :model="loginForm" :rules="loginRules" ref="phoneForm" label-position="left">
          <el-form-item prop="phone" key="phone">
            <el-input name="phone" type="number" oninput="if(value.length>11)value=value.slice(0,11)" v-model="loginForm.phone"
                      auto-complete="on" clearable placeholder="输入手机号" :maxlength="11">
              <i slot="prefix" class="iconfont icon-shouji"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" key="code">
            <div class="row-code">
              <span>
                <el-input name="code" type="number" oninput="if(value.length>6)value=value.slice(0,6)" clearable @keyup.enter.native="handleLogin('phoneForm')"
                      v-model="loginForm.code" placeholder="输入验证码">
                  <i slot="prefix" class="iconfont icon-duanxin"></i>
                </el-input>
              </span>
              <span>
                <el-button type="primary" :loading="codeLoading" class="primary" size="small" @click="getCode(loginForm.phone)" :disabled="!show">{{show? '获取验证码': count+'s后重新获取'}}</el-button>
              </span>
            </div>

          </el-form-item>

          <el-button type="primary" class="login-btn" :loading="loading"
                    @click.native.prevent="handleLogin('phoneForm')">{{$t('login.logIn')}}
          </el-button>
          <div class="version">版本号 {{ version }}</div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="帐号登录" name="1" v-if="!prod">
        <el-form auto-complete="on" :model="loginForm" :rules="loginRules" ref="accountForm" label-position="left">
          <el-form-item prop="username" key="username">
            <el-input name="username" type="text" v-model="loginForm.username" auto-complete="on" clearable placeholder="请输入帐号" :maxlength="31">
              <i slot="prefix" class="iconfont icon-ren"></i>
            </el-input>
          </el-form-item>

          <el-form-item prop="password" key="password">
            <el-input name="password" type="password" :maxlength="16" clearable @keyup.enter.native="handleLogin('accountForm')"
                      v-model="loginForm.password" placeholder="请输入密码">
              <i slot="prefix" class="iconfont icon-mima"></i>
            </el-input>
          </el-form-item>

          <el-button type="primary" class="login-btn" :loading="loading"
                    @click.native.prevent="handleLogin('accountForm')">{{$t('login.logIn')}}
          </el-button>
          <div class="version">版本号 {{ version }}</div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <p class="login-footer">
      &copy;  2015-2020 北京睿家科技有限公司 版权所有&emsp;京ICP备15034835号-1
    </p>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import { validateMobile } from "@/utils/rules";
  import {mapGetters} from 'vuex'
  import { sendCode } from '@/api/loginv1'
  let dev = process.env.ENV_CONFIG == 'dev';
  let prod = process.env.ENV_CONFIG == 'prod';
  let test = process.env.ENV_CONFIG == 'test';
  console.log(process.env.ENV_CONFIG+"环境");
  export default {
    name: 'login',
    computed: {
      ...mapGetters([
        'version',
      ])
    },
    mounted() {
      this.initFingerprint();
    },
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位数'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          loginType: '2',
          username: '',
          password: '',
          phone: '',
          code: ''
        },
        dev,prod,test,
        loginRules: {
          phone: [
            {required: true, message: '请输入正确手机号', trigger: 'blur'},
            {validator: validateMobile, message: '请输入正确手机号', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {max:6, message: '请输入正确验证码', trigger: 'blur'}
          ],
          username: [{required: true, trigger: 'blur', message: "请输入用户名"}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        loading: false,
        codeLoading: false,
        show: true,
        count: '',
        timer: null,
      }
    },
    methods: {
      handleLogin(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            let data = {
              "loginType": this.loginForm.loginType,  //loginType=1则表示用户名密码登录，loginType=2则表示手机号验证码登录
              "username": this.loginForm.loginType==='1'?this.loginForm.username:this.loginForm.phone,  //loginType=1则表示用户名，loginType=2则表示手机号
              "password": this.loginForm.loginType==='1'?this.loginForm.password:this.loginForm.code    //loginType=1则表示密码，loginType=2则表示验证码
            }
            this.$store.dispatch('LoginByUsername', data).then(() => {
              this.loading = false
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      initFingerprint() {
        let self = this;
        self.$fingerprint2.get(function (result, components) {
          self.$store.dispatch('SaveFingerprint', result).then(() => {

          });
        });
      },
      getCode(phone){

        let self = this
        let no = /^1(3|4|5|6|7|8|9)\d{9}$/g;
        if (!phone || !no.test(phone)) {
          self.$message.error('请输入正确的手机号码')
          return;
        }

        self.codeLoading = true

        let encryptor = new JSEncrypt()
        let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDe8xwhyKpAt1uZikf+ZpACoacm9jLujM43QLS2rgBkbNwVzxFNpLRzmRoJGU1hUaRhyj3yUH7SIKzhRl4wmgjZE0Qj9/y4upuENJCJOBygiFlksOwthXMpVRvgJwD3Xfnk0P4nz15UEuvYayqvF0aNWux8EA4/tnlW9TRAVaZlrQIDAQAB'
        encryptor.setPublicKey(publicKey)
        
        sendCode({
          productSign:'community',
          phone: (!test)?phone:encryptor.encrypt(phone),
          messageType: '1' //2为语音验证
        }).then(function (response) {
          if (response && response.data.status === 0) {
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
      } 
    }
  }
</script>

<style lang="scss" scoped>
.iconfont.icon-shouji{
  top:0px
}

.iconfont.icon-duanxin{
  top:0px
}

.iconfont.icon-ren{
  top:0px
}

.iconfont.icon-mima{
  top:0px
}
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url(../../assets/image/bg-login.png);
    background-size: cover;
    background-position: 50% 50%;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 350px;
      padding: 18px 40px 10px 40px;
      margin: 25vh auto;
      background-color: #fff;
      border-radius: 4px;
    }
  }
  .login-title{
    text-align: center;
    font-size: 20px;
    color: #4BA0FF;
  }
  .login-btn{
    width: 100%;
    background-color: #4BA0FF;
    border-color: #4BA0FF;
  }
  .version{
    color: #B5C2CA;
    font-size: 12px;
    margin-top: 20px;
    text-align: center;
    margin: 20px 0;
  }
  .login-header{
    position: fixed;
    width: 100%;
    /*top: 18%;*/
    right: 0;
    left: 0;
    margin-top: -120px;
    /*bottom: 6px;*/
    font-family: "PingFang SC";
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: #FFFFFF;
    text-align: center;
    /*padding: 0 20px;*/
  }
  .login-footer{
    position: fixed;
    width: 100%;
    bottom: 6px;
    font-size: 12px;
    color: #f1f1f1;
    text-align: center;
    padding: 0 20px;
  }
  .iconfont{
    position: relative;
    left: 2px;
    top: 11px;
  }
  .row-code{
    display: flex;
  }
  .row-code>span + span{
    margin-left: 10px;
  }
  .primary{
    background-color: #4BA0FF;
    border-color: #4BA0FF;
  }

</style>
<style>
  .jd_login .el-form-item__content{
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .jd_login .el-form-item__error{
    font-weight: 500;
  }
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

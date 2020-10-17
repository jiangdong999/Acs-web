<template>
  <div class="pw-content">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="loading">
      <!-- <el-form-item label="启用密码">
        <div class="switch" :class="activeClass" @click="toggleStatus()" v-if="!loading">
          <span class="block"></span>
        </div>
      </el-form-item> -->
      <el-form-item label="开门密码" prop="openPassword">
        <el-input
          v-model="form.openPassword"
          placeholder="请设置6位开门密码"
          type="text"
          clearable
          :maxlength="6">
        </el-input>
      </el-form-item>
      <!-- <div class="remarks">
          备注：<br/>
          1、在门禁机按FN键【...】;<br/>
          2、选择密码开门菜单<br/>
          3、直接输入8位数字密码，即可开门！
      </div> -->
      <div class="form-control">
        <el-button type="default" @click="$parent.handleClose()">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {getPassWord, editPassWord} from "@/api/device";
  import {validateNumber} from "@/utils/rules";

  export default {
    props:['doorId'],
    data() {
      return {
        loading:true,
        active: false,
        form: {
          // openPasswordStatus: 1,
          openPassword: '',
        }
      }
    },
    computed:{
      // activeClass(){
      //   return {
      //     'active': this.form.openPasswordStatus == 1, 
      //     'inactive': this.form.openPasswordStatus != 1
      //   }
      // },
      rules(){
        return {
          openPassword: [
            // {required: true, message: '请输入密码', trigger: 'blur'},
            {min:0, max:6, message: '请输入6位数的密码', trigger: 'blur'},
            {message: '请输入正确的数字密码', validator: validateNumber, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // toggleStatus(){
      //   this.form.openPasswordStatus = this.form.openPasswordStatus != 0? 0: 1
      // },
      handleSubmit: function () {
        let self = this;
        self.$refs.form.validate((valid) => {
          // if (!(this.form.openPasswordStatus == 1) || valid) {
          if (valid) {
            editPassWord({
              doorId: self.doorId,
              ...self.form
            }).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.$emit('successCallback')
              } 
            }).catch(function (a) {
              console.error(a)
            });
          }
        })
      },
      loadPassWord:function(){
        let self = this;
        self.loading = true;
        getPassWord({id:self.doorId}).then(function (response) {
          if(response.data){
            // self.form.openPasswordStatus = parseInt(response.data.data.openPasswordStatus || 0);
            self.form.openPassword = response.data.data.openPassword || '';
            self.loading = false;
          }
        }).catch(function (a) {
          console.error(a);
        })
      }
    },
    created() {
      this.loadPassWord();
    },
  }
</script>

<style scoped>
  .pw-content{
    margin: 0 75px;
  }
  .remarks{
    font-size: 14px;
    color: #333333;
    line-height: 30px;
    margin:20px  0;
    background-color: #F0F3F7;
    padding: 15px 40px;
    border-radius: 4px;
  }
  .form-control{
    text-align: center
  }
  .switch{
    display: inline-block;
    width: 80px;
    height: 30px;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    line-height: 30px;
    padding: 0 10px;
    color: #fff;
    transition: .4s all;
    font-size: 12px;
  }
  .block{
    display: inline-block;
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    top: 3px;
    right: 3px;
    transition: .4s all;
    background-color: #fff;
  }
  .inactive{
    background-color: #666666;
    text-align: right
  }
  .inactive:before{
    content:'已关闭';
  }
  .inactive>.block{
    right: 53px;
  }
  .active{
    background-color: #3EAF57;
    text-align: left
  }
  .active:before{
    content:'已开启';
  }
  .active>.block{
    right: 3px;
  }
</style>


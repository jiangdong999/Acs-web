<template>
  <div>
    <div class="content">
      <div class="info">
        {{data.name}} &emsp;{{data.account}}
      </div>
      <div class="password">
        <el-button type="text" @click="reset">点击重置</el-button> &emsp;新密码
        <!-- <span @click="reset">点击重置</span> &emsp;新密码 -->
        <p v-loading="loading">{{ password }}</p>
      </div>
    </div>
    
    <div class="form-dialog-control-area">
      <el-button type="primary" @click="$parent.handleClose">确定</el-button>
    </div>
  </div>

</template>

<script>
  import { resetPassword } from "@/api/authority";

  export default {
    props:['data'],
    data() {
      return {
        loading:false,
        password:''
      }
    },
    methods: {
      reset(){
        this.loading = true
        resetPassword({
          account:this.data.account
        }).then((response) =>{
          if (response.data && response.data.code === 1) {
            this.password = response.data.data
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          this.loading = false;
        })
      },
    },
    mounted() {
      this.reset()
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


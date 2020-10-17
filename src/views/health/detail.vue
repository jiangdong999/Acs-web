<template>
  <div class="jd_cont_div" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <div>
          <div class="jd_cont_title">请输入条码编号</div>
          <div class="jd_cont_input">
            <el-input type="text"  v-model="barCode" @focus="focus($event)" ref="myNameId" clearable placeholder="请输入"></el-input>
            <el-button type="primary" @click="submitClick">提交</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="jd_cont_dl">
          <dl v-for="item in data" :key="item.id">
            <dt><img :src="item.imageUrl"></dt>
            <dd>
                <p><span>姓名</span><b>{{item.realName}}</b></p>
                <p><span>身份证号</span><b>{{item.cardNo}}</b></p>
            </dd>
          </dl>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { batchUpdate } from "@/api/health";

export default {
  props:['data','healthDetail'],
  data(){
    return{
      loading:false,
      barCode:'',
      logIds:[],
    }
  },
  methods:{
    //得到焦点选中
    focus(event){
      event.currentTarget.select();
    },
    submitClick(){
      
      if(this.barCode.trim() == ""){
        this.$message('条码编号不能为空');
        return false;
      }
      let arr = [];
      this.data.forEach(element => {
        arr.push(element.id)
      });
      this.logIds = arr
      let obj = {
        logIds:this.logIds,
        barCode:this.barCode.trim(),
        username:this.$store.state.user.userName
      }
      let self = this
      self.loading = true
      batchUpdate(obj).then(function (response) {
        if (response && response.data.code === 1) {
          self.$message({
            message: '提交成功',
            type: 'success'
          });
          self.barCode=""
          self.$parent.handleClose();
          self.$parent.$parent.loadData()
          self.loading = false
        }else{
          self.loading = false
        }
      }).catch(function (a) {
        console.error(a);
      })
     
    },

  },
  watch:{
    healthDetail(val){
      this.$refs.myNameId.focus();
      if(val){
        this.barCode = ""
      }
    }
  },
  mounted() {
    this.$refs.myNameId.focus();
  },
  
}
</script>

<style scoped>
.jd_cont_title{
  font-size: 20px;
  color: #333333;
  margin-bottom: 20px;
}
.jd_cont_div{
  padding: 30px 50px 40px 50px;
}
.jd_cont_dl{
  width:680px;
  height: 215px;
}
.jd_cont_input{
  margin-bottom: 30px;
}
.jd_cont_input .el-input{
  width: 320px;
  height: 40px;
  font-size: 16px;
}
.jd_cont_input button{
  width: 91px;
  height: 40px;
  margin-left: 20px;
  font-size: 14px;
}
.jd_cont_dl dl{
  width: 320px;
  height: 99px;
  background: #f2f5f5;
  border-radius: 4px;
  float: left;
  margin: 0px 20px 20px 0px;
}
.jd_cont_dl dl dt{
  width: 60px;
  height: 60px;
  margin: 20px;
  float: left;
}
.jd_cont_dl dl dt img{
  width: 60px;
  height: 60px;
}
.jd_cont_dl dl dd{
  margin: 26px 0 20px 0px;
}
.jd_cont_dl dl dd p span{
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: #666666;
  margin-right: 10px;
}
</style>

<template>
  <div class="jd_cont_div_add" v-loading="loading">
    <el-form :model="AddForm" ref="AddForm" :rules="rules" style="padding-right: 10px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证号码" prop="cardNo">
            <el-input v-model="AddForm.cardNo" type="text" clearable :maxlength="18" :minlength="18" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="体温" prop="temperature">
            <el-input v-model="AddForm.temperature" type="text" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="AddForm.realName" type="text" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="AddForm.phone" type="text" clearable :maxlength="11" :minlength="11" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注"  prop="remark" style="padding-right: 15px;">
            <el-input v-model="AddForm.remark" type="textarea" :rows="5" :maxlength="30" placeholder="最多输入30字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-control" style="text-align: center;margin-top:30px">
        <el-button type="default" @click="$parent.handleClose">取消</el-button>
        <el-button type="primary" @click="handleAdd()">确定</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { logAdd } from "@/api/health";
import { validateCitizenId,validateMobile } from "@/utils/rules";
export default {
  props:['data','healthAdd'],
  data(){
    return{
      loading:false,
      AddForm:{
        realName:'',//姓名
        cardNo:'',//身份证号
        deviceSn:this.data,//设备号
        phone:'',//手机号
        remark:'',//备注
        temperature:''//体温
      },
      rules:{
        realName:[
          { required: true, message: '请填写姓名', trigger: 'blur'}
        ],
        cardNo:[
          { required: true, validator: validateCitizenId, message: '请填写正确的身份证号', trigger: 'blur'},
          { min: 18, max: 18, message: '请输入正确的18位字符身份证号' }
        ],
        phone: [
          { validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
        ],
      }
      
    }
  },
  methods:{
    handleAdd(){
      let self = this
      if(self.AddForm.cardNo.trim() == ""){
        self.$message('身份证号不能为空');
        return false;
      }
      self.$refs.AddForm.validate(valid => {
        if(valid){
          self.loading = true;
          logAdd({...self.AddForm}).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$parent.handleClose();
              self.$parent.$parent.loadData()
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_=>{
            self.loading = false;
          })
        }
      })
    }
  },
  watch:{
    healthAdd(val){
      if(val){
        this.AddForm.realName = ''
        this.AddForm.cardNo = ''
        this.AddForm.phone = ''
        this.AddForm.remark = ''
        this.AddForm.temperature = ''
      }
    }
  }
}
</script>

<style scoped>
.jd_cont_div_add {
  padding: 30px 50px 40px 50px;
}
.jd_cont_div_add .el-form-item__label{
  float: initial;
}
.jd_cont_div_add .el-form-item{
  margin-bottom: 10px;
}
</style>
<style>
.jd_cont_div_add .el-form-item__label{
  width: 90px !important;
}
</style>

<template>
  <section>
    <div class="module">
      <div class="module-title">权限申请卡信息</div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" style="padding:20px">
        <el-form-item label="卡号" prop="newCardNo">
          <el-input v-model="form.newCardNo" placeholder="请用读卡器读取卡号" clearable maxlength="8"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input 
          v-model="form.remark"
          type="textarea"
          :rows="5"
          maxlength="120"
          placeholder="请输入描述信息"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-dialog-control-area">
      <el-button                @click="$parent.handleClose()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()"  v-loading="loading">提交</el-button>
    </div>
  </section>
</template>

<script>
import {setHouseCard} from "@/api/roomCard";
import { validateHexadecimal } from "@/utils/rules";

export default {
  props:['data'],
  data(){
    return {
      loading:false,
      form:{
        newCardNo:'',
        remark:''
      },
      rules:{
        newCardNo: [
          { message: '请输入正确的卡号',validator: validateHexadecimal},
          { required: true, message: "请填写卡号", trigger: "blur" }
        ]
      },
    }
  },
  methods:{
    handleSubmit:function(){
      let self = this;
      self.$refs.form.validate(valid=>{
        self.loading = true;
        if(valid){
          setHouseCard({
            ...self.data,
            ...self.form,
            type: '1'
          }).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.$parent.handleClose()
            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
            return false;
          }).catch(function (a) {
          }).finally(_=>{
            self.loading = false;
          })
        }
      })
    },
  }
}
</script>

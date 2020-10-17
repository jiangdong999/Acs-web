<template>
  <section>
    <div class="form-title-caption">
      <p>授权卡</p>
    </div>
    <el-form ref="cardForm" :model="form" inline label-width="120px">
      <el-form-item label="授权房产">
        <label>{{defaultCardNode.fullNodeName}}</label>
      </el-form-item>
      <br>
      <el-form-item label="门禁卡发卡">
        <el-select v-model="form.cardClass" filterable placeholder="请选择卡类型">
          <el-option value="1" label="IC卡"/>
          <el-option value="2" label="身份证"/>
          <el-option value="3" label="ID卡"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="cardNo" :rules="cardRules.cardNo" v-if="form.cardClass!=='2'">
        <el-input v-model="form.cardNo" placeholder="请输入卡号" clearable maxlength="8" :type="pswVisibility?'type':'password'">
          <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
        </el-input>
        <div class="tips">卡号：{{form.cardNo}}</div>
      </el-form-item>
      <el-form-item prop="cardNo" v-else-if="form.cardClass==='2'" clearable :rules="cardRules.cardNo2">
        <el-input v-model="form.cardNo" placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
          <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
        </el-input>
        <div class="tips">卡号：{{form.cardNo}}</div>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="$parent.handleClose()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">确定</el-button>
    </div>
  </section>
</template>

<script>

import {addHouseholdCard} from "@/api/personnel";
import { validateHexadecimal } from "@/utils/rules";

export default {
  props:['defaultCardNode'],
  data(){
    return {
      loading: false,
      pswVisibility: false,
      form:{
        cardNo: '',
        cardClass: '1'
      },
      cardRules:{
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          {required: true, message: '请填写门禁卡号', trigger: 'blur'},
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          {required: true, message: '请填写门禁卡号', trigger: 'blur'},
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ]
      }
    }
  },
  methods:{
    handleSubmit(){
      this.$refs.cardForm.validate((valid)=>{
        if(valid){
          let self = this;
          self.loading=true;
          addHouseholdCard({
            householdId: self.defaultCardNode.householdId,
            communityId: self.defaultCardNode.communityId,
            roomNodeId: self.defaultCardNode.roomNodeId,
            leaseStartTime: self.defaultCardNode.leaseStartTime,
            leaseEndTime: self.defaultCardNode.leaseEndTime,
            ...self.form
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.$emit('updateCardList')
              self.$emit('close')
            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_ =>{
            self.loading=false;
          })
        }
      })
    }
  }
}
</script>
<style scoped>
@import '../../../../styles/iconfont/iconfont.css';
  .icon-del{
    position: absolute;
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 5px;
    border-radius: 50%;
    background-color: #ff5555;
    right: -11px;
    top: -11px;
    cursor: pointer;
    opacity: 0.8;
  }
  .icon-del:before{
    color: #fff;
  }
  .icon-del:hover{
    opacity: 1;
  }
  .dialog-footer{
    text-align: right
  }
</style>

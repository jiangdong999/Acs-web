<template>
  <el-form ref="form" v-loading="loading" :model="form" label-width="90px" inline>
    <el-form-item label="系统名称" prop="systemName">
      <el-input v-model="form.systemName" placeholder="请输入" :maxlength="20"/>
    </el-form-item>
    <br>
    <el-form-item label="住户信息必填">
      <el-checkbox-group v-model="isRequire">
        <el-checkbox label="1" style="float:left;">身份证信息</el-checkbox>
        <!-- <el-checkbox label="2" style="float:left;">其他信息</el-checkbox> -->
      </el-checkbox-group>
    </el-form-item>
    <br>
    <el-form-item label="审批方式" prop="authorityType">
      <el-select v-model="form.authorityType">
        <el-option value="0" label="产权人、管理员审批"/>
        <el-option value="1" label="产权人审批"/>
        <el-option value="2" label="管理员审批"/>
      </el-select>
    </el-form-item>
    <br>
    <el-form-item label="防复制卡" prop="copyCard">
      <el-switch
        v-model="form.copyCard"
        active-value="1"
        inactive-value="0"
        :active-text="form.copyCard=='1'?'启用':'禁用'">
      </el-switch>
    </el-form-item>
    <br>
    <el-form-item label="系统头像" prop="systemUrl" error="建议尺寸:180×30">
      <upload-btn @path="setImg" showUploadType="1">
        <span class="img-box">
          <label v-show="form.systemUrl==''">USER</label>
          <div v-show="form.systemUrl!=''" :style="'background-image:url('+form.systemUrl+')'"></div>
        </span>
      </upload-btn>
    </el-form-item>
    <el-divider></el-divider>
    <div>
      <label class="title">房间信息设置</label>
      <br>
      <el-form-item label="人数上限" prop="maxHousehold" :rules="maxHousehold">
        <el-input type="text" v-model.number="form.maxHousehold" placeholder="请输入"/>
      </el-form-item>
    </div>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import uploadBtn from "@/components/uploadImage";
import {validatePositiveNumber} from '@/utils/rules'
import { modifyDeploy } from "@/api/community";

export default {
  props:['data'],
  components:{
    uploadBtn
  },
  computed: {
    isRequire: {
      get () {      
        let list = []
        if(this.form.isIdcard==='1'){
          list.push('1')
        }
        if(this.form.isInfo==='1'){
          list.push('2')
        }
        return list
      },
      set (newValue) {
        if(newValue.length===0){
          this.form.isIdcard = '0'
          this.form.isInfo = '0'
        }else if(newValue.length===2){
          this.form.isIdcard = '1'
          this.form.isInfo = '1'
        }else{
          newValue.forEach(item=>{
            if(item==='1'){
              this.form.isIdcard = '1'
              this.form.isInfo = '0'
            }else if(item==='2'){
              this.form.isIdcard = '0'
              this.form.isInfo = '1'
            }
          })
        }      
      }
    }
  },
  data(){
    function moreThenNumber(rule, value, callback) {
      if (!value) callback();
      if (value > 999) {
        callback(new Error('人数不可大于999'))
      } else {
        callback();
      }
    }
    return {
      loading:false,
      form:{},
      maxHousehold: [
        {validator: validatePositiveNumber, trigger: 'blur'},
        {validator: moreThenNumber, trigger: 'blur'}
      ],
    }
  },
  methods:{
    setImg(src) {
      this.form.systemUrl = src
      this.form.systemAvatarBase64 = src
    },
    checkFormChange(){
      let newValueString = JSON.stringify(this.form)
      let oldValueString = JSON.stringify(this.data)

      return newValueString == oldValueString
    },
    // formatIsIdCard (status) {
    //   let str = '0'
    //   if(status.length === 0){
    //     str = '0'
    //   }else {
    //     str = status.toString()
    //   }
    //   return str
    // },
    submit(resolve) {
      let self = this;
      self.$refs.form.validate((valid) => {
        if(valid){
          self.loading = true;
          modifyDeploy({
            communityId: this.form.communityId,
            systemName: this.form.systemName,
            systemUrl: this.form.systemUrl,
            systemAvatarBase64: this.form.systemAvatarBase64,
            authorityType: this.form.authorityType,
            isIdcard: this.form.isIdcard,
            isInfo: this.form.isInfo,
            copyCard: this.form.copyCard,
            maxHousehold: this.form.maxHousehold
          }).then(function (response) {
            self.loading = false;
            if (response.data && response.data.code==1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              
              self.$store.dispatch('getCommunity')
              self.$store.dispatch('getCommunityConfig', self.data.communityId)

              !resolve && self.$emit('submit')
              resolve && resolve()
            }
          }).catch(function (a) {
            console.error(a);
          })
        }
      })
    }
  },

  created(){  
    this.form = { ...this.data } 
  }
}
</script>

<style lang="scss" scoped>
  .img-box{
    display: inline-block;
    background-color: #eeeeee;
    width: 180px;
    height: 40px;
    border-radius: 5px;
    border: 1px solid rgba(224, 226, 232, 1);
    text-align: center;
    cursor: pointer;
    position: relative;
  }
  .img-box>label{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    color: #aaaaaa;
    cursor: pointer;
  }
  .img-box>div{
    margin: 4px 0;
    height: 30px;
    background-repeat: no-repeat !important;
    background-size: contain !important;
    background-position: 50% 50% !important;
  }
  .title{
    display: inline-block;
    width: 120px;
    line-height: 35px;
    font-size: 15px;
    margin-top: 10px;
  }
</style>


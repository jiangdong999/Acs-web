<template>
  <el-form ref="formAPP" v-loading="loading" :model="form" inline label-width="90px">
    <el-form-item label="iOS版本" prop="latestVersionIos">
      <el-select v-model="form.latestVersionIos" placeholder="请选择版本号" clearable>
        <el-option 
        v-for="version in form.appVersionIOSList"
        :key="version.id"
        :value="version.display_version" 
        :label="version.display_version"/>
      </el-select>
    </el-form-item>
    <br>
    <el-form-item label="Android版本" prop="latestVersionAndroid">
      <el-select v-model="form.latestVersionAndroid" placeholder="请选择版本号" clearable>
        <el-option 
        v-for="version in form.appVersionAndroidList"
        :key="version.id"
        :value="version.display_version" 
        :label="version.display_version"/>
      </el-select>
    </el-form-item>
    <br>
    <el-form-item label="人脸数量" prop="phoneFaceCount">
      <el-select v-model="form.phoneFaceCount">
        <el-option value="1" label="1"/>
        <el-option value="2" label="2"/>
        <el-option value="3" label="3"/>
        <el-option value="4" label="4"/>
        <el-option value="5" label="5"/>
      </el-select>
    </el-form-item>
    <br>
    <el-form-item label="SOS报警" prop="useCaringStaff">
      <el-switch
        v-model="form.useCaringStaff"
        active-value="1"
        inactive-value="0"
        :active-text="statusText">
      </el-switch>
    </el-form-item>
    <br>
    <el-form-item label="App菜单功能" style="display:flex" class="special-item">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="menuList" @change="handleCheckedMenusChange">
        <el-checkbox 
        v-for="(menu) in form.relSettingMenuList" 
        :label="menu.type_id" 
        :key="menu.type_id">
          {{menu.type_name}}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="健康登记功能">
      <el-checkbox-group v-model="report">
        <el-checkbox :label="1" style="float:left;">出入凭证</el-checkbox>
        <el-checkbox :label="2" style="float:left;">访客健康登记</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item class="isCertificate" label="自注册上传房产证" prop="isCertificate">
      <el-radio-group v-model="form.isCertificate">
        <el-radio label="1">需要</el-radio>
        <el-radio label="0">不需要</el-radio>      
      </el-radio-group>
    </el-form-item>
    <el-form-item class="isCertificate" label="自注册租房合同照片" prop="maxContractPhotos">
      <el-select v-model="form.maxContractPhotos">
        <el-option :value="1" label="1张"/>
        <el-option :value="2" label="2张"/>
        <el-option :value="3" label="3张"/>
        <el-option :value="4" label="4张"/>
        <el-option :value="5" label="5张"/>
      </el-select>
    </el-form-item>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import { modifyAppConfiguration } from "@/api/community";
export default {
  props:['data'],
  data(){
    return {
      loading:false,
      form:{
      },
      checkAll:false,
      isIndeterminate: false,
      menuList:[],
    }
  }, 
  computed:{
    report: {
      get () {      
        let list = []
        if(this.form.healthReport==1){
          list.push(1)
        }
        if(this.form.visitHealthReport==1){
          list.push(2)
        }
        return list
      },
      set (newValue) {
        if(newValue.length===0){
          this.form.healthReport = 0
          this.form.visitHealthReport = 0
        }else if(newValue.length===2){
          this.form.healthReport = 1
          this.form.visitHealthReport = 1
        }else{
          newValue.forEach(item=>{
            if(item===1){
              this.form.healthReport = 1
              this.form.visitHealthReport = 0
            }else if(item===2){
              this.form.healthReport = 0
              this.form.visitHealthReport = 1
            }
          })
        }      
      }
    },
    menuAuthority(){
      let s=0
      if(this.menuList.length>0){
        this.menuList.forEach(menuId => {
          s |= menuId
        });
      }

      return s
    },
    statusText(){
      return this.form.useCaringStaff == '1'?'已开启': '未开启'
    },
  }, 
  methods:{
    handleCheckAllChange(val) {
      this.menuList = []
      val ? this.form.relSettingMenuList.forEach(item=>{
              this.menuList.push(item.type_id)
            }) : false;

      this.isIndeterminate = false;
    },
    handleCheckedMenusChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.form.relSettingMenuList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.form.relSettingMenuList.length;
    },
    checkFormChange(){
      let newValueString = JSON.stringify(this.form)
      let oldValueString = JSON.stringify(this.data)

      return newValueString == oldValueString
    },
    submit(resolve) {
      let self = this;
      self.loading = true;
      modifyAppConfiguration({
        communityId: this.form.communityId,
        useCaringStaff: this.form.useCaringStaff,
        phoneMenuAuthority: this.menuAuthority,
        latestVersionIos: this.form.latestVersionIos,
        latestVersionAndroid: this.form.latestVersionAndroid,
        phoneFaceCount: this.form.phoneFaceCount,
        healthReport: this.form.healthReport,
        visitHealthReport: this.form.visitHealthReport,
        maxContractPhotos: this.form.maxContractPhotos,
        isCertificate: this.form.isCertificate
      }).then(function (response) {
        if (response.data && response.data.code==1) {
          self.$message({
            message: response.data.message,
            type: 'success'
          });
          self.loading = false;

          !resolve && self.$emit('submit')
          resolve && resolve()
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
  },
  created(){
    let menuAuthority = this.data.phoneMenuAuthority
    this.menuList = []
    this.data.relSettingMenuList.forEach(item=>{
      if(menuAuthority & item.type_id){
        this.menuList.push(item.type_id)
      }
    })
    this.checkAll = this.menuList.length === this.data.relSettingMenuList.length;

    this.form = { ...this.data }
  }
}
</script>

<style lang="scss" scoped>
  /deep/{
    .special-item>.el-form-item__label{
      flex: none;
    }
  }
  
</style>

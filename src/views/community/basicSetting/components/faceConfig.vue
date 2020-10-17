<template>
  <el-form ref="formFace" v-loading="loading" :model="form" label-position="top" inline label-width="90px">
    <div class="commName">{{rowData.communityName}}</div>
    <el-form-item label="刷脸类型" prop="faceStatus">
      <el-select v-model="form.faceStatus" placeholder="请选择">
        <el-option value="1" label="在线"/>
        <el-option value="2" label="云离线（默认）"/>
        <el-option value="3" label="脱机"/>
        <el-option value="4" label="抓拍"/>
      </el-select>
    </el-form-item>
    <br>
    <el-form-item label="人脸底库" prop="facePassVersion" v-if="form.faceStatus!='1'">
      <el-radio v-model="form.facePassVersion" label="1">2000底库</el-radio>
      <el-radio v-model="form.facePassVersion" label="3">5000底库</el-radio>
    </el-form-item>
    <br>
    <el-form-item label="刷脸方式" prop="isCloudCooperate">
      <el-radio v-model="form.isCloudCooperate" :label="0">配合</el-radio>
      <el-radio v-model="form.isCloudCooperate" :label="1">非配合</el-radio>
    </el-form-item>
    <br>
    <el-form-item label="人卡核验" prop="openDoorMode">
      <el-switch
        v-model="form.openDoorMode"
        active-value="1"
        inactive-value="0"
        :active-text="openDoorModeText">
      </el-switch>
    </el-form-item>
    
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import { modifyBrushFace,queryCommunity } from "@/api/community";
export default {
  props: {
    rowData: {
      type: Object,
      default: {}
    }
  },
  data(){
    return {
      loading: false,
      form:{
        faceStatus: "1"
      },
    }
  },
  computed:{
    openDoorModeText(){
      return this.form.openDoorMode == '1'?'启用': '禁用'
    }
  },
  methods:{
    //获取小区配置详情
    loadCommunityParameters(){
      let self = this
      // self.loading = true
      queryCommunity({communityId: self.rowData.communityId}).then(function (response) {
        if (response.data && response.data.code==1) {
          self.form = response.data.data
        }
      }).catch(function (a) {
        console.error(a)
      })
    },
    checkFormChange(){
      let newValueString = JSON.stringify(this.form)
      let oldValueString = JSON.stringify(this.rowData)

      return newValueString == oldValueString
    },
    submit(resolve) {
      let self = this;
      self.loading = true;
      modifyBrushFace({
        communityId: this.form.communityId,
        faceStatus: this.form.faceStatus,
        facePassVersion: this.form.facePassVersion,
        isCloudCooperate: this.form.isCloudCooperate,
        openDoorMode: this.form.openDoorMode,
      }).then(function (response) {
        if (response.data && response.data.code==1) {
          self.$message({
            message: response.data.message,
            type: 'success'
          });
          self.loading = false;
          self.$emit('close')
          !resolve && self.$emit('submit')
          resolve && resolve()
        }
      }).catch(function (a) {
        console.error(a);
      })
    }
  },
  created(){
    this.loadCommunityParameters()
  }
}
</script>
<style lang="scss" scoped>
.commName{
  color: #333333;
  font-size: 20px;
  line-height: 20px;
  margin-bottom: 28px;
  font-weight: bold;
}

/deep/.el-form-item--medium .el-form-item__content {
  line-height: 36px;
}

.form-dialog-control-area /deep/.el-button--medium{
  padding: 10px 30px;
}
</style>
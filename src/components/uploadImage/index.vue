<template>
  <span>
    <div @click="handleUpload" v-if="showUploadType=='1'">
      <slot>
        <el-button type="primary" plain :disabled="disabled">{{openBtnText || '本地上传'}}</el-button>
      </slot>
    </div>    
    <div @click="handleUpload" v-if="showUploadType=='2'">
      <slot>
        <div class="upload-img">
          <div class="little-box">
            <div style="margin-bottom:11px;"><i class="iconfont icon-bendishangchuan"></i></div>
            <div>本地上传</div>
          </div>
        </div>      
      </slot>
    </div>
    <span @click="handleUpload" v-if="showUploadType=='3'" class="text-btn">
      <i class="iconfont icon-zhongchuan"></i>{{openBtnText || '本地上传'}}
    </span>
    <input type="file" ref="file" @change="handleChange" accept="image/*" style="display: none" /> 
    <el-dialog
      title="本地上传"
      :visible.sync="localUpload"
      :close-on-click-modal="false"
      append-to-body>
      <div class="dialog-content">
        <img :src="photoSrc" height="400" v-show="photoSrc!=''">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getLocalImg()" v-show="photoSrc!=''">{{submitBtnText || '确认上传'}}</el-button>
        <el-button @click="localUpload = false">取 消</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import lrz from 'lrz'

export default {
  props:['openBtnText', 'submitBtnText', 'disabled', 'showUploadType'],
  data(){
    return {
      localUpload:false,
      photoSrc:''
    }
  },
  methods:{
    handleUpload:function(){
      this.localUpload = true;
      this.$refs.file.click()
    },
    handleChange:function(e){
      var file = e.target.files[0];
      var reader = new FileReader();

      if(file){
        lrz(file).then( rst =>{
          // 转换成base64编码
          // reader.readAsDataURL(rst);
          // reader.onload = function(e) {
          //   self.photoSrc = this.result;
          // };
          const MAX_SIZE = 1024 * 1024 * 2;
          if(rst.origin.size > MAX_SIZE){
            this.$message.error('图片过大，请手动压缩后上传')
          }else{
            this.photoSrc = rst.base64;
          }

        }).catch( err => {
          // 处理失败会执行
          this.$message.error(err)
        })
        // hack重复选择同一张图片不触发change事件
        e.target.value = ''
      }
    },
    getLocalImg:function(){
      let uploadImg = this.photoSrc;
      this.$emit('path', uploadImg);
      this.photoSrc = '';
      this.localUpload = false;
    }
  }
}
</script>
<style scoped lang="scss">
  .dialog-content{
    height: 450px;
    text-align: center;
  }
  .dialog-content img{
    width: 100%;
    object-fit: scale-down;
  }
  .upload-img{
    width: 100%;
    height: 250px;
    background: #f4f4f4;
    border: 1px solid #d7d7d7;
    border-top: 0px;
    border-radius: 0px 0px 6px 6px;
    position: relative;
    cursor: pointer;
    padding-left: 20px;
    padding-right: 20px;
    height: 125px;
  }
  .little-box{
    width: 158px;
    height: 124px;
    padding-top: 34px;
    box-sizing: border-box;
    div{
      text-align: center;
      color: #606266;
      i{
        font-size: 32px;
        color: #8a8a8a;
      }
    }   
  }
  .text-btn{
    line-height: 18px;
    font-size: 14px;
    color: #0080e8;
    cursor: pointer;
    font-weight: 600;
    i{
      font-size: 14px;
      margin-right: 4px;
    }
  }
</style>

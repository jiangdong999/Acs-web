<template>
  <section>
    <div class="container" v-loading="loading">
      <div class="content">
        <div class="face-box">
          <span class="close" @click="faceRemove()" v-show="imgBase64">
            <span class="el-icon-delete" circle></span>
          </span>
          <img :src="imgBase64" v-show="imgBase64">
        </div>
        
        <span class="btn-row">
          <camera-btn 
          showType="1"
          openBtnText="现场拍照" 
          submitBtnText="确认上传" 
          @path="checkImgVaild($event)" 
          :isface="true"/>
          <upload-btn
          showUploadType="1" 
          @path="checkImgVaild($event)"/>
        </span>
      </div>
    </div>
 
    
    <div v-if="showModal">
      <el-dialog
        title="查看图片"
        top="10vh"
        :visible.sync="showModal"
        :close-on-click-modal="false">
        <div class="content">
          <img :src="itemData.imageUrl"/>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<script>
import {householdFaceUpload} from "@/api/personnel"
import cameraBtn from "@/components/camera/";
import uploadBtn from "@/components/uploadImage";
import imageView from "@/components/imageView/index";

export default {
  props:['faceUrl'],
  data(){
    return {
      showModal:false,
      localUpload:false,
      loading: false,
      imgBase64: '',
      itemData:{}
    }
  },
  components:{
    cameraBtn,
    uploadBtn,
    imageView
  },
  methods:{
    checkImgVaild(base64){
      let self = this
      self.loading = true
      let base64ClipData = base64.split(',')[1]
      householdFaceUpload({
        filesBase64: [base64ClipData]
      }).then(function (response) {
        if(response.data && response.data.code===1){
          self.imgBase64 = response.data.data.download_urls[0];          
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      })
    },
    faceRemove(){
      let self = this;
      self.$confirm('确定删除此人脸吗？').then(()=>{
        if(self.imgBase64!='' && self.imgBase64){
          self.imgBase64 = ''
          self.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      }).catch(_=>{})
    }
  },
  watch: {
    faceUrl(val){
      this.imgBase64 = val;
    }
  }
}
</script>
<style scoped>
  .face-box{
    background-color: #F4F4F4;
    border: 1px solid #d7d7d7; 
    width: 120px;
    height: 120px;
    border-radius: 4px;
    background-image: url(../../../assets/image/person.png);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 50%;
    display: inline-block;
    position: relative;
  }
  .face-box img{
    width: 100%;
    height: 100%;
    max-height: 120px;
    object-position: 50% 50%;
    object-fit: cover;
    cursor: pointer;
  }
  .btn-row{
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    margin-left: 20px;
  }
  #my_DV{
    margin:0 auto;
  }
  #my_DV>video{
    width: 100% !important;
  }
  .close:hover{
    background-color: rgba(0, 0, 0, 0.3);
  }
  .float-left{
    float: left;
  }
  .content{
    padding: 0 40px;
    display: flex;
    justify-content: center
  }
  .close{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 50%;
    display: inline-block;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all .3s;
    color: #fff;
    font-size: 14px;
  }
  .content{
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
  }
  .content img{
    width: 100%;
    height: 480px;
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
    object-fit: cover;
    object-position: 50% 50%;
    border-radius: 7px;
  }
</style>

<template>
  <section>
    <div class="container" v-loading="loading">
      <div class="face-box">
        <span class="close" @click="faceRemove()" v-show="imgBase64">
          <span class="el-icon-delete" circle></span>
        </span>
        <img :src="imgBase64" v-show="imgBase64">
      </div>
      <span class="btn-row">
        <camera-btn 
          showType='1'
          openBtnText="现场拍照" 
          submitBtnText="确认上传" 
          @path="setPhoto($event)" 
          :isface="true"
          :disabled="imgBase64?true:false"
        />
        <upload-btn 
          @path="setPhoto($event)" 
          :disabled="imgBase64?true:false"
          showUploadType="1"
        />
      </span>
      <br>
    </div>
    
  </section>
</template>

<script>
import {householdFaceAdd, householdFaceRemove} from "@/api/personnel"
import { detailHousehold } from "@/api/household";
import cameraBtn from "@/components/camera/";
// import cameraBtn from "@/components/camera";
import uploadBtn from "@/components/uploadImage";

export default {
  data(){
    return {
      localUpload:false,
      loading: false,
      imgBase64: ''
    }
  },
  components:{
    cameraBtn,
    uploadBtn
  },
  methods:{
    setPhoto:function(src){
      this.handleSubmit(src)
    },
    handleSubmit:function(src){
      
      let self = this;
      if(src && src!=''){
        this.loading = true;
        let imgBase64 = src.replace(/^data\:image\/\w+\;base64\,/, '');
        householdFaceAdd({
          householdId: this.$route.query.householdId,
          faceImgBase64: imgBase64
        }).then(function (response) {
          if(response.data && response.data.code===1){
            self.imgBase64 = src;

            self.$message({
              message: '上传成功，2s后自动返回',
              type: 'success'
            });
            setTimeout(() => {
              self.$router.go(-1)
            }, 2000);

          }else if(response.data){
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          this.loading = false;
          this.localUpload = false
          this.loadData()
        })
      }else{
        self.$message({
          message: '请先删除再进行上传',
          type: 'error'
        });
      }
    },
    faceRemove:function(){
      let self = this;
      self.$confirm('确定删除此人脸吗？').then(()=>{
        self.loading = true;
        if(self.imgBase64!='' && self.imgBase64){
          householdFaceRemove({
            householdId: self.$route.query.householdId,
          }).then(function (response) {
            if(response.data && response.data.code===1){
              self.$message({
                message: '成功',
                type: 'success'
              });
            }
          }).catch(function (a) {
          }).finally(_=>{
            self.loading = false;
            self.loadData()
          })
        }else{
          self.loadData()
        }
      }).catch(_=>{})
    },
    loadData:function(){
      let self = this;
      self.loading = true;
      detailHousehold(self.$route.query).then(function (response) {
        if (response.data && response.data.code==1) {
          self.imgBase64 = response.data.data.faceUrl
        }
      }).finally(_=>{
        self.loading = false;
      })
    }
  },
  mounted(){
    this.loadData()
  }
}
</script>
<style scoped>
  .container{
    min-width: 300px;
    display: inline-block;
  }
  .face-box{
    background-color: #F4F4F4;
    border: 1px solid #d7d7d7; 
    width: 300px;
    height: 370px;
    margin-bottom: 30px;
    border-radius: 9px;
    background-image: url(../../../assets/image/person.png);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    display: inline-block;
    position: relative;
  }
  .face-box img{
    width: 100%;
    height: 100%;
    max-height: 370px;
    object-fit: cover;
    object-position: 50% 50%;
    object-fit: cover;
  }
  .btn-row{
    display: flex;
    justify-content: space-between;
  }
  #my_DV{
    margin:0 auto;
  }
  #my_DV>video{
    width: 100% !important;
  }
  .close{
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 50%;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all .3s;
    color: #fff;
  }
  .close:hover{
    background-color: rgba(0, 0, 0, 0.3);
  }
  .float-left{
    float: left;
  }
  .dialog-content{
    height: 450px;
    text-align: center;
  }
</style>

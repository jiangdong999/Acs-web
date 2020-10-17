<template>
  <span @click="showCamera">
<!-- 按钮  现场拍照  showType=='1'-->
    <el-button type="primary" v-if="showType=='1'" plain :disabled="disabled">{{openBtnText}}</el-button>
<!-- 重拍 showType=='2' -->
    <span class="re-take" v-if="showType=='2'"><i class="iconfont icon-zhongpai1"></i>重拍</span>   
<!-- showType=='3' -->
    <div class="img-box-add1"  v-if="showType=='3'">
      <div class="little-box">
        <div style="margin-bottom:11px;"><i class="iconfont icon-paizhaoxinzhaopian"></i></div>
        <div>拍摄新照片</div>
      </div>
      
    </div>
    <el-dialog
      :width="browser=='ie'?'40%':'60%'"
      title="拍照"
      :visible.sync="visible"
      @open="initCamera()"
      @close="stopCamera()"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body>
      <div class="view">
        <div id="my_DV" v-show="camera" ref="my_DV">
          <OBJECT id="Camera" ref="cameraObj" v-if="browser=='ie'&visible" classid="clsid:C93B6B89-E455-464D-BE86-DA990A8322FE" width=100% height="400px"></OBJECT><br>
        </div>
        <div id="my_camera" style="margin:auto;text-align:center" v-show="!camera">
          <img :src="photoSrc" height="400">
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span class="float-left">
          <el-button @click="reGetData()" v-show="reShot">重拍</el-button>
        </span>
        <el-button @click="getData()" v-show="!reShot">拍摄</el-button>
        <el-button type="primary" @click="getPic()" v-show="reShot">{{submitBtnText}}</el-button>
        <el-button @click="visible=false">取 消</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import Webcam from 'webcamjs'

let BROWSER_TYPE;
if(!!window.ActiveXObject || "ActiveXObject" in window){
  BROWSER_TYPE =  'ie';
}else if(window.rjWebCam){
  BROWSER_TYPE =  'rj';
}else{
  BROWSER_TYPE =  'web';
}

export default {
  props:['openBtnText', 'submitBtnText', 'isface', 'disabled', 'showType'],
  data(){
    return {
      isShowBtn: true,
      camera: true,
      reShot: false,
      photoSrc:'',
      imgBase64: '',
      visible:false
    }
  },
  computed:{
    browser:{
      get:function(){
        return BROWSER_TYPE;
      },
      set:function(type){
        BROWSER_TYPE = type
      }
    }
  },
  methods:{
    initCamera: function () {

      if(BROWSER_TYPE == 'ie'){
        this.$nextTick(()=>{

          // this.setOBJ();
          //初始化插件
          if(Camera== undefined){
              this.$message.error('插件初始化失败，请检查是否已经安装');
              // return;
              BROWSER_TYPE = 'web';
              this.initCamera();
              return 
          }

          try{
              //初始化
              var initOcx = Camera.Start();
          }catch(e){
              this.$message.error('插件初始化错误，请检查使用环境');
              // console.log(e)
              // return;
              BROWSER_TYPE = 'web';
              this.initCamera()
              return 
          }


          if (!initOcx) {
              this.$message.error('连接失败，请检查摄像设备是否已经连接');
              BROWSER_TYPE = 'web';
              this.initCamera()
              return 
          }

          const MODE = this.isface? 1: 0;
          Camera.Open(MODE, 1, 80)
          //读取数据
          // getData()

        })

      }else if(BROWSER_TYPE == 'rj'){

        window.rjWebCam.canAccess('cameraCallback')
        let self = this

        window.cameraCallback = function (flag){
          if(flag){
            window.showImage = function (src, hasCamera){
              // if(hasCamera!=false){
                if (src == '') {
                  self.$message.warning('未获取到图片')
                } else {
                  self.$emit('path', src)
                }
              // }else{
              //   self.$message.warning('未找到可用摄像头，请检查设备')
              // }
            }

            const MODE = self.isface? 1: 0;
            window.rjWebCam.show(MODE, 1, 100, 'showImage');
          }else{
            BROWSER_TYPE = 'web';
            self.initCamera()
            return 
          }
        }

      }else if(BROWSER_TYPE == 'web'){
        /**
         * 监听报错信息
         */
        let self = this
        Webcam.on('error', function (err) {
          self.$message.error('连接摄像头失败，请检查摄像头是否正常')
          // an error occurred (see 'err')
        })
        Webcam.set({
          // force_flash:true,//强制使用flash模式
          swfURL: 'http://acs.test.corelines.cn/resource/webcam/webcam.swf?time=' + new Date().getTime(),
          // live preview size
          width: 640,
          height: 480,
          // device capture size
          dest_width: 640,
          dest_height: 480,
          // final cropped size
          crop_width: 640,
          crop_height: 480,
          image_format: 'jpeg',
          flip_horiz: true,
          jpeg_quality: 100,
          unfreeze_snap: false
        })
        this.visible = true;
        setTimeout(() => {
          Webcam.attach(this.$refs.my_DV)
        }, 500)
      }

    },
    getData: function () {
      if(BROWSER_TYPE == 'ie'){
        const scale = this.isface? 1: 0.4;
        let data_uri = Camera.CaptureImage(scale,80);
        if(!data_uri){
            this.$message.error('读取失败');
            Camera.Close();
            Camera.Stop();
            return;
        }
        this.photoSrc = data_uri;
        this.camera = false;
        this.reShot = true;

      }else if(BROWSER_TYPE == 'web'){
        // 冻结画面
        Webcam.freeze()       
        this.reShot = true
      }
    },
    getPic:function(){
      if(BROWSER_TYPE == 'ie'){
        this.imgBase64 = this.photoSrc;

        this.reGetData();
        this.visible = false
      }else if(BROWSER_TYPE == 'web'){
        let self = this
        Webcam.snap(function (data_uri) {
          // self.imgBase64 = data_uri.replace(/^data\:image\/\w+\;base64\,/, '');
          self.imgBase64 = data_uri                            
          self.visible = false  
          Webcam.reset()      
        })        
      }
      this.$emit('path', this.imgBase64)    
    },
    reGetData:function(){
      if(BROWSER_TYPE == 'web') Webcam.unfreeze();

      this.camera = true;
      this.reShot = false;
    },
    stopCamera:function(){
      if(BROWSER_TYPE == 'ie'){
        Camera.Close();
        Camera.Stop();
        this.camera = true;
        this.reShot = false;
        this.visible = false;
      }else if(BROWSER_TYPE == 'web'){        
        Webcam.reset()
        this.camera = true;
        this.reShot = false      
      }
    },
    showCamera: function () {
      if(BROWSER_TYPE == 'rj'){
        this.initCamera();
      }else{
        this.visible = true;
      }
    }
  }
}
</script>
<style scoped lang="scss">
  #my_DV{
    margin:0 auto;
  }
  #my_DV>video{
    width: 100% !important;
  }
  .re-take{
    color: #0080e8;
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    cursor: pointer;
    i{
      font-size: 14px;
      margin-right: 4px;
    }
  }
  
  .img-box-add1{
    width: 100%;
    height: 250px;
    background: #f4f4f4;
    border: 1px solid #d7d7d7;
    border-bottom: 0px;
    border-radius: 6px 6px 0px 0px;
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
    border-bottom: 1px solid #d7d7d7;
    box-sizing: border-box;
    div{
      text-align: center;
      color: #606266;
    }
    i{
      font-size: 32px;
      color: #8a8a8a;
    }
  }
  
</style>

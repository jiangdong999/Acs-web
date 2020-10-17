<template>
  <span>

    <el-button type="primary" plain @click="showCamera" :disabled="disabled">{{openBtnText}}</el-button>

    <el-dialog
      width="80%"
      title="拍照"
      :visible.sync="visible"
      @open="initCamera()"
      @close="stopCamera()"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body>
      <div class="view">
        <div id="my_DV" v-show="camera" ref="my_DV"></div>
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
        <el-button @click="stopCamera()">取 消</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import Webcam from 'webcamjs'

export default {
  props:['openBtnText', 'submitBtnText', 'isface', 'disabled'],
  data(){
    return {
      camera: true,
      reShot: false,
      photoSrc:'',
      imgBase64: '',
      visible:false
    }
  },
  computed:{
    isRJ:function(){
      if(window.rjWebCam){
        return true;
      }else{
        return false;
      }
    }
  },
  methods:{
    initCamera: function () {
      if(this.isRJ){

        let self = this;
        window.showImage = function (src){
          if (src == '') {
            self.$alert('未获取到图片')
          } else {
            self.$emit('path', src)
          }
        }

        const MODE = this.isface? 1: 0;
        window.rjWebCam.show(MODE, 1, 100, 'showImage');

      }else{
        /**
         * 监听报错信息
         */
        let self = this
        Webcam.on('error', function (err) {
          self.$message.error('连接摄像头失败，请检查摄像头是否正常')
          // console.log(err)
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
        setTimeout(() => {
          Webcam.attach(this.$refs.my_DV)
        }, 500)
      }
    },
    getData: function () {
      // 冻结画面
      Webcam.freeze()
      this.reShot = true
    },
    getPic:function(){
      let self = this
      Webcam.snap(function (data_uri) {
        // self.imgBase64 = data_uri.replace(/^data\:image\/\w+\;base64\,/, '');
        self.imgBase64 = data_uri
        self.$options.methods.stopCamera.bind(self)()
        self.$emit('path', self.imgBase64)
      })
    },
    reGetData:function(){
      this.camera = true;
      this.reShot = false;
    },
    stopCamera:function(){
      if (Webcam['live']) {
        Webcam.reset()
      }
      this.camera = true;
      this.reShot = false
      this.visible = false;
    },
    showCamera: function () {
      if(this.isRJ){       
        this.initCamera();
      }else{
        this.visible = true;

      }
    }
  }
}
</script>
<style scoped>
  #my_DV{
    margin:0 auto;
  }
  #my_DV>video{
    width: 100% !important;
  }
</style>

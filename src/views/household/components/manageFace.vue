<template>
  <div class="dialog-box">
    <div class="loading" v-if="loadingList"></div>
    <div v-else>
      <div class="total" v-if="faceListData.length>=0">共 {{faceListData.length}} 张人脸照片</div>
      <div class="item-photo cameraBtn-uploadBtn" v-if="faceListData.length < faceMaxNum">
        <!-- <div class="img-box-add" v-if="isIcon">
                  <div class="add-icon"></div>
        </div>-->
        <div class="cameraBtn">
          <camera-btn
            openBtnText="重拍"
            submitBtnText="确认上传"
            @path="addFaceImg($event)"
            showType="3"
            :isface="true"
          />
        </div>
        <div class="uploadBtn">
          <upload-btn @path="addFaceImg($event)" showUploadType="2" />
        </div>
      </div>
      <div class="noFaceListData"  v-if="faceListData.length == 0" >
        <el-image style="width:141px;height:auto" :src="img_no_peopleUrl" alt="" srcset=""></el-image>
      </div>
      <div class="wrap-wrap-wrap">
        <span
          v-if="faceListData.length>3 && faceListData.length<6"
          class="to-left-right to-left"
          @click="toRight()"
        >
          <i class="iconfont icon-juxing2"></i>
        </span>
        <span
          v-if="faceListData.length>3 && faceListData.length<6"
          class="to-left-right to-right"
          @click="toLeft()"
        >
          <i class="iconfont icon-juxing2"></i>
        </span>
        <div class="wrap-wrap"  v-if="faceListData.length != 0">
          <div class="wrap-box" :class="{'moveLeft': isLeft, 'moveRight': isRight}">
            <!-- item -->
            <div class="item-photo" v-for="(item,index) in faceListData" :key="index">
              <div class="item-loading" v-if="item.itemLoading"></div>
              <div class="img-box" v-else>
                <!-- <img :src="item.imageUrl" v-show="item.imageUrl" @click="showImage(item.imageUrl)"> -->
                <el-image
                  class="img-style"
                  :src="item.imageUrl"
                  fit="cover"
                  :preview-src-list="[item.imageUrl]"
                >
                  <div slot="error" class="image-slot">
                    <span class="face-img-err face-pic-col"></span>
                  </div>
                </el-image>
                <div
                  v-if="item.pushStatus=='1'"
                  class="sync-detail green"
                  @click="fetchSyncDetail(item.householdFaceId)"
                >
                  同步成功
                  <i class="iconfont icon-jindu"></i>
                </div>
                <div
                  v-else-if="item.pushStatus=='0'"
                  class="sync-detail red"
                  @click="fetchSyncDetail(item.householdFaceId)"
                >
                  {{item.statisticPush}}台门禁机同步失败
                  <i class="iconfont icon-jindu"></i>
                </div>
                <div v-else class="sync-detail blue" @click="fetchSyncDetail(item.householdFaceId)">
                  同步中
                  <i class="iconfont icon-jindu"></i>
                </div>
              </div>
              <div class="photo-info">
                <div>
                  <label>采集时间</label>
                  <span class="time">{{item.modifyTime | formatTimeMillisToDate}}</span>
                </div>
                <div>
                  <label>采集途径</label>
                  <span class="time">{{item.source | transFaceSourceStatus}}</span>
                </div>
                <!-- <div class="set-default" @click="setDefaultImg(item.personId,index)">设为默认头像</div> -->
                <div class="picture">
                  <!-- <div class="re-photo"> -->
                  <camera-btn
                    openBtnText="重拍"
                    submitBtnText="确认上传"
                    @path="modifyFaceImg($event,item)"
                    showType="2"
                    :isface="true"
                  />
                  <span class="re-upload">
                    <upload-btn
                      @path="modifyFaceImg($event,item)"
                      showUploadType="3"
                      openBtnText="重传"
                    />
                  </span>
                  <span class="delete" @click="delFaceImg(item.personId,index,item.faceUuid,item.householdUuid)">
                    <i class="iconfont icon-shanchu2"></i>删除
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-dialog-control-area">
      <el-button @click="$parent.handleClose()">关闭</el-button>
    </div>
    <imageView :visible.sync="showModal" :data="itemData"></imageView>
    <div v-if="showSync">
      <el-dialog
        title="同步状态"
        :visible.sync="showSync"
        top="5vh"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <sync-status :communityId="data.communityId" :householdFaceId="householdFaceId" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import cameraBtn from "@/components/camera/";
import uploadBtn from "@/components/uploadImage";
import { householdFaceUpload } from "@/api/personnelv1";
import { setProfile } from "@/api/face";
import { faceList,modifyFace, addFace, delFace,loadSetting } from "@/api/facev1";
import imageView from "@/components/imageView/index";
import { transFaceSourceStatus } from "@/filters/household";
import syncStatus from "./syncStatus";
import img_no_peopleUrl from "@/assets/image/img_no people.png"


export default {
  props: ["data"],
  filters: {
    transFaceSourceStatus,
  },
  components: {
    cameraBtn,
    imageView,
    uploadBtn,
    syncStatus,
  },
  created() {
    this.faceList();
  },
  data() {
    return {
      img_no_peopleUrl:img_no_peopleUrl,
      loadingList: false,
      showSync: false,
      showModal: false,
      isLeft: false,
      isRight: false,
      imgBase64: "",
      faceListData: [],
      itemData: {},
      faceMaxNum: 1,
      householdFaceId: null,
    };
  },
  methods: {
    //设为默认头像
    // setDefaultImg (personId,index) {
    //   let self = this
    //   self.$confirm('是否确认该操作？').then(_ => {
    //     self.faceListData[index].itemLoading = true
    //     setProfile({
    //       communityId: self.data.communityId,
    //       householdId: self.data.householdId,
    //       personId: personId,
    //     }).then(function (response) {
    //       self.faceListData[index].itemLoading = true
    //       if (response.data && response.data.code === 1) {
    //         self.$message({
    //           message: response.data.message,
    //           type: 'success'
    //         });
    //         self.$emit('close') //关闭弹窗时刷新住户详情
    //       }
    //     }).catch(function (a) {
    //       self.faceListData[index].itemLoading = false
    //     }).finally(_=>{
    //       self.faceListData[index].itemLoading = false
    //     })
    //   })
    //   .catch((a) => {
    //   })
    // },
    //查看人脸同步状态
    fetchSyncDetail(id) {
      this.showSync = true;
      this.householdFaceId = id;
    },
    showImage(path) {
      this.itemData = { imageUrl: path };
      this.showModal = true;
    },
    faceList() {
      let that = this;
      that.loadingList = true;
      
      faceList({
        communityId: this.data.communityId,
        nodeUuid:this.data.nodeUuid,
        householdUuid: this.data.householdUuid,
      })
        .then(function (response) {
          that.loadingList = false;
          if (response.data && response.data.status === 0) {
            response.data.content.forEach((item) => {
              item.itemLoading = false;
            });
            that.faceListData = response.data.content || [];
          }
        })
        .catch(function (a) {
          that.loadingList = false;
          console.error(a);
        })
        .finally((_) => {
          that.loadingList = false;
        });
    
        loadSetting({
          communityUuid:this.data.communityUuid
        }).then(function(response){
          if (response.data && response.data.status === 0) {
            that.faceMaxNum = response.data.content.maxContractPhotos || 1;
          }  
        }).catch(function(a){
          that.loadingList = false;
          console.error(a);
        })
    },
    toLeft() {
      this.isRight = false;
      this.isLeft = true;
    },
    toRight() {
      this.isLeft = false;
      this.isRight = true;
    },
    //新增人脸
    addFaceImg(base64) {
      // console.log(base64);
      let self = this;
      self.loadingList = true;
      let base64ClipData = base64.split(",")[1];
      householdFaceUpload({
        faceImgBase64: base64ClipData,
        faceType:'99'
      }).then(function (response) {
        if(response.data && response.data.status===0){

          self.data.key = response.data.content.key;
          self.addFacefun(self.data)
     
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      })

      
    },
    //添加脸
    addFacefun(data){
      let self = this;
      addFace({
        communityId: data.communityId,
        householdId: data.householdId,
        householdUuid:data.householdUuid,
        communityUuid:data.communityUuid,
        nodeUuid:data.nodeUuid,
        source: "2",
        faceList:[{
          faceData:'',
          imageUrl:data.key
        }]
      })
        .then(function (response) {
          if (response.data && response.data.status === 0) {
            self.$message({
              message: response.data.message,
              type: "success",
            });
            self.$emit("close");
            self.faceList();
          }
        })
        .catch(function (a) {
          self.loadingList = false;
          console.error(a);
        })
        .finally((_) => {
          self.loadingList = false;
        });
    },
    //修改人脸
    modifyFaceImg(base64,item) {
      let self = this;
      let base64ClipData = base64.split(",")[1];

      householdFaceUpload({
        faceImgBase64: base64ClipData,
        faceType:'99'
      }).then(function (response) {
        if(response.data && response.data.status===0){

          self.data.key = response.data.content.key;
          self.modifyFacefun(self.data,item)
     
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      })
    },
    //修改脸
    modifyFacefun(data,item){
      let self = this;
      modifyFace({
        communityId: data.communityId,
        householdId: item.householdId,
        nodeUuid: data.nodeUuid,
        personId: item.personId,
        householdUuid:item.householdUuid,
        faceUuid:item.faceUuid,
        faceList:[{
          faceData:'',
          imageUrl:data.key
        }]
      })
        .then(function (response) {
          if (response.data && response.data.status === 0) {
            self.$message({
              message: response.data.message,
              type: "success",
            });
            self.$emit("close");
            self.faceList();
          }
        })
        .catch(function (a) {
          // self.faceListData[index].itemLoading = false;
          console.error(a);
        })
        .finally((_) => {
          // self.faceListData[index].itemLoading = false;
        });
    },
    delFaceImg(personId, index,faceUuid,householdUuid) {
      let self = this;
      self
        .$confirm("是否确认删除该人脸照片？")
        .then((_) => {
          self.faceListData[index].itemLoading = true;
          delFace({
            communityId: self.data.communityId,
            nodeUuid: self.data.nodeUuid,
            householdId: self.data.householdId,
            personId: personId,
            householdUuid:householdUuid,
            faceUuid:faceUuid
          })
            .then(function (response) {
              self.faceListData[index].itemLoading = false;
              if (response.data && response.data.status === 0) {
                self.$message({
                  message: response.data.message,
                  type: "success",
                });
                self.$emit("close");
                self.faceList();
              }
            })
            .catch(function (a) {
              self.faceListData[index].itemLoading = false;
            })
            .finally((_) => {
              self.faceListData[index].itemLoading = false;
            });
        })
        .catch((a) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-box {
  // padding-left: 30px;
}
.loading {
  width: 100%;
  height: 448px;
  background-image: url(../../../assets/gif/loadingWhite.gif);
  background-position: center center;
  background-repeat: no-repeat;
}
.to-left-right {
  cursor: pointer;
  position: absolute;
  top: 143px;
  color: #b3c0ca;
  width: 30px;
  height: 50px;
  // background: rgba(0, 126, 228, 0.1);
  border-radius: 2px 0px 0px 2px;
  display: inline-block;
  text-align: center;
  i {
    font-weight: 600 !important;
    font-size: 20px;
    line-height: 50px;
  }
}
.to-left-right:hover{
  color: #007ee4;
}
.to-left {
  left: -35px;
  transform: rotate(180deg);
}
.to-right {
  right: -35px;
}
.total {
  font-size: 16px;
  font-weight: 600;
  color: #223040;
  margin-bottom: 20px;
  // padding-left: 30px;
  display: inline-block;
}
.wrap-wrap-wrap {
  position: relative;
  width: 690px;
  // padding-left: 30px;
  // padding-right: 40px;
}
.wrap-wrap {
  position: relative;
  overflow: hidden;
  height: 353px;
  width: 690px;
  // margin-left: 20px;
}
.wrap-box {
  position: absolute;
  left: 0px;
  top: 0px;
  margin-bottom: 20px;
  width: 1500px;
  height: 360px;
  transition: all 0.5s;
}
.moveLeft {
  left: -320px;
}
.moveRight {
  left: 0px;
}
.item-photo {
  width: 185px;
  height: 340px;
  background-color: #f2f5f5;
  margin-right: 20px;
  float: left;
}
.item-loading {
  width: 100%;
  height: 250px;
  background-color: #f4f4f4;
  border: 1px solid #d7d7d7;
  background-image: url(../../../assets/gif/loadingGrey.gif);
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 15px;
}
.img-box {
  cursor: pointer;
  width: 165px;
  height: 220px;
  margin: 10px 10px 0 10px;
  position: relative;
  .img-style {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    border: 0px solid #eee;
    border-radius: 6px;
  }
  .sync-detail {
    position: absolute;
    background: #fff;
    border-radius: 15px;
    padding: 7px 16px;
    bottom: 10px;
    left: 5px;
    width: 154px;
    height: 30px;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    line-height: 16px;
    cursor: pointer;
    i {
      font-size: 12px;
      color: #333;
      float: right;
    }
  }
  .green {
    color: #3ba314;
  }
  .red {
    color: #d44848;
  }
  .blue {
    color: #79a2f4;
  }
}
.photo-info {
  div:nth-of-type(1) {
    margin-top: 10px;
  }
  div:nth-of-type(2) {
    margin-top: 5px;
  }
  .set-default {
    margin-top: 12px;
    width: 200px;
    height: 40px;
    background: #007ee4;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: #fff;
    line-height: 40px;
    cursor: pointer;
  }
  .picture {
    margin-top: 10px;
    // margin-left: 36px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  label {
    margin-left: 10px;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
  }
  .time {
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 22px;
    padding-left: 10px;
  }
  .re-take {
    color: #007ee4;
    font-size: 12px;
    font-weight: 600;
    color: #007ee4;
    line-height: 19px;
    cursor: pointer;
    position: relative;
    i {
      font-size: 12px;
      position: absolute;
      left: 0;
    }
  }
  .delete {
    color: #da5454;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    cursor: pointer;
    margin-left: 16px;
    i {
      font-size: 12px;
      margin-right: 4px;
    }
  }
}
.picture /deep/.re-take,
.picture /deep/.re-upload .text-btn
{
  font-size: 12px;
}
.picture /deep/.re-take i,
.picture /deep/.re-upload i{
  font-size: 12px;
}

.form-dialog-control-area {
  text-align: center !important;
}
// .upload-img{
//   width: 100%;
//   height: 250px;
//   background: #f4f4f4;
//   border: 1px solid #d7d7d7;
//   border-top: 0px;
//   border-radius: 0px 0px 6px 6px;
//   position: relative;
//   cursor: pointer;
//   padding-left: 20px;
//   padding-right: 20px;
//   height: 125px;
// }
// .little-box{
//   width: 158px;
//   height: 124px;
//   padding-top: 34px;
//   box-sizing: border-box;
//   div{
//     text-align: center;
//   }
//   i{
//     font-size: 32px;
//   }
// }
.img-box-add {
  width: 100%;
  height: 250px;
  background: #f4f4f4;
  border: 1px solid #d7d7d7;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
}
.add-icon {
  position: absolute;
  top: 50%;
  margin-top: -40px;
  left: 50%;
  margin-left: -40px;
  width: 80px;
  height: 80px;
  background-image: url("../../../assets/image/add-img.png");
  background-size: contain;
}
.isCon {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  color: #333333;
  line-height: 20px;
  margin-bottom: 14px;
}
.re-upload {
  margin-left: 16px;
}

.cameraBtn-uploadBtn {
  display: inline-block;
  width: 250px;
  height: 26px;
  float: none;
  margin-left: 17px;
  background-color: #fff;
}
.cameraBtn,
.uploadBtn {
  display: inline-block;
  margin-right: 10px;
}

.cameraBtn /deep/ .img-box-add1 .little-box .iconfont,
.uploadBtn /deep/ .upload-img .little-box .iconfont {
  font-size: 12px;
}
.cameraBtn /deep/ .img-box-add1 .little-box div,
.uploadBtn /deep/ .upload-img .little-box div {
  display: inline-block;
  font-size: 12px;
}
.cameraBtn /deep/ .img-box-add1,
.uploadBtn /deep/ .upload-img {
  width: 101px;
  height: 26px;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border: none;
  text-align: center;
  line-height: 26px;
  display: inline-block;
}
.cameraBtn /deep/ .img-box-add1 .little-box,
.uploadBtn /deep/ .upload-img .little-box {
  width: 101px;
  height: 26px;
  padding: 0;
  background-color: #fff;
  border: 1px solid #d7d7d7;
  display: inline-block;
}
.noFaceListData{
  text-align: center;
  height: 440px;
  padding-top: 81px;
}
.face-pic-col{
  width: 100%;
  height: 184px;
}
</style>
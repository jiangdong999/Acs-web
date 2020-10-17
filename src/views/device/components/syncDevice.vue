<template>
  <div class="dialog-form">
    <p>是否立即通知门禁机同步？</p>
    <label>当前数据不同步，详情如下：</label>
    <div class="info-sync">
      <div class="jdclassInfo">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="bgc">
              <div class="jdclassInfo_h1">
                <i class="iconfont icon-xingzhuangjiehe"></i>门卡数量
              </div>
              <div class="jdclassInfo_ul">
                <div
                  class="jdclassInfo_ul_1"
                  style="margin-right:1px solid #ccc;border-right: 1px solid rgba(230,233,237,1);"
                >
                  <p style="color:rgba(255,83,78,1)">门禁机</p>
                  <p>
                    <b style="color:rgba(255,83,78,1)">{{device.doorCardCount}}</b>
                  </p>
                </div>
                <div class="jdclassInfo_ul_1">
                  <p>管理平台</p>
                  <p>
                    <b>{{device.cardCount}}</b>
                  </p>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div  class="bgc">
              <div class="jdclassInfo_h1">
                <i class="iconfont icon-xiaolianmanyifuwu"></i>人脸数量
              </div>
              <div class="jdclassInfo_ul">
                <div
                  class="jdclassInfo_ul_1"
                  style="margin-right:1px solid #ccc;border-right: 1px solid rgba(230,233,237,1);"
                >
                  <p style="color:rgba(255,83,78,1)">门禁机</p>
                  <p>
                    <b style="color:rgba(255,83,78,1)">{{device.doorFaceCount}}</b>
                  </p>
                </div>
                <div class="jdclassInfo_ul_1">
                  <p>管理平台</p>
                  <p>
                    <b>{{device.faceCount}}</b>
                  </p>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="form-dialog-control-area">
      <el-button @click="$parent.handleClose()">取消</el-button>
      <el-button @click="handleSubmit" type="primary" :loading="loading">同步</el-button>
    </div>
  </div>
</template>

<script>
import { syncDevice } from "@/api/device";
export default {
  props: ["device"],
  data() {
    return {
      loading: false
    };
  },
  methods: {
    handleSubmit() {
      let self = this;
      self.loading = true;
      syncDevice({
        doorName: self.device.doorName,
        doorDeviceId: self.device.doorDeviceId,
        communityId: self.device.communityId,
        doorId: self.device.doorId
      })
        .then(function(response) {
          if (response.data && response.data.code === 1) {
            self.$message({
              message: response.data.message,
              type: "success"
            });
            self.$emit("submit");
          }
        })
        .catch(function(a) {})
        .finally(_ => {
          self.loading = false;
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-form {
  text-align: left;
  > p {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    // margin: 0px 30px 10px 30px;
    margin: 0;
    margin-bottom: 20px;
  }
  > label {
    font-size: 16px;
    font-weight: 500;
    color: #999;
    // margin-left: 30px; 
  }
  > .input {
    margin: 10px 0 40px 0;
  }
  > .info-sync {
    // margin: 40px 30px;
    margin-top: 30px;
    margin-bottom: 45px;
    text-align: center;
    .jdclassInfo {
      width: auto;
      height: auto;
      overflow: hidden;
      div {
        height: 135px;
        // width: 220px;
        // background: #f2f5f5;
        // float: left;
        border-radius: 6px;
        .jdclassInfo_h1 {
          height: 45px;
          width: 100%;
          background: rgba(0, 0, 0, 0.04);
          line-height: 45px;
          text-align: left;
          padding-left: 20px;
          border-radius: 0px;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
        .jdclassInfo_ul {
          width: auto;
          height: 90px;
          padding: 20px 0px 20px 0px;
          overflow: hidden;
          .jdclassInfo_ul_1 {
            height: 50px;
            width: 110px;
            overflow: hidden;
            float: left;
            padding-left: 20px;
            p {
              margin: 0px;
              height: 26px;
              line-height: 26px;
              text-align: left;
              font-size: 12px;
              b {
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
}

.bgc{
  background: #f2f5f5;
}
.iconfont {
  margin-right: 5px;
}
.form-dialog-control-area {
  border-top: none;
  text-align: center;
  padding: 0px;
}
</style>
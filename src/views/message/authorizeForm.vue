<template>
  <div class="container">
    <div class="content-main" v-if="active==1" key="a" v-loading="loading">
      <div class="no-pass-reason" v-if="status=='4'">
        <el-row>
          <el-col :span="24">不通过原因：{{data.rejectContent}}</el-col>
        </el-row>
      </div>
      <el-row :gutter="20" class="content-main-header">
        <el-col :span="12">
          <span>房间地址</span>
          <p>{{data.fullNodeName}}</p>
        </el-col>
        <el-col :span="4">
          <span>申请类型</span>
          <p>{{data.householdType | transHouseholdRole}}</p>
        </el-col>
        <el-col :span="4">
          <span>与业主关系</span>
          <p>{{ data.relationship | relationshipOptions}}</p>
        </el-col>
        <el-col :span="data.householdType==3 ? 4 : 4" v-if="data.householdType==3">
          <span>申请人员</span>
          <p>{{data.sponsor}}</p>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="person-info">
        <el-row>
          <el-col :span="12">
            姓名：
            <span>{{data.householdName}}</span>
          </el-col>
          <el-col :span="12">
            手机号码：
            <span>{{data.phoneNumber}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            性别：
            <span>{{data.gender=='m'?'男':'女'}}</span>
          </el-col>
          <el-col :span="12">
            证件号码：
            <span>{{data.citizenId}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            民族：
            <span>{{data.ethnicity}}</span>
          </el-col>
          <el-col :span="12">
            住址：
            <span>{{data.residentialAddress}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="data.householdType==3">
            <span v-if="data.leaseEndTime">租赁期至：{{data.leaseEndTime | formatDate}}</span>
            <span v-else>租期：{{data.leaseType | transLeaseTypeStatus}}</span>
            <el-button type="text" size="small" v-if="status==2" @click="editLeaseDate()">修改</el-button>
          </el-col>
        </el-row>
        <el-row v-if="showModal">
          <el-col :span="12">
            <label class="label-lease">租赁期至</label>
            <el-date-picker
              v-model="leaseForm.date"
              type="date"
              class="sSize-input-date"
              value-format="yyyyMMdd000000000"
              placeholder="选择日期"
            ></el-date-picker>
            <el-button type="defalt" size="small" @click="handleClose()">取消</el-button>
            <el-button type="primary" size="small" @click="handleModify()">确定</el-button>
          </el-col>
        </el-row>
      </el-card>
      <span
          v-if="picLen > 7"
          class="to-left-right to-left"
          @click="toRight()"
        >
          <i class="iconfont icon-juxing2"></i>
        </span>
        <span
          v-if="picLen > 7"
          class="to-left-right to-right"
          @click="toLeft()"
        >
          <i class="iconfont icon-juxing2"></i>
        </span>
      <el-row class="picture">  
        <div class="pic-wrapper" :class="{'moveLeft': isLeft, 'moveRight': isRight}">
          <div class="item-pic">
            <div class="pic-vertical">
              <div v-if="data.faceUrl">
                <el-image :src="data.faceUrl" :preview-src-list="[data.faceUrl]"></el-image>
              </div>
              <div v-else style=" background: #f7f7f7;">
                <el-image
                  :src="img_failedLoad"
                  style="width: auto !important;height: auto !important;margin: 26px auto;"
                ></el-image>
              </div>
              <p>个人照片</p>
            </div>
          </div>
          <div v-if="licenseArr.length!=0">
            <div class="item-pic-vertical" v-for="(item,index) in licenseArr" :key="index">
              <div class="pic-vertical">
                <el-image :src="item" :preview-src-list="[item]"></el-image>
                <p>{{ data.householdType==3?'租房合同照片': '房产证照片' }}</p>
              </div>
            </div>
          </div>
          <div class="item-pic">
            <div
              :class="{'pic-vertical1': licenseArr.length<2,'pic-vertical2': licenseArr.length>1}">
              <!-- <el-image
              :src="data.certificateFrontUrl" 
              :preview-src-list="[data.certificateFrontUrl]">
              </el-image>-->
              <div v-if="data.certificateFrontUrl">
                <el-image
                  :src="data.certificateFrontUrl"
                  :preview-src-list="[data.certificateFrontUrl]"
                ></el-image>
              </div>
              <div v-else style=" background: #f7f7f7;">
                <el-image
                  :src="personal_idcardfront"
                  style="width: auto !important;height: auto !important;margin: 23px auto;"
                ></el-image>
              </div>
              <p>身份证人像面</p>
            </div>
          </div>
          <div class="item-pic" v-show="false">
            <div
              :class="{'pic-vertical1': licenseArr.length<2,'pic-vertical2': licenseArr.length>1}"
            >
              <!-- <el-image
              :src="data.certificateBackUrl" 
              :preview-src-list="[data.certificateBackUrl]">
              </el-image>-->

              <div v-if="data.certificateBackUrl">
                <el-image
                  :src="data.certificateBackUrl"
                  :preview-src-list="[data.certificateBackUrl]"
                ></el-image>
              </div>
              <div v-else style=" background: #f7f7f7;">
                <el-image
                  :src="personalback"
                  style="width: auto !important;height: auto !important;margin: 23px auto;"
                ></el-image>
              </div>
              <p>身份证国徽面</p>
            </div>
          </div>
        </div>
      </el-row>
      <el-row></el-row>
      <div class="title" v-show="false">选填信息</div>
      <div class="optional" v-show="false">
        <el-row>
          <el-col :span="8">婚姻状况：{{data.maritalStatus | transMaritalStatus}}</el-col>
          <el-col :span="8">
            居住证：
            <el-radio-group v-model="data.isFirstResidencePermit" :disabled="true">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="8">文化程度：{{data.educationLevel | transEducationLevel}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">宗教信仰：{{data.religion | transReligion}}</el-col>
          <el-col
            :span="8"
            v-if="data.householdType==='3'"
          >入住事由：{{data.stayReason | transStayReason}}</el-col>
          <!-- <el-col :span="12">兵役状态：{{data.militaryServiceStatus | transMilitaryServiceStatus}}</el-col> -->
          <el-col
            :span="8"
            v-if="data.isFirstResidencePermit==='1'"
          >有效期限：{{data.residencePermitDate | formatDate}}至{{data.residencePermitEnd | formatDate}}</el-col>
          <el-col :span="8">工作状态：{{data.personalStatus | transWorkStatus}}</el-col>
          <el-col
            :span="8"
            v-if="data.personalStatus==='2'"
          >职业：{{data.professionCode | transCareer}}</el-col>
          <el-col :span="8">政治面貌：{{data.politicalStatus | transPoliticalStatus}}</el-col>
        </el-row>

        <!-- <el-row>
              <el-col :span="12">单位名称：{{data.companyName}}</el-col>
              <el-col :span="12">单位地址：{{data.companyAddress}}</el-col>
              <el-col :span="12">所属行业：
                <el-select v-model="data.industry" :disabled="true">
                  <el-option-group
                  v-for="group in industriesOptions"
                  :key="group.label"
                  :label="group.label">
                  <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                  </el-option-group>
                </el-select>
              </el-col>
        </el-row>-->
      </div>

      <div class="form-dialog-control-area" v-if="data.applyStatus=='2'">
        <el-button type="default" @click="$parent.$parent.handleClose">关闭</el-button>
        <el-button type="danger" @click="active=3">拒绝</el-button>
        <el-button type="primary" @click="handleCheck('0')" :loading="loading">通过</el-button>
      </div>
      <div v-else class="form-dialog-control-area" style="text-align:center">
        <el-button type="default" @click="$parent.$parent.showModal=false">关闭</el-button>
      </div>
    </div>
    <div v-else-if="active==2" key="b">
      <div class="step-success">
        <img src="../../assets/image/success.png" />
        <p>审核已通过</p>
      </div>
      <div class="form-dialog-control-area" style="text-align:center">
        <el-button type="default" @click="$parent.$parent.handleClose">关闭</el-button>
      </div>
    </div>
    <div v-else-if="active==3" key="c" style="text-align:center">
      <div>
        <h3 style="font-size: 24px">请选择不通过原因</h3>
        <div class="reason">
          <el-radio-group v-model="reason">
            <el-radio class="reason-item" label="身份证信息不清晰"></el-radio>
            <br />
            <el-radio class="reason-item" label="手机号码有误"></el-radio>
            <br />
            <el-radio class="reason-item" label="个人照片不清晰"></el-radio>
            <br />
            <el-radio class="reason-item" label="没有此住户"></el-radio>
            <br />
            <el-radio class="reason-item" label="其他">
              其他
              <el-input
                style="margin-left:10px;"
                v-if="reason=='其他'"
                v-model="otherReason"
                placeholder="其他(请填写具体原因)"
              ></el-input>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-dialog-control-area" style="text-align:center">
        <el-button type="default" @click="$parent.$parent.handleClose">关闭</el-button>
        <el-button
          type="danger"
          style="padding:10px 0;"
          @click="handleCheck('1')"
          :loading="loading"
        >确定不通过</el-button>
      </div>
    </div>
    <div v-else-if="active==4" key="d">
      <div class="step-success">
        <img src="../../assets/image/error.png" />
        <p>审核不通过</p>
        <label>不通过原因：{{reason === '其他'? otherReason: reason}}</label>
      </div>
      <div class="form-dialog-control-area" style="text-align:center">
        <el-button type="default" @click="$parent.$parent.handleClose">关闭</el-button>
      </div>
    </div>
    <imageView :appendToBody="true" :visible.sync="showPicture" :data="imageData"></imageView>
  </div>
</template>

<script>
import img_failedLoad from "@/assets/image/img_failedLoad.png";
import personal_idcardfront from "@/assets/image/personal_idcardfront_img.png";
import personalback from "@/assets/image/personalback_img.png";

import { getAuthorize, checkAuthorize, modifyLeaseTime } from "@/api/message";
import imageView from "@/components/imageView/index";
import industriesOptions from "@/utils/industry";
import {
  transMaritalStatus,
  transPoliticalStatus,
  transEducationLevel,
  transMilitaryServiceStatus,
  transHouseholdRole,
  transLeaseTypeStatus,
  transReligion,
  transCareer,
  transWorkStatus,
  transStayReason,
  relationshipOptions,
} from "@/filters/household";
import { formatDate } from "@/filters/index";

export default {
  name: "authorize-form",
  components: { imageView },
  props: ["id", "status"],
  filters: {
    transMaritalStatus,
    transPoliticalStatus,
    transEducationLevel,
    transMilitaryServiceStatus,
    transHouseholdRole,
    transLeaseTypeStatus,
    transReligion,
    transWorkStatus,
    transCareer,
    transStayReason,
    formatDate,
    relationshipOptions,
  },
  data() {
    return {
      isRight:false,
      isLeft:false,
      picLen:0, //图片总数
      img_failedLoad: img_failedLoad,
      personal_idcardfront: personal_idcardfront,
      personalback: personalback,
      industriesOptions,
      active: 1,
      showModal: false,
      loading: false,
      showPicture: false,
      imageData: "",
      reason: "",
      otherReason: "",
      data: {
        // 1业主，2家人，3租客
        householdType: null,
      },
      licenseArr: [],
      leaseForm: {
        date: "",
      },
    };
  },
  methods: {
    toLeft() {
      this.isRight = false;
      this.isLeft = true;
    },
    toRight() {
      this.isLeft = false;
      this.isRight = true;
    },
    // 修改租期按钮
    editLeaseDate() {
      this.showModal = true;
      this.leaseForm.date = "";
    },
    handleClose() {
      this.showModal = false;
    },
    handleModify() {
      let self = this;
      modifyLeaseTime({
        id: self.id,
        leaseEndTime: self.leaseForm.date,
      })
        .then(function (response) {
          if (response.data && response.data.code == 1) {
            self.data.leaseEndTime = response.data.data.leaseEndTime;
            self.showModal = false;
            self.$message({
              message: response.data.message,
              type: "success",
            });
          } else {
            self.$message({
              message: response.data.message,
              type: "error",
            });
          }
        })
        .catch(function (a) {
          console.error(a);
        })
        .finally((_) => {});
    },
    showImage: function (path) {
      this.imageData = { imageUrl: path };
      this.showPicture = true;
    },
    handleCheck: function (status) {
      let self = this;
      self.loading = true;
      let text;

      if (status == "1") {
        if (this.reason === "其他") {
          text = this.otherReason;
        } else {
          text = this.reason;
        }
      }
      checkAuthorize({
        authorityId: self.id,
        type: status,
        rejectContent: text,
      })
        .then(function (response) {
          if (response.data && response.data.code == 1) {
            self.$message({
              message: "操作成功",
              type: "success",
            });
            self.active = status == "0" ? 2 : 4;
          } else {
            // self.$message({
            //   message: response.data.message,
            //   type: "error",
            // });
          }
        })
        .catch(function (a) {
          console.error(a);
        })
        .finally((_) => {
          self.loading = false;
        });
    },
    loadData: function () {
      let self = this;
      self.loading = true;
      getAuthorize({
        id: self.id,
      })
        .then(function (response) {
          if (response.data.data.licenseUrl) {
            self.licenseArr = response.data.data.licenseUrl.split(",");
          }
          self.picLen = self.licenseArr.length+5
          // console.log(self.picLen);
          self.data = response.data.data;
          self.loading = false;
        })
        .catch(function (a) {
          console.error(a);
        });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  /* line-height: 30px; */
  /* padding: 0 40px; */
}
.no-pass-reason {
  padding: 10px 0px 10px 60px;
  border: 1px solid #ebeef5;
  color: red;
}
.person-info {
  margin-top: 20px;
  width: 690px;
  /* height: 158px; */
  background: #f2f5f5;
  border-radius: 4px;
  padding: 0 34px;
  line-height: 22px;
}
.person-info .el-row {
  margin-bottom: 10px;
}
.step-success {
  padding-top: 64px;
  box-sizing: border-box;
  text-align: center;
  height: 300px;
  font-size: 15px;
  color: #333333;
}
.step-success label {
  font-size: 15px;
  color: #aaaaaa;
}
.item-pic,
.item-pic-vertical {
  cursor: pointer;
  float: left;
  margin-right: 10px;
}
.item-pic:last-child {
  margin-right: 0px;
}
.item-pic > div,
.item-pic-vertical > div {
  text-align: center;
}
.pic-vertical .el-image {
  width: 100px;
  height: 134px;
}

.item-pic img,
.item-pic-vertical img {
  object-fit: cover;
  object-position: 50% 50%;
  height: 168px;
}
.item-pic p,
.item-pic-vertical p {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  color: #007ee4;
  line-height: 22px;
  margin-top: 10px;
}

.item-pic /deep/span.el-image-viewer__close,
.item-pic-vertical /deep/span.el-image-viewer__close {
  top: 40px;
  right: 40px;
}
.pic-vertical {
  width: 100px;
}
.pic-vertical1 {
  width: 173px;
  height: 134px;
}

.pic-vertical1 .el-image {
  width: 173px;
  height: 134px;
}
.pic-vertical2 .el-image {
  width: 173px;
  height: 134px;
}

.pic-horizontal {
  max-width: 240px;
  margin: 0 auto;
}

.title {
  width: 123px;
  height: 20px;
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 20px;
  padding-left: 10px;
  border-left: 2px solid #007ee4;
  margin-bottom: 20px;
}
.optional {
  /* padding: 20px; */
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #666666;
  line-height: 22px;
}
.optional .el-col-8 {
  margin-bottom: 10px;
}
.reason {
  width: 250px;
  margin: 0 auto;
  text-align: left;
  position: relative;
  left: 30px;
}
.reason .reason-item {
  margin-bottom: 20px;
}
.picture {
  margin-top: 20px;
  overflow: hidden;
}
.pic-wrapper {
  position: relative;
  width: 2000px;
  left: 0px;
  transition: all 1.5s;
}
.label-lease {
  font-size: 14px;
  color: rgb(96, 98, 102);
}

.content-main-header {
  margin: 0;
  padding: 0;
  font-size: 16px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #999999;
  line-height: 20px;
}
.content-main-header p {
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 20px;
  margin-top: 10px;
}
.to-left-right {
  cursor: pointer;
  position: absolute;
  bottom: 170px;
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
  left: 10px;
  transform: rotate(180deg);
}
.to-right {
  right: 10px;
}
.moveLeft {
  left: -320px;
}
.moveRight {
  left: 0px;
}
</style>

<template>
  <el-form :model="form" ref="form" label-width="120px" class="container form-info-show jdform-info-show">
    <div>
      <div class="module-title">
        <mallki className="mallki-text" text="房间地址"></mallki>
      </div>
      <div class="room-name">{{data.communityName+data.buildingName+data.unitName+data.floorName+data.roomName}} <span class="fr">等待续期</span></div>
    </div>
    <div>
      <div class="module-title">
        <mallki className="mallki-text" text="住户信息"></mallki>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="住户姓名：">
            {{data.householdName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住户类型：">
            {{data.householdType | transHouseholdRole}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别：">
            {{data.gender | transGender}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码：">
            {{data.certificateNo}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="民族：">
            {{data.ethnicity}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住址：">
            {{data.residentialAddress}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="picture" :gutter="20">
        <el-col class="item-pic" :span="6">
          <div class="pic-vertical" @click="showImage(data.faceList[0].imageUrl)">
            <img :src="data.faceList[0].imageUrl">
            <p>个人照片</p> 
          </div> 
        </el-col>
        <el-col class="item-pic" :span="6">
          <div class="pic-vertical" @click="showImage(data.licenseUrl)">
            <img :src="data.licenseUrl">
            <p>租房合同照片</p> 
          </div> 
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="module-title">
        <mallki className="mallki-text" text="住户有效期"></mallki>
      </div>
      <el-form-item label="到期时间">{{ data.leaseEndTime | formatTimeMillisToDate }}</el-form-item>
      <el-row>
        <el-col :span="12" class="renewed-time">
          <el-form-item label="续期时长">
            <el-select v-model="form.renewedDuration" filterable @change="changeLeaseTime">
              <el-option label="三个月" :value="3"></el-option>
              <el-option label="六个月" :value="6"></el-option>
              <el-option label="十二个月" :value="12"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="valid-time">
          <el-form-item label="有效期至">
            <el-date-picker
              v-model="form.leaseEndTime" type="date"
              :picker-options="beforePickerOptions2()"
              format="yyyy-MM-dd"
              :clearable="false"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <!-- <el-input v-model="form.leaseEndTime"></el-input> -->
        </el-col>
      </el-row>
    </div>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$parent.handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">确定</el-button>
    </div>

    <imageView 
      :appendToBody="true"
      :visible.sync="showPicture" 
      :data="imageData">
    </imageView>
  </el-form>
</template>

<script>

import {transHouseholdRole} from "@/filters/household";
import {beforePickerOptions2} from "@/utils/validate";
import {formatDateTimeWithDot,formatTimeMillisToDate} from "@/filters/index"

import dateUtil from "@/utils/times";
import imageView from "@/components/imageView/index";
// import {renewedHousehold} from "@/api/household"
import {renewedHousehold} from "@/api/householdv1"
import { getSensitive } from "@/utils/auth";


export default {
  props:['data'],
  components: {imageView},
  filters:{
    transHouseholdRole,
    formatDateTimeWithDot,
    formatTimeMillisToDate,
    transGender: function(value){
      switch(value) {
        case '1': return '男';
        case '2': return '女';
        default: ''
      }
    }
  },
  computed: {
    isSensitive: function(){
      return getSensitive()
    }
  },
  data(){
    return {
      loading: false,
      showPicture: false,
      imageData:{
        imageUrl:''
      },
      form:{
        renewedDuration: 3,
        leaseEndTime: new Date().getTime()
      }
    }
  },
  methods:{
    beforePickerOptions2,
    changeLeaseTime($event){
      // console.log('$event',$event)
      // let time = this.data.leaseEndTime? new Date(parseInt(this.data.leaseEndTime)): new Date()
      // // this.form.leaseEndTime = time.getTime() + 3600 * 1000 * 24 * 30 * $event
      // this.form.leaseEndTime = dateUtil.addTimeFormat($event, 'M', time).valueOf()

      let time = new Date()
      this.form.leaseEndTime = time.getTime() + 3600 * 1000 * 24 * 30 * $event
    },
    showImage:function(path){
      this.imageData = { imageUrl: path };
      this.showPicture = true;
    },
    handleSubmit(){
      let self = this
      self.loading = true
      // console.log('aa',self.data)
      let params = {}
      params.householdId = self.data.householdId 
      params.leaseType = self.form.renewedDuration.toString()
      params.leaseEndTime = self.data.leaseEndTime
      params.cardNo = self.data.cardNo 
      params.cardDetailId = self.data.cardDetailId 
      params.nodeId = self.data.roomNodeId 
      params.householdName = self.data.householdName 
      params.communityId = self.data.communityId
      params.householdUuid = self.data.householdUuid
      params.nodeUuid = self.data.nodeUuid
      params.renewedDetailTime = self.form.leaseEndTime

      renewedHousehold(params).then(function (response) {
        if(response.data && response.data.status===0){
          self.$message({
            message: response.data.message,
            type: 'success'
          });

          self.$emit('submitSuccess',params.renewedDetailTime)
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false
      })
    }
  },
  created(){
    console.log(this.data);
    this.form.leaseEndTime = this.data.leaseEndTime
    this.changeLeaseTime(3)
  }
}
</script>

<style scoped>
  .container{
    line-height: 30px;
    padding: 0 40px;
  }
  .container>div{
    margin-bottom: 20px;
  }
  .item-pic{ 
    cursor: pointer;
    overflow: hidden;
  }
  .item-pic>div{
    text-align: center;
  }
  .item-pic img{
    object-fit: cover;
    object-position: 50% 50%;
    height: 168px;
  }
  .item-pic p{
    font-size: 14px;
    color: #5DA8FF; 
    text-decoration: underline;
  }
  .room-name{
    font-weight: 900;
    font-size: 18px;
  }
  .renewed-time /deep/ .el-form-item__label{
    /* line-height: 36px; */
  }
  .valid-time  /deep/ .el-form-item__label{
    /* line-height: 36px; */
  }
  .jdform-info-show /deep/ .el-form-item__content{
    /* padding-top: 12px !important; */
  }
</style>
<style>
  .form-info-show .el-form-item{
    margin-bottom: 0;
  }
  .jdform-info-show .el-form-item__content{
    margin-top: 0px;
    margin-left:0px !important;
  }
  .jdform-info-show .picture{
    margin-top:20px;
  }
  .jdform-info-show .pic-vertical p{
    margin:0px;
  }
</style>


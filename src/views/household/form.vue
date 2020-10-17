<template>
  <div>
    <div class="topBar" v-loading="loading">
      <label class="el-icon-arrow-left" @click="$router.back()">返回</label>
      <div>新增住户</div>
      <span>{{roomData.fullNodeName}}</span>
    </div>

    <div class="padding-content" v-if="!loading" v-loading="btnLoading">
      <el-form ref="form" inline :model="form" :rules="rules" label-width="120px">
        <!-- <el-row>
          <el-col :span="24">
            <return-report class="module module-new" ref="returnReport">
              <div class="module-title" slot="header">
                <mallki className="mallki-text" text="返程登记"></mallki>
              </div>
            </return-report>
          </el-col>
        </el-row> -->
        <identity-info class="module" ref="identityInfo"
        @getMaritalStatus="setMaritalStatus"
        :communityId="community.communityId"
        :isIdcard="roomData.isIdcard">
          <div class="module-title" slot="header">
            <mallki className="mallki-text" text="个人信息"></mallki>
          </div>
          <el-row slot="img">
            <el-col :span="10">
              <el-form-item label="身份证人像面">
                <div>
                  <div class="img-box front">
                    <span class="close" @click="form.certificateFrontUrl=''" v-show="form.certificateFrontUrl">
                      <span class="el-icon-delete" circle></span>
                    </span>
                    <img :src="form.certificateFrontUrl" v-show="form.certificateFrontUrl">
                  </div>
                  <span class="btn-row">
                    <camera-btn 
                    showType='1'
                    openBtnText="拍摄正面" 
                    submitBtnText="确认上传" 
                    @path="form.certificateFrontUrl = $event"/>
                    <upload-btn 
                    @path="form.certificateFrontUrl = $event" showUploadType="1"/>
                  </span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <!-- <el-form-item label="身份证国徽面">
                <div>
                  <div class="img-box background">
                    <span class="close" @click="form.idImg2Base64=''" v-show="form.idImg2Base64">
                      <span class="el-icon-delete" circle></span>
                    </span>
                    <img :src="form.idImg2Base64" v-show="form.idImg2Base64">
                  </div>
                  <span class="btn-row">
                    <camera-btn 
                    showType='1'
                    openBtnText="拍摄反面" 
                    submitBtnText="确认上传" 
                    @path="form.idImg2Base64 = $event"/>
                    <upload-btn 
                    @path="form.idImg2Base64 = $event" showUploadType="1"/>
                  </span>
                </div>
              </el-form-item> -->
            </el-col>
          </el-row>
        </identity-info>

        <!-- <div class="module">
          <div class="module-title">
            <mallki className="mallki-text" text="身份证照片"></mallki>
          </div>
          <el-row class="certificate-img-row">
            <el-col :span="12">
              <div class="certificate-img-box">
                <div class="img-box">
                  <span class="close" @click="form.certificateFrontUrl=''" v-show="form.certificateFrontUrl">
                    <span class="el-icon-delete" circle></span>
                  </span>
                  <img :src="form.certificateFrontUrl" v-show="form.certificateFrontUrl">
                </div>
                <span class="btn-row">
                  <camera-btn 
                  openBtnText="拍摄正面" 
                  submitBtnText="确认上传" 
                  @path="form.certificateFrontUrl = $event"/>
                  <upload-btn 
                  @path="form.certificateFrontUrl = $event"/>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="certificate-img-box">
                <div class="img-box">
                  <span class="close" @click="form.idImg2Base64=''" v-show="form.idImg2Base64">
                    <span class="el-icon-delete" circle></span>
                  </span>
                  <img :src="form.idImg2Base64" v-show="form.idImg2Base64">
                </div>
                <span class="btn-row">
                  <camera-btn 
                  openBtnText="拍摄反面" 
                  submitBtnText="确认上传" 
                  @path="form.idImg2Base64 = $event"/>
                  <upload-btn 
                  @path="form.idImg2Base64 = $event"/>
                </span>
              </div>
            </el-col>
          </el-row>
        </div> -->

        <el-row>
          <el-col :span="16">
            <account-info class="module height" ref="accountInfo" :householdName="householdName" @changeHouseholdRole="form.householdRole=$event">
              <div class="module-title">
                <mallki className="mallki-text" text="帐号信息"></mallki>
              </div>
            </account-info>
          </el-col>
          <el-col :span="7" :offset="1">
            <upload-face-img class="module height" ref="face">
              <div class="module-title">
                <mallki className="mallki-text" text="上传人脸"></mallki>
              </div>
            </upload-face-img>
          </el-col>
        </el-row>

        <div class="module">
          <div class="module-title">
            <mallki className="mallki-text" text="录入门卡"></mallki>
            
            <span class="ctr-btn" @click="showIdInfo=!showIdInfo">
              {{showIdInfo?'收起':'展开'}} <i :class="showIdInfo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </span>
          </div>
          <el-collapse-transition>
          <div v-show="showIdInfo">
            <el-form ref="cardForm" :model="form.cardList[0]" inline label-width="120px">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="卡类型">
                    <el-select v-model="form.cardList[0].cardClass" filterable placeholder="请选择卡类型">
                      <el-option value="1" label="IC卡"/>
                      <el-option value="2" label="身份证"/>
                      <el-option value="3" label="ID卡"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="cardNo" label="门卡号码" v-if="form.cardList[0].cardClass=='1'" :rules="cardRules.cardNo">
                    <el-input v-model="form.cardList[0].cardNo" auto-complete="new-password" clearable placeholder="请输入卡号" maxlength="8" :type="pswVisibility?'type':'password'">
                      <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
                  </el-form-item>
                  <el-form-item prop="cardNo" label="门卡号码" v-else-if="form.cardList[0].cardClass=='2'" :rules="cardRules.cardNo2">
                    <el-input v-model="form.cardList[0].cardNo" auto-complete="new-password" clearable placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
                      <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
                  </el-form-item>
                  <el-form-item prop="cardNo" label="门卡号码" v-else-if="form.cardList[0].cardClass=='3'" :rules="cardRules.cardNo3">
                    <el-input v-model="form.cardList[0].cardNo" auto-complete="new-password" clearable placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
                      <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
                  </el-form-item>
                  <el-checkbox 
                  v-model="form.cardList[0].specialCard" 
                  true-label="1"
                  false-label="0">
                  特殊卡
                  </el-checkbox>
                </el-col>
              </el-row>
            </el-form>
          </div>
          </el-collapse-transition>
        </div>

        <other-info class="module module-other" 
        ref="otherInfo" 
        :isInfo="roomData.isInfo"
        :householdRole="form.householdRole"
        v-show="false">
          <div class="module-title">
            <mallki className="mallki-text" text="其他信息"></mallki>
          </div>
        </other-info>

        <div class="btn-group">
          <el-button @click="$router.back()">取消</el-button>
          <el-button @click="submitAndBack()" type="primary" :loading="btnLoading">确认</el-button>
          <el-button @click="submitAndNext()" type="warning">确认并添加下一位</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import returnReport from "./components/returnReport";
import passRecord from "./components/passRecord";
import identityInfo from "./components/identity";
import accountInfo from "./components/account";
import uploadFaceImg from "./components/face";
import cameraBtn from "@/components/camera/";
import uploadBtn from "@/components/uploadImage";
import otherInfo from "./components/other";
import { validateHexadecimal } from "@/utils/rules";
import {loadNode} from "@/api/roomv1";
import {mapGetters} from 'vuex'
import dateUtil from "@/utils/times";
// import { addHousehold, getHouseholdName, addReturnReport} from "@/api/household";
import { addHousehold} from "@/api/householdv1";

export default {
  components:{
    returnReport,
    passRecord,
    identityInfo,
    accountInfo,
    uploadFaceImg,
    otherInfo,
    cameraBtn,
    uploadBtn
  },
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  data(){
    return {
      addHousehold:{},
      loading:true,
      btnLoading:false,
      showIdInfo: true,
      roomData:{},
      householdName: '',
      pswVisibility:false,
      form:{
        householdRole:'2',
        certificateFrontUrl:'',
        idImg2Base64:'',
        householdName:'',
        cardList:[
          {
            cardClass: '1',
            cardNo:'',
            specialCard:'0'
          }
        ],
        faceList:[
          {
            imageUrl: ''
          }
        ],
      },
      rules:{

      },
      cardRules:{
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: '请输入正确的门禁卡卡号', validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ],
        cardNo3: [
          {required: true, message: '请填写门禁卡号', trigger: 'blur'},
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal},
          { min: 8, max: 16, message: '请填入正确的长度为8-16的卡号' }
        ]
      },
    }
  },
  watch: {
    'form.householdRole':function(val){
      this.showIdInfo = val == '3'?false:true
    }
  },
  methods:{
    loadNode(){
      let self = this;
      self.loading = true
      loadNode({
        ...self.community,
        nodeId: self.addHousehold.roomNodeId,
        nodeUuid: self.addHousehold.nodeUuid
      }).then(function(response) {
        if (response.data && response.data.status==0) {
          self.roomData = response.data.content
          self.loading = false
        }
      }).catch(function(a) {
        console.error(a);
      })
    },
    setMaritalStatus(value) {
      // 若未到达法定结婚年龄，则显示未婚
      if(value=='0'){
        this.$refs.otherInfo.form.maritalStatus = '1' 
      }
    },
    processingFormValue: function (formData) {
      return new Promise((resolve,reject) => {
        
        try {

          if (formData.countriesAndRegionsType === '1') { //如果是大陆居民
          
            let IDbirth = formData.citizenId.slice(6,14)
            let brith = formData.birthDate.replace(/-/g, '')
            if(IDbirth != brith){reject('出生日期与身份证不一致');return;}

            formData.certificateNo = formData.citizenId; //证件号码 = 身份证号码
            formData.nationality = 'CN'; //国籍 中国
            formData.certificateType = '1'; //证件类型为身份证
          }else{
            formData.householdName = formData.householdFirstName + formData.householdLastName
            formData.citizenId = formData.certificateNo
          }

          // 中共党员，otherInfo
          if(formData.politicalStatus=='1'){
            formData[formData.memberType] = "1"
          }
          if (formData.householdRole=='3') {
            formData.leaseStartTime = new Date().getTime()
          }else{
            formData.leaseStartTime = '';
            formData.leaseEndTime = '';
          }
          // if (formData.validStartTime) {
          //   formData.validStartTime = dateUtil.toServerDateString(formData.validStartTime) || '';
          // }
          // if (formData.validEndTime) {
          //   formData.validEndTime = dateUtil.byPattern(formData.validEndTime, "YYYYMMDD235959999") || '';
          // }else{
          //   formData.validEndTime = '';
          // }
          if (formData.birthDate) {
            formData.birthDate = dateUtil.toServerDateString(new Date(formData.birthDate));
          }
          if (formData.certificateFrontUrl) {
            formData.certificateFrontUrl = formData.certificateFrontUrl.split(',')[1]
          }
          if (formData.idImg2Base64) {
            formData.idImg2Base64 = formData.idImg2Base64.split(',')[1]
          }
          if (formData.idImg3Base64) {
            formData.idImg3Base64 = formData.idImg3Base64.split(',')[1]
          }
          resolve(formData);
          
        } catch (error) {
          reject(error)
        }
      })
    },
    handleSubmit(cb){
      this.btnLoading = true
      this.$refs.cardForm.validate(valid=>{   
        if(valid && this.$refs.identityInfo.handleValid() && this.$refs.accountInfo.handleValid() && this.$refs.otherInfo.handleValid()){
          let self = this
          this.form.faceList[0].imageUrl = this.$refs.face.key
          this.form.faceList[0].faceData = '111'
          let formData = {
            ...this.form,
            ...this.$refs.identityInfo.form,
            ...this.$refs.accountInfo.form,
            ...this.$refs.otherInfo.form,
            
            roomNodeId: this.addHousehold.roomNodeId,
            communityId: this.addHousehold.communityId,
            nodeUuid: this.addHousehold.nodeUuid,
          }       
          self.processingFormValue(formData).then((data)=>{
            addHousehold(data).then(function (response) {
              if(response.data && response.data.status==0){
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
                // console.log('res',response.data.data)    
                cb && cb(response.data.data)         
              }else{
                self.btnLoading = false
              }
            }).catch(function (a) {
              console.error(a)
            }).finally(_=>{
              self.btnLoading = false
            })

          }).catch(e=>{
            self.btnLoading = false
            self.$message({
              message: e,
              type: 'error'
            })
          })
        }else{
          this.btnLoading = false
        }
      })
    },
    submitAndBack(){
      this.handleSubmit(data => {
        this.$router.back()
      })
    },
    submitAndNext(){
      this.handleSubmit(data => {
        // console.log(this.$refs);
        //重置表单

        this.$refs.identityInfo.form.householdName='',
        this.$refs.identityInfo.form.checkedValidEnd= false,
        this.$refs.identityInfo.form.countriesAndRegionsType='1',
        this.$refs.identityInfo.form.validStartTime='',
        this.$refs.identityInfo.form.validEndTime='',
        this.$refs.identityInfo.form.gender='',
        this.$refs.identityInfo.form.residentialAddress='',
        this.$refs.identityInfo.form.ethnicity='',
        this.$refs.identityInfo.form.authority='',
        this.$refs.identityInfo.form.birthDate='',
        this.$refs.identityInfo.form.citizenId='',
        this.$refs.identityInfo.form.nationality='',
        this.$refs.identityInfo.form.householdFirstName='',
        this.$refs.identityInfo.form.householdLastName='',
        this.$refs.identityInfo.form.certificateType='',
        this.$refs.identityInfo.form.certificateNo='',
        this.$refs.identityInfo.form.idImg3Base64= '',
        this.$refs.identityInfo.form.rfidCode=''

        this.$refs.accountInfo.form.householdRole='1'
        this.$refs.accountInfo.form.certificateFrontUrl=''
        this.$refs.accountInfo.form.idImg2Base64=''
        this.$refs.accountInfo.form.phoneNumber = ''
        this.$refs.accountInfo.form.relationship = ''
        this.$refs.accountInfo.form.leaseType = ''
        this.$refs.accountInfo.form.leaseEndTime = ''
        this.$refs.accountInfo.form.cardList=[
          {
            cardClass: '1',
            cardNo:'',
            specialCard:'0'
          }
        ]

        this.$refs.form.model.householdRole='1'
        this.$refs.form.model.certificateFrontUrl=''
        this.$refs.form.model.idImg2Base64=''
        this.$refs.form.model.cardList=[
          {
            cardClass: '1',
            cardNo:'',
            specialCard:'0'
          }
        ]

        this.$refs.otherInfo.form.maritalStatus = ''
        this.$refs.otherInfo.form.politicalStatus = ''
        this.$refs.otherInfo.form.memberType = 'isDirectParty'
        this.$refs.otherInfo.form.educationLevel = ''
        this.$refs.otherInfo.form.personalStatus = ''
        this.$refs.otherInfo.form.professionCode = ''
        this.$refs.otherInfo.form.profession = ''
        this.$refs.otherInfo.form.stayReason = ''
        this.$refs.otherInfo.form.residenceType = ''
        this.$refs.otherInfo.form.unitNature = ''
        this.$refs.otherInfo.form.caringStaffType = ''

        this.$refs.otherInfo.form.companyName = ''
        this.$refs.otherInfo.form.residencePermitDate = ''
        this.$refs.otherInfo.form.residencePermitEnd = ''
        this.$refs.otherInfo.form.isFirstResidencePermit = '0'
        this.$refs.otherInfo.form.religion = ''

        this.$refs.face.imgBase64=''
        this.$refs.face.faceUrl=''
        this.$refs.face.faceList=[
          {
            imageUrl:''
          }
        ]

        if(this.roomData.maxHousehold <= data.currentHousehold){
          this.$message.error('房间人数已达设置上限！')
          this.$router.back()
        }else {
          this.$emit('reloadMain')
        }
      })
    }
  },
  mounted(){
    // console.log('data',this.$route.query)
    this.addHousehold = JSON.parse(localStorage.getItem('addHousehold'))
    console.log(this.addHousehold,'addHousehold');
    this.loadNode()   
  }
}
</script>

<style lang="scss" scoped>
  .module-new{
    height: 180px;
  }
  .module{
    background-color: #fff;
  }
  .topBar{
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background-color: #fff;
    font-size: 14px;
  }
  .topBar>label{
    color: #007ee4;
    cursor: pointer;
  }
  .topBar>div{
    font-size: 16px;
    color: #000;
    display: inline-block;
    font-weight: 900;
    margin: 0 15px;
  }
  .topBar>span{
    color: rgba(136,136,136,1);
  }
  .height{
    min-height: 220px;
  }
  .btn-group{
    height: 80px;
    line-height: 80px;
    text-align: right;
  }
  .certificate-img-box{
    width: 300px;
    margin: 0 auto;
  }
  .img-box{
    background-color: #F4F4F4;
    border: 1px solid #d7d7d7; 
    width: 240px;
    height: 150px;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 25%;
    display: inline-block;
    position: relative;
  }
  .background{
    background-image: url(../../assets/image/background.png);
  }
  .front{
    background-image: url(../../assets/image/front.png);
  }
  .img-box img{
    width: 100%;
    height: 100%;
    max-height: 180px;
    object-position: 50% 50%;
    object-fit: scale-down;
    cursor: pointer;
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
  .close:hover{
    background-color: rgba(0, 0, 0, 0.3);
  }
  .btn-row{
    width: 240px;
    display: flex;
    justify-content: space-between;
  }
  .ctr-btn{
    position: relative;
    top: 3px;
  }
   .padding-content /deep/.el-form-item--medium .el-form-item__label{
    padding-top: 10px;
  }


</style>

<template>
  <section style="padding:0 20px">
    <el-steps :active="activeIndex" simple class="steps">
      <el-step title="基础信息">
        <i slot="icon" class="iconfont icon-xiazai43"></i>
      </el-step>
      <el-step title="授权设置">
        <i slot="icon" class="iconfont icon-Id"></i>
      </el-step>
      <el-step title="结果查看">
        <i slot="icon" class="iconfont icon-xiaolianmanyifuwu"></i>
      </el-step>
    </el-steps>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" inline label-width="120px">
        <div v-show="activeIndex==0">
          <room-info class="module" ref="roomInfo"
            :communityId="community.communityId"
            :assignNode="assignNode"
            :isIdcard.sync="isIdcard">
            <div class="module-title">房间信息</div>
          </room-info>

          <identity-info class="module" ref="identityInfo"
            @showCityRegister="showCityRegister"
            @getMaritalStatus="setMaritalStatus"
            @toggleHouseholdName="showHouseholdName=$event"
            :formHouseholdName.sync="form.householdName"
            :communityId="community.communityId"
            :assignNode="node"
            :isIdcard="isIdcard">
            <div class="module-title">身份证信息</div>
          </identity-info>

          <div class="module">
            <div class="module-title">基本信息</div>
            <el-row>
              <el-col :span="10">
                <el-form-item label="住户类型" prop="householdRole">
                  <el-select v-model="form.householdRole" filterable>
                    <el-option :value="1" label="产权人"/>
                    <el-option :value="2" label="家庭成员"/>
                    <el-option :value="3" label="承租人"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item label="姓名" prop="householdName" v-if="showHouseholdName">
                  <el-input v-model.trim="form.householdName" placeholder="请输入" clearable :maxlength="15"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="电话号码" prop="phoneNumber">
                  <el-input v-model="form.phoneNumber" placeholder="请输入" clearable type="tel" :maxlength="11"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <other-info class="module" ref="otherInfo"
            :householdRole="form.householdRole">
            <div class="module-title">其他信息</div>
          </other-info>

          <div class="module" v-if="showRegisterModule">
            <div class="module-title">居住证信息</div>
            <el-row>
              <el-col :span="10">
                <el-form-item label="是否已办理">
                  <el-radio-group v-model="form.isFirstResidencePermit">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="14" v-if="form.isFirstResidencePermit=='1'">
                <el-form-item label="居住证有效期限" prop="residencePermitTime">
                  <el-date-picker
                    v-model="form.residencePermitTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="到"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                    :default-time="['00:00:00','23:59:59']"
                    value-format="yyyyMMddHHmmssSSS">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div v-show="activeIndex==1">
          <div class="module" v-if="form.householdRole==3">
            <div class="module-title">租客有效期设置</div>
            <div>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="租客有效期">
                    <el-radio-group v-model="LeaseTime" @change="changeLeaseTime($event)">
                        <el-radio :label="3">3个月</el-radio>
                        <el-radio :label="6">6个月</el-radio>
                        <el-radio :label="12">12个月</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="有效期至">
                    <el-date-picker
                      v-model="form.leaseEndTime" type="date"
                      :picker-options="beforePickerOptions2()"
                      format="yyyy-MM-dd"
                      value-format="yyyyMMdd235959999">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="module">
            <div class="module-title">授权门卡</div>
            <div>
              <el-form ref="cardForm" :model="form.cardList[0]" inline label-width="120px">
                <el-form-item label="门禁卡发卡">
                  <el-select v-model="form.cardClass" filterable placeholder="请选择卡类型">
                    <el-option value="1" label="IC卡"/>
                    <el-option value="2" label="身份证"/>
                    <el-option value="3" label="ID卡"/>
                  </el-select>
                </el-form-item>
                <el-form-item prop="cardNo" :rules="cardRules.cardNo" v-if="form.cardClass!=='2'">
                  <el-input v-model="form.cardList[0].cardNo" clearable placeholder="请输入卡号" maxlength="8" :type="pswVisibility?'type':'password'">
                    <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                  </el-input>
                  <div class="tips">卡号：{{form.cardList[0].cardNo}}</div>
                </el-form-item>
                <el-form-item prop="cardNo" v-else-if="form.cardClass==='2'" :rules="cardRules.cardNo2">
                  <el-input v-model="form.cardList[0].cardNo" clearable placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
                    <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                  </el-input>
                  <div class="tips">卡号：{{form.cardList[0].cardNo}}</div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

        <div v-show="activeIndex==2">
          <div class="step-success">
            <img src="../../../assets/image/success.png"/>
            <p>添加成功</p>
          </div>
        </div>
      </el-form>
    </div>
    <div class="form-dialog-control-area">
      <el-button type="primary" @click="handleNext()"  v-if="activeIndex==0">下一步</el-button>
      <el-button type="primary" @click="activeIndex--" v-if="activeIndex==1">上一步</el-button>
      <el-button type="primary" @click="handleSubmit()"  v-if="activeIndex==1" :loading="loading">提交</el-button>
      <el-button                @click="handleClose()" v-if="activeIndex==2">知道了</el-button>
      <el-button type="primary" @click="resetForm()" v-if="activeIndex==2">继续添加</el-button>
    </div>
  </section>
</template>

<script>
import roomInfo from "./components/roomInfo";
import identityInfo from "./components/identityInfo";
import otherInfo from "./components/otherInfo";
import {beforePickerOptions2} from "@/utils/validate";
import {mapGetters} from 'vuex'
import dateUtil from "@/utils/times";
import { validateHexadecimal, validateMobile } from "@/utils/rules";
import { addHousehold } from "@/api/household";
export default {
  props:['assignNode'],
  components:{
    roomInfo,
    identityInfo,
    otherInfo
  },
  computed:{
    ...mapGetters([
      'community',
      'node'
    ])
  },
  data(){
    return {
      activeIndex:0,
      loading:false,
      showRegisterModule:false,
      pswVisibility: false,
      showHouseholdName:true,
      isIdcard:'1',
      LeaseTime:null,
      householdId:'',
      form:{
        householdRole:'',
        householdName:'',
        phoneNumber:'',
        cardClass:'1',
        leaseEndTime: dateUtil.byPattern(new Date(),"YYYYMMDD235959999"),
        cardList:[
          {
            roomId:null,
            cardNo:'',
          }
        ],
        isFirstResidencePermit:'',
        residencePermitTime:[]
      },
      rules:{
        phoneNumber: [
          { min: 11, max: 11, message: '请填入正确的长度为11的联系方式' }
        ],
        householdRole: [
          { required: true, message: "请选择住户类型", trigger: "change" }
        ],
        leaseEndTime: [
          {required: true, message: '请选择租客有效期', trigger: 'blur'}
        ],
        householdName: [
          { required: true, message: "请填写人员姓名", trigger: "blur" }
        ]
      },
      cardRules:{
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: '请输入正确的门禁卡卡号', validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ]
      },
    }
  },
  methods:{
    beforePickerOptions2,
    changeLeaseTime($event){
      let time = new Date()
      time.setTime(time.getTime() + 3600 * 1000 * 24 * 30 * $event)
      this.form.leaseEndTime = dateUtil.byPattern(time,"YYYYMMDD235959999")
    },
    handleClose: function () {
      this.$parent.$parent.handleClose();
    },
    resetForm: function(){
      this.$refs.form.resetFields();
      this.$refs.identityInfo.$refs.form.resetFields();
      this.$refs.otherInfo.$refs.form.resetFields();
      this.$refs.cardForm.resetFields();
      this.showRegisterModule = false
      this.activeIndex = 0
    },
    handleNext: function(){
      this.$refs.form.validate(valid=>{
        let v = valid && this.$refs.roomInfo.handleValid() && this.$refs.identityInfo.handleValid()
        // if(v){
        v && this.activeIndex++
        // }
      })
    },
    showCityRegister(value){
      this.showRegisterModule = value==0? true : false
    },
    setMaritalStatus(value) {
      // 若未到达法定结婚年龄，则显示未婚
      this.$refs.otherInfo.form.maritalStatus = value==0? '1' : ''
    },
    handleSubmit(){
      let self = this
      self.loading = true
      self.$refs.cardForm.validate(valid=>{
        if(valid){
          let formData = {
            ...self.$refs.roomInfo.form,
            ...self.$refs.identityInfo.form,
            ...self.$refs.otherInfo.form,
            ...self.form,
          }
          formData.communityId = this.community.communityId
          // formData.propertyId = this.community.propertyId
          
          self.processingFormValue(formData).then((data)=>{

            addHousehold(data).then(function (response) {
              if(response.data && response.data.code==1){
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.activeIndex = 2;
                self.householdId = response.data.data.householdId
              }else{
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }
            }).catch(function (a) {
              console.error(a)
            }).finally(_=>{
              self.loading = false
            })

          }).catch(e=>{
            self.$message({
              message: e,
              type: 'error'
            })
          })
        }else{
          self.loading = false
        }
      })
    },
    processingFormValue: function (formData) {
      return new Promise((resolve,reject) => {
        try {

          if (formData.countriesAndRegionsType === '1') { //如果是大陆居民
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
          if (formData.householdRole==3) {
            formData.leaseStartTime = dateUtil.byPattern(new Date(), "YYYYMMDD000000000");
          }else{
            formData.leaseStartTime = '';
            formData.leaseEndTime = '';
          }
          if (formData.validStartTime) {
            formData.validStartTime = dateUtil.toServerDateString(formData.validStartTime) || '';
          }
          if (formData.validEndTime) {
            formData.validEndTime = dateUtil.byPattern(formData.validEndTime, "YYYYMMDD235959999") || '';
          }
          if (formData.birthDate) {
            formData.birthDate = dateUtil.toServerDateString(new Date(formData.birthDate));
          }
          if(formData.residencePermitTime.length>0){
            formData.residencePermitDate = formData.residencePermitTime[0];
            formData.residencePermitEnd = formData.residencePermitTime[1];
          }

          resolve(formData);
          
        } catch (error) {
          reject(error)
        }
      })
    },
  }
}
</script>
<style scoped>
  .tips{
    color: #999999;
    font-size: 12px;
  }
  .steps .iconfont{
    cursor: default;
    font-size: 26px;
  }
</style>

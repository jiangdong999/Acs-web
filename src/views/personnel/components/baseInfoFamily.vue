<template>
  <section>
    <div>
      <el-form ref="form" inline :rules="dynamicRules" :model="form" label-width="120px">
        <div v-loading="loading">
          <div class="form-title-caption">
              <p>基础信息</p>
          </div>
          <!-- <el-form-item label="住户类型" prop="householdRole" v-if="form.householdRole!=''">
              <el-select v-model="form.householdRole" filterable disabled>
                <el-option :value="1" label="业主"/>
                <el-option :value="2" label="家庭成员"/>
                <el-option :value="3" label="承租人"/>
              </el-select>
          </el-form-item>
          <br> -->
          <el-form-item label="电话号码" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入" clearable type="tel" :maxlength="11"/>
          </el-form-item>
          <br>
          <el-form-item label="国家（地区）" prop="countriesAndRegionsType">
            <el-radio-group v-model="form.countriesAndRegionsType" @change="countryChange">
              <el-radio label="1">中国大陆</el-radio>
              <el-radio label="2">港、澳、台地区</el-radio>
              <el-radio label="3">外籍</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        <svg-icon iconClass="icon_arrow-up-double" class="icon-reverse"/>其他信息
                    </template>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="婚姻状况">
                            <el-select v-model="form.maritalStatus" filterable placeholder="请选择" clearable>
                                <el-option
                                v-for="item in maritalStatusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="文化程度" prop="distributions">
                                <el-select v-model="form.educationLevel" filterable placeholder="请选择" clearable>
                                    <el-option
                                    v-for="item in educationOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="政治面貌" prop="politicalStatus">
                            <el-select v-model="form.politicalStatus" filterable placeholder="请选择" clearable>
                                <el-option
                                v-for="item in politicalOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-if="form.politicalStatus==1" v-model="memberType" class="mini-input" filterable placeholder="请选择">
                                <el-option label="小区直管党员" value="isDirectParty"></el-option>
                                <el-option label="党员双报到" value="partyDoubleReport"></el-option>
                            </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="与户主关系">
                                <el-select v-model="form.relationship" filterable placeholder="请选择" clearable>
                                    <el-option
                                    v-for="item in relationshipOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="兵役状态" prop="militaryServiceStatus">
                                <el-select v-model="form.militaryServiceStatus" filterable placeholder="请选择" clearable>
                                    <el-option
                                    v-for="item in militaryOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                    <el-row v-if="form.householdRole=='3'">
                    <el-col :span="12">
                        <el-form-item label="入住事由" v-if="form.householdRole=='3'">
                            <el-select v-model="form.stayReason" filterable placeholder="请选择" clearable>
                                <el-option
                                v-for="item in stayReasonOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="居住方式" v-if="form.householdRole=='3'">
                            <el-select v-model="form.residenceType" filterable placeholder="请选择" clearable>
                            <el-option
                            v-for="item in residenceTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="特殊人群类型">
                            <el-select v-model="form.caringStaffType" filterable placeholder="请选择" clearable>
                                <el-option
                                v-for="item in caringStaffTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工作状态">
                                <el-select v-model="form.personalStatus" filterable placeholder="请选择" clearable>
                                    <el-option
                                    v-for="item in personalStatusOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="form.personalStatus=='2'">
                            <el-form-item label="职业" prop="professionCode">
                                <el-select v-model="form.professionCode" filterable placeholder="请选择" clearable>
                                    <el-option
                                    v-for="item in professionCodeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-input v-if="form.professionCode==='0'" v-model="form.profession" class="mini-input profession" filterable placeholder="请输入职业"></el-input>
                        </el-col>
                        <el-col :span="12" v-if="form.personalStatus=='4'">
                            <el-form-item label="学校名称" prop="companyName">
                            <el-input v-model="form.companyName" filterable placeholder="请输入学校名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="form.personalStatus=='2'">
                        <el-col :span="12">
                            <el-form-item label="单位性质" prop="unitNature">
                                <el-select v-model="form.unitNature" filterable clearable>
                                    <el-option
                                    v-for="item in unitNatureOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单位名称" prop="companyName">
                                <el-input v-model="form.companyName" placeholder="请输入" clearable :maxlength="20"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item label="小区直管党员">
                        <el-radio-group v-model="form.isDirectParty">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div>
                        <el-collapse-transition>
                            <el-form-item label="党员双报到" v-if="form.isDirectParty=='1'">
                            <el-radio-group v-model="form.partyDoubleReport">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                            </el-form-item>
                        </el-collapse-transition>
                    </div> -->
                    <div v-if="form.isCityRegis=='0'">
                        <div class="form-title-caption">
                            <p>办理居住证情况</p>
                        </div>
                        <el-form-item label="是否已办理">
                            <el-radio-group v-model="form.isFirstResidencePermit">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <br>
                        <el-form-item label="办证日期" v-if="form.isFirstResidencePermit=='1'" prop="residencePermitTime">
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
                    </div>
                    <hr class="form-separate-hr"/>
                </el-collapse-item>
          </el-collapse>
          <div>
            <div class="form-title-caption">
                <p>身份信息</p>
            </div>
            <transition name="el-fade-in-linear" mode="out-in">
              <div v-if="form.countriesAndRegionsType=='1'" key="1">
                  <span class="control-left">
                      <el-form-item label="信息录入方式">
                      <el-select v-model="inputMethod">
                          <el-option :value="1" label="读卡录入"/>
                          <el-option :value="2" label="手工录入"/>
                      </el-select>
                      </el-form-item>
                  </span>
                  <span class="control-left" v-show="inputMethod==1">
                      <scanner @getData="getIdScannerData"/>
                  </span>
                  <el-collapse-transition>
                    <div v-show="showIdInfo">
                      <el-row>
                          <el-col :span="10">
                              <el-form-item label="姓名" prop="householdName" width="300">
                                  <el-input v-model="form.householdName" placeholder="请输入" clearable :maxlength="15"/>
                              </el-form-item> 
                          </el-col>
                          <el-col :span="14" style="line-height:36px">
                              <el-form-item label="证件有效期限" label-width="120px" prop="validStartTime">
                                  <el-date-picker style="width:160px"
                                                  v-model="form.validStartTime" type="date"
                                                  :picker-options="beforePickerOptions3(form.validEndTime)"
                                                  >
                                  </el-date-picker>
                              </el-form-item>
                              至&emsp;
                              <el-form-item prop="validEndTime" v-if="!form.checkedValidEnd">
                                  <el-date-picker style="width:160px"
                                                  v-model="form.validEndTime" type="date"
                                                  :picker-options="afterPickerOptions2(form.validStartTime)"
                                                  >
                                  </el-date-picker>
                              </el-form-item>
                              <el-checkbox v-model="form.checkedValidEnd">长期</el-checkbox>
                          </el-col>
                      </el-row>
                      <el-row>
                          <el-col :span="10">
                              <el-form-item label="性别" prop="gender">
                              <el-radio-group v-model="form.gender">
                                  <el-radio label="m">男</el-radio>
                                  <el-radio label="f">女</el-radio>
                              </el-radio-group>
                              </el-form-item>
                          </el-col>
                          <el-col :span="14">
                              <el-form-item label="户籍地址" label-width="120px" prop="residentialAddress">
                              <el-input v-model="form.residentialAddress" @change="parseCitizenCard" :maxlength="50" clearable placeholder="请输入"/>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row>
                          <el-col :span="10">
                              <el-form-item label="民族" prop="ethnicity">
                                  <el-select v-model="form.ethnicity" filterable clearable placeholder="请选择">
                                      <el-option
                                      v-for="item in ethnicity"
                                      :key="item.id"
                                      :label="item.name"
                                      :value="item.name">
                                      </el-option>
                                  </el-select>
                              </el-form-item>
                          </el-col>
                          <el-col :span="14">
                              <el-form-item label="签证机关" label-width="120px" prop="authority">
                                  <el-input v-model="form.authority" :maxlength="20" placeholder="请输入" clearable/>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row>
                          <el-col :span="10">
                              <el-form-item label="出生日期" prop="birthDate">
                              <el-input v-model="form.birthDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
                              </el-form-item>
                          </el-col>
                          <el-col :span="14">
                              <el-form-item label="证件号码" prop="citizenId">
                              <el-input v-model="form.citizenId" ref="citizenId" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
                              </el-form-item>
                          </el-col>
                      </el-row>
                    </div>
                  </el-collapse-transition>
              </div>
              <div v-else key="2">
                <el-form-item label="国家（地区）" label-width="120px" prop="nationality">
                    <el-select style="width: 260px" v-model="form.nationality" filterable clearable placeholder="请选择">
                      <el-option
                          v-for="item in countryOptions"
                          :key="item.code"
                          :label="item.cn"
                          :value="item.code">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col :span="10">
                    <el-form-item label="英文名" prop="householdFirstName">
                        <el-input v-model="form.householdFirstName" clearable placeholder="请输入"/>
                    </el-form-item>
                    </el-col>
                    <el-col :span="10">
                    <el-form-item label="英文姓" prop="householdLastName">
                        <el-input v-model="form.householdLastName" clearable placeholder="请输入"/>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                    <el-form-item label="证件类型" label-width="120px" prop="certificateType">
                        <el-select v-model="form.certificateType" filterable placeholder="请选择">
                        <el-option
                            v-for="item in documentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="14">
                    <el-form-item label="证件号码" prop="certificateNo">
                        <el-input v-model="form.certificateNo" clearable :maxlength="18" placeholder="请输入"/>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="form.gender">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    </el-col>
                    <el-col :span="14" style="line-height:36px">
                        <el-form-item label="证件有效期限" label-width="120px" prop="validStartTime">
                        <el-date-picker style="width:160px"
                                        placeholder="起始日期"
                                        v-model="form.validStartTime" type="date"
                                        :picker-options="beforePickerOptions3(form.validEndTime)"
                                        >
                        </el-date-picker>
                        </el-form-item>
                        至&emsp;
                        <el-form-item prop="validEndTime">
                        <el-date-picker
                                        placeholder="结束日期"
                                        v-model="form.validEndTime" type="date"
                                        :picker-options="afterPickerOptions2(form.validStartTime)"
                                        >
                        </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="出生日期" prop="birthDate">
                    <el-input v-model="form.birthDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
                </el-form-item>
                </div>
            </transition>
          </div>
        </div>
        </el-form>
    </div>

  </section>
</template>
<script>
import { modifyHousehold, detailHousehold, parseCitizenCard } from "@/api/household";
import { validateNumberAndLetter, validateBirthDate, validateCitizenId } from "@/utils/rules";
import industriesOptions from "@/utils/industry";
import {documentOptions, stayReasonOptions, residenceTypeOptions, 
        educationOptions, politicalOptions, militaryOptions, 
        residencePermitPeriodOptions, regisStatusOptions, caringStaffTypeOptions,
        relationshipOptions, personalStatusOptions, professionCodeOptions, unitNatureOptions, maritalStatusOptions} from "@/utils/options";
import ethnicity from "@/utils/ethnicity";
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import dateUtil from "@/utils/times";
import scanner from "@/components/scanner/scanner";
import {mask} from 'vue-the-mask'
import {beforePickerOptions3, afterPickerOptions2} from "@/utils/validate";
import cameraBtn from "@/components/camera";
import uploadBtn from "@/components/uploadImage";

export default {
  components:{
    scanner,
    cameraBtn,
    uploadBtn
  },
  directives: {
    mask
  },
  data() {
    return {
      loading: true,
      inputMethod: 2,
      showIdInfo: true,
      popoverShow: false,
      isIdcard:'1',
      rules: {
        countriesAndRegionsType: [
          { required: true, message: "请选择国家（地区）", trigger: "change" }
        ],
        householdName: [
          { required: true, message: "请填写人员姓名", trigger: "blur" }
        ],
        householdFirstName:[
          { required: true, message: "请填写英文名", trigger: "blur" }
        ],
        householdLastName:[
          { required: true, message: "请填写英文姓", trigger: "blur" }
        ],
        phoneNumber: [
          { min: 11, max: 11, message: '请填入正确的长度为11的联系方式' }
        ],
        citizenId: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId},
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码' }
        ]
      },
      form: {
        checkedValidEnd: false,
        householdType: 1,
        householdRole: null,
        countriesAndRegionsType:'1',
        duty: null,
        communityId:null,
        roomNodeId: null,
        room:'',
        leaseStartTime:'',
        leaseEndTime:'',
        phoneNumber:'',
// 其他信息
        maritalStatus:'',
        industry:'',
        educationLevel:'',
        companyName:'',
        politicalStatus:'',
        companyAddress:'',
        // militaryServiceStatus:'',
        isCityRegis:'',
        isAreaRegis:'',
        stayReason:'',
        isFirstResidencePermit:'',
        residencePermitPeriod:'',
        residencePermitTime:[],
        residencePermitDate:'',
        residenceType:'',
        profession:'',
        regisStatus:'',
        caringStaffType:'',
        relationship:'',
        isDirectParty:'',
        partyDoubleReport:'',
        personalStatus:'',
        unitNature:'',
        professionCode:'',
// 身份信息       
        householdName:'',
        validStartTime:'',
        validEndTime:'',
        gender:'',
        residentialAddress:'',
        ethnicity:'',
        authority:'',
        birthDate:'',
        citizenId:'',

        nationality:'',
        householdFirstName:'',
        householdLastName:'',
        certificateType:'',
        certificateNo:'',
      },
      propertyList: [],
      communityList: [],
      ethnicity: [],
      countryOptions:[],
      documentOptions:[],
      roomOptions: [],
      stayReasonOptions: [],
      industriesOptions:[],
      educationOptions:[],
      politicalOptions:[],
    //   militaryOptions:[],
      residenceTypeOptions:[],
      residencePermitPeriodOptions:[],
      regisStatusOptions:[],
      caringStaffTypeOptions:[],
      relationshipOptions:[],
      personalStatusOptions:[],
      professionCodeOptions,
      unitNatureOptions,
      maritalStatusOptions,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      }
    };
  },
  methods: {
    beforePickerOptions3,
    afterPickerOptions2,
    initOptions: function () {
      this.ethnicity = ethnicity;
      this.countryChina = countryChina;
      this.country = country;
      this.documentOptions = documentOptions;
      this.stayReasonOptions = stayReasonOptions;
      this.industriesOptions = industriesOptions;
      this.educationOptions = educationOptions;
      this.politicalOptions = politicalOptions;
    //   this.militaryOptions = militaryOptions;
      this.residenceTypeOptions = residenceTypeOptions;
      this.residencePermitPeriodOptions = residencePermitPeriodOptions;
      this.regisStatusOptions = regisStatusOptions; 
      this.caringStaffTypeOptions = caringStaffTypeOptions;
      this.relationshipOptions = relationshipOptions;
      this.personalStatusOptions = personalStatusOptions
    },
    parseCitizenCard(){
      // if(this.form.citizenId && this.form.residentialAddress){
      let self = this
      parseCitizenCard({
        "communityId": self.$route.query.communityId, // 小区ID
        "citizenId": self.form.citizenId,   // 身份证号码
        "address": self.form.residentialAddress  // 身份证住址
      }).then(function (response) {
        if(response.data.data && response.data.code==1){
          self.form.gender = response.data.data.gender || self.form.gender
          self.form.isCityRegis = response.data.data.isCityRegister+''
          self.form.isAreaRegis = response.data.data.isAreaRegister+''
          self.form.maritalStatus = response.data.data.maritalStatus==0? '1' : ''
        }
      }).catch(function (a) {
        console.error(a)
      })
      // }
    },
    getIdScannerData: function (data) {
      this.form.householdName = data.name;
      if (data.sex === '男') {
        this.form.gender = 'm';
      } else {
        this.form.gender = 'f';
      }
      //民族
      this.form.ethnicity = data.nation;
      this.form.birthDate = dateUtil.toClientDateFormat(data.birthday)
      this.form.residentialAddress = data.address;
      this.form.citizenId = data.id;
      this.form.validStartTime = dateUtil.toClientDate(data.start);
      if(data.end == '长期'){
        this.form.checkedValidEnd = true
      }else{
        this.form.validEndTime = dateUtil.toClientDate(data.end);
      }
      this.form.authority = data.department;
      this.showIdInfo = true;
    },
    handleSubmit: function () {
      let self = this;
      
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.processingFormValue().then((data) => {
            modifyHousehold(data).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.$router.go(-1)
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }
            }).catch(function (a) {
              console.error(a)
            }).finally(_=>{
              self.loadData()
            })
          });

        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    processingFormValue: function () {
      return new Promise((resolve,reject) => {
        let data = { ...this.form };

        if (this.form.countriesAndRegionsType === '1') { //如果是大陆居民
          data.certificateNo = this.form.citizenId; //证件号码 = 身份证号码
          data.nationality = 'CN'; //国籍 中国
          data.certificateType = '1'; //证件类型为身份证
        }
        if (this.form.validStartTime) {
          data.validStartTime = dateUtil.toServerDateString(this.form.validStartTime);
        }
        if (this.form.validEndTime) {
          data.validEndTime = dateUtil.byPattern(this.form.validEndTime, "YYYYMMDD235959999") || '';
        }
        if (this.form.birthDate) {
          data.birthDate = dateUtil.toServerDateString(new Date(this.form.birthDate));
        }
        if(this.form.residencePermitTime){
            data.residencePermitDate = this.form.residencePermitTime[0];
            data.residencePermitEnd = this.form.residencePermitTime[1];
        }
        data.communityId = this.$route.query.communityId
        resolve(data);
      })
    },
    handleClose: function () {
      this.$parent.$parent.handleClose();
    },
    setPhoto:function(src, key){
      this.form[key] = src;
    },
    loadData(data) {
        let self = this;
        self.loading = true;
        detailHousehold(self.$route.query).then(function (response) {
            if (response && response.data) {
                Object.assign(self.form, response.data.data);

                if (self.form.validStartTime) {
                    self.form.validStartTime = dateUtil.toClientDate(self.form.validStartTime);
                }
                if (self.form.validEndTime) {
                    self.form.validEndTime = dateUtil.toClientDate(self.form.validEndTime);
                }else{
                    self.form.checkedValidEnd = true
                }
                if (self.form.leaseStartTime) {
                    self.form.leaseStartTime = dateUtil.toClientDate(self.form.leaseStartTime);
                }
                if (self.form.leaseEndTime) {
                    self.form.leaseEndTime = dateUtil.toClientDate(self.form.leaseEndTime);
                }
                if (self.form.accessStartTime) {
                    self.form.accessStartTime = dateUtil.toClientDate(self.form.accessStartTime);
                }
                if (self.form.accessEndTime) {
                    self.form.accessEndTime = dateUtil.toClientDate(self.form.accessEndTime);
                }
                if (self.form.birthDate) {
                    self.form.birthDate = dateUtil.toClientDateFormat(self.form.birthDate);
                }
                if (self.form.countriesAndRegionsType === '2') {
                    self.countryOptions = countryChina;
                }
                if (self.form.countriesAndRegionsType === '3') {
                    self.countryOptions = country;
                }
                if (self.form.residencePermitDate) {
                    self.form.residencePermitTime[0] = self.form.residencePermitDate;
                }
                if (self.form.residencePermitEnd) {
                    self.form.residencePermitTime[1] = self.form.residencePermitEnd;
                }
                if (self.form.isDirectParty=='1') {
                    self.memberType = 'isDirectParty';
                }else if (self.form.partyDoubleReport=='1') {
                    self.memberType = 'partyDoubleReport';
                }

                self.isIdcard = self.form.isIdcard || '1';
                self.loading = false;
            }
        }).catch(function (a) {
            console.error(a);
        })
    },
    countryChange:function(data){
      if (data === '2') {
        this.countryOptions = countryChina;
        this.form.nationality = '';
      }
      if (data === '3') {
        this.countryOptions = country;
        this.form.nationality = '';
      }
    }
  },
  computed:{
    isRequired: function(){
      return this.isIdcard === '0';
    },
    dynamicRules(){
      return {
        ...this.rules,
        validStartTime: [
          {required: this.isRequired, message: '请输入证件开始日期', trigger: 'blur'}
        ],
        validEndTime: [
          {required: this.isRequired, message: '请输入证件结束日期', trigger: 'blur'}
        ],
        gender: [
          { required: this.isRequired, message: "请选择性别", trigger: "change" }
        ],
        residentialAddress: [
          { required: this.isRequired, message: "请填写户籍地址", trigger: "blur" }
        ],
        ethnicity: [
          { required: this.isRequired, message: "请选择民族", trigger: "change" }
        ],
        authority: [
          { required: this.isRequired, message: "请填写签证机关", trigger: "blur" }
        ],
        birthDate: [
          { required: this.isRequired, message: "请填写出生日期", trigger: "blur" },
          { message: '请输入正确的日期', validator: validateBirthDate}
        ],
        citizenId: [
          { required: this.isRequired, message: "请填写证件号码", trigger: "blur" },
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码' },
          {
            message: "请输入正确的身份证号码",
            validator: validateCitizenId
          }
        ],
        certificateNo: [
          { required: this.isRequired, message: "请填写证件号码", trigger: "blur" },
          {
            message: "请输入数字与字母，不能输入其他字符",
            validator: validateNumberAndLetter
          }
        ],
        nationality: [
          { required: this.isRequired, message: "请选择国家（地区）", trigger: "change" }
        ],
        certificateType:[
          { required: this.isRequired, message: "请选择证件类型", trigger: "change" }
        ]
      }
    },
    memberType:{
        get: function () {
            return this.form.isDirectParty=='1'? 'isDirectParty': 'partyDoubleReport'
        },
        // setter
        set: function (newValue) {
            if(newValue == 'isDirectParty'){
                this.form.isDirectParty = '1'
                this.form.partyDoubleReport = '0'
            }else{
                this.form.isDirectParty = '0'
                this.form.partyDoubleReport = '1'
            }
        }
    },
  },
  mounted() {
    this.loading = true;
    Promise.all([this.initOptions()]).then(()=>{
      this.loadData();
    }).catch(() => {
      this.$message({
        message: '加载出现异常，请重试',
        type: 'error'
      });
      this.loading = false;
    });
  },
  watch: {
    inputMethod: function(newValue){
      this.showIdInfo = newValue==2?true:false;
    }
  }
};
</script>
<style scoped>
    *{
        font-size: 14px;
    }
  .upload-box{
    width: 262px;
    display: inline-block;
    margin-right: 20px;
  }
  .image-box{
    background-color: #F4F4F4;
    width: 262px;
    height: 166px;
    margin-bottom: 10px;
    border-radius: 4px;
    border:  1px solid #d7d7d7;
    display: inline-block;
    position: relative;
  }
  .image-box span{
    font-size: 24px;
    color: #aaaaaa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .image-box img{
    width: 100%;
    height: 100%;
    object-position: 50%;
    position: relative;
    z-index: 10;  
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
</style>

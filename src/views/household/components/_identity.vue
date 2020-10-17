<template>
  <div>
    <el-form ref="form" inline :model="c_form" :rules="dynamicRules" label-width="100px" class="form-box">
      <slot name="header"></slot>
      <div class="padding-content">
        <el-row>
          <el-col :span="10">
            <el-form-item label="读取证件">
              <span>
                <scanner @getData="getIdScannerData"/>
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名" prop="householdName" :rules="isSensitive!=0?null:rules.beforeHouseholdName" v-if="c_form.countriesAndRegionsType=='1'">
              <el-input v-model.trim="c_form.householdName" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="action">
              <el-button type="text" @click="showIdInfo=!showIdInfo">
                {{showIdInfo?'收起':'展开'}} <i :class="showIdInfo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="showIdInfo" style="position:relative">
            <div class="hr-style"></div>
            <div>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="国家(地区)" prop="countriesAndRegionsType">
                    <el-radio-group v-model="c_form.countriesAndRegionsType" @change="countryChange($event)">
                      <el-radio label="1">中国大陆</el-radio>
                      <el-radio label="2">港、澳、台地区</el-radio>
                      <el-radio label="3">外籍</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <template v-if="c_form.countriesAndRegionsType=='1'">
                    <el-form-item label="证件号码" prop="certificateNo">
                      <el-input v-model.trim="c_form.certificateNo" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="英文名" prop="householdFirstName" key="firstName">
                      <el-input v-model.trim="c_form.householdFirstName" clearable class="mini-input" />
                    </el-form-item>
                    <el-form-item label="英文姓" prop="householdLastName" key="lastName" label-width="80px">
                      <el-input v-model.trim="c_form.householdLastName" clearable class="mini-input" />
                    </el-form-item>
                  </template>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="民族" prop="ethnicity" v-if="c_form.countriesAndRegionsType=='1'">
                    <el-select v-model.trim="c_form.ethnicity" filterable clearable placeholder="请选择">
                      <el-option
                        v-for="item in ethnicity"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item label="国家(地区)" prop="nationality" v-else>
                    <el-select v-model="c_form.nationality" filterable clearable placeholder="请选择">
                      <el-option
                        v-for="item in countryOptions"
                        :key="item.code"
                        :label="item.cn"
                        :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="户籍地址" prop="residentialAddress" v-if="c_form.countriesAndRegionsType=='1'">
                    <el-input v-model.trim="c_form.residentialAddress" @change="parseCitizenCard" :maxlength="50" clearable placeholder="请输入"/>
                  </el-form-item>
                  <el-form-item label="证件类型" prop="certificateType" v-else>
                    <el-select v-model.trim="c_form.certificateType" filterable placeholder="请选择">
                      <el-option
                        v-for="item in documentOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="c_form.gender" :disabled="certificateNoFlag">
                      <el-radio label="1">男</el-radio>
                      <el-radio label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="证件号码" prop="certificateNo"  v-if="c_form.countriesAndRegionsType!='1'">
                    <el-input v-model.trim="c_form.certificateNo" clearable :maxlength="18" placeholder="请输入"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="出生日期" prop="birthDate" v-if="!c_form.certificateNo">
                    <el-input v-model.trim="c_form.birthDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
                  </el-form-item>
                  <el-form-item label="出生日期" prop="birthDate" v-else>
                    <el-input v-model.trim="c_form.birthDate" clearable :disabled="certificateNoFlag" placeholder="****"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="RFID" prop="rfidCode">
                    <el-input v-model.trim="c_form.rfidCode" clearable placeholder="请读卡"/>
                  </el-form-item>
                </el-col>
              </el-row>

              <slot name="img"></slot>
              
            </div>
            <div class="id-head">
              <img :src="c_form.certificateHeadUrl" v-if="!newIdImage">
              <img :src="c_form.idImg3Base64" v-else>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
  </div>
</template>

<script>
import {beforePickerOptions3, afterPickerOptions2} from "@/utils/validate";
import { validateNumberAndLetter, validateBirthDate, validateCitizenId, validateAsterisk } from "@/utils/rules";
import dateUtil from "@/utils/times";
import {propertyClone} from "@/utils/index";
import ethnicity from "@/utils/ethnicity";
import scanner from "@/components/scanner/scanner";
import {mask} from 'vue-the-mask'
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import {documentOptions} from "@/utils/options";
import { parseCitizenCard } from "@/api/household";

export default {
  components:{
    scanner
  },
  directives: {
    mask
  },
  props:['isIdcard','form','isSensitive'],
  data(){
    return {
      showIdInfo:true,
      isRequired: false,
      isCheckDate: false,
      ethnicity: [],
      countryOptions:[],
      documentOptions:[],
      certificateNoFlag:true,
      c_form:{
        householdName:'',
        checkedValidEnd: false,
        countriesAndRegionsType:'1',
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
        idImg3Base64: '',
        certificateHeadUrl:'',
        rfidCode:''
      },
      rules: {
        householdName: [
          {required: true, message: '请输入人员姓名', trigger: 'blur'},
        ],
        beforeHouseholdName: [
          {required: true, message: '请输入人员姓名', trigger: 'blur'},
          // { message: '用户信息不可输入*符号', validator: validateAsterisk, trigger: 'blur'},
        ],
        leaseStartTime: [
          {required: true, message: '请输入人员起始日期', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请输入人员结束日期', trigger: 'blur'}
        ],      
        householdFirstName:[
          { required: true, message: "请填写英文名", trigger: "blur" }
        ],
        householdLastName:[
          { required: true, message: "请填写英文姓", trigger: "blur" }
        ],
        certificateNo: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId, trigger: 'blur'},
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码', trigger: 'blur' }
        ],
        citizenId: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId, trigger: 'blur'},
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码', trigger: 'blur' }
        ]
      },
    }
  },
  methods:{
    beforePickerOptions3,
    afterPickerOptions2,
    handleStart () {
      this.c_form.validStartTime = ''
    },
    handleEnd () {
      this.c_form.validEndTime = ''
    },
    endTimeChange(value){
      if(value){
        this.c_form.validEndTime = ''
      }
    },
    //改变国家（地区）时重置相关数据
    countryChange(value){
      this.c_form.householdFirstName = ''
      this.c_form.householdLastName = ''
      this.c_form.nationality = ''
      this.c_form.citizenId = ''
      this.c_form.certificateNo = ''
      this.c_form.residentialAddress = ''
      this.c_form.authority = ''
      this.c_form.validStartTime = ''
      this.c_form.validEndTime = ''
      this.c_form.certificateType = ''
      this.c_form.birthDate = ''
      this.c_form.gender = ''
      this.c_form.ethnicity = ''
      this.c_form.checkedValidEnd = false
      if (value === '2') {
        this.countryOptions = countryChina
      }
      if (value === '3') {
        this.countryOptions = country
      }
    },
    parseCitizenCard(){ 
      let self = this;
      if(self.verifyCitizenId&&self.c_form.citizenId.indexOf("*")==-1){
        parseCitizenCard({
          "communityId": self.$route.query.communityId, // 小区ID
          "citizenId": self.c_form.citizenId,   // 身份证号码
          "address": self.c_form.residentialAddress  // 身份证住址
        }).then(function (response) {
          if(response.data.data && response.data.code==1){
            self.$emit('getMaritalStatus', response.data.data.maritalStatus)
          }
        }).catch(function (a) {
          console.error(a)
        })
        if(self.c_form.citizenId.length == 18){
          let birth = self.c_form.citizenId.slice(6,14)
          self.c_form.birthDate = dateUtil.toClientDateFormat(birth)
          let genderCode = self.c_form.citizenId.slice(16,17)
          let gender = parseInt(genderCode) % 2 ==0? '2': '1'
          self.c_form.gender = gender || '1'
        }else{
          self.c_form.gender = ''
        }
      }

        if(self.c_form.certificateNo.length == 18){
          let birth = self.c_form.certificateNo.slice(6,14)
          self.c_form.birthDate = dateUtil.toClientDateFormat(birth)
          let genderCode = self.c_form.certificateNo.slice(16,17)
          let gender = parseInt(genderCode) % 2 ==0? '2': '1'
          self.c_form.gender = gender || '1'
        }else{
          self.c_form.gender = ''
        }
    },
    getIdScannerData: function (data) {
      if (data.sex === '男') {
        this.c_form.gender = '1';
      } else {
        this.c_form.gender = '2';
      }
      
      //民族
      this.c_form.householdName = data.name;
      this.c_form.ethnicity = data.nation;
      this.c_form.birthDate = dateUtil.toClientDateFormat(data.birthday)
      this.c_form.residentialAddress = data.address;
      this.c_form.citizenId = data.id;
      this.c_form.certificateNo = data.id;
      // this.c_form.validStartTime = dateUtil.toClientDate(data.start);
      this.c_form.validStartTime = data.start;
      if(data.end == '长期'){
        this.c_form.validEndTime = ''
        this.c_form.checkedValidEnd = true
      }else{
        // this.c_form.validEndTime = dateUtil.toClientDate(data.end);
        this.c_form.validEndTime = data.end;
        this.c_form.checkedValidEnd = false
      }
      this.c_form.authority = data.department;
      this.c_form.idImg3Base64 = data.photo;
      this.c_form.rfidCode = data.rfid;

      this.parseCitizenCard()
    },
    handleValid(){
      let _valid
      this.$refs.form.validate((valid, a) => {
        _valid = valid
      })

      return _valid
    },
  },
  watch: {
    isRequired:function(){
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 100);
    }
  },
  computed:{
    verifyCitizenId(){
      if(this.c_form.countriesAndRegionsType=='1'){
        return true
      }

      return false
    },
    newIdImage(){
      return this.c_form.idImg3Base64.length>0
    },
    dynamicRules(){
      return {
        ...this.rules,
        countriesAndRegionsType: [
          { required: this.isRequired, message: "请选择国家（地区）", trigger: "change" }
        ],
        validStartTime: [
          {required: this.isRequired, message: '请输入证件开始日期', trigger: 'blur'}
        ],
        validEndTime: [
          {required: this.isRequired, message: '请输入证件结束日期', trigger: 'blur'}
        ],
        gender: [
          { required: this.isRequired, message: "请确认证件号码", trigger: "change" }
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
    }
  },
  mounted(){
    this.c_form = propertyClone(this.c_form, this.form)
    this.ethnicity = ethnicity;
    this.documentOptions = documentOptions;
    if (this.c_form.countriesAndRegionsType === '2') {
      this.countryOptions = countryChina;
    }
    if (this.c_form.countriesAndRegionsType === '3') {
      this.countryOptions = country;
    }
    this.isRequired = this.isIdcard === '1';
    if(this.isSensitive==0){
      this.parseCitizenCard()
    }
    let birth = this.form.certificateNo.slice(6,14)
    this.c_form.birthDate = birth

    this.c_form.certificateHeadUrl = this.form.faceList[0].imageUrl
  }
}
</script>
<style scoped>
  .id-head{
    width: 120px;
    height: 160px;
    text-align: center;
    position: absolute;
    right: 10%;
    top: 20px;
  }
  .id-head>img{
    width: 120px;
    height: 160px;
  }
  .action{
    width: 100px;
    text-align: right;
    padding-right: 12px;
  }
  .start-time,.end-time{
    display: inline-block;
    width: 150px;
    height: 36px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 0 8px;
    color: #606266;
  }
  .link{
    display: inline-block;
    width: 14px;
    height: 36px;
    line-height: 36px;
    text-align: center;   
  }
  .el-icon-date{
    margin-right: 6px;
  }
</style>

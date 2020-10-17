<template>
  <div>
    <el-form ref="form" inline :model="form" :rules="dynamicRules" label-width="100px">
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
            <el-form-item label="姓名" prop="householdName" v-if="form.countriesAndRegionsType=='1'">
              <el-input v-model.trim="form.householdName" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="showIdInfo=!showIdInfo">
              {{showIdInfo?'收起':'展开'}} <i :class="showIdInfo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </el-button>
          </el-col>
        </el-row>
        <el-collapse-transition>
          <div v-show="showIdInfo" style="position:relative">
            <div class="hr-style"></div>
            <div>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="国家(地区)" prop="countriesAndRegionsType">
                    <el-radio-group v-model="form.countriesAndRegionsType" @change="countryChange($event)">
                      <el-radio label="1">中国大陆</el-radio>
                      <el-radio label="2">港、澳、台地区</el-radio>
                      <el-radio label="3">外籍</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <template v-if="form.countriesAndRegionsType=='1'">
                    <el-form-item label="证件号码" prop="citizenId" key="citizenId">
                      <el-input v-model.trim="form.citizenId" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item label="英文名" prop="householdFirstName" key="firstName">
                      <el-input v-model.trim="form.householdFirstName" clearable placeholder="请输入" class="mini-input" />
                    </el-form-item>
                    <el-form-item label="英文姓" prop="householdLastName" key="lastName" label-width="80px">
                      <el-input v-model.trim="form.householdLastName" clearable placeholder="请输入" class="mini-input" />
                    </el-form-item>
                  </template>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="民族" prop="ethnicity" v-if="form.countriesAndRegionsType=='1'">
                    <el-select v-model.trim="form.ethnicity" filterable clearable placeholder="请选择">
                      <el-option
                        v-for="item in ethnicity"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="labelName" prop="nationality" v-else>
                    <el-select v-model="form.nationality" filterable clearable placeholder="请选择">
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
                  <el-form-item label="户籍地址" prop="residentialAddress" v-if="form.countriesAndRegionsType=='1'">
                    <el-input v-model.trim="form.residentialAddress" @change="parseCitizenCard" :maxlength="50" clearable placeholder="请输入"/>
                  </el-form-item>
                  <el-form-item label="证件类型" prop="certificateType" v-else>
                    <el-select v-model.trim="form.certificateType" filterable placeholder="请选择">
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
                    <el-radio-group v-model.trim="form.gender" :disabled="verifyCitizenId">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="证件号码" prop="certificateNo" v-if="form.countriesAndRegionsType!='1'">
                    <el-input v-model.trim="form.certificateNo" clearable :maxlength="18" placeholder="请输入"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="出生日期" prop="birthDate">
                    <el-input v-model.trim="form.birthDate" clearable v-mask="'####-##-##'" :disabled="form.certificateType==1" placeholder="YYYY-MM-DD"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="RFID" prop="rfidCode">
                    <el-input v-model.trim="form.rfidCode" clearable placeholder="请读卡"/>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <slot name="img"></slot>

            </div>
            <div class="id-head" v-show="form.idImg3Base64">
              <img :src="form.idImg3Base64">
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
  </div>
</template>

<script>
import {beforePickerOptions3, afterPickerOptions2} from "@/utils/validate";
import { validateNumberAndLetter, validateBirthDate, validateCitizenId } from "@/utils/rules";
import dateUtil from "@/utils/times";
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
  props:['isIdcard'],
  data(){
    return {
      showIdInfo:true,
      isRequired: false,
      labelName: '',
      ethnicity: [],
      countryOptions:[],
      documentOptions:[],
      form:{
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
        rfidCode:''
      },
      rules: {
        householdName: [
          {required: true, message: '请输入人员姓名', trigger: 'blur'}
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
        citizenId: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId},
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码' }
        ]
      },
    }
  },
  methods:{
    beforePickerOptions3,
    afterPickerOptions2,
    countryChange(value){
      this.form.householdFirstName = ''
      this.form.householdLastName = ''
      this.form.nationality = ''
      this.form.citizenId = ''
      this.form.certificateNo = ''
      this.form.residentialAddress = ''
      this.form.authority = ''
      this.form.validStartTime = ''
      this.form.validEndTime = ''
      this.form.certificateType = ''
      this.form.birthDate = ''
      this.form.gender = ''
      this.form.ethnicity = ''
      this.form.checkedValidEnd = false
      if (value === '2') {
        this.countryOptions = countryChina
      }
      if (value === '3') {
        this.countryOptions = country
      }
    },
    endTimeChange(value){
      if(value){
        this.form.validEndTime = ''
      }
    },
    parseCitizenCard(){
      // if(this.form.citizenId && this.form.residentialAddress){
      let self = this
      if(self.verifyCitizenId){
        parseCitizenCard({
          "communityId": self.$route.query.communityId, // 小区ID
          "citizenId": self.form.citizenId,   // 身份证号码
          "address": self.form.residentialAddress  // 身份证住址
        }).then(function (response) {
          if(response.data.data && response.data.code==1){
            self.$emit('getMaritalStatus', response.data.data.maritalStatus)
          }
        }).catch(function (a) {
          console.error(a)
        })
        // }
        if(self.form.citizenId.length == 18){
          let birth = self.form.citizenId.slice(6,14)
          self.form.birthDate = dateUtil.toClientDateFormat(birth)

          let genderCode = self.form.citizenId.slice(16,17)
          let gender = parseInt(genderCode) % 2 ==0? '2': '1'
          self.form.gender = gender || '1'
        }else{
          self.form.gender = ''
        }
      }
    },
    getIdScannerData: function (data) {
      // let data = {
      //   "name":"卫东",
      //   "sex":"女",
      //   "nation":"汉",
      //   "birthday":"18981024",
      //   "address":"北京市海淀区遗光寺八",
      //   "id":"110108195653135678",
      //   "department":"北京市公安局海淀分局",
      //   "start":"20130313",
      //   "end":"长期",
      //   "photo":""
      // }
      if (data.sex === '男') {
        this.form.gender = '1';
      } else {
        this.form.gender = '2';
      }
      
      //民族
      this.form.householdName = data.name;
      this.form.ethnicity = data.nation;
      this.form.birthDate = dateUtil.toClientDateFormat(data.birthday)
      this.form.residentialAddress = data.address;
      this.form.citizenId = data.id;
      this.form.validStartTime = dateUtil.toClientDate(data.start);
      if(data.end == '长期'){
        this.form.validEndTime = ''
        this.form.checkedValidEnd = true
      }else{
        this.form.validEndTime = dateUtil.toClientDate(data.end);
      }
      this.form.authority = data.department;
      this.form.idImg3Base64 = data.photo
      this.form.rfidCode = data.rfid;

      this.parseCitizenCard()
    },
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })
      
      return _valid
    }
  },
  watch: {
    "form.countriesAndRegionsType": function () {
      if (this.form.countriesAndRegionsType === '2') {
        this.countryOptions = countryChina;
        this.form.nationality = '';
        this.labelName = '地区'
      }
      if (this.form.countriesAndRegionsType === '3') {
        this.countryOptions = country;
        this.form.nationality = '';
        this.labelName = '国家'
      }
    },
    isRequired:function(){
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 100);
    }
  },
  computed:{
    verifyCitizenId(){
      if(this.form.countriesAndRegionsType=='1'){
        return true
      }

      return false
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
          { required: this.isRequired, message: "请选择国家或地区", trigger: "change" }
        ],
        certificateType:[
          { required: this.isRequired, message: "请选择证件类型", trigger: "change" }
        ]
      }
    }
  },
  created(){
    this.ethnicity = ethnicity;
    this.documentOptions = documentOptions;
    // this.isRequired = this.isIdcard == '0';
    this.isRequired = this.isIdcard === '1'

       
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
</style>

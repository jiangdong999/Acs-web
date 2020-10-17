<template>
  <section>
    <el-form ref="form" inline :rules="dynamicRules" :model="form" label-width="120px">
    <div v-loading="loading">
        <div class="form-title-caption">
            <p>基础信息</p>
        </div>
        <el-form-item label="工作职责" prop="duty">
            <el-select v-model="form.duty" filterable clearable>
            <el-option
                v-for="item in personTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <!-- <br>
        <el-form-item label="手机号码" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" placeholder="请输入" clearable type="tel"
                    :maxlength="11"/>
        </el-form-item> -->
        <br>
        <el-form-item label="国家（地区）" prop="countriesAndRegionsType">
          <el-radio-group v-model="form.countriesAndRegionsType" @change="countryChange">
            <el-radio label="1">中国大陆</el-radio>
            <el-radio label="2">港、澳、台地区</el-radio>
            <el-radio label="3">外籍</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-loading="idLoading">
          <div class="form-title-caption">
              <p>身份信息</p>
          </div>
          <transition name="el-fade-in-linear" mode="out-in">
          <div v-if="form.countriesAndRegionsType=='1'" key="1">
              <span class="control-left">
                  <el-form-item label="信息录入方式" prop="distributions">
                      <el-select v-model="inputMethod">
                          <el-option :value="1" label="读卡录入"/>
                          <el-option :value="2" label="手工录入"/>
                      </el-select>
                  </el-form-item>
              </span>
              <span class="control-left" v-show="inputMethod==1">
                  <scanner @getData="getIdScannerData" @start="idLoading=true"/>
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
                          <el-input v-model="form.residentialAddress" :maxlength="50" clearable placeholder="请输入"/>
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
                          <el-input v-model="form.citizenId" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
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
  </section>
</template>
<script>
import { dropdownCommunity } from "@/api/community";
import { dropdownList } from "@/api/property";
import { detailWorker, modifyWorker } from "@/api/personnel";
import { dropdownNodeComplex } from "@/api/node";
import { parseCitizenCard } from "@/api/household";
import { validateNumberAndLetter, validateNumber, validateBirthDate, validateCitizenId } from "@/utils/rules";
import {personTypeOptions, documentOptions} from "@/utils/options";
import ethnicity from "@/utils/ethnicity";
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import dateUtil from "@/utils/times";
import scanner from "@/components/scanner/scanner";
import {mask} from 'vue-the-mask'
import {beforePickerOptions3, afterPickerOptions2} from "@/utils/validate";

export default {
  components:{
    scanner,
  },
  directives: {
    mask
  },
  data() {
    return {
      displayIdentitly:'0',//身份证是否必填
      loading: false,
      idLoading: false,
      inputMethod: 2,
      showIdInfo: true,
      rules: {
        duty: [
          { required: true, message: "请选择工作职责", trigger: "change" }
        ],
        countriesAndRegionsType: [
          { required: true, message: "请选择国家（地区）", trigger: "change" }
        ],
        phoneNumber: [
          { message: '请输入正确的手机号',validator: validateNumber}
        ],
        householdName: [
          { required: true, message: "请填写人员姓名", trigger: "blur" }
        ],
        householdFirstName: [
          { required: true, message: '请输入英文名'}
        ],
        householdLastName: [
          { required: true, message: '请输入英文姓'}
        ],
        citizenId: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId},
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码' }
        ],
      },
      form: {
        checkedValidEnd: false,
        householdType: 2,
        countriesAndRegionsType:'1',
        duty: null,
        propertyName:'',
        communityName:'',
        phoneNumber:'',
        
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
      ethnicity: [],
      personTypeOptions:[],
      countryOptions:[],
      documentOptions:[]
    };
  },
  methods: {
    beforePickerOptions3,
    afterPickerOptions2,
    parseCitizenCard(){
      // if(this.form.citizenId && this.form.residentialAddress){
      let self = this
      parseCitizenCard({
        "communityId": self.$route.query.communityId, // 小区ID
        "citizenId": self.form.citizenId,   // 身份证号码
        "address": self.form.residentialAddress  // 身份证住址
      }).then(function (response) {
        if(response.data.data && response.data.code==1){
          if(!self.form.gender){
            self.form.gender = response.data.data.gender
          }
        }
      }).catch(function (a) {
        console.error(a)
      })
      // }
    },
    initOptions: function () {
      this.ethnicity = ethnicity;
      this.personTypeOptions = personTypeOptions;
      this.countryChina = countryChina;
      this.country = country;
      this.documentOptions = documentOptions;
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
        this.form.validEndTime = ''
        this.form.checkedValidEnd = true
      }else{
        this.form.validEndTime = dateUtil.toClientDate(data.end);
      }
      this.form.authority = data.department;
      this.idLoading = false;
      this.showIdInfo = true;
    },
    handleSubmit: function () {
      let self = this;
      
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.processingFormValue().then((data) => {
            modifyWorker(data).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
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
            });
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
          let IDbirth = data.citizenId.slice(6,14)
          let brith = data.birthDate.replace(/-/g, '')
          if(IDbirth != brith){this.$message.error('出生日期与身份证不一致');return;}
            
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
        
        resolve(data);
      })
      
    },
    handleClose: function () {
      this.$parent.$parent.handleClose();
    },
    setPhoto:function(src, key){
      this.form[key] = src;
    },
    loadData() {
      let self = this;
      self.loading = true;
      detailWorker(self.$route.query).then(function (response) {
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
          if (self.form.birthDate) {
            self.form.birthDate = dateUtil.toClientDateFormat(self.form.birthDate);
          }
          if (self.form.countriesAndRegionsType === '2') {
            self.countryOptions = countryChina;
          }
          if (self.form.countriesAndRegionsType === '3') {
            self.countryOptions = country;
          }
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
  watch: {
    inputMethod: function(newValue){
      this.showIdInfo = newValue==2?true:false;
    }
  },
  computed:{
    isRequired: function(){
      return this.displayIdentitly == '0';
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
  }
};
</script>
<style scoped>
  .tips{
    color: #999999;
    font-size: 12px;
  }
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
</style>

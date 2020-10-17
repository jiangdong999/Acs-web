<template>
  <section class="addWorker">
    <el-steps :active="activeIndex" simple>
      <el-step title="基础信息" icon="icon-step1"></el-step>
      <el-step title="授权设置" :icon="activeIndex>=1?'icon-step2-visited':'icon-step2'"></el-step>
      <el-step title="结果查看" :icon="activeIndex==2?'icon-step3-visited':'icon-step3'"></el-step>
    </el-steps>
    <div v-loading="loading">
        <el-form ref="form" inline :rules="dynamicRules" :model="form" label-width="120px">
        <div v-if="activeIndex==0" key="a">
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
          <el-form-item label="姓名" prop="householdName" width="300" v-if="form.countriesAndRegionsType === '1'">
            <el-input v-model.trim="form.householdName" placeholder="请输入" clearable :maxlength="15"/>
          </el-form-item>
          <!-- <br>
          <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入" clearable type="tel" :maxlength="11"/>
          </el-form-item> -->
          <br>
          <el-form-item label="国家(地区)" prop="countriesAndRegionsType">
            <el-radio-group v-model="form.countriesAndRegionsType">
            <el-radio label="1">中国大陆</el-radio>
            <el-radio label="2">港、澳、台地区</el-radio>
            <el-radio label="3">外籍</el-radio>
            </el-radio-group>
          </el-form-item>
          <div>
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
                    <scanner @getData="getIdScannerData"/>
                </span>
                <el-collapse-transition>
                  <div v-show="showIdInfo">
                      <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名" prop="householdName">
                                <el-input v-model.trim="form.householdName" placeholder="请输入" clearable :maxlength="20"/>
                            </el-form-item> 
                        </el-col>
                        <el-col :span="16" style="line-height:36px">
                            <el-form-item label="证件有效期限" label-width="120px" prop="validStartTime">
                              <el-date-picker style="width:160px"
                                              v-model.trim="form.validStartTime" type="date"
                                              :picker-options="beforePickerOptions3(form.validEndTime)"
                                              >
                              </el-date-picker>
                            </el-form-item>
                              至&emsp;
                            <el-form-item prop="validEndTime" v-if="!form.checkedValidEnd">
                              <el-date-picker style="width:160px"
                                              v-model.trim="form.validEndTime" type="date"
                                              :picker-options="afterPickerOptions2(form.validStartTime)"
                                              >
                              </el-date-picker>
                            </el-form-item>
                            <el-checkbox v-model="form.checkedValidEnd">长期</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="性别" prop="gender">
                            <el-radio-group v-model="form.gender">
                                <el-radio label="m">男</el-radio>
                                <el-radio label="f">女</el-radio>
                            </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item label="户籍地址" label-width="120px" prop="residentialAddress">
                            <el-input v-model.trim="form.residentialAddress" :maxlength="50" clearable placeholder="请输入"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
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
                        <el-col :span="8">
                            <el-form-item label="签证机关" label-width="120px" prop="authority">
                                <el-input v-model.trim="form.authority" :maxlength="20" placeholder="请输入" clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出生日期" prop="birthDate">
                            <el-input v-model.trim="form.birthDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="证件号码" prop="citizenId">
                            <el-input v-model.trim="form.citizenId" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
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
                    <el-input v-model.trim="form.householdFirstName" clearable placeholder="请输入"/>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="英文姓" prop="householdLastName">
                    <el-input v-model.trim="form.householdLastName" clearable placeholder="请输入"/>
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
                    <el-input v-model.trim="form.certificateNo" clearable :maxlength="18" placeholder="请输入"/>
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
                                      v-model.trim="form.validStartTime" type="date"
                                      :picker-options="beforePickerOptions3(form.validEndTime)"
                                      >
                      </el-date-picker>
                    </el-form-item>
                    至&emsp;
                    <el-form-item prop="validEndTime">
                      <el-date-picker
                                      placeholder="结束日期"
                                      v-model.trim="form.validEndTime" type="date"
                                      :picker-options="afterPickerOptions2(form.validStartTime)"
                                      >
                      </el-date-picker>
                    </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="出生日期" prop="birthDate">
                <el-input v-model.trim="form.birthDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
              </el-form-item>
            </div>
            </transition>
          </div>
        </div>
        <div v-else-if="activeIndex==1" key="b">
          <div class="form-title-caption">
              <p>授权开门</p>
          </div>
          <el-form-item label="门禁卡发卡">
            <el-select v-model="form.cardClass" filterable placeholder="请选择卡类型">
              <el-option value="1" label="IC卡"/>
              <el-option value="2" label="身份证"/>
              <el-option value="3" label="ID卡"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="cardNo" :rules="rules.cardNo" v-if="form.cardClass!=='2'">
            <el-input v-model="form.cardNo" clearable placeholder="请输入卡号" maxlength="8" :type="pswVisibility?'type':'password'">
              <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
            </el-input>
            <div class="tips">卡号：{{form.cardNo}}</div>
          </el-form-item>
          <el-form-item prop="cardNo" v-else-if="form.cardClass==='2'" :rules="rules.cardNo2">
            <el-input v-model="form.cardNo" clearable placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
              <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
            </el-input>
            <div class="tips">卡号：{{form.cardNo}}</div>
          </el-form-item>
          <br>
          <el-form-item label="门禁卡有效期限" prop="accessStartTime">
            <el-date-picker style="width:150px"
                            v-model="form.accessStartTime" type="date"
                            placeholder="起始日期"
                            :picker-options="beforePickerOptions2(form.accessEndTime)"
                            >
            </el-date-picker>
            &emsp;至&emsp;
            <el-date-picker style="width:150px"
                            v-model="form.accessEndTime" type="date"
                            placeholder="结束日期"
                            :picker-options="afterPickerOptions2(form.accessStartTime)"
                            >
            </el-date-picker>
            <div class="tips">提示：门禁卡有效期限未设定的情况下默认为永久有效</div>
          </el-form-item>
        </div>

        <div v-else-if="activeIndex==2" key="c">
          <div class="step-success">
            <img src="../../../assets/image/success.png"/>
            <p>授权成功</p>
          </div>
        </div>
        </el-form>
      <div class="form-dialog-control-area">
        <el-button type="primary" @click="handleNext()"  v-if="activeIndex==0">下一步</el-button>
        <el-button type="primary" @click="activeIndex--" v-if="activeIndex==1">上一步</el-button>
        <el-button type="primary" @click="handleSubmit"  v-if="activeIndex==1" :loading="loading">提交</el-button>
        <el-button type="primary" @click="handleClose()" v-if="activeIndex==2">好的</el-button>
        <el-button type="primary" @click="tabFace()" v-if="activeIndex==2">去开通人脸开门</el-button>
      </div>
    </div>

  </section>
</template>
<script>
// import { dropdownCommunity } from "@/api/community";
// import { dropdownList } from "@/api/property";
import { saveWorker } from "@/api/personnel";
import { parseCitizenCard } from "@/api/household";
import { validateNumberAndLetter, validateHexadecimal, validateNumber, validateBirthDate, validateCitizenId, validateMobile } from "@/utils/rules";
import {personTypeOptions, documentOptions} from "@/utils/options";
import ethnicity from "@/utils/ethnicity";
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import dateUtil from "@/utils/times";
import scanner from "@/components/scanner/scanner";
import {mask} from 'vue-the-mask'
import {beforePickerOptions2, beforePickerOptions3, afterPickerOptions2} from "@/utils/validate";
import {mapGetters} from 'vuex'

export default {
  components:{
    scanner
  },
  directives: {
    mask
  },
  data() {
    return {
      displayIdentitly:'0',//身份证是否必填
      pswVisibility:false,
      householdId:null,

      activeIndex: 0,
      loading: false,
      inputMethod: 1,
      showIdInfo: false,
      rules: {
        // propertyId: [
        //   { required: true, message: "请选择所属单位", trigger: "change" }
        // ],
        duty: [
          { required: true, message: "请选择工作职责", trigger: "change" }
        ],
        // community: [
        //   { required: true, message: "请选择所属小区", trigger: "change" }
        // ],
        countriesAndRegionsType: [
          { required: true, message: "请选择国家（地区）", trigger: "change" }
        ],
        householdName: [
          { required: true, message: "请填写人员姓名", trigger: "blur" }
        ],
        householdFirstName:[
          { required: this.isRequired, message: "请填写英文名", trigger: "blur" }
        ],
        householdLastName:[
          { required: this.isRequired, message: "请填写英文姓", trigger: "blur" }
        ],
        cardNo: [
          // { required: true, message: '请输入门禁卡卡号'},
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal}
        ],
        phoneNumber: [
          { min: 11, max: 11, message: '请填入正确的长度为11的联系方式' },
          { message: '请填入正确的联系方式',validator: validateMobile}
        ],
        birthDate: [
          { message: '请输入正确的日期', validator: validateBirthDate}
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
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ]
      },
      form: {
        checkedValidEnd: false,
        householdType: 2,
        countriesAndRegionsType:'1',
        cardClass:'1',
        duty: null,
        community: null,
        communityId:null,
        roomNodeId: -1,
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

        cardNo:'',

        accessStartTime:'',
        accessEndTime:''
      },
      propertyList: [],
      communityList: [],
      ethnicity: [],
      personTypeOptions:[],
      countryOptions:[],
      documentOptions:[]
    };
  },
  computed:{
    ...mapGetters([
        'node',
        'community'
      ]),
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
  methods: {
    beforePickerOptions2,
    beforePickerOptions3,
    afterPickerOptions2,
    parseCitizenCard(){
      // if(this.form.citizenId && this.form.residentialAddress){
      let self = this
      parseCitizenCard({
        "communityId": self.community.communityId, // 小区ID
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

      
      if(self.form.citizenId.length == 18){
        let birth = self.form.citizenId.slice(6,14)
        self.form.birthDate = dateUtil.toClientDateFormat(birth)
      }
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
      this.showIdInfo = true;
    },
    handleSubmit: function () {
      let self = this;
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.loading = true;
          self.processingFormValue().then((data) => {
            saveWorker(data).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
                self.activeIndex = 2;
                self.householdId = response.data.data.householdId
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }
            }).catch(function (a) {
              console.error(a)
            }).finally(_=>{
              self.loading = false;
            });
          }).catch(e=>{
            self.loading = false
            self.$message({
              message: e,
              type: 'error'
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
        let data = { ...this.form, ...this.community };
        
        if (this.form.countriesAndRegionsType === '1') { //如果是大陆居民

          data.certificateNo = this.form.citizenId; //证件号码 = 身份证号码
          data.nationality = 'CN'; //国籍 中国
          data.certificateType = '1'; //证件类型为身份证
        }else{
          data.householdName = data.householdFirstName + data.householdLastName
          data.citizenId = data.certificateNo
        }

        if (this.form.validStartTime) {
          data.validStartTime = dateUtil.toServerDateString(this.form.validStartTime) || '';
        }
        if (this.form.validEndTime) {
          data.validEndTime = dateUtil.byPattern(this.form.validEndTime, "YYYYMMDD235959999") || '';
        }
        if (this.form.accessStartTime) {
          data.accessStartTime = dateUtil.toServerDateString(this.form.accessStartTime);
        }
        if (this.form.accessEndTime) {
          data.accessEndTime = dateUtil.byPattern(this.form.accessEndTime, "YYYYMMDD235959999") || '';
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
    handleNext: function(){
      this.$refs.form.validate(valid => {

        if(valid) {

          let IDbirth = this.form.citizenId.slice(6,14)
          let brith = this.form.birthDate.replace(/-/g, '')

          if(this.form.countriesAndRegionsType === '1' && IDbirth != brith){

            this.$message.error('出生日期与身份证不一致')
            this.showIdInfo = true

          }else{ this.activeIndex = 1} 

        }else{
          this.showIdInfo = true
        }
      })
    },
    setPhoto:function(src, key){
      this.form[key] = src;
    },
    tabFace:function(){
      this.$router.push({ path: '/village/workerEdit', query: { 
        householdId: this.householdId,
        communityId: this.community.communityId,
        roomNodeId:'-1', 
        tab: 'face' 
      }})
    }
  },
  mounted() {
    this.initOptions()
  },
  watch: {
    "form.countriesAndRegionsType": function () {
      if (this.form.countriesAndRegionsType === '2') {
        this.countryOptions = countryChina;
        this.form.nationality = '';
      }
      if (this.form.countriesAndRegionsType === '3') {
        this.countryOptions = country;
        this.form.nationality = '';
      }
    },
    inputMethod: function(newValue){
      this.showIdInfo = newValue==2?true:false;
    }
  }
};
</script>
<style scoped>
  .tips{
    color: #999999;
    font-size: 12px;
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

<template>
  <section class="addWorker">
    <div class="topBar">
      <label class="el-icon-arrow-left" @click="$router.back()">返回</label>
      <div>新增工作人员</div>
    </div>
    <div v-loading="loading" class="content">
        <el-form ref="form" inline :rules="dynamicRules" :model="form" label-width="84px">
        <div v-if="activeIndex==0" key="a">
          <div class="content-basicInfo">
            <el-row>
              <el-col :span="24">
                  <div class="module-title">
                    <mallki className="mallki-text" text="基础信息"></mallki>
                  </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
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
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效时长" prop="leaseType">
                  <el-select v-model="form.leaseType" filterable clearable>
                    <el-option value="3" label="三个月"/>
                    <el-option value="6" label="六个月"/>
                    <el-option value="12" label="十二个月"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效期至" prop="leaseEndTime">
                <el-date-picker 
                v-model.trim="form.leaseEndTime"  
                clearable 
                placeholder="YYYY-MM-DD"
                value-format="yyyyMMdd235959000"
                :picker-options="beforePickerOptions2(form.leaseEndTime)"
                >
                </el-date-picker>　
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="content-identityInfo">
            <el-row>
              <el-col :span="24">
                <div class="module-title">
                  <mallki className="mallki-text" text="身份信息"></mallki>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名" prop="householdName">
                  <el-input v-model.trim="form.householdName" placeholder="请输入" clearable :maxlength="20"/>
                </el-form-item> 
              </el-col>
              <el-col :span="12" style="line-height:36px">
                <el-form-item label="证件号码" prop="certificateNo">
                <el-input v-model.trim="form.certificateNo" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
                </el-form-item>
                <span class="control-left" v-show="inputMethod==1">
                  <scanner @getData="getIdScannerData"/>
                </span>
              </el-col>
              <!-- <el-col :span="4">
                <div class="action">
                  <el-button type="text" @click="showIdInfo=!showIdInfo">
                    {{showIdInfo?'收起':'展开'}} <i :class="showIdInfo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                  </el-button>
                </div>
              </el-col> -->
            </el-row>
            <!-- <div class="form-dialog-control-area" style="margin: 20px 60px;"></div> -->
            <!-- <div v-show="showIdInfo"> -->

              <el-row>
                <el-col :span="8">
                  <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="form.gender">
                        <el-radio label="m">男</el-radio>
                        <el-radio label="f">女</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="户籍地址" prop="residentialAddress">
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
                <el-col :span="16">
                  <el-form-item label="签证机关" prop="authority">
                      <el-input v-model.trim="form.authority" :maxlength="20" placeholder="请输入" clearable/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="出生日期" prop="birthDate">
                    <el-date-picker 
                    v-model.trim="form.birthDate" 
                    clearable  
                    placeholder="YYYY-MM-DD" 
                    type="data"
                    value-format="yyyyMMdd000000000"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="16" style="line-height:36px">
                  <el-form-item label="证件有效期限"   prop="validStartTime">
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

          </div>
          <div class="content-doorcard">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="content-doorcard_class">
                  <el-row>
                    <el-col :span="24">
                      <div class="module-title">
                        <mallki className="mallki-text" text="录入门卡"></mallki>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="卡类型">
                        <el-select v-model="form.cardClass" filterable placeholder="请选择卡类型">
                          <el-option value="1" label="IC卡"/>
                          <el-option value="2" label="身份证"/>
                          <el-option value="3" label="ID卡"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col class="icon-visibly" :span="12">
                      <el-form-item label="门卡卡号" prop="cardNo" :rules="rules.cardNo" v-if="form.cardClass!=='2'">
                        <el-input style="width:206px;" v-model="form.cardNo" clearable placeholder="请输入卡号" maxlength="8" :type="pswVisibility?'type':'password'">
                          <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="门卡卡号" prop="cardNo" v-else-if="form.cardClass==='2'" :rules="rules.cardNo2">
                        <el-input style="width:206px;" v-model="form.cardNo" clearable placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
                          <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content-doorcard_class">
                  <el-row>
                    <el-col :span="24">
                      <div class="module-title">
                        <mallki className="mallki-text" text="上传人脸"></mallki>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <component :is="faceViewName" v-on:childimgBase64="childimgBase64" @faceUrlFun="faceUrlFun"/>
                    </el-col>
                  </el-row>
                </div>
                
              </el-col>
            </el-row>
          </div>
          <div class="form-dialog-control-area">
              <el-button @click="$router.back()">取消</el-button>
              <el-button @click="handleSubmitNew()" type="primary">确定</el-button>
          </div>
        </div> 
        </el-form>
    </div>

  </section>
</template>
<script>
import { saveWorker } from "@/api/personnel";
import {formatTimeMillisToDate} from "@/filters/index";
import { parseCitizenCard } from "@/api/household";
import { validateNumberAndLetter, validateHexadecimal, validateNumber, validateBirthDate, validateCitizenId, validateMobile } from "@/utils/rules";
import {personTypeOptions, documentOptions} from "@/utils/options";
import ethnicity from "@/utils/ethnicity";
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import dateUtil from "@/utils/times";
import scanner from "@/components/scanner/scanner";
import {mask} from 'vue-the-mask'
import {beforePickerOptions2, beforePickerOptions3, afterPickerOptions2 } from "@/utils/validate";
import {mapGetters} from 'vuex'
import faceWorkerLayout from './components/faceWorkerLayout'//人脸信息
export default {
  components:{
    scanner,
    faceWorkerLayout//人脸信息
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
      // showIdInfo: false,
      rules: {
        duty: [
          { required: true, message: "请选择工作职责", trigger: "change" }
        ],
        leaseType: [
          { message: "请选择有效时长", trigger: "change" }
        ],
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
          { required: true,message: '请输入正确的门禁卡卡号',validator: validateHexadecimal}
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
        certificateNo: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId},
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码' }
        ],
        cardNo: [
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ],
        leaseEndTime:[
          { required: true, message: '请输入工作有效期', trigger: 'change' }
        ]
      },
      form: {
        leaseEndTime:'',//工作有限期至
        leaseStartTime:'',//工作有限期至
        faceImgBase64:'',//人脸图片
        faceUrl:'',//人脸图片
        leaseType:'',//有效时长
        checkedValidEnd: false,
        householdType: 2,
        countriesAndRegionsType:'1',
        cardClass:'1',//卡类型
        duty: null,//工作职责
        community: null,
        communityId:null,
        roomNodeId: -1,
        phoneNumber:'',
        householdName:'',//姓名
        validStartTime:'',//起始证件期限
        validEndTime:'',//到期证件期限
        gender:'',//性别
        residentialAddress:'', //户籍地址
        ethnicity:'',//民族
        authority:'',//签证机关
        birthDate:'', //出身日期
        certificateNo:'',//证件号码

        nationality:'',
        householdFirstName:'',
        householdLastName:'',
        certificateType:'',

        cardNo:'',//门禁卡号

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
      faceViewName:function(){//人脸信息
        return 'faceWorkerLayout'
      },
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
          certificateNo: [
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
          ],
         
        }
      },
  },
  filters: {
    formatTimeMillisToDate: formatTimeMillisToDate,//时间戳变成本地日期
  },
  watch: {//有效时长与有效期至  联动
    'form.leaseType':function (val) {
      const date = new Date();
      let newDate = dateUtil.addTimeFormat(val, 'M', date).valueOf()
      let dateAll = formatTimeMillisToDate(newDate);//时间戳变成本地日期
      dateAll = dateAll.replace(/-/g,'') + '235959000'
      return this.form.leaseEndTime = dateAll
    }
  },
  methods: {
    beforePickerOptions2,
    beforePickerOptions3,
    afterPickerOptions2,
    childimgBase64: function (childimgBase64) {//人脸照片base64
      let childimgBase = childimgBase64.replace(/^data\:image\/\w+\;base64\,/, '');
      this.form.faceImgBase64 = childimgBase
    },
    faceUrlFun:function(faceUrlFun){
      this.form.faceUrl = faceUrlFun
    },
    handleSubmitNew(){//确认
      let self = this;
      self.$refs.form.validate((valid) => {
        if (valid) {
          self.loading = true;
          if (self.form.validStartTime) {
            self.form.validStartTime = dateUtil.toServerDateString(self.form.validStartTime);
          }
          if (self.form.validEndTime) {
            self.form.validEndTime = dateUtil.toServerDateString(self.form.validEndTime);
          }else{
            self.form.checkedValidEnd = true
          }
          if (self.form.birthDate) {
            self.form.birthDate = dateUtil.toServerDateString(new Date(this.form.birthDate));
          }
          self.form.leaseStartTime = dateUtil.toServerDateString(new Date());//开始有效期
          let data = { ...this.form, ...this.community };
          saveWorker(data).then((response) => {
            if (response.data && response.data.code === 1) {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.$router.back();
            } else {     
              if (self.form.validStartTime) {
                self.form.validStartTime = dateUtil.toClientDate(self.form.validStartTime);
              }
              if (self.form.validEndTime) {
                self.form.validEndTime = dateUtil.toClientDate(self.form.validEndTime);
              }else{
                self.form.checkedValidEnd = true
              }
              if (self.form.birthDate) {
                var newDate =self.form.birthDate;
                var datediv = newDate.substring(0,8);
                self.form.birthDate = datediv.substring(0, 4)+'-' +datediv.substring(4,6) + '-' + datediv.substring(6,8)
              }         
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
        }
      })
    },
    parseCitizenCard(){
      let self = this
      parseCitizenCard({
        "communityId": self.community.communityId, // 小区ID
        "certificateNo": self.form.certificateNo,   // 身份证号码
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

      if(self.form.certificateNo.length == 18){
        let birth = self.form.certificateNo.slice(6,14)
        self.form.birthDate = dateUtil.toClientDateFormat(birth)
      }
    },
    initOptions: function () {
      this.ethnicity = ethnicity;//民族
      this.personTypeOptions = personTypeOptions;//工作职责
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
      this.form.certificateNo = data.id;
      this.form.validStartTime = dateUtil.toClientDate(data.start);
      if(data.end == '长期'){
        this.form.validEndTime = ''
        this.form.checkedValidEnd = true
      }else{
        this.form.validEndTime = dateUtil.toClientDate(data.end);
      }
      this.form.authority = data.department;
      // this.showIdInfo = true;
    },
  },
  mounted() {
    this.initOptions()
  },
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

  .topBar {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #fff;
  font-size: 14px;
}
.topBar > label {
  color: #007ee4;
  cursor: pointer;
}
.topBar > div {
  font-size: 16px;
  color: #000;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
/* -------------me------------ */

.topBar {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #fff;
  font-size: 14px;
}
.topBar > label {
  color: #007ee4;
  cursor: pointer;
}
.topBar > div {
  font-size: 16px;
  color: #000;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
.content{
  padding: 20px;
}
.content-basicInfo,.content-identityInfo{
  background: #fff;
  margin-bottom: 20px;
  border-radius: 5px;
}
.content-doorcard{
  margin-bottom: 20px;
  border-radius: 5px;
}
.content-doorcard_class{
  background: #fff;
  border-radius: 5px;
  height: 244px;
}
.btn-ico{
  margin:30px 0 0 0;
  height: 45px;
}

</style>

<style lang="scss" scoped>
.addWorker /deep/ .el-form-item--medium .el-form-item__label{
  padding-top: 10px;
}
//  .content-basicInfo .el-form-item--medium .el-form-item__label,
//  .content-identityInfo .el-form-item--medium .el-form-item__label
//  {
//     padding-top: 10px;
// }

.icon-visibly .el-input__prefix{
  top: 13px;
}
</style>

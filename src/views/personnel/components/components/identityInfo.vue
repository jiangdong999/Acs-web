<template>
  <div>
    <el-form ref="form" inline :model="form" :rules="dynamicRules" label-width="120px">
      <slot></slot>
      <el-row>
        <el-col :span="10">
          <el-form-item label="快速录入">
            <span>
              <scanner @getData="getIdScannerData"/>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="国家(地区)" prop="countriesAndRegionsType">
            <el-radio-group v-model="form.countriesAndRegionsType">
              <el-radio label="1">中国大陆</el-radio>
              <el-radio label="2">港、澳、台地区</el-radio>
              <el-radio label="3">外籍</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <transition name="el-fade-in-linear" mode="out-in">
      <div v-if="form.countriesAndRegionsType=='1'" key="1">
        <div>
          <el-row>
            <el-col :span="10">
              <el-form-item label="姓名" prop="householdName">
                <el-input :value="formHouseholdName" placeholder="请输入" @input="$emit('update:formHouseholdName',$event)" clearable :maxlength="15"/>
              </el-form-item>
            </el-col>
            <el-col :span="14" style="line-height:36px">
                <el-form-item label="证件有效期限" prop="validStartTime">
                  <el-date-picker style="width:160px"
                    v-model.trim="form.validStartTime" type="date"
                    :picker-options="beforePickerOptions3(form.validEndTime)">
                  </el-date-picker>
                </el-form-item>
                  至&emsp;
                <el-form-item prop="validEndTime">
                  <el-date-picker style="width:160px"
                    v-if="!form.checkedValidEnd"
                    v-model.trim="form.validEndTime" type="date"
                    :picker-options="afterPickerOptions2(form.validStartTime)">
                  </el-date-picker>
                </el-form-item>
                <el-checkbox v-model="form.checkedValidEnd">长期</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model.trim="form.gender">
                    <el-radio label="m">男</el-radio>
                    <el-radio label="f">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="户籍地址" prop="residentialAddress">
                <el-input v-model.trim="form.residentialAddress" @change="parseCitizenCard" :maxlength="50" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="民族" prop="ethnicity">
                <el-select v-model.trim="form.ethnicity" filterable clearable placeholder="请选择">
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
              <el-form-item label="签证机关" prop="authority">
                <el-input v-model.trim="form.authority" :maxlength="20" placeholder="请输入" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="出生日期" prop="birthDate">
                <el-input v-model.trim="form.birthDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="证件号码" prop="citizenId">
                <el-input v-model.trim="form.citizenId" @change="parseCitizenCard" :maxlength="18" placeholder="请输入" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else key="2">
        <el-form-item label="国家(地区)" prop="nationality">
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
          <el-col :span="14">
            <el-form-item label="英文姓" prop="householdLastName">
              <el-input v-model.trim="form.householdLastName" clearable placeholder="请输入"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="证件类型" prop="certificateType">
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
              <el-form-item label="证件有效期限" prop="validStartTime">
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
  props:['isIdcard','communityId','formHouseholdName'],
  data(){
    return {
      ethnicity: [],
      countryOptions:[],
      form:{
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

      },
      rules: {
        // householdName: [
        //   {required: true, message: '请输入人员姓名', trigger: 'blur'}
        // ],
        leaseStartTime: [
          {required: true, message: '请输入人员起始日期', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请输入人员结束日期', trigger: 'blur'}
        ],
        countriesAndRegionsType: [
          { required: true, message: "请选择国家（地区）", trigger: "change" }
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
    parseCitizenCard(){
      // if(this.form.citizenId && this.form.residentialAddress){
      let self = this
      parseCitizenCard({
        "communityId": self.communityId, // 小区ID
        "citizenId": self.form.citizenId,   // 身份证号码
        "address": self.form.residentialAddress  // 身份证住址
      }).then(function (response) {
        if(response.data.data && response.data.code==1){
          self.form.gender = response.data.data.gender
          self.$emit('showCityRegister', response.data.data.isCityRegister)
          self.$emit('getMaritalStatus', response.data.data.maritalStatus)
        }
      }).catch(function (a) {
        console.error(a)
      })
      // }
    },
    getIdScannerData: function (data) {
      this.$emit('update:formHouseholdName', data.name)
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
      if (this.form.countriesAndRegionsType === '1') {
        this.$emit('toggleHouseholdName', true)
      }else{
        this.$emit('toggleHouseholdName', false)
      }
      if (this.form.countriesAndRegionsType === '2') {
        this.countryOptions = countryChina;
        this.form.nationality = '';
      }
      if (this.form.countriesAndRegionsType === '3') {
        this.countryOptions = country;
        this.form.nationality = '';
      }
    },
    isRequired:function(){
      setTimeout(() => {
        this.$refs.form.clearValidate()
      }, 100);
    }
  },
  computed:{
      isRequired: function(){
        return this.isIdcard == '0';
      },
      dynamicRules(){
        return {
          ...this.rules,
          validStartTime: [
            {required: this.isRequired, message: '请输入证件开始日期', trigger: 'blur'}
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
  mounted(){
    this.ethnicity = ethnicity;
    this.documentOptions = documentOptions;
  }
}
</script>
<style scoped>
  
</style>

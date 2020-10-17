<template>
  <div>   
    <el-form ref="c_form" inline :model="c_form" :rules="dynamicRules" label-width="100px" class="form-box">
      <slot></slot>
      <div> 
        <el-row> 
          <el-col :span="8">
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <el-select v-model="c_form.maritalStatus" filterable placeholder="请选择" clearable :disabled="disabled">
                <el-option
                v-for="item in maritalStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>  
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="文化程度" prop="educationLevel">
              <el-select v-model="c_form.educationLevel" filterable placeholder="请选择" clearable :disabled="disabled">
                  <el-option
                  v-for="item in educationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-select v-model="c_form.politicalStatus" filterable placeholder="请选择" clearable :disabled="disabled">
                <el-option
                v-for="item in politicalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="宗教信仰" prop="religion">
              <el-select v-model="c_form.religion" filterable placeholder="请选择" clearable :disabled="disabled">
                <el-option
                  v-for="item in religionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="householdRole==3">
            <el-form-item label="入住事由" prop="stayReason">
              <el-select v-model="c_form.stayReason" filterable placeholder="请选择" clearable :disabled="disabled">
                <el-option
                v-for="item in stayReasonOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="居住证" prop="isFirstResidencePermit">
              <el-radio-group v-model="c_form.isFirstResidencePermit" @change="chgIsFirstResidencePermit" :disabled="disabled">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-if="c_form.isFirstResidencePermit=='1'">
            <el-form-item label="有效期限" prop="residencePermitDate">             
              <el-date-picker
                style="width:240px"
                :disabled="disabled"
                v-model="residencePermitTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="到"
                :start-placeholder="isSensitive!=0&&residencePermitTime?'****':'开始日期'"
                :end-placeholder="isSensitive!=0&&residencePermitTime?'****':'结束日期'"
                :clearable="false"
                :default-time="['00:00:00','23:59:59']"
                value-format="yyyyMMddHHmmssSSS">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工作状态" prop="personalStatus">
              <el-select v-model="c_form.personalStatus" 
              filterable placeholder="请选择" 
              clearable 
              :disabled="disabled"
              @change="clearCompanyName">
                <el-option
                v-for="item in personalStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="c_form.personalStatus=='2'">
            <el-form-item label="职业" prop="professionCode">
              <el-select v-model="professionCode" 
              filterable 
              placeholder="若为其他职业可直接输入并选择" 
              allow-create 
              default-first-option 
              :disabled="disabled"
              clearable>
                <el-option
                v-for="item in professionCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="c_form.personalStatus=='4' || c_form.personalStatus=='2'">
            <el-form-item :label="c_form.personalStatus=='2'?'单位名称':'学校名称'" prop="companyName">
              <el-input v-model="c_form.companyName" filterable placeholder="请输入" clearable :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>  
  </div>
</template>

<script>
import {maritalStatusOptions, politicalOptions, educationOptions, 
        personalStatusOptions, stayReasonOptions, 
        residenceTypeOptions, caringStaffTypeOptions, unitNatureOptions,
        professionCodeOptions, religionOptions} from "@/utils/options";
import {propertyClone} from "@/utils/index";

export default {
  props:['householdRole', 'form', 'disabled', 'isInfo', 'isSensitive'],
  data(){
    return {
      isDeal: true,
      maritalStatusOptions:[],
      educationOptions:[],
      personalStatusOptions:[],
      stayReasonOptions:[],
      residenceTypeOptions:[],
      caringStaffTypeOptions:[],
      unitNatureOptions:[],
      professionCodeOptions:[],
      politicalOptions: [],
      c_form:{
        maritalStatus:'',
        politicalStatus:'',
        memberType:'',
        isDirectParty:'',
        partyDoubleReport:'',
        educationLevel:'',
        personalStatus:'',
        professionCode:'',
        profession:'',
        stayReason:'',
        residenceType:'',
        unitNature:'',
        caringStaffType:'',
        companyName:'',
        residencePermitDate:'',
        residencePermitEnd:'',
        isFirstResidencePermit:'0',
        religion:''
      }
    }
  },
  computed:{
    isRequired(){
      return this.isInfo==='1'
    },
    dynamicRules(){
      return {
        maritalStatus: [
          {required: this.isRequired, message: '请选择婚姻状况', trigger: 'blur'}
        ],
        educationLevel: [
          {required: this.isRequired, message: '请选择文化程度', trigger: 'blur'}
        ],
        politicalStatus: [
          { required: this.isRequired, message: "请选择政治面貌", trigger: "change" }
        ],
        religion: [
          { required: this.isRequired, message: "请选择宗教信仰", trigger: "blur" }
        ],
        stayReason: [
          { required: this.isRequired, message: "请选择入住事由", trigger: "change" }
        ],
        isFirstResidencePermit: [
          { required: this.isRequired, message: "是否拥有居住证", trigger: "blur" }
        ],
        residencePermitDate: [
          { required: this.isRequired, message: "请选择有效期限", trigger: "change" },
        ],
        personalStatus: [
          { required: this.isRequired, message: "请选择工作状态", trigger: "blur" },
        ],
        professionCode: [
          { required: this.isRequired, message: "请选择或填写职业", trigger: "blur" },
        ],
        companyName: [
          { required: this.isRequired, message: "请输入单位名称/学校名称", trigger: "change" }
        ]
      }
    },
    caringStaffType:{
      set(arr){
        if(typeof(arr) == 'object' && arr.length>0){
          this.c_form.caringStaffType = arr.join(',')
        }
      },
      get(){
        let cs = this.c_form.caringStaffType
        if(typeof(cs) == 'string' && cs.length>0){
          return cs.split(',')
        }else{
          return []
        }
      }
    },
    politicalStatus:{
      set(arr){
        // console.log('arr',arr)
        if(typeof(arr) == 'object'){
          this.c_form.politicalStatus = arr[0] || ''
          if(arr[0]=='1'){
            this.c_form.memberType = arr[1]
          }
        }
      },
      get(){
        // console.log('politicalStatus',this.c_form.politicalStatus)
        // console.log('c_form',this.c_form)
        let arr = []
        arr[0] = this.c_form.politicalStatus
        if(arr[0]=='1'){
          arr[1] = this.c_form.memberType
        }

        return arr
      }
    },
    professionCode:{
      set(value){
        let i = parseInt(value);
        if(!isNaN(i)){
          this.c_form.professionCode = value
        }else{
          this.c_form.professionCode = '0'
          this.c_form.profession = value
        }
      },
      get(){
        if(this.c_form.professionCode == '0'){
          return this.c_form.profession
        }else{
          return this.c_form.professionCode || ''
        }
      }
    },
    residencePermitTime:{
      set(newValue){
        this.c_form.residencePermitDate = newValue?newValue[0]:''
        this.c_form.residencePermitEnd = newValue?newValue[1]:''
      },
      get(){
        return this.c_form.residencePermitDate? [this.c_form.residencePermitDate,this.c_form.residencePermitEnd]: []
      }
    }
  },
  methods:{
    handlePoliticalStatus() {
      this.isDeal = false
    },
    chgIsFirstResidencePermit () {
      this.residencePermitTime = ''
    },
    clearCompanyName(value){
      this.c_form.companyName = ''
    },
    handleValid(){
      let _valid
      this.$refs.c_form.validate(valid => {
        _valid = valid
      })

      return _valid
    },
  },
  created(){
    this.maritalStatusOptions = maritalStatusOptions
    this.politicalOptions = politicalOptions
    this.professionCodeOptions = professionCodeOptions
    this.educationOptions = educationOptions
    this.personalStatusOptions = personalStatusOptions
    this.stayReasonOptions = stayReasonOptions
    this.residenceTypeOptions = residenceTypeOptions
    this.caringStaffTypeOptions = caringStaffTypeOptions
    this.unitNatureOptions = unitNatureOptions
    this.religionOptions = religionOptions
    this.c_form = propertyClone(this.c_form, this.form);

  }
}
</script>

<style lang="scss" scoped>
  
/deep/.el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
    padding-top: 0px;
    line-height: 36px;
    font-size: 13px;
}
</style>
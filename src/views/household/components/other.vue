<template>
  <div>
    <slot></slot>
    <el-form ref="form" inline :model="form" :rules="dynamicRules" label-width="100px">
      <div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="婚姻状况" prop="maritalStatus">
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
          <el-col :span="8">
            <el-form-item label="文化程度" prop="educationLevel">
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
          <el-col :span="8">
            <el-form-item label="政治面貌" prop="politicalStatus">
              <el-select v-model="form.politicalStatus" filterable placeholder="请选择" clearable>
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
          <!-- <el-col :span="8">
            <el-form-item label="特殊人群类型" prop="caringStaffType">
              <el-select v-model="caringStaffType" multiple filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in caringStaffTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="宗教信仰" prop="religion">
              <el-select v-model="form.religion" filterable placeholder="请选择" clearable>
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="居住证" prop="isFirstResidencePermit">
              <el-radio-group v-model="form.isFirstResidencePermit">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-if="form.isFirstResidencePermit=='1'">
            <el-form-item label="有效期限" prop="residencePermitDate">
              <el-date-picker
                style="width:240px"
                v-model="residencePermitTime"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :default-time="['00:00:00','23:59:59']"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工作状态" prop="personalStatus">
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
          <el-col :span="8" v-if="form.personalStatus=='2'">
            <el-form-item label="职业" prop="professionCode">
              <el-select v-model="professionCode" filterable placeholder="若为其他职业可直接输入并选择" allow-create default-first-option clearable>
                <el-option
                v-for="item in professionCodeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.personalStatus=='4' || form.personalStatus=='2'">
            <el-form-item :label="form.personalStatus=='2'?'单位名称':'学校名称'" prop="companyName">
              <el-input v-model="form.companyName" filterable clearable placeholder="请输入"></el-input>
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
export default {
  props:['householdRole', 'isInfo'],
  data(){
    return {
      maritalStatusOptions:[],
      educationOptions:[],
      personalStatusOptions:[],
      stayReasonOptions:[],
      residenceTypeOptions:[],
      caringStaffTypeOptions:[],
      unitNatureOptions:[],
      professionCodeOptions:[],
      religionOptions:[],
      politicalOptions: [],
      form:{
        maritalStatus:'',
        politicalStatus:'',
        memberType:'isDirectParty',
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
      return this.isInfo === '1'
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
          this.form.caringStaffType = arr.join(',')
        }
      },
      get(){
        let cs = this.form.caringStaffType
        if(typeof(cs) == 'string' && cs.length>0){
          return cs.split(',')
        }else{
          return []
        }
      }
    },
    professionCode:{
      set(value){
        let i = parseInt(value);
        if(!isNaN(i)){
          this.form.professionCode = value
        }else{
          this.form.professionCode = '0'
          this.form.profession = value
        }
      },
      get(){
        if(this.form.professionCode == '0'){
          return this.form.profession
        }else{
          return this.form.professionCode
        }
      }
    },
    residencePermitTime:{
      set(newValue){
        this.form.residencePermitDate = newValue?newValue[0]:''
        this.form.residencePermitEnd = newValue?newValue[1]:''
      },
      get(){
        return this.form.residencePermitDate? [this.form.residencePermitDate,this.form.residencePermitEnd]: []
      }
    }
  },
  methods:{
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })

      return _valid
    },
  },
  watch:{
    'form.personalStatus': function(){
      this.form.companyName = ''
    }
  },
  mounted(){
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
  }
}
</script>
<style scoped>
</style>

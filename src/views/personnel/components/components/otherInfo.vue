<template>
  <div>
    <slot></slot>
    <el-form ref="form" inline :model="form" label-width="120px">
      <div>
        <div class="title">个人资料</div>
        <el-row>
          <el-col :span="10">
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
          <el-col :span="14">
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
            <el-select v-if="form.politicalStatus==1" v-model="form.memberType" class="mini-input" filterable placeholder="请选择" clearable>
              <el-option label="小区直管党员" value="isDirectParty"></el-option>
              <el-option label="党员双报到" value="partyDoubleReport"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
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
          <el-col :span="14">
            <el-form-item v-if="householdRole!='1'" label="与产权人关系" prop="relationship">
              <el-select v-model="form.relationship" filterable clearable>
                <el-option
                  v-for="item in relationshipOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">工作情况</div>
        <el-row>
          <el-col :span="10">
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
          <el-col :span="14" v-if="form.personalStatus=='2'">
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
            <el-input v-if="form.professionCode==='0'" v-model="form.profession" class="mini-input" filterable placeholder="请输入职业"></el-input>
          </el-col>
          <el-col :span="14" v-if="form.personalStatus=='4'">
            <el-form-item label="学校名称" prop="companyName">
              <el-input v-model="form.companyName" filterable placeholder="请输入学校名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.personalStatus=='2'">
          <el-col :span="10">
            <el-form-item label="单位性质" prop="unitNature">
              <el-select v-model="form.unitNature" filterable>
                <el-option
                  v-for="item in unitNatureOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="单位名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title">其他信息</div>
        <el-row v-if="householdRole==3">
          <el-col :span="10">
            <el-form-item label="入住事由" prop="stayReason" v-if="householdRole!='1'">
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
          <el-col :span="14">
            <el-form-item label="居住方式" prop="residenceType">
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
          <el-col :span="10">
            <el-form-item label="特殊人群类型" prop="caringStaffType">
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
      </div>
    </el-form>  
  </div>
</template>

<script>
import {maritalStatusOptions, politicalOptions, educationOptions, 
        personalStatusOptions, relationshipOptions, stayReasonOptions, 
        residenceTypeOptions, caringStaffTypeOptions, unitNatureOptions,
        professionCodeOptions} from "@/utils/options";
export default {
  props:['householdRole'],
  data(){
    return {
      maritalStatusOptions:[],
      politicalOptions:[],
      educationOptions:[],
      personalStatusOptions:[],
      relationshipOptions:[],
      stayReasonOptions:[],
      residenceTypeOptions:[],
      caringStaffTypeOptions:[],
      unitNatureOptions:[],
      professionCodeOptions:[],
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
        relationship:''
      }
    }
  },
  mounted(){
    this.maritalStatusOptions = maritalStatusOptions
    this.politicalOptions = politicalOptions
    this.professionCodeOptions = professionCodeOptions
    this.educationOptions = educationOptions
    this.personalStatusOptions = personalStatusOptions
    this.relationshipOptions = relationshipOptions
    this.stayReasonOptions = stayReasonOptions
    this.residenceTypeOptions = residenceTypeOptions
    this.caringStaffTypeOptions = caringStaffTypeOptions
    this.unitNatureOptions = unitNatureOptions
  }
}
</script>
<style scoped>
  .title{
    color: #333333;
    font-size: 18px;
    font-weight: 900;
    padding-left: 30px;
    line-height: 40px;
    margin-bottom: 10px;
  }
</style>

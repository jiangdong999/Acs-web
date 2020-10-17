<template>
  <div>
    <el-form ref="form" inline :model="form" :rules="rules" label-width="100px">
      <slot></slot>
      <div class="padding-content">
        <el-row>
          <el-col :span="12">
            <el-form-item label="住户类型" prop="householdType">
              <el-select v-model="form.householdType" filterable @change="$emit('changeHouseholdRole',$event)">
                <el-option value="1" label="产权人"/>
                <el-option value="2" label="家庭成员"/>
                <el-option value="3" label="承租人"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入" clearable type="tel" :maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>          
          <el-col :span="12">            
            <el-form-item v-if="form.householdType=='2'" label="与产权人关系" prop="relationship">
              <el-select v-model="form.relationship" filterable clearable>
                <el-option
                  v-for="item in relationshipOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="有效时长" prop="leaseType" v-if="form.householdType=='3'">
              <el-select v-model="form.leaseType" filterable @change="changeLeaseTime($event)">
                <el-option value="3" label="3个月"/>
                <el-option value="6" label="6个月"/>
                <el-option value="12" label="12个月"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.householdType==3">
            <el-form-item label="有效期至" prop="leaseEndTime">
              <el-date-picker
                v-model="form.leaseEndTime" type="date"
                :picker-options="beforePickerOptions2()"
                format="yyyy-MM-dd"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前产权人" prop="phone">
              <span>{{householdName ? householdName : '无'}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import {beforePickerOptions2} from "@/utils/validate";
import dateUtil from "@/utils/times";
import {relationshipOptions} from "@/utils/options";
import {validateNumber} from "@/utils/rules"
import { getHouseholdName } from "@/api/household";

export default {
  // props: {
  //   householdName: {
  //     type: String,
  //     default: ()=>{
  //       return ''
  //     }
  //   }
  // },
  created () {
    this.addHousehold = JSON.parse(localStorage.getItem('addHousehold'))
    this.getHouseholdName()
  },
  data(){
    return {
      addHousehold:{},
      relationshipOptions,
      householdName: '',
      form:{
        phone:'',
        relationship:'',
        householdType:'1',
        leaseType:'',
        leaseEndTime: new Date(),
      },
      rules: {
        householdType: [
          {required: true, message: '请选择住户类型', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请选择租客有效期', trigger: 'change'}
        ],
        phone: [
          { min: 11, max: 11, message: '请填入正确的长度为11的联系方式' },
          { message: '请填入正确的联系方式',validator: validateNumber}
        ],
      },
    }
  },
  methods:{
    beforePickerOptions2,
    changeLeaseTime($event){
      let time = new Date()
      this.form.leaseEndTime = time.getTime() + 3600 * 1000 * 24 * 30 * $event
    },
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })
      
      return _valid
    },
    getHouseholdName () {
      let data = {
        roomNodeId: this.addHousehold.roomNodeId
      }
      let _this = this
      getHouseholdName(data).then(function (response) {
        if(response.data && response.data.code==1){
          if(response.data.data.householdName){
            _this.householdName = response.data.data.householdName
          }else{
            _this.householdName = ''
          }
        }
      }).catch(function (a) {
        console.error(a)
      })
    },
  }
}
</script>

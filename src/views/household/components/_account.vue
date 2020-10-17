<template>
  <div>
    <el-form ref="form" inline :model="c_form" :rules="c_rules" label-width="100px" class="form-box">
      <slot></slot>
      <div class="padding-content">
        <el-row>
          <el-col :span="8">
            <el-form-item label="住户类型" prop="householdType">
              <el-select v-model="c_form.householdType" filterable @change="$emit('changeHouseholdRole',$event)">
                <el-option value="1" label="产权人"/>
                <el-option value="2" label="家庭成员"/>
                <el-option value="3" label="承租人"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="c_form.phone" placeholder="请输入" clearable type="tel" :maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="c_form.householdType=='2'">
            <el-form-item label="与产权人关系" prop="relationship">
              <el-select v-model="c_form.relationship" filterable clearable>
                <el-option
                  v-for="item in relationshipOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="c_form.householdType=='3'">
            <el-form-item label="有效期至" prop="leaseEndTime">
              <el-date-picker
                v-model="c_form.leaseEndTime" type="date"
                :picker-options="beforePickerOptions2()"
                format="yyyy-MM-dd"
                disabled
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-button type="text" @click="handleEdit(c_form)">续期</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div v-if="showRenewal">
      <el-dialog
        title="租户续期"
        :visible.sync="showRenewal"
        width="1000px"
        top="5vh"
        :close-on-click-modal="false">
        <renewal :data="{...formData, fullNodeName:fullNodeName}" @submitSuccess="handleClose"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {beforePickerOptions2} from "@/utils/validate";
import dateUtil from "@/utils/times";
import {relationshipOptions} from "@/utils/options";
import {propertyClone} from "@/utils/index";
import renewal from "../renewal.vue";
import {validateNumber} from "@/utils/rules"

export default {
  props:['form', 'fullNodeName', 'isSensitive'],
  components:{
    renewal
  },
  data(){
    return {
      showRenewal: false,
      btnLoading:false,
      relationshipOptions,
      formData:{},
      c_form:{
        householdType:'',
        phone:'',
        relationship:'',
        LeaseTime:'',
        leaseEndTime:'',
      }    
    }
  },
  computed: {
    c_rules(){
      return {
        householdType: [
          {required: true, message: '请选择住户类型', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请选择租客有效期', trigger: 'blur'}
        ],
        phone: [
          { min: 11, max: 11, message: '请填入正确的长度为11的联系方式' },
          { message: '请填入正确的联系方式',validator: validateNumber}
        ],
      }    
    }
  },
  methods:{   
    beforePickerOptions2,
    changeLeaseTime($event){
      let time = new Date()
      this.c_form.leaseEndTime = time.getTime() + 3600 * 1000 * 24 * 30 * $event
    },
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })

      return _valid
    },
    //续期
    handleEdit(data){
      console.log();
      this.formData = { ...this.form }
      if(this.formData.leaseEndTime !=''){
        this.formData.leaseEndTime = data.leaseEndTime
      } else{
        this.$message.error('到期时间数据错误')
      }
      this.showRenewal = true
    },
    handleClose(data){
      this.showRenewal = false
      this.c_form.leaseEndTime = data
      this.formData.leaseEndTime = data
      this.$emit('reloadData')
    }
  },
  mounted(){
    this.c_form.leaseEndTime = new Date().getTime()
  },
  created(){
    this.c_form = propertyClone(this.c_form, this.form);
  }
}
</script>
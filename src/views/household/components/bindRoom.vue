<template>
  <el-form ref="form" inline label-position="top" :model="form" :rules="rules">
    <div class="header">
      <label>{{household.householdName}} {{household.phoneNumber}}</label>
      <!-- <span class="control-right">
        <el-checkbox v-model="form.checkedValidEnd">使用已有人脸</el-checkbox>
      </span> -->
    </div>

    <div class="bindRoom">
      <el-form-item label="选择房间" prop="roomNodeId">
            <div>
              <el-popover
              placement="bottom"
              width="300"
              ref="popover"
              popper-class="popper-shadow"
              v-model="popoverShow"
              trigger="click">
                <el-input
                  placeholder="输入关键字进行过滤"
                  class="mb-5"
                  v-model="filterText">
                </el-input>
                <el-tree 
                class="tree-node" 
                ref="tree"
                :data="nodeOptions" 
                accordion 
                :props="defaultProps" 
                lazy 
                :load="loadNode" 
                empty-text="无此节点"
                @node-click="handleNodeClick"
                :filter-node-method="filterNode">
                </el-tree>
              </el-popover>
            </div>
            <el-input
            v-model="form.room"
            @clear.stop="clearRoom"
            suffix-icon="el-icon-arrow-down"
            v-popover:popover
            placeholder="请选择房间"
            clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="住户类型" prop="householdType">
            <el-select v-model="form.householdType" filterable>
              <el-option value="1" label="产权人"/>
              <el-option value="2" label="家庭成员"/>
              <el-option value="3" label="承租人"/>
            </el-select>
          </el-form-item>
      <el-row v-if="form.householdType=='3'">
          <el-form-item label="有效时长" prop="LeaseTime">
            <el-select v-model="form.LeaseTime" filterable @change="changeLeaseTime($event)">
              <el-option value="3" label="3个月"/>
              <el-option value="6" label="6个月"/>
              <el-option value="12" label="12个月"/>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-if="form.householdType=='3'">
          <el-form-item label="有效期至" prop="leaseEndTime">
            <el-date-picker
              v-model="form.leaseEndTime" type="date"
              :picker-options="beforePickerOptions2()"
              format="yyyy-MM-dd"
              value-format="yyyyMMdd235959999">
            </el-date-picker>
          </el-form-item>
      </el-row>
      <el-form ref="cardForm" :model="form.cardList[0]" inline label-width="100px">
        <el-form-item label="门卡类型">
            <el-select v-model="form.cardList[0].cardClass" filterable placeholder="请选择卡类型">
              <el-option value="1" label="IC卡"/>
              <el-option value="2" label="身份证"/>
              <el-option value="3" label="ID卡"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="cardNo" label="门卡号码" :rules="cardRules.cardNo" v-if="form.cardList[0].cardClass!=='2'">
            <el-input v-model="form.cardList[0].cardNo" clearable placeholder="请输入卡号" maxlength="8" :type="pswVisibility?'type':'password'">
              <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
            </el-input>
            <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
          </el-form-item>
          <el-form-item prop="cardNo" label="门卡号码" v-else-if="form.cardList[0].cardClass==='2'" :rules="cardRules.cardNo2">
            <el-input v-model="form.cardList[0].cardNo" clearable placeholder="请输入卡号" maxlength="16" :type="pswVisibility?'type':'password'">
              <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
            </el-input>
            <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
          </el-form-item>
          <el-checkbox 
          v-model="form.cardList[0].specialCard" 
          true-label="1"
          false-label="0">
          特殊卡
          </el-checkbox>
      </el-form>
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
        </el-col>
      </el-row>
    </div>
    <div class="form-dialog-control-area">
      <el-button type="primary" :loading="btnLoading" @click="handleSubmit">确认</el-button>
    </div>
  </el-form>
</template>

<script>
  // import {dropdownNodeComplex} from "@/api/node";
  import {dropdownNodeComplex} from "@/api/nodev1";
  import { mapGetters } from 'vuex';
  import dateUtil from "@/utils/times";
  import {beforePickerOptions2} from "@/utils/validate";
  import {relationshipOptions} from "@/utils/options";
  import { validateHexadecimal } from "@/utils/rules";
  // import { addOtherRoom } from "@/api/household";
  import { addOtherRoom } from "@/api/householdv1";

export default {
  props:['household'],
  data(){
    return {
      btnLoading: false,
      pswVisibility:false,
      popoverShow:false,
      defaultProps: {
        children: "children",
        label: "fullNodeName",
        isLeaf: 'leaf'
      },
      nodeOptions: [],
      filterText:'',
      form:{
        householdType:'1',
        leaseEndTime:'',
        relationship:'',
        cardList:[
          {
            cardClass: '1',
            cardNo:'',
            specialCard:''
          }
        ],
        roomNodeId:null,
        room:'',
      },
      rules:{
        roomNodeId: [
          {required: true, message: '请选择房间', trigger: 'change'}
        ],
        householdType: [
          {required: true, message: '请选择住户类型', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请选择租客有效期', trigger: 'blur'}
        ]
      },
      cardRules:{
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: '请输入正确的门禁卡卡号', validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ]
      },
      relationshipOptions,
    }  
  },
  watch: {
    'filterText':function(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods:{
    beforePickerOptions2,
    filterNode(value, data) {
      if (!value) return true;
      return data.fullNodeName.indexOf(value) !== -1;
    },
    loadNode(node, resolve) {
      if(node.data.children && node.data.children.length>0){
         let data = node.data.children
         for(let item of data){
           if(item.children.length == 0){
             item.leaf = true
           }
         }
         resolve(data)
      }else{
        resolve([]);
      }
    },
    handleNodeClick(data) {
      if (data.level=='6' && data.nodeType=='R') {
        this.form.roomNodeId = data.id;
        this.form.room = data.fullNodeName;
        this.popoverShow = data.children?data.children.length>0:false
        this.form.nodeUuid = data.nodeUuid
      }

      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        });
      }
    },
    clearRoom:function(){
      this.form.roomNodeId = '';
      this.form.room = '';
      this.form.nodeUuid = '';
    },
    initNode: function (communityUuid) {
      
      let self = this;
      if (communityUuid) {
        dropdownNodeComplex({communityUuid: communityUuid}).then(function (response) {
          if (response && response.data) {
            self.nodeOptions = [response.data.content];
          }
        }).catch(function (a) {
          console.error(a)
        });
      }
    },
    changeLeaseTime($event){
      let time = new Date()
      time.setTime(time.getTime() + 3600 * 1000 * 24 * 30 * $event)
      this.form.leaseEndTime = dateUtil.byPattern(time,"YYYYMMDD235959999")
    },
    handleSubmit(){
      this.$refs.form.validate(valid=>{
        
        if(valid){
          this.btnLoading = true
          let formData = {
            ...this.form,
          }
          formData.householdUuid = this.household.householdUuid
          formData.nodeUuid =  this.form.nodeUuid
          formData.communityId = this.$route.query.communityId
          formData.householdId = this.household.householdId
          formData.householdName = this.household.householdName
          formData.phoneNumber = this.household.phoneNumber
          formData.citizenId = this.household.citizenId
          if (formData.householdType=='3') {
            formData.leaseStartTime = dateUtil.byPattern(new Date(), "YYYYMMDD000000000");
          }else{
            formData.leaseStartTime = '';
            formData.leaseEndTime = '';
          }

          let self = this
          addOtherRoom(formData).then(function (response) {
            if(response.data && response.data.status==0){
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.$parent.$parent.handleClose()
            }
          }).catch(function (a) {
            console.error(a)
          }).finally(_=>{
            self.btnLoading = false
          })

        }
      })
    },
  },
  mounted(){
    this.initNode(this.household.communityUuid)
  }
}
</script>
<style lang="scss" scoped>
  .header{
    font-size: 16px;
    margin-bottom: 30px;
  }
/deep/.el-form-item--medium .el-form-item__label{
  line-height: 12px;
}

.iconfont{
  top:13px
}
</style>
<style lang="">
.bindRoom .el-input {
    width: 300px;
}
</style>

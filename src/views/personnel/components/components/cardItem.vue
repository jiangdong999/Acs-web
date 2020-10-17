<template>
  <!-- @submit.native.prevent 因为form没有submit按钮，防止键入回车符使页面跳转刷新 -->
  <el-form ref="form" :rules="rules" :model="{cardNo: cardNo, room: form.room}" label-width="120px" @submit.native.prevent>
    <el-card class="box-card" shadow="always">
      <slot></slot>
      <el-form-item label="授权房产">
        <label>{{form.room}}</label>
      </el-form-item>
      <el-form-item label="门禁卡发卡" prop="cardNo">
        <el-input :maxlength="8" clearable :value="cardNo" @input="$emit('update:cardNo',$event)" placeholder="IC卡 / ID卡"/>
        <div class="tips">提示：门禁卡有效期限未设定的情况下默认为永久有效</div>
      </el-form-item>
    </el-card>
  </el-form>
</template>

<script>
import { dropdownCommunity } from "@/api/community";
import { dropdownList } from "@/api/property";
import { dropdownNodeComplex } from "@/api/node";
import { validateHexadecimal } from "@/utils/rules";
import {mapGetters} from 'vuex'

export default {
  props:['roomId','cardNo','disabled','node'],
  data(){
    return {
      popoverShow: false,
      propertyList:[],
      communityList:[],
      roomOptions:[],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      rules:{
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal}
        ]
      },
      form:{
        propertyId:null,
        communityId:null,
        room:''
      }
    }
  },
  methods:{
    initPropertyList: function() {
      let self = this;
      dropdownList()
        .then(function(response) {
          if (response && response.data) {
            self.propertyList = response.data.dataList;
            if(self.node!=null && self.disabled){
              self.form.propertyId = self.node.propertyId;
              self.initCommunity(self.node.propertyId)
            }
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    initCommunity: function(data) {
      let self = this;
      if (data) {
        self.form.communityId='';
        self.roomOptions = [];
        dropdownCommunity({ propertyId: data })
          .then(function(response) {
            if (response && response.data) {
              self.communityList = response.data.dataList;
              if(self.node!=null && self.disabled){
                self.form.communityId = self.node.communityId;
                self.initNode(self.node.communityId)
              }
            }
          })
          .catch(function(a) {
            console.error(a);
          });
      }
    },
    initNode: function (data) {
      let self = this;
      if (data) {
        self.$emit('update:roomId',null)
        self.form.room = '';
        dropdownNodeComplex({communityId: data}).then(function (response) {
          if (response && response.data) {
            self.roomOptions = response.data.dataList;
            if(self.node!=null && self.disabled){
              self.$emit('update:roomId',self.node.id)
              self.form.room = self.node.nodeLabel;
            }
          }
        }).catch(function (a) {
          console.error(a)
        });
      }
    },
    loadNode(node, resolve) {

      if(node.data.children && node.data.children.length>0){
        let data = node.data.children

        for(let children of data){
          children.leaf = !children.disabled
        }
        resolve(data);
      }
    },
    handleNodeClick(data) {
      if (!data.disabled && data.parentId != -1) {
        this.$emit('update:roomId',data.value)
        this.form.room = data.nodeLabel;
        this.popoverShow = data.disabled 
      }
      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        });
      }
    },
    handleSubmit: function(){
      let result;
      this.$refs.form.validate((valid)=>{
        result=valid
      })
      
      return result
    },
  },
  mounted:function(){
    this.initPropertyList()
  }
}
</script>
<style scoped>
  .tips{
    color: #999999;
    font-size: 12px;
  }
</style>

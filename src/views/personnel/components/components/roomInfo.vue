<template>
  <div>
    <slot></slot>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="roomNode">
      <el-form-item prop="roomNodeId" label="所属房间">
        <div style="white-space:nowrap">
          <el-popover
          placement="bottom"
          width="300"
          popper-class="popper-shadow"
          v-model="popoverShow"
          trigger="click">
            <el-tree class="tree-node" :data="roomOptions" accordion :props="defaultProps" :load="loadNode" @node-click="handleNodeClick"></el-tree>
            <!-- <el-input
            v-model="form.room"
            placeholder="请选择所属房间"
            slot="reference"
            @clear.stop="clearRoom"
            clearable>
            </el-input> -->
            <span class="primary-button" slot="reference">请选择所属房间</span>
          </el-popover>
          <label style="margin-left:20px">{{form.room}}</label>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dropdownNodeComplex } from "@/api/node";
import {mapGetters} from 'vuex'

export default {
  // communityId加载指定小区节点；isIdCard用于返回身份证信息是否必填标志 
  props:['communityId','isIdcard','assignNode'],
  computed:{
    ...mapGetters([
      'node'
    ]),
  },
  data(){
    return {
      popoverShow:false,
      roomOptions:[],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      form:{
        room:'',
        roomNodeId:null
      },
      rules: {
        roomNodeId: [
          {required: true, message: '请选择所属房间', trigger: 'change'}
        ]
      }
    }
  },
  methods:{
    initNode: function (data, initDropdown) {
      let self = this;
      if (data) {
        self.roomOptions = [];
        dropdownNodeComplex({communityId: data}).then(function (response) {
          if (response && response.data) {
            self.roomOptions = response.data.dataList;

            if(!(self.assignNode==null || self.assignNode=={}) && initDropdown){
              if(self.assignNode.type=='R'){
                self.form.roomNodeId = self.assignNode.roomNodeId;
                self.form.room = self.assignNode.nodeLabel;
                self.$emit('changeNode', self.form.roomNodeId)
              }
            }
            self.$emit('update:isIdcard', self.roomOptions[0].isIdcard || '1')
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
        this.form.roomNodeId = data.value;
        this.form.room = data.nodeLabel;
        this.popoverShow = data.disabled;
        this.$emit('update:isIdcard', data.isIdcard || '1')
        this.$emit('changeNode', this.form.roomNodeId)
      }
      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        });
      }
    },
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })

      return _valid
    }
  },
  mounted(){
    this.initNode(this.communityId, true)
  }
}
</script>
<style>
  .roomNode .el-form-item__content{
    margin-left: 0 !important;
  }
  .primary-button{
    border-radius: 5px;
    background-color: #007ee4;
    color: #fff;
    padding: 10px 20px;
    cursor: pointer;
    transition: all .3s;
  }
  .primary-button:hover{
    opacity: 0.7;
  }
  .primary-button:active{
    border: none;
  }
</style>

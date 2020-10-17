<template>
  <div v-loading="loading">
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="所属小区" prop="communityId">
        <el-select v-model="currentCommunity" placeholder="选择所属小区" clearable filterable value-key="communityId" @change="initNode($event)">
          <el-option
            v-for="item in communityList"
            :key="item.communityId"
            :label="item.communityName"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备位置" prop="nodeId">
        <el-popover
          placement="right"
          v-model="popoverShow"
          popper-class="popper-shadow"
          width="300"
          :visible-arrow="false"
          trigger="click">
            <el-tree class="tree-node" :data="nodeOptions" accordion :props="defaultProps" lazy :load="loadNode" @node-click="handleNodeClick"></el-tree>
            <el-input
              v-model="form.room"
              slot="reference"
              @clear.stop="clearRoom"
              clearable>
            </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="设备名称" prop="wirelessName">
        <el-input type="text" v-model="form.wirelessName" :maxlength="20" placeholder="请输入设备名称" clearable/>
      </el-form-item>
      <!-- <el-form-item label="设备编号" prop="wirelessDeviceId">
        <el-input type="text" v-model="form.wirelessDeviceId" :maxlength="15" placeholder="请输入设备编号" clearable/>
      </el-form-item>
      <el-form-item label="通讯类型" prop="wirelessType">
        <el-select v-model="form.wirelessType" clearable>
          <el-option
            v-for="item in wirelessTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { dropdownNodeTree } from "@/api/node";
import { validateNumberAndLetter, validateMobile } from "@/utils/rules";
import { modifyDevice } from "@/api/smoke"

export default{
  props: {
    rowData: {
      type: Object,
      default: {}
    },
  },
  computed: {
    ...mapGetters([
      'communityList'
    ]),
    currentCommunity:{
      set(community){
        community = community || {}
        this.form.communityId = community.communityId
        this.form.propertyId = community.propertyId
        this.form.communityName = community.communityName
      },
      get(){
        return {
          communityId: this.form.communityId,
          propertyId: this.form.propertyId,
          communityName: this.form.communityName
        }
      }
    }
  },
  created () {
    for(let key in this.form){
      this.form[key] = this.rowData[key]
    }
    this.form.room = this.rowData.fullNodeName
  },
  data () {
    return {
      loading: false,
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      form: {
        communityId: null,
        nodeId: null,
        room:'',
        wirelessName: '',
        // wirelessType: null,
        wirelessDeviceId: ''
      },
      // wirelessTypeList: [
      //   { value: 0, label: 'LoRaWan' },
      //   { value: 1, label: '电信 NB-IOT' },
      //   { value: 2, label: '移动 NB-IOT' }
      // ],
      nodeOptions: [],
      popoverShow: false,
      rules: {
        communityId: [
          {required: true, message: '请选择所属小区', trigger: 'change'}
        ],
        nodeId: [
          {required: true, message: '请选择设备位置', trigger: 'change'}
        ],
        wirelessName: [
          {required: true, message: '请输入设备名称', trigger: 'blur'}
        ],       
        // wirelessDeviceId: [
        //   {required: true, message: '请输入设备编号', trigger: 'blur'},
        //   {message: '请输入数字与字母，不能输入其他字符', validator: validateNumberAndLetter}
        // ],
        // wirelessType: [
        //   {required: true, message: '选择通讯类型', trigger: 'change'}
        // ]
      }
    }
  },
  methods: {
    loadNode(node, resolve) {

      if(node.data.children && node.data.children.length>0){
        let data = node.data.children

        for(let children of data){
            children.leaf = !children.children || false
        }
        resolve(data)
      }else{
        resolve([])
      }

    },
    handleNodeClick(data) {
      this.form.nodeId = data.value;
      this.form.room = data.nodeLabel;
      this.popoverShow = data.children?data.children.length>0:false

      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        });
      }
    },
    clearRoom:function(){
      this.form.nodeId = ''
      this.form.room = ''
    },
    initNode: function ({communityId}) {
      this.form.nodeId = ''
      this.form.room = ''
      
      let self = this;
      if (communityId) {
        dropdownNodeTree({communityId: communityId}).then(function (response) {
          if (response && response.data) {
            self.nodeOptions = response.data.dataList;
          }
        }).catch(function (a) {
          console.error(a)
        });
      }
    },
    handleSubmit: function (formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true;
          modifyDevice(_this.form).then(function (response) {
            if (response.data && response.data.code === 1) {
              _this.$message({
                message: response.data.message,
                type: 'success'
              });
              _this.$emit('submit');
            }
          }).catch(function (a) {
            console.error(a)
          }).finally(_=>{
            _this.loading = false;
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      })
    },
    handleClose: function () {
      this.$parent.handleClose()
    }
  }
}
</script>

<style>
</style>
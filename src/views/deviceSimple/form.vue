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
      <el-form-item label="设备名称" prop="doorName">
        <el-input type="text" v-model="form.doorName" :maxlength="20" placeholder="请输入门禁机名称" clearable/>
      </el-form-item>
      <el-form-item label="设备编号" prop="doorDeviceId">
        <el-input type="text" v-model="form.doorDeviceId" :maxlength="32" placeholder="请输入设备编号" clearable/>
      </el-form-item>
      <el-form-item label="门禁机位置" prop="nodeId">
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
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {dropdownNodeTree} from "@/api/node";
  import {saveDevice} from "@/api/device";
  import "@riophae/vue-treeselect/dist/vue-treeselect.min.css";
  import {validateNumberAndLetter, validateMobile} from "@/utils/rules";
  import { mapGetters } from 'vuex';

  export default {
    name: "device-form",
    computed:{
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
    data() {
      return {
        popoverShow:false,
        loading: false,
        form: {
          communityId:'',
          nodeId: null,
          room:'',
          maintenanceNumber: '',
          doorDeviceId: '',
          buildingUse: '',
        },
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: 'leaf'
        },
        nodeOptions: [],
        rules: {
          communityId: [
            {required: true, message: '请选择需要添加的小区', trigger: 'change'}
          ],
          doorName: [
            {required: true, message: '请输入门禁机名称', trigger: 'blur'}
          ],
          nodeId: [
            {required: true, message: '请选择门禁机位置', trigger: 'change'}
          ],
          doorDeviceId: [
            {required: true, message: '请输入设备编号', trigger: 'blur'},
            {message: '请输入数字与字母，不能输入其他字符', validator: validateNumberAndLetter}
          ],
          maintenanceNumber: [
            {required: true, message: '请输入管理处负责人电话', trigger: 'blur'},
            {message: '请输入正确的手机号', validator: validateMobile}
          ]
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
          resolve(data);
        }else{
          resolve([]);
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
        this.form.nodeId = '';
        this.form.room = '';
      },
      initNode: function ({communityId}) {
        this.form.nodeId = '';
        this.form.room = '';

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
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.loading = true;
            saveDevice(self.form).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
                self.$emit('submit');
              }
            }).catch(function (a) {
              console.error(a)
            }).finally(_=>{
              self.loading = false;
            });
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      handleClose: function () {
        this.$parent.handleClose();
      }
    }
  }
</script>

<style scoped>

</style>

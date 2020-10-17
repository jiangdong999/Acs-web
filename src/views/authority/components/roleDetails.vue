<template>
  <div>
    <div class="header">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
      <span>角色详情</span>
      <span class="control-right">
        <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
      </span>
    </div>
    <div class="content" v-loading="loading">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="所属机构">
              <strong>&emsp;{{form.orgName}}</strong>
            </el-form-item>
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" maxlength="10" clearable placeholder="请填写角色名称" style="width:200px"/>
              <!-- <el-checkbox v-model="checked" style="margin-left:20px">通用角色</el-checkbox> -->
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input 
              v-model="form.description" 
              type="textarea"
              :maxlength="100"
              :rows="5"
              clearable 
              style="width:80%"
              placeholder="请填写角色名称，字数限100字以内"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="right-view">
              <el-tree
                v-if="!loading"
                ref="tree"
                :data="menuTree"
                show-checkbox
                node-key="id"
                :check-on-click-node="true"
                :default-expand-all="true"
                :default-checked-keys="defaultCheckedKeys"
                :props="defaultProps">
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updateRole, roleDetails } from '@/api/authority'

export default {
  data(){
    return {
      loading:false,
      isPublic:'',
      form:{
        orgName:'',
        roleName:'',
        description:'',
      },
      rules:{
        orgId: [
          {required: true, message: '请选择所属机构', trigger: 'blur'},
        ],
        roleName: [
          {required: true, message: '请填写角色名称', trigger: 'blur'},
          { min: 2, max: 10,  message: '请输入2-20的字符' }
        ]
      },
      menuTree: [],
      defaultCheckedKeys:[],
      defaultProps: {
        children: 'children',
        label: 'menuName',
        disabled: ()=>{
          return this.isPublic == '1'
        }
      },
    };
  },
  methods:{
    loadDeatils() {
      this.loading = true
      roleDetails({
        id: this.$route.query.id
      }).then(response => {
        if (response.data && response.data.code === 1) {
          const data = response.data.data
          this.form.roleName = data.roleName
          this.form.orgName = data.orgName
          this.form.description = data.description
          this.isPublic = data.isPublic
          this.menuTree.push(data.permissionTree)
          // this.$refs.tree.setCheckedKeys(data.permissionIdList)
          this.defaultCheckedKeys = data.permissionIdList
        }
      }).finally(_=>{
        this.loading = false
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if(valid){
          this.loading = true
          let permissionIdList = this.$refs.tree.getCheckedKeys()
          updateRole({
            ...this.form,
            id: this.$route.query.id,
            permissionIdStr: permissionIdList.toString(permissionIdList)
          }).then(response => {
            if (response.data && response.data.code === 1) {
              this.$message.success(response.data.message)
              this.$router.back()
            }
          }).finally(_=>{
            this.loading = false
          })
        }
      })
    }
  },
  mounted(){
    this.loadDeatils()
  }
}
</script>

<style scoped>
  .header{
    line-height: 70px;
    padding: 0 30px;
    background-color: #fff;
    font-weight: 900;
    cursor: default;
  }
  .content{
    margin-top: 12px;
    padding: 30px;
    background-color: #fff;
    position: relative;
  }
  /* .left-view{
    width: 360px;
    position: absolute;
    left: 30px;
    top: 30px;
    background-color: #000;
    height: 300px
  } */
  .right-view{
    height: 70vh;
    overflow-y: scroll;
  }
</style>
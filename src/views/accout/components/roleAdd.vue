<template>
  <div>
    <div class="header">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
      <span>新增角色</span>
      <span class="control-right">
        <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
      </span>
    </div>
    <div class="content">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-row :gutter="30">
          <el-col :span="12">
            <div class="org">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" maxlength="10" clearable placeholder="请填写角色名称" style="width:200px"/>
              </el-form-item>
            </div>
            <el-form-item label="角色描述" prop="description">
              <el-input 
              v-model="form.description" 
              type="textarea"
              :maxlength="50"
              :rows="5"
              clearable 
              style="width:80%"
              placeholder="请填写角色描述，字数限50字以内"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="right-view" v-loading="loading">
              <el-tree
                ref="tree"
                :data="menuTree"
                show-checkbox
                node-key="id"
                :check-on-click-node="true"
                :default-expand-all="true"
                :props="defaultProps"
                >
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getPermission } from '@/api/loginv1'
import { creatRole } from '@/api/authorityv1'

export default {
  data(){
    return {
      loading:false,
      form:{
        roleName:'',
        description:'',
      },
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      rules:{
        roleName: [
          {required: true, message: '请填写角色名称', trigger: 'blur'},
          { min: 2, max: 10,  message: '请输入2-20的字' }
        ],
        description: [
          {required: true, message: '请填写角色描述', trigger: 'blur'},
          { min: 2, max: 50,  message: '请输入2-50的字' }
        ]
      },
    }
  },
  // created () {
  //   let data = this.$route.query
  //   this.form.orgId = data.orgId
  //   this.form.orgName = data.orgName
  // },
  methods:{
    getMenuTree() {
      getPermission().then(response => {
        if (response.data && response.data.status === 0) {
          const data = response.data.content
          if (data.children.length===0){
            Message({
              message: '帐号没有菜单权限',
              type: 'error',
              duration: 5 * 1000
            })
          }else{
            this.menuTree.push(data)
          }
        }
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if(valid){
          this.loading = true
          let permissionIdList = this.$refs.tree.getCheckedKeys()
          creatRole({
            ...this.form,
            menuIds: permissionIdList
          }).then(response => {
            if (response.data && response.data.status === 0) {
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
    this.getMenuTree()
  }
}
</script>

<style lang="scss" scoped>
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
  .right-view{
    height: 70vh;
    overflow-y: scroll;
  }
  
</style>
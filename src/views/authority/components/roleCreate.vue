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
              <el-form-item label="所属机构" prop="orgId">
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
                      v-model="filterText"
                      clearable
                      >
                    </el-input>
                    <el-tree 
                      class="tree-node"
                      ref="treeOrg"
                      :data="orgTree" 
                      accordion 
                      :props="props" 
                      :load="loadNode" 
                      empty-text="无此节点"
                      @node-click="handleNodeClick"
                      :filter-node-method="filterNodeMethod"
                      >
                    </el-tree>
                  </el-popover>
                </div>
                <el-input
                  class="widen-input"
                  placeholder="所属机构"
                  v-model="form.orgName"
                  v-popover:popover          
                  suffix-icon="el-icon-arrow-down">
                </el-input>
              </el-form-item>
            </div>
            <!-- <el-form-item label="所属机构" prop="orgId">
              <el-cascader
                :options="orgTree"
                v-model="orgId"
                :change-on-select="true"
                clearable
                filterable
                :show-all-levels="false"
                popper-class="cascader-style"
                :props="props">
              </el-cascader>
            </el-form-item> -->
            <div class="org">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" maxlength="10" clearable placeholder="请填写角色名称" style="width:200px"/>
              </el-form-item>
            </div>
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
            <div class="right-view" v-loading="loading">
              <el-tree
                ref="tree"
                :data="menuTree"
                show-checkbox
                node-key="id"
                :check-on-click-node="true"
                :default-expand-all="true"
                :default-checked-keys="[5]"
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
import { getPermission } from '@/api/login'
import { creatRole, loadTopOrgTree } from '@/api/authority'

export default {
  data(){
    return {
      loading:false,
      form:{
        orgId:null,
        roleName:'',
        description:'',
        orgName: '',
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
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      props: {
        label:'orgName',
        children: 'children'
      },
      orgTree:[],
      popoverShow:false,
      filterText: '',
    }
  },
  watch:{
    'filterText': function(val) {
      this.$refs.treeOrg.filter(val)
    }
  },
  created () {
    let data = this.$route.query
    this.form.orgId = data.orgId
    this.form.orgName = data.orgName
  },
  methods:{
    // clearOrg (){
    //   this.form.orgId = ''
    //   this.form.orgName = ''     
    // },
    filterNodeMethod (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    initNode () {
      let self = this
      // self.clearOrg()
      loadTopOrgTree({}).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.orgTree = [response.data.data]
        }
      }).catch(function (a) {
        console.error(a)
      })
    },
    loadNode(node, resolve) {
      if(node.data.children && node.data.children.length>0){
        let data = node.data.children

        for(let children of data){
          children.leaf = !children.disabled
        }
        resolve(data)
      }
    },
    handleNodeClick(data) {
      this.filterText = ''
      this.form.orgId = data.id
      this.form.orgName = data.orgName
      this.popoverShow = false
      this.$refs['form'].validateField('orgId')
      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        })
      }
    },
    getMenuTree() {
      getPermission().then(response => {
        if (response.data && response.data.code === 1) {
          const data = response.data.data
          if (data.menuTree.childList.length===0){
            Message({
              message: '帐号没有菜单权限',
              type: 'error',
              duration: 5 * 1000
            })
          }else{
            this.menuTree.push(data.menuTree)
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
    this.getMenuTree()
    this.initNode()
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
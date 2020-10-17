<template>
  <div class="org-info">
    <div class="header">
      <label class="el-icon-arrow-left back" @click="$router.back()" v-if="showBack">返回</label>
      <span>机构信息</span>
      <span class="control-right">
        <el-button type="primary" icon="el-icon-plus" @click="showOperator=true">新增操作人员</el-button>
      </span>
    </div>
    <div class="org-content clearfix">
      <div class="left-view" v-loading="loadingTree">
        <el-input
          style="margin-bottom: 30px;"
          placeholder="搜索机构"
          class="mb-5"
          clearable
          v-model="filterText">
        </el-input>
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :expand-on-click-node="false"
          :default-expanded-keys="[1]"
          @node-click="handleLoad"
          :filter-node-method="filterNode">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span class="text-name">{{ data.orgName }}</span>
            <span class="org-btn">
              <div>
                <span
                  class="node-ctrl"
                  @click.stop="submit(node)">
                  新增
                </span>
              </div>
              <div>
                <span
                  v-if="data.parentId!=treeData[0].parentId"
                  class="node-ctrl"
                  @click.stop="() => remove(node)">
                  删除
                </span>
              </div>
            </span>
          </div>
        </el-tree>
      </div>
      <div class="right-view" v-loading="loading">
        <div class="control-panel">
          <el-form :inline="true" :model="searchForm" label-width="50px" ref="searchForm" class="clearfix">
            <el-row>
              <el-form-item label="角色名称" prop="roleId">
                <el-select v-model="searchForm.roleId" clearable>
                  <el-option v-for="(item, i) in roleOptions " 
                  :key="i" 
                  :value="item.id" 
                  :label="item.roleName"/>
                </el-select>
              </el-form-item>
              <el-form-item label="人员姓名" prop="name">
                <el-input placeholder="请输入" clearable :maxlength="20" v-model="searchForm.name"/>　
              </el-form-item>
              <span class="control-right">
                <el-button @click="handleReset()" class="btn-reset">重置</el-button>
                <el-button type="primary"  @click="loadData()">搜索</el-button>
              </span>
            </el-row>
            <el-row>
              <el-form-item label="手机号码" prop="phone"> 
                <el-input placeholder="请输入" clearable :maxlength="11" v-model="searchForm.phone"/>　
              </el-form-item>
              <el-form-item label="帐号" prop="account">
                <el-input placeholder="请输入" clearable v-model="searchForm.account"/>　
              </el-form-item>              
            </el-row>
          </el-form>
        </div>
        <div>
          <el-table :data="[adminData]" stripe fit 
          :header-cell-style="{'background-color':'#F2F6F6'}">
            <el-table-column
              prop="orgName"
              label="机构名称"
              min-width="160">
            </el-table-column>
            <el-table-column
              prop="account"
              label="机构帐号"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="leaderName"
              label="机构超管"   
              min-width="120">
            </el-table-column>
            <el-table-column
              prop="leaderPhone"
              label="负责人电话"   
              min-width="120">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="openOrg(scope.row)">编辑机构</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-list">
          <div class="table-control-panel clearfix">
            <span class="control-left list-title">机构人员名单</span>
          </div>
          <div style="min-height:338px">
            <el-table :data="tableData" stripe :header-cell-style="{'background-color':'#F2F6F6'}">
              <div slot="empty" class="empty-table"></div>
              <el-table-column
                type="index"
                :index="indexMethod"
                width="60" label="序号">
              </el-table-column>
              <el-table-column
                prop="name"
                min-width="110"
                label="姓名">
              </el-table-column>
              <el-table-column
                prop="account"
                min-width="110"
                label="帐号">
              </el-table-column>
              <el-table-column
                prop="phone"
                min-width="90"
                label="联系电话">
              </el-table-column>
              <el-table-column
                prop="role"
                min-width="160"
                label="角色">
                <template slot-scope="scope">
                  <template v-for="item in scope.row.roleList">
                    {{item.roleName+'；' }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                min-width="90">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleOperator(scope.row)"
                    size="small">
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDel(scope.row)"
                    :disabled="scope.row.accountType=='2'"
                    size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page-container">
            <el-pagination
              background
              @size-change="limitChange"
              @current-change="turnPage"
              :current-page="page"
              layout="prev, pager, next"
              :total="totalRecord">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDialog">
      <el-dialog
        title="编辑一级机构"
        :visible.sync="showDialog"
        width="758px"
        :close-on-click-modal="false">
        <org-edit @close="handleClose" :data="adminData"/>
      </el-dialog>
    </div>

    <div v-if="showCreateForm">
      <el-dialog
        title="新增一级机构"
        :visible.sync="showCreateForm"
        width="60%"
        :close-on-click-modal="false">
        <org-form @close="handleClose"/>
      </el-dialog>
    </div>

    <div v-if="showOperator">
      <el-dialog
        title="新增操作人员"
        :show-close="false"
        :visible.sync="showOperator"       
        width="1011px"
        :close-on-click-modal="false">
        <operator-form @close="handleClose" :currentOrg="currentOrg"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {loadTopOrg, loadTopOrgTree, fetchRoleComboList, fetchListWithOrg, createOrg, updateOrg, deleteTopOrg, deleteOrg, deleteOperator} from "@/api/authority";
  import mixin from "@/utils/mixin";
  import orgEdit from "./orgEdit";
  import orgForm from "./orgForm";
  import operatorForm from "./operatorForm";

export default {
  mixins:[mixin],
  components:{
    orgEdit,
    orgForm,
    operatorForm
  },
  data(){
    return {
      loadingTree: false,
      showDialog: false,
      showCreateForm:false,
      showBack:false,
      showOperator: false,
      adminData: {},
      treeData: [],
      roleOptions:[],
      currentOrg:{},
      searchForm:{
        name:'',
        roleId:'',
        phone:'',
        account: ''
      },
      filterText: '',
    }
  },
  watch: {
    'filterText':function(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods:{
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    handleReset:function(){
      this.$refs.searchForm.resetFields();
      this.handleLoad(this.treeData[0]);
    },
    handleLoad(data){
      this.currentOrg = data
      this.loadRoleList(data)
      this.loadDetails()
      this.turnPage(1)
    },
    handleClose(){
      this.showDialog=false
      this.showCreateForm=false
      this.showOperator=false
      this.loadTopOrgTree()
    },
    handleDel:function(data){
      let self = this;
      self.$confirm('确定删除此操作人员吗？').then(_ => {
        self.loading = true;
        deleteOperator({
          id: data.id,
        }).then(function (response) {
          if (response && response.data.code === 1) {
            self.$message({
              message: response.data.message,
              type: 'success'
            });
            self.loadData(self.offset, self.limit);
          } else {
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).finally(_=>{
          self.loading = false;
        })
      }).catch( (a) => {
        // console.log(a)
      })
    },
    loadDetails(){
      let self = this;
      self.loading = true;

      loadTopOrg({
        id: self.currentOrg.id
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          let data = response.data.data
          self.adminData = data
          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    loadData(offset=0, limit=10){
      let self = this;
      self.loading = true;

      fetchListWithOrg({
        ...self.searchForm,
        orgId: self.currentOrg.id,
        offset: offset || 0,
        limit: limit || 10
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.tableData = response.data.dataList
          self.totalRecord = response.data.totalCount;
          self.loading = false;

          offset==0 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    loadTopOrgTree(){
      let self = this;
      self.loadingTree = true;

      loadTopOrgTree({}).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.treeData = [response.data.data]
          self.loadingTree = false;

          let currentOrg = self.$route.query.id?self.$route.query:response.data.data
          // console.log('org',currentOrg)
          self.handleLoad(currentOrg)
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    submit(node){
      if(node.data.parentId == -1){
        this.showCreateForm = true
      }else{
        this.$prompt('机构名称', '新增机构', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.*[^\s]+.*$/,
          inputErrorMessage: '请输入正确的2-20位的机构名称',
          inputValidator: function(e, a, b){
            return (e.length>20 || e.length<2) ? false: true
          }
        }).then(({ value }) => {
          let self = this;
          node.loading = true;

          createOrg({
            orgName: value,
            parentId: node.data.id
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              if(!node.data.children){
                self.$set(node.data, 'children', []);
              }
              node.data.children.push(response.data.data)
              self.$message({
                type: 'success',
                message: response.data.message
              });
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_=>{
            node.loading = false;
          })
        }).catch(() => {})
      }

    },
    remove(node){
      let self = this

      self.$confirm('确定删除此机构吗？').then(_ => {
        self.loading = true;

        if(node.data.parentId==1){
          deleteTopOrg({
            id: node.data.id,
          }).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.deleteCallback(node)

            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          }).finally(_=>{
            self.loading = false;
          })
        }else{
          deleteOrg({
            id: node.data.id,
          }).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.deleteCallback(node)

            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          }).finally(_=>{
            self.loading = false;
          })
        }
      }).catch( (a) => {
        // console.log(a)
      })
    },
    deleteCallback(node){
      this.loadTopOrgTree()
    },
    handleOperator(data){
      this.$router.push({path: '/authority/operator/operatorDetails', query:{ id:data.id }})
    },
    openOrg(data){
      // 一级机构和子机构分别不同交互方式
      if(data.parentId == 1){
        this.showDialog = true
      }else{

        this.$prompt('机构名称', '编辑机构', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.*[^\s]+.*$/,
          inputValue: data.orgName,
          inputErrorMessage: '请输入正确的2-20位的机构名称',
          inputValidator: function(e, a, b){
            return (e.length>20 || e.length<2) ? false: true
          }
        }).then(({ value }) => {
          let self = this;

          updateOrg({
            orgName: value,
            id: data.id
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.handleClose()
              self.$message({
                type: 'success',
                message: response.data.message
              });
            }
          }).catch(function (a) {
            console.error(a);
          })

        }).catch(() => {})

      }
    },
    loadRoleList: function (data) {
      let self = this;

      fetchRoleComboList({
        orgId: data.id
      }).then(function (response) {
        if (response && response.data.code === 1) {
          self.roleOptions = response.data.dataList || [];
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
  },
  mounted(){
    this.loadTopOrgTree()

    this.showBack = this.$route.name == 'orgDetails'
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
  .org-content{
    padding: 20px;
    position: relative;
  }
  .left-view{
    width: 30%;
    display: inline-block;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-right: 20px;
    border-radius: 8px;
    height: 787px;
    overflow-y: auto;
    background: #fff;
  }
  .right-view{
    display: inline-block;
    background: #fff;
    width: 67%;
    height: 787px;
    vertical-align: top;
    padding: 20px;
    border-radius: 8px;
  }
  .table-list{
    margin-top: 30px;
  }
  .custom-tree-node>.text-name{
    color: #333;
  }
  .node-ctrl{
    color: inherit;
    font-size: 12px;
  }
  .node-ctrl:hover{
    opacity: .8;
  }
  .org-btn{
    position: absolute;
    right: 0;
    padding-left: 5px;
    line-height: 26px;
    display: none;
  }
  .org-btn>div{
    display: inline-block;
    width: 30px;
  }
  
  /deep/ .el-tree-node__content{
    color: #fff;
  }
  /deep/ .el-tree-node__content:hover{
    color: #007ee4;
    
    .org-btn{
      background-color: #F5F7FA;
      display: inline;
    }
  }
</style>

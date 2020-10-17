<template>
  <div class="org-info">
    <div class="header">
      <span>角色管理</span>
      <span class="control-right">
        <el-button type="primary" icon="el-icon-plus" @click="realize">新增角色</el-button>
      </span>
    </div>
    <div class="content">
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
          :default-expand-all="true"
          @node-click="handleLoad"
          :filter-node-method="filterNode">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.orgName }}</span>
          </div>
        </el-tree>
      </div>
      <div class="app-container">
        <div class="control-panel">
          <el-form :inline="true" label-width="50px" :model="searchForm" ref="searchForm" class="clearfix">
            <div>
              <el-form-item label="角色名称" prop="roleName">
                <el-input placeholder="请输入" clearable v-model="searchForm.roleName"/>
              </el-form-item>

              <span class="control-right">
                <el-button @click="handleReset()">重置</el-button>
                <el-button type="primary"  @click="loadData()">搜索</el-button>
              </span>
            </div>
          </el-form>
        </div>
        <div class="table-list" v-loading="loading">
          <div class="table-control-panel clearfix">
            <span class="control-left list-title">角色列表</span>
          </div>
          <el-row>
            <el-table :data="tableData" stripe :header-cell-style="{'background-color':'#F2F6F6'}">
              <div slot="empty" class="empty-table"></div>
              <el-table-column
                type="index"
                :index="indexMethod"
                width="60" label="序号">
              </el-table-column>
              <el-table-column
                prop="roleName"
                min-width="180"
                label="角色名">
              </el-table-column>
              <el-table-column
                prop="description"
                min-width="290"
                label="角色描述">
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                width="90">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="details(scope.row)"
                    size="small">
                    查看
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDel(scope.row)"
                    :disabled="scope.row.isPublic==='1'"
                    size="small">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
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
  </div>
</template>

<script>
  import {fetchRoleList, deleteRole, loadTopOrgTree} from "@/api/authority";
  import mixin from "@/utils/mixin";

  export default {
    mixins:[mixin],
    data() {
      return {
        loading:false,
        loadingTree: false,
        searchForm:{
          roleName:'',
          orgId: null,
          orgName: '',
        },
        treeData:[],
        filterText:''
      }
    },
    watch: {
      'filterText':function(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.orgName.indexOf(value) !== -1;
      },
      handleDel:function(data){
        let self = this;
        self.$confirm('确定删除此角色吗？').then(_ => {
          self.loading = true;
          deleteRole({
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
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      handleLoad(data){
        this.searchForm.orgId = data.id
        this.searchForm.orgName = data.orgName
        this.turnPage(1)
      },
      loadTopOrgTree(){
        let self = this;
        self.loadingTree = true;

        loadTopOrgTree({}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.treeData = [response.data.data]
            self.loadingTree = false;
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {...this.searchForm};

        searchParams.offset = offset || 0;
        searchParams.limit = limit || 10;
        fetchRoleList(searchParams).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      realize(data){
        this.$router.push({
          path:'role/create',
          query: {
            orgId: this.searchForm.orgId,
            orgName: this.searchForm.orgName
          }
        })
      },
      details(data){
        this.$router.push({path:'role/details', query:{id: data.id}})
      }
    },
    mounted() {
      this.loadData();
      this.loadTopOrgTree()
    },
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
    padding: 20px;
  }
  .app-container{
    display: inline-block;
    width: 67%;
    vertical-align: top;
    height: 638px;
    background: #fff;
    border-radius: 8px;
    padding: 20px;
  }
  .left-view{
    width: 30%;
    display: inline-block;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-right: 20px;
    height: 638px;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 8px;
  }
  .org-btn{
    position: absolute;
    right: 0;
    background-color: #fff;
    padding-left: 5px;
  }
  .org-btn>div{
    display: inline-block;
    width: 30px;
  }
</style>
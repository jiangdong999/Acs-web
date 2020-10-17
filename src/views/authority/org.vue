<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form :inline="true" :model="searchForm" ref="searchForm" class="clearfix">
          <div>
            <el-form-item label="机构名" prop="orgName">
              <el-input placeholder="请输入" clearable v-model="searchForm.orgName"/>
            </el-form-item>
            <el-form-item label="机构超管" prop="leaderName">
              <el-input placeholder="请输入" clearable :maxlength="20" v-model="searchForm.leaderName"/>　
            </el-form-item>
            <el-form-item label="手机号码" prop="leaderPhone">
              <el-input placeholder="请输入" clearable :maxlength="11" v-model="searchForm.leaderPhone"/>　
            </el-form-item>
            <span class="control-right">
              <el-button @click="handleReset()">重置</el-button>
              <el-button type="primary"  @click="loadData()">搜索</el-button>
            </span>
          </div>
        </el-form>
      </div>
      <div class="table-container" v-loading="loading">
        <div class="table-control-panel clearfix">
          <span class="control-left list-title">机构列表</span>
          <span class="control-right">
            <el-button type="primary" icon="el-icon-plus" @click="showDialog=true">新增机构</el-button>
          </span>
        </div>
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="orgName"
              min-width="150"
              label="机构名称">
            </el-table-column>
            <el-table-column
              prop="account"
              min-width="150"
              label="机构帐号">
            </el-table-column>
            <el-table-column
              prop="leaderName"
              min-width="120"
              label="机构超管">
            </el-table-column>
            <el-table-column
              prop="leaderPhone"
              min-width="150"
              label="联系电话">
            </el-table-column>
            <el-table-column
              prop="userNum"
              min-width="110"
              label="机构人员数量">
            </el-table-column>
            <el-table-column
              prop="roleNum"
              min-width="80"
              label="角色数量">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="120">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="realize(scope.row)"
                  size="small">
                  查看
                </el-button>
                <el-button
                  type="text"
                  @click="handleDel(scope.row)"
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

    <div v-if="showDialog">
      <el-dialog
        title="新增一级机构"
        :visible.sync="showDialog"
        width="758px"
        :close-on-click-modal="false">
        <org-form @close="handleClose"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fetchTopOrgList, deleteTopOrg} from "@/api/authority";
  import mixin from "@/utils/mixin";
  import orgForm from "./components/orgForm";

  export default {
    mixins:[mixin],
    components:{
      orgForm
    },
    data() {
      return {
        loading:false,
        showDialog: false,
        searchForm:{
          orgName:'',
          leaderName:'',
          leaderPhone:'',
        }
      }
    },
    methods: {
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      handleClose(){
        this.showDialog = false
        this.loadData()
      },
      realize(data){
        this.$router.push({path:'org/orgDetails', query:{
          id: data.id,
          parentId: data.parentId,
          orgName: data.orgName,
          orgCode: data.orgCode,
        }})
      },
      handleDel:function(data){
        let self = this;
        if (data.id) {
          self.$confirm('确定删除此机构吗？')
            .then(_ => {
              self.loading = true;
              deleteTopOrg({
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
              }).catch(function (a) {
              }).finally(_=>{
                self.loading = false;
              })
            }).catch( (a) => {
              // console.log(a)
            })
        }
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {...this.searchForm};

        searchParams.offset = offset || 0;
        searchParams.limit = limit || 10;
        fetchTopOrgList(searchParams).then(function (response) {
          if (response && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
    },
    mounted() {
      this.loadData();
    },
  }
</script>

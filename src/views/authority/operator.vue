<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form :inline="true" :model="searchForm" ref="searchForm" class="clearfix">
          <el-row>
            <el-form-item label="角色名称" prop="roleId">
              <el-select v-model="searchForm.roleId">
                <el-option v-for="(item, i) in roleOptions " 
                :key="i" 
                :value="item.id" 
                :label="item.roleName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="人员姓名" prop="name">
              <el-input placeholder="请输入" clearable :maxlength="20" v-model="searchForm.name"/>　
            </el-form-item>
            <el-form-item label="手机号码" prop="phone"> 
              <el-input placeholder="请输入" clearable :maxlength="11" v-model="searchForm.phone"/>　
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="帐号" prop="account" label-width="58px">
              <el-input placeholder="请输入" clearable v-model="searchForm.account"/>　
            </el-form-item>
            <span class="control-right">
              <el-button @click="handleReset()">重置</el-button>
              <el-button type="primary"  @click="loadData()">搜索</el-button>
            </span>
          </el-row>
        </el-form>
      </div>
      <div class="table-container" v-loading="loading">
        <div class="table-control-panel clearfix">
          <span class="control-left list-title">操作人员列表</span>
          <span class="control-right">
            <el-button type="primary" icon="el-icon-plus" @click="showDialog=true">新增操作人员</el-button>
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
              prop="name"
              min-width="120"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="account"
              min-width="120"
              label="帐号">
            </el-table-column>
            <el-table-column
              prop="phone"
              min-width="120"
              label="手机号码">
            </el-table-column>
            <el-table-column
              prop="cardNo"
              min-width="180"
              label="所属机构">
              <template slot-scope="scope">
                {{scope.row.orgInfo.orgName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="cardholder"
              min-width="200"
              label="角色">
              <template slot-scope="scope">
                <template v-for="item in scope.row.roleList">
                  {{item.roleName+'；' }}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="lastLoginTime"
              min-width="180"
              label="最后登录时间">
              <template slot-scope="scope">
                {{scope.row.lastLoginTime | formatTimeMillisToDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="details(scope.row)"
                  size="small">
                  查看
                </el-button>
                <el-button
                  type="text"
                  @click="showPassword(scope.row)"
                  size="small">
                  重置密码
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
            layout="prev, pager, next"
            :current-page="page"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showDialog">
      <el-dialog
        title="新增操作人员"
        :show-close="false"
        :visible.sync="showDialog"
        width="80%"
        :close-on-click-modal="false">
        <operator-form @close="handleClose"/>
      </el-dialog>
    </div>
    <div v-if="showResetPW">
      <el-dialog
        title="重置密码"
        :show-close="false"
        :visible.sync="showResetPW"
        width="50%"
        :close-on-click-modal="false">
        <password :data="currentOperator"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fetchOperatorList, fetchRoleList, deleteOperator} from "@/api/authority";
  import mixin from "@/utils/mixin";
  import operatorForm from "./components/operatorForm";
  import password from "./components/resetPW";
  import { formatTimeMillisToDateTime } from "@/filters/index";
  export default {
    mixins:[mixin],
    filters:{
      formatTimeMillisToDateTime
    },
    components:{
      operatorForm,
      password
    },
    data() {
      return {
        loading:false,
        showDialog: false,
        showResetPW: false,
        searchForm:{
          name:'',
          roleId:'',
          phone:'',
        },
        roleOptions:[]
      }
    },
    methods: {
      showPassword(data){
        this.$confirm('确定重置密码吗？').then(_ => {
          this.currentOperator = data
          this.showResetPW = true
        }).catch( (a) => {
          // console.log(a)
        })
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
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      handleClose(){
        this.showDialog = false,
        this.loadData()
      },
      details(data){
        this.$router.push({path: 'operator/operatorDetails', query:{id: data.id}})
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {...this.searchForm};

        searchParams.offset = offset || 0;
        searchParams.limit = limit || 10;
        fetchOperatorList(searchParams).then(function (response) {
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
      loadRoleList: function (offset, limit) {
        let self = this;

        fetchRoleList({
          offset: 0
        }).then(function (response) {
          if (response && response.data.code === 1) {
            self.roleOptions = response.data.dataList || [];
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
    },
    mounted() {
      this.loadData();
      this.loadRoleList();
    },
  }
</script>

<template>
    <div>
      <el-row class="app-container">
        <el-col :span="24">
          <div class="table-control-panel">
            <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
            <span class="control-left list-title jdClassTitle">
              <span>当前角色：{{this.query.roleName}}</span>&nbsp;&nbsp;<span style="color: #999;font-weight: normal;">(共{{this.query.userCount}}个)</span>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form inline :model="searchForm" ref="searchForm">
                    
                    <el-row  :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                          <el-input placeholder="请输入" clearable v-model="searchForm.name"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                          <el-input placeholder="请输入" clearable :maxlength="11" v-model="searchForm.phone"/>　
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="帐号类型" prop="accountType">
                          <el-select v-model="searchForm.accountType" placeholder="请选择">
                            <el-option
                              v-for="item in accountOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="脱敏类型" prop="sensitive">
                          <el-select v-model="searchForm.sensitive" placeholder="请选择">
                            <el-option
                              v-for="item in sensitiveOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="创建者" prop="creatorName">
                          <el-input
                            placeholder="请输入"
                            clearable
                            :maxlength="20"
                            v-model="searchForm.creatorName"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="创建时间" class="repairDate" prop="createTime">
                          <el-date-picker
                            v-model="searchForm.createTime"
                            type="date"
                            value-format="yyyyMMddHHmmssSSS"
                            placeholder="选择日期"
                            clearable
                            >
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <span class="control-right jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary" @click="loadData()">搜索</el-button>
                    </span>
                  </el-form>
                </div>
                <el-button plain slot="reference" class="jdbtn">
                  <svg-icon iconClass="filter" class="jdIconSize" />筛选
                </el-button>
              </el-popover>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="jdContainer" v-loading="loading">
          <div class="jdtable">
          <el-table stripe :data="tableData">
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="name"
              min-width="100"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="phone"
              min-width="150"
              label="手机号码">
            </el-table-column>
            <el-table-column
              prop="accountType"
              min-width="100"
              label="帐号类型">
              <template slot-scope="scope">
                {{scope.row.accountType | account}}
              </template>
            </el-table-column>
            <el-table-column
              prop="communityCount"
              min-width="80"
              label="小区数量">
            </el-table-column>
            <el-table-column
              prop="sensitive"
              min-width="80"
              label="脱敏类型">
              <template slot-scope="scope">
                {{scope.row.sensitive | sensitive}}
              </template>
            </el-table-column>
            <el-table-column
                prop="creatorName"
                min-width="120"
                label="创建者">
              </el-table-column>
            <el-table-column
              prop="createTime"
              min-width="120"
              label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime | formatDateTimeWithDot}}
              </template>
            </el-table-column>
            <el-table-column
              prop="lastLoginTime"
              min-width="150"
              label="上次登录时间">
              <template slot-scope="scope">
                {{scope.row.lastLoginTime | formatDateTime}}
              </template>
            </el-table-column>
            <!-- <el-table-column
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
            </el-table-column> -->
          </el-table>
          </div>
          <div class="page-container">
            <el-pagination
              background
              @size-change="limitChange"
              @current-change="turnPage"
              :current-page="page"
              layout="prev, pager, next"
              :page-count="totalPage">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { deleteTopOrg} from "@/api/authority";
import {fetchTopOrgList} from "@/api/authorityv1";
import { formatTimeMillisToDateTime,formatDateTimeWithDot,formatDateTime,sensitive,account } from "@/filters/index";
import { sensitiveOptions,accountOptions } from "@/utils/role"
import mixin from "@/utils/mixin-page";

export default {
    mixins:[mixin],
    filters:{
      formatDateTimeWithDot,
      formatDateTime,
      account,
      sensitive
    },
    data() {
      return {
        query:{},
        loading:false,
        accountOptions: [],//账号类型
        sensitiveOptions:[],//敏感类型
        searchForm:{
          roleId:'',//角色的id
          name:'',//姓名
          phone:'',//手机号
          accountType:'',//账号类型
          sensitive:'',//敏感类型
          createTime:'',//创建时间
          creatorName:'',//创建者
        }
      }
    },
    methods:{
      loadData: function (page=0, limit=10) {
        let self = this;
        self.loading = true;
        self.searchForm.roleId = this.query.roleId;
        let searchParams = {...this.searchForm};

        searchParams.page = page || 0;
        searchParams.size = limit || 10;
        fetchTopOrgList(searchParams).then(function (response) {
          if (response && response.data.status === 0) {
            self.tableData = response.data.content.list || [];
            self.totalPage = response.data.content.totalPage;
            self.loading = false;

            page==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
       //重置
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
    },
    mounted() {
      this.query = JSON.parse(localStorage.getItem('query'))
      this.loadData();
      this.accountOptions = accountOptions
      this.sensitiveOptions = sensitiveOptions
    },
    activated(){
      this.loadData(this.page,this.limit);
    }
}
</script>

<style scoped>

.table-control-panel{
  padding: 10px 30px;
  background: #fff;
}
.control-left{
  margin-right: 20px;
}
.jdaddbtn{
  padding: 10px;
}
.jdIconSize {
  font-size: 20px;
  margin-right: 4px;
}
.jdbtn {
  float: right;
  font-size: 12px;
  color: #0074da;
  cursor: pointer;
  border: none;
}
.jdtable{
  margin: 20px 30px 0 30px;
}
.jdContainer{
  background: #fff;
  padding-bottom: 30px;
}
.jdbtn{
  margin-right: 0px;
}
.control-right{
  margin-right: 0px;
}

.page-container{
  padding-right: 30px;
}
</style>
<style>
.el-table th {
  background: #f0f2f5;
  padding: 10px 0 !important;
}
.jdClass-account .el-form-item__label {
  display: block !important;
  width: auto !important;
  text-align: left;
  margin-left: 20px;
}

.jdClass-account .room-place .el-input__inner {
  width: 349px !important;
  margin-left: 20px;
} 
.jdClass-account .el-popover {
  padding: 0px;
}
.jdClassbtn {
  margin-right: 0px;
  margin-top: 60px;
}
.jdPopper {
  box-shadow: 0px 4px 16px #dedede;
}
.jdClassTitle{
  font-size: 14px;
  color: #333;
}
</style>
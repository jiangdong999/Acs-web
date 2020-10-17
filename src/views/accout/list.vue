<template>
  <div>
    <el-row class="app-container account-list">
      <el-col :span="24">
        <div class="table-control-panel">
          <span class="control-left list-title">帐号列表</span>
          <span class="jdclass_refurbish">
            <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
          </span>
          <span class="control-left">
            <el-button type="primary" class="jdaddbtn" icon="el-icon-plus" @click="showAccout">新增帐号</el-button>
          </span>
          <span class="control-right">
            <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
              <div class="control-panel jdClass">
                <el-form inline :model="searchForm" ref="searchForm">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="姓名" prop="name">
                        <el-input placeholder="请输入" clearable v-model="searchForm.name" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="手机号码" prop="phone">
                        <el-input
                          placeholder="请输入"
                          clearable
                          :maxlength="11"
                          v-model="searchForm.phone"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="帐号类型" prop="accountType">
                        <el-select v-model="searchForm.accountType" clearable placeholder="请选择">
                          <el-option
                            v-for="item in accountOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="脱敏类型" prop="sensitive">
                        <el-select v-model="searchForm.sensitive" clearable placeholder="请选择">
                          <el-option
                            v-for="item in sensitiveOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
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
                          clearable
                          value-format="timestamp"
                          placeholder="选择日期"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <span class="jdClassbtn">
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
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="name" min-width="80" label="姓名"></el-table-column>
            <el-table-column prop="phone" min-width="120" label="手机号码"></el-table-column>
            <el-table-column prop="accountType" min-width="100" label="帐号类型">
              <template slot-scope="scope">{{scope.row.accountType | account}}</template>
            </el-table-column>
            <el-table-column prop="communityCount" min-width="80" label="小区数量"></el-table-column>
            <el-table-column prop="sensitive" min-width="80" label="脱敏类型">
              <template slot-scope="scope">{{scope.row.sensitive | sensitive}}</template>
            </el-table-column>
            <el-table-column prop="creatorName" min-width="120" label="创建者"></el-table-column>
            <el-table-column prop="createTime" min-width="120" label="创建时间">
              <template slot-scope="scope">{{scope.row.createTime | formatDateTimeWithDot}}</template>
            </el-table-column>
            <!-- <el-table-column prop="lastLoginTime" min-width="150" label="上次登录时间">
              <template slot-scope="scope">{{scope.row.lastLoginTime | formatDateTime}}</template>
            </el-table-column> -->
            <el-table-column label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="realize(scope.row)" size="small">查看</el-button>
                <el-button type="text" @click="showDelDiglog(scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-container">
            <el-pagination
              background
              @size-change="limitChange"
              @current-change="turnPage"
              :current-page="page"
              layout="prev, pager, next"
              :total="totalRecord"
            ></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
        <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此帐号吗？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="handleDel(objData)" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTopOrgList,deleteTopOrg } from "@/api/authorityv1";
import {
  formatTimeMillisToDateTime,
  formatDateTimeWithDot,
  formatDateTime,
  sensitive,
  account,
} from "@/filters/index";
import { sensitiveOptions, accountOptions } from "@/utils/role";
import mixin from "@/utils/mixin-page";

export default {
  mixins: [mixin],
  filters: {
    formatDateTimeWithDot,
    formatDateTime,
    account,
    sensitive,
  },
  data() {
    return {
      showDelDiglogFlag: false,
      loading: false,
      accountOptions: [], //账号类型
      sensitiveOptions: [], //敏感类型
      objData: null,
      searchForm: {
        name: "", //姓名
        phone: "", //手机号
        accountType: "", //账号类型
        sensitive: "", //敏感类型
        createTime: "", //创建时间
        creatorName: "", //创建者
        createTimeStart:'',
        createTimeEnd:''
      },
    };
  },
  methods: {
    showDelDiglog(data) {
      this.showDelDiglogFlag = true;
      this.objData = data;
    },
    loadData: function (page = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };

      searchParams.page = page || 0;
      searchParams.size = limit || 10;

      if (searchParams.createTime) {
        searchParams.createTimeStart = searchParams.createTime
        searchParams.createTimeEnd = searchParams.createTime+86399999
      }
      if (searchParams.sensitive) {
        searchParams.sensitive = parseInt(searchParams.sensitive)
      }
      fetchTopOrgList(searchParams)
        .then(function (response) {
          if (response && response.data.status === 0) {
            self.tableData = response.data.content.list || [];
            // console.log(self.tableData); 
            self.totalRecord = response.data.content.total;
            self.loading = false;
            // console.log(response.data.content.totalPage == page,response.data.content.list,page > 0);
            if (response.data.content.totalPage == page && response.data.content.list.length == 0 && page > 0) {    
              searchParams.page--;
              // console.log(searchParams.page);
              fetchTopOrgList(searchParams).then((res) => {
                if (res && res.data.status === 0) {
                  self.tableData = res.data.content.list || [];
                  self.totalRecord = res.data.content.total;
                  self.loading = false;
                }
              });
            }
            page == 0 && self.pageReset();
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    //新增账号
    showAccout() {
      this.$router.push({ path: "/accout/list/listAdd", query: {} });
    },
    //删除账号
    handleDel(data) {
      let self = this;
      if (data.userUuid) {
        self.loading = true;
        deleteTopOrg({
          userUuid: data.userUuid,
        })
          .then(function (response) {
            if (response && response.data.status === 0) {
              self.$message({
                message: response.data.message,
                type: "success",
              });
              self.loadData(self.page-1, self.limit);
            } else {
              self.$message({
                message: response.data.message,
                type: "error",
              });
            }
          })
          .catch(function (a) {})
          .finally((_) => {
            self.loading = false;
            self.showDelDiglogFlag = false;
          });
      }
    },
    //重置
    handleReset: function () {
      this.$refs.searchForm.resetFields();
      this.loadData();
    },
    //查看
    realize(data) {
      // console.log(data);
      localStorage.setItem('query',JSON.stringify({
        userUuid:data.userUuid
      }))
      this.$router.push({
        path: "/accout/list/listDetails",
      });
    },
  },
  mounted() {
    this.loadData();
    this.accountOptions = accountOptions;
    this.sensitiveOptions = sensitiveOptions;
  },
  activated() {
    // console.log(this.page);
    if (this.page > 0) {
      this.loadData(this.page-1, this.limit);
    } else {
      this.loadData(this.page, this.limit)
    }
  },
};
</script>

<style scoped>
.table-control-panel {
  padding: 6px 30px;
  background: #fff;
}
.control-left {
  margin-right: 20px;
}
.jdaddbtn {
  padding: 10px;
}
.jdIconSize {
  font-size: 20px;
  margin-right: 4px;
}

.jdtable {
  margin: 20px 30px 0 30px;
}
.jdContainer {
  background: #fff;
  padding-bottom: 30px;
}

.el-table--medium td {
  padding: 14px 0 !important;
}
</style>
<style>
.account-list .el-table__fixed-body-wrapper  {
    top: 43px !important;
}
</style>
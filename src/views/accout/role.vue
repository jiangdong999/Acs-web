<template>
  <div>
    <el-row class="app-container">
      <el-col :span="24">
        <div class="table-control-panel">
          <span class="control-left list-title">角色列表</span>
          <span class="jdclass_refurbish">
            <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
          </span>
          <span class="control-left">
            <el-button type="primary" class="jdaddbtn" icon="el-icon-plus" @click="showDialog">新增角色</el-button>
          </span>
          <span class="control-right">
            <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
              <div class="control-panel jdClass">
                <el-form inline :model="searchForm" ref="searchForm">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="角色名称" prop="roleName">
                        <el-input placeholder="请输入" clearable v-model="searchForm.roleName" />
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
                          value-format="timestamp"
                          placeholder="选择日期"
                          clearable
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
      <el-col :span="24" class="jdContainer">
        <div class="jdtable" v-loading="loading">
          <el-table stripe :data="tableData">
            <div slot="empty" class="empty-table"></div>
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="roleName" min-width="100" label="角色名称"></el-table-column>
            <el-table-column prop="userCount" min-width="100" label="帐号数量">
              <template slot-scope="scope">
                <span style="width:50px;display:inline-block">{{scope.row.userCount}}</span>
                <el-button
                  type="text"
                  @click="roleAccout(scope.row)"
                  size="small"
                  style="margin-left:10px"
                >查看</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="creatorName" min-width="100" label="创建者"></el-table-column>
            <el-table-column prop="createTime" min-width="100" label="创建时间">
              <template slot-scope="scope">{{scope.row.createTime | formatTimeMillisToDateTime}}</template>
            </el-table-column>
            <el-table-column prop="description" min-width="200" label="角色描述"></el-table-column>
            <el-table-column label="操作" fixed="right" width="190">
              <template slot-scope="scope">
                <el-button type="text" @click="details(scope.row)" size="small">编辑</el-button>
                <el-button
                  type="text"
                  @click="showDelDiglog(scope.row)"
                  :disabled="scope.row.isPublic==='1'"
                  size="small"
                >删除</el-button>
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
              :page-count="totalPage"
            ></el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
        <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此角色吗？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="handleDel(objData)" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadTopOrgTree } from "@/api/authority";
import { deleteRole, fetchRoleList } from "@/api/authorityv1";
import { formatTimeMillisToDateTime } from "@/filters/index";
import mixin from "@/utils/mixin-page";

export default {
  mixins: [mixin],
  filters: {
    formatTimeMillisToDateTime,
  },
  data() {
    return {
      showDelDiglogFlag: false,
      loading: false,
      loadingTree: false,
      objData: null,
      searchForm: {
        roleName: "",
        creatorName: "",
        createTime: "", //创建时间
        createTimeStart:'',
        createTimeEnd:''
      },
      treeData: [],
      filterText: "",
    };
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    showDelDiglog(data) {
      this.showDelDiglogFlag = true;
      this.objData = data;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    handleDel: function (data) {
      let self = this;

      self.loading = true;
      deleteRole({
        roleUuid: data.roleUuid,
      })
        .then(function (response) {
          if (response && response.data.status === 0) {
            self.$message({
              message: response.data.message,
              type: "success",
            });
            self.loadData(self.page-1, self.limit);  
          } else {
            // self.$message({
            //   message: response.data.message,
            //   type: 'error'
            // });
          }
        })
        .finally((_) => {
          self.loading = false;
          self.showDelDiglogFlag = false;
        });
    },
    handleReset: function () {
      this.$refs.searchForm.resetFields();
      this.loadData();
    },
    handleLoad(data) {
      this.searchForm.orgId = data.id;
      this.searchForm.orgName = data.orgName;
      this.turnPage(1);
    },
    loadTopOrgTree() {
      let self = this;
      self.loadingTree = true;

      loadTopOrgTree({})
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            self.treeData = [response.data.data];
            self.loadingTree = false;
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    loadData: function (page = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };
      if (searchParams.createTime) {
        searchParams.createTimeStart= searchParams.createTime
        searchParams.createTimeEnd = searchParams.createTime + 86399999
      }

      searchParams.page = page || 0;
      searchParams.size = limit || 10;
      fetchRoleList(searchParams)
        .then(function (response) {
          if (response.data && response.data.status === 0) {
            self.tableData = response.data.content.list || [];
            self.totalPage = response.data.content.totalPage;
            // console.log(self.totalPage);
            self.loading = false;
            if (response.data.content.totalPage == page && response.data.content.list.length == 0 && page > 0) {    
              searchParams.page--;
              // console.log(searchParams.page);
              fetchRoleList(searchParams).then((res) => {
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
    realize(data) {
      this.$router.push({
        path: "role/create",
        query: {
          orgId: this.searchForm.orgId,
          orgName: this.searchForm.orgName,
        },
      });
    },
    details(data) {
      localStorage.setItem(
        "query",
        JSON.stringify({
          roleUuid: data.roleUuid,
        })
      );
      this.$router.push({ path: "/accout/role/roleDetails" });
    },
    //新增账号
    showDialog() {
      this.$router.push({ path: "/accout/role/roleAdd" });
    },
    //跳转到账号详情
    roleAccout(data) {
      localStorage.setItem(
        "query",
        JSON.stringify({
          roleId: data.id,
          ...data
        })
      );
      this.$router.push({
        path: "/accout/role/roleAccout",
      });
    },
  },
  mounted() {
    this.loadData();
    // this.loadTopOrgTree()
    
  },
  activated() {
    this.loadData(this.page-1, this.limit);
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
</style>
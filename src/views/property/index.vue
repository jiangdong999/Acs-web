<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form ref="searchForm" :model="searchForm" :inline="true">
          <el-form-item label="单位简称" prop="propertyName">
            <el-input v-model="searchForm.propertyName" maxlength="30" clearable placeholder="名称"/>
          </el-form-item>
           <el-form-item label="帐号" prop="propertyAccount">
            <el-input v-model="searchForm.propertyAccount" maxlength="8" clearable placeholder="帐号"/>
          </el-form-item>
          <span class="control-right">
            <el-button @click="handleReset()">重置</el-button>
            <el-button type="primary"  @click="loadData()">搜索</el-button>
          </span>
        </el-form>
      </div>
      <div class="table-container" v-loading="loading">
        <div class="table-control-panel clearfix">
          <span class="control-left list-title">帐号列表</span>
          <span class="control-right">
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">新增帐号</el-button>
          </span>
        </div>
        <el-row>
          <el-table :data="tableData" stripe fit>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="propertyAccount"
              min-width="120"
              label="帐号">
            </el-table-column>
            <el-table-column
              prop="propertyFullName"
              min-width="200"
              label="单位全称">
            </el-table-column>
            <el-table-column
              prop="propertyName"
              min-width="120"
              label="单位简称">
            </el-table-column>
            <el-table-column
              prop="createTime"
              min-width="160"
              label="创建时间">
              <template slot-scope="scope">
                {{ new Date(scope.row.createTime) | moment(dateFormat)}}
              </template>
            </el-table-column>
            <el-table-column
              v-if="hasPermission(['ADMIN_ROLE'])"
              prop="accountType"
              min-width="80"
              label="帐号类型">
              <template slot-scope="scope">
                {{ scope.row.accountType | transAccountType}}
              </template>
            </el-table-column>
            <el-table-column
              prop="countCommunity"
              min-width="80"
              label="小区数量">
            </el-table-column>
            <el-table-column
              prop="countDoor"
              min-width="80"
              label="门禁机数">
            </el-table-column>
            <el-table-column
              prop="countHousehold"
              min-width="80"
              label="使用人数">
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="120"
              fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)"
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

    <div v-if="showModal">
      <el-dialog
        title="添加帐号"
        :visible.sync="showModal"
        :close-on-click-modal="false">
        <property-form/>
      </el-dialog>
    </div>

    <div v-if="showEdit">
      <el-dialog
        title="帐号信息"
        :visible.sync="showEdit"
        :close-on-click-modal="false">
        <property-edit :data="rowData"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import PropertyForm from "./form";
  import PropertyEdit from "./edit";
  import {fetchList, delProperty} from '@/api/property';
  import {transAccountType} from "@/filters/property";
  import util from '@/utils/times';
  import permission from '@/directive/permission/index'
  import hasPermission from '@/utils/menuPermission.js';  
  import mixin from "@/utils/mixin";

  export default {
    mixins: [mixin],
    components: {
      PropertyForm,
      PropertyEdit,
    },

    computed: {
      dateFormat: function () {
        return util.dateFormat();
      }
    },

    directives: {
      permission
    },

    methods: {
      hasPermission,
      showDialog: function () {
        this.showModal = true;
      },
      handleClose: function () {
        this.loadData(this.offset, this.limit)
        this.showModal = false;
        this.showEdit = false;
      },
      handleEdit: function (row) {
        this.rowData = row;
        this.showEdit = true;
      },
      handleDel: function (data) {
        let self = this;
        if (data) {
          self.$confirm('确定删除此帐号吗？')
            .then(_ => {
              delProperty(data).then(function (response) {
                if (response && response.data.code === 1) {
                  self.$message({
                    message: '删除已完成',
                    type: 'success'
                  });
                  self.loadData(self.offset, self.limit);
                } else {
                  self.$message({
                    message: response.data.message,
                    type: 'error'
                  });
                }
                return false;
              }).catch(function (a) {
                console.error(a);
              }).finally(_=>{
                self.loading = false;
              })
            })
            .catch((a) => {
              console.error(a);
              self.loading = false;
            });
        }
      },
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = !self.loading;
        let listObj = {
          offset: offset,
          limit: limit,
        };
        let keyObject = Object.assign(self.searchForm, listObj);
        fetchList(keyObject).then(function (response) {
          if(response.data && response.data.code===1){
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = !self.loading;

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
    filters: {
      transAccountType: transAccountType
    },
    data() {
      return {
        showModal: false,
        showEdit: false,
        rowData: {},
        searchForm: {
          propertyName: '',
          propertyAccount: '',
        },
      }
    }
  }
</script>

<style scoped>

</style>

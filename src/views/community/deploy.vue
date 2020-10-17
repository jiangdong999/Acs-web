<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-row>
            <el-form-item label="小区名称" prop="communityId">
              <el-select v-model="searchForm.communityId" placeholder="选择所属小区" clearable filterable>
                <el-option
                  v-for="item in communityList"
                  :key="item.communityId"
                  :label="item.communityName"
                  :value="item.communityId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="小区名称" prop="communityName">
              <el-input placeholder="小区名称" v-model="searchForm.communityName" clearable/>
            </el-form-item> -->
            <el-form-item label="小区帐号" prop="account">
              <el-input placeholder="小区帐号" v-model="searchForm.account" clearable/>
            </el-form-item>
            <el-form-item label="小区地址" prop="address">
              <el-input placeholder="详细地址" v-model="searchForm.address" clearable/>
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
          <span class="control-left list-title">小区配置列表</span>
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
              prop="communityAccount"
              min-width="120"
              label="小区帐号">
            </el-table-column>
            <el-table-column
              prop="communityName"
              min-width="120"
              label="小区名称">
            </el-table-column>
            <el-table-column
              prop="address"
              min-width="200"
              label="详细地址">
            </el-table-column>
            <el-table-column
              prop="authorityType"
              min-width="160"
              label="住户审批方式">
              <template slot-scope="scope">
                {{ scope.row.authorityType | authorityType }}
              </template>
            </el-table-column>
            <el-table-column
              prop="useCaringStaff"
              min-width="120"
              label="SOS报警">
              <template slot-scope="scope">
                {{ scope.row.useCaringStaff | useCaringStaff }}
              </template>
            </el-table-column>
            <el-table-column
              prop="idCardInfo"
              min-width="120"
              label="住户必填信息">
              <template slot-scope="scope">
                {{scope.row.isIdcard}}{{scope.row.isIdcard&&scope.row.isInfo? '、': ''}}{{!scope.row.isIdcard&&!scope.row.isInfo? '无': ''}}{{scope.row.isInfo}}
              </template>
            </el-table-column>
            <el-table-column
              prop="version"
              min-width="200"
              label="App版本">
              <template slot-scope="scope">
                <div>Ios版本：{{ scope.row.latestVersionIos }}</div>
                <div>Android版本：{{ scope.row.latestVersionAndroid }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleSet(scope.row)"
                  size="small">
                  设置
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
            :current-page.sync="page"
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showSetting">
      <el-drawer
        title="小区参数配置"
        :visible.sync="showSetting"
        class="scroll"
        size="480px"
        :before-close="beforeClose"
        :show-close="false">
        <parameters ref="parameters" :data="rowData" @close="showSetting=false" @submit="handleClose"/>
      </el-drawer>
    </div>
  </div>
</template>

<script>
  import parameters from "./components/parameters.vue";
  import {loadList} from "@/api/community";
  import mixin from "@/utils/mixin";
  import { mapGetters } from 'vuex';

  export default {
    mixins:[mixin],
    components: {
      parameters
    },
    computed: {
      ...mapGetters([
        'communityList'
      ])
    },
    filters: {
      authorityType(type) {
        switch(type){
          case '0':
            return '产权人、管理处审批';
          case '1':
            return '产权人审批';
          case '2':
            return '管理处审批';
        }
      },
      useCaringStaff(status){
        switch(status){
          case '0':
            return '关闭';
          case '1':
            return '开启';
        }
      },
      
    },
    methods: {
      
      beforeClose: function(done) {
        this.$confirm('关闭前请先确认已保存修改设置?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch(()=>{
        
        })
      },
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      handleClose(){
        this.showSetting = false;
        this.loadData(this.offset, this.limit)
      },
      formatData (data) {
        data.map(item=>{
          item.isIdcard==='1' ? item.isIdcard = '身份证信息' : item.isIdcard = ''
          item.isInfo==='1' ? item.isInfo = '其他信息': item.isInfo = ''
          return item
        })      
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {
          ...self.searchForm, 
        };
        searchParams.offset = offset;
        searchParams.limit = limit;
        loadList(searchParams).then(function (response) {
          if (response.data && response.data.code==1) {
            self.formatData(response.data.dataList)
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            // 当从零查询，则重置页码
            offset==0 && self.pageReset()


          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      handleSet: function (data) {
        this.rowData = data;
        this.showSetting = true;
      }
    },
    mounted() {
      this.loadData();
    },
    data() {
      return {
        showSetting: false,
        rowData: {},
        searchForm: {
          address: '',
          // communityName: '',
          account: ''
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .scroll .el-drawer__body{
    overflow: auto;
  }
</style>

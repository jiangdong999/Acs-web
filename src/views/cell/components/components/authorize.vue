<template>
  <div v-loading="loading" class="jdHouseClass" v-show="false">
    <div class="table-control-panel clearfix">
      <span class="control-left list-title">待审批住户</span>
    </div>
    <!-- 加position为了消除表格抖动 -->
    <div style="position: relative"> 
      <el-table class="table-box" :data="tableData" stripe fit>
        <el-table-column
          type="index"
          :index="indexMethod"
          width="60" 
          label="序号">
        </el-table-column>
        <el-table-column
          prop="sponsor"
          min-width="120"
          label="申请人">
        </el-table-column>
        <el-table-column
          prop="applyType"
          min-width="120"
          label="申请类型">
        </el-table-column>
        <el-table-column
          prop="authorityContext"
          min-width="120"
          label="内容">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          min-width="200"
          label="提交时间">
          <template slot-scope="scope">
            {{ scope.row.applyTime | formatDateTime }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="140">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleAuthorize(scope.row)"
              size="small">
              查看
            </el-button>
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
          :total="totalRecord">
        </el-pagination>
      </div>
    </div>
    
    <div v-if="showMessage">
      <el-dialog
        title="授权信息详情"
        width="790px"
        top="10vh"
        :visible.sync="showMessage"
        :close-on-click-modal="false">
        <authorize-form :id="authorityLog_id"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {fetchAuthorize} from "@/api/message";
import authorizeForm from "@/views/message/authorizeForm";
import mixin from "@/utils/mixin";
import {formatDateTime} from "@/filters/index";

export default {
  props:['node'],
  mixins:[mixin],
  filters: {
    formatDateTime,
  },
  components:{
    authorizeForm
  },
  data(){
    return {
      loading:false,
      showMessage:false,
      authorityLog_id:null
    }
  },
  methods:{
    handleAuthorize:function(data){
      this.authorityLog_id = data.authorityLog_id
      this.showMessage = true
    },
    loadData: function (offset=0, limit=10) {
      let self = this;
      self.loading = true;
      let searchObj = {
        status: '2',
        offset: offset,
        limit: limit,
        nodeId: self.node.nodeId,
        communityId: self.node.communityId
      };
      
      fetchAuthorize(searchObj).then(function (response) {
        if(response.data && response.data.code===1){
          self.tableData = response.data.dataList || [];
          self.totalRecord = response.data.totalCount;
          self.loading = false;

          offset==0 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    handleClose(){
      this.showMessage = false
    }
  },
  mounted(){
    this.loadData()
  }
}
</script>
<style>
.jdHouseClass .table-control-panel{
  padding: 7px 0px;
} 
.jdHouseClass .el-table--fit{
  min-height: auto;
}
.jdHouseClass .el-table__row td{
  border-bottom:0px;
}
</style>
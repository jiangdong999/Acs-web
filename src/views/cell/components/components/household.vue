<template>
  <div v-loading="loading" class="jdHouseClass">
    <div class="table-control-panel clearfix">
      <span class="control-left list-title">已加入住户</span>
    </div>
    <div>
      <el-table class="table-box" :data="tableData" stripe fit>
        <el-table-column
          type="index"
          :index="indexMethod"
          width="60" 
          label="序号">
        </el-table-column>
        <el-table-column
          prop="householdName"
          min-width="80"
          label="住户姓名">
        </el-table-column>
        <el-table-column
          prop="householdType"
          min-width="80"
          label="住户类型">
          <template slot-scope="scope">
            {{ scope.row.householdType | transHouseholdRole }}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="100"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="certificateNo"
          min-width="160"
          label="身份证号码">
        </el-table-column>
        <el-table-column
          prop="leaseStatus"
          min-width="120"
          label="租户状态">
          <template slot-scope="scope">
            {{ scope.row.householdType=='3'? scope.row.leaseStatus: '' | leaseStatus}}
          </template>
        </el-table-column>
        <el-table-column
          min-width="140"
          label="住户有效期">
          <template slot-scope="scope">
            {{ scope.row.leaseStartTime | formatTimeMillisToDate }}
            -
            {{scope.row.leaseEndTime | formatTimeMillisToDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cardList"
          min-width="80"
          label="门卡卡号">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.cardList || scope.row.cardList.length==0"
                type="text"
                @click="handleAction(scope.row)"
                size="small">
                添加
              </el-button>
              <template v-else>
                <el-button
                  v-for="(card,index) in scope.row.cardList"
                  :key="index"
                  type="text"
                  @click="handleAction(scope.row)"
                  size="small">
                  {{card.cardNo}}
                </el-button>
              </template>
            </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          min-width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleHousehold(scope.row)"
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
    
    <div v-if="showAddCard">
      <el-dialog
        title="门卡详情"
        :visible.sync="showAddCard"
        width="550px"
        :show-close="true"
        :append-to-body="true"
        :close-on-click-modal="false">
        <card :householdInfo="rowData" @handleClose="closeCard()"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import mixin from "@/utils/mixin.js";
import mixin from "@/utils/mixin-pagev1";
// import {existHouseholdList} from "@/api/room";
import { fetchList,delHousehold } from "@/api/householdv1";
import card from "../../../household/components/card.vue";
// import {delHousehold} from "@/api/household"
import {transHouseholdRole} from "@/filters/household";
// import {formatCitizenId} from "@/filters/citizenId"
import {formatTimeMillisToDate} from "@/filters/index";
import { leaseStatus } from "@/filters/card";
export default {
  props:['node'],
  mixins:[mixin],
  components:{
    card
  },
  filters: {
    formatTimeMillisToDate,
    transHouseholdRole,
    leaseStatus
  },
  data(){
    return {
      rowData:{},
      loading:false,
      showAddCard:false,

    }
  },
  methods:{
    closeCard(){
      this.showAddCard=false
      this.loadData(this.page, this.size)
    },
    handleHousehold(data){
      localStorage.setItem('householdDetails',JSON.stringify({
        communityId: data.communityId,
        householdId: data.householdId,
        roomNodeId: this.node.nodeId,
        communityUuid: data.communityUuid,
        householdUuid: data.householdUuid,
        nodeUuid: data.nodeUuid,
      }))
      this.$router.push({path: '/business/householdDetails'})
    },
    handleAction: function(data){
      this.rowData = {
        ...data,
        roomNodeId: this.node.nodeId
      }
      this.showAddCard = true
    },
    loadData: function (page=1, size=10) {
      let query = JSON.parse(localStorage.getItem('RoomView'))
      let self = this;
      self.loading = true;
      let searchObj = {
        communityId: self.node.communityId,
        page: page,
        size: size,
        nodeId: self.node.nodeId,
        ...query
      };
      
      fetchList(searchObj).then(function (response) {
        if(response.data && response.data.status===0){
          self.tableData = response.data.content.list || [];
          self.totalRecord = response.data.content.total;
          self.loading = false;

          page==1 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    handleDel: function (data) {
      let self = this;
      if (data.householdUuid) {     
        self.$confirm('确定删除此人员吗？')
          .then(_ => {
            self.loading = true;
            delHousehold({
              ...data,
              roomNodeId: this.node.nodeId,
            }).then(function (response) {
              if (response && response.data.status === 0) {
                self.$message({
                  message: '删除已完成',
                  type: 'success'
                });
                self.loadData(self.page, self.size);
              }
            }).catch(function (a) {
              self.loading = false;
            })
          })
          .catch((a) => {
            self.loading = false;
          });
      } else {
        self.$message({
          message: '该记录暂无法删除，请联系管理人员进行操作',
          type: 'error'
        });
      }
    }
  },
  mounted(){
    this.loadData()
    //阻止confirm弹窗按enter键不断执行删除的bug
    document.onkeydown = function (event) {
      let ev = (typeof event!= 'undefined') ? window.event : e;
      if(ev.keyCode == 13) {
        return false;
      } 
    }
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
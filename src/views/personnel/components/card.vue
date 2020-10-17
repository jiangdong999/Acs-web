<template>
  <div class="table-container" v-loading="loading">
    <!-- <span class="control-right">
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px">新增门禁卡</el-button>
    </span> -->
    <el-row>
      <el-table :data="tableData" stripe>
        <div slot="empty" class="empty-table"></div>
        <el-table-column
          type="index"
          :index="indexMethod"
          
           
          width="60" label="序号">
        </el-table-column>
        <el-table-column
          prop="cardholder"
          
          min-width="120"
           
          label="持有人">
        </el-table-column>
        <el-table-column
          prop="cardNo"
          
          min-width="200"
           
          label="门禁卡号">
        </el-table-column>
        <el-table-column
          prop="status"
          
          min-width="120"
           
          label="授权状态">
          <template slot-scope="scope">
            {{ scope.row.status | transStatus}}
          </template>
        </el-table-column>
        <el-table-column
          prop="accessStartTime"
          
           
          label="有效期限"
          min-width="180">
          <template slot-scope="scope">
            {{ scope.row.accessStartTime | formatDateTimeWithDot}} - {{scope.row.accessEndTime | formatDateTimeWithDot}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          
           
          min-width="200"
          label="操作时间">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column
          
          label="操作"
          min-width="120"
          fixed="right"
           >
          <template slot-scope="scope">
            <el-button
            type="text"
            @click="handleDel(scope.row)">
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
        layout="prev, pager, next, slot"
        :total="totalRecord">
        <label class="page-slot-left">共计<label> {{totalRecord}} </label>条数据</label>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {delCard} from "@/api/card";
import {fetchCardList} from "@/api/personnel";
import {formatDateTime, formatDateTimeWithDot} from "@/filters/index"
import {transStatus} from "@/filters/household"
import mixin from "@/utils/mixin";

export default {
  mixins: [mixin],
  data(){
    return {
    }
  },
  filters:{
    formatDateTime,
    formatDateTimeWithDot,
    transStatus
  },
  methods:{
    loadData: function (offset=0, limit=10) {
      let self = this;
      self.loading = true;
      let searchParams = {};
      if(this.$route.name == "familyEdit"){
        searchParams.cardType = '1';
      }else{
        searchParams.cardType = '2';
      }

      searchParams.communityId = self.$route.query.communityId;
      searchParams.householdId = self.$route.query.householdId;
      searchParams.offset = offset || 0;
      searchParams.limit = limit || 10;
      
      fetchCardList(searchParams).then(function (response) {
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
    handleDel:function(data){
      let self = this;
      self.$confirm('确定删除此门禁卡吗？')
        .then(_ => {
          delCard({
            cardId: data.cardId,
            cardNo: data.cardNo
          }).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: '删除已完成',
                type: 'success'
              });
              self.loadData(self.offset, self.limit)
            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
            return false;
          }).catch(function (a) {
            console.error(a);
          })
        })
        .catch((a) => {
          console.error(a);
        });
    },
  },
  mounted(){
    this.loadData()
  }
}
</script>

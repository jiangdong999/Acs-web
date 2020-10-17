<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">停车位列表</span>
          </div>
        </el-col>
      </el-row>
      <div class="table-container" v-loading="loading">
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="park_name"
              min-width="160"
              label="停车场">
            </el-table-column>
            <el-table-column
              prop="car_space_no"
              min-width="160"
              label="停车位">
            </el-table-column>
            <el-table-column
              prop="card_type_name"
              min-width="120"
              label="卡类">
            </el-table-column>
            <el-table-column
              prop="start_time"
              min-width="160"
              label="开卡时间">
              <!-- <template slot-scope="scope">
                {{ scope.row.start_time | formatDate}}
              </template> -->
            </el-table-column>
            <el-table-column
              prop="end_time"
              min-width="200"
              label="到期时间">
              <!-- <template slot-scope="scope">
                {{ scope.row.end_time | formatDate}}
              </template> -->
            </el-table-column>
            <el-table-column
              prop="car_no"
              min-width="100"
              label="车牌号">
            </el-table-column>
            <el-table-column
              prop="card_type_name"
              min-width="120"
              label="车辆型号">
            </el-table-column>
            <el-table-column
              prop="owner_name"
              min-width="120"
              label="车主">
            </el-table-column>
            <el-table-column
              prop="owner_phone"
              min-width="120"
              label="联系方式">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="100">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  disabled
                  @click="handleEdit(scope.row.car_id)">
                  查看详情
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
  </div>
</template>

<script>
  import mixin from "@/utils/mixin";
  import {fetchParkingList} from "@/api/vehicle";

  export default {
    mixins: [mixin],
    methods: {
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.loadData()
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let listObj = {
          offset: offset,
          limit: limit,
          communityId: self.community.communityId
        };
        fetchParkingList({...self.searchForm, ...listObj}).then(function (response) {
          if(response.data && response.data.code===1){
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      }
    },
    mounted() {
      this.loadData();
    },
    data() {
      return {
        // searchForm: {
        //   propertyId:'',
        //   communityId:''
        // },
        total_car_space:'',
        current_car_num:'',
        remain_car_space:''
      }
    }
  }
</script>
<style scoped>
  .list-title span{
    color: #000;
    font-size: 16px;
  }
</style>

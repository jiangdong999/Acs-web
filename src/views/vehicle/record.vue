<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">车辆出入记录列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                 <el-form ref="searchForm" :model="searchForm" :inline="true">    

                  <el-row>
                    <el-col :span="24">
                      <el-form-item class="room-place" label="时间范围" prop="timeRange">
                      <el-date-picker
                        v-model="searchForm.timeRange"
                        type="datetimerange"
                        value-format="yyyyMMddHHmmssSSS"
                        align="center"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        range-separator="至"
                        :default-time="['12:00:00', '12:10:00']">
                      </el-date-picker>
                    </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item class="room-place">
                        <el-radio v-model="searchForm.time_type" label="0">进出时间</el-radio>
                        <el-radio v-model="searchForm.time_type" label="1">进入时间</el-radio>
                        <el-radio v-model="searchForm.time_type" label="2">离开时间</el-radio>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="卡类选择" prop="card_guid">
                      <el-select v-model="searchForm.card_guid" clearable filterable placeholder="请选择">
                        <el-option
                          v-for="item in cardTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="地点选择" prop="park_guid">
                      <el-select v-model="searchForm.park_guid" clearable filterable placeholder="请选择">
                        <el-option
                          v-for="item in parkList"
                          :key="item.guid"
                          :label="item.name"
                          :value="item.guid">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    </el-col>
                  </el-row>
                    <span class="jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary"  @click="loadData()">搜索</el-button>
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
              prop="enter_time"
              min-width="200"
              label="进入时间">
            </el-table-column>
            <el-table-column
              prop="leave_time"
              min-width="200"
              label="离开时间">
            </el-table-column>
            <el-table-column
              prop="parking_time"
              min-width="100"
              label="停留时长">
            </el-table-column>
            <el-table-column
              prop="car_type"
              min-width="120"
              label="车辆型号">
            </el-table-column>
            <el-table-column
              prop="community_name"
              min-width="200"
              label="小区名称">
            </el-table-column>
            <el-table-column
              prop="card_type_name"
              min-width="120"
              label="卡类">
            </el-table-column>
            <el-table-column
              prop="car_owner_name"
              min-width="120"
              label="车主">
            </el-table-column>
            <el-table-column
              prop="car_owner_phone"
              min-width="120"
              label="联系方式">
            </el-table-column>
            <el-table-column
              prop="openType"
              min-width="250"
              label="抓拍图片">
              <template slot-scope="scope">
                <el-image                      
                  :src="scope.row.enter_image" 
                  fit="scale-down"
                  class="pic-col"    
                  v-if="scope.row.enter_image != '' && scope.row.enter_image != undefined"           
                  :preview-src-list="[scope.row.enter_image]"
                >
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
                  </div>
                </el-image>

                <el-image                      
                  :src="scope.row.leave_image" 
                  fit="scale-down"
                  class="pic-col"      
                  v-if="scope.row.leave_image != '' && scope.row.enter_image != undefined"    
                  :preview-src-list="[scope.row.leave_image]"
                >
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="140">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="showMore(scope.row.record_guid)">
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
  import {fetchRecordList, parkList} from "@/api/vehicle";;
  import {cardTypeOptions} from "@/utils/options";
  
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
          communityId:self.community.communityId
        };
        self.searchForm.start_time = self.searchForm.timeRange[0];
        self.searchForm.end_time = self.searchForm.timeRange[1];
        fetchRecordList({...self.searchForm, ...listObj}).then(function (response) {
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
      initPark: function(data){
        let self = this;
        self.searchForm.park_guid = null;
        self.parkList = []
        if (data) {
          parkList({community_id:data}).then(function (response) {
            if (response && response.data) {
              self.parkList = response.data.dataList;
            }
          }).catch(function (a) {
            console.error(a)
          });
        }
      },
      // transformPath: function(path){
      //   return 'data:image/png;base64,'+path
      // },
      showMore:function(recordGuid){
        this.$router.push('/vehicle/recordDetails?recordGuid='+ recordGuid)
      }
    },
    mounted() {
      this.loadData();
      this.initPark(this.communityId);
      this.cardTypeOptions = cardTypeOptions;
    },
    data() {
      return {
        parkList: [],
        cardTypeOptions:[],
        searchForm: {
          timeRange:[],
          startEntryTime: '',
          endEntryTime: '',
          time_type:'0',
          card_guid:null,
          park_guid:null
        }
      }
    }
  }
</script>
<style scoped>
  .list-title span{
    color: #000;
    font-size: 16px;
  }
  .mini-pic{
    width: 60px;
    height: 60px;
    cursor: pointer;
    margin-right: 10px;
    object-position: 50% 50%;
    object-fit: cover;
  }
</style>

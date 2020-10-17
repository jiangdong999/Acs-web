<!-- 监控告警 -->
<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">隔离告警列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form :inline="true" :model="searchForm" label-position="right" ref="searchForm">
                    <el-row :gutter="20">
                      <el-col :span="12">

                        <el-form-item label="住户姓名" prop="householdName">
                            <el-input placeholder="请输入" clearable v-model="searchForm.householdName"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                            <el-input placeholder="请输入" clearable v-model="searchForm.phone"/>
                        </el-form-item>

                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">

                        <el-form-item label="身份证号" prop="idCard" class="card-id">
                            <el-input placeholder="请输入" clearable v-model="searchForm.idCard"/>
                        </el-form-item>  
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="出现位置" prop="alarmLocation">
                            <el-input placeholder="请输入" clearable v-model="searchForm.alarmLocation"/>
                        </el-form-item>            

                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="出现时间" prop="timeRange">
                          <el-date-picker
                            v-model="timeRange"
                            type="datetimerange"
                            value-format="yyyyMMddHHmmssSSS"
                            align="center"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            range-separator="至"
                            :default-time="['00:00:00', '23:59:59']">
                          </el-date-picker>
                        </el-form-item>        

                      </el-col>
                    </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="出现方式" prop="triggerMethod">
                            <el-select v-model="searchForm.triggerMethod" filterable placeholder="请选择" clearable>
                              <el-option value="1" label="抓拍"/>
                              <el-option value="2" label="尝试开门"/>
                              <el-option value="3" label="开门"/>
                            </el-select>
                          </el-form-item>

                        </el-col>
                      </el-row>
                      <span class="jdClassbtn">
                        <el-button @click="handleReset()">重置</el-button>
                        <el-button type="primary"  @click="search()">搜索</el-button>
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
    </div>
    <div class="calculate">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="num-box yellow" :class="{'checked':timeRange.length==0}" @click="searchTotal()">
            <span>告警总数</span>
            <span>{{statistics.totalCount}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="num-box red" :class="{'checked': isChecked}" @click="searchToday()">
            <span>今日告警</span>
            <span>{{statistics.todayCount}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-container" v-loading="loading">
      <el-row>
        <el-table :data="tableData" stripe  ref="table" :highlight-current-row="true">
          <div slot="empty" class="empty-table"></div>
          <el-table-column
            type="index"
            :index="indexMethod"
            width="60" label="序号">
          </el-table-column>
          <el-table-column
            prop="household_name"
            min-width="80"
            label="住户姓名">
          </el-table-column>
            <el-table-column
            prop="alarm_type"
            min-width="100"
            label="告警类型">
          </el-table-column>
          <el-table-column
            prop="phone"
            min-width="120"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="id_card"
            min-width="150"
            label="身份证号">
          </el-table-column>
          <el-table-column
            prop="alarm_time"
            min-width="120"
            label="出现时间">
            <template slot-scope="scope">
              <span>{{scope.row.alarm_time | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="alarm_location"
            min-width="90"
            label="出现位置">
          </el-table-column>
          <el-table-column
            prop="trigger_method"
            min-width="90"
            label="出现方式">
          </el-table-column>
          <el-table-column
            label="抓拍图片"
            fixed="right"
            min-width="80">
            <template slot-scope="scope">
              <el-image
              :src="scope.row.snap_url"
              fit="scale-down"
              class="pic-col"
              :preview-src-list="[scope.row.snap_url]"
              :z-index="2001"
              v-if="scope.row.snap_url !=''">
                <div slot="error" class="image-slot">
                  <span class="img-err pic-col"></span>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleSearch(scope.row)"
                size="small">
                查看
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
</template>
<script>
  import mixin from "@/utils/mixin"
  import result from './components/result.vue'
  import {monitorTable,monitorStatistic} from "@/api/epidemic" 
  import { mapGetters } from 'vuex';
  import {formatDateTime} from "@/filters/index";
  import {transCheckResult,transCheckType} from "@/filters/epidemic";
  import dateUtil from '@/utils/times'

  export default {
    mixins: [mixin],
    components: {
      result
    },
    filters:{
      formatDateTime,
      transCheckResult,
      transCheckType
    },
    data () {
      return {
        rowData: {},
        showResult: false,
        searchForm: {
          communityId: null,
          householdName: '',
          phone: '',
          idCard:'',
          alarmStartTime: '',
          alarmEndTime: '',
          alarmLocation: '',
          triggerMethod: ''
        },
        tableData:[],
        statistics: {
          totalCount: null,
          todayCount: null
        }
      }
    },
    computed: {
      ...mapGetters([
        'communityId'
      ]),
      timeRange: {
        get () {
          return this.searchForm.alarmStartTime?[this.searchForm.alarmStartTime,this.searchForm.alarmEndTime]:[]
        },
        set (newValue) {
          this.searchForm.alarmStartTime = newValue?newValue[0]:''
          this.searchForm.alarmEndTime = newValue?newValue[1]:''
        }
      },
      isChecked: {
        get () {
          return this.searchForm.alarmStartTime === `${dateUtil.toServerDateString(new Date()).slice(0,8)}000000000` && this.searchForm.alarmEndTime === `${dateUtil.toServerDateString(new Date()).slice(0,8)}235959000` ? true : false
        },
        set () {

        }
      }
    },
    created () {
      this.loadData()
      this.monitorStatistic()
    },
    methods: {
      searchTotal () {
        this.timeRange = []
        this.loadData()
      },
      searchToday () {    
        this.searchForm.alarmStartTime = `${dateUtil.toServerDateString(new Date()).slice(0,8)}000000000`
        this.searchForm.alarmEndTime = `${dateUtil.toServerDateString(new Date()).slice(0,8)}235959000`
        this.loadData()
      },
      search () {
        this.loadData()
        this.monitorStatistic()
      },
      handleClose () {
        this.showResult = false
      },
      handleReset () {//重置
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      //加载数据和搜索事件
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {...this.searchForm};
        searchParams.communityId = self.communityId || -1;
        searchParams.offset = offset;
        searchParams.limit = limit;
        monitorTable(searchParams).then(function (response) {
          self.loading = false;
          if (response && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            
            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      //统计项
      monitorStatistic: function () {
        let self = this;
        let searchParams = {...this.searchForm};
        searchParams.communityId = self.communityId || -1;
        monitorStatistic(searchParams).then(function (response) {
          if (response && response.data.code === 1) {
           self.statistics = response.data.data
          //  console.log(self.statistics)
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      handleSearch (data) {
        let query = {
          communityId: data.community_id,
          householdId: data.household_id, 
          roomNodeId: data.room_id
        }
        localStorage.setItem('query',JSON.stringify({
        query
      }))
        this.$router.push({ path: '/business/householdDetails'})
      }
    }
  }
</script>
<style lang="scss" scoped>
.calculate{
  padding: 19px 20px 20px;
  .num-box{ 
    width: 100%;
    height: 80px;   
    border-radius: 8px;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.05); 
    padding-left: 20px;
    position: relative;
    span{
      height: 80px;
      color: #fff;
      line-height: 80px; 
    }
    span:nth-of-type(1){     
      font-size: 20px;
      font-weight: SC;
      margin-right: 20px;
      vertical-align: middle;   
    }
    span:nth-of-type(2){
      font-size: 30px;
      font-weight: 600;  
      vertical-align: middle;   
    }
  }
  .checked:before{
    content:'';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url(../../../assets/icon/checked.png);
    background-size: contain;
    position: absolute;
    right: 9px;
    top: 9px;
  }
  .yellow{
    background: #FCA91B;
  }
  .red{
    background: #FF6565;
  }
}
</style>

<!-- 智能预警 -->
<template>
  <div class="warn_content">
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">告警列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-left">
              <el-button type="primary" @click="WarnRulesStatus=true">预警规则</el-button>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">

                  <el-form
                    :inline="true"
                    :model="searchForm"
                    label-width="70px"
                    label-position="right"
                    ref="searchForm"
                  >

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="住户姓名" prop="householdName">
                          <el-input placeholder="请输入" clearable v-model="searchForm.householdName" />
                        </el-form-item>

                      </el-col>
                      <el-col :span="12">

                        <el-form-item label="告警类型" prop="warnType">
                          <el-select
                            v-model="searchForm.warnType"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option value="1" label="疑似返程人员" />
                            <el-option value="2" label="疑似群租房" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
          
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="告警时间">
                          <el-date-picker
                            v-model="timeRange"
                            type="datetimerange"
                            value-format="yyyyMMddHHmmssSSS"
                            align="center"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            range-separator="至"
                            :default-time="['00:00:00', '23:59:59']">
                          </el-date-picker>
                        </el-form-item>  
                      </el-col>
                      
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="处理状态" prop="statusId">
                          <el-select
                            v-model="searchForm.statusId"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option value="0" label="未处理" />
                            <el-option value="1" label="已处理" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <span class="jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary" @click="search()">搜索</el-button>
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
          <div class="num-box yellow" :class="{'checked':isCheckedWeek}" @click="searchWeek()">
            <span>本周预警数</span>
            <span>{{statistics.weekCount}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="num-box red" :class="{'checked':isCheckedToday}" @click="searchDay()">
            <span>本日预警数</span>
            <span>{{statistics.todayCount}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-row>
        <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          @row-click="tableRowClick"
          ref="table"
          :highlight-current-row="true"
        >
          <div slot="empty" class="empty-table"></div>
          <el-table-column
            type="index"
            :index="indexMethod"
            width="60"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="warnType"
            min-width="80"
            label="告警类型"
          >
            <template slot-scope="scope">
              <span>{{scope.row.warnType == 1 ? '疑似返程人员':'疑似群租房'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            min-width="120"
            label="预警原因"
          ></el-table-column>
          <el-table-column
            prop="warnTime"
            min-width="90"
            label="告警时间"
          >
            <template slot-scope="scope">
              <span>{{scope.row.warnTime | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="statusId"
            min-width="50"
            label="处理状态"
          >
            <template slot-scope="scope">
              <span>{{scope.row.statusId == 0 ? '未处理':'已处理'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            min-width="50"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="handleSearch(scope.row)" size="small">查看</el-button>
            </template>
          </el-table-column>

          <el-table-column type="expand" width="60" fixed="left"
            label="展开">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="table-expand" v-if="scope.row.warnType == '1'">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="姓名">
                        <span>{{ scope.row.householdName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="身份证号码">
                        <span>{{ scope.row.cardNo  }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="手机号码">
                        <span>{{ scope.row.phone }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="通过门禁">
                        <span>{{ scope.row.doorName }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="拥有房间">
                        <span v-for="item in scope.row.roomNameList" :key="item" style="margin:0 10px;">{{ item }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-form label-position="left" inline class="table-expand" v-else-if="scope.row.warnType == '2'">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="房间位置">
                        <span>{{ scope.row.location}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="房间已登记人数">
                        <span>{{ scope.row.personNum }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="产权人">
                        <span>{{ scope.row.landlordName }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="房间内承租人">
                        <span v-for="item in scope.row.renterNames" :key="item" style="margin:0 10px;">{{ item }}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
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
    <!-- 预警规则弹层 -->
    <div v-if="WarnRulesStatus">
      <el-dialog
        title="预警规则"
        :visible.sync="WarnRulesStatus"
        width="400px"
        :close-on-click-modal="false"
      >
        <WarnRules />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "@/utils/mixin"; //表格公共的分页
import WarnRules from "./components/WarnRules.vue"; //预警规则模板
import { intelligentTable,intelligentcount } from "@/api/epidemic"; //table的数据接口
import { mapGetters } from "vuex"; //mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
import { formatDateTime } from "@/filters/index"; //处理时间戳

export default {
  mixins: [mixin],
  components: {
    WarnRules //预警规则模板
  },
  filters: {
    formatDateTime //处理时间戳
  },
  data() {
    return {
      loading: false,
      WarnRulesStatus: false, //预警规则状态
      statistics: {
        toDayNum:'',
        weekCount:'',
      },
      searchForm: {
        communityId: null,//社区id
        householdName: "",//用户姓名
        startTime: "",//通行时间
        warnType: "",//告警类型
        statusId:"",//处理状态
        startTime: '',
        endTime: '',
      },
      tableData: []//表格数据
    };
  },
  //从getter中拿取communityId
  computed: {
    ...mapGetters(["communityId"]),
    timeRange: {
      get () {
        return this.searchForm.startTime?[this.searchForm.startTime,this.searchForm.endTime]:[]
      },
      set (newValue) {
        this.searchForm.startTime = newValue?newValue[0]:''
        this.searchForm.endTime = newValue?newValue[1]:''
      }
    },
    isCheckedToday: {
      get () {
        return this.searchForm.startTime === this.statistics.todayStart && this.searchForm.endTime === this.statistics.todayEnd ? true : false
      },
      set () {

      }
    },
    isCheckedWeek: {
      get () {
        return this.searchForm.startTime === this.statistics.weekStart && this.searchForm.endTime === this.statistics.weekEnd ? true : false
      },
      set () {
        
      }
    }
  },
  created() {
    this.loadData();
    this.warnCount();
  },
  methods: {
    search () {
      this.loadData();
      this.warnCount();
    },
    searchDay () {
      this.searchForm.startTime = this.searchForm.startTime == this.statistics.todayStart ? '' : this.statistics.todayStart
      this.searchForm.endTime = this.searchForm.endTime == this.statistics.todayEnd ? '' : this.statistics.todayEnd
      this.loadData()
    },
    searchWeek () {
      this.searchForm.startTime = this.searchForm.startTime == this.statistics.weekStart ? '' : this.statistics.weekStart
      this.searchForm.endTime = this.searchForm.endTime == this.statistics.weekEnd ? '' : this.statistics.weekEnd
      this.loadData()
    },
    //点击行操作
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    //重置按钮
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.loadData();
    },
    //加载数据和搜索事件
    loadData: function(offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };//上行参数
      
      searchParams.communityId = self.communityId || -1;
      searchParams.offset = offset;
      searchParams.limit = limit;
      intelligentTable(searchParams)
        .then(function(response) {
          // console.log(response)//返回响应数据
          self.loading = false;
          if (response && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;

            offset == 0 && self.pageReset();//重置分页
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    //预警总数
    warnCount:function(){
      let self = this;
      let formParams = { communityId:null };//上行参数
      formParams.communityId = self.communityId || -1;
      intelligentcount(formParams).then(function(response) {          
          if (response && response.data.code === 1) {
            self.statistics = response.data.data
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    //表格点击查看
    handleSearch(data) {      
      if(data.warnType == '1'){//疑似返程人员
        let query = {
          communityId: data.community_id,
          householdId: data.household_id,
          roomNodeId: data.room_id
        };
        this.$router.push({ path: "/business/householdDetails", query: query });
      }else if(data.warnType == '2'){//疑似群租房
        let query = {
          communityId: data.community_id,
          nodeId:data.nodeId
        }
        this.$router.push({path: '/business/cell/details', query: query})
      }else{
        return false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.number-div{
  width: 100%;
  height: 70px;
  margin-bottom: 20px;
  line-height:70px;
}
.number-div-class{
  background: #fff;
  border-radius: 15px;
  font-size: 16px;
  text-align: left;
  color: #707070;
  font-weight: 600;
  padding: 0 30px;
}
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

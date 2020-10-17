<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
          <el-col>
            <div class="table-control-panel">
              <span class="control-left list-title">隔离人员列表</span>
              <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
              <span class="control-right">
                <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                  <div class="control-panel jdClass">
                     <el-form :inline="true" :model="searchForm" label-position="right" ref="searchForm">    
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="住户姓名" prop="householdName">
                            <el-input placeholder="请输入" :maxlength="20" clearable v-model="searchForm.householdName"/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="手机号码" prop="phone">
                            <el-input placeholder="请输入" clearable :maxlength="11" v-model="searchForm.phone"/>　
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="隔离开始日期" prop="date" class="repairDate">
                            <el-date-picker v-model="searchForm.date" type="date"
                              class="sSize-input-date"
                              value-format="yyyyMMdd000000000"
                              placeholder="选择日期">
                            </el-date-picker>　
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

      <div class="calculate">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="num-box white" :class="{checked: searchForm.personnelStatus == '1'}" @click="isolatingCount('1')">
              <span>隔离中</span>
              <span>{{statistics.isolatingCount}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="num-box red" :class="{checked: searchForm.personnelType=='1'}" @click="isReturnCount('1')">
              <span>返程隔离</span>
              <span>{{statistics.isolatingReturnCount}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="num-box red" :class="{checked: searchForm.personnelType=='2'}" @click="isReturnCount('2')">
              <span>密接隔离</span>
              <span>{{statistics.isolatingContactCount}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="num-box green" :class="{checked: searchForm.personnelStatus == '0'}" @click="isolatingCount('0')">
              <span>隔离结束</span>
              <span>{{statistics.isolatedCount}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="table-container" v-loading="loading">
        <el-row>
          <el-table :data="tableData" stripe :highlight-current-row="true">
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="householdName"
              min-width="120"
              label="住户姓名">
            </el-table-column> 
            <el-table-column
              prop="phone"
              min-width="90"
              label="手机号码">
            </el-table-column>
            <el-table-column
              prop="personnelType"
              min-width="90"
              label="隔离类型">
              <template slot-scope="scope">
                {{ scope.row.personnel_type | transPersonnelType }}
              </template>
            </el-table-column>          
            <el-table-column
              prop="quarantine_time"
              min-width="120"
              label="隔离时间">
              <template slot-scope="scope">
                <span v-if="scope.row.returnDate">{{scope.row.returnDate | formatDate}}至{{scope.row.endTime | formatDate}}</span>
                <span v-if="scope.row.quarantine_date">{{scope.row.quarantine_date | formatDate}}至{{scope.row.endTime | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="hasDevideDate"
              min-width="100"
              label="隔离状态">
              <template slot-scope="scope">
                <span v-if="scope.row.quarantineStatus=='0'">隔离结束</span>
                <span v-else>已隔离{{scope.row.hasDevideDate?`${scope.row.hasDevideDate}`:'0'}}天</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="province"
              min-width="100"
              label="返程地点">
              <template slot-scope="scope">{{scope.row.provinceName? scope.row.cityName?`${scope.row.provinceName}${scope.row.cityName}`: `${scope.row.provinceName}` : ''}}</template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="80">
              <template slot-scope="scope">
                <!-- <el-button
                  type="text"
                  @click="handleSearch(scope.row)"
                  size="small">
                  查看
                </el-button> -->
                <el-button
                  :disabled="scope.row.quarantineStatus=='0'"
                  type="text"
                  @click="cancel(scope.row)"
                  size="small">
                  取消隔离
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
import { devidePersonList,cancelDevide,devidePersonStatistic } from "@/api/epidemic";
import mixin from "@/utils/mixin";
import { mapGetters } from 'vuex';
import {transPersonnelType} from '@/filters/epidemic'
import {formatDate} from '@/filters/index'
import dateUtil from "@/utils/times";
export default {
  mixins: [mixin],
  filters: {
    transPersonnelType,
    formatDate
  },
  data () {
    return{
      loading: false,
      searchForm: {
        householdName:'',
        phone: '',
        personnelType: '',
        date: '',
        personnelStatus: '',
      },
      statistics: {
        isolatedCount: null,//隔离结束
        isolatingContactCount: null,//密接隔离
        isolatingCount: null,//隔离中
        isolatingReturnCount: null //返程隔离
      }
    }
  },
  computed: {
    ...mapGetters([
      'communityId'
    ])
  },
  created () {
    let query = JSON.parse(localStorage.getItem('query'))  
    if(query.type){
      this.searchForm.personnelType = query.type    
    }
    this.loadData()
    this.devidePersonStatistic()
  },
  methods:{
    isolatingCount (status) {
      this.searchForm.personnelStatus = this.searchForm.personnelStatus === status ? '' : status
      this.loadData ()
    },
    isReturnCount (type) {
      this.searchForm.personnelType = this.searchForm.personnelType === type ? '' : type
      this.loadData ()
    },
    search(){
      this.loadData()
      this.devidePersonStatistic()
    },
    //重置
    handleReset:function(){
      this.$refs.searchForm.resetFields();
      this.loadData();
    },
    loadData: function (offset=0, limit=10) {
      let self = this;
      self.loading = true;
      let searchParams = {...this.searchForm};
      searchParams.communityId = self.communityId || -1;
      searchParams.offset = offset;
      searchParams.limit = limit;
      devidePersonList(searchParams).then(function (response) {
        self.loading = false;
        if (response && response.data.code === 1) {
          self.tableData = response.data.dataList || [];
          self.tableData.map(item=>{
            if(item.personnel_type=='2'){
              let startTime = dateUtil.strToTimestamp(item.quarantine_date)
              let nowTime = dateUtil.toTimestamp(new Date())
              let time = (nowTime - startTime)/(24*3600*1000)
              item.hasDevideDate = parseInt(time) < 0 || parseInt(time) == 0 ? 0 : parseInt(time)
              let num = item.quarantine_time ? item.quarantine_time : 14 
              item.endTime = dateUtil.toAddDays(item.quarantine_date,num)
            }else if(item.personnel_type=='1'){
              let startTime = dateUtil.strToTimestamp(item.returnDate)
              let nowTime = dateUtil.toTimestamp(new Date())
              let time = (nowTime - startTime)/(24*3600*1000)
              item.hasDevideDate = parseInt(time) < 0 || parseInt(time) == 0 ? 0 : parseInt(time)

              let num = item.quarantine_time ? item.quarantine_time : 14 
              item.endTime = dateUtil.toAddDays(item.returnDate,num)
            }
            return item
          })

          self.totalRecord = response.data.totalCount;         
          offset==0 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    //统计项
    devidePersonStatistic: function () {
      let self = this;
      let searchParams = {...this.searchForm};
      searchParams.communityId = self.communityId || -1;
      devidePersonStatistic(searchParams).then(function (response) {
        if (response && response.data.code === 1) {
          self.statistics = response.data.data
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    cancel (data) {
      let self = this
      self.$confirm('确定取消隔离吗？').then(_ => {
        self.loading = true;
        cancelDevide({
          householdId: data.householdId,
          communityId: data.communityId, 
        }).then(function (response) {
          if (response && response.data.code === 1) {
            self.$message({
              message: response.data.message,
              type: 'success'
            });
            self.loadData(self.offset, self.limit);
          } else {
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).finally(_=>{
          self.loading = false;
        })
      }).catch( (a) => {

      })
    },
    handleSearch () {
      
    }
  }
}
</script>
<style lang="scss" scoped>
.calculate{
  padding: 19px 20px 20px;
  .num-box{
    position: relative;
    width: 100%;
    height: 80px;   
    border-radius: 8px;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.05); 
    padding-left: 20px;
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
  .blue{
    background: #007ee4;
  }
  .green{
    background: #25C085;
  }
  .red{
    background: #FF6565;
  }
  .white{
    background: #FFFFFF;
    span{
      color: #FF6565;
    }
  }
  
}
</style>
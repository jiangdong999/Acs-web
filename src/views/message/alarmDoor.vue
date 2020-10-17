<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">门常开告警列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form :inline="true" :model="searchForm" ref="searchForm">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="所属小区" class="room-place" prop="communityId">
                        <el-select v-model="searchForm.communityId" placeholder="选择所属小区" clearable filterable>
                          <el-option
                            v-for="item in communityList"
                            :key="item.communityId"
                            :label="item.communityName"
                            :value="item.communityId">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      </el-col>
                      
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="当前状态" prop="status">
                          <el-select v-model="searchForm.status" clearable filterable placeholder="请选择">
                            <el-option label="未处理" value="0"></el-option>
                            <el-option label="已处理" value="1"></el-option>
                            <el-option label="已解除" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="现场情况" prop="alarmType">
                          <el-select v-model="searchForm.alarmType" clearable filterable placeholder="请选择">
                            <el-option label="房屋装修" value="1"></el-option>
                            <el-option label="住户搬家" value="2"></el-option>
                            <el-option label="婚丧嫁娶" value="3"></el-option>
                            <el-option label="门禁故障" value="4"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="门禁机" prop="doorName">
                          <el-input placeholder="请输入门禁机名称" clearable :maxlength="16" v-model="searchForm.doorName"/>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="时间范围" prop="timeRange">
                          <el-date-picker
                            v-model="timeRange"
                            type="datetimerange"
                            value-format="yyyyMMddHHmmssSSS"
                            align="center"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            range-separator="至"
                            :default-time="['12:00:00', '23:59:59']">
                          </el-date-picker>
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
              prop="alarmTime"
              min-width="200"
              label="日期">
            </el-table-column>
            <el-table-column
              prop="communityName"
              min-width="200"
              label="小区名称">
            </el-table-column>
            <el-table-column
              prop="doorName"
              min-width="100"
              label="门禁机名称">
            </el-table-column>
            <el-table-column
              min-width="130"
              label="告警状态">
              <template slot-scope="scope">
                <el-alert
                  :title="statusText(scope.row.status)"
                  :type="statusType(scope.row.status)"
                  :closable="false"
                  show-icon>
                </el-alert>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              min-width="270"
              label="告警流程">
              <template slot-scope="scope">
                <el-alert
                  :title="'解除告警 '+scope.row.finishTime"
                  v-if="scope.row.status==2"
                  type="success"
                  :closable="false"
                  show-icon>
                </el-alert>

                <el-alert
                  :title="'响应出发 '+scope.row.handleTime"
                  v-if="scope.row.status>=1 && scope.row.handleTime"
                  :type="scope.row.status==1?'warning':'info'"
                  :closable="false"
                  show-icon>
                </el-alert>

                <el-alert
                  :title="'设备告警 '+scope.row.alarmTime"
                  :type="scope.row.status==0?'error':'info'"
                  :closable="false"
                  show-icon>
                </el-alert>
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmType"
              min-width="200"
              label="现场情况">
              <template slot-scope="scope">
                {{ scope.row.alarmType | formatAlarmType }}
              </template>
            </el-table-column>
            <el-table-column
              prop="alarmMessage"
              min-width="200"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="imageUrls"
              min-width="300"
              label="图片">
              <template slot-scope="scope">
                <!-- <img v-for="(url, index) in scope.row.imageUrls" :src="url" :key="index" class="mini-pic" @click="showImage(url)" /> -->
                <el-image 
                  v-for="(url, index) in scope.row.imageUrls"
                  :key="index"                     
                  :src="url" 
                  fit="scale-down"
                  class="pic-col"                
                  :preview-src-list="[url]"
                >
                  <div slot="error">
                    <!-- <span class="img-err pic-col"></span> -->
                  </div>
                </el-image>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="page-container">
          <el-pagination
            background
            @size-change="limitChange"
            @current-change="turnPage"
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
  import {fetchDoorAlarm} from "@/api/message";
  import {formatDateTime} from "@/filters/index";
  import { mapGetters } from 'vuex';

  export default {
    mixins: [mixin],
    computed:{
      ...mapGetters([
        'communityList'
      ]),
      timeRange:{
        set(newValue){
          this.searchForm.startTime = newValue?newValue[0]:''
          this.searchForm.endTime = newValue?newValue[1]:''
        },
        get(){
          return this.searchForm.startTime? [this.searchForm.startTime,this.searchForm.endTime]: []
        }
      }
    },
    filters: {
      formatDateTime: formatDateTime,
      formatAlarmType:function(type){
        switch (type) {
          case '1':
            return '房屋装修'
            break;
          case '2':
            return '住户搬家'
            break;
          case '3':
            return '婚丧嫁娶'
            break;
          case '4':
            return '门禁故障'
            break;
          default:
            return ''
            break;
        }
      }
    },

    methods: {
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
        this.loadData()
      },
      loadData (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let listObj = {
          offset: offset,
          limit: limit,
        };
        fetchDoorAlarm({...self.searchForm, ...listObj}).then(function (response) {
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
      statusText(status){
        switch (status) {
          case 0:
            return '未处理'
            break;
          case 1:
            return '已处理'
            break;
          case 2:
            return '已解除'
            break;
          default:
            return '未知'
            break;
        }
      },
      statusType(status){
        switch (status) {
          case 0:
            return 'error'
            break;
          case 1:
            return 'warning'
            break;
          case 2:
            return 'success'
            break;
          default:
            return 'info'
            break;
        }
      }
    },
    mounted() {
      this.loadData();
    },
    data() {
      return {
        searchForm: {
          doorName: '',
          status: '',
          alarmType:'',
          startTime: "",
          endTime: "",
          communityId:''
        }
      }
    }
  }
</script>

<style>
  .mini-pic{
    width: 60px;
    height: 60px;
    cursor: pointer;
    margin-right: 10px;
    object-position: 50% 50%;
    object-fit: cover;
  }
</style>
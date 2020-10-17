<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">短信验证码</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                    <el-form ref="searchForm" :model="searchForm" :inline="true">            
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="短信类型" prop="messageType">
                            <el-select v-model="searchForm.messageType" clearable filterable>
                              <el-option label="普通短信" value="1"></el-option>
                              <el-option label="语音短信" value="2"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发送状态" prop="sendStatus">
                            <el-select v-model="searchForm.sendStatus" clearable filterable>
                              <el-option label="发送失败" value="0"></el-option>
                              <el-option label="发送成功" value="1"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                       <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="短信通道" prop="platformType">
                            <el-select v-model="searchForm.platformType" clearable filterable>
                              <el-option label="p253" value="p253"></el-option>
                              <el-option label="ucpaas" value="ucpaas"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                             <el-form-item label="手机号" prop="phone">
                            <el-input v-model="searchForm.phone" maxlength="11" clearable placeholder="请输入手机号"/>
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
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              range-separator="至"
                              :default-time="['00:00:00', '23:59:59']">
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
              prop="phone"
              min-width="80"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="messageType"
              min-width="80"
              label="短信类型">
              <template slot-scope="scope">
                {{ scope.row.messageType | transMessageType}}
              </template>
            </el-table-column>
            <el-table-column
              prop="sendStatus"
              min-width="80"
              label="发送状态">
              <template slot-scope="scope">
                {{ scope.row.sendStatus | transSendStatus}}
              </template>
            </el-table-column>
            <el-table-column
              prop="platformType"
              min-width="80"
              label="短信通道">
            </el-table-column>
            <el-table-column
              prop="applyTime"
              min-width="100"
              label="发送时间">
              <template slot-scope="scope">
                {{ scope.row.applyTime | formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              min-width="300"
              label="发送内容">
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
  import {fetchSmsList} from "@/api/sms";
  import { transMessageType } from "@/filters/sms";
  import {formatDateTime} from "@/filters/index";
  import mixin from "@/utils/mixin";

  export default {
    mixins: [mixin],
    filters:{
      transMessageType,
      formatDateTime,
      transSendStatus(status){
        switch (status) {
          case '0':
            return "发送失败";
            break;
          case '1':
            return "发送成功";
            break;
          default:
            break;
        }
      }
    },
    computed:{
      timeRange:{
        set(newValue){
          this.searchForm.applyTimeStart = newValue?newValue[0]:''
          this.searchForm.applyTimeEnd = newValue?newValue[1]:''
        },
        get(){
          return this.searchForm.applyTimeStart? [this.searchForm.applyTimeStart,this.searchForm.applyTimeEnd]: []
        }
      }
    },
    methods: {
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.timeRange = ''
        this.loadData()
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let listObj = {
          offset: offset,
          limit: limit
        }

        fetchSmsList({...self.searchForm, ...listObj}).then(function (response) {
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
        searchForm: {
          phone: '',
          messageType: '',
          sendStatus: '',
          platformType:'',
          applyTimeStart:'',
          applyTimeEnd:''
        }
      }
    }
  }
</script>
<style scoped>
</style>

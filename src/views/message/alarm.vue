<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">告警列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="searchForm" :model="searchForm" :inline="true">
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
                      <el-row>
                      <el-col :span="12">
                        <el-form-item label="门禁机名称" prop="key">
                          <el-input v-model="searchForm.key" clearable placeholder="请输入" :maxlength="12"/>
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
              prop="communityName"
              min-width="200"
              label="小区名称">
            </el-table-column>
            <el-table-column
              prop="alarmTime"
              min-width="180"
              label="告警时间">
              <template slot-scope="scope">
                {{ scope.row.alarmTime | formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              prop="doorName"
              min-width="180"
              label="门禁机名称">
            </el-table-column>
            <el-table-column
              prop="alarmType"
              min-width="180"
              label="告警类型">
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
  import {fetchAlarm} from "@/api/message";
  import {formatDateTime} from "@/filters/index";
  import mixin from "@/utils/mixin";
  import { mapGetters } from 'vuex';

  export default {
    mixins: [mixin],
    computed:{
      ...mapGetters([
        'communityList'
      ])
    },
    filters: {
      formatDateTime: formatDateTime
    },

    methods: {
      handleReset: function(formName) {
        this.$refs.searchForm.resetFields();
        this.loadData()
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let listObj = {
          offset: offset,
          limit: limit,
        };
        fetchAlarm({...self.searchForm, ...listObj}).then(function (response) {
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
          key: '',
          communityId:''
        },
      }
    }
  }
</script>

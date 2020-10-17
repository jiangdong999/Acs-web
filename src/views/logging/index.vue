<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">操作记录列表</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-left">
              <el-button @click="handleExport" type="primary" :loading="loadingExport">导出Excel</el-button>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="form" :model="form" :inline="true">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="所属小区" class="room-place" prop="communityId">
                          <el-select
                            v-model="form.communityId"
                            placeholder="选择所属小区"
                            clearable
                            :filterable="true"
                          >
                            <el-option
                              v-for="item in communityList"
                              :key="item.communityId"
                              :label="item.communityName"
                              :value="item.communityId"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="操作人帐号" prop="actionAccount">
                          <el-input v-model="form.actionAccount" clearable placeholder="请输入" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="业务名称" prop="modeType">
                          <el-select v-model="form.modeType" filterable clearable placeholder="请选择">
                            <el-option
                              v-for="item in typeList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
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
                            :default-time="['00:00:00:000', '23:59:59:999']"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="操作类型" prop="action">
                          <el-select v-model="form.action" filterable clearable placeholder="请选择">
                            <el-option
                              v-for="item in actionList"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="关键参数" prop="context">
                          <el-input v-model="form.context" clearable placeholder="请输入" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <span class="jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button @click="loadData()" type="primary">搜索</el-button>
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
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="recordingTime" min-width="100" label="时间">
              <template slot-scope="scope">{{ scope.row.recordingTime | formatDateTime}}</template>
            </el-table-column>
            <el-table-column prop="ip" min-width="80" label="操作人IP"></el-table-column>
            <el-table-column prop="account" min-width="100" label="操作人帐号"></el-table-column>
            <el-table-column prop="modeType" min-width="100" label="业务名称"></el-table-column>
            <el-table-column prop="action" min-width="80" label="操作类型"></el-table-column>
            <el-table-column prop="context" min-width="300" label="关键参数"></el-table-column>
          </el-table>
        </el-row>
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
    </div>
  </div>
</template>

<script>
import { listLog, exportLog } from "@/api/logging";
import { formatDateTime } from "@/filters/index";
import dateUtil from "@/utils/times";
import moment from "moment";
import { mapGetters } from "vuex";
import { beforePickerOptions, afterPickerOptions } from "@/utils/validate";
import mixin from "@/utils/mixin";

export default {
  mixins: [mixin],
  computed: {
    ...mapGetters(["communityList"]),
    timeRange: {
      set(newValue) {
        this.form.startTime = newValue ? newValue[0] : "";
        this.form.endTime = newValue ? newValue[1] : "";
      },
      get() {
        return this.form.startTime
          ? [this.form.startTime, this.form.endTime]
          : [];
      }
    }
  },
  methods: {
    beforePickerOptions,
    afterPickerOptions,
    handleReset: function() {
      this.timeRange = "";
      this.$refs["form"].resetFields();
      this.loadData();
    },
    handleExport: function() {
      let self = this;
      self.loadingExport = true;
      let startTime = moment(self.form.startTime, "YYYYMMDDHHmmssSSS").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      let endTime = self.form.endTime;
      if (!startTime || !endTime) {
        self.$alert("请选择时间段", "提示", {
          confirmButtonText: "确定"
        });
        self.loadingExport = !self.loadingExport;
        return;
      }
      endTime = moment(endTime, "YYYYMMDDHHmmssSSS").valueOf(); //将YYYYMMDDHHmmssSSS格式转为事件戳
      let limitTime = moment(startTime)
        .add(1, "months")
        .valueOf();
      //endTime 和 limitTime都转为时间戳进行比较 用add()必须先转化为YYYY-MM-DD格式
      if (endTime > limitTime) {
        self.$alert("请选择正确时间段，只允许导出一个月记录", "提示", {
          confirmButtonText: "确定"
        });
        self.loadingExport = !self.loadingExport;
        return;
      }

      let exportData = { ...self.form };
      exportData.offset = 0;
      exportData.limit = self.totalRecord;
      exportLog(exportData)
        .then(function(response) {
          window.open(response.data.data.downloadUrl);
          self.loadingExport = false;
        })
        .catch(function(a) {
          console.error(a);
          self.loadingExport = false;
        });
    },
    loadData: function(offset, limit) {
      let self = this;
      self.loading = true;
      offset = offset || 0;
      limit = limit || 10;

      let searchData = { ...self.form };
      searchData.offset = offset;
      searchData.limit = limit;
      listLog(searchData)
        .then(function(response) {
          if (response.data && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset == 0 && self.pageReset();
          }
        })
        .catch(function(a) {
          console.error(a);
          self.loading = !self.loading;
        });
    }
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      loadingExport: false,
      aa: "",
      actionList: [
        { value: "登录成功", label: "登录成功" },
        { value: "登录失败", label: "登录失败" },
        { value: "新增", label: "新增" },
        { value: "修改", label: "修改" },
        { value: "删除", label: "删除" },
        { value: "导出", label: "导出" }
      ],
      typeList: [
        { value: "登录管理", label: "登录管理" },
        { value: "门禁机管理", label: "门禁机管理" },
        { value: "门禁卡管理", label: "门禁卡管理" },
        { value: "社区管理", label: "社区管理" },
        { value: "房屋管理", label: "房屋管理" },
        { value: "住户登记", label: "住户登记" },
        { value: "公告管理", label: "公告管理" },
        { value: "账号管理", label: "账号管理" },
        { value: "数据操作", label: "数据操作" },
        { value: "房屋卡管理", label: "房屋卡管理" }
      ],
      form: {
        startTime: "",
        endTime: "",
        actionAccount: "",
        action: "",
        modeType: "",
        communityId: "",
        context: ""
      }
    };
  }
};
</script>

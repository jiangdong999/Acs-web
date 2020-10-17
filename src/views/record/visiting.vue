<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">来访记录列表</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form :inline="true" ref="form" :model="form">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="所属小区" class="room-place" prop="communityId">
                          <el-select
                            v-model="form.communityId"
                            placeholder="选择所属小区"
                            clearable
                            filterable
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
                        <el-form-item label="呼叫结果" prop="handlerResult">
                          <el-select
                            v-model="form.handlerResult"
                            clearable
                            filterable
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in optionTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="被访者" prop="userTo">
                          <el-input
                            v-model="form.userTo"
                            clearable
                            placeholder="请输入"
                            :maxlength="20"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="门禁机名称" prop="doorName">
                          <el-input
                            v-model="form.doorName"
                            clearable
                            placeholder="请输入"
                            :maxlength="15"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place1" label="来访时间" prop="startEntryTime">
                          <el-date-picker
                            v-model="form.startEntryTime"
                            type="date"
                            style="width:160px;"
                            :picker-options="beforePickerOptions(form.endEntryTime)"
                            placeholder="选择日期"
                          ></el-date-picker><span
                            style="width:11px;height:1px;display: inline-block;background:#BEC2C7;margin:0px 5px 3px 14px"
                          ></span><el-date-picker
                            v-model="form.endEntryTime"
                            type="date"
                            :picker-options="afterPickerOptions(form.startEntryTime)"
                            style="width:160px;"
                            placeholder="选择日期"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <span class="jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary" @click="loadData()">搜索</el-button>
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
            <el-table-column prop="communityName" min-width="200" label="小区名称"></el-table-column>
            <el-table-column prop="visitTime" min-width="160" label="来访时间">
              <template slot-scope="scope">{{ scope.row.visitTime | formatDateTime}}</template>
            </el-table-column>
            <el-table-column prop="fullNodeName" min-width="200" label="门禁机名称"></el-table-column>
            <el-table-column prop="responder" min-width="200" label="被访者"></el-table-column>
            <el-table-column prop="handlerResult" min-width="140" label="呼叫结果"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="80">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.imageUrl"
                  fit="scale-down"
                  class="pic-col"
                  :preview-src-list="[scope.row.imageUrl]"
                  :z-index="2001"
                  v-if="scope.row.imageUrl !=''"
                >
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
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
            @prev-click="turnPage(--page)"
            @next-click="turnPage(++page)"
            :current-page.sync="page"
            prev-text="上页"
            next-text="下页"
            layout="prev, pager, next, slot"
          >
            <span>
              <span class="el-pagination__jump">
                前往
                <div class="el-input el-input--medium el-pagination__editor is-in-pagination">
                  <input
                    type="number"
                    v-model.number="pageInput"
                    autocomplete="off"
                    min="1"
                    class="el-input__inner"
                  />
                </div>页
              </span>
              <button class="btn-next" @click="turnPage(pageInput)">
                <span>确定</span>
              </button>
            </span>
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/utils/times";
import { formatDateTime } from "@/filters/index";
import { fetchVisiting, visitExport } from "@/api/record";
import moment from "moment";
import { beforePickerOptions, afterPickerOptions } from "@/utils/validate";
import { mapGetters } from "vuex";
import mixin from "@/utils/mixin";

export default {
  mixins: [mixin],
  computed: {
    dateFormat: function() {
      return util.dateFormat();
    },
    ...mapGetters(["communityList"])
  },

  filters: {
    formatDateTime: formatDateTime
  },

  methods: {
    beforePickerOptions,
    afterPickerOptions,
    handleReset: function() {
      this.$refs.form.resetFields();
      this.form.endEntryTime = "";
      this.loadData();
    },
    handExport: function() {
      let self = this;
      self.loadingExport = true;
      let startTime = self.form.startEntryTime;
      let endTime = self.form.endEntryTime;
      if (!startTime || !endTime) {
        self.$alert("请选择开门时间段", "提示", {
          confirmButtonText: "确定"
        });
        self.loadingExport = false;
        return;
      }
      let limitTime = moment(startTime)
        .add(1, "M")
        .valueOf();
      if (endTime.getTime() > limitTime) {
        self.$alert("请选择正确开门时间段，只允许导出一个月记录", "提示", {
          confirmButtonText: "确定"
        });
        self.loadingExport = false;
        return;
      }
      let exportData = {};
      exportData.startEntryTime =
        util.toServerDateString(self.form.startEntryTime) || "";
      exportData.endEntryTime =
        util.toServerDateString(self.form.endEntryTime) || "";
      exportData.operatorName = self.form.operatorName || "";
      exportData.doorName = self.form.doorName || "";
      exportData.openType = self.form.openType || "";
      exportData.communityId = self.form.communityId || "-1";
      exportData.offset = 0;
      exportData.limit = self.totalRecord;
      visitExport(exportData)
        .then(function(response) {
          if (response.data && response.data.code == 1) {
            window.open(response.data.data.downloadUrl);
          }
        })
        .catch(function(a) {
          console.error(a);
        })
        .finally(_ => {
          self.loadingExport = false;
        });
    },
    loadData: function(offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let listObj = {
        offset: offset,
        limit: limit
      };
      let searchData = { ...self.form };
      searchData.communityId = self.form.communityId || "-1";
      searchData.startEntryTime =
        util.toServerDateString(self.form.startEntryTime) || "";
      searchData.endEntryTime =
        util.byPattern(self.form.endEntryTime, "YYYYMMDD235959999") || "";

      let keyObject = Object.assign(searchData, listObj);
      fetchVisiting(keyObject)
        .then(function(response) {
          if (response.data && response.data.code == 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset == 0 && self.pageReset();
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    }
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      loadingExport: false,
      showModal: false,
      form: {
        userTo: "",
        doorName: "",
        handlerResult: "",
        startEntryTime: "",
        endEntryTime: "",
        communityId: ""
      },
      optionTypeOptions: [
        //处理结果,0呼叫超时;1允许开门;2拒绝开门;3忽略开门;
        { value: "0", label: "呼叫超时" },
        { value: "1", label: "允许开门" },
        { value: "2", label: "拒绝开门" },
        { value: "3", label: "忽略开门" }
      ],
      itemData: {}
    };
  }
};
</script>

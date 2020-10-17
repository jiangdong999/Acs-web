<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">开门记录列表</span>
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
                        <el-form-item label="开门类型" prop="openType">
                          <el-select v-model="form.openType" clearable filterable placeholder="请选择">
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
                        <el-form-item label="开门者" prop="operatorName">
                          <el-input
                            v-model="form.operatorName"
                            clearable
                            placeholder="开门者"
                            :maxlength="20"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="门禁机名称" prop="doorName">
                          <el-input
                            v-model="form.doorName"
                            clearable
                            placeholder="请输入门禁机名称"
                            :maxlength="15"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="门禁机ID" prop="doorDeviceId">
                          <el-input v-model="form.doorDeviceId" clearable placeholder="请输入门禁机ID" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place1" label="开门时间" prop="startEntryTime">
                          <el-date-picker
                            v-model="form.startEntryTime"
                            type="date"
                            class="jdinput-date"
                            :picker-options="beforePickerOptions(form.endEntryTime)"
                            placeholder="选择日期"
                            style="width:160px"
                          ></el-date-picker><span
                            style="width:11px;height:1px;display: inline-block;background:#BEC2C7;margin:0px 5px 3px 14px"
                          ></span><el-date-picker
                            v-model="form.endEntryTime"
                            type="date"
                            class="jdinput-date"
                            :picker-options="afterPickerOptions(form.startEntryTime)"
                            placeholder="选择日期"
                            style="width:160px"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <span class="jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary" @click="handleSearch">搜索</el-button>
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
            <el-table-column prop="communityName" min-width="100" label="小区名称"></el-table-column>
            <el-table-column prop="openDoorTime" min-width="120" label="开门时间">
              <template slot-scope="scope">{{ scope.row.openDoorTime | formatDateTime}}</template>
            </el-table-column>
            <el-table-column prop="fullNodeName" min-width="80" label="门禁机名称"></el-table-column>
            <el-table-column prop="doorDeviceId" min-width="80" label="门禁机ID"></el-table-column>
            <el-table-column prop="doorOpener" min-width="100" label="开门者"></el-table-column>
            <el-table-column prop="temperature" min-width="80" label="体温（℃）"></el-table-column>
            <el-table-column prop="jkbStatus" min-width="80" label="健康宝状态">
              <template slot-scope="scope">
                {{scope.row.jkbStatus | jkbStatus}}
              </template>
            </el-table-column>
            <el-table-column prop="openType" min-width="80" label="开门类型"></el-table-column>
            <el-table-column label="抓拍图片" fixed="right" min-width="80">
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
                <el-image
                  :src="scope.row.imageUrl2"
                  fit="scale-down"
                  class="pic-col"
                  :preview-src-list="[scope.row.imageUrl2]"
                  :z-index="2001"
                  v-if="scope.row.imageUrl2 !=''"
                >
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
                  </div>
                </el-image>
                <el-image
                  :src="scope.row.imageUrl3"
                  fit="scale-down"
                  class="pic-col"
                  :preview-src-list="[scope.row.imageUrl3]"
                  :z-index="2001"
                  v-if="scope.row.imageUrl3 !=''"
                >
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column v-if="isSensitive==0" label="开门视频" fixed="right" min-width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.videoUrl !=''"
                  @click="openVideo(scope.row.videoUrl)"
                >查看视频</el-button>
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
import dateUtil from "@/utils/times";
import { fetchOpening, openExport, openingCount } from "@/api/record";
import { formatDateTime } from "@/filters/index";
import moment from "moment";
import { beforePickerOptions, afterPickerOptions } from "@/utils/validate";
import { mapGetters } from "vuex";
import mixin from "@/utils/mixin";
import { getSensitive } from "@/utils/auth";
import {jkbStatus} from "@/filters/visitor"
export default {
  mixins: [mixin],
  filters: {
    formatDateTime: formatDateTime,
    jkbStatus
  },
  computed: {
    ...mapGetters(["communityList"]),
    isSensitive: function() {
      return getSensitive();
    }
  },

  methods: {
    beforePickerOptions,
    afterPickerOptions,
    handleReset: function() {
      this.$refs.form.resetFields();
      this.form.endEntryTime = "";
      this.loadData(0, 10, true);
    },
    handleExport: function() {
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
        dateUtil.toServerDateString(self.form.startEntryTime) || "";
      exportData.endEntryTime =
        dateUtil.toServerDateString(self.form.endEntryTime) || "";
      exportData.operatorName = self.form.operatorName || "";
      exportData.doorName = self.form.doorName || "";
      exportData.openType = self.form.openType || "";
      exportData.communityId = self.form.communityId || "";
      exportData.offset = 0;
      exportData.limit = self.totalRecord;
      openExport(exportData)
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
    handleSearch: function(data) {
      this.loadData(0, 10, true);
    },
    loadData: function(offset = 0, limit = 10, needCount) {
      let self = this;
      self.loading = true;
      let listObj = {
        offset: offset,
        limit: limit
      };
      let searchData = { ...self.form };
      searchData.communityId = searchData.communityId || "-1";
      searchData.startEntryTime =
        dateUtil.toServerDateString(self.form.startEntryTime) || "";
      searchData.endEntryTime =
        dateUtil.byPattern(self.form.endEntryTime, "YYYYMMDD235959999") || "";

      let keyObject = Object.assign(searchData, listObj);
      fetchOpening(keyObject)
        .then(function(response) {
          if (response.data && response.data.code == 1) {
            self.tableData = response.data.dataList || [];
            self.loading = false;

            offset == 0 && self.pageReset();
            // needCount && self.getCount(keyObject)
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    getCount: function(keyObject) {
      let self = this;
      self.pageloading = true;

      openingCount(keyObject)
        .then(function(response) {
          if (response.data && response.data.code == 1) {
            self.totalRecord = response.data.data.totalCount;
            self.pageloading = false;
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    openVideo(url) {
      window.open(url);
      // window.open('https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo-transcode/24082814_4e075f678b8271fb2ad5e46f4a11f1aa_0.mp4')
    }
  },
  mounted() {
    this.loadData(0, 10, true);
  },
  data() {
    return {
      showVideo: false,
      pageloading: false,
      loadingExport: false,
      form: {
        operatorName: "",
        doorName: "",
        openType: "",
        startEntryTime: "",
        endEntryTime: "",
        doorDeviceId: "",
        communityId: ""
      },
      optionTypeOptions: [
        //1 刷卡,2 手机客户端,3 访客密码,4 非法,5 PSTN电话,6 刷脸,7 暴力开门,8 开关开门,9 访客呼叫,10 密码
        { value: "1", label: "刷卡" },
        { value: "2", label: "手机客户端" },
        { value: "3", label: "访客密码" },
        // {value: '4', label: '非法'},
        { value: "5", label: "电话开门" },
        { value: "6", label: "刷脸" },
        // {value: '7', label: '暴力开门'},
        { value: "8", label: "开关开门" },
        { value: "9", label: "访客呼叫" },
        { value: "10", label: "密码" },
        { value: "13", label: "蓝牙开门" },
        { value: "14", label: "手机二维码" },
        { value: "15", label: "门禁二维码" },
        { value: "16", label: "随机密码" },
        { value: "17", label: "声波开门" },
        { value: "18", label: "身份证开门" },
        { value: "20", label: "拍照" }
      ],
      itemData: {}
    };
  }
};
</script>
<style scoped>
.mini-pic {
  width: 60px;
  height: 60px;
  cursor: pointer;
  margin-right: 10px;
  object-position: 50% 50%;
  object-fit: scale-down;
}
.video-fixed {
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  text-align: center;
}
.close {
  position: absolute;
  right: 0;
  top: 0;
  width: 70px;
  height: 70px;
  line-height: 70px;
  color: #fff;
  cursor: pointer;
}
.video-fixed > video {
  margin-top: 10%;
}
</style>
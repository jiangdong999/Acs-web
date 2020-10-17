<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">核查记录</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form
                    :inline="true"
                    :model="searchForm"
                    label-position="right"
                    ref="searchForm"
                  >
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="核查结果" prop="checkStatus">
                          <el-select
                            v-model="searchForm.checkStatus"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option value="1" label="成功" />
                            <el-option value="0" label="失败" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="核查方式" prop="checkType">
                          <el-select
                            v-model="searchForm.checkType"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option value="1" label="身份证核查" />
                            <el-option value="2" label="门禁卡号核查" />
                            <el-option value="3" label="人脸识别核查" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item
                          label="身份证号码"
                          prop="operator"
                          v-if="searchForm.checkType == 1"
                        >
                          <el-input
                            placeholder="请输入"
                            :maxlegth="18"
                            clearable
                            v-model="searchForm.operator"
                          />
                        </el-form-item>
                        <el-form-item label="门禁卡号" prop="operator" v-if="searchForm.checkType == 2">
                          <el-input placeholder="请输入" clearable v-model="searchForm.operator" />
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
          <div class="num-box blue" @click="totalCount()">
            <span>核查总数</span>
            <span>{{statistics.totalCount}}</span>
            <i
              v-if="!searchForm.openTimeStart && !searchForm.checkStatus"
              class="iconfont icon-icon_select"
            ></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="num-box orange" @click="todayCount()">
            <span>今日核查数</span>
            <span>{{statistics.todayCount}}</span>
            <i v-if="searchForm.openTimeStart" class="iconfont icon-icon_select"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="num-box green" @click="isSuccessCount('1')">
            <span>核查成功</span>
            <span>{{statistics.successCount}}</span>
            <i v-if="searchForm.checkStatus=='1'" class="iconfont icon-icon_select"></i>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="num-box red" @click="isSuccessCount('0')">
            <span>核查失败</span>
            <span>{{statistics.failCount}}</span>
            <i v-if="searchForm.checkStatus=='0'" class="iconfont icon-icon_select"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-container" v-loading="loading">
      <el-row>
        <el-table
          :data="tableData"
          stripe
          @row-click="tableRowClick"
          ref="table"
          :highlight-current-row="true"
        >
          <div slot="empty" class="empty-table"></div>
          <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
          <el-table-column prop="householdName" min-width="200" label="住户姓名"></el-table-column>
          <el-table-column prop="openTime" min-width="120" label="核查时间">
            <template slot-scope="scope">{{scope.row.openTime | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="status" min-width="100" label="核查结果">
            <template slot-scope="scope">{{scope.row.status | transCheckResult}}</template>
          </el-table-column>
          <el-table-column prop="dataType" min-width="90" label="核查方式">
            <template slot-scope="scope">{{scope.row.dataType | transCheckType}}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <el-button
                :disabled="!(scope.row.dataType==3 && scope.row.status == '1')"
                type="text"
                @click="handleSearch(scope.row)"
                size="small"
              >查看</el-button>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="50" fixed="right">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="table-expand">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="手机号码">
                      <span>{{ scope.row.phone }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="身份证号码">
                      <span>{{ scope.row.citizenId }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="门禁卡号">
                      <span>{{ scope.row.cardList.cardNo }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
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
    <div v-if="showResult">
      <el-dialog
        title="人脸核查结果"
        :visible.sync="showResult"
        top="5vh"
        width="402px"
        :close-on-click-modal="false"
      >
        <result :rowData="rowData" @submitSuccess="handleClose()" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import mixin from "@/utils/mixin";
import result from "./components/result.vue";
import { checkList, checkStatistic } from "@/api/epidemic";
import { mapGetters } from "vuex";
import { formatDate } from "@/filters/index";
import { transCheckResult, transCheckType } from "@/filters/epidemic";
import dateUtil from "@/utils/times";

export default {
  mixins: [mixin],
  components: {
    result,
  },
  computed: {
    timeRange: {
      get() {
        return this.searchForm.openTimeStart
          ? [this.searchForm.openTimeStart, this.searchForm.openTimeEnd]
          : [];
      },
      set(newValue) {
        // console.log(newValue)
        this.searchForm.openTimeStart = newValue ? newValue[0] : "";
        this.searchForm.openTimeEnd = newValue ? newValue[1] : "";
      },
    },
  },
  filters: {
    formatDate,
    transCheckResult,
    transCheckType,
  },
  data() {
    return {
      rowData: {},
      showResult: false,
      searchForm: {
        communityId: null,
        checkStatus: "",
        checkType: "",
        operator: "",
        openTimeStart: "",
        openTimeEnd: "",
      },
      tableData: [],
      statistics: {
        failCount: null,
        successCount: null,
        todayCount: null,
        totalCount: null,
      },
    };
  },
  computed: {
    ...mapGetters(["communityId"]),
  },
  created() {
    this.loadData();
    this.checkStatistic();
  },
  methods: {
    search() {
      this.loadData();
      this.checkStatistic();
    },
    totalCount() {
      this.searchForm.openTimeStart = "";
      this.searchForm.openTimeEnd = "";
      this.searchForm.checkStatus = "";
      this.loadData();
    },
    todayCount() {
      this.searchForm.openTimeStart = this.searchForm.openTimeStart
        ? ""
        : `${dateUtil.toServerDateString(new Date()).slice(0, 8)}000000000`;
      this.searchForm.openTimeEnd = this.searchForm.openTimeEnd
        ? ""
        : `${dateUtil.toServerDateString(new Date()).slice(0, 8)}235959000`;
      this.loadData();
    },
    getTodayTime() {
      this.searchForm.openTimeStart = `${dateUtil
        .toServerDateString(new Date())
        .slice(0, 8)}000000000`;
      this.searchForm.openTimeEnd = `${dateUtil
        .toServerDateString(new Date())
        .slice(0, 8)}235959000`;
    },
    isSuccessCount(status) {
      this.searchForm.checkStatus =
        this.searchForm.checkStatus == status ? "" : status;
      this.loadData();
    },
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    handleClose() {
      this.showResult = false;
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.loadData();
    },
    //搜索
    loadData: function (offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };
      searchParams.communityId = self.communityId || -1;
      searchParams.offset = offset;
      searchParams.limit = limit;
      checkList(searchParams)
        .then(function (response) {
          self.loading = false;
          if (response && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;

            offset == 0 && self.pageReset();
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    //统计项
    checkStatistic: function () {
      let self = this;
      let searchParams = { ...this.searchForm };
      searchParams.communityId = self.communityId || -1;
      checkStatistic(searchParams)
        .then(function (response) {
          if (response && response.data.code === 1) {
            self.statistics = response.data.data;
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    handleSearch(data) {
      this.showResult = true;
      this.rowData = data;
    },
  },
};
</script>
<style lang="scss" scoped>
.calculate {
  padding: 19px 20px 20px;
  .num-box {
    position: relative;
    width: 100%;
    height: 56px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    padding-left: 20px;
    span {
      height: 56px;
      color: #fff;
      line-height: 56px;
      vertical-align: top;
    }
    span:nth-of-type(1) {
      font-size: 14px;
      font-weight: 500;
      margin-right: 20px;
      vertical-align: middle;
    }
    span:nth-of-type(2) {
      font-size: 22px;
      font-weight: 600;
      vertical-align: middle;
    }
    .iconfont {
      color: #fff;
      font-size: 18px;
      position: absolute;
      top: 18px;
      right: 20px;
    }
  }

  // .checked:before{
  //   content:'';
  //   display: inline-block;
  //   width: 20px;
  //   height: 20px;
  //   background-image: url(../../../assets/icon/icon_select.png);
  //   background-size: contain;
  //   position: absolute;
  //   right: 20px;
  //   top: 18px;
  // }
  .blue {
    background: #007ee4;
  }
  .green {
    background: #24b994;
  }
  .red {
    background: #ff534e;
  }
  .orange {
    background-color: #ff833b;
  }
}
</style>
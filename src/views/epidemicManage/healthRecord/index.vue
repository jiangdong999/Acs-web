<template>
  <div class="healthRecord">
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">健康宝记录</span>
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
                        <el-form-item label="姓名" prop="household_name">
                          <el-input
                            placeholder="请输入"
                            :maxlegth="18"
                            clearable
                            v-model="searchForm.household_name"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                          <el-input
                            placeholder="请输入"
                            :maxlegth="18"
                            clearable
                            v-model="searchForm.phone"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="身份证号" prop="id_code">
                          <el-input
                            placeholder="请输入"
                            :maxlegth="18"
                            clearable
                            v-model="searchForm.id_code"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <span class="jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary" @click="load()">搜索</el-button>
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
    <div class="statistics-box">
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="data-box">
            <div
              class="cal-num green"
              @click="selectColor('0','1')"
              :class="{'checked': searchForm.color=='0'}"
            >
              <span>未见异常</span>
              <span>
                <count-to :startVal="0" :endVal="parseInt(colorData.green) || 0" :duration="2500"></count-to>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="data-box">
            <div
              class="cal-num yellow"
              @click="selectColor('1','1')"
              :class="{'checked': searchForm.color=='1'}"
            >
              <span>居家观察</span>
              <span>
                <count-to :startVal="0" :endVal="parseInt(colorData.yellow) || 0" :duration="2500"></count-to>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="data-box">
            <div
              class="cal-num blue"
              @click="selectColor('2','1')"
              :class="{'checked': searchForm.color=='2'}"
            >
              <span>
                无法确认
                <i @click="searchDeclare" class="iconfont icon-wenhao"></i>
              </span>
              <span>
                <count-to :startVal="0" :endVal="parseInt(colorData.blue) || 0" :duration="2500"></count-to>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="data-box">
            <div
              class="cal-num red"
              @click="selectColor('3','1')"
              :class="{'checked': searchForm.color=='3'}"
            >
              <span>集中观察</span>
              <span>
                <count-to :startVal="0" :endVal="parseInt(colorData.red) || 0" :duration="2500"></count-to>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="data-box">
            <div
              class="cal-num grey"
              @click="selectColor('','0')"
              :class="{'checked': searchForm.color=='' && searchForm.msg=='0'}"
            >
              <span>尚未掌握</span>
              <span>
                <count-to :startVal="0" :endVal="parseInt(colorData.grey) || 0" :duration="2500"></count-to>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-container" v-loading="loading">
      <el-row>
        <el-table :data="tableData" stripe :highlight-current-row="true">
          <div slot="empty" class="empty-table"></div>
          <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
          <el-table-column prop="household_name" min-width="120" label="住户姓名"></el-table-column>
          <el-table-column prop="phone" min-width="120" label="手机号码"></el-table-column>
          <el-table-column prop="id_code" min-width="120" label="身份证号"></el-table-column>
          <el-table-column prop="modify_time" min-width="120" label="更新时间">
            <template slot-scope="scope">{{scope.row.modify_time}}</template>
          </el-table-column>
          <el-table-column prop="type" min-width="120" label="健康宝状态">
            <template slot-scope="scope">
              <span v-if="scope.row.msg=='1'">{{scope.row.type | transHealthColor}}</span>
              <span v-else-if="scope.row.msg=='0'">尚未掌握</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" min-width="120" label="备注"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSearch(scope.row)" size="small">查看</el-button>
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
          :total="totalRecord"
        ></el-pagination>
      </div>
    </div>
    <div v-if="showDeclare">
      <el-dialog
        title="操作说明"
        width="550px"
        :visible.sync="showDeclare"
        :close-on-click-modal="true"
      >
        <div class="dia-title">包括以下几种情况</div>
        <div class="declare-details">
          <p>1.经过健康宝行程轨迹申报后既包含京津冀之外的轨迹又不在当前入住酒店人员名单中。</p>
          <p>2.经过健康宝行程轨迹申报时输入“国家平台防疫健康信息码”状态不是未见异常导致。</p>
          <p>3.经过健康宝行程轨迹申报后均为京津冀内行程轨迹，且对应的风险等级存在中高风险。</p>
          <p>4.入境人员非窗口期进京导致。</p>
          <p>5.暂不掌握，由于经过健康宝行程轨迹申报后存在对应风险等级为空的地区导致。</p>
        </div>
        <div class="form-dialog-control-area">
          <el-button type="" @click="closeDeclare()">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import mixin from "@/utils/mixin";
import { healthList, healthStatusData } from "@/api/epidemic";
import { mapGetters } from "vuex";
import { formatDate } from "@/filters/index";
import { transHealthColor } from "@/filters/epidemic";
import countTo from "vue-count-to";

export default {
  mixins: [mixin],
  components: {
    countTo,
  },
  filters: {
    formatDate,
    transHealthColor,
  },
  data() {
    return {
      showDeclare: false,
      searchForm: {
        phone: "",
        household_name: "",
        id_code: "",
        color: "",
        msg: "",
      },
      tableData: [],
      colorData: {},
    };
  },
  computed: {
    ...mapGetters(["communityId"]),
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loadData();
      this.loadStatusData();
    },
    selectColor(color, msg) {
      this.searchForm.color = this.searchForm.color == color ? "" : color;
      this.searchForm.msg = this.searchForm.msg == msg ? "" : msg;
      // let code = ''
      // code = code == msg?'':msg
      // this.searchForm.msg = code>0?'1':''
      this.loadData();
    },
    //打开弹窗
    searchDeclare() {
      this.showDeclare = true;
    },
    //关闭弹窗
    closeDeclare() {
      this.showDeclare = false;
    },
    //重置
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.loadData();
    },
    //获取颜色数据
    loadStatusData() {
      let params = { ...this.searchForm };
      let self = this;
      params.community_id = self.communityId || -1;
      healthStatusData(params)
        .then(function (response) {
          if (response && response.data.code === 1) {
            let list = response.data.dataList;
            list.forEach((item, index) => {
              if (item.msg == "1") {
                if (item.color == "0") {
                  self.colorData.green = item.count;
                } else if (item.color == "1") {
                  self.colorData.yellow = item.count;
                } else if (item.color == "2") {
                  self.colorData.blue = item.count;
                } else if (item.color == "3") {
                  self.colorData.red = item.count;
                }
              } else if (item.msg == "0") {
                self.colorData.grey = item.count;
              }
            });
            self.$forceUpdate();
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    //搜索表格数据
    loadData: function (offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };
      searchParams.community_id = self.communityId || -1;
      searchParams.offset = offset;
      searchParams.limit = limit;
      healthList(searchParams)
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
    //
    handleSearch(data) {
      localStorage.setItem('query',JSON.stringify({
        communityId: data.community_id,
          householdId: data.household_id,
          roomNodeId: data.room_node_id,
      }))
      this.$router.push({
        path: "/business/householdDetails/"
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.statistics-box {
  padding: 10px 20px 20px;
}
.cal-num {
  width: 100%;
  height: 96px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  padding: 20px;
  span {
    display: inline-block;
    width: 100%;
    color: #fff;
    text-align: left;
    line-height: 20px;
  }
  span:nth-of-type(1) {
    opacity: 0.8;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 13px;
  }
  span:nth-of-type(2) span {
    opacity: 1;
    font-size: 30px;
    font-weight: 600;
  }
}
.green {
  background: #25c085;
}
.yellow {
  background: #fca91b;
}
.red {
  background: #ff6565;
}
.blue {
  background: #007ee4;
}
.grey {
  background: #949494;
}
.data-box {
  position: relative;
}
.checked:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(../../../assets/icon/checked.png);
  background-size: contain;
  position: absolute;
  right: 9px;
  top: 9px;
}
.dia-title {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 20px;
  margin-bottom: 18px;
}
.declare-details {
  margin-bottom: 40px;
  p {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #666666;
    line-height: 24px;
    margin: 0;
  }
}
.form-dialog-control-area {
  text-align: center;
}
.icon-wenhao {
  cursor: pointer;
}
</style>
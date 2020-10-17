<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">报修列表</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="所在小区" prop="communityId">
                          <el-select
                            v-model="searchForm.communityId"
                            @change="initNode"
                            @clear="clearCommunity"
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
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="详细地址" prop="room">
                          <div>
                            <el-popover
                              placement="bottom"
                              width="300"
                              ref="popover"
                              popper-class="popper-shadow"
                              v-model="popoverShow"
                              trigger="click"
                              clearable
                            >
                              <el-input
                                placeholder="输入关键字进行过滤"
                                class="mb-5"
                                v-model="filterText"
                                clearable
                              ></el-input>
                              <el-tree
                                class="tree-node"
                                ref="tree"
                                :data="roomOptions"
                                accordion
                                :props="defaultProps"
                                :load="loadNode"
                                empty-text="无此节点"
                                @node-click="handleNodeClick"
                                :filter-node-method="filterNode"
                              ></el-tree>
                            </el-popover>
                          </div>
                          <el-input
                            clearable
                             style="width:360px"
                            class="widen-input"
                            placeholder="关联房间"
                            v-model="searchForm.room"
                            v-popover:popover
                            @clear="clearRoom"
                            suffix-icon="el-icon-arrow-down"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="处理人员" prop="householdName">
                          <el-input v-model="searchForm.householdName" clearable placeholder="请输入" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="报修日期" class="repairDate" prop="repairTime">
                          <el-date-picker
                          clearable
                            v-model="searchForm.repairTime"
                            type="date"
                            placeholder="选择日期"
                            value-format="yyyyMMddHHmmssSSS"
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

      <div class="control-panel clearfix" style="padding-top:0px;margin-top: -15px;">
        <div class="header module">
          <el-row :gutter="20">
            <!-- <el-col :span="6" class="item">
              <div class="all" :class="{'checked': searchForm.status==null}" @click="repairStatusChg(null)">
                全部
                <div>
                  <count-to :startVal="0" :endVal="parseInt(countData.totalCount) || 0" :duration="2500"></count-to>
                </div>
              </div>
            </el-col>-->
            <el-col :span="4" class="item">
              <div
                class="offline"
                :class="{'checked': searchForm.status==1}"
                @click="repairStatusChg(1)"
              >
                待处理
                <div>
                  <count-to
                    :startVal="0"
                    :endVal="parseInt(countData.pendingCount) || 0"
                    :duration="2500"
                  ></count-to>
                </div>
              </div>
            </el-col>
            <el-col :span="4" class="item">
              <div
                class="no-sync"
                :class="{'checked': searchForm.status==2}"
                @click="repairStatusChg(2)"
              >
                处理中
                <div>
                  <count-to
                    :startVal="0"
                    :endVal="parseInt(countData.processingCount) || 0"
                    :duration="2500"
                  ></count-to>
                </div>
              </div>
            </el-col>
            <el-col :span="4" class="item">
              <div
                class="open"
                :class="{'checked': searchForm.status==3}"
                @click="repairStatusChg(3)"
              >
                已完成
                <div>
                  <count-to
                    :startVal="0"
                    :endVal="parseInt(countData.finishCount) || 0"
                    :duration="2500"
                  ></count-to>
                </div>
              </div>
            </el-col>
            <el-col :span="4" class="item">
              <div
                class="invalid"
                :class="{'checked': searchForm.status==4}"
                @click="repairStatusChg(4)"
              >
                无效
                <div>
                  <count-to
                    :startVal="0"
                    :endVal="parseInt(countData.noAvailCount) || 0"
                    :duration="2500"
                  ></count-to>
                </div>
              </div>
            </el-col>
            <el-col :span="4" class="item">
              <div
                class="cancel"
                :class="{'checked': searchForm.status==0}"
                @click="repairStatusChg(0)"
              >
                已取消
                <div>
                  <count-to
                    :startVal="0"
                    :endVal="parseInt(countData.cancelCount) || 0"
                    :duration="2500"
                  ></count-to>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="table-container" v-loading="loading">
        <el-row>
          <el-table :data="tableData" stripe @row-click="tableRowClick" ref="table">
            <div slot="empty" class="empty-table"></div>
            <el-table-column prop="num" min-width="100" label="报修编号"></el-table-column>
            <el-table-column prop="applyTime" min-width="140" label="报修日期">
              <template slot-scope="scope">{{ scope.row.applyTime | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="communityName" min-width="120" label="所在小区"></el-table-column>
            <el-table-column prop="fullNodeName" min-width="240" label="详细地址"></el-table-column>
            <!-- <el-table-column
              prop="expectTime"
              min-width="140"
              label="期待上门时间">
              <template slot-scope="scope">
                {{ scope.row.expectTime | formatDateTimeHHmm}}
              </template>
            </el-table-column>-->
            <el-table-column prop="householdName" min-width="120" label="处理人员"></el-table-column>
            <el-table-column prop="statusDesc" min-width="100" label="状态"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="repairDeal(scope.row.repairId,scope.row.isRead)">查看详情</el-button>
              </template>
            </el-table-column>
            <el-table-column label="展开" fixed="left" width="60" type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="table-expand">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="投诉原因">
                        <span class="word-break">{{ scope.row.content }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="附件">
                        <span v-if="!scope.row.urls">无</span>
                        <el-image
                          class="file-style"
                          v-for="(item,index) in scope.row.urls"
                          :key="index"
                          :src="item"
                          :preview-src-list="[item]"
                        >
                          <div slot="error" class="image-slot">
                            <span class="img-err file-wid"></span>
                          </div>
                        </el-image>
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
import mixin from "@/utils/mixin";
import countTo from "vue-count-to";
import { fetchList, repairCount } from "@/api/repairManage";
import { dropdownNodeComplex } from "@/api/node";
import { mapGetters } from "vuex";
import { formatDate } from "@/filters/index";

export default {
  name: "repairRecord",
  mixins: [mixin],
  filters: {
    // formatDateTimeHHmm: formatDateTimeHHmm,
    formatDate: formatDate,
  },
  components: {
    countTo,
  },
  computed: {
    ...mapGetters(["communityList"]),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      loading: false,
      popoverShow: false,
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      roomOptions: [],
      searchForm: {
        communityId: null,
        room: "",
        nodeId: null,
        status: null,
        householdName: "",
        repairTime: "",
        // expectTime: ''
      },
      tableData: [],
      countData: {
        totalCount: null,
        pendingCount: null,
        processingCount: null,
        finishCount: null,
        cancelCount: null,
        noAvailCount: null,
      },
    };
  },
  created() {
    this.loadData();
    this.repairCountData();
  },
  methods: {
    repairStatusChg(status) {
      // this.searchForm.status = status
      this.searchForm.status = this.searchForm.status == status ? null : status;
      this.loadData();
    },
    repairCountData(offset = 0, limit = 10) {
      let _this = this;
      _this.searchForm.offset = offset;
      _this.searchForm.limit = limit;

      repairCount(_this.searchForm)
        .then((res) => {
          if (res.data && res.data.code == 1) {
            _this.countData = res.data.data;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    //重置
    handleReset() {
      let _this = this;
      _this.$nextTick(() => {
        _this.$refs.searchForm.resetFields();
        _this.searchForm.nodeId = null;
        _this.roomOptions = [];
        _this.loadData();
      });
    },
    clearRoom() {
      this.searchForm.nodeId = "";
      this.searchForm.room = "";
    },
    clearCommunity() {
      this.roomOptions = [];
      this.clearRoom();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    loadNode(node, resolve) {
      if (node.data.children && node.data.children.length > 0) {
        let data = node.data.children;

        for (let children of data) {
          children.leaf = !children.disabled;
        }
        resolve(data);
      }
    },
    initNode: function (data) {
      let self = this;
      this.clearRoom();
      if (data) {
        dropdownNodeComplex({ communityId: data })
          .then(function (response) {
            if (response && response.data) {
              self.roomOptions = response.data.dataList;
            }
          })
          .catch(function (a) {
            console.error(a);
          });
      }
    },
    handleNodeClick(data) {
      if (data.parentId != -1) {
        this.searchForm.nodeId = data.value;
        this.searchForm.room = data.nodeLabel;
        this.popoverShow = data.disabled;
      }
      if (data.parentId == -1 && !data.children) {
        this.$message({
          message: "该节点下没有数据",
          type: "error",
        });
      }
    },
    //搜索
    loadData: function (offset = 0, limit = 10) {
      let _this = this;
      _this.loading = true;
      _this.searchForm.offset = offset;
      _this.searchForm.limit = limit;
      fetchList(_this.searchForm)
        .then(function (response) {
          _this.loading = false;
          if (response.data && response.data.code == 1) {
            _this.tableData = response.data.dataList;
            _this.totalRecord = response.data.totalCount;
          }
        })
        .catch(function (a) {
          _this.loading = false;
          console.error(a);
        });
    },
    //处理
    repairDeal(repairId, isRead) {
      localStorage.setItem('query',JSON.stringify({
        id: repairId,
        isRead: isRead,
      }))
      this.$router.push({
        path: "/repairManage/details"
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.module {
  background-color: #fff;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  padding: 10px 30px;
  margin-top: 0px;
}
.header {
  text-align: center;
  line-height: 30px;
  padding: 20px;
}
.item {
  font-size: 14px;
  cursor: pointer;
  color: #fff;
  width: 20%;
}
.item > div {
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  padding: 10px 0;
  position: relative;
}
// .all{background: linear-gradient(#0090E9, #007EE4);}
.offline {
  background: linear-gradient(#ff4748, #ff8888);
}
.no-sync {
  background: linear-gradient(#ffc24c, #ffaa20);
}
.open {
  background: linear-gradient(#0090e9, #007ee4);
}
.invalid {
  background: linear-gradient(#8f679d, #98819e);
}
.cancel {
  background: linear-gradient(#555555, #999999);
}
// .all:after{
//   content:'';
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   top: 0;
//   left: 0;
//   background-repeat: no-repeat;
//   background-position: bottom right;
//   background-size: 54px 45px;
//   background-image: url('../../assets/image/all.png')
// }
// .all:after{
//     content:'';
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     top: 0;
//     left: 0;
//     background-repeat: no-repeat;
//     background-position: bottom right;
//     background-size: 54px 45px;
//     background-image: url('../../assets/image/all-Data.png')
//   }
.offline:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: bottom right;
  background-image: url("../../assets/image/wait-deal.png");
}
.no-sync:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: bottom right;
  background-image: url("../../assets/image/has-deal.png");
}
.open:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: bottom right;
  background-image: url("../../assets/image/finish.png");
}
.invalid:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: bottom right;
  background-image: url("../../assets/image/invalid.png");
}
.cancel:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: bottom right;
  background-image: url("../../assets/image/cancel.png");
}
.item > div > div {
  font-size: 30px;
}
.checked:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(../../assets/icon/checked.png);
  background-size: contain;
  position: absolute;
  left: 9px;
  top: 9px;
}
.file-style {
  margin-right: 6px;
  float: left;
  width: 36px;
  height: 36px;
}
.file-wid {
  display: inline-block;
  width: 36px;
  height: 36px;
}
.word-break {
  word-break: break-all;
}
</style>
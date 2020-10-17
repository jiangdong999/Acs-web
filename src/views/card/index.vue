<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">门禁卡列表</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form :inline="true" :model="searchForm" ref="searchForm">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" prop="room" label="房屋位置">
                          <div>
                            <el-popover
                              placement="bottom"
                              width="300"
                              ref="popover"
                              popper-class="popper-shadow"
                              v-model="popoverShow"
                              trigger="click"
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
                            style="width:360px"
                            class="widen-input"
                            placeholder="关联房间"
                            v-model="searchForm.room"
                            v-popover:popover
                            @clear="clearRoom"
                            clearable 
                            suffix-icon="el-icon-arrow-down"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="门禁卡号" prop="cardNo">
                          <el-input
                            placeholder="请输入"
                            clearable
                            :maxlength="16"
                            v-model="searchForm.cardNo"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="是否复制卡" prop="isCopy">
                          <el-select
                            v-model="searchForm.isCopy"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option value="0" label="否" />
                            <el-option value="1" label="是" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="持卡人" prop="cardholder">
                          <el-input
                            placeholder="请输入"
                            clearable
                            :maxlength="20"
                            v-model="searchForm.cardholder"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="办理时间" class="repairDate" prop="applyTime">
                          <el-date-picker
                            v-model="searchForm.applyTime"
                            type="date"
                            class="sSize-input-date"
                            value-format="yyyyMMdd000000000"
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
            <el-table-column prop="communityName" min-width="140" label="小区名称"></el-table-column>
            <el-table-column prop="buildingName" min-width="200" label="房间位置">
              <template slot-scope="scope">{{scope.row.buildingName!=null? scope.row.buildingName+scope.row.floorName+scope.row.roomName:'' }}</template>
            </el-table-column>
            <el-table-column prop="cardNo" min-width="100" label="卡号"></el-table-column>
            <el-table-column prop="cardholder" min-width="80" label="持卡人"></el-table-column>
            <el-table-column prop="cardClass" min-width="100" label="卡类型">
              <template slot-scope="scope">{{ scope.row.cardClass | cardTypeStatus }}</template>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="门卡状态">
              <template slot-scope="scope">{{ scope.row.status | transCardStatus }}</template>
            </el-table-column>
            <el-table-column prop="validTimeEnd" min-width="150" label="有效期至">
              <template slot-scope="scope">{{ scope.row.validTimeEnd | formatTimeMillisToDateTime}}</template>
            </el-table-column>
            <el-table-column prop="isCopy" min-width="100" label="是否复制卡">
              <template slot-scope="scope">{{ scope.row.status =='5'?'是':'否' }}</template>
            </el-table-column>
            <el-table-column prop="isCopy" min-width="100" label="进出方向">
              <template slot-scope="scope">{{ scope.row.inOrOut | inOrOutStatus }}</template>
            </el-table-column>
            <el-table-column prop="inOutCount" min-width="100" label="限制次数"></el-table-column>
            <!-- <el-table-column
              prop="applyTime"
              min-width="150"
              label="办理时间">
              <template slot-scope="scope">
                {{ scope.row.applyTime | formatDateTime}}
              </template>
            </el-table-column>-->
            <el-table-column label="操作" fixed="right" min-width="160">
              <template slot-scope="scope">
                <el-button type="text" @click="handleSet(scope.row)" size="small">设置</el-button>
                <el-button type="text" @click="showDelDiglog(scope.row)" size="small">删除</el-button>
                <el-button
                  type="text"
                  @click="handleEnable(scope.row)"
                  v-if="scope.row.status=='6'"
                  size="small"
                >启用</el-button>
                <el-button
                  type="text"
                  @click="handleFreeze(scope.row)"
                  v-if="(scope.row.status=='1' ||
                              scope.row.status=='5')"
                  size="small"
                >禁用</el-button>
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

    <div v-if="Visible">
      <el-dialog title="门卡设置" :visible.sync="Visible" width="550px" class="jdClassCard">
        <el-form :model="setFrom" ref="setFrom" class="demo-ruleForm" label-width="48px">
          <p class="jdclassCardLabel">
            <span>门禁卡号&nbsp;&nbsp;{{setFrom.cardId}}</span>
          </p>
          <el-form-item class="inAndout" label="进出方向" prop="inAndout">
            <el-radio-group v-model="setFrom.inAndout">
              <el-radio label="2">进/出</el-radio>
              <el-radio label="0">进</el-radio>
              <el-radio label="1">出</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限制次数" prop="limitnum">
            <el-switch v-if="setFrom.limitnum" v-model="setFrom.limitnum" active-text="已启用"></el-switch>
            <el-switch v-else v-model="setFrom.limitnum" active-text="未启用"></el-switch>
          </el-form-item>
          <el-form-item  label="次数设置" class="countSet" prop="setnum">
            <el-input
              v-model="setFrom.setnum"
              type="text"
              :disabled="setDisabled"
              min="0"
              placeholder
              style="width: 39px"
            ></el-input>&nbsp;&nbsp;次
          </el-form-item>
          <el-form-item label="有效期" prop="period">
            <el-switch v-if="setFrom.period" v-model="setFrom.period" active-text="已启用"></el-switch>
            <el-switch v-else v-model="setFrom.period" active-text="未启用"></el-switch>
          </el-form-item>
          <span
            style="font-size: 12px;font-family: PingFangSC, PingFangSC-Regular;font-weight: 400;text-align: left;color: #333333;line-height: 16px"
          >有效时间段</span>
          <el-row class="dateTimeSet">
            <el-date-picker
              v-model="setFrom.datatimeStart"
              type="datetime"
              :disabled="TimeDisabled"
              value-format="timestamp"
              placeholder="选择日期时间"
            ></el-date-picker>

            <span class="line" style="text-align:center">至</span>

            <el-date-picker
              v-model="setFrom.datatimeEnd"
              :disabled="TimeDisabled"
              type="datetime"
              value-format="timestamp"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-row>
          <div class="dialog-footer jdClassCardfoot">
            <el-button @click="Visible = false">取 消</el-button>
            <el-button type="primary" @click="submitClick()">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
        <div style="text-align:center;margin-bottom:40px">
          <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
          <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此门禁卡吗？</p>
        </div>
        <div class="form-dialog-control-area">
          <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
          <el-button type="primary" @click="handleDel(objData)" :loading="loading">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
// import {
  // fetchList,
  // delCard,
  // enableCard,
  // freezeCard,
  // modifyDetail,
// } from "@/api/card";

import {
  fetchList,
  delCard,
  enableCard,
  freezeCard,
  modifyDetail,
} from "@/api/cardv1";

import util from "@/utils/times";
// import { dropdownNodeComplex } from "@/api/node";
import { dropdownNodeComplex } from "@/api/nodev1";
import { mapGetters } from "vuex";
// import mixin from "@/utils/mixin";
import mixin from "@/utils/mixin-pagev1";
import { transCardStatus, cardTypeStatus, inOrOutStatus } from "@/filters/card";
import { formatDateTime,formatTimeMillisToDateTime } from "@/filters/index";

export default {
  mixins: [mixin],
  computed: {
    ...mapGetters(["communityUuid"]),
  },
  filters: {
    transCardStatus,
    formatDateTime,
    cardTypeStatus,
    inOrOutStatus,
    formatTimeMillisToDateTime,
  },
  methods: {
    showDelDiglog(data) {
      this.showDelDiglogFlag = true;
      this.objData = data
    },
    //设置
    handleSet(data) {
      // console.log(data.inOutCount);
      this.Visible = true; //显示设置模板弹层
      this.setFrom.id = data.cardId;
      this.setFrom.cardId = data.cardNo; //门卡号
      this.setFrom.inAndout = data.inOrOut; //进出方向
      this.setFrom.limitnum = false; //限制次数
      this.setFrom.datatimeStart = data.validTimeStart; //开始时间
      this.setFrom.datatimeEnd = data.validTimeEnd; //结束时间
      // this.setFrom.setnum = data.inOutCount//次数设置
      this.setFrom.period = false; //有效期
      this.setFrom.cardUuid = data.cardUuid;
      this.setFrom.communityUuid = data.communityUuid;
      this.setFrom.householdUuid = data.householdUuid;
      this.setFrom.nodeUuid = localStorage.getItem('nodeUuid');

      if (data.inOutCount === undefined || data.inOutCount == "-1") {
        this.setFrom.limitnum = false; //关闭限制次数
        this.setFrom.setnum = ""; //次数设置
      } else {
        this.setFrom.limitnum = true; //开启限制次数
        this.setFrom.setnum = data.inOutCount; //次数设置
      }

      if (data.validTimeStart != undefined || data.validTimeEnd != undefined) {
        this.setFrom.period = true;
      }
    },
    //设置门禁卡提交
    submitClick() {
      // console.log(this.setFrom);

      //限制次数 启用时  次数大于0
      if (this.setFrom.limitnum) {
        if (this.setFrom.setnum < 1) {
          this.$message({
            message: "次数大于0",
            type: "warning",
          });
          this.Visible = true;
          return false;
        }
      }
      //有效期 启用时 日期不能为空
      if (this.setFrom.period) {
        if (
          this.setFrom.datatimeStart == "" ||
          this.setFrom.datatimeStart === null ||
          this.setFrom.datatimeStart === undefined ||
          this.setFrom.datatimeEnd == "" ||
          this.setFrom.datatimeEnd === undefined ||
          this.setFrom.datatimeEnd === null
        ) {
          this.$message({
            message: "日期不能为空",
            type: "warning",
          });
          this.Visible = true;
          return false;
        }
      }
      let self = this;
      self.$refs.setFrom.validate((valid) => {
        if (valid) {
          self.loading = true;
          let obj = {
            id: self.setFrom.id,
            inOrOut: self.setFrom.inAndout, //方向
            enableCount: self.setFrom.limitnum, //限制次数
            inOutCount: self.setFrom.setnum, //次数
            enableValidDate: self.setFrom.period, //有效期
            validTimeStart: self.setFrom.datatimeStart, //开始日期
            validTimeEnd: self.setFrom.datatimeEnd, //结束日期
            cardUuid: self.setFrom.cardUuid,
            nodeUuid: localStorage.getItem('nodeUuid'),
            communityUuid:self.setFrom.communityUuid,
            householdUuid:self.setFrom.householdUuid,
          };
          self.loading = true;
          self.Visible = false;
          modifyDetail(obj)
            .then(function (response) {
              if (response.data && response.data.status === 0) {
                self.$message({
                  message: response.data.message,
                  type: "success",
                });
                self.loadData(self.page, self.size);
              }
            })
            .catch(function (a) {
              // console.error(a);
            })
            .finally((_) => {
              self.loading = false;
            });
        }
      });
    },
    handleDel: function (data) {
      let self = this;
      if (data.cardUuid) {
        self.loading = true;
        delCard({
          // cardId: data.cardId,
          cardNo: data.cardNo,
          cardUuid: data.cardUuid,
          nodeUuid: localStorage.getItem('nodeUuid')
        })
          .then(function (response) {
            if (response && response.data.status === 0) {
              self.$message({
                message: "删除已完成",
                type: "success",
              });
              self.loadData(self.page, self.size);
            } else {
              self.$message({
                message: response.data.message,
                type: "error",
              });
            }
            return false;
          })
          .catch(function (a) {})
          .finally((_) => {
            self.loading = false;
            self.showDelDiglogFlag = false;
          });
      }
    },
    handleEnable(data) {
      let self = this;
      self
        .$confirm("确定启用此门禁卡吗？")
        .then((_) => {
          enableCard({
            cardUuid: data.cardUuid,
            nodeUuid: localStorage.getItem('nodeUuid')
          })
            .then(function (response) {
              if (response.data && response.data.status == 0) {
                self.$message({
                  message: response.data.message,
                  type: "success",
                });
                self.loadData(self.page, self.size);
              }
            })
            .catch(function (a) {
              console.error(a);
            });
        })
        .catch((a) => {
          console.error(a);
        });
    },
    handleFreeze(data) {
      let self = this;
      self
        .$confirm("确定禁用此门禁卡吗？")
        .then((_) => {
          freezeCard({
            cardUuid: data.cardUuid,
            nodeUuid: localStorage.getItem('nodeUuid')
          })
            .then(function (response) {
              if (response.data && response.data.status == 0) {
                self.$message({
                  message: response.data.message,
                  type: "success",
                });
                self.loadData(self.page, self.size);
              }
            })
            .catch(function (a) {
              console.error(a);
            });
        })
        .catch((a) => {
          console.error(a);
        });
    },
    clearRoom: function () {
      this.searchForm.roomNodeId = "";
      this.searchForm.room = "";
    },
    handleReset: function () {
      this.$refs.searchForm.resetFields();
      this.searchForm.nodeUuid = ''
      this.clearRoom();
      this.loadData();
    },
    showDialog: function () {
      this.showModal = !this.showModal;
    },
    handleClose: function (done) {
      this.loadData();
      this.showModal = !this.showModal;
    },
    loadData: function (page = 1, size = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };

      searchParams.communityUuid = self.communityUuid || -1;
      // searchParams.roomNodeId = self.searchForm.roomNodeId || -1;
      searchParams.page = page || 1;
      searchParams.size = size || 10;
      fetchList(searchParams)
        .then(function (response) {
          self.loading = false;
          if (response && response.data.status === 0  ) {
            self.tableData = response.data.content.list || [];
            self.totalRecord = response.data.content.total;

            page == 1 && self.pageReset();
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    initNode: function () {
      let self = this;
      self.searchForm.room = "";
      dropdownNodeComplex({ communityUuid: self.communityUuid })
        .then(function (response) {
          if (response && response.data) {
            self.roomOptions = [response.data.content];
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    loadNode(node, resolve) {
      if (node.data.children && node.data.children.length > 0) {
        let data = node.data.children;

        for(let item of data){
          if(item.children.length == 0){
            item.leaf = true
          }
        }
        resolve(data)
      }
    },
    handleNodeClick(data) {
      if (data.level=='6' && data.nodeType=='R') {
        this.searchForm.roomNodeId = data.id;
        this.searchForm.room = data.fullNodeName;
        this.popoverShow = data.children?data.children.length>0:false
        this.searchForm.nodeUuid = data.nodeUuid
      }
      if (data.parentId == -1 && !data.children) {
        this.$message({
          message: "该节点下没有数据",
          type: "error",
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullNodeName.indexOf(value) !== -1;
    },
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val);
    },
    //监听限制次数
    "setFrom.limitnum": function (val) {
      // console.log(val);
      if (val) {
        this.setDisabled = false;
      } else {
        this.setDisabled = true;
      }
    },
    //监听有效期
    "setFrom.period": function (val) {
      // console.log(val);
      if (val) {
        this.TimeDisabled = false;
      } else {
        this.TimeDisabled = true;
      }
    },
  },
  mounted() {
    this.loadData();
    this.initNode();
  },
  data() {
    return {
      objData:null,
      showDelDiglogFlag:false,
      TimeDisabled: true,
      setDisabled: true,
      Visible: false,
      showModal: false,
      popoverShow: false,
      filterText: "",
      roomOptions: [],
      searchForm: {
        nodeUuid:"",
        communityUuid:"",
        communityid: null,
        roomNodeId: null,
        cardNo: "",
        cardholder: "",
        room: "",
        isCopy: "",
      },
      defaultProps: {
        children: "children",
        label: "fullNodeName",
        isLeaf: "leaf",
      },
      filterText: "",
      setFrom: {
        cardId: "", //门卡号
        inAndout: "1", //进出方向
        limitnum: false, //限制次数
        datatimeStart: "", //开始时间
        datatimeEnd: "", //结束时间
        setnum: "", //次数设置
        period: false, //有效期
      },
      rules: {
        setnum: [{ required: true, message: "次数设置", trigger: "change" }],
        datatimeStart: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        datatimeEnd: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
    };
  },
};
</script>

<style>
.jdclassCardLabel {
  /* margin-left: 20px; */
  font-size: 20px;
  color: #333333;
  font-weight: 500;
  margin: 0;
  margin-bottom: 33px;
  line-height: 18px;
}

.jdclassCardLabel span {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 20px;
}
.jdClassCard label {
  font-size: 12px;
  color: #333333;
  font-weight: 400;
}


.jdClassCard .el-dialog__body {
  padding: 30px 50px;
}
.jdClassCard .el-form-item {
  margin-bottom: 30px;
}
.jdClassCardfoot {
  /* margin-left: 220px !important; */
  /* margin-top: 50px; */
  margin-left: 0;
  text-align: center;
  margin-top: 40px;
}

.jdClassCardfoot .el-button {
  margin: 0 10px;
}

.countSet .el-input__inner {
  height: 28px;
  padding: 0;
}
.dateTimeSet {
  margin-top: 9px;
}
.dateTimeSet .el-input__inner,
.dateTimeSet .el-input--medium {
  width: 210px;
}


</style>
<style lang="scss" scoped>
.jdClassCard /deep/.el-form-item__label {
  padding: 0;
  margin-right: 20px;
  line-height: 22px;
}
/deep/.el-dialog .el-input {
  width: 136px;
}

.countSet /deep/.el-form-item__label{
  line-height: 28px;
}

.inAndout /deep/.el-form-item__content{
  line-height: 24px;
}
// .countSet /deep/.el-input--medium .el-input__inner{
//   height: 28px;
// }
</style>

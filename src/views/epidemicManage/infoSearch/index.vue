<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">住户列表</span>
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
                                style="margin-top:10px"
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
                        <el-form-item label="身份证号" prop="certificateNo" class="card-id">
                          <el-input placeholder="请输入" clearable v-model="searchForm.certificateNo" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="住户姓名" prop="householdName">
                          <el-input
                            placeholder="请输入"
                            :maxlength="20"
                            clearable
                            v-model="searchForm.householdName"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="籍贯" prop="provinceCode">
                          <el-cascader
                            clearable
                            v-model="address"
                            :options="options"
                            @active-item-change="handleItemChange($event)"
                            :props="props"
                          ></el-cascader>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号码" prop="cellphoneNumber">
                          <el-input
                            placeholder="请输入"
                            clearable
                            :maxlength="11"
                            v-model="searchForm.cellphoneNumber"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="上次通行时间" class="repairDate" prop="lastOpenTime">
                          <el-date-picker
                            v-model="searchForm.lastOpenTime"
                            type="date"
                            class="sSize-input-date"
                            value-format="yyyyMMdd000000000"
                            placeholder="选择日期"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="是否返程人员" prop="personnelType">
                          <el-select
                            v-model="searchForm.personnelType"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option value="1" label="是" />
                            <el-option value="0" label="否" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="住户类型" prop="householdRole">
                          <el-select
                            v-model="searchForm.householdRole"
                            filterable
                            placeholder="请选择"
                            clearable
                          >
                            <el-option :value="1" label="产权人" />
                            <el-option :value="2" label="家庭成员" />
                            <el-option :value="3" label="承租人" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="租户状态" prop="leaseStatus" v-show="showLeaseStatus">
                          <el-select
                            v-model="searchForm.leaseStatus"
                            filterable
                            placeholder="租户状态"
                            clearable
                          >
                            <el-option
                              v-for="item in leaseStatusOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
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
          <el-table
            :data="tableData"
            stripe
            @row-click="tableRowClick"
            ref="table"
            :highlight-current-row="true"
          >
            <div slot="empty" class="empty-table"></div>
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="fullNodeName" min-width="200" label="房屋信息"></el-table-column>
            <el-table-column prop="householdName" min-width="120" label="住户姓名"></el-table-column>
            <el-table-column prop="provinceName" min-width="100" label="籍贯">
              <template slot-scope="scope">
                <span>{{scope.row.provinceName? `${scope.row.provinceName}${scope.row.cityName}`:''}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="lastOpenTime" min-width="140" label="上次通行时间">
              <template slot-scope="scope">
                <span>{{scope.row.lastOpenTime | formatDateTimeHHmmss}}</span>
                <el-button
                  v-if="scope.row.lastOpenTime"
                  type="text"
                  @click="handleMore(scope.row)"
                  size="small"
                >更多</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="returnDate" min-width="100" label="返程日期">
              <template slot-scope="scope">{{ scope.row.returnDate | formatDate }}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="handleSearch(scope.row)" size="small">查看</el-button>
                <el-button type="text" @click="setting(scope.row)" size="small">隔离设置</el-button>
                <el-button
                  type="text"
                  @click="showDelDiglog(scope.row.householdId, scope.row.roomNodeId, scope.row.householdName)"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
            <el-table-column type="expand" width="50" fixed="right">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="table-expand">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="住户类型">
                        <span>{{ scope.row.householdRole | transHouseholdRole }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="门禁卡号">
                        <span>{{ scope.row.cardNo }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="手机号码">
                        <span>{{ scope.row.phoneNumber }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="租户状态" v-if="scope.row.householdRole=='3'">
                        <template>
                          <span>{{ scope.row.leaseStatus | leaseStatusOptions}}</span>
                          <el-button type="text" @click="handleRenewal(scope.row)" size="small">点击续期</el-button>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="创建时间">
                        <span>{{ scope.row.createTime | formatDate }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="身份证号码">
                        <span>{{ scope.row.certificateNo }}</span>
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
    </div>
    <div v-if="showRecord">
      <el-dialog
        title="住户通行记录"
        :visible.sync="showRecord"
        top="5vh"
        width="550px"
        :close-on-click-modal="false"
      >
        <pass-record :formData="formData" @submitSuccess="handleCloseRecord()" />
      </el-dialog>
    </div>
    <div v-if="showRenewal">
      <el-dialog
        title="租户续期"
        :visible.sync="showRenewal"
        top="5vh"
        width="80%"
        :close-on-click-modal="false"
      >
        <renewal :data="rowData" @submitSuccess="handleClose()" />
      </el-dialog>
    </div>
    <div v-if="showDevide">
      <el-dialog
        title="隔离设置"
        :visible.sync="showDevide"
        top="15vh"
        width="550px"
        :close-on-click-modal="false"
      >
        <devide :data="rowData" @submitSuccess="handleCloseDevide()" />
      </el-dialog>
    </div>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
        <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此住户吗？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="handleDel(delData)" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/epidemic";
import { transHouseholdRole } from "@/filters/household";
import { delHousehold } from "@/api/household";
import { dropdownNodeComplex } from "@/api/node";
import { mapGetters } from "vuex";
import mixin from "@/utils/mixin";
import renewal from "@/views/household/renewal.vue";
import passRecord from "./components/passRecord.vue";
import devide from "./components/devideSetting.vue";
import { getLocation } from "@/api/location";

export default {
  mixins: [mixin],
  components: {
    renewal,
    passRecord,
    devide,
  },
  filters: {
    transHouseholdRole,
  },
  data() {
    return {
      showDelDiglogFlag: false,
      delData: [],
      showLeaseStatus: false,
      showRecord: false,
      showRenewal: false,
      popoverShow: false,
      showDevide: false,
      rowData: {},
      filterText: "",
      roomOptions: [],
      searchForm: {
        communityId: null,
        nodeId: null,
        room: "",
        householdName: "",
        certificateNo: "",
        cellphoneNumber: "",
        lastOpenTime: "",
        personnelType: "",
        householdRole: "",
        provinceCode: "",
        cityCode: "",
        leaseStatus: "",
      },
      leaseStatusOptions: [
        { label: "正常", value: 1 },
        { label: "已过期", value: 4 },
      ],
      options: [
        {
          code: "",
          name: "",
          label: "",
          cities: [],
        },
      ],
      props: {
        value: "code",
        children: "cities",
      },
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      filterText: "",
      tableData: [
        {
          fullNodeName: "11",
        },
      ],
      formData: {},
    };
  },
  computed: {
    ...mapGetters(["communityId"]),
    address: {
      set(arr) {
        this.searchForm.provinceCode = arr[0];
        this.searchForm.cityCode = arr[1];
      },
      get() {
        return this.searchForm.provinceCode
          ? [this.searchForm.provinceCode, this.searchForm.cityCode]
          : [];
      },
    },
  },
  mounted() {
    let query = JSON.parse(localStorage.getItem('query'))
    if (query.type) {
      this.searchForm.householdRole = 3;
    }
    this.loadData();
    this.initNode();
    this.initLocation(0, "");
  },

  methods: {
    showDelDiglog(householdId, nodeId, householdName) {
      this.showDelDiglogFlag = true;
      this.delData = [householdId, nodeId, householdName];
    },
    //隔离设置
    setting(data) {
      this.rowData = data;
      this.showDevide = true;
    },
    handleCloseDevide() {
      this.showDevide = false;
      this.loadData(this.offset, this.limit);
    },
    initLocation(loadLevel, zoningCode) {
      let self = this;
      getLocation({
        level: loadLevel,
        zoningCode: zoningCode,
      })
        .then(function (response) {
          if (response.data && response.data.code == 1) {
            //获取省
            if (loadLevel == 0) {
              response.data.dataList.map((item) => {
                delete item.level;
                item.label = item.name;
                item.cities = [];
                return item;
              });
              self.options = response.data.dataList;
            }
            //获取市
            if (loadLevel == 1) {
              let index;
              self.options.forEach((item, idx) => {
                if (item.code == zoningCode) {
                  index = idx;
                }
              });
              response.data.dataList.map((item) => {
                delete item.level;
                item.label = item.name;
                return item;
              });
              self.options[index].cities = response.data.dataList;
            }
          }
        })
        .catch(function (a) {
          console.error(a);
        })
        .finally((_) => {});
    },
    //选中级联一级
    handleItemChange(val) {
      // console.log('val',val)
      let code = val.toString();
      this.initLocation(1, code);
    },
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    //续期
    handleRenewal(data) {
      this.rowData = data;
      this.showRenewal = true;
    },
    handleClose() {
      this.loadData(this.offset, this.limit);
      this.showRenewal = false;
    },
    handleMore(data) {
      this.showRecord = true;
      this.formData = data;
    },
    handleCloseRecord() {
      this.showRecord = false;
    },
    //查看
    handleSearch(data) {
      let query = {
        communityId: data.communityId,
        householdId: data.householdId,
        roomNodeId: data.roomNodeId,
      };
      localStorage.setItem('query',JSON.stringify({
        query
      }))
      this.$router.push({ path: "/business/householdDetails" });
    },
    //删除
    handleDel: function (data) {
      let self = this;
      let [householdId, nodeId, householdName] = data;
      if (householdId && nodeId) {
        self.loading = true;
        delHousehold({
          householdId: householdId,
          roomNodeId: nodeId,
          householdName: householdName,
        })
          .then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: "删除已完成",
                type: "success",
              });
              self.loadData(self.offset, self.limit);
            }
            return false;
          })
          .catch(function (a) {
            self.loading = false;
          });
      } else {
        self.$message({
          message: "该记录暂无法删除，请联系管理人员进行操作",
          type: "error",
        });
      }
      self.showDelDiglogFlag = false;
    },
    clearRoom: function () {
      this.searchForm.roomNodeId = "";
      this.searchForm.room = "";
    },
    //重置
    handleReset: function () {
      this.searchForm.cityCode = "";
      this.$refs.searchForm.resetFields();
      this.searchForm.nodeId = '';
      this.clearRoom();
      this.loadData();
    },
    //搜索
    loadData: function (offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...this.searchForm };
      searchParams.communityId = self.communityId || -1;
      searchParams.nodeId = self.searchForm.nodeId || -1;
      searchParams.offset = offset;
      searchParams.limit = limit;
      fetchList(searchParams)
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
    initNode: function () {
      let self = this;
      self.searchForm.room = "";
      dropdownNodeComplex({ communityId: self.communityId })
        .then(function (response) {
          if (response && response.data) {
            self.roomOptions = response.data.dataList;
          }
        })
        .catch(function (a) {
          console.error(a);
        });
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
    handleNodeClick(data) {
      if (!data.disabled && data.parentId != -1) {
        this.searchForm.nodeId = data.id;
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
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
  watch: {
    filterText: function (val) {
      this.$refs.tree.filter(val);
    },
    "searchForm.householdRole": function (role) {
      if (role != "3") {
        this.showLeaseStatus = false;
        this.searchForm.leaseStatus = "";
      } else {
        this.showLeaseStatus = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.jdtable-container .el-table--medium td {
  padding: 14px 0 !important;
}
</style>
<style lang="">
</style>

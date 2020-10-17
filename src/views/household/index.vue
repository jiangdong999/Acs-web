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
                  <el-form inline :model="form" ref="form">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="所属小区" class="room-place" prop="communityUuid">
                          <el-select
                            v-model="form.communityUuid"
                            @change="initNode"
                            @clear="clearCommunity"
                            placeholder="选择所属小区"
                            clearable
                            filterable
                          >
                            <el-option
                              v-for="item in communityList"
                              :key="item.communityUuid"
                              :label="item.communityName"
                              :value="item.communityUuid"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="room-place" label="房屋位置" prop="nodeId">
                          <div>
                            <el-popover
                            clearable
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
                            v-model="form.room"
                            v-popover:popover
                            clearable
                            @clear="clearRoom"
                            suffix-icon="el-icon-arrow-down"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="住户姓名" prop="householdName">
                          <el-input
                            placeholder="请输入"
                            v-model="form.householdName"
                            :maxlength="15"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                          <el-input
                            placeholder="请输入"
                            v-model="form.phone"
                            :maxlength="11"
                            type="tel"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="身份证号" prop="certificateNo" class="card-id">
                          <el-input
                            placeholder="请输入"
                            v-model="form.certificateNo"
                            type="text"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="门禁卡号" prop="cardNo">
                          <el-input placeholder="请输入" v-model="form.cardNo" type="text" clearable />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="住户类型" prop="householdType">
                          <el-select v-model="form.householdType" filterable clearable>
                            <el-option value="1" label="产权人" />
                            <el-option value="2" label="家庭成员" />
                            <el-option value="3" label="承租人" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="租户状态" prop="leaseStatus" v-show="showLeaseStatus">
                          <el-select
                            v-model="form.leaseStatus"
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
                    <span class="control-right jdClassbtn">
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
      <div class="table-container jdtable-container">
        <div class="jdcontent" v-loading="loading">
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
              <el-table-column prop="communityName" min-width="150" label="所属小区"></el-table-column>
              <el-table-column prop="buildingName" min-width="260" label="房屋信息">
                <template slot-scope="scope">{{scope.row.buildingName!=null? scope.row.buildingName+scope.row.floorName+scope.row.roomName:'' }}</template>
              </el-table-column>
              <el-table-column prop="householdName" min-width="80" label="住户姓名"></el-table-column>
              <el-table-column prop="householdType" min-width="100" label="住户类型">
                <template slot-scope="scope">{{ scope.row.householdType | transHouseholdRole }}</template>
              </el-table-column>
              <el-table-column prop="phone" min-width="120" label="手机号码"></el-table-column>
              <el-table-column label="操作" min-width="180" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click.stop="handleDetails(scope.row)" size="small">查看</el-button>
                  <el-button
                    type="text"
                    @click.stop="showDelDiglog(scope.row)"
                    size="small"
                  >删除</el-button>
                  <el-button
                    v-if="scope.row.householdType=='3'"
                    type="text"
                    @click.stop="handleRenewal(scope.row)"
                    size="small"
                  >续期</el-button>
                </template>
              </el-table-column>
              <el-table-column type="expand" width="60" fixed="left" label="展开">
                <template slot-scope="scope">
                  <el-form label-position="left" inline class="table-expand">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="身份证号码">
                          <span>{{ scope.row.certificateNo}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="门禁卡号">
                          <template>
                            <el-button
                              v-if="!scope.row.cardList || scope.row.cardList.length==0"
                              type="text"
                              @click="handleAction(scope.row)"
                              size="small"
                            >添加</el-button>
                            <template v-else>
                              <el-button
                                v-for="(card,index) in scope.row.cardList"
                                :key="index"
                                type="text"
                                @click="handleAction(scope.row)"
                                size="small"
                              >
                                {{card.cardNo}}
                                &emsp;{{card.status | transCardStatus }}
                              </el-button>
                            </template>
                          </template>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="创建时间">
                          <span>{{ scope.row.createTime | formatDateTimeWithDot }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item label="租户状态" v-if="scope.row.householdType=='3'">
                          <span>{{ scope.row.leaseStatus | leaseStatus}}</span>
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
    </div>

    <div v-if="showAddCard">
      <el-dialog
        title="门卡详情"
        :visible.sync="showAddCard"
        width="550px"
        :show-close="true"
        :close-on-click-modal="false"
      >
        <card :householdInfo="rowData" @handleClose="handleClose" />
      </el-dialog>
    </div>

    <div v-if="showRenewal">
      <el-dialog
        title="租户续期"
        :visible.sync="showRenewal"
        top="5vh"
        width="1011px"
        :close-on-click-modal="false"
      >
        <renewal :data="rowData" @submitSuccess="handleClose()" />
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
// import mixin from "@/utils/mixin";
import mixin from "@/utils/mixin-pagev1";
import bus from "@/utils/bus";
import dateUtil from "@/utils/times";
import HouseholdForm from "./form.vue";
import card from "./components/card.vue";
import renewal from "./renewal.vue";
// import { fetchList, delHousehold } from "@/api/household";
import { fetchList, delHousehold } from "@/api/householdv1";
import { formatDateTimeWithDot } from "@/filters/index";
import { formatCitizenId } from "@/filters/citizenId";
import { transHouseholdRole } from "@/filters/household";
// import { dropdownNodeComplex } from "@/api/node";
import {dropdownNodeComplex} from "@/api/nodev1";
import { mapGetters } from "vuex";
import { transCardStatus,leaseStatus } from "@/filters/card";

export default {
  name: "household",
  mixins: [mixin],
  components: {
    HouseholdForm,
    card,
    renewal
  },
  computed: {
    ...mapGetters(["communityList"])
  },

  filters: {
    formatCitizenId,
    transCardStatus,
    leaseStatus,
    formatDateTimeWithDot: formatDateTimeWithDot,
    transHouseholdRole: transHouseholdRole
  },
  watch: {
    filterText: function(val) {
      this.$refs.tree.filter(val);
    },
    "form.householdType": function(role) {
      if (role != "3") {
        this.showLeaseStatus = false;
        this.form.leaseStatus = "";
      } else {
        this.showLeaseStatus = true;
      }
    }
  },
  methods: {
    showDelDiglog(data) {
      this.showDelDiglogFlag = true
      this.delData = [data.householdId, data.nodeId, data.householdName,data.householdUuid,data.nodeUuid]
    },
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    handleReset: function() {
      this.$refs.form.resetFields();
      this.roomOptions = [];
      this.form.nodeUuid = ''
      this.clearRoom();
      this.loadData();
    },
    clearCommunity() {
      this.roomOptions = [];
      this.clearRoom();
    },
    clearRoom: function() {
      this.form.nodeId = "";
      this.form.room = "";
    },
    handleClose: function() {
      this.loadData(this.page, this.size);
      this.showAddCard = false;
      this.showRenewal = false;
    },
    handleAction: function(data) {
      this.rowData = data;
      this.showAddCard = true;
    },
    handleRenewal: function(data) {
      this.rowData = data;
      this.showRenewal = true;
    },
    handleDetails: function(data) {
      // console.log(data);
      localStorage.setItem('householdDetails',JSON.stringify({
        // propertyId: data.propertyId,
        communityId: data.communityId,
        // householdId: data.householdId,
        // roomNodeId: data.roomNodeId,
        communityUuid:data.communityUuid,
        householdUuid: data.householdUuid,
        nodeUuid: data.nodeUuid,
      }))
      this.$router.push({ path: "/business/householdDetails"});
    },
    handleDel: function(data) {
      // console.log(data);
      let self = this;
      let [householdId,nodeId,householdName,householdUuid,nodeUuid] = data
      if (householdUuid && nodeUuid) {
        
            self.loading = true;
            delHousehold({
              householdId: householdId,
              roomNodeId: nodeId,
              householdName: householdName,
              householdUuid: householdUuid,
              nodeUuid:nodeUuid
            })
              .then(function(response) {
                if (response && response.data.status === 0) {
                  self.$message({
                    message: "删除已完成",
                    type: "success"
                  });
                  self.loadData(self.page, self.size);
                }
                return false;
              })
              .catch(function(a) {
                self.loading = false;
              })
              .finally(()=>{
                self.showDelDiglogFlag = false
              });
          
      } else {
        self.$message({
          message: "该记录暂无法删除，请联系管理人员进行操作",
          type: "error"
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullNodeName.indexOf(value) !== -1;
    },
    initNode: function(data) {
      let self = this;
      this.clearRoom();
      if (data) {
        dropdownNodeComplex({ communityUuid: data })
          .then(function(response) {
            if (response && response.data) {
              self.roomOptions = [response.data.content];
            }
          })
          .catch(function(a) {
            console.error(a);
          });
      }
    },
    loadNode(node, resolve) {
      if(node.data.children && node.data.children.length>0){
         let data = node.data.children
         for(let item of data){
           if(item.children.length == 0){
             item.leaf = true
           }
         }
         resolve(data)
      }else{
        resolve([]);
      }
    },
    handleNodeClick(data) {
      if (data.level=='6' && data.nodeType=='R') {
        this.form.nodeId = data.id;
        this.form.room = data.fullNodeName;
        this.popoverShow = data.children?data.children.length>0:false
        this.form.nodeUuid = data.nodeUuid
      }

      if (data.parentId == -1 && !data.children) {
        this.$message({
          message: "该节点下没有数据",
          type: "error"
        });
      }
    },
    loadData: function(page = 1, size = 10) {
      let self = this;
      self.loading = true;

      let searchParams = { ...self.form };
      searchParams.page = page;
      searchParams.size = size;
      fetchList(searchParams)
        .then(function(response) {
          if (response.data && response.data.status === 0) {
            self.tableData = response.data.content.list || [];
            // self.totalRecord = response.data.totalCount;
            self.loading = false;

            page == 1 && self.pageReset();
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    }
  },
  created() {
    // created > mounted > activated
    this.loadData();
    bus.$on("editHousehold", () => {
      this.loadData(this.page, this.size);
    });
  },
  mounted() {
    this.loadData();
    //阻止confirm弹窗按enter键不断执行删除的bug
    document.onkeydown = function(event) {
      let ev = typeof event != "undefined" ? window.event : e;
      if (ev.keyCode == 13) {
        return false;
      }
    };
  },
  activated() {
    // console.log('activated')
  },
  destroyed() {
    bus.$off("editHousehold");
  },
  data() {
    return {
      showDelDiglogFlag: false,
      delData:[],
      showAddCard: false,
      showRenewal: false,
      showLeaseStatus: false,
      loading: false,
      rowData: {},
      form: {
        communityId: null,
        communityUuid: "",
        nodeId: null,
        room: "",
        householdName: "",
        phone: "",
        leaseStatus: null,
        certificateNo: "",
        householdType: "",
        cardNo: "",
        nodeUuid: ""
      },
      leaseStatusOptions: [
        { label: "正常", value: 1 },
        { label: "已过期", value: 4 }
      ],
      // 204
      defaultProps: {
        children: "children",
        label: "fullNodeName",
        isLeaf: "leaf"
      },
      roomOptions: [],
      popoverShow: false,
      filterText: ""
    };
  }
};
</script>
<style lang="scss">
.jdClass .el-form-item__label {
  display: block !important;
  width: auto !important;
}
.jdClass .el-form-item__content {
  // margin-left: 20px;
}
.jdClass .room-place .el-input__inner {
  // width: 360px !important;
}
.jdClass .el-popover {
  padding: 0px;
}
.jdClassbtn {
  margin-right: 0px;
  margin-top: 60px;
}
.jdPopper {
  box-shadow: 0px 4px 16px #dedede;
}
.jdIconSize {
  font-size: 20px;
  margin-right: 4px;
}
.jdbtn {
  float: right;
  font-size: 12px;
  color: #0074da;
  cursor: pointer;
  border: none;
}
.el-table th {
  background: #f0f2f5;
  padding: 13px 0 !important;
}
.jdtable-container {
  background-color: #f0f2f5;
  padding: 0px;
}
.jdtable-control-panel {
  padding: 8px 20px;
  background: #fff;
}
.jdcontent {
  padding: 20px 30px;
  background: #fff;
}
.jdtable-container .page-container {
  padding: 20px 20px 20px 0px;
}
.jdtable-container .el-table--medium td {
  padding: 14px 0 !important;
}
</style>

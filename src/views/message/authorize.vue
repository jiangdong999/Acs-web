<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">申请审批列表</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="searchForm" :model="searchForm" inline>
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
                                clearable
                                v-model="filterText"
                              ></el-input>
                              <el-tree
                                class="tree-node"
                                :data="roomOptions"
                                ref="tree"
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
                            placeholder="请选择"
                            v-model="searchForm.room"
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
                        <el-form-item label="申请人姓名" prop="key">
                          <el-input
                            v-model="searchForm.key"
                            :maxlength="20"
                            clearable
                            placeholder="请输入"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="申请人手机号" prop="phone">
                          <el-input
                            v-model="searchForm.phone"
                            :maxlength="11"
                            clearable
                            placeholder="请输入"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="申请类型" prop="applyType">
                          <el-select v-model="searchForm.applyType" placeholder="请选择" clearable>
                            <!-- <el-option label="自助申请" value="0"></el-option>
                            <el-option label="帮人申请" value="1"></el-option>-->
                            <el-option label="产权人" value="1"></el-option>
                            <el-option label="家庭成员" value="2"></el-option>
                            <el-option label="承租人" value="3"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="审核状态" prop="status">
                          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
                            <el-option label="未审核" value="2"></el-option>
                            <el-option label="审核通过" value="3"></el-option>
                            <el-option label="拒绝通过" value="4"></el-option>
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
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="fullNodeName" min-width="200" label="房屋位置"></el-table-column>

            <el-table-column prop="sponsor" min-width="100" label="申请人"></el-table-column>
            <el-table-column prop="householdPhone" min-width="120" label="申请人手机号"></el-table-column>
            <el-table-column prop="householdType" min-width="120" label="申请类型">
              <template slot-scope="scope">{{ scope.row.householdType | transHouseholdType}}</template>
            </el-table-column>
            <el-table-column prop="applyTime" min-width="160" label="申请时间">
              <template slot-scope="scope">{{ scope.row.applyTime | formatDateTime}}</template>
            </el-table-column>
            <el-table-column prop="status" min-width="120" label="审核状态">
              <template slot-scope="scope">{{scope.row.status | transStatus}}</template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="handleView(scope.row)" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="page-container">
          <!-- <el-pagination
            background
            @size-change="limitChange"
            @current-change="turnPage"
            :current-page.sync="page"
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>-->
          <el-pagination
            background
            @size-change="limitChange"
            @current-change="turnPage"
            :current-page.sync="page"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="totalRecord"
          ></el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showModal">
      <el-dialog
        title="申请审批详情"
        width="790px"
        top="10vh"
        :show-close="true"
        :visible.sync="showModal"
        :close-on-click-modal="false"
      >
        <authorize-form :status="status" :id="authorityLog_id" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchAuthorize } from "@/api/message";
import { formatDateTime, transHouseholdType } from "@/filters/index";
import { transStatus } from "@/filters/message";
import authorizeForm from "./authorizeForm";
import mixin from "@/utils/mixin";
import { dropdownNodeComplex } from "@/api/node";

export default {
  mixins: [mixin],
  components: { authorizeForm },

  filters: {
    transStatus: transStatus,
    formatDateTime: formatDateTime,
    transHouseholdType: transHouseholdType
  },

  watch: {
    filterText: function(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    clearRoom: function() {
      this.searchForm.nodeId = "";
      this.searchForm.room = "";
    },
    handleReset: function() {
      this.$refs.searchForm.resetFields();
      this.page = 1;
      this.clearRoom();
      this.loadData();
    },
    handleClose: function() {
      this.showModal = false;
      this.loadData(this.offset, this.limit);
    },
    loadData: function(offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let listObj = {
        offset: offset,
        limit: limit,
        communityId: self.community.communityId
      };
      let keyObject = Object.assign(self.searchForm, listObj);
      fetchAuthorize(keyObject)
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
        });
    },
    handleView: function(data) {
      this.authorityLog_id = data.authorityLog_id;
      this.status = data.status;
      this.showModal = true;
    },
    initNode: function(data) {
      let self = this;
      self.searchForm.room = "";
      dropdownNodeComplex({ communityId: self.community.communityId })
        .then(function(response) {
          if (response.data && response.data.code == 1) {
            self.roomOptions = response.data.dataList;
          }
        })
        .catch(function(a) {
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
      if (data.parentId != -1) {
        this.searchForm.nodeId = data.id;
        this.searchForm.room = data.nodeLabel;
        this.popoverShow = data.disabled;
      }
      if (data.parentId == -1 && !data.children) {
        this.$message({
          message: "该节点下没有数据",
          type: "error"
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },

  mounted() {
    this.loadData();
    this.initNode();
  },
  data() {
    return {
      showModal: false,
      status: "",
      authorityLog_id: null,
      popoverShow: false,
      roomOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      filterText: "",
      searchForm: {
        applyType: "",
        status: "",
        key: "",
        nodeId: null,
        room: "",
        phone: ""
      }
    };
  }
};
</script>
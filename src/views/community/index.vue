<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">小区列表</span>
            <span class="jdclass_refurbish">
              <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
            </span>
            <span class="control-left">
              <el-button
                type="primary"
                class="jdaddbtn"
                icon="el-icon-plus"
                @click="showDialog"
              >新增小区</el-button>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="searchForm" :model="searchForm" inline>
                    <el-row>
                      <el-form-item label="行政区划" prop="zoningCode" class="admininstration">
                        <location-picker
                          :locationCode.sync="searchForm.zoningCode"
                          ref="locationPicker"
                        />
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="小区名称" class="room-place" prop="communityName">
                          <el-input
                            placeholder="小区名称"
                            style="width:360px"
                            v-model="searchForm.communityName"
                            clearable
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="详细地址" class="room-place" prop="address">
                          <el-input
                            placeholder="详细地址"
                            v-model="searchForm.address"
                            clearable
                            style="width:360px"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-form-item label="负责人" prop="contact">
                        <el-input placeholder="负责人" v-model="searchForm.contact" clearable />
                      </el-form-item>
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
            fit
            @row-click="tableRowClick"
            ref="table"
            :highlight-current-row="true"
          >
            <div slot="empty" class="empty-table"></div>
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="communityName" min-width="140" label="小区名称"></el-table-column>
            <el-table-column prop="address" min-width="240" label="详细地址"></el-table-column>
            <!-- <el-table-column prop="householdCount" min-width="80" label="住户数量"></el-table-column> -->
            <el-table-column prop="displayIdentitly" min-width="80" label="楼栋数量">
              <template slot-scope="scope">{{scope.row.buildingCount || 0}}</template>
            </el-table-column>
            <el-table-column prop="roomCount" min-width="80" label="房屋数量"></el-table-column>
            <!-- <el-table-column prop="countDoor" min-width="80" label="门禁机数"></el-table-column> -->
            <el-table-column label="操作" fixed="right" min-width="120">
              <template slot-scope="scope">
                <el-button type="text" @click.stop="handleEdit(scope.row)" size="small">查看</el-button>
                <el-button type="text" @click.stop="showDelDiglog(scope.row)" size="small">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column type="expand" fixed="left" width="60" label="展开">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="table-expand">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="省市区">
                        <span>{{ scope.row.zoningCode }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="管理处负责人">
                        <span>{{ scope.row.contact }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="负责人电话">
                        <span>{{ scope.row.phone }}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="添加时间">
                        <span>{{ new Date(scope.row.entryTime) | moment(dateFormat)}}</span>
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
            :current-page="page"
            @current-change="turnPage"
            layout="prev, pager, next"
            :total="totalRecord"
          ></el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showModal">
      <el-dialog title="新增小区" :visible.sync="showModal" width="790px" :close-on-click-modal="false">
        <community-form @close="handleClose()" />
      </el-dialog>
    </div>

    <div v-if="showEdit">
      <el-dialog title="小区信息" :visible.sync="showEdit" width="790px" :close-on-click-modal="false">
        <community-edit :data="rowData" />
      </el-dialog>
    </div>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
        <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此小区吗？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="handleDel(objData)" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommunityForm from "./components/form.vue";
import CommunityEdit from "./components/edit.vue";
// import CommunitySetting from "./components/setting.vue";
import locationPicker from "@/components/locationPicker/locationPicker.vue";
import { delCommunity } from "@/api/community"
import { fetchList } from "@/api/communityv1";
import util from "@/utils/times";
import permission from "@/directive/permission/index";
import mixin from "@/utils/mixin-page";

export default {
  mixins: [mixin],
  components: {
    CommunityForm,
    CommunityEdit,
    // CommunitySetting,
    locationPicker,
  },

  directives: { permission },

  computed: {
    dateFormat: function () {
      return util.dateFormat();
    },
  },
  methods: {
    showDelDiglog(data) {
      this.showDelDiglogFlag = true;
      this.objData = data;
    },
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    handleReset: function () {
      this.$refs.searchForm.resetFields();
      this.$refs.locationPicker.selectReset(0);
      this.loadData();
    },
    showDialog: function () {
      this.showModal = true;
    },
    handleClose: function (done) {
      this.loadData(this.page - 1, this.limit);
      this.showModal = false;
      this.showEdit = false;
      this.showSetting = false;
    },
    loadData: function (page = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let searchParams = { ...self.searchForm };
      searchParams.offset = page;
      // console.log(searchParams.offset);
      searchParams.limit = limit;
      fetchList(searchParams)
        .then(function (response) {
          if (response.data && response.data.status == 0) {
            if (
              response.data.content.list &&
              response.data.content.totalPage == searchParams.offset &&  //删除最后一页的最后一条，跳到前一页并读取数据
              searchParams.offset > 0
            ) {
              // console.log(searchParams.offset);
              searchParams.offset--;
              // console.log(searchParams.offset);
              fetchList(searchParams).then((res) => {
                if (res.data && res.data.status == 0) {
                  self.tableData = res.data.content.list || [];
                  self.totalRecord = res.data.content.total;
                  self.loading = false;
                  self.page = res.data.content.totalPage
                }
              });
            } else {
              self.tableData = response.data.content.list || [];
              self.totalRecord = response.data.content.total;
              self.loading = false;

              page == 0 && self.pageReset();
            }
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    handleEdit: function (row) {
      this.rowData = row;
      this.showEdit = true;
    },
    handleSet: function (data) {
      this.rowData = data;
      this.showSetting = true;
    },
    handleDel: function (data) {
      let self = this;
      // console.log(data);
      data = {
        communityUuid:data.communityUuid,
        communityId:data.id
      }
      if (data) {
        delCommunity(data)
          .then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: "删除已完成",
                type: "success",
              });
              self.loadData(self.page - 1, self.limit);
              self.$store.dispatch("getCommunity");
            }
          })
          .catch(function (a) {})
          .finally((_) => {
            self.loading = false;
            self.showDelDiglogFlag = false;
          });
      }
    },
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      objData: null,
      showDelDiglogFlag: false,
      showModal: false,
      showSetting: false,
      filterText: "",
      showEdit: false,
      rowData: {},
      searchForm: {
        zoningCode: null,
        address: "",
        communityName: "",
        contact: "",
        phone: "",
      },
    };
  },
};
</script>

<style scoped>
/* .table-container{
  padding: 20px 30px 30px 30px;
}
.table-control-panel{
  padding: 6px 30px;
  background: #fff;
}
.table-control-panel .list-title{
  margin-right: 20px;
}

.jdbtn {
  float: right;
  font-size: 12px;
  color: #0074da;
  cursor: pointer;
  border: none;
  margin-right: -48px;
}
.jdIconSize {
  font-size: 20px;
  margin-right: 4px;
} */
</style>
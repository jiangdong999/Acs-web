<template>
  <div class="jdDIV">
    <div class="loading" v-if="loading"></div>
    <div class="app-container">
      <el-row :span="24">
        <el-form ref="searchForm" :model="searchForm" :inline="true">
          <el-col>
            <div class="table-control-panel">
              <div style="margin-bottom:20px">
                <span v-if="initFlag" class="control-left list-title">门禁机管理</span>
                <span v-else class="control-left list-title">共有 {{countData.totalCount}} 台门禁机</span>
                <span class="jdclass_refurbish">
                  <i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i>
                </span>
                <span class="control-right">
                  <el-popover
                    placement="bottom"
                    width="410"
                    trigger="click"
                    popper-class="jdPopper"
                  >
                    <div class="jdClass">
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="维护模式" prop="maintainStatus">
                            <el-select
                              v-model="searchForm.maintainStatus"
                              placeholder="请选择"
                              clearable
                            >
                              <el-option :value="1" label="开" />
                              <el-option :value="0" label="关" />
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- hack重置时doorstatus值不重置 -->
                      <span class="jdClassbtn">
                        <el-button @click="handleReset()">重置</el-button>
                        <el-button type="primary" @click="loadCommunityInfo()">搜索</el-button>
                      </span>
                    </div>
                    <el-button plain slot="reference" class="jdbtn">
                      <svg-icon iconClass="filter" class="jdIconSize" />筛选
                    </el-button>
                  </el-popover>
                </span>
              </div>
              <el-row :span="24">
                <el-col :span="7">
                  <el-form-item label="所属小区" prop="communityId">
                    <el-select
                      v-model="searchForm.communityId"
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
                <el-col :span="7">
                  <el-form-item label="门禁机名称" prop="doorName">
                    <el-input
                      v-model="searchForm.doorName"
                      :maxlength="20"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="设备编号" prop="doorDeviceId">
                    <el-input
                      v-model="searchForm.doorDeviceId"
                      :maxlength="32"
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item label="设备状态" prop="doorStatus" v-show="false">
                    <el-select v-model="searchForm.doorStatus" placeholder="请选择" clearable>
                      <el-option value="0" label="离线"/>
                      <el-option value="1" label="在线"/>
                    </el-select>
                  </el-form-item>
                </el-col>-->
                <span style="float: right;">
                  <el-button type="primary" @click="loadCommunityInfo()">搜索</el-button>
                </span>
              </el-row>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <div class="header module" style="margin-top:-15px">
        <el-row :gutter="20">
          <el-col :span="6" class="item">
            <div
              class="all"
              :class="{'checked': searchForm.doorStatus=='1'}"
              @click="doorStatusChange('1')"
            >
              <p>在线</p>
              <div>
                <span v-if="initFlag">-&nbsp;-</span>
                <count-to
                  v-else
                  :startVal="0"
                  :endVal="parseInt(countData.onlineCount) || 0"
                  :duration="2500"
                ></count-to>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div
              class="offline"
              :class="{'checked': searchForm.doorStatus=='0'}"
              @click="doorStatusChange('0')"
            >
              <p>离线</p>
              <div>
                <span v-if="initFlag">-&nbsp;-</span>
                <count-to
                  v-else
                  :startVal="0"
                  :endVal="parseInt(countData.offlineCount) || 0"
                  :duration="2500"
                ></count-to>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div
              class="no-sync"
              :class="{'checked': searchForm.doorStatus=='2'}"
              @click="doorStatusChange('2')"
            >
              <p>数据未同步</p>
              <div>
                <span v-if="initFlag">-&nbsp;-</span>
                <count-to
                  v-else
                  :startVal="0"
                  :endVal="parseInt(countData.unSyncCount) || 0"
                  :duration="2500"
                ></count-to>
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div
              class="open"
              :class="{'checked': searchForm.doorStatus=='3'}"
              @click="doorStatusChange('3')"
            >
              <p>门常开</p>
              <div>
                <span v-if="initFlag">-&nbsp;-</span>
                <count-to
                  v-else
                  :startVal="0"
                  :endVal="parseInt(countData.alarmCount) || 0"
                  :duration="2500"
                ></count-to>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="content">
        <div v-if="initFlag" style="width:230px;height:235px;margin:0 auto;margin-top:72px">
          <el-image :src="accessControl"></el-image>
        </div>
        <div v-else class="device-list" ref="deviceList">
          <div class="device-item" v-for="(device,i) in tableData" :key="i">
            <div class="device-body">
              <div
                class="setting"
                :class="{'not-allowed': isOffline(device)}"
                @click="handleAction(device)"
              >
                <img src="../../assets/icon/action.png" alt />
              </div>
              <p>
                <el-tooltip effect="dark" :content="device.address" placement="top">
                  <label>{{device.address}}</label>
                </el-tooltip>
              </p>

              <p class="title_p">
                <el-tooltip effect="dark" content="进出方向" placement="left">
                  <span class="home-in" v-if="device.doorDirection === '1'"></span>
                  <span class="home-in home-out" v-if="device.doorDirection === '0'"></span>
                </el-tooltip>
                <el-tooltip effect="dark" :content="device.doorName" placement="bottom">
                  <h4>{{device.doorName}}</h4>
                </el-tooltip>
              </p>

              <div class="tags">
                <template v-for="(tag, k) in device.doorStatus">
                  <span class="lx" v-if="tag=='0'" :key="k">离线</span>
                  <span class="wtb" v-else-if="tag=='2'" :key="k">未同步</span>
                  <span class="mck" v-else-if="tag=='3'" :key="k">门常开</span>
                </template>
              </div>

              <div class="box" :class="{'wtb': isUnSync(device)}" @click="handleSync(device)">
                <div>
                  <i class="iconfont icon-xingzhuangjiehe"></i>
                  {{device.doorCardCount}}/{{device.cardCount}}
                </div>
                <div>
                  <i class="iconfont icon-xiaolianmanyifuwu"></i>
                  {{device.doorFaceCount}}/{{device.faceCount}}
                </div>
              </div>
              <div class="info-row">
                <div>
                  <el-tooltip effect="dark" content="设备型号" placement="left">
                    <i class="iconfont icon-icon_equipment"></i>
                  </el-tooltip>
                  {{device.doorType?device.doorType:'未知'}}
                  <span class="version">
                    <el-tooltip effect="dark" content="信号强度" placement="top">
                      <i class="iconfont icon-icon_signal"></i>
                    </el-tooltip>
                    {{device.signalIntensity?`${device.signalIntensity} dBm`:'未知'}}
                  </span>
                </div>
                <div>
                  <el-tooltip effect="dark" content="刷脸类型" placement="left">
                    <i class="iconfont icon-icon-face"></i>
                  </el-tooltip>
                  {{device.faceStatus | transFaceStatus}}
                  <span
                    class="mode"
                    v-if="device.maintainStatus==0"
                    @click="changeMaintainStatus(device)"
                  >
                    维护模式&nbsp;&nbsp;
                    <i class="iconfont icon-iocn-on"></i>
                  </span>
                  <span
                    v-if="device.maintainStatus==1"
                    class="active"
                    @click="changeMaintainStatus(device)"
                  >
                    维护模式&nbsp;&nbsp;
                    <i class="iconfont icon-icon-off"></i>
                  </span>
                </div>
                <div>
                  <el-tooltip effect="dark" content="联网方式" placement="left">
                    <i class="iconfont icon-icon_SIM"></i>
                  </el-tooltip>
                  &nbsp;{{device.networkType}}
                  <span
                    class="simNO"
                    v-if="device.networkType === 'cellular'"
                  >({{device.simNo}})</span>
                </div>
                <div>
                  <el-tooltip effect="dark" content="最后心跳时间" placement="left">
                    <i class="iconfont icon-icon-time"></i>
                  </el-tooltip>
                  <span v-if="device.heartTime">{{device.heartTime | formatDateTime}}</span>
                  <span v-else>未知</span>
                </div>
                <div>
                  <el-tooltip effect="dark" content="设备编号" placement="left">
                    <i class="iconfont icon-icon_umber"></i>
                  </el-tooltip>
                  <span class="doorDeviceClass">{{device.doorDeviceId}}</span>
                  <i
                    style="color:#0087ea"
                    class="iconfont icon-lujing182 doorDeviceClass_i"
                    v-clipboard:copy="device.doorDeviceId"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                  ></i>
                </div>
                <div>
                  <el-tooltip effect="dark" content="当前版本号" placement="left">
                    <i class="iconfont icon-icon_newumber"></i>
                  </el-tooltip>
                  <span v-if="device.doorVersion">{{device.doorVersion}}</span>
                  <span v-else>无</span>
                </div>
                <!-- <div><i class="iconfont icon-details_numbering_iconx"></i> {{device.doorDeviceId}}
                  <span class="version">
                    <i class="iconfont icon-banben"></i>
                    {{device.doorVersion || '无'}}
                  </span>
                </div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showChange">
      <el-dialog title="更换设备" width="440px" :visible.sync="showChange" :close-on-click-modal="true">
        <changeDevice :device="rowData" @submit="handleClose(0, offset)" />
      </el-dialog>
    </div>
    <div v-if="showSync">
      <el-dialog title="手动同步" width="550px" :visible.sync="showSync" :close-on-click-modal="true">
        <syncDevice :device="rowData" @submit="handleClose(0, offset, true)" />
      </el-dialog>
    </div>
    <div v-if="showAction">
      <el-dialog
        title="门禁机操作"
        width="450px"
        :visible.sync="showAction"
        :close-on-click-modal="true"
      >
        <action :device="rowData" @submit="handleClose(0, offset)" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchListV2, fetchDataCount, maintainDevice } from "@/api/device";
import mixin from "@/utils/mixin";
import countTo from "vue-count-to";
import changeDevice from "./components/changeDevice.vue";
import syncDevice from "./components/syncDevice.vue";
import action from "./components/action.vue";
import { mapGetters } from "vuex";
import { formatDateTime } from "@/filters/index";
import accessControl from "@/assets/image/access_control.png";

let $el;
let _scrollTop = 0;
export default {
  name: "deviceList_simple",
  mixins: [mixin],
  components: {
    changeDevice,
    syncDevice,
    action,
    countTo,
  },
  computed: {
    ...mapGetters(["communityList"]),
  },

  filters: {
    formatDateTime,
    transFaceStatus(status) {
      switch (status) {
        case "1":
          return "在线";
        case "2":
          return "云离线";
        case "3":
          return "脱机";
        case "4":
          return "抓拍";
      }
    },
  },
  data() {
    return {
      accessControl,
      initFlag: true,
      showChange: false,
      showSync: false,
      showAction: false,
      loading: false,
      rowData: {},
      searchForm: {
        doorName: "",
        doorDeviceId: "",
        doorStatus: "",
        communityId: "",
        maintainStatus: null,
      },
      countData: {
        totalCount: 0,
        onlineCount: 0,
        offlineCount: 0,
        unSyncCount: 0,
        alarmCount: 0,
      },
      eachCount: null,
    };
  },
  methods: {
    // 复制成功
    onCopy() {
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
    // 复制失败
    onError() {
      this.$message({
        message: "复制失败",
        type: "success",
      });
    },
    handleReset: function () {
      this.$refs.searchForm.resetFields();
      this.searchForm.communityId = "";
      this.tableData = null
      this.searchForm.doorStatus = ""
      // this.loadCommunityInfo();
      this.initFlag = true
    },
    isUnSync(device) {
      // if(device.faceStatus=='2'){
      // 刷脸类型为云离线
      let v = device.doorStatus.some((item) => {
        return item == "2";
      });

      return v;
      // }

      // return true
    },
    isOffline(device) {
      // if(device.faceStatus=='2'){
      // 刷脸类型为云离线
      let v = device.doorStatus.some((item) => {
        return item == "0";
      });

      return v;
      // }

      // return true
    },
    handleClose: function (offset, limit, cb) {
      this.loadData(offset, limit);
      this.showChange = false;
      this.showSync = false;

      cb && this.fetchDataCount();
    },
    loadCommunityInfo() {
      let self = this,
        flag = false;
      if (self.searchForm.communityId) {
        flag = true;
      }
      if (self.searchForm.doorDeviceId) {
        flag = true;
      }

      if (flag) {
        self.loadData();
        self.fetchDataCount();
        self.initFlag = false;
      } else {
        self.$message({
          type: "error",
          message: "小区或设备编号不能为空",
        });
      }
    },
    fetchDataCount() {
      let self = this;
      fetchDataCount({
        communityId: self.searchForm.communityId,
        ...self.searchForm,
      })
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            self.countData.totalCount = response.data.data.totalCount || 0;
            self.countData.offlineCount = response.data.data.offlineCount || 0;
            self.countData.unSyncCount = response.data.data.unSyncCount || 0;
            self.countData.alarmCount = response.data.data.alarmCount || 0;
            self.countData.onlineCount = response.data.data.onlineCount || 0;
          }
        })
        .catch(function (a) {});
    },
    updateCount(count, doorStatus) {
      switch (doorStatus) {
        case "":
          this.countData.totalCount = count;
          break;
        case "0":
          this.countData.offlineCount = count;
          break;
        case "1":
          this.countData.onlineCount = count;
          break;
        case "2":
          this.countData.unSyncCount = count;
          break;
        case "3":
          this.countData.alarmCount = count;
          break;
      }
    },
    loadData: function (offset = 0, limit = this.eachCount * 5, contact) {
      let self = this;
      self.loading = true;
      let listObj = {
        offset: offset,
        limit: limit,
      };

      let keyObject = Object.assign(self.searchForm, listObj);
      fetchListV2(keyObject)
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            self.updateCount(response.data.totalCount, keyObject.doorStatus);

            self.tableData = contact
              ? self.tableData.concat(response.data.dataList)
              : response.data.dataList;
            self.offset = offset + limit;
          }
        })
        .finally(function (a) {
          self.loading = false;
        });
    },
    handleSync(data) {
      if (this.isUnSync(data)) {
        this.rowData = data;
        this.showSync = true;
      }
    },
    handleAction(data) {
      if (!this.isOffline(data)) {
        this.rowData = data;
        this.showAction = true;
      }
    },
    changeMaintainStatus(device) {
      let self = this;

      let status = device.maintainStatus == 1 ? 0 : 1;
      maintainDevice({
        doorName: device.doorName,
        communityId: device.communityId,
        doorDeviceId: device.doorDeviceId,
        status: status,
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          device.maintainStatus = status;
          self.$message({
            message: response.data.message,
            type: "success",
          });
          // self.loadData()
        }
      });
    },
    doorStatusChange(status) {
      if(this.initFlag) return false

      let self = this,
        flag = false;
      if (self.searchForm.communityId) {
        flag = true;
      }
      if (self.searchForm.doorDeviceId) {
        flag = true;
      }

      if (flag) {
        this.searchForm.doorStatus =
        this.searchForm.doorStatus == status ? "" : status;
        this.loadData();
        this.initFlag = false
      } else {
        self.$message({
          type: "error",
          message: "小区或设备编号不能为空",
        });
      }
      
    },
    onScroll(e) {
      let el = e.target;

      // 距离底部小于200高度的时候进行加载判断
      if (el.scrollHeight - 200 < el.scrollTop + el.offsetHeight) {
        // 判断滚动条的滚动方向
        if (el.scrollTop - _scrollTop > 0) {
          !this.loading && this.loadData(this.offset, this.eachCount * 5, true);
        }
        _scrollTop = el.scrollTop;
      } else {
      }
    },
  },
  mounted() {
    // $el = document.querySelector(".content-view")
    $el = document.querySelector(".jdDIV");
    this.eachCount = Math.floor($el.offsetWidth / 260);

    // this.loadCommunityInfo();
    this.$nextTick(() => {
      $el.addEventListener("scroll", this.onScroll);
    });
  },
  destroyed() {
    $el.removeEventListener("scroll", this.onScroll);
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.loading {
  position: absolute;
  margin-top: calc(50vh - 140px);
  margin-left: calc(50vw - 120px);
  width: 120px;
  height: 140px;
  background-color: #fff;
  background-image: url(../../assets/gif/loadingWhite.gif);
  background-repeat: no-repeat;
  background-position: center center;
  z-index: 2;
  border-radius: 10px;
  box-shadow: 0px 20px 70px 0px rgba(0, 0, 0, 0.2);
}
.no-padding {
  padding: 0;
}
.check:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(../../assets/icon/icon_select.png);
  background-size: contain;
  position: absolute;
  right: 20px;
  top: 17px;
}
.checked:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url(../../assets/icon/icon_select.png);
  background-size: contain;
  position: absolute;
  right: 20px;
  top: 17px;
}
.dialog-form {
  text-align: center;
  > h3 {
    font-size: 24px;
  }
  > label {
    font-size: 12px;
    color: #888888;
    font-weight: 500;
  }
  > .input {
    margin: 10px 0 40px 0;
  }
  > .info-sync {
    margin: 40px 0;
    text-align: center;
    > div {
      width: 200px;
      display: inline-block;
      padding: 0 30px;
      h3 {
        font-size: 30px;
        margin: 10px 0;
        span {
          color: #ff5555;
        }
      }
    }
  }
}
.module {
  // background-color: #fff;
  background-color: #f0f2f5;
  // box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  // padding: 10px 30px;
}
.header {
  text-align: center;
  line-height: 30px;
  padding: 20px 30px 0px 30px;
}
.item {
  font-size: 14px;
  cursor: pointer;
  color: #fff;
}
.item > div {
  font-weight: 900;
  font-size: 14px;
  border-radius: 8px;
  padding-left: 20px;
  position: relative;
  text-align: left;
  height: 56px;
}
.item > div > p {
  margin: 0;
  display: inline-block;
  line-height: 56px;
  vertical-align: top;
  padding-right: 20px;
}
.all {
  background: #007ee4;
  line-height: 56px;
}
.offline {
  background: #a6a6a6;
}
.no-sync {
  background: #f9ac00;
}
.open {
  background: #ff534e;
}
.all:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // background-repeat: no-repeat;
  // background-position: bottom right;
  // background-size: 54px 45px;
  // background-image: url('../../assets/image/all.png')
}
.offline:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // background-repeat: no-repeat;
  // background-position: bottom right;
  // background-image: url('../../assets/image/lx.png')
}
.no-sync:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // background-repeat: no-repeat;
  // background-position: bottom right;
  // background-image: url('../../assets/image/wtb.png')
}
.open:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  // background-repeat: no-repeat;
  // background-position: bottom right;
  // background-image: url('../../assets/image/mck.png')
}
.item > div > div {
  font-size: 22px;
  line-height: 56px;
  display: inline-block;
}
.btn-add {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  font-size: 0px;
  background-color: #007ee4;
  border-radius: 8px;
  cursor: pointer;
  padding: 10px 0;
  transition: 0.3s;
}
.btn-add:hover {
  opacity: 0.6;
}
.btn-add > p {
  color: #fff;
  font-size: 10px;
  margin: 0;
  line-height: 7px;
}
.content {
  padding: 0 30px;
}
.content > label {
  font-size: 12px;
  color: #aaaaaa;
  line-height: 40px;
}
.device-list {
  margin-top: 25px;
  margin-left: -20px;
}
.item-loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 250px;
  height: 345px;
  background-image: url(../../assets/gif/loadingWhite.gif);
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 2;
  background-color: #fff;
  border-radius: 8px;
}
.device-item {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  display: inline-block;
  width: 240px;
  height: 345px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  cursor: default;
  margin-bottom: 20px;
  margin-left: 20px;
}
.device-body {
  padding: 16px 20px 13px 20px;
  color: #888888;
  position: relative;
  > .setting {
    position: absolute;
    border-radius: 50%;
    right: 10px;
    top: 15px;
    cursor: pointer;
    img {
      width: 32px;
      height: 32px;
    }
  }

  > .not-allowed {
    cursor: not-allowed;
  }
  > p {
    margin: 0;
    label {
      font-size: 12px;
      color: #888;
      display: inline-block;
      line-height: 18px;
      max-width: 130px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 500;
    }
  }
  h4 {
    margin: 0;
    font-size: 20px;
    color: #333333;
    display: inline-block;
    max-width: 86%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: all 0.3s;
  }
  h4:hover {
    color: #007ee4;
  }
  .title_p {
    height: 20px;
    position: relative;
    margin-left: 40px;
    > .home-in {
      background-image: url(../../assets/icon/iocn-in.png);
      background-position: 50% 50%;
      width: 34px;
      height: 34px;
      display: inline-block;
      position: absolute;
      bottom: -8px;
      left: -40px;
    }
    > .home-out {
      background-image: url(../../assets/icon/iocn-on.png);
    }
  }
  .tags {
    margin-top: 15px;
    height: 20px;
    position: relative;
    span {
      font-size: 12px;
      // color: #fff;
      padding: 4px 6px;
      margin-bottom: 5px;
      display: inline-block;
      margin-right: 5px;
      line-height: 14px;
      border-radius: 2px;
      height: 20px;
    }
    .lx {
      color: #666;
      background: rgba(85, 85, 85, 0.1);
    }
    .mck {
      color: #ff6767;
      background: rgba(255, 103, 103, 0.1);
    }
    .wtb {
      color: #ffad26;
      background: rgba(255, 173, 38, 0.1);
    }
    .zc {
      background-color: #1e8eea;
    }
  }
  .box {
    display: flex;
    text-align: center;
    background-color: #f3f5f7;
    border-radius: 4px;
    margin-top: 10px;
    > div {
      padding: 5px 0px;
      font-size: 10px;
      line-height: 30px;
      flex: auto;
      position: relative;
      .weight {
        font-size: 12px;
      }
    }
  }
  .info-row {
    font-size: 12px;
    line-height: 28px;
    margin-top: 13px;
    span.mode,
    span.active,
    span.version {
      float: right;
      width: 82px;
      height: 20px;
      overflow: hidden;
      padding: 0 0px 0 5px;
      line-height: 20px;
      margin-top: 5px;
    }
    span.simNO {
      display: inline-block;
      width: 60px;
    }
    .mode {
      color: #b6b6b6;
      border: 1px solid #e0e2e8;
      border-radius: 2px;
      font-size: 12px;
      line-height: 20px;
      cursor: pointer;
      text-align: left;
    }
    .active {
      color: #0087ea;
      border: 1px solid #0087ea;
      border-radius: 2px;
      font-size: 12px;
      line-height: 20px;
      cursor: pointer;
      text-align: left;
    }
  }
}
.device-footer {
  border-top: 1px solid #e6e9ed;
  display: flex;
  > div {
    flex: auto;
    color: #333333;
    text-align: center;
    font-size: 12px;
    line-height: 44px;
    position: relative;
    cursor: pointer;
  }
}
.iconfont {
  margin-right: 5px;
  font-size: 10px;
}
.icon-genghuan {
  color: #1e8eea;
}
.icon-shanchu {
  color: #ff6767;
}
.box.wtb {
  background-color: #ffad26;
  color: #fff;
  cursor: pointer;
}
/deep/.el-divider__text {
  background-color: #f0f2f5;
}
.divider {
  font-size: 14px;
  color: #888888;
}

// .jdClass{
//   padding-top: 28px;
// }
/deep/.el-form-item--medium .el-form-item__label {
  padding-top: 10px;
  width: auto;
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
.doorDeviceClass {
  max-width: 159px;
  display: inline-block;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  line-height: 13px;
  height: 10px;
}
.doorDeviceClass_i {
  cursor: pointer;
  margin-left: 5px;
  margin-right: 0px;
}
</style>

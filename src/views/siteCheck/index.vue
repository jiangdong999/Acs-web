<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">当前：{{BangSiteVal}}</span>
            <span
              class="control-left list-title list-class"
              v-if="bindingFlag"
              @click="binding"
            >绑定场地</span>
            <span class="control-left list-title list-class" v-else @click="Unbinding">解除绑定</span>
            <span class="control-right" v-show="DeviceFlag">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form inline :model="searchForm" ref="searchForm">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <el-form-item label="签到时间">
                          <el-col :span="12" style="padding-left:0px">
                            <el-date-picker
                              v-model="searchForm.startTime"
                              type="datetime"
                              placeholder="开始时间"
                              clearable
                              value-format="yyyyMMddHHmmssSSS"
                              style="width:170px"
                              class="dateClass"
                            ></el-date-picker>
                          </el-col>
                          <el-col :span="12">
                            <el-date-picker
                              v-model="searchForm.endTime"
                              type="datetime"
                              placeholder="结束时间"
                              clearable
                              value-format="yyyyMMddHHmmssSSS"
                              style="width:170px"
                              class="dateClass"
                            ></el-date-picker>
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="住户姓名" prop="realName">
                          <el-input placeholder="请输入" clearable v-model="searchForm.realName" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="身份证号" prop="cardNo">
                          <el-input
                            placeholder="请输入"
                            clearable
                            :maxlength="18"
                            v-model="searchForm.cardNo"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="健康宝状态" prop="healthState">
                          <el-select v-model="searchForm.healthState" placeholder="请选择" clearable>
                            <el-option
                              v-for="item in healthStateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :span="12">
                        <el-form-item label="会员卡号" prop="phone">
                          <el-input placeholder="请输入" clearable v-model="searchForm.phone" />
                        </el-form-item>
                      </el-col>-->
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="设备备注" prop="deviceName">
                          <el-input placeholder="请输入" clearable v-model="searchForm.deviceName" />
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
            <span class="jdclass_refurbish daochuBtn" @click="exportClick" v-show="DeviceFlag">
              <img src="../../assets/image/daochu.png" alt /> 导出
            </span>
          </div>
          <div class="appCont" v-show="DeviceFlag">
            <div class="nav">
              <el-row>
                <el-col :span="3">
                  <div
                    class="appCont_bg"
                    :class="{appCont_active:moneyShow == 'all'}"
                    style="width: 94%;"
                    @click="allTotal"
                  >
                    <b>全部签到</b>
                    <span>{{totalNum}}</span>
                  </div>
                </el-col>
                <el-col :span="21">
                  <div class="appCont_btn_left" @click="btnLeft">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div class="appCont_list">
                    <div
                      class="appCont_div"
                      :style="{marginLeft: magNum+'%',width:deviceListNum+'%'}"
                    >
                      <div
                        class="appCont_bg appCont_item"
                        :class="{appCont_active:moneyShow == item.deviceSn}"
                        v-for="(item,index) in deviceList"
                        :key="index"
                        @click="deviceListClick(item.deviceSn)"
                        :style="{width:deviceItemWidth+'%'}"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="item.deviceName"
                          placement="top"
                        >
                          <b>{{item.deviceName}}</b>
                        </el-tooltip>
                        <span>{{item.num}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="appCont_btn_right" @click="btnRight">
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
      <div
        class="table-container"
        v-loading="loading"
        v-show="DeviceFlag"
        style="padding-top: 10px;"
      >
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column type="index" :index="indexMethod" width="60" label="序号"></el-table-column>
            <el-table-column prop="realName" min-width="60" label="姓名"></el-table-column>
            <el-table-column prop="cardNo" min-width="150" label="身份证号"></el-table-column>
            <el-table-column prop="icCard" min-width="80" label="IC卡号"></el-table-column>
            <el-table-column prop="checkType" min-width="80" label="签到类型">
              <template slot-scope="scope">
                <span v-if="scope.row.checkType=='1'">身份证</span>
                <span v-else-if="scope.row.checkType=='2'">IC卡</span>
                <span v-else></span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="cardNo" min-width="80" label="会员卡号"></el-table-column> -->
            <el-table-column prop="deviceName" min-width="80" label="备注"></el-table-column>
            <el-table-column prop="temperature" min-width="80" label="体温"></el-table-column>
            <el-table-column prop="imageUrl" min-width="100" label="人脸照片">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.imageUrl"
                  fit="scale-down"
                  class="pic-col"
                  v-if="scope.row.imageUrl != '' && scope.row.imageUrl != undefined"
                  :preview-src-list="[scope.row.imageUrl]"
                >
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="healthState" min-width="100" label="健康宝状态">
              <template slot-scope="scope">
                <span v-if="scope.row.healthState=='正常'">{{scope.row.healthState}}</span>
                <span v-else style="color:#FF5555">{{scope.row.healthState}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applyTime" min-width="150" label="签到时间">
              <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
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
      <div class="UnDevice" v-show="UnDeviceFlag">
        <img src="../../assets/image/DeviceImg@2x.png" alt />
        <p>请先绑定场地</p>
      </div>
    </div>

    <el-dialog title="绑定场地" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <p style="font-size:20px;font-weight:500;text-align: left;color: #333333;">请输入场地编号</p>
        <p style="text-align: left;">
          <el-input
            placeholder="请输入"
            type="text"
            v-model="searchForm.SiteNumber"
            @blur.prevent="onBlurClick"
            style="font-size:14px;color: #999;"
          ></el-input>
        </p>
        <p style="font-size:14px;font-weight:500;color:#333;text-align: left;">场地备注：{{siteVal}}</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="解除场地" width="400px" :visible.sync="UnDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
        <p style="font-size:20px;font-weight:500;color:#343e4c">确定解除绑定？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="UnDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导出数据" width="500px" :visible.sync="exportFlag">
      <div style="text-align:center;margin-bottom:40px">
        <p style="font-size:20px;font-weight:500;text-align: left;color: #333333;">请选择要导出数据时间段</p>
        <p style="overflow: hidden;">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="开始时间"
            clearable
            value-format="yyyyMMddHHmmssSSS"
            style="width:180px;float:left"
            class="dateClass"
          ></el-date-picker>

          <span style="width:40px;text-align:center;line-height:35px;float:left">至</span>
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="结束时间"
            clearable
            value-format="yyyyMMddHHmmssSSS"
            style="width:180px;float:left"
            class="dateClass"
          ></el-date-picker>
        </p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="exportFlag=false">取消</el-button>
        <el-button type="primary" @click="exportSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  accountInfo,
  accountAdd2,
  accountUnbind,
  accountLocation,
  logList2,
  logCountTotal,
  logCountEach,
  excelExport,
} from "@/api/health";
import { formatDateTime } from "@/filters/index";
import { healthStateOptions } from "@/utils/role";
import mixin from "@/utils/mixin";
export default {
  mixins: [mixin],
  filters: {
    formatDateTime,
  },
  data() {
    return {
      DeviceFlag: false,
      UnDeviceFlag: true,
      moneyShow: "all",
      exportFlag: false,
      totalNum: "---", //签到数量
      bindingFlag: true,
      healthStateOptions: [], //健康宝状态
      siteVal: "", //场地备注
      BangSiteVal: "未绑定场地", //场地备注
      showDelDiglogFlag: false, //绑定
      UnDelDiglogFlag: false, //解除
      magNum: null,
      num: 0,
      deviceItemWidth: 0,
      deviceListLen: 0, //长度
      deviceListNum: 0, //长度总和
      deviceList: [], //各个场地的名称
      searchForm: {
        // phone: "",

        realName: "", //姓名
        cardNo: "", //身份证号
        temperature: "", //体温
        statusId: "1", //表格类型
        healthState: "", //健康宝状态
        barCode: "", //条形码
        deviceSn: "", //当前的设备名字
        applyTime: "",
        startTime: "", //时间段开始
        endTime: "", //时间段结束
        username: "", //绑定用户
        deviceName: "", //备注
        createTime: "", //签到时间
        SiteNumber: "", //场地编号
        icCard:"",//IC卡号
        checkType:"",//签到类型
        siteId: null, //场地标识
      },
    };
  },
  watch: {
    exportFlag: function (val) {
      if (val == false) {
        this.searchForm.startTime = "";
        this.searchForm.endTime = "";
      }
    },
  },
  methods: {
    //点击绑定场地 显示弹窗
    binding() {
      this.showDelDiglogFlag = true;
      this.searchForm.SiteNumber = "";
      this.siteVal = "";
    },
    //绑定场地 失去焦点时触发
    onBlurClick() {
      let self = this;
      if (self.searchForm.SiteNumber != "") {
        self.searchForm.siteId = self.searchForm.SiteNumber;
        self.accountLocationFun();
      } else {
        self.siteVal = "";
        self.$message({
          message: "请输入场地编号",
          type: "warning",
        });
      }
    },
    accountLocationFun() {
      let self = this;
      let obj = {
        siteId: self.searchForm.siteId,
      };
      accountLocation(obj)
        .then(function (response) {
          if (response && response.data.code === 1) {
            if (Object.keys(response.data.data).length === 0) {
              self.$message({
                message: "未找到对应的场地",
                type: "warning",
              });
              self.loading = false;
              self.siteVal = "";
              self.BangSiteVal = "未绑定场地";
            } else {
              self.siteVal = response.data.data.siteName;
            }
          }
        })
        .catch(function (a) {
          // console.error(a);
        });
    },
    //只获取场地名称
    accountLocationFunNew() {
      let self = this;
      let obj = {
        siteId: self.searchForm.siteId,
      };
      accountLocation(obj)
        .then(function (response) {
          if (response && response.data.code === 1) {
            if (Object.keys(response.data.data).length === 0) {
              self.$message({
                message: "未找到对应的场地",
                type: "warning",
              });
              self.loading = false;
              self.siteVal = "";
              self.BangSiteVal = "未绑定场地";
            } else {
              self.BangSiteVal = response.data.data.siteName;
            }
          }
        })
        .catch(function (a) {
          // console.error(a);
        });
    },
    //点击确定绑定场地
    confirmClick() {
      let self = this;
      if (self.searchForm.SiteNumber != "") {
        let obj = {
          siteId: self.searchForm.siteId,
        };
        accountLocation(obj)
          .then(function (response) {
            if (response && response.data.code === 1) {
              if (Object.keys(response.data.data).length === 0) {
                self.$message({
                  message: "未找到对应的场地",
                  type: "warning",
                });
                self.loading = false;
                self.siteVal = "";
                self.BangSiteVal = "未绑定场地";
              } else {
                self.siteVal = response.data.data.siteName;

                let userName = self.$store.state.user.userName;
                let objnew = {
                  siteId: self.searchForm.SiteNumber,
                  username: userName,
                };
                accountAdd2(objnew)
                  .then(function (response) {
                    if (response && response.data.code === 1) {
                      self.$message({
                        message: "绑定成功",
                        type: "success",
                      });
                      self.searchForm.siteId = response.data.data.siteId;
                      self.BangSiteVal = self.siteVal;
                      self.searchForm.deviceSn = "";
                      self.moneyShow = "all";

                      self.UnDeviceFlag = false;
                      self.DeviceFlag = true;
                      //初始化tab切换
                      self.num = 0;
                      self.magNum = 0;

                      self.loadData();
                      self.logCount();
                      self.logCountNum();
                      self.accountLocationFunNew();
                    }
                  })
                  .catch(function (a) {
                    // console.error(a);
                  });

                self.BangSiteVal = self.siteVal;
                self.showDelDiglogFlag = false;
                self.bindingFlag = false;
              }
            }
          })
          .catch(function (a) {
            // console.error(a);
          });
      } else {
        self.$message({
          message: "场地编号不能为空",
          type: "warning",
        });
      }
    },
    //解除绑定弹层
    Unbinding() {
      this.UnDelDiglogFlag = true;
    },
    //点击解除绑定场地
    handleSubmit() {
      let self = this;
      let userName = this.$store.state.user.userName;
      self.loading = true;
      let obj = {
        username: userName,
      };
      accountUnbind(obj)
        .then(function (response) {
          if (response && response.data.code === 1) {
            self.BangSiteVal = "未绑定场地";
            self.bindingFlag = true;
            self.UnDelDiglogFlag = false;
            self.loading = false;

            self.UnDeviceFlag = true;
            self.DeviceFlag = false;

            self.searchForm.siteId = "";

            //初始化tab切换
            self.num = 0;
            self.magNum = 0;

            self.searchForm.startTime = ""; //时间段开始
            self.searchForm.endTime = ""; //时间段结束
            self.searchForm.realName = "";
            self.searchForm.cardNo = "";
            self.searchForm.healthState = "";
            self.searchForm.deviceName = "";

            self.deviceList = [];
            self.tableData = [];
          }
        })
        .catch(function (a) {
          // console.error(a);
        });
    },
    btnLeft() {
      let listLen = this.deviceList.length;
      let mathNum = Math.ceil(listLen / 5);
      this.num--;
      if (this.num <= mathNum && this.num >= 0) {
        // this.magNum = -800 * this.num;
        this.magNum = -100 * this.num;
      } else {
        this.num = 0;
      }
    },
    btnRight() {
      let listLen = this.deviceList.length; //8
      let mathNum = Math.ceil(listLen / 5); //2
      this.num++;
      if (this.num < mathNum) {
        // this.magNum = -800 * this.num;
        this.magNum = -100 * this.num;
      } else {
        this.num = mathNum - 1;
      }
    },
    //重置
    handleReset: function () {
      this.$refs.searchForm.resetFields();
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
      this.loadData();
      this.logCount();
      this.logCountNum();
      this.accountLocationFunNew();
    },
    loadData: function (offset = 0, limit = 10) {
      let self = this;
      self.loading = true;
      let listObj = {
        offset: offset,
        limit: limit,
      };
      logList2({ ...self.searchForm, ...listObj })
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset == 0 && self.pageReset();
          }
        })
        .catch(function (a) {
          console.error(a);
        });
      self.logCount();
      self.logCountNum();
      self.accountLocationFunNew();
    },
    //签到数量
    logCount() {
      let self = this;
      logCountTotal({ ...self.searchForm })
        .then(function (response) {
          if (response && response.data.code === 1) {
            self.totalNum = response.data.data.total;
          }
        })
        .catch(function (a) {
          // console.error(a);
        });
    },
    //各个场地的数量及名称
    logCountNum() {
      let self = this;
      logCountEach({ ...self.searchForm })
        .then(function (response) {
          if (response && response.data.code === 1) {
            self.deviceList = response.data.data;
            self.deviceListLen = self.deviceList.length;
            self.deviceListNum = 20 * self.deviceListLen;
            self.deviceItemWidth = 100 / self.deviceListLen - 0.5;
          }
        })
        .catch(function (a) {
          // console.error(a);
        });
    },
    //显示导出数据弹层
    exportClick() {
      this.exportFlag = true;
      this.searchForm.startTime = "";
      this.searchForm.endTime = "";
    },
    //导出数据
    exportSubmit() {
      let self = this;
      if (self.searchForm.startTime != "" && self.searchForm.endTime != "") {
        excelExport({ ...this.searchForm })
          .then(function (response) {
            if (response && response.data.code === 1) {
              if (
                response.data.data != "" ||
                response.data.data != null ||
                response.data.data != undefined
              ) {
                self.$message({
                  message: "导出成功",
                  type: "success",
                });
                window.open(response.data.data);
                self.exportFlag = false;
              }
            }
          })
          .catch(function (a) {
            console.error(a);
          });
      } else {
        this.$message({
          message: "日期不为空",
          type: "warning",
        });
      }
    },
    //点击其他场地
    deviceListClick(deviceVal) {
      this.moneyShow = deviceVal;
      this.searchForm.deviceSn = deviceVal;
      this.accountFun();
    },
    //点击全部签到
    allTotal() {
      this.searchForm.deviceSn = "";
      this.moneyShow = "all";
      this.accountFun();
    },
    accountFun() {
      let self = this;
      let userName = this.$store.state.user.userName;
      self.loading = true;
      let obj = {
        username: userName,
      };
      accountInfo(obj)
        .then(function (response) {
          if (response && response.data.code === 1) {
            self.searchForm.siteId = response.data.data.siteId;

            if (self.searchForm.siteId == "") {
              self.$message({
                message: "当前场地不能为空,请先绑定",
                type: "warning",
              });
              self.UnDeviceFlag = true;
              self.DeviceFlag = false;
              return false;
            }
            self.UnDeviceFlag = false;
            self.DeviceFlag = true;

            self.bindingFlag = false;

            self.loadData();
            self.logCount();
            self.logCountNum();
            self.accountLocationFunNew();
          }
        })
        .catch(function (a) {
          // console.error(a);
        });
    },
  },
  mounted() {
    this.healthStateOptions = healthStateOptions;
    this.accountFun();
  },
};
</script>

<style lang="scss" scoped>
.list-class {
  width: 84px;
  height: 26px;
  border: 1px solid #007ee4;
  border-radius: 13px;
  color: #007ee4;
  line-height: 26px;
  text-align: center;
  font-size: 14px;
  padding: 2px 8px;
  cursor: pointer;
}
.appCont {
  height: auto;
  padding: 15px 30px;
  background: #fff;
  .appCont_bg {
    // width: 150px;
    height: 70px;
    background: #f0f2f5;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    float: left;
    b {
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      line-height: 20px;
      display: inline-block;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
      width: auto;
    }
    span {
      height: 28px;
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      line-height: 28px;
      display: block;
      color: #333333;
    }
    &:hover {
      background: #ffffff;
      box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }
  .appCont_item {
    // width:16%;
    float: left;
    margin-right: 0.5%;
    cursor: pointer;
    &:hover {
      background: #ffffff;
      box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }
  .appCont_list {
    // width: 800px;
    width: 92%;
    height: 80px;
    float: left;
    overflow: hidden;
    .appCont_div {
      // width: max-content;
      height: 80px;
      transition: all 0.5s;
    }
  }
  .appCont_active {
    background: #007ee4;
    b {
      color: #fff;
    }
    span {
      color: #fff;
    }
    &:hover {
      background: #007ee4;
      box-shadow: none;
    }
  }
  .appCont_btn_left {
    width: 3%;
    height: 70px;
    background: #f0f2f5;
    border-radius: 4px;
    float: left;
    text-align: center;
    line-height: 70px;
    margin-right: 1%;
    cursor: pointer;
    i {
      color: #b6b4b4;
      font-weight: 900;
    }
    &:hover {
      background: #ffffff;
      box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
      i {
        color: #007ee4;
      }
    }
  }
  .appCont_btn_right {
    width: 3%;
    height: 70px;
    background: #f0f2f5;
    border-radius: 4px;
    float: right;
    text-align: center;
    line-height: 70px;
    cursor: pointer;
    color: #666666;
    margin-left: 1%;
    i {
      color: #b6b4b4;
      font-weight: 900;
    }
    &:hover {
      background: #ffffff;
      box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.1);
      i {
        color: #007ee4;
      }
    }
  }
}
.daochuBtn {
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #007ee4;
  margin-top: 4px;
  width: 77px;
  margin-right: 16px;
  line-height: 30px;
  height: 30px;
  padding-right: 19px;
  border: none;
  border-right: 1px solid #ccc;
  img {
    width: 20px;
    height: 20px;
    display: block;
    float: left;
    margin-top: 3px;
    margin-right: 5px;
  }
}
.UnDevice {
  width: 100%;
  height: 800px;
  margin: 0px auto 0;
  background: #fff;
  padding-top: 150px;
  img {
    width: 182px;
    height: 182px;
    display: block;
    text-align: center;
    margin: 0 auto;
  }
  p {
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    color: #999999;
    margin-top: 20px;
  }
}
.dateClass /deep/ .el-input__prefix {
  font-size: 0px;
}
.dateClass /deep/ .el-input__inner {
  padding-left: 10px;
}
</style>
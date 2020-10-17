<template>
  <div @click="showDialog=false">
    <el-form ref="form" :rules="rules" :model="form" label-position="top" label-width="150px">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="小区名称" prop="communityName">
            <el-input v-model="form.communityName" :maxlength="20" clearable placeholder="请输入小区名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="行政区划" prop="zoningCode">
            <location-picker :locationCode.sync="form.zoningCode" class="locationPicker" style />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="16">
          <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" :maxlength="50" clearable placeholder="请输入详细地址" />
            <el-popover
              popper-class="amap"
              placement="right"
              title="获取经纬度"
              trigger="manual"
              v-model="showDialog"
              width="600"
            >
              <div class="amap-box" v-if="showDialog" v-loading="mapLoading">
                <el-amap ref="map" :vid="'amap-new'" :plugin="[{pName:'Scale'}]" :events="events"></el-amap>
                <div class="amap-btns">
                  <el-button class="btn" @click="showDialog=false">返回</el-button>
                  <el-button type="primary" class="btn" @click="submitMarker()">确定</el-button>
                </div>
              </div>
              <el-button
                style="margin-left:30px"
                type="primary"
                slot="reference"
                @click.stop="vaildateAddress(form.address)"
                :disabled="showDialog"
              >获取经纬度</el-button>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="小区经纬度" prop="longitude">
            <div class="tips">经度：{{form.longitude}} 纬度：{{form.latitude}}</div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="建筑用途" prop="buildingUse">
            <el-select v-model="form.buildingUse" filterable placeholder="请选择" clearable>
              <el-option
                v-for="item in buildingTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="管理处负责人" prop="contact">
            <el-input v-model="form.contact" :maxlength="20" clearable placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人手机号码" prop="phone">
            <el-input
              v-model="form.phone"
              @input="form.phone=form.phone.replace(/\D+/g,'')"
              type="text"
              clearable
              :maxlength="11"
              auto-complete="new-password"
              placeholder="请输入负责人手机号码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客服座机号码" prop="fixedPhone">
            <el-input
              v-model="form.fixedPhone"
              @input="form.fixedPhone=form.fixedPhone.replace(/[^0-9-]+/,'')"
              type="text"
              clearable
              :maxlength="13"
              auto-complete="new-password"
              placeholder="请输入客服座机号码"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="设置密码" prop="password">
        <el-input type="password" :maxlength="16" clearable v-model="form.password" placeholder="请输入密码" auto-complete="off"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input type="password" :maxlength="16" clearable v-model="form.passwordConfirm" placeholder="请再次输入密码进行确认" auto-complete="off"/>
      </el-form-item>-->
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { generateAccount } from "@/api/community";
import { saveCommunity } from "@/api/communityv1";
import locationPicker from "@/components/locationPicker/locationPicker.vue";
import {
  validateMobile,
  validatePositiveNumber,
  validateNumberAndLetter,
} from "@/utils/rules";

let geocoder;
let marker;
let InfoWindow;
let markerInfo = {
  location: [],
  address: "",
};

export default {
  name: "community-form",
  components: {
    locationPicker,
  },
  data() {
    const passwordCheck = (rule, value, callback) => {
      let password = this.form.password;
      if (password) {
        if (this.form.passwordConfirm !== password) {
          callback(new Error("输入的两个密码不一致，请检查"));
          return;
        }
      }
      callback();
    };
    const validateZoningCode = (rule, value, callback) => {
      if (value.length < 12) {
        callback(new Error("请选择完整行政区划"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      showDialog: false,
      mapLoading: false,
      form: {
        communityName: "",
        buildingCount: "",
        contact: "",
        zoningCode: "",
        address: "",
        phone: "",
        buildingUse: "",
        longitude: null,
        latitude: null,
      },
      buildingTypeOptions: [
        { value: '1', label: "住宅" },
        { value: '2', label: "企事业单位" },
        { value: '3', label: "学校" },
        { value: '4', label: "商场" },
        { value: '5', label: "MSD" },
        { value: '6', label: "CBD" },
        { value: '7', label: "政府机关" },
        { value: '8', label: "科研单位" },
        { value: '9', label: "其他" },
      ],
      rules: {
        longitude: [
          { required: true, message: "请获取经纬度", trigger: "blur" },
        ],
        communityAccount: [
          { required: true, message: "请输入小区帐号", trigger: "blur" },
        ],
        communityName: [
          { required: true, message: "请输入小区名称", trigger: "blur" },
        ],
        zoningCode: [
          { required: true, message: "请选择行政区划", trigger: "blur" },
          {
            validator: validateZoningCode,
            message: "请选择完整行政区划",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "请输入正确地址", trigger: "blur" },
        ],
        buildingUse: [
          { required: true, message: "请选择建筑用途", trigger: "change" },
        ],
        contact: [
          { required: true, message: "请输入管理处负责人", trigger: "blur" },
        ],
        phone: [
          {
            required: true,
            message: "请输入管理处负责人手机号码",
            trigger: "blur",
          },
        ],
        buildingCount: [
          { required: true, message: "请输入楼栋数量", trigger: "blur" },
          {
            message: "请输入正确的数字，不能输入其他字符",
            validator: validatePositiveNumber,
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码位数不能低于6位", trigger: "blur" },
          { max: 16, message: "密码位数不能多于16位", trigger: "blur" },
          { validator: validateNumberAndLetter, message: "请填写正确密码" },
        ],
        passwordConfirm: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: passwordCheck, trigger: "blur" },
        ],
      },
      districtOptions: [],
      events: {
        complete: () => {
          this.getLocation(this.form.address);
        },
        click: (ev) => {
          // 触发事件的地理坐标，AMap.LngLat 类型
          var lnglat = ev.lnglat;

          this.getAddress(lnglat);
        },
      },
    };
  },
  methods: {
    initAccount: function () {
      let self = this;
      if (!self.editMode) {
        return generateAccount()
          .then(function (response) {
            if (response && response.data) {
              self.form.communityAccount = response.data.data.communityAccount;
            }
          })
          .catch(function (a) {
            console.error(a);
          });
      }
    },
    handleClose: function () {
      this.$parent.handleClose();
    },
    submitMarker() {
      this.form.longitude = markerInfo.location[0];
      this.form.latitude = markerInfo.location[1];
      this.form.address = markerInfo.address;
      this.showDialog = false;
    },
    handleSubmit: function (formName) {
      let self = this;
      // if(!self.form.longitude || !self.form.latitude){
      //   self.$message({
      //     message: '请获取并确认小区经纬度',
      //     type: 'warning'
      //   });
      //   return
      // }
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true;
          saveCommunity(self.form)
            .then(function (response) {
              if (response.data && response.data.status === 0) {
                self.$message({
                  message: "提交成功",
                  type: "success",
                });
                self.$store.dispatch("getCommunity");
                self.$emit("close");
              }
            })
            .catch(function (a) {
              console.error(a);
            })
            .finally((_) => {
              self.loading = false;
            });
        } else {
          // console.log("error submit!!");
        }
      });
    },
    vaildateAddress(address) {
      if (address == "" || address.length == 0) {
        this.$message({
          message: "请先输入小区详细地址",
          type: "warning",
        });
        return;
      }
      this.showDialog = true;
    },
    getLocation() {
      this.$nextTick(() => {
        let self = this;
        self.mapLoading = true;
        // 逆向地理编码方法
        AMap.plugin("AMap.Geocoder", function () {
          var geocoder = new AMap.Geocoder({
            city: "全国", //城市设为北京，默认：“全国”
          });
          geocoder.getLocation(self.form.address, function (status, result) {
            if (status === "complete" && result.geocodes.length) {
              let targetData = result.geocodes[0];
              self.setMarker(targetData.location, targetData.formattedAddress);
            } else {
              self.$message({
                message: "查询位置失败，请尝试填写更具体地址",
                type: "warning",
              });
            }
            self.mapLoading = false;
          });
        });
      });
    },
    getAddress(lnglat) {
      let self = this;
      // 逆向地理编码方法
      AMap.plugin("AMap.Geocoder", function () {
        var geocoder = new AMap.Geocoder({
          city: "全国",
        });
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === "complete" && result.info === "OK") {
            // result为对应的地理位置详细信息
            self.setMarker(lnglat, result.regeocode.formattedAddress);
          }
        });
      });
    },
    setMarker(location, address) {
      let self = this;
      let map = self.$refs.map.$$getInstance();
      map.clearMap();

      marker = new AMap.Marker({
        map: map,
        position: location,
        draggable: true,
        cursor: "move",
        raiseOnDrag: true,
      });

      InfoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        offset: new AMap.Pixel(0, 0),
        visible: true,
        content: `<div class="info-window">
                      地址：${address} <br>
                      经纬度：${location.getLng()}, ${location.getLat()}
                    </div>`,
      });
      InfoWindow.open(map, location);
      map.setFitView();

      markerInfo.location = [location.getLng(), location.getLat()];
      markerInfo.address = address;
    },
  },
  mounted() {
    this.initAccount();
  },
};
</script>
<style lang="scss" scoped>
.locationPicker {
  width: 720px;
  font-size: 0; //行内元素间距去除
}

.locationPicker /deep/.loc-item {
  margin-right: 30px;
  margin-bottom: 9px;
}

.amap-box {
  height: 570px;
  border: 1px solid #4fd3d1;
  position: relative;
  margin-bottom: 20px;
}
.amap-btns {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
.btn {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

</style>
<style lang="">
  .amap .el-popover__title{
    padding-top: 20px;
  }
</style>

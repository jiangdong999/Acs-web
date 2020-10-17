<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-position="top">
      <div class="module-title">房屋设置</div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="房屋位置">
            <el-input :value="roomLabel" disabled placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="roomArea">
          <el-form-item label="建筑面积" prop="roomArea">
            <el-input-number
              v-model="form.roomArea"
              :precision="1"
              :step="10"
              :min="0.1"
              :max="9999"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="房屋户型" prop="houseType" class="houseType">
            <el-select
              v-model="form.houseType"
              :maxlength="20"
              filterable
              placeholder="若为其他户型可直接输入并选择"
              allow-create
              default-first-option
              clearable
            >
              <el-option label="1室1厅" value="1室1厅"></el-option>
              <el-option label="2室1厅" value="2室1厅"></el-option>
              <el-option label="2室2厅" value="2室2厅"></el-option>
              <el-option label="3室2厅" value="3室2厅"></el-option>
              <el-option label="4室2厅" value="4室2厅"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房屋用途" prop="roomUse">
            <el-select
              v-model="form.roomUse"
              :maxlength="20"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in roomUseTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="使用状态" prop="roomUseStatus">
        <el-radio-group v-model="form.roomUseStatus">
          <el-radio :label="1">空置</el-radio>
          <el-radio :label="2">自住</el-radio>
          <el-radio :label="3">租住</el-radio>
          <el-radio :label="4">借住</el-radio>
          <el-radio :label="5">未办理</el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-row class="roomProperty">
        <el-form-item prop="roomProperty">
          <span>房产性质</span>
          <el-radio-group v-model="form.roomProperty">
            <el-radio :label="1">商品房</el-radio>
            <el-radio :label="2">经适房</el-radio>
            <el-radio :label="3">房改房</el-radio>
            <el-radio :label="4">其他</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <div class="module-title">电话开门号码设置</div>
      <!--      <el-form-item label="电话开门状态" prop="houseType">-->
      <!--      </el-form-item>-->
      <el-row>
        <el-form-item label="电话开门号码" prop="timeoutCallNumber">
          <el-input
            v-model="form.timeoutCallNumber"
            clearable
            placeholder="请输入座机号或手机号"
            maxlength="11"
            :disabled="isPhone"
            style="margin-right:20px"
          />
          <el-switch
            v-model="form.pstnStatus"
            active-value="1"
            inactive-value="0"
            @change="chgPstnStatus"
            :active-text="statusText"
          ></el-switch>
        </el-form-item>
      </el-row>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { modifyRoom } from "@/api/room";
import { validateDecimalsNumber, validateNumber } from "@/utils/rules";
import { mapGetters } from "vuex";

export default {
  name: "room-form",
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapGetters(["community"]),
    roomLabel() {
      let list = [];
      if (this.form.buildingNo) list.push(this.form.buildingNo);
      if (this.form.unitNo) list.push(this.form.unitNo);
      if (this.form.floorNo) list.push(this.form.floorNo);
      if (this.form.roomName) list.push(this.form.roomName);
      return list.join("/");
    },
    statusText() {
      return this.form.pstnStatus == "1" ? "已开启" : "已禁用";
    },
  },
  data() {
    return {
      loading: false,
      isPhone: false,
      form: {
        buildingNo: "",
        unitNo: "",
        floorNo: "",
        roomName: "",
        roomArea: 10,
        houseType: "",
        roomUse: "",
        roomUseStatus: "",
        roomProperty: "",
        pstnStatus: "",
        timeoutCallNumber: "",
      },
      roomUseTypeOptions: [
        { value: 1, label: "住宅" },
        { value: 2, label: "工业" },
        { value: 3, label: "商业" },
        { value: 4, label: "仓库" },
        { value: 5, label: "办公" },
        { value: 6, label: "商住混用" },
        { value: 7, label: "其他" },
      ],
      rules: {
        roomArea: [
          { message: "请输入正确的数字", validator: validateDecimalsNumber },
        ],
        timeoutCallNumber: [
          { required: false, message: "请输入电话开门号码", trigger: "blur" },
          { max: 11, message: "请填入正确的电话开门号码" },
          { message: "请输入正确的数字", validator: validateNumber },
        ],
      },
    };
  },
  methods: {
    chgPstnStatus(status) {
      let _this = this;
      // _this.isPhone = !_this.isPhone
      if (status === "1") {
        _this.rules.timeoutCallNumber[0].required = true;
      } else {
        _this.rules.timeoutCallNumber[0].required = false;
        _this.$refs.form.validateField("timeoutCallNumber");
      }
    },
    handleSubmit: function (formName) {
      let self = this;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true;
          modifyRoom({ ...self.form, ...self.community })
            .then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: "提交成功",
                  type: "success",
                });
                self.$parent.$parent.handleClose();
              }
            })
            .catch(function (a) {
              console.error(a);
            })
            .finally((_) => {
              self.loading = false;
            });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose: function () {
      this.$parent.handleClose();
    },
  },
  mounted() {
    if (this.data) {
      this.form = Object.assign(this.form, this.data);
      // 面积
      if (this.form.roomArea == -1) {
        this.form.roomArea = "";
      }
      // 用途
      if (this.form.roomUse == -1) {
        this.form.roomUse = "";
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.module-title {
  top: 2px;
  line-height: 18px;
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 500;
}

.module-title:before {
  content: "";
  display: inline-block;
  width: 2px;
  height: 18px;
  background-color: #007ee4;
  margin-right: 10px;
  position: relative;
  top: 2px;
}
.roomArea /deep/.el-input-number__increase {
  right: -9px;
}
.roomProperty span {
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  text-align: left;
  color: #333333;
  line-height: 16px;
  margin-right: 20px;
}
.form-dialog-control-area /deep/.el-button--medium{
  padding: 10px 30px;
}
</style>

<template>
  <div class="devide">
    <div class="name">{{data.householdName}}</div>
    <el-row class="info">
      <el-col :span="9">
        房间地址
        <p style="font-size:13px">{{data.fullNodeName || roomData.fullNodeName}}</p>
      </el-col>
      <el-col :span="15">
        身份证号码
        <p>{{data.citizenId}}</p>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="form" label-position="top" :rules="formRules" ref="form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="隔离类型" prop="personnelType">
            <el-select v-model="form.personnelType" filterable placeholder="请选择">
              <el-option value="1" label="返程隔离" />
              <el-option value="2" label="密接隔离" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.personnelType=='1'" :span="12">
          <el-form-item label="返程地点" prop="provinceCode">
            <el-cascader
              clearable
              v-model="address"
              :options="options"
              @active-item-change="handleItemChange($event)"
              @change="selectNode"
              :props="props"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col v-if="form.personnelType=='2'" class="devide-date" :span="12">
          <el-form-item label="开始日期" prop="quarantineDate">
            <el-date-picker
              v-model="form.quarantineDate"
              type="date"
              class="sSize-input-date"
              value-format="yyyyMMdd000000000"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-if="form.personnelType=='2'" :span="12">
          <el-form-item class="tianIcon" label="隔离天数" prop="quarantineTime">
            <el-input
              placeholder="请输入"
              @input="quarantineTimeDeal()"
              maxlength="2"
              v-model="form.quarantineTime"
            >
              <span slot="suffix">天</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.personnelType=='1'" class="devide-date">
          <el-form-item label="返程日期" prop="returnDate">
            <el-date-picker
              v-model="form.returnDate"
              type="date"
              class="sSize-input-date"
              value-format="yyyyMMdd000000000"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="allowOpen">
          <el-form-item label prop="allowOpen">
            <span style="padding-right:20px">门禁权限</span>
            <el-switch
              v-model="form.allowOpen"
              active-value="1"
              inactive-value="0"
              active-color="#6699FF"
              inactive-color="#ff4949"
            ></el-switch>
            <label v-if="form.allowOpen=='1' " style="color:#6699FF">已开启</label>
            <label v-else style="color:#ff4949;">禁用</label>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getLocation } from "@/api/location";
import { devideReport } from "@/api/epidemic";
import dateUtil from "@/utils/times";

export default {
  name: "devide",
  props: ["data","roomData"],
  data() {
    return {
      loading: false,
      form: {
        personnelType: "1",
        quarantineDate: dateUtil.byPattern(new Date(), "YYYYMMDD000000000"),
        quarantineTime: "",
        allowOpen: "0",
        provinceCode: "",
        cityCode: "",
        returnDate: "",
      },
      formRules: {
        provinceCode: [
          { required: true, message: "请选择返程地点", trigger: "change" },
        ],
        returnDate: [
          { required: true, message: "请选择返程日期", trigger: "change" },
        ],
        personnelType: [
          { required: true, message: "请选择隔离类型", trigger: "change" },
        ],
        quarantineDate: [
          { required: true, message: "请选择隔离开始日期", trigger: "change" },
        ],
        quarantineTime: [
          { required: true, message: "请输入隔离天数", trigger: "blur" },
        ],
        allowOpen: [
          { required: true, message: "请选择隔离开始日期", trigger: "change" },
        ],
      },
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
    };
  },
  created() {
    this.initLocation(0, "");
    if (this.data.personnelType == "1") {
      this.form = Object.assign(this.form, this.data);
      this.form.quarantineDate = dateUtil.byPattern(
        new Date(),
        "YYYYMMDD000000000"
      );
    } else if (this.data.personnelType == "2") {
      this.form = Object.assign(this.form, this.data);
      this.form.returnDate = "";
    }
    if (this.form.provinceCode) {
      this.initLocation(1, this.form.provinceCode);
    }
  },
  computed: {
    address: {
      set(arr) {
        this.form.provinceCode = arr[0];
        this.form.cityCode = arr[1];
      },
      get() {
        return this.form.provinceCode
          ? [this.form.provinceCode, this.form.cityCode]
          : [];
      },
    },
  },
  methods: {
    quarantineTimeDeal() {
      if (this.form.quarantineTime == "00" || this.form.quarantineTime == "0") {
        this.form.quarantineTime = "";
      } else {
        this.form.quarantineTime = this.form.quarantineTime.replace(
          /[^0-9]/g,
          ""
        );
      }
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
              self.$forceUpdate();
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
      let code = val.toString();
      this.initLocation(1, code);
    },
    handleSubmit() {
      let self = this;
      this.$refs.form.validate((valid) => {
        // 返程人员
        if (self.form.personnelType == "1") {
          self.form.quarantineDate = "";
          self.form.quarantineTime = "";
        } else if (self.form.personnelType == "2") {
          //隔离人员
          self.form.returnDate = "";
          self.form.provinceCode = "";
          self.form.cityCode = "";
        }
        if (valid) {
          self.loading = true;
          devideReport({
            ...this.form,
            communityId: self.data.communityId,
            householdId: self.data.householdId,
          })
            .then(function (response) {
              self.loading = false;
              if (response.data.code == 1) {
                self.$emit("submitSuccess");
                self.$message({
                  type: "success",
                  message: response.data.message,
                });
              }
            })
            .catch(function (a) {
              self.loading = false;
              console.error(a);
            })
            .finally((_) => {
              self.loading = false;
            });
        }
      });
    },
    //选中级联二级
    selectNode(data) {
      this.form.provinceCode = data[0];
      this.form.cityCode = data[1];
    },
  },
};
</script>
<style lang="scss" scoped>
.devide {
  // height: 410px; 
}
.name {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 20px;
  margin-bottom: 20px;
}
.info {
  background: #f2f5f5;
  border-radius: 4px;
  width: 450px;
  height: 90px;
  // margin-left: 10px;
  padding: 20px 22px;
  margin-bottom: 28px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #666666;
  line-height: 14px;
  p {
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 18px;
  }
  span:nth-of-type(1) {
    margin-right: 30px;
  }
}
.devide-date div.sSize-input-date.el-input {
  width: 200px !important;
}
.allowOpen {
  padding-top: 28px;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 16px;
  padding-left: 15px;
}
.devide-date div.sSize-input-date.el-input{
  width: 210px !important;
}
</style>
<style lang="">
  .tianIcon .el-input__suffix{
    top: 10px;
    right: 10px;
  }
</style>

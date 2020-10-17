<template>
  <div v-loading="loading">
    <el-form ref="form" label-position="top" inline :model="form" :rules="rules">
      <el-row>
          <div class="main_time">
            到期时间
            <span>{{ form.endtime = data.leaseEndTime | yyyyMMddDate}}</span>
          </div>
      </el-row>
      <el-row>
        <el-form-item label="有效时长" prop="renewedDuration">
          <el-select v-model="form.renewedDuration" filterable clearable>
            <el-option value="3" label="三个月" />
            <el-option value="6" label="六个月" />
            <el-option value="12" label="十二个月" />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="有效期至" prop="renewedDetailTime">
          <el-date-picker
            style="width:300px !important"
            v-model.trim="form.renewedDetailTime"
            clearable
            placeholder="YYYY-MM-DD"
            value-format="yyyyMMdd235959000"
            :picker-options="beforePickerOptions2(form.renewedDetailTime)"
          ></el-date-picker>
        </el-form-item>
      </el-row>
      <div class="form-dialog-control-area">
        <el-button @click="$parent.handleClose()">取消</el-button>
        <el-button @click="handleSubmitNew(data)" type="primary">确定</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { renewed } from "@/api/personnel";
import { formatTimeMillisToDate } from "@/filters/index"; //时间戳变成本地日期
import { beforePickerOptions2 } from "@/utils/validate"; //不可选择当日之前日期
import dateUtil from "@/utils/times";

export default {
  props: ["data"],
  data() {
    return {
      loading: false,
      form: {
        endtime: "",
        renewedDuration: "",
        leaseEndTime: "",
        householdId: "",
        communityId: "",
        renewedDetailTime: "",
        nodeId: "-1",
        isStaff: "1", //是否工作人员；1是
      },
      rules: {
        renewedDuration: [{ message: "请选择有效时长", trigger: "change" }],
        renewedDetailTime: [
          //工作有限期至
          { required: true, message: "请输入工作有效期", trigger: "change" },
        ],
      },
    };
  },
  filters: {
    formatTimeMillisToDate: formatTimeMillisToDate, //时间戳转本地日期
    yyyyMMddDate(data) {
      //yyyyMMddHHmmssSSS转本地日期
      if (data == undefined) {
        return "";
      } else {
        var data = data.substring(0, 8);
        var str =
          data.substring(0, 4) +
          "-" +
          data.substring(4, 6) +
          "-" +
          data.substring(6, 8);
        return str;
      }
    },
  },
  //有效时长与有效期至  联动
  watch: {
    "form.renewedDuration": function (val) {
      const date = this.form.endtime
        ? dateUtil.strToTimestamp(this.form.endtime)
        : new Date();
      let newDate = dateUtil.addTimeFormat(val, "M", date).valueOf();
      let dateAll = formatTimeMillisToDate(newDate); //时间戳变成本地日期
      dateAll = dateAll.replace(/-/g, "") + "235959000";
      return (this.form.renewedDetailTime = dateAll);
    },
  },
  methods: {
    beforePickerOptions2, //不可选择当日之前日期
    handleSubmitNew(data) {
      let self = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          self.loading = true;
          self.form.householdId = data.householdId;
          self.form.communityId = data.communityId;
          if (data.leaseEndTime == undefined) {
            self.form.leaseEndTime = "";
          } else {
            self.form.leaseEndTime = data.leaseEndTime;
          }
          let datanew = { ...this.form };
          renewed(datanew)
            .then((response) => {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: "提交成功",
                  type: "success",
                });
                self.$parent.$parent.handleClose();
              } else {
                self.$message({
                  message: response.data.message,
                  type: "error",
                });
              }
            })
            .catch(function (a) {
              console.error(a);
            })
            .finally((_) => {
              self.loading = false;
            });
        }
      });
    },
  },
};
</script>
<style scoped>
.main_time {
  /* width: 210px; */
  height: 20px;
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  text-align: left;
  color: #333333;
  line-height: 20px;
  margin-bottom: 20px;
}
.main_time span {
  margin-left: 20px;
}
</style>

<style lang="scss" scoped>
  /deep/.el-select .el-input__inner,
  /deep/.el-select .el-input--medium{
    width: 300px;
}
</style>
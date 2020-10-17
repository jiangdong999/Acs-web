<template>
  <div>
    <div v-if="active==1">
      <el-form inline :model="form" ref="form" label-width="100px">
        <div>
          <form class="file-empty">
            <el-upload
              :disabled="loading"
              class="upload"
              :auto-upload="false"
              drag
              ref="upload"
              :limit="1"
              action="XXX"
              name="file"
              accept=".xls, .xlsx"
              :onExceed="alertTips"
              :multiple="false"
              :on-change="changeFile"
              :on-remove="changeFile"
              :before-upload="handleSubmit"
            >
              <el-image :src="xlsImgUrl"></el-image>
              <!-- <el-button type="primary" :disabled="loading">选择导入文件</el-button> -->
              <span v-if="disabled">点击导入</span>
              <span v-if="!disabled">导入成功</span>
            </el-upload>
          </form>
        </div>
      </el-form>
      <p class="tips">文件格式：xls/xlsx;仅限导入一份</p>
      <div class="ctrl-btns">
        <el-button style="margin-right:20px" type="default" @click="download()" :loading="loading">下载模板</el-button>
        <span>
          <el-button @click="$parent.$parent.handleClose" style="width:90px" v-if="disabled" :loading="loading">关闭</el-button>
          <!-- <el-button type="primary" @click="submitForm()" :loading="loading" v-if="disabled" :disabled="disabled">选择导入文件</el-button> -->
          <el-button type="primary" @click="submitForm()" :loading="loading" v-if="!disabled" :disabled="disabled">确定</el-button>
        </span>
      </div>
    </div>
    <div v-else-if="active==2">
      <h4 class="errorTip">检查完毕，发现{{failCount}}处数据有误，请调整后重新上传</h4>
      <el-table :data="tableData" stripe border>
        <div slot="empty" class="empty-table"></div>
        <el-table-column prop="rowNum" min-width="100" label="数据行数"></el-table-column>
        <el-table-column prop="errorMsg" min-width="200" label="出错原因"></el-table-column>
      </el-table>
      <div class="form-dialog-control-area">
        <el-button @click="$parent.$parent.handleClose">关闭</el-button>
        <el-button type="primary" @click="active=1">重新上传</el-button>
      </div>
    </div>
    <div v-else-if="active==3">
      <div class="step-success">
        <img src="../../assets/image/success.png" />
        <p>导入数据成功</p>
      </div>
      <div style="text-align:center">
        <el-button type="default" @click="$parent.$parent.handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addHouseholds } from "@/api/personnel";
import { mapGetters } from "vuex";
import xlsImgUrl from "@/assets/image/img_exlsx.png";

export default {
  data() {
    return {
      active: 1,
      loading: false,
      disabled: true,
      tableData: [],
      fileList: [],
      form: {},
      xlsImgUrl,
      failCount: 0,
    };
  },
  computed: {
    ...mapGetters(["community"]),
  },
  methods: {
    download() {
      window.open(
        "https://acs3.corelines.cn/resource/excel/householdAddsTemplate.xlsx"
      );
    },
    submitForm() {
      this.$refs.upload.submit();
    },
    handleSubmit: function (file) {
      let self = this;
      if (!file) {
        self.$message({
          message: "请选择上传文件",
          type: "warning",
        });
        return false;
      } else {
        const fileType = file.name.split(".").pop();
        const fileTypeArr = ["xls", "xlsx"];
        if (!fileTypeArr.includes(fileType)) {
          self.$message({
            message: "上传文件格式不正确，请检查",
            type: "warning",
          });
          return false;
        }
      }

      self.loading = true;
      let fd = new FormData();
      fd.append("file", file);
      // fd.append('propertyId',self.community.propertyId);
      fd.append("communityId", self.community.communityId);
      addHouseholds(fd)
        .then(function (response) {
          if (response.data && response.data.code === 1) {
            self.$message({
              message: response.data.message,
              type: "success",
            });
            self.active = 3;
          } else if (
            response.data &&
            (response.data.code === 160001 || response.data.code === 160002)
          ) {
            self.tableData = response.data.data.failList;
            self.failCount = response.data.data.failCount;
            self.active = 2;
          }
        })
        .catch(function (a) {
          console.error(a);
        })
        .finally((_) => {
          self.loading = false;
        });

      //对before-upload钩子返回false
      return false;
    },
    changeFile(file, fileList) {
      return (this.disabled = fileList.length > 0 ? false : true);
    },
    alertTips(file, fileList) {
      this.$message({
        message: "超出上传文件个数，请先移除",
        type: "warning",
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.header-text {
  font-size: 16px;
  color: #333333;
}
.file-empty {
  /* height: 344px; */
  padding-top: 10px;
  text-align: center;
}
.file-empty p {
  text-align: center;
  padding-top: 10%;
  line-height: 30px;
  font-size: 12px;
  color: #9fa1a6;
  letter-spacing: 10px;
}
.upload {
  height: auto;
  width: 204px;
  margin: 0 auto;
}
.ctrl-btns {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.tips {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 20px;
  margin-bottom: 40px;
}
.errorTip {
  font-size: 20px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 20px;
}
.el-table--fit{
  min-height: 220px;
  border: none;
}
.el-table--border td,
.el-table td{
  border: none;
}
</style>
<style>
.upload .el-upload {
  width: 100%;
  height: 90%;
  position: relative;
}
.upload .el-upload-dragger {
  width: 219px;
  height: 219px;
}
.upload span {
  position: absolute;
  left: 80px;
  bottom: 20px;
  z-index: 999;
}
</style>

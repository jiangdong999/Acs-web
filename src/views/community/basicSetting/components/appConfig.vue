<template>
  <el-form
    ref="formAPP"
    label-position="top"
    v-loading="loading"
    :model="form"
    inline
    label-width="120px"
  >
    <div class="commName">{{rowData.communityName}}</div>
    <el-row :gutter="30">
      <el-col :span="8">
        <el-form-item label="iOS版本" prop="latestVersionIos">
          <el-select v-model="form.latestVersionIos" placeholder="请选择版本号" clearable>
            <el-option
              v-for="version in form.appVersionIOSList"
              :key="version.id"
              :value="version.display_version"
              :label="version.display_version"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Android版本" prop="latestVersionAndroid">
          <el-select v-model="form.latestVersionAndroid" placeholder="请选择版本号" clearable>
            <el-option
              v-for="version in form.appVersionAndroidList"
              :key="version.id"
              :value="version.display_version"
              :label="version.display_version"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="人脸数量" prop="phoneFaceCount">
          <el-select v-model="form.phoneFaceCount">
            <el-option value="1" label="1" />
            <el-option value="2" label="2" />
            <el-option value="3" label="3" />
            <el-option value="4" label="4" />
            <el-option value="5" label="5" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="App菜单功能" style="display:flex" class="special-item">
      <el-checkbox
        style="margin-left:65px"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <div style="display:flex;flex-wrap:wrap;margin-left: -70px">
        <el-checkbox-group v-model="menuList" @change="handleCheckedMenusChange">
          <el-checkbox
            style="margin-top:16px;width:103px"
            v-for="(menu) in form.relSettingMenuList"
            :label="menu.type_id"
            :key="menu.type_id"
          >{{menu.type_name}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-form-item>
    <el-form-item label="其他功能">
      <el-checkbox-group v-model="report">
        <el-checkbox :label="1" style="float:left;">出入凭证</el-checkbox>
        <el-checkbox :label="2" style="float:left;">SOS报警</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <div class="title">自注册配置</div>
    <el-row class="zizhuce">
      <el-col :span="8">
        <el-form-item label="上传房产证" prop="isCertificate">
            <el-switch
            style="display: block"
            v-model="form.isCertificate"
            active-value="1"
            inactive-value="0"
            active-color="#007EE4"
            inactive-color="#FF5555"
            :active-text="isCertificateText"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="上传人脸照片" prop="registerPhoto">
          <el-switch
            style="display: block"
            v-model="form.registerPhoto"
            active-value="1"
            inactive-value="0"
            active-color="#007EE4"
            inactive-color="#FF5555"
            :active-text="registerPhotoText"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="身份证OCR识别" prop="allowAppOcr">
          <el-switch
            style="display: block"
            v-model="form.allowAppOcr"
            active-value="1"
            inactive-value="0"
            active-color="#007EE4"
            inactive-color="#FF5555"
            :active-text="allowAppOcrText"
          ></el-switch>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="上传租房合同" prop="registerContract">
          <el-switch
            style="display: block"
            v-model="form.registerContract"
            active-value="1"
            inactive-value="0"
            active-color="#007EE4"
            inactive-color="#FF5555"
            :active-text="registerContractText"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="租房合同照片" prop="maxContractPhotos">
          <el-select v-model="form.maxContractPhotos">
            <el-option :value="1" label="1张" />
            <el-option :value="2" label="2张" />
            <el-option :value="3" label="3张" />
            <el-option :value="4" label="4张" />
            <el-option :value="5" label="5张" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit()" :loading="loading">确定</el-button>
    </div>
  </el-form>
</template>

<script>
import { modifyAppConfiguration, queryCommunity } from "@/api/community";

export default {
  props: {
    rowData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      form: {},
      checkAll: false,
      isIndeterminate: false,
      menuList: [],
    };
  },
  computed: {
    report: {
      get() {
        let list = [];
        if (this.form.healthReport == 1) {
          list.push(1);
        }
        if (this.form.useCaringStaff == "1") {
          list.push(2);
        }
        return list;
      },
      set(newValue) {
        if (newValue.length === 0) {
          this.form.healthReport = 0;
          this.form.useCaringStaff = "0";
        } else if (newValue.length === 2) {
          this.form.healthReport = 1;
          this.form.useCaringStaff = "1";
        } else {
          newValue.forEach((item) => {
            if (item === 1) {
              this.form.healthReport = 1;
              this.form.useCaringStaff = "0";
            } else if (item === 2) {
              this.form.healthReport = 0;
              this.form.useCaringStaff = "1";
            }
          });
        }
      },
    },
    menuAuthority() {
      let s = 0;
      if (this.menuList.length > 0) {
        this.menuList.forEach((menuId) => {
          s |= menuId;
        });
      }

      return s;
    },
    allowAppOcrText() {
      return this.form.allowAppOcr == "1" ? "已启用" : "已禁用";
    },
    registerPhotoText() {
      return this.form.registerPhoto == "1" ? "必填" : "非必填";
    },
    registerContractText() {
      return this.form.registerContract == "1" ? "需要" : "不需要";
    },
    isCertificateText(){
      return this.form.isCertificate == "1" ? "需要" : "不需要";
    }
  },
  methods: {
    //获取小区配置详情
    loadCommunityParameters() {
      let self = this;
      queryCommunity({ communityId: self.rowData.communityId })
        .then(function (response) {
          if (response.data && response.data.code == 1) {
            self.form = response.data.data;
            let menuAuthority = self.form.phoneMenuAuthority;
            self.menuList = [];
            self.form.relSettingMenuList.forEach((item) => {
              if (menuAuthority & item.type_id) {
                self.menuList.push(item.type_id);
              }
            });
            self.checkAll =
              self.menuList.length === self.form.relSettingMenuList.length;
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
    handleCheckAllChange(val) {
      this.menuList = [];
      val
        ? this.form.relSettingMenuList.forEach((item) => {
            this.menuList.push(item.type_id);
          })
        : false;

      this.isIndeterminate = false;
    },
    handleCheckedMenusChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.form.relSettingMenuList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.form.relSettingMenuList.length;
    },
    checkFormChange() {
      let newValueString = JSON.stringify(this.form);
      let oldValueString = JSON.stringify(this.rowData);

      return newValueString == oldValueString;
    },
    submit(resolve) {
      let self = this;
      self.loading = true;
      // console.log(this.form.allowAppOcr,this.form.registerPhoto,this.form.registerContract);
      modifyAppConfiguration({
        communityId: this.form.communityId,
        useCaringStaff: this.form.useCaringStaff,
        phoneMenuAuthority: this.menuAuthority,
        latestVersionIos: this.form.latestVersionIos,
        latestVersionAndroid: this.form.latestVersionAndroid,
        phoneFaceCount: this.form.phoneFaceCount,
        healthReport: this.form.healthReport,
        maxContractPhotos: this.form.maxContractPhotos,
        isCertificate: this.form.isCertificate,
        allowAppOcr: this.form.allowAppOcr,
        registerPhoto: this.form.registerPhoto,
        registerContract: this.form.registerContract,
      })
        .then(function (response) {
          // console.log(response);
          if (response.data && response.data.code == 1) {
            self.$message({
              message: response.data.message,
              type: "success",
            });
            self.loading = false;
            self.$emit("close");
            !resolve && self.$emit("submit");
            resolve && resolve();
          }
        })
        .catch(function (a) {
          console.error(a);
        });
    },
  },
  created() {
    this.loadCommunityParameters();
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .special-item > .el-form-item__label {
    flex: none;
  }
}

/deep/.el-form--inline .el-form-item__content {
  // display: inline-block;
  vertical-align: middle;
}
.commName {
  color: #333333;
  font-size: 26px;
  line-height: 30px;
  margin-bottom: 30px;
}
.title {
  // display: inline-block; 
  width: 120px;
  line-height: 16px;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 2px solid #007ee4;
}
.form-dialog-control-area /deep/.el-button--medium{
  padding: 10px 30px;
}
// /deep/ .el-form-item--medium .el-form-item__content {
//   line-height: 36px;
// }

// .special-item /deep/ .el-form-item--medium .el-form-item__content {
//   line-height: 12px !important;
// }
// .zizhuce /deep/.el-form-item--medium .el-form-item__content{
//   line-height: 36px;
//   height: 36px;
// }
</style>

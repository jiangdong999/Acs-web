<template>
  <div class="jdClass" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="6">
        <p>姓名</p>
        <h4>{{data.name}}</h4>
      </el-col>
      <el-col :span="6">
        <p>手机号码</p>
        <h4>{{data.phone}}</h4>
      </el-col>
      <el-col :span="6">
        <p>账号类型</p>
        <h4>{{data.accountType | account}}</h4>
      </el-col>
      <el-col :span="6">
        <p>脱敏类型</p>
        <h4>{{data.sensitive | sensitive}}</h4>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h3>角色</h3>
        <p>
          <el-tag v-for="item in roleArr" :key="item.value" type="info">{{item.roleName}}</el-tag>
        </p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <h3>已选节点</h3>
        <div>
          <p>
            <el-tag v-for="item in arrcommunitCode" :key="item.value" type="info">{{item.name}}</el-tag>
          </p>
        </div>
        <!-- <div>
                <p>泰福苑社区居委会</p>
                <p><el-tag type="info">标签一</el-tag><el-tag type="info">标签一</el-tag><el-tag type="info">标签一</el-tag></p>
        </div>-->
      </el-col>
    </el-row>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$parent.handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">提交</el-button>
    </div>
  </div>
</template>

<script>
import { userAdd } from "@/api/loginv1";
import { sensitive,account } from "@/filters/index";
export default {
  props: ["data", "roleArr", "arrcommunitCode"],
  data() {
    return {
      loading: false
    };
  },
  filters: {
    account,
    sensitive
  },
  methods: {
    handleSubmit() {
      // console.log(this.data);
      let self = this;
      if (self.data.sensitive) {
        self.data.sensitive = parseInt(self.data.sensitive)
      }
      userAdd(self.data)
        .then(response => {
          if (response.data && response.data.status === 0) {
            self.$message({
              message: response.data.message,
              type: "success"
            });
            self.$emit("close");
            this.$router.push({ path: "/accout/list", query: {} });
          }
        })
        .catch(function(a) {
          console.error(a);
        })
        .finally(_ => {
          self.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.jdClass p span {
  margin: 3px 5px 3px 0px;
}

</style>

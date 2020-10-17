<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-row class="content">
        <span class="content-com">{{data.communityName}}</span>|
        <span class="content-house">{{data.householdName}}</span>
      </el-row>
      <el-row v-if="data.cardNo">
        <el-row>
          <el-form-item label="门卡类型" prop="cardClass">
            <el-select v-model="form.cardClass" placeholder="请选择门卡类型" :disabled="true">
              <el-option value="1" label="IC卡" />
              <el-option value="2" label="身份证" />
              <el-option value="3" label="ID卡" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="cardNum">
          <el-form-item
            label="门禁卡号"
            prop="cardNo"
            :rules="rules.cardNo"
            v-if="form.cardClass!=='2'"
          >
            <el-input
              style="width:300px"
              v-model="form.cardNo"
              clearable
              placeholder="请输入卡号"
              maxlength="8"
              :type="pswVisibility?'type':'password'"
              :disabled="true"
            >
              <i
                slot="prefix"
                class="iconfont"
                :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'"
                @click="pswVisibility=!pswVisibility"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item
            label="门禁卡号"
            prop="cardNo"
            v-else-if="form.cardClass==='2'"
            :rules="rules.cardNo2"
          >
            <el-input
              style="width:300px"
              v-model="form.cardNo"
              clearable
              placeholder="请输入卡号"
              maxlength="16"
              :type="pswVisibility?'type':'password'"
              :disabled="true"
            >
              <i
                slot="prefix"
                class="iconfont"
                :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'"
                @click="pswVisibility=!pswVisibility"
              ></i>
            </el-input>
          </el-form-item>
        </el-row>
      </el-row>
      <el-row v-else>
        <el-row>
          <el-form-item label="门卡类型" prop="cardClass">
            <el-select v-model="form.cardClass" placeholder="请选择门卡类型">
              <el-option value="1" label="IC卡" />
              <el-option value="2" label="身份证" />
              <el-option value="3" label="ID卡" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row class="cardNum">
          <el-form-item
            label="门禁卡号"
            prop="cardNo"
            :rules="rules.cardNo"
            v-if="form.cardClass!=='2'"
          >
            <el-input
              style="width:300px"
              v-model="form.cardNo"
              clearable
              placeholder="请输入卡号"
              maxlength="8"
              :type="pswVisibility?'type':'password'"
            >
              <i
                slot="prefix"
                class="iconfont"
                :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'"
                @click="pswVisibility=!pswVisibility"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item
            label="门禁卡号"
            prop="cardNo"
            v-else-if="form.cardClass==='2'"
            :rules="rules.cardNo2"
          >
            <el-input
              style="width:300px"
              v-model="form.cardNo"
              clearable
              placeholder="请输入卡号"
              maxlength="16"
              :type="pswVisibility?'type':'password'"
            >
              <i
                slot="prefix"
                class="iconfont"
                :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'"
                @click="pswVisibility=!pswVisibility"
              ></i>
            </el-input>
          </el-form-item>
        </el-row>
      </el-row>
      <div class="form-dialog-control-area">
        <el-button @click="$parent.handleClose()">取消</el-button>
        <el-button @click="handledeleted(data)" type="danger" v-if="data.cardNo">删除门卡</el-button>
        <el-button @click="handleSubmit(data)" type="primary" v-else>添加门卡</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { delCard } from "@/api/card";
import { addHouseholdCard } from "@/api/personnel";
import { validateHexadecimal } from "@/utils/rules";
export default {
  props: ["data"],
  data() {
    return {
      loading: false,
      pswVisibility: false,
      form: {
        householdId: "",
        delstatus: "1", //删除状态
        communityId: "",
        roomNodeId: "-1",
        cardClass: this.data.cardClass, //门禁卡类型
        cardType: "2",
        cardNo: this.data.cardNo,
        cardInfo: [],
        specialCard: "0", //特殊卡
      },
      rules: {
        cardClass: [
          { required: true, message: "请选择门卡类型", trigger: "change" },
        ],
        cardNo: [
          {
            message: "请输入正确的门禁卡卡号",
            validator: validateHexadecimal,
            required: true,
          },
          {
            min: 8,
            max: 8,
            message: "请填入正确的长度为8的卡号",
            required: true,
          },
        ],
        cardNo2: [
          {
            min: 16,
            max: 16,
            message: "请填入正确的长度为16的卡号",
            required: true,
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit(data) {
      let self = this;
      self.loading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          self.loading = true;
          self.form.householdId = data.householdId;
          self.form.communityId = data.communityId;
          addHouseholdCard({ ...self.form })
            .then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: "提交成功",
                  type: "success",
                });
                self.form.cardInfo = response.data.dataList;
                self.$emit("editform", self.form);
                self.$parent.handleClose();
              }
            })
            .catch(function (a) {
              console.error(a);
            });
        }
      });
    },
    handledeleted(data) {
      let self = this;
      if (data.cardInfo[0].cardId) {
        self.$confirm("确定删除此门禁卡吗？").then((_) => {
          self.loading = true;
          delCard({
            cardId: data.cardInfo[0].cardId,
            cardNo: data.cardInfo[0].cardNo,
          })
            .then(function (response) {
              if (response && response.data.code === 1) {
                self.$message({
                  message: "删除已完成",
                  type: "success",
                });
                self.$emit("delstatus", self.form.delstatus);
                self.$parent.handleClose();
              } else {
                self.$message({
                  message: response.data.message,
                  type: "error",
                });
              }
              return false;
            })
            .catch(function (a) {})
            .finally((_) => {
              self.loading = false;
            });
        });
      }
    },
  },
};
</script>
<style scoped>
.content {
  /* padding: 0 40px; */
  font-size: 24px;
  margin-bottom: 20px;
  font-family: PingFangSC, PingFangSC-Semibold;
}
.content-com {
  height: 20px;
  line-height: 20px;
  color: #333;
  font-weight: 600;
  font-size: 20px;
  margin-right: 10px;
  /* padding-bottom: 20px; */
}
.content-house {
  height: 20pt;
  line-height: 20px;
  color: #333;
  font-weight: 600;
  font-size: 20px;
  margin-left: 10px;
  /* padding-bottom: 20px; */
}
</style>
<style lang="scss" scoped>
/deep/.el-select .el-input__inner,
/deep/.el-select .el-input--medium{
    width: 300px;
}

.cardNum /deep/ .el-input--prefix .el-input__inner {
    padding-left: 15px;
}

.cardNum /deep/.el-input__prefix {
    position: absolute;
    width: 20px;
    height: 100%;
    left: 272px;
    top: 11px;
    text-align: center;
    color: #C0C4CC;
    -webkit-transition: all .3s;
    transition: all .3s;
}
</style>
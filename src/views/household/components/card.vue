<template>
  <section v-loading="loading">
    <div class="topBar">
      <div>{{householdInfo.householdName}}</div>
      <span>{{householdInfo.fullNodeName}}</span>
    </div>
    <el-form
      inline
      label-position="top"
      :model="card"
      :rules="cardRules"
      v-for="(card, index) in cardList"
      :key="index"
      :ref="'cardForm'+index"
    >
      <el-card class="mgn-btm20">
        <div>
          <el-form-item label="门禁卡发卡" prop="cardClass">
            <el-select
              v-model="card.cardClass"
              filterable
              placeholder="请选择卡类型"
              :disabled="!card.newCard"
            >
              <el-option value="1" label="IC卡" />
              <el-option value="2" label="身份证" />
              <el-option value="3" label="ID卡" />
            </el-select>
          </el-form-item>
          <el-form-item prop="cardNo" class="cardNo" :rules="cardRules.cardNo" v-if="card.cardClass=='1'">
            <el-input
              v-model="card.cardNo"
              placeholder="请输入卡号"
              :disabled="!card.newCard"
              clearable
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
            <div class="tips">卡号：{{card.cardNo}}</div>
          </el-form-item>
          <el-form-item prop="cardNo" class="cardNo"  v-else-if="card.cardClass=='2'" :rules="cardRules.cardNo2">
            <el-input
              v-model="card.cardNo"
              placeholder="请输入卡号"
              :disabled="!card.newCard"
              clearable
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
            <div class="tips">卡号：{{card.cardNo}}</div>
          </el-form-item>
          <el-form-item prop="cardNo" class="cardNo"  v-else-if="card.cardClass=='3'" :rules="cardRules.cardNo3">
            <el-input
              v-model="card.cardNo"
              placeholder="请输入卡号"
              :disabled="!card.newCard"
              clearable
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
            <div class="tips">卡号：{{card.cardNo}}</div>
          </el-form-item>
          <el-checkbox
            v-model="card.specialCard"
            class="checkbox"
            :disabled="!card.newCard"
            true-label="1"
            false-label="0"
          >
            特殊卡
            &emsp;状态：{{card.status | transCardStatus }}
          </el-checkbox>
        </div>
        <div class="newCard">
          <el-button
            type="primary"
            v-if="card.newCard"
            @click="handleSubmit('cardForm'+index, card)"
          >新增</el-button>
          <el-button type="danger" v-else @click="handleDel(card, index)">删除卡</el-button>
        </div>
      </el-card>
    </el-form>
    <div class="add" v-show="cardList.length<1">
      <el-image :src="imgCard" style="width:120px;height:auto"></el-image>
      <br>  
      <el-button type="text" @click="handleAddItem()">添加新卡</el-button>
    </div>
    <div class="form-dialog-control-area">
      
      <el-button @click="$emit('handleClose')">关闭</el-button>
    </div>
  </section>
</template>

<script>
// import { addHouseholdCard } from "@/api/personnel";
import { addHouseholdCard } from "@/api/personnelv1";
// import { delCard } from "@/api/card";
import { delCard } from "@/api/cardv1";
import { validateHexadecimal } from "@/utils/rules";
import { transCardStatus } from "@/filters/card";
import imgCard from "@/assets/image/img_card.png";

export default {
  props: ["householdInfo"],
  filters: {
    transCardStatus,
  },
  data() {
    return {
      imgCard:imgCard,
      loading: false,
      pswVisibility: false,
      cardList: [],
      cardRules: {
        cardClass: [
          { required: true, message: "请选择门卡类型", trigger: "blur" },
        ],
        cardNo: [
          { required: true, message: "请填写门禁卡号", trigger: "blur" },
          { message: "请输入正确的门禁卡卡号", validator: validateHexadecimal },
          { min: 8, max: 8, message: "请填入正确的长度为8的卡号" },
        ],
        cardNo2: [
          { required: true, message: "请填写门禁卡号", trigger: "blur" },
          { min: 16, max: 16, message: "请填入正确的长度为16的卡号" },
        ],
        cardNo3: [
          { required: true, message: "请填写门禁卡号", trigger: "blur" },
          { message: "请输入正确的门禁卡卡号", validator: validateHexadecimal },
          { min: 8, max: 16, message: "请填入正确的长度为8-16的卡号" },
        ],
      },
    };
  },
  methods: {
    handleSubmit(vm_form, data) {
      this.$refs[vm_form][0].validate((valid) => {
        if (valid) {
          let self = this;
          self.loading = true;
          console.log(self.householdInfo);
          addHouseholdCard({
            householdId: self.householdInfo.householdId,
            communityId: self.householdInfo.communityId,
            roomNodeId: self.householdInfo.roomNodeId,
            leaseStartTime: self.householdInfo.leaseStartTime,
            leaseEndTime: self.householdInfo.leaseEndTime,
            nodeUuid: self.householdInfo.nodeUuid,
            householdUuid: self.householdInfo.householdUuid,
            ...data,
          })
            .then(function (response) {
              if (response.data && response.data.status === 0) {
                self.$message({
                  message: response.data.message,
                  type: "success",
                });
                self.$emit("handleClose");
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
    handleAddItem() {
      if (!this.cardList && typeof this.cardList !== "object") {
        this.cardList = [];
      }
      let cardItem = {
        cardClass: "1",
        cardNo: "",
        specialCard: "0",
        newCard: true,
      };
      this.cardList.push(cardItem);
    },
    handleDel: function (data, index) {
      let self = this;
      self
        .$confirm("确定删除此门禁卡吗？")
        .then((_) => {
          delCard({
            nodeUuid: data.nodeUuid,
            cardUuid: data.cardUuid,
            cardNo: data.cardNo,
          })
            .then(function (response) {
              if (response && response.data.status === 0) {
                self.$message({
                  message: response.data.message,
                  type: "success",
                });
                self.$emit("handleClose");
              }
            })
            .catch(function (a) {
              console.error(a);
            });
        })
        .catch((a) => {
          console.error(a);
        });
    },
  },
  mounted() {
    if (this.householdInfo.cardList && this.householdInfo.cardList.length > 0) {
      this.cardList = [...this.householdInfo.cardList];
      // this.cardList = [...this.householdInfo.cardList]
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/iconfont/iconfont.css";
.icon-del {
  position: absolute;
  display: inline-block;
  width: 24px;
  height: 24px;
  padding: 5px;
  border-radius: 50%;
  background-color: #ff5555;
  right: -11px;
  top: -11px;
  cursor: pointer;
  opacity: 0.8;
}
.icon-del:before {
  color: #fff;
}
.icon-del:hover {
  opacity: 1;
}
.dialog-footer {
  text-align: right;
}
.topBar {
  line-height: 30px;
  margin-bottom: 20px;
}
.topBar > div {
  font-size: 16px;
  color: #000;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
.topBar > span {
  color: rgba(136, 136, 136, 1);
}
.mgn-btm20 {
  margin-bottom: 20px;
}
.add {
  line-height: 40px;
  text-align: center;
}
.add > button {
  font-size: 16px;
}
.checkbox {
  margin: 0 10px;
}
.cardNo /deep/.el-input__prefix{
  top: 13px;
}
.newCard{
  text-align: center;
}
.tips{
  margin-top: 10px;
}
</style>

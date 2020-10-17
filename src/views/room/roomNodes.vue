<template>
  <div>
    <div class="title">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
      <span>房屋列表</span>
      <el-button
        type="primary"
        @click="showImport=true"
        :disabled="disabled"
        style="margin-left:20px"
      >批量导入房屋</el-button>
    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" inline class="formHouse">
      <div class="header">
        <div class="clearfix">
          <el-form-item>
            <span style="font-size:14px;margin-left:10px">批量生成：</span>
            <el-form-item prop="areaCount">
              <el-input-number
                v-model="form.areaCount"
                controls-position="right"
                :min="0"
                :max="50"
                :precision="0"
                size="small"
                :disabled="hasNode"
              ></el-input-number>区域
            </el-form-item>

            <el-form-item prop="buildCount">
              <el-input-number
                v-model="form.buildCount"
                controls-position="right"
                :min="1"
                :max="50"
                :precision="0"
                size="small"
                :disabled="hasNode"
              ></el-input-number>楼栋
            </el-form-item>
            <el-form-item prop="partCount">
              <el-input-number
                v-model="form.partCount"
                controls-position="right"
                :min="0"
                :max="50"
                :precision="0"
                size="small"
                :disabled="hasNode"
              ></el-input-number>单元
            </el-form-item>
            <el-form-item prop="floorCount">
              <el-input-number
                v-model="form.floorCount"
                controls-position="right"
                :min="1"
                :max="50"
                :precision="0"
                size="small"
                :disabled="hasNode"
              ></el-input-number>楼层
            </el-form-item>
            <el-form-item prop="roomCount">
              <el-input-number
                v-model="form.roomCount"
                controls-position="right"
                :min="1"
                :max="50"
                :precision="0"
                size="small"
                :disabled="hasNode"
              ></el-input-number>房间
              <!-- <el-input v-model="form.roomCount" class="count-input" maxlength="3" :disabled="hasNode">
                <template slot="append">房间</template>
              </el-input>-->
            </el-form-item>
            <div v-if="!hasNode" class="tips">
              小区拥有
              <label>{{form.areaCount}}</label> 个区域、
              每个区域
              <label>{{form.buildCount}}</label> 栋楼、
              每栋楼
              <label>{{form.partCount}}</label> 单元、
              每单元
              <label>{{form.floorCount}}</label> 层、
              每层
              <label>{{form.roomCount}}</label> 个房间
            </div>
          </el-form-item>
          <div class="control-right">
            <el-button
              type="primary"
              @click="createRoomNodeTree()"
              :disabled="hasNode"
              :loading="loading"
            >生成房屋树结构</el-button>
            <el-button type="text" @click="handReset()" :disabled="hasNode">重置</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="box-card">
      <div class="module-title">
        <mallki class="mallki-text" text="房屋树结构图"></mallki>
      </div>
      <div class="node-tree-content">
        <el-card v-loading="loading">
          <div class="tree-empty" v-if="!showNode">
            <p>等待房屋树结构生成</p>
          </div>
          <room-node-tree-edit
            v-if="showNode"
            :roomNode.sync="roomNode"
            :params="form"
            ref="roomNodeTree"
          />
        </el-card>
      </div>
    </div>
    <div v-if="showImport">
      <el-dialog
        title="批量导入房屋"
        :show-close="true"
        :visible.sync="showImport"
        width="550px"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <exp />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { dropdownNodeComplex } from "@/api/nodev1";
import { addBatchRoom } from "@/api/roomv1";
import { validatePositiveNumber, validateNumber } from "@/utils/rules";
import roomNodeTree from "@/components/roomNodeTree";
import roomNodeTreeEdit from "@/components/roomNodeTree/edit";
import creatMethods from "@/utils/creatNodes";
import { mapGetters } from "vuex";
import exp from "../personnel/importHouse.vue";

export default {
  name: "room-form",
  mixins: [creatMethods],
  computed: {
    ...mapGetters(["community"]),
  },
  components: {
    exp,
    roomNodeTree,
    roomNodeTreeEdit,
  },
  inject: ["reload"],
  data() {
    return {
      disabled: false,
      showImport: false,
      loading: false,
      showNode: false,
      hasNode: false,
      form: {
        communityId: "",
        communityName: "",
        areaCount: 0,
        buildCount: 1,
        partCount: 0,
        floorCount: 1,
        roomCount: 1,
      },
      roomNode: [],
      rules: {
        areaCount: [
          { required: true, message: "请输入数量", trigger: "blur" },
          { message: "请输入正确的数字", validator: validateNumber },
        ],
        buildCount: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            message: "请输入大于零的正确数字",
            validator: validatePositiveNumber,
          },
        ],
        partCount: [
          { required: true, message: "请输入数量", trigger: "blur" },
          { message: "请输入正确的数字", validator: validatePositiveNumber },
        ],
        floorCount: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            message: "请输入大于零的正确数字",
            validator: validatePositiveNumber,
          },
        ],
        roomCount: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            message: "请输入大于零的正确数字",
            validator: validatePositiveNumber,
          },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.showImport = false;
      this.loadNode();
      this.reload();
    },
    handReset: function () {
      this.$refs.form.resetFields();
    },
    loadNode() {
      let self = this;
      let communityUuid = self.community.communityUuid;
      if (communityUuid) {
        self.loading = true;
        dropdownNodeComplex({ communityUuid: communityUuid })
          .then(function (response) {
            if (response.data.content) {
              let roomOptions = response.data.content;
              if (roomOptions.children && roomOptions.children.length > 0) {
                if (roomOptions.children.length == 1 && roomOptions.children[0].level == 999) {//有管理处
                  self.hasNode = false;
                } else {
                  // 若已有节点
                  self.hasNode = true;
                }

                // roomOptions[0].level = '1'
                self.roomNode = [roomOptions];
                // console.log(self.roomNode);
                self.showNode = true;
              } else {
                self.form.communityName = roomOptions.communityName;
                self.hasNode = false;
              }
            }
          })
          .catch(function (a) {
            console.error(a);
          })
          .finally((_) => {
            self.loading = false;
          });
      }
    },
    createRoomNodeTree: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let n = this.createNode(this.form);
          this.handleSubmit(n);
        }
      });
    },
    computedRoomNode(node, arr) {
      let self = this;
      if (node.children) {
        arr.push({
          level: node.children[0].level,
          number: node.children.length,
        });
        node = node.children[0];
        self.computedRoomNode(node, arr);
      }
      return arr;
    },
    handleSubmit: function (roomNode) {
      let self = this,
        arr = [];

      self.loading = true;
      let nodeArr = self.computedRoomNode(roomNode, arr);

      addBatchRoom({
        ...self.community,
        nodes: JSON.stringify(nodeArr),
      })
        .then(function (response) {
          if (response.data && response.data.status === 0) {
            self.$message({
              message: response.data.message,
              type: "success",
            });
          }
        })
        .catch(function (a) {
          console.error(a);
        })
        .finally((_) => {
          self.loading = false;
          self.loadNode();
        });
    },
  },
  mounted() {
    this.loadNode();
  },
};
</script>
<style scoped>
.title {
  line-height: 70px;
  padding: 0 20px;
  background-color: #fff;
  font-weight: 900;
  cursor: default;
}
.back {
  cursor: pointer;
  color: #007ee4;
  font-size: 14px;
}
.header {
  background-color: #fff;
  padding: 11px 20px;
}
.header-text {
  font-size: 16px;
  color: #333333;
}
.tree-empty {
  height: 344px;
  line-height: 344px;
  text-align: center;
}
.tree-empty p {
  font-size: 12px;
  color: #9fa1a6;
  letter-spacing: 10px;
}
.box-card {
  background-color: #fff;
  margin: 20px 30px;
  padding-bottom: 40px;
}
.node-tree-content {
  margin: 10px 40px;
}
.tips {
  margin-top: 10px;
}
.formHouse .el-input-number {
  margin-left: 20px;
  margin-right: 5px;
}
</style>

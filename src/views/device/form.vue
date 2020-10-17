<template>
  <div v-loading="loading" class="form comPopper jdcomPopper">
    <el-form ref="form" :rules="rules" :model="form">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="所属小区" prop="communityUuid">
            <el-select
              v-model="currentCommunity"
              placeholder="选择所属小区"
              clearable
              filterable
              value-key="communityUuid"
              @change="initNode($event)"
            >
              <el-option
                v-for="item in communityList"
                :key="item.communityUuid"
                :label="item.communityName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备位置" prop="nodeUuid">
            <el-popover
              v-model="popoverShow"
              popper-class="popper-shadow"
              width="300"
              :visible-arrow="false"
              trigger="click"
            >
              <el-tree
                class="tree-node"
                :data="nodeOptions"
                accordion
                :props="defaultProps"
                @node-click="handleNodeClick"
              ></el-tree>
              <el-input v-model="form.room" slot="reference" @clear.stop="clearRoom" clearable></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="设备型号" prop="doorType">
            <el-select v-model="form.doorType">
              <el-option
                v-for="item in devTypeList"
                :key="item.code"
                :label="item.codeName"
                :value="item.codeName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="doorName">
            <el-input
              type="text"
              v-model="form.doorName"
              :maxlength="20"
              placeholder="请输入门禁机名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="设备编号" prop="deviceSn">
            <el-input
              type="text"
              v-model="form.deviceSn"
              :maxlength="32"
              placeholder="请输入设备编号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进出方向" prop="doorDirection">
            <el-select v-model="form.doorDirection">
              <el-option
                v-for="item in doorDirectionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { dropdownNodeComplex } from "@/api/nodev1";
import { saveDevice } from "@/api/devicev1"; 
import "@riophae/vue-treeselect/dist/vue-treeselect.min.css";
import { validateNumberAndLetter, validateMobile } from "@/utils/rules";
import { mapGetters } from "vuex";

export default {
  name: "device-form",
  computed: {
    ...mapGetters(["communityList", "devTypeList"]),
    currentCommunity: {
      set(community) {
        community = community || {};
        this.form.communityUuid = community.communityUuid;
        this.form.propertyId = community.propertyId;
        this.form.communityName = community.communityName;
      },
      get() {
        return {
          communityUuid: this.form.communityUuid,
          propertyId: this.form.propertyId,
          communityName: this.form.communityName
        };
      }
    }
  },
  data() {
    return {
      popoverShow: false,
      loading: false,
      form: {
        communityUuid: "",
        nodeUuid: null,
        room: "",
        maintenanceNumber: "",
        deviceSn: "",
        buildingUse: "",
        doorDirection: "0",
        doorType: ""
      },
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      doorDirectionList: [
        { value: "0", label: "进" },
        { value: "1", label: "出" }
      ],
      nodeOptions: [],
      rules: {
        communityUuid: [
          { required: true, message: "请选择需要添加的小区", trigger: "change" }
        ],
        doorName: [
          { required: true, message: "请输入门禁机名称", trigger: "blur" }
        ],
        doorType: [
          { required: true, message: "请选择设备型号", trigger: "change" }
        ],
        nodeUuid: [
          { required: true, message: "请选择门禁机位置", trigger: "change" }
        ],
        deviceSn: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
          {
            message: "请输入数字与字母，不能输入其他字符",
            validator: validateNumberAndLetter
          }
        ],
        doorDirection: [{ required: true }],
        maintenanceNumber: [
          {
            required: true,
            message: "请输入管理处负责人电话",
            trigger: "blur"
          },
          { message: "请输入正确的手机号", validator: validateMobile }
        ]
      }
    };
  },
  methods: {
    loadNode(node, resolve) {
      if (node.data.children && node.data.children.length > 0) {
        let data = node.data.children;

        for (let children of data) {
          children.leaf = !children.children || false;
        }
        resolve(data);
      } else {
        resolve([]);
      }
    },
    handleNodeClick(data) {
      this.form.nodeUuid = data.nodeUuid;
      this.form.room = data.fullNodeName;
      this.popoverShow = data.children ? data.children.length > 0 : false;

      if (data.parentId == -1 && !data.children) {
        this.$message({
          message: "该节点下没有数据",
          type: "error"
        });
      }
    },
    clearRoom: function() {
      this.form.nodeUuid = "";
      this.form.room = "";
    },
    initNode: function({ communityUuid }) {
      this.form.nodeUuid = "";
      this.form.room = "";

      let self = this;
      if (communityUuid) {
        dropdownNodeComplex({ communityUuid: communityUuid })
          .then(function(response) {
            if (response && response.data) {
              self.nodeOptions = [response.data.content];
            }
          })
          .catch(function(a) {
            console.error(a);
          });
      }
    },
    handleSubmit: function(formName) {
      let self = this;
      self.$refs[formName].validate(valid => {
        if (valid) {
          self.loading = true;
          saveDevice(self.form)
            .then(function(response) {
              if (response.data && response.data.status === 0) {
                self.$message({
                  message: "提交成功",
                  type: "success"
                });
                self.$emit("submit");
              }
            })
            .catch(function(a) {
              console.error(a);
            })
            .finally(_ => {
              self.loading = false;
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose: function() {
      this.$parent.handleClose();
    }
  }
};
</script>

<style lang='scss' scoped>
.el-dialog__body {
    padding: 38px 50px 30px;
}
</style>
<style>
.jdcomPopper .el-form-item__content{
  height: 60px !important;
}
.jdcomPopper .el-form-item__label{
  padding-bottom: 10px !important;
  height: 20px !important;
}
.jdcomPopper .el-form-item{
  margin-bottom: 30px !important;
}
</style>
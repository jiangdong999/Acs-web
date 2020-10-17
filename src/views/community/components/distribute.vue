<template>
  <div class="dis-box distribute">
    <div class="top">
      <p class="comm">{{rowData.communityName}}</p>
      <p class="configName">{{rowData.configName}}</p>
    </div>
    <!-- 穿梭框 所有数据[{label:'',key: 0,check:''}]  已选列表数据[0,1,2] index值 -->
    <el-transfer
      class="distribute-btn"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入搜索内容"
      :titles="titles"
      @change="chooseDev"
      v-model="selectedList"
      :data="deviceList"
    ></el-transfer>
    <div class="form-dialog-control-area">
      <el-button @click="$parent.handleClose()">取消</el-button>
      <el-button @click="handleSubmit()" type="primary" :loading="loading">确定</el-button>
    </div>
  </div>
</template>
<script>
import {
  distributed,
  undistributed,
  configAddDev,
  configDel
} from "@/api/config";

export default {
  props: ["rowData", "mode"],
  data() {
    return {
      allDev: [],
      selectedDev: [],
      loading: false,
      titles: ["待选列表", "已选列表"],
      deviceList: [],
      selectedParams: [],
      selectedList: [],
      filterMethod(query, item) {
        return item.check.indexOf(query) > -1;
      }
    };
  },
  created() {
    // this.check()
    if (this.mode === "assign") this.undistributed();
    if (this.mode === "del") this.distributed();
  },
  methods: {
    //选择设备   处理选择完设备后传给后台的参数 [doorId1,doorId2]
    chooseDev($event) {
      let self = this;
      let list = [];
      let hadSel = $event;
      self.allDev.forEach((item, idx) => {
        hadSel.forEach(ele => {
          if (idx === ele) {
            list.push(item.doorId);
          }
        });
      });
      this.selectedParams = list;
    },
    //处理得到列表的所有数据，包括已选和未选的[{label:'',key: 0,check:''}]
    generateData(arr) {
      let data = [];
      arr.forEach((item, index) => {
        data.push({
          label: item["doorName"],
          key: index,
          check: item["doorName"]
        });
      });
      this.deviceList = data;
    },
    //获取已选列表的index
    // getDistributed () {
    //   let self = this
    //   self.selectedDev.forEach(item=>{
    //     self.allDev.forEach((ele,idx)=>{
    //       if(ele.doorId===item.doorId){

    //         self.selectedList.push(idx)
    //       }
    //     })
    //   })
    // },
    check() {
      let self = this;
      let pro1 = self.distributed();
      let pro2 = self.undistributed();
      Promise.all([pro1, pro2]).then(values => {
        self.selectedDev = values[0];
        self.allDev = values[1];
        self.generateData(self.allDev);
        self.getDistributed();
      });
    },
    //已选列表
    distributed() {
      let self = this;
      return new Promise((resolve, reject) => {
        distributed({
          configId: self.rowData.configId,
          communityId: self.rowData.communityId,
          offset: 0,
          limit: self.rowData.doorCount
        })
          .then(function(response) {
            if (response.data && response.data.code === 1) {
              // resolve(response.data.dataList)
              self.allDev = response.data.dataList;
              self.generateData(response.data.dataList);
            }
          })
          .catch(function(a) {
            resolve(false);
            console.error(a);
          })
          .finally(_ => {
            resolve(false);
            self.loading = false;
          });
      });
    },
    //已选和未选列表
    undistributed() {
      let self = this;
      return new Promise((resolve, reject) => {
        undistributed({
          configId: self.rowData.configId,
          communityId: self.rowData.communityId,
          offset: 0,
          limit: 300
        })
          .then(function(response) {
            if (response.data && response.data.code === 1) {
              // resolve(response.data.dataList)
              self.allDev = response.data.dataList;
              self.generateData(response.data.dataList);
            }
          })
          .catch(function(a) {
            resolve(false);
            console.error(a);
          })
          .finally(_ => {
            resolve(false);
            self.loading = false;
          });
      });
    },
    //确定
    handleSubmit() {
      if(this.selectedParams.length == '0') return;
      let self = this;
      let data = {
        communityId: self.rowData.communityId,
        configId: self.rowData.configId,
        doorIds: self.selectedParams
      };
      let api = null;
      if (self.mode == "del") {
        api = configDel;
      } else if (self.mode == "assign") {
        api = configAddDev;
      }
      api(data)
        .then(function(response) {
          if (response.data && response.data.code === 1) {
            self.$message({
              message: response.data.message,
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
    }
  }
};
</script>
<style lang="scss" scoped>
.top {
  // padding-left: 20px;
  color: #999999;
  overflow: hidden;
  margin-bottom: 20px;
  margin: 0;
  padding: 0;
  .comm {
    // height: 30px;
    font-size: 16px;
    // margin-right: 20px;
    line-height: 16px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
  }
  .configName {
    font-size: 20px;
    line-height: 20px;
    color: #333333;
    font-weight: bold;
    margin: 0 0 20px 0;
  }
}

.distribute {
  padding-bottom: 0;
}

.distribute /deep/.el-transfer {
  width: 100%;
}

.distribute /deep/.el-transfer-panel {
  height: 305px;
  width: 315px !important;
}

.distribute /deep/.el-transfer-panel .el-transfer-panel__header {
  padding-left: 20px;
}

.distribute /deep/.el-transfer-panel .el-transfer-panel__item {
  padding-left: 20px;
}

.distribute /deep/.el-transfer-panel__filter{
  margin: 20px;
}

.distribute /deep/.el-input.el-input--small {
    width: 275px !important;
}

.distribute /deep/ .el-checkbox__label {
  color: #333333;
}

.distribute-btn /deep/.el-button--primary.is-disabled,
.distribute-btn /deep/.el-button--primary.is-disabled:hover,
.distribute-btn /deep/.el-button--primary.is-disabled:focus,
.distribute-btn /deep/.el-button--primary.is-disabled:active {
  color: #aaaaaa;
  background-color: #ecf0f7;
  border-color: #ecf0f7;
  display: block;
  height: 30px;
  width: 30px;
  padding: 0;
  margin-bottom: 23px;
}

.distribute-btn /deep/.el-button--primary,
.distribute-btn /deep/.el-button--primary:hover,
.distribute-btn /deep/.el-button--primary:focus,
.distribute-btn /deep/.el-button--primary:active {
  color: #fff;
  background-color: #007ee4;
  border-color: #007ee4;
  display: block;
  height: 30px;
  width: 30px;
  padding: 0;
  margin-bottom: 23px;
}

.distribute-btn /deep/.el-transfer__buttons {
  padding: 0 15px;
}

.form-dialog-control-area{
  margin-top: 40px;
}
</style>
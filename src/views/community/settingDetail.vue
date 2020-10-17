<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form ref="searchForm" :model="searchForm" inline>
          <el-row>
            <el-form-item prop="room" label="设备位置">
              <div>
                <el-popover
                placement="bottom"
                width="300"
                ref="popover"
                popper-class="popper-shadow"
                v-model="popoverShow"
                trigger="click">
                  <el-input
                    placeholder="输入关键字进行过滤"
                    class="mb-5"
                    v-model="filterText"
                    clearable>
                  </el-input>
                  <el-tree class="tree-node" 
                  ref="tree"
                  :data="roomOptions" 
                  accordion 
                  :props="defaultProps" 
                  :load="loadNode" 
                  empty-text="无此节点"
                  @node-click="handleNodeClick"
                  :filter-node-method="filterNode">
                  </el-tree>
                </el-popover>
              </div>
              <el-input
                class="widen-input"
                placeholder="请选择"
                v-model="searchForm.room"
                v-popover:popover
                @clear="clearRoom"
                suffix-icon="el-icon-arrow-down">
              </el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="doorName">
              <el-input v-model="searchForm.doorName"  placeholder="请选择设备名称" clearable></el-input>
            </el-form-item>  
            <el-form-item label="设备编号" prop="doorDeviceId">
              <el-input v-model="searchForm.doorDeviceId" placeholder="请选择设备编号" clearable></el-input>
            </el-form-item> 
            <span class="control-right">
              <el-button @click="handleReset()">重置</el-button>
              <el-button type="primary"  @click="loadData()">搜索</el-button>
            </span>
          </el-row>
        </el-form>
      </div>
      <div class="table-container" v-loading="loading">       
        <div class="table-control-panel clearfix">
          <span class="back" @click="$router.back()"><i class="el-icon-arrow-left"></i>返回</span>
          <span>{{configName}}</span>
          <span>{{communityName}}</span>
          <span>{{doorTypeDesc}}</span>
        </div>
        <el-row>
          <el-table :data="tableData" stripe fit>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              
               
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="fullNodeName"
              
               
              min-width="120"
              label="设备位置">
            </el-table-column>
            <el-table-column
              prop="doorName"
              
              min-width="120"
               
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="doorDeviceId"
              
               
              min-width="120"
              label="设备编号">
            </el-table-column>
            <el-table-column
              prop="doorType"
              
               
              min-width="120"
              label="设备型号">
              <template slot-scope="scope">
                <span :class="{'special-tag': doorTypeDesc!=scope.row.doorType}">{{scope.row.doorType}}</span>
              </template>
            </el-table-column>           
          </el-table>
        </el-row>
        <div class="page-container">
          <el-pagination
            background
            @size-change="limitChange"
            @current-change="turnPage"
            :current-page.sync="page"
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {loadList} from "@/api/community";
  import { distributed } from "@/api/config"
  import mixin from "@/utils/mixin";
  import { mapGetters } from 'vuex';
  import {dropdownNodeComplex} from "@/api/node";

  export default {
    mixins:[mixin],
    data() {
      return {
        communityId: '',
        communityName: '',
        configName: '',
        roomOptions:[],
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: 'leaf'
        },
        filterText: '',
        doorTypeDesc: '',
        popoverShow: false,
        searchForm: {
          doorDeviceId: '',
          configId: '',
          nodeId: '',
          room: '',
          doorName: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'communityList',
      ])     
    },
    watch: {
      'filterText':function(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {
          ...self.searchForm, 
        };
        searchParams.offset = offset;
        searchParams.limit = limit;
        distributed(searchParams).then(function (response) {
          self.loading = false;
          if (response.data && response.data.code==1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            // 当从零查询，则重置页码
            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      clearRoom:function(){
        this.searchForm.nodeId = '';
        this.searchForm.room = '';
      },
      initNode: function (data) {
        let self = this;
        self.searchForm.room = '';
        dropdownNodeComplex({communityId: data}).then(function (response) {
          if (response && response.data) {
            self.roomOptions = response.data.dataList;
          }
        }).catch(function (a) {
          console.error(a)
        });
      },
      loadNode(node, resolve) {

        if(node.data.children && node.data.children.length>0){
          let data = node.data.children

          for(let children of data){
            children.leaf = !children.disabled
          }
          resolve(data);
        }
      },
      handleNodeClick(data) {
        // if (!data.disabled && data.parentId != -1) {
          this.searchForm.nodeId = data.id;
          this.searchForm.room = data.nodeLabel;
          this.popoverShow = data.disabled 
        // }
        if(data.parentId == -1 && !data.children){
          this.$message({
            message: '该节点下没有数据',
            type: 'error'
          });
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    mounted() {
      let query = JSON.parse(localStorage.getItem('query'))
      this.searchForm.configId = query.configId
      this.doorTypeDesc = query.doorTypeDesc
      this.communityId = query.communityId
      this.communityName = query.communityName
      this.configName = query.configName
      this.loadData()
      this.initNode(this.communityId)
    },   
  }
</script>
<style lang="scss" scoped>
.control-right{
  margin-top: 7px;
}

.table-control-panel{
  padding: 0;
  .back{
    padding: 0 !important;
    color: #007ee4;
  }
  span{
    margin-right: 20px;
    font-size: 16px;
    color: #5F6165;
  }
  span:nth-of-type(2){
    font-weight: 600;
    color: #000;
  }
}
.special-tag{
  color: red;
}
.control-panel{
  padding-left: 8px;
}
.control-panel .el-form-item {
    margin-bottom: 6px !important;
    margin-top: 7px;
}
/deep/.el-form-item--medium .el-form-item__label{
  line-height: 36px;
}
</style>

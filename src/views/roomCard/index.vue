<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
          <el-col>
            <div class="table-control-panel">
              <span class="control-left list-title">权限申请卡列表</span>
              <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
              <span class="control-left">
                <el-button type="primary" icon="el-icon-plus" @click="showModal = true">创建权限卡</el-button>
              </span>
              <span class="control-right">
                <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                  <div class="control-panel jdClass">
                    <el-form :inline="true" :model="searchForm" ref="searchForm">
                      <el-row>
                        <el-col :span="24">
                          <el-form-item class="room-place" prop="room" label="房间">
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
                                  clearable
                                  v-model="filterText">
                                </el-input>
                                <el-tree class="tree-node" 
                                :data="roomOptions" 
                                ref="tree"
                                accordion 
                                :props="defaultProps" 
                                :load="loadNode"
                                empty-text="无此节点"
                                @node-click="handleNodeClick"
                                :filter-node-method="filterNode"></el-tree>
                              </el-popover>
                            </div>
                            <el-input
                              class="widen-input"
                              placeholder="关联房间"
                              v-model="searchForm.room"
                              v-popover:popover
                              clearable
                              @clear="clearRoom"
                              suffix-icon="el-icon-arrow-down">
                            </el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="卡号" prop="houseCardNo">
                            <el-input placeholder="请输入" clearable :maxlength="16" v-model="searchForm.houseCardNo"/>
                          </el-form-item>

                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="使用状态" prop="status">
                            <el-select v-model="searchForm.status" filterable clearable>
                              <el-option
                                v-for="item in roomCardStatusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>

                        </el-col>
                      </el-row>

                      <span class="jdClassbtn">
                        <el-button @click="handleReset()">重置</el-button>
                        <el-button type="primary"  @click="loadData()">搜索</el-button>
                      </span>
                    </el-form>
                  </div>

                  <el-button plain slot="reference" class="jdbtn">
                    <svg-icon iconClass="filter" class="jdIconSize" />筛选
                  </el-button>
                </el-popover>
              </span>
            </div>
          </el-col>
        </el-row>

      <div class="table-container" v-loading="loading">
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="houseCardNo"
              min-width="120"
              label="卡号">
            </el-table-column>
            <el-table-column
              prop="fullNodeName"
              min-width="350"
              label="房间">
            </el-table-column>
            <el-table-column
              prop="status"
              min-width="120"
              label="使用状态">
              <template slot-scope="scope">
                {{ scope.row.status | transRoomCardStatus }}
              </template>
            </el-table-column>
            <el-table-column
              prop="entryTime"
              min-width="200"
              label="创建日期">
              <template slot-scope="scope">
                {{ scope.row.entryTime | formatDateTimeWithDot }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="180">
              <template slot-scope="scope">
                <template v-if="scope.row.status=='0'">
                  <el-button
                    type="text"
                    @click="showDialog(scope.row)"
                    size="small">
                    重新开卡
                  </el-button>
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    @click="handleSet(scope.row, '2', '挂失')"
                    v-if="scope.row.status=='1'"
                    size="small">
                    挂失
                  </el-button>
                  <!-- <el-button
                    type="text"
                    @click="handleSet(scope.row, 2, '开启')"
                    v-else-if="scope.row.status=='2'"
                    size="small">
                    开启
                  </el-button> -->
                  <el-button
                    type="text"
                    @click="handleReissue(scope.row)"
                    size="small">
                    补卡
                  </el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.status=='1' || scope.row.status=='2'"
                    @click="handleSet(scope.row, '0', '注销')"
                    size="small">
                    注销
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="page-container">
          <el-pagination
            background
            @size-change="limitChange"
            @current-change="turnPage"
            :current-page="page"
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showModal">
      <el-dialog
      title="新增权限申请卡"
      width="1011px"
      :visible.sync="showModal"
      :before-close="handleClose"
      :close-on-click-modal="false">
        <room-card-form/>
      </el-dialog>
    </div>

    
    <div v-if="showAfresh">
      <el-dialog
      title="重新开卡"
      width="1011px"
      :visible.sync="showAfresh"
      :before-close="handleClose"
      :close-on-click-modal="false">
        <room-card-form :assignNode="assignNode"/>
      </el-dialog>
    </div>

    <div v-if="showReissue">
      <el-dialog
      title="权限申请卡补卡"
      :visible.sync="showReissue"
      :before-close="handleClose"
      :close-on-click-modal="false">
        <reissue :data="rowData"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {fetchList, setHouseCard} from "@/api/roomCard";
  import { dropdownNodeComplex } from "@/api/node";
  import mixin from "@/utils/mixin";
  import roomCardForm from "./form";
  import reissue from "./reissue";
  import { roomCardStatusOptions } from "@/utils/options";
  import { transRoomCardStatus } from "@/filters/roomCard";
  import {formatDateTimeWithDot} from "@/filters/index"

  export default {
    mixins:[mixin],
    components: {
      roomCardForm,
      reissue
    },
    filters:{
      transRoomCardStatus,
      formatDateTimeWithDot
    },
    data() {
      return {
        roomCardStatusOptions,
        showModal: false,
        showReissue:false,
        showAfresh:false,
        popoverShow:false,
        roomOptions:[],
        searchForm:{
          roomNodeId:null,
          room:'',
          houseCardNo:'',
          status:''
        },
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: 'leaf'
        },
        filterText:'',
        rowData:{},
        assignNode:{},
      }
    },
    methods: {
      handleReissue(data){
        this.rowData = data
        this.showReissue = true
      },
      handleSet:function(data, type, text){
        let self = this;
        if (data.houseCardId) {
          self.$confirm('在权限申请卡列表中可重新'+(type=="2"?"开卡":"开启"), '确认'+(type=="2"?"挂失":"注销")+'权限申请卡？', {
            confirmButtonText: type=='2'?'挂失':'注销',
            cancelButtonText: '关闭',
            center: true
          }).then(_ => {
              self.loading = true;
              setHouseCard({
                ...data,
                type
              }).then(function (response) {
                if (response && response.data.code === 1) {
                  self.$message({
                    message: response.data.message,
                    type: 'success'
                  });
                } else {
                  self.$message({
                    message: response.data.message,
                    type: 'error'
                  });
                }
                self.loadData();
                return false;
              }).catch(function (a) {
              }).finally(_=>{
                self.loading = false;
              })
            }).catch( (a) => {
              // console.log(a)
            })
        }
      },
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.clearRoom();
        this.loadData();
      },
      clearRoom:function(){
        this.searchForm.roomNodeId = '';
        this.searchForm.room = '';
      },
      showDialog: function (data) {
        this.assignNode = {type:'R', roomNodeId:data.roomNodeId, nodeLabel:data.fullNodeName}
        this.showAfresh = true;
      },
      handleClose: function (done) {
        this.loadData();
        done && done()
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        let searchParams = {...self.searchForm, ...self.community};
        searchParams.offset = offset;
        searchParams.limit = limit;
        fetchList(searchParams).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            
            // 当从零查询，则重置页码
            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          self.loading = false;
        })
      },
      initNode: function (data) {
        let self = this;
        self.searchForm.room = '';
        dropdownNodeComplex({communityId: self.community.communityId}).then(function (response) {
          if (response.data && response.data.code==1) {
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
        if (!data.disabled && data.parentId != -1) {
          this.searchForm.roomNodeId = data.id;
          this.searchForm.room = data.nodeLabel;
          this.popoverShow = data.disabled 
        }
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
      },
    },
    watch: {
      'filterText':function(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      this.loadData();
      this.initNode();
    },
  }
</script>

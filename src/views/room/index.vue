<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form inline :model="searchForm" ref="searchForm">
          <el-form-item label="房屋位置" prop="nodeId">
            <el-popover
              placement="bottom"
              v-model="popoverShow"
              popper-class="popper-shadow"
              width="300"
              trigger="click">
                <el-tree class="tree-node" :data="roomOptions" accordion :props="defaultProps" lazy :load="loadNode" @node-click="handleNodeClick"></el-tree>
                <el-input
                v-model="searchForm.room"
                slot="reference"
                @clear="clearRoom"
                placeholder="房屋位置"
                suffix-icon="el-icon-arrow-down"
                clearable>
                </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="房屋用途" prop="roomUse">
            <el-select v-model="searchForm.roomUse" filterable placeholder="请选择">
              <el-option
                v-for="item in roomUseTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用状态" prop="roomUseStatus">
            <el-select v-model="searchForm.roomUseStatus" filterable placeholder="请选择">
              <el-option
                v-for="item in roomUseStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房产性质" prop="roomProperty">
            <el-select v-model="searchForm.roomProperty" filterable placeholder="请选择">
              <el-option
                v-for="item in roomPropertyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="control-right">
            <el-button @click="handleReset()">重置</el-button>
            <el-button type="primary"  @click="loadData()">搜索</el-button>
          </div>
        </el-form>
      </div>
      <div class="table-container" v-loading="loading">
        <div class="table-control-panel clearfix">
          <span class="control-left list-title">房屋列表</span>
          <span class="control-right">
            <!-- <el-button type="primary" icon="el-icon-plus" @click="showDialog">新增房屋</el-button> -->
            <el-button type="primary" icon="el-icon-printer" @click="showAction = true">批量添加</el-button>
          </span>
        </div>
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              
               
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="propertyName"
               
               
              min-width="120"
              label="所属单位">
            </el-table-column>
            <el-table-column
              prop="communityName"
             
              min-width="120"
               
              label="所属小区">
            </el-table-column>
            <el-table-column
              prop="entryTime"
             
               
              min-width="120"
              label="创建时间">
              <template slot-scope="scope">
                {{scope.row.entryTime | formatTimeMillisToDate }}
              </template>
            </el-table-column>
            <el-table-column
              prop="buildingNo"
               
             
              min-width="120"
              label="楼栋">
            </el-table-column>
            <el-table-column
              prop="unitNo"
               
              
              min-width="120"
              label="单元">
            </el-table-column>
            <el-table-column
              prop="floorNo"
               
             
              min-width="120"
              label="楼层">
            </el-table-column>
            <el-table-column
              prop="roomName"
               
             
              min-width="120"
              label="门牌号">
            </el-table-column>
            <el-table-column
              prop="bedrooms"
             
              min-width="120"
               
              label="房间数">
              <template slot-scope="scope">
                {{ scope.row.bedrooms == -1?'': scope.row.bedrooms }}
              </template>
            </el-table-column>
            <el-table-column
              prop="members"
               
              
              min-width="120"
              label="使用人数">
            </el-table-column>
            <el-table-column
              prop="roomUse"
               
          
              min-width="120"
              label="房屋用途">
              <template slot-scope="scope">
                {{ scope.row.roomUse | transRoomUse}}
              </template>
            </el-table-column>
            <el-table-column
              prop="roomUseStatus"
               
              
              min-width="120"
              label="使用状态">
              <template slot-scope="scope">
                {{ scope.row.roomUseStatus | transRoomUseStatus}}
              </template>
            </el-table-column>
            <el-table-column
              prop="roomProperty"
               
              
              min-width="120"
              label="房产性质">
              <template slot-scope="scope">
                {{ scope.row.roomProperty | transRoomProperty}}
              </template>
            </el-table-column>
            <el-table-column
               
             
              label="操作"
              min-width="120"
              fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleEdit(scope.row)">
                  查看
                </el-button>
                <!-- <el-button
                  type="text"
                  @click="handleDel(scope.row)">
                  删除
                </el-button> -->
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
        title="添加房屋"
        :visible.sync="showModal"
        :close-on-click-modal="false">
        <room-form/>
      </el-dialog>
    </div>

    <div v-if="showEdit">
      <el-dialog
        title="查看房屋"
        :visible.sync="showEdit"
        :close-on-click-modal="false">
        <room-edit :data="rowData"/>
      </el-dialog>
    </div>

    <div v-if="showAction">
      <el-dialog
        width="80%"
        top="5vh"
        title="房屋管理-批量添加"
        :visible.sync="showAction"
        :close-on-click-modal="false">
        <rooms-action/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import RoomForm from "./form";
  import RoomEdit from "./edit";
  import {fetchList, delRoom} from "@/api/room"
  import {formatTimeMillisToDate} from "@/filters/index";
  import {transRoomProperty, transRoomUseStatus, transRoomUse} from "@/filters/room";
  import "@riophae/vue-treeselect/dist/vue-treeselect.min.css";
  import {dropdownNodeComplex} from "@/api/node";
  import { mapGetters } from 'vuex';
  import mixin from "@/utils/mixin";

  export default {
    mixins: [mixin],
    components: {
      RoomForm,
      RoomEdit,
    },

    filters: {
      formatTimeMillisToDate: formatTimeMillisToDate,
      transRoomProperty: transRoomProperty,
      transRoomUseStatus: transRoomUseStatus,
      transRoomUse: transRoomUse,
    },
    computed:{
      ...mapGetters([
        'communityId'
      ])
    },

    methods: {
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.roomOptions = [];
        this.initNode(this.communityId)
        this.clearRoom();
        this.loadData();
      },
      showDialog: function () {
        this.showModal = true
      },
      handleClose: function (done) {
        this.loadData()
        this.showModal = false;
        this.showEdit = false;
        this.showAction = false;
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true
        let searchParams = {};
        searchParams.communityId = self.communityId || -1;
        searchParams.roomUseStatus = self.searchForm.roomUseStatus || -1;
        searchParams.roomUse = self.searchForm.roomUse || -1;
        searchParams.roomProperty = self.searchForm.roomProperty || -1;
        searchParams.nodeId = self.searchForm.nodeId || -1;
        searchParams.offset = offset || 0;
        searchParams.limit = limit || 10;

        fetchList(searchParams).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      handleEdit: function (row) {
        this.rowData = row;
        this.showEdit = true;
      },
      handleDel: function (data) {
        let self = this;
        if (data) {
          self.loading = true;
          self.$confirm('确定删除此房间吗？')
            .then(_ => {
              delRoom(data).then(function (response) {
                if (response.data && response.data.code === 1) {
                  self.$message({
                    message: '删除已完成',
                    type: 'success'
                  });
                  self.loadData(self.offset, self.limit);
                } else {
                  self.$message({
                    message: response.data.message,
                    type: 'error'
                  });
                }
                return false;
              }).catch(function (a) {
                console.error(a);
              }).finally(_=>{
                self.loading = false;
              })
            })
            .catch((a) => {
              console.error(a);
              self.loading = false;
            });
        }
      },
      initNode: function (data) {
        let self = this;
        if (data) {
          dropdownNodeComplex({communityId: data}).then(function (response) {
            if (response.data && response.data.code==1) {
              self.roomOptions = response.data.dataList;
            }
          }).catch(function (a) {
            console.error(a)
          });
        }
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
        if (data.parentId != -1) {
          this.searchForm.nodeId = data.value;
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
      clearRoom:function(){
        this.searchForm.nodeId = '';
        this.searchForm.room = '';
      },
    },
    mounted() {
      this.loadData();
      this.initNode(this.communityId)
    },
    data() {
      return {
        popoverShow:false,
        showModal: false,
        showEdit: false,
        roomOptions:[],
        roomUseStatusOptions:[
          {value:1,label:'空置'},
          {value:2,label:'自住'},
          {value:3,label:'租住'},
          {value:4,label:'借住'}
        ],
        roomPropertyOptions:[
          {value:1,label:'商品房'},
          {value:2,label:'经适房'},
          {value:3,label:'房改房'},
          {value:4,label:'其他'}
        ],
        rowData: {},
        searchForm:{
          communityId:null,
          roomUse:null,
          roomUseStatus:null,
          roomProperty:null,
          nodeId:null,
          room:''
        },
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: 'leaf'
        },
        roomUseTypeOptions: [
          {value: 1, label: '住宅'},
          {value: 2, label: '工业'},
          {value: 3, label: '商业'},
          {value: 4, label: '仓库'},
          {value: 5, label: '办公'},
          {value: 6, label: '商住混用'},
          {value: 7, label: '其他'},
        ],
      }
    }
  }
</script>

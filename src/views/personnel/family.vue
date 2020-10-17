<template>
  <div>
    <div class="app-container">
      <div class="control-panel">
        <el-form :model="form" ref="form" inline>
          <el-form-item label="姓名" prop="householdName">
            <el-input placeholder="请输入" v-model="form.householdName" :maxlength="15" clearable/>
          </el-form-item>
          <el-form-item label="手机号码" prop="cellphoneNumber">
            <el-input placeholder="请输入" v-model="form.cellphoneNumber" :maxlength="11" type="tel" clearable/>
          </el-form-item>
          <span class="control-right">
            <el-button @click="handleReset()">重置</el-button>
            <el-button type="primary"  @click="loadData()">搜索</el-button>
          </span>
        </el-form>
      </div>
      <div class="table-container" v-loading="loading">
        <div class="table-control-panel clearfix">
          <span class="control-left list-title">
            人员列表 <label>{{nodeName || ''}}</label>
          </span>
          <span class="control-right">
            <el-button type="primary" icon="el-icon-plus" @click="showDialog">新增人员</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="showExport=true">批量导入</el-button>
          </span>
        </div>
        <el-row>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              
               
              width="60"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="householdName"
               
              
              width="120"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              
               
              width="120"
              label="手机号码">
            </el-table-column>
            <el-table-column
              prop="roomCount"
              
               
              width="100"
              label="关联房间数量">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="tabRoom(scope.row.householdId)"
                  size="small">
                  {{ scope.row.roomCount}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="cardCount"
               
              
              width="90"
              label="门禁卡数量">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="tabCard(scope.row.householdId)"
                  size="small">
                  {{ scope.row.cardCount}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="citizenId"
              
              min-width="120"
               
              label="身份证号码">
              <template slot-scope="scope">
                {{ scope.row.citizenId | formatCitizenId}}
              </template>
            </el-table-column>
            <el-table-column
              prop="applyTime"
               
              
              min-width="100"
              label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.applyTime | formatDateTimeWithDot }}
              </template>
            </el-table-column>
            <el-table-column
              
              label="操作"
               
              width="120"
              fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleEdit(scope.row.householdId)"
                  size="small">
                  查看
                </el-button>
                <!-- <el-button
                  type="text"
                  @click="handleDel(scope.row.householdId, scope.row.householdName)"
                  size="small">
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
            :current-page.sync="page"
            layout="prev, pager, next, slot"
            :total="totalRecord">
            <label class="page-slot-left">共计<label> {{totalRecord}} </label>条数据</label>
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showModal">
      <el-dialog
        title="新增住户"
        :visible.sync="showModal"
        width="1011px"
        :close-on-click-modal="false">
        <add-household/>
      </el-dialog>
    </div>

    <div v-if="showExport">
      <el-dialog
        title="批量导入住户"
        :show-close="false"
        :visible.sync="showExport"
        width="400px"
        :close-on-click-modal="false">
        <exp/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import dateUtil from "@/utils/times";
  import addHousehold from "./components/addHousehold.vue";
  import exp from "./import.vue";
  import country from "@/utils/country";
  import certificateType from "@/utils/certificateType";
  import {fetchFamilyList, delAllHousehold} from "@/api/household"
  import {formatDateTimeWithDot} from "@/filters/index"
  import {formatCitizenId} from "@/filters/citizenId"
  import {mapGetters} from 'vuex'
  import mixin from "@/utils/mixin";

  export default {
    mixins: [mixin],
    components: {
      addHousehold,
      exp
    },
    inject:['reloadTree'],
    filters: {
      formatDateTimeWithDot,
      formatCitizenId
    },
    computed:{
      ...mapGetters([
        'nodeId',
        'node',
        'nodeName',
        'communityId'
      ]),
    },
    watch:{
      nodeId:function(newValue, oldValue){
        if(newValue !== oldValue){
          this.loadData()
        }
      }
    },
    methods: {
      handleReset:function(){
        this.$refs.form.resetFields();
        this.loadData();
        this.reloadTree();
      },
      showDialog: function () {
        this.showModal = true;
        this.detailId = null;
        this.detailRoomNodeId = null;
      },
      handleClose: function () {
        this.loadData();
        this.showModal = false;
        this.showExport = false;
        this.detailId = null;
        this.detailRoomNodeId = null;
      },
      handleDel: function (householdId, householdName) {
        let self = this;
        if (householdId) {
        self.loading = true;
          self.$confirm('确定删除此人员吗？')
            .then(_ => {
              delAllHousehold({
                householdId: householdId,
                householdName: householdName
              }).then(function (response) {
                if (response && response.data.code === 1) {
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
                self.loading = false;
              })
            })
            .catch((a) => {
              self.loading = false;
            });
        } else {
          self.$message({
            message: '该记录暂无法删除，请联系管理人员进行操作',
            type: 'error'
          });
        }
      },
      handleEdit: function(householdId) {
        let query = {
          householdId: householdId, 
          communityId: this.communityId
        }

        if(this.node && this.node.type == 'R'){
          query.roomNodeId = this.node.id
        }
        this.$router.push({ path: '/household/familyEdit', query: query})
      },
      cancelQuest() {
        if (typeof this.source === 'function') {
          this.source('终止请求'); //取消请求
        }
      },
      cancelQuest() {
        if (typeof this.source === 'function') {
          this.source('终止请求'); //取消请求
        }
      },
      loadData: function (offset=0, limit=10) {
        this.cancelQuest() // 请求发送前调用
        let self = this;
        self.loading = true;
        self.form.offset = offset;
        self.form.limit = limit;
        
        let nodeObj= {}
        if(self.node){
          nodeObj = {nodeId: self.node.id}
        }
        fetchFamilyList({...self.form, ...nodeObj, communityId: self.communityId}, this).then(function (response) {
          if(response.data && response.data.code===1){
            self.tableData = response.data.dataList || [];
            self.totalRecord = response.data.totalCount;
            self.loading = false;

            offset==0 && self.pageReset()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      tabRoom:function(householdId){
        let query = {
          householdId: householdId, 
          communityId: this.communityId,
          tab: 'room'
        }

        if(this.node && this.node.type == 'R'){
          query.roomNodeId = this.node.id
        }
        this.$router.push({ path: '/household/familyEdit', query: query })
      },
      tabCard:function(householdId){
        let query = {
          householdId: householdId, 
          communityId: this.communityId,
          tab: 'card'
        }

        if(this.node && this.node.type == 'R'){
          query.roomNodeId = this.node.id
        }
        this.$router.push({ path: '/household/familyEdit', query: query})
      }
    },
    mounted() {
      this.loadData();
    },
    data() {
      return {
        showModal: false,
        showExport:false,
        nationalityList:country,
        certificateTypeList:certificateType,
        form:{
          householdName:'',
          cellphoneNumber:''
        },
        source:null
      }
    }
  }
</script>

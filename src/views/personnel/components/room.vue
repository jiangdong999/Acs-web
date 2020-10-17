<template>
  <div class="table-container" v-loading="loading">
    <!-- <span class="control-right">
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px">新增房间</el-button>
    </span> -->
    <el-row>
      <el-table :data="tableData" stripe>
        <div slot="empty" class="empty-table"></div>
        <el-table-column
          type="index"
          :index="indexMethod"
          
           
          width="60" label="序号">
        </el-table-column>
        <el-table-column
          prop="householdName"
          
          min-width="120"
           
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="householdType"
          
          min-width="100"
           
          label="住户类型">
          <template slot-scope="scope">
            {{ scope.row.householdType | transHouseholdType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fullNodeName"
          
          min-width="200"
           
          label="房屋位置">
        </el-table-column>
        <el-table-column
          prop="timeoutCallNumber"
          min-width="200"
          
           
          label="电话开门号码">
        </el-table-column>
        <el-table-column
          prop="allowPstn"
          
          min-width="100"
           
          label="电话开门状态">
          <template slot-scope="scope">
            {{ scope.row.allowPstn | transStatus}}
            <el-switch
              v-model="scope.row.allowPstn"
              @change="changePstnStatus(scope.row)"
              active-value='1'
              inactive-value='0'
              active-color="#66DDDB"
              inactive-color="#dcdfe6">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="allowApp"
          
          min-width="100"
           
          label="APP授权">
          <template slot-scope="scope">
            {{ scope.row.allowApp | transStatus}}
            <el-switch
              v-model="scope.row.allowApp"
              @change="changeAppStatus(scope.row)"
              active-value='1'
              inactive-value='0'
              active-color="#66DDDB"
              inactive-color="#dcdfe6">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          
           
          min-width="200"
          label="居住时间">
          <template slot-scope="scope">
            {{ scope.row.leaseStartTime | formatDateTimeWithDot}} - {{scope.row.leaseEndTime | formatDateTimeWithDot}}
            <el-button
            type="text"
            v-if="scope.row.householdType=='3'"
            @click="handleEdit(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyTime"
          
           
          min-width="200"
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.applyTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column
          
          label="操作"
          fixed="right"
           
          min-width="150">
          <template slot-scope="scope">
            <el-button
            type="text"
            @click="handleAdd(scope.row)">
              新增门卡
            </el-button>
            <el-button
            type="text"
            @click="handleDel(scope.row.householdId, scope.row.roomNodeId, scope.row.householdName)">
              删除
            </el-button>
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
        layout="prev, pager, next, slot"
        :total="totalRecord">
        <label class="page-slot-left">共计<label> {{totalRecord}} </label>条数据</label>
      </el-pagination>
    </div>

    <div v-if="showModal">
      <el-dialog
        title="编辑租客有效时间"
        :visible.sync="showModal"
        width="70%"
        :close-on-click-modal="false">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules" inline>
          <div style="line-height:34px">
            c
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit()" :loading="btnLoading">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <div v-if="showCard">
      <el-dialog
        title="新增门卡"
        :visible.sync="showCard"
        width="70%"
        :close-on-click-modal="false">
        <add-card :defaultCardNode="defaultCardNode" @updateCardList="$emit('updateCardList')" @close="handleClose()"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {delCard} from "@/api/card";
import {delHousehold} from "@/api/household"
import {roomList, changePstnStatus, changeAppStatus, EditLease} from "@/api/personnel";
import {formatDateTime, formatDateTimeWithDot, transHouseholdType} from "@/filters/index"
import {beforePickerOptions, afterPickerOptions2} from "@/utils/validate";
import dateUtil from "@/utils/times";
import mixin from "@/utils/mixin";
import addCard from "./components/addCard";

export default {
  mixins: [mixin],
  components:{addCard},
  data(){
    return {
      showModal: false,
      showCard: false,
      btnLoading:false,
      form:{
        leaseStartTime:'',
        leaseEndTime: '',
      },
      defaultCardNode:{},
      rules:{
        leaseStartTime: [
          {required: true, message: '请输入人员起始日期', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请输入人员结束日期', trigger: 'blur'}
        ],
      }
    }
  },
  filters:{
    formatDateTime,
    formatDateTimeWithDot,
    transHouseholdType,
    transStatus:function(value){
      return value=="0"?'已禁用':'已开启'
    }
  },
  methods:{
    beforePickerOptions,
    afterPickerOptions2,
    loadData: function (offset, limit) {
      let self = this;
      self.loading = true;
      let searchParams = {};

      searchParams.communityId = self.$route.query.communityId;
      searchParams.householdId = self.$route.query.householdId;
      searchParams.offset = offset || (self.page - 1) * self.limit;
      searchParams.limit = limit || 10;
      roomList(searchParams).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.tableData = response.data.dataList || [];
          self.totalRecord = response.data.totalCount;
          self.loading = false;

          offset==0 && self.pageReset()
        } else {
          self.$message({
            message: response.data.message,
            type: 'error'
          });
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    handleDel: function (householdId, nodeId, householdName) {
      let self = this;
      self.loading = true;
      if (householdId && nodeId) {
        self.$confirm('确定删除此人员吗？')
          .then(_ => {
            delHousehold({
              householdId: householdId,
              roomNodeId: nodeId,
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
      } else {
        self.$message({
          message: '该记录暂无法删除，请联系管理人员进行操作',
          type: 'error'
        });
      }
    },
    changeAppStatus:function(data){
      let self = this;
      changeAppStatus(data).then(function (response) {
        if (response.data && response.data.code === 1) {
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
      }).catch(function (a) {
        console.error(a);
      }).finally(_ =>{
        self.loadData()
      })
    },
    changePstnStatus:function(data){
      let self = this;
      changePstnStatus(data).then(function (response) {
        if (response.data && response.data.code === 1) {
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
      }).catch(function (a) {
        console.error(a);
      }).finally(_ =>{
        self.loadData()
      })
    },
    handleEdit:function({leaseStartTime, leaseEndTime, roomNodeId, householdId}){
      if (leaseStartTime) {
        this.form.leaseStartTime = dateUtil.toClientDate(leaseStartTime);
      }
      if (leaseEndTime) {
        this.form.leaseEndTime = dateUtil.toClientDate(leaseEndTime);
      }
      this.form.roomNodeId = roomNodeId;
      this.form.householdId = householdId;
      this.showModal = true;
    },
    handleSubmit:function(){
      let self = this;
      let data = {...this.form};
      self.$refs.form.validate(valid=>{
        if(valid){
          self.btnLoading = true
          data.leaseStartTime = dateUtil.toServerDateString(data.leaseStartTime);
          data.leaseEndTime = dateUtil.byPattern(data.leaseEndTime, "YYYYMMDD235959999") || '';
          EditLease(data).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.showModal = false;
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.$emit('upDateCardList')
            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_ =>{
            self.btnLoading = false
            self.loadData()
          })
        }
      })
    },
    handleAdd:function(data){
      this.defaultCardNode = data;
      this.showCard = true;
    },
    handleClose(){
      this.showCard = false
      this.loadData(self.offset, self.limit)
    }
  },
  mounted(){
    this.loadData()
  }
}
</script>

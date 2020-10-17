<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
          
            <span class="control-left list-title">工作人员列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-left">
              <el-button type="primary" class="jdaddbtn" icon="el-icon-plus" @click="addWorker()">新增工作人员</el-button>
            </span>

            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form :model="searchForm" ref="searchForm" inline>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="姓名" prop="householdName">
                          <el-input class="control-input" placeholder="请输入" clearable :maxlength="15" v-model="searchForm.householdName"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="工作职责" prop="duty">
                          <el-select v-model="searchForm.duty" placeholder="工作职责" filterable clearable>
                            <el-option
                              v-for="item in personTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>  
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="门禁卡号" prop="cardNo">
                          <el-input class="control-input" placeholder="请输入" clearable v-model="searchForm.cardNo"/>
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
              width="50" label="序号">
            </el-table-column>
            <el-table-column
              prop="householdName"
              min-width="80"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="duty"
              min-width="100"
              label="工作职责">
              <template slot-scope="scope">
                {{ scope.row.duty | transHouseholdDuty}}
              </template>
            </el-table-column>
            <el-table-column
              prop="cardNo"
              min-width="150"
              label="门禁卡号">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.cardNo || scope.row.cardNo.length==0"
                  type="text"
                  @click="addCardNo(scope.row)"
                  size="small">
                  添加
                </el-button>
                <template v-else>
                  {{scope.row.cardNo}}
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="gender"
              min-width="80"
              label="性别">
              <template slot-scope="scope">
                {{ scope.row.gender | transGender}}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              min-width="100"
              label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | formatDateTimeWithDot}}
              </template>
            </el-table-column>
            <el-table-column
              min-width="180"
              label="有效期限">
              <template slot-scope="scope">
                {{ scope.row.leaseStartTime | formatDateTimeWithDot}} - {{ scope.row.leaseEndTime | formatDateTimeWithDot}}
              </template>
            </el-table-column>
            <el-table-column
              prop="leaseStatus"
              min-width="120"
              label="工作人员状态">
               <template slot-scope="scope">
                {{ scope.row.leaseStatus }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="160">
              <template slot-scope="scope">
                <el-button
                type="text"
                @click="handleEdit(scope.row.householdId,scope.row.communityId)">
                  查看
                </el-button><el-button
                type="text"
                @click="showDelDiglog(scope.row)">
                  删除
                </el-button><el-button
                  type="text"
                  @click.stop="handleRenewal(scope.row)">
                  续期
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
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-if="showCardNo">
      <el-dialog
        title="添加门卡"
        :visible.sync="showCardNo"
        width="400px"
        top="25vh"
        :close-on-click-modal="false">
        <add-cardNo :data="rowData"/>
      </el-dialog>
    </div>
    <div v-if="showRenewal">
      <el-dialog
        title="工作人员续期"
        :visible.sync="showRenewal"
        top="25vh"
        width="400px"
        :close-on-click-modal="false">
        <renewal :data="rowData" @submitSuccess="handleClose()"/>
      </el-dialog>
    </div>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
      <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此工作人员吗？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="handleDel(objData)" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchWorkerList, delWorker} from "@/api/personnel"
import { dropdownNodeComplex } from "@/api/node";
import {personTypeOptions} from "@/utils/options";
import renewal from "./renewal";//续期弹层
import addCardNo from './components/addCardNo'
import {transGender, transHouseholdDuty} from "@/filters/household"
import {formatDateTimeWithDot} from "@/filters/index"
import {mapGetters} from 'vuex'
import mixin from "@/utils/mixin";

  export default {
    mixins: [mixin],
    name: 'Worker',
    components:{
      addCardNo,
      renewal
    },
    filters:{
      transGender,
      transHouseholdDuty,
      formatDateTimeWithDot
    },
    computed:{
      ...mapGetters([
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
    data(){
      return {
        objData:null,
        showDelDiglogFlag: false,
        personStatusList:[],
        personTypeOptions:[],
        showRenewal:false,//续期
        searchForm:{
          duty:'',
          householdName: '',
          cardNo:''
        },
        showCardNo: false,
        rowData:{}
      }
    },
    methods: {
      showDelDiglog(data){
        this.showDelDiglogFlag = true;
        this.objData = data
      },
      handleRenewal: function(data){//续期
        this.rowData = data
        this.showRenewal = true
      },
      addCardNo:function(row){//添加门禁卡
        this.showCardNo = true;
        this.rowData = row;
      },
      addWorker:function(){//新增工作人员
        this.$router.push({ path: "/village/addworkerstaff" });
      },
      handleClose: function () {
        this.loadData();
        this.showCardNo = false;
        this.showRenewal = false;//续期
      },
      loadData:function(offset=0, limit=10){
        let self = this;
        self.loading = true;
        self.searchForm.offset = offset;
        self.searchForm.limit = limit;

        fetchWorkerList({...self.searchForm, communityId: self.communityId}).then(function (response) {
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
      handleDel: function (data) {
        let self = this;
        self.loading = true;
            delWorker({...data, roomNodeId: -1}).then(function (response) {
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
              console.error(a);
              self.loading = false;
            }).finally(()=>{
              self.showDelDiglogFlag = false
            })
          
      },
      handleEdit: function(householdId,communityId) {
        localStorage.setItem('query',JSON.stringify({
        householdId: householdId,communityId: communityId, roomNodeId:'-1'
      }))
        this.$router.push({ path: '/village/editworkerstaff'})
      }, 
      handleReset:function(){
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      initNode: function (data) {
        let self = this;
        dropdownNodeComplex({communityId: self.community.communityId}).then(function (response) {
          if (response.data && response.data.code==1) {
          }
        }).catch(function (a) {
          console.error(a)
        });
      },
    },
    mounted(){
      this.personTypeOptions = personTypeOptions
      this.loadData()
      // this.initNode()
    },
    activated(){
      this.loadData(this.offset,this.limit);
    }
  }
</script>
<style lang="scss" scoped>
  .cell .el-button{
      border: none;
      margin-right:20px;
  }


</style>
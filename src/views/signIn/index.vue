<template>
    <div class="jdClass">
      <el-row class="app-container">
        <el-col :span="24">
          <div class="table-control-panel">
            <span class="control-left list-title">签到记录</span>
            <span class="control-left">
              当前设备：
              <span v-show="tabdeviceState">{{searchForm.deviceSn}}&nbsp;&nbsp;&nbsp;&nbsp;<span @click="tabDevice" style="color:#6699FF;cursor:pointer">切换设备</span></span>
              <span v-show="deviceState">
                <el-input type="text" v-model="valueDevice" clearable placeholder="请输入" style="width:150px;margin-right:20px"></el-input>
                <el-button @click="accountInfoRes()">取消</el-button>
                <el-button type="primary" @click="accountInfoDataAdd()">确定</el-button>
              </span>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form inline :model="searchForm" ref="searchForm">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="姓名" prop="realName">
                          <el-input placeholder="请输入" clearable v-model="searchForm.realName"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="身份证号" prop="cardNo">
                          <el-input placeholder="请输入" clearable :maxlength="18" v-model="searchForm.cardNo"/>　
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" v-if='checkoutSearch'>
                      <el-col :span="12">
                        <el-form-item label="健康宝状态" prop="healthState">
                          <el-select v-model="searchForm.healthState" placeholder="请选择" clearable>
                            <el-option
                              v-for="item in healthStateOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="手机号" prop="phone">
                          <el-input placeholder="请输入" clearable v-model="searchForm.phone"/>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" v-if='checkoutSearch'>
                      <el-col :span="24">
                        <el-form-item label="提交时间" class="jdClassTime">
                          <el-time-picker
                            is-range
                            arrow-control
                            :clearable="true"
                            :editable="false"
                            v-model="applyTimeNew"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            value-format="yyyyMMddHHmmssSSS"
                            >
                          </el-time-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>

                  
                    <span class="control-right jdClassbtn">
                      <el-button @click="handleReset()">重置</el-button>
                      <el-button type="primary" @click="loadData()">搜索</el-button>
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
      <div v-if="contentVisible">
        <div class="header">
          <el-row :gutter="20">
            <el-col :span="4" class="JdClassItem" style="background: #007ee4;border-radius: 4px;">
              <div class="no-sync" :class="{'checked': searchForm.statusId==1}" @click="repairStatusChg(1)" style="color:#fff">
                今日签到
                <div style="margin-left:20px">
                  <count-to :startVal="0" :endVal="parseInt(countData.onCount) || 0" :duration="2500"></count-to>
                </div>
              </div>
            </el-col>
            <!-- <el-col :span="4" class="JdClassItem offClass">
              <div class="ccc" :class="{'checked': searchForm.statusId==2}" @click="repairStatusChg(2)">
                已分配
                <div>
                  <count-to :startVal="0" :endVal="parseInt(countData.offCount) || 0" :duration="2500"></count-to>
                </div>
              </div>
            </el-col> -->
            <el-col :span="8" class="searchBtn">
              <!-- <el-button v-if="searchForm.statusId==1" :disabled="disabledStatus" :class="active" @click="InputNum">录入编号</el-button>
              <el-button v-if="searchForm.statusId==1" @click="InputAdd" type="primary" style="margin-right:20px;background: #fff;border-color: #007EE4;color: #007EE4;">手动录入</el-button> -->
              <el-button v-if="searchForm.statusId==1" @click="excelExportBTN" type="primary" style="background: #fff;border-color: #007EE4;color: #007EE4;">导出</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" class="jdContainer" v-loading="loading">
            <!-- 未分配 -->
            <div class="jdtable" v-show="checkoutA">
              <el-table stripe 
                :data="tableData" 
                ref="table"
                >
                <div slot="empty" class="empty-table"></div>
                <el-table-column
                  type="index"
                  :index="indexMethod"
                  width="60" label="序号">
                </el-table-column>

                <el-table-column
                  prop="realName"
                  min-width="60"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="cardNo"
                  min-width="150"
                  label="身份证号">
                </el-table-column>

                <el-table-column
                  prop="phone"
                  min-width="120"
                  label="手机号">
                  <!-- <template slot-scope="scope">
                    <span v-if="scope.row.phone === undefined">
                      <span @click.stop="addPhone(scope.row)" style="color:#2196F3;cursor:pointer">添加</span>
                    </span>
                    <span v-else @click.stop="addPhone(scope.row)" style="color:#2196F3;cursor:pointer">{{ scope.row.phone }}</span>
                  </template> -->
                </el-table-column>

              

                <el-table-column
                  prop="temperature"
                  min-width="80"
                  label="体温">
                </el-table-column>

                <el-table-column
                  prop="imageUrl"
                  min-width="100"
                  label="人脸照片">
                  <template slot-scope="scope">
                    <el-image                                  
                      :src="scope.row.imageUrl" 
                      fit="scale-down"
                      class="pic-col"       
                      v-if="scope.row.imageUrl != '' && scope.row.imageUrl != undefined"           
                      :preview-src-list="[scope.row.imageUrl]"
                    >
                      <div slot="error" class="image-slot">
                        <span class="img-err pic-col"></span>
                      </div>
                    </el-image>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="healthState"
                  min-width="100"
                  label="健康宝状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.healthState=='正常'">{{scope.row.healthState}}</span>
                    <span v-else style="color:#FF5555">{{scope.row.healthState}}</span>
                  </template>
                </el-table-column>


               

               

                <!-- <el-table-column
                  v-if='checkoutSearch'
                  prop="barCode"
                  min-width="80"
                  label="条码编号">
                </el-table-column> -->
                <el-table-column
                  prop="applyTime"
                  min-width="150"
                  label="签到时间">
                  <template slot-scope="scope">
                    {{scope.row.createTime | formatDateTime}}
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  type="expand"
                  width="50"
                  fixed="left"
                  label="展开"
                >
                  <template slot-scope="scope">
                    <el-form label-position="left" inline class="table-expand">
                      <el-row>
                        <el-col :span="20">
                          <el-form-item label="地址">
                            {{scope.row.address}}
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <template>
                            <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
                          </template>
                        </el-col>
                      </el-row>
                    </el-form>
                  </template>
                </el-table-column> -->
              </el-table>
            </div>
            <!-- 已分配 -->
            <div class="jdtable" v-show="checkoutB">
              <el-table stripe 
                :data="tableData" 
                @selection-change="handleSelectionChange"
                @row-click="tableRowClickB"
                ref="tableB">
                <div slot="empty" class="empty-table"></div>
                <el-table-column
                  type="index"
                  :index="indexMethod"
                  width="50" label="序号">
                </el-table-column>

                <el-table-column
                  prop="realName"
                  min-width="60"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="cardNo"
                  min-width="150"
                  label="身份证号">
                </el-table-column>

                <el-table-column
                  prop="phone"
                  min-width="120"
                  label="手机号">
                  <template slot-scope="scope">
                    <span v-if="scope.row.phone === undefined">
                      <span @click.stop="addPhone(scope.row)" style="color:#2196F3;cursor:pointer">添加</span>
                    </span>
                    <span v-else @click.stop="addPhone(scope.row)" style="color:#2196F3;cursor:pointer">{{ scope.row.phone }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="remark"
                  min-width="100"
                  label="备注">
                  <template slot-scope="scope">
                    <span v-if="scope.row.remark === undefined">
                      <span @click.stop="addRemark(scope.row)" style="color:#2196F3;cursor:pointer">添加</span>
                    </span>
                    <span v-else @click.stop="addRemark(scope.row)" style="color:#2196F3;cursor:pointer">{{ scope.row.remark }}</span>
                  </template>
                </el-table-column>


                <el-table-column
                  prop="temperature"
                  min-width="80"
                  label="体温">
                </el-table-column>
                <el-table-column
                  prop="healthState"
                  min-width="100"
                  label="健康宝状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.healthState=='正常'">{{scope.row.healthState}}</span>
                    <span v-else style="color:#FF5555">{{scope.row.healthState}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="imageUrl"
                  min-width="100"
                  label="人脸照片">
                  <template slot-scope="scope">
                    <el-image                                   
                      :src="scope.row.imageUrl" 
                      fit="scale-down"
                      class="pic-col"       
                      v-if="scope.row.imageUrl != '' && scope.row.imageUrl != undefined"             
                      :preview-src-list="[scope.row.imageUrl]"
                    >
                    <div slot="error" class="image-slot">
                      <span class="img-err pic-col"></span>
                    </div>
                    </el-image>
                  </template>
                </el-table-column>


                <el-table-column
                  v-if='checkoutSearch'
                  prop="barCode"
                  min-width="80"
                  label="条码编号">
                </el-table-column>
                
                <el-table-column
                  prop="applyTime"
                  min-width="150"
                  label="提交时间">
                  <template slot-scope="scope">
                    {{scope.row.applyTime | formatDateTime}}
                  </template>
                </el-table-column>
                <el-table-column
                  type="expand"
                  width="50"
                  fixed="left"
                  label="展开">
                  <template slot-scope="scope">
                    <el-form label-position="left" inline  class="table-expand">
                      <el-row>
                        <el-col :span="20">
                          <el-form-item label="地址">
                            {{scope.row.address}}
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <template>
                            <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
                          </template>
                        </el-col>
                      </el-row>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
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
            
          </el-col>
        </el-row>
      </div>
      
      <div v-else class="jdClassContent">
         请输入当前设备号
      </div>

      <el-dialog
        title="信息确认"
        :visible.sync="healthDetail"
        :closeOnClickModal="false"
        width="760px">
        <health-detail :data="multipleSelection" :healthDetail="healthDetail"></health-detail>
      </el-dialog>

      <el-dialog
        title="手动录入"
        :visible.sync="healthAdd"
        :closeOnClickModal="false"
        width="570px">
        <health-add :data="searchForm.deviceSn" :healthAdd="healthAdd"></health-add>
      </el-dialog>

      <el-dialog
        title="手机号码"
        :visible.sync="dialogFormVisible"
        :dialogFormVisible="false"
        :closeOnClickModal="false"
        width="300px">
          <el-form :model="Form" :rules="rules" ref="Form" v-loading="loading" @submit.native.prevent>
            <el-form-item label="请输入手机号码" class="jdclassPhone" prop="phone">
              <el-input v-model="Form.phone" type="text" clearable :maxlength="11" placeholder="请输入" @keyup.enter.native="dialogSubmit"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogSubmit">提交</el-button>
          </div>
      </el-dialog>

      <el-dialog
        title="备注"
        :visible.sync="dialogFormRemark"
        :dialogFormRemark="false"
        :closeOnClickModal="false"
        width="300px">
        <el-form :model="Form">
          <el-form-item label="请输入备注" class="jdclassPhone" v-loading="loading">
            <el-input v-model="Form.remark" type="textarea" :rows="2" :maxlength="30" style="width: 260px;" placeholder="最多输入30字"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogRemark">提交</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { formatDateTime,formatTimeMillisToDateTime,sysDateStringToPlainDateTime } from "@/filters/index";
import mixin from "@/utils/mixin";
//新
import countTo from 'vue-count-to'
// import healthDetail from './detail'
// import healthAdd from './add'
import { logList,accountInfo,logCount,accountAdd,logModify,logDelete,excelExport } from "@/api/health";
import { validateMobile } from "@/utils/rules";
import { healthStateOptions } from "@/utils/role"



  var date = new Date();
  var afterTime = date.setTime(date.getTime())//当前时间
  var beforeTime = date.setTime(date.getTime());//前一小时
  var afterTimeS = formatTimeMillisToDateTime(afterTime)//时间戳转日期
  var afterTimeSS = sysDateStringToPlainDateTime(afterTimeS)//日期转日期字符串
  var afterTimeSSS = afterTimeSS.substring(0,8)+'000000000'//处理一下8位  获取今天的0点0分0秒

  var beforeTimeS = formatTimeMillisToDateTime(beforeTime)//时间戳转日期
  var beforeTimeSS = sysDateStringToPlainDateTime(beforeTimeS)//日期转日期字符串
  var beforeTimeSSS = beforeTimeSS.substring(0,8)+'235959000'//处理一下17位


export default {
  mixins:[mixin],
  filters:{
    formatDateTime
  },
  components: {
    countTo,
    // healthDetail,
    // healthAdd
  },
  data() {
    return {
      contentVisible:false,
      dialogFormRemark:false,
      dialogFormVisible:false,
      healthStateOptions:[],//健康宝状态
      valueDevice:'',
      tabdeviceState:false,
      deviceState:false,
      healthDetail:false,//录入编号
      healthAdd:false,//手动录入
      loading:false,
      disabledStatus:true,
      active:'',
      checkoutA:true,
      checkoutB:false,
      checkoutSearch:true,
      applyTimeNew:[afterTimeSSS, beforeTimeSSS],//时间段
      searchForm:{
        realName:'',//姓名
        cardNo:'',//身份证号
        temperature:'',//体温
        statusId: '1',//表格类型
        healthState:'',//健康宝状态
        barCode:'',//条形码
        deviceSn:'',//当前的设备名字
        applyTime:'',
        startTime:'',//时间段开始
        endTime:'',//时间段结束
        username:'',//绑定用户
      },
      Form:{
        logId:'',
        phone:'',//手机号
        remark:'',//备注
      },
      
      multipleSelection: [],//复选框的数组
      countData: {
        onCount: '',
        offCount: '',
      },
      rules:{
        phone: [
          {required: true, validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    //导出数据
    excelExportBTN(){
      let self = this
      let searchParams = {...this.searchForm};
     
      excelExport(searchParams).then(function (response) {
        if (response && response.data.code === 1) {
          if(response.data.data != '' || response.data.data != null || response.data.data != undefined){  
            self.$message({
              message: '提交成功',
              type: 'success'
            });
            window.open(response.data.data)
          }
        }
      }).catch(function (a) {
        console.error(a);
      })
    

    },
    //手动录入
    InputAdd(){
      this.healthAdd = true
    },
    //删除
    handleDel:function(data){
      let self = this;
      self.$confirm('确定删除此人员吗？').then(_ => {
        self.loading = true;
        logDelete({
          deleted:0,
          logId: data.id,
        }).then(function (response) {
          if (response && response.data.code === 1) {
            self.$message({
              message: response.data.message,
              type: 'success'
            });
            self.loadData(self.offset, self.limit);
          } else {
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).finally(_=>{
          self.loading = false;
        })
      }).catch( (a) => {
        // console.log(a)
      })
    },
    //已分配点击行展开
    tableRowClickB(row, column, event){
      this.$refs.tableB.toggleRowExpansion(row);
    },
    //未分配点击行展开
    tableRowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row);
    },
    //点击手机号进行添加修改
    addPhone(data){
      this.dialogFormVisible = true
      this.Form.logId = data.id
      this.Form.phone = data.phone
    },
    //点击备注进行添加修改
    addRemark(data){
      this.dialogFormRemark = true
      this.Form.logId = data.id
      this.Form.remark = data.remark
    },
    //提交手机号
    dialogSubmit(){

      if(this.Form.phone === undefined || this.Form.phone.trim() == ''){
        this.$message('手机号不能为空');
        return false;
      }
      let obj ={
        'logId':this.Form.logId,
        'phone':this.Form.phone.trim()
      }
      let self = this
      this.$refs.Form.validate(valid => {
        if(valid){
          self.loading = true;
          logModify(obj).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: '提交成功',
                type: 'success'
              });
              self.dialogFormVisible=false
              self.loadData(self.offset, self.limit);
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_=>{
            self.loading = false;
          })
        }
      })
    },
    //提交备注
    dialogRemark(){      
      if(this.Form.remark === undefined || this.Form.remark.trim() == ''){
        this.$message('备注不能为空');
        return false;
      }
      let obj ={
        'logId':this.Form.logId,
        'remark':this.Form.remark.trim()
      }
      let self = this
      self.loading = true;
      logModify(obj).then(function (response) {
        if (response && response.data.code === 1) {
          self.$message({
            message: '提交成功',
            type: 'success'
          });
          self.dialogFormRemark=false
          self.loadData(self.offset, self.limit);
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      })
    },
    //显示录入编号
    InputNum(){
      this.healthDetail=true
    },
    //表格复选款
    handleSelectionChange(val) {
      this.multipleSelection = val;

      if(this.multipleSelection.length>0){
        this.disabledStatus = false
        this.active="active"
      }else{
        this.disabledStatus = true
        this.active=""
      }
    },
    //点击类型判断是否已检测
    repairStatusChg (statusId) {
      this.$refs.searchForm.resetFields();
      
      this.searchForm.statusId = statusId

      if(this.searchForm.statusId == '1'){
        // this.checkoutA = true
        // this.checkoutB = false
        // this.checkoutSearch = false
        this.loadData()
        
      }else if(this.searchForm.statusId == '2'){
        this.checkoutA = false
        this.checkoutB = true
        this.checkoutSearch = true
        this.loadData()
       
      }
    },  
    loadData:function(offset=0, limit=10){
      let self = this;
      self.loading = true;

      //提交时间 判断搜索按钮
      // console.log(this.applyTimeNew);
      if(this.searchForm.statusId == '1'){
        this.searchForm.startTime = afterTimeSSS
        this.searchForm.endTime = beforeTimeSSS
        this.applyTimeNew = [afterTimeSSS,beforeTimeSSS]
      }else if(this.searchForm.statusId == '2'){
        this.searchForm.startTime = this.applyTimeNew[0]
        this.searchForm.endTime = this.applyTimeNew[1]
      }
      //绑定用户
      let userName = this.$store.state.user.userName
      this.searchForm.username = userName
      
      //判断设备编码是否为空
      if(this.searchForm.deviceSn === ''){
        return false;
      }

      let searchParams = {...this.searchForm};

      searchParams.offset = offset || 0;
      searchParams.limit = limit || 10;
      
      logList(searchParams).then(function (response) {
        if (response && response.data.code === 1) {
          self.tableData = response.data.dataList || [];
          self.totalRecord = response.data.totalCount;
          self.loading = false;
          offset==0 && self.pageReset()//表格固定在第一页
        }
      }).catch(function (a) {
        console.error(a);
      })
      self.logCount()//数量
    },
    //数量
    logCount:function(){
      if(this.searchForm.deviceSn === ''){
        return false;
      }
      let obj={
        deviceSn:this.searchForm.deviceSn,
        username:this.$store.state.user.userName
      }
      let self = this;
      logCount(obj).then(function (response) {
        if (response && response.data.code === 1) {
          self.countData.onCount = response.data.data.unCheck
          self.countData.offCount = response.data.data.checked
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    
    //初始化设备号的数据
    accountInfoData:function(){
      
      let self = this;
      let userName = this.$store.state.user.userName
      let deviceSn = this.searchForm.deviceSn

      self.loading = true;
      let obj ={
        'username':userName,
        'deviceSn':deviceSn,
      }
      accountInfo(obj).then(function (response) {
        if (response && response.data.code === 1) {
          self.searchForm.deviceSn = response.data.data.deviceSn
          
          if(self.searchForm.deviceSn == ""){
            
            self.$message('当前设备不能为空');
            self.contentVisible=false//表格页面 v-if
            self.tabdeviceState=false//切换设备按钮 v-show
            self.deviceState=true//输入设备input  v-show
            self.loading = false;
            return false;
          }
             
          self.contentVisible=true//表格页面 v-if
          self.tabdeviceState = true//切换设备按钮 v-show
          self.deviceState=false//输入设备input  v-show
          self.loadData()//数据
          self.loading = false;//关闭loading 
        }
      }).catch(function (a) {
        // console.error(a);
      })
    },
    //重置
    handleReset:function(){
      this.$refs.searchForm.resetFields();
      this.searchForm.startTime = afterTimeSSS
      this.searchForm.endTime = beforeTimeSSS
      this.applyTimeNew=[afterTimeSSS,beforeTimeSSS]
      this.loadData()
    },
    //切换设备
    tabDevice(){
      this.tabdeviceState = false
      this.deviceState = true
      this.valueDevice = ''
    },
    //点击取消
    accountInfoRes(){
      this.tabdeviceState = true
      this.deviceState = false
      this.valueDevice = this.searchForm.deviceSn
    },
    //添加
    accountInfoDataAdd(){
      if( this.valueDevice.trim() == ""){
        this.$message('当前设备不能为空');
        return false;
      }

      this.tabdeviceState=true
      this.deviceState=false
      
      let userName = this.$store.state.user.userName
      let deviceSn = this.valueDevice.trim()
      this.searchForm.deviceSn = this.valueDevice.trim()

      let self = this;
      self.loading = true;
      let obj ={
        'username':userName,
        'deviceSn':deviceSn,
      }
      accountAdd(obj).then(function (response) {
        if (response && response.data.code === 1) {
          self.searchForm.deviceSn = response.data.data.deviceSn
          
          if(self.searchForm.deviceSn.trim() == ""){
            self.deviceState = true
            self.contentVisible = false
          }else{
            self.tabdeviceState = true
            self.contentVisible = true
          }

          self.loadData()//数据
          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a);
      })
    }
  },
  mounted() {
    this.accountInfoData();
    this.healthStateOptions = healthStateOptions
  },
  activated(){
    this.loadData(this.offset,this.limit);
  },
}
</script>

<style scoped>

.table-control-panel{
  padding: 10px 30px;
  background: #fff;
}
.control-left{
  margin-right: 20px;
}
.jdaddbtn{
  padding: 10px;
}
.jdIconSize {
  font-size: 20px;
  margin-right: 4px;
}
.jdbtn {
  float: right;
  font-size: 12px;
  color: #0074da;
  cursor: pointer;
  border: none;
}
.jdtable{
  margin: 0px 30px 0 30px;
}
.jdContainer{
  background: #fff;
  padding-bottom: 30px;
}
.jdbtn{
  margin-right: 0px;
}
.control-right{
  margin-right: 0px;
}
.header{
  text-align: center;
  line-height: 30px;
  padding: 20px 30px 20px 30px;
  background: #fff;
}
.JdClassItem{
    font-size: 14px;
    cursor: pointer;
    color: #fff;
    width: 200px;
    height: 56px;
    margin-right: 20px;
    position: relative;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
.JdClassItem>div{
  width: 200px;
  height: 56px;
  font-weight: 500;
  font-size: 18px;
  line-height: 56px;
  border-radius: 4px;
  position: relative;
  text-align: left;
  padding: 0 20px;
}
.JdClassItem>div>div{
  font-size: 18px;
  position: absolute;
  left: 90px;
  top: 0px;
}
.no-sync{background: linear-gradient(#ffc24c1a, #ffc24c1a);color:#F9AC00;}
.ccc{background: linear-gradient(#007ee41a, #007ee41a);color:#007ee4 ;}
.checked:before{
  content:'';
  display: inline-block;
  width: 20px;
  height: 20px;
  /* background-image: url('../../assets/icon/checked.png'); */
  background-size: contain;
  position: absolute;
  right: 9px;
  top: 17px;
}
.onClass .checked{
  background: linear-gradient(#FFC24C, #FFAA20);
  color:#fff;;
}
.offClass .checked{
  background: linear-gradient(#007ee4, #007ee4);
  color:#fff;;
}
.searchBtn{
  float: right;
  margin-right: -10px;
  height: 44px;
  line-height: 44px;
}
.searchBtn button{
  background:#ecf0f7;
  color: #aaa;
  font-size: 14px;
  margin-top: 20px;
  border-color: #ecf0f7;
  width: 116px;
  text-align: center;
  border-radius: 4px;
  float: right;
}
.searchBtn .active{
  background:#007ee4;
  color: #fff;
  border-radius: 4px;
}
.header .el-row{
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.searchBtn button:hover{
  background: #ecf0f7;
}
.searchBtn .active:hover{
  background: #007ee4;
}
.jdClassContent{
  width:100%;
  height:500px;
  text-align:center;
  line-height:500px;
  font-size:30px;
  color: #9e9e9e;
}
.page-container{
  padding-right: 30px;
}
</style>
<style>
.jdtable .DisabledSelection{
  position:relative;
}
.jdtable .DisabledSelection .el-checkbox:before{
  content:"全选";
  position:absolute;
  left: 20px;
}
.jdClassTime .el-input__inner{
  width: 100% !important;
}
.el-table th {
  background: #f0f2f5;
  padding: 10px 0 !important;
}
.jdClass .el-form-item__label {
  display: block !important;
  width: 80px !important;
  text-align: left;
  /* margin-left: 20px; */
}
.jdClass .el-form-item__content {
  /* margin-left: 20px; */
}
.jdClass .el-popover {
  padding: 0px;
}
.jdClassbtn {
  margin-right: 0px;
  margin-top: 60px;
}
.jdPopper {
  box-shadow: 0px 4px 16px #dedede;
}

.jdClass .el-dialog__body{
  padding: 0px !important;
}
.jdclassPhone {
  margin-top: 20px;
}
.jdclassPhone .el-form-item__label{
  width: 110px !important;
}
.jdClass .table-expand .el-form-item__label{
  float: left;
  width: 50px !important;
  text-align: center;
  margin-left: 0px;
}
.jdClass .table-expand button{
  margin-top: 10px;
  color: #FF5555;
}
</style>
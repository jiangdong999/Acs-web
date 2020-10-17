<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">

            <span class="control-left list-title">客户端通知列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-left">
              <el-button type="primary" icon="el-icon-plus" @click="showDialog">新增通知</el-button>
            </span>

            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form :inline="true"  ref="searchForm" :model="searchForm">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="通知类型" prop="contextType">
                            <el-select v-model="searchForm.contextType" filterable clearable placeholder="请选择">
                              <el-option value="1" label="文字"></el-option>
                              <el-option value="2" label="图片"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="通知标题" prop="title">
                            <el-input placeholder="请输入" clearable  v-model="searchForm.title"/>
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
              prop="communityName"
              min-width="200"
              label="小区名称">
            </el-table-column>
            <el-table-column
              prop="applyTime"
              min-width="160"
              label="发布时间">
              <template slot-scope="scope">
                {{ scope.row.applyTime | formatDateTime }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              min-width="120"
              label="通知类型">
              <template slot-scope="scope">
                {{ scope.row.contextType | filterContextType }}
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              min-width="200"
              label="通知标题">
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="140">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleView(scope.row)"
                  size="small">
                  查看
                </el-button>
                <el-button
                  type="text"
                  @click="showDelDiglog(scope.row)"
                  size="small">
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
            layout="prev, pager, next"
            :total="totalRecord">
          </el-pagination>
        </div>
      </div>
    </div>

    <div v-if="showModal1">
      <el-dialog
        title="新增客户端通知"
        :visible.sync="showModal1"
        width="70%"
        :close-on-click-modal="false">
        <notice-form @close="handleClose"/>
      </el-dialog>
    </div>

    <div v-if="showModal2">
      <el-dialog
        title="查看客户端通知"
        :visible.sync="showModal2"
        width="50%"
        :close-on-click-modal="true">
        <notice-view :content="notice"/>
      </el-dialog>
    </div>
    <el-dialog title="温馨提醒" width="400px" :visible.sync="showDelDiglogFlag">
      <div style="text-align:center;margin-bottom:40px">
        <i class="iconfont icon-jinggao" style="font-size:94px;color:#FF5555"></i>
      <p style="font-size:20px;font-weight:500;color:#343e4c">确认删除此公告吗？</p>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="showDelDiglogFlag=false">取消</el-button>
        <el-button type="primary" @click="delNotice(objData)" :loading="loading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import noticeForm from "./components/noticeForm.vue";
  import noticeView from "./components/noticeView.vue";
  import {normalNoticeList, delNormalNotice} from "@/api/notice";
  import {formatDateTime} from "@/filters/index";
  import { mapGetters } from 'vuex';
  import mixin from "@/utils/mixin";

  export default {
    mixins: [mixin],
    components: {
      noticeForm,
      noticeView
    },
    computed:{
      ...mapGetters([
        'communityId'
      ])
    },
    filters: {
      formatDateTime: formatDateTime,
      filterContextType(value){
        switch(value){
          case '1': return '文字';
          case '2': return '图片';
        }
      }
    },

    methods: {
      showDelDiglog(data) {
      this.showDelDiglogFlag = true;
      this.objData = data
    },
      handleReset: function () {
        this.$refs.searchForm.resetFields();
        this.loadData();
      },
      showDialog: function () {
        this.showModal1 = true;
      },
      handleClose: function () {
        this.loadData(this.offset, this.limit)
        this.showModal1 = false;
      },
      loadData: function (offset=0, limit=10) {
        let self = this;
        self.loading = true;
        self.searchForm.offset = offset;
        self.searchForm.limit = limit;
        self.searchForm.communityId = self.communityId;

        normalNoticeList(self.searchForm).then(function (response) {
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
      handleView:function(data){
        this.showModal2 = true
        this.notice = data
      },
      delNotice:function(data){
        let self = this;
        if (data.id) {
          self.loading = true;
              delNormalNotice(data).then(function (response) {
                if (response && response.data.code === 1) {
                  self.$message({
                    message: '删除已完成',
                    type: 'success'
                  });
                  self.loadData(self.offset, self.limit);
                }
              }).catch(function (a) {
                console.error(a);
              }).finally(_=>{
                self.loading = false;
                self.showDelDiglogFlag = false
              })
            
        }
      }
    },
    mounted() {
      this.loadData();
    },
    data() {
      return {
        objData:null,
        showDelDiglogFlag:false,
        showModal1: false,
        showModal2:false,
        notice:{},
        searchForm:{
          title:'',
          contextType: '',
        },
      }
    }
  }
</script>

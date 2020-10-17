<template>
  <div class="app-container">
    <el-row :span="24">
      <el-col>
        <div class="table-control-panel">
          <span class="control-left list-title">基本配置列表</span>
          <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
          <span class="control-right">
            <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
              <div class="control-panel jdClass">

                <el-form ref="searchForm" :model="searchForm" :inline="true">
                  <el-row>
                    <el-form-item label="小区名称" class="room-place" prop="communityName">
                      <el-input placeholder="请输入" style="width:360px" clearable v-model="searchForm.communityName"/>　
                    </el-form-item>      
                  </el-row>
                  <span class="jdClassbtn">
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
    <div class="table-container" v-loading="loading">
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
            prop="communityName"
            min-width="100"
            label="小区名称">
          </el-table-column>     
          <el-table-column
            label="操作"
            fixed="right"
            min-width="80">
            <template slot-scope="scope">
              <el-row class="bthclass">
                <el-button
                  type="text"
                  @click="openConfig('basicModal',scope.row)">
                  <i class="iconfont icon-jiben"></i>基本信息
                </el-button>
                <el-button
                  type="text"
                  @click="openConfig('appModal',scope.row)">
                  <i class="iconfont icon-APP"></i>APP配置
                </el-button>
                <el-button
                  type="text"
                  @click="openConfig('faceModal',scope.row)">
                  <i class="iconfont icon-shualian"></i>刷脸配置
                </el-button>
              </el-row>
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
    <div v-if="basicModal">
      <el-dialog
        title="基本信息"
        width="550px"
        :visible.sync="basicModal"
        :close-on-click-modal="false">
        <basic-opera :rowData="rowData" @close="handleClose('basicModal')"/>
      </el-dialog>
    </div>
    <div v-if="appModal">
      <el-dialog
        title="App配置"
        width="790px"
        :visible.sync="appModal"
        :close-on-click-modal="false">
        <app-config :rowData="rowData" @close="handleClose('appModal')"/>
      </el-dialog>
    </div>
    <div v-if="faceModal">
      <el-dialog
        title="刷脸配置"
        width="400px"
        :visible.sync="faceModal"
        :close-on-click-modal="false">
        <face-config :rowData="rowData" @close="handleClose('faceModal')"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mixin from "@/utils/mixin"
import basicOpera from './components/basicOpera'
import appConfig from './components/appConfig'
import faceConfig from './components/faceConfig'
import { queryCommunity,loadList } from "@/api/community"

export default{
  name: 'basicSetting',
  mixins: [mixin],
  components: {
    basicOpera,
    appConfig,
    faceConfig,    
  },
  data () {
    return {
      searchForm: {
        communityName: '',
      },
      tableData: [
        {communityName: '1'}
      ],
      basicModal: false,
      appModal: false,
      faceModal: false,
      rowData: {}
    } 
  },
  computed:{
    ...mapGetters([
      'communityList'
    ])
  },
  created () {
    this.loadData()
  },
  methods: {   
    handleClose (modal) {
      this[modal] = false
    },
    //重置
    handleReset (){
      this.$refs.searchForm.resetFields()
      this.loadData()
    },
    // formatData (data) {
    //   data.map(item=>{
    //     item.isIdcard==='1' ? item.isIdcard = '身份证信息' : item.isIdcard = ''
    //     item.isInfo==='1' ? item.isInfo = '其他信息': item.isInfo = ''
    //     return item
    //   })      
    // },
    //搜索
    loadData (offset=0, limit=10) {
      let self = this
      self.loading = true
      let searchParams = {
        ...self.searchForm, 
      };
      searchParams.offset = offset
      searchParams.limit = limit
      loadList(searchParams).then(function (response) {
        if (response.data && response.data.code==1) {
          self.tableData = response.data.dataList || []
          self.totalRecord = response.data.totalCount
          self.loading = false

          // 当从零查询，则重置页码
          offset==0 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a)
      })
    },
    openConfig (modal,data) {
      this[modal] = true
      this.rowData = data  
    },
  }
}
</script>
<style lang="scss" scoped>
.icon-jiben,.icon-APP,.icon-shualian{
  color: #C2C6CC;
  font-size: 13px;
}
.bthclass .el-button{
  margin-right: 30px;
}

.iconfont {
  margin-right: 10px;
}
</style>
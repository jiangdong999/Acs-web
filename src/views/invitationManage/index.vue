<template>
  <div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">访客记录</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                  <el-form ref="searchForm" :model="searchForm" :inline="true">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item class="roomLabel room-place" label="拜访房屋" prop="room">
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
                              placeholder="关联房间"
                              v-model="searchForm.room"
                              v-popover:popover
                              style="width:360px"
                              clearable 
                              @clear="clearRoom"
                              suffix-icon="el-icon-arrow-down">
                            </el-input>
                          </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="访客姓名" prop="visitor_name">
                          <el-input v-model="searchForm.visitor_name" clearable placeholder="请输入"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">

                        <el-form-item label="手机号码" prop="visitor_phone">
                          <el-input v-model="searchForm.visitor_phone" clearable placeholder="请输入"/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="访客类型" prop="visit_type">
                          <el-select v-model="searchForm.visit_type" placeholder="选择访客类型" clearable>
                            <el-option
                              v-for="item in visiteType"
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
                      <el-button type="primary"  @click="search()">搜索</el-button>
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
    </div>
    <div class="calculate">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="num-box blue" :class="{'checked':!searchForm.start_time}" @click="searchToday('','')">
            <span>访客总数</span>
            <span>{{statistics.totalCount}}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="num-box yellow" :class="{'checked':searchForm.start_time}" @click="searchToday(start,end)">
            <span>今日访客</span>
            <span>{{statistics.todayCount}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
      <div class="control-panel">
        
        <div class="table-container" v-loading="loading">
          <el-row>
            <el-table :data="tableData" stripe ref="table">
              <div slot="empty" class="empty-table"></div>
              <el-table-column
                type="index"
                :index="indexMethod"
                width="60" label="序号">
              </el-table-column>
              <el-table-column
                prop="visitor_name"
                min-width="120"
                label="访客姓名">
              </el-table-column>
              <el-table-column
                prop="visit_type"
                min-width="100"
                label="访客类型">
                <template slot-scope="scope">{{scope.row.visit_type | transVisitType}}</template>
              </el-table-column>  
              <el-table-column
                prop="visitor_phone"
                min-width="120"
                label="手机号码">
              </el-table-column>  
              <el-table-column
                prop="citizen_id"
                min-width="120"
                label="身份证号码">
              </el-table-column>  
              <el-table-column
                prop="visit_time"
                min-width="120"
                label="来访时间">
                <template slot-scope="scope">{{scope.row.visit_time | formatDateTimeHHmm}}</template>
              </el-table-column>         
              <!-- <el-table-column
                prop="community_name"
                
                min-width="100"
                 
                label="所属小区">
              </el-table-column> -->
              <el-table-column
                prop="room_full_name"
                min-width="140"
                label="拜访房屋">
              </el-table-column> 
              <el-table-column
                prop="health_state"
                min-width="140"
                label="健康宝状态">
                <template slot-scope="scope">
                  {{scope.row.health_state | transHealthState}}
                </template>
              </el-table-column> 
              <el-table-column
                prop="temperature"
                min-width="140"
                label="体温（℃）">
              </el-table-column>                                    
              <el-table-column
                prop="aa"
                min-width="100"
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleFetch(scope.row)">查看</el-button>
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { fetchList, fetchStatistic } from "@/api/invitation"
  import {dropdownNodeComplex} from "@/api/node"
  import mixin from "@/utils/mixin"
  import dateUtil from '@/utils/times'
  import {transVisitType,transHealthState} from "@/filters/visitor"

  export default{
    name: 'invitation',
    mixins:[mixin],
    filters: {
      transVisitType,
      transHealthState
    },
    data () {
      return {
        popoverShow:false,
        filterText:'',
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf: 'leaf'
        },
        visiteType: [
          {value: 1, label: '访客登记'},
          {value: 2, label: '住户邀请'},
        ],
        roomOptions:[],
        tableData: [],
        searchForm: {
          community_id:null,
          room:'',
          room_node_id: null,
          visitor_name: '',
          visitor_phone: '',
          visit_type: '',
          start_time: '',
          end_time: '',
        },
        statistics: {
          totalCount: null,
          todayCount: null
        },
        start: '',
        end: '',
      }
    },
    computed: {
      ...mapGetters([
        'communityId'
      ]),
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val);
      }
    },
    created () {
      let _this = this
      _this.$nextTick(()=>{
        this.loadData()
        this.fetchCount()
        this.initNode()
        this.getTodayTime()
      })
    },
    methods: {
      searchToday (startTime,endTime) {
        this.searchForm.start_time = startTime
        this.searchForm.end_time = endTime
        this.loadData()
      },
      // 获取今日时间
      getTodayTime () {
        this.start = `${dateUtil.toServerDateString(new Date()).slice(0,8)}000000000`
        this.end = `${dateUtil.toServerDateString(new Date()).slice(0,8)}235959000`
      },
      search () {
        this.loadData()
        this.fetchCount()
      },
        //查看
      handleFetch (data) {
        
localStorage.setItem('query',JSON.stringify({
        room_full_name: data.room_full_name,
            visit_time: data.visit_time,
            community_id: data.community_id,
            id: data.id,
            visit_type: data.visit_type
      }))
        this.$router.push({
          path: '/epidemic/details'
        })
      },
        //重置
      handleReset () {
        let _this = this
        _this.$nextTick(()=>{
          _this.$refs.searchForm.resetFields()
          _this.searchForm.room_node_id = null
          _this.roomOptions = []
          _this.loadData()
          this.initNode();
        })
        
      },
      clearRoom (){
        this.searchForm.room_node_id = ''
        this.searchForm.room = ''
      },
      clearCommunity(){
        this.roomOptions = []
        this.clearRoom()
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      loadNode(node, resolve) {
        if(node.data.children && node.data.children.length>0){
          let data = node.data.children

          for(let children of data){
            children.leaf = !children.disabled
          }
          resolve(data)
        }
      },
      initNode: function () {
        let self = this
        this.searchForm.room = ''
        dropdownNodeComplex({communityId: self.communityId}).then(function (response) {
          if (response && response.data) {
            self.roomOptions = response.data.dataList;
          }
        }).catch(function (a) {
          console.error(a)
        })
      },
      handleNodeClick(data) {
        if (data.parentId != -1) {
          this.searchForm.room_node_id = data.value;
          this.searchForm.room = data.nodeLabel;
          this.popoverShow = data.disabled 
        }
        if(data.parentId == -1 && !data.children){
          this.$message({
            message: '该节点下没有数据',
            type: 'error'
          })
        }
      },    
      fetchCount () {
        let _this = this
        _this.searchForm.community_id = _this.communityId
        fetchStatistic(_this.searchForm).then(function (response) {
          if (response.data && response.data.code==1) {          
            _this.statistics = response.data.data
          }
        }).catch(function (a) {
          console.error(a)
        })
      },  
      //搜索
      loadData: function (offset=0, limit=10) {
        let _this = this
        _this.loading = true
        _this.searchForm.community_id = _this.communityId
        _this.searchForm.offset = offset
        _this.searchForm.limit = limit
          fetchList(_this.searchForm).then(function (response) {
            _this.loading = false
            if (response.data && response.data.code==1) {          
              _this.tableData = response.data.dataList 
              _this.totalRecord = response.data.totalCount
            }
          }).catch(function (a) {
            _this.loading = false
            console.error(a)
          })
        }
      },          
  }
</script>
<style lang="scss" scoped>
.calculate{
  padding: 19px 20px 20px;
  .num-box{ 
    width: 100%;
    height: 80px;   
    border-radius: 8px;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.05); 
    padding-left: 20px;
    position: relative;
    span{
      height: 80px;
      color: #fff;
      line-height: 80px; 
    }
    span:nth-of-type(1){     
      font-size: 20px;
      font-weight: SC;
      margin-right: 20px;
      vertical-align: middle;   
    }
    span:nth-of-type(2){
      font-size: 30px;
      font-weight: 600;  
      vertical-align: middle;   
    }
  }
  .checked:before{
    content:'';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url(../../assets/icon/checked.png);
    background-size: contain;
    position: absolute;
    right: 9px;
    top: 9px;
  }
  .blue{
    background: #428BFD;
  }
  .yellow{
    background: #FCA91B;
  }
}
</style>
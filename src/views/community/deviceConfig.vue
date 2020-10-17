<template>
  <div class="jdDIV">
    <div class="loading" v-if="loading"></div>
    <div class="app-container">
      <el-row :span="24">
        <el-col>
          <div class="table-control-panel">
            <span class="control-left list-title">设备配置列表</span>
            <span class="jdclass_refurbish"><i class="iconfont icon-icon_shuaxin" @click="handleReset()"></i></span>
            <span class="control-left">
              <el-button type="primary" class="right" icon="el-icon-plus" @click="handleSetting('item','add')">新增配置</el-button>
            </span>
            <span class="control-right">
              <el-popover placement="bottom" width="410" trigger="click" popper-class="jdPopper">
                <div class="control-panel jdClass">
                 <el-form ref="searchForm" :model="searchForm" :inline="true">
                   <el-row>
                      <el-col :span="12">
                        <el-form-item label="小区名称" class="room-place" prop="communityId">
                          <el-select v-model="searchForm.communityId" placeholder="请选择所属小区" clearable filterable>
                            <el-option
                              v-for="item in communityList"
                              :key="item.communityId"
                              :label="item.communityName"
                              :value="item.communityId">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <el-form-item label="设备编号" prop="doorDeviceId">
                          <el-input v-model="searchForm.doorDeviceId" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="设备型号" prop="doorType">
                          <el-select v-model="searchForm.doorType" placeholder="请选择设备型号" clearable filterable>
                            <el-option
                              v-for="item in devTypeList"
                              :key="item.code"
                              :label="item.codeName"
                              :value="item.code">
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

      <div class="dev-list">
        <div class="content">
          <div class="config-list" ref="configList">
            <div class="config-item" v-for="(item,i) in tableData" :key="i">
              <div class="item-loading" v-if="item.itemLoading"></div>
              <div class="item-top">
                <el-popover
                style="padding:0"
                  placement="right"
                  popper-class="popover-box"
                  trigger="hover">
                  <div class="set-btn">
                    <div @click="handleSetting(item,'copy')"><i class="iconfont icon-copy"></i> 复制配置</div>
                    <div @click="handleSetting(item,'edit')"><i class="iconfont icon-edit"></i> 编辑配置</div>
                    <div @click="handleDel(item,i)"><i class="iconfont icon-shanchupeizhi" :class="{'icon-shanchupeizhi1': item.doorCount!=0}"></i> 删除配置</div>
                  </div>
                  <div class="setting" slot="reference"><img src="../../assets/icon/action.png"></div>
                </el-popover>
                <div class="community">{{item.communityName}}</div>
                <div class="config">
                  <el-tooltip class="item" effect="dark" :content="item.configName" placement="top-start">
                    <span>{{item.configName}}</span>
                  </el-tooltip>
                </div>
                <div class="dev-type">
                  <i class="iconfont icon-details_numbering_iconx"></i>{{item.doorTypeDesc}}
                  <span class="devNum" @click="toDetail(item)">{{item.doorCount}}台<i class="iconfont icon-into"></i></span>
                </div>
              </div>
              <div class="device-footer">
                <div @click="distribute(item,'assign')" class="after-line"><i class="iconfont icon-fenpei1"></i> 分配设备</div>
                <div @click="distribute(item,'del')" ><i class="iconfont icon-delete" :class="{'icon-delete1': item.doorCount==0}"></i> 删除设备</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal">
      <el-dialog
        :title="mode=='assign'?'分配设备':'删除设备'"
        width="790px"
        :visible.sync="showModal"
        :close-on-click-modal="false">
        <distribute @submit="handleClose(0,offset,true)" :rowData="rowData" :mode="mode" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import mixin from "@/utils/mixin";
import distribute from './components/distribute.vue'
import { configList, delConfig} from "@/api/config"
import bus from "@/utils/bus";

let $el
let _scrollTop = 0

export default{
  mixins: [mixin],
  components: {
    distribute,
  },
  computed: {
    ...mapGetters([
      'communityList',
      'devTypeList'  //设备型号List
    ],)
  },
  data () {
    return {
      mode: '',
      loading: false,
      rowData: {},
      eachCount: null,
      showModal: false,
      configId: '',
      communityId: '',
      communityName: '',
      searchForm: {
        communityId: '',
        doorType: '',
        doorDeviceId: ''
      },
      tableData: []
    }
  },
  mounted() {
    // $el = document.querySelector(".content-view")
    $el = document.querySelector(".jdDIV")
    this.eachCount = Math.floor($el.offsetWidth/258)
    this.$nextTick(()=> {
      $el.addEventListener('scroll', this.onScroll)
    })
    this.loadData ()
    bus.$on('success', ()=>{
      this.loadData()
    })
  },
  destroyed(){
    $el.removeEventListener('scroll', this.onScroll)
    bus.$off('success')
  },
  methods: {
    // 配置详情
    toDetail (data) {
      localStorage.setItem('query',JSON.stringify({
        configId: data.configId,
          doorTypeDesc: data.doorTypeDesc,
          configName: data.configName,
          communityId: data.communityId,
          communityName: data.communityName,
      }))
      this.$router.push({
        path: '/village/devconfig/detail',
      })
    },
    handleReset () {
      this.$refs['searchForm'].resetFields()
      this.loadData ()
      // this.initNode(this.communityId)
    },
    //配置
    handleSetting (data,type) {
      //复制
      if(type==='copy'){
        localStorage.setItem('query',JSON.stringify({
        communityId: data.communityId,
            doorType: data.doorType,
            configName: data.configName,
            configId: data.configId,
            type: type
      }))
        this.$router.push({
          path: '/village/devconfig/setting'
        })
      //编辑
      }else if(type==='edit'){
        localStorage.setItem('query',JSON.stringify({
            communityId: data.communityId,
            doorType: data.doorType,
            configName: data.configName,
            configId: data.configId,
            type: type,
            isDefault: data.isDefault
      }))
        this.$router.push({
          path: '/village/devconfig/setting'
        })
      }else if(type==='add'){//新增
      localStorage.setItem('query',JSON.stringify({
            type: type,
      }))
        this.$router.push({
          path: '/village/devconfig/setting'
        })
      }
    },
    //搜索
    loadData (offset=0, limit=this.eachCount*5, contact) {
      let self = this
      self.loading = true
      let listObj = {
        offset: offset,
        limit: limit,
      }
      let keyObject = Object.assign(self.searchForm, listObj)
      configList(keyObject).then(function (response) {
        if (response.data && response.data.code === 1) {
          if(response.data.dataList.length > 0){
            response.data.dataList.forEach(item=>{
              item.itemLoading = false
            })
            self.tableData = contact? self.tableData.concat(response.data.dataList) : response.data.dataList
            self.offset = offset + limit
          } else if(response.data.dataList.length == 0 && !contact){
            self.tableData = []
          }
        }
      }).finally(function (a) {
        self.loading = false
      })
    },
    onScroll(e){
      let el = e.target

      // 距离底部小于200高度的时候进行加载判断
      if((el.scrollHeight-200) < (el.scrollTop+el.offsetHeight)){
        // 判断滚动条的滚动方向
        if((el.scrollTop - _scrollTop) > 0){
          !this.loading && this.loadData(this.offset, this.eachCount*5, true)
        }
        _scrollTop = el.scrollTop

      }else{
        // console.log('还没到')
      }
    },
    //关闭弹窗
    handleClose (offset, limit, cb) {
      this.loadData(offset, limit)
      this.showModal = false
    },
    //分配设备
    distribute (data,type)  {
      if(data.doorCount!=0||type=='assign'){
        this.showModal = true
        this.mode = type
        this.rowData = data
      }
    },
    //删除
    handleDel (data,index) {
      let self = this
      // console.log(self.tableData[index].itemLoading)
      if (data.doorCount==0) {
        self.$confirm('是否确认删除该配置？').then(_ => {
          self.tableData[index].itemLoading = true
          // self.tableData.map((item,idx)=>{
          //   if(index === idx){
          //     item.itemLoading = true
          //   }
          //   return item
          // })
          
          delConfig({
            communityId: data.communityId,
            configId: data.configId,
          }).then(function (response) {
            self.tableData[index].itemLoading = false
            // self.tableData.map((item,idx)=>{
            //   if(index === idx){
            //     item.itemLoading = false
            //   }
            //   return item
            // })
            if (response.data && response.data.code === 1) {
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.loadData(0,self.offset,false)
            }
            
          }).catch(function (a) {
            self.tableData[index].itemLoading = false
            // self.tableData.map((item,idx)=>{
            //   if(index === idx){
            //     item.itemLoading = false
            //   }
            //   return item
            // })
          }).finally(_=>{
            self.tableData[index].itemLoading = false
            // self.tableData.map((item,idx)=>{
            //   if(index === idx){
            //     item.itemLoading = false
            //   }
            //   return item
            // })
          })
        })
        .catch((a) => {
          self.tableData[index].itemLoading = false
        })
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.jdDIV /deep/.popover-box{
  padding: 12px;
}
.dev-list{
  padding-left: 30px;
  padding-right: 20px;
}
.control-left{
  float: left;
}
.right{
  float: right;
}
.loading{
  position: absolute;
  margin-top: calc(50vh - 140px);
  margin-left: calc(50vw - 120px);
  width: 120px;
  height: 140px;
  background-color: #fff;
  background-image: url(../../assets/gif/loadingWhite.gif);
  background-repeat: no-repeat;
  background-position: center center;
  z-index: 2;
  border-radius: 10px;
  box-shadow: 0px 20px 70px 0px rgba(0,0,0,0.2);
}
.config-list{
  margin-top: 20px;
}
.config-item{
  background-color: #fff;
  border-radius: 8px;
  display: inline-block;
  width: 240px;
  height: 158px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
  cursor: default;
  margin-bottom: 20px;
  margin-right: 18px;
  position: relative;
}
.item-loading{
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 158px;
  background-image: url(../../assets/gif/loadingWhite.gif);
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 2;
  background-color: #fff;
  border-radius: 8px;
}
.item-top{
  height: 116px;
  padding: 20px;
  position: relative;
  .setting{
    position: absolute;
    border-radius: 50%;
    right: 18px;
    top: 13px;
    cursor: pointer;
    img{
      width: 32px;
      height: 32px;
    }
  }
}
.set-btn{
  padding: 0px 6px;
  div{
    cursor: pointer;
  }
  div:nth-of-type(1),div:nth-of-type(2){
    margin-bottom: 28px;
  }
  .iconfont{
    margin-right: 10px;
    font-size: 14px;
  }
  .icon-edit{
    color: #1E8EEA;
  }
  .icon-shanchupeizhi{
    color: #FF6767;
  }
  .icon-shanchupeizhi1{
    color: #BBBBBB;
  }
  .icon-copy{
    color: #FFB253;
  }
}
.community{
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
}
.config{
  margin-bottom: 20px;
  overflow: hidden;
  span:nth-of-type(1){
    max-width: 160px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    float: left;
    color: #333333;
    font-size: 20px;
    line-height: 20px;
    font-weight: bolder;
  }
}
.devNum{
  cursor: pointer;
}
.dev-type{
  color: #888888;
  font-size: 11px;
  line-height: 14px;
  span:nth-of-type(1){
    float: right;
    color: #349EF5;
    font-size: 14px;
    line-height: 15px;
    font-weight: bolder;
    .icon-into{
      margin-left: 4px;
      color: #B6BFC5;
      font-size: 12px;
    }
  }
  .icon-details_numbering_iconx{
    color: #B6BFC5;
    font-size: 14px;
    margin-right: 8px;
  }
}
.device-footer{
  border-top: 1px solid #E6E9ED;
  display: flex;
  >div{
    flex: auto;
    color: #333333;
    text-align: center;
    font-size: 12px;
    line-height: 40px;
    position: relative;
    cursor: pointer;
    .iconfont{
      margin-right: 4px;
      font-size: 14px;
    }
    .icon-fenpei1{
      color: #1E8EEA;
    }
    .icon-delete{
      color: #FF6767;
    }
    .icon-delete1{
      color: #BBBBBB;
    }
  }
  .after-line:after{
    content:'';
    display: inline-block;
    height: 20px;
    width: 1px;
    background-color: #D4D9DE;
    position: absolute;
    right: 0;
    top: 10px;
  }
}

</style>

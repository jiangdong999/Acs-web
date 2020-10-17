<template>
  <div class="body" v-loading="loading">
    <div class="view">
      <div class="topBar">
        <label class="el-icon-arrow-left" @click="$router.back(-1)">返回</label>
        <span>{{parentNodeName}}</span>
        <div>
          <!-- roomUseStatus  3,5,1 -->
          <!-- <span class="orange">出租</span> -->
          <span class="green">已办理</span>
          <!-- <span class="grev">空置</span> -->
        </div>
      </div>
      <!-- <div class="count-row">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="hover">
              楼栋总人数
              <span class="count">
                <count-to :startVal="0" :endVal="parseInt(roomCount.householdCount) || 0" :duration="2500"></count-to>
              </span>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              楼栋总房间数
              <span class="count">
                <count-to :startVal="0" :endVal="parseInt(roomCount.roomCount) || 0" :duration="2500"></count-to>
              </span>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              承租人数量
              <span class="count">
                <count-to :startVal="0" :endVal="parseInt(roomCount.tenantCount) || 0" :duration="2500"></count-to>
              </span>
            </el-card>
          </el-col>
        </el-row>
      </div> -->
      <div v-if="roomNodes.length==0" class="empty-table"></div>
      <el-tabs v-model="activeName" v-if="roomNodes.length>1" type="border-card">
        <el-tab-pane v-for="(util, i) in roomNodes" :key="i" :label="util.nodeName" :name="i+''">
          <div class="view-row" v-for="floor in util.children" :key="floor.id" :id="'f_'+floor.id">
            <label>{{floor.nodeName}}</label>
            <div class="view-cells clearfix">
              <template v-if="returnArrayLength(floor.children)>0">
                <div class="cell" 
                v-for="room in floor.children" 
                :key="room.id"
                :class="setClass(room.cardCount, room.householdCount)"
                @click="handleRoomView(room.id, room.fullNodeName, room.nodeUuid,room.communityUuid, room.buildingUuid,room.roomUuid)">
                  <!-- <template v-if="room.label.length>4">
                    <el-tooltip effect="dark" :content="room.label" placement="top">
                      <label>{{room.label}}</label> -->
                      <!-- <div class="room-return-person" v-if="type=='epidemic'">{{room.returnCount?`${room.returnCount}名返程人员`:''}}</div> -->
                    <!-- </el-tooltip>
                  </template> -->
                  <template>
                    <label>{{room.roomName}}</label>
                    <!-- <div class="room-return-person" v-if="type=='epidemic'">{{room.returnCount?`${room.returnCount}名返程人员`:''}}</div> -->
                  </template>
                  <div :class="{'box-height':type=='epidemic'}"></div>
                  <i class="iconfont icon-jiaren" @click.stop="openHouseholdModal(room.id, room.fullNodeName, room.nodeUuid,room.communityUuid, room.buildingUuid,room.roomUuid)"></i>
                  <div class="cell-badge">
                    <div class="el-icon-bell" v-if="room.authorityCount>0">
                      {{room.authorityCount}}人待审批
                    </div>
                  </div>
                  <!-- <span>
                    {{room.cardCount}}<span class="iconfont icon-cardb"></span>
                    {{room.householdCount}}<span class="iconfont icon-ren"></span>
                  </span> -->
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template v-else v-for="util in roomNodes">
        <div class="view-row" v-for="floor in util.children" :key="floor.id" :id="'f_'+floor.id">
          <label>{{floor.nodeName}}</label>
          <div class="view-cells clearfix">
            <template v-if="returnArrayLength(floor.children)>0">
              <div class="cell" 
              v-for="room in floor.children" 
              :key="room.id"
              :class="setClass(room.cardCount, room.householdCount)"
              @click="handleRoomView(room.id, room.fullNodeName, room.nodeUuid,room.communityUuid, room.buildingUuid,room.roomUuid)">
                <!-- <template v-if="room.label.length>4">
                  <el-tooltip effect="dark" :content="room.label" placement="top">
                    <label>{{room.roomName}}</label>
                  </el-tooltip>
                </template> -->
                <template>
                  <label>{{room.roomName}}</label>
                </template>
                <div></div>
                <i class="iconfont icon-jiaren" @click.stop="openHouseholdModal(room.id, room.fullNodeName, room.nodeUuid,room.communityUuid, room.buildingUuid,room.roomUuid)"></i>
                <div class="cell-badge">
                  <div class="el-icon-bell" v-if="room.authorityCount>0">
                    {{room.authorityCount}}人待审批
                  </div>
                </div>
                <!-- <span>
                  {{room.cardCount}}<span class="iconfont icon-cardb"></span>
                  {{room.householdCount}}<span class="iconfont icon-ren"></span>
                </span> -->
              </div>
            </template>
          </div>
        </div>
      </template>

    </div>
    
    <!-- <floorNav :data="roomNodes.children"></floorNav> -->

  </div>
</template>

<script>
import { loadBuildCount } from "@/api/room";
import {loadNode,floorList } from "@/api/roomv1";
import {transRoomProperty, transRoomUseStatus} from "@/filters/room";
import {mapGetters} from 'vuex'
import addHousehold from "../../personnel/components/addHousehold";
import floorNav from "@/components/nav";
import countTo from 'vue-count-to'
import { fetchReturnPerson } from "@/api/epidemic";

let id = 0;
export default {
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  components:{
    addHousehold,
    floorNav,
    countTo
  },
  filters: {
    transRoomProperty,
    transRoomUseStatus
  },
  data(){
    return {
      query:'',
      loading:false,
      activeName: '0',
      roomNodes: [],
      parentNodeName:'',
      maxHousehold: '',
      assignNode:{},
      roomCount: {
        householdCount: 0,
        roomCount: 0,
        tenantCount: 0
      },
      type: '',
      returnList: []
    }
  },
  methods:{
    //房间返程人数
    loadReturn(){
      let self = this;
      fetchReturnPerson({
        communityId: self.community.communityId,
        nodeType: 'R',
        nodeId: self.query.nodeId
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          self.returnList = response.data.dataList
        }
      })
      .catch(function(a) {
        console.error(a);
      })
    },
    returnArrayLength(array) {
      return array? array.length: 0
    },
    setClass(c, h){
      // switch (type) {
      //   case 1:
      //     return "grev-cell";
      //   case 3:
      //     return "orange-cell";
      //   case 5:
      //     return "green-cell";
      //   default:
      //     return "default-cell"
      // }

      return c+h>0? 'green-cell': 'default-cell'
    },
    handleRoomView(nodeId, roomName, nodeUuid,communityUuid,buildingUuid,roomUuid ){
      localStorage.setItem('RoomView',JSON.stringify({
        'nodeId':nodeId,
        'roomName':roomName, 
        'nodeUuid':nodeUuid,
        'communityUuid':communityUuid,
        'buildingUuid':buildingUuid,
        'roomUuid':roomUuid
      }))
      this.$router.push({path: '/business/cell/details'})
    },
    openHouseholdModal(nodeId, roomName, nodeUuid,communityUuid,buildingUuid,roomUuid){
      // if(this.maxHousehold <= data.householdCount){
      //   this.$message.error('房间人数已达设置上限！')
      //   return 
      // }
      localStorage.setItem('addHousehold',JSON.stringify({
        'nodeId':nodeId,
        'roomName':roomName, 
        'nodeUuid':nodeUuid,
        'communityUuid':communityUuid,
        'buildingUuid':buildingUuid,
        'roomUuid':roomUuid
      }))
      this.$router.push({
        path: '/business/addHousehold'
      })
    },
    loadNode(){
      let self = this;
      loadNode({
        ...self.community,
        ...self.query,
      }).then(function(response) {
        if (response.data && response.data.status==0) {
          self.parentNodeName = response.data.content.fullNodeName
          // self.maxHousehold = response.data.content.maxHousehold
        }
      })
      .catch(function(a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      });
    },
    loadBuildCount(){
      let self = this;
      loadBuildCount({
        ...self.community,
        ...self.query,
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          self.roomCount = response.data.data
        }
      })
      .catch(function(a) {
        console.error(a);
      })
    },
    loadData:function(data){
      let self = this;
      self.loading = true;
      
      floorList({
        ...self.community,
        ...self.query,
      }).then(function(response) {
        if (response.data && response.data.status==0) {
          self.roomNodes = self.formatData(response.data.content[0].children, '4', '其它')
          // console.log('roomNodes:-------',self.roomNodes);
        }
      })
      .catch(function(a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      });
    },
    // acs3 双合家园 无楼层
    // acs3 普惠南里 无单元 无楼层
    // acs3 欣和园 房间与单元同一级
    formatData(dataList, checkLevel, tabName) {
      let self = this
      if(!dataList || checkLevel=='6') return dataList;
      if(dataList.length> 0){
        // 检测有没指定层级
        let v = this.checkLevel(dataList, checkLevel)

        if(!v){
          // 缺少checkLevel指定层级的情况
          let levelList =  [{
            level: checkLevel,
            label: tabName || '',
            id: id--,
            children : dataList
          }]
          levelList[0].children = this.formatData(levelList[0].children, parseInt(checkLevel)+1+'')

          return levelList

        }else{
          dataList = dataList.map((item, index) => {
            if(item.level != checkLevel){
              let _item =  {
                level: checkLevel,
                label: tabName || '',
                id: id--,
                children : [item]
              }
              // dataList[index] = _item
              _item.children = this.formatData(_item.children, parseInt(checkLevel)+1+'')
              return _item
            } else { 
              item.children = this.formatData(item.children, parseInt(checkLevel)+1+'')
              return item 
            }
          })
          return dataList
        }
      }else{
        return []
      }
    },
    checkLevel(dataList, checkLevel){
      let v = dataList.some((item, index) => {
          return item.level == checkLevel
      })
      return v
    }
  },
  mounted(){
    this.query = JSON.parse(localStorage.getItem('query'))
    this.loadReturn()
    this.loadNode()
    this.loadData()
    this.loadBuildCount()
    
    if(this.query.type){
      if(this.query.type=='epidemic'){
        this.type="epidemic"
      }
    }
  }
}
</script>

<style scoped>
  @import '../../../styles/cell.scss' ;
  @import '../../../styles/iconfont/iconfont.css' ;

  .view-cells{
    min-height: 140px;
  }
  .cell{
    line-height: 30px;
    width: 140px;
    position: relative;
    /* height: 140px; */
  } 
  .cell>div{
    height: 30px;
  }
  .box-height{
    height: 20px !important;
  }
  .icon-jiaren{
    position: absolute;
    top: 10px;
    right: 20px;
    color: #fff;
    transition: all .3s;
    font-size: 20px
  }
  .icon-jiaren:hover{
    color: #3C8AFF;
  }
  .view-row{
    margin-top: 20px;
  }
  .view-row>label{
    line-height: normal;
    white-space: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 140px;
  }
  .grev-cell{
    background-color: #BBBBBB;
  }
  .orange-cell{
    background-color: #FFAA20;
  }
  .green-cell{
    background-color: #007ee4;
  }
  div.grev-cell *, div.orange-cell *, div.green-cell *{
    color: #fff ;
  }
  .grev-cell>.cell-badge>div, .green-cell>.cell-badge>div, .orange-cell>.cell-badge>div{
    background-color: rgba(255, 255, 255, .3)
  }
  .cell>label{
    display: inline-block;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .count-row{
    margin-left: 90px;
    margin-bottom: 50px;
    text-align: center;
  }
  .count{
    font-size: 20px;
    font-weight: 900;
  }
  .room-return-person{
    font-size: 14px;
    font-weight: 500;
    color: #666;
    line-height: 20px;
  }
</style>

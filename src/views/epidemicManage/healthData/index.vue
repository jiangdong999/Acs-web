<template>
  <div class="health-data">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="num-box">
          <div class="community">
            <span class="title">小区总人数</span>
            <span class="num">
              <count-to :startVal="0" :endVal="parseInt(communityCount.householdCount) || 0" :duration="2500"></count-to>
            </span>
          </div>
          <div class="room">
            <span class="title">房间总数</span>
            <span class="num">
              <count-to :startVal="0" :endVal="parseInt(communityCount.roomCount) || 0" :duration="2500"></count-to>
            </span>
          </div>
          <div class="renter">
            <span class="title">承租人数量</span>
            <span class="num renter-num" @click="toRental(3)">
              <count-to :startVal="0" :endVal="parseInt(communityCount.tenantCount) || 0" :duration="2500"></count-to>
            </span>
          </div>
          <div class="renter">
            <span class="title">出租屋数量</span>
            <span class="num">
              <count-to :startVal="0" :endVal="parseInt(communityCount.rentalCount) || 0" :duration="2500"></count-to>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="cal-num return-num">
          <span>小区返程人员</span>
          <span @click="toDevide('1')">{{communityData.totalReturns?communityData.totalReturns: 0}}</span>
          <!-- <span>今日返程人员 {{communityData.todayReturns?communityData.todayReturns: 0}}</span> -->
          <!-- <span>较昨天 -</span> -->
        </div>
      </el-col>
      <el-col :span="4">
        <div class="cal-num divide-num">
          <span>密接隔离人员</span>
          <span @click="toDevide('2')">{{communityData.totalQuarantines?communityData.totalQuarantines: 0}}</span>
          <!-- <span>今日隔离告警 {{communityData.todayAlarm?communityData.todayAlarm: 0}}</span> -->
          <!-- <span>较昨天 -</span> -->
        </div>
      </el-col>
      <el-col :span="4">
        <div class="cal-num divide-num">
          <span>累计隔离告警</span>
          <span @click="toAlarm()">{{communityData.totalAlarm?communityData.totalAlarm: 0}}</span>
          <!-- <span>今日隔离告警 {{communityData.todayAlarm?communityData.todayAlarm: 0}}</span> -->
          <!-- <span>较昨天 -</span> -->
        </div>
      </el-col>
      <el-col :span="4">
        <div class="cal-num verify-num">
          <span>小区核查总数</span>
          <span @click="toCheck()">{{communityData.totalExamines?communityData.totalExamines:0}}</span>
          <!-- <span>今日核查数 {{communityData.todayExamines?communityData.todayExamines:0}}</span> -->
          <!-- <span>较昨天 -</span> -->
        </div>
      </el-col>
    </el-row>

    <el-row class="figure" :gutter="10">
      <el-col :span="8">
        <div class="chart-box">
          <div id="verifyChart" class="chart"></div>
          <verify-num :examinesData.sync="examinesData" :weekTime.sync="weekTime" ref="examines"></verify-num>
        </div>      
      </el-col>
      <el-col :span="8">
        <div class="chart-box">
          <pass-num :passesData.sync="passesData" :weekTime.sync="weekTime" ref="passes"></pass-num>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-box">
          <add-household :newHouseholdsData.sync="newHouseholdsData" :weekTime.sync="weekTime" ref="newHouseholds" ></add-household>
        </div>
      </el-col>
    </el-row>
    <div class="building-title">楼栋列表</div>
    <div class="view-row" v-for="area in roomNode.children" :key="area.id">
      <label>{{area.nodeName}}</label>
      <div class="view-cells clearfix">
        <template v-for="build in area.children">
          <el-popover
          placement="top"
          trigger="click"
          :disabled="returnArrayLength(build.children)==0"
          :ref="'popover-'+build.id"
          :key="build.id">
            <div class="content">
              <label>共{{returnArrayLength(build.children)}}单元</label>
              <div class="cell-group">
                <div 
                v-for="part in build.children" 
                @click="handleFloorView(part.id, build.id)"
                :key="part.id">
                {{part.nodeName}}                 
                </div>
              </div>
            </div>

            <el-tooltip effect="dark" :content="build.fullNodeName" placement="bottom" slot="reference">
              <div class="area-cell cell-focus"
              @click="handleFloorView(build.nodeUuid, build.id)">
                <label class="build-label">{{build.nodeName}}</label>
                <!-- <span>{{returnArrayLength(build.children)>0? '共'+returnArrayLength(build.children)+'单元': ''}}</span> -->
              </div>
            </el-tooltip>
          </el-popover>
        </template>
      </div>
    </div>
    
    <div class="view-row" v-if="specialRoom.length>0">
      <label>特殊</label>
      <div class="view-cells clearfix">
        <template v-for="room in specialRoom">
          <template v-if="room.level=='999'">
            <div 
            :key="room.nodeId"
            class="area-cell cell-focus" 
            @click="handleOfficeView(room)" 
            slot="reference">
              <label>{{room.fullNodeName}}</label>
              <span>房间</span>
            </div>
          </template>
          <el-popover
          v-else
          placement="top"
          :key="room.nodeId"
          trigger="hover">
            <div class="area-cell default-cell">
              <label>{{room.nodeName}}</label>
              <div>{{room.roomProperty}}</div>
              <div class="cell-badge">
                <div class="el-icon-bell" v-if="room.authorityCount>0">
                  {{room.authorityCount}}人待审核
                </div>
              </div>
              <span>
                {{room.cardCount}}<span class="iconfont icon-cardb"></span>
                {{room.householdCount}}<span class="iconfont icon-ren"></span>
              </span>
            </div>

            <div class="area-cell cell-focus" @click="handleRoomView(room.nodeId)" slot="reference">
              <label>{{room.fullNodeName}}</label>
              <span>房间</span>
            </div>
          </el-popover>
        </template>
      </div>
    </div>


  </div>
</template>
<script>
  import verifyNum from './components/verifyNum.vue'
  import addHousehold from './components/addHousehold.vue'
  import passNum from './components/passNum.vue'
  import { fetchHealthData } from "@/api/epidemic";
  import { mapGetters } from 'vuex';
  import { loadCommunityCount, specialRoomList  } from "@/api/room";
  import { buildingList  } from "@/api/roomv1";
  import countTo from 'vue-count-to'

  let id = 0;
  let roomNode
  export default {
    components: {
      verifyNum,
      addHousehold,
      passNum,
      countTo
    },
    computed: {
      ...mapGetters([
        'community'
      ])
    },
    created () {
      this.loadData()
      this.loadCommunityCount()     
      this.loadBuildingList()
    },
    data () {
      return {
        communityData: {},
        communityCount: {
          "roomCount": 0,
          "householdCount": 0,
          "tenantCount": 0,
          "rentalCount": 0,
        },
        weekTime: [],
        passesData: [],
        examinesData: [],
        newHouseholdsData: [],
        buildingList: [],
        returnList: [],
        specialRoom: [],
        roomNode: [],
      }
    },
    methods: {
      toAlarm () {
        this.$router.push({
          path: '/epidemic/monitorAlarm'
        })
      },
      toCheck () {
        this.$router.push({
          path: '/epidemic/verificationRecord'
        })
      },
      toRental (type) {
        this.$router.push({
          path: '/epidemic/infoSearch',
          query: {
            type: type
          }
        })
      },
      toDevide (type) {
        this.$router.push({
          path: '/epidemic/dividePerson',
          query: {
            type: type
          }
        })
      },
      returnArrayLength(array) {
        return array? array.length: 0
      },
      handleFloorView(nodeUuid, buildId) {
      this.$refs['popover-'+buildId][0].doClose()
      localStorage.setItem('query',JSON.stringify({
        nodeUuid: nodeUuid, nodeId:buildId
      }))
      this.$router.push({path: '/business/cell/floor'})
    },
      handleRoomView(nodeId){
      localStorage.setItem('RoomView',JSON.stringify({
        nodeId: nodeId
      }))
      this.$router.push({path: '/business/cell/details'})
    },
      handleOfficeView(node){
        this.$router.push({path: '/business/cell/office', query: { roomNodeId: node.nodeId }})
      },
      //小区数据
      loadCommunityCount(){
        let self = this;
        loadCommunityCount({
          communityId: self.community.communityId
        }).then(function(response) {
          if (response.data && response.data.code==1) {
            self.communityCount = response.data.data
          }
        })
        .catch(function(a) {
          console.error(a);
        })
      },
      //特殊
      loadSpecialRoomList(flag){
        let self = this;
        specialRoomList({
          communityId: self.communityId
        }).then(function(response) {
          if (response.data && response.data.code==1) {
          
          self.specialRoom = response.data.dataList;

          if(self.specialRoom.length==0 && !flag){
            self.empty = true
          }else { self.empty = false }
        }
        })
        .catch(function(a) {
          console.error(a);
        }).finally(_=>{

        });
      },
      //楼栋列表
      loadBuildingList(){
        let self = this
        buildingList({
          ...self.community
        }).then(function(response) {
          // if (response.data && response.data.status==0) {
          //   let empty = true
          //   if(response.data.dataList.length==0 || !response.data.dataList[0].children || response.data.dataList[0].children.length==0){
          //     // self.$emit('disabled')
          //     empty = false
          //   }else {
          //     let roomNode = response.data.dataList[0]
          //     self.roomNode = self.formatBuildsData(roomNode, 2)
          //     // console.log('roomNode',self.roomNode)
          //   }
          //   // console.log(self.roomNode)
          //   self.loadSpecialRoomList(empty)
          // }
          if (response.data && response.data.status==0) {
          // console.log(response.data);
          let empty = true
          if(!response.data.content || !response.data.content.children || response.data.content.children.length==0){
            // console.log(1);
            self.$emit('disabled')
            empty = false
          }else {
            let roomNode = response.data.content
            localStorage.setItem('nodeUuid',roomNode.nodeUuid);
            for (let i = 0; i < roomNode.children.length; i++) {
              const element = roomNode.children[i];
              if(element.level == '999'){
                self.specialRoom = [element]
                roomNode.children.splice(i,1)
              }
            }
            self.roomNode = self.formatBuildsData(roomNode, 2)
          }
          // console.log(self.roomNode,self.specialRoom)
          self.empty = false
          // self.loadSpecialRoomList(empty)
        }
        })
        .catch(function(a) {
          console.error(a);
        }).finally(_=>{
          self.loading = false;
        });
      },
      formatBuildsData(data, level){
        let self = this
        let formatData=[];

        if(!data.children || data.children.length==0){
          return data;
        }else{
          
          let v = data.children.some((item, index) => {
            return item.level == '2'
          })
          let _areaNode = { id:id++, label:'', level:'2', children:[]}
          
          if(v){
            // 若小区存在level为2的区域层级节点
            data.children.forEach((item, index) => {
              if(item.level=='2'){
                // level2的情况
                if(item.children && item.children.length>0){
                  item.children.forEach((i, index) => {
                    // 若在第三数据层还拥有level为2的节点,12234 生产环境（运营基地）
                    if(i.level=='2'){
                      item.label = item.label+'/'+i.label
                      item.children.splice(index, 1, ...i.children);
                    }
                  })
                }
                formatData.push(item)
              }else if(item.level=='3'){
                // level2和3处于同一数据层的情况
                _areaNode.children.push(item)
              }
            })

            if(_areaNode.children.length>0){
              formatData.push(_areaNode)
            }
          }else{
            // 没有level2的情况，134
            let v = data.children.forEach((item, index) => {
              _areaNode.children.push(item)
            })

            formatData.push(_areaNode)
          }
        }
        data.children = formatData;
        //楼栋加返程人员 
        // console.log('self.returnList',self.returnList)
        // if(self.returnList.length>0){
        //   data.children.forEach(area=>{
        //     self.returnList.forEach(item=>{
        //       console.log('item',item)
        //       area.children.forEach(build=>{  
        //         console.log('build',build)
        //         if(build.id == item.node_id){
        //           console.log('fa')
        //           build.returnCount = item.count
        //         }             
        //       })                                 
        //     })                     
        //   })          
        // }
        return data;
      },
      loadData: function () {
        let self = this
        let data = {
          communityId: this.community.communityId
        }
        fetchHealthData(data).then(function (response) {
          if (response && response.data.code === 1) {
            self.communityData = response.data.data || {};
            let chartData = response.data.data.weekData || [];
            chartData.forEach(item=>{
              self.weekTime.push(item.time)
              self.passesData.push(item.passes)
              self.examinesData.push(item.examines)
              self.newHouseholdsData.push(item.newHouseholds)
            })
            self.$refs.examines.drawBarChart()
            self.$refs.passes.drawBarChart()
            self.$refs.newHouseholds.drawBarChart()
          }
        }).catch(function (a) {
          console.error(a);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../../../styles/cell.scss' ;
@import '../../../styles/iconfont/iconfont.css' ;
  
.default-cell{
  width: 100%;
  padding: 0;
  margin: 0;
}
.area-cell{
  padding: 20px;
}
// .area-cell1{
//   width: 145px;
// }
.view-row{
  min-height: 83px;
}
.width160{
  width: 160px
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
.health-data{
  padding: 20px;
}
.num-box{
  padding-top: 15px;
  padding-bottom: 15px;
  overflow: hidden;
  width: 100%;
  height: 146px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.05); 
  div:nth-of-type(1),div:nth-of-type(2){
    margin-bottom: 5px;
  }
  div:nth-of-type(3),div:nth-of-type(4){
    margin-top: 5px;
  }
  div{   
    float: left;
    width: 50%;
    height: 50%;
    // background: red;
    box-sizing: border-box;
    >span{
      display: inline-block;
      text-align: center;
      width: 100%;
    }
    .title{
      font-size: 14px;
      font-weight: 500;
      color: #888;
      line-height: 20px;
      margin-bottom: 9px;
    }
    .num{
      font-size: 26px;
      font-weight: 600;
      color: #333;
      line-height: 20px;
    }
    .renter-num{
      color: #428BFD;
      cursor: pointer;
    }
  }
}
.cal-num{
  width: 100%;
  height: 146px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.05);
  padding: 20px; 
  span{
    display: inline-block;
    width: 100%;   
    color: #fff;
    text-align: left;
    line-height: 20px;
  }
  span:nth-of-type(1){
    opacity: 0.8;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 13px;
  }
  span:nth-of-type(2){
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 23px;
    cursor: pointer;
  }
  span:nth-of-type(3){
    font-size: 16px;
    font-weight: 500;
  }
}
.return-num{
  background: #428bfd;
}
.divide-num{
  background: #ff6565;
}
.verify-num{
  background: #FCA91B;
}
.figure{
  margin-top: 14px;
  margin-bottom: 30px;
}
.chart-box{
  width: 100%;
  height: 256px;
  background: #fff;
  border-radius: 8px;
}
.building-title{
  font-size: 16px;
  font-weight: 600;
  color: #223040;
  line-height: 16px;
  margin-bottom: 24px;
}
.building-name{
  float: left;
  width: 8%;
  height: 105px;
  line-height: 105px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}
.building-list{
  overflow: hidden;
  float: left;
  width: 92%;
  // height: 200px;
  .building-item{
    width: 145px;
    height: 105px;
    float: left;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0pt 4px 8px 0px rgba(0,0,0,0.05); 
    margin-right: 15px;
    margin-bottom: 20px;
    padding: 20px;
  }
}
.building-node{
  margin-bottom: 20px;
  span{    
    font-weight: 600;
    line-height: 20px;
  }
  span:nth-of-type(1){
    font-size: 20px;
    color: #333;
  }
  span:nth-of-type(2){
    font-size: 16px;
    color: #aaa;
  }
}
.building-node-special{
  margin-bottom: 20px;
  span{
    font-weight: 600;
    line-height: 20px;
    font-size: 20px;
    color: #333; 
    line-height: 32px;  
  }
}
.build-label{
  display: inline-block;
  width: 100%;
  font-weight: 600;
  line-height: 20px;
  font-size: 20px;
  color: #333; 
  line-height: 32px;  
  // margin-bottom: 20px;
}
.return-person{
  display: inline-block;
  width: 100%;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #fff !important;
  line-height: 20px;
}
.back-num{
  font-size: 16px;
  font-weight: 500;
  color: #007ee4;
  line-height: 20px;
}
.chart{
  width: 100%;
  height: 100%;  
}
</style>
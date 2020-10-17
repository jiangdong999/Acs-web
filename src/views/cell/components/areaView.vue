<template>
  <div class="body" v-loading="loading" v-if="roomNode">
    <div v-if="empty" class="empty-table"></div>
    <div v-else class="view">
      <div class="topBar">
        <span>选择楼栋/单元</span>
        <!-- <span class="control-right">共有楼栋{{communityCount.buildingCount}}栋</span> -->
      </div>
      <!-- <div class="count-row">
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card shadow="hover">
              小区总人数
              <span class="count">
                <count-to :startVal="0" :endVal="parseInt(communityCount.householdCount) || 0" :duration="2500"></count-to>
              </span>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              小区总房间数
              <span class="count">
                <count-to :startVal="0" :endVal="parseInt(communityCount.roomCount) || 0" :duration="2500"></count-to>
              </span>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              承租人数量
              <span class="count">
                <count-to :startVal="0" :endVal="parseInt(communityCount.tenantCount) || 0" :duration="2500"></count-to>
              </span>
            </el-card>
          </el-col>
        </el-row>
      </div> -->
      <div class="view-row" v-for="area in roomNode.children" :key="area.id">
        <label>{{area.nodeName}}</label>
        <div class="view-cells clearfix">
          <template v-for="build in area.children">
            <el-popover
            placement="top"
            trigger="click"
            :disabled="true"
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
                  <label>{{build.nodeName}}</label>
                  <!-- <span>{{returnArrayLength(build.children)>0? '共'+returnArrayLength(build.children)+'单元': ''}}</span> -->
                </div>
              </el-tooltip>
            </el-popover>
          </template>
        </div>
      </div>
      
      <div class="view-row">
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

              <div class="area-cell cell-focus" @click="handleRoomView(room.id)" slot="reference">
                <label>{{room.fullNodeName}}</label>
                <span>房间</span>
              </div>
            </el-popover>
          </template>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { dropdownAllNode } from "@/api/node";
import { specialRoomList, loadCommunityCount } from "@/api/room";
import { buildingList } from "@/api/roomv1";
import {mapGetters} from 'vuex'
import countTo from 'vue-count-to'

let id = 0;
let roomNode
export default {
  components:{countTo},
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  data(){
    return {
      loading:false,
      empty:true,
      secondFloorId:null,
      roomNode: [],
      specialRoom: [],
      communityCount: {
        "roomCount": 0,
        "householdCount": 0,
        "tenantCount": 0
      }
    }
  },
  methods:{
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
      this.$router.push({path: '/business/cell/office', query: { roomNodeId: node.id }})
    },
    loadBuildingList(){
      let self = this;
      let data = self.community
      self.loading = true;
      // console.log(data);
      buildingList(data).then(function(response) {
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
                    item.nodeName = item.nodeName+'/'+i.nodeName
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
      // console.log(data);
      return data;
    },
    loadSpecialRoomList(flag){
      let self = this;
      let data = self.community
      self.loading = true;

      specialRoomList(data).then(function(response) {
        if (response.data && response.data.code==1) {
          
          self.specialRoom = response.data.dataList;

          if(self.specialRoom.length==0 && !flag){
            // self.$message.warning('小区没有房屋')
            self.empty = true
          }else { self.empty = false }
        }
      })
      .catch(function(a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false;
      });
    },
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

  },
  mounted(){
    this.loadBuildingList()
    this.loadCommunityCount()
  }
}
</script>

<style scoped>
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
</style>

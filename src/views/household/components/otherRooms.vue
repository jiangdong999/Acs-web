<template>
  <div class="container" v-loading="loading">
    <el-button type="text" class="header-btn" @click="showAdd=true">添加其他房间</el-button>
    <slot></slot>

    <div class="content">
      <template v-for="n in row">
        <el-row type="flex" justify="space-around" :key="n" style="margin-bottom:10px">
          <el-col :span="10">
            <div class="card">
              <label>{{ dataList[2*n-2].fullNodeName }}</label><br>
              <span>{{ dataList[2*n-2].householdRole | transHouseholdRole }}</span>
              <el-button type="text" v-if="dataList[2*n-2].householdRole=='3'" @click="showRenewalForm(dataList[2*n-2])">租客续期</el-button><br>
              
              <label class="grev" v-if="dataList[2*n-2].cardList">卡号：{{ dataList[2*n-2].cardList }}</label>
              <el-button type="text" v-else @click="showCardForm(dataList[2*n-2])">添加门卡</el-button>
              
              <div class="card-right">
                <el-button type="text" class="top" @click="showRoom(dataList[2*n-2].roomNodeId)">查看房间</el-button>
                <el-button type="text" class="bottom" @click="handleDel(dataList[2*n-2])">删除房间</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="card" v-if="dataList[2*n-1]">
              <label>{{ dataList[2*n-1].fullNodeName }}</label><br>
              <span>{{ dataList[2*n-1].householdRole | transHouseholdRole }}</span>
              <el-button type="text" v-if="dataList[2*n-1].householdRole=='3'" @click="showRenewalForm(dataList[2*n-1])">租客续期</el-button><br>
              
              <label class="grev" v-if="dataList[2*n-1].cardList">卡号：{{ dataList[2*n-1].cardList }}</label>
              <el-button type="text" v-else @click="showCardForm(dataList[2*n-1])">添加门卡</el-button>
              
              <div class="card-right">
                <el-button type="text" class="top" @click="showRoom(dataList[2*n-1].roomNodeId)">查看房间</el-button>
                <el-button type="text" class="bottom" @click="handleDel(dataList[2*n-1])">删除房间</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </div>

    <div v-if="showRenewal">
      <el-dialog
        title="租户续期"
        :visible.sync="showRenewal"
        width="1011px"
        top="5vh"
        :close-on-click-modal="false">
        <renewal :data="household" @submitSuccess="handleClose()"/>
      </el-dialog>
    </div>

    <div v-if="showCard">
      <el-dialog
        title="门卡详情"
        :visible.sync="showCard"
        width="550px"
        :show-close="true"
        :close-on-click-modal="false"
      >
        <card :householdInfo="dialogData" @handleClose="handleClose"/>
      </el-dialog>
    </div>

    <div v-if="showAdd">
      <el-dialog
        title="添加多个房间"
        :visible.sync="showAdd"
        width="400px"
        :show-close="true"
        :close-on-click-modal="false"
      >
        <add-rooms :household="household"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import card from "./card.vue";
import addRooms from "./bindRoom.vue";
import renewal from "../renewal.vue";
import { otherRooms, delHousehold } from "@/api/household"
import { transHouseholdRole } from "@/filters/household"
import { delNode } from "@/api/room.js";
import dateUtil from "@/utils/times";

export default {
  props:['household'],
  components: {
    card,
    addRooms,
    renewal
  },
  filters:{
    transHouseholdRole
  },
  data(){
    return {
      loading: false,
      showRenewal: false,
      showCard: false,
      showAdd: false,
      dialogData: {},
      dataList:[]
    }
  },
  computed: {
    row(){
      return Math.ceil(this.dataList.length/2)
    }
  },
  methods:{
    handleDel: function (household) {
      let self = this;
      self.$confirm('删除后将解除住户和该房间的关联', '是否确认删除该房间？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
          self.loading = true;
          delHousehold({
            householdId: household.householdId, 
            roomNodeId: household.roomNodeId
          }).then(function (response) {
            if (response && response.data.code === 1) {
              self.$message({
                message: '删除已完成',
                type: 'success'
              });
              self.loadData();
            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
            }
          }).finally(_=>{
            self.loading = false
          })
        })
        .catch((a) => {
          self.loading = false;
        });
      
    },
    showRoom(nodeId){
      localStorage.setItem('RoomView',JSON.stringify({
        nodeId: nodeId
      }))
      this.$router.push({path: '/business/cell/details'})
    },
    showCardForm(data){
      this.dialogData = {...data, householdName: this.household.householdName};
      this.showCard = true;
    },
    showRenewalForm(data){
      this.dialogData = Object.assign(this.household, data);
      this.dialogData.leaseEndTime = dateUtil.toClientDate(this.dialogData.leaseEndTime).getTime()
      this.showRenewal = true;
    },
    handleClose(){
      this.showCard = false;
      this.showAdd = false;
      this.loadData()
    },
    loadData() {
      let self = this;
      self.loading = true
      let query = JSON.parse(localStorage.getItem('householdDetails'))
      otherRooms({
        communityId: query.communityId,
        householdId: query.householdId,
        roomNodeId: parseInt(query.roomNodeId)
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          // self.dataList = response.data.dataList

          self.loading = false;
        }
      }).catch(function(a) {
        console.error(a);
      }).finally(_=>{
        self.loading = false
      });
    }
  },
  mounted(){
    this.loadData()
  }
}
</script>
<style lang="scss" scoped>
  .container{
    padding: 0 20px 20px 20px;
    position: relative;
  }
  .card{
    height: 110px;
    font-size: 14px;
    line-height: 30px;
    padding: 10px 20px;
    position: relative;
    border: 1px solid #E0E2E8;
    transition: all .3s;
    border-radius: 5px;
  }
  .card:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .card>span{
    margin-right: 10px;
  }
  .grev{
    color: #888888;
  }
  .card-right{
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
  }
  .top{
    position: absolute;
    right: 20px;
    top: 10px;
    text-decoration:underline;
  }
  .bottom{
    position: absolute;
    right: 20px;
    bottom: 5px;
    color: #FF5555;
    text-decoration:underline;
  }
  .header-btn{
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 14px;
    z-index: 3;
  }

</style>

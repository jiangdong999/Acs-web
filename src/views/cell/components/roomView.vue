<template>
  <div class="container">
    <div class="header clearfix">
      <!-- <div class="topBar"> -->
        <label class="back-btn el-icon-arrow-left" @click="$router.go(-1)">返回</label>
      <!-- </div> -->
      <span class="node-name">{{node.label}}</span>
      <label class="room-name">{{roomFirstName}}</label>
      <span class="control-right">
        <el-button type="warning" @click="showRoomData" :loading="btnLoading">编辑房间</el-button>
        <el-button type="primary" @click="openHouseholdModal">新增住户</el-button>
      </span>
    </div>
    
    <div class="body body1">
      <div class="view">      
        <el-collapse-transition>
          <authorize class="table-container" ref="authorize" v-if="!loading" :node="node"/>
        </el-collapse-transition>
        <el-collapse-transition>
          <household class="table-container" ref="household" v-if="!loading" :node="node" />
        </el-collapse-transition>
      </div>
    </div>

    <div v-if="showEdit">
      <el-dialog
        title="编辑房间11"
        width="631px"
        :visible.sync="showEdit"
        :close-on-click-modal="false">
        <room-edit :data="rowData"/>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {loadRoom} from "@/api/room";
import {loadNode} from "@/api/roomv1";
import roomEdit from "../../room/edit";
import addHousehold from "../../personnel/components/addHousehold";
import household from "./components/household";
import authorize from "./components/authorize";
// import {mapGetters} from 'vuex'

export default {
  components:{
    roomEdit,
    addHousehold,
    authorize,
    household
  },
  data(){
    return {
      loading: true,
      btnLoading:false,
      showEdit:false,
      showModal:false,      
      node:{
        householdId: null,
        fullNodeName:'',
        nodeName:''
      },
    }
  },
  computed:{
    roomFirstName(){
      // console.log(this.node);
      let name = this.node.fullNodeName
      // console.log(name);
      // let i = name.lastIndexOf('/')
      // return name.substring(0, i)
      return name
    }
  },
  methods:{
    handleClose(){
      this.showEdit=false;
      this.showModal=false;
      this.showMessage=false;
      this.$refs.authorize.loadData()
      this.$refs.household.loadData()
    },
    openHouseholdModal(){
      if(this.node.maxHousehold <= this.$refs.household.totalRecord){
        this.$message.error('房间人数已达设置上限！')
        return 
      }
      console.log(this.node);
      localStorage.setItem('addHousehold',JSON.stringify({
        communityId: this.node.communityId,  
        communityUuid:this.node.communityUuid,  
        nodeUuid: this.node.nodeUuid, 
      }))
      this.$router.push({
        path: '/business/addHousehold'
      })
    },
    showRoomData() {
      let self = this;
      self.btnLoading=true
      let query = JSON.parse(localStorage.getItem('RoomView'))
      loadRoom({
        communityId: self.node.communityId,
        roomId: query.nodeId
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          self.rowData = response.data.data
          self.showEdit = true
        }
      }).catch(function(a) {
        console.error(a);
      }).finally(_=>{
        self.btnLoading=false
      })
    },
    loadNode(){
      let self = this;
      self.loading = true
      let query = JSON.parse(localStorage.getItem('RoomView'))
      
      loadNode({
        ...self.community,
        ...query,
      }).then(function(response) {
        if (response.data && response.data.status==0) {
          self.node = response.data.content
          // console.log(self.node);
          self.loading = false
        }
      }).catch(function(a) {
        console.error(a);
      })
    },
  },
  mounted(){
    this.loadNode()
  }
}
</script>

<style scoped>
  @import '../../../styles/cell.scss';
  .header{
    font-size: 30px;
  }
  .header>label{
    font-size: 15px;
    /* margin-left: 30px; */
  }
  .room-name,.node-name{
    margin-left: 30px;
  }
  .table-container{
    margin-bottom: 20px;
  }
</style>

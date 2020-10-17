<template>
  <el-container style="padding:20px;" class="height">
    <el-main>
      <div class="header module" v-loading="loadingCount">
        <el-row>
          <!-- <el-col :span="6" class="item">
            目前留存人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.remainCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col> -->
          <el-col :span="12" class="item">
            今日出小区人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.outCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col>
          <el-col :span="12" class="item">
            今日进小区人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.inCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col>
          <!-- <el-col :span="6" class="item">
            小区内陌生人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.strangerCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col> -->
        </el-row>
      </div>

      <!-- <div class="module">
        <div class="title">
          小区内留存人员
          <i class="iconfont icon-moshengren"></i>陌生人
          <i class="iconfont icon-baimingdan"></i>白名单
          <i class="iconfont icon-heimingdan"></i>黑名单
          <el-button type="text" round icon="el-icon-refresh" @click="fetchRemainList()">刷新</el-button>
        </div>
        <div class="content-remain" v-loading="loadingRemain" ref="remain">
          <div>
            <div class="img-item" v-for="(item, index) in remainList" :key="index">
              <i class="iconfont icon-moshengren" v-if="item.faceType=='0'" ></i>
              <i class="iconfont icon-baimingdan" v-else-if="item.faceType=='1'" ></i>
              <i class="iconfont icon-heimingdan" v-else-if="item.faceType=='2'" ></i>
              <img :src="item.imageUrl" @click="showData(item)">
            </div>
          </div>
        </div>
      </div> -->

      <div class="module">
        <div class="title">白名单人员
          <el-button type="text" round icon="el-icon-refresh" @click="fetchWhiteList()">刷新</el-button>
        </div>
        <div class="content-stranger" v-loading="loadingWhiteList" ref="whiteList">
          <div>
            <div class="img-item" v-for="(item, index) in whiteList" :key="index">
              <img :src="item.imageUrl" @click="showData(item)">
            </div>
          </div>
        </div>
      </div>
      <div class="module">
        <div class="title">陌生人员
          <el-button type="text" round icon="el-icon-refresh" @click="fetchStrangerList()">刷新</el-button>
        </div>
        <div class="content-stranger" v-loading="loadingStranger" ref="stranger">
          <div>
            <div class="img-item" v-for="(item, index)  in strangerList" :key="index">
              <img :src="item.imageUrl" @click="showData(item)">
            </div>
          </div>
        </div>
      </div>
    </el-main>

    <el-aside width="400px" class="height aside" style="overflow:hidden">
      <el-row type="flex" class="height" justify="space-between">
        <el-col class="height module-vertical">
          <div class="title">实时出小区人员</div>
          <div class="height content-box" ref="StrangerOut">
            <div class="content-StrangerOut">
              <div class="img-item" v-for="(item, index) in strangerOutList" :key="index">
                <img :src="item.imageUrl" @click="showData(item)">
              </div>
              <!-- hack插件不能滚动至最底部 -->
              <div class="img-item"></div>
            </div>
          </div>
          <div class="bottom-white"></div>
        </el-col>
        
        <el-col class="height module-vertical">
          <div class="title">实时入小区人员</div>
          <div class="height content-box" ref="StrangerIn">
            <div class="content-StrangerIn">
              <div class="img-item" v-for="(item, index) in strangerInList" :key="index">
                <img :src="item.imageUrl" @click="showData(item)">
              </div>
              <div class="img-item"></div>
            </div>
          </div>
          <div class="bottom-white"></div>
        </el-col>
      </el-row>
    </el-aside>

    <imageView 
      :visible.sync="showModal" 
      :data="itemData">
      <div class="img-slot">
        <div>
          <strong>{{itemData.name}} </strong>
          {{itemData.entryTime}}  从“{{itemData.doorName}}”门禁机{{itemData.inOrOut=='1'?'进入':'离开'}}</div>
      </div>
    </imageView>

  </el-container>
</template>

<script>
import BScroll from 'better-scroll'
import CountTo from 'vue-count-to'
import { fetchRemainList, strangerCount, fetchStrangerList, fetchWhiteList, fetchStrangerOutList, fetchStrangerInList } from "@/api/strangers";
import { mapGetters } from 'vuex';
import imageView from "@/components/imageView/index";

let remainScroll;
let strangerScroll;
let whiteScroll;
let StrangerInScroll;
let StrangerInLogId;
let StrangerInInterval;
let StrangerOutScroll;
let StrangerOutLogId;
let StrangerOutInterval;

export default {
  components: {
    imageView,
    CountTo
  },
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(StrangerInInterval);
    clearInterval(StrangerOutInterval);
    next();
  },
  beforeDestroy(){
    clearInterval(StrangerInInterval);
    clearInterval(StrangerOutInterval);
  },
  mounted(){
    // this.fetchRemainList()
    this.strangerCount()
    this.fetchStrangerList()
    this.fetchWhiteList()
    this.fetchStrangerInList()
    this.fetchStrangerOutList()

    clearInterval(StrangerInInterval)
    StrangerInLogId=null
    StrangerInInterval = setInterval(() => {
      this.fetchStrangerInList()
    }, 2000);

    clearInterval(StrangerOutInterval)
    StrangerOutLogId=null
    StrangerOutInterval = setInterval(() => {
      this.fetchStrangerOutList()
    }, 2000);
  },
  data(){
    return{
      loadingCount:false,
      loadingRemain:false,
      loadingStranger:false,
      loadingWhiteList:false,
      showModal:false,
      itemData:{},
      countData:{
        inCount: 0,
        outCount: 0,
        remainCount: 0,
        strangerCount: 0,
      },
      remainList:[],
      strangerList:[],
      whiteList:[],
      strangerOutList:[],
      strangerInList:[],
    }
  },
  methods:{
    showData:function(data){
      this.itemData = data
      this.showModal = true
    },
    fetchRemainList(offset=0){
      let self = this
      self.loadingRemain = true
      fetchRemainList({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
        "offset": offset,                   //起始行
        "limit": 30 
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.loadingRemain = false;
          self.remainList = offset==0?response.data.data : self.remainList.concat(response.data.data)
          self.$nextTick(()=>{
            if(!remainScroll){
              remainScroll = new BScroll(self.$refs.remain, {
                scrollY: true,
                click: true,
                pullUpLoad: true,
                mouseWheel: true
              })
              remainScroll.on('scrollEnd', () => {
                // 滚动到底部
                if (remainScroll.maxScrollY!==0 && remainScroll.y <= (remainScroll.maxScrollY + 150)) {
                  self.fetchRemainList(offset+30)
                }
              })
            }else{
              remainScroll.refresh()
            }
          })
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    strangerCount(){
      let self = this
      self.loadingCount = true
      
      strangerCount({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.loadingCount = false;
          self.countData = response.data.data
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    fetchStrangerList(offset=0){
      let self = this
      self.loadingStranger = true
      
      fetchStrangerList({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
        "offset": offset,                   //起始行
        "limit": 10 
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.loadingStranger = false;
          self.strangerList = offset==0?response.data.data : self.strangerList.concat(response.data.data)
          self.$nextTick(()=>{
            if(!strangerScroll){
              strangerScroll = new BScroll(self.$refs.stranger, {
                scrollX: true,
                click: true,
                mouseWheel: true
              })
              strangerScroll.on('scrollEnd', () => {
                if (strangerScroll.maxScrollX!==0 && strangerScroll.x <= (strangerScroll.maxScrollX + 150)) {
                  self.fetchStrangerList(offset+30)
                }
              })
            }else{
              strangerScroll.refresh()
            }
          })
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    fetchWhiteList(offset=0){
      let self = this
      self.loadingWhiteList = true
      
      fetchWhiteList({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
        "offset": offset,                   //起始行
        "limit": 10 
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.loadingWhiteList = false;
          self.whiteList = offset==0?response.data.data : self.whiteList.concat(response.data.data)
          self.$nextTick(()=>{
            if(!whiteScroll){
              whiteScroll = new BScroll(self.$refs.whiteList, {
                scrollX: true,
                click: true,
                mouseWheel: true
              })
              whiteScroll.on('scrollEnd', () => {
                if (whiteScroll.maxScrollX!==0 && whiteScroll.x <= (whiteScroll.maxScrollX + 150)) {
                  self.fetchStrangerList(offset+30)
                }
              })
            }else{
              whiteScroll.refresh()
            }
          })
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    fetchStrangerOutList(){
      let self = this
      self.loadingStrangerOut = true
      
      fetchStrangerOutList({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
        "offset": 0,                   //起始行
        "limit": 10 ,
        "strangerLogId": StrangerOutLogId
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.strangerOutList = StrangerOutLogId?response.data.data.concat(self.strangerOutList): response.data.data
          StrangerOutLogId = self.strangerOutList.length>0? self.strangerOutList[0].id: StrangerOutLogId
          self.$nextTick(()=>{
            if(!StrangerOutScroll){
              StrangerOutScroll = new BScroll(self.$refs.StrangerOut, {
                scrollY: true,
                click: true,
                pullUpLoad: true,
                mouseWheel: true
              })
              // StrangerOutScroll.scrollTo(0,StrangerOutScroll.maxScrollY,10000)
            }else{
              StrangerOutScroll.refresh()
            }

          })
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    fetchStrangerInList(){
      let self = this
      
      fetchStrangerInList({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
        "offset": 0,                   //起始行
        "limit": 10 ,
        "strangerLogId": StrangerInLogId
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.strangerInList = StrangerInLogId? response.data.data.concat(self.strangerInList): response.data.data
          StrangerInLogId = self.strangerInList.length>0?self.strangerInList[0].id: StrangerInLogId

          self.$nextTick(()=>{
            if(!StrangerInScroll){
              StrangerInScroll = new BScroll(self.$refs.StrangerIn, {
                scrollY: true,
                click: true,
                pullUpLoad: true,
                mouseWheel: true
              })
              // StrangerInScroll.scrollTo(0,StrangerInScroll.maxScrollY,10000)
            }else{
              StrangerInScroll.refresh()
            }

          })
        }
      }).catch(function (a) {
        console.error(a);
      })
    }
  },
}
</script>
<style scoped>
  .height{
    height: 100%;
  }
  .module{
    background-color: #fff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    padding: 10px 30px;
    margin: 0 0 20px 0;
  }
  .title{
    font-size: 14px;
    color: #223040;
    line-height: 30px;
  }
  .content-box{
    overflow: scroll;
  }
  .module-vertical{
    background-color: #fff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    padding: 0 20px;
    width: 180px;
    height: 100%;
    /* overflow-y: scroll; */
    text-align: center;
    position: relative;
  }
  .module-vertical>.title{
    position: relative;
    z-index: 10;
    background-color: #fff;
    padding: 20px 0;
  }
  .header{
    text-align: center;
    line-height: 30px;
    padding: 20px 0;
  }
  .content-remain{
    max-height: 450px;
    overflow-y: scroll;
  }
  .content-stranger{
    width: 100%;
    height: 110px;
    overflow-X: scroll;
    white-space: nowrap;
  }
  .content-stranger>div{
    width: fit-content;
  }
  .item{
    font-size: 14px;
    color: #223040;
  }
  .item>div{
    font-weight: 900;
    font-size: 20px;
  }
  .img-item{
    width: 109px;
    height: 88px;
    margin: 0 5px 5px 0;
    display: inline-block;
    vertical-align: top;
    position: relative;
  }
  .img-item>img{
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 4px;
  }
  .content-StrangerIn, .content-StrangerOut{
    text-align: center
  }
  .img-slot{
    margin-top: 10px;
    line-height: 24px;
  }
  .aside{
    margin-top: 20px;
  }
  .bottom-white{
    background-color: #fff;
    height: 20px;
    width: 100%;
    position: absolute;
    bottom:0;
    left: 0;
    z-index: 10;
  }
  .img-item>i{
    position: absolute;
    right: 5px;
    top: 5px;
  }
  .icon-baimingdan{
    background-color: #3c8aff;
  }
  .icon-heimingdan{
    background-color: #ff5959;
  }
  .icon-moshengren{
    background-color: #F5AA12;
  }
  .iconfont{
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
    color: #fff;
    border-radius: 50%;
    margin-left: 10px;
    margin-right: 5px;
  }
</style>


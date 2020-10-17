<template>
  <el-container style="padding:20px;" class="height">
    <el-main>
      <div class="header module" v-loading="loadingCount">
        <el-row>
          <el-col :span="8" class="item">
            目前经过人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.totalCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col>
          <el-col :span="8" class="item">
            经过白名单人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.whiteCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col>
          <el-col :span="8" class="item">
            经过陌生人人数
            <div>
              <count-to :startVal="0" :endVal="parseInt(countData.strangerCount) || 0" :duration="2500"></count-to>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="module">
        <div class="title">小区抓拍记录
          <el-button type="text" round icon="el-icon-refresh" @click="dynamicPicture()">刷新</el-button>
          <el-select v-model="deviceIds" multiple placeholder="筛选摄像头位置" collapse-tags @change="dynamicPicture()">
            <el-option
              v-for="item in deviceList"
              :key="item.id"
              :label="item.doorName"
              :value="item.videoboxId">
            </el-option>
          </el-select>
        </div>
        <el-tabs v-model="activeName" @tab-click="dynamicPicture()" :before-leave="_=>{offset=0}" v-loading="loadingPicture">
          <el-tab-pane name="all">
            <span slot="label" class="icon-title">全部</span>
            <div class="content-remain" ref="all">
              <div>
                <div style="min-height:450px">
                  <div class="img-item" v-for="(item, index) in pictureList" :key="index">
                    <i class="iconfont icon-moshengren" v-if="item.faceType=='0'" ></i>
                    <i class="iconfont icon-baimingdan" v-else-if="item.faceType=='1'" ></i>
                    <i class="iconfont icon-heimingdan" v-else-if="item.faceType=='2'" ></i>
                    <img :src="item.imageUrl" @click="showData(item)">
                  </div>
                </div>
                <div style="height: 30px"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="0">
            <span slot="label" class="icon-title"><i class="iconfont icon-moshengren"></i>陌生人</span>
            <div class="content-remain" ref="0">
              <div>
                <div style="min-height:450px">
                  <div class="img-item" v-for="(item, index) in pictureList" :key="index">
                  <!-- <div class="img-item"> -->
                    <i class="iconfont icon-moshengren"></i>
                    <img :src="item.imageUrl" @click="showData(item)">
                  </div>
                </div>
                <div style="height: 30px"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="1">
            <span slot="label" class="icon-title"><i class="iconfont icon-baimingdan"></i>白名单</span>
            <div class="content-remain" ref="1">
              <div>
                <div style="min-height:450px">
                  <div class="img-item" v-for="(item, index) in pictureList" :key="index">
                  <!-- <div class="img-item"> -->
                    <i class="iconfont icon-baimingdan"></i>
                    <img :src="item.imageUrl" @click="showData(item)">
                  </div>
                </div>
                <div style="height: 30px"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label" class="icon-title"><i class="iconfont icon-heimingdan"></i>黑名单</span>
            <div class="content-remain" ref="2">
              <div>
                <div style="min-height:450px">
                  <div class="img-item" v-for="(item, index) in pictureList" :key="index">
                  <!-- <div class="img-item"> -->
                    <i class="iconfont icon-heimingdan"></i>
                    <img :src="item.imageUrl" @click="showData(item)">
                  </div>
                </div>
                <div style="height: 30px"></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-main>

    
    <div v-if="showModal">
      <el-dialog
        title="查看图片"
        :visible.sync="showModal"
        width="632px"
        :close-on-click-modal="false">
        <div class="content">
          <img :src="itemData.imageUrl"/>
          <div class="img-slot">
            <div>
              <strong>{{itemData.name}} </strong>
              {{itemData.entryTime}}  从“{{itemData.doorName}}”门禁机通过</div>
          </div>
        </div>
      </el-dialog>
    </div>

  </el-container>
</template>

<script>
import BScroll from 'better-scroll'
import CountTo from 'vue-count-to'
import { dynamicPicture, dynamicDevice, dynamicCount } from "@/api/dymanic";
import { mapGetters } from 'vuex';

export default {
  components: {
    CountTo
  },
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  mounted(){
    this.dynamicCount()
    this.dynamicPicture()
    this.dynamicDevice()
  },
  data(){
    return{
      loadingCount:false,
      loadingPicture:false,
      showModal:false,
      itemData:{},
      offset:0,
      countData:{
        totalCount: 0,
        whiteCount: 0,
        strangerCount: 0
      },
      deviceIds:[],
      activeName:'all',
      deviceList:[],
      pictureList:[],
      pictureScroll: null
    }
  },
  methods:{
    showData:function(data){
      this.itemData = data
      this.showModal = true
    },
    dynamicPicture(faceType){
      let self = this
      self.loadingPicture = true
      dynamicPicture({
        "communityId": self.community.communityId,         //小区编号long
        "faceType": faceType || self.activeName,
        "deviceIds": self.deviceIds,
        "offset": self.offset,                   //起始行
        "limit": 50 
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.loadingPicture = false;
          self.pictureList = self.offset==0?response.data.data.list : self.pictureList.concat(response.data.data.list)

          if(!self.pictureScroll || self.offset==0){
            self.initScroll(self.activeName).then(_=>{
              self.pictureScroll.on('scrollEnd', () => {
                // 滚动到底部
                if (self.pictureScroll.maxScrollY!==0 && self.pictureScroll.y <= (self.pictureScroll.maxScrollY + 150)) {
                  self.offset = self.offset+30
                  self.dynamicPicture()
                }
              })
            })
          }else{
            self.pictureScroll.refresh()
          }
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    initScroll(activeName){
      return new Promise((resolve, reject)=>{
        this.$nextTick(()=>{
          this.pictureScroll = new BScroll(this.$refs[activeName], {
            scrollY: true,
            click: true,
            pullUpLoad: true,
            mouseWheel: true,
            pullDownRefresh:{
              threshold: 90,
              stop: 40
            }
          })
          resolve()
        })
      })
    },
    dynamicCount(){
      let self = this
      self.loadingCount = true
      
      dynamicCount({
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
    dynamicDevice(){
      let self = this
      self.loadingCount = true
      
      dynamicDevice({
        "communityId": self.community.communityId,         //小区编号long
        // "communityId": 10365,         //小区编号long
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.loadingCount = false;
          self.deviceList = response.data.data
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
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
    font-size: 18px;
    color: #223040;
    line-height: 60px;
    font-weight: 900;
  }
  .header{
    text-align: center;
    line-height: 30px;
    padding: 20px 0;
  }
  .content-remain{
    max-height: 450px;
    overflow-y: hidden;
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
    width: 100px;
    height: 110px;
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
    object-fit: cover;
  }
  .icon-title{
    font-size: 16px;
  }
  .icon-title>.iconfont{
    margin-right: 5px;

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
  }
  .img-slot{
    margin-top: 10px;
    line-height: 24px;
  }
  .content{
    text-align: center
  }
  .content>img{
    margin-bottom: 20px;
  }
</style>


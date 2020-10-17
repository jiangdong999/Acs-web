<template>
  <div>
    <!-- 最新通用页头 -->
    <el-page-header class="page-header" @back="$router.back()" content="人卡核验详情"></el-page-header>

    <div class="content">
      <div class="left-view" v-loading="loading1">
        <div class="leader-module">
          <el-image class="head-img" 
            :preview-src-list="[imageData.faceCardHousholdVO.faceUrl]"
            :src="imageData.faceCardHousholdVO.faceUrl" 
            fit="scale-down">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="leader-info">
            <h3>{{imageData.faceCardHousholdVO.fullNodeName}}</h3>
            
          </div>
          <div class="detail-info">
            卡号<label>{{imageData.faceCardHousholdVO.cardNo}}</label> <br>
            姓名<label>{{imageData.faceCardHousholdVO.cardholder}}</label> 
          </div>

          <el-button 
            class="leader-btn"
            type="primary" 
            @click="handleFreeze(imageData.faceCardHousholdVO.cardId)"
            v-if="(imageData.faceCardHousholdVO.cardStatus=='1' || imageData.faceCardHousholdVO.cardStatus=='5')"
            size="small">
            禁用
          </el-button>
          
          <el-button
            class="leader-btn"
            type="primary"
            @click="handleEnable(imageData.faceCardHousholdVO.cardId)"
            v-if="imageData.faceCardHousholdVO.cardStatus=='6'"
            size="small">
            启用
          </el-button>
        </div>

        <div class="other-module">
          <label>同房间人脸数据</label>
          <div class="head-list clearfix">
            <el-image class="head-img" 
              v-for="(img, i) in imageData.imageList"
              :key="i"
              :src="img" 
              :preview-src-list="[img]"
              fit="scale-down">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </div>
      </div>
      <div class="right-view" v-loading="loading2">
        <div>
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label="开门时间" prop="timeRange">
              <el-date-picker
                v-model="timeRange"
                @change="loadData()"
                type="datetimerange"
                value-format="yyyyMMddHHmmssSSS"
                align="right"
                :picker-options="beforePickerOptions3()"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="至"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <!-- <span class="control-right">
              <el-button @click="handleReset()">重置</el-button>
              <el-button type="primary"  @click="loadData()">搜索</el-button>
            </span> -->
          </el-form>
        </div>
        <div>
          <el-table :data="tableData" stripe>
            <div slot="empty" class="empty-table"></div>
            <el-table-column
              type="index"
              :index="indexMethod"
              
               
              width="60" label="序号">
            </el-table-column>
            <el-table-column
              prop="doorPosition"
              
              label="开门时间"
               
              min-width="100">
              <template slot-scope="scope">
                {{ scope.row.openTime | formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              prop="doorPosition"
              
              label="开门位置"
               
              min-width="100">
            </el-table-column>
            <el-table-column
              
              label="抓拍图片"
               
              min-width="100"
              fixed="right">
              <template slot-scope="scope">
                 <el-image                      
                  :src="scope.row.imageUrl" 
                  fit="scale-down"
                  class="pic-col"   
                  v-if="scope.row.imageUrl != ''"             
                  :preview-src-list="[scope.row.imageUrl]">
                  <div slot="error" class="image-slot">
                    <span class="img-err pic-col"></span>
                  </div>
                </el-image>
              </template>
            </el-table-column>
          </el-table>
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
  </div>
</template>

<script>
import mixin from "@/utils/mixin";
import {fetchImageList, loadDetails} from '@/api/personCard'
import { enableCard, freezeCard } from "@/api/card";
import {formatDateTime} from "@/filters/index";
import {beforePickerOptions3} from "@/utils/validate";

export default {
  mixins: [mixin],
  filters:{formatDateTime},
  data(){
    return {
      loading1: false,
      loading2: false,
      searchForm: {
        startTime: '',
        endTime: ''
      },
      imageData: {
        faceCardHousholdVO: {},
        imageList: []
      }
    }
  },
  computed:{
    timeRange:{
      set(newValue){
        this.searchForm.startTime = newValue?newValue[0]:''
        this.searchForm.endTime = newValue?newValue[1]:''
      },
      get(){
        return this.searchForm.startTime? [this.searchForm.startTime,this.searchForm.endTime]: []
      }
    }
  },
  methods: {
    beforePickerOptions3,
    // handleReset() {
    //   this.timeRange = ''
    //   this.loadData()
    // },
    fetchImageList() {
      let self = this;
      self.loading1 = true
      fetchImageList(this.$route.query).then(function (response) {
        if (response.data && response.data.code==1) {
          self.imageData = response.data.data;
        }
      }).catch(function (a) {
        console.error(a)
      }).finally(_=>{
        self.loading1 = false
      });
    },
    loadData: function (offset=0, limit=10) {
      let self = this;
      self.loading2 = true;
      let listObj = {
        offset: offset,
        limit: limit
      }

      loadDetails({...self.searchForm, ...listObj, ...self.$route.query}).then(function (response) {
        if(response.data && response.data.code===1){
          self.tableData = response.data.data.list || [];
          self.totalRecord = response.data.data.count;

          offset==0 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
        self.loading2 = false;
      })
    },
    handleEnable(cardId){
      let self = this;
      self.$confirm('确定启用此门禁卡吗？').then(_ => {
        enableCard({
          cardId: cardId
        }).then(function (response) {
          if (response.data && response.data.code==1) {
            self.$message({
              message: response.data.message,
              type: 'success'
            });
            self.fetchImageList()
          }
        }).catch(function (a) {
          console.error(a)
        })
      }).catch((a) => {
        console.error(a);
      });
    },
    handleFreeze(cardId){
      let self = this;
      self.$confirm('确定禁用此门禁卡吗？').then(_ => {
        freezeCard({
          cardId: cardId
        }).then(function (response) {
          if (response.data && response.data.code==1) {
            self.$message({
              message: response.data.message,
              type: 'success'
            });
            self.fetchImageList()
          }
        }).catch(function (a) {
          console.error(a)
        })
      }).catch((a) => {
        console.error(a);
      });
    }
  },
  created() {
    this.fetchImageList()
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
  .head-img{
    width: 86px;
    height: 103px;
    display: inline-block;
    background-color: #f1f1f1;
    text-align: center;
    line-height: 103px;
    font-size: 25px;
  }
  .content{
    padding: 20px;
    display: flex;
  }
  .content>div{
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
  }
  .content>.left-view{
    min-width: 475px;
  }
  .content>.right-view{
    margin-left: 20px;
    flex: 1 1 750px;
  }
  .leader-module{
    position: relative;
    .head-img{
      margin-right: 20px;
    }
    .leader-info{
      display: inline-block;
      vertical-align: top;
      width: 50%;
      h3{
        margin: 0;
        font-size: 16px;
        width: 100%;
        word-break: break-all;
      }     
    }
    .detail-info{   
      position: absolute;
      left: 110px;
      bottom: 4px;  
      font-size: 12px;
      font-weight: 900;
      line-height: 22px;
      label{
        color: #888888;
        margin-left: 10px;
      }
    }
    .leader-btn{
      float: right
    }
  }
  .other-module{
    margin-top: 40px;
    font-size: 16px;
    color: #434E5C;
    .head-list{
      padding-top: 20px;
      margin-right: -20px;
      .head-img{
        margin-right: 20px;
        margin-bottom: 20px;
        float: left;
      }
    }
  }
  .control-right{
    margin-bottom: 20px;
  }
</style>

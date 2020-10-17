<template>
  <div>
    <div class="app-container">
      <div class="table-container">
        <div class="table-control-panel clearfix">
          <span class="control-left list-title">黑名单列表</span>
        </div>
        <el-row>
          <el-table :data="tableData" stripe v-loading="loading">
            <el-table-column
              prop="doorName"
              min-width="200" label="门口名称">
            </el-table-column>
            <el-table-column
              prop="targetName"
              min-width="200"
              label="黑名单名称">
            </el-table-column>
            <el-table-column
              prop="alarmTime"
              min-width="180"
              label="告警时间">
              <template slot-scope="scope">
                {{ scope.row.alarmTime | formatDateTime}}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              fixed="right"
              min-width="180">
              <template slot-scope="scope">
                <el-button
                type="text"
                @click="showData(scope.row)">
                查看图片
                </el-button>
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

    <audio id="tipMusic" ref="audio">
      <source :src="alarmMP3" type="audio/mp3">
    </audio>

    <div v-if="showModal">
      <el-dialog
        title="查看大图"
        :show-close="true"
        :visible.sync="showModal"
        width="758px"
        :close-on-click-modal="true">
          <imageLarger :data="itemData">
            <div>{{itemData.alarmTime | formatDateTime}} {{itemData.targetName}}</div>
          </imageLarger>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import {fetchBlacklist} from "@/api/blackList";
  import {formatDateTime} from "@/filters/index";
  import alarmMP3 from '@/assets/audio/alarm.mp3'
  import imageLarger from "@/components/imageView/imageLarger";
  import mixin from "@/utils/mixin";

  let firstData;
  let interval;
  export default {
    mixins: [mixin],
    components: {
      imageLarger
    },
    filters:{
      formatDateTime
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(interval);
      next();
    },
    methods: {
      loadData:function(offset=0, limit=10){
        let self = this;

        return new Promise((resolve, reject) => {
          self.loading = true;
          fetchBlacklist({
            offset: offset,
            limit: limit,
          }).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.tableData = response.data.dataList || [];
              self.totalRecord = response.data.totalCount;
              self.loading = false;

              offset==0 && self.pageReset()
              resolve()
            }
          }).catch(function (a) {
            console.error(a);
            self.loading = false;
          })
        })
        
      },
      checkList:function(){
        let self = this;
        fetchBlacklist({
          offset: 0,
          limit: 1,
        }).then(function (response) {
          if (response.data && response.data.code === 1) {
            try{
              if(firstData.id != response.data.dataList[0].id){
                self.tableData = response.data.dataList.concat(self.tableData);
                self.showData(response.data.dataList[0]);
                self.$refs.audio.play();
                firstData =  response.data.dataList[0]
              }
            }catch(e){

            }
          }
        }).catch(function (a) {
          console.error(a);
          self.loading = false;
        })
      },
      showData:function(data){
        this.itemData = data
        this.showModal = true
      }
    },
    mounted() {
      this.loadData().then(()=>{
        firstData = this.tableData[0];
        interval = setInterval(this.checkList,10000)
      })
      
    },
    data() {
      return {
        alarmMP3,
        itemData:{},
        showModal:false,
      }
    }
  }
</script>

<style>
  .img-box{
    width:100%;
  }
  .img-box img{
    width:100%;
  }
</style>
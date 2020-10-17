<template>
  <div>
    <div class="header">
      <span class="control-left list-title">抓拍人脸列表</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="image-group">
        <img 
        v-for="(item,i) in imageList"
        :key="i"
        @click="handleShow(item)" 
        :src="item.imageUrl"/>
      </div>
    </div>

    <div v-if="showModal">
      <el-dialog
        title="查看图片"
        width="632px"
        :visible.sync="showModal"
        :close-on-click-modal="false">
        <div class="img-box">
          <img :src="imageData.imageUrl"/>
          <div class="img-slot">
            抓拍时间：{{imageData.snapTime | formatDateTime}} <br>
            抓拍地点：{{imageData.doorName}} <br>
            经纬度：经度 {{imageData.longitude}} ，纬度 {{imageData.latitude}} 
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import mixin from "@/utils/mixin";
  import {fetchSnapList, fetchSnapIncr} from "@/api/snapFace";
  import {formatDateTime} from "@/filters/index";

  let $el
  let _scrollTop = 0
  let updateTimeout
  export default {
    filters:{
      formatDateTime
    },
    data() {
      return {
        loading: false,
        showModal: false,
        imageData:{},
        imageList:[]
      }
    },
    methods: {
      handleShow(data){
        this.imageData = {
          "doorName": data.doorName,
          "imageUrl": data.imageUrl,
          "longitude": data.longitude,
          "latitude": data.latitude,
          "snapTime": data.snapTime
        }
        this.showModal = true
      },
      onScroll(e){
        let el = e.target
        
        // 距离底部小于50高度的时候进行加载判断
        if((el.scrollHeight-50) < (el.scrollTop+el.offsetHeight)){
          // 判断滚动条的滚动方向
          if((el.scrollTop - _scrollTop) > 0){

            !this.loading && this.loadData(this.offset, 50, true)
          }
          _scrollTop = el.scrollTop

        }else{
          // console.log('还没到')
        }
      },
      loadData: function (offset, limit, contact) {
        let self = this;
        self.loading = true;
        offset = offset || 0;
        limit = limit || 10;
        let listObj = {
          offset: offset,
          limit: limit
        }

        fetchSnapList({...self.searchForm, ...listObj}).then(function (response) {
          if(response.data && response.data.code===1){
            self.imageList = contact? self.imageList.concat(response.data.data.list) : response.data.data.list;

            if(self.imageList.length>0){
              self.offset = offset + limit
              self.$nextTick(()=> {
                $el.addEventListener('scroll', self.onScroll)
              })

              updateTimeout = setTimeout(() => {
                self.updateData(self.imageList[0].id)
              }, 2000);
            }else{
              setTimeout(() => {
                self.loadData(0, 100)
              }, 2000);
            }
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          self.loading = false;  
        })
      },
      updateData(id){
        let self = this;

        fetchSnapIncr({id: id}).then(function (response) {
          if(response.data && response.data.code===1){
            self.imageList.unshift(...response.data.data.list);
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{

          updateTimeout = setTimeout(() => {
            self.updateData(self.imageList[0].id)
          }, 2000);

        })
      }
    },
    mounted() {
      this.loadData(0, 100)
      $el = document.querySelector(".image-group")
    },
    destroyed(){
      clearTimeout(updateTimeout)
    }
  }
</script>
<style scoped>
  .header{
    line-height: 36px;
    padding: 6px 30px;
    background-color: #fff;
    font-weight: 900;
    cursor: default;
  }
  .content{
    margin: 15px 10px 5px 10px;
  }
  .image-group{
    height: calc(100vh - 180px);
    overflow-y: scroll;
  }
  .image-group img{
    width: 120px;
    height: 100px;
    object-fit: cover;
    object-position: 50% 50%;
    margin: 0 10px 10px 0;
    border-radius: 5px;
    cursor: pointer;
  }
  .img-box{
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
  }
  .img-box img{
    width: 100%;
    height: 480px;
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
    object-fit: scale-down;
    object-position: 50% 50%;
    border-radius: 7px;
  }
  .img-slot{
    font-size: 14px;
    color: #333333;
    line-height: 25px;
  }
</style>

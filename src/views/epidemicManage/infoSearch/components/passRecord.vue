<template>
  <div class="pass-box">
    <div class="search-box">
      <label>搜索日期</label>
      <!-- <el-date-picker v-model="searchForm.aa" type="date"
        class="sSize-input-date"
        value-format="yyyyMMdd000000000"
        placeholder="选择日期">
      </el-date-picker>　 -->
      <!-- <el-form-item label="开门时间" prop="startEntryTime"> -->
        <el-date-picker
          v-model="searchForm.startEntryTime" type="date"
          class="sSize-input-date"
          :picker-options="beforePickerOptions(searchForm.endEntryTime)"
          placeholder="选择日期"
        >
        </el-date-picker>
        -
        <el-date-picker
          v-model="searchForm.endEntryTime" type="date"
          class="sSize-input-date"
          :picker-options="afterPickerOptions(searchForm.startEntryTime)"
          placeholder="选择日期"
        >
        </el-date-picker>
        <el-button type="primary" class="search-btn" @click="loadData(0,5)">搜索</el-button>
      <!-- </el-form-item> -->    
    </div>
    <div class="btn-box">
      <!-- <el-button type="primary" class="search-btn" @click="loadData(0,5)">搜索</el-button> -->
    </div>
    
    <div :class="{'wrap-box':tableData.length>0,'wrap-box1':tableData.length==0}">     
      <div class="record-box" v-for="(item,index) in tableData" :key="index">
        <div class="record-item">
          <el-image
            :src="item.imageUrl"
            fit="scale-down"
            class="pic-col pic"
            :preview-src-list="[item.imageUrl]"
            :z-index="2001"
            >
            <div slot="error" class="image-slot">
              <span class="img-err pic-col"></span>
            </div>
          </el-image>
          <div class="time">
            <span>{{item.communityName}}</span><br>
            <span>{{item.openDoorTime | formatDateTimeHHmmss}}</span>
          </div>
          <div class="video">
            <img src="../../../../assets/icon/vedio.png">
          </div>
        </div>
        
      </div>
    </div>
    
    <div style="text-align:center;">
      <div style="text-align:center;margin-bottom: 10px;" v-if="tableData.length==0">暂无数据</div>
      <el-button type="text" v-else size="small" @click="loadData(offset,limit)">查看更多</el-button>
    </div>   
    <div class="form-dialog-control-area">
      <el-button @click="$parent.handleClose()">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { formatDateTimeHHmm } from "@/filters/index"
import { fetchOpening } from "@/api/record";
import {beforePickerOptions, afterPickerOptions} from "@/utils/validate";
import dateUtil from "@/utils/times";


  export default{
    props: ['formData'],
    filters: {
      formatDateTimeHHmm
    },
    data () {
      return {
        searchForm: {
          startEntryTime: '',
          endEntryTime: '',
        },
        offset: 0,
        limit: 5,
        tableData: []
      }
    },
    created () {
      this.loadData(this.offset,this.limit)
    },
    methods: {
      beforePickerOptions,
      afterPickerOptions,
      loadData (offset,limit) {
        let self = this;
        fetchOpening({
          communityId: this.formData.communityId,
          householdId: this.formData.householdId,
          offset: offset,
          limit: limit,
          startEntryTime: dateUtil.toServerDateString(self.searchForm.startEntryTime) || '',
          endEntryTime: dateUtil.toServerDateString(self.searchForm.endEntryTime) || ''        
        }).then(function(response) {
          if (response.data && response.data.code == 1) {
            self.offset = self.tableData.length
            if(offset!=0){
              self.tableData = self.tableData.concat(response.data.dataList)
            }else{
              self.tableData = response.data.dataList
            }
            // console.log('self.tableData',self.tableData)
          }
        })
        .catch(function(a) {
          console.error(a);
        });
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .pass-box{
    padding: 0px;
    .search-box{
      margin-bottom: 22px;
      label{
        font-size: 12px;
        font-weight: 600;
        color: #333333;
        line-height: 16px;
        margin-right: 10px;
      }
      
      
    } 
    .wrap-box{
      width: 450px;
      height: 400px;      
      overflow-y: scroll;
    }
    .wrap-box1{
      width: 450px;
    }
    .btn-box{
      overflow: hidden;
      margin-bottom: 10px;
    }
    .search-btn{
      float: right;
    }
    .record-item{
      width: 100%;
      padding: 10px 20px 10px 10px;
      background: #F0F2F5;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .pic{
      float: left;
      background: #333333;
    }
    .time{
      float: left;
      // background: blue;
      padding-top: 8px;
      padding-bottom: 8px;
      margin-left: 20px;
      span{
        line-height: 21px;
      }
      span:nth-of-type(1){
        margin-bottom: 4px;
      }
    }
    .video{
      float: right;
      // background: green;
      img{
        display: inline-block;
        width: 36px;
        margin-top: 12px;
      }
    }
  }
  .control-panel input.el-input__inner, div.sSize-input-date.el-input{
    width: 144px !important;
  }
</style>

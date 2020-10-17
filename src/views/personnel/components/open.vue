<template>
  <div class="table-container" v-loading="loading">
    <el-row>
      <el-table :data="tableData" stripe>
        <div slot="empty" class="empty-table"></div>
        <el-table-column
          type="index"
          :index="indexMethod"
          
           
          width="60" label="序号">
        </el-table-column>
        <el-table-column
          prop="fullNodeName"
          
           
          min-width="200" label="门禁机名称">
        </el-table-column>
        <el-table-column
          prop="openType"
          
          min-width="200"
           
          label="开门方式">
        </el-table-column>
        <el-table-column
          prop="doorOpener"
          
          min-width="200"
           
          label="开门者">
        </el-table-column>
        <el-table-column
          
          label="留影"
           
          min-width="180">
          <template slot-scope="scope">
            <el-button
            type="text"
            @click="showImage(scope.row)">
              查看截图
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="openDoorTime"
          
           
          label="拜访时间">
          <template slot-scope="scope">
            {{ scope.row.openDoorTime | formatDateTime}}
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
        layout="prev, pager, next, slot"
        :total="totalRecord">
        <label class="page-slot-left">共计<label> {{totalRecord}} </label>条数据</label>
      </el-pagination>
    </div>

    <imageView 
      :visible.sync="showModal" 
      :data="itemData">
    </imageView>
  </div>
</template>
<script>
import {openExport} from "@/api/record";
import {fetchOpening} from "@/api/personnel";
import {formatDateTime} from "@/filters/index"
import imageView from "@/components/imageView/index";
import mixin from "@/utils/mixin";

export default {
  mixins: [mixin],
  components: {
    imageView
  },
  filters:{
    formatDateTime
  },
  data(){
    return {
      loading: false,
      showModal: false,
      offset: 0,
      limit: 10,
      totalRecord: 0,
      page:1,
      tableData: [],
      itemData: {}
    }
  },
  methods:{
    loadData: function (offset=0, limit=10) {
      let self = this;
      self.loading = true;
      let listObj = {
        offset: offset,
        limit: limit,
        householdId: this.$route.query.householdId 
      };
      fetchOpening(listObj).then(function (response) {
        if (response && response.data.code === 1) {
          self.tableData = response.data.dataList || [];
          self.totalRecord = response.data.totalCount;
          self.loading = false;

          offset==0 && self.pageReset()
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    showImage:function(data){
      this.itemData = data;
      this.showModal = true;
    }
  },
  mounted(){
    this.loadData()
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

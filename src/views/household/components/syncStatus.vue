<template>
  <div>
    <div class="loading" v-if="loading"></div>
    <div class="padding-content open-record" v-else>               
      <el-row>
        <el-table :data="tableData" stripe :highlight-current-row="true">
          <el-table-column
            prop="doorName"
            
             
            min-width="140"
            label="设备名称">
          </el-table-column>
          <el-table-column
            prop="doorDeviceId"
             
            
            min-width="140"
            label="设备编号">
          </el-table-column>
          <el-table-column
            prop="communityName"
             
            
            min-width="140"
            label="同步状态">
            <template slot-scope="scope">
              <span v-if="scope.row.pushStatus=='0'" class="col-red"><i class="iconfont icon-tongbushibai"></i>同步失败</span>
              <span v-else-if="scope.row.pushStatus=='1'" class="col-green"><i class="iconfont icon-tongbuchenggong"></i>同步成功</span>
              <span v-else class="col-blue"><i class="iconfont icon-tongbuzhong"></i>同步中...</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <div style="text-align:center;">
      <el-button @click="$parent.handleClose()">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { getFaceStatus } from "@/api/face";


export default{
  props: ['communityId','householdFaceId'],
  created () {
    this.getStatus()
  },
  data () {
    return{
      loading: false,
      tableData: []
    }
  },
  methods:{
    getStatus () {
      let self = this
      self.loading = true
      getFaceStatus({
        communityId: self.communityId,
        householdFaceId: self.householdFaceId,
      }).then(function (response) {
        self.loading = false
        if (response.data && response.data.code === 1) {
          self.tableData = response.data.dataList
        }
      }).catch(function (a) {
        self.loading = false
      }).finally(_=>{
        self.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.loading{
  width: 639px;
  height: 361px;
  background-image: url(../../../assets/gif/loadingWhite.gif);
  background-repeat: no-repeat;
  background-position: center center;
}
.col-red{
  font-size: 14px;
  color: #DC5050;
}
.col-blue{
  font-size: 14px;
  color: #79A2F4;
}
.col-green{
  font-size: 14px;
  color: #59C673;
}
.iconfont{
  margin-right: 6px;
}
</style>
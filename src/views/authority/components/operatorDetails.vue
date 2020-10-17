<template>
  <div>
    <div class="header">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
      <span>操作人员详情</span>
      <span class="control-right">
        <el-button type="primary" @click="showDialog=true">编辑</el-button>
      </span>
    </div>
    <div class="content" v-loading="loading">
      <div class="operator" v-if="!loading">
        <el-table :data="[adminData]" stripe fit 
        :header-cell-style="{'background-color':'#F2F6F6'}">
          <el-table-column
            prop="name"
            label="操作人员"
            min-width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="所属机构"
            min-width="180">
            <template slot-scope="scope">
              {{scope.row.orgInfo.orgName}}
            </template>
            <template slot-scope="scope">
              {{scope.row.orgInfo.orgName}}
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            min-width="120"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="name"
            min-width="120"
            label="角色">
            <template slot-scope="scope">
              <template v-for="item in scope.row.roleList">
                {{item.roleName+'；' }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="citizenId"
            label="身份证号码"
            min-width="180">
          </el-table-column>
        </el-table>
      </div>
      <div class="community">
        <div class="title">分管小区</div>
        <div class="community-view">
          <div class="cell" v-for="(item, i) in communityList" :key="i">
            <div>{{item.communityName}}</div>
            <span>{{item.communityAccount}}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDialog">
      <el-dialog
        title="编辑操作人员"
        :show-close="false"
        :visible.sync="showDialog"
        width="1011px"
        :close-on-click-modal="false">
        <operator-edit :data="adminData" @close="handleClose()"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { operatorDetails, getOperatorCommunitis } from "@/api/authority";
  import operatorEdit from "./operatorEdit";

export default {
  components:{
    operatorEdit
  },
  data(){
    return {
      showDialog:false,
      loading:false,
      adminData: {},
      communityList:[]
    }
  },
  methods:{
    handleClose(){
      this.showDialog = false;
      this.loadDetails()
      this.getCommunityList()
    },
    loadDetails(){
      let self = this;
      self.loading = true;

      operatorDetails({
        id: self.$route.query.id
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          let data = response.data.data
          self.adminData = data
          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    getCommunityList: function () {
      let self = this;
      
      getOperatorCommunitis({
        id: this.$route.query.id
      }).then(function (response) {
        if (response.data && response.data.code === 1) {
          self.communityList = response.data.dataList || [];
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
  },
  mounted(){
    this.loadDetails()
    this.getCommunityList()
  }
}
</script>

<style scoped>
  .content{
    background-color: #fff;
    margin-top: 15px;
    padding: 30px;
  }
  .header{
    line-height: 70px;
    padding: 0 30px;
    background-color: #fff;
    font-weight: 900;
    cursor: default;
  }
  .community{
    margin-top: 30px;
  }
  .title{
    font-size: 16px;
    color: rgb(34, 48, 64);
    line-height: 40px;
    font-weight: 900;
  }
  .community-view{
    padding: 20px 20px 20px 5px;
    background-color: #F0F2F5;
    border-radius: 10px;
    font-size: 0;
  }
  .community-view .cell{
    display: inline-block;
    width: 180px;
    height: 100px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    margin-left: 15px;
    font-size: 18px;
    line-height: 20px;
    padding: 20px;
    transition: .3s all;
  }
  .cell:hover{
    box-shadow: 6px 8px 8px 0px rgba(0, 0, 0, 0.05);
  }
  .cell>div{
    font-weight: 900;
    margin-bottom: 10px;
    color: #333333;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .cell>span{
    color: #999999;
  }
</style>

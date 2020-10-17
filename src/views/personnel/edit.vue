<template>
    <div>
        <div class="app-container">
            <div class="module-title">
                <mallki className="mallki-text" text="编辑"></mallki>
            </div>
            <div class="edit-main">
                <div class="double-hr">
                    <span class="control-left">
                        <el-button @click="back()">返回</el-button>
                        <el-button @click="save()" type="primary" v-if="tabName == 'baseInfo'">保存</el-button>
                    </span>
                </div>
                <div class="tab-group">
                    <el-tabs v-model="tabName">
                        <el-tab-pane label="基础资料" name="baseInfo" lazy>
                            <component :is="baseInfoViewName" ref="baseInfo"/>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="房间列表" name="room" lazy v-if="false"> -->
                        <el-tab-pane label="房间列表" name="room" lazy v-if="isFamily">
                            <room @updateCardList="updateCardList"/>
                        </el-tab-pane>
                        <el-tab-pane label="门禁卡列表" name="card" lazy>
                            <card ref="card"/>
                        </el-tab-pane>
                        <el-tab-pane label="开门记录" name="open" lazy v-if="!hasPermission(['OTHER_ROLE','SJF_ROLE','OPEN_ACCOUNT'])">
                            <open/>
                        </el-tab-pane>
                        <el-tab-pane label="人脸信息" name="face" lazy>
                            <component :is="faceViewName"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import family from './components/baseInfoFamily'
import worker from './components/baseInfoWorker'
import room from './components/room'
import card from './components/card'
import open from './components/open'
import faceFamily from './components/faceFamily'
import faceWorker from './components/faceWorker'
import hasPermission from '@/utils/menuPermission.js';

export default {
    name: 'householdEdit',
    components:{
        family,
        worker,
        room,
        card,
        open,
        faceFamily,
        faceWorker
    },
    data() {
      return {
        isFamily: true,
        tabName: 'baseInfo'
      };
    },
    methods: {
      hasPermission,
      back() {
        this.$router.back()
      },
      save(){
        this.$refs.baseInfo.handleSubmit()
      },
      updateCardList() {
        this.$refs.card.loadData()
      }
    },
    computed:{
        baseInfoViewName:function(){
            // return this.isFamily?'family':'worker'
            return 'worker'
        },
        faceViewName:function(){
            // return this.isFamily?'faceFamily':'faceWorker'
            return 'faceWorker'
        },
    },
    beforeRouteEnter(to, from, next){
        next(vm=>{
            vm.tabName = to.query.tab?to.query.tab:'baseInfo'
            vm.isFamily = to.name=='familyEdit'
        })
    }
}
</script>
<style scoped>
    .double-hr{
        padding: 16px 30px;
        border-top:1px solid #E4E7ED;
        border-bottom:1px solid #E4E7ED;
    }
    .tab-group{
        padding: 0 30px;
        margin-top: 10px;
    }
    .edit-main{
        background-color: #fff;
    }
</style>

<template>
  <section style="padding:0 20px">
    <el-steps :active="activeIndex" simple>
      <el-step title="权限开通">
        <!-- <i slot="icon" class="iconfont icon-Id"></i> -->
      </el-step>
      <el-step title="录入家人">
        <!-- <i slot="icon" class="iconfont icon-jiaren"></i> -->
      </el-step>
      <el-step title="结果查看">
        <!-- <i slot="icon" class="iconfont icon-xiaolianmanyifuwu"></i> -->
      </el-step>
    </el-steps>
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" inline label-width="80px">
        <div v-show="activeIndex==0">

          <div class="module">
            <div class="module-title">权限申请卡信息</div>
            <el-row>
              <el-col :span="10">
                <el-form-item label="卡号" prop="houseCardNo">
                  <el-input v-model="form.houseCardNo" ref="houseCard" placeholder="请用读卡器读取卡号" clearable maxlength="8"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <room-info class="module" ref="roomInfo"
            :communityId="community.communityId"
            :assignNode="assignNode"
            @changeNode="loadRoomData">
            <div class="module-title">关联房间</div>
          </room-info>

          <div class="module">
            <div class="module-title">房屋信息</div>
            <div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="户型" prop="houseType">
                    <el-input v-model="form.houseType" placeholder="请输入" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="建筑面积" prop="roomArea">
                    <el-input-number v-model="form.roomArea" :precision="1" :step="10" :min="1" :max="9999" class="room-input-number"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="使用状态" prop="roomUseStatus">
                    <el-select v-model="form.roomUseStatus" filterable clearable>
                      <el-option
                        v-for="item in roomUseStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                      <el-option label="未办理" :value="5" :disabled="true"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="房屋用途" prop="roomUse">
                    <el-select v-model="form.roomUse" filterable clearable>
                      <el-option label="无" :value="-1" :disabled="true"></el-option>
                      <el-option
                        v-for="item in roomUseTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="房产性质" prop="roomProperty">
                    <el-select v-model="form.roomProperty" filterable clearable>
                      <el-option label="无" :value="0" :disabled="true"></el-option>
                      <el-option
                        v-for="item in roomPropertyOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="module">
            <div class="module-title">产权人信息 <el-button type="text" v-if="disabled" @click="delOwner(form.owner[0])"> 删除产权人信息</el-button></div>
            <el-form ref="ownerForm" :model="form.owner[0]" :rules="rules" inline label-width="80px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="姓名" prop="householdName">
                    <el-input v-model="form.owner[0].householdName" placeholder="请输入" clearable :disabled="disabled" :maxlength="15"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="身份证号" prop="citizenId">
                    <el-input v-model="form.owner[0].citizenId" placeholder="请输入" clearable :disabled="disabled" :maxlength="18"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="form.owner[0].phone" placeholder="请输入" clearable :disabled="disabled" :maxlength="11"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <div v-show="activeIndex==1">
          <div class="module">
            <div class="module-title">家庭成员</div>
            <div class="table-box" v-loading="listLoading">
              <el-table
                :data="form.memberList"
                stripe
                max-height="250"
                style="width: 100%">
                <el-table-column
                   
                  prop="householdName"
                  label="成员"
                  min-width="180">
                  <template slot-scope="scope">
                    <div v-if="scope.row.edit" class="mini-input">
                      <el-input v-model="scope.row.householdName" class="edit-input" size="small" clearable placeholder="请输入姓名" :maxlength="15"/>
                    </div>
                    <span v-else>{{ scope.row.householdName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="contact"
                  label="关系"
                  min-width="180">
                  <template slot-scope="scope">
                    <div class="mini-input">
                      <el-select v-model="scope.row.relationship" filterable clearable :disabled="!scope.row.edit">
                        <el-option
                          v-for="item in relationshipOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                   
                  prop="citizenId"
                  min-width="180"
                  label="身份证号">
                  <template slot-scope="scope">
                    <div v-if="scope.row.edit">
                      <el-input v-model="scope.row.citizenId" class="edit-input" size="small" clearable placeholder="请输入身份证号" maxlength="18"/>
                    </div>
                    <span v-else>{{ scope.row.citizenId | formatCitizenId }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                   
                  prop="phone"
                  min-width="120"
                  label="联系方式">
                  <template slot-scope="scope">
                    <div v-if="scope.row.edit">
                      <el-input v-model="scope.row.phone" class="edit-input" size="small" clearable placeholder="请输入联系方式" maxlength="11"/>
                    </div>
                    <span v-else>{{ scope.row.phone }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  
                   
                  fixed="right"
                  label="操作"
                  min-width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="delHousehold(scope.row, scope.$index)">删除</el-button>
                    <el-button v-if="scope.row.edit" type="text" size="small" @click="memberValid(scope.row)">完成</el-button>
                    <el-button v-else type="text" size="small" @click="scope.row.edit=true">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align:center">
                <el-button type="text" class="btn-style" icon="el-icon-plus" @click="addFamily">新增成员</el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeIndex==2">
          <div class="step-success">
            <img src="../../assets/image/success.png"/>
            <p>成功新增权限申请卡</p>
          </div>
        </div>
      </el-form>
    </div>
    <div class="form-dialog-control-area">
      <el-button type="primary" @click="handleNext()"  v-if="activeIndex==0">下一步</el-button>
      <el-button type="primary" @click="activeIndex--" v-if="activeIndex==1">上一步</el-button>
      <el-button type="primary" @click="handleSubmit()"  v-if="activeIndex==1">提交</el-button>
      <el-button                @click="$parent.handleClose()" v-if="activeIndex==2">知道了</el-button>
    </div>
  </section>
</template>

<script>
import roomInfo from "../personnel/components/components/roomInfo";
import {mapGetters} from 'vuex'
import {roomUseTypeOptions, roomUseStatusOptions, roomPropertyOptions, relationshipOptions} from "@/utils/options"
import {formatCitizenId} from "@/filters/citizenId"
import {loadRoom} from "@/api/room";
import {addRoomCard, householdList, delHousehold} from "@/api/roomCard";
import { validateCitizenId, validateHexadecimal, validateNumber, validateDecimalsNumber } from "@/utils/rules";

export default {
  props:['assignNode'],
  components: {
    roomInfo
  },
  filters: {
    formatCitizenId
  },
  computed:{
    ...mapGetters([
      'community'
    ])
  },
  data(){
    return {
      roomUseTypeOptions,
      roomUseStatusOptions,
      roomPropertyOptions,
      relationshipOptions,
      loading:false,
      listLoading:false,
      activeIndex: 0,
      form:{
        houseCardNo:'',
        roomArea: null,
        houseType:'',
        roomUseStatus:'',
        roomUse:'',
        roomProperty:'',
        owner:[{
          householdName:'',
          citizenId:'',
          phone:'',
        }],
        memberList:[],
      },
      rules:{
        phone: [
          { message: '请输入正确的联系方式',validator: validateNumber},
          { min: 11, max: 11, message: '请填入正确的长度为11的联系方式' }
        ],
        houseCardNo: [
          { required: true, message: "请填写权限卡卡号", trigger: "blur" },
          { message: '请输入正确的权限卡卡号',validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        roomArea: [
          {message: '请输入正确的数字', validator: validateDecimalsNumber},
          { required: true, message: "请填写建筑面积", trigger: "blur" }
        ],
        houseType: [
          { required: true, message: "请填写户型", trigger: "blur" }
        ],
        roomUseStatus: [
          { required: true, message: "请选择使用状态", trigger: "blur" }
        ],
        householdName: [
          { required: true, message: "请填写人员姓名", trigger: "blur" }
        ],
        citizenId: [
          { message: '请输入正确的身份证号码',validator: validateCitizenId},
          { required: true, message: "请填写身份证号", trigger: "blur" },
          { min: 18, max: 18, message: '请填入正确的长度为18的身份证号码' }
        ]
      },
      disabled:false
    }
  },
  methods:{
    handleNext: function(){
      this.$refs.form.validate(valid=>{
        valid && this.$refs.ownerForm.validate(v1=>{
          let v = v1 && this.$refs.roomInfo.handleValid()
          v && this.activeIndex++
        })
      })
    },
    memberValid(data){
      let valid = true 
      if(data.householdName==''){
        this.$message.error('请填写成员姓名')
        valid = false
      }
      if(data.relationship==''){
        this.$message.error('请选择成员与产权人的关系')
        valid = false
      }
      if(data.citizenId!==''){
        validateCitizenId({}, data.citizenId, (msg)=>{
          if(msg){
            this.$message.error('请填写正确的身份证号')
            valid = false
          }
        })
      }else{
        this.$message.error('请填写身份证号')
        valid = false
      }
      if(data.phone!==''){
        validateNumber({}, data.phone, (msg)=>{
          if(msg || data.phone.length!=11){
            this.$message.error('请填写正确的联系方式')
            valid = false
          }
        })
      }

      if(!valid){ return; }
      data.edit = false
    },
    addFamily() {
      let f = {householdName:'', relationship:'', citizenId:'', phone:'', edit: true, }
      this.form.memberList.push(f)
    },
    delOwner(data){
      let self = this;
      if (data.householdId) {
        self.$confirm('确定删除此产权人？')
          .then(_ => {
            self.loading = true;
            delHousehold({
              householdId: data.householdId,
              roomNodeId: self.form.roomId
            }).then(function (response) {
              if (response && response.data.code === 1) {
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.loadHousehold(self.form.roomId)
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }
              return false;
            }).catch(function (a) {
            }).finally(_=>{
              self.loading = false;
            })
          }).catch( (a) => {
            // console.log(a)
          })
      }
    },
    delHousehold(data, index){
      let self = this;
      if (data.householdId) {
        self.$confirm('确定删除此成员？')
          .then(_ => {
            self.loading = true;
            delHousehold({
              householdId: data.householdId,
              roomNodeId: self.form.roomId
            }).then(function (response) {
              if (response && response.data.code === 1) {
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.fetchHouseholdList(self.form.roomId)
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }
              return false;
            }).catch(function (a) {
            }).finally(_=>{
              self.loading = false;
            })
          }).catch( (a) => {
            // console.log(a)
          })
      }else{
        self.form.memberList.splice(index, 1);
      }
    },
    loadRoomData(nodeId) {
      let self = this;
      loadRoom({
        ...self.community,
        roomId: nodeId
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          let form = response.data.data
          self.form.roomArea = form.roomArea
          self.form.houseType = form.houseType
          self.form.roomUseStatus = form.roomUseStatus
          self.form.roomUse = form.roomUse
          self.form.roomProperty = form.roomProperty
          self.form.roomId = form.roomId
          self.loadHousehold(nodeId)
        }
      }).catch(function(a) {
        console.error(a);
      })
    },
    handleSubmit(){
      let self = this
      
      let memberFormValid = self.form.memberList.some(item=>{
        return item.edit
      })
      if(memberFormValid){
        this.$message.error('请将家庭成员的信息填写完整后点击完成')
        return
      }

      let formData = {
        ...self.form,
        ...self.$refs.roomInfo.form,
        ...self.community,
      }

      self.loading = true

      addRoomCard(formData).then(function (response) {
        if(response.data && response.data.code==1){
          self.$message({
            message: response.data.message,
            type: 'success'
          });
          self.activeIndex = 2;
        }
      }).catch(function (a) {
        console.error(a)
      }).finally(_=>{
        self.loading = false
      })

    },
    loadHousehold(roomNodeId){
      let self = this;
      householdList({
        housholdRole: 1,
        roomNodeId
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          if(response.data.dataList.length>0){
            self.form.owner[0] = response.data.dataList[0]
            self.disabled = true
          }else{
            self.form.owner[0].householdName = ''
            self.form.owner[0].citizenId = ''
            self.form.owner[0].phone = ''
            self.disabled = false
          }
          self.fetchHouseholdList(roomNodeId)
        }
      }).catch(function(a) {
        console.error(a);
      })
    },
    fetchHouseholdList(roomNodeId){
      let self = this;
      self.listLoading = true
      householdList({
        housholdRole: 2,
        roomNodeId
      }).then(function(response) {
        if (response.data && response.data.code==1) {
          let list = response.data.dataList
          self.form.memberList = list.map(v => {
            self.$set(v, 'edit', false) 
            return v
          })
          self.listLoading = false
        }
      }).catch(function(a) {
        console.error(a);
      })
    }
  },
  mounted(){
    this.$refs.houseCard.focus()
  }
}
</script>
<style scoped>

  .iconfont{
    font-size: 26px;
  }
  .mini-input{
    display: flex;
  }
  .table-box{
    padding: 0 40px;
  }
  .btn-style{
    margin-top: 20px;
  }
  .module-title:before{
    top: 2px;
  }
</style>
<style>
  .el-dialog .room-input-number .el-input{
    max-width: 210px
  }
</style>

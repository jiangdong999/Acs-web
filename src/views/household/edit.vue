<template>
  <div>
    <div class="topBar" v-loading="loading">
      <label class="el-icon-arrow-left" @click="$router.back()">返回</label>
      <div>编辑住户</div>
      <span>{{roomData.fullNodeName}}</span>
      <span>
        <el-popover
        placement="bottom"
        width="300"
        ref="popover"
        popper-class="popper-shadow"
        v-model="popoverShow"
        trigger="click">
          <el-input
            placeholder="输入关键字进行过滤"
            class="mb-5"
            v-model="filterText">
          </el-input>
          <el-tree class="tree-node" 
            ref="tree"
            :data="roomOptions" 
            accordion 
            :props="defaultProps" 
            :load="loadChildNode" 
            empty-text="无此节点"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode">
          </el-tree>
        </el-popover>
                
        <el-button type="text" v-popover:popover>更换房间</el-button>
      </span>
    </div>

    <div class="padding-content" v-if="!loading" v-loading="btnLoading">
      <el-form ref="form" inline :model="form" :rules="rules" label-width="100px">
        <!-- <el-row>
          <el-col :span="24">
            <return-report class="module module-new" :form.sync="form" ref="returnReport">
              <div class="module-title" slot="header">
                <mallki className="mallki-text" text="返程登记"></mallki>
              </div>
            </return-report>
          </el-col>
        </el-row> -->
        <identity-info class="module" ref="identityInfo"
        @getMaritalStatus="setMaritalStatus"
        :form.sync="form"
        :isSensitive="isSensitive"
        :isIdcard="roomData.isIdcard">
          <div class="module-title" slot="header">
            <mallki className="mallki-text" text="个人信息"></mallki>
          </div>
          <el-row slot="img">
            <el-col :span="10">
              <el-form-item label="身份证人像面">
                <div>
                  <div class="img-box front">
                    <span class="close" @click="form.certificateFrontUrl=''" v-show="form.certificateFrontUrl">
                      <span class="el-icon-delete" circle></span>
                    </span>
                    <img :src="form.certificateFrontUrl" v-show="form.certificateFrontUrl && form.certificateFrontUrl==''">
                    <img :src="form.certificateFrontUrl" v-show="form.certificateFrontUrl">
                  </div>
                  <span class="btn-row">
                    <camera-btn
                    showType='1' 
                    openBtnText="拍摄正面" 
                    submitBtnText="确认上传" 
                    @path="form.certificateFrontUrl = $event"/>
                    <upload-btn 
                    @path="form.certificateFrontUrl = $event" showUploadType="1"/>
                  </span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <!-- <el-form-item label="身份证国徽面">
                <div>
                  <div class="img-box background">
                    <span class="close" @click="form.idImg2Base64=''" v-show="form.idImg2Base64">
                      <span class="el-icon-delete" circle></span>
                    </span>
                    <img :src="form.certificateBackUrl" v-show="form.certificateBackUrl && form.idImg2Base64==''">
                    <img :src="form.idImg2Base64" v-show="form.idImg2Base64">
                  </div>
                  <span class="btn-row">
                    <camera-btn 
                    showType='1'
                    openBtnText="拍摄反面" 
                    submitBtnText="确认上传" 
                    @path="form.idImg2Base64 = $event"/>
                    <upload-btn 
                    @path="form.idImg2Base64 = $event" showUploadType="1"/>
                  </span>
                </div>
              </el-form-item> -->
            </el-col>
          </el-row>
        </identity-info>

        <el-row>
          <el-col :span="24">
            <account-info class="module height" ref="accountInfo"
            :form.sync="form"
            :fullNodeName="roomData.fullNodeName"
            :isSensitive="isSensitive"
            @reloadData="$emit('reloadMain')"
            @changeHouseholdRole="form.householdType=$event">
              <div class="module-title">
                <mallki className="mallki-text" text="帐号信息"></mallki>
              </div>
            </account-info>
          </el-col>
          <!-- <el-col :span="7" :offset="1">
            <upload-face-img class="module height" ref="face"
              :isSensitive="isSensitive"
              :faceUrl="form.faceUrl">
              <div class="module-title">
                <mallki className="mallki-text" text="上传人脸"></mallki>
              </div>
            </upload-face-img>
          </el-col> -->
        </el-row>

        <div class="module">
          <div class="module-title">
            <mallki className="mallki-text" text="录入门卡"></mallki>
            <span class="ctr-btn" @click="showIdInfo=!showIdInfo">
              {{showIdInfo?'收起':'展开'}} <i :class="showIdInfo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            </span>
            <el-button type="text" class="card-btn" @click="handleCard(form)">{{ form.cardList.length === 0? '添加门卡' : '编辑门卡' }}</el-button>
          </div>
          <el-collapse-transition>
          <div v-show="showIdInfo">
            <el-form ref="cardForm" :model="form.cardList[0]" inline label-width="100px">
              <el-row v-if="form.cardList.length !== 0">
                <el-col :span="10">
                  <el-form-item label="卡类型">
                    <el-select v-model="form.cardList[0].cardClass" filterable placeholder="请选择卡类型" disabled>
                      <el-option value="1" label="IC卡"/>
                      <el-option value="2" label="身份证"/>
                      <el-option value="3" label="ID卡"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item prop="cardNo" label="门卡号码" v-if="form.cardClass=='1'" :rules="cardRules.cardNo">
                    <el-input v-model="form.cardList[0].cardNo" clearable placeholder="请输入卡号" disabled maxlength="8" :type="pswVisibility?'type':'password'">
                      <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
                  </el-form-item>
                  <el-form-item prop="cardNo" label="门卡号码" v-else-if="form.cardClass=='2'" :rules="cardRules.cardNo2">
                    <el-input v-model="form.cardList[0].cardNo" clearable placeholder="请输入卡号" disabled maxlength="16" :type="pswVisibility?'type':'password'">
                      <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
                  </el-form-item>
                  <el-form-item prop="cardNo" label="门卡号码" v-else-if="form.cardClass=='3'" :rules="cardRules.cardNo3">
                    <el-input v-model="form.cardList[0].cardNo" placeholder="请输入卡号" disabled clearable maxlength="16" :type="pswVisibility?'type':'password'">
                      <i slot="prefix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardList[0].cardNo}}</div>
                  </el-form-item>
                  <el-checkbox 
                  v-model="form.cardList[0].specialCard" 
                  disabled
                  true-label="1"
                  false-label="0">
                  特殊卡
                  &emsp;状态：{{form.cardList[0].status | transCardStatus }}
                  </el-checkbox>
                </el-col>
              </el-row>
            </el-form>
          </div>
          </el-collapse-transition>
        </div>

        <other-info class="module module-other" ref="otherInfo"
        :form.sync="form"
        :isInfo="roomData.isInfo"
        :isSensitive="isSensitive"
        :householdType="form.householdType"
        v-show="false">
          <div class="module-title">
            <mallki className="mallki-text" text="其他信息"></mallki>
          </div>
        </other-info>

        <div class="btn-group">
          <el-button @click="$router.back()">取消</el-button>
          <el-button @click="handleSubmit()" type="primary" :loading="btnLoading">确定</el-button>
        </div>
      </el-form>
    </div>

    
    <div v-if="showCard">
      <el-dialog
        title="门卡详情"
        :visible.sync="showCard"
        width="550px"
        :show-close="true"
        :close-on-click-modal="false">
        <card :householdInfo="rowData" @handleClose="handleClose()"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import returnReport from "./components/_returnReport";
import identityInfo from "./components/_identity";
import accountInfo from "./components/_account";
import uploadFaceImg from "./components/face";
import cameraBtn from "@/components/camera/";
import uploadBtn from "@/components/uploadImage";
import otherInfo from "./components/_other";
import { validateHexadecimal } from "@/utils/rules";
import bus from "@/utils/bus";
import {loadNode} from "@/api/roomv1";
import {mapGetters} from 'vuex'
import dateUtil from "@/utils/times";
// import { modifyHouseholdRoom } from "@/api/household";
import {modifyHouseholdRoom,detailHousehold,modifyHousehold } from "@/api/householdv1";
import card from "./components/card.vue";
import {dropdownNodeComplex} from "@/api/nodev1";
import {transCardStatus} from "@/filters/card";
import { getSensitive } from "@/utils/auth";

// let oldFaceValue;
export default {
  components:{
    returnReport,
    identityInfo,
    accountInfo,
    uploadFaceImg,
    otherInfo,
    card,
    cameraBtn,
    uploadBtn
  },
  filters:{
    transCardStatus
  },
  computed:{
    ...mapGetters([
      'community'
    ]),
    isSensitive: function(){
      return getSensitive()
    },
  },
  watch: {
    'filterText':function(val) {
      this.$refs.tree.filter(val);
    },
    'form.householdType':function(val){
      this.showIdInfo = val == '3'?false:true
    }
  },
  beforeRouteUpdate(to, from, next) {
    // 路由更新完roomNodeId之后再执行接口请求
    next();
    this.loadNode();
    this.initNodeTree()
  },
  data(){
    return {
      query:{},
      loading:true,
      showIdInfo:false,
      btnLoading:false,
      showCard: false,
      pswVisibility:false,
      roomData:{},
      form:{
        householdType:'',
        certificateFrontUrl:'',
        idImg2Base64:'',
        cardClass:'1',
        cardList:[],
      },
      popoverShow: false,
      roomOptions:[],
      filterText:'',
      defaultProps: {
        children: "children",
        label: "fullNodeName",
        isLeaf: 'leaf'
      },
      rules:{

      },
      cardRules:{
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: '请输入正确的门禁卡卡号', validator: validateHexadecimal},
          { min: 8, max: 8, message: '请填入正确的长度为8的卡号' }
        ],
        cardNo2: [
          { min: 16, max: 16, message: '请填入正确的长度为16的卡号' }
        ],
        cardNo3: [
          {required: true, message: '请填写门禁卡号', trigger: 'blur'},
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal},
          { min: 8, max: 16, message: '请填入正确的长度为8-16的卡号' }
        ]
      },
    }
  },
  methods:{
    handleCard: function(data){
      this.rowData = data
      this.showCard = true
    },
    handleClose(){
      this.showCard = false
      this.loadData()
    },
    loadNode(){
      let self = this;
      self.loading = true;
      loadNode({
        ...self.community,
        nodeUuid: self.query.nodeUuid
      }).then(function(response) {
        if (response.data && response.data.status==0) {
          self.roomData = response.data.content
          self.loadData()
        }
      }).catch(function(a) {
        console.error(a);
      })
    },
    setMaritalStatus(value) {
      // 若未到达法定结婚年龄，则显示未婚
      if(value=='0'){
        this.$refs.otherInfo.c_form.maritalStatus = '1' 
      }
    },
    processingFormValue: function (formData) {
      let self = this
      return new Promise((resolve,reject) => {
        let _formData={}
        if(self.isSensitive!==0){  
          for(let key in formData){
            if(typeof(formData[key])=='string'){
              if(formData[key].indexOf('*')!=-1){                
                delete formData[key]
              }
            }
          }
        }        
        if (formData.countriesAndRegionsType === '1'&&self.isSensitive==0) { //如果是大陆居民
          // let IDbirth = formData.certificateNo.slice(6,14)
          // let brith = formData.birthDate.replace(/-/g, '')
          // if(IDbirth != brith){reject('出生日期与身份证不一致');return;}       
          formData.nationality = 'CN'; //国籍 中国
        }
        if(formData.countriesAndRegionsType != '1'){
          formData.householdName = formData.householdFirstName + formData.householdLastName
        }
        // 中共党员，otherInfo
        if(formData.politicalStatus=='1'){
          formData[formData.memberType] = "1"
        }
        if (formData.householdType=='3') {
          formData.leaseStartTime = dateUtil.byPattern(new Date(), "YYYYMMDD000000000");
        }else{
          formData.leaseStartTime = '';
          formData.leaseEndTime = '';
        }
        if (formData.validStartTime) {
          formData.validStartTime = formData.validStartTime || '';
        }
        if (formData.validEndTime) {
          formData.validEndTime = formData.validEndTime || '';
        }
        if (formData.birthDate) {
          formData.birthDate = dateUtil.toDateFormat(formData.birthDate)
        }
        if(formData.faceUrl){
          formData.faceStatus = "1"
        }
        if (formData.certificateFrontUrl) {
          formData.certificateFrontUrl = formData.certificateFrontUrl.split(',')[1]
        }
        if (formData.idImg2Base64) {
          formData.idImg2Base64 = formData.idImg2Base64.split(',')[1]
        }
        if (formData.idImg3Base64) {
          formData.idImg3Base64 = formData.idImg3Base64.split(',')[1]
        }
        _formData = formData      
        resolve(_formData)  
      })       
    },
    handleSubmit(){
      if(this.$refs.identityInfo.handleValid() && this.$refs.accountInfo.handleValid() && this.$refs.otherInfo.handleValid()){
        this.btnLoading = true
        let formData = {
          ...this.form,
          ...this.$refs.identityInfo.c_form,
          ...this.$refs.accountInfo.c_form,
          ...this.$refs.otherInfo.c_form,
          // faceUrl: this.$refs.face.imgBase64,
        }
        let self = this
        self.processingFormValue(formData).then((data)=>{
          data.householdId = self.query.householdId,
          modifyHousehold(data).then(function (response) {
            if(response.data && response.data.status==0){
              self.$message({
                message: response.data.message,
                type: 'success'
              });
              self.$router.back()
              bus.$emit('editHousehold')
            }
          }).catch(function (a) {
            console.error(a)
          }).finally(_=>{
            self.btnLoading = false
          })

        }).catch(e=>{
          self.btnLoading = false
          self.$message({
            message: e,
            type: 'error'
          })
        })
      }else{
        this.btnLoading = false
      }
    },
    loadData() {
      let self = this;
      detailHousehold({
        communityId: self.query.communityId,
        householdId: self.query.householdId,
        // roomNodeId: parseInt(self.query.roomNodeId),
        communityUuid:self.query.communityUuid,
        householdUuid:self.query.householdUuid,
        nodeUuid:self.query.nodeUuid
      }).then(function (response) {
        if (response && response.data) {
          Object.assign(self.form, response.data.content);

          if (self.form.leaseStartTime) {
            self.form.leaseStartTime = dateUtil.toClientDate(self.form.leaseStartTime);
          }
          // if (self.form.leaseEndTime) {
          //   self.form.leaseEndTime = dateUtil.toClientDate(self.form.leaseEndTime);
          // }
          if (self.form.accessStartTime) {
            self.form.accessStartTime = dateUtil.toClientDate(self.form.accessStartTime);
          }
          if (self.form.accessEndTime) {
            self.form.accessEndTime = dateUtil.toClientDate(self.form.accessEndTime);
          }
          if (self.form.isDirectParty=='1') {
            self.form.memberType = 'isDirectParty';
          }else if (self.form.partyDoubleReport=='1') {
            self.form.memberType = 'partyDoubleReport';
          }
          if(self.isSensitive==0) {
            if (self.form.birthDate) {
              self.form.birthDate = dateUtil.toClientDateFormat(self.form.birthDate);
            }
            if (self.form.validStartTime) {
              // self.form.validStartTime = dateUtil.toClientDate(self.form.validStartTime);
            }
            if (self.form.validEndTime) {
              // self.form.validEndTime = dateUtil.toClientDate(self.form.validEndTime);
            } else {
              self.form.checkedValidEnd = true;
            }
          } else { 
            self.form.checkedValidEnd = self.form.validEndTime?false:true 
          }

          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a);
      })
    },
    initNodeTree: function () {
      let self = this;
      dropdownNodeComplex({communityUuid: self.query.communityUuid}).then(function (response) {
        if (response && response.data) {
          self.roomOptions = [response.data.content];
        }
      }).catch(function (a) {
        console.error(a)
      });
    },
    loadChildNode(node, resolve) {

      if(node.data.children && node.data.children.length>0){
        let data = node.data.children

        for(let children of data){
          children.leaf = !children.disabled
        }
        resolve(data);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.fullNodeName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.level=='6' && data.nodeType=='R') {
        this.$confirm('是否确认将当前住户变更至选择的房间?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.modifyRoom(data.nodeUuid);
        })
        this.popoverShow = data.children?data.children.length>0:false
      }

      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        });
      }
    },
    modifyRoom(nodeUuid){
      let self = this;
      self.loading = true;
      // console.log(nodeUuid);
      // console.log(self.query);
      modifyHouseholdRoom({
        communityId:self.query.communityId,
        communityUuid:self.query.communityUuid,
        householdUuid:self.query.householdUuid,
        nodeUuid:nodeUuid
      }).then(function(response) {
        
        if(response.data && response.data.status==0){
          console.log('nodeUuid',nodeUuid);
          let query = {
            communityId:self.query.communityId,
            communityUuid:self.query.communityUuid,
            householdUuid:self.query.householdUuid,
            nodeUuid:nodeUuid
          };
          bus.$emit('editHousehold')
          localStorage.setItem('householdDetails',JSON.stringify(
            query
          ))
          self.$router.replace({ path: '/business/householdDetails'})
        }

      }).finally(_=>{
        self.loading = false;
      })
    },
  },
  mounted(){   
    this.query = JSON.parse(localStorage.getItem('editHousehold')).query
    this.loadNode()
    this.initNodeTree()
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/iconfont/iconfont.css';
  .module-new{
    height: 180px;
  }
  .module{
    background-color: #fff;
  }
  .topBar{
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background-color: #fff;
    font-size: 14px;
  }
  .topBar>label{
    color: #007ee4;
    cursor: pointer;
  }
  .topBar>div{
    font-size: 16px;
    color: #000;
    display: inline-block;
    font-weight: 900;
    margin: 0 15px;
  }
  .topBar>span{
    color: rgba(136,136,136,1);
  }
  .height{
    height: 210px;
  }
  .btn-group{
    height: 80px;
    line-height: 80px;
    text-align: right;
  }
  .card-btn{
    vertical-align: sub;
    margin-left: 10px;
  }
  .certificate-img-box{
    width: 300px;
    margin: 0 auto;
  }
  .img-box{
    background-color: #F4F4F4;
    border: 1px solid #d7d7d7; 
    width: 300px;
    height: 180px;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 25%;
    display: inline-block;
    position: relative;
  }
  .background{
    background-image: url(../../assets/image/background.png);
  }
  .front{
    background-image: url(../../assets/image/front.png);
  }
  .img-box img{
    width: 100%;
    height: 100%;
    max-height: 180px;
    object-position: 50% 50%;
    object-fit: scale-down;
    cursor: pointer;
  }
  .close{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 50%;
    display: inline-block;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all .3s;
    color: #fff;
    font-size: 14px;
  }
  .close:hover{
    background-color: rgba(0, 0, 0, 0.3);
  }
  .btn-row{
    width: 300px;
    display: flex;
    justify-content: space-between
  }
  .ctr-btn{
    position: relative;
    top: 3px;
  }

  .padding-content /deep/.el-form-item--medium .el-form-item__label{
    padding-top: 10px;
  }

  .module-other /deep/.el-form-item--medium .el-form-item__label{
    padding-top: 0px;
  }

</style>

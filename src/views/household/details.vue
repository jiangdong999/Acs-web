<template>
  <div v-loading="loading">
    <div class="topBar">
      <label class="el-icon-arrow-left" @click="$router.back()">返回</label>
      <div>住户详情</div>
      <span>{{roomData.fullNodeName}}</span>
      <span class="control-right">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </span>
    </div>

    <div class="padding-content">
      <el-form ref="form" inline :model="form" :rules="rules" label-width="100px">
        <div class="module">
          <div class="module-title" slot="header">
            <mallki class="mallki-text" text="个人信息"></mallki>
          </div>
          <div class="padding-content">
            <el-row>
              <el-col :span="10">
                <el-form-item label="姓名" prop="householdName">
                  <el-input v-model.trim="form.householdName" :disabled="true" placeholder="请输入" clearable :maxlength="15"/>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <div class="action">
                  <el-button type="text" @click="showIdInfo=!showIdInfo">
                    {{showIdInfo?'收起':'展开'}} <i :class="showIdInfo?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                  </el-button>
                </div>
              </el-col>
            </el-row>
            <el-collapse-transition>
              <div v-show="showIdInfo" style="position:relative">
                <div class="hr-style"></div>
                <div>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="国家(地区)" prop="countriesAndRegionsType">
                        <el-select v-model="form.countriesAndRegionsType" :disabled="true" filterable>
                          <el-option value="1" label="中国大陆"/>
                          <el-option value="2" label="港、澳、台地区"/>
                          <el-option value="3" label="外籍"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <template v-if="form.countriesAndRegionsType=='1'">
                        <el-form-item label="证件号码" prop="certificateNo">
                          <el-input v-model.trim="form.certificateNo" :disabled="true" :maxlength="18" placeholder="请输入" clearable/>
                        </el-form-item>
                      </template>
                      <template v-else>
                        <el-form-item label="英文名" prop="householdFirstName">
                          <el-input v-model.trim="form.householdFirstName" :disabled="true" clearable placeholder="请输入" class="mini-input" />
                        </el-form-item>
                        <el-form-item label="英文姓" prop="householdLastName" label-width="60px">
                          <el-input v-model.trim="form.householdLastName" :disabled="true" clearable placeholder="请输入" class="mini-input" />
                        </el-form-item>
                      </template>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="民族" prop="ethnicity" v-if="form.countriesAndRegionsType=='1'">
                        <el-select v-model.trim="form.ethnicity" :disabled="true" filterable clearable placeholder="请选择">
                          <el-option
                            v-for="item in ethnicity"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                          </el-option>
                          </el-select>
                      </el-form-item>
                      <el-form-item label="国家(地区)" prop="nationality" v-else>
                        <el-select v-model="form.nationality" :disabled="true" filterable clearable placeholder="请选择">
                          <el-option
                            v-for="item in countryOptions"
                            :key="item.code"
                            :label="item.cn"
                            :value="item.code">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="户籍地址" prop="residentialAddress" v-if="form.countriesAndRegionsType=='1'">
                        <el-input v-model.trim="form.residentialAddress" :disabled="true" :maxlength="50" clearable placeholder="请输入"/>
                      </el-form-item>
                      <el-form-item label="证件类型" prop="certificateType" v-else>
                        <el-select v-model.trim="form.certificateType" :disabled="true" filterable placeholder="请选择">
                          <el-option
                            v-for="item in documentOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="form.gender" :disabled="true">
                          <el-radio label="1">男</el-radio>
                          <el-radio label="2">女</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="证件号码" prop="certificateNo" v-if="form.countriesAndRegionsType!='1'">
                        <el-input v-model.trim="form.certificateNo" :disabled="true" clearable :maxlength="18" placeholder="请输入"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="出生日期" prop="birthDate">
                        <el-input v-model.trim="form.birthDate" :disabled="true" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="RFID" prop="rfidCode">
                        <el-input v-model.trim="form.rfidCode" :disabled="true" clearable placeholder="请读卡"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="身份证人像面">
                        <div class="box-span">
                          <div class="img-box front">
                            <img
                              :src="form.certificateFrontUrl"
                              v-show="form.certificateFrontUrl && form.idImg1Base64==''"
                            >
                            <img :src="form.idImg1Base64" v-show="form.idImg1Base64">
                          </div>
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <!-- <el-form-item label="身份证国徽面">
                        <div class="box-span">
                          <div class="img-box background">
                            <img
                              :src="form.certificateBackUrl"
                              v-show="form.certificateBackUrl && form.idImg2Base64==''"
                            >
                            <img :src="form.idImg2Base64" v-show="form.idImg2Base64">
                          </div>
                        </div>
                      </el-form-item> -->
                    </el-col>
                  </el-row>
                </div>
                <div class="id-head" v-show="form.certificateHeadUrl">
                  <img :src="form.certificateHeadUrl">
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>

        
        <el-row :gutter="20">
          <el-col :span="12" v-if="form.personnelType=='1'||form.personnelType=='2'">
            <!-- <return-report class="module module-new" :form.sync="form"  type="detail" ref="returnReport">
              <div class="module-title" slot="header">
                <mallki className="mallki-text" text="返程登记"></mallki>
              </div>
            </return-report> -->
            <div class="module module-new">
              <div class="module-title" :loading="devideLoading">
                <mallki class="mallki-text" text="隔离人员"></mallki>
                <span class="devide-date" v-if="form.quarantineStatus=='0'">隔离结束</span>
                <span class="devide-date" v-else>已隔离{{hasDevideDate}}天</span>               
                <span class="devide-date1" v-if="form.personnelType=='1'||form.personnelType=='2'" @click="setDevide()">隔离设置</span>
                <!-- <span class="devide-date1" v-else @click="cancelDevide()">取消隔离</span> -->
              </div>
              <div class="padding-content">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="隔离类型">
                      <span v-if="form.personnelType">{{form.personnelType | transPersonnelType}}</span>
                      <span v-else>-</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="返程地点" v-if="form.personnelType=='1'">
                      <span>{{form.provinceName?`${form.provinceName}/${form.cityName}`: ''}}</span>
                    </el-form-item>
                    <el-form-item label="隔离天数" v-if="form.personnelType=='2'">
                      <span>{{form.quarantineTime}}天</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="返程日期" v-if="form.personnelType==1">
                      <span>{{form.returnDate | formatDate}}</span>
                    </el-form-item>
                    <el-form-item label="开始日期" v-if="form.personnelType==2">
                      <span>{{form.quarantineDate | formatDate}}</span>
                    </el-form-item>
                  </el-col> 
                  <el-col :span="12">
                    <el-form-item label="搭乘交通" prop="allowOpen" v-if="form.personnelType=='1'">
                      <span>{{form.returnTransportation?form.returnTransportation:'-'}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="门禁权限" prop="allowOpen">
                      <el-switch
                        v-model="form.allowOpen"
                        active-value="1"
                        inactive-value="0"
                        :disabled="true"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                      <label v-if="form.allowOpen=='1' " style="color:#13ce66">已启用</label>
                      <label v-else style="color:#ff4949;">禁用</label>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="form.personnelType=='1'||form.personnelType=='2'?12:24" >
            <div class="module module-new">
              <div class="module-title record-box">
                <mallki class="mallki-text" text="最近通行记录"></mallki>
                <el-button type="text" :disabled="tableData.length==0" @click="handleMore" class="more-record">更多通行记录</el-button>
              </div>
              <div class="padding-content open-record">               
                <el-row>
                  <el-table :data="tableData" stripe :highlight-current-row="true">
                    <el-table-column
                      prop="openDoorTime"
                      
                       
                      min-width="221"
                      label="通行时间点">
                      <template slot-scope="scope">
                        <span>{{scope.row.openDoorTime | formatDateTimeHHmmss}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="communityName"
                       
                      
                      min-width="221"
                      label="通行位置">
                    </el-table-column>
                  </el-table>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <div class="module height">
              <div class="module-title">
                <mallki class="mallki-text" text="帐号信息"></mallki>
              </div>
              <div class="padding-content">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="住户类型" prop="householdType">
                      <el-select
                        v-model="form.householdType"
                        filterable
                        :disabled="true">
                        <el-option value="1" label="产权人"/>
                        <el-option value="2" label="家庭成员"/>
                        <el-option value="3" label="承租人"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系方式" prop="phone">
                      <el-input
                        v-model="form.phone"
                        placeholder="请输入"
                        clearable
                        type="tel"
                        :maxlength="11"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item v-if="form.householdType=='2'" label="与产权人关系" prop="relationship">
                      <el-select v-model="form.relationship" filterable clearable :disabled="true">
                        <el-option
                          v-for="item in relationshipOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="有效时长" prop="leaseType" v-if="form.householdType=='3'">
                      <el-select
                        v-model="form.leaseType"
                        filterable
                        :disabled="true"
                      >
                        <el-option value="3" label="三个月"/>
                        <el-option value="6" label="六个月"/>
                        <el-option value="12" label="十二个月"/>
                      </el-select>
                    </el-form-item> -->
                  </el-col>
                  <el-col :span="12" v-if="form.householdType==3">
                    <el-form-item label="有效期至" prop="leaseEndTime">
                      <el-date-picker
                        v-model="form.leaseEndTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        :disabled="true"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="7" :offset="1">
            <div class="module height" ref="face">
              <div class="module-title">
                <mallki class="mallki-text" text="人脸信息"></mallki>
                <span class="handle-face" @click="handleFace()">管理人脸</span>
              </div>             
              <div class="padding-content text-center">
                <div class="face-box">
                  <img :src="form.faceUrl" v-show="form.faceUrl" @click="showImage(form.faceUrl)">
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        

        <other-info
          class="module"
          ref="otherInfo"
          :form.sync="form"
          :householdType="form.householdType"
          :disabled="true"
          :isSensitive="isSensitive"
          :pageType="'details'"
          v-if="!loading"
          v-show="false"
        >
          <div class="module-title">
            <mallki class="mallki-text" text="其他信息"></mallki>
          </div>
        </other-info>

        <div class="module" v-if="form.cardInfo.length > 0">
          <div class="module-title">
            <mallki class="mallki-text" text="所持门卡"></mallki>
          </div>
          <div>
            <el-form ref="cardForm" :model="form.cardInfo[0]" inline label-width="100px">
              <el-row v-if="form.cardInfo.length !== 0">
                <el-col :span="10">
                  <el-form-item label="卡类型">
                    <el-select
                      v-model="form.cardInfo[0].cardClass"
                      filterable
                      placeholder="请选择卡类型"
                      disabled>
                      <el-option value="1" label="IC卡"/>
                      <el-option value="2" label="身份证"/>
                      <el-option value="3" label="ID卡"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    class="icon-visibly"
                    prop="cardNo"
                    label="门卡号码"
                    :rules="cardRules.cardNo"
                    v-if="form.cardClass!=='2'">
                    <el-input
                      v-model="form.cardInfo[0].cardNo"
                      clearable
                      placeholder="请输入卡号"
                      disabled
                      maxlength="8"
                      :type="pswVisibility?'type':'password'">
                      <i slot="prefix"
                        class="iconfont"
                        :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'"
                        @click="pswVisibility=!pswVisibility">
                      </i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardInfo[0].cardNo}}</div>
                  </el-form-item>
                  <el-form-item
                    prop="cardNo"
                    label="门卡号码"
                    v-else-if="form.cardClass==='2'"
                    :rules="cardRules.cardNo2">
                    <el-input
                      v-model="form.cardInfo[0].cardNo"
                      clearable
                      placeholder="请输入卡号"
                      disabled
                      maxlength="16"
                      :type="pswVisibility?'type':'password'">
                      <i slot="prefix"
                        class="iconfont"
                        :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'"
                        @click="pswVisibility=!pswVisibility">
                      </i>
                    </el-input>
                    <div class="tips" style="margin-top:10px">卡号：{{form.cardInfo[0].cardNo}}</div>
                  </el-form-item>
                  <el-checkbox 
                  v-model="form.cardInfo[0].specialCard" 
                  disabled
                  true-label="1"
                  false-label="0">
                  特殊卡
                  &emsp;状态：{{form.cardInfo[0].status | transCardStatus }}
                  </el-checkbox>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>

        <other-rooms class="module" ref="otherRooms" :household="form">
          <div class="module-title">
            <mallki class="mallki-text" text="其他房间信息"></mallki>
          </div>
        </other-rooms>

      </el-form>
    </div>
    
    <imageView 
      :visible.sync="showModal" 
      :data="itemData">
    </imageView>
    <div v-if="showRecord">
      <el-dialog
        title="住户通行记录"
        :visible.sync="showRecord"
        top="5vh"
        width="550px"
        :close-on-click-modal="false">
        <pass-record :formData="form" @submitSuccess="handleCloseRecord()"/>
      </el-dialog>
    </div>
    <div v-if="showDevide">
      <el-dialog
        title="隔离设置"
        :visible.sync="showDevide"
        top="5vh"       
        width="550px"
        :close-on-click-modal="false">
        <devide :data="form" :roomData="roomData" @submitSuccess="handleCloseDevide()"/>
      </el-dialog>
    </div>
    <div v-if="showFace" class="face-dialog">
      <el-dialog
        title="管理人脸照片"
        :visible.sync="showFace"
        width="790px"
        top="15vh"
        :close-on-click-modal="false">
        <manage-face :data="form" @close="handleClose"/>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import returnReport from "./components/_returnReport";
import manageFace from "./components/manageFace";
// import passRecord from "./components/passRecord";
import { loadNode } from "@/api/roomv1";
import { fetchOpening } from "@/api/record";
import { mapGetters } from "vuex";
import dateUtil from "@/utils/times";
// import { detailHousehold } from "@/api/household";
import { detailHousehold } from "@/api/householdv1";
import { getSensitive } from "@/utils/auth";
import otherInfo from "./components/_other.vue";
import otherRooms from "./components/otherRooms.vue";
import {relationshipOptions, documentOptions} from "@/utils/options";
import imageView from "@/components/imageView/index";
import {mask} from 'vue-the-mask'
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import ethnicity from "@/utils/ethnicity";
import { validateHexadecimal } from "@/utils/rules";
import {dropdownNodeComplex} from "@/api/node";
import {transCardStatus} from "@/filters/card";
import { formatDateTimeHHmm, formatDate } from "@/filters/index"
import passRecord from "../epidemicManage/infoSearch/components/passRecord.vue";
import { parseCitizenCard } from "@/api/household";
import { transPersonnelType } from '@/filters/epidemic'
import devide from "../epidemicManage/infoSearch/components/devideSetting.vue";
import { cancelDevide } from "@/api/epidemic";

let oldFaceValue;
export default {
  components: {
    otherInfo,
    otherRooms,
    imageView,
    returnReport,
    passRecord,
    devide,
    manageFace
  },
  filters:{
    transCardStatus,
    formatDateTimeHHmm,
    transPersonnelType,
    formatDate,
  },
  directives: {
    mask
  },
  computed: {
    ...mapGetters(["community"]),
    isSensitive: function(){
      return getSensitive()
    },
    verifyCitizenId(){
      if(this.form.countriesAndRegionsType=='1'){
        return true
      }

      return false
    }
  },
  data() {
    return {
      rowData: {},
      showFace: false,
      devideLoading: false,
      showDevide: false,
      hasDevideDate: null,
      showRecord: false,
      loading: true,
      showCard: false,
      showModal: false,
      pswVisibility: false,
      showIdInfo:true,
      tableData: [],
      roomData: {},
      itemData:{},
      form: {
        householdType: "",
        idImg1Base64: "",
        idImg2Base64: "",
        cardClass: "",
        cardInfo: [],
        allowOpen: '1',
        validStartTime:'',
        validEndTime:''
      },
      popoverShow: false,
      roomOptions:[],
      filterText:'',
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      rules:{},
      cardRules: {
        cardNo: [
          // { required: true, message: "请填写门禁卡卡号", trigger: "blur" },
          { message: "请输入正确的门禁卡卡号", validator: validateHexadecimal },
          { min: 8, max: 8, message: "请填入正确的长度为8的卡号" }
        ],
        cardNo2: [{ min: 16, max: 16, message: "请填入正确的长度为16的卡号" }]
      },
      relationshipOptions,
      documentOptions,
      countryChina,
      country,
      ethnicity,
      countryOptions:[]
    };
  },
  methods: {
    //关闭管理人脸弹窗
    handleClose(){
      this.loadData()
    },
    //管理人脸
    handleFace () {
      this.showFace = true
    },
    // 隔离设置
    setDevide () {
      this.showDevide = true
    },
    handleCloseDevide () {
      this.showDevide = false
      this.loadNode()     
    },
    //取消隔离
    cancelDevide () {
      let self = this
      self.$confirm('确定取消隔离吗？').then(_ => {
        self.devideLoading = true;
        cancelDevide({
          householdId: self.form.householdId,
          communityId: self.form.communityId, 
        }).then(function (response) {
          self.devideLoading = false;
          if (response && response.data.code === 1) {
            self.$router.back(-1);
            self.$message({
              message: response.data.message,
              type: 'success'
            });
          } else {
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).finally(_=>{
          self.devideLoading = false;
        })
      }).catch( (a) => {
        self.devideLoading = false;
      })
    },
    handleMore () {
      this.showRecord = true
    },
    showImage(path){
      this.itemData = { imageUrl: path };
      this.showModal = true;
    },
    handleEdit: function() {
      let query = JSON.parse(localStorage.getItem('householdDetails'))
      localStorage.setItem('editHousehold',JSON.stringify({
         query: query
      }))
      this.$router.push({ path: '/business/editHousehold'})
    },
    loadNode() {
      let self = this;
      self.loading = true;
      let query = JSON.parse(localStorage.getItem('householdDetails'))
      loadNode({
        ...self.community,
        nodeUuid:query.nodeUuid
      })
        .then(function(response) {
          if (response.data && response.data.status == 0) {
            self.roomData = response.data.content;
            self.loadData();
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    //开门记录
    openRecore(communityId,householdId) {
      let self = this;
      fetchOpening({
        communityId: communityId,
        householdId: householdId,
        offset: 0,
        limit: 5
      }).then(function(response) {
        if (response.data && response.data.code == 1) {
          self.tableData = response.data.dataList
        }
      })
      .catch(function(a) {
        console.error(a);
      });
    },
    loadData() {
      let self = this;
      self.loading = true;
      let householdDetails = JSON.parse(localStorage.getItem('householdDetails'))
      detailHousehold({
        communityId: parseInt(householdDetails.communityId),
        communityUuid: householdDetails.communityUuid,
        // householdId: householdDetails.householdId,
        // roomNodeId: parseInt(householdDetails.roomNodeId),
        householdUuid: householdDetails.householdUuid,
        nodeUuid:householdDetails.nodeUuid,
      }).then(function(response) {        
        if (response.data && response.data.status==0) {
          Object.assign(self.form, response.data.content);
          self.form.faceUrl = response.data.content.faceList[0].imageUrl
          if(self.form.personnelType=='2'){
            let startTime = dateUtil.strToTimestamp(self.form.quarantineDate)
            let nowTime = dateUtil.toTimestamp(new Date())
            let time = (nowTime - startTime)/(24*3600*1000)
            self.hasDevideDate = parseInt(time) < 0 || parseInt(time) == 0 ? 0 : parseInt(time)
          }else if(self.form.personnelType=='1'){
            let startTime = dateUtil.strToTimestamp(self.form.returnDate)
            let nowTime = dateUtil.toTimestamp(new Date())
            let time = (nowTime - startTime)/(24*3600*1000)
            self.hasDevideDate = parseInt(time) < 0 || parseInt(time) == 0 ? 0 : parseInt(time)
          }
          if(!self.form.allowOpen){
            self.form.allowOpen = '1'
          }
          self.openRecore(self.form.communityId,self.form.householdId)
          // self.parseCitizenCard()
          if (self.form.leaseStartTime) {
            // self.form.leaseStartTime = dateUtil.toClientDate(
            //   self.form.leaseStartTime
            // );
          }
          if (self.form.leaseEndTime) {
            // self.form.leaseEndTime = dateUtil.toClientDate(
            //   self.form.leaseEndTime
            // );
          }
          if (self.form.accessStartTime) {
            self.form.accessStartTime = dateUtil.toClientDate(
              self.form.accessStartTime
            );
          }
          if (self.form.accessEndTime) {
            self.form.accessEndTime = dateUtil.toClientDate(
              self.form.accessEndTime
            );
          }
          if(self.isSensitive==0) {
            if (self.form.birthDate) {
              // console.log(self.form.birthDate);
              // self.form.birthDate = dateUtil.toClientDateFormat(
              //   self.form.birthDate
              // );
            }
            if (self.form.validStartTime) {
              // self.form.validStartTime = dateUtil.toClientDate(
              //   self.form.validStartTime
              // );
            }
            if (self.form.validEndTime) {
              // self.form.validEndTime = dateUtil.toClientDate(
              //   self.form.validEndTime
              // );
            } else {
              self.form.checkedValidEnd = true;
            }
          }else{
            // self.form.checkedValidEnd = self.form.validEndTime ? false : true
          }
          if (self.form.countriesAndRegionsType === '2') {
            self.countryOptions = countryChina;
          }if (self.form.countriesAndRegionsType === '3') {
            self.countryOptions = country;
          }else if(!self.form.countriesAndRegionsType){
            self.form.countriesAndRegionsType = '1'
          }
          if (self.form.isDirectParty == "1") {
            self.form.memberType = "isDirectParty";
          } else if (self.form.partyDoubleReport == "1") {
            self.form.memberType = "partyDoubleReport";
          }    
          
          let birth = self.form.certificateNo.slice(6,14)
          self.form.birthDate = birth  
        }
        self.loading = false;
      })
      .catch(function(a) {
        self.loading = false;
        console.error(a);
      });
    },
    // parseCitizenCard(){
    //   let self = this
    //   if(self.verifyCitizenId){
    //     parseCitizenCard({
    //       "communityId": self.$route.query.communityId, // 小区ID
    //       "citizenId": self.form.citizenId,   // 身份证号码
    //       "address": self.form.residentialAddress  // 身份证住址
    //     }).then(function (response) {
    //       if(response.data.data && response.data.code==1){
    //         self.$emit('getMaritalStatus', response.data.data.maritalStatus)
    //       }
    //     }).catch(function (a) {
    //       console.error(a)
    //     })
    //     if(self.form.citizenId.length == 18){
    //       let birth = self.form.citizenId.slice(6,14)
    //       self.form.birthDate = dateUtil.toClientDateFormat(birth)

    //       let genderCode = self.form.citizenId.slice(16,17)
    //       let gender = parseInt(genderCode) % 2 ==0? 'f': '1'
    //       self.form.gender = gender || '1'
    //     }else{
    //       self.form.gender = ''
    //     }
    //   }
    // }
  },
  mounted() {
    this.loadNode();   
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/iconfont/iconfont.css';
.module-new{
  background: #fff;
  height: 328px;
  position: relative;
}
.action{
  width: 100px;
  text-align: right;
  padding-right: 12px;
}
.module {
  background-color: #fff;
}
.topBar {
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #fff;
  font-size: 14px;
}
.topBar > label {
  color: #007ee4;
  cursor: pointer;
}
.topBar > div {
  font-size: 16px;
  color: #000;
  display: inline-block;
  font-weight: 900;
  margin: 0 15px;
}
.topBar > span {
  color: rgba(136, 136, 136, 1);
}
.height {
  height: 210px;
}
.btn-group {
  height: 80px;
  line-height: 80px;
  text-align: right;
}
.card-btn {
  vertical-align: sub;
  margin-left: 10px;
}
.certificate-img-box {
  width: 300px;
  margin: 0 auto;
}
.img-box {
  background-color: #f4f4f4;
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
.background {
  background-image: url(../../assets/image/background.png);
}
.front {
  background-image: url(../../assets/image/front.png);
}
.img-box img {
  width: 100%;
  height: 100%;
  max-height: 180px;
  object-position: 50% 50%;
  object-fit: contain;
  cursor: pointer;
}
.close {
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
  transition: all 0.3s;
  color: #fff;
  font-size: 14px;
}
.close:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.btn-row {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
.face-box{
  background-color: #F4F4F4;
  border: 1px solid #d7d7d7; 
  width: 120px;
  height: 120px;
  border-radius: 4px;
  background-image: url(../../assets/image/person.png);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 50%;
  display: inline-block;
  position: relative;
}
.face-box img{
  width: 100%;
  height: 100%;
  max-height: 120px;
  object-position: 50% 50%;
  object-fit: cover;
  cursor: pointer;
}
.id-head{
  width: 120px;
  height: 160px;
  text-align: center;
  position: absolute;
  right: 10%;
  top: 20px;
}
.id-head>img{
  width: 120px;
  height: 160px;
}
.padding-right{
  padding-right: 30px;
}
.record-box{
  position: relative;
}
.more-record{
  position: absolute;
  right: 20px;
  top: 12px;
}
.devide-date{
  position: absolute;
  top: 4px;
  left: 100px;
  color:#ffa042;
  font-size:14px;
  font-weight:500;
}
.devide-date1{
  position: absolute;
  top: 4px;
  right: 20px;
  color:rgb(0, 126, 228);
  font-size:14px;
  font-weight:500;
  cursor: pointer;
}
.box-span{
  margin-bottom: -15px;
}
.module-title{
  position: relative;
}
.handle-face{
  position: absolute;
  right: 14px;
  top: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #007ee4;
  cursor: pointer;
}

.el-table--fit{
  min-height: 0;
}

/deep/.el-form-item--medium .el-form-item__label {
    padding-bottom: 0px;
    padding-top: 0px;
    line-height: 36px;
    font-size: 13px;
}

.icon-visibly /deep/.el-input__prefix {
    top:0px
}
</style>

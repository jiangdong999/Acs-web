<template>
  <section>
    <el-steps :active="activeIndex" simple>
      <el-step title="基础信息" icon="icon-step1"></el-step>
      <el-step title="授权设置" :icon="activeIndex==1?'icon-step2-visited':'icon-step2'"></el-step>
      <el-step title="结果查看" :icon="activeIndex==2?'icon-step3-visited':'icon-step3'"></el-step>
    </el-steps>
    <div v-loading="loading">
        <el-form ref="form" inline :rules="dynamicRules" :model="form" label-width="120px">
        <div v-if="activeIndex==0" key="a">
          <identityInfo></identityInfo>
          <div class="form-title-caption">
              <p>基础信息</p>
          </div>
          <el-form-item label="住户类型" prop="householdRole">
            <el-select v-model="form.householdRole" filterable>
              <el-option :value="1" label="产权人"/>
              <el-option :value="2" label="家庭成员"/>
              <el-option :value="3" label="承租人"/>
            </el-select>
          </el-form-item>
          <div v-if="form.householdRole === 3" style="line-height:36px">
            <el-form-item label="人员有效期" prop="leaseStartTime">
              <el-date-picker style="width:180px"
                              v-model="form.leaseStartTime" type="date"
                              :picker-options="beforePickerOptions(form.leaseEndTime)"
                              >
              </el-date-picker>
            </el-form-item>
            至&emsp;
            <el-form-item prop="leaseEndTime">
              <el-date-picker style="width:180px"
                              v-model="form.leaseEndTime" type="date"
                              :picker-options="afterPickerOptions(form.leaseStartTime)"
                              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="所属小区" prop="propertyId">
              <el-select v-model="form.propertyId" filterable @change="initCommunity" placeholder="所属单位" clearable>
                <el-option
                  v-for="item in propertyList"
                  :key="item.propertyId"
                  :label="item.propertyName"
                  :value="item.propertyId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="communityId">
              <el-select v-model="form.communityId" filterable @change="initNode" placeholder="所属小区" clearable>
                <el-option
                  v-for="item in communityList"
                  :key="item.communityId"
                  :label="item.communityName"
                  :value="item.communityId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="roomNodeId">
              <div style="width:300px">
                <el-popover
                placement="right"
                width="300"
                popper-class="popper-shadow"
                v-model="popoverShow"
                trigger="click">
                    <el-tree class="tree-node" :data="roomOptions" accordion :props="defaultProps" :load="loadNode" @node-click="handleNodeClick"></el-tree>
                    <el-input
                    v-model="form.room"
                    placeholder="请选择所属房间"
                    slot="reference"
                    @clear.stop="clearRoom"
                    clearable>
                    </el-input>
                </el-popover>
              </div>
            </el-form-item>
          </div>
          <el-form-item label="姓名" prop="householdName" width="300" v-if="form.countriesAndRegionsType === '1'">
            <el-input v-model="form.householdName" placeholder="请输入" clearable :maxlength="15"/>
          </el-form-item>
          <br>
          <el-form-item label="国家（地区）" prop="countriesAndRegionsType">
            <el-radio-group v-model="form.countriesAndRegionsType">
            <el-radio label="1">中国大陆</el-radio>
            <el-radio label="2">港、澳、台地区</el-radio>
            <el-radio label="3">外籍</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                    <svg-icon iconClass="icon_arrow-up-double" class="icon-reverse"/>其他信息
                </template>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="婚姻状况">
                            <el-radio-group v-model="form.maritalStatus">
                                <el-radio label="1">未婚</el-radio>
                                <el-radio label="2">已婚</el-radio>
                                <el-radio label="3">离异</el-radio>
                                <el-radio label="4">其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属行业">
                            <el-select style="width: 260px" v-model="form.industry" filterable clearable placeholder="请选择">
                                <el-option-group
                                v-for="group in industriesOptions"
                                :key="group.label"
                                :label="group.label">
                                <el-option
                                    v-for="item in group.options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                                </el-option-group>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="文化程度" prop="distributions">
                        <el-select v-model="form.educationLevel" filterable placeholder="请选择" clearable>
                            <el-option
                            v-for="item in educationOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位名称" prop="companyName">
                        <el-input v-model="form.companyName" placeholder="请输入" clearable :maxlength="20"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="政治面貌" prop="politicalStatus">
                        <el-select v-model="form.politicalStatus" filterable placeholder="请选择" clearable>
                            <el-option
                            v-for="item in politicalOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位地址" prop="companyAddress">
                        <el-input v-model="form.companyAddress" placeholder="单位详细地址" clearable :maxlength="30"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="兵役状态" prop="militaryServiceStatus">
                        <el-select v-model="form.militaryServiceStatus" filterable placeholder="请选择" clearable>
                            <el-option
                            v-for="item in militaryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="职业">
                        <el-input v-model="form.profession" placeholder="请输入" clearable :maxlength="15"/>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="个人户籍状态">
                      <el-select v-model="form.regisStatus" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in regisStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入住事由">
                      <el-select v-model="form.stayReason" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in stayReasonOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="本市户籍">
                        <el-radio-group v-model="form.isCityRegis">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="居住方式">
                        <el-select v-model="form.residenceType" filterable placeholder="请选择" clearable>
                          <el-option
                          v-for="item in residenceTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="本区户籍">
                        <el-radio-group v-model="form.isAreaRegis">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="特殊人群类型">
                      <el-select v-model="form.caringStaffType" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in caringStaffTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="户籍类别">
                        <el-radio-group v-model="form.regisType">
                            <el-radio label="1">非农</el-radio>
                            <el-radio label="2">农业</el-radio>
                            <el-radio label="3">无户口</el-radio>
                        </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="与户主关系">
                      <el-select v-model="form.relationship" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in relationshipOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="小区直管党员">
                  <el-radio-group v-model="form.isDirectParty">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div>
                  <el-collapse-transition>
                    <el-form-item label="党员双报到" v-if="form.isDirectParty=='1'">
                      <el-radio-group v-model="form.partyDoubleReport">
                          <el-radio label="1">是</el-radio>
                          <el-radio label="0">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-collapse-transition>
                </div>
                <el-form-item label="个人状态">
                    <el-radio-group v-model="form.personalStatus">
                        <el-radio label="1">退休</el-radio>
                        <el-radio label="2">在职</el-radio>
                        <el-radio label="3">待业</el-radio>
                        <el-radio label="4">学生</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="form-title-caption">
                    <p>办理居住证情况</p>
                </div>
                <el-form-item label="是否已办理">
                    <el-radio-group v-model="form.isFirstResidencePermit">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <br>
                <el-form-item label="申请有效期">
                    <el-select v-model="form.residencePermitPeriod" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in residencePermitPeriodOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="办证日期" label-width="120px">
                    <el-input v-model="form.residencePermitDate" clearable v-mask="'####-##-##'" placeholder="YYYY-MM-DD"/>
                </el-form-item>
                <hr class="form-separate-hr"/>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else-if="activeIndex==1" key="b">
          <div class="form-title-caption">
              <p>授权APP</p>
          </div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="APP授权开门" prop="allowApp">
                <el-select v-model="form.allowApp" placeholder="请选择是否授权">
                    <el-option :value="1" label="授权"/>
                    <el-option :value="0" label="不授权"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号码" prop="phoneNumber" :rules="[{ required: form.allowApp==1, message: '授权请填写手机号码', trigger: 'blur' },{ message: '请输入正确的手机号',validator: validateMobile}]">
                  <el-input v-model="form.phoneNumber" placeholder="请输入" clearable type="tel" :maxlength="11"/>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-title-caption">
              <p>授权卡&emsp;<el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addCard()"></el-button></p>
          </div>
          <card-item style="position:relative;margin-bottom:40px;"
                      v-for="(item,index) in form.cardList"
                      :key="index"
                      :ref="'card'+index"
                      :cardNo.sync="item.cardNo"
                      :roomId.sync="item.roomId"
                      :disabled="index==0"
                      :node="defaultCardNode"
                      >
            <span class="el-icon-close icon-del" v-if="index!=0" @click="delCard(index)"></span>
          </card-item>
        </div>

        <div v-else-if="activeIndex==2" key="c">
          <div class="step-success">
            <img src="../../../assets/image/success.png"/>
            <p>授权成功</p>
          </div>
        </div>
        </el-form>
      <div class="form-dialog-control-area">
        <el-button type="primary" @click="handleNext()"  v-if="activeIndex==0">下一步</el-button>
        <el-button type="primary" @click="activeIndex--" v-if="activeIndex==1">上一步</el-button>
        <el-button type="primary" @click="handleSubmit"  v-if="activeIndex==1">提交</el-button>
        <el-button                @click="handleClose()" v-if="activeIndex==2">知道了</el-button>
        <el-button type="primary" @click="tabFace()" v-if="activeIndex==2">去开通人脸开门</el-button>
      </div>
    </div>
    
  </section>
</template>
<script>
import { dropdownCommunity } from "@/api/community";
import { dropdownList } from "@/api/property";
import { dropdownNodeComplex } from "@/api/node";
import { saveHousehold } from "@/api/household";
import { validateNumberAndLetter, validateHexadecimal, validateNumber, validateBirthDate, validateMobile } from "@/utils/rules";
import industriesOptions from "@/utils/industry";
import {documentOptions, stayReasonOptions, residenceTypeOptions,
        educationOptions, politicalOptions, militaryOptions,
        residencePermitPeriodOptions, regisStatusOptions, caringStaffTypeOptions,
        relationshipOptions} from "@/utils/options";
import ethnicity from "@/utils/ethnicity";
import countryChina from "@/utils/country_china";
import country from "@/utils/country";
import dateUtil from "@/utils/times";
import scanner from "@/components/scanner/scanner";
import {mask} from 'vue-the-mask'
import cardItem from "./components/cardItem";
import {mapGetters} from 'vuex'
import {beforePickerOptions, beforePickerOptions3, afterPickerOptions} from "@/utils/validate";
import cameraBtn from "@/components/camera/";
import uploadBtn from "@/components/uploadImage";
import identityInfo from "./components/identityInfo";

export default {
  components:{
    identityInfo,
    scanner,
    cameraBtn,
    uploadBtn,
    cardItem
  },
  directives: {
    mask
  },
  data() {
    return {
      displayIdentitly:'0',//身份证是否必填,0为必填

      activeIndex: 0,
      loading: false,
      inputMethod: 1,
      showIdInfo: false,
      popoverShow: false,

      rules: {
        householdRole: [
          { required: true, message: "请选择住户类型", trigger: "change" }
        ],
        propertyId: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        communityId: [
          { required: true, message: "请选择所属小区", trigger: "change" }
        ],
        roomNodeId: [
          {required: true, message: '请选择所属房间', trigger: 'change'}
        ],
        leaseStartTime: [
          {required: true, message: '请输入人员起始日期', trigger: 'blur'}
        ],
        leaseEndTime: [
          {required: true, message: '请输入人员结束日期', trigger: 'blur'}
        ],
        countriesAndRegionsType: [
          { required: true, message: "请选择国家（地区）", trigger: "change" }
        ],
        // 身份证信息
        householdName: [
          { required: true, message: "请填写人员姓名", trigger: "blur" }
        ],
        householdFirstName:[
          { required: true, message: "请填写英文名", trigger: "blur" }
        ],
        householdLastName:[
          { required: true, message: "请填写英文姓", trigger: "blur" }
        ],
        // 身份证信息end
        cardNo: [
          { required: true, message: '请输入门禁卡卡号'},
          { message: '请输入正确的门禁卡卡号',validator: validateHexadecimal}
        ]
      },
      
      form: {
        householdType: 1,
        householdRole: null,
        countriesAndRegionsType:'1',
        duty: null,
        propertyId:null,
        communityId:null,
        roomNodeId: null,
        room:'',
        leaseStartTime:'',
        leaseEndTime:'',
        phoneNumber:'',
        // 其他信息
        maritalStatus:'',
        industry:'',
        educationLevel:'',
        companyName:'',
        politicalStatus:'',
        companyAddress:'',
        militaryServiceStatus:'',
        isCityRegis:'',
        isAreaRegis:'',
        stayReason:'',
        isFirstResidencePermit:'',
        residencePermitPeriod:'',
        residencePermitDate:'',
        residenceType:'',
        profession:'',
        regisStatus:'',
        caringStaffType:'',
        regisType:'',
        relationship:'',
        isDirectParty:'',
        partyDoubleReport:'',
        personalStatus:'',
        // 身份信息
        householdName:'',
        validStartTime:'',
        validEndTime:'',
        gender:'',
        residentialAddress:'',
        ethnicity:'',
        authority:'',
        birthDate:'',
        citizenId:'',

        nationality:'',
        householdFirstName:'',
        householdLastName:'',
        certificateType:'',
        certificateNo:'',

        idImg1Base64:'',
        idImg2Base64:'',

        allowApp:1,
        cardList:[
          {
            roomId:null,
            cardNo:'',
          }
        ]
      },
      propertyList: [],
      communityList: [],
      ethnicity: [],
      countryOptions:[],
      documentOptions:[],
      roomOptions: [],
      stayReasonOptions: [],
      industriesOptions:[],
      educationOptions:[],
      politicalOptions:[],
      militaryOptions:[],
      residenceTypeOptions:[],
      residencePermitPeriodOptions:[],
      regisStatusOptions:[],
      caringStaffTypeOptions:[],
      relationshipOptions:[],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },
      defaultCardNode:{},
    };
    householdId:null
  },
  methods: {
    validateMobile,
    beforePickerOptions,
    beforePickerOptions3,
    afterPickerOptions,
    initOptions: function () {
      this.initPropertyList(true);
      this.ethnicity = ethnicity;
      this.countryChina = countryChina;
      this.country = country;
      this.documentOptions = documentOptions;
      this.stayReasonOptions = stayReasonOptions;
      this.industriesOptions = industriesOptions;
      this.educationOptions = educationOptions;
      this.politicalOptions = politicalOptions;
      this.militaryOptions = militaryOptions;
      this.residenceTypeOptions = residenceTypeOptions;
      this.residencePermitPeriodOptions = residencePermitPeriodOptions;
      this.regisStatusOptions = regisStatusOptions;
      this.caringStaffTypeOptions = caringStaffTypeOptions;
      this.relationshipOptions = relationshipOptions;
    },
    initPropertyList: function(initDropdown) {
      let self = this;
      dropdownList()
        .then(function(response) {
          if (response && response.data) {
            self.propertyList = response.data.dataList;
            if(self.node!=null && initDropdown){
              self.form.propertyId = self.node.propertyId;
              self.initCommunity(self.node.propertyId, true)
            }
          }
        })
        .catch(function(a) {
          console.error(a);
        });
    },
    initCommunity: function(data, initDropdown) {
      let self = this;
      if (data) {
        self.communityList = [];
        self.form.communityId = "";
        dropdownCommunity({ propertyId: data })
          .then(function(response) {
            if (response && response.data) {
              self.communityList = response.data.dataList;
              if(self.node!==null && initDropdown){
                self.form.communityId = self.node.communityId;
                self.initNode(self.node.communityId, true)
              }
            }
          })
          .catch(function(a) {
            console.error(a);
          });
      }
    },
    initNode: function (data, initDropdown) {
      let self = this;
      if (data) {
        self.roomOptions = [];
        self.clearRoom();
        dropdownNodeComplex({communityId: data}).then(function (response) {
          if (response && response.data) {
            self.roomOptions = response.data.dataList;
            self.displayIdentitly = response.data.dataList[0].displayIdentitly || '0';

            if((self.node!==null || self.node!=={}) && initDropdown){
              if(self.node.type=='R'){
                self.form.roomNodeId = self.node.id;
                self.form.room = self.node.nodeLabel;
                self.defaultCardNode = self.node;
              }
            }
          }
        }).catch(function (a) {
          console.error(a)
        });
      }
    },
    loadNode(node, resolve) {

      if(node.data.children && node.data.children.length>0){
        let data = node.data.children

        for(let children of data){
          children.leaf = !children.disabled
        }
        resolve(data);
      }
    },
    handleNodeClick(data) {
      if (!data.disabled && data.parentId != -1) {
        this.form.roomNodeId = data.value;
        this.form.room = data.nodeLabel;
        this.popoverShow = data.disabled;
        this.defaultCardNode = data;
      }
      if(data.parentId == -1 && !data.children){
        this.$message({
          message: '该节点下没有数据',
          type: 'error'
        });
      }
    },
    clearRoom:function(){
      this.form.roomNodeId = '';
      this.form.room = '';
    },
    getIdScannerData: function (data) {
      this.form.householdName = data.name;
      if (data.sex === '男') {
        this.form.gender = 'm';
      } else {
        this.form.gender = 'f';
      }
      //民族
      this.form.ethnicity = data.nation;
      this.form.birthDate = dateUtil.toClientDateFormat(data.birthday)
      this.form.residentialAddress = data.address;
      this.form.citizenId = data.id;
      this.form.validStartTime = dateUtil.toClientDate(data.start);
      this.form.validEndTime = dateUtil.toClientDate(data.end);
      this.form.authority = data.department;
      this.showIdInfo = true;
    },
    handleSubmit: function () {
      let self = this;

      self.$refs.form.validate((valid) => {
        if (valid && self.checkCardList()) {
          self.processingFormValue().then((data) => {
            self.loading = true;
            saveHousehold(data).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: '提交成功',
                  type: 'success'
                });
                self.activeIndex = 2;
                self.householdId = response.data.data.householdId
              } else {
                self.$message({
                  message: response.data.message,
                  type: 'error'
                });
              }
            }).catch(function (a) {
              console.error(a)
            }).finally(_=>{
              self.loading = false;
            })
          });
        } else {
          return false;
        }
      });
    },
    checkCardList:function(){
      return this.form.cardList.every((v,i)=>
        this.$refs['card'+i][0].handleSubmit()
      )
    },
    processingFormValue: function () {
      return new Promise((resolve,reject) => {
        let data = { ...this.form };

        if (this.form.countriesAndRegionsType === '1') { //如果是大陆居民
          data.certificateNo = this.form.citizenId; //证件号码 = 身份证号码
          data.nationality = 'CN'; //国籍 中国
          data.certificateType = '1'; //证件类型为身份证
        }

        if (this.form.validStartTime) {
          data.validStartTime = dateUtil.toServerDateString(this.form.validStartTime) || '';
        }
        if (this.form.validEndTime) {
          data.validEndTime = dateUtil.byPattern(this.form.validEndTime, "YYYYMMDD235959999") || '';
        }
        if (this.form.leaseStartTime) {
          data.leaseStartTime = dateUtil.toServerDateString(this.form.leaseStartTime);
        }
        if (this.form.leaseEndTime) {
          data.leaseEndTime = dateUtil.toServerDateString(this.form.leaseEndTime);
        }
        if (this.form.birthDate) {
          data.birthDate = dateUtil.toServerDateString(new Date(this.form.birthDate));
        }
        if (this.form.idImg1Base64) {
          data.idImg1Base64 = this.form.idImg1Base64.replace(/^data\:image\/\w+\;base64\,/, '');
        }
        if (this.form.idImg2Base64) {
          data.idImg2Base64 = this.form.idImg2Base64.replace(/^data\:image\/\w+\;base64\,/, '');
        }

        resolve(data);
      })
    },
    handleClose: function () {
      this.$parent.$parent.handleClose();
    },
    handleNext: function(){
      this.$refs.form.validate(valid => {
        if(valid) {
          this.activeIndex = 1
        }else{
          this.showIdInfo = true
        }
      })
    },
    setPhoto:function(src, key){
      this.form[key] = src;
    },
    addCard:function(){
      this.form.cardList.push({roomId:null, cardNo: ''})
    },
    delCard:function(index){
      this.form.cardList.splice(index,1)
    },
    tabFace:function(){
      this.$router.push('/household/familyEdit?householdId='+this.householdId+'&tab=face')
    }
  },
  computed:{
    ...mapGetters([
        'node'
      ]),
      isRequired: function(){
        // 0必填，1选填
        return this.displayIdentitly == '0';
      },
      dynamicRules(){
        return {
          ...this.rules,
          validStartTime: [
            {required: this.isRequired, message: '请输入证件开始日期', trigger: 'blur'}
          ],
          validEndTime: [
            {required: this.isRequired, message: '请输入证件结束日期', trigger: 'blur'}
          ],
          gender: [
            { required: this.isRequired, message: "请选择性别", trigger: "change" }
          ],
          residentialAddress: [
            { required: this.isRequired, message: "请填写户籍地址", trigger: "blur" }
          ],
          ethnicity: [
            { required: this.isRequired, message: "请选择民族", trigger: "change" }
          ],
          authority: [
            { required: this.isRequired, message: "请填写签证机关", trigger: "blur" }
          ],
          birthDate: [
            { required: this.isRequired, message: "请填写出生日期", trigger: "blur" },
            { message: '请输入正确的日期', validator: validateBirthDate}
          ],
          citizenId: [
            { required: this.isRequired, message: "请填写证件号码", trigger: "blur" },
            {
              message: "请输入数字与字母，不能输入其他字符",
              validator: validateNumberAndLetter
            }
          ],
          certificateNo: [
            { required: this.isRequired, message: "请填写证件号码", trigger: "blur" },
            {
              message: "请输入数字与字母，不能输入其他字符",
              validator: validateNumberAndLetter
            }
          ],
          idImg1Base64: [
            { required: this.isRequired, message: "请上传身份证正面照片", trigger: "blur" }
          ],
          idImg2Base64: [
            { required: this.isRequired, message: "请上传身份证背面照片", trigger: "blur" }
          ],
          nationality: [
            { required: this.isRequired, message: "请选择国家（地区）", trigger: "change" }
          ],
          certificateType:[
            { required: this.isRequired, message: "请选择证件类型", trigger: "change" }
          ]
        }
      }
  },
  mounted() {
    this.initOptions()
  },
  watch: {
    "form.countriesAndRegionsType": function () {
      if (this.form.countriesAndRegionsType === '2') {
        this.countryOptions = countryChina;
        this.form.nationality = '';
      }
      if (this.form.countriesAndRegionsType === '3') {
        this.countryOptions = country;
        this.form.nationality = '';
      }
    },
    inputMethod: function(newValue){
      this.showIdInfo = newValue==2?true:false;
    }
  }
};
</script>
<style scoped>
  .tips{
    color: #999999;
    font-size: 12px;
  }
  .upload-box{
    width: 262px;
    display: inline-block;
    margin-right: 20px;
  }
  .image-box{
    background-color: #F4F4F4;
    width: 262px;
    height: 166px;
    margin-bottom: 10px;
    border-radius: 4px;
    border:  1px solid #d7d7d7;
    display: inline-block;
    position: relative;
  }
  .image-box span{
    font-size: 24px;
    color: #aaaaaa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .image-box img{
    width: 100%;
    height: 100%;
    object-position: 50%;
    position: relative;
    z-index: 10;
  }
  .btn-row{
    display: flex;
    justify-content: space-between;
  }
  #my_DV{
    margin:0 auto;
  }
  #my_DV>video{
    width: 100% !important;
  }
  .icon-del{
    position: absolute;
    display: inline-block;
    width: 24px;
    height: 24px;
    padding: 5px;
    border-radius: 50%;
    background-color: #ff5555;
    right: -11px;
    top: -11px;
    cursor: pointer;
    opacity: 0.8;
  }
  .icon-del:before{
    color: #fff;
  }
  .icon-del:hover{
    opacity: 1;
  }
</style>

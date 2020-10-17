<template>
  <div>
    <div class="step" >
      <span class="step-box">
        <span style="float:left;" class="step-idx" :class="{'step-color': isStep}"><i class="iconfont icon-tianxie step-icon"></i>填写信息</span>
        <i class="iconfont icon-jindu step-jiantou" style="float:left;"></i>
        <span style="float:left;" class="step-idx" :class="{'step-color': !isStep}"><i class="iconfont icon-fenpei step-icon"></i>分配小区</span>
      </span>
    </div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">     
      <div class="module" v-if="isStep">
        <div class="module-title">
          <mallki className="mallki-text" text="机构角色"></mallki>
        </div>
        <el-row>
          <el-col :span="8" class="org">
            <!-- <el-form-item label="选择机构" prop="orgId">
              <el-select v-model="org" filterable placeholder="请选择" clearable value-key="id">
                <el-option
                  v-for="item in orgOptions"
                  :key="item.id"
                  :label="item.orgName"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="所属机构" prop="orgId">
              <div>
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
                    v-model="filterText"
                    clearable
                    >
                  </el-input>
                  <el-tree 
                    class="tree-node"
                    ref="treeOrg"
                    :data="orgTree" 
                    accordion 
                    :props="props" 
                    :load="loadNode" 
                    empty-text="无此节点"
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNodeMethod"
                    >
                  </el-tree>
                </el-popover>
              </div>
              <el-input
                class="widen-input"
                placeholder="所属机构"
                v-model="form.orgName"
                v-popover:popover
                @clear="clearOrg"
                suffix-icon="el-icon-arrow-down">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择角色" prop="roleIdStr">
              <el-select v-model="roleIds" multiple filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id.toString()">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="分配小区" prop="communityIdStr">
              <el-select v-model="communityIdStr" multiple filterable reserve-keyword placeholder="请选择" clearable class="select-pointer" @change="communityChange">
                <el-option :key="-1" value="-1" label="全选"></el-option>
                <el-option
                  v-for="item in communityList"
                  :key="item.communityId"
                  :disabled="communityIdStr=='-1'"
                  :label="item.communityName"
                  :value="item.communityId.toString()">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </div>
      <div class="module" v-if="isStep">
        <div class="module-title">
          <mallki className="mallki-text" text="帐号信息"></mallki>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="帐号" prop="account">
              <el-input v-model.trim="form.account" clearable placeholder="请输入姓名拼音" @change="verifyAccount" maxlength="20" style="width:240px">
                <template slot="append">{{orgCode}}</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="form.password" maxlength="16" placeholder="请输入密码" :type="pswVisibility?'type':'password'">
                <i slot="suffix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
              </el-input>
            </el-form-item>
          </el-col>        
        </el-row>
        <el-row>
          <el-col :span="12" class="sensitive">              
            <el-form-item style="line-height: 16px;" label="数据脱敏" prop="sensitive">
              <el-radio-group v-model="form.sensitive" :disabled="isSensitive!=0">
                <el-radio :label="0">不脱敏</el-radio>
                <el-radio :label="1">全部脱敏</el-radio>
                <el-radio :label="2">部分脱敏（手机号可见）</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="module" v-if="isStep">
        <div class="module-title">
          <mallki className="mallki-text" text="基本信息"></mallki>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model="form.name" clearable placeholder="请输入" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号" prop="citizenId">
              <el-input v-model="form.citizenId" clearable placeholder="请输入" maxlength="18"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" clearable placeholder="请输入" maxlength="11" @input="verifyPhone"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="module" v-if="!isStep">
        <div class="module-title">
          <mallki className="mallki-text" text="分配小区"></mallki>
        </div>
        <div class="distribute">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入小区"
            :titles="titles"
            v-model="commIndexList"
            :data="communityListData">
          </el-transfer>
        </div>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose()">取消</el-button>        
        <el-button type="primary" v-if="!isStep" @click="isStep = !isStep">上一步</el-button>
        <el-button type="primary" v-if="isStep" @click="handleNextStep">下一步</el-button>
        <el-button type="primary" v-if="!isStep" @click="handleSubmit()" :loading="loading">确定</el-button>

      </div>
    </el-form>
  </div>

</template>

<script>
  import { createOperator, loadTopOrgTree, fetchRoleList, getCommunitis, isAccountExist, isPhoneExist, fetchRoleComboList } from "@/api/authority";
  import { validateMobile, validateCitizenId, validateNumberAndLetter } from "@/utils/rules";
  import { getSensitive } from "@/utils/auth";

  export default {
    props:['currentOrg'],
    watch:{
      'filterText': function(val) {
        this.$refs.treeOrg.filter(val)
      }
    },
    data() {
      return {
        props: {
        label:'orgName',
        children: 'children'
      },
        orgTree:[],
        popoverShow:false,
        filterText: '',
        communityListData: [],
        commIndexList: [],
        titles: ["待选列表","已选列表"],
        filterMethod(query, item) {          
          return item.checkComm.indexOf(query) > -1;
        },
        isStep: true,
        loading: false,
        pswVisibility: true,
        form: {
          account: '',
          password: '',
          name: '',
          citizenId: '',
          phone: '',
          orgId: '',
          roleIdStr:'',
          communityIdStr:'',
          sensitive: 1,
        },
        orgCode:'',
        orgId:[],
        rules:{
          account: [
            {required: true, message: '请填写机构帐号', trigger: 'blur'},
            {validator: validateNumberAndLetter, message: '请填写正确的机构帐号', trigger: 'blur'},
            { min: 2, max: 20, message: '请输入2-20的字符' }
          ],
          password: [
            {required: true, message: '请填写登录密码', trigger: 'blur'},
            {validator: validateNumberAndLetter, message: '请填写正确登录密码'},
            { min: 6, max: 16, message: '请输入6-16位的登录密码' }
          ],
          name: [
            {required: true, message: '请填写操作人员姓名', trigger: 'blur'},
            { min: 2, max: 20, message: '请输入2-20的字符' }
          ],
          citizenId:[
            {validator: validateCitizenId, message: '请填写正确的身份证号', trigger: 'blur'},
            { min: 18, max: 18, message: '请输入正确的18位字符身份证号' }
          ],
          phone: [
            {validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择机构', trigger: 'blur'},
          ],
          roleIdStr: [
            {required: true, message: '请选择角色', trigger: 'blur'},
          ],
        },
        // orgOptions:[],
        roleList:[],
        communityList:[],
        // props: {
        //   label:'orgName',
        //   value: 'id',
        //   children: 'children'
        // }
      }
    },
    computed:{
      isSensitive: function(){
        return getSensitive()
      },
      roleIds:{
        set(arr){
          if(typeof(arr)=='object' && arr.length>0){
            this.form.roleIdStr = arr.toString()
          }else{
            this.form.roleIdStr = ''
          }
        },
        get(){
          return this.form.roleIdStr==''? [] :this.form.roleIdStr.split(',')
        }
      },
      // communityIdStr:{
      //   set(arr){  
      //     console.log('arr',arr)      
      //     if(typeof(arr)=='object' && arr.length>0){
      //       this.form.communityIdStr = arr.toString()
      //     }else{
      //       this.form.communityIdStr = ''
      //     }
      //     console.log('this.form.communityIdStr',this.form.communityIdStr)
      //   },
      //   get(){
      //     return this.form.communityIdStr==''? [] :this.form.communityIdStr.split(',')
      //   }
      // },
      // org:{
      //   set(obj){
      //     if(obj && typeof(obj)=='object'){
      //       this.form.orgId = obj.id
      //       this.orgCode = obj.orgCode
      //     }else{
      //       this.form.orgId = null
      //       this.orgCode = ''
      //     }
      //   },
      //   get(){
      //     return {
      //       id: this.form.orgId,
      //       orgCode : this.orgCode
      //     }
      //   }
      // }
    },
    methods: {
      clearOrg (){
        this.form.orgId = ''
        this.form.orgName = ''     
      },
      filterNodeMethod (value, data) {
        if (!value) return true
        return data.orgName.indexOf(value) !== -1
      },
      initNode () {
        let self = this
        self.clearOrg()
        loadTopOrgTree({}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.orgTree = [response.data.data]
            // self.orgCode = '@'+response.data.data.orgCode
          }
        }).catch(function (a) {
          console.error(a)
        })
      },
      loadNode(node, resolve) {
        if(node.data.children && node.data.children.length>0){
          let data = node.data.children

          for(let children of data){
            children.leaf = !children.disabled
          }
          resolve(data)
        }
      },
      handleNodeClick(data) {
        this.orgCode = '@'+data.orgCode
        this.filterText = ''
        this.form.orgName = data.orgName
        this.form.orgId = data.id
        this.popoverShow = false
        this.$refs['form'].validateField('orgId')
        if(data.parentId == -1 && !data.children){
          this.$message({
            message: '该节点下没有数据',
            type: 'error'
          })
        }
      },
      handleNextStep () {
        this.$refs.form.validate(valid=>{
          if(valid) {
            this.isStep = !this.isStep
          }
        })
      },
      generateData (community) {
        let data = []
        let self = this
        let checkComm = community
        community.forEach((item, index) => {
          data.push({
            label: item,
            key: index,
            checkComm: checkComm[index]
          })
        })
        self.communityListData = data
      },
      communityChange(valueArr) {
        let currentValue = valueArr[valueArr.length-1]
        if(currentValue == ['-1']) this.communityIdStr = ['-1']
      },
      // loadTopOrgTree(){
      //   let self = this;

      //   loadTopOrgTree({}).then(function (response) {
      //     if (response.data && response.data.code === 1) {
      //       // self.orgCode = '@'+response.data.data.orgCode
      //       // self.formatOrgOptions(response.data.data)
      //       self.orgOptions = [response.data.data]
      //       console.log('orgOptions',self.orgOptions)
      //       if(self.orgOptions.length == 1){
      //         self.org = self.orgOptions[0]
      //       }
      //     }
      //   }).catch(function (a) {
      //     console.error(a);
      //   })
      // },
      // formatOrgOptions(obj){

      //   if(typeof(obj) == 'object'){
      //     this.orgOptions.push({
      //       orgName: obj.orgName,
      //       id: obj.id,
      //       orgCode: obj.orgCode,
      //     })

      //     if(typeof(obj.children) == 'object' && obj.children.length>0){
      //       obj.children.forEach(item => {
      //         this.formatOrgOptions(item)
      //       });
      //     }
      //   }
      // },
      // loadRoleList: function () {
      //   let self = this;
        
      //   fetchRoleList({
      //     offset: 0
      //   }).then(function (response) {
      //     if (response.data && response.data.code === 1) {
      //       self.roleList = response.data.dataList || [];
      //     }
      //   }).catch(function (a) {
      //     console.error(a);
      //   })
      // },
      //获取小区列表
      getCommunityList: function () {
        let self = this;
        let list = []
        getCommunitis({}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.communityList = response.data.dataList || [];
            if(response.data.dataList.length>0){
              let datalist = response.data.dataList             
              datalist.forEach(item=>{
                list.push(item.communityName)
              })
              self.generateData(list)
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      //给communityIdStr赋值   commIndexList为已选择的小区['communityName']    communityIdStr格式 'id1','id2'
      getCommId () {
        let self = this
        let ids = []
        if(self.communityList.length>0){
          self.commIndexList.forEach(item=>{
            ids.push(self.communityList[item]['communityId'])
          })
        }
        self.form.communityIdStr = ids.toString()
      },
      //确定
      handleSubmit(){
        this.getCommId()
        let self = this
        self.$refs.form.validate(valid=>{
          if(valid){
            self.loading = true

            let params = { ...self.form }
            params.account = self.form.account+self.orgCode

            createOperator(params).then(function (response) {
              if (response.data && response.data.code === 1) {
                self.$message({
                  message: response.data.message,
                  type: 'success'
                });
                self.$emit('close')
              }
            }).catch(function (a) {
              console.error(a);
            }).finally(_=>{
              self.loading = false
            })
          }
        })
      },
      verifyAccount(value){
        let self = this
        isAccountExist({
          account: value+self.orgCode
        }).then(function (response) {
          if (response && response.data.code === 1) {
            if(response.data.data.isExist){
              self.$message({
                message: '存在重复帐号',
                type: 'error'
              })
              self.form.account=''
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      verifyPhone(value){
        if(value.length<11){
          return
        }
        let self = this
        isPhoneExist({
          phone: value
        }).then(function (response) {
          if (response && response.data.code === 1) {
            if(response.data.data.isExist){
              self.$message({
                message: '存在重复联系电话',
                type: 'error'
              })
              self.form.phone=''
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      fetchRoleComboList(){
        let self = this
        fetchRoleComboList({}).then(function (response) {
          if (response && response.data.code === 1) {
            self.roleList = response.data.dataList
          }
        }).catch(function (a) {
          console.error(a);
        })
      }
    },
    created() {
      this.initNode()
      this.fetchRoleComboList()
      this.getCommunityList()

      if(this.currentOrg) {
        this.form.orgId = this.currentOrg.id
        this.form.orgName = this.currentOrg.orgName
        this.orgCode = '@' + this.currentOrg.orgCode
      }
    },
  }
</script>
<style scoped>
@import '../../../styles/iconfont/iconfont.css';
  .module{
    background-color: rgb(246, 246, 246);
    border-radius: 7px;
  }
  .module-title:before{
    top:6px
  }
  .step{
    overflow: hidden;
    text-align: center;
    background: #F5F7FA;
    border-radius: 4px;
  }
  .step-box{
    overflow: hidden;
    display: inline-block;
    margin: 12px 0;
  }
  .step-idx{
    float: left;
    text-align: center;
    font-size: 16px;
    color: #C0C4CC;
  }
  .step-color{
    color: #434E5C
  }
  .step-jiantou{
    margin: 0 147px;
    font-size: 24px;
    color: #8C8C8C;
  }
  .step-icon{
    margin-right: 10px;
    font-size: 24px;
  }
</style>


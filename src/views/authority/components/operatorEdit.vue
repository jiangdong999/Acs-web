<template>
  <div v-loading="loading">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <div class="module">
        <div class="module-title">
          <mallki className="mallki-text" text="机构角色"></mallki>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="选择机构" prop="orgId">
              <el-select v-model="form.orgId" filterable disabled placeholder="请选择" clearable>
                <el-option
                  v-for="item in orgOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择角色" prop="roleIdStr">
              <el-select v-model="roleIds" multiple :disabled="disabled" filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id.toString()">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="module">
        <div class="module-title">
          <mallki className="mallki-text" text="帐号信息"></mallki>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="帐号" prop="account">
              <div class="box">{{form.account}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录密码" prop="password">
              <div class="box">
                <el-button type="text" @click="handleReset()" :loading="btnLoading">点击重置</el-button>
              </div>
            </el-form-item>
          </el-col>          
        </el-row>
        <el-row>
          <el-col :span="12" class="sensitive">
            <!-- <div style="line-height: 36px;">
              <el-checkbox v-model="form.sensitive" class="sensitive">数据脱敏处理</el-checkbox>
            </div> -->
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
      <div class="module">
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
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" clearable placeholder="请输入" maxlength="11" @input="verifyPhone"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="module">
        <div class="module-title">
          <mallki className="mallki-text" text="分配小区"></mallki>
        </div>
        <div class="distribute">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入小区"
            v-model="commIndexList"
            :titles="titles"
            :data="communityListData">
          </el-transfer>         
        </div>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose()">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="loading">确定</el-button>
      </div>
    </el-form>

    <div v-if="showPassword">
      <el-dialog
        title="重置密码"
        :visible.sync="showPassword"
        width="50%"
        append-to-body
        :close-on-click-modal="true">
        <password :data="data"></password>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import { updateOperator, loadTopOrgTree, getCommunitis, resetPassword, isPhoneExist, fetchRoleComboList } from "@/api/authority";
  import { validateMobile, validateCitizenId } from "@/utils/rules";
  import password from "./resetPW";
  import { getSensitive } from "@/utils/auth";

  export default {
    props:['data'],
    components:{
      password
    },
    data() {     
      return {
        // isSen: false,
        loading: false,
        btnLoading: false,
        showPassword: false,
        titles: ["待选列表","已选列表"],
        communityListData: [],
        commIndexList: [],
        filterMethod(query, item) {
          return item.checkComm.indexOf(query) > -1
        },
        form: {
          account: '',
          name: '',
          citizenId: '',
          phone: '',
          orgId: '',
          roleIdStr:'',
          communityIdStr:'',
          accountType:'',
          sensitive: false
        },
        rules:{
          name: [
            {required: true, message: '请填写操作人员姓名', trigger: 'blur'},
            { min: 2, max: 20, message: '请输入2-20的字符' }
          ],
          phone: [
            {validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择机构', trigger: 'blur'},
          ],
          citizenId:[
            {validator: validateCitizenId, message: '请填写正确的身份证号', trigger: 'blur'},
            { min: 18, max: 18, message: '请输入正确的18位字符身份证号' }
          ],
          roleIdStr: [
            {required: true, message: '请选择角色', trigger: 'blur'},
          ],
        },
        defaultProps:{
          value:'id',
          label: 'orgName',
          children: 'children'
        },
        orgOptions:[],
        roleList:[],
        communityList:[]
      }
    },
    computed:{
      isSensitive: function(){
        return getSensitive()
      },
      disabled(){
        return this.form.accountType=='2' 
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
      //     if(typeof(arr)=='object' && arr.length>0){
      //       this.form.communityIdStr = arr.toString()
      //     }else{
      //       this.form.communityIdStr = ''
      //     }
      //   },
      //   get(){
      //     return this.form.communityIdStr==''? [] :this.form.communityIdStr.split(',')
      //   }
      // }
    },
    methods: {
      generateData (community){
        let data = []
        let self = this
        let checkComm = community
        community.forEach((item, index) => {
          data.push({
            label: item,
            key: index,
            checkComm: checkComm[index]
          });
        });
        self.communityListData = data
      },
      communityChange(valueArr) {
        let currentValue = valueArr[valueArr.length-1]
        if(currentValue == ['-1']) this.communityIdStr = ['-1']
      },
      //点击重置
      handleReset(){
        this.showPassword = true
        // this.$confirm('确认重置密码吗？').then(_ => {
        //   this.btnLoading = true
        //   resetPassword({
        //     account:this.form.account
        //   }).then((response) =>{
        //     if (response.data && response.data.code === 1) {
        //       this.$alert('您的密码已重置为'+'<span style="color:#ff0000;font-weight:900;font-size:18px">'+response.data.data+'</span>', '重置成功', {
        //         confirmButtonText: '确定',
        //         dangerouslyUseHTMLString: true
        //       })
        //     }
        //   }).catch(function (a) {
        //     console.error(a);
        //   }).finally(_=>{
        //     this.btnLoading = false;
        //   })
          
        // }).catch( (a) => {
        //   // console.log(a)
        // })
      },
      loadTopOrgTree(){
        let self = this;
        self.loading = true

        loadTopOrgTree({}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.formatOrgOptions(response.data.data)
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          self.loading = false
        })
      },
      formatOrgOptions(obj){

        if(typeof(obj) == 'object'){
          this.orgOptions.push({
            name: obj.orgName,
            id: obj.id,
          })

          if(typeof(obj.children) == 'object' && obj.children.length>0){
            obj.children.forEach(item => {
              this.formatOrgOptions(item)
            })
          }
        }

      },
      //获取小区列表
      getCommunityList: function () {
        let self = this
        self.loading = true
        let list = []
        getCommunitis({}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.communityList = response.data.dataList || [];           
            let datalist = response.data.dataList             
              datalist.forEach(item=>{
                list.push(item.communityName)
              })
            self.formatCommunityIdStr()
            self.generateData(list)
          }
        }).catch(function (a) {
          console.error(a);
        }).finally(_=>{
          self.loading = false
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
        let self = this;
        self.getCommId()
        this.$refs.form.validate(valid=>{
          if(valid){
            
            self.loading = true

            updateOperator(self.form).then(function (response) {
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
      //校验手机号码是否重复
      verifyPhone(value){
        if(value.length<11 || value==this.data.phone){
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
      fetchRoleComboList: function (callback) {
        let self = this;
        
        fetchRoleComboList({}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.roleList = response.data.dataList || [];
            callback && callback()
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      formatCommunityIdStr () {
        let list = []
        
        if(this.communityList && this.form.communityIdStr){
          let idList = this.form.communityIdStr.split(',')
          this.communityList.forEach((item,index)=>{
            idList.forEach(ele=>{
              if(item.communityId === parseInt(ele)){
                list.push(index)
              }
            })          
          })
          this.commIndexList = list
        }
      },
    },
    mounted() {
      this.loadTopOrgTree()
      this.getCommunityList()
      this.form = Object.assign(this.form, this.data)
      // this.isSen = this.data.sensitive
      this.form.orgId = this.form.orgInfo.id
      this.fetchRoleComboList(()=>{
        this.form.roleIdStr = this.form.roleIdList.toString()
        delete this.form.roleIdList
      })
      
      this.form.communityIdStr = this.form.communityIdList.toString()
      this.formatCommunityIdStr()
      delete this.form.communityIdList
    },
  }
</script>
<style scoped>
  .module{
    background-color: rgb(246, 246, 246);
    border-radius: 7px;
  }
  .box{
    width: 180px;
    text-align: left;
    font-weight: 900;
  }
</style>


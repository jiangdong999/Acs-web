<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" v-loading="loading">
      <div class="module">
        <div class="module-title">
          <mallki className="mallki-text" text="角色信息"></mallki>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属小区" prop="communityId">
              <el-select v-model="form.communityId" disabled filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in communityList"
                  :key="item.communityId"
                  :label="item.communityName"
                  :value="item.communityId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择角色" prop="roleIds">
              <el-select v-model="form.roleIds" multiple filterable placeholder="请选择" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
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
          <!-- <el-col :span="5">
            <div style="line-height: 36px;">
              <el-checkbox v-if="!isSensitive" v-model="form.sensitive">数据脱敏处理</el-checkbox>
            </div>
          </el-col> -->
          <el-col :span="12">
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
    </el-form>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$parent.handleClose()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()" :loading="loading">确定</el-button>
    </div>
  </div>

</template>

<script>
  import { resetPassword, isPhoneExist } from "@/api/authority";
  import { fetchRoleList, updateUser } from "@/api/community";
  import { validateMobile, validateCitizenId } from "@/utils/rules";
  import { mapGetters } from 'vuex';
  import { getSensitive } from "@/utils/auth";

  export default {
    props:['data'],
    data() {
      return {
        // isSen: false,
        loading:false,
        btnLoading:false,
        form: {
          account: '',
          name: '',
          citizenId: '',
          phone: '',
          roleIds:[],
          communityId:'',
          sensitive: true
        },
        rules:{
          name: [
            {required: true, message: '请填写操作人员姓名', trigger: 'blur'},
            { min: 2, max: 20, message: '请输入2-20的字符' }
          ],
          phone: [
            // {required: true, message: '请填写操作人员手机号码', trigger: 'blur'},
            {validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择机构', trigger: 'blur'},
          ],
          citizenId:[
            {validator: validateCitizenId, message: '请填写正确的身份证号', trigger: 'blur'},
            { min: 18, max: 18, message: '请输入正确的18位字符身份证号' }
          ],
          roleIds: [
            {required: true, message: '请选择角色', trigger: 'blur'},
          ],
          communityId: [
            {required: true, message: '请选择所属小区', trigger: 'blur'},
          ],
        },
        roleList:[],
      }
    },
    computed:{
      isSensitive: function(){
        return getSensitive()
      },
      ...mapGetters([
        'community',
        'communityList'
      ])
    },
    methods: {
      handleReset(){
        this.$confirm('确定重置密码吗？').then(_ => {
          this.btnLoading = true
          resetPassword({
            account:this.form.account
          }).then((response) =>{
            if (response.data && response.data.code === 1) {
              this.$alert('您的密码已重置为'+'<span style="color:#ff0000;font-weight:900;font-size:18px">'+response.data.data+'</span>', '重置成功', {
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true
              })
            }
          }).catch(function (a) {
            console.error(a);
          }).finally(_=>{
            this.btnLoading = false;
          })
          
        }).catch( (a) => {
          // console.log(a)
        })
      },
      handleSubmit(){
        this.$refs.form.validate(valid=>{
          if(valid){
            let self = this;
            self.loading = true

            self.form.communityIds = [self.form.communityId]
            updateUser(self.form).then(function (response) {
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
      loadRoleList: function () {
        let self = this;
        
        fetchRoleList({
          offset: 0
        }).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.roleList = response.data.dataList || [];
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
    },
    mounted() {
      this.loadRoleList()
      this.form = Object.assign(this.form, this.data)
      // this.isSen = this.data.sensitive
      this.form.roleIds = this.data.roleIdList
      this.form.communityId = this.data.communityIdList[0]

    },
  }
</script>
<style scoped>
  .module{
    background-color: rgb(246, 246, 246);
    border-radius: 7px;
  }
  .module-title:before{
    top: 6px;
  }
  .box{
    text-align: left !important;
    width: 180px;  
    font-weight: 900;
  }
</style>


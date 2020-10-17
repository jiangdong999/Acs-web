<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" auto-complete="nope">
      <div class="module">
        <div class="module-title">
          <mallki className="mallki-text" text="角色信息"></mallki>
        </div>
        <el-row>
          <el-col :span=8>
            <el-form-item label="所属小区" prop="communityIds">
              <el-select v-model="form.communityId" disabled filterable placeholder="请选择" clearable class="select-pointer">
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
              <el-input v-model.trim="form.account" style="margin-right:10px" clearable placeholder="请输入姓名拼音" @change="verifyAccount" maxlength="20" auto-complete="new-password">
              </el-input>
              <!-- <el-checkbox v-if="!isSensitive" v-model="form.sensitive">数据脱敏处理</el-checkbox> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8" v-if="!isSensitive">
            <el-form-item label="数据脱敏" prop="sensitive">
              <el-radio-group v-model="form.sensitive">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="form.password" maxlength="16" placeholder="请输入6-16位密码" :type="pswVisibility?'type':'password'" auto-complete="new-password">
                <i slot="suffix" class="iconfont" :class="pswVisibility?'icon-htmal5icon09':'icon-htmal5icon08'" @click="pswVisibility=!pswVisibility"></i>
              </el-input>
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
      <el-button type="primary" @click="handleSubmit()" :loading="loading">新增</el-button>
    </div>
  </div>

</template>

<script>
  import { isAccountExist, isPhoneExist } from "@/api/authority";
  import { fetchRoleList, createUser } from "@/api/community";
  import { validateMobile, validateCitizenId, validateNumberAndLetter } from "@/utils/rules";
  import { mapGetters } from 'vuex';
  import { getSensitive } from "@/utils/auth";

  export default {
    data() {
      return {
        loading:false,
        pswVisibility: false,
        form: {
          account: '',
          password: '',
          name: '',
          citizenId: '',
          phone: '',
          roleIds: [],
          communityId: '',
          sensitive: 1
        },
        rules:{
          account: [
            {required: true, message: '请填写小区帐号', trigger: 'blur'},
            {validator: validateNumberAndLetter, message: '请填写正确的小区帐号', trigger: 'blur'},
            { min: 2, max: 20, message: '请输入2-20的字符' }
          ],
          password: [
            {required: true, message: '请填写机构帐号密码', trigger: 'blur'},
            { min: 6, max: 16, message: '请输入6-16位字符' },
            {validator: validateNumberAndLetter, message: '请填写正确的数字字母密码'},
          ],
          name: [
            {required: true, message: '请填写操作人员姓名', trigger: 'blur'},
            { min: 2, max: 20, message: '请输入2-20位字符' }
          ],
          citizenId:[
            {validator: validateCitizenId, message: '请填写正确的身份证号', trigger: 'blur'},
            { min: 18, max: 18, message: '请输入正确的18位字符身份证号' }
          ],
          phone: [
            // {required: true, message: '请填写操作人员手机号码', trigger: 'blur'},
            {validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
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
      loadRoleList: function () {
        let self = this;
        
        fetchRoleList({
          offset: 0
        }).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.roleList = response.data.dataList || [];

            if(self.roleList.length == 1){
              self.form.roleIds.push(self.roleList[0].id)
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      },
      handleSubmit(){
        this.$refs.form.validate(valid=>{
          if(valid){
            let self = this;
            self.loading = true

            self.form.communityIds = [self.form.communityId]
            createUser(self.form).then(function (response) {
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
          account: value
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
      }
    },
    mounted() {
      this.loadRoleList()
      this.form.communityId = this.community.communityId
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
</style>


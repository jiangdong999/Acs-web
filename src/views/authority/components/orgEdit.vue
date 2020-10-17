<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构帐号" prop="account">
            {{form.account}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="帐号密码" prop="password">
            <div class="box">
              <el-button type="text" @click="handleReset()" :loading="btnLoading">点击重置</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名" prop="orgName">
            <el-input v-model="form.orgName" maxlength="20" clearable placeholder="请填写机构名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机构编码" prop="orgCode">
            {{form.orgCode}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构负责人" prop="leaderName">
            <el-input v-model="form.leaderName" maxlength="10" clearable placeholder="请填写机构负责人"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人电话" prop="leaderPhone">
            <el-input v-model="form.leaderPhone" clearable placeholder="请填写负责人电话" maxlength="11" @input="verifyPhone"/>
          </el-form-item>
        </el-col>
      </el-row>
      
      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import { updateTopOrg, resetPassword, isPhoneExist } from "@/api/authority";
  import { validateMobile } from "@/utils/rules";

  export default {
    props:['data'],
    data() {
      return {
        loading:false,
        btnLoading: false,
        form: {
          orgName: '',
          leaderName: '',
          leaderPhone: '',
        },
        rules:{
          orgName: [
            {required: true, message: '请填写机构名称', trigger: 'blur'},
            { min: 2, max: 20, message: '请填入2-20位格式的机构名称' },
          ],
          leaderName: [
            // {required: true, message: '请填写机构负责人名称', trigger: 'blur'},
            { min: 2, max: 10, message: '请填入2-10位格式的机构负责人名称' }
          ],
          leaderPhone: [
            // {required: true, message: '请填写机构负责人手机号', trigger: 'blur'},
            {validator: validateMobile, message: '请填写正确的手机号', trigger: 'blur'}
          ],
        }
      }
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
        let self = this;
        
        this.$refs.form.validate(valid => {
          if(valid){
            self.loading = true;
            updateTopOrg(this.form).then(function (response) {
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
              self.loading = false;
            })
          }
        })
      },
      verifyPhone(value){
        if(value.length<11 || value==this.data.leaderPhone){
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
              self.form.leaderPhone=''
            }
          }
        }).catch(function (a) {
          console.error(a);
        })
      }
    },
    mounted() {
      this.form = {...this.data}
    },
  }
</script>
<style scoped>
  .box{
    width: 180px;
    text-align: center;
    font-weight: 900;
  }
</style>


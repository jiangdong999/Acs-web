<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="通知标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入" clearable :maxlength="16"/>
          </el-form-item>
          <el-form-item label="通知内容" prop="context" class="announceContext">

            <el-radio-group v-model="form.contextType">
              <el-radio label="1">文字</el-radio>
              <el-radio label="2">图片</el-radio>
            </el-radio-group>

            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入"
              v-model="form.context"
              v-if="form.contextType==='1'">
            </el-input>
            <span class="textarea-delete" v-if="form.contextType==='1'"  @click="form.context = ''">
              <i class="el-icon-delete"></i>
            </span>
            <el-upload
              class="upload-demo"
              v-else-if="form.contextType=='2'"
              action="XXX"
              name="fileToUpload"
              :before-upload="beforeImageUpload"
              :limit="1"
              list-type="picture">
              <el-button size="small" type="primary" :loading="loading">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1024kb；建议长宽比例590✖800</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <noticeView :content="form"/>
        </el-col>
      </el-row>

      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose()">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {addNormalNotice, upload} from "@/api/notice";
  import noticeView from "./noticeView"
  import { mapGetters } from 'vuex';

  export default {
    components:{noticeView},
    data() {
      return {
        loading: false,
        form: {
          title:'',
          contextType:"1",
          context:''
        },
        rules: {
          title: [
            {required: true, message: '请输入公告标题', trigger: 'blur'}
          ],
          context: [
            {required: true, message: '请输入公告内容', trigger: 'blur'}
          ]
        },
        idLoading: false,
      }
    },
    computed:{
      ...mapGetters([
        'community'
      ]),
    },
    watch:{
      ['form.contextType']:function(newValue,oldValue){
        if(newValue != oldValue){
          this.form.context = ''
        }
      }
    },
    methods: {
      handleSubmit: function () {
        let self = this;
        self.$refs.form.validate((valid) => {
          if (valid) {
            self.loading = true
            self.addNormalNotice(self.form)

          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      addNormalNotice:function(form){
        let self = this;
        addNormalNotice({...form, ...self.community}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.$message({
              message: '提交成功',
              type: 'success'
            });
            self.$emit('close');
          }
        }).catch(function (a) {
          console.error(a)
        }).finally(_=>[
          self.loading = false
        ]);
      },
      beforeImageUpload(file) {
        let self = this;
        const isType = file.type === 'image/jpg' || file.type ==='image/png' || file.type ==='image/jpeg';
        const isSize = file.size / 1024 < 1024;

        if (!isType) {
          self.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isSize) {
          self.$message.error('上传头像图片大小不能超过 1024KB!');
        }
        if(isType && isSize){
          self.loading = true
          let fd = new FormData();
          fd.append('fileToUpload', file);

          upload(fd).then(function (response) {
            if (response.data && response.data.code === 1) {
              self.form.context = response.data.data.url
            }
          }).catch(function (a) {
            console.error(a)
          }).finally(_=>{
            self.loading = false
          });
        };

        return false;
      }
    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">

  .textarea-delete{
    position: absolute;
    right: 20px;
    bottom: 5px;
    cursor: pointer;
    transition: all .3s;
  }
  .textarea-delete:hover{
    color: #66DDDB;
  }
  .form-dialog-control-area{
      margin-top: 20px;
  }
/deep/ .el-form-item--medium .el-form-item__label{
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .announceContext /deep/ .el-form-item__label{
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .announceContext /deep/ .el-radio-group{
    padding-bottom: 10px;
  }
</style>

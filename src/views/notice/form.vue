<template>
  <div class="announce">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-row>
        <el-col :span="10" >
          <el-form-item label="发布时间" prop="time">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              :picker-options="pickerOptions"
              :default-time="['00:00:00','23:59:59']"
              value-format="yyyyMMddHHmmssSSS"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入" clearable :maxlength="16"/>
          </el-form-item>
            <el-form-item label="公告内容" class="announceContext" prop="context">

            <el-radio-group v-model="form.contextType">
              <el-radio label="1">文字</el-radio>
              <el-radio label="2">图片</el-radio>
            </el-radio-group>

            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入"
              v-model="form.context"
              v-if="form.contextType==='1'&& preview !== 'device'"
              maxlength="160">
            </el-input>
            <vue-editor
              placeholder="请输入"
              v-if="form.contextType==='1' && preview === 'device'"
              :editorToolbar="customToolbar"
              v-model="form.context"
              maxlength="160">
            </vue-editor>
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
              <div slot="tip" class="el-upload__tip" v-if="preview=='device'">
                <span>请上传 .jpg 或 .png 文件，且不超过1024KB；</span><br>
                <span>图片尺寸规格：横屏设备(1280×800)，竖屏设备(800×1280)</span><br>
                <span>请注意！其他尺寸图片将显示不全。</span><br>
              </div>
              <div slot="tip" class="el-upload__tip" v-else>只能上传jpg/png文件，且不超过1024kb；建议长宽比例{{imgSizeTip}}，否则可能导致图片显示不全</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="落款名称" prop="publishers" v-if="form.contextType==='1'">
            <el-input v-model="form.publishers" placeholder="请输入" clearable maxlength="30"/>
          </el-form-item>
          <el-form-item label="轮播时长" prop="leaseStartTime">
            <el-select v-model="form.playTime" placeholder="请选择">
              <el-option :value="5" label="5"/>
              <el-option :value="10" label="10"/>
              <el-option :value="15" label="15"/>
              <el-option :value="20" label="20"/>
              <el-option :value="25" label="25"/>
              <el-option :value="30" label="30"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <device v-if="preview == 'device'" :content="form" :htmlstr="liveHtml"/>
          <mobile v-else-if="preview == 'mobile'" :content="form" :htmlstr="phoneHtml"/>
        </el-col>
      </el-row>

      <div class="form-dialog-control-area">
        <el-button type="default" @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit('form')" :loading="loading">确定</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
  import {addClientNotice,addDeviceNotice,upload} from "@/api/notice";
  import { VueEditor } from 'vue2-editor'
  import device from "./components/device"
  import mobile from "./components/mobile"
  import { mapGetters } from 'vuex';

  export default {
    name: "notice-form",
    props:['preview', 'communityId'],
    components:{device,mobile,VueEditor},
    data() {
      return {
        loading: false,
        pickerOptions: {
          shortcuts: [{
            text: '一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          disabledDate: (time) => {
            return time.getTime() < (Date.now() - 86400000)
          }
        },
        form: {
          loading: false,
          title:'',
          contextType:"1",
          context:'',
          publishers:"",
          time: [],
          playTime:null,
          upTime:'',
          downTime:''
        },
        rules: {
          time: [
            {required: true, message: '请选择发布时间和结束时间', trigger: 'change', type: 'array'}
          ],
          title: [
            {required: true, message: '请输入公告标题', trigger: 'blur'}
          ],
          context: [
            {required: true, message: '请设置公告文字内容或图片', trigger: 'blur'}
          ],
          publishers:[
            {required: true, message: '请输入落款名称', trigger: 'blur'}
          ]
        },
        idLoading: false,
        customToolbar: [
          // [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }, { 'background': [] }],
          // [{'align':''},{'align':'center'},{'align':'right'}],
          // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          // ['image', 'code-block']
        ]
      }
    },
    computed:{
      ...mapGetters([
        'community'
      ]),
      imgSizeTip:function(){
        return this.preview=='device'?'1280x800':'750x1220'
      },
      liveHtml : function () {
        if(this.form.contextType=='2'){
          return
        }
        let html = this.form.context
        //br标签替换p标签
        html = html.replace(/<p>/g, '');
        html = html.replace(/<\/p>/g, '<\/br>');
        // html = html.replace(/<([\/]?)(p)((:?\s*)(:?[^>]*)(:?\s*))>/g, '<$1br$3>');
        return html
      },
      phoneHtml : function () {
        let html = this.form.context
        html = html.replace(/\r|\n/g, '</br>');
        // html = html.replace(/<([\/]?)(p)((:?\s*)(:?[^>]*)(:?\s*))>/g, '<$1br$3>');
        return html
      }
    },
    watch:{
      ['form.contextType']:function(newValue,oldValue){
        if(newValue != oldValue){
          this.form.context = ''
        }
      }
    },
    methods: {
      handleSubmit: function (formName) {
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid && self.communityId) {
            self.loading = true
            self.form.upTime = self.form.time[0]
            self.form.downTime = self.form.time[1]
            self.form.communityId = self.communityId
            if(self.preview==='device') {
              if(self.form.contextType==='1'){
                let tmp = self.liveHtml
                tmp = tmp.substring(0, tmp.length - 5)
                self.form.context = tmp
              }
              self.addDevice(self.form)
            }else{
              self.addClient(self.form)
            }

          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      addClient:function(form){
        let self = this;
        addClientNotice({...form, ...self.community}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.$message({
              message: '提交成功',
              type: 'success'
            });
            self.$parent.$parent.handleClose();
          } else {
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).catch(function (a) {
          console.error(a)
        }).finally(_=>[
          self.loading = false
        ]);
      },
      addDevice:function(form){
        let self = this;
        addDeviceNotice({...form, ...self.community}).then(function (response) {
          if (response.data && response.data.code === 1) {
            self.$message({
              message: '提交成功',
              type: 'success'
            });
            self.$parent.$parent.handleClose();
          } else {
            self.$message({
              message: response.data.message,
              type: 'error'
            });
          }
        }).catch(function (a) {
          console.error(a)
        }).finally(_=>[
          self.loading = false
        ]);
      },
      handleClose: function () {
        this.$parent.handleClose();
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
            } else {
              self.$message({
                message: response.data.message,
                type: 'error'
              });
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
  /* select框宽度 */
  .el-select{
    width: 100%
  }
  /* 日期选择框宽度 */
  .el-date-editor--daterange.el-input__inner{
    width: 100%;
  }

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
  .announce /deep/ .el-form-item--medium .el-form-item__label{
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .announce .announceContext /deep/ .el-form-item__label{
    padding-top: 0px;
  }
  .announceContext /deep/ .el-radio-group{
    padding-bottom: 10px;
  }
</style>

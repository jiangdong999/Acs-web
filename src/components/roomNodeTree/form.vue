<template>
  <div class="container">
    <div class="row-item">
      <p>当前节点</p>
      <div class="node-name">{{node.fullNodeName}}</div>
    </div>

    <div class="row-item" v-if="parseInt(node.level)!=5">
      <p>新增节点</p>
      <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="60px" inline>
          <el-form-item prop="areaCount" v-if="currentNodeLevel<=1">
            区域
            <el-input-number 
            v-model="form.areaCount" 
            :min="0" 
            :max="50" 
            :precision="0"
            :disabled="loading"
            size="small">
            </el-input-number>
          </el-form-item>
          <el-form-item prop="buildCount" v-if="currentNodeLevel<=2">
            楼栋
            <el-input-number 
            v-model="form.buildCount" 
            :min="1" 
            :max="50" 
            :precision="0"
            :disabled="loading"
            size="small">
            </el-input-number>
          </el-form-item>
          <el-form-item prop="partCount" v-if="currentNodeLevel<=3">
            单元
            <el-input-number 
            v-model="form.partCount" 
            :min="0" 
            :max="50" 
            :precision="0"
            :disabled="loading"
            size="small">
            </el-input-number>
          </el-form-item>
          <el-form-item prop="floorCount" v-if="currentNodeLevel<=4">
            楼层
            <el-input-number 
            v-model="form.floorCount" 
            :min="1" 
            :max="50" 
            :precision="0"
            :disabled="loading"
            size="small">
            </el-input-number>
          </el-form-item>
          <el-form-item prop="roomCount" v-if="currentNodeLevel<=5">
            房间
            <el-input-number 
            v-model="form.roomCount" 
            :min="1" 
            :max="50" 
            :precision="0"
            :disabled="loading"
            size="small">
            </el-input-number>
          </el-form-item>
          <div>
            <span v-if="currentNodeLevel<=1">小区拥有 <label>{{form.areaCount}}</label> 个区域&emsp;</span>
            <span v-if="currentNodeLevel<=2">每个区域 <label>{{form.buildCount}}</label> 栋楼&emsp;</span>
            <span v-if="currentNodeLevel<=3">每栋楼 <label>{{form.partCount}}</label> 单元&emsp;</span>
            <span v-if="currentNodeLevel<=4">每单元 <label>{{form.floorCount}}</label> 层&emsp;</span>
            <span v-if="currentNodeLevel<=5">每层 <label>{{form.roomCount}}</label> 个房间</span>
          </div>
        </el-form>
      </div>
    </div>
    <div class="row-item" v-else>
      <p>新增房间节点</p>
      <div>
        <el-form inline>
          <el-form-item label="已存在：" v-if="node.children && node.children.length>0">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 5 }"
              placeholder="请输入内容"
              disabled
              :value="textRooms(node)">
            </el-input>
          </el-form-item>
          <el-form-item label="新增：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 5 }"
              placeholder="请输入内容"
              v-model="rooms">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="form-dialog-control-area">
      <el-button type="primary" @click="handleSubmit()" :loading="loading">确认新增</el-button>
    </div>
  </div>
</template>

<script>
import {validatePositiveNumber, validateNumber} from "@/utils/rules"

export default {
  props:['node'],
  data(){
    return {
      loading: false,
      currentNodeLevel: parseInt(this.node.level),
      form: {
        areaCount: 0,
        buildCount: 1,
        partCount: 0,
        floorCount: 1,
        roomCount: 1
      },
      rooms:'',
      rules: {
        areaCount: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {message: '请输入正确的数字', validator: validateNumber}
        ],
        buildCount: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {message: '请输入大于零的正确数字', validator: validateNumber}
        ],
        partCount: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {message: '请输入正确的数字', validator: validateNumber}
        ],
        floorCount: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {message: '请输入大于零的正确数字', validator: validateNumber}
        ],
        roomCount: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {message: '请输入大于零的正确数字', validator: validateNumber}
        ]
      }
    }
  },
  methods:{
    computedForm(level){

      let self = this
      let actionFunc = function(keys){
        let targetObj = {}
        keys.forEach(key => {
          targetObj[key] = self.form[key]
        })

        return targetObj
      }

      let levelGetForm = new Map([
        ['1', ['areaCount', 'buildCount', 'partCount', 'floorCount', 'roomCount']],
        ['2', ['buildCount', 'partCount', 'floorCount', 'roomCount']],
        ['3', ['partCount', 'floorCount', 'roomCount']],
        ['4', ['floorCount', 'roomCount']],
      ])
      let targetForm = actionFunc(levelGetForm.get(level))

      return targetForm
    },
    handleSubmit: function(){
      this.loading = true
      if(this.node.level !='5'){
        this.$refs.form.validate((valid) =>{
          if(valid){
            this.$emit('creatNodes', this.node, this.computedForm(this.node.level))
          }
          this.loading = false
        })
      }else{
        if(!this.rooms){
          this.$message.error('请填写正确的房间')
          this.loading = false
        }else{
      
          let roomList = this.rooms.split('\n')
          let nodeNames = []

          let valid = roomList.some(item=>{

            nodeNames.push({label: item})
            return item.length<1 || item.length>16

          })

          if(valid){
            this.$message.error('请检查房间号位数，不可小于1或大于16')
          }else{
            this.$emit('creatRooms', this.node, nodeNames)
          }
          this.loading = false
        }
      }
    },
    textRooms(data) {
      let result = ''
      if(!data.children){
        this.$set(data, 'children', []);
      }
      data.children.forEach((item, index) => {
        if(data.children.length-1 === index){
          result += item.nodeName
        }else{
          result += item.nodeName+'\n'
        }
      });
      return result
    },
  }
}
</script>

<style scoped>
  .container{
    padding: 0 10px;
  }
  .row-item{
    margin-bottom: 20px;
  }
  .row-item>div{
    padding-left: 30px;
  }
  .node-name{
    font-weight: 900;
    font-size: 18px;
    line-height: 40px;
  }
</style>

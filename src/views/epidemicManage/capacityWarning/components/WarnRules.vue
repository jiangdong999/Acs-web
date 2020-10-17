<template>
  <el-form ref="form" v-loading="loading" :model="form" label-position="top" :rules="rules" inline>
    <div class="warnCont">
      <div class="warnCont_title">{{communityName}}</div>
      <div class="warnCont_list">
        <div class="warnCont_h1">疑似返程人员</div>
          <el-row>
            <el-col class="selectOption" :span="24">
              <el-form-item label="上一次出现时间" prop="timeVal" >
                <el-select v-model="form.timeVal" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="width:300px"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
      </div>
      <div class="warnCont_list">
        <div class="warnCont_h1">疑似群租房A</div>
          <el-row class="inputOption">
            <el-col :span="24">
              <el-form-item
                label="房间内登记的承租人数量超过"
                prop="maxHousehold"
                class="warnCont_label"
              >
                <el-input
                  placeholder="请输入"
                  
                  v-model.number="form.maxHousehold"
                  style="width:300px"
                ><span slot="suffix">人</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </div>
      <div class="warnCont_list">
        <div class="warnCont_h1">疑似群租房A</div>
          <el-row class="inputOption">
            <el-col :span="24">
              <el-form-item 
                label="房间一天内开门次数超过" 
                prop="maxDoorNum"
                class="warnCont_label"
                style="color:#656565"
              >
                <el-input 
                  placeholder="请输入" 
       
                  v-model.number="form.maxDoorNum"
                  style="width:300px"
                ><span slot="suffix">次</span>
                </el-input>
              </el-form-item>
              
            </el-col>
          </el-row>
      </div>
      <div class="form-dialog-control-area">
        <el-button type="default" @click="$parent.handleClose">关闭</el-button>
        <el-button type="primary" @click="submitForm('form')" :loading="loading">确定</el-button>
      </div>
    </div>
  </el-form>
</template>
<script>
import { intelligentruleone,intelligentrulesave } from "@/api/epidemic"; //table的数据接口
import { mapGetters } from "vuex"; //mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
export default {
  data() {
    function moreThenNumber(rule, value, callback) {//房间内登记的承租人数量超过
      if (!Number.isInteger(value)) {
        callback(new Error("请输入人数"));
      }else if(value > 99){
        callback(new Error("人数不可大于99"));
      }else if(value < 0){
        callback(new Error("人数不可小于0"));
      }else {
        callback();
      }
    }
    function maxDoorNum(rule, value, callback) {//房间一天开门次数超过
      if (!Number.isInteger(value)) {
        callback(new Error("请输入开门次数"));
      }else if(value > 9999){
        callback(new Error("开门次数不可大于9999"));
      }else if(value < 0){
        callback(new Error("开门次数不可小于0"));
      }else {
        callback();
      }
    }
    return {
      loading: false,
      communityName:'',
      form: {
        communityId: null,//社区id
        maxHousehold: "",
        maxDoorNum:'',
        timeVal: "0",
      },
      rules: {
        maxHousehold: [{ required: true, validator: moreThenNumber, trigger: "blur" }],
        maxDoorNum: [{required: true, validator: maxDoorNum, trigger: "blur" }],
        timeVal: [{ required: true, message: '请选择上一次出现时间', trigger: 'change' }]
      },
      options: [
        {
          value: "0",
          label: "无设置"
        },
        {
          value: "3",
          label: "3天前"
        },
        {
          value: "7",
          label: "7天前"
        },
        {
          value: "14",
          label: "14天前"
        },
        {
          value: "30",
          label: "30天前"
        },
        {
          value: "60",
          label: "60天前"
        },
        {
          value: "90",
          label: "90天前"
        }
      ],
      
    };
  },
  created() {
    this.loadData();
  },
  //从getter中拿取communityId
  computed: {
    ...mapGetters(["communityId","community"])    
  },
  methods: {
    submitForm(formName) {
      let self = this;
      
      self.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formParams = { ...this.form };//上行参数
          formParams.communityId = self.communityId || -1;
          formParams.timeVal = formParams.timeVal.replace('天前','')
          intelligentrulesave(formParams)
            .then(function(response) {
              self.loading = false;
              if (response && response.data.code === 1) {
                self.$message({
                  message: '保存成功',
                  type: 'success'
                });
                self.$parent.handleClose()//关闭弹层
              } 
            })
            .catch(function(a) {
              console.error(a);
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    loadData:function(){
      let self = this;
      self.loading = true;
      let formParams = { communityId:null };//上行参数
      formParams.communityId = self.communityId || -1;
      self.communityName = self.community.communityName;
      intelligentruleone(formParams)
        .then(function(response) {
          self.loading = false;
          if (response && response.data.code === 1) {
            self.form.maxHousehold=response.data.data.personNum
            self.form.maxDoorNum=response.data.data.openDoorNum
            self.form.timeVal=response.data.data.dayNum+"天前"
          }
        })
        .catch(function(a) {
          console.error(a);
        });
      }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .warnCont .warnCont_title {
  width: auto;
  /* padding: 0 20px; */
  height: 20px; 
  line-height: 20px;
  color: #333;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 20px;
}
/deep/ .warnCont .warnCont_list {
  /* height: 130px; */
  /* background: #F0F2F5; */
  border-radius: 5px;
  /* margin: 20px; */
  /* padding: 20px; */
  color: #223040;
}
/deep/ .warnCont .warnCont_h1 {
  margin-bottom: 20px;
  color: #223040;
  font-weight: 600;
  font-size: 16px;
  padding-left: 10px;
  border-left: 2px solid #007ee4;
}
/deep/ .warnCont .warnCont_span {
  height: 36px;
  line-height: 36px;
  color: #223040;
  font-weight: 600;
}
/deep/ .warnCont .el-form-item__label {
  color: #223040;
} 
/deep/ .warnCont .warnCont_label .el-form-item__label {
  line-height: 18px;
  font-size: 12px;
}

/deep/.el-select .el-input{
  width: 300px;
}
.inputOption /deep/.el-input__suffix{
  top: 12px;
  color: #333;
  right: 10px;
}
.selectOption /deep/.el-input__suffix{
  top: 0;
}
</style>
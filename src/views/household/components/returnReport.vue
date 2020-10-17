<template>
  <div>
    <el-form ref="form" inline :model="form" :rules="rules" label-width="100px">
      <slot name="header"></slot>
      <div class="padding-content">
        <el-row>
          <el-col :span="12">
            <el-form-item label="返程地点" prop="provinceCode">
              <el-cascader
                clearable
                :options="options"
                @active-item-change="handleItemChange"
                @change="selectNode"
                :props="props"
              ></el-cascader>
            </el-form-item><br>
            <el-form-item label="门禁权限" prop="allowOpen">
              <el-switch
                v-model="form.allowOpen"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
              <label v-if="form.allowOpen=='1' " style="color:#13ce66">启动</label>
              <label v-else style="color:#ff4949;">不启用</label>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="返程日期" prop="returnDate">
              <el-date-picker
                placeholder="请选择"
                v-model="form.returnDate" type="date"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd000000000">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getLocation} from "@/api/location";
export default {
  created () {
    this.initLocation(0,'')
  },
  data(){
    return {
      options: [
        {
          code: '',
          name: '',
          label: '',
          cities: []
        }
      ],
      props: {
        value: 'code',
        children: 'cities'
      },
      form:{
        provinceCode: null,
        cityCode: null,
        returnDate: '',
        allowOpen: '1',
      },
      rules: {
        // provinceCode: [
        //   {required: true, message: '请选择返程地点', trigger: 'blur'}
        // ],
        // returnDate: [
        //   {required: true, message: '请选择返程日期', trigger: 'blur'}
        // ],
      },
      province: [],
      city: []
    }
  },
  methods:{
    initLocation(loadLevel, zoningCode){
      let self = this;
      getLocation({
        level: loadLevel,
        zoningCode: zoningCode
      }).then(function (response) {
        if(response.data && response.data.code==1) {
          //获取省
          if(loadLevel==0){
            response.data.dataList.map(item=>{
              delete item.level
              item.label = item.name
              item.cities = []
              return item
            })
            self.options = response.data.dataList;
          }
          //获取市
          if(loadLevel==1){
            let index
            self.options.forEach((item,idx)=>{
              if(item.code==zoningCode){
                index = idx
              }
            })
            response.data.dataList.map(item=>{
              delete item.level
              item.label = item.name
              return item
            })
            self.options[index].cities = response.data.dataList
            self.$forceUpdate()
          }
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
      })
    },
    initLocation(loadLevel, zoningCode){
      let self = this;
      getLocation({
        level: loadLevel,
        zoningCode: zoningCode
      }).then(function (response) {
        if(response.data && response.data.code==1) {
          //获取省
          if(loadLevel==0){
            response.data.dataList.map(item=>{
              delete item.level
              item.label = item.name
              item.cities = []
              return item
            })
            self.options = response.data.dataList;
          }
          //获取市
          if(loadLevel==1){
            let index
            self.options.forEach((item,idx)=>{
              if(item.code==zoningCode){
                index = idx
              }
            })
            response.data.dataList.map(item=>{
              delete item.level
              item.label = item.name
              return item
            })
            self.options[index].cities = response.data.dataList
          }
        }
      }).catch(function (a) {
        console.error(a);
      }).finally(_=>{
      })
    },
    //选中级联一级
    handleItemChange(val) {
      let code = val.toString()     
      this.initLocation(1, code)
    },
    //选中级联二级
    selectNode (data){
      this.form.provinceCode = data[0]
      this.form.cityCode = data[1]
    },
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })
      
      return _valid
    },
  }
}
</script>

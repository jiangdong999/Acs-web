<template>
  <div class="jdClass">
    <el-input
      placeholder="请输入搜索内容"
      suffix-icon="el-icon-search"
      v-model="filterText">
    </el-input>
    <div class="jdClass-container">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city.roleName" :key="city.id">{{city.roleName}}</el-checkbox>
        </el-checkbox-group>
    </div>
    <div class="form-dialog-control-area">
      <el-button type="default" @click="$parent.handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </div>
  </div>
</template>

<script>
import { comboList } from '@/api/loginv1'
export default {
  props:['roleArr'],
  data() {
    return {
      filterText: '',
      loading:false,
      checkAll: false,
      checkedCities: [],//选中
      cities: [],//过滤角色
      filterCities:[],//模糊过滤的角色
      cityOptions:[],//初始化数据
      isIndeterminate: false,
    };
  },
  watch: {
    //模糊搜索  过滤角色
    filterText(val) {
      
      let filterArr = []//过滤好的角色放在这个数组中
      for(var i = 0; i < this.cityOptions.length; i++) {
        if(this.filterText != '' && this.cityOptions[i].roleName.indexOf(this.filterText) != -1){
          filterArr.push(this.cityOptions[i]);
        }else if(this.filterText == ''){
          filterArr.push(this.cityOptions[i]);
        }
      }
      this.cities = filterArr
      
    }
  },
  methods:{
    handleCheckAllChange(val) {//全选
      let arr = [];
      for(let i in this.cityOptions){
        arr.push(this.cityOptions[i].roleName)
      }
      this.checkedCities = val ?  arr: [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {//单选
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    //提交
    handleSubmit() {
      let checkList = []; 
      //初始化数据
      this.cities = this.cityOptions
      
      this.checkedCities.forEach(item=>{
        this.cities.forEach(ele=>{
          if(item==ele.roleName){
            checkList.push(ele)
          }
        })
      })
      this.$emit('handleClose',checkList)
      this.$parent.handleClose();
    }
  },
  mounted(){
    comboList({}).then(response => {
      if (response.data && response.data.status === 0) {
        const data = response.data.content.list;
        this.cities = data
        this.cityOptions = data

        //记录选中的角色
        let newRoleNameArr=[];
        if(this.roleArr.length != '0'){
          this.isIndeterminate = true;
          this.roleArr.forEach(item=>{
            newRoleNameArr.push(item.roleName)
          })
          this.checkedCities = newRoleNameArr
        }else{
          this.checkedCities = []
        }
        
      }
    })
  }
  
};
</script>

<style scoped>
.jdClass .el-input{
    width: 280px;
    margin-left: -140px;
    left: 50%;
}
.jdClass-container{
  margin: 30px 15px;
}
.jdClass .el-checkbox{
  margin: 5px;
  width: 150px;
}

</style>

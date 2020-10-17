<template>
  <div>
    <el-form ref="form" class="record-box" inline :model="form" :rules="rules" label-width="100px">
      <slot name="header"></slot>
      <el-button type="text" class="more-record">更多通行记录</el-button>
      <div class="table-container">
        <el-row>
          <el-table :data="tableData" stripe :highlight-current-row="true">
            <el-table-column
              prop="aa"
              
               
              min-width="221"
              label="通行时间点">
            </el-table-column>
            <el-table-column
              prop="aa"
               
              
              min-width="221"
              label="通行位置">
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {
  props: ['c_form'],
  created () {
    // console.log('this.c_form',this.c_form)
  },
  data(){
    return {
      form:{
        aa: '',
      },
      rules: {
        aa: [
          {required: true, message: '请选择住户类型', trigger: 'blur'}
        ],
      },
      tableData: [
        {aa: '11'}
      ]
    }
  },
  methods:{
    handleValid(){
      let _valid
      this.$refs.form.validate(valid => {
        _valid = valid
      })
      
      return _valid
    },
    getHouseholdName () {
      let data = {
        roomNodeId: this.$route.query.roomNodeId
      }
      let _this = this
      getHouseholdName(data).then(function (response) {
        if(response.data && response.data.code==1){
          if(response.data.data.householdName){
            _this.householdName = response.data.data.householdName
          }else{
            _this.householdName = ''
          }
        }
      }).catch(function (a) {
        console.error(a)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.record-box{
  position: relative;
}
.more-record{
  position: absolute;
  right: 20px;
  top: 12px;
}
</style>

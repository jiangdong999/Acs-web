<template>
  <div class="jdDoorClass">
    <div class="header">
      <label class="el-icon-arrow-left back" @click="$router.back()">返回</label>
      <span>访客详情</span>
      <span class="time">拜访时间：{{query.visit_time | formatDate}}</span>
      <span class="time">访问地址：{{query.room_full_name}}</span>
    </div>
    <div class="sec" v-if="query.visit_type!='1'">     
      <el-row :gutter="20">
        <el-col :span="12" class="info-box">
          <div class="module-title">
            <mallki class="mallki-text" text="住户信息"></mallki>
          </div>
          <div class="content">
            <div v-loading="loading">
              <el-form inline :model="householdForm" label-width="100px">
                <el-form-item label="姓名">
                  <span class="item">{{householdForm.householdName}}</span>
                </el-form-item><br>
                <el-form-item :label="householdForm.gender">
                  <span class="item" style="margin-right:10px;">{{householdForm.age}}岁</span>
                  <span class="item">{{householdForm.ethnicity}}族</span>                  
                </el-form-item><br>
                <el-form-item label="手机号码">
                  <span class="item">{{householdForm.phone}}</span>
                </el-form-item><br>
                <el-form-item label="身份证号">
                  <span class="item">{{householdForm.citizenId}}</span>
                </el-form-item><br>
                <el-form-item label="出生日期">
                  <span class="item">{{householdForm.birthDate}}</span>
                </el-form-item><br>
                <el-form-item label="户籍地址">
                  <span class="item">{{householdForm.residentialAddress}}</span>
                </el-form-item><br>
                <el-form-item label="签发机构">
                  <span class="item">{{householdForm.authority}}</span>
                </el-form-item><br>
                <el-form-item label="证件期限">
                  <span class="item">{{householdForm.validStartTime | formatDateTimeWithDot }}-{{householdForm.validEndTime | formatDateTimeWithDot }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="info-box">
          <div class="module-title">
            <mallki class="mallki-text" text="访客信息"></mallki>
          </div>
          <div class="content">
            <div v-loading="loading">
              <el-form inline :model="visitorForm" label-width="100px">
                <el-form-item label="姓名">
                  <span class="item">{{visitorForm.visitorName}}</span>
                </el-form-item><br>
                <el-form-item :label="visitorForm.gender">
                  <span class="item" style="margin-right:10px;">{{visitorForm.age}}岁</span>
                  <span class="item">{{householdForm.ethnicity}}族</span>                  
                </el-form-item><br>
                <el-form-item label="手机号码">
                  <span class="item">{{visitorForm.phone}}</span>
                </el-form-item><br>
                <el-form-item label="身份证号">
                  <span class="item">{{visitorForm.citizenId}}</span>
                </el-form-item><br>
                <el-form-item label="出生日期">
                  <span class="item">{{visitorForm.birthDate}}</span>
                </el-form-item><br>
                <el-form-item label="户籍地址">
                  <span class="item">{{visitorForm.residentialAddress}}</span>
                </el-form-item><br>
                <el-form-item label="签发机构">
                  <span class="item">{{visitorForm.authority}}</span>
                </el-form-item><br>
                <el-form-item label="证件期限">
                  <span class="item">{{visitorForm.validDuration}}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-col>        
      </el-row>      
    </div>

    
    <div class="sec" v-else>     
      <el-row>
        <el-col :span="24" class="info-box1"> 
          <div class="module-title">
            <mallki class="mallki-text" text="访客信息"></mallki>
          </div>
          <div class="visi-info">
            <div>
              <el-form inline :model="visitorForm" label-width="100px">
                <el-col :span="12">               
                  <el-form-item label="姓名">
                    <span class="item">{{visitorForm.visitorName}}</span>
                  </el-form-item><br>
                  <el-form-item :label="visitorForm.gender">
                    <span class="item" style="margin-right:10px;">{{visitorForm.age}}岁</span>
                    <span class="item">{{visitorForm.ethnicity}}族</span>                  
                  </el-form-item><br>
                  <el-form-item label="手机号码">
                    <span class="item">{{visitorForm.phone}}</span>
                  </el-form-item><br>
                  <el-form-item label="身份证号">
                    <span class="item">{{visitorForm.citizenId}}</span>
                  </el-form-item><br>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出生日期">
                    <span class="item">{{visitorForm.birthDate}}</span>
                  </el-form-item><br>
                  <el-form-item label="户籍地址">
                    <span class="item">{{visitorForm.residentialAddress}}</span>
                  </el-form-item><br>
                  <el-form-item label="签发机构">
                    <span class="item">{{visitorForm.authority}}</span>
                  </el-form-item><br>
                  <el-form-item label="证件期限">
                    <span class="item">{{visitorForm.validDuration}}</span>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </div>
        </el-col>       
      </el-row>
    </div>
  </div>
</template>
<script>
  import { details } from "@/api/invitation"

export default{
  
  data () {
    return {
      query:{},
      loading: false,
      householdForm: {
        householdName: '',
        gender: '',
        authority: '',
        phone: '',
        citizenId: '',
        birthDate: '',
        residentialAddress: '',
        validDuration: '',
        validStartTime: '',
        validEndTime: '',
        ethnicity: '',
        age: '',
      },
      visitorForm: {
        visitorName: '',
        gender: '',
        authority: '',
        phone: '',
        citizenId: '',
        birthDate: '',
        residentialAddress: '',
        validDuration: '',
        ethnicity: '',
        age: ''
      }
    }
  },
  created () {
    this.query = JSON.parse(localStorage.getItem('query'))
    this.loadData()
  },
  methods: {
    loadData: function () {
      let _this = this
      _this.loading = true
        details({                                 
          communityId: _this.query.community_id,
          id: _this.query.id
        }).then(function (response) {
          _this.loading = false
          if (response.data && response.data.code==1) {  
            let householdInfo = response.data.data.householdInfo
            let visitorInfo = response.data.data.visitorInfo
            if(_this.query.visit_type=='2'){
              if(householdInfo.citizenId.length==18){
                let birth = householdInfo.citizenId.slice(6,14)
                householdInfo.birthDate = birth.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
                let genderCode = householdInfo.citizenId.slice(16,17)
                // console.log('1',genderCode)
                let gender = parseInt(genderCode) % 2 ==0? '女': '男'
                householdInfo.gender = gender
                let date = new Date()
                let age = date.getFullYear()-householdInfo.citizenId.slice(6,10)
                householdInfo.age = age
              } 
            }
            if(visitorInfo.citizenId.length==18){
              let birth = visitorInfo.citizenId.slice(6,14)
              visitorInfo.birthDate = birth.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
              let genderCode = visitorInfo.citizenId.slice(16,17)
                // console.log('2',genderCode)
              let gender = parseInt(genderCode) % 2 ==0? '女': '男'
              visitorInfo.gender = gender
              let date = new Date()
              let age = date.getFullYear()-visitorInfo.citizenId.slice(6,10)
              visitorInfo.age = age
            } 
            _this.householdForm = householdInfo
            _this.visitorForm = visitorInfo
          }
        }).catch(function (a) {
          _this.loading = false
          console.error(a)
        })
    }
  }
}
</script>
<style lang="scss" scope>
.jdDoorClass .header{
  line-height: 70px;
  padding: 0 30px;
  background-color: #fff;
  font-weight: 900;
  cursor: default;
  margin-bottom: 17px;
}
.jdDoorClass .time{
  font-size: 14px;
  font-weight: 400;
  color: #888;
  line-height: 20px;
  margin-left: 10px;
}
.jdDoorClass .sec{
  padding: 17px 20px 0px 20px; 
}
.jdDoorClass .info-box{ 
  div{
    background: #fff;
  }
}
.jdDoorClass .info-box1{ 
  background: #fff;
  div{
    background: #fff;
  }
}
.jdDoorClass .content{
  padding: 0 30px 20px 30px;
  >div{   
    background: #fafafa;
    border: 1px solid #cedada;
    border-radius: 4px;
    padding-top: 7px;
    padding-bottom: 7px;
  }
}
.jdDoorClass .item{
  font-size: 14px;
  font-weight: 400;
  color: #888;
  line-height: 40px;
}
.jdDoorClass .el-form-item.el-form-item--medium{
  margin-bottom: 0px !important;
}
.jdDoorClass .el-form-item__content{
  line-height: 40px !important;
  height: 40px;
  padding-top:5px;
}
.jdDoorClass .el-form-item__label{
  font-size: 15px !important;
  line-height: 40px !important;
}
.jdDoorClass .el-form-item__label{
  width: 88px;
  display: inline-block;
}
.jdDoorClass .visi-info{ 
  padding: 7px 43px 40px 43px;
  >div{
    background: #fafafa;
    border: 1px solid #cedada;
    border-radius: 4pt;
    height: auto;
    overflow:hidden;
  }
}
</style>
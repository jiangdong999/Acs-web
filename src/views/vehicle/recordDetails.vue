<template>
  <section class="container">
    <el-form ref="form" :model="form" label-width="120px" v-loading="loading">
      <div>
        <el-button type="primary" @click="$router.back()">返回</el-button>
      </div>
      <el-row  type="flex" justify="space-around">
        <el-col :span="8">
          <div>
            <div class="form-title-caption">
              <p>车主信息</p>
            </div>
            <el-form-item label="车主姓名" prop="car_owner_name">
              <el-input v-model="form.car_owner_name" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="联系方式" prop="car_owner_phone">
              <el-input v-model="form.car_owner_phone" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="房屋地址" prop="car_owner_address">
              <el-input v-model="form.car_owner_address" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
          </div>
          
          <div>
            <div class="form-title-caption">
              <p>车辆信息</p>
            </div>
            <el-form-item label="车辆号" prop="car_no">
              <el-input v-model="form.car_no" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="车辆型号" prop="car_type">
              <el-input v-model="form.car_type" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="车辆颜色" prop="car_color">
              <el-input v-model="form.car_color" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
          </div>

          <div>
            <div class="form-title-caption">
              <p>车位信息</p>
            </div>
            <el-form-item label="卡类" prop="card_type_name">
              <!-- <el-select v-model="form.openType" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in cardTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <el-input v-model="form.card_type_name" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="开卡时间" prop="card_start_time">
              <el-input v-model="form.car_start_time" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="到期时间" prop="card_end_time">
              <el-input v-model="form.car_end_time" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="小区" prop="community_name">
              <el-input v-model="form.community_name" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="停车场" prop="park_name">
              <el-input v-model="form.park_name" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
            <el-form-item label="停车位" prop="car_space_no">
              <el-input v-model="form.car_space_no" placeholder="请输入" clearable :maxlength="20"/>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <div class="form-title-caption">
              <p>车辆照片</p>
            </div>
            <div class="image-box">
              <span>暂无照片</span>
              <img :src="transformPath(form.car_image)" v-show="form.car_image!=''"/>
            </div>
          </div>
          <div>
            <div class="form-title-caption">
              <p>进出记录</p>
            </div>
            <el-row>
              <el-col :span="12">
                <el-form-item label="进入时间" label-width="80px">
                  <el-date-picker
                    v-model="form.enter_time"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="进入车道" label-width="80px">
                  <el-input v-model="form.enter_road_name" placeholder="请输入" clearable :maxlength="20"/>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="text-align:center">
                <el-button type="text" @click="showImage(form.enter_image)">查看图片</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="离开时间" label-width="80px">
                  <el-date-picker
                    v-model="form.leave_time"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="离开车道" label-width="80px">
                  <el-input v-model="form.leave_road_name" placeholder="请输入" clearable :maxlength="20"/>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="text-align:center">
                <el-button type="text" @click="showImage(form.leave_image)">查看图片</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="停留时长" label-width="80px">
                  <el-input v-model="form.parking_time" placeholder="请输入" clearable :maxlength="20"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <imageView 
      :visible.sync="showModal" 
      :data="itemData">
    </imageView>
  </section>
</template>

<script>

  // import {mask} from 'vue-the-mask'
  // import {cardTypeOptions} from "@/utils/options";
  import imageView from "@/components/imageView/index";
  import {recordDetail} from "@/api/vehicle";

export default {
  components: {
    imageView
  },
  // directives: {
  //   mask
  // },
  data(){
    return {
      loading:false,
      showModal: false,
      cardTypeOptions:[],
      form: {
        "record_id": "1", //id
        "record_guid": "", //guid
        "enter_time": "", //  车牌号
        "leave_time": "", // 卡类型guid
        "community_name": "", //  小区名称
        "car_no": "", //  车类型
        "car_type": "", //  车类型
        "car_color": "", //  车颜色
        "car_owner_name": "", //  车主姓名
        "car_owner_phone": "", //  车主电话
        "card_type_name": "", //  卡类型名称
        "card_start_time": "", // 开卡时间
        "card_end_time": "", //卡到期时间
        "park_name": "", //停车场名称
        "car_space_no": "", //车位号
        "car_owner_address": "", //车主地址
        "car_image": "", //车辆图片
        "leave_image": "", //离开图片
        "enter_image": "", //进入图片
      },
      itemData:{}
    }
  },
  methods:{
    showImage:function(path){
      this.itemData = { imageUrl: 'data:image/png;base64,'+path };
      this.showModal = true;
    },
    loadDetails: function(recordGuid){
      let self = this;
      self.loading = true;
      recordDetail({record_guid: recordGuid}).then(function (response) {
        if (response && response.data) {
          self.form = response.data.data;
          self.loading = false;
        }
      }).catch(function (a) {
        console.error(a)
      })
    },
    transformPath: function(path){
      return 'data:image/png;base64,'+path
    },
  },
  mounted(){
    const recordGuid = this.$route.query.recordGuid;
    if(recordGuid){
      this.loadDetails(recordGuid)
    }else{
      this.$message({
        message: '页面错误',
        type: 'error'
      });
    }
    // this.cardTypeOptions = cardTypeOptions;
  }
}
</script>

<style scoped>
  .container{
    margin: 20px;
    padding: 20px;
  }
  .image-box{
    background-color: #F4F4F4;
    width: 584px;
    height: 330px;
    margin-bottom: 10px;
    border-radius: 4px;
    border:  1px solid #d7d7d7;
    display: inline-block;
    position: relative;
  }
  .image-box span{
    font-size: 24px;
    color: #aaaaaa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .image-box img{
    width: 100%;
    height: 100%;
    object-position: 50%;
    position: relative;
    z-index: 10;
  }
</style>

<template>
  <div class="result-box">
    <!-- <div class="total">共3条查询结果</div> -->
    <div class="result-list">
      <div class="item-box">
        <img v-if="rowData.status==1" class="right" src="../../../../assets/icon/blue-right.png">
        <img v-if="rowData.status==1" class="left" src="../../../../assets/icon/blue-left.png">
        <img v-if="rowData.status==0" class="right" src="../../../../assets/icon/red-right.png">
        <img v-if="rowData.status==0" class="left" src="../../../../assets/icon/red-left.png">
        <div class="info">
          <span>{{rowData.householdName}}</span>
          <span>{{rowData.phone}}</span>
        </div>
        <div class="face-box">          
          <div class="face take-face">
            <span class="back-cover">拍摄人物</span>
            <el-image
              :src="rowData.operator"
              fit="scale-down"
              class="pic-col"
              :preview-src-list="[rowData.operator]"
              :z-index="2001"
              >
              <div slot="error" class="image-slot">
                <span class="img-err pic-col"></span>
              </div>
            </el-image>
          </div>
          <div class="score" :class="{'red-score':rowData.status==0}">
            <span>相似度</span><br>
            <span>{{rowData.ext?parseInt(JSON.parse(rowData.ext).score):'--'}}分</span>
          </div>
          <div class="face household-face">
            <span class="back-cover">住户人脸</span>
            <el-image
              :src="rowData.faceUrl"
              fit="scale-down"
              class="pic-col"
              :preview-src-list="[rowData.faceUrl]"
              :z-index="2001"
              >
              <div slot="error" class="image-slot">
                <span class="img-err pic-col"></span>
              </div>
            </el-image>
          </div>
        </div>
      </div>
      <div class="form-dialog-control-area">
        <el-button @click="$parent.handleClose()">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  props: ['rowData'],
  created () {
    // console.log('rowData',this.rowData)
  },
}
</script>
<style lang="scss" scoped>
  .result-box{
    padding: 0 10px;
  }
  .total{
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    margin-bottom: 15px;
  }
  .item-box{
    position: relative;
    width: 342px;
    height: 155px;
    background: #f2f2f2;
    border-radius: 8px;
    padding: 0 22px 20px 22px;
    margin-bottom: 10px;
  }
  .right{
    display: inline-block;
    width: 48px;
    height: 48px;
    position: absolute;
    top: 30px;
    left: 140px;
  }
  .left{
    display: inline-block;
    width: 48px;
    height: 48px;
    position: absolute;
    bottom: 10px;
    left: 140px;
  }
  .info{
    padding-top: 11px;
    padding-bottom: 9px;
    span:nth-of-type(1){
      display: inline-block;
      height: 20px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      line-height: 20px;
    }
    span:nth-of-type(2){
      display: inline-block;
      height: 20px;
      font-size: 12px;
      font-weight: 400;
      color: #aaaaaa;
      line-height: 20px;
    }
    
  }
  .red-score{
    span:nth-of-type(2){
      color: #FF6565 !important;
    }     
  }
  .face-box{
    overflow: hidden;   
  }
  .face{
    width: 95px;
    height: 95px;
    position: relative;
  }
  .take-face{
    float: left;
  }
  .score{
    float: left;
    padding: 27px 0;
    span:nth-of-type(1){
      padding-left: 32px;
      padding-right: 32px;
      font-size: 14px;
      font-weight: 400;
      color: #999;
      line-height: 20px;
    }
    span:nth-of-type(2){
      padding-left: 32px;
      padding-right: 32px;
      font-size: 20px;
      font-weight: 600;
      text-align: center;
      color: #0085e6;
      line-height: 20px;
      
    }
  }
  .household-face{
    float: right;
  }
  .pic-col{
    width: 95px !important;
    height: 95px !important;
    border-radius: 4px;
  }
  .back-cover{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 19px;
    opacity: 0.3;
    background: #000;
    border-radius: 0px 0px 4px 4px;
    z-index: 2000;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: #fff;
    line-height: 18px;
  }
</style>
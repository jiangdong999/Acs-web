export const configLinkage = {
  _switchBtn(type,value) { //开关判断封装
    const that = this
    // console.log(value);
    if (value === 0) {
      // console.log('关');
      that[type] = true;
    } else {
      // console.log('开');
      that[type] = false;
    }
  },
  cameraOpenBtn(value) {
    //摄像头配置联动
    this._switchBtn('cameraOpenFlag',value)
  },
  lightOpenBtn(value) {
    //补光灯配置联动
    this._switchBtn('lightOpenFlag',value)
  },
  soundOpenBtn(value) {
    //音量配置联动
    this._switchBtn('soundOpenFlag',value)
  },
  faceOpenBtn(value) {
    // console.log(value);
    //人脸配置联动
    const that = this;
    if (value === 2) {
      // console.log("关");
      that.faceOpenFlag = true;
    } else {
      // console.log("开");
      that.faceOpenFlag = false;
    }
  },
  dayNightOpenBtn(value) {
    //白天黑夜自动配置联动
    this._switchBtn('dayNightOpenFlag',value)
  },
  temTestOpenBtn(value) {
    //是否走测温配置联动
    this._switchBtn('temTestOpenFlag',value)
    // console.log(value,this.temTestOpenFlag);
  },
  JKBstateOpenBtn(value) {
    //健康宝状态配置联动
    this._switchBtn('JKBstateOpenFlag',value)
    // console.log(value,this.JKBstateOpenFlag);
  },
  fourAndOneOpenBtn(value){
    this._switchBtn('fourAndOneOpenFlag',value)
  },
  fourAndOneOpenFlag: true,
  cameraOpenFlag: true,
  lightOpenFlag: true,
  soundOpenFlag: true,
  faceOpenFlag: true,
  dayNightOpenFlag: true,
  temTestOpenFlag: true,
  JKBstateOpenFlag: true
}


export const switchOption = [ //开关
  { value: 1, label: '开' },
  { value: 0, label: '关' },
]
export const uploadVedioOption = [ //通行记录视频是否上传
  { value: 1, label: '上传' },
  { value: 0, label: '不上传' },
]
export const cameraMethodOption = [ //录像策略
  { value: 1, label: '持续触发' },
  { value: 0, label: '事件触发' },
]
export const onlineOption = [ //在线状态
  { value: 0, label: '离线' },
  { value: 1, label: '在线' },
]
export const deviceTypeOption = [ //设备型号
  { value: 'RAC100A', label: 'RAC100A' },
  { value: 'RAC100B', label: 'RAC100B' },
  { value: 'RAC110B', label: 'RAC110B' },
  { value: 'RAC120L', label: 'RAC120L' },
  { value: 'RAC120S', label: 'RAC120S' },
  { value: 'TPS980P', label: 'TPS980P' },
]
export const cameraTypeOption = [ //摄像头类型
  { value: 0, label: '原生' },
  { value: 1, label: '红外' },
  { value: 2, label: '原生+红外' },
  { value: 3, label: '宽动态' },
]
export const cameraAngleOption = [ //人脸识别摄像头角度
  { value: 0, label: '0°' },
  { value: 90, label: '90°' },
  { value: 180, label: '180°' },
  { value: 270, label: '270°' },
]

export const faceTypeOption = [ //刷脸方式
  { value: 1, label: 'FacePass脱机' },
  { value: 2, label: '百度脱机' },
  { value: 3, label: '分布式脱机' },
]


export const liftOption = [ //睿视摄像头升降固件
  { value: 0, label: '降/未升级' },
  { value: 1, label: '升' },
]

export const restartOption = [ //重启策略
  { value: 0, label: '不重启' },
  { value: 1, label: '每天' },
  { value: 2, label: '每周' },
]
export const dayOption = [ //定期重启日期
  { value: 1, label: '星期一' },
  { value: 2, label: '星期二' },
  { value: 3, label: '星期三' },
  { value: 4, label: '星期四' },
  { value: 5, label: '星期五' },
  { value: 6, label: '星期六' },
  { value: 7, label: '星期日' },
]


export const openTypeOption = [ //开门类型
  { value: 1, label: '刷脸开门' },
  { value: 2, label: '刷卡开门' },
  { value: 3, label: '二维码开门' },
  { value: 4, label: '身份证开门' },
  { value: 5, label: '远程开门' },
  { value: 6, label: '访客密码' }
]
export const directionOption = [ //进出方向
  { value: 0, label: '进' },
  { value: 1, label: '出' },
]

export const cardTypeOption = [ //卡类型
  { value: 1, label: 'IC卡' },
  { value: 2, label: 'ID卡' },
  { value: 3, label: '身份证' },
]

export const alarmTypeOption = [ //告警类型
  { value: 1, label: '硬件' },
  { value: 2, label: 'SDK' },
  { value: 3, label: '自定义' },
]
export const pushResultOption = [ //录入结果
  { value: 1, label: '推送中' },
  { value: 2, label: '推送成功' },
  { value: 3, label: '推送失败' },
]

export const logoOption = [ //logo设置
  { value: '0', label: '不显示' },
  { value: '1', label: '默认' },
  { value: '2', label: '自定义' },
]

export const projectOption = [ //项目类型
  { value: 0, label: '签到通用项目' },
  { value: 1, label: '医院流调表项目' },
  { value: 2, label: '医院医保卡项目' },
  { value: 3, label: '首都图书馆项目' },
  { value: 4, label: '新发地岳各庄项目' }
]

export const projectBJOption = [ //项目背景图
  { value: '0', label: '不显示' },
  { value: '1', label: '默认' },
  { value: '2', label: '自定义' },
]

export const checkHealthApp = [ //健康宝查询方式
  { value: 2, label: '睿家' },
  { value: 1, label: '西城项目' },
]

export const temperatureGate = [ //体温异常是否开门
  { value: 1, label: '是' },
  { value: 0, label: '否' },
]

export const imgUpload = [ //图片上传方式
  { value: 0, label: '异步上传' },
  { value: 1, label: '同步上传' },
]

export const healthAppGate = [ //健康宝可开门权限
  { value: 0, label: '绿码' },
  { value: 1, label: '绿码 未掌握' },
  { value: 2, label: '绿码 黄码 未掌握' },
  { value: 3, label: '不做限制' },
]
export const whiteListOption = [ //非白名单是否允许测温
  { value: 1, label: '是' },
  { value: 0, label: '否' },
]

export const JKBDataOption = [ //JKB数据本地有效时长
  { value: 1, label: '1天' },
  { value: 2, label: '2天' },
  { value: 3, label: '3天' },
  { value: 4, label: '4天' },
  { value: 5, label: '5天' },
  { value: 6, label: '6天' },
  { value: 7, label: '7天' }
]
export const pstnVendorOptino = [ //pstn供应商
  { value: "RJ-PSTN-P200", label: '通道P200' },
  { value: "RJ-PSTN-P300", label: '通道P300' }
]
export const fourAndOneOption = [//“四合一”检测模式
  { value: 1, label: '开' },
  { value: 0, label: '关' },
  
]
export const violenceDoorOption = [ //暴力开门处理开关	
  { value: 1, label: '处理' },
  { value: 0, label: '不处理' }
]
export const QRcodeOption = [  //二维码动态下发
  { value: '0', label: '不显示' },
  { value: '1', label: '健康宝二维码' },
  { value: '2', label: '自定义' }
]
export const witnessescontrastOption = [  //人证比对
  { value: 1, label: '开' },	
  { value: 0, label: '关' }
]
export const signInOpenDoorOption = [   //签到成功是否开门	
  { value: 1, label: '是' },
  { value: 0, label: '否' }
]


export const hardwareCheck = {
  '开门时长': 101,
  '蓝牙开关': 102,
  '红外感光开关': 103,
  '继电器反转开关': 104,
  // '卡号读取反序': 105,
  '断网状态锁常开开关': 106,
  '门磁超时时长': 107,
  '看门狗功能': 108,
  // '防复制卡开关': 109
}
export const cameraCheck = {
  // '摄像头类型': 201,
  // '人脸识别摄像头角度': 202,
  '通行记录视频': 203,
  // '录像时长': 204,
  '持续录像功能开关': 205,
  '录像音频开关': 206,
  '录像策略(防拆/开门/输入/人脸/人体传感器)': 207,
  '录像开门视频时长配置': 208,
  '录像功能开关': 209
}
export const lightCheck = {
  '补光灯开关': 301,
  '补光灯打开阈值': 302,
  '补光灯关闭阈值': 303,
  '补光灯定时开关时间': 305,
  '屏幕延迟变暗时间': 306,
  '屏幕延迟熄灭时间': 307,
  '屏幕亮度自动调节': 308,
  '屏幕白天亮度': 309,
  '屏幕夜间亮度': 310,
  // '呼吸灯工作开关': 311,
}
export const soundCheck = {
  '媒体音量开关': 401,
  '白天媒体音量': 402,
  '白天通话音量': 403,
  '白天语音音量': 404,
  '白天按键音量': 405,
  '夜晚媒体音量': 406,
  '夜晚通话音量': 407,
  '夜晚语音音量': 408,
  '夜晚按键音量': 409,
}

export const faceCheck = {
  '刷脸方式': 501,
  'FacePass SDK识别阈值': 502,
  'FacePass 识别阈值': 503,
  'Facepass 活体阈值': 504,
  'FacePass 最小人脸尺寸': 505,
  'FacePass 人脸模糊度阈值': 506,
  '百度 活体阈值': 508,
  '百度 识别阈值': 509
}

export const otherCheck = {
  'CPU高温阈值': 601,
  '流量告警阈值': 602,
  '预留最小剩余空间': 603,
  '门常开告警时间': 604,
  '白天黑夜判断(自动)': 605,
  '白天起始时间(手动)': 606,
  '白天结束时间(手动)': 607,
  '重启策略': 608,
  '定时重启时间': 609,
  '设备ADB开关': 610,
  'OTA升级是否设置门常开': 611,
  '是否走测温流程': 700,
  '是否上报开关开门记录': 701,
  '是否上报开门记录图片': 704,
  'logo设置': 705,
  '是否检查健康状态': 706,
  '是否检查健康调查问卷': 707,
  '项目类型': 708,
  '项目背景图': 709,
  '体温异常是否可以开门':710,
  '健康宝开门权限':711,
  '图片是否同步上传':712,
  '健康宝查询方式':713,
  "非白名单是否允许测温":714,
  "JKB数据本地有效时长":715,  
  "pstn供应商":716,
  "暴力开门处理开关":717,
  "二维码动态下发":718,
  "人证比对":719,
  "签到成功是否开门":720,
  "“四合一”检测模式":994,
  '应用自更新': 995,
}

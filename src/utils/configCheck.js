

// 只能输入0~86400整数
export function validateNum(rule, value, callback) {
    if(value>86400){
      callback(new Error('请输入0~86400以内的整数'))
    } else {
      callback();
    }
}
/**
 * 常用校验正则
 * carPlate:           车牌
 * phone:              移动电话
 * familyPhone:        座机、家庭电话
 * email:              邮箱
 * postCode:           邮编
 * thousand：          只能输入0~999整数
 * ten:                只能输入0~10整数
 * twofivefive:        只能输入0~255整数
 * hundred:            只能输入0~100整数
 * zeroAndMore:        0或大于0
 * zeromore:           大于0
 */
export const regExp = {
  carPlate: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
  phone: /(^1[34578]\d{9}$)|(^(00852)?\-?\d{8}$)/,
  famliyPhone: /^(0\d{2,3}\-)?\d{7,8}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  postCode: /^[0-9]{6}$/,
  thousand: /^[1-9]\d{0,2}$/,
  ten: /^([0-9]|10)$/,
  zeromore: /^\+?[1-9]\d*$/,
  zeroAndMore: /^\+?[0-9]\d*$/,
  twofivefive: /^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
  hundred: /^(?:0|[1-9][0-9]?|100)$/,
  hundredPointTwo: /^(\d{1,2}(\.\d{1,2})?|100)$/,
}


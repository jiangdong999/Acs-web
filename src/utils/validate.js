/**
 * Created by jiachenpan on 16/11/18.
 */
import dateUtil from "./times";

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function beforePickerOptions(targetTime) {
  return {
    disabledDate: (time) => {
      return targetTime ? time.getTime() > targetTime : false;
    }
  }
}
// 不可选择当日之前日期
export function beforePickerOptions2(targetTime) {
  return {
    disabledDate: time => {
      return (
        time.getTime() < Date.now() - 86400000 ||
        (targetTime ? time.getTime() > targetTime : false)
      );
    }
  };
}
// 不可选择当日之后的日期
export function beforePickerOptions3(targetTime) {
  // let target = dateUtil.toClientDate(targetTime)
  // target = dateUtil.toTimestamp(target)
  return {
    disabledDate: time => {
      
      return (
        time.getTime() > Date.now() ||
        (targetTime ? time.getTime() > targetTime : false)
      );
    }
  };
}

export function afterPickerOptions(targetTime) {
  return {
    disabledDate: time => {      
      return time.getTime() < targetTime;
    }
  };
}

// 不可选择当日之前日期
export function afterPickerOptions2(targetTime) {
  // let target = dateUtil.toClientDate(targetTime)
  // target = dateUtil.toTimestamp(target)
  return {
    disabledDate: time => {    
      return time.getTime() < Date.now() - 86400000 ||
        (time.getTime() < targetTime);
    }
  };
}

// 最近一个月的日期
export function oneMonthAgoPickerOptions() {
  return {
    disabledDate: time => {
      return (time.getTime() > dateUtil.toClientDate(dateUtil.byPattern(new Date(), 'YYYYMMDD235959999')).getTime()) || 
      (time.getTime() < (Date.now() - 30 * 86400000))
    }
  };
}
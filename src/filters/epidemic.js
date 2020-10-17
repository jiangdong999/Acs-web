export function transCheckResult(type) { 
  switch (type) {
    case '1':
      return "成功";
    case '0':
      return "失败";
  }
}
export function transCheckType(type) { 
  switch (type) {
    case '1':
      return "身份证核查";
    case '2':
      return "门禁卡号核查";
    case '3':
      return "人脸识别核查";
  }
}

export function transPersonnelType(type) { 
  switch (type) {
    case '1':
      return "返程隔离";
    case '2':
      return "密接隔离";
  }
}
export function transHealthColor(type) { 
  switch (type) {
    case '0':
      return "未见异常";
    case '1':
      return "居家观察";
    case '2':
      return "无法确认";
    case '3':
      return "集中观察";
    case '4':
      return "尚未掌握";
  }
}


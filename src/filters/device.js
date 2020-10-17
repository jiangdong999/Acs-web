export function transStatus(type) {
  switch (type) {
    case '0':
      return "离线";
    case '1':
      return "在线";
    default:
      return "未知";
  }
}

export function transUpdateStatus(type) {
  switch (type) {
    case '0':
      return "不能升级";
    case '1':
      return "可以升级";
    case '2':
      return "升级中";
    default:
      return "未知";
  }
}


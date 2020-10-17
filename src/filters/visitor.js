export function transVisitType(type) {
  switch (type) {
    case '1':
      return "访客登记";
    case '2':
      return "住户邀请";
  }
}
export function transHealthState(type) {
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
    case '5':
      return "尚未掌握";
  }
}
export function jkbStatus(type) {
  switch (type) {
    case 0:
      return "未见异常";
    case 1:
      return "居家观察";
    case 2:
      return "集中观察";
    case -1:
      return "尚未掌握";
    case -3:
      return "尚未掌握";
    case -99:
      return "";
    default:
      return "";
  }
}

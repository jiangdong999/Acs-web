export function transRoomCardStatus(status) {
  switch (status) {
    case '0':
      return "注销";
    case '1':
      return "正常";
    case '2':
      return "停用";
    case '3':
      return "启用";
    default:
      return ""
  }
}
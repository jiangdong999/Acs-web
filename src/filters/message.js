export function transStatus(type) { 
  switch (type) {
    case 2:
      return "未审核";
    case 3:
      return "审核通过";
    case 4:
      return "拒绝通过";
    default:
      return "其他";
  }
}

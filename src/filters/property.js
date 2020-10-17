export function transAccountType(type) {
  switch (type) {
    case '1':
      return "正式";
    case '2':
      return "演示";
    case '3':
      return "其他";
    default:
      return "其他";
  }
}

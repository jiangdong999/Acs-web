export function transBuildingUse(type) {
  switch (type) {
    case 1:
      return "住宅";
    case 2:
      return "企事业单位";
    case 3:
      return "学校";
    case 4:
      return "商场";
    case 5:
      return "MSD";
    case 6:
      return "CBD";
    case 7:
      return "政府机关";
    case 8:
      return "科研单位";
    case 9:
      return "其他";
    default:
      return "其他";
  }
}

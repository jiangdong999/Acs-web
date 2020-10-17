export function transRoomProperty(type) {
  switch (type) {
    case 1:
      return "商品房";
    case 2:
      return "经适房";
    case 3:
      return "房改房";
    case 4:
      return "其他";
    default:
      return ""
  }
}

export function transRoomUseStatus(type) {
  switch (type) {
    case 1:
      return "空置";
    case 2:
      return "自住";
    case 3:
      return "租住";
    case 4:
      return "借住";
    case 5:
      return "未办理";
    default:
      return ""
  }
}

export function transRoomUse(type) {
  switch (type) {
    case 1:
      return "住宅";
    case 2:
      return "工业";
    case 3:
      return "商业";
    case 4:
      return "仓库";
    case 5:
      return "办公";
    case 6:
      return "商住混用";
    case 7:
      return "其他";
    default:
      return ""
  }
}


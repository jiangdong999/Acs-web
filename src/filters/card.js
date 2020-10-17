export function transCardStatus(type) {
  switch (type) {
    case '0':
      return "删除";
    case '1':
      return "正常";
    case '2':
      return "过期";
    case '3':
      return "挂失";
    case '5':
      return "复制卡";
    case '6':
      return "禁用";
    default:
      return "其他";
  }
}

export function cardTypeStatus(type) {
  switch (type) {
    case '1':
      return "IC卡";
    case '3':
      return "ID卡";
    case '2':
      return "身份证";
    default:
      return "其他";
  }
}

export function inOrOutStatus(type) {
  switch (type) {
    case '2':
      return "进/出";
    case '0':
      return "进";
    case '1':
      return "出";
    default:
      return "进/出";
  }
}


export function leaseStatus(type) {
  switch (type) {
    case 1:
      return "正常";
    case 4:
      return "过期";
    default:
      return "";
  }
}



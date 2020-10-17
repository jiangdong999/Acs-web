export function transWirelessType(type) {
    switch (type) {
      case 0:
        return "LoRaWan";
      case 1:
        return "电信 NB-IOT";
      case 2:
        return "移动 NB-IOT";
      case 3:
        return "联通 NB-IOT";
      default:
        return ""
    }
  }

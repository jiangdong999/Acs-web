export function transMessageType(status) {
  switch (status) {
    case '1':
      return "普通短信";
    case '2':
      return "语音短信";
    default:
      return ""
  }
}
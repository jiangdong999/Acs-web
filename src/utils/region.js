const regionMap = new Map();

export function gettingRegion(provinceCode) {
  let villageList = regionMap.get(provinceCode);
  if (villageList == null || villageList === 'undefined') {
    villageList = require("@/assets/json/villages-" + provinceCode + ".json");
    regionMap.set(provinceCode, villageList);
  }
  return villageList;
}

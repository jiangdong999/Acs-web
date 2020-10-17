import request from '@/utils/server'

export function addImportNode(data) {
  return request({
    url: '/node/v1/create/excel',
    method: 'post',
    data: data
  })
}
    
export function addImportNodeError(data) {
  return request({
    url: '/node/v1/create/excel/err',
    method: 'post',
    data: data
  })
}
    
//添加卡
export function addHouseholdCard(data) {
  return request({
    url: '/control/household/v1/card/add',
    method: 'post',
    data: data
  })
}
//添加脸
export function householdFaceUpload(data) {
  return request({
    // url: '/control/household/v1/face/add',
    url: '/control/face/v1/check/face',
    method: 'post',
    data: data
  })
}

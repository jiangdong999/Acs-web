import request from '@/utils/server'

//人脸列表
export function faceList(query) {
  return request({
    url: '/control/household/v1/face/list',
    method: 'post',
    data: query
  })
}

//新增人脸
export function addFace(query) {
  return request({
    url: '/control/household/v1/face/add',
    method: 'post',
    data: query
  })
}

//删除人脸
export function delFace(query) {
  return request({
    url: '/control/household/v1/face/remove',
    method: 'post',
    data: query
  })
}

//修改人脸
export function modifyFace(query) {
  return request({
    url: '/control/household/v1/face/update',
    method: 'post',
    data: query
  })
}

//查询人脸数量
export function loadSetting(query) {
  return request({
    url: '/community/v1/load/setting',
    method: 'post',
    data: query
  })
}
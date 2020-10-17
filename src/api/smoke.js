import request from '@/utils/request'

//烟感设备列表
export function fetchList(query) {
  return request({
    url: '/api/v1/wireless/list',
    method: 'post',
    data: query
  })
}
//设备状态
export function getStatusList(query) {
  return request({
    url: '/api/v1/wireless/stat',
    method: 'post',
    data: query
  })
}

//新增烟感设备
export function addDevice(query) {
  return request({
    url: '/api/v1/wireless/add',
    method: 'post',
    data: query
  })
}

//事件状态
export function getEventList(query) {
  return request({
    url: '/api/v1/wireless/event',
    method: 'post',
    data: query
  })
}

//删除设备
export function delDevice(query) {
  return request({
    url: '/api/v1/wireless/del',
    method: 'post',
    data: query
  })
}

//警情记录
export function fetchAlarmRecord(query) {
  return request({
    url: '/api/v1/wireless/alarm/list',
    method: 'post',
    data: query
  })
}
//编辑设备
export function modifyDevice(query) {
  return request({
    url: '/api/v1/wireless/modify',
    method: 'post',
    data: query
  })
}





import request from '@/utils/request'

//配置列表查询
export function configList(query) {
  return request({
    url: '/api/v1/setting/door/config/list',
    method: 'post',
    data: query
  })
}
//通用配置删除
export function delConfig(query) {
  return request({
    url: '/api/v1/setting/door/config/del',
    method: 'post',
    data: query
  })
}
//该配置已选设备列表
export function distributed(query) {
  return request({
    url: '/api/v1/setting/door/config/distributed',
    method: 'post',
    data: query
  })
}
//该配置待选设备列表
export function undistributed(query) {
  return request({
    url: '/api/v1/setting/door/config/undistributed',
    method: 'post',
    data: query
  })
}

//分配设备
export function configAddDev(query) {
  return request({
    url: '/api/v1/setting/door/config/assign',
    method: 'post',
    data: query
  })
}
//删除设备
export function configDel(query) {
  return request({
    url: '/api/v1/setting/door/config/assign/del',
    method: 'post',
    data: query
  })
}

//新增、复制配置
export function addConfig(query) {
  return request({
    url: '/api/v1/setting/door/config/add',
    method: 'post',
    data: query
  })
}
//编辑配置
export function editConfig(query) {
  return request({
    url: '/api/v1/setting/door/config/modify',
    method: 'post',
    data: query
  })
}
//配置详情
export function configDetails(query) {
  return request({
    url: '/api/v1/setting/door/config/detail',
    method: 'post',
    data: query
  })
}

//根据型号获取默认配置
export function getDefaultConfig(query) {
  return request({
    url: '/api/v1/setting/get/default',
    method: 'post',
    data: query
  })
}
import request from '@/utils/server'
//住户列表
export function fetchList(query) {
  return request({
    url: '/control/household/v1/list',
    // url: '/api/household/v1/list',
    method: 'post',
    data: query
  })
}
//添加住户
export function addHousehold(data) {
  return request({
    url: '/control/household/v1/add',
    // url: '/api/household/v1/add',
    method: 'post',
    data: data
  })
}
//住户详情
export function detailHousehold(query) {
  return request({
    url: '/control/household/v1/detail',
    // url: '/api/household/v1/detail',
    method: 'post',
    data: query
  })
}
//删除住户
export function delHousehold(data) {
  return request({
    url: '/control/household/v1/remove',
    // url: '/api/household/v1/remove',
    method: 'post',
    data: data
  })
}
//租户续期
export function renewedHousehold(data) {
  return request({
    url: '/control/household/v1/renewed',
    // url: '/api/household/v1/renewed',
    method: 'post',
    data: data
  })
}
//编辑住户
export function modifyHousehold(query) {
  return request({
    url: '/control/household/v1/update',
    method: 'post',
    data: query
  })
}
//人员转移其他房间
export function modifyHouseholdRoom(data) {
  return request({
    url: '/control/household/v1/transfer',
    method: 'post',
    data: data
  })
}

//新增人员至其他房间
export function addOtherRoom(data) {
  return request({
    url: '/control/household/v1/addOtherRoom',
    method: 'post',
    data: data
  })
}
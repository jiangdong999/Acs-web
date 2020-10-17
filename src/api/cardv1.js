import request from '@/utils/server'
//卡列表
export function fetchList(query) {
  return request({
    url: '/control/household/v1/card/list',
    method: 'post',
    data: query
  })
}
//删除卡
export function delCard(data) {
  return request({
    url: '/control/household/v1/card/remove',
    method: 'post',
    data: data
  })
}
//开启卡
export function enableCard(query) {
  return request({
    url: '/control/household/v1/card/enable',
    method: 'post',
    data: query
  })
}
//禁用卡
export function freezeCard(query) {
  return request({
    url: '/control/household/v1/card/disable',
    method: 'post',
    data: query
  })
}
//修改卡
export function modifyDetail(query) {
  return request({
    url: '/control/household/v1/card/update',
    method: 'post',
    data: query
  })
}

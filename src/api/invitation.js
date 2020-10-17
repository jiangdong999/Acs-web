import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/visit/log/list',
    method: 'post',
    data: query
  })
}
export function fetchStatistic(query) {
  return request({
    url: '/api/v1/visit/log/statistics',
    method: 'post',
    data: query
  })
}
export function details(query) {
  return request({
    url: '/api/v1/visit/log/detail',
    method: 'post',
    data: query
  })
}

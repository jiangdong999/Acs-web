import request from '@/utils/request'

export function fetchSnapList(query) {
  return request({
    url: '/api/v1/snap/list',
    method: 'post',
    data: query
  })
}
export function fetchSnapIncr(query) {
  return request({
    url: '/api/v1/snap/incr',
    method: 'post',
    data: query
  })
}
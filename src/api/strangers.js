import request from '@/utils/request'

export function fetchRemainList(query) {
  return request({
    url: '/api/v1/stranger/picture/remain',
    method: 'post',
    data: query
  })
}
export function strangerCount(query) {
  return request({
    url: '/api/v1/stranger/count',
    method: 'post',
    data: query
  })
}
export function fetchStrangerList(query) {
  return request({
    url: '/api/v1/stranger/picture',
    method: 'post',
    data: query
  })
}
export function fetchWhiteList(query) {
  return request({
    url: '/api/v1/stranger/picture/white',
    method: 'post',
    data: query
  })
}
export function fetchStrangerOutList(query) {
  return request({
    url: '/api/v1/stranger/picture/out',
    method: 'post',
    data: query
  })
}
export function fetchStrangerInList(query) {
  return request({
    url: '/api/v1/stranger/picture/in',
    method: 'post',
    data: query
  })
}

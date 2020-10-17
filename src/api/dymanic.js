import request from '@/utils/request'

export function dynamicPicture(query) {
  return request({
    url: '/api/v1/dynamic/picture',
    method: 'post',
    data: query
  })
}
export function dynamicDevice(query) {
  return request({
    url: '/api/v1/dynamic/device',
    method: 'post',
    data: query
  })
}
export function dynamicCount(query) {
  return request({
    url: '/api/v1/dynamic/count',
    method: 'post',
    data: query
  })
}
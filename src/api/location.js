import request from '@/utils/request'

export function getLocation(query) {
  return request({
    url: '/api/v1/community/location',
    method: 'post',
    data: query
  })
}

export function getLocationDetail(query) {
  return request({
    url: '/api/v1/community/locationDetail',
    method: 'post',
    data: query
  })
}
import request from '@/utils/server'

export function getLocation(query) {
  return request({
    url: '/location/v1/retrieve',
    method: 'post',
    data: query
  })
}

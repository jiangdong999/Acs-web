import request from '@/utils/request'

export function fetchOpening(query) {
  return request({
    url: '/api/v2/record/opening',
    method: 'post',
    data: query
  })
}
export function openingCount(query) {
  return request({
    url: '/api/v2/record/opening/count',
    method: 'post',
    data: query
  })
}

export function fetchVisiting(query) {
  return request({
    url: '/api/v1/record/visiting',
    method: 'post',
    data: query
  })
}

export function openExport(query) {
  return request({
    url: '/api/v1/record/opening/log/export',
    method: 'post',
    data: query
  })
}

export function visitExport(query) {
  return request({
    url: '/api/v1/record/visiting/log/export',
    method: 'post',
    data: query
  })
}

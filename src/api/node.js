import request from '@/utils/request'

export function dropdownNodeTree(query) {
  return request({
    url: '/api/v1/node/dropdown',
    method: 'get',
    params: query
  })
}

export function dropdownNodeComplex(query) {
  return request({
    url: '/api/v1/node/dropdownNode',
    method: 'get',
    params: query
  })
}

export function dropdownAllNode(query) {
  return request({
    url: '/api/v1/node/dropdownAllNode',
    method: 'post',
    data: query
  })
}
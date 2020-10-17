import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/property/list',
    method: 'post',
    data: query
  })
}

export function generateAccount() {
  return request({
    url: '/api/v1/property/generate',
    method: 'get'
  })
}

export function dropdownList() {
  return request({
    url: '/api/v1/property/dropdown',
    method: 'get'
  })
}


export function saveProperty(data) {
  return request({
    url: '/api/v1/property/add',
    method: 'post',
    data: data
  })
}

export function delProperty(data) {
  return request({
    url: '/api/v1/property/del',
    method: 'post',
    data: data
  })
}

export function modifyProperty(data) {
  return request({
    url: '/api/v1/property/modify',
    method: 'post',
    data: data
  })
}

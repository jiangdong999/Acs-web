import request from '@/utils/request'

export function modifyDetail(query) {
  return request({
    url: '/api/v1/card/modify/detail',
    method: 'post',
    data: query
  })
}

export function fetchList(query) {
  return request({
    url: '/api/v1/card/list',
    method: 'post',
    data: query
  })
}

export function saveCard(data) {
  return request({
    url: '/api/v1/card/add',
    method: 'post',
    data: data
  })
}

export function delCard(data) {
  return request({
    url: '/api/v1/card/del',
    method: 'post',
    data: data
  })
}

export function modifyCard(data) {
  return request({
    url: '/api/v1/card/modify',
    method: 'post',
    data: data
  })
}

export function detailCard(data) {
  return request({
    url: '/api/v1/card/detail',
    method: 'post',
    data: data
  })
}

export function enableCard(query) {
  return request({
    url: '/api/v1/card/readd',
    method: 'post',
    data: query
  })
}
export function freezeCard(query) {
  return request({
    url: '/api/v1/card/freeze',
    method: 'post',
    data: query
  })
}

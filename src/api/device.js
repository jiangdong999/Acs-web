import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/device/list',
    method: 'post',
    data: query
  })
}

export function saveDevice(data) {
  return request({
    url: '/api/v1/device/add',
    method: 'post',
    data: data
  })
}

export function delDevice(data) {
  return request({
    url: '/api/v1/device/del',
    method: 'post',
    data: data
  })
}

export function detailDevice(query) {
  return request({
    url: '/api/v1/device/detail',
    method: 'post',
    data: query
  })
}

export function modifyDevice(data) {
  return request({
    url: '/api/v1/device/modify',
    method: 'post',
    data: data
  })
}

export function upDevice(data) {
  return request({
    url: '/api/v1/device/ota/upgrade',
    method: 'post',
    data: data
  })
}

export function getPassWord(data) {
  return request({
    url: '/api/v1/device/password/load',
    method: 'post',
    data: data
  })
}

export function editPassWord(data) {
  return request({
    url: '/api/v1/device/password/modify',
    method: 'post',
    data: data
  })
}

export function fetchListV2(query) {
  return request({
    url: '/api/v2/device/list',
    method: 'post',
    data: query
  })
}

export function fetchDataCount(query) {
  return request({
    url: '/api/v2/device/dataCount',
    method: 'post',
    data: query
  })
}

export function syncDevice(data) {
  return request({
    url: '/api/v2/device/sync',
    method: 'post',
    data: data
  })
}

export function replaceDevice(data) {
  return request({
    url: '/api/v2/device/replace',
    method: 'post',
    data: data
  })
}

export function openDoor(data) {
  return request({
    url: '/api/v2/device/open',
    method: 'post',
    data: data
  })
}

export function restartDevice(data) {
  return request({
    url: '/api/v2/device/restart',
    method: 'post',
    data: data
  })
}

export function restartApp(data) {
  return request({
    url: '/api/v2/device/app/restart',
    method: 'post',
    data: data
  })
}

export function maintainDevice(data) {
  return request({
    url: '/api/v2/device/maintain',
    method: 'post',
    data: data
  })
}
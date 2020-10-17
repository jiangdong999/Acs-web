import request from '@/utils/request'

export function fetchClient(query) {
  return request({
    url: '/api/v1/notice/client',
    method: 'post',
    data: query
  })
}

export function fetchDevice(query) {
  return request({
    url: '/api/v1/notice/device',
    method: 'post',
    data: query
  })
}

export function addClientNotice(query) {
  return request({
    url: '/api/v1/notice/addClient',
    method: 'post',
    data: query
  })
}

export function addDeviceNotice(query) {
  return request({
    url: '/api/v1/notice/addDevice',
    method: 'post',
    data: query
  })
}

export function delNotice(query) {
  return request({
    url: '/api/v1/notice/del',
    method: 'post',
    data: query
  })
}

export function getNotice(query) {
  return request({
    url: '/api/v1/notice/detail',
    method: 'post',
    data: query
  })
}

export function upload(query) {
  return request({
    url: '/api/v1/pic/upload',
    method: 'post',
    data: query
  })
}

export function normalNoticeList(query) {
  return request({
    url: '/api/v1/notice/normalNoticeList',
    method: 'post',
    data: query
  })
}
export function addNormalNotice(query) {
  return request({
    url: '/api/v1/notice/addNormalNotice',
    method: 'post',
    data: query
  })
}
export function delNormalNotice(query) {
  return request({
    url: '/api/v1/notice/delNormalNotice',
    method: 'post',
    data: query
  })
}

export function getSystemNotice(query) {
  return request({
    url: '/api/v1/system/announcement/detail',
    method: 'post',
    data: query
  })
}
export function hiddenSystemNotice(query) {
  return request({
    url: '/api/v1/system/announcement/not/display',
    method: 'post',
    data: query
  })
}

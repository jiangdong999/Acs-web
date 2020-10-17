import request from '@/utils/request'

export function logList(query) {
  return request({
    url: '/api/v1/check/log/list',
    method: 'POST',
    data: query
  })
}

export function logList2(query) {
  return request({
    url: '/api/v1/check/log/list2',
    method: 'POST',
    data: query
  })
}


export function batchUpdate(query) {
  return request({
    url: '/api/v1/check/log/batch/update',
    method: 'POST',
    data: query
  })
}


export function accountInfo(query) {
  return request({
    url: '/api/v1/device/account/info',
    method: 'POST',
    data: query
  })
}

export function logCount(query) {
  return request({
    url: '/api/v1/check/log/count',
    method: 'POST',
    data: query
  })
}

export function accountAdd(query) {
  return request({
    url: '/api/v1/device/account/add',
    method: 'POST',
    data: query
  })
}

export function accountAdd2(query) {
  return request({
    url: '/api/v1/device/account/add2',
    method: 'POST',
    data: query
  })
}

export function logModify(query) {
  return request({
    url: '/api/v1/check/log/modify',
    method: 'POST',
    data: query
  })
}

export function logDelete(query) {
  return request({
    url: '/api/v1/check/log/delete',
    method: 'POST',
    data: query
  })
}

export function logAdd(query) {
  return request({
    url: '/api/v1/check/log/add',
    method: 'POST',
    data: query
  })
}

export function excelExport(query) {
  return request({
    url: '/api/v1/check/log/excel/export',
    method: 'POST',
    data: query
  })
}

export function accountUnbind(query) {
  return request({
    url: '/api/v1/device/account/unbind',
    method: 'POST',
    data: query
  })
}

export function accountLocation(query) {
  return request({
    url: '/api/v1/device/account/location',
    method: 'POST',
    data: query
  })
}

export function logCountTotal(query) {
  return request({
    url: '/api/v1/check/log/countTotal',
    method: 'POST',
    data: query
  })
}

export function logCountEach(query) {
  return request({
    url: '/api/v1/check/log/countEach',
    method: 'POST',
    data: query
  })
}

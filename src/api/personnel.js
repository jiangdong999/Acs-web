import request from '@/utils/request'

export function fetchWorkerList(query) {
  return request({
    url: '/api/v1/household/worker/list',
    method: 'post',
    data: query
  })
}

export function detailWorker(query) {
  return request({
    url: '/api/v1/household/worker/detail',
    method: 'post',
    data: query
  })
}
export function _detailWorker(query) {
  return request({
    url: '/api/v1/household/worker/to/edit',
    method: 'post',
    data: query
  })
}
export function modifyWorker(query) {
  return request({
    url: '/api/v1/household/worker/modify',
    method: 'post',
    data: query
  })
}
export function saveWorker(data) {
  return request({
    url: '/api/v1/household/worker/add',
    method: 'post',
    data: data
  })
}
export function delWorker(data) {
  return request({
    url: '/api/v1/household/worker/del',
    method: 'post',
    data: data
  })
}

export function fetchOpening(data) {
  return request({
    url: '/api/v1/record/personnel/opening',
    method: 'post',
    data: data
  })
}
export function fetchCardList(data) {
  return request({
    url: '/api/v1/card/personnel/list',
    method: 'post',
    data: data
  })
}

export function householdFaceUpload(data) {
  return request({
    url: '/api/v1/pic/image/upload',
    method: 'post',
    data: data
  })
}
export function householdFaceAdd(data) {
  return request({
    url: '/api/v1/household/face/add',
    method: 'post',
    data: data
  })
}
export function householdFaceRemove(data) {
  return request({
    url: '/api/v1/household/face/remove',
    method: 'post',
    data: data
  })
}

export function workerFaceAdd(data) {
  return request({
    url: '/api/v1/household/worker/face/add',
    method: 'post',
    data: data
  })
}
export function workerFaceRemove(data) {
  return request({
    url: '/api/v1/household/worker/face/remove',
    method: 'post',
    data: data
  })
}

export function roomList(data) {
  return request({
    url: '/api/v2/household/roomlist',
    method: 'post',
    data: data
  })
}
export function changePstnStatus(data) {
  return request({
    url: '/api/v2/household/changePstnStatus',
    method: 'post',
    data: data
  })
}
export function changeAppStatus(data) {
  return request({
    url: '/api/v2/household/changeAppStatus',
    method: 'post',
    data: data
  })
}

export function EditLease(data) {
  return request({
    url: '/api/v2/household/modifyLease',
    method: 'post',
    data: data
  })
}

export function addHouseholdCard(data) {
  return request({
    url: '/api/v2/household/addHouseholdCard',
    method: 'post',
    data: data
  })
}

export function addImportNode(data) {
  return request({
    url: '/api/v1/excel/import/node',
    method: 'post',
    data: data
  })
}

export function addImportNodeError(data) {
  return request({
    url: '/api/v1/excel/import/node/error',
    method: 'post',
    data: data
  })
}

export function addHouseholds(data) {
  return request({
    url: '/api/v1/household/adds',
    method: 'post',
    data: data
  })
}
//工作人员 续期
export function renewed(data) {
  return request({
    url: '/api/v1/household/renewed',
    method: 'post',
    data: data
  })
}

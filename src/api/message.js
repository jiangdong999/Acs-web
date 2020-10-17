import request from '@/utils/request'

export function fetchAlarm(query) {
  return request({
    url: '/api/v1/message/alarm',
    method: 'post',
    data: query
  })
}

// export function fetchAuthorize(query) {
//   return request({
//     url: '/api/v1/message/authorize',
//     method: 'post',
//     data: query
//   })
// }
export function fetchAuthorize(query) {
  return request({
    url: '/api/v2/message/authorize',
    method: 'post',
    data: query
  })
}
// export function getAuthorize(query) {
//   return request({
//     url: '/api/v1/message/authorize/detail',
//     method: 'post',
//     data: query
//   })
// }
export function getAuthorize(query) {
  return request({
    url: '/api/v2/message/authorize/detail',
    method: 'post',
    data: query
  })
}

// export function modifyAuthorize(query) {
//   return request({
//     url: '/api/v1/message/authorize/modify',
//     method: 'post',
//     data: query
//   })
// }
export function checkAuthorize(query) {
  return request({
    url: '/api/v2/message/authorize/check',
    method: 'post',
    data: query
  })
}

export function audit(query) {
  return request({
    url: '/api/v1/message/audit',
    method: 'post',
    data: query
  })
}

export function fetchDoorAlarm(query) {
  return request({
    url: '/api/v1/alarm/list',
    method: 'post',
    data: query
  })
}

export function modifyLeaseTime(query) {
  return request({
    url: '/api/v2/message/authorize/update/lease',
    method: 'post',
    data: query
  })
}
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/houseCard/list',
    method: 'post',
    data: query
  })
}

export function householdList(query) {
  return request({
    url: '/api/v1/houseCard/load/room/household',
    method: 'post',
    data: query
  })
}

export function setHouseCard(query) {
  return request({
    url: '/api/v1/houseCard/set',
    method: 'post',
    data: query
  })
}

export function addRoomCard(query) {
  return request({
    url: '/api/v1/houseCard/add',
    method: 'post',
    data: query
  })
}

export function delHousehold(query) {
  return request({
    url: '/api/v1/houseCard/unlink/room/household',
    method: 'post',
    data: query
  })
}
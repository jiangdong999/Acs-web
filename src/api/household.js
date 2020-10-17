import request from '@/utils/request'
import axios from 'axios'

export function fetchList(query) {
  return request({
    url: '/api/v1/household/list',
    method: 'post',
    data: query
  })
}
export function fetchFamilyList(query, that) {
  return request({
    url: '/api/v2/household/list',
    method: 'post',
    data: query,
    cancelToken: new axios.CancelToken(function executor(c) { // 设置 cancel token
      that.source = c;
    })
  })
}

export function detailHousehold(query) {
  return request({
    url: '/api/v1/household/detail',
    method: 'post',
    data: query
  })
}
export function _detailHousehold(query) {
  return request({
    url: '/api/v1/household/to/edit',
    method: 'post',
    data: query
  })
}

export function modifyHousehold(query) {
  return request({
    url: '/api/v2/household/modify',
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


export function saveHousehold(data) {
  return request({
    url: '/api/v2/household/add',
    method: 'post',
    data: data
  })
}

export function delHousehold(data) {
  return request({
    url: '/api/v1/household/del',
    method: 'post',
    data: data
  })
}

export function delAllHousehold(data) {
  return request({
    url: '/api/v2/household/delAll',
    method: 'post',
    data: data
  })
}

export function parseCitizenCard(data) {
  return request({
    url: '/api/v2/household/parseCitizenCard',
    method: 'post',
    data: data
  })
}

export function addHousehold(data) {
  return request({
    url: '/api/v2/household/add3',
    method: 'post',
    data: data
  })
}

export function renewedHousehold(data) {
  return request({
    url: '/api/v1/household/renewed',
    method: 'post',
    data: data
  })
}

export function otherRooms(data) {
  return request({
    url: '/api/v2/household/otherRooms',
    method: 'post',
    data: data
  })
}
export function addOtherRoom(data) {
  return request({
    url: '/api/v2/household/addOtherRoom',
    method: 'post',
    data: data
  })
}
export function modifyHouseholdRoom(data) {
  return request({
    url: '/api/v2/household/modifyHouseholdRoom',
    method: 'post',
    data: data
  })
}

export function getHouseholdName(data) {
  return request({
    url: '/api/v2/household/roomHouseholdDetail',
    method: 'post',
    data: data
  })
}
export function addReturnReport(data) {
  return request({
    url: '/api/v2/household/add/returnRegistration',
    method: 'post',
    data: data
  })
}

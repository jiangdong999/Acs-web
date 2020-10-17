import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/community/list',
    method: 'post',
    data: query
  })
}
export function loadList(query) {
  return request({
    url: '/api/v1/community/deployList',
    method: 'post',
    data: query
  })
}

export function generateAccount() {
  return request({
    url: '/api/v1/community/generate',
    method: 'get'
  })
}

export function dropdownCommunity(data) {
  return request({
    url: '/api/v1/community/dropdown',
    method: 'get',
    params: data
  })
}
export function getCommunity(data) {
  return request({
    url: '/api/v1/community/communityName',
    method: 'post',
    params: data
  })
}

export function saveCommunity(data) {
  return request({
    url: '/api/v1/community/add',
    method: 'post',
    data: data
  })
}

export function modifyCommunity(data) {
  return request({
    url: '/api/v1/community/modify',
    method: 'post',
    data: data
  })
}

export function delCommunity(data) {
  return request({
    url: '/api/v1/community/del',
    method: 'post',
    data: data
  })
}

export function modifySetting(data) {
  return request({
    url: '/api/v1/community/settings/authority/modify',
    method: 'post',
    data: data
  })
}

export function cardSetting(data) {
  return request({
    url: '/api/v1/community/settings/card/modify',
    method: 'post',
    data: data
  })
}

export function queryCommunity(data) {
  return request({
    url: '/api/v1/community/queryCommunity',
    method: 'post',
    data: data
  })
}

export function modifyDeploy(data) {
  return request({
    url: '/api/v1/community/modifyDeploy',
    method: 'post',
    data: data
  })
}

export function modifyAppConfiguration(data) {
  return request({
    url: '/api/v1/community/modifyAppConfiguration',
    method: 'post',
    data: data
  })
}

export function modifyBrushFace(data) {
  return request({
    url: '/api/v1/community/modifyBrushFace',
    method: 'post',
    data: data
  })
}

export function querySystemSetting(data) {
  return request({
    url: '/api/v1/community/querySystemSetting',
    method: 'post',
    data: data
  })
}

export function fetchUserList(data) {
  return request({
    url: '/api/v1/communityUser/list',
    method: 'post',
    data: data
  })
}
export function fetchRoleList(data) {
  return request({
    url: '/api/v1/communityUser/communityRoleList',
    method: 'post',
    data: data
  })
}
export function deleteUser(data) {
  return request({
    url: '/api/v1/communityUser/delete',
    method: 'post',
    data: data
  })
}
export function createUser(data) {
  return request({
    url: '/api/v1/communityUser/create',
    method: 'post',
    data: data
  })
}
export function updateUser(data) {
  return request({
    url: '/api/v1/communityUser/update',
    method: 'post',
    data: data
  })
}
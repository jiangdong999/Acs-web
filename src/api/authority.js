import request from '@/utils/request'

export function fetchTopOrgList(query) {
  return request({
    url: '/api/v1/user/list',
    method: 'POST',
    data: query
  })
}
export function deleteTopOrg(query) {
  return request({
    url: '/api/v1/user/delete',
    method: 'POST',
    data: query
  })
}
export function createTopOrg(query) {
  return request({
    url: '/api/v1/topOrg/create',
    method: 'POST',
    data: query
  })
}
export function createOrg(query) {
  return request({
    url: '/api/v1/org/create',
    method: 'POST',
    data: query
  })
}
export function loadTopOrg(query) {
  return request({
    url: '/api/v1/topOrg/detail',
    method: 'POST',
    data: query
  })
}
export function fetchListWithOrg(query) {
  return request({
    url: '/api/v1/user/listWithOrg',
    method: 'POST',
    data: query
  })
}
export function updateTopOrg(query) {
  return request({
    url: '/api/v1/topOrg/update',
    method: 'POST',
    data: query
  })
}
export function updateOrg(query) {
  return request({
    url: '/api/v1/org/update',
    method: 'POST',
    data: query
  })
}
export function deleteOrg(query) {
  return request({
    url: '/api/v1/org/delete',
    method: 'POST',
    data: query
  })
}

export function loadTopOrgTree(query) {
  return request({
    url: '/api/v1/topOrg/tree',
    method: 'POST',
    data: query
  })
}

export function fetchRoleList(query) {
  return request({
    url: '/api/v1/role/list',
    method: 'POST',
    data: query
  })
}
export function fetchRoleComboList(query) {
  return request({
    url: '/api/v1/role/comboList',
    method: 'POST',
    data: query
  })
}

export function creatRole(query) {
  return request({
    url: '/api/v1/role/create',
    method: 'POST',
    data: query
  })
}
export function updateRole(query) {
  return request({
    url: '/api/v1/role/update',
    method: 'POST',
    data: query
  })
}
export function deleteRole(query) {
  return request({
    url: '/api/v1/role/delete',
    method: 'POST',
    data: query
  })
}
export function roleDetails(query) {
  return request({
    url: '/api/v1/role/detail',
    method: 'POST',
    data: query
  })
}

export function fetchOperatorList(query) {
  return request({
    url: '/api/v1/user/list',
    method: 'POST',
    data: query
  })
}
export function createOperator(query) {
  return request({
    url: '/api/v1/user/create',
    method: 'POST',
    data: query
  })
}
export function operatorDetails(query) {
  return request({
    url: '/api/v1/user/detail',
    method: 'POST',
    data: query
  })
}
export function updateOperator(query) {
  return request({
    url: '/api/v1/user/update',
    method: 'POST',
    data: query
  })
}
export function deleteOperator(query) {
  return request({
    url: '/api/v1/user/delete',
    method: 'POST',
    data: query
  })
}

export function getCommunitis(query) {
  return request({
    url: '/api/v1/topOrg/communities',
    method: 'POST',
    data: query
  })
}
export function getOperatorCommunitis(query) {
  return request({
    url: '/api/v1/user/communities',
    method: 'POST',
    data: query
  })
}

export function resetPassword(query) {
  return request({
    url: '/api/v1/user/resetPassword',
    method: 'POST',
    data: query
  })
}

export function isOrgCodeExist(query) {
  return request({
    url: '/api/v1/topOrg/isOrgCodeExist',
    method: 'POST',
    data: query
  })
}
export function isAccountExist(query) {
  return request({
    url: '/api/v1/user/isAccountExist',
    method: 'POST',
    data: query
  })
}
export function isPhoneExist(query) {
  return request({
    url: '/api/v1/user/isPhoneExist',
    method: 'POST',
    data: query
  })
}

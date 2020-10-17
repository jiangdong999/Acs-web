import request from '@/utils/request'

export function loginByUsername(username, password, loginType) {
  let data = {
    username:username + '',
    password:password + '',
    loginType
  };
  return request({
    url: '/login',
    method: 'post',
    data:data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {

  return request({
    url: '/api/v2/user/info',
    method: 'post',
  })
}

export function getPermission(token) {

  return request({
    url: '/api/v1/permission/tree',
    method: 'post'
  })
}

export function sendCode(data) {

  return request({
    url: '/send/verify/code',
    method: 'post',
    data: data
  })
}

export function zoningCode(data) {

  return request({
    url: '/api/v1/community/communityName/zoningCode',
    method: 'post',
    data: data
  })
}

export function userDetail(data) {

  return request({
    url: '/api/v1/user/detail',
    method: 'post',
    data: data
  })
}


export function comboList(data) {

  return request({
    url: '/api/v1/role/comboList',
    method: 'post',
    data: data
  })
}

export function userAdd(data) {

  return request({
    url: '/api/v1/user/create',
    method: 'post',
    data: data
  })
}

export function userUpdate(data) {

  return request({
    url: '/api/v1/user/update',
    method: 'post',
    data: data
  })
}

export function permissionTree(data) {

  return request({
    url: '/api/v1/permission/tree',
    method: 'post',
    data: data
  })
}

export function communityZoningCodes(data) {

  return request({
    url: '/api/v1/community/communityName/zoningCodes',
    method: 'post',
    data: data
  })
}

export function registPhone(data){
  return request({
    url: '/api/v2/user/modify/phone',
    method: 'post',
    data: data
  })
}

export function areaTree(data) {
  return request({
    url: '/api/v1/community/area/tree',
    method: 'post',
    data: data
  })
}

import request from '@/utils/server'

export function userAdd(data) {
  return request({
    url: '/mgauth/v1/user/create',
    method: 'post',
    data: data
  })
}


export function userUpdate(data) {
  return request({
    url: '/mgauth/v1/user/update',
    method: 'post',
    data: data
  })
}

export function userDetail(data) {
    return request({
      url: '/mgauth/v1/user/detail',
      method: 'post',
      data: data
    })
  }
  
export function sendCode(data) {

  return request({
    url: '/account/sms/code',
    method: 'post',
    data: data
  })
}

export function loginByUsername(data) {
  
  return request({
    url: '/auth/login/sms',
    method: 'post',
    data:data
  })
}

export function getPermission() {
  return request({
    url: '/mgauth/v1/permission/tree',
    method: 'post'
  })
}

export function comboList(data) {
  return request({
    url: '/mgauth/v1/role/list/all',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function loginByPassword(data) {
  
  return request({
    url: '/auth/login',
    method: 'post',
    data:data
  })
}
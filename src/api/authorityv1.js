import request from '@/utils/server'


//角色列表模块
export function fetchRoleList(query) { //获取角色列表
  return request({
    url: '/mgauth/v1/role/list',
    method: 'POST',
    data: query
  })
}

export function roleDetails(query) { //获取角色编辑详情
  return request({
    url: '/mgauth/v1/role/detail',
    method: 'POST',
    data: query
  })
}

export function updateRole(query) { //更新角色编辑详情
  return request({
    url: '/mgauth/v1/role/update',
    method: 'POST',
    data: query
  })
}

export function deleteRole(query) { //删除角色
  return request({
    url: '/mgauth/v1/role/delete',
    method: 'POST',
    data: query
  })
}

export function creatRole(query) { //新增角色
  return request({
    url: '/mgauth/v1/role/create',
    method: 'POST',
    data: query
  })
}


//帐号列表模块
export function fetchTopOrgList(query) { //获取帐号列表
  return request({
    url: '/mgauth/v1/user/list',
    method: 'POST',
    data: query
  })
}

export function deleteTopOrg(query) {  //删除帐号
  return request({
    url: '/mgauth/v1/user/delete',
    method: 'POST',
    data: query
  })
}


import request from '@/utils/server'

export function buildingList(query) {  //获取节点列表
  return request({
    url: '/node/v1/community/list/simple',
    method: 'post',
    data: query
  })
}

export function addBatchRoom(query) {  //批量新增节点
  return request({
    url: '/node/v1/create/batch',
    method: 'post',
    data: query
  })
}

export function addNode(query) {  //新增房间节点
  return request({
    url: '/node/v1/create/room',
    method: 'post',
    data: query
  })
}

export function delNode(query) {  //删除节点
  return request({
    url: '/node/v1/delete',
    method: 'post',
    data: query
  })
}

export function multiRoomModify(query) {  //修改房间名字
  return request({
    url: '/node/v1/update',
    method: 'post',
    data: query
  })
} 

export function floorList(query) {  //搜索栋单元子节点树
  return request({
    url: '/node/v1/node/units',
    method: 'post',
    data: query
  })
}

export function loadNode(query) {  //获取节点信息
  return request({
    url: '/node/v1/retrieve',
    method: 'post',
    data: query
  })
}
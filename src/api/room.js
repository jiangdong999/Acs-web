import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/v1/room/list',
    method: 'post',
    data: query
  })
}

export function saveRoom(query) {
  return request({
    url: '/api/v1/room/add',
    method: 'post',
    data: query
  })
}

export function delRoom(query) {
  return request({
    url: '/api/v1/room/del',
    method: 'post',
    data: query
  })
}

export function modifyRoom(query) {
  return request({
    url: '/api/v1/room/modify',
    method: 'post',
    data: query
  })
}

export function exportTemplate(query) {
  return request({
    url: 'api/v1/room/template/export',
    method: 'post',
    data: query
  })
}

// 旧版excel模板提交接口
export function addRooms(query) {
  return request({
    url: 'api/v1/room/addMulti',
    method: 'post',
    data: query
  })
}
//新版批量新增
export function multiRoomAdd(query) {
  return request({
    url: '/api/v1/room/multiRoomAdd',
    method: 'post',
    data: query
  })
}
export function addNode(query) {
  return request({
    url: '/api/v1/room/addNode',
    method: 'post',
    data: query
  })
}
export function multiRoomModify(query) {
  return request({
    url: '/api/v1/room/multiRoomModify',
    method: 'post',
    data: query
  })
}
export function delNode(query) {
  return request({
    url: '/api/v1/room/delNode',
    method: 'post',
    data: query
  })
}
// 可视化
export function specialRoomList(query) {
  return request({
    url: '/api/v1/room/specialRoomList',
    method: 'post',
    data: query
  })
}
export function buildingList(query) {
  return request({
    url: '/api/v1/room/buildingList',
    method: 'post',
    data: query
  })
}
export function floorList(query) {
  return request({
    url: '/api/v1/room/floorList',
    method: 'post',
    data: query
  })
}
export function existHouseholdList(query) {
  return request({
    url: '/api/v1/room/existHouseholdList',
    method: 'post',
    data: query
  })
} 
export function loadNode(query) {
  return request({
    url: '/api/v1/room/loadNode',
    method: 'post',
    data: query
  })
}
export function loadRoom(query) {
  return request({
    url: '/api/v1/room/roomDetail',
    method: 'post',
    data: query
  })
}

export function addBatchNewRoom(query) {
  return request({
    url: '/api/v2/room/addBatchNewRoom',
    method: 'post',
    data: query
  })
}
export function addBatchRoom(query) {
  return request({
    url: '/api/v2/room/addBatchRoom',
    method: 'post',
    data: query
  })
}

export function addManagementSetting(query) {
  return request({
    url: '/api/v2/room/addManagementSetting',
    method: 'post',
    data: query
  })
}
export function managementDetail(query) {
  return request({
    url: '/api/v2/room/managementDetail',
    method: 'post',
    data: query
  })
}

export function loadBuildCount(query) {
  return request({
    url: '/api/v1/room/building/count',
    method: 'post',
    data: query
  })
}
export function loadCommunityCount(query) {
  return request({
    url: '/api/v1/room/community/count',
    method: 'post',
    data: query
  })
}

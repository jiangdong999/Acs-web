import request from '@/utils/request'

//报修列表
export function fetchList(query) {
  return request({
    url: '/api/v1/repair/list',
    method: 'post',
    data: query
  })
}

//报修状态数据
export function repairCount(query) {
  return request({
    url: '/api/v1/repair/data/count',
    method: 'post',
    data: query
  })
}

//报修详情
export function repairDetails(query) {
  return request({
    url: '/api/v1/repair/detail',
    method: 'post',
    data: query
  })
}

//工单派发
export function repairAssign(query) {
  return request({
    url: '/api/v1/repair/assign',
    method: 'post',
    data: query
  })
}

//工作人员下拉
export function fetchWorkerList(query) {
  return request({
    url: '/api/v1/household/worker/list',
    method: 'post',
    data: query
  })
}

//填写报告
export function report(query) {
  return request({
    url: '/api/v1/repair/handle',
    method: 'post',
    data: query
  })
}
//填写报告 上传图片
export function uploadFile(query) {
  return request({
    url: '/api/v1/pic/super/upload',
    method: 'post',
    data: query
  })
}

//管理员接收报修消息
export function receiveInfo(query) {
  return request({
    url: '/api/v1/repair/receive',
    method: 'post',
    data: query
  })
}


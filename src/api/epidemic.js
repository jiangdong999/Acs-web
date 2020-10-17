import request from '@/utils/request'
import axios from 'axios'

export function fetchList(query) {
  return request({
    url: '/api/v1/household/list',
    method: 'post',
    data: query
  })
}
export function checkList(query) {
  return request({
    url: '/api/v2/record/check',
    method: 'post',
    data: query
  })
}

export function checkStatistic(query) {
  return request({
    url: '/api/v2/record/check/statistics',
    method: 'post',
    data: query
  })
}

export function fetchHealthData(query) {
  return request({
    url: '/api/v1/room/health/data',
    method: 'post',
    data: query
  })
}

export function fetchReturnPerson(query) {
  return request({
    url: '/api/v1/room/count/return',
    method: 'post',
    data: query
  })
}

//监控告警的表格数据
export function monitorTable(query) {
  return request({
    url: '/api/v1/monitor/alarm/list',
    method: 'post',
    data: query
  })
}
//监控告警统计项
export function monitorStatistic(query) {
  return request({
    url: '/api/v1/monitor/alarm/statistics',
    method: 'post',
    data: query
  })
}

//智能预警的表格数据
export function intelligentTable(query) {
  return request({
    // url: 'http://10.8.1.106:9000/api/v1/intelligent/warn/list',
    url: '/api/v1/intelligent/warn/list',
    method: 'post',
    data: query
  })
}
//智能预警的预警规则获取
export function intelligentruleone(query) {
  return request({
    url: '/api/v1/intelligent/warn/rule/one',
    method: 'post',
    data: query
  })
}
//智能预警的预警规则保存
export function intelligentrulesave(query) {
  return request({
    url: '/api/v1/intelligent/warn/rule/save',
    method: 'post',
    data: query
  })
}
//智能预警数量
export function intelligentcount(query) {
  return request({
    url: '/api/v1/intelligent/warn/statistics',
    method: 'post',
    data: query
  })
}


export function devidePersonList(query) {
  return request({
    url: '/api/v2/household/returnRegistration/list',
    method: 'post',
    data: query
  })
}

export function devidePersonStatistic(query) {
  return request({
    url: '/api/v2/household/returnRegistration/statistics',
    method: 'post',
    data: query
  })
}
export function devideReport(query) {
  return request({
    url: '/api/v2/household/add/returnRegistration',
    method: 'post',
    data: query
  })
}

export function cancelDevide(query) {
  return request({
    url: '/api/v2/household/epidemic/cancel',
    method: 'post',
    data: query
  })
}
//健康宝记录
export function healthList(query) {
  return request({
    url: '/api/v1/jkb/list',
    method: 'post',
    data: query
  })
}
export function healthStatusData(query) {
  return request({
    url: '/api/v1/jkb/color/count/list',
    method: 'post',
    data: query
  })
}

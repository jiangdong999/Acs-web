import request from '@/utils/request'

export function fetchParkingList(query) {
  return request({
    url: '/api/v1/parking/car/list',
    method: 'post',
    data: query
  })
}
export function parkingDetail(query) {
  return request({
    url: '/api/v1/parking/car/detail',
    method: 'post',
    data: query
  })
}

export function fetchRecordList(query) {
  return request({
    url: '/api/v1/parking/record/list',
    method: 'post',
    data: query
  })
}
export function recordDetail(query) {
  return request({
    url: '/api/v1/parking/record/detail',
    method: 'post',
    data: query
  })
}

export function parkList(query) {
  return request({
    url: '/api/v1/parking/park/list',
    method: 'post',
    data: query
  })
}

export function parkingStatistics(query) {
  return request({
    url: '/api/v1/parking/record/statistics',
    method: 'post',
    data: query
  })
}
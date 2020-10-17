import request from '@/utils/request'

export function fetchFacecardList(query) {
  return request({
    url: '/api/v1/facecard/list',
    method: 'post',
    data: query
  })
}
export function fetchFacecardList2(query) {
  return request({
    url: '/api/v1/facecard/list2',
    method: 'post',
    data: query
  })
}
export function loadDetails(query) {
  return request({
    url: '/api/v1/facecard/detail',
    method: 'post',
    data: query
  })
}
export function fetchImageList(query) {
  return request({
    url: '/api/v1/facecard/imageList',
    method: 'post',
    data: query
  })
}
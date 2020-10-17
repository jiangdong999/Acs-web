import request from '@/utils/request'

export function deviceTypeList(query) {
  return request({
    url: '/api/v1/dictionary/list',
    method: 'post',
    data: query
  })
}
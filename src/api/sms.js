import request from '@/utils/request'

export function fetchSmsList(query) {
  return request({
    url: '/api/v1/sms/record/list',
    method: 'post',
    data: query
  })
}
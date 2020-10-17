import request from '@/utils/server'

export function dropdownNodeComplex(query) {
    return request({
      url: '/node/v1/community/list/simple',
      method: 'post',
      data: query
    })
  }
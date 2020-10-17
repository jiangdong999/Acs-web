import request from '@/utils/server'


export function saveCommunity(data) {  //添加小区
  return request({
    url: '/control/community/v1/add',
    method: 'post',
    data
  })
}

export function fetchList(query) {   //获取小区列表
    return request({
      url: '/community/v1/list',
      method: 'post',
      data: query
    })
}

export function modifyCommunity(data) { //修改小区信息
    return request({
      url: '/community/v1/update',
      method: 'post',
      data: data
    })
  }

  export function getCommunityv1(data) {  //获取小区名称
    return request({
      url: '/community/v1/name',
      method: 'post',
      params: data
    })
  }
  
  export function delCommunity(data) {  //删除小区
    return request({
      url: '/community/v1/delete',
      method: 'post',
      data: data
    })
  }
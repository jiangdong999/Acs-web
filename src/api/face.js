import request from '@/utils/request'
import axios from 'axios'

//人脸列表
export function faceList(query) {
  return request({
    url: '/api/v2/household/load/face',
    method: 'post',
    data: query
  })
}
//修改人脸
export function modifyFace(query) {
  return request({
    url: '/api/v2/household/modify/face',
    method: 'post',
    data: query
  })
}
//删除人脸
export function delFace(query) {
  return request({
    url: '/api/v2/household/del/face',
    method: 'post',
    data: query
  })
}
//新增人脸
export function addFace(query) {
  return request({
    url: '/api/v2/household/add/face',
    method: 'post',
    data: query
  })
}

//设为默认头像
export function setProfile(query) {
  return request({
    url: '/api/v2/household/set/default/face',
    method: 'post',
    data: query
  })
}

//人脸同步状态
export function getFaceStatus(query) {
  return request({
    url: '/api/v2/household/face/push/status',
    method: 'post',
    data: query
  })
}




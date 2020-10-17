import request from '@/utils/server'

export function deviceControl(data) { //设备控制 6=远程开门，7=重启设备，8=重启应用，9=设备ota升级，10=设备应用升级
  return request({
    url: '/device/v1/control',
    method: 'post',
    data
  })
}

export function saveDevice(data) {
  return request({
    url: '/control/device/v1/add',
    method: 'post',
    data
  })
}

export function delDevice(data) {
  return request({
    url: '/control/device/v1/delete',
    method: 'post',
    data
  })
}

export function replaceDevice(data) {
  return request({
    url: '/control/device/v1/replace',
    method: 'post',
    data
  })
}


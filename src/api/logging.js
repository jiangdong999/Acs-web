import request from '@/utils/request'

export function exportLog(data) {
    return request({
        url: '/api/v1/actionlog/export',
        method: 'post',
        data: data
    })
}

export function listLog(data) {
    return request({
        url: '/api/v1/actionlog/list',
        method: 'post',
        data: data
    })
}
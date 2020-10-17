import request from '@/utils/request'

export function fetchBlacklist(query) {
    return request({
        url: '/api/v1/blacklist/list',
        method: 'post',
        data: query
    })
}
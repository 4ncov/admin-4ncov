import request from '@/utils/request'

export function list(page, size, userId, status) {
  return request({
    url: `/required-materials/all?userId=${userId || ''}&status=${status || ''}&page=${page}&size=${size}`,
    method: 'get'
  })
}

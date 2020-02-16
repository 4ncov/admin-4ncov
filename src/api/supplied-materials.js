import request from '@/utils/request'

export function list(page, size, userId, status) {
  return request({
    url: `/supplied-materials/all?userId=${userId}&status=${status}&page=${page}&size=${size}`,
    method: 'get'
  })
}

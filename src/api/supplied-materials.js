import request from '@/utils/request'

export function list(userId, status) {
  return request({
    url: `/supplied-materials/all?userId=${userId}&status=${status}`,
    method: 'get'
  })
}

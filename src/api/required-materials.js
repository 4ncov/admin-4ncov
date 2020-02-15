import request from '@/utils/request'

export function list(userId, status) {
  return request({
    url: `/required-materials/all?userId=${userId}&status=${status}`,
    method: 'get'
  })
}

import request from '@/utils/request'

export function list() {
  return request({
    url: '/material-categories',
    method: 'get'
  })
}

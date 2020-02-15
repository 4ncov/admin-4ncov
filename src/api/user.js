import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/sign-in',
    method: 'post',
    data
  })
}

export function list(status) {
  return request({
    url: `/users?status=${status}`,
    method: 'get'
  })
}

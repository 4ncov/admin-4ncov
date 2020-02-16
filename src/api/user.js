import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/sign-in',
    method: 'post',
    data
  })
}

export function list(page, size) {
  return request({
    url: `/users/all?page=${page}&size=${size}`,
    method: 'get'
  })
}

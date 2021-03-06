import { obj2Param } from '@/utils/'
import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/sign-in',
    method: 'post',
    data
  })
}

export function list(page, size, filter = {}) {
  return request({
    url: `/users/all?page=${page}&size=${size}&${obj2Param(filter)}`,
    method: 'get'
  })
}

export function getDetail(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function verify(id) {
  return request({
    url: `/users/${id}:verify`,
    method: 'patch'
  })
}

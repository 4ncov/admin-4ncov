import { obj2Param } from '@/utils/'
import request from '@/utils/request'

export function list(page, size, filter = {}) {
  return request({
    url: `/supplied-materials/all?${obj2Param(filter)}&page=${page}&size=${size}`,
    method: 'get'
  })
}

export function approve(id) {
  return request({
    url: `/supplied-materials/${id}:approve`,
    method: 'patch'
  })
}

export function reject(id, reviewMessage) {
  return request({
    url: `/supplied-materials/${id}:reject?reviewMessage=${reviewMessage}`,
    method: 'patch'
  })
}

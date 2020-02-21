import request from '@/utils/request'

export function list(page, size) {
  return request({
    url: `/contact-messages?page=${page}&size=${size}`,
    method: 'get'
  })
}

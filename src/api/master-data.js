import request from '@/utils/request'

export function listProvinces() {
  return request({
    url: '/master-data/provinces',
    method: 'get'
  })
}

export function listCities(province) {
  return request({
    url: `/master-data/cities?province=${province}`,
    method: 'get'
  })
}

export function listDistricts(province, city) {
  return request({
    url: `/master-data/districts?province=${province}&city=${city}`,
    method: 'get'
  })
}

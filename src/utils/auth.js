import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

const getTokenPayload = token => JSON.parse(atob(token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'))))

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expiresAt) {
  return Cookies.set(TokenKey, token, { expires: new Date(expiresAt) })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return getTokenPayload(getToken()).id
}

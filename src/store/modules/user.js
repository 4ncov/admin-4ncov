import { login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookie from 'js-cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: Cookie.get('NAME') || '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { telephone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ telephone: telephone.trim(), password: password }).then(response => {
        const { data } = response
        if (data.role !== 'SYSADMIN') {
          throw new Error('当前帐号无权登录')
        }
        commit('SET_TOKEN', data.token)
        setToken(data.token, data.expiresAt)
        resolve()
      }).catch(error => reject(error))
    })
  },

  async setName({ commit }, name) {
    await commit('SET_NAME', name)
    Cookie.set('NAME', name)
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


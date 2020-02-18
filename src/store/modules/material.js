const getDefaultState = () => {
  return {
    requiredMaterial: {
      id: null,
      materials: [{
        name: '',
        quantity: null,
        standard: '',
        category: '',
        imageUrls: []
      }],
      address: {
        province: '',
        city: '',
        district: '',
        streetAddress: ''
      },
      comment: '',
      contactorName: '',
      contactorPhone: '',
      organisationName: '',
      source: '',
      publishFor: '',
      status: ''
    },
    suppliedMaterial: {
      id: null,
      materials: [{
        name: '',
        quantity: null,
        standard: '',
        category: '',
        imageUrls: []
      }],
      address: {
        province: '',
        city: '',
        district: '',
        streetAddress: ''
      },
      comment: '',
      contactorName: '',
      contactorPhone: '',
      organisationName: '',
      source: '',
      status: ''
    }
  }
}

const state = getDefaultState()

const mutations = {
  SET_REQUIRED_MATERIAL: (state, requiredMaterial) => {
    state.requiredMaterial = requiredMaterial || getDefaultState().requiredMaterial
  },
  SET_SUPPLIED_MATERIAL: (state, suppliedMaterial) => {
    state.suppliedMaterial = suppliedMaterial
  },
  RESTORE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  async loadRequiredMaterial({ commit }, material) {
    await commit('SET_REQUIRED_MATERIAL', material)
  },
  async loadSuppliedMaterial({ commit }, material) {
    await commit('SET_SUPPLIED_MATERIAL', material)
  },
  async restore({ commit }) {
    await commit('RESTORE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

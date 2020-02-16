const getDefaultState = () => {
  return {
    requiredMaterial: {
      materials: [{
        name: '',
        quantity: null,
        standard: '',
        category: '',
        imageUrl: ''
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
      organisationName: ''
    },
    suppliedMaterial: {
      materials: [{
        name: '',
        quantity: null,
        standard: '',
        category: '',
        imageUrl: ''
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
      organisationName: ''
    }
  }
}

const state = getDefaultState()

const mutations = {
  SET_REQUIRED_MATERIAL: (state, requiredMaterial) => {
    state.requiredMaterial = requiredMaterial
  },
  SET_SUPPLIED_MATERIAL: (state, suppliedMaterial) => {
    state.suppliedMaterial = suppliedMaterial
  }
}

const actions = {
  async loadRequiredMaterial({ commit }, material) {
    await commit('SET_REQUIRED_MATERIAL', material)
  },
  async loadSuppliedMaterial({ commit }, material) {
    await commit('SET_SUPPLIED_MATERIAL', material)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

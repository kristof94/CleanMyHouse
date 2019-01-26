/* eslint-disable no-unused-vars */
const state = () => ({
  address: null,
  time: null,
  date: null,
  choice: null
})

const mutations = {
  setAddress(state, payload) {
    state.address = payload
  },
  setTime(state, payload) {
    state.time = payload
  },
  setDate(state, payload) {
    state.date = payload
  },
  setChoice(state, payload) {
    state.choice = payload
  }
}

const getters = {
  getAddress: state => {
    return state.address
  },
  getTime: state => {
    return state.time
  },
  getDate: state => {
    return state.date
  },
  getChoice: state => {
    return state.choice
  }
}

const actions = {
  cancelOrder({ commit }, { order }) {
    return this.app.$axios.post('/cancelorder', { order }).catch(err => {
      if (err.response == null || err.response.status == null) {
        commit('setError', {
          code: 500,
          header: 'Vous devez être connecté pour accéder à cette page.',
          message: 'Vous allez être redirigé vers une page de reconnexion.'
        })
      } else if (err.response.status == 401) {
        commit('setError', {
          code: err.response.status,
          header: 'Votre session a expiré.',
          message: 'Vous allez être redirigé vers une page de reconnexion.'
        })
      } else if (err.response.status == 403) {
        commit('setError', {
          code: err.response.status,
          header: 'Vous devez être connecté pour accéder à cette page.',
          message: 'Vous allez être redirigé vers une page de reconnexion.'
        })
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

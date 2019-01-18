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

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}

const state = () => ({
  info: null,
  error: null,
  show: false,
  modal: 'login',
  title: 'Se connecter'
})

const mutations = {
  setShow(state, payload) {
    state.show = payload
  },
  setModal: (state, payload) => {
    state.modal = payload
  },
  setTitle: (state, payload) => {
    state.title = payload
  },
  setError(state, payload) {
    state.error = payload
  },
  setInfo(state, payload) {
    state.info = payload
  }
}

const getters = {
  getInfo: state => {
    return state.info
  },
  getError: state => {
    return state.error
  },
  getModal: state => {
    return state.modal
  },
  getTitle: state => {
    return state.title
  },
  getShow: state => {
    return state.show
  }
}

const actions = {
  changeModal({ dispatch, commit }, { modal, titleModal }) {
    return dispatch('clearMessage')
      .then(() => {
        commit('setModal', modal)
        commit('setTitle', titleModal)
      })
      .then(() => {
        this.app.router.push('login')
      })
  },
  displayLoginForm({ dispatch }) {
    return dispatch('changeModal', {
      modal: 'login',
      titleModal: 'Se connecter'
    })
  },
  displayRegisterForm({ dispatch }) {
    return dispatch('changeModal', {
      modal: 'register',
      titleModal: 'Pas de compte ?'
    })
  },
  displayLostPasswordForm({ dispatch }) {
    return dispatch('changeModal', {
      modal: 'lostpassword',
      titleModal: 'Mot de passe oublié ?'
    })
  },
  displayPhoneForm({ dispatch }) {
    return dispatch('changeModal', {
      modal: 'getphone',
      titleModal: 'Code de confirmation'
    })
  },
  clearMessage({ commit }) {
    commit('setInfo', null)
    commit('setError', null)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

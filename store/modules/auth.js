import firebase from 'firebase/app'
import {
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider
} from '~/plugins/firebase-client-init.js'

function manageAuth(promise, commit, dispatch, axios, root) {
  return promise
    .then(result => {
      root.$cookies.remove('vuex')
      commit('setAddress', null)
      commit('setDate', null)
      commit('setTime', null)
      const isNewUser = result.additionalUserInfo.isNewUser
      const user = result.user
      if (isNewUser || !user.phoneNumber) {
        dispatch('displayPhoneForm')
        commit('setShow', true)
        return
      }
      return Auth.currentUser.getIdToken()
    })
    .then(idToken => {
      if (idToken) {
        return axios
          .post('/sessionToken', {
            idToken
          })
          .then(() => {
            commit('setUser', Auth.currentUser)
            return { success: true }
          })
      }
    })
    .catch(error => {
      console.log(error)
      if (error.message) {
        commit('setError', error.message)
      } else {
        commit('setError', error)
      }
      commit('setShow', true)
    })
}

const state = () => ({
  user: null,
  phoneNumber: null,
  couldSignInWithPhoneNumber: false
})

const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
  setPhoneNumber(state, payload) {
    state.phoneNumber = payload
  },
  couldSignInWithPhoneNumber(state, payload) {
    state.couldSignInWithPhoneNumber = payload
  }
}

const getters = {
  getUser: state => {
    return state.user
  },
  getPhoneNumber: state => {
    return state.phoneNumber
  },
  couldSignInWithPhoneNumber: state => {
    return state.couldSignInWithPhoneNumber
  }
}

const actions = {
  isSigned() {
    return true
  },
  signInWithEmailAndPassword({ dispatch, commit }, { user }) {
    commit('setShow', false)
    dispatch('clearMessage')
    return manageAuth(
      Auth.signInWithEmailAndPassword(user.email, user.password),
      commit,
      dispatch,
      this.app.$axios,
      this
    ).then(result => {
      if (result && result.success) {
        this.app.router.push('/')
      }
    })
  },
  signInWithGooglePopup({ dispatch }) {
    return dispatch('signInWithProvider', {
      provider: GoogleAuthProvider
    })
  },
  signInWithFacebookPopup({ dispatch }) {
    return dispatch('signInWithProvider', {
      provider: FacebookAuthProvider
    })
  },
  signInWithProvider({ dispatch, commit }, { provider }) {
    commit('setShow', false)
    dispatch('clearMessage')
    return manageAuth(
      Auth.signInWithPopup(provider),
      commit,
      dispatch,
      this.app.$axios,
      this
    ).then(result => {
      if (result && result.success) {
        this.app.router.push('/')
      }
    })
  },
  createUser({ commit, dispatch }, { newUser }) {
    commit('setShow', false)
    dispatch('clearMessage')
    commit('setPhoneNumber', newUser.phone)
    return manageAuth(
      Auth.createUserWithEmailAndPassword(newUser.email, newUser.password),
      commit,
      dispatch,
      this.app.$axios,
      this
    ).then(result => {
      if (result && result.success) {
        this.app.router.push('/')
      }
    })
  },
  resetPassword({ commit, dispatch }, { form }) {
    commit('setShow', false)
    dispatch('clearMessage')
    return Auth.sendPasswordResetEmail(form.email)
      .then(() => {
        commit(
          'setInfo',
          'Un mail contenant un lien pour réinitialiser votre mot de passe vous a été envoyé.'
        )
      })
      .catch(error => {
        commit('setError', error)
      })
  },
  prepareCatcha({ dispatch, commit }, { loading }) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('get-code', {
      size: 'invisible',
      callback: function() {
        dispatch('sendSMS', { loading })
      },
      'expired-callback': function() {
        commit('couldSignInWithPhoneNumber', false)
      }
    })
    window.recaptchaVerifier.render().then(widgetId => {
      window.recaptchaWidgetId = widgetId
    })
  },
  sendSMS({ dispatch, commit }, { loading }) {
    loading.start()
    dispatch('clearMessage')
    const phone = '+1 650-555-3434' //this.getters.getPhoneNumber
    var appVerifier = window.recaptchaVerifier
    commit('setShow', false)
    Auth.currentUser
      .linkWithPhoneNumber(phone, appVerifier)
      .then(function(confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        commit('setInfo', 'Un sms vous a été envoyé.')
        commit('couldSignInWithPhoneNumber', true)
        window.confirmationResult = confirmationResult
      })
      .catch(function(error) {
        commit('couldSignInWithPhoneNumber', false)
        if (error.message) {
          commit('setError', error.message)
        } else {
          commit('setError', error)
        }
      })
      .finally(() => {
        commit('setShow', true)
        loading.finish()
      })
  },
  confirmCode({ commit, dispatch }, { code }) {
    dispatch('clearMessage')
    if (
      !window.confirmationResult ||
      !this.getters.couldSignInWithPhoneNumber
    ) {
      commit('setError', 'Problème interne')
      commit('setShow', true)
      return Promise.reject('error')
    }
    commit('setShow', false)
    manageAuth(
      window.confirmationResult.confirm(code),
      commit,
      dispatch,
      this.app.$axios,
      this
    ).then(result => {
      if (result && result.success) {
        this.app.router.push('/')
      }
    })
    /*.finally(() => {
        window.recaptchaVerifier.reset()
      })*/
  },
  signOut({ commit }) {
    commit('setModal', 'login')
    commit('setUser', null)
    commit('setAddress', null)
    commit('setDate', null)
    commit('setTime', null)
    this.$cookies.remove('vuex')

    return Auth.signOut()
      .then(() => {
        commit('setUser', null)
        return this.app.$axios.post('/sessionLogout')
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.app.router.push('/login')
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

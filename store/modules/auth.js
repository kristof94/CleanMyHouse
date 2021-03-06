import firebase from 'firebase/app'
import {
  Auth,
  PhoneAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider
} from '~/plugins/firebase-client-init.js'

import { errorMap } from '~/services/map.js'

function manageError(commit, error) {
  console.log(error)
  if (error.message) {
    commit('setError', errorMap.get(error.code))
  } else {
    commit('setError', {
      code: '500',
      header: 'Erreur interne.',
      message: 'Erreur interne.'
    })
  }
  commit('setShow', true)
}

function manageIdToken(dispatch, commit, axios) {
  return Auth.currentUser
    .getIdToken()
    .then(idToken => {
      return axios
        .post('/sessionToken', {
          idToken
        })
        .then(() => {
          dispatch('clearMessage')
          commit('setUser', Auth.currentUser)
          commit('setPhoneNumber', Auth.currentUser.phoneNumber)
          return { success: true }
        })
    })
    .catch(error => {
      manageError(commit, error)
    })
}

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
        return dispatch('displayPhoneForm')
          .then(() => {
            return dispatch('prepareCatchaReset')
          })
          .then(() => {
            commit('setShow', true)
          })
      }
      return manageIdToken(dispatch, commit, axios)
    })
    .catch(error => {
      manageError(commit, error)
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
  nuxtServerInit({ commit }) {
    if (!this.$axios.defaults.headers.common['XSRF-TOKEN']) {
      this.$axios.get('/api/getcsrftoken').then(response => {
        this.$axios.defaults.headers.common['XSRF-TOKEN'] =
          response.data.csrfToken
        this.$axios.setHeader('XSRF-TOKEN', response.data.csrfToken)
      })
    }
    this.$axios.get('/verifySession').catch(() => {
      commit('setUser', null)
    })
  },
  getApi({ commit }) {
    console.log(commit === 5)
    Auth.currentUser
      .getIdToken()
      .then(idToken => {
        return this.app.$axios.get(
          'https://us-central1-cleanmyhouse-221915.cloudfunctions.net/app/hello',
          {
            headers: { Authorization: 'Bearer ' + idToken }
          }
        )
      })
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  },
  removeAccount({ commit }) {
    console.log(commit === 7)
    var user = Auth.currentUser
    return user
      .delete()
      .then(() => {
        return this.app.$axios.post('/sessionLogout')
      })
      .then(() => {
        commit('setUser', null)
        commit('setAddress', null)
        commit('setDate', null)
        commit('setTime', null)
        this.$cookies.remove('vuex')
      })
      .catch(error => {
        console.log(error)
        commit('setError', {
          code: 500,
          header: 'Veuillez vous reconnecter.',
          message:
            'Une connexion récente est nécessaire pour effectuer cette opération.'
        })
        // manageError(commit, error)
      })
  },
  prepareCatchaReset() {
    window.recaptchaVerifierReset = new firebase.auth.RecaptchaVerifier(
      'resetPhone',
      {
        size: 'invisible'
      }
    )
    return window.recaptchaVerifierReset.render().then(widgetId => {
      window.recaptchaResetWidgetId = widgetId
      return Promise.resolve('captcha ok')
    })
  },
  sendSMSReset({ commit }) {
    window.recaptchaVerifierReset.reset()
    return window.recaptchaVerifierReset
      .verify()
      .then(() => {
        const phone = this.getters.getPhoneNumber //'+1 650-555-3434' //
        //const phone = '+1 650-555-3434'
        var appVerifier = window.recaptchaVerifierReset
        return PhoneAuthProvider.verifyPhoneNumber(phone, appVerifier)
      })
      .then(function(verificationId) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.verificationId = verificationId
        return Promise.resolve('captcha ok')
      })
      .catch(function(error) {
        // eslint-disable-next-line no-undef
        grecaptcha.reset(window.recaptchaResetWidgetId)
        manageError(commit, error)
      })
  },
  confirmCodeReset({ commit, dispatch }, { code }) {
    console.log(dispatch == null)
    if (code) {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        window.verificationId,
        code
      )
      return Auth.currentUser
        .updatePhoneNumber(credential)
        .then(() => {
          return manageIdToken(dispatch, commit, this.app.$axios)
        })
        .catch(error => {
          manageError(commit, error)
        })
    }
    return Promise.reject('code problem')
  },
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
        manageError(commit, error)
      })
  },
  prepareCatcha({ dispatch, commit }, { loading }) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('get-code', {
      size: 'invisible',
      callback: function() {
        dispatch('sendSMS', { loading })
      },
      'expired-callback': function() {
        // eslint-disable-next-line no-undef
        commit('couldSignInWithPhoneNumber', false)
      }
    })
    window.recaptchaVerifier.render().then(widgetId => {
      window.recaptchaWidgetId = widgetId
    })
  },
  /* sendSMSResetPhone({ dispatch, commit }, { loading }) {
    loading.start()
    dispatch('clearMessage')
    const phone = this.getters.getPhoneNumber //'+1 650-555-3434'
    var appVerifier = window.recaptchaVerifierReset
  },*/
  sendSMS({ dispatch, commit }, { loading }) {
    loading.start()
    dispatch('clearMessage')
    const phone = this.getters.getPhoneNumber //'+1 650-555-3434'
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
      commit('setError', {
        code: 500,
        header: 'Erreur',
        message: 'Erreur Interne'
      })
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
    this.$cookies.remove('vuex')

    return Auth.signOut()
      .then(() => {
        return this.app.$axios.post('/sessionLogout')
      })
      .catch(err => console.log(err))
      .finally(() => {
        commit('setUser', null)
        commit('setAddress', null)
        commit('setDate', null)
        commit('setTime', null)
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

import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './modules/auth'
import Modal from './modules/modal'
import Order from './modules/order'

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    modules: {
      Auth,
      Modal,
      Order
    }
  })
}

export default store

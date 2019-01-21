<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">
      <modal-error v-if="showModalError" @close="redirectLogin">
        <!--
      you can use custom content here to overwrite
      default content
				-->
        <div slot="header">{{ this.$store.getters.getError.header }}</div>
        <div slot="body">{{ this.$store.getters.getError.message }}</div>
      </modal-error>
      <div v-else class="orders">
        <div class="signinTitle">Mes commandes</div>
        <order v-for="(order) in orders" :key="order.date" :order="order"/>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
import InformationForm from '~/components/Forms/InformationForm'
import Order from '~/components/Order/Order'
import ModalError from '~/components/Modal/ModalError'

export default {
  components: {
    NavBar,
    Order,
    ModalError,
    InformationForm,
    MyFooter
  },
  transition: 'fadeOpacity',
  data() {
    return {
      isOpen: false,
      showModalError: false
    }
  },
  asyncData(context) {
    return context.$axios
      .get('/getorders')
      .then(res => {
        return { orders: res.data, showModalError: false }
      })
      .catch(err => {
        if (err.response.status == 401) {
          context.store.commit('setError', {
            code: err.response.status,
            header: 'Votre session a expiré.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
          return { orders: null, showModalError: true }
        }
        if (err.response.status == 403) {
          context.store.commit('setError', {
            code: err.response.status,
            header: 'Vous devez être connecté pour accéder à cette page.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
          return { orders: null, showModalError: true }
        }
      })
  },
  methods: {
    redirectLogin() {
      this.showModalError = false
      if (
        this.$store.getters.getError.code === 403 ||
        this.$store.getters.getError.code === 401
      ) {
        this.$store.dispatch('clearMessage')
        this.$router.push('/login')
        return
      }
    }
  }
}
</script>

<style>
</style>

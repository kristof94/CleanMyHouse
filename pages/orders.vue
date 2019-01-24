<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">
      <modal-error v-if="this.$store.getters.getError" @close="redirectLogin">
        <!--
      you can use custom content here to overwrite
      default content
				-->
        <div slot="header">{{ this.$store.getters.getError.header }}</div>
        <div slot="body">{{ this.$store.getters.getError.message }}</div>
      </modal-error>
      <div v-else class="orders">
        <div class="signinTitle">Mes commandes</div>
        <order v-for="(order) in orders" :key="order.sinceDate" :order="order"/>
        <div
          v-if="orders==null || orders.length === 0"
          class="text-center noorder"
        >Vous n'avez pas de commande.</div>
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
  asyncData({ $axios }) {
    return $axios
      .get('/getorders')
      .then(res => {
        return { orders: res.data }
      })
      .catch(() => {
        return { orders: null }
      })
  },
  methods: {
    redirectLogin() {
      if (
        this.$store.getters.getError.code === 403 ||
        this.$store.getters.getError.code === 401 ||
        this.$store.getters.getError.code === 500
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
.noorder {
  font-size: 20px;
  color: rgba(6, 175, 218, 1);
}
</style>

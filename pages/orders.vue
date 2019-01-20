<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">
      <div class="orders" style="overflow-y: scroll;">
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

export default {
  components: {
    NavBar,
    Order,
    InformationForm,
    MyFooter
  },
  transition: 'fadeOpacity',
  data() {
    return {
      isOpen: false
    }
  },
  asyncData(context) {
    return context.$axios
      .get('/getorders')
      .then(res => {
        return { orders: res.data }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    formatAdress(address) {
      const map = address
      return map.street_number
        .concat(', ')
        .concat(map.route)
        .concat(' ')
        .concat(map.locality)
    }
  }
}
</script>

<style>
</style>

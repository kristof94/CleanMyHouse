<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">      
      <div class="orders style-2">
        <div class="signinTitle">Mes commandes</div>
        <order
          v-for="(order) in orders"
          :key="order.sinceDate"
          :order="order"
          @paidOld="open"
          @rateOrder="rateOrder_"
          @cancelOrder="cancel"
        />
        <div
          v-if="orders==null || orders.length === 0"
          class="text-center noorder"
        >Vous n'avez pas de commande.</div>
      </div>
    </section>
    <modal-info v-if="showModalInfo">
      <div slot="header">Etes-vous sur ?</div>
      <div slot="body">Cette opération est irréversible</div>
      <div slot="footer">
        <button class="modal-default-button" @click="cancelOrder">Oui</button>
        <button class="modal-default-button" @click="noCancel">Non</button>
      </div>
    </modal-info>
    <modal-info v-if="showModalRate">
      <div slot="header">Un avis ?</div>
      <div slot="body">
        <star-rating/>
      </div>
      <div slot="footer">
        <button class="modal-default-button" @click="rate">Confirmer</button>
        <button class="modal-default-button" @click="showModalRate = false">Annuler</button>
      </div>
    </modal-info>
    <no-ssr>
      <vue-stripe-checkout
        ref="checkoutRef2"
        :name="title"
        :email="email"
        :currency="currency"
        :amount="price"
        :allow-remember-me="true"
        @done="done"
        @opened="opened"
        @closed="closed"
        @canceled="canceled"
      />
    </no-ssr>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
import InformationForm from '~/components/Forms/InformationForm'
import Order from '~/components/Order/Order'
import ModalError from '~/components/Modal/ModalError'
import ModalInfo from '~/components/Modal/ModalInfo'
import StarRating from 'vue-star-rating'

export default {
  components: {
    NavBar,
    Order,
    ModalError,
    ModalInfo,
    StarRating,
    InformationForm,
    MyFooter
  },
  transition: 'fadeOpacity',
  data() {
    return {
      showModalInfo: false,
      showModalRate: false,
      rateOrder: null,
      canceledOrder: null,
      oldOrder: null,
      title: 'Clean my house',
      price: null,
      email:
        this.$store.getters.getUser == null
          ? null
          : this.$store.getters.getUser.email,
      rememberMe: false,
      currency: 'EUR'
    }
  },
  asyncData({ store, $axios }) {
    return $axios
      .get('/order/getorders')
      .then(res => {
        const orders = res.data
        return { orders }
      })
      .catch(err => {
        if (err.response == null || err.response.status == null) {
          store.commit('setError', {
            code: 500,
            header: 'Vous devez être connecté pour accéder à cette page.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
        } else if (err.response.status == 401) {
          store.commit('setError', {
            code: err.response.status,
            header: 'Votre session a expiré.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
        } else if (err.response.status == 403) {
          store.commit('setError', {
            code: err.response.status,
            header: 'Vous devez être connecté pour accéder à cette page.',
            message: 'Vous allez être redirigé vers une page de reconnexion.'
          })
        }
        return { orders: null }
      })
  },
  notifications: {
    showSuccessMsg: {
      // eslint-disable-next-line no-undef
      type: 'success'
    },
    showErrorMsg: {
      type: 'error'
    }
  },
  methods: {
    test() {
      this.$axios
        .post('/hello', { data: true })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    },
    rate() {},
    redirectLogin() {
      if (
        this.$store.getters.getError.code === 403 ||
        this.$store.getters.getError.code === 401 ||
        this.$store.getters.getError.code === 500
      ) {
        this.$store.dispatch('clearMessage')
        this.$router.push('/login')
        return
      } else if (this.$store.getters.getError.code === 404) {
        this.$store.commit('setError', null)
        return
      } else {
        this.$store.dispatch('clearMessage')
        this.$router.push('/login')
        return
      }
    },
    async open(order) {
      this.$nuxt.$loading.start()
      this.oldOrder = order
      this.price = order.price
      await this.$refs.checkoutRef2.open()
    },
    done({ token }) {
      const order = this.oldOrder
      order.token = token
      this.$axios
        .post('/order/processoldpayment', {
          order
        })
        .then(res => {
          const orders = res.data
          this.orders = orders
        })
        .catch(err => {
          if (!err.response.status) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Erreur interne',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          }
          if (err.response.status == 401) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Votre session a expiré.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          }
          if (err.response.status == 403) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Vous devez être connecté pour accéder à cette page.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          }
          if (err.response.status == 404) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Erreur Interne',
              message: 'Veuillez réessayer plus tard.'
            })
          }
          if (err.response.status == 500) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Erreur interne',
              message:
                "Votre paiement n'a pas été enregistré. Veuillez réessayer."
            })
          }
        })
        .finally(() => {
          this.oldOrder = null
          this.$nuxt.$loading.finish()
        })
    },
    opened() {
      // do stuff
    },
    closed() {
      // do stuff
    },
    canceled() {
      // do stuff
      this.$nuxt.$loading.finish()
    },
    noCancel() {
      this.showModalInfo = false
      this.canceledOrder = null
    },
    cancel(order) {
      this.canceledOrder = order
      this.showModalInfo = true
    },
    rateOrder_(order) {
      this.rateOrder = order
      this.showModalRate = true
    },
    cancelOrder() {
      this.showModalInfo = false
      this.$nuxt.$loading.start()

      this.$axios
        .post('/order/cancelorder', { order: this.canceledOrder })
        .then(() => {
          this.showSuccessMsg({
            title: 'Votre commande a été annulée',
            message: ':)',
            cb: () => {
              this.$router.go({ path: '/orders', force: true })
            }
          })
        })
        .catch(err => {
          if (err.response == null || err.response.status == null) {
            this.store.commit('setError', {
              code: 500,
              header: 'Vous devez être connecté pour accéder à cette page.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          } else if (err.response.status == 401) {
            this.store.commit('setError', {
              code: err.response.status,
              header: 'Votre session a expiré.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          } else if (err.response.status == 403) {
            this.store.commit('setError', {
              code: err.response.status,
              header: 'Vous devez être connecté pour accéder à cette page.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          }
          this.showErrorMsg({
            title: this.$store.getters.getError.header,
            message: this.$store.getters.getError.message,
            cb: () => {
              if (
                this.$store.getters.getError.code === 403 ||
                this.$store.getters.getError.code === 401 ||
                this.$store.getters.getError.code === 500
              ) {
                this.$store.dispatch('clearMessage')
                this.$router.push('/login')
                return
              } else if (this.$store.getters.getError.code === 404) {
                this.$store.commit('setError', null)
                return
              } else {
                this.$store.dispatch('clearMessage')
                this.$router.push('/login')
                return
              }
            }
          })
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
          this.canceledOrder = null
        })
    }
  }
}
</script>

<style>
.noorder {
  font-size: 20px;
  color: rgb(123, 191, 207);
}

.style-2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 0px;
  background-color: transparent;
}

.style-2::-webkit-scrollbar {
  width: 8px;
}

.style-2::-webkit-scrollbar-thumb {
  border-radius: 0px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(123, 191, 207);
}
</style>

<template>
  <div class="flexparent" style="height: 100vh;">
    <nav-bar/>
    <section v-if="displayPrice" class="order column">
      <b-container fluid class="book">
        <b-row>
          <b-col :lg="12" :md="12" :sm="12" :cols="12">
            <b-form class="text-center">
              <b-form-group>
                <h1>Prix</h1>
                <span :class="{ customIconAnimated: displayPrice }" class="customIcon">
                  {{ price / 100 }}
                  <font-awesome-icon :icon="['fas', 'euro-sign']"/>
                </span>
              </b-form-group>
            </b-form>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            :lg="6"
            :md="6"
            :sm="6"
            :cols="4"
            offset="4"
            offset-sm="3"
            offset-md="3"
            offset-lg="3"
            class="text-center"
          >
            <b-button
              v-if="date && time && address"
              class="specialbutton longbutton smallbutton whiteShine"
              @click="pay"
            >Payer</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            :lg="6"
            :md="8"
            :sm="8"
            :cols="10"
            offset="1"
            offset-sm="2"
            offset-md="2"
            offset-lg="3"
            class="text-center"
          >
            <b-button
              v-if="date && time && address"
              class="specialbutton longbutton smallbutton whiteShine"
              @click="modify"
            >Modifier ma commande</b-button>
          </b-col>
        </b-row>
      </b-container>
    </section>
    <section v-else id="order" class="order column">
      <b-container class="book">
        <b-row>
          <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]">
            <book-date :is-active="!date" @open="open"/>
          </b-col>
          <b-col :lg="lg[1]" :md="lg[1]" :sm="lg[1]" :cols="lg[1]">
            <transition name="slide-fade">
              <book-adress v-if="date" :is-active="!address" @open="showModal = true"/>
            </transition>
          </b-col>
          <b-col :lg="lg[2]" :md="lg[2]" :sm="lg[2]" :cols="lg[2]">
            <transition name="slide-fade">
              <book-time v-if="address" :is-active="!time" @open="openTime"/>
            </transition>
          </b-col>
        </b-row>
        <b-row>
          <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]">
            <div v-if="date" class="resume">
              <div class="resume-text">{{ getStringDate() }}</div>
              <div class="resume-text">{{ getStringDateHour() }}</div>
            </div>
          </b-col>
          <b-col :lg="lg[1]" :md="lg[1]" :sm="lg[1]" :cols="lg[1]">
            <div v-if="address">
              <div class="resume">
                <div class="resume-text">{{ address.description }}</div>
              </div>
            </div>
          </b-col>
          <b-col :lg="lg[2]" :md="lg[2]" :sm="lg[2]" :cols="lg[2]">
            <div
              v-if="time"
              class="resume"
            >{{ time.get('hour')+'h' }}{{ time.get('minute') == 0 ? '00':'30' }}</div>
          </b-col>
        </b-row>
        <b-row>
          <b-col
            :lg="6"
            :md="6"
            :sm="6"
            :cols="6"
            offset="3"
            offset-sm="3"
            offset-md="3"
            offset-lg="3"
            class="text-center"
          >
            <b-button
              v-if="date && time && address"
              class="specialbutton longbutton smallbutton whiteShine"
              @click="confirm"
            >Confirmer</b-button>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <my-footer/>
    <adress v-if="showModal" @setPlace="setPlace" @close="showModal = false">
      <!--
      you can use custom content here to overwrite
      default content
			-->
      <div slot="header">Choisissez une addresse</div>
    </adress>
    <choice-task v-if="showChoiceModal" @closeChoiceModal="confirmChoice">
      <!--
      you can use custom content here to overwrite
      default content
			-->
      <div slot="header">Ménage ou Repassage</div>
    </choice-task>
    <no-ssr>
      <vue-stripe-checkout
        ref="checkoutRef"
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
    <no-ssr>
      <datetime
        ref="datepicker"
        :format="{ year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }"
        :phrases="{ok: 'Continuer', cancel: 'Fermer'}"
        :hour-step="1"
        :minute-step="30"
        :week-start="7"
        type="datetime"
        auto
        class="theme-blue"
        @input="onDateChanged"
      />
      <datetime
        :format="{hour: 'numeric', minute: '2-digit'}"
        :phrases="{ok: 'Continuer', cancel: 'Fermer'}"
        :hour-step="1"
        :minute-step="30"
        type="time"
        max-datetime="05:00"
        min-datetime="0:30"
        emit-name="openTime"
        auto
        class="theme-blue"
        @input="onTimeChanged"
      />
    </no-ssr>
    <modal-info v-if="showModalInfo" @close="redirectOrder">
      <!--
      you can use custom content here to overwrite
      default content
			-->
      <div slot="header">{{ infoPaymentHeader }}</div>
      <div slot="body">{{ infoPaymentMessage }}</div>
    </modal-info>
    <modal-error v-if="this.$store.getters.getError" @close="redirectLogin">
      <!--
      you can use custom content here to overwrite
      default content
			-->
      <div slot="header">{{ this.$store.getters.getError.header }}</div>
      <div slot="body">{{ this.$store.getters.getError.message }}</div>
    </modal-error>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import BookDate from '~/components/Order/BookDate'
import BookTime from '~/components/Order/BookTime'
import BookAdress from '~/components/Order/BookAdress'
import BookTask from '~/components/Order/BookTask'
import MyFooter from '~/components/Footer/Footer'
import { DateTime } from 'luxon'
import Date from '~/components/Order/Date'
import Adress from '~/components/Order/Address'
import ChoiceTask from '~/components/Order/ChoiceTask'
import ModalError from '~/components/Modal/ModalError'
import ModalInfo from '~/components/Modal/ModalInfo'

const buildColumn = (date, time, address) => {
  if (date && time && address) {
    return [4, 4, 4]
  } else if (date && address) {
    return [6, 6, 0]
  } else {
    return [12, 0, 0]
  }
}

export default {
  components: {
    NavBar,
    Date,
    BookDate,
    BookTime,
    Adress,
    ChoiceTask,
    BookAdress,
    BookTask,
    ModalError,
    ModalInfo,
    MyFooter
  },
  data() {
    return {
      title: 'Clean my house',
      infoPaymentHeader: null,
      infoPaymentMessage: null,
      informations: null,
      price: null,
      email:
        this.$store.getters.getUser == null
          ? null
          : this.$store.getters.getUser.email,
      rememberMe: false,
      currency: 'EUR',
      showModal: false,
      showChoiceModal: false,
      showModalError: false,
      showModalInfo: false,
      displayPrice: false,
      date:
        this.$store.getters.getDate == null
          ? null
          : DateTime.fromISO(this.$store.getters.getDate, {
              zone: 'Europe/Paris'
            }),
      time:
        this.$store.getters.getTime == null
          ? null
          : DateTime.fromISO(this.$store.getters.getTime, {
              zone: 'Europe/Paris'
            }),
      address:
        this.$store.getters.getAddress == null
          ? null
          : this.$store.getters.getAddress,
      lg: buildColumn(
        this.$store.getters.getDate,
        this.$store.getters.getTime,
        this.$store.getters.getAddress
      )
    }
  },
  fetch({ store, $axios }) {
    return $axios.get('/verifySession').catch(err => {
      if (err.response.status == 401) {
        store.commit('setError', {
          code: err.response.status,
          header: 'Votre session a expiré.',
          message: 'Vous allez être redirigé vers une page de reconnexion.'
        })
      }
      if (err.response.status == 403) {
        store.commit('setError', {
          code: err.response.status,
          header: 'Vous devez être connecté pour accéder à cette page.',
          message: 'Vous allez être redirigé vers une page de reconnexion.'
        })
      }
    })
  },
  methods: {
    getStringDate() {
      const date = this.date
      return `Le ${date.get('weekdayLong')} ${date.get('day')} ${date.get(
        'monthLong'
      )}`
    },
    getStringDateHour() {
      const date = this.date
      return `A ${date.get('hour') == '0' ? '00' : date.get('hour')}h${
        date.get('minute') == '0' ? '00' : date.get('minute')
      }`
    },
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
      if (this.$store.getters.getError.code === 400) {
        this.$store.dispatch('clearMessage')
        this.date = null
        this.time = null
        this.address = null
      }
    },
    redirectOrder() {
      this.showModalInfo = false
      this.$router.push('/orders')
    },
    async pay() {
      this.$nuxt.$loading.start()
      await this.$refs.checkoutRef.open()
    },
    done({ token }) {
      const order = {
        token: token,
        email: this.$store.getters.getUser.email,
        address: this.$store.getters.getAddress,
        date: this.$store.getters.getDate,
        time: this.$store.getters.getTime,
        task: this.$store.getters.getChoice
      }

      this.$axios
        .post('/processpayment', { order })
        .then(response => {
          this.infoPaymentHeader = 'Paiement réussi.'
          this.infoPaymentMessage = response.data
          this.showModalInfo = true
        })
        .catch(err => {
          if (err.response.status == 401) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Votre session a expiré.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
            return { showModalError: true }
          }
          if (err.response.status == 403) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Vous devez être connecté pour accéder à cette page.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
            return { showModalError: true }
          }
        })
        .finally(() => {
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
    modify() {
      this.displayPrice = false
    },
    confirmChoice(event) {
      this.showChoiceModal = false
      if (!event) {
        return
      }
      this.$nuxt.$loading.start()
      this.$store.commit('setAddress', this.address)
      this.$store.commit('setChoice', event)
      this.$store.commit('setDate', this.date)
      this.$store.commit('setTime', this.time)

      const order = {
        address: this.address,
        choice: event,
        date: this.date,
        time: this.time
      }
      this.$axios
        .post('/preparepaiement', { order })
        .then(response => {
          this.price = response.data.price
          this.displayPrice = true
        })
        .catch(err => {
          this.showModalError = true
          if (err.response.status == 401) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Votre session a expiré.',
              message: 'Vous allez être redirigé vers une page de reconnexion.'
            })
          }
          if (err.response.status == 400) {
            this.$store.commit('setError', {
              code: err.response.status,
              header: 'Erreur interne.',
              message:
                'Il y a eu un problème lors de la création de votre commande. Veuillez recommencer.'
            })
          }
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    },
    confirm() {
      this.showChoiceModal = true
    },
    setPlace(place) {
      this.address = place
      this.lg[0] = 4
      this.lg[1] = 4
      this.lg[2] = 4
    },
    open(event) {
      this.$emit('open', event)
    },
    openTime(event) {
      this.$emit('openTime', event)
    },
    onDateChanged(event) {
      if (event) {
        const date = DateTime.fromISO(event, {
          zone: 'Europe/Paris'
        })
        if (date && !this.time) {
          this.date = date
          this.lg[0] = 6
          this.lg[1] = 6
        } else if (date) {
          this.date = date
        }
      }
    },
    onTimeChanged(event) {
      if (event) {
        const time = DateTime.fromISO(event, {
          zone: 'Europe/Paris'
        })
        if (time && time.get('hour') != 0) {
          this.time = time
        }
      }
    }
  }
}
</script>

<style>
.theme-blue .vdatetime-popup__header,
.theme-blue .vdatetime-calendar__month__day--selected > span > span,
.theme-blue .vdatetime-calendar__month__day--selected:hover > span > span {
  background: rgba(6, 175, 218, 0.8);
}

.theme-blue .vdatetime-year-picker__item--selected,
.theme-blue .vdatetime-time-picker__item--selected,
.theme-blue .vdatetime-popup__actions__button {
  color: rgba(6, 175, 218, 0.8);
}
</style>

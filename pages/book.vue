<template>
  <div class="flexparent" style="height: 100vh;">
    <nav-bar/>
    <section v-if="!displayPrice" id="order" class="order column">
      <b-container class="book">
        <b-row>
          <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]">
            <book-date @open="open"/>
          </b-col>
          <b-col :lg="lg[1]" :md="lg[1]" :sm="lg[1]" :cols="lg[1]">
            <transition name="slide-fade">
              <book-adress v-if="date" @open="showModal = true"/>
            </transition>
          </b-col>
          <b-col :lg="lg[2]" :md="lg[2]" :sm="lg[2]" :cols="lg[2]">
            <transition name="slide-fade">
              <book-time v-if="address" @open="openTime"/>
            </transition>
          </b-col>
        </b-row>
        <b-row>
          <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]">
            <transition name="fadeOpacity">
              <date v-if="date != null" :date="date"/>
            </transition>
          </b-col>
          <b-col :lg="lg[1]" :md="lg[1]" :sm="lg[1]" :cols="lg[1]">
            <transition name="fadeOpacity">
              <div v-if="address">
                <div class="resume">
                  <div class="resume-text">{{ address.description }}</div>
                </div>
              </div>
            </transition>
          </b-col>
          <b-col :lg="lg[2]" :md="lg[2]" :sm="lg[2]" :cols="lg[2]">
            <transition name="fadeOpacity">
              <div
                v-if="time"
                class="resume"
              >{{ time.get('hour')+'h' }}{{ time.get('minute') == 0 ? '00':'30' }}</div>
            </transition>
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
              class="specialbutton longbutton whiteShine"
              @click="confirm"
            >Confirmer</b-button>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section v-else class="order column">
      <b-container fluid class="book">
        <b-row>
          <b-col :lg="12" :md="12" :sm="12" :cols="12">
            <b-form class="text-center">
              <b-form-group>
                <h1>Prix</h1>
                <span :class="{ customIconAnimated: displayPrice }" class="customIcon">25
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
            :cols="6"
            offset="3"
            offset-sm="3"
            offset-md="3"
            offset-lg="3"
            class="text-center"
          >
            <b-button
              v-if="date && time && address"
              class="specialbutton longbutton whiteShine"
              @click="pay"
            >Payer</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col :lg="6" :md="8" :sm="12" :cols="12" offset-md="2" offset-lg="3" class="text-center">
            <b-button
              v-if="date && time && address"
              class="specialbutton longbutton whiteShine"
              @click="modify"
            >Modifier ma commande</b-button>
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
        :email="$store.getters.getUser.email"
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
    MyFooter
  },
  data() {
    return {
      title: 'Clean my house',
      informations: null,
      price: 2500,
      rememberMe: false,
      currency: 'EUR',
      showModal: false,
      showChoiceModal: false,
      displayPrice: false,
      date:
        this.$store.getters.getDate == null
          ? null
          : DateTime.fromISO(this.$store.getters.getDate),
      time:
        this.$store.getters.getTime == null
          ? null
          : DateTime.fromISO(this.$store.getters.getTime),
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
  computed: {
    modalPaiement: {
      set() {},
      get() {
        return this.$store.getters.getErrorPaiment != null
      }
    }
  },
  methods: {
    async pay() {
      await this.$refs.checkoutRef.open()
    },
    done({ token }) {
      const order = {
        token: token,
        email: this.$store.getters.getUser.email,
        address: this.$store.getters.getAddress,
        date: this.$store.getters.getDate,
        time: this.$store.getters.getTime,
        task: this.$store.getters.getTask
      }
      this.$axios
        .post('/processpayment', { order })
        .then(response => {
          console.log(response)
          this.$store.commit('setErrorPaiment', 'Problème lors du paiement')
        })
        .catch(err => {
          this.$store.commit('setErrorPaiment', err)
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
    },
    modify() {
      this.displayPrice = false
    },
    confirmChoice(event) {
      this.showChoiceModal = false
      if (!event) {
        return
      }
      this.$store.commit('setAddress', this.address)
      this.$store.commit('setChoice', event)
      this.$store.commit('setDate', this.date)
      this.$store.commit('setTime', this.time)
      this.displayPrice = true
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
        const date = DateTime.fromISO(event)
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
        const time = DateTime.fromISO(event)
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

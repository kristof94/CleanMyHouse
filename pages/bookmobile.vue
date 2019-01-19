<template>
  <div class="flexparent" style="height:auto;">
    <nav-bar/>
    <b-container class="book" style="height: -webkit-fill-available;">
      <b-row class="align-items-center">
        <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]" class="mx-auto">
          <book-date :is-active="date == null" @open="open"/>
        </b-col>
        <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]" class="mx-auto">
          <transition name="fadeOpacity">
            <date v-if="date != null" :date="date"/>
          </transition>
        </b-col>
      </b-row>
      <b-row class="align-items-center">
        <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0] " class="mx-auto">
          <transition name="slide-fade">
            <book-adress v-if="date" :is-active="date == null" @open="showModal = true"/>
          </transition>
        </b-col>
        <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]" class="mx-auto">
          <transition name="fadeOpacity">
            <div v-if="address">
              <div class="resume">
                <div class="resume-text">{{ address.description }}</div>
              </div>
            </div>
          </transition>
        </b-col>
      </b-row>
      <b-row class="align-items-center">
        <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]" class="mx-auto">
          <transition name="slide-fade">
            <book-time v-if="address" :is-active="address == null" @open="openTime"/>
          </transition>
        </b-col>
        <b-col :lg="lg[0]" :md="lg[0]" :sm="lg[0]" :cols="lg[0]" class="mx-auto">
          <transition name="fadeOpacity">
            <div
              v-if="time"
              class="resume"
            >{{ time.get('hour')+'h' }}{{ time.get('minute') == 0 ? '00':'30' }}</div>
          </transition>
        </b-col>
      </b-row>
      <b-row class="endRow align-items-center">
        <b-col :lg="12" :md="12" :sm="12" :cols="12" class="mx-auto" style="text-align: center;">
          <transition name="slide-fade">
            <b-button
              v-if="date && time && address"
              class="smallbutton whiteShine justify-content-center align-self-center"
              @click="confirm"
            >Confirmer</b-button>
          </transition>
        </b-col>
      </b-row>
    </b-container>
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

const buildColumn = () => {
  return [6, 6]
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
      showModal: false,
      showChoiceModal: false,

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
  computed: {},
  methods: {
    confirmChoice(event) {
      this.showChoiceModal = false
      if (!event) {
        return
      }
      this.$router.push('/confirmbooking')
      this.$store.commit('setAddress', this.address)
      this.$store.commit('setChoice', event)
      this.$store.commit('setDate', this.date)
      this.$store.commit('setTime', this.time)
    },
    confirm() {
      this.showChoiceModal = true
    },
    setPlace(place) {
      this.address = place
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
        if (date) {
          this.date = date
          this.lg[0] = 6
          this.lg[1] = 6
        }
      }
    },
    onTimeChanged(event) {
      if (event) {
        const time = DateTime.fromISO(event)
        if (time && time.get('hour') != 0) {
          this.time = time
          this.lg[0] = 4
          this.lg[1] = 4
          this.lg[2] = 4
        }
      }
    }
  }
}
</script>

<style>
.endRow {
  height: 200px;
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(50px);
  opacity: 0;
}

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

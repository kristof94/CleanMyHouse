<template>
  <div class="flexparent">
    <nav-bar/>
    <section id="home" class="login">
      <div class="signin form-custom">
        <div class="signinTitle">Confirmation</div>
        <div>
          <div>Le {{ date.get('weekdayLong') }} {{ date.get('day') }} {{ date.get('monthLong') }}</div>
          <div>A {{ date.get('hour')=='0' ? '00' : date.get('hour') }}h{{ date.get('minute')=='0' ? '00' : date.get('minute') }}</div>
        </div>
        <div v-if="time">{{ time.get('hour')+'h' }}{{ time.get('minute') == 0 ? '00':'30' }}</div>
        <div v-if="address">
          <div>{{ address.description }}</div>
        </div>
        <div>
          <div>{{ choice }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
import Date from '~/components/Order/Date'
import Address from '~/components/Order/Address'
import { DateTime } from 'luxon'

export default {
  components: {
    NavBar,
    Date,
    Address,
    MyFooter
  },
  props: {},
  data() {
    return {
      date: DateTime.fromISO(this.$cookies.get('vuex').Order.date),
      time: DateTime.fromISO(this.$cookies.get('vuex').Order.time),
      address: this.$cookies.get('vuex').Order.address,
      choice:
        this.$cookies.get('vuex').Order.choice == 1 ? 'Ménage' : 'Repassage'
    }
  }
}
</script>

<style>
</style>

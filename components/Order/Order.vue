<template>
  <div class="order_">
    <b-container class="bv-example-row">
      <b-row>
        <b-col cols-lg="6">
          <div class="titleCommand">
            <font-awesome-icon :icon="['far', 'clock']"/>
            {{ getHour() }} heures de {{ task() }}
          </div>
        </b-col>
        <b-col offset-lg="3" lg="3">
          <div class="timeSince">{{ since }}</div>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6" md="8" cols="12">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']"/>
          {{ order.order.address.description }}
        </b-col>
        <b-col lg="3" cols="12" md="4" offset-lg="3">{{ order.order.status }}</b-col>
      </b-row>
      <b-row>
        <b-col cols-lg="12" cols="12">
          <font-awesome-icon :icon="['fa', 'calendar-alt']"/>
          Le {{ date.get('weekdayLong') }} {{ date.get('day') }} {{ date.get('monthLong') }}
          à {{ date.get('hour') == '0' ? '00' : date.get('hour') }}h{{ date.get('minute')=='0' ? '00' : date.get('minute') }}
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3" lg="6" align="center">
          <b-button class="orderButton">Noter</b-button>
        </b-col>
        <b-col cols="9" lg="6" align="center">
          <b-button class="orderButton">Annuler la commande</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

const getStringFromDate = date => {
  const weekdayLong = date.get('weekdayLong')
  const day = date.get('day')
  const monthLong = date.get('monthLong')
  const year = date.get('year')
  const hours = date.get('hour')
  const minutes = date.get('minute')
  return { weekdayLong, day, monthLong, year, hours, minutes }
}

export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      date: DateTime.fromMillis(this.order.order.date)
    }
  },
  computed: {
    since: function() {
      const now = DateTime.local().toMillis()
      const delta = DateTime.fromMillis(now - this.order.order.sinceDate)
      const dateMap = getStringFromDate(delta)
      if (delta.get('hour') > 12) {
        return (
          'Le' +
          dateMap.weekdayLong +
          ' ' +
          dateMap.day +
          ' ' +
          dateMap.monthLong +
          ' ' +
          dateMap.year
        )
      } else if (delta.get('hour') > 1) {
        return (
          'Il y a ' +
          dateMap.hours +
          ' heures et ' +
          dateMap.minutes +
          ' minutes.'
        )
      } else {
        return 'Il y a ' + dateMap.minutes + ' minutes.'
      }
    }
  },
  methods: {
    getHour: function() {
      const time = DateTime.fromMillis(this.order.order.time)
      const hours = time.get('hour')
      const minute = time.get('minute')
      return hours + 'h' + (minute == 0 ? '00' : '30')
    },
    task: function() {
      var taskMap = new Map()
      taskMap.set(1, 'Ménage')
      taskMap.set(2, 'Repassage')
      taskMap.set(3, 'Ménage et Repassage')
      return taskMap.get(this.order.order.task)
    }
  }
}
</script>

<style>
.orderButton {
  background-color: transparent;
  border-style: none;
  color: rgba(6, 175, 218, 0.8);
}

.order_ {
  border-color: #f6f9fc;
  background-color: #f6f9fc;
  border-style: solid 4px;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.8) 0 0 3px;
  padding: 5px 5px 5px 5px;
  margin: 10px 5px 10px 5px;
}

.titleCommand {
  font-weight: bold;
}

.timeSince {
  color: gray;
}
</style>

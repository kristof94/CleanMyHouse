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
        <b-col offset-lg="2" lg="4">
          <div class="timeSince">{{ since() }}</div>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <font-awesome-icon :icon="['fa', 'calendar-alt']"/>
          Le {{ `${date.setLocale('fr').toFormat('cccc dd LLLL yyyy')}` }}
          à {{ date.get('hour') == '0' ? '00' : date.get('hour') }}h{{ date.get('minute')=='0' ? '00' : date.get('minute') }}
        </b-col>
        <b-col
          :class="{ statussuccess: status === 'confirmed', statuswaiting: status === 'waiting' , statuscanceled: status === 'removed' || status === 'paidProblem' }"
          offset-lg="2"
          lg="4"
        >
          {{ getStatus() }}
          <b-button v-if="status === 'paidProblem'" class="payButton" @click="pay">
            Payer {{ order.price / 100 }}
            <font-awesome-icon :icon="['fas', 'euro-sign']"/>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6" md="8" cols="12">
          <font-awesome-icon :icon="['fas', 'map-marker-alt']"/>
          {{ order.address.description }}
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="status=='waiting' || status=='confirmed'" cols="12" align="center">
          <button class="orderButton" @click="cancel">Annuler la commande</button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

function statusMap() {
  const map = new Map()
  map.set('waiting', "Recherche d'aide ménagère en cours.")
  map.set('confirmed', 'Confirmé')
  map.set('executed', '')
  map.set('paidProblem', 'Non payée')
  map.set('removed', 'Annulé')
  return map
}

const map = statusMap()

export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      date: DateTime.fromMillis(this.order.date)
    }
  },
  computed: {
    status() {
      return this.order.status
    }
  },
  methods: {
    getStatus() {
      return map.get(this.order.status)
    },
    since: function() {
      const nowDate = DateTime.local()
      const now = nowDate.toMillis()
      const sinceDate = DateTime.fromMillis(this.order.sinceDate)
      const delta = DateTime.fromMillis(now - this.order.sinceDate)
      if (
        delta.get('hour') >= 12 ||
        sinceDate.get('weekdayLong') > nowDate.get('weekdayLong')
      ) {
        return `Le ${sinceDate.setLocale('fr').toFormat('cccc dd LLLL yyyy')}.`
      } else if (delta.get('hour') > 1) {
        return `Il y a ${delta.get('hour')} heures et ${
          delta.get('minute') < 10
            ? `0${delta.get('minute')}`
            : delta.get('minute')
        } ${delta.get('minute') > 1 ? 'minutes' : 'minute'}.`
      } else {
        return `Il y a ${delta.get('minute')} ${
          delta.get('minute') > 1 ? 'minutes' : 'minute'
        }.`
      }
    },
    getHour: function() {
      const time = DateTime.fromMillis(this.order.time)
      const hours = time.get('hour')
      const minute = time.get('minute')
      return `Il y a ${hours}h${minute == 0 ? '00' : '30'}`
    },
    task: function() {
      var taskMap = new Map()
      taskMap.set(1, 'Ménage')
      taskMap.set(2, 'Repassage')
      taskMap.set(3, 'Ménage et Repassage')
      return taskMap.get(this.order.task)
    },
    noter() {
      console.log('noter')
    },
    cancel() {
      this.$emit('cancelOrder', this.order)
    },
    rate() {
      this.$emit('rateOrder', this.order)
    },
    pay() {
      this.$emit('paidOld', this.order)
    }
  }
}
</script>

<style>
.statuswaiting {
  color: orange;
}

.statussuccess {
  color: green;
}

.statuscanceled {
  color: red;
}

.orderButton {
  background-color: transparent;
  border-style: none;
  color: rgba(6, 175, 218, 0.8);
  cursor: pointer;
}

.orderButton:hover,
.orderButton:focus,
.orderButton:active {
  box-shadow: none !important;
  border-style: none !important;
  background-color: transparent !important;
  color: rgba(6, 175, 218, 0.8) !important;
  text-decoration: underline;
}

.order_ {
  border-color: grey;
  background-color: #f6f9fc;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 5px 5px 5px 5px;
  margin: 10px 5px 10px 5px;
}

.titleCommand {
  font-weight: bold;
}

.timeSince {
  color: gray;
}

.payButton,
.payButton:hover,
.payButton:active {
  background-color: red;
  color: white;
  border-color: unset;
  box-shadow: unset;
}
</style>

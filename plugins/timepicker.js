import Vue from 'vue'
import { Datetime } from 'vue-datetime-custom'
import { Settings } from 'luxon'

Settings.defaultLocale = 'fr'
Vue.component('datetime', Datetime)

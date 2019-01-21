import Vue from 'vue'
import { Datetime } from 'vue-datetime-custom'
import { Settings } from 'luxon'

Settings.defaultLocale = 'fr'
Settings.defaultZoneName = 'Europe/Paris'
Vue.component('datetime', Datetime)

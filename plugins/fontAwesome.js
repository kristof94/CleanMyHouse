import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import {
  faBars,
  faArrowDown,
  faEnvelope,
  faUnlock,
  faPhone,
  faCalendarAlt,
  faArrowRight,
  faTimes,
  faCreditCard,
  faMapMarkerAlt,
  faQuestion
} from '@fortawesome/free-solid-svg-icons'
import { faClock, faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import brands, {
  faPaypal,
  faCcMastercard,
  faCcVisa,
  faCcAmex
} from '@fortawesome/fontawesome-free-brands'
config.autoAddCss = false

library.add(faQuestion)
library.add(faMapMarkerAlt)
library.add(faUser)
library.add(faCreditCard)
library.add(faPaypal)
library.add(faCcMastercard)
library.add(faCcVisa)
library.add(faCcAmex)
library.add(faTimes)
library.add(faArrowRight)
library.add(faClock)
library.add(faCalendarAlt)
library.add(faBars)
library.add(faPhone)
library.add(faEnvelope)
library.add(faUnlock)
library.add(brands)
library.add(faArrowDown)
Vue.component('font-awesome-icon', FontAwesomeIcon)

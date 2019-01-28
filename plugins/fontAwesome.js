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
  faQuestion,
  faEuroSign,
  faSignInAlt,
  faUsers,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons'
import {
  faClock,
  faUser,
  faAddressCard
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import brands, {
  faPaypal,
  faCcMastercard,
  faCcVisa,
  faCcAmex
} from '@fortawesome/fontawesome-free-brands'
config.autoAddCss = false

library.add(faBriefcase)
library.add(faAddressCard)
library.add(faSignInAlt)
library.add(faEuroSign)
library.add(faQuestion)
library.add(faMapMarkerAlt)
library.add(faUser)
library.add(faUsers)
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

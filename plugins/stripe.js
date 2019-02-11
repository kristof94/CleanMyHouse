import Vue from 'vue'
import VueStripeCheckout from 'vue-stripe-checkout'
import dotenv from 'dotenv'
dotenv.config()

Vue.use(VueStripeCheckout, process.env.PUBLISHABLE_KEY)

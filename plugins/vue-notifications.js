import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import swal from 'sweetalert' // https://github.com/t4t5/sweetalert

// eslint-disable-next-line no-unused-vars
function toast({ title, message, type, timeout, cb }) {
  if (type === VueNotifications.types.warn) type = 'warning'
  return swal(title, message, type)
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)

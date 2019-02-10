<template>
  <div>
    <b-form v-if="displayCodeInput" id="codeForm" @submit.prevent="preventEnterCode">    
      <input ref="inputCode" v-model="codeForm.code" class="inputCode" maxlength="6">
      <b-button
        :disabled="$v.codeForm.$invalid"
        class="submitButton"        
        style="width:100%"
        @click="confirmCode"
      >Confirmer le code</b-button>
    </b-form>
    <b-form id="phoneForm" style="margin-top:1em;" @submit.prevent="sendSms">            
      <b-form-group id="phoneInputGroup" label="Mon numéro de téléphone" label-for="phoneInput">
        <b-input-group>
          <b-input-group-text slot="prepend">
            <span>
              <font-awesome-icon :icon="['fa', 'phone']"/>
            </span>
          </b-input-group-text>
          <no-ssr>              
            <the-mask            
              id="phoneInput"
              v-model="phone"
              :state="$v.form.phone.minLength"
              placeholder="0601832011"
              type="tel"
              aria-describedby="phoneInputGroupFeedback"
              mask="## ## ## ## ##"
            />
          </no-ssr>
          <b-form-invalid-feedback
            v-if="!$v.form.phone.minLength"
            id="phoneInputGroupFeedback"
          >Votre numéro de téléphone est invalide.</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>
      <b-button        
        :disabled="$v.form.$invalid"
        class="submitButton"
        style="width:100%"
        type="submit"
      >{{ displayCodeInput ? 'Recevoir un nouveau code' : 'Recevoir le code' }}</b-button>
      <div id="resetPhone"/>
    </b-form>       
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
import ModalError from '~/components/Modal/ModalError'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import PhoneForm from '~/components/Forms/PhoneForm'

export default {
  components: {
    NavBar,
    ModalError,
    PhoneForm,
    MyFooter
  },
  mixins: [validationMixin],
  validations: {
    form: {
      phone: {
        required,
        minLength: minLength(10)
      }
    },
    codeForm: {
      code: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(6)
      }
    }
  },
  transition: 'fadeOpacity',
  data() {
    return {
      codeForm: {
        code: null
      },
      form: {
        phone: null
      },
      phone: null,
      displayCodeInput: false
    }
  },
  watch: {
    phone: function(val) {
      if (val.length === 10) {
        this.form.phone = val
        const phone = '+33'.concat(this.form.phone.substring(1))
        this.$store.commit('setPhoneNumber', phone)
      } else {
        this.form.phone = null
        this.$store.commit('setPhoneNumber', null)
      }
    }
  },
  mounted: function() {},
  created: function() {
    const phoneNumber = this.$store.getters.getPhoneNumber
    if (phoneNumber) {
      this.form.phone = phoneNumber.replace('+33', '0')
      this.phone = this.form.phone
    }
  },
  methods: {
    preventEnterCode() {
      this.confirmCode()
    },
    sendSms() {
      this.$nuxt.$loading.start()
      this.$store
        .dispatch('sendSMSReset')
        .then(response => {
          if (response === 'captcha ok') {
            this.displayCodeInput = true
          }
        })
        .finally(() => {
          // eslint-disable-next-line no-undef
          grecaptcha.reset(window.recaptchaResetWidgetId)
          this.$nuxt.$loading.finish()
        })
    },
    confirmCode() {
      this.$nuxt.$loading.start()
      const code = this.codeForm.code
      this.$store
        .dispatch('confirmCodeReset', { code })
        .catch(error => {
          console.log(error)
          this.$store.commit('setError', {
            code: 500,
            header: 'Erreur',
            message: error.message == null ? error : error.message
          })
        })
        .finally(() => {
          window.grecaptcha.reset(window.recaptchaResetWidgetId)
          this.$nuxt.$loading.finish()
        })
    }
  }
}
</script>

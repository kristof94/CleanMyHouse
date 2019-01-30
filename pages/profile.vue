<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">
      <div class="signin">
        <div class="signinTitle">
          Mes informations      
        </div>    
        <b-form id="registerForm" @submit.prevent="goToSendCode">    
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
                  v-model="form.phone"
                  :state="$v.form.phone.minLength"
                  placeholder="+33601832011"
                  type="tel"
                  aria-describedby="phoneInputGroupFeedback"
                  mask="+33# ## ## ## ##"
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
            type="submit"
            style="width:100%"
          >Changer de numéro de téléphone</b-button>
        </b-form>
      </div>
    </section>
    <modal-error v-if="this.$store.getters.getError" @close="redirectLogin">
      <div slot="header">{{ this.$store.getters.getError.header }}</div>
      <div slot="body">{{ this.$store.getters.getError }}</div>
    </modal-error>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
import ModalError from '~/components/Modal/ModalError'
import { required, minLength } from 'vuelidate/lib/validators'
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
        minLength: minLength(9)
      }
    }
  },
  transition: 'fadeOpacity',
  data() {
    return {
      form: {
        phone: null
      }
    }
  },
  computed: {
    phone: {
      get() {
        return this.$store.getters.getPhoneNumber
      },
      set(value) {
        this.form.phone = value
        this.$store.commit('setPhoneNumber', '+33'.concat(this.form.phone))
      }
    }
  },
  created: function() {
    const phoneNumber = this.$store.getters.getPhoneNumber
    if (phoneNumber) {
      this.form.phone = phoneNumber
    }
  },
  methods: {
    goToSendCode() {
      this.form.phone = '+33'.concat(this.form.phone)
      this.$nuxt.$loading.start()
      this.$store
        .dispatch('updatePhoneNumber', { form: this.form })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    },
    redirectLogin() {
      this.$store.commit('setError', null)
    }
  }
}
</script>

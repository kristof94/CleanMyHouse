<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">
      <div class="signin">
        <div class="signinTitle">
          Mes informations      
        </div>
        <phone-form v-show="displayPhoneForm" @codeConfirmed="DisplayPhoneForm" />
        <b-form v-if="!displayPhoneForm" id="registerForm">
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
                  :disabled="true"
                  placeholder="0601832011"
                  type="tel"
                  aria-describedby="phoneInputGroupFeedback"
                  mask="## ## ## ## ##"
                />
              </no-ssr>              
            </b-input-group>
          </b-form-group>
          <b-button
            class="submitButton"
            style="width:100%"            
            @click="updatePhoneNumber"
          >Changer de numéro de téléphone</b-button>
        </b-form>           
      </div>
    </section>
    <modal-error v-if="this.$store.getters.getError" @close="redirectLogin">
      <!--
      you can use custom content here to overwrite
      default content
			-->
      <div slot="header">{{ this.$store.getters.getError.header }}</div>
      <div slot="body">{{ this.$store.getters.getError.message }}</div>
    </modal-error>
    <my-footer/>    
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
import ModalError from '~/components/Modal/ModalError'
import PhoneForm from '~/components/Forms/PhoneForm'

export default {
  components: {
    NavBar,
    ModalError,
    PhoneForm,
    MyFooter
  },
  transition: 'fadeOpacity',
  data() {
    return {
      form: {
        phone: null
      },
      displayPhoneForm: false
    }
  },
  created: function() {
    const phoneNumber = this.$store.getters.getPhoneNumber
    if (phoneNumber && phoneNumber.startsWith('+33')) {
      this.form.phone = phoneNumber.replace('+33', '0')
    }
  },
  methods: {
    updatePhoneNumber() {
      this.$nuxt.$loading.start()
      this.$store
        .dispatch('prepareCatchaReset', { loading: this.$nuxt.$loading })
        .then(() => {
          this.displayPhoneForm = true
        })
        .finally(() => {
          this.$store.commit('setError', null)
          this.$nuxt.$loading.finish()
        })
    },
    redirectLogin() {
      if (
        this.$store.getters.getError.code === 403 ||
        this.$store.getters.getError.code === 401
      ) {
        this.$store.dispatch('clearMessage')
        this.$store.dispatch('displayLoginForm')
        this.$store.commit('setError', null)
        this.$router.push('/login')
        return
      }
      if (this.$store.getters.getError.code === 500) {
        this.$store.dispatch('clearMessage')
        this.$store.commit('setError', null)
        location.reload()
        return
      }
    },
    DisplayPhoneForm(event) {
      this.displayPhoneForm = event
    }
  }
}
</script>

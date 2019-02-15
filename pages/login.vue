<template>
  <div class="flexparent">
    <nav-bar/>
    <section id="home" class="login">
      <div class="signin">
        <div class="signinTitle">{{ this.$store.getters.getTitle }}</div>
        <b-form-invalid-feedback
          v-if="$store.getters.getError"
          id="input1LiveFeedback"
          class="d-block"
        >{{ $store.getters.getError.message }}</b-form-invalid-feedback>
        <b-form-valid-feedback
          v-if="$store.getters.getInfo"
          class="d-block"
        >{{ this.$store.getters.getInfo }}</b-form-valid-feedback>
        <transition name="register">
          <register-form
            v-if="this.$store.getters.getModal=='register'"
            v-show="this.$store.getters.getModal=='register'"
          />
          <login-form
            v-else-if="this.$store.getters.getModal=='login'"
            v-show="this.$store.getters.getModal=='login'"
          />
          <password-form
            v-else-if="this.$store.getters.getModal=='lostpassword'"
            v-show="this.$store.getters.getModal=='lostpassword'"
            ref="infoValid"
          />
          <phone-form
            v-else-if="this.$store.getters.getModal=='getphone'"
            v-show="this.$store.getters.getModal=='getphone'"     
            @openInfoModal="openInfoModal"
          />
        </transition>
        <div
          v-show="this.$store.getters.getModal=='login' || this.$store.getters.getModal=='register'"
          slot="modal-footer"
          class="w-100"
        >
          <b-container class="bv-example-row">
            <b-row>
              <p class="float-left">Plus rapide avec</p>
            </b-row>
            <b-row>
              <b-col lg="5" sm="5" cols="6" offset-sm="1">
                <b-button
                  id="google"
                  variant="primary"
                  class="btn-social google"
                  @click="googleSignUpPopup"
                >
                  <span>
                    <font-awesome-icon :icon="['fab', 'google']"/>
                  </span>
                  Google
                </b-button>
              </b-col>
              <b-col lg="5" sm="6" md="6" cols="6" offset-sm="0">
                <b-button variant="primary" class="btn-social facebook" @click="facebookSignUpPopup">
                  <span>
                    <font-awesome-icon :icon="['fab', 'facebook']"/>
                  </span>
                  Facebook
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </div>
      </div>
    </section>
    <modal-info v-if="displayInfoModal" @close="redirect">
      <!--
      you can use custom content here to overwrite
      default content
			-->
      <div slot="header">{{ infoHeader }}</div>
      <div slot="body">
        <div class="check_mark">
          <div class="sa-icon sa-success animate">
            <span class="sa-line sa-tip animateSuccessTip"/>
            <span class="sa-line sa-long animateSuccessLong"/>
            <div class="sa-placeholder"/>
            <div class="sa-fix"/>
          </div>
        </div>
        {{ infoMessage }}
        <p>🥰</p>
      </div>
    </modal-info>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import RegisterForm from '~/components/Forms/RegisterForm'
import LoginForm from '~/components/Forms/LoginForm'
import PasswordForm from '~/components/Forms/PasswordForm'
import PhoneForm from '~/components/Forms/PhoneForm'
import MyFooter from '~/components/Footer/Footer'
import ModalInfo from '~/components/Modal/ModalInfo'

export default {
  components: {
    NavBar,
    ModalInfo,
    RegisterForm,
    LoginForm,
    PasswordForm,
    PhoneForm,
    MyFooter
  },
  transition: 'fadeOpacity',
  data() {
    return {
      form: {
        phone: null
      },
      displayPhoneForm: false,
      displayInfoModal: false,
      infoHeader: null,
      infoMessage: null
    }
  },
  created: function() {
    const phoneNumber = this.$store.getters.getPhoneNumber
    if (phoneNumber && phoneNumber.startsWith('+33')) {
      this.form.phone = phoneNumber.replace('+33', '0')
    }
  },
  mounted() {
    this.$store.dispatch('displayLoginForm')
  },
  methods: {
    redirect() {
      this.$router.push('/book')
    },
    openInfoModal(event) {
      this.infoHeader = event
      this.infoMessage = event
      this.displayInfoModal = true
    },
    googleSignUpPopup() {
      this.$nuxt.$loading.start()
      this.$store.dispatch('signInWithGooglePopup').finally(() => {
        this.$nuxt.$loading.finish()
      })
    },
    facebookSignUpPopup() {
      this.$nuxt.$loading.start()
      this.$store.dispatch('signInWithFacebookPopup').finally(() => {
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
        this.$router.go({ path: '/login', force: true })
        return
      }
    }
  }
}
</script>

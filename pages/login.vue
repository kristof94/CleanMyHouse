<template>
  <div class="flexparent">
    <nav-bar/>
    <section id="home" class="login">
      <div class="signin form-custom">
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
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import RegisterForm from '~/components/Forms/RegisterForm'
import LoginForm from '~/components/Forms/LoginForm'
import PasswordForm from '~/components/Forms/PasswordForm'
import PhoneForm from '~/components/Forms/PhoneForm'
import MyFooter from '~/components/Footer/Footer'

export default {
  components: {
    NavBar,
    RegisterForm,
    LoginForm,
    PasswordForm,
    PhoneForm,
    MyFooter
  },
  props: {},
  methods: {
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
    }
  }
}
</script>

<template>
  <b-modal id="loginModal" ref="loginModal" :title="title" v-model="show">
    <b-form-invalid-feedback
      v-if="$store.getters.getError"
      id="input1LiveFeedback"
      class="d-block"
    >{{ $store.getters.getError }}</b-form-invalid-feedback>
    <info-valid v-if="$store.getters.getInfo" :data-obj="$store.getters.getInfo"/>
    <transition name="register">
      <register-form v-if="modalName=='register'" v-show="modalName=='register'"/>
      <login-form v-else-if="modalName=='login'" v-show="modalName=='login'"/>
      <password-form
        v-else-if="modalName=='lostpassword'"
        v-show="modalName=='lostpassword'"
        ref="infoValid"
      />
      <phone-form v-else-if="modalName=='getphone'" v-show="modalName=='getphone'"/>
    </transition>
    <div v-show="modalName=='login' || modalName=='register'" slot="modal-footer" class="w-100">
      <b-container class="bv-example-row">
        <b-row>
          <p class="float-left">Plus rapide avec</p>
        </b-row>
        <b-row>
          <b-col lg="5" sm="5" cols="6" offset-sm="1">
            <b-button id="google" variant="primary" class="btn-social google" @click="googleSignUpPopup">
              <span>
                <font-awesome-icon :icon="['fab', 'google']"/>Google
              </span>
            </b-button>
          </b-col>
          <b-col lg="5" sm="5" cols="6" offset-sm="0">
            <b-button variant="primary" class="btn-social facebook" @click="facebookSignUpPopup">
              <span>
                <font-awesome-icon :icon="['fab', 'facebook']"/>Facebook
              </span>
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </b-modal>
</template>

<script>
import InfoValid from '~/components/Modal/InfoValid'
import RegisterForm from '~/components/Forms/RegisterForm'
import LoginForm from '~/components/Forms/LoginForm'
import PasswordForm from '~/components/Forms/PasswordForm'
import PhoneForm from '~/components/Forms/PhoneForm'

export default {
  components: {
    InfoValid,
    RegisterForm,
    LoginForm,
    PasswordForm,
    PhoneForm
  },
  data: () => {
    return {}
  },
  computed: {
    title: {
      get: function() {
        return this.$store.getters.getTitle
      },
      set: function(newValue) {
        this.$store.commit('setTitle', newValue)
      }
    },
    modalName: {
      get: function() {
        const modal = this.$store.getters.getModal
        return modal
      },
      set: function(newValue) {
        this.$store.commit('setModal', newValue)
      }
    },
    show: {
      get: function() {
        return this.$store.getters.getShow
      },
      set: function(newValue) {
        this.$store.commit('setShow', newValue)
      }
    }
  },
  mounted() {},
  methods: {
    googleSignUpPopup() {
      this.$emit('googleSignUpPopup')
    },
    facebookSignUpPopup() {
      this.$emit('facebookSignUpPopup')
    }
  }
}
</script>

<style>
</style>

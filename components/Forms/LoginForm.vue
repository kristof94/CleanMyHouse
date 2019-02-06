<template>
  <b-form id="loginForm" @submit.prevent="createUserPopup">
    <b-form-group id="emailInputGroupLogin" label="Email" label-for="emailInputLogin">
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span class="formIcon">
            <font-awesome-icon :icon="['fa', 'envelope']"/>
          </span>
        </b-input-group-text>
        <b-form-input
          id="emailInputLogin"
          ref="emailInputLogin"
          v-model="form.email"
          :state="$v.form.email.email"
          type="email"
          aria-describedby="emailInputGroupFeedback"
          placeholder="Entrer votre email"
        />
        <b-form-invalid-feedback
          v-if="!$v.form.email.email"
          id="emailInputGroupFeedback"
        >Votre email est invalide.</b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>
    <b-form-group id="passwordInputGroupLogin" label="Mot de passe" label-for="passwordInputLogin">
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span class="formIcon">
            <font-awesome-icon :icon="['fa', 'unlock']"/>
          </span>
        </b-input-group-text>
        <b-form-input
          id="passwordInputLogin"
          ref="passwordInputLogin"
          v-model="form.password"
          :state="$v.form.password.minLength"
          type="password"
          autocomplete="on"
          placeholder="Entrer votre mot de passe"
        />
      </b-input-group>
    </b-form-group>
    <b-button class="submitButton" type="submit" variant="primary" style="width:100%">Se connecter</b-button>
    <b-container class="bv-example-row text-center">
      <b-row>
        <b-col lg="5" sm="5" cols="12" offset-md="0">
          <b-button variant="link" class="btn-link" @click="displayRegister">Pas de compte ?</b-button>
        </b-col>
        <b-col lg="5" sm="5" cols="12" offset-md="1">
          <b-button variant="link" class="btn-link" @click="displayLostPassword">Mot de passe oublié ?</b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-form>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  components: {},
  mixins: [validationMixin],
  data: () => {
    return {
      form: {
        email: '',
        password: null
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  methods: {
    displayRegister() {
      this.$store.dispatch('displayRegisterForm')
    },
    displayLostPassword() {
      this.$store.dispatch('displayLostPasswordForm')
    },
    createUserPopup() {
      if (!this.form.email) {
        this.$store.commit('setError', 'Veuillez vérifier votre email.')
        return
      }
      if (!this.form.password) {
        this.$store.commit('setError', 'Veuillez vérifier votre mot de passe.')
        return
      }
      this.$store.dispatch('clearMessage')
      this.$nuxt.$loading.start()
      const newUser = this.form
      this.$store.dispatch('clearMessage', newUser)
      this.$store
        .dispatch('signInWithEmailAndPassword', {
          user: newUser
        })
        .finally(() => {
          this.$nuxt.$loading.finish()
        })
    }
  }
}
</script>

<style>
</style>

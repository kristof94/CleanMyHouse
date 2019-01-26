<template>
  <b-form id="loginForm" @submit.prevent="resetPassword">
    <b-form-group id="emailInputGroupLogin" label="Email" label-for="emailInputLogin">
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span>
            <font-awesome-icon :icon="['fa', 'envelope']"/>
          </span>
        </b-input-group-text>
        <b-form-input
          id="emailInputLogin"
          v-model="form.email"
          :state="$v.form.email.email"
          type="email"
          aria-describedby="emailInputGroupFeedback"
          placeholder="Entrer votre "
        />
        <b-form-invalid-feedback
          v-if="!$v.form.email.email"
          id="emailInputGroupFeedback"
        >Email must respect email format.</b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>
    <b-button
      :disabled="$v.form.$invalid"
      class="submitButton"
      type="submit"
      variant="primary"
      style="width:100%"
    >Modifier le mot de passe</b-button>
    <b-container class="bv-example-row text-center">
      <b-row>
        <b-col lg="5" sm="3" cols="12" offset-md="0">
          <b-button variant="link" class="btn-link" @click="displayLogin">Se connecter</b-button>
        </b-col>
        <b-col lg="5" sm="3" cols="12" offset-md="1">
          <b-button variant="link" class="btn-link" @click="displayRegister">Pas de compte ?</b-button>
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
        email: ''
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    displayRegister() {
      this.$store.dispatch('displayRegisterForm')
    },
    displayLogin() {
      this.$store.dispatch('displayLoginForm')
    },
    resetPassword() {
      this.$nuxt.$loading.start()
      if (!this.$v.$invalid) {
        this.$store
          .dispatch('resetPassword', {
            form: this.form
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.$nuxt.$loading.finish()
          })
      } else {
        this.$store.commit('setError', 'Veuillez vérifier votre mail')
      }
    }
  }
}
</script>

<style>
.submitButton:active {
  color: #f6f9fc;
  background-color: rgb(123, 191, 207);
  border-color: unset;
}
</style>

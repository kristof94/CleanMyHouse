<template>
  <b-form id="registerForm" @submit.prevent="createUserPopup">
    <b-form-group id="emailInputGroup" label="Email" label-for="emailInput">
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span>
            <font-awesome-icon :icon="['fa', 'envelope']"/>
          </span>
        </b-input-group-text>
        <b-form-input
          id="emailInput"
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
    <b-form-group id="phoneInputGroup" label="Téléphone" label-for="phoneInput">
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span>
            <font-awesome-icon :icon="['fa', 'phone']"/>
          </span>
        </b-input-group-text>
        <the-mask
          id="phoneInput"
          v-model="form.phone"
          :state="$v.form.phone.minLength"
          placeholder="+33601832011"
          type="tel"
          aria-describedby="phoneInputGroupFeedback"
          mask="+33# ## ## ## ##"
        />
        <b-form-invalid-feedback
          v-if="!$v.form.phone.minLength"
          id="phoneInputGroupFeedback"
        >Votre numéro de téléphone est invalide.</b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>
    <b-form-group id="passwordInputGroup" label="Mot de passe" label-for="passwordInput">
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span>
            <font-awesome-icon :icon="['fa', 'unlock']"/>
          </span>
        </b-input-group-text>
        <b-form-input
          id="passwordInput"
          v-model="form.password"
          :state="$v.form.password.minLength"
          type="password"
          autocomplete="on"
          aria-describedby="passwordInputGroupFeedback"
          placeholder="Entrer votre mot de passe"
        />
        <b-form-invalid-feedback
          v-if="!$v.form.password.minLength"
          id="passwordInputGroupFeedback"
        >Votre mot de passe doit contenir au moins {{ $v.form.password.$params.minLength.min }} caractères.</b-form-invalid-feedback>
      </b-input-group>
      <b-input-group>
        <b-input-group-text slot="prepend">
          <span>
            <font-awesome-icon :icon="['fa', 'unlock']"/>
          </span>
        </b-input-group-text>
        <b-form-input
          id="passwordRepeatInput"
          :state="$v.form.passwordRepeat.sameAsPassword"
          v-model="form.passwordRepeat"
          type="password"
          autocomplete="on"
          aria-describedby="passwordRepeatInputGroupFeedback"
          placeholder="Entrer votre mot de passe"
        />
        <b-form-invalid-feedback
          v-if="!$v.form.passwordRepeat.sameAsPassword"
          id="passwordRepeatInputGroupFeedback"
        >Votre mot de passe doit être identique.</b-form-invalid-feedback>
      </b-input-group>
    </b-form-group>
    <b-button
      :disabled="$v.form.$invalid"
      class="submitButton"
      type="submit"
      style="width:100%"
    >Créer un compte</b-button>
    <b-container class="bv-example-row text-center">
      <b-row>
        <b-col lg="5" sm="5" cols="12" offset-md="0">
          <b-button variant="link" class="btn-link" @click="displayLogin">Se connecter</b-button>
        </b-col>
        <b-col lg="5" sm="5" cols="12" offset-sm="0" offset-lg="1">
          <b-button variant="link" class="btn-link" @click="displayLostPassword">Mot de passe oublié ?</b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-form>
</template>

<script>
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import VueScrollTo from 'vue-scrollto'

export default {
  components: {},
  mixins: [validationMixin],
  data: () => {
    return {
      form: {
        email: '',
        password: '',
        phone: '',
        passwordRepeat: ''
      }
    }
  },
  computed: {
    show: {
      get: function() {
        return this.$store.getters.getShow
      },
      set: function(newValue) {
        this.$store.commit('setShow', newValue)
      }
    }
  },
  mounted() {
    var options = {
      container: 'body',
      easing: 'ease-in',
      offset: 30,
      force: true,
      cancelable: true,
      onStart: function() {
        // scrolling started
      },
      onDone: function() {
        // scrolling is done
      },
      onCancel: function() {
        // scrolling has been interrupted
      },
      x: false,
      y: true
    }

    VueScrollTo.scrollTo('#home', 500, options)
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      phone: {
        required,
        minLength: minLength(9)
      },
      passwordRepeat: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    displayLogin() {
      this.$store.dispatch('displayLoginForm')
    },
    displayLostPassword() {
      this.$store.dispatch('displayLostPasswordForm')
    },
    createUserPopup() {
      this.$nuxt.$loading.start()
      const newUser = this.form
      this.$store.dispatch('clearMessage')
      this.$store
        .dispatch('createUser', {
          newUser: newUser
        })
        .catch(err => {
          console.log(err)
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

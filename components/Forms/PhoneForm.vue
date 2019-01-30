<template>
  <div>
    <b-form id="phoneForm">
      <b-form-group
        id="phoneInputGroup"
        :label="label"
        label-for="phoneInput"
      >
        <b-input-group>
          <b-input-group-text slot="prepend">
            <span>
              <font-awesome-icon :icon="['fa', 'phone']"/>
            </span>
          </b-input-group-text>
          <the-mask
            id="phoneInput"
            v-model="phone"
            :state="$v.form.phone.minLength"
            style="width:80%;"
            placeholder="+33601832011"
            type="tel"
            mask="+33# ## ## ## ##"
          />
          <b-form-invalid-feedback
            v-if="!$v.form.phone.minLength"
            id="passwordInputGroupFeedback"
          >Name must have at least {{ $v.form.phone.$params.minLength.min }} num.</b-form-invalid-feedback>
        </b-input-group>
      </b-form-group>
      <b-button
        id="get-code"
        :disabled="$v.form.$invalid"
        class="submitButton"
        type="submit"
        variant="primary"
        style="width:100%"
      >Recevoir son code d'activation</b-button>
    </b-form>
    <b-form
      v-if="this.$store.getters.couldSignInWithPhoneNumber"
      id="codeForm"
      style="margin-top : 12px;"
      @submit.prevent="confirmPhone"
    >
      <b-form-group
        id="codeInputGroup"
        label="Entrez le code de confirmation que vous avez reçu"
        label-for="codeInput"
      >
        <b-input-group>
          <the-mask
            id="codeInput"
            v-model="codeForm.code"
            placeholder="111222"
            type="tel"
            class="form-control"
            mask="######"
          />
        </b-input-group>
      </b-form-group>
      <b-button
        :disabled="$v.codeForm.$invalid"
        class="submitButton"
        type="submit"
        variant="primary"
        style="width:100%"
      >Confirmer le code d'activation</b-button>
    </b-form>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  components: {},
  mixins: [validationMixin],
  props: {
    label: {
      type: String,
      default:
        'Votre compte a été créé. Pour finaliser votre inscription, entrez votre numéro de téléphone'
    }
  },
  data: () => {
    return {
      codeForm: {
        code: null
      },
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
  validations: {
    form: {
      phone: {
        required,
        minLength: minLength(9)
      }
    },
    codeForm: {
      code: {
        required
      }
    }
  },
  mounted: function() {
    this.$store.dispatch('prepareCatcha', { loading: this.$nuxt.$loading })
    if (this.$store.getters.getPhoneNumber) {
      this.form.phone = this.$store.getters.getPhoneNumber
    }
  },

  methods: {
    confirmPhone() {
      this.$nuxt.$loading.start()
      this.$store
        .dispatch('confirmCode', {
          code: this.codeForm.code
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

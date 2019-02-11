<template>
  <div class="flexsignin">
    <nav-bar/>
    <section id="home" class="homepage">
      <div class="signin">
        <div class="signinTitle">Mes informations</div>
        <phone-form v-show="displayPhoneForm" @codeConfirmed="DisplayPhoneForm"/>
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
        <b-form v-if="!displayPhoneForm" id="registerForm">
          <b-form-group id="phoneInputGroup" label-for="phoneInput">
            <b-input-group>
              <b-input-group-text slot="prepend" class="remove" @click="showModalRemove_">
                <span style="padding-right : 11px;">
                  <font-awesome-icon :icon="['fa', 'user-times']"/>
                </span>
                Supprimer mon compte
              </b-input-group-text>
            </b-input-group>
          </b-form-group>
        </b-form>
      </div>
    </section>
    <modal-info v-if="showModalRemove">
      <div slot="header">Etes-vous sûr de supprimer votre compte ?</div>
      <div slot="body">Cette opération est irrémédiable.</div>
      <div slot="footer">
        <button class="modal-default-button" @click="deleteAccount">Confirmer</button>
        <button class="modal-default-button" @click="showModalRemove = false">Annuler</button>
      </div>
    </modal-info>
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
import ModalInfo from '~/components/Modal/ModalInfo'

export default {
  components: {
    NavBar,
    ModalError,
    ModalInfo,
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
      showModalRemove: false
    }
  },
  created: function() {
    const phoneNumber = this.$store.getters.getPhoneNumber
    if (phoneNumber && phoneNumber.startsWith('+33')) {
      this.form.phone = phoneNumber.replace('+33', '0')
    }
  },
  methods: {
    showModalRemove_() {
      this.showModalRemove = true
    },
    deleteAccount() {
      this.$nuxt.$loading.start()
      this.$store
        .dispatch('removeAccount')
        .then(() => {
          this.$router.push('/')
          this.showModalRemove = false
        })
        .finally(() => {
          this.$store.commit('setError', null)
          this.$nuxt.$loading.finish()
        })
    },
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
        this.$router.go({ path: '/login', force: true })
        return
      }
    },
    DisplayPhoneForm(event) {
      this.displayPhoneForm = event
    }
  }
}
</script>

<style>
.remove {
  color: #ec4c4c;
  cursor: pointer;
}
</style>

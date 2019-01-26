<template>
  <b-navbar toggleable="md">
    <no-ssr>
      <b-navbar-toggle target="nav_collapse">
        <span>
          <font-awesome-icon :icon="['fa', 'bars']"/>
        </span>
      </b-navbar-toggle>
    </no-ssr>

    <b-navbar-brand to="/">{{ title }}</b-navbar-brand>

    <b-collapse id="nav_collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="this.$device.isMobile">
          <div v-if="$store.getters.getUser">
            <b-nav-item class="link" to="/orders">Mes commandes</b-nav-item>
            <b-nav-item class="link" to="/profile">Mes informations</b-nav-item>
          </div>
          <div v-else>
            <b-nav-item class="link" @click="showLoginModal">Se connecter</b-nav-item>
            <b-nav-item class="link" @click="showRegisterModal">Créer un compte</b-nav-item>
          </div>
        </div>
        <div v-else>
          <b-nav-item-dropdown
            v-if="$store.getters.getUser"
            text="Mon compte"
            class="link accountmenu"
            right
          >
            <b-dropdown-item class="link dropdownItem" to="/orders">Mes commandes</b-dropdown-item>
            <b-dropdown-item class="link dropdownItem" to="/profile">Mes informations</b-dropdown-item>
            <b-dropdown-item class="link dropdownItem" to="/cleaners">Nos aides ménagères</b-dropdown-item>
            <b-dropdown-item class="link dropdownItem" @click="logOut">Se déconnecter</b-dropdown-item>
          </b-nav-item-dropdown>
          <div v-else>
            <b-nav-item class="link" to="/cleaners" style="display: inline-block;">Nos aides ménagères</b-nav-item>
            <a class="loginButton" @click="showLoginModal">Se connecter
              <font-awesome-icon :icon="['fas', 'sign-in-alt']"/>
            </a>
          </div>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    rlinks: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: process.env.TITLE_APP,
      required: false
    }
  },
  methods: {
    showRegisterModal() {
      this.$store.dispatch('displayRegisterForm')
    },
    showLoginModal() {
      this.$store.dispatch('displayLoginForm')
    },
    logOut() {
      this.$nuxt.$loading.start()
      this.$store.dispatch('signOut').finally(() => {
        this.$nuxt.$loading.finish()
      })
    }
  }
}
</script>
<style>
.loginButton {
  background-color: #e882c4;
  -moz-border-radius: 42px;
  -webkit-border-radius: 42px;
  border-radius: 42px;
  display: inline-block;
  cursor: pointer;
  color: #ffffff !important;
  font-size: 16px;
  padding: 10px 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  text-decoration: none;
}
.loginButton:hover {
  background-color: #ffffff;
  color: #e882c4 !important;
}
</style>

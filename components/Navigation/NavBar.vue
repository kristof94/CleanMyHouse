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
            <b-dropdown-item class="link" to="/orders">Mes commandes</b-dropdown-item>
            <b-dropdown-item class="link" to="/profile">Mes informations</b-dropdown-item>
            <b-dropdown-item class="link" @click="logOut">Se déconnecter</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown v-else text="Mon compte" class="link accountmenu" right>
            <b-dropdown-item class="link" @click="showLoginModal">Se connecter</b-dropdown-item>
            <b-dropdown-item class="link" @click="showRegisterModal">Créer un compte</b-dropdown-item>
          </b-nav-item-dropdown>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  components: {},
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

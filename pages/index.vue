<template>
  <div class="flexparent">
    <nav-bar/>
    <section id="home" class="homepage">
      <div style="text-align: center;">
        <h2>Trouvez une aide ménagère en moins d'une minute</h2>
        <b-button class="specialbutton smallbutton whiteShine" @click="book">Réserver</b-button>
      </div>
    </section>
    <my-footer/>
  </div>
</template>

<script>
import NavBar from '~/components/Navigation/NavBar'
import MyFooter from '~/components/Footer/Footer'
export default {
  components: {
    NavBar,
    MyFooter
  },
  transition: 'fadeOpacity',
  props: {
    title: {
      type: String,
      default: process.env.TITLE_APP
    }
  },
  methods: {
    book() {
      if (this.$store.getters.getUser) {
        this.$router.push('/book')
        this.$store.commit('setAddress', null)
        this.$store.commit('setDate', null)
        this.$store.commit('setTime', null)
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>
</style>

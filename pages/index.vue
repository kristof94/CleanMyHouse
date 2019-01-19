<template>
  <div class="flexparent" style="height: 100vh;">
    <nav-bar/>
    <section id="home" class="homepage">
      <div style="text-align: center;">
        <h1>{{ title }}</h1>
        <h2>La propreté à votre service</h2>
        <h2>Nous nettoyons votre logement en 3 clics.</h2>
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
        /*
        if (this.$device.isMobile) {
          this.$router.push('/bookmobile')
        } else {
          this.$router.push('/book')
        }
        */
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>
</style>

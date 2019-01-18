<template>
  <div class="flexparent">
    <nav-bar :active-account-menu="false" :title="title"/>
    <section class="homepage">
      <h1 class="title">{{ error.statusCode }}</h1>
      <h2 class="info">{{ error.message }}</h2>
    </section>
    <my-footer/>
  </div>
</template>
<script>
import MyFooter from '~/components/Footer/Footer.vue'
import NavBar from '~/components/Navigation/NavBar'

export default {
  components: {
    NavBar,
    MyFooter
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      title: 'Clean My House'
    }
  }
}
</script>

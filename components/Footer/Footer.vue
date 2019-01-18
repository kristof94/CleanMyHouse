<template>
  <footer>
    <no-ssr>
      <cookie-law theme="base">
        <div slot="message">
          Nous utilions des cookies pour le fonctionnement de notre site.
          <a
            href="https://cuisine.journaldesfemmes.fr/recette/310548-american-cookies"
            target="_blank"
          >Notre recette</a>
        </div>
      </cookie-law>
    </no-ssr>
  </footer>
</template>

<script>
import CookieLaw from 'vue-cookie-law'
export default {
  components: { CookieLaw }
}
</script>
<style>
</style>

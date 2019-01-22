const pkg = require('./package')

module.exports = {
  mode: 'universal',
  dev: process.env.NODE_ENV !== 'production',
  vue: {
    config: {
      productionTip: process.env.NODE_ENV !== 'production',
      devtools: process.env.NODE_ENV !== 'production'
    }
  },
  env: {
    TITLE_APP: 'Clean my House',
    API_KEY: 'AIzaSyC38B7NGrKA5uz9w98-kBMbVp4qn1QCr34',
    AUTH_DOMAIN: 'cleanmyhouse-221915.firebaseapp.com',
    DB_URL: 'https://cleanmyhouse-221915.firebaseio.com',
    PROJECT_ID: 'cleanmyhouse-221915',
    STORAGE_BUCKET: 'cleanmyhouse-221915.appspot.com',
    MESSAGING_SENDER_ID: '207720984881',
    NODE_TLS_REJECT_UNAUTHORIZED: '0'
  },
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://js.stripe.com/v3/'
      },
      {
        src:
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyAWmSTK_5vW944i8kUyotoFxJaTRlr61ns&libraries=places'
      }
    ]
  },
  loading: '~/components/Navigation/Loading.vue',

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.css',
    '~/assets/css/animation.css',
    '~/assets/css/navbar.css',
    '~/assets/css/footer.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/scss/main.scss',
    'vue-datetime-custom/dist/vue-datetime-custom.css'
  ],

  /*
  ** Plugins to load before mounting the App

  */
  plugins: [
    { src: '~/plugins/axios' },
    { src: '~/plugins/vuex-persist', ssr: false },
    { src: '~/plugins/stripe', ssr: false },
    { src: '~/plugins/googleMaps', ssr: false },
    { src: '~/plugins/timepicker.js', ssr: false },
    { src: '~/plugins/flickity.js', ssr: false },
    { src: '~/plugins/sideBar.js', ssr: false },
    { src: '~/plugins/vue-mask.js', ssr: false },
    { src: '~/plugins/firebase-client-init.js', ssr: false },
    { src: '~/plugins/firebaseAuthChange.js', ssr: false },
    { src: '~/plugins/vue-scrollto.js' },
    { src: '~/plugins/fontAwesome' }
  ],
  router: {
    middleware: 'auth-check'
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/dotenv',
    'nuxt-device-detect',
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    https: true,
    proxy: true,
    baseURL: `http://${process.env.WEBSITE_HOSTNAME || 'localhost'}:${process
      .env.PORT || 3000}`
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.node = {
        fs: 'empty'
      }
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

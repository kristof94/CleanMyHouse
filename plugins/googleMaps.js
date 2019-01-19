/*import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAWmSTK_5vW944i8kUyotoFxJaTRlr61ns',
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    /// / If you want to set the version, you can do so:
    // v: '3.26',
  }
})*/
import Vue from 'vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

Vue.use(VueGoogleAutocomplete)

Vue.component('vue-google-autocomplete', VueGoogleAutocomplete)

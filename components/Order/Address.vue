<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">default header</slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <vue-google-autocomplete
                id="map"
                ref="address"
                class="form-control"
                placeholder="Entrer votre addresse"
                country="fr"
                @placechanged="getAddressData"
              />
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="close">Fermer</button>
              <button class="modal-default-button" @click="confirm">Confirmer</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      defaultAddress:
        this.$store.getters.getAddress == null
          ? null
          : this.$store.getters.getAddress,
      description:
        this.$store.getters.getAddress == null
          ? null
          : this.$store.getters.getAddress.description
    }
  },
  mounted() {
    // To demonstrate functionality of exposed component functions
    // Here we make focus on the user input
    this.$refs.address.focus()
    /*if (
      this.$store.getters.getAddress &&
      this.$store.getters.getAddress.description
    ) {
      document.getElementById(
        'map'
      ).value = this.$store.getters.getAddress.description
    }*/
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    getAddressData: function(addressData, placeResultData, id) {
      if (addressData) {
        addressData.description = this.$refs.address.$el.value
        this.defaultAddress = addressData
        this.description = this.defaultAddress.description
      }
    },
    close() {
      this.$emit('close')
    },
    confirm() {
      if (this.defaultAddress) {
        this.$emit('setPlace', this.defaultAddress)
      }
      this.$emit('close')
    }
  }
}
</script>

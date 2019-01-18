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
              <no-ssr>
                <GmapAutocomplete
                  :value="description"
                  class="form-control gmapautocomplete"
                  @place_changed="setPlace"
                />
              </no-ssr>
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
const getMapFromAddress = place => {
  var map = new Map()
  const arrayKey = ['street_number', 'route', 'locality']
  place.address_components.forEach(el => {
    if (el.types.length >= 1) {
      arrayKey.forEach(name => {
        if (el.types[0] === name) {
          map.set(el.types[0], el.long_name)
        }
      })
    }
  })
  const description = map
    .get('street_number')
    .concat(', ')
    .concat(map.get('route'))
    .concat(' ')
    .concat(map.get('locality'))
  return {
    street_number: map.get('street_number'),
    route: map.get('route'),
    locality: map.get('locality'),
    description: description
  }
}

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
  methods: {
    setPlace(place) {
      if (place) {
        this.defaultAddress = getMapFromAddress(place)
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

<style>
.pac-container,
.pac-logo {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

.modal-header {
  margin-top: 0;
  background-color: rgba(6, 175, 218, 0.8);
  padding-right: 10px;
  padding-left: 10px;
  font-size: 32px;
  color: #fff;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  border: none;
  padding: 10px 20px;
  background: transparent;
  font-size: 16px;
  color: rgba(6, 175, 218, 0.8);
  cursor: pointer;
  transition: color 0.3s;
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

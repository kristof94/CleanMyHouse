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
              <div class="text-center">
                <label class="checkbox_container">
                  Ménage
                  <input v-model="menage_checked" type="checkbox" @change="chooseClean">
                  <span class="checkmark"/>
                </label>
                <label class="checkbox_container">
                  Repassage
                  <input v-model="repassage_checked" type="checkbox" @change="chooseIron">
                  <span class="checkmark"/>
                </label>
              </div>
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
      repassage_checked: false,
      menage_checked: false
    }
  },
  methods: {
    chooseIron() {
      this.menage_checked = false
      this.repassage_checked = true
    },
    chooseClean() {
      this.menage_checked = true
      this.repassage_checked = false
    },
    close() {
      this.$emit('closeChoiceModal')
    },
    confirm() {
      if (this.menage_checked) {
        this.$emit('closeChoiceModal', 0)
        return
      }
      if (this.repassage_checked) {
        this.$emit('closeChoiceModal', 1)
      }
    }
  }
}
</script>

<style>
.checkbox_container {
  color: rgba(6, 175, 218, 0.8);
  display: inline-flex;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox_container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: white;
  border: solid 1px;
  border-color: rgba(6, 175, 218, 0.8);
}

/* On mouse-over, add a grey background color */
.checkbox_container:hover input ~ .checkmark {
  background-color: #f6f9fc;
}

/* When the checkbox is checked, add a blue background */
.checkbox_container input:checked ~ .checkmark {
  background-color: #f6f9fc;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.checkbox_container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.checkbox_container .checkmark:after {
  left: 4px;
  top: 0px;
  width: 15px;
  height: 17px;
  border: solid rgba(6, 175, 218, 0.8);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

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

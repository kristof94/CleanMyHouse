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
              <b-container>
                <b-row>
                  <b-col cols-lg="6" cols="6">
                    <div class="text-center">
                      <label class="checkbox_container">
                        Ménage
                        <input v-model="menage_checked" type="checkbox">
                        <span class="checkmark"/>
                      </label>
                    </div>
                  </b-col>
                  <b-col cols-lg="6" cols="6">
                    <div class="text-center">
                      <label class="checkbox_container">
                        Repassage
                        <input v-model="repassage_checked" type="checkbox">
                        <span class="checkmark"/>
                      </label>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12">*Libre à vous de communiquer à votre aide ménagère la répartition des heures de repassage et de ménage.</b-col>
                </b-row>
              </b-container>
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
    close() {
      this.$emit('closeChoiceModal')
    },
    confirm() {
      if (this.menage_checked && this.repassage_checked) {
        this.$emit('closeChoiceModal', 3)
        return
      }
      if (this.menage_checked) {
        this.$emit('closeChoiceModal', 1)
        return
      }
      if (this.repassage_checked) {
        this.$emit('closeChoiceModal', 2)
      }
    }
  }
}
</script>

<style>
.checkbox_container {
  color: rgb(123, 191, 207);
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
  border-color: rgb(123, 191, 207);
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
  border: solid rgb(123, 191, 207);
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>

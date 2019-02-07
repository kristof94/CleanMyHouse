<template>
  <b-form class="text-center">
    <b-form-group>
      <h1 style="cursor:pointer;">Ménage ou Repassage</h1>
      <span class="customIcon">
        <label class="checkbox_container">
          Ménage
          <input v-model="menage_checked" type="checkbox" @change="choiceMenage">
          <span class="checkmark"/>
        </label>
        <label class="checkbox_container">
          Repassage
          <input v-model="repassage_checked" type="checkbox" @change="choiceRepassage">
          <span class="checkmark"/>
        </label>
      </span>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  props: {
    repassage_checked: { type: Boolean, default: false },
    menage_checked: { type: Boolean, default: false }
  },
  methods: {
    choiceRepassage() {
      this.repassage_checked = true
      // this.menage_checked = false
    },
    choiceMenage() {
      // this.menage_checked = true
      this.repassage_checked = false
    }
  }
}
</script>

<style>
</style>

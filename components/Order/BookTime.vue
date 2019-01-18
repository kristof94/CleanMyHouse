<template>
  <b-form class="text-center">
    <b-form-group>
      <h1 style="cursor:pointer;" @click="open">Combien de temps ?</h1>
      <span :class="{ customIconAnimated: isActive }" class="customIcon" @click="open">
        <font-awesome-icon :icon="['far', 'clock']"/>
      </span>
    </b-form-group>
  </b-form>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    open(event) {
      this.$emit('open', event)
    }
  }
}
</script>

<style>
</style>

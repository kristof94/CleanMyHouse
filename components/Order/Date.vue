<template>
  <div class="resume">
    <div class="resume-text">Le {{ `Le ${date.setLocale('fr').toFormat('cccc dd LLLL')}.` }}</div>
    <div
      class="resume-text"
    >A {{ date.setLocale('fr').toFormat('hh') }}h{{ date.setLocale('fr').toFormat('mm') }}</div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  props: {
    date: {
      type: DateTime,
      default: null
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="resume">
    <div
      class="resume-text"
    >Le {{ date.get('weekdayLong') }} {{ date.get('day') }} {{ date.get('monthLong') }}</div>
    <div
      class="resume-text"
    >A {{ date.get('hour')=='0' ? '00' : date.get('hour') }}h{{ date.get('minute')=='0' ? '00' : date.get('minute') }}</div>
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

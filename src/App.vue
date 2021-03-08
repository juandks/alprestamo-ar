<template>
<div id="q-app" style="min-height: 100vh">
  <q-toolbar class="lt-sm text-white justify-center" style="background: #40A3F3;">
      <img src='/statics/alprestamo.svg' style="height: 2.3em">
  </q-toolbar>
  <router-view/>
</div>
</template>
<script>
export default {
  name: 'App'
}
</script>

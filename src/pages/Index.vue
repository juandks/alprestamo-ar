<template>
  <div class="flex row" style="min-height: 100vh">
    <div
      class="gt-sm col-md-7 flex items-top"
      style="background: #40A3F3;min-height:100vh; padding-top: 40vh"
    >
      <div class="row full-width justify-center">
        <img src="../statics/alprestamo.svg" style="height: 90px;" />
        <div class="row full-width justify-center">
          <div class="row full-width justify-center text-grey-3">
            <a
              href="https://alprestamo.com/"
              target="blank"
              class="text-grey-3"
              style="text-decoration: none; "
            >Home &nbsp;</a> | &nbsp;
            <a
              href="https://alprestamo.com/terminos-y-condiciones/"
              target="blank"
              class="text-grey-3"
              style="text-decoration: none; "
            >Términos y condiciones &nbsp;</a> | &nbsp;
            <a
              href="https://alprestamo.com/politica-de-privacidad/"
              target="blank"
              class="text-grey-3"
              style="text-decoration: none; "
            >Política de Privacidad</a>
          </div>
        </div>

        <div class="row full-width justify-center q-mt-lg"></div>
      </div>
    </div>
    <div class="col-md-5 col-xs-12 flex " style="min-height: 100%">
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
// import LandingForm from 'components/LandingForm.vue'
export default {
  name: 'Index',
  data () {
    return {}
  }
}
</script>

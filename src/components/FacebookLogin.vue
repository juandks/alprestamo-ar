<template>
  <div class="full-width">
    <q-btn unelevated class="full-width" size="1.3em" no-caps @click="logInWithFacebook"
    style="background-color: #4267b2">
      <q-avatar size="1.5em">
        <img src="../assets/facebook-logo.svg" />
      </q-avatar>
      <span class="text-white text-weight-regular">&nbsp; Ingresar con Facebook</span>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'facebookLogin',
  methods: {
    async logInWithFacebook () {
      await window.FB.login(function (response) {
        if (response.authResponse) {
          alert('You are logged in &amp; cookie set!')
          console.log(response)
          // Now you can redirect the user or do an AJAX request to
          // a PHP script that grabs the signed request from the cookie.
        } else {
          alert('User cancelled login or did not fully authorize.')
        }
      }, {
        scope: 'public_profile,email,user_birthday',
        returnScopes: true
      })
      return false
    },
    async initFacebook () {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: '521676805214213', // You will need to change this
          cookie: true, // This is important, it's not enabled by default
          version: 'v13.0'
        })
      }
    },
    async loadFacebookSDK (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }
  },
  created: async function () {
    await this.loadFacebookSDK(document, 'script', 'facebook-jssdk')
    await this.initFacebook()
  }
}
</script>
<style>
.button {
  color: white;
  min-width: 150px;
  background-color: #000000a1;
  height: 2.5rem;
  border-radius: 2rem;
  font-weight: 400;
  font-size: 0.8rem;
}
</style>

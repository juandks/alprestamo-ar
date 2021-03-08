/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
<template>
  <div class="row full-width justify-center flex items-center">
    <q-card flat style="max-width:410px;" class="full-width justify-center transparen">
      <q-inner-loading :showing="loading" class="transparent">
        <div class="text-center">
          <div class="justify-center items-center full-width flex"> <img style="margin-bottom: 5rem" src="../assets/alprestamo_loading.svg" height="180px"></div>
        <span
          class="text-weight-light text-h6 q-px-md "
        >
          Buscando el mejor prestamo para vos.. faltan
          <b>{{timer}}</b> segundos..
        </span> </div>
      </q-inner-loading>

      <q-card-section
        class="q-gutter-y-md q-pt-xs"
        v-bind:style=" loading ? 'filter: blur(7px);' : '' "
      >
        <q-form @submit="Load()" class="q-gutter-y-md row full-width justify-center">
          <div class="row full-width justify-center">
            <span class="text-h5 text-weight-light text-center">Encontrá ofertas de préstamos</span>

          </div>
          <div class="row full-width">
            <div class="col-12 text-center q-mb-xs"><span class=" text-grey-7">Ingresa el monto que necesitas</span></div>
            <div class="col-12">
              <q-input
                v-model="user.amount"
                dense
                color="blue"
                autofocus
                type="tel"
                ref="amount"
                mask="$ #"
                placeholder="ej: $5.000"
                reverse-fill-mask
                unmasked-value
                input-class="text-h6 text-weight-light text-center"
                standout="bg-blue"
                :rules="[ value => value <= 250000 && value >= 1000 || 'Podés solicitar de $1.000 a $250.000' ]"
                hide-bottom-space
                :disable="loading"
              ></q-input>
            </div>
          </div>
          <div class="row full-width">
            <div class="col-6 q-pr-xs">
              <q-input
                outlined
                dense
                color="blue"
                v-model="user.firstName"
                :rules=" [val => !!val || 'Completá tu nombre']"
                type="text"
                placeholder="Nombre"
                hide-bottom-space
                :disable="loading"
              />
            </div>
            <div class="col-6 q-pl-xs">
              <q-input
                outlined
                dense
                hide-bottom-space
                color="blue"
                v-model="user.lastName"
                :rules=" [val => !!val || 'Completá tu apellido']"
                type="text"
                placeholder="Apellido"
                :disable="loading"
              />
            </div>
          </div>

          <div class="row full-width">
            <div class="col-4 q-pr-xs">
              <q-input
                outlined
                color="blue"
                v-model="user.nationalId"
                dense
                type="tel"
                placeholder="DNI"
                :rules="[ val => this.user.nationalId.length >= 8 || 'Documento Inválido' ]"
                unmasked-value
                mask="##.###.###"
                hide-bottom-space
                :disable="loading"
              />
            </div>
            <div class="col-8 q-pl-xs">
              <!-- <q-input
                v-model="user.birthdate"
                dense
                outlined
                stack-label
                mask="##/##/####"
                placeholder="Fecha de Nacimiento"
                hint="Dia/Mes/Año"
                :rules="[ val => !!val && validDate(val) || 'Fecha Invalida']"
                hide-bottom-space
                color="blue"
              />-->
              <!-- hint="Dia-Mes-Año" -->
              <q-input
                @click="$refs.qDateProxy.show()"
                placeholder="Fecha de Nacimiento"
                filled
                color="blue"
                mask="##/##/####"
                dense
                hide-bottom-space
                v-model="user.dateOfBirth"
                :rules="[val => validDate(val) || 'Fecha inválida', val => val !== '' || 'Fecha inválida', val => val.length === 10 || 'Fecha inválida']"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date
                        mask="DD/MM/YYYY"
                        default-year-month="1990/00"
                        default-view="Years"
                        color="blue"
                        v-model="user.dateOfBirth"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row full-width">
            <div class="col-4 q-pr-xs">
              <q-select
                filled
                color="blue"
                v-model="user.gender"
                type="text"
                label="Sexo"
                :rules="[ val => !!val || 'Elegí una opción']"
                :options="genderOptions"
                hide-bottom-space
                emit-value
                map-options
                dense
                :disable="loading"
              />
            </div>
            <div class="col-8 q-pl-xs">
              <q-select
                v-model="user.taxStatus"
                :options="taxConditions"
                :rules="[ val => !!val || 'Elegí una opción']"
                label="Situacion"
                filled
                color="blue"
                dense
                emit-value
                map-options
                hide-bottom-space
                :disable="loading"
              />
            </div>
          </div>
          <div class="row full-width">
            <div class="col-12">
              <q-select
                v-model="user.bankCode"
                color="blue bg-grey-12"
                :options="bankCodeOptions"
                filled
                hide-bottom-space
                use-input
                placeholder="Banco"
                dense
                label="Banco"
                fill-input
                hide-selected
                input-debounce="0"
                popup-content-style="padding-bottom: 1  5px"
                @filter="filterBank"
                :rules="[ val => !!val || 'Elegí tu banco']"
                emit-value
                map-options
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="account_balance" />
                </template>
              </q-select>
            </div>
          </div>
          <div class="row full-width">
            <div class="col">
              <q-input
                v-model="user.email"
                outlined
                dense
                color="blue"
                type="email"
                placeholder="Email"
                :rules="[ val => ValidateEmail(val) || 'Introducí un email válido', val => ValidateEmailDomain(val) || 'Verificá que tu correo este bien escrito' ]"
                hide-bottom-space
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row full-width">
            <div class="col">
              <q-input
                prefix="( +54 )"
                v-model="user.fullPhone"
                dense
                type="tel"
                placeholder="Teléfono"
                mask="##########"
                maxlength="10"
                outlined
                color="blue"
                :rules="[ val => ValidatePhoneArea(val) || 'Verificá tu código de area y que no contenga 0', val => ValidatePhonePrefix() || 'No incluyas el 15 despues del codigo de area', val => val.length === 10  || 'Verifica que tu celular tenga 10 digitos, sin cero ni 15' ]"
                hint="Completá tu celular con código de area sin 0 ni 15"
                :disable="loading"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row full-width">
            <q-btn

              size="1.5em"
              unelevated
              style="border-radius: 5px"
              class="full-width"
              color="blue"
              label="OK"
              type="submit"
              :disable="loading"
            />
            <!-- <div class="full-width row q-mt-sm">
              <GoogleLogin
                class="full-width"
                style="background-color: white; border: 0px;padding:0px;"
                :params="params"
                :onSuccess="onSuccess"
                :onFailure="onFailure"
              >
                <q-btn
                  unelevated
                  class="full-width"
                  outline
                  color="grey-5"
                  size="1.3em"
                  no-caps
                  style="border-radius:4px;"
                >
                <q-avatar  size="1.5em">
            <img src="../assets/google-logo.svg" >
                </q-avatar>
                <span class="text-grey-6 text-weight-regular">&nbsp; Ingresar con Google</span>
                </q-btn>
              </GoogleLogin>
            </div>
            <div class="full-width row q-mt-sm">
              <FacebookLogin/>
            </div>-->
          </div>
          <div class="row full-width"> <q-checkbox right-label v-model="optin" label="Acepto los términos y condiciones del servicio" color="blue" /></div>
        </q-form>
<!--
        <q-btn color="primary" icon="check" label="TEST MIXPANEL TRACKING IDS" @click="setTrackingIds()" /> -->

        <!-- <landing-bulletpoints /> -->
      </q-card-section>
    </q-card>
    <div class="row full-width text-center justify-center q-mb-md">
    <span class="text-caption q-pa-xl text-justify text-grey-7"> GALERENT SRL (Dirección: Roosevelt 1702, 5ºA (C1428BNF), Buenos Aires, Argentina. Teléfono: 0800-ALPRESTAMO. CUIT 30715157299) - El sitio provee de funciones para interesados en brindar a empresas de intermediación financiera sus datos, a los efectos de que las mismas analicen la posibilidad de aprobar créditos en su nombre. Los enlaces desde este Sitio web a sitios web de terceros se muestran únicamente con fines informativos. No nos hacemos responsables de su contenido, ya que no comprobamos estos sitios web. Usted es el único responsable del uso de los enlaces a otras páginas web que se muestren en nuestro Sitio web. Le sugerimos que lea las condiciones de uso de estas páginas. El Usuario autoriza a que sus datos sean cedidos a la EIF con este fin. El usuario podrá solicitar ser eliminado mediante el envío de un mail a contacto@alprestamo.com con el Asunto "Desuscribirme" y el número de documento de Identidad en el cuerpo del mail.Información financiera. El otorgamiento del préstamo personal, se encuentra sujeto a calificación crediticia y condiciones de contratación. En caso de otorgarse el préstamo personal, el monto, plazo, tasa de interés y demás condiciones, serán establecidos por la EIF elegida - en función del resultado que arroje la calificación crediticia efectuada sobre la base de sus políticas vigentes al momento del otorgamiento mismoPréstamos personales monto en pesos: máximo $ 200.000, mínimo $ 1.000. Plazo: máximo 36 meses, mínimo 3 meses. Ej. Para un préstamo de 200.000 en 36 meses: Tasa Nominal Anual fija ( 88.8%), Tasa Efectiva Anual fija ( 192.47%). Costo Financiero Total Nominal Anual: 112.19%. Ej. Para un préstamo de $5.000 a 90 días con TNA de 88.8% el cliente devolverá $5949.21 Tasa Máxima Efectiva Anual: 192.47%.
Tasa Mínima Efectiva Anual: 25%. Todos los costos aquí detallados son solamente a título informativo, no constituyen una oferta y pueden variar al momento de solicitarlos, sin previo aviso. Asimismo, están sujetos a políticas de mercado y/o internas de cada entidad.</span>
      &nbsp;
      <a
        href="https://alprestamo.com/terminos-y-condiciones/"
        target="blank"
        class="text-grey-7 "
        style="text-decoration: none;"
      >Términos y condiciones &nbsp;</a> | &nbsp;
      <a
        href="https://alprestamo.com/politica-de-privacidad/"
        target="blank"
        class="text-grey-7 "
        style="text-decoration: none; "
      >Política de Privacidad</a>
    </div>
  </div>
</template>

<script>
// import LandingBulletpoints from './LandingBulletpoints.vue'
import bankCodes from '../utils/bank_codes.js'
import phoneAreaCodes from '../utils/area_codes.js'
import dirtyDomains from '../utils/dirtyDomains.js'
import { mapState } from 'vuex'
// import { mapState } from 'vuex'
import moment from 'moment'
// import GoogleLogin from 'vue-google-login'
// import FacebookLogin from 'components/FacebookLogin.vue'

export default {
  data () {
    return {
      params: {
        client_id:
          '466543665618-tok3f121n1cvo2o0nr8ggscou46ji2n6.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/userinfo.profile'
      },
      isPreload: false,
      timer: 30,
      optin: true,
      dirtyDomains: dirtyDomains,
      bankCodeOptions: bankCodes,
      areaCodes: phoneAreaCodes,
      taxConditions: [
        { label: 'Empleado', value: 'employee' },
        { label: 'Empleado Público', value: 'publicEmployee' },
        { label: 'Monotributista', value: 'monotributista' },
        { value: 'independent', label: 'Trabajador Independiente' },
        { label: 'Jubilado', value: 'retired' },
        { label: 'Autónomo', value: 'autonomous' },
        { value: 'beneficiary', label: 'Beneficiario de Plan' },
        { label: 'Desempleado', value: 'unemployed' },
        { label: 'Otro', value: 'other' }
      ],
      genderOptions: [
        { label: 'Hombre', value: 'male' },
        { label: 'Mujer', value: 'female' }
      ],
      loading: false,
      user: {
        firstName: '',
        fullPhone: '',
        lastName: '',
        amount: '',
        nationalId: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        bankCode: '',
        phoneArea: '',
        phone: '',
        taxStatus: ''
      }
    }
  },
  methods: {
    setTrackingIds () {
      const payload = {}
      payload.hjid = window.hj.globals.get('userId')
      payload.distinctId = this.$mixpanel.get_distinct_id()
      this.$store.commit('User/SET_TRACKING_IDS', payload)
    },

    mixpanelLandingLoad () {
      this.$mixpanel.track('Landing', {
        isPreload: this.isPreload,
        utm_source: this.mktInfo.utmSource,
        utm_medium: this.mktInfo.utmMedium,
        utm_campaign: this.mktInfo.utmCampaign,
        ...this.mktInfo
      })

      // eslint-disable-next-line no-trailing-spaces
    },
    // onSuccess (googleUser) {
    //   console.log(googleUser)
    //   console.log(googleUser.getGrantedScopes())
    //   // This only gets the user information: id, name, imageUrl and email
    //   console.log(googleUser.getBasicProfile())
    // },

    // emitEvent () {
    //   this.$analytics.fbq.event('Lead Apto')
    //   console.log('Emitted')
    // },
    async preLoad () {
      // eslint-disable-next-line no-undef
      // console.log(hj.globals.get('userId'))
      const { firstName, lastName, nationalId, birthdate, gender, taxStatus, amount, email, fullPhone, bankCode } = this.$route.query
      if (this.$route.query.loadDetails === 'true') {
        this.isPreload = true
        this.user = { firstName, lastName, nationalId, birthdate, gender, amount, taxStatus, email, fullPhone, bankCode }
      }
    },
    startTimer () {
      this.timer = 50
      this.loading = true
      this.$q.loadingBar.start(600)
      const interval = setInterval(() => {
        if (this.timer > 0) {
          this.timer = this.timer - 1
          this.$q.loadingBar.increment(1)
        } else {
          clearInterval(interval)
        }
      }, 1000)
    },
    saveDetails () {
      this.$q.localStorage.set('user', this.user)
      this.$store.commit('User/SET_USER', this.user)
    },
    dispatch () {
      this.$store.dispatch('User/SET_DEVICE_INFO', this.user)
    },

    ValidatePhoneArea () {
      const results = []
      const matchedAreaCodes = []
      this.user.phoneArea = ''
      this.areaCodes.forEach(element => {
        if (this.user.fullPhone.startsWith(element)) {
          results.push(true)
          matchedAreaCodes.push(element)
        }
      })
      if (matchedAreaCodes.length > 0) {
        this.user.phoneArea = matchedAreaCodes[0]
        this.user.phone = this.user.fullPhone.slice(
          this.user.phoneArea.length,
          10
        )
      }

      return results.includes(true)
    },
    ValidatePhonePrefix () {
      return !this.user.phone.startsWith('15')
    },
    ValidateEmailDomain (value) {
      return !dirtyDomains.includes(this.user.email.split('@')[1])
    },

    ValidateEmail (value) {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return true
      }
      return false
    },
    filterBank (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.bankCodeOptions = bankCodes.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        )
      })
    },
    validDate (date) {
      return (
        moment(date, 'DD-MM-YYYY').isValid() &&
        moment(date, 'DD-MM-YYYY').isBefore(moment())
      )
    },

    fillForm () {
      if (this.$q.localStorage.has('user')) {
        const savedUser = this.$q.localStorage.getItem('user')
        this.user = savedUser
      }
    },
    async Load () {
      this.saveDetails()
      this.startTimer()
      this.$mixpanel.identify(this.user.nationalId)
      this.$mixpanel.people.set({
        hjid: this.mktInfo.hjid,
        amount: this.user.amount
      })

      this.$mixpanel.people.set_once({
        $email: this.user.email,
        $first_name: this.user.firstName,
        $last_name: this.user.lastName,
        $phone: this.user.fullPhone,
        fecha_registro: new Date(),
        sexo: this.user.gender,
        taxStatus: this.user.taxStatus,
        bankCode: this.user.bankCode,
        nationalId: this.user.nationalId,
        dateOfBirth: this.user.dateOfBirth, // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
        utm_source: this.mktInfo.utmSource,
        utm_medium: this.mktInfo.utmMedium,
        utm_campaign: this.mktInfo.utmCampaign,
        ad: this.mktInfo.ad,
        adGroup: this.mktInfo.adGroup,
        campaign: this.mktInfo.campaign,
        device: this.mktInfo.device,
        glicd: this.mktInfo.glicd,
        country: 'AR'

      })
      this.loading = true
      try {
        this.$mixpanel.track('Envio de Datos', {
          amount: this.user.amount,
          utm_source: this.mktInfo.utmSource,
          utm_medium: this.mktInfo.utmMedium,
          utm_campaign: this.mktInfo.utmCampaign,
          ...this.mktInfo
        })
        const user = this.user
        const mktInfo = this.$route.query
        await this.$store.dispatch('User/CREATE_LEAD', {
          user: user,
          mktInfo: mktInfo
        })
        this.$q.loadingBar.stop()
        this.loading = false
        if (this.$store.state.User.status === 200) {
          this.$mixpanel.track('Lead con Ofertas', {
            utm_source: this.mktInfo.utmSource,
            utm_medium: this.mktInfo.utmMedium,
            utm_campaign: this.mktInfo.utmCampaign,
            ...this.mktInfo
          })
          this.$analytics.fbq.event('track', 'Lead')
          this.$ga.page('/Ofertas')
          this.$ga.event('Lead', 'Ver Ofertas', 'Ver Ofertas', 0)
          this.$router.push('ofertas')
        } else if (this.$store.state.User.status === 404) {
          this.$mixpanel.track('Lead sin Ofertas', {
            utm_source: this.mktInfo.utmSource,
            utm_medium: this.mktInfo.utmMedium,
            utm_campaign: this.mktInfo.utmCampaign,
            ...this.mktInfo

          })
          this.loading = false
          this.$ga.page('/Ofertas')
          this.$ga.event('Lead', 'Ver Ofertas', 'Ver Ofertas', 0)
          this.$router.push('ofertas')
        } else {
          this.loading = false
          this.$q.notify({
            message:
              'Se ha producido un error en su solicitud, verifique sus datos',
            color: 'red'
          })
        }
      } catch (error) {
        this.loading = false
        this.$q.notify({
          message:
            'Se ha producido un error en su solicitud, verifique sus datos',
          color: 'red'
        })
        console.log(error)
      }
    }
  },
  watch: {
    'user.nationalId': function (newData, oldData) {
      this.saveDetails()
    },
    'user.amount': function (newData, oldData) {
      this.saveDetails()
    },
    'user.email': function (newData, oldData) {
      this.saveDetails()
    },
    'user.bankCode': function (newData, oldData) {
      this.saveDetails()
    },
    'user.gender': function (newData, oldData) {
      this.saveDetails()
    },
    'user.fullPhone': function (newData, oldData) {
      this.saveDetails()
    },
    'user.phoneArea': function (newData, oldData) {
      this.saveDetails()
    },
    'user.taxStatus': function (newData, oldData) {
      this.saveDetails()
    },
    'user.dateOfBirth': function (newData, oldData) {
      this.saveDetails()
    }
  },
  computed: {
    ...mapState({
      mktInfo: state => state.User.mktInfo
    })
  },

  mounted () {
    this.preLoad()
    this.setTrackingIds()
    this.mixpanelLandingLoad()
  },
  created: function () {
    this.fillForm()
  },
  beforeMount () {
    this.$ga.page('/landing')
  },

  components: {
    // LandingBulletpoints
    // GoogleLogin,
    // FacebookLogin
  }
}
</script>

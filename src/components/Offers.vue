<template>
  <div
    :class="
      $q.screen.xs
        ? 'bg-grey-3 row full-width justify-center flex  q-pt-xl q-px-sm'
        : 'row full-width justify-center flex items-center  q-px-sm'
    "
  >
    <noscript>
      <img
        src="https://ad.doubleclick.net/ddm/activity/src=10244559;type=invmedia;cat=botno0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;gdpr=${GDPR};gdpr_consent=${GDPR_CONSENT_755};ord=1?"
        width="1"
        height="1"
        alt=""
      />
    </noscript>
    <q-dialog v-model="carPlanPopUp" persistent>
      <q-card>
        <q-card-section class="row items-center justify-center">
          <q-avatar icon="airport_shuttle" color="primary" text-color="white" />
          <span class="q-ml-sm q-mt-md"
            >Te vamos a estar contactando por email y teléfono para mostrarte
            ofertas de planes Auto Ahorro</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Continuar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="sms_validation" persistent>
      <q-card style="max-width: 350px; min-width: 300px">
        <q-card-section class="text-center">
          <div class="text-h6 text-center q-mt-md">Valida tu celular</div>

          <div class="q-mt-sm">
            <span class="text-grey-7"
              >Confirma tu celular para
              <b>recibir ofertas personalizadas</b></span
            >
          </div>
          <div class="q-my-lg text-h6 text-blue">
            <q-icon name="phone" /> +54 ({{ this.user.user.phoneArea }})
            {{ this.user.user.phone }}
            <div
              class="text-caption text-blue"
              @click="changePhone"
              style="cursor: pointer"
            >
              ¿No es tu numero?
            </div>
          </div>
          <div>
            <span class="text-bold"
              >Ingresa el codigo del SMS que recibiste</span
            >
          </div>
          <div class="q-mt-md">
            <q-input
              v-model="token"
              :disabled="loading"
              class="flex full-width"
              input-class="text-center text-h4"
              mask="#  #  #  #"
              type="tel"
              unmasked-value
              placeholder="_ _ _ _"
              no-error-icon
              error-message="* El codigo de validacion es incorrecto"
              outlined
            ></q-input>
          </div>
          <div>
            <q-btn
              color="primary"
              class="full-width q-mt-md"
              style="height: 45px"
              unelevated
              label="CONFIRMAR"
              @click="validateToken"
              :disable="loading"
              :loading="loading"
            />
          </div>
          <div>
            <q-btn
              color="primary"
              class="full-width q-mt-md"
              outline
              style="height: 45px"
              unelevated
              @click="skipValidation()"
              label="Continuar sin validar"
              :disable="loading"
            />
          </div>
          <div class="q-mt-md">
            <button
              @click="checkWenanceOffers"
              style="background-color: white; border: 0; cursor: pointer"
            >
              <u class="text-blue">Reenviar otro codigo</u>
            </button>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialog" persistent transition-show="flip-down">
      <q-card
        v-if="dialogOffer.fintech_id === '5fd8f16dc8d0de148878ae81'"
        style="min-width: 30vw; max-width: 420px"
        class="flex"
      >
        <q-tab-panels v-model="tab" animated class="full-width">
          <q-tab-panel name="form" class="full-width">
            <q-form @submit="sendEfectivoSiApplication" class="row full-width">
              <q-card-section class="row items-center justify-center">
                <q-avatar round size="80px" class="q-mt-sm q-mb-md">
                  <img :src="dialogOffer.image_url" rel="preload" />
                </q-avatar>

                <div class="row full-width text-justify q-my-md">
                  Para ver esta oferta es necesario que completes unos datos
                  extra
                </div>
                <q-input
                  v-model="netIncome"
                  mask="######"
                  type="tel"
                  label="Salario Mensual neto"
                  :rules="[
                    (val) =>
                      (val > 0 && val < 300000) || 'Ingrese un valor real',
                  ]"
                  class="row full-width q-mt-2"
                  hide-bottom-space
                  outlined
                  :disable="loading"
                  filled
                  color="black"
                  prefix="$"
                  style="font-size: 1.1rem"
                />
                <div class="row full-width text-justify q-mt-md">
                  <q-select
                    v-model="province"
                    :options="provinces"
                    emit-value
                    label="Provincia"
                    filled
                    :rules="[(val) => val !== '' || 'Seleccione su provincia']"
                    @input="branchId = ''"
                    class="full-width"
                    :disable="loading"
                    hide-bottom-space
                    color="black"
                  />
                </div>
                <div class="row full-width text-justify q-mt-md">
                  <q-select
                    filled
                    v-model="branchId"
                    map-options
                    emit-value
                    :rules="[(val) => val !== '' || 'Seleccione su sucursal']"
                    :options="filterBranches"
                    label="Sucursal"
                    :disable="loading"
                    class="full-width"
                    hide-bottom-space
                    color="black"
                  />
                </div>
                <div class="row full-width text-justify q-mt-md">
                  <q-select
                    filled
                    v-model="proffessionId"
                    map-options
                    emit-value
                    :rules="[(val) => val !== '' || 'Seleccione su profesión']"
                    :options="options"
                    label="Profesión"
                    hide-bottom-space
                    class="full-width"
                    color="black"
                    :disable="loading"
                  />
                </div>
                <div></div>
              </q-card-section>
              <q-card-actions class="full-width">
                <q-btn
                  :disable="loading"
                  :loading="loading"
                  label="Enviar"
                  type="submit"
                  color="primary"
                  class="full-width bg-red"
                  unelevated
                />
                <q-btn
                  :disable="loading"
                  flat
                  label="CERRAR"
                  class="full-width"
                  color="black"
                  v-close-popup
                />
              </q-card-actions>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="rejected">
            <div class="row full-width flex justify-center">
              <q-avatar
                size="100px"
                font-size="52px"
                color="red"
                text-color="white"
                icon="close"
              />
            </div>
            <div class="row full-width justify-center q-mt-md">
              <span class="text-h6 q-mt-md"> Tu solicitud fue rechazada</span>
              <span class="text-justify q-mt-md"
                >Lamentablemente <b>Efectivo Si</b> no aprobó tu solicitud.
                Puedes volver a enviar tus datos nuevamente si crees que que
                hubo un error o introduciste datos de forma incorrecta</span
              >
            </div>
            <div class="row-full-width q-mt-md">
              <q-btn
                color="red"
                label="Reintentar"
                @click="tab = 'form'"
                class="full-width q-mb-sm"
                unelevated
              />
              <q-btn
                color="black"
                label="Cerrar"
                v-close-popup
                unelevated
                class="full-width"
                flat
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="approved">
            <div class="row full-width flex justify-center">
              <q-avatar
                size="100px"
                font-size="52px"
                color="green"
                text-color="white"
                icon="check"
              />
            </div>
            <div class="row full-width justify-center">
              <span class="text-h6 q-mt-md">Tu solicitud fue aceptada</span>
              <span class="text-justify q-mt-md"
                >¡Felicitaciones! <b>Efectivo Si</b> aprobó tu solicitud. En
                breve se contactaran con vos para avanzar con la solicitud.</span
              >
              <span class="text-caption q-mt-md justify-center">* También podes llamar para completar tu solicitud mas rápido</span>

            <q-btn color="blue" unelevated icon="phone" label="Llamar" class="full-width q-mt-md" type="a" target="_blank" href="tel:08003330555" />
            </div>
            <div class="row-full-width q-mt-md">
              <q-btn
                color="black"
                label="Cerrar"
                v-close-popup
                unelevated
                class="full-width"
                flat
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-card
        v-else-if="(dialogOffer.fintech_name === 'Cerrocred')"
        class="flex justify-center"
        style="min-width: 350px"
      >
        <q-tab-panels v-model="cerrocredTabs" animated style="padding: 0px">
          <q-tab-panel
            name="STARTED"
            style="padding: 0px"
            class="flex justify-center"
          >
            <q-avatar round size="80px" class="q-mt-sm q-mb-md">
              <img :src="dialogOffer.image_url" rel="preload" />
            </q-avatar>
            <div class="row full-width text-h6 justify-center">
              {{ dialogOffer.fintech_name }}
            </div>
            <div class="row full-width text-body2 text-justify q-mt-md q-px-md">
              {{ dialogOffer.description }}
            </div>
            <q-form @submit="submitToCerroCred" style="padding: 0px">
              <q-card-section class="row items-center justify-center">
                <div class="row full-width q-mt-sm">
                  <div class="col-12">
                    <q-select
                      v-model="offerAmount"
                      prefix="$"
                      hide-bottom-space
                      :rules="[
                        (n) => n > 0 || 'Introduzca el monto solicitado',
                      ]"
                      :options="FILTERED_AMOUNTS"
                      label="Monto Solicitado"
                      outlined
                      emit-value
                      @input="getInstallmentOptions(dialogOffer)"
                    />
                  </div>
                </div>
                <div class="row full-width q-mt-md">
                  <div class="col-12">
                    <q-select
                      emit-value
                      v-model="installments"
                      :rules="[
                        (n) => n > 0 || 'Introduzca la cantidad de cuotas',
                      ]"
                      hide-bottom-space
                      :options="installmentOptions"
                      label="Cantidad de Cuotas"
                      outlined
                      @input="getInstallmentValues()"
                    />
                  </div>
                  <div
                    class="col-12 q-mt-lg text-h5 text-center font-weight-thin text-blue"
                    v-if="installments && offerAmount"
                  >
                    <b>{{ installments }}</b> cuotas de
                    <b>${{ installmentValue }}</b>
                  </div>
                </div>
                <q-btn
                  color="blue"
                  class="full-width q-mt-md"
                  unelevated
                  label="Solicitar"
                  :loading="loading"
                  :disable="loading"
                  type="sumbit"
                />
                <q-btn
                  color="primary"
                  class="full-width q-mt-sm"
                  flat
                  label="cerrar"
                  v-close-popup
                />
              </q-card-section>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="APPROVED">
            <div class="row full-width flex justify-center">
              <q-avatar
                size="100px"
                font-size="52px"
                color="green"
                text-color="white"
                icon="check"
              />
            </div>
            <div class="row full-width justify-center">
              <span class="text-h6 q-mt-md">Tu solicitud fue aceptada</span>
              <span class="text-justify q-mt-md"
                >¡Felicitaciones! <b>Cerrocred</b> aprobó tu solicitud. En breve
                se contactaran con vos para avanzar con la solicitud</span
              >
              <q-btn
                color="primary"
                class="full-width q-mt-sm"
                flat
                label="cerrar"
                v-close-popup
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="REJECTED">
            <div class="row full-width flex justify-center">
              <q-avatar
                size="100px"
                font-size="52px"
                color="red"
                text-color="white"
                icon="close"
              />
            </div>
            <div class="row full-width justify-center">
              <span class="text-h6 q-mt-md">Tu solicitud no fue aceptada</span>
              <span class="text-justify q-mt-md"
                >Lamentablemente <b>Cerrocred</b> rechazó tu solicitud</span
              >
              <q-btn
                color="primary"
                class="full-width q-mt-sm"
                flat
                label="cerrar"
                v-close-popup
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="ERROR">
            <div class="row full-width flex justify-center">
              <q-avatar
                size="100px"
                font-size="52px"
                color="red"
                text-color="white"
                icon="close"
              />
            </div>
            <div class="row full-width justify-center">
              <span class="text-h6 q-mt-md">Se ha producido un error</span>
              <span class="text-justify q-mt-md"
                >Vuelva a intentar nuevamente</span
              >
              <q-btn
                color="primary"
                class="full-width q-mt-sm"
                flat
                label="cerrar"
                v-close-popup
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-card v-else style="min-width: 20vw; max-width: 420px">
        <q-card-section class="row items-center justify-center">
          <q-avatar round size="80px" class="q-mt-sm q-mb-md">
            <img :src="dialogOffer.image_url" rel="preload" />
          </q-avatar>
          <div class="row full-width text-h6 justify-center">
            {{ dialogOffer.fintech_name }}
          </div>
          <div class="row full-width text-body2 text-justify q-mt-md">
            {{ dialogOffer.description }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            unelevated
            class="full-width"
            label="SOLICITAR"
            color="blue"
            type="a"
            :href="dialogOffer.url"
            target="__blank"
            v-if="dialogOffer.url && dialogOffer.url != ''"
            @click="openUrl(dialogOffer)"
          />
          <q-btn
            flat
            label="CERRAR"
            class="full-width"
            color="black"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card style="max-width: 410px" :class=" $q.screen.xs ? 'full-width justify-center self-start' : 'full-width justify-center' ">
      <!-- <q-linear-progress color="info" indeterminate /> -->
      <q-card-section v-if="status === 404">
        <div class="text-subtitle1">
          <q-icon name="close" color="red" class="q-mb-xs q-mr-xs" />SIN OFERTAS POR EL MOMENTO
        </div>
        <div class="q-mt-sm text-body2 text-weight-light text-justify">
          Lamentablemente en este momento no encontramos ofertas convenientes para vos.
          Te invitamos a hacer clic en el siguiente link para encontrar opciones.
        </div><a
        href="https://alprestamo.com/ar/blog/?utm_source=ofertas&utm_medium=ofertas&utm_campaign=alprestamo">
            <q-card class="my-card q-mt-md">
      <q-img
        src="https://app.alprestamo.com/statics/banner-alprestamo.svg"
        basic
      >
      </q-img>
    </q-card>
    </a>
      </q-card-section>
      <q-card-section v-if="APPROVED_OFFERS.length > 0 && status === 200">
        <div class="text-subtitle1">
          <q-icon name="chevron_right" class="q-mb-xs q-mr-xs" />PRESTAMOS
          APROBADOS
        </div>
        <div class="q-mt-sm text-body2 text-weight-light text-justify">
          Estas son las ofertas para las que calificas
        </div>
      </q-card-section>
      <q-list class="full-width" v-if="APPROVED_OFFERS.length > 0">
        <q-item
          v-ripple
          class="q-my-md"
          v-for="approvedOffer in APPROVED_OFFERS"
          :key="approvedOffer.fintech_id"
          clickable
          @click="openDialog(approvedOffer)"
        >
          <q-item-section avatar>
            <q-avatar round size="50px">
              <img :src="approvedOffer.image_url" rel="preload" />
            </q-avatar>
          </q-item-section>
          <q-item-section top>
            <q-item-label lines="1">
              <span class="text-weight-medium">{{
                approvedOffer.fintech_name
              }}</span>
            </q-item-label>
            <q-item-label caption lines="1">
              <span class="text-weight-regular text-grey-10">
                ${{ approvedOffer.min_amount }} a ${{
                  approvedOffer.max_amount
                }}
                <br />
              </span>
              <span class="text-weight-light"
                >{{ approvedOffer.min_installments }} a
                {{ approvedOffer.max_installments }}
                {{
                  approvedOffer.period_unit
                    ? approvedOffer.period_unit
                    : "meses"
                }}</span
              >
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-btn unelevated color="blue" label="VER" />
          </q-item-section>
        </q-item>

        <q-separator
          spaced
          v-if="CREDITCARD_OFFERS.length > 0 && APPROVED_OFFERS.length > 0"
        />
      </q-list>

      <div>
        <q-card-section
          v-if="UNSELECTED_OFFERS.length > 0 && APPROVED_OFFERS.length > 0"
        >
          <div class="text-subtitle1">
            <q-icon name="chevron_right" />OTRAS OFERTAS
          </div>
          <div class="text-subtitle2 text-weight-light">
            También podes consultar estas opciones
          </div>
        </q-card-section>
        <q-card-section
          v-if="UNSELECTED_OFFERS.length > 0 && APPROVED_OFFERS.length === 0"
        >
          <div class="text-subtitle1">
            <q-icon name="chevron_right" />OFERTAS
          </div>
          <div class="text-subtitle2 text-weight-light">
            Estas son tus ofertas
          </div>
        </q-card-section>
        <q-list class="full-width q-mb-md">
          <q-item
            v-ripple
            v-for="unselectedOffer in UNSELECTED_OFFERS"
            :key="unselectedOffer.fintech_id"
            class="q-my-xs"
          >
            <q-item-section avatar>
              <q-avatar round size="50px">
                <img :src="unselectedOffer.image_url" rel="preload" />
              </q-avatar>
            </q-item-section>
            <q-item-section top>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{
                  unselectedOffer.fintech_name
                }}</span>
              </q-item-label>
              <q-item-label caption lines="1">
                <span class="text-weight-regular text-grey-10">
                  ${{ unselectedOffer.min_amount }} a ${{
                    unselectedOffer.max_amount
                  }}
                  <br />
                </span>
                <span
                  class="text-weight-light"
                  v-if="unselectedOffer.fintech_name !== 'HSBC'"
                  >{{ unselectedOffer.min_installments }} a
                  {{ unselectedOffer.max_installments }}
                  {{
                    unselectedOffer.period_unit
                      ? unselectedOffer.period_unit
                      : "meses"
                  }}</span
                >
                <!-- VISA -->
              </q-item-label>
            </q-item-section>
            <q-item-section class="text-center">
              <q-btn
                unelevated
                color="blue"
                label="CONSULTAR"
                @click="openDialog(unselectedOffer)"
                v-if="
                  unselectedOffer.fintech_name === 'Efectivo Si' &&
                  unselectedOffer.status === 'ACCEPTED'
                "
              />
              <q-btn
                unelevated
                color="blue"
                label="VER"
                type="a"
                @click="openOfflineUrl(unselectedOffer)"
                target="__blank"
                :href="unselectedOffer.url"
                v-else-if="
                  unselectedOffer.status === 'ACCEPTED' &&
                  unselectedOffer.url &&
                  unselectedOffer.url != ''
                "
              />
              <q-btn
                unelevated
                color="blue"
                label="CONSULTAR"
                @click="submitToFintech(unselectedOffer)"
                v-else-if="unselectedOffer.status === 'IGNORED'"
                :loading="unselectedOffer.loading"
              />

              <q-btn
                unelevated
                color="red"
                label="RECHAZADO"
                v-else-if="unselectedOffer.status === 'REJECTED'"
                disable
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div>
        <q-separator
          spaced
          v-if="
            APPROVED_OFFERS.length > 0 &&
            UNSELECTED_OFFERS.length > 0 &&
            status === 200
          "
        />

        <q-card-section
          v-if="CREDITCARD_OFFERS.length > 0 && APPROVED_OFFERS.length > 0"
        >
          <div class="text-subtitle1">
            <q-icon
              name="credit_card"
              size="sm"
              color="blue"
              class="q-mr-xs"
            />OFERTA EXCLUSIVA POR HOY
          </div>
          <div class="text-subtitle2 text-weight-light">
            Pedí tu tarjeta con <b>50% OFF</b> en tu primer compra o 100% en el
            primer pago con débito automático
          </div>
        </q-card-section>
        <q-card-section
          v-if="CREDITCARD_OFFERS.length > 0 && APPROVED_OFFERS.length === 0"
        >
          <div class="text-subtitle1">
            <q-icon name="chevron_right" />OFERTAS
          </div>
          <div class="text-subtitle2 text-weight-light">
            Pedí tu tarjeta con 50% OFF en tu primera compra o 100% en el primer
            pago con débito automático
          </div>
        </q-card-section>
        <q-list class="full-width q-mb-md">
          <q-item
            v-ripple
            v-for="creditCardOffer in CREDITCARD_OFFERS"
            :key="creditCardOffer.fintech_id"
            class="q-my-xs"
          >
            <q-item-section avatar>
              <q-avatar round size="50px">
                <img :src="creditCardOffer.image_url" rel="preload" />
              </q-avatar>
            </q-item-section>
            <q-item-section top>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{
                  creditCardOffer.fintech_name
                }}</span>
              </q-item-label>
              <q-item-label caption lines="1">
                <span
                  v-if="creditCardOffer.fintech_name === 'HSBC'"
                  class="text-weight-regular text-grey-10"
                >
                  Tarjeta de credito
                  <br />
                </span>
                <span v-else class="text-weight-regular text-grey-10">
                  ${{ creditCardOffer.min_amount }} a ${{
                    creditCardOffer.max_amount
                  }}
                  <br />
                </span>
                <span
                  class="text-weight-light"
                  v-if="creditCardOffer.fintech_name !== 'HSBC'"
                  >{{ creditCardOffer.min_installments }} a
                  {{ creditCardOffer.max_installments }}
                  {{
                    creditCardOffer.period_unit
                      ? creditCardOffer.period_unit
                      : "meses"
                  }}</span
                >
                <!-- VISA -->
              </q-item-label>
            </q-item-section>
            <q-item-section class="text-center">
              <q-btn
                outline
                color="blue"
                label="VER"
                type="a"
                @click="openOfflineUrl(unselectedOffer)"
                target="__blank"
                :href="creditCardOffer.url"
                v-if="
                  creditCardOffer.status === 'ACCEPTED' &&
                  creditCardOffer.url &&
                  creditCardOffer.url != ''
                "
              />
              <q-btn
                outline
                color="blue"
                label="CONSULTAR"
                @click="submitToFintech(creditCardOffer)"
                v-if="creditCardOffer.status === 'IGNORED'"
                :loading="creditCardOffer.loading"
              />

              <q-btn
                outline
                color="red"
                label="RECHAZADO"
                v-if="creditCardOffer.status === 'REJECTED'"
                disable
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div>
        <q-card-section
          v-if="AUTOSAVING_OFFERS.length > 0 && APPROVED_OFFERS.length > 0"
        >
          <div class="text-subtitle1">
            <q-icon
              name="airport_shuttle"
              size="sm"
              color="blue"
              class="q-mr-xs"
            />PLANES DE AUTOAHORRO
          </div>
          <div class="text-subtitle2 text-weight-light">
            Conseguí tu auto 0km y pagalo en comodas cuotas<br />
            <q-btn
              :loading="loading"
              :disable="loading"
              unelevated
              color="blue"
              class="q-mt-md full-width"
              label="Enviarme más información"
              @click="requestAutoSaving()"
            />
          </div>
        </q-card-section>
        <q-card-section
          v-if="AUTOSAVING_OFFERS.length > 0 && APPROVED_OFFERS.length === 0"
        >
          <div class="text-subtitle1">
            <q-icon name="chevron_right" />PLAN DE AUTOAHORRO
          </div>
          <div class="text-subtitle2 text-weight-light">
            Conseguí tu auto 0km y pagalo en comodas cuotas<br />
            <q-btn
              :loading="loading"
              :disable="loading"
              unelevated
              color="blue"
              class="q-mt-md full-width"
              label="Enviarme mas informacion"
              @click="requestAutoSaving()"
            />
          </div>
        </q-card-section>
        <!-- <a
        href="https://alprestamo.com/ar/blog/?utm_source=ofertas&utm_medium=ofertas&utm_campaign=alprestamo">
        <q-img
        v-if="status === 200"
        src="https://app.alprestamo.com/statics/banner-alprestamo.svg"
        basic
      >
      </q-img></a> -->
      </div>
      <!-- <q-btn color="primary" icon="check" label="OK" @click="test()" /> -->
    </q-card>
  </div>
</template>

<script>
import Axios from 'axios'
// eslint-disable-next-line no-unused-vars
// import { openURL } from 'quasar'
import { mapState } from 'vuex'
import { provinces, branches, options } from '../utils/branches.js'
// import Store from '../store/User/index.js'
export default {
  data () {
    return {
      cerrocredTabs: 'STARTED',
      installments: 12,
      installmentOptions: [],
      offerAmount: 5000,
      appToken: '',
      carPlanPopUp: false,
      sessionId: '',
      processId: '',
      fintechId: '',
      token: '',
      sms_validation: false,
      tab: 'form',
      loading: false,
      netIncome: '',
      dialog: false,
      branchId: '',
      branches: branches,
      proffessionId: '',
      efectivoSiDialog: false,
      dialogOffer: {},
      province: '',
      provinces: provinces,
      options: options
    }
  },
  methods: {
    async submitToCerroCred () {
      this.loading = true
      this.$mixpanel.track('Consultar Oferta Fintech', {
        Fintech: 'Cerrocred',
        fintechName: 'Cerrocred',
        offerAmount: this.offerAmount,
        installments: this.installments,
        utm_campaign: this.user.mktInfo.utmCampaign,
        utm_medium: this.user.mktInfo.utmMedium,
        utm_source: this.user.mktInfo.utmSource,
        adGroup: this.user.mktInfo.adGroup,
        ad: this.user.mktInfo.ad
      })
      try {
        const result = await Axios.post(
          'https://dksfintech.cognoris.com:8551/api/applications',
          {
            firstName: this.user.user.firstName,
            lastName: this.user.user.lastName,
            fintechId: '5d891da3f9c0b9272fe7998f',
            nationalId: this.user.user.nationalId,
            email: this.user.user.email,
            channelCode: '1',
            taxStatus: this.user.user.taxStatus,
            gender: this.user.user.gender,
            bankCode: this.user.user.bankCode,
            dateOfBirth: this.user.user.dateOfBirth,
            phone: this.user.user.phone,
            phoneArea: this.user.user.phoneArea,
            amount: this.user.user.amount,
            source: 'W',
            sourceCountryCode: 'AR',
            sessionId: this.sessionId,
            requestInfo: {
              processId: this.processId,
              processType: '2'
            },
            offerSelected: {
              amount: this.offerAmount,
              installments: this.installments,
              installmentValue: this.installmentValue
            }
          }
        )
        // console.log(result.data)
        if (
          (result.data.status === 200) &
          (result.data.message === 'APPROVED')
        ) {
          this.loading = false
          this.cerrocredTabs = 'APPROVED'
          this.$mixpanel.track('Consultar Oferta Aprobada', {
            fintechName: 'Cerrocred',
            status: 'APPROVED',
            offerAmount: this.offerAmount,
            installments: this.installments,
            utm_campaign: this.user.mktInfo.utmCampaign,
            utm_medium: this.user.mktInfo.utmMedium,
            utm_source: this.user.mktInfo.utmSource,
            adGroup: this.user.mktInfo.adGroup,
            ad: this.user.mktInfo.ad
          })
        } else if (
          (result.data.status === 200) &
          (result.data.message === 'REJECTED')
        ) {
          this.$mixpanel.track('Consultar Oferta Aprobada', {
            fintechName: 'Cerrocred',
            status: 'REJECTED',
            offerAmount: this.offerAmount,
            installments: this.installments,
            utm_campaign: this.user.mktInfo.utmCampaign,
            utm_medium: this.user.mktInfo.utmMedium,
            utm_source: this.user.mktInfo.utmSource,
            adGroup: this.user.mktInfo.adGroup,
            ad: this.user.mktInfo.ad
          })
          this.loading = false
          this.cerrocredTabs = 'REJECTED'
        } else {
          this.$mixpanel.track('Consultar Oferta Error', {
            fintechName: 'Cerrocred',
            status: 'APPROVED',
            offerAmount: this.offerAmount,
            installments: this.installments,
            utm_campaign: this.user.mktInfo.utmCampaign,
            utm_medium: this.user.mktInfo.utmMedium,
            utm_source: this.user.mktInfo.utmSource,
            adGroup: this.user.mktInfo.adGroup,
            ad: this.user.mktInfo.ad,
            error: result.data.toString()
          })
          this.loading = false
          this.cerrocredTabs = 'ERROR'
        }
      } catch (error) {
        this.$mixpanel.track('Consultar Oferta Error', {
          fintechName: 'Cerrocred',
          status: 'APPROVED',
          offerAmount: this.offerAmount,
          installments: this.installments,
          utm_campaign: this.user.mktInfo.utmCampaign,
          utm_medium: this.user.mktInfo.utmMedium,
          utm_source: this.user.mktInfo.utmSource,
          adGroup: this.user.mktInfo.adGroup,
          ad: this.user.mktInfo.ad,
          error: error.toString()
        })
        this.loading = false
        this.cerrocredTabs = 'ERROR'
      }
    },
    async requestAutoSaving () {
      this.loading = true
      this.carPlanPopUp = true
      await this.$mixpanel.track('Solicitar Informacion Plan AutoAhorro')
      this.loading = false
    },

    changePhone () {
      const user = this.user.user
      user.phone = ''
      user.phoneArea = ''
      user.fullPhone = ''
      this.$store.commit('User/SET_USER', user)
      this.$q.localStorage.set('user', user)
      this.$router.push('/')
    },
    loadLocalStorageOffers () {
      this.$store.dispatch('User/LOAD_STORAGE_OFFERS')
      if (
        this.APPROVED_OFFERS.length === 0 &&
        this.UNSELECTED_OFFERS.length === 0 &&
        this.$store.state.User.status !== 404
      ) {
        this.$router.push('/')
      }
    },
    skipValidation () {
      this.sms_validation = false
      this.$mixpanel.track('Omitir validacion SMS', {
        fintechId: this.fintechId,
        processId: this.processId,
        sessionId: this.sessionId,
        phone: this.user.user.phone,
        phoneArea: this.user.user.phoneArea,
        email: this.user.user.email,
        nationalId: this.user.user.nationalId
      })
    },
    async validateToken () {
      this.loading = true
      const status = await this.$store.dispatch('User/VALIDATE_SMS', {
        fintechId: this.fintechId,
        processId: this.processId,
        sessionId: this.sessionId ? this.sessionId : '',
        token: this.token
      })

      if (status === true) {
        this.sms_validation = false
        this.isPhoneValidated = true
      }
      this.loading = false
    },
    async checkWenanceOffers () {
      // console.log('Checking for wenance offers')
      if (
        this.$q.localStorage.has('isPhoneValid') &&
        !this.$q.localStorage.getItem('isPhoneValid')
      ) {
        this.loading = true
        const approvedFintechs = this.APPROVED_OFFERS.map((offer) => {
          return offer.fintech_name
        })
        // console.log(approvedFintechs)
        if (approvedFintechs.includes('Mango')) {
          const mangoIndex = this.APPROVED_OFFERS.findIndex(
            (offer) => offer.fintech_name === 'Mango'
          )
          this.sessionId = this.APPROVED_OFFERS[mangoIndex].sessionId
          this.processId = this.APPROVED_OFFERS[mangoIndex].processId
          this.fintechId = this.APPROVED_OFFERS[mangoIndex].fintech_id
          this.sms_validation = true
          // console.log('Array contains Mango')
          this.$mixpanel.track('Enviar SMS de Validacion', {
            fintechName: 'Mango',
            phone: this.user.user.phone,
            phoneArea: this.user.user.phoneArea,
            email: this.user.user.email,
            fintechId: this.fintechId,
            processId: this.processId,
            sessionId: this.sessionId
          })
          await this.$store.dispatch('User/SEND_SMS_VALIDATION', {
            fintechId: this.fintechId,
            processId: this.processId,
            sessionId: this.sessionId
          })
          this.loading = false
        } else if (approvedFintechs.includes('Posta')) {
          const postaIndex = this.APPROVED_OFFERS.findIndex(
            (offer) => offer.fintech_name === 'Posta'
          )
          this.sessionId = this.APPROVED_OFFERS[postaIndex].sessionId
          this.processId = this.APPROVED_OFFERS[postaIndex].processId
          this.fintechId = this.APPROVED_OFFERS[postaIndex].fintech_id
          this.sms_validation = true
          // console.log('Array contains only Posta')
          this.$mixpanel.track('Enviar SMS de Validacion', {
            fintechName: 'Posta',
            phone: this.user.user.phone,
            phoneArea: this.user.user.phoneArea,
            email: this.user.user.email,
            fintechId: this.fintechId,
            processId: this.processId,
            sessionId: this.sessionId
          })
          await this.$store.dispatch('User/SEND_SMS_VALIDATION', {
            fintechId: this.fintechId,
            processId: this.processId,
            sessionId: this.sessionId
          })
          this.loading = false
        } else if (approvedFintechs.includes('XCredicuotasX')) {
          const credicuotasIndex = this.APPROVED_OFFERS.findIndex(
            (offer) => offer.fintech_name === 'Credicuotas'
          )
          this.sms_validation = true
          this.sessionId = this.APPROVED_OFFERS[credicuotasIndex].sessionId
          this.processId = this.APPROVED_OFFERS[credicuotasIndex].processId
          this.fintechId = this.APPROVED_OFFERS[credicuotasIndex].fintech_id
          this.appToken = '3ldm1ghqk8p7t53b'
          this.$mixpanel.track('Enviar SMS de Validacion', {
            fintechName: 'Credicuotas',
            phone: this.user.user.phone,
            phoneArea: this.user.user.phoneArea,
            email: this.user.user.email,
            fintechId: this.fintechId,
            processId: this.processId,
            appToken: this.appToken,
            sessionId: this.sessionId
          })
          await this.$store.dispatch('User/SEND_SMS_VALIDATION', {
            fintechId: this.fintechId,
            processId: this.processId,
            appToken: this.appToken
          })
          this.loading = true
        } else {
          // console.log('No Wenance offers found')
          this.loading = false
        }
      }
    },
    async sendEfectivoSiApplication () {
      this.loading = true
      this.$mixpanel.track('Consultar Oferta Fintech', {
        Fintech: 'Efectivo Si',
        utm_campaign: this.user.mktInfo.utmCampaign,
        utm_medium: this.user.mktInfo.utmMedium,
        utm_source: this.user.mktInfo.utmSource,
        adGroup: this.user.mktInfo.adGroup,
        ad: this.user.mktInfo.ad
      })
      try {
        const result = await Axios.post(
          'https://dksfintech.cognoris.com:8551/api/applications',
          {
            firstName: this.user.user.firstName,
            lastName: this.user.user.lastName,
            amount: this.user.user.amount,
            nationalId: this.user.user.nationalId,
            branchId: this.branchId,
            professionId: this.proffessionId,
            dateOfBirth: this.user.user.dateOfBirth,
            netIncome: this.netIncome,
            gender: this.user.user.gender,
            email: this.user.user.email,
            bankCode: this.user.user.bankCode,
            phoneArea: this.user.user.phoneArea,
            phone: this.user.user.phone,
            url: 'https://www.prestoahora.com/wp/',
            sourceCountryCode: 'AR',
            channelCode: '1',
            fintechId: '5f8f536c563e4c0eb583ea2a',
            source: 'W',
            taxStatus: this.user.user.taxStatus,
            mktInfo: this.user.mktInfo,
            device: this.user.device,
            agent: this.user.agent
          }
        )

        if (
          result.data.status === 200 &&
          result.data.data.fintechsAPI[0].status === 'REJECTED'
        ) {
          this.loading = false
          this.tab = 'rejected'
          // console.log(result.data.data.fintechsAPI)
          // console.log('REJECTED')
          this.$mixpanel.track('Consultar Oferta Rechazada', {
            Fintech: 'Efectivo Si',
            Status: 'REJECTED',
            utm_campaign: this.user.mktInfo.utmCampaign,
            utm_medium: this.user.mktInfo.utmMedium,
            utm_source: this.user.mktInfo.utmSource,
            adGroup: this.user.mktInfo.adGroup,
            ad: this.user.mktInfo.ad
          })
        } else if (
          result.data.status === 200 &&
          result.data.data.fintechsAPI[0].status === 'APPROVED'
        ) {
          this.$mixpanel.track('Consultar Oferta Aprobada', {
            Fintech: 'Efectivo Si',
            Status: 'APPROVED',
            utm_campaign: this.user.mktInfo.utmCampaign,
            utm_medium: this.user.mktInfo.utmMedium,
            utm_source: this.user.mktInfo.utmSource,
            adGroup: this.user.mktInfo.adGroup,
            ad: this.user.mktInfo.ad
          })
          this.loading = false
          this.tab = 'approved'
          // console.log('APPROVED')
        } else {
          this.$mixpanel.track('Consultar Oferta Rechazada', {
            Fintech: 'Efectivo Si',
            Status: 'ERROR',
            utm_campaign: this.user.mktInfo.utmCampaign,
            utm_medium: this.user.mktInfo.utmMedium,
            utm_source: this.user.mktInfo.utmSource,
            adGroup: this.user.mktInfo.adGroup,
            ad: this.user.mktInfo.ad
          })
          this.tab = 'rejected'
          this.loading = false
          // console.log('ERROR')
        }
      } catch (error) {
        this.$mixpanel.track('Consultar Oferta Error', {
          Fintech: 'Efectivo Si',
          Status: 'ERROR',
          utm_campaign: this.user.mktInfo.utmCampaign,
          utm_medium: this.user.mktInfo.utmMedium,
          utm_source: this.user.mktInfo.utmSource,
          adGroup: this.user.mktInfo.adGroup,
          ad: this.user.mktInfo.ad
        })
        this.loading = false
        this.tab = 'rejected'
        // console.log('error')
        // console.log(error)
      }
    },
    getInstallmentValues () {
      this.installmentValue = this.dialogOffer.offers
        .filter((n) => n.amount === this.offerAmount)[0]
        .installments.filter(
          (n) => n.installments === this.installments
        )[0].installmentValue
      // console.log(
      //   this.dialogOffer.offers
      //     .filter((n) => n.amount === this.offerAmount)[0]
      //     .installments.filter((n) => n.installments === this.installments)[0]
      //     .installmentValue
      // )
    },
    getInstallmentOptions () {
      this.installments = ''
      this.installmentOptions = this.dialogOffer.offers
        .filter((n) => n.amount === this.offerAmount.toString())[0]
        .installments.map((e) => e.installments)
    },
    sendGtmEvent () {
      try {
        // eslint-disable-next-line no-undef
        gtag('event', 'conversion', {
          allow_custom_scripts: true,
          send_to: 'DC-10244559/invmedia/botno0+standard'
        })
        console.log('Tag fired')
      } catch (error) {
        console.log(error)
      }
    },

    checkOffers () {
      if (
        this.APPROVED_OFFERS.length === 0 &&
        this.UNSELECTED_OFFERS.length === 0 &&
        this.status !== 404
      ) {
        this.$router.push('/')
      }
    },
    emitFloodLightEvent () {
      // eslint-disable-next-line no-undef
      gtag('event', 'conversion', {
        allow_custom_scripts: true,
        send_to: 'DC-10244559/invmedia/px1go0+unique'
      })
      console.log('Emitted event')
    },
    setMixpanelFintechs () {
      const mixpanelApprovedFintechNames = this.APPROVED_OFFERS.map((offer) => {
        return offer.fintech_name
      })
      const mixpanelIgnoredFintechNames = this.IGNORED_OFFERS.map((offer) => {
        return offer.fintech_name
      })
      this.$mixpanel.track('Pagina de Ofertas', {
        approvedFintechs: mixpanelApprovedFintechNames,
        IgnoredFintech: mixpanelIgnoredFintechNames
      })
    },
    openDialog (selectedFintech) {
      // console.log(selectedFintech)
      this.dialogOffer = selectedFintech
      this.$mixpanel.track('Abrir Modal Fintech', {
        fintechName: selectedFintech.fintech_name,
        utm_source: this.mktInfo.utmSource,
        utm_medium: this.mktInfo.utmMedium,
        utm_campaign: this.mktInfo.utmCampaign,
        ...this.mktInfo
      })
      this.dialog = !this.dialog
      // console.log(selectedFintech.offers.map((n) => n.amount))
      if (selectedFintech.offers) {
        // console.log(Math.max(selectedFintech.offers.map((n) => n.amount)))
        const maxAmount = Math.max(
          ...selectedFintech.offers.map((n) => n.amount)
        )
        this.offerAmount = maxAmount.toString()
        // console.log(this.offerAmount)
        // console.log(
        //   selectedFintech.offers
        //     .filter((n) => n.amount === maxAmount.toString())[0]
        //     .installments.map((e) => e.installments)
        // )
        this.installmentOptions = selectedFintech.offers
          .filter((n) => n.amount === maxAmount.toString())[0]
          .installments.map((e) => e.installments)
        this.installments = Math.max(
          ...selectedFintech.offers
            .filter((n) => n.amount === maxAmount.toString())[0]
            .installments.map((e) => e.installments)
        )
        this.getInstallmentValues()
        if (selectedFintech.sessionId) {
          this.sessionId = selectedFintech.sessionId
          // console.log(selectedFintech.sessionId)
        }
        if (selectedFintech.processId) {
          this.processId = selectedFintech.processId
          // console.log(selectedFintech.processId)
        }
        // this.installments = Math.max(
        //   ...selectedFintech.offers
        //     .filter((element) => element.amount === this.offerAmount)[0]
        //     .installments.map((n) => n.installments)
        // )
      }
    },

    openUrl (selectedFintech) {
      this.$mixpanel.track('Click Solicitar en Modal Fintech', {
        fintechName: selectedFintech.fintech_name,
        url: selectedFintech.url,
        utm_source: this.mktInfo.utmSource,
        utm_medium: this.mktInfo.utmMedium,
        utm_campaign: this.mktInfo.utmCampaign,
        ...this.mktInfo
      })
    },

    openOfflineUrl (selectedFintech) {
      this.$mixpanel.track('Click Ver en Fintech Offline', {
        fintechName: selectedFintech.fintech_name,
        url: selectedFintech.url,
        utm_source: this.mktInfo.utmSource,
        utm_medium: this.mktInfo.utmMedium,
        utm_campaign: this.mktInfo.utmCampaign,
        ...this.mktInfo
      })
    },

    submitToFintech (fintech) {
      try {
        this.$store.dispatch('User/SUBMIT_TO_FINTECH', fintech)
        if (this.$store.state.User.status === 200) {
        } else {
          this.$q.notify({
            message:
              'Se ha producido un error en su solicitud, verifique sus datos',
            color: 'red'
          })
        }
      } catch (error) {
        this.$q.notify({
          message:
            'Se ha producido un error en su solicitud, verifique sus datos',
          color: 'red'
        })
      }
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    FILTERED_INSTALLMENTS: function () {
      return this.dialogOffer.offers.filter(
        (n) => n.amount === this.offerAmount
      )
    },
    // eslint-disable-next-line vue/return-in-computed-property
    FILTERED_AMOUNTS: function () {
      if (this.dialogOffer.offers) {
        return this.dialogOffer.offers.map((n) => n.amount)
      }
    },
    filterBranches: function () {
      return this.branches.filter((element) => {
        return element.state === this.province
      })
    },
    APPROVED_OFFERS: function () {
      return this.$store.state.User.offers.filter(
        (offer) => offer.status === 'APPROVED'
      )
    },
    UNSELECTED_OFFERS: function () {
      return this.$store.state.User.offers.filter(
        (offer) =>
          offer.fintech_name !== 'HSBC' &&
          offer.fintech_name !== 'AutoAhorro' &&
          (offer.status === 'ACCEPTED' ||
            offer.status === 'IGNORED' ||
            offer.status === 'REJECTED')
      )
    },
    CREDITCARD_OFFERS: function () {
      return this.$store.state.User.offers.filter(
        (offer) => offer.status === 'ACCEPTED' && offer.fintech_name === 'HSBC'
      )
    },
    AUTOSAVING_OFFERS: function () {
      return this.$store.state.User.offers.filter(
        (offer) =>
          offer.status === 'ACCEPTED' && offer.fintech_name === 'AutoAhorro'
      )
    },
    IGNORED_OFFERS: function () {
      return this.$store.state.User.offers.filter(
        (offer) => offer.status === 'IGNORED'
      )
    },
    REJECTED_OFFERS: function () {
      return this.$store.state.User.offers.filter(
        (offer) => offer.status === 'REJECTED'
      )
    },
    ...mapState({
      user: (state) => state.User,
      offers: (state) => state.User.offers,
      status: (state) => state.User.status,
      mktInfo: (state) => state.User.mktInfo
    })
  },
  mounted: async function () {
    await this.loadLocalStorageOffers()
    this.checkWenanceOffers()
    this.setMixpanelFintechs()
    this.sendGtmEvent()

    // this.emitFloodLightEvent()
  }
}
</script>

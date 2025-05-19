<template >
  <div>
    <div class="d-flex justify-end">
      <h1 class="accent--text oswald--text">Factura Version 4.0</h1>
    </div>
    <!-- <h3>Facturar en version 4.0</h3> -->
    <v-data-iterator
      :items="lst_pagos"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      hide-default-footer
      :loading="loading_pagos"
      style="border: 3px solid #546e7a !important"
    >
      <template v-slot:header>
        <v-toolbar
          id="toolbar-filter"
          class="mb-0"
          dark
          color="secondary"
          height="100"
        >
          <v-text-field
            v-model="n_accion"
            clearable
            flat
            solo-inverted
            hide-details
            label="Accion"
            v-mask="accionMask"
            @keyup.enter="getPagos"
          />

          <!-- <v-text-field
            v-model="find_uuid"            
            clearable
            flat
            solo-inverted
            hide-details
            label="UUID"/>
      -->

          <v-menu
            v-model="menu_date"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="
                  Boolean(fecha_inicio)
                    ? dayjs(fecha_inicio).format('DD [de] MMMM [de] YYYY')
                    : ''
                "
                label="fecha inicio"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                solo-inverted
                hide-details
              />
            </template>
            <v-date-picker
              color="blue-grey darken-1x"
              locale="es-MX"
              v-model="fecha_inicio"
              @input="menu_date = false"
              :max="fecha_fin"
            />
          </v-menu>
          <v-menu
            v-model="menu_date2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="
                  Boolean(fecha_fin)
                    ? dayjs(fecha_fin).format('DD [de] MMMM [de] YYYY')
                    : ''
                "
                label="fecha fin"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                solo-inverted
                hide-details
              />
            </template>
            <v-date-picker
              color="blue-grey darken-1xxx"
              locale="es-MX"
              v-model="fecha_fin"
              @input="menu_date2 = false"
              :min="fecha_inicio"
            />
          </v-menu>

          <v-spacer></v-spacer>

          <v-btn
            class="ml-1"
            large
            color="primary white--text"
            rounded
            @click="getPagos"
          >
            <v-icon> mdi-magnify</v-icon> Buscar</v-btn
          >
        </v-toolbar>
      </template>

      <template v-slot:default="{ items, isExpanded, expand }">
        <v-expansion-panels class="py-3" focusable popout tile>
          <v-expansion-panel
            v-for="(item, i) in items"
            :key="i"
            active-class="blue-grey"
          >
            <v-expansion-panel-header @click="setSelectedPago(item)" ripple>
              <template v-slot:default="{ open }">
                <!-- panel:{{panel}}-{{open}} -->
                <!-- //-segmentada=1 es una sola factura y global indica si es publico en geneeral cuando sea 1 -->
                <!-- //-segmentada mayor 1 es que existe varias facturas oara ese pago por ende es segmentada o dividida -->
                <!-- //-segmentado 0 es que no se a facturado -->
                <v-tooltip bottom v-if="item.segmentada == 0" color="primary">
                  <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                      class="mr-3"
                      :color="open ? 'primary' : 'secondary'"
                      size="38"
                      style="max-width: 38px"
                    >
                      <v-icon color="white" v-bind="attrs" v-on="on">
                        mdi-alert</v-icon
                      >
                    </v-avatar>
                  </template>
                  <span> No facturado</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  v-if="item.segmentada == 1 && item.global == 0"
                  color="primary"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                      class="mr-3"
                      :color="open ? 'primary' : 'secondary'"
                      size="38"
                      style="max-width: 38px"
                    >
                      <v-icon color="white" v-bind="attrs" v-on="on">
                        mdi-badge-account</v-icon
                      >
                    </v-avatar>
                  </template>
                  <span> Factura Normal</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  v-if="item.segmentada == 1 && item.global == 1"
                  color="primary"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                      class="mr-3"
                      :color="open ? 'primary' : 'secondary'"
                      size="38"
                      style="max-width: 38px"
                    >
                      <v-icon color="white" v-bind="attrs" v-on="on">
                        mdi-earth</v-icon
                      >
                    </v-avatar>
                  </template>
                  <span> Publico en General</span>
                </v-tooltip>
                <v-tooltip
                  bottom
                  v-if="item.segmentada > 1 && item.global == 0"
                  color="primary"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                      class="mr-3"
                      :color="open ? 'primary' : 'secondary'"
                      size="38"
                      style="max-width: 38px"
                    >
                      <v-icon color="white" v-bind="attrs" v-on="on">
                        mdi-account-group</v-icon
                      >
                    </v-avatar>
                  </template>
                  <span> Segmentada o Dividida</span>
                </v-tooltip>
                <v-container>
                  <v-row>
                    <v-col
                      class="font-weight-black text-subtitle-1 primary--text"
                    >
                      <span>
                        Accion:
                        <span
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{ item.accion }}</span
                        >
                      </span>
                    </v-col>
                    <v-spacer />
                    <v-col class="d-flex justify-end" v-if="item.total > 0">
                      <v-chip
                        outlined
                        :class="{
                          'white white--text': open,
                          success: item.factura_id,
                        }"
                        class="mr-2"
                      >
                        Pv</v-chip
                      >
                      <v-chip
                        outlined
                        :class="{ 'white white--text': open }"
                        class="mr-2"
                      >
                        Comercial</v-chip
                      >
                      <v-chip
                        outlined
                        :class="{ 'white white--text': open }"
                        class="mr-2"
                      >
                        XML</v-chip
                      >
                    </v-col>
                    <v-col clas="d-flex justify-end" v-else>
                      <v-chip :outlined="!open" color="warning">
                        <v-avatar class="warning darken-2" left>
                          <v-icon small color="white"> mdi-alert </v-icon>
                        </v-avatar>
                        <span> Pago en cero no facturable</span>
                      </v-chip>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="font-weight-black">
                      <span :class="{ 'white--text': open }">
                        Folio:
                        <span
                          class="text-body-2x font-weight-black text-decoration-underline"
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{ item.folio }}</span
                        ></span
                      >
                    </v-col>
                    <v-col class="font-weight-black">
                      <span :class="{ 'white--text': open }">
                        Fecha pago:
                        <span
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{
                            dayjs(item.fecha_hora_cobro).format(
                              "DD MMMM YYYY hh:mm"
                            )
                          }}</span
                        ></span
                      >
                    </v-col>
                    <v-col class="font-weight-black">
                      <span :class="{ 'white--text': open }">
                        Cajero(a):
                        <span
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{ item.nombre }}</span
                        ></span
                      >
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="font-weight-black">
                      <span :class="{ 'white--text': open }">
                        Total:
                        <span
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{ numeral(item.total).format("$0,0.00") }}</span
                        ></span
                      ></v-col
                    >
                    <v-col class="font-weight-black">
                      <span :class="{ 'white--text': open }">
                        Subtotal:
                        <span
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{ numeral(item.subtotal).format("$0,0.00") }}</span
                        ></span
                      ></v-col
                    >
                    <v-col class="font-weight-black">
                      <span :class="{ 'white--text': open }">
                        Descuento:
                        <span
                          :class="{
                            'white--text': open,
                            'accent--text text--darken-2': !open,
                          }"
                        >
                          {{ numeral(item.descuento).format("$0,0.00") }}</span
                        ></span
                      ></v-col
                    >
                  </v-row>
                </v-container>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content color="white">
              <factura-comercial-v4-detalle
                v-if="item.idpago == panel"
                :idPago="panel"
                :facturaId="item.factura_id"
                :total="item.total"
                :cve_accion="item.cve_accion"
                @emit-datos-factura="EmitDatosFactura"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>

      <template v-slot:footer>
        <v-toolbar class="mb-0" dark color="secondary darken-1" height="70px">
          <v-row class="mt-0" align="center" justify="center">
            <span> pagos por pagina</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-2"
                  dark
                  text
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon> mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title> {{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer />
            <span class="mr-4"> Pagina {{ page }} de {{ numberOfPages }}</span>
            <v-btn
              class="mr-1"
              fab
              dark
              color="primary"
              small
              @click="formerPage"
            >
              <v-icon> mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              class="ml-1"
              fab
              dark
              color="primary"
              small
              @click="nextPage"
            >
              <v-icon> mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar>
      </template>

      <template v-slot:loading>
        <div class="blue-grey darken-3" style="height: 100px">
          <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="subtitle-1 text-center" cols="12">
              <label class="text-h5 white--text">
                Cargando los Pagos</label
              ></v-col
            >
            <v-col cols="6">
              <v-progress-linear
                color="white"
                indeterminate
                rounded
                height="10"
            /></v-col>
          </v-row>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="secondary darken-3" style="height: 100px">
          <v-row class="fill-height" align-content="center" justify="center">
            <v-col class="subtitle-1 text-center" cols="12">
              <label class="text-h3white--text">
                <h3>Sin Pagos Para Mostra</h3>
              </label>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-data-iterator>
  </div>
</template>

<script setup>
import {ref,onMounted,computed,getCurrentInstance} from "vue";
import round from "lodash/round";
import numeral from "numeral";
import dayjs from "dayjs";
import throttle from "lodash/throttle";
import FacturaComercialV4Detalle from "@/components/factura_comercial_v4/factura-comercial-v4-detalle.vue";
import { getPagosFacturarService } from "@/services/factura_service";

const root = getCurrentInstance().proxy;

const storeFactura = root.$store;

const openDetalle = ref(false);
//#region datos factura

const lst_pagos = ref([]);

const menu_date = ref(false);
const menu_date2 = ref(false);
const fecha_inicio = ref(undefined);
const fecha_fin = ref(undefined);
const n_accion = ref("");
const find_uuid = ref();

const accionMask = ref({
  mask: "#FFFF",
  tokens: {
    F: {
      pattern: /[0-9a-cA-C]/,
      transform(v) {
        return v.toLocaleUpperCase();
      },
    },
    "#": {
      pattern: /\d/,
    },
  },
});

const panel = ref(0);

const itemsPerPage = ref(4);
const itemsPerPageArray = ref([4, 8, 12]);
const page = ref(1);

const loading_pagos = ref(false);

//#endregion

const numberOfPages = computed(() =>
  Math.ceil(lst_pagos.value.length / itemsPerPage.value)
);

onMounted(() => {
  //carga los catalogos de uso cfdi, forma pago y el regimen fiscal en vuex
  storeFactura.dispatch("fetchGetUsoCfdi");
  storeFactura.dispatch("fetchGetFormaPago");
  storeFactura.dispatch("fetchGetRegimenFiscal");
  //storeFactura.dispatch('fetchGetRegimenFiscal');
});

//#region  metodos

async function getPagos() {
  lst_pagos.value = [];
  loading_pagos.value = true;

  let numero_accion = undefined;
  let clasificacion = undefined;

  if (Boolean(n_accion.value)) {
    numero_accion = n_accion.value;
    clasificacion = 0;

    if (n_accion.value.indexOf("A") > -1) {
      numero_accion = n_accion.value.substr(0, n_accion.value.indexOf("A"));
      clasificacion = 1;
    } else if (n_accion.value.indexOf("B") > -1) {
      numero_accion = n_accion.value.substr(0, n_accion.value.indexOf("B"));
      clasificacion = 2;
    } else if (n_accion.value.indexOf("C") > -1) {
      numero_accion = n_accion.value.substr(0, n_accion.value.indexOf("C"));
      clasificacion = 3;
    }
  } //fin if null

  // let { data, status } = await $axios.get("pago", { params: dataSend });
  const data = await getPagosFacturarService(
    numero_accion,
    clasificacion,
    fecha_inicio.value,
    fecha_fin.value
  );
  lst_pagos.value = data;
  loading_pagos.value = false;
}

function setSelectedPago(item) {
  panel.value = item.idpago;
  console.log(
    "🚀 ~ file: factura_comercial_v4.vue:373 ~ setSelectedPago ~ item",
    item
  );
  //se ingresan al vuex
  storeFactura.commit("SETCVEACCION", item.cve_accion);
  storeFactura.commit("SETFOLIO", item.folio);
  storeFactura.commit("SETNUMEROACCION", item.accion);
  storeFactura.commit("SETIDPAGO", item.idpago);
  storeFactura.commit("SETFECHAPAGO", item.fecha_hora_cobro);
  storeFactura.commit("SETFORMAPAGO", item.forma_pago);
  storeFactura.commit("SETFORMAPAGOTEXT", item.forma_pago_text);
  storeFactura.commit("SETMONTO", item.total);
}

function formerPage() {
  if (page.value - 1 >= 1) page.value -= 1;
}

function nextPage() {
  if (page.value + 1 <= numberOfPages.value) page.value += 1;
}

function updateItemsPerPage(number) {
  itemsPerPage.value = number;
}

function EmitDatosFactura(payload) {
  console.log(
    "🚀 ~ file: factura_comercial_v4.vue:693 ~ EmitDatosFactura ~ payload",
    payload
  );

  let pagoSelected = lst_pagos.value.find((i) => i.idpago == panel.value);
  if (Boolean(pagoSelected)) {
    console.log("pago seleccionado:", pagoSelected);
    pagoSelected.factura_id = payload.id_factura;
    pagoSelected.segmentada = 1;
    pagoSelected.global = 0;
  }
}

//#endregion
</script>

<style scoped>
>>> #toolbar-filter > div:first-child {
  display: flex !important;
  column-gap: 15px !important;
  justify-content: space-between !important;
  /* background-color: red!important; */
  width: 100% !important;
}
</style>
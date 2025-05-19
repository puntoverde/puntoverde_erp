<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
    scrollable
    @input="initFactura"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" :value="false" dark color="primary" rounded>
        <v-icon color="white"> mdi-badge-account</v-icon> FACTURAR</v-btn
      >
    </template>
    <v-snackbar v-model="snackbar" color="error" style="z-index: 210">
      <div>
        <div v-for="(value, name, index) in snackbatMensaje" :key="index">
          <b> {{ name }}</b>
          <p v-for="(msj, ind) in value" :key="ind">{{ msj }}</p>
        </div>
      </div>
    </v-snackbar>

    <v-overlay :value="overlay" absolute>
      <v-card dark>
        <v-card-text>
          <h2 class="my-2.pt-2.text-center">{{ text_loading }}</h2>
          <v-progress-linear
            class="mb-0"
            indeterminate
            color="white"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-overlay>

    <v-card color="primary">
      <v-overlay
        v-model="dialog_confirm"
        absolute
        color="secondary darken-1"
        opacity=".5"
      >
        <v-card class="primary" width="350">
          <v-toolbar color="secondary" dark tile>
            <v-icon class="mr-2"> mdi-alert-circle-outline</v-icon>
            <v-toolbar-title> Confirmar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_confirm = false">
              <v-icon> mdi-close</v-icon></v-btn
            >
          </v-toolbar>
          <v-card-text class="secondary lighten-1 mt-1">
            <v-row>
              <v-col cols="12">
                <v-select
                  class="mr-2"
                  filled
                  densex
                  hide-dtails
                  label="Metodo Pago"
                  v-model="forma_pago"
                  :items="['PUE', 'PPD']"
                >
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  filled
                  dense
                  hide-details
                  label="uso cfdi"
                  v-model="uso_cfdi"
                  :items="lst_uso_cfdi"
                  item-value="clave"
                  item-text="descripcion"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="blue-greyx secondary lighten-1">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveFactura" block>
              Terminar Factura</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-overlay>

      <v-toolbar color="secondary" dark flat>
        <v-toolbar-title>
          Facturar pago con Folio {{ foliopago }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"> <v-icon> mdi-close</v-icon></v-btn>
        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            centered
            fixed-tabs
            @change="clearTabs"
            color="primary"
          >
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab> Clientes(Facturar)</v-tab>
            <v-tab> Nuevo Cliente</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-card-text class="white" style="min-height: 560px">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-list three-line flat nav>
              <v-list-item-group v-model="factura">
                <template v-for="datos_factura in lst_datos_facturacion">
                  <v-list-item
                    :key="datos_factura.id_datos_facturacion"
                    :value="datos_factura"
                    :disabled="datos_factura.estatus == 2"
                    :class="{ 'error--text': datos_factura.estatus == 2 }"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-action class="mr-2">
                        <v-simple-checkbox
                          :value="active"
                          color="primary"
                        ></v-simple-checkbox>
                      </v-list-item-action>
                      <v-list-item-content class="py-1">
                        <v-list-item-title class="my-0 py-0">
                          <span class="text-subtitle-1">
                            RFC:
                            <span
                              class="font-weight-bold"
                              v-text="datos_factura.rfc"
                            ></span></span
                        ></v-list-item-title>
                        <v-list-item-subtitle>
                          <span class="text-subtitle-2">
                            R-social:
                            <span
                              class="font-weight-bold"
                              v-text="datos_factura.razon_social"
                            ></span></span
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <span class="text-subtitle-2">
                            Correo:
                            <span
                              class="font-weight-bold"
                              v-text="datos_factura.correo"
                            ></span></span
                        ></v-list-item-subtitle>
                        <v-list-item-subtitle>
                          <span class="text-subtitle-2">
                            Regimen Fiscal:
                            <span
                              class="font-weight-bold"
                              v-text="fnMostrarRegimenFiscalText(datos_factura.regimen_fiscal)"
                            ></span></span
                        ></v-list-item-subtitle>
                        
                        <v-list-item-subtitle>
                          <span class="text-subtitle-2">
                            Domicilio:
                            {{
                              `${datos_factura.calle} # ${datos_factura.num_ext}, ${datos_factura.colonia}`
                            }}
                            <span>
                              cp:
                              <span
                                class="font-weight-black"
                                v-text="datos_factura.cp"
                              ></span>
                              {{
                                `${datos_factura.municipio} ${datos_factura.estado}`
                              }}</span
                            ></span
                          ></v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                  <v-divider
                    inset
                    :key="`${datos_factura.id_datos_facturacion}-divider`"
                  ></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-container>
                <v-row>
                  <v-col cols="12" lg="7">
                    <v-select
                      class="mr-1"
                      label="Pertenece ha"
                      v-model="cve_persona_factura"
                      :items="lst_socios_accion"
                      item-value="cve_persona"
                      :item-text="
                        (i) =>
                          `${i.nombre} (${i.tipo == 1 ? 'usuario' : 'dueño'})`
                      "
                      @input="updateRazonsocial"
                      :error-messages="iErrors.pertenece"
                    >
                    </v-select>
                  </v-col>

                  <v-col cols="12," lg="5">
                    <v-text-field
                      class="my-mayus.ml-1"
                      label="RFC"
                      v-model="rfc"
                      v-mask="'AAAA######XXX'"
                      :error-messages="iErrors.cliente.rfc"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12">
                    <v-text-field
                      class="my-mayus"
                      label="Razon Social"
                      v-model="razon_social"
                      :error-messages="iErrors.cliente.razonSocial"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="12">
                    <v-select
                      class="my-mayus"
                      ref="selectRF"
                      label="Regimen fiscal"
                      v-model="regimen_fiscal"
                      :items="lst_regimen_fiscal"
                      item-value="clave_sat"
                      item-text="nombre"
                      :menu-props="{
                        maxWidth: '526',
                        allowOverflow: false,
                        auto: true,
                        contentClass: 'bg-secondary',
                      }"
                      :error-messages="iErrors.cliente.regimenFiscal"
                    >
                      <template v-slot:item="{ item }">
                        <v-chip class="primary font-weight-bold">
                          {{ item.clave_sat }}</v-chip
                        >
                        <label class="ml-3"> {{ item.nombre }}</label>
                      </template>
                      <template v-slot:selection="{ item }">
                        <v-chip small class="primary font-weight-bold">
                          {{ item.clave_sat }}
                        </v-chip>
                        <label class="ml-3"> {{ item.nombre }}</label>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col cols="12" lg="12">
                    <v-text-field
                      class="my-mayus"
                      label="Calle"
                      v-model="calle"
                      :error-messages="iErrors.domicilio.calle"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-text-field
                      class="my-mayus.mr-2"
                      label="Codigo Postal"
                      v-model="cp"
                      v-mask="'#####'"
                      :error-messages="iErrors.domicilio.cp"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-text-field
                      class="my-mayus mr-2"
                      label="num ext"
                      v-model="num_ext"
                      :error-messages="iErrors.domicilio.numExt"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-text-field
                      class="my-mayus"
                      label="num int"
                      v-model="num_int"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="7">
                    <v-text-field
                      class="my-mayus"
                      label="Colonia"
                      v-model="colonia"
                      :error-messages="iErrors.domicilio.colonia"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="5">
                    <v-text-field
                      class="my-mayus"
                      label="Municipio"
                      v-model="municipio"
                      :error-messages="iErrors.domicilio.municipio"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      class="my-mayus.mr-2"
                      label="Estado"
                      v-model="estado"
                      :error-messages="iErrors.domicilio.estado"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      class="my-mayus"
                      label="Pais"
                      v-model="pais"
                      :error-messages="iErrors.domicilio.pais"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      label="Correo Electronico"
                      v-model="email"
                      :error-messages="iErrors.cliente.correo"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12," lg="6">
                    <v-text-field
                      label="Forma Pago"
                      v-model="metodo_pago_texto"
                      readonly
                      :error-messages="iErrors.cliente.metodoPago"
                      
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" lg="4">
                    <v-select
                      class="mr-2"
                      label="Metodo Pago"
                      v-model="forma_pago"
                      :items="['PUE', 'PPD']"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" lg="8">
                    <v-select
                      label="uso cfdi"
                      v-model="uso_cfdi"
                      :items="lst_uso_cfdi"
                      item-value="clave"
                      item-text="descripcion"
                      :error-messages="iErrors.cliente.usoCFDI"
                    >
                      <template v-slot:item="{ item }">
                        <v-chip class="primary font-weight-bold">
                          {{ item.clave }}
                        </v-chip>
                        <label class="ml-3"> {{ item.descripcion }}</label>
                      </template>
                      <template v-slot:selection="{ item }">
                        <v-chip small class="primary font-weight-bold">
                          {{ item.clave }}
                        </v-chip>
                        <label class="ml-3"> {{ item.descripcion }}</label>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>

      <v-card-actions class="white">
        <v-spacer></v-spacer>
        <v-btn v-if="tab == 0 && factura" @click="editarDatos" color="primary">
          <v-icon> mdi-pencil</v-icon> Editar Datos</v-btn
        >
        <v-btn
          v-if="tab == 0 && !isUndefined(factura)"
          @click="dialog_confirm = true"
        >
          Facturar</v-btn
        >
        <v-btn @click="createOupdate" v-if="tab == 1" color="primary">
          <v-icon> mdi-content-save</v-icon> Guardar y Facturar</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-snackbar color="red" v-model="snackbar_valid">
      <!-- No se puede procesar la factura por datos faltantes favor de revisar -->
      <span class="text-subtitle-1"
        >Faltan datos pára procesar la factura revise su informacion...</span
      >
    </v-snackbar>

    <v-snackbar color="red darken-4" v-model="snackbar_fail">
      <span class="text-subtitle-1">Ocurrio un error intente mas tarde...</span>
    </v-snackbar>
  </v-dialog>
</template>

<script setup>
import { ref, computed, reactive, watch, getCurrentInstance } from "vue";

import isUndefined from "lodash/isUndefined";
import round from "lodash/round";
import debounce from "lodash/debounce";
import numeral from "numeral";
import dayjs from "dayjs";
import { useValidacionFacturaCreate } from "@/composables/useValidacionFacturaCreate";

const props = defineProps({
  cargos_facturar: { type: Array, default: () => [] },
});
const emit = defineEmits(["emit-factura-ok"]);

const { iValid, iErrors, iClear } = useValidacionFacturaCreate();

const root = getCurrentInstance().proxy;

const $axios = root.$axiosFinanzas;
const stateFactura = root.$store.state.sFactura;
const getterFactura = root.$store.getters;

const selectRF = ref(null);

const foliopago = computed(() => stateFactura.folio);
const accion = computed(() => stateFactura.cve_accion);
const numero_accion = computed(() => stateFactura.numero_accion);
const idpago = computed(() => stateFactura.idpago);
const fecha_pago = computed(() => stateFactura.fecha_pago);
const metodo_pago = computed(() => stateFactura.forma_pago);
const metodo_pago_texto = computed(() => stateFactura.forma_pago_text);
const lst_forma_pago = computed(() => stateFactura.lst_forma_pago);
// const lst_uso_cfdi = computed(() => stateFactura.lst_uso_cfdi);
const lst_uso_cfdi = computed(() => {
  return getterFactura.getUsoCfdiByRegimen((regimen_fiscal.value??'').toString());
});
const lst_regimen_fiscal = computed(() => stateFactura.lst_regimen_fiscal);

//#region variable
const dialog = ref(false);
const dialog_confirm = ref(false);
const tab = ref(null);

const lst_datos_facturacion = ref([]);

let id_dato_factura = 0;
const rfc = ref("");
const razon_social = ref("");
const regimen_fiscal = ref("");
const curp = ref("");
const calle = ref("");
const cp = ref("");
const num_ext = ref("");
const num_int = ref("");
const colonia = ref("");
const municipio = ref("León de los Aldamas");
const estado = ref("Guanajuato");
const pais = ref("México");
const email = ref("");
const forma_pago = ref("PUE"); //pago unico
const uso_cfdi = ref();
const editable = ref(false);

const factura = ref({});
const lst_socios_accion = ref([]);
const cve_persona_factura = ref("");

const overlay = ref(false);
const snackbar = ref(false);
const snackbatMensaje = ref([]);
const snackbar_valid = ref(false);
const snackbar_fail = ref(false);

const text_loading = ref("");

//ESTE ES PARA QUE CAMBIE EL REGIMEN FISCAL UNA PROPIEDAD COMPUTADA PUEDA CONSULTAR LOS USOS DE CFDI SEGUN EL REGIMEN FISCAL
watch(factura, (val) => {
  // console.log(val,!!val,Boolean(val))
  if (!!val) regimen_fiscal.value = val?.regimen_fiscal;
});

//#endregion

function initFactura() {
  getDatosFacturacion();
  getSociosAccion();
  console.log("selectRF:", selectRF.value);
}

async function getDatosFacturacion() {
  let { data, status } = await $axios.get("pago/datos-factura", {
    params: { cve_accion: accion.value },
  });
  lst_datos_facturacion.value = data;
}

async function getSociosAccion() {
  let { data, status } = await $axios.get("pago/socios-accion", {
    params: { cve_accion: accion.value },
  });
  lst_socios_accion.value = data;
}

//funcion para realizar el tratamiento de los movimientos y de la descripcion y no repetir muchas veces
function fnMovimientosAndObservacion() {
  const movimientos = props.cargos_facturar
    .filter((i) => i.total > 0)
    .map((i) => ({
      codProducto: i.producto_servicio,
      unidades: i.cantidad,
      importe: round(numeral(i.total).value(), 2),
      descuento: round(numeral(i.descuento).value(), 2),
    }));

  const observaciones = `
      folio de pago: ${foliopago.value} de la accion(${
    numero_accion.value
  }) | los cargos son: ${props.cargos_facturar
    .filter((i) => i.total > 0)
    .map((i) => `${i.concepto} ${i.periodo}`)
    .join()}`;

  return { movimientos, observaciones };
}

function confirmSaveFactura() {
  dialog_confirm.value = true;
}

const saveFactura = debounce(async () => {
  dialog_confirm.value = false;
  text_loading.value = "Facturando...";
  overlay.value = true;

  try {
    //movimientos y observacion;
    const { movimientos, observaciones } = fnMovimientosAndObservacion();

    //llenado de los campos
    const factura_envio = {
      accion: accion.value,
      idpago: idpago.value,
      id_dato_factura: factura.value.id_datos_facturacion,
      cliente: {
        rfc: factura.value.rfc,
        razonSocial: factura.value.razon_social,
        curp: "NA",
        correo: factura.value.correo,
        metodoPago: numeral(metodo_pago.value).format("00"),
        usoCFDI: uso_cfdi.value,
        regimenFiscal: factura.value.regimen_fiscal,
      },
      domicilio: {
        calle: factura.value.calle,
        numExt: factura.value.num_ext,
        numInt: factura.value.num_int,
        colonia: factura.value.colonia,
        cp: factura.value.cp,
        municipio: factura.value.municipio,
        estado: factura.value.estado,
        pais: factura.value.pais,
      },
      movimientos,
      fecha_pago: fecha_pago.value,
      folio_pv: foliopago.value,
      observaciones,
    };

    //validacion
    const data_valid = await iValid(factura_envio);

    let { data, status } = await $axios.post(
      `facturacion-v4/factura/${numero_accion.value}`,
      data_valid
    );

    if (status == 200) {
      //salio bien procede a realizar lo demas jajaja
      emit("emit-factura-ok", data);
    } else {
      //cualquier otro problema
    }
  } catch (error) {
    console.log("Error Name:", error.name);
    console.log("Error:", error);

    if (error.name == "ValidationError") {
      snackbar_valid.value = true;
    } //fin if error
    else if (error.name == "AxiosError") {
      snackbar_fail.value = true;
    }
  } finally {
    overlay.value = false;
  }
}, 500);

const createOupdate = debounce(() => {
  if (id_dato_factura > 0) saveUpdateDatosFactura();
  else saveCreateDatosFactura();
}, 500);

const saveCreateDatosFactura = debounce(async () => {
  overlay.value = true;
  text_loading.value = "Facturando Nuevo RFC";

  //movimientos y observacion;
  const { movimientos, observaciones } = fnMovimientosAndObservacion();

  let factura_envio = {
    accion: accion.value,
    codigo_cliente: numero_accion.value,
    pertenece: cve_persona_factura.value,
    flag: true,
    cliente: {
      rfc: rfc.value,
      razonSocial: razon_social.value,
      curp: "NA",
      correo: email.value,
      metodoPago: numeral(metodo_pago.value).format("00"),
      usoCFDI: uso_cfdi.value,
      regimenFiscal: regimen_fiscal.value,
    },
    domicilio: {
      calle: calle.value,
      numExt: num_ext.value,
      numInt: num_int.value,
      colonia: colonia.value,
      cp: cp.value,
      municipio: municipio.value,
      estado: estado.value,
      pais: pais.value,
    },
    movimientos,
    fecha_pago: dayjs(fecha_pago.value).format("YYYY-MM-DD"),
    folio_pv: foliopago.value,
    observaciones,
    idpago: idpago.value,
  };

  console.log("🚀 ~ file: factura-comercial-v4-detalle-normal.vue:640 ~ saveCreateDatosFactura ~ factura_envio:", factura_envio);


  try {
    const data_valid = await iValid(factura_envio);

    console.log("🚀 ~ file: factura-comercial-v4-detalle-normal.vue:646 ~ saveCreateDatosFactura ~ data_valid:", data_valid);


    await $axios.post(
      `facturacion-v4/datos-factura/${numero_accion.value}`,
      data_valid
    );
  } catch (error) {
    console.log("Error Name:", error.name);
    if (error.name == "AxiosError") {
      console.log(error);
      snackbar_fail.value = true;
    }
  } finally {
    overlay.value = false;
    text_loading.value = "";
  }
}, 500);

const saveUpdateDatosFactura = debounce(async () => {
  overlay.value = true;
  text_loading.value = "Facturando";

  //movimientos y observacion;
  const { movimientos, observaciones } = fnMovimientosAndObservacion();

  let factura_envio = {
    accion: accion.value,
    codigo_cliente: numero_accion.value,
    pertenece: cve_persona_factura.value,
    flag: true,
    cliente: {
      rfc: rfc.value,
      razonSocial: razon_social.value,
      curp: "NA",
      correo: email.value,
      metodoPago: numeral(metodo_pago.value).format("00"),
      usoCFDI: uso_cfdi.value,
      regimenFiscal: regimen_fiscal.value,
    },
    domicilio: {
      calle: calle.value,
      numExt: num_ext.value,
      numInt: num_int.value,
      colonia: colonia.value,
      cp: cp.value,
      municipio: municipio.value,
      estado: estado.value,
      pais: pais.value,
    },
    movimientos,
    fecha_pago: dayjs(fecha_pago.value).format("YYYY-MM-DD"),
    folio_pv: foliopago.value,
    observaciones,
    idpago: idpago.value,
  };

  try {
    const data_valid = await iValid(factura_envio);

    await $axios.put(`facturacion-v4/${id_dato_factura}`, data_valid);
  } catch (error) {
    
    if (error.name == "AxiosError") {
      snackbar_fail.value = true;
    }
  } finally {
    overlay.value = false;
    text_loading.value = "";
  }
}, 500);

function updateRazonsocial(item) {
  razon_social.value = lst_socios_accion.value.find(
    (i) => i.cve_persona == item
  ).nombre;
}

function clearTabs(tabx) {
  console.log(selectRF.value);
  if (tabx === 0) {
    factura.value = undefined;
  } else {
    id_dato_factura = 0;
    cve_persona_factura.value = "";
    razon_social.value = "";
    rfc.value = "";
    calle.value = "";
    cp.value = "";
    num_ext.value = "";
    num_int.value = "";
    colonia.value = "";
    municipio.value = "León de los Aldama";
    estado.value = "Guanajuato";
    pais.value = "México";
    email.value = "";
  }
}

function editarDatos() {
  id_dato_factura = factura.value.id_datos_facturacion;
  cve_persona_factura.value = factura.value.cve_persona;
  rfc.value = factura.value.rfc;
  razon_social.value = factura.value.razon_social;
  curp.value = factura.value.curp;
  regimen_fiscal.value = factura.value.regimen_fiscal;
  calle.value = factura.value.calle;
  cp.value = factura.value.cp;
  num_ext.value = factura.value.num_ext;
  num_int.value = factura.value.num_int;
  colonia.value = factura.value.colonia;
  municipio.value = factura.value.municipio;
  estado.value = factura.value.estado;
  pais.value = factura.value.pais;
  email.value = factura.value.correo;
  console.log(factura.value);
  tab.value = 1;
}

function fnMostrarRegimenFiscalText(id_regimen_fiscal)
{
   return lst_regimen_fiscal.value.find(i=>i.clave_sat==id_regimen_fiscal)?.nombre??'No tiene regimen fiscal..'
  
}
</script>

<style>
.my-mayus input {
  text-transform: uppercase;
}

.bg-secondary > div {
  background-color: var(--v-secondary-base);
  color: white !important;
}
</style>

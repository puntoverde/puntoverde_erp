<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-breadcrumbs
        class="bread pl-0"
        :items="[
          {
            text: 'Dashboard',
            disabled: false,
            href: 'breadcrumbs_dashboard',
          },
          {
            text: 'Link 1',
            disabled: false,
            href: 'breadcrumbs_link_1',
          },
          {
            text: 'Link 2',
            disabled: true,
            href: 'breadcrumbs_link_2',
          },
        ]"
      >
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Direcciones de Facturacion</h1>
    </div>

    <div id="grid-datos-factura" class="pt-1 black rounded-xl elevation-5">
      <v-toolbar
        color="secondary"
        class="rounded-tl-xl"
        dark
        elevation="0"
      >
        <v-toolbar-title>Socios de Accion:</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="accion"
          v-mask="accionMask"
          solo-inverted
          hide-details
          @keyup.enter="getSocios"
          prepend-inner-icon="mdi-magnify"
          placeholder="Ingrese numero de accion"
          style="font-size: 25px; min-width: 150px"
        ></v-text-field>

        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->

        <!-- <template v-slot:extension>
          <div class="pt-1 primary" style="width: 100%"></div>
        </template> -->
      </v-toolbar>

      <v-toolbar color="secondary" class="rounded-tr-xl" dark elevation="0">
        <v-toolbar-title>Datos de Facturacion</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-tooltip left color="primary">
          <template v-slot:activator="{ on }">
            <v-btn
              color="secondary"
              roundedx
              fab
              small
              v-on="on"
              @click="dialog = true"
              :disabled="!selected"
            >
              <v-icon>mdi-badge-account</v-icon>
            </v-btn>
          </template>
          <span>Agregar nuevo registro de Datos Fiscales</span>
        </v-tooltip>
      </v-toolbar>

      <div class="rounded-bl-xl">
        <v-list>
          <v-list-item-group v-model="selected">
            <v-list-item
              :value="socio.cve_persona"
              @click="getDatosFacturacion(socio.cve_persona)"
              two-line
              outline
              v-for="(socio, index) in lst_socios"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title
                  >{{ socio.nombre
                  }}<span class="font-weight-bold mx-1">{{
                    socio.paterno
                  }}</span
                  ><span class="font-italic">{{ socio.materno }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Parentesco:<span class="font-weight-bold accent--text mx-1">{{
                    socio.parentesco
                  }}</span
                  >, edad:
                  <v-chip small color="primary" outlined
                    >{{ socio.edad }} años</v-chip
                  >
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      <div class="rounded-br-xl">
        <v-list>
          <template v-for="(fact, ind) in lst_datos_facturacion"
            >
          <v-list-item
            ripple
            three-line
            outline  
            :key="ind"          
          >
            <v-list-item-content>
              <v-list-item-title
                >RFC:
                <span class="font-weight-bold accent--text mx-1">{{
                  fact.rfc
                }}</span
                >, Rsocial:
                <span class="font-weight-bold accent--textx mx-1">
                  {{ fact.razon_social }}</span
                ></v-list-item-title
              >
              <v-list-item-subtitle>
                correo:<v-chip small class="font-weight-bold" outlined>{{
                  fact.correo
                }}</v-chip>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <span class="font-weight-black mr-2"> <v-icon small>mdi-home</v-icon> Domicilio</span> 
                Calle:<span class="font-weight-bold accent--text">{{fact.calle}}</span>
                Numero ext:<span class="font-weight-bold">{{ fact.num_ext }}</span>, int:<span class="font-weight-bold">{{ fact.num_int }}</span>, 
                Codigo postal <span class="font-weight-bold">{{ fact.cp }}</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Colonia: <span class="font-weight-bold">{{ fact.colonia }}</span> ,Municipio:<span class="font-weight-bold">{{ fact.municipio }}</span>, 
                Estado:<span class="font-weight-bold">{{fact.estado}}</span>, Pais:<span class="font-weight-bold">{{ fact.pais }}</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                <span class="font-weight-bold primary--text">Regimen Fiscal:</span>{{ fact.nombre }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon outlined color="primary" @click="getDateEdit(fact)"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`${ind}-x`" class="secondary" inset></v-divider>
          </template>
        </v-list>
      </div>
    </div>

    <!-- <v-card
      :loading="loading"
      elevation="0"
      pt="0"
      class="mx-auto"
      :outlined="true"
      :raised="true"
    >
      <v-card-title class="d-flex justify-space-between">
        <h2 class="accent--text">Direcciones de Facturacionxxx</h2>
      </v-card-title>
      <v-card-text class="d-flex justify-space-around">
        <div class="infoz px-3 flex-grow-0" style="min-width: 49%">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Listado socios de accion:</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-text-field
              v-model="accion"
              v-mask="accionMask"
              solo-inverted
              hide-details
              @keyup.enter="getSocios"
            ></v-text-field>

            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list>
            <v-list-item-group v-model="selected">
              <v-list-item
                :value="socio.cve_persona"
                @click="getDatosFacturacion(socio.cve_persona)"
                two-line
                outline
                v-for="(socio, index) in lst_socios"
                :key="index"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ socio.socio }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Parentesco:{{ socio.parentesco }}, edad:{{
                      socio.edad
                    }}
                    años
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
        <v-divider vertical></v-divider>
        <div class="successz px-3 flex-grow-1">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Datos de Facturacion</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
              color="secondary"
              rounded
              @click="dialog = true"
              :disabled="!selected"
            >
              <v-icon>mdi-home-account</v-icon>
            </v-btn>
          </v-toolbar>

          <v-list>
            <v-list-item
              ripple
              three-line
              outline
              v-for="(fact, ind) in lst_datos_facturacion"
              :key="ind"
            >
              <v-list-item-content>
                <v-list-item-title
                  >RFC: {{ fact.rfc }}, Rsocial:
                  {{ fact.razon_social }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  correo:{{ fact.correo }}, calle:{{ fact.calle }} num ext:{{
                    fact.num_ext
                  }}, int:{{ fact.num_int }}, codigo postal {{ fact.cp }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  colonia:{{ fact.colonia }} ,municipio:{{ fact.municipio }},
                  estado:{{ fact.estado }}, pais:{{ fact.pais }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Regimen Fiscal:{{ fact.nombre }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon outlined color="primary" @click="getDateEdit(fact)"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
    </v-card> -->

    <v-dialog v-model="dialog" max-width="600" persistent scrollable>
      <v-card color="primary">
        <v-toolbar shapedx flat color="secondary" dark>
          <v-icon
            class="mr-2"
            v-text="id_datos_facturacion ? 'mdi-account-edit' : 'mdi-account-plus'"
          ></v-icon>
          <v-toolbar-title class="text-button-2 font-weight-bold"
            >{{ id_datos_facturacion ? "Editar" : "Registro de" }} Datos
            Fiscales</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn @click="CloseDialog" icon color=""
            ><v-icon>mdi-close-box</v-icon></v-btn
          >
        </v-toolbar>
        <!-- <v-system-bar color="primary" height="5"></v-system-bar> -->
        <v-card-text class="mt-1 pt-5 white">
          <v-row>
            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.razon_social"
                label="Razon Social"
                v-model="razon_social"
                class="my-mayus"
              ></v-text-field>
            </v-col>
            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.rfc"
                label="RFC"
                v-model="rfc"
                class="my-mayus"
              ></v-text-field>
            </v-col>
            <v-col lg="12">
              <v-select
                :error-messages="iErrors.regimen_fiscal"
                label="Regimen Fiscal"
                v-model="regimen_fiscal"
                :items="lst_regimen_fiscal"
                item-value="clave_sat"
                item-text="nombre"
              ></v-select>
            </v-col>
            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.correo"
                label="Correo"
                v-model="correo"
              ></v-text-field>
            </v-col>

            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.calle"
                label="Calle"
                v-model="calle"
                class="my-mayus"
              ></v-text-field>
            </v-col>
            <v-col lg="4">
              <v-text-field
                :error-messages="iErrors.num_ext"
                label="Numero Exterior"
                v-model="num_ext"
                class="my-mayus"
              ></v-text-field>
            </v-col>
            <v-col lg="4">
              <v-text-field
                label="Numero Interior"
                v-model="num_int"
                class="my-mayus"
              ></v-text-field>
            </v-col>
            <v-col lg="4">
              <v-text-field
                :error-messages="iErrors.cp"
                label="Codigo Postal"
                v-model="cp"
                v-mask="'#####'"
                class="my-mayus"
              ></v-text-field>
            </v-col>
            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.colonia"
                label="Colonia"
                v-model="colonia"
                class="my-mayus"
              ></v-text-field>
            </v-col>

            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.municipio"
                label="Municipio"
                v-model="ciudad"
                class="my-mayus"
              ></v-text-field>
            </v-col>

            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.estado"
                label="Estado"
                v-model="estado"
                class="my-mayus"
              ></v-text-field>
            </v-col>

            <v-col lg="6">
              <v-text-field
                :error-messages="iErrors.pais"
                label="Pais"
                v-model="pais"
                class="my-mayus"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-divider color="accent"></v-divider> -->
        <v-card-actions class="secondary mt-1">
          <div class="flex-grow-1"></div>
          <v-btn outlined tile color="white" @click="Cancelar">
            <v-icon>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn color="success" tile @click="save" :loading="loading_save">
            <v-icon>mdi-content-save</v-icon>
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" top color="info">
      <v-icon>mdi-information</v-icon> {{ snackbar_mensaje }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import isEmpty from "lodash/isEmpty";
import {getSociosService,getDatosFacturacionService,saveDatosFacturacionService,updateDatosFacturacionService,getRegimenfiscalService,getFotoService} from '@/services/datos_facturacion_service'
import {useValidacionFactura} from '@/composables/useValidacionFactura'

const {iValid, iErrors, iClear} =useValidacionFactura()

const accion = ref("");
//datos facturacion
const id_datos_facturacion = ref(0);
const rfc = ref("");
const razon_social = ref("");
const correo = ref("");
const regimen_fiscal = ref("");
const calle = ref("");
const num_ext = ref("");
const num_int = ref("");
const colonia = ref("");
const cp = ref("");
const ciudad = ref("");
const estado = ref("");
const pais = ref("");

const lst_socios = ref([]);
const lst_datos_facturacion = ref([]);

const dialog = ref(false);
const loading = ref(false);
const loading_save = ref(false);
const snackbar = ref(false);
const snackbar_mensaje = ref();

const selected = ref(undefined);

const lst_regimen_fiscal = ref([]);

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

onMounted(() => getRegimenFiscal());

async function getSocios() {
  lst_socios.value=[]
  lst_datos_facturacion.value=[]

  let numero_accion = accion.value;
  let clasificacion = 0;

  if (accion.value.indexOf("A") >= 0) {
    numero_accion = accion.value.substr(0, accion.value.indexOf("A"));
    clasificacion = 1;
  } else if (accion.value.indexOf("B") >= 0) {
    numero_accion = accion.value.substr(0, accion.value.indexOf("B"));
    clasificacion = 2;
  } else if (accion.value.indexOf("C") >= 0) {
    numero_accion = accion.value.substr(0, accion.value.indexOf("C"));
    clasificacion = 3;
  }

  loading.value = true;
  try {
    // let { data, status } = await $axios.get("datos-facturacion/socios", {params: { numero_accion, clasificacion }});
    const data=await getSociosService(numero_accion,clasificacion)
    lst_socios.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function getDatosFacturacion(cve_persona) {
  selected.value = cve_persona;
  try {
    // let { data, status } = await $axios.get(`datos-facturacion/${cve_persona}`);
    const data=await getDatosFacturacionService(cve_persona)
    lst_datos_facturacion.value = data;
  } catch (error) {}
}

async function save() {
  console.log("selected value:", selected.value);

  let dataSend = {
    razon_social: razon_social.value,
    rfc: rfc.value,
    correo: correo.value,
    cp: cp.value,
    calle: calle.value,
    num_ext: num_ext.value,
    num_int: num_int.value,
    colonia: colonia.value,
    municipio: ciudad.value,
    estado: estado.value,
    pais: pais.value,
    regimen_fiscal: regimen_fiscal.value,
  };
  loading_save.value = true;
  try {
    
    const data_valid=await iValid(dataSend)

    if (id_datos_facturacion.value == 0) {
      console.log("if para post");
      // let { data, status } = await $axios.post(`datos-facturacion/${selected.value}`,data_valid);
      const data=await saveDatosFacturacionService(selected.value,data_valid)
      if (data > 0) {
        lst_datos_facturacion.value.push(dataSend);
        snackbar.value = true;
        snackbar_mensaje.value = "Registro Exitoso";
        Cancelar();
        dialog.value = false;
      } else {
        snackbar.value = true;
        snackbar_mensaje.value =
          "Error verifique informacion, e intentar de nuevo";
      }
    } //fin if post
    else {
      console.log("else para put", id_datos_facturacion.value);
      // let { data, status } = await $axios.put(`datos-facturacion/${id_datos_facturacion.value}`,data_valid);
      const data=await updateDatosFacturacionService(id_datos_facturacion.value,data_valid)
      if (data > 0) {
        snackbar.value = true;
        snackbar_mensaje.value = "Actualizado con Exito";      
        Cancelar();
        dialog.value = false;
      } else {
        console.log("entra en el else");
        snackbar.value = true;
        snackbar_mensaje.value =
          "Error verifique informacion, e intentar de nuevo";
      }
    } //fin else put
  } catch (error) {
    //fin try
      snackbar.value = true;
      snackbar_mensaje.value =
        "Error verifique informacion, e intentar de nuevo";
   
  } finally {
    //fin catch
    loading_save.value = false;
  }
}

async function getFoto(socio) {
  let reader = new FileReader();
  reader.onload = (e) => {
    console.log("foito->", reader.result);
    socios.value = reader.result;
  };

  if (!isEmpty(socio.foto)) {
    try {
      // let { data, status } = await root->.$axios.get(`socios/foto`, {responseType: "blob",params: { foto: socio.foto }});
      const data=await getFotoService(socio.foto)
      reader.readAsDataURL(data);
    } catch (error) {
      console.log("error");
    }
  } else {
    console.log("no foto");
  }
}

function getDateEdit(fact) {
  console.log(
    "🚀 ~ file: catalogo_facturacion.vue:470 ~ getDateEdit ~ fact",
    fact.id_datos_facturacion
  );

  dialog.value = true;
  id_datos_facturacion.value = fact.id_datos_facturacion;
  razon_social.value = fact.razon_social;
  rfc.value = fact.rfc;
  correo.value = fact.correo;
  cp.value = fact.cp;
  calle.value = fact.calle;
  num_ext.value = fact.num_ext;
  num_int.value = fact.num_int;
  colonia.value = fact.colonia;
  ciudad.value = fact.municipio;
  estado.value = fact.estado;
  pais.value = fact.pais;
  regimen_fiscal.value = fact.regimen_fiscal;
}

function Cancelar() {
  id_datos_facturacion.value =undefined;
  razon_social.value =undefined;
  rfc.value =undefined;
  correo.value =undefined;
  cp.value =undefined;
  calle.value =undefined;
  num_ext.value =undefined;
  num_int.value =undefined;
  colonia.value =undefined;
  ciudad.value =undefined;
  estado.value =undefined;
  pais.value =undefined;
  regimen_fiscal.value =undefined;

  iClear()
  dialog.value=false
}



function CloseDialog() {
  dialog.value = false;
  Cancelar();
}

async function getRegimenFiscal() {
  try {
    // let { data, status } = await $axios.get(`datos-facturacion/regimen-fiscales`);
    const data=await getRegimenfiscalService()
    lst_regimen_fiscal.value = data;
  } catch (error) {}
}
</script>

<style scoped>
#grid-datos-factura {
  height: calc(100vh - 200px);
  width: 100%;
  display: grid;
  grid-template-columns: 40% 1fr;
  grid-template-rows: 60px 1fr;
  column-gap: 2px;
}

#grid-datos-factura > div:nth-child(3) {
  height: 100%;
  width: 100%;
  background-color: white;
  overflow-y: auto;
}

#grid-datos-factura > div:nth-child(4) {
  height: 100%;
  width: 100%;
  background-color: white;
  overflow-y: auto;
}
</style>

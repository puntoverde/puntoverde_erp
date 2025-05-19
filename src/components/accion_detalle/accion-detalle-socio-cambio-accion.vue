<template>
  <div>
    <v-list-item @click="dialog = true">
      <v-list-item-title>
        <v-icon>mdi-swap-horizontal</v-icon>Cambio de Acción
      </v-list-item-title>
    </v-list-item>

    <!-- dialog para cambio de accion  -->
    <v-dialog v-model="dialog" max-width="500px" scrollable persistent>
      <v-card rounded="xl">
        <!-- <v-card-title>Cambio de Accion</v-card-title> -->
        <v-toolbar elevation="0" color="secondaryx">
          <span>Ingrese Accion a la que desea cambiar {{ cve_accion_ }}</span>
          <!-- <v-toolbar-title> Cambio de accion </v-toolbar-title> -->
        </v-toolbar>
        <!-- <v-divider style="min-height: 3px" class="primary"></v-divider> -->
        <v-card-text class="pt-5 px-16">
          <v-window v-model="window">
            <v-window-item>
              <v-text-field
                id="text-accion"
                placeholder="Accion"
                v-model="numeroAccion"
                @keyup.enter="cambioAccionSocio"
                outlined
                height="100px"
              ></v-text-field>

              <v-alert v-if="alert_bloqueado" type="error">
                la accion esta bloqueada
              </v-alert>
              <v-alert v-if="alert_misma" type="warning">
                es la misma accion eligue otra
              </v-alert>
            </v-window-item>

            <v-window-item>
              <v-list shaped v-if="posicionesDisponbles.length > 0">
                <v-subheader
                  >Parentescos Disponibles
                  {{ parentesco_seleccionado }}</v-subheader
                >
                <v-list-item-group
                  v-model="parentesco_seleccionado"
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in lst_parentescos"
                    :key="`${i}-pare`"
                    :value="item.cve_parentesco"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-alert-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-window-item>

            <v-window-item>
              <!-- <v-card class="mx-auto" max-width="300" tile> -->
              <v-list shaped v-if="posicionesDisponbles.length > 0">
                <v-subheader>Posiciones Disponibles</v-subheader>
                <v-list-item-group v-model="items_group" color="primary">
                  <v-list-item
                    v-for="(item, i) in posicionesDisponbles"
                    :key="`${i}-pos`"
                    @click="
                      selectOptionPosicion(item.cve_accion, item.posicion)
                    "
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-alert-circle-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="`Posicion Numero: ${item.posicion}`"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <!-- </v-card> -->
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" outlined @click="fnClose">Cerrar</v-btn>
          <v-btn v-if="window == 0" color="secondary" @click="cambioAccionSocio"
            >Aceptar</v-btn
          >
          <v-btn
            v-if="window == 1 && parentesco_seleccionado"
            color="secondary"
            @click="window = 2"
            >siguiente</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialo para confirm para cambio accion -->
    <v-dialog v-model="dialog2" max-width="290">
      <v-card>
        <v-card-title class="headline">Cambiar Socio de Accion</v-card-title>

        <v-card-text>
          De click en
          <b>Aceptar</b> para continuar con la acción, de lo contrario dar click
          <b>Cancelar</b> para abortar la acción.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialog2 = false"
            >Cancelar</v-btn
          >

          <v-btn color="green darken-1" text @click="confirmCambioAccion"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import {posicionesSocioByAccionService,ConfirmarCambioPosicioAccionNuevaSocioService} from '@/services/socios_service'
import _array from "lodash/array";

const props = defineProps({
  cve_socio: {
    type: Number,
    default: 0,
  },
  msj: {
    type: String,
    default: "",
  },
});

const cve_accion_ = inject("cve_accion");
const numero_accion_ = inject("numero_accion");
const clasificacion_ = inject("clasificacion");
const cve_tipo_accion_ = inject("cve_tipo_accion");
const accion_mostrar_ = inject("accion_mostrar");

const dialog = ref(false);
const dialog2 = ref(false);
const numeroAccion = ref("");
const posicion = ref(0);
const posicionesDisponbles = ref([]);
const items_group = ref(null);
let cve_accion_cambio = 0;

const alert_bloqueado = ref(false);
const alert_misma = ref(false);

const lst_parentescos = ref([]);
const parentesco_seleccionado = ref();

const window = ref(0);

function selectOptionPosicion(cve_accion, pos) {
  cve_accion_cambio = cve_accion;
  posicion.value = pos;
  dialog2.value = true;
}

async function cambioAccionSocio() {
  let indexTripartidas = -1;
  let numero_accion = 0;
  let clasificacion = 0;
  let accion_complete = numeroAccion.value.toUpperCase();

  if (numeroAccion.value.indexOf("A") > -1) {
    indexTripartidas = numeroAccion.value.indexOf("A");
    clasificacion = 1;
  } else if (
    numeroAccion.value.indexOf("B") > -1 ||
    numeroAccion.value.indexOf("b") > -1
  ) {
    indexTripartidas = this.numeroAccion.indexOf("B");
    clasificacion = 2;
  } else if (
    numeroAccion.value.indexOf("C") > -1 ||
    numeroAccion.value.indexOf("c") > -1
  ) {
    indexTripartidas = this.numeroAccion.indexOf("C");
    clasificacion = 3;
  }

  numero_accion = numeroAccion.value;

  if (indexTripartidas > -1) {
    numero_accion = numeroAccion.value.substr(0, indexTripartidas);
  }

  // let { data } = await $axios.get("socios/posiciones_acciones", {
  //   params: {
  //     numero_accion: numero_accion,
  //     clasificacion: clasificacion,
  //     cve_accion: cve_accion_.value,
  //   },
  // });

  const data=await posicionesSocioByAccionService(numero_accion,clasificacion,cve_accion_.value)

  if (data.accion) {
    alert_misma.value = false;
    alert_bloqueado.value = false;
    if (data.accion?.misma_accion == 1) {
      alert_misma.value = true;
    } else if (data.accion?.estatus == 3) {
      alert_bloqueado.value = true;
    } else {
      window.value = 1;
      lst_parentescos.value = data.parentescos;

      if (Object.keys(data.posiciones).length > 0) {
        let tope = _array.last(data.posiciones).posicion;
        // let cve_accion = _array.last(data).cve_accion;
        let cve_accion = data.accion?.cve_accion;
        let arrayPosiciones = [];

        for (let i = 0; i <= tope; i++) {
          if (
            typeof data.posiciones.find(
              (item) => parseInt(item.posicion) === i
            ) === "undefined"
          )
            arrayPosiciones.push(i);
        }

        // si no se encontro lugar se pone por defauult uno mas del tope
        if (arrayPosiciones.length === 0) {
          alert("entra qeui");
          // cve_accion_cambio = cve_accion;
          cve_accion_cambio = cve_accion;
          posicion.value = parseInt(tope) + 1;
          dialog2.value = true;
        } else {
          posicionesDisponbles.value = [];
          arrayPosiciones.forEach((item) =>
            posicionesDisponbles.value.push({
              cve_accion: cve_accion,
              posicion: item,
            })
          );
        }
      }
    }
  }
}

async function confirmCambioAccion() {
  // let { data } = await $axios.put(`socios/${props.cve_socio}/params`, {
  //   cve_accion: cve_accion_cambio,
  //   posicion: posicion.value,
  //   cve_parentesco: parentesco_seleccionado.value,
  // });

 const data=await ConfirmarCambioPosicioAccionNuevaSocioService(props.cve_socio,cve_accion_cambio,posicion.value,parentesco_seleccionado.value)

  dialog2.value = false;
  dialog.value = false;

  let index_delete = lst_socios.value.findIndex(
    (i) => i.cve_socio === socioSelected.value.cve_socio
  );
  lst_socios.value.splice(index_delete, 1);
}

function fnClose() {
  window.value = 0;
  dialog.value = false;
  numeroAccion.value = "";
  posicionesDisponbles.value = [];
  lst_parentescos.value = [];
  parentesco_seleccionado.value = undefined;
}
</script>

<style>
#text-accion {
  font-size: 50px !important;
  min-height: 50px !important;
  text-align: center;
}
</style>
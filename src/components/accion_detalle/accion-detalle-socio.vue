<template>
  <div>
    <v-card class="mx-auto" :outlined="true" :raised="true">
      <v-overlay :absolute="true" :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-card-title class="d-flex justify-space-between">
        <h4 class="accent--text">Usuarios</h4>

        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="ListaSocios" small fab color="info">
                <v-icon>mdi-account-multiple-plus-outline</v-icon>
              </v-btn>
            </template>
            <span>Agregar usuario existente</span> </v-tooltip
          >&nbsp;
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="nuevoSocio" small fab color="primary">
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
            <span>Nuevo Usuario</span>
          </v-tooltip>
        </div>
      </v-card-title>
      <v-divider inset class="accent lighten-3"></v-divider>
      <v-card-text class="mt-0 pt-0">
        <v-row row wrap>
          <v-col class="mt-0 pt-0">
            <v-list three-line class="mt-0 pt-0">
              <!--v-subheader>Socios</v-subheader-->
              <template v-for="(socio, index) in lst_socios">
                <v-list-item :key="`${index}-1`">
                  <socio-foto
                    :cve_socio="socio.cve_socio"
                    :parentesco="socio.cve_parentesco"
                    :foto_socio="socio.foto"
                  />

                  <v-list-item-content>
                    <v-list-item-title>
                      <v-btn
                        @click="showObservaciones(socio.cve_persona)"
                        icon
                        class="mr-2"
                        color="error"
                        v-if="socio.borra_huella_observacion > 0"
                      >
                        <v-icon>mdi-comment-alert</v-icon> </v-btn
                      >{{ socio.nombre }} {{ socio.apellido_paterno }}
                      {{ socio.apellido_materno }}</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      NIP:{{ socio.numero_accion
                      }}{{ fClasificacion(socio.clasificacion)
                      }}{{ socio.posicion }} Celular:{{
                        socio.celular
                      }}
                      Telefono: {{ socio.telefono }} , Posicion:
                      {{ socio.posicion }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Parentesco: {{ socio.parentesco }} Edad: {{ socio.edad }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-menu
                      bottom
                      origin="center center"
                      transition="scale-transition"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn icon dark v-on="on">
                          <v-icon color="grey lighten-1"
                            >mdi-dots-vertical</v-icon
                          >
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="editarSocio(socio.cve_socio)">
                          <v-list-item-title>
                            <v-icon>mdi-account-edit</v-icon>Editar
                          </v-list-item-title>
                        </v-list-item>

                        <socio-baja
                          :cve_socio="socio.cve_socio"
                          :index="index"
                          @emit-delete-socio="(i) => lst_socios.splice(i, 1)"
                        />

                        <socio-acceso-huella
                          :cve_socio="socio.cve_socio"
                          :huella="socio.acceso_sin_huella"
                        />
                        
                        <socio-bloqueo
                          :cve_socio="socio.cve_socio"
                          :bloqueo="socio.bloqueo_temporal"
                        />

                        <socio-mensaje
                          :cve_socio="socio.cve_socio"
                          :msj="socio.observaciones"
                        />

                        <socio-expediente-digital
                          :cve_socio="socio.cve_socio"
                          :cve_accion="cve_accion"
                        />

                        <socio-cambio-accion :cve_socio="socio.cve_socio" />

                        <socio-cambio-posicion
                          :cve_socio="socio.cve_socio"
                          :posicion_actual="socio.posicion"
                          :posiciones_disponibles="
                            lst_socios.map((i) => i.posicion)
                          "
                          @emit-posicion="(p) => (socio.posicion = p)"
                        />
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="index"></v-divider>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarTipo">
      {{ snackbarMsj }}
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>Agregar socio existente</v-card-title>
        <v-card-text>
          <v-autocomplete
            label="Escriba el nombre del socio para agregar"
            :items="socios_disponibles"
            v-model="lst_socios_disponibles"
            item-text="nombre"
            return-object
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn
          >&nbsp;
          <v-btn color="success" dark @click="confirmar = true">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="loader" z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="confirmar" persistent max-width="490">
      <v-card>
        <v-card-title class="headline"
          >¿Realmente deseas agregar al socio?</v-card-title
        >
        <v-card-text>
          De click en
          <b>Aceptar</b> para continuar con la acción, de lo contrario dar click
          <b>Cancelar</b> para abortar la acción.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="confirmar = false"
            >Cancelar</v-btn
          >
          <v-btn color="success darken-1" text @click="AgregarSocioExistente"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_observacion" width="600" persistent>
      <v-card color="primary">
        <v-card-title class="white--text d-flex justify-space-between">
          Historico de Observaciones del Usuario
          <v-btn @click="dialog_observacion = false" icon>
            <v-icon color="white"> mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(observ, index) in lst_historico_observaciones"
              :key="index"
            >
              <v-expansion-panel-header
                color="secondary"
                class="white--text text-button font-weight-bold"
              >
                Redactada por :{{ observ.redacto }} en {{ observ.fecha }}
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-5">
                <v-card color="grey lighten-1">
                  <v-card-text> {{ observ.observacion }}</v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import SocioAccesoHuella from "./accion-detalle-socio-acceso-huella.vue";
import SocioBaja from "./accion-detalle-socio-baja.vue";
import SocioBloqueo from "./accion-detalle-socio-bloqueo.vue";
import SocioMensaje from "./accion-detalle-socio-mensaje.vue";
import SocioCambioPosicion from "./accion-detalle-socio-cambio-posicion.vue";
import SocioCambioAccion from "./accion-detalle-socio-cambio-accion.vue";
import SocioExpedienteDigital from "./accion-detalle-socio-expediente-digital.vue";
import SocioFoto from "./accion-detalle-socio-foto.vue";

import {getSocioService,SocioDisponiblesCambioService,SocioAgregarExistentesService,showObservacionesSocioService} from '@/services/socios_service'

const props = defineProps({
  cve_accion: {
    type: Number,
    default: 0,
  },
  accion_text: { type: String, default: "" },
});

const root = getCurrentInstance().proxy;
const snackbar = ref(false);
const snackbarMsj = ref("");
const snackbarTipo = ref("success");
const overlay = ref(false);
const lst_socios = ref([]);
const dialog = ref(false);
const socios_disponibles = ref([]);
const lst_socios_disponibles = ref([]);
const loader = ref(false);
const confirmar = ref(false);
let cve_socio = 0;

//se grega para mstrar la observaxcion
const dialog_observacion = ref(false);
const lst_historico_observaciones = ref([]);

onMounted(() => {
  buscarSocios();
});

async function buscarSocios() {
  overlay.value = true;
  // let { data } = await $axios.get("socios", {
  //   params: { cve_accion: props.cve_accion },
  // });

const data=await getSocioService(props.cve_accion)

  lst_socios.value = data;
  overlay.value = false;
}

async function ListaSocios() {
  dialog.value = true;
  loader.value = true;
  socios_disponibles.value = [];
  lst_socios_disponibles.value = [];
  // let { data } = await $axios.get("socios/cambio");
  const data=await SocioDisponiblesCambioService()
  socios_disponibles.value = data;
  loader.value = false;
}

async function AgregarSocioExistente() {
  console.log(lst_socios_disponibles);
  confirmar.value = false;

  // let { data } = await $axios.put(
  //   `socios/${lst_socios_disponibles.value.id}/params`,
  //   {
  //     cve_accion: props.cve_accion,
  //   }
  // );

  const data=await SocioAgregarExistentesService(lst_socios_disponibles.value.id,props.cve_accion)

  if (eval(data) > 0) {
    snackbarMsj.value = "Guardado correctamente";
    snackbarTipo.value = "success";
    snackbar.value = true;

    buscarSocios();
  } else {
    snackbarMsj.value = "Hubo un error, recarga el sitio he intenta de nuevo";
    snackbarTipo.value = "errro";
    snackbar.value = true;
  }

  dialog.value = false;
}

function nuevoSocio() {
  root.$router.push({
    name: "FormSocio",
    params: { cve_accion: props.cve_accion, accion_text: props.accion_text },
  });
}

function editarSocio(socio) {
  root.$router.push({
    name: "FormSocio",
    params: {
      cve_accion: props.cve_accion,
      cve_socio: socio,
      accion_text: props.accion_text,
    },
  });
}

async function showObservaciones(id) {
  try {
    // let { data } = await $axios.get(`observaciones-usuarios/${id}`);
    const data=showObservacionesSocioService(id)
    lst_historico_observaciones.value = data;
    dialog_observacion.value = true;
  } catch (error) {}
}

function fClasificacion(val) {
  let clasificacion = ["A", "B", "C"];
  return clasificacion[parseInt(val) - 1];
}
</script>
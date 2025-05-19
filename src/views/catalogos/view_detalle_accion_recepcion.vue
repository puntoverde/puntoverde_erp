<template>
  <div>
    <v-row row wrap>
      <v-col md12>
        <v-card :outlined="true" :raised="true">
          <v-card-text class="pb-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  small
                  fab
                  @click="regresar"
                  color="primary"
                  absolute
                >
                  <v-icon> mdi-arrow-left</v-icon>
                </v-btn>
              </template>
              <span> Regresar</span>
            </v-tooltip>
            <v-row dense no-gutters>
              <v-col class="d-flex flex-column">
                <span class="title accent--text text-center"> Acción:</span>
                <span class="title success--text mt-5 text-center">
                  {{ numero_accion }}{{ f_clasi(clasificacion) }}</span
                >
              </v-col>
              <v-col class="d-flex flex-column">
                <span class="title accent--text text-center">
                  Tipo de acción:</span
                >
                <v-select
                  class="mt-3"
                  :items="lst_tipo_accion"
                  item-value="id"
                  item-text="nombre"
                  v-model="cve_tipo_accion"
                  placeholder="Tipo de acción"
                  hide-details
                  outlined
                  dense
                  disabled
                />
              </v-col>
              <v-col class="d-flex flex-column">
                <span class="title accent--text text-center">
                  Fecha Creación:
                </span>
                <span class="title text--center text-center mt-5">
                  {{ dayjs(fecha_adquisicion).format("DD/MM/YYYY") }}
                </span>
              </v-col>
              <v-col class="d-flex flex-column">
                <span class="title accent--text text-center">
                  Estatus acción:</span
                >
                <span class="text-center">
                  <v-chip
                    class="ma-2 white--text title"
                    :color="
                      estatus == 1 ? 'green' : estatus == 2 ? 'amber' : 'red'
                    "
                    white
                  >
                    {{ f_estatus(estatus) }}</v-chip
                  >
                </span>
              </v-col>
              
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row pt="0" wrap>
      <v-col md6>
        <accion-detalle-dueno
          :cve_dueno="cve_dueno"
          :cve_accion="cve_accion"
          :accion_text="accion_mostrar"
        />
      </v-col>
      <v-col md6>
        <accion-detalle-socio
          :cve_accion="cve_accion"
          :accion_text="accion_mostrar"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-snackbar
          v-model="snackbar"
          :bottom="true"
          :multi-line="true"
          :color="color_mensaje"
        >
          {{ mensaje_alerta }}
          <v-icon color="white" @click="snackbar = false">
            mdi-close-circle</v-icon
          >
        </v-snackbar>
      </v-col>
      <v-col>
        <v-overlay :value="loader" z-index="1000">
          <v-progress-circular indeterminate size="64" />
        </v-overlay>
      </v-col>
    </v-row>
  

  </div>
</template>

<script setup>
import { onMounted, ref, watch, getCurrentInstance, provide } from "vue";
import AccionDetalleDueno from "@/components/accion_detalle_recepcion/accion-detalle-recepcion-dueno.vue";
import AccionDetalleSocio from "@/components/accion_detalle_recepcion/accion-detalle-recepcion-socio.vue";
import {getAccionByIdService,getTipoAccionService} from '@/services/acciones_service'
import dayjs from "dayjs";

const props = defineProps({ cve_accion: { type: Number, default: 0 } });

const root = getCurrentInstance().proxy;

// const cve_accion=ref(0)
const cve_dueno = ref(0);
const numero_accion = ref("");
const clasificacion = ref("");
const cve_tipo_accion = ref(0);
const fecha_adquisicion = ref("");

const items = ref([]);
const mensaje_alerta = ref("");
const snackbar = ref(false);
const color_mensaje = ref("");
const estatus = ref(1);
const estatus_switch = ref(1);
const loader = ref(false);



const lst_tipo_accion = ref([]);

const accion_mostrar = ref(""); //muestra la accion ejemplo 122A


provide("cve_accion", props.cve_accion);
provide("numero_accion", numero_accion);
provide("clasificacion", clasificacion);
provide("cve_tipo_accion", cve_tipo_accion);
provide("accion_mostrar", accion_mostrar);

onMounted(async() => {
  console.log("obtiene accion");
  await tipos_accion();
  getAccion();
});

function regresar() {
  root.$router.replace({ name: "accionRecepcion" });
}

async function getAccion() {
  // let { data } = await $axios.get(`acciones/${props.cve_accion}`);
  const data=await getAccionByIdService(props.cve_accion)

  console.log("🚀 ~ file: AccionDetalle.vue:167 ~ getAccion ~ data:", data);

  // cve_accion.value=data.cve_accion
  cve_dueno.value = data.cve_dueno;
  numero_accion.value = data.numero_accion;
  clasificacion.value = data.clasificacion;
  cve_tipo_accion.value = data.cve_tipo_accion;
  fecha_adquisicion.value = data.fecha_adquisicion;
  estatus.value = parseInt(data.estatus);
  estatus_switch.value = parseInt(data.estatus);

  accion_mostrar.value = `${data.numero_accion}${"ABC".charAt(
    data.clasificacion - 1
  )}`;
}

async function tipos_accion() {
  try {
    // let { data, status } = await $axios.get("tipo-accion");
    const data=await getTipoAccionService()
    lst_tipo_accion.value = data;
  } catch (error) {
    console.error(error);
  }
}

function f_clasi(p) {
  const tipo = ["A", "B", "C"];
  return tipo[parseInt(p) - 1];
}

function f_estatus(p) {
  const array_estatus = ["Activo", "Bloqueado", "Baja"];
  return array_estatus[p - 1];
}
</script>

<style scoped>
#bloqueo {
  margin-right: 4px;
}
</style>

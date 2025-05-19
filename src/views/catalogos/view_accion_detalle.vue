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
                  {{ numero_accion }}{{ f_clasi(clasificacion) }}
                  </span>
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
                  @change="CambioTipoAccion"
                  hide-details
                  outlined
                  dense
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
              <v-col class="d-flex flex-column">
                <span class="title accent--text text-center">
                  Activar/Desactivar:</span
                >
                <span class="text-center d-flex justify-center">
                  <v-switch
                    inset
                    color="green"
                    v-model="estatus_switch"
                    @change="openConfirm"
                    :true-value="1"
                    :false-value="3"
                  />
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
    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title>
          <v-icon class="mr-2"> mdi-alert</v-icon>
          Confirmar
        </v-card-title>
        <v-card-text>
          Esta apunto de dar de baja la accion en este caso se cargara la cuota
          de activacion si se esta de acuerdo proporcione el motivo y precione
          la opcion aceptar en caso contrario la opcion cancelar
          <v-textarea
            v-model="motivo"
            label="Motivo de Cancelacion"
            persistent-hint
            hint="minimo 10 caracteres"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="(dialog = false), (estatus_switch = 1)">
            Cancelar</v-btn
          >
          <v-btn
            color="info"
            @click="bajaAccion"
            :disabled="motivo.length < 10"
          >
            Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" width="500" persistent>
      <v-card>
        <v-card-title>
          <v-icon class="mr-2"> mdi-alert</v-icon>
          Confirmar
        </v-card-title>
        <v-card-text>
          Indique el motivo por el cual esta realizando la activacion de la
          accion, si esta de acurdo seleccione la ocpion aceptar en caso
          contrario la opcion cancelar
          <v-textarea
            v-model="motivo"
            filled
            label="Motivo de Activacion"
            persistent-hint
            hint="minimo 10 caracteres"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="(dialog2 = false), (estatus_switch = 3)">
            Cancelar</v-btn
          >
          <v-btn
            color="info"
            @click="altaAccion"
            :disabled="motivo.length < 10"
          >
            Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, getCurrentInstance, provide } from "vue";
import AccionDetalleDueno from "@/components/accion_detalle/accion-detalle-dueno.vue";
import AccionDetalleSocio from "@/components/accion_detalle/accion-detalle-socio.vue";
import {getAccionByIdService,getTipoAccionService,cambioEstatusAccionService,cambioTipoAccionService,addConceptoActivacionService} from '@/services/acciones_service'
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

const motivo = ref("");

const lst_tipo_accion = ref([]);

const accion_mostrar = ref(""); //muestra la accion ejemplo 122A

const dialog = ref(false);
const dialog2 = ref(false);

provide("cve_accion", props.cve_accion);
provide("numero_accion", numero_accion);
provide("clasificacion", clasificacion);
provide("cve_tipo_accion", cve_tipo_accion);
provide("accion_mostrar", accion_mostrar);

onMounted(() => {
  console.log("obtiene accion");
  getAccion();
  tipos_accion();
});

function regresar() {
  root.$router.replace({ name: "accion" });
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

async function CambioEstatus() {
  try {
    const cve_persona_session = root.$ls.get("user", {
      cve_persona: 0,
    }).cve_persona;
    // let { data, status } = await $axios.put(`acciones/${props.cve_accion}`, {
    //   estatus: estatus_switch.value,
    //   motivo: motivo.value,
    //   persona_motivo: cve_persona_session,
    // });
    const data=await cambioEstatusAccionService(props.cve_accion,estatus_switch.value,motivo.value,cve_persona_session)

      if (eval(data) == 1) {
        mensaje_alerta.value = "Guardado correctamente";
        color_mensaje.value = "success";
        snackbar.value = true;
      } else {
        mensaje_alerta.value = "Error al cambiar el estatus";
        color_mensaje.value = "error";
        snackbar.value = !snackbar.value;
      }
      estatus.value = estatus_switch.value; //se cambia el estatus segun el elegido en el switch
    
  } catch (error) {
    console.error(error);
  } finally {
    loader.value = false;
    dialog.value = false;
    dialog2.value = false;
    motivo.value = ""; //se limpia por cualquier cosa
  }
}

async function CambioTipoAccion() {
  loader.value = true;
  // let { data, status } = await $axios.put(`acciones/${props.cve_accion}`, {
  //   cve_tipo_accion: cve_tipo_accion.value,
  // });
  const data=await cambioTipoAccionService(props.cve_accion,cve_tipo_accion.value)

    if (eval(data) == 1) {
      mensaje_alerta.value = "Guardado correctamente";
      color_mensaje.value = "success";
      snackbar.value = true;
    } else {
      mensaje_alerta.value = "Error al cambiar el estatus";
      color_mensaje.value = "error";
      snackbar.value = true;
    }
  
  loader.value = false;
}

async function bajaAccion() {
  await CambioEstatus();
  // let { data, status } = await $axios.post(`acciones/${props.cve_accion}/add-activacion`);
  await addConceptoActivacionService(props.cve_accion)
}
async function altaAccion() {
  await CambioEstatus();
}

function openConfirm() {
  if (estatus_switch.value === 3) dialog.value = true;
  else dialog2.value = true;
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

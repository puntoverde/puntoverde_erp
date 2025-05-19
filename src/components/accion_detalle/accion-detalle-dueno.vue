<template>
  <div>
    <v-card pt="0" class="mx-auto" :outlined="true" :raised="true">
      <v-card-title class="d-flex justify-space-between accent--text">
        <h4 class="accent--text">Dueño</h4>
        <div>
          <dueno-expediente-digital
            :cve_dueno="cve_dueno"
            :cve_accion="cve_accion"
          />

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="nuevo_dueno" small fab color="primary">
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </template>
            <span>Nuevo Dueño</span> </v-tooltip
          >&nbsp;
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="Editar_dueno" small fab color="info">
                <v-icon>mdi-account-edit</v-icon>
              </v-btn>
            </template>
            <span>Modificar información Dueño</span> </v-tooltip
          >&nbsp;
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="ListaDuenos" small fab color="warning">
                <v-icon>mdi-swap-horizontal</v-icon>
              </v-btn>
            </template>
            <span>Cambiar de Dueño</span>
          </v-tooltip>
        </div>
      </v-card-title>
      <v-divider inset class="accent lighten-3"></v-divider>
      <v-card-text>
        <v-row row wrap>
          <v-col class>
            <v-list three-line>
              <template>
                <v-list-item>
                  <dueno-foto :cve_dueno="cve_dueno" :foto_socio="foto" />
                  <!--v-list-item-avatar size="100">
                    <v-img src="./../../assets/perfil.svg"></v-img>
                  </v-list-item-avatar-->

                  <v-list-item-content>
                    <v-list-item-title
                      >{{ nombre }} {{ paterno }}
                      {{ materno }}</v-list-item-title
                    >
                    <v-list-item-title>RFC: {{ rfc }} </v-list-item-title>
                    <v-list-item-subtitle
                      >Celular: {{ celular }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Dirección: {{ calle }}, N. exterior: #{{ num_ext }}, N.
                      interior: #{{ num_int }}, C.P.:
                      {{ cp }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Fecha de adquisición:
                      {{
                        dayjs(fecha_adquisicion).format("DD/MM/YYYY")
                      }}</v-list-item-subtitle
                    >
                    <!-- cambio -->
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        {{ dueno.cantidad }}
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog2" persistent max-width="500px">
      <v-card>
        <v-card-title>Cambio de Dueño</v-card-title>
        <v-card-text>
          <v-autocomplete
            label="Escriba el nombre del nuevo dueño"
            :items="lst_duenos"
            v-model="dueno"
            item-text="nombre"
            return-object
          ></v-autocomplete>
          <v-btn color="success" dark @click="confirmar = true">Cambiar</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog2 = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="loader" z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-dialog v-model="confirmar" persistent max-width="490">
      <v-card>
        <v-card-title class="headline"
          >¿Realmente desea realizar el cambio?</v-card-title
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
          <v-btn color="success darken-1" text @click="CambiarDueno"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-snackbar
          v-model="snackbar"
          :bottom="true"
          :multi-line="true"
          :color="color_mensaje"
        >
          {{ mensaje_alerta }}
          <v-icon color="white" @click="snackbar = false"
            >mdi-close-circle</v-icon
          >
        </v-snackbar>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from "vue";
import DuenoFoto from "./accion-detalle-dueno-foto_nueva_version.vue";
import DuenoExpedienteDigital from "./accion-detalle-dueno-expediente-digital.vue";
import dayjs from "dayjs";
import {getAccionistaByIdService,getAccionistaAllService} from '@/services/accionistas_service'

const props = defineProps({
  cve_dueno: { type: Number, default: 0 },
  cve_accion: { type: Number, default: 0 },
  accion_text: { type: String, default: "" },
});

const root = getCurrentInstance().proxy;
const dueno = ref({});
const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const rfc = ref("");
const celular = ref("");
const calle = ref("");
const num_ext = ref("");
const num_int = ref("");
const cp = ref("");
const fecha_adquisicion = ref("");
const lst_duenos = ref([]);
const loader = ref(false);
const confirmar = ref(false);
const snackbar = ref(false);
const color_mensaje = ref("");
const mensaje_alerta = ref("");
const dialog2 = ref(false);
const foto = ref("");

watch(() => props.cve_dueno,() =>getDueno()
);

function nuevo_dueno() {
  root.$router.push({
    name: "FormDueno",
    params: { cve_accion: props.cve_accion, accion_text: props.accion_text },
  });
}

function Editar_dueno() {
  root.$router.push({
    name: "FormDueno",
    params: {
      cve_accion: props.cve_accion,
      cve_dueno: props.cve_dueno,
      accion_text: props.accion_text,
    },
  });
}

async function getDueno() {
  // let { data } = await $axios.get(`accionistas/${props.cve_dueno}`);
  const data=await getAccionistaByIdService(props.cve_dueno)
  nombre.value = data.nombre;
  paterno.value = data.apellido_paterno;
  materno.value = data.apellido_materno;
  celular.value = data.celular;
  rfc.value = data.rfc;
  calle.value = data.calle;
  num_ext.value = data.numero_exterior;
  num_int.value = data.numero_interior;
  cp.value = data.cp;
  fecha_adquisicion.value = data.fecha_adquisicion;
  foto.value = data.foto;
}

async function ListaDuenos() {
  dialog2.value = true;
  loader.value = true;
  lst_duenos.value = [];
  // let { data } = await $axios.get("accionistas");
  const data=await getAccionistaAllService()
  lst_duenos.value = data;
  loader.value = false;
}

async function CambiarDueno() {
  confirmar.value = false;
  // let { data } = await $axios.put("accionista/cambio", {    
  //   cve_dueno: props.cve_dueno,
  //   cve_accion: props.cve_accion,
  // });

  const data=await cambioAccionistaAccionService(props.cve_dueno,props.cve_accion)

  if (eval(data) > 0) {
    mensaje_alerta.value = "Guardado correctamente";
    color_mensaje.value = "success";
    snackbar.value = true;
    //buscarDueno();
  } else {
    mensaje_alerta.value =
      "Hubo un error, recarga el sitio he intenta de nuevo";
    color_mensaje.value = "errro";
    snackbar.value = true;
  }
  dialog2.value = false;
}
</script>
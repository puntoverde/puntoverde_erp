<template>
  <div>
    <v-card class="mx-auto" :outlined="true" :raised="true">
      <v-overlay :absolute="true" :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

      <v-card-title class="d-flex justify-space-between">
        <h4 class="accent--text">Usuarios</h4>
      </v-card-title>
      <v-divider inset class="accent lighten-3"></v-divider>
      <v-card-text class="mt-0 pt-0">
        <v-row row wrap>
          <v-col class="mt-0 pt-0">
            <v-list three-line class="mt-0 pt-0">
              <!--v-subheader>Socios</v-subheader-->
              <template v-for="(socio, index) in lst_socios">
                <v-list-item :key="`${index}-1`">
                  
                  <v-avatar size="50" color="white">
                    <v-icon large v-if="socio.cve_parentesco == 11">mdi-trophy</v-icon>
                    <v-img
                      class="elevation-15"
                      src="@/assets/user-profile.svg"
                      v-else
                    ></v-img>
                  </v-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      {{ socio.nombre }} {{ socio.apellido_paterno }}
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

                        <socio-mensaje
                          :cve_socio="socio.cve_socio"
                          :msj="socio.observaciones"
                        />

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

    <v-overlay :value="loader" z-index="1000">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SocioMensaje from "./../accion_detalle/accion-detalle-socio-mensaje.vue";
import SocioCambioPosicion from "./../accion_detalle/accion-detalle-socio-cambio-posicion.vue";
import {getSocioService} from '@/services/socios_service'

const props = defineProps({
  cve_accion: {
    type: Number,
    default: 0,
  },
  accion_text: { type: String, default: "" },
});

const overlay = ref(false);
const lst_socios = ref([]);
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
  // let { data } = await $axios.get("socios", {params: { cve_accion: props.cve_accion }});
  const data=await getSocioService(props.cve_accion)
  lst_socios.value = data;
  overlay.value = false;
}

function fClasificacion(val) {
  let clasificacion = ["A", "B", "C"];
  return clasificacion[parseInt(val) - 1];
}
</script>
<template>
  <div>
    <v-list-item @click="OpenMoverPosicion">
      <v-list-item-title>
        <v-icon>mdi-swap-vertical</v-icon>Cambio de posición en la acción
      </v-list-item-title>
    </v-list-item>

    <!-- dialog para mostrar las posiciones -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>Posiciones disponibles</v-card-title>
        <v-card-text>
          <v-select
            clearable
            label="Posiciones disponibles"
            v-model="nueva_posicion"
            :items="lst_posiciones"
            item-value="id"
            item-text="nombre"
          ></v-select>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between">
          <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn
          >&nbsp;
          <v-btn color="info" dark @click="dialog2 = true"
            >Cambiar posición</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- confirmar cambio de posicion posiciones -->
    <v-dialog v-model="dialog2" persistent max-width="490">
      <v-card>
        <v-card-title class="headline"
          >¿Realmente deseas cambiar la posición del socio?</v-card-title
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
          <v-btn color="success darken-1" text @click="cambioPosicion"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {CambiarPosicioAccionSocioService} from '@/services/socios_service'

const props = defineProps({
  cve_socio: {
    type: Number,
    default: 0,
  },
  posicion_actual: {
    type: Number,
    default: 0,
  },
  posiciones_disponibles: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["emit-posicion"]);

const dialog = ref(false);
const dialog2 = ref(false);
const msjSocio = ref("");
const nueva_posicion = ref(null);
const lst_posiciones = ref([]);

//onMounted(()=>{msjSocio.value=props.msj})

function OpenMoverPosicion() {
  let posiciones_accion = [];
  let valor_mayor = 0;

  lst_posiciones.value = [];

  valor_mayor = Math.max.apply(null, props.posiciones_disponibles);

  for (let i = 0; i < valor_mayor; i++) {
    posiciones_accion.push(0);
  }

  if (props.posiciones_disponibles.length > 0) {
    props.posiciones_disponibles.forEach((item, index) => {
      posiciones_accion[item] = 1;
    });
  }

  for (let i = 0; i < posiciones_accion.length; i++) {
    if (posiciones_accion[i] == 0) {
      lst_posiciones.value.push({
        id: i,
        nombre: `Posición: ${i}`,
      });
    }

    if (i == posiciones_accion.length - 1) {
      lst_posiciones.value.push({
        id: posiciones_accion.length,
        nombre: `Posición: ${posiciones_accion.length}`,
      });
      break;
    }
  }

  dialog.value = true;
}

async function cambioPosicion() {
  if (props.cve_socio > 0) {
    dialog2.value = false;

    // let { data } = $axios.put(`socios/${props.cve_socio}/params`, {
    //   posicion: nueva_posicion.value,
    // });

    const data=await CambiarPosicioAccionSocioService(props.cve_socio,nueva_posicion.value)

    emit("emit-posicion", nueva_posicion.value);
    if (eval(data) > 0) {
      //snackbarMsj.value = "Guardado correctamente";
      //snackbarTipo.value = "success";
      //snackbar.value = true;
      //buscarSocios();
    } else {
      //snackbarMsj.value =
      // "Hubo un error, recarga el sitio he intenta de nuevo";
      //snackbarTipo.value = "errro";
      //snackbar.value = true;
    }
    dialog.value = false;
  } else {
    //snackbarMsj.value = "Hubo un error, no se encuentra la clave del socio";
    //snackbarTipo.value = "errro";
    //snackbar.value = true;
  }
}
</script>

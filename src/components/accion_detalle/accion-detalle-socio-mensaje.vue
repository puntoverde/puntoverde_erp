<template>
  <div>
    <v-list-item @click="dialog = true">
      <v-list-item-title>
        <v-icon>mdi-message</v-icon>Mensaje Personalizado
      </v-list-item-title>
    </v-list-item>

    <!-- dialog para ingresar mensaje -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Mensaje Personalizado</v-card-title>
        <v-card-text class="pb-0">
          <v-textarea
            prepend-inner-icon="mdi-message-reply-text"
            label="redacta el mensaje personalizado"
            clearable
            v-model="msjSocio"
            clear-icon="mdi-close-circle"
            counter
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">Cerrar</v-btn>
          <v-btn color="primary" text @click="saveMsjPersonalizado"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {saveMensajePersonalizadoSocioService} from '@/services/socios_service'

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

const dialog = ref(false);
const msjSocio = ref("");

onMounted(() => {
  msjSocio.value = props.msj;
});

async function saveMsjPersonalizado() {
  // let { data } = await $axios.put(`socios/${props.cve_socio}/params`, {
  //   observaciones: msjSocio.value,
  // });

const data=await saveMensajePersonalizadoSocioService(props.cve_socio,msjSocio.value)

  //snackbarMsj.value = "Mensaje Personal Guardado con Exitoso";
  //socioSelected.value.observaciones = msjSocio.value;
  if (data === 0) {
    //snackbarMsj.value = "Error Al intentar Guardar";
    msjSocio.value = "";
  }
  //snackbar.value = true;
}
</script>

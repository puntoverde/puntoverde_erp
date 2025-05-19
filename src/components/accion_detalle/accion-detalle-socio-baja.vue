<template>
  <div>
    <v-list-item @click="dialog = true">
      <v-list-item-title>
        <v-icon>mdi-account-remove</v-icon>Baja
      </v-list-item-title>
    </v-list-item>

    <!-- dialo para confirm baja de socio -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Baja de Usuario</v-card-title>

        <v-card-text>
          De click en
          <b>Aceptar</b> para continuar con la acción, de lo contrario dar click
          <b>Cancelar</b> para abortar la acción.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialog = false"
            >Cancelar</v-btn
          >

          <v-btn color="green darken-1" text @click="bajaSocio">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {bajaSocioService} from '@/services/socios_service'

const props = defineProps({
  cve_socio: {
    type: Number,
    default: 0,
  },
  index: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["emit-delete-socio"]);

const dialog = ref(false);

async function bajaSocio() {
  // let { status } = await $axios.delete(`socios/${props.cve_socio}`);
  const status=bajaSocioService(props.cve_socio)
  if (status === 204) {
    dialog.value = false;
    emit("emit-delete-socio", props.index);
  } else {
    alert("ocurrio un error...");
  }
}
</script>

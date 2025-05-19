<!--
<template>    

                        <v-list-item @click="accesoSinHuella">
                          <v-list-item-title>
                            <v-icon
                              color="green"
                              v-if="acceso_sin_huella ===1"
                              >mdi-fingerprint</v-icon
                            >
                            <v-icon color="red" v-else
                              >mdi-fingerprint-off</v-icon
                            >
                            <span v-if="acceso_sin_huella ===1"
                              >Acceso con Huellasss </span
                            >
                            <span v-else>Acceso sin Huella </span>
                          </v-list-item-title>
                        </v-list-item>
</template>
-->

<script setup>
import { onMounted, ref } from "vue";

const props=defineProps({
    cve_socio: {
      type: Number,
      default: 0,
    },
    huella: {
      type: Number,
      default: 0,
    },
  })

   

    const acceso_sin_huella = ref(false);

    onMounted(() => (acceso_sin_huella.value = props.huella));

    async function accesoSinHuella() {
     /* acceso_sin_huella.value = true ^ acceso_sin_huella.value;
      let { data } = await $axios.put(`socios/${props.cve_socio}/params`, {
        acceso_huella: acceso_sin_huella.value,
      });
      if (acceso_sin_huella.value === 1)
        if (acceso_sin_huella.value == 0)
          // snackbarMsj.value = "Se asigno acceso sin huella con exito ";
          if (data === 0) {
            //snackbarMsj.value = "Se retira el acceso sin huella con exito";

            acceso_sin_huella.value = true ^ acceso_sin_huella.value;
            // snackbarMsj.value = "Error Al intentar cambiar el acceso con huella";
          } //revierte el valor 1 a 0 ,0 a 1

      // snackbar.value = true;*/
    }

</script>
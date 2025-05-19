
<template>  
  <v-list-item>
    <template v-slot:default="{ active, toggle }">
      <v-list-item-action id="bloqueo">
        <v-checkbox
          @change="bloqueoTemporal"
          v-model="bloqueo_temporal"
          :true-value="1"
          :false-value="0"
          color="primary"
        ></v-checkbox>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>Bloqueo Temporal </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-list-item>
</template>

<script setup>
import { onMounted, ref, } from "vue";
import {bloqueoSocioService} from '@/services/socios_service'

const props = defineProps({
  cve_socio: {
    type: Number,
    default: 0,
  },
  bloqueo: {
    type: Number,
    default: 0,
  },
});

const bloqueo_temporal = ref(0);

onMounted(() => (bloqueo_temporal.value = props.bloqueo));

async function bloqueoTemporal(p) {
  // let { data } = await $axios.put(`socios/${props.cve_socio}/params`, {
  //   bloqueo_temporal: bloqueo_temporal.value,
  // });

const data=await bloqueoSocioService(props.cve_socio,bloqueo_temporal.value);

  if (bloqueo_temporal.value === 1)
    if (bloqueo_temporal.value === 0)
      //snackbarMsj.value = "Se Bloqueo Socio Temporalmente con Exitoso";
      if (data === 0) {
        //snackbarMsj.value = "Se Desbloqueo Socio con Exitoso";
        //snackbar.value = true;
        bloqueo_temporal.value = (true ^ p.bloqueo_temporal).toString();
        //snackbarMsj.value = "Error Al intentar bloquear o desbloquear";
      } //revierte el valor 1 a 0 ,0 a 1
}
</script>
<style scoped  lang="scss">
#bloqueo {
  margin-right: 1px;
}
</style>
<template>
  <v-container>
    <h1>Descuentos asignados a la acción: {{ accion }}</h1>
    <v-data-table id="tablaCargo" :headers="headersTabla" :items="cDescuentos">
      <template v-slot:item.numero_accion="{ item }">
        <span>
          {{ item.numero_accion }}{{ fclasificacion(item.clasificacion) }}</span
        >
      </template>
      <template v-slot:item.motivo="{ item }">
        <v-text-field
          v-model="item.motivo"
          label="motivo"
          hide-details
          filled
          dense
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          color="error"
          outlined
          @click="borrarDescuento(item.iddescuento, item.motivo)"
        >
          <v-icon color="error"> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar" color="success">
      El registro se eliminó de forma correcta.
      <v-icon color="white"> mdi-check-decagram</v-icon>
    </v-snackbar>
  </v-container>
</template>


<script setup>
import { computed, ref, getCurrentInstance } from "vue";
import {getDescuentoByAccionService,eliminarDescuentoService} from '@/services/descuento_service'

const props = defineProps({
  accion: { type: String, default: "Sin Valor" },
  arrdescuentos: { type: Array, default: () => [] },
});

const root = getCurrentInstance().proxy;
const snackbar = ref(false)
const cDescuentos = computed(() => {
  return props.arrdescuentos
    .filter((item) => parseInt(item.iddescuento) > 0)
    .map((item) => ({
      iddescuento: item.iddescuento,
      concepto: item.concepto,
      periodo: item.periodo,
      cantidad: item.cantidad,
      total: item.total,
      descuento: item.descuento,
      motivo: "",
    }));
});

const accionMask = ref({
  mask: "#FFFF",
  tokens: {
    F: {
      pattern: /[0-9a-cA-C]/,
      transform(v) {
        return v.toLocaleUpperCase();
      },
    },
    "#": {
      pattern: /\d/,
    },
  },
});

//const accion = ref ("");

const headersTabla = ref([
  { text: "Concepto", value: "concepto" },
  { text: "Periodo", value: "periodo" },
  { text: "Cantidad", value: "cantidad" },
  { text: "Total", value: "total" },
  { text: "Descuento", value: "descuento" },
  { text: "Motivo", value: "motivo" },
  { text: "Eliminar", value: "actions" },
]);

const bodyTable = ref([]);

async function llenarTabla() {
  let clasificacion = 0;
  let numero_accion = props.accion;

  if (props.accion.indexOf("A") > 0) {
    clasificacion = 1;
    numero_accion = props.accion.substr(0, props.accion.indexOf("A"));
  } else if (props.accion.indexOf("B") > 0) {
    clasificacion = 2;
    numero_accion = props.accion.substr(0, props.accion.indexOf("B"));
  } else if (props.accion.indexOf("C") > 0) {
    clasificacion = 3;
    numero_accion = props.accion.substr(0, props.accion.indexOf("C"));
  }

  // let { data, status } = await $axios.get("/descuento", {
  //   params: { numero_accion: numero_accion, clasificacion: clasificacion },
  // });

const data=await getDescuentoByAccionService(numero_accion,clasificacion)

  if (status === 200) {
    data.forEach((element) => {
      element.motivo = "";
    });
    bodyTable.value = data;
  }
}

async function borrarDescuento(id, motivo) {
  console.log(root.$ls.get("user"));
  let responsable_cancela = root.$ls.get("user", {
    cve_persona: 0,
  }).cve_persona;
  // let { data, status } = await $axios.delete(`/descuento/${id}`, {
  //   params: { responsable_cancela, motivo_cancelacion: motivo },
  // });
  const data=await eliminarDescuentoService(id,responsable_cancela,motivo)
  context.emit("emit-actualizaTabla");
  //llenarTabla();
  snackbar.value = true;
}

function fclasificacion(val) {
  let clasificacion = ["", "A", "B", "C"];
  return clasificacion[val];
}
</script> 

<style>
.active {
  color: green;
}
#caja {
  border: 1px solid #000;
}
</style>



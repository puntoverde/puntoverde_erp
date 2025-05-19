<template>
  <div>
    <h1>Reportes Disciplinarios</h1>
    <v-row justify="center">
      <v-col lg="2">
        <v-menu
          v-model="menuFechaI"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          persistent
          max-width="290px"
          min-width="290px"
        >
          <!-- @keyup.enter="fechaI = parseFecha(fechaIF)" -->
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="fechaIF"
              label="Fecha Inicial"
              hint="dd/mm/aaaa"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-on="on"
              v-validate="'min:10|max:10'"
              data-vv-name="fecha inicial"
              v-mask="'##/##/####'"
              :error="errors.has('fecha inicial')"
              :error-messages="errors.first('fecha inicial')"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es-mx"
            v-model="fechaI"
            no-title
            @input="menuFechaI = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <template v-if="fechaIF != ''">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="limpiarFechas(1)"
              >mdi-window-close</v-icon
            >
          </template>
          <span>Quitar fecha inicial</span>
        </v-tooltip>
      </template>
    </v-row>
    <v-row justify="center">
      <v-col lg="2">
        <v-menu
          v-model="menuFechaF"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <!-- @keyup.enter="fechaF = parseFecha(fechaFF)" -->
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="fechaFF"
              label="Fecha Final"
              hint="dd/mm/aaaa"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-on="on"
              v-validate="'min:10|max:10'"
              data-vv-name="fecha final"
              v-mask="'##/##/####'"
              :error="errors.has('fecha final')"
              :error-messages="errors.first('fecha final')"
            ></v-text-field>
          </template>
          <v-date-picker
            locale="es-mx"
            v-model="fechaF"
            no-title
            @input="menuFechaF = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <!-- Muestra  el icono cuando se escribe en el input, o se selecciona la fecha del menu -->
      <v-tooltip bottom v-if="fechaFF != ''">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="limpiarFechas(2)">mdi-window-close</v-icon>
        </template>
        <span>Quitar fecha final</span>
      </v-tooltip>
    </v-row>
    <v-row justify="center">
      <!-- <v-col offset-lg="4" lg="2"> -->
      <v-btn class="white--text" color="blue" @click="cargarTabla()"
        >Actualizar</v-btn
      > </v-row
    ><br />
    <v-btn @click="exportar()"
      >Exportar
      <v-icon color="success"> mdi-file-excel </v-icon>
    </v-btn>
    <v-data-table
      id="tabla"
      :headers="headersTabla"
      :items="itemsTabla"
      :items-per-page="10"
      :calculate-widths="true"
      class="elevation-2"
    >
      <template v-slot:item.tipo="{ item }">
        <label v-if="item.tipo == '1' || item.tipo == '2'">Entrada</label>
        <label v-else>Salida</label>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref,watch,onMounted } from "vue";
import {getDatosDiciplinaServices} from '@/services/reporte_diciplinario_service'
import XLSX from "xlsx";

const menuFechaI = ref(false); //Ventana de dias, fecha inicial
const menuFechaF = ref(false); //Ventana de dias, fecha final
const fechaI = ref(""); //Fecha inicial en formato de BD
const fechaIF = ref(""); //Fecha inicial en formato de usuario
const fechaF = ref(""); //Fecha final en formato de BD
const fechaFF = ref(""); //Fecha inicial en formato de usuario
const fechaFtemp = ref(""); //Fecha final temporal, se almacena cuando se usa el switch de solo un dia
const formatoFechaI = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const formatoFechaF = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const headersTabla = [
  { text: "# Acción", value: "accion" },
  { text: "Nombre Socio", value: "nombre_socio" },
  { text: "Reporte ", value: "reporte" },
  { text: "Fecha", value: "fecha_alta_reporte" },
];
const itemsTabla = [];

watch(fechaI, (val) => {
  if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
});
watch(fechaF, (val) => {
  if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
});

onMounted(() => {
  cargarTabla();
});

async function cargarTabla() {
  // this.$validator.validate().then(valid => {
  // if (valid) {
  
  // if(this.formatoFechaI)
  //     this.fechaI = parseFecha(fechaIF, 1);
  // if(this.formatoFechaF)
  //     this.fechaF = parseFecha(fechaFF, 2);
  // axios
  //   .post(
  //     "/reporteDisciplinarioController.php",
  //     qs.stringify({ accion: 1, fechaI: fechaIF.value, fechaF: fechaFF.value })
  //   )
  //   .then((res) => {
  //     itemsTabla.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });

const data=await getDatosDiciplinaServices(fechaIF.value,fechaFF.value)
itemsTabla.value=data


  // }
  // });
}
function limpiarFiltros() {
  fechaI.value = "";
  fechaF.value = "";
}

function limpiarFechas(op) {
  if (op == 1) {
    fechaIF.value = "";
    fechaI.value = "";
    formatoFechaI.value = false;
  } else if (op == 2) {
    fechaFF.value = "";
    fechaF.value = "";
    formatoFechaF.value = false;
  }
}
function parseFecha(fecha) {
  if (!fecha) return null;
  menuFechaI.value = false;
  menuFechaF.value = false;
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
}
//Convierte fecha en formato aaaa-mm-dd a dd/mm/aaaa
function parseFechaInput(fecha) {
  if (!fecha) return null;
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
function exportar() {
  var tbl = document.getElementById("tabla");
  var wb = XLSX.utils.table_to_book(tbl);
  XLSX.writeFile(wb, "reporte_disciplinario.xlsb");
}
</script>
<template>
  <div>
    <h1>Reporte de Apartados</h1>
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

      <!-- HORA INICIO -->

      <v-col lg="2" v-if="tipoQuery == 2">
        <v-dialog
          ref="dialog"
          v-model="modalTi"
          persistent
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="horaI"
              label="Hora Inicial"
              prepend-icon="mdi-clock"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker v-if="modalTi" v-model="horaI" full-width>
            <div class="flex-grow-1"></div>
            <v-btn text color="primary" @click="modalTi = false"
              >Cancelar</v-btn
            >
            <v-btn text color="primary" @click="aber()">OK</v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <v-tooltip bottom v-if="horaI != '' && tipoQuery == 2">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="horaI = ''">mdi-window-close</v-icon>
        </template>
        <span>Quitar hora inicial</span>
      </v-tooltip>
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

      <!-- HORA FINAL -->

      <v-col lg="2" v-if="tipoQuery == 2">
        <v-dialog
          ref="dialog"
          v-model="modalTf"
          persistent
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="horaF"
              label="Hora Final"
              prepend-icon="mdi-clock"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker v-if="modalTf" v-model="horaF" full-width>
            <div class="flex-grow-1"></div>
            <v-btn text color="primary" @click="modalTf = false"
              >Cancelar</v-btn
            >
            <v-btn text color="primary" @click="aber()">OK</v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <v-tooltip bottom v-if="horaF != '' && tipoQuery == 2">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="horaF = ''">mdi-window-close</v-icon>
        </template>
        <span>Quitar hora final</span>
      </v-tooltip>
    </v-row>
    <v-row justify="center">
      <v-radio-group
        label="Filtrar por:"
        row
        v-model="tipoQuery"
        @change="horasTemporales()"
      >
        <v-radio :value="1" label="Fecha"></v-radio>
        <v-radio :value="2" label="Fecha y Hora"></v-radio>
        <v-radio :value="3" label="Género"></v-radio>
      </v-radio-group>
    </v-row>
    <v-row justify="center">
      <v-btn color="blue" @click="cargarTabla()">Actualizar</v-btn> </v-row
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
      <template v-slot:item.grafica="{ item }">
        <a href="#anclaGrafico"
          ><v-btn
            color="blue"
            text
            @click="
              tituloGrafica = 'Gráfica de uso para ' + item.nombre;
              cargarGrafica(item.cve_espacio_deportivo);
            "
            >Ver gráfica por espacio</v-btn
          ></a
        >
      </template>
    </v-data-table>
    <br />
    <h2 id="anclaGrafico">{{ tituloGrafica }}</h2>
    <v-row justify="center">
      <div id="containerGrafo">
        <canvas id="myChart" width="800" height="530"></canvas>
      </div>
    </v-row>
  </div>
</template>

<script setup>
import { ref,watch,onMounted } from "vue";
import Chart from "chart.js";
import {getReporteApartadoService,getReporteApartadoGraficaService} from '@/services/apartados_services'

import XLSX from "xlsx";

const menuFechaI = ref(false); //Ventana de dias, fecha inicial
const menuFechaF = ref(false); //Ventana de dias, fecha final
const fechaI = ref(""); //Fecha inicial en formato de BD
const fechaIF = ref(""); //Fecha inicial en formato de usuario
const horaI = ref(""); //Hora inicial
const horaItemp = ref(""); //Hora inicial temporal, se almacena cuando se usa el switch de todo el dia
const fechaF = ref(""); //Fecha final en formato de BD
const fechaFF = ref(""); //Fecha inicial en formato de usuario
const fechaFtemp = ref(""); //Fecha final temporal, se almacena cuando se usa el switch de solo un dia
const horaF = ref(""); //Hora final
const horaFtemp = ref(""); //Hora final temporal, se almacena cuando se usa el switch de todo el dia
const modalTi = ref(false); //Modal de picker de hora inicial
const modalTf = ref(false); //Modal de picker de hora final
const formatoFechaI = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const formatoFechaF = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
//Tipos querys
const queryFechas = ref(true);
const queryHoras = ref(false);
const queryGenero = ref(false);
const tipoQuery = ref(1);
const tituloGrafica = ref("");
const arrayVal = ref([]);
const arrayLabels = ref([]);
const arrayColores = ref([]);
const arrayColoresBordes = ref([]);
const headersTabla =ref([
  { text: "Equipo", value: "equipo" },
  { text: "Espacio deportivo", value: "nombre" },
  { text: "Veces que se usó", value: "usado" },
  { text: "", value: "grafica" },
]);
const itemsTabla = ref([]);

const ctx = ref("");
const myChart = ref("");

watch(fechaI, (val) => {
  if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
});
watch(fechaF, (val) => {
  if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
});

onMounted(() => cargarTabla());

function horasTemporales() {
  // this.setTipoQuery();
  if (tipoQuery.value == 2) {
    horaI.value = horaItemp.value;
    horaF.value = horaFtemp.value;
    horaItemp.value = "";
    horaFtemp.value = "";
  } else {
    horaItemp.value = horaI.value;
    horaFtemp.value = horaF.value;
    horaI.value = "";
    horaF.value = "";
  }

}
function aber() {
  modalTi.value = false;
  modalTf.value = false;
}

async function cargarTabla() {
  // axios
  //   .post(
  //     "/reporteApartadosController.php",
  //     qs.stringify({
  //       accion: 1,
  //       tipoQuery:  tipoQuery.value,
  //       fechaI:     fechaIF.value,
  //       fechaF:     fechaFF.value,
  //       horaI:      horaI.value,
  //       horaF:      horaF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsTabla.value = [];
  //     setTipoQuery();
  //     itemsTabla.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
 itemsTabla.value=await  getReporteApartadoService(tipoQuery.value,fechaIF.value,fechaFF.value,horaI.value,horaF.value,)
}

function setTipoQuery() {
  if (tipoQuery.value == 1) {
    headersTabla.value = [
      { text: "Equipo", value: "equipo" },
      { text: "Espacio deportivo", value: "nombre" },
      { text: "Veces que se usó", value: "usado" },
      { text: "", value: "grafica" },
    ];
  } else if (tipoQuery.value == 2) {
    headersTabla.value = [
      { text: "Equipo", value: "equipo" },
      { text: "Espacio deportivo", value: "nombre" },
      { text: "Veces que se usó", value: "usado" },
      { text: "", value: "grafica" },
    ];
  } else if (tipoQuery.value == 3) {
    headersTabla.value = [
      { text: "Equipo", value: "equipo" },
      { text: "Espacio deportivo", value: "nombre" },
      { text: "Usado por Hombres", value: "h" },
      { text: "Usado por Mujeres", value: "m" },
      { text: "", value: "grafica" },
    ];
  }
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

//Convierte fecha en formato aaaa-mm-dd a dd/mm/aaaa
function parseFechaInput(fecha) {
  if (!fecha) return null;
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
async function cargarGrafica(esp) {
  // axios
  //   .post(
  //     "/reporteApartadosController.php",
  //     qs.stringify({
  //       accion: 2,
  //       tipoQuery:  tipoQuery.value,
  //       fechaI:     fechaIF.value,
  //       fechaF:     fechaFF.value,
  //       horaI:      horaI.value,
  //       horaF:      horaF.value,
  //       espacio: esp,
  //     })
  //   )
    // .then((res) => {
      const data=await getReporteApartadoGraficaService(tipoQuery.value,fechaIF.value,fechaFF.value,horaI.value,horaF.value,esp)
      var dss = [];
      if (tipoQuery.value == 1 || tipoQuery.value == 2) {
        //Arrays para un solo conjuento de datos
        var arrayVal = [];
        var arrayLabels = [];
        var arrayColores = [];
        var arrayColoresBordes = [];
        data.forEach((element) => {
          arrayVal.push(element.usado);
          arrayLabels.push(element.equipo);
          var color =
            "rgba(" +
            getRandomInt(0, 256) +
            ", " +
            getRandomInt(0, 256) +
            ", " +
            getRandomInt(0, 256);
          arrayColores.push(color + ", 0.2)");
          arrayColoresBordes.push(color + ", 1)");
          // console.log(color);
        });
        dss.push({
          label: "Veces que se usó",
          data: arrayVal,
          backgroundColor: arrayColores,
          borderColor: arrayColoresBordes,
          borderWidth: 1,
        });
      } else {
        //Arrays para dos conjuntos de datos(genero)
        var arrayVal = [];
        var arrayVal2 = [];
        var arrayLabels = [];
        var arrayColores = [];
        var arrayColoresBordes = [];
        data.forEach((element) => {
          arrayVal.push(element.h);
          arrayVal2.push(element.m);
          arrayLabels.push(element.equipo);
          // var color = "rgba("+this.getRandomInt(0, 256)+", "+this.getRandomInt(0, 256)+", "+this.getRandomInt(0, 256);
          // arrayColores.push(color+", 0.2)");
          // arrayColoresBordes.push(color+", 1)");
        });
        dss.push({
          label: "Veces usado por mujeres",
          data: arrayVal2,
          backgroundColor: "rgba(255, 0, 50, 0.2)",
          borderColor: "rgba(255, 0, 20, 1)",
          borderWidth: 1,
        });
        dss.push({
          label: "Veces usado por hombres",
          data: arrayVal,
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderColor: "rgba(0, 0, 255, 1)",
          borderWidth: 1,
        });
      }

      document.getElementById("myChart").remove();
      document.getElementById("containerGrafo").innerHTML =
        '<canvas id="myChart" width="800" height="600"></canvas>';
      ctx.value = document.getElementById("myChart");
      myChart.value = new Chart(ctx.value, {
        type: "bar",
        data: {
          labels: arrayLabels,
          datasets: dss,
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    // })
    // .catch(function (res) {
    //   alert(res);
    // });
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function exportar() {
  var tbl = document.getElementById("tabla");
  var wb = XLSX.utils.table_to_book(tbl);
  XLSX.writeFile(wb, "reporte_apartados.xlsb");
}
</script>
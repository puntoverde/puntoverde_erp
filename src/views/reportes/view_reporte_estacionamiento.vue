<template>
  <div>

    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text"><v-icon size="50">mdi-car-sports</v-icon> Reporte Acceso Estacionamiento</h1>
    </div>

    <v-row class="my-0">
      <v-col cols="12" md="2" xs="12" sm="6" lg="4">
        <v-card class="rounded-xl">
          <v-card-title class="d-flex justify-space-around primary--text">
            <span>Entradas</span>
            <v-icon color="white">mdi-swap-horizontal-bold</v-icon>
            <span>Salidas</span>
          </v-card-title>
          <v-card-text class="d-flex justify-space-around mt-2">
            <h2>{{ entradaNum }}</h2>
            <h2></h2>
            <h2>{{ salidaNum }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" xs="12" sm="6" lg="4">
        <v-card class="rounded-xl">
          <v-card-title class="d-flex justify-space-around primary--text">
            <span>Cajones</span>
            <span>Ocupados</span>
            <span>Libres</span>
          </v-card-title>
          <v-card-text class="d-flex justify-space-around mt-2">
            <h2>364</h2>
            <h2>{{ estanciaNum }}</h2>
            <h2>{{ LibresNumm }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" xs="12" sm="6" lg="2">
        <v-card class="rounded-xl">
          <v-card-title class="d-flex justify-space-around primary--text">
            <span>Capacidad</span>

          </v-card-title>
          <v-card-text class="d-flex justify-space-around mt-2">
            <v-progress-linear stream buffer-value="0" :value="calcularPorcentaje" color="primary" height="25">
              <template v-slot="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" xs="12" sm="6" lg="2">
        <v-card class="rounded-xl">
          <v-card-title class="d-flex justify-space-around primary--text">
            <span>Promedio</span>
          </v-card-title>
          <v-card-text class="d-flex justify-space-around mt-2">
            <h2>{{ calcularTiempo }}</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="d-flex justify-space-between mb-5">
      <div>
        <v-btn color="secondary" class="mr-2"
          @click="exportarExcel">
          <v-icon>mdi-file-excel</v-icon>
          Excel
        </v-btn>
                
            <v-btn  color="secondary"  @click="dialog = true">
              <v-icon class="mr-1">mdi-chart-bar</v-icon>
              Graficas
            </v-btn>
      </div>

      <Search v-model="search" :filters="filters" @emit-buscar="cargarTabla">
         
        <template v-slot:fechaI="{data}">
          <v-menu v-model="data.menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="dayjs(data.value).format('DD [de] MMM [del] YYYY')" prepend-inner-icon="mdi-calendar" readonly v-bind="attrs"
                v-on="on" filled hide-details></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="data.value" no-title @input="data.menu = false"></v-date-picker>
          </v-menu>
        </template>

        <template v-slot:fechaF="{data}">
        <v-menu v-model="data.menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="dayjs(data.value).format('DD [de] MMM [del] YYYY')" prepend-inner-icon="mdi-calendar" readonly v-bind="attrs"
                v-on="on" filled hide-details></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="data.value" no-title @input="data.menu = false"></v-date-picker>
          </v-menu>
        </template>

        <template v-slot:hInicio="{data}">
          <v-text-field v-mask="'##:##'" filled prepend-inner-icon="mdi-clock" v-model="data.value"/>
        </template>
      </Search>
    </div>

    <v-data-table :headers="headersTabla" :items="ctabla" :search="search" :page.sync="page"
      :items-per-page="itemsPerPage" class="table-pv rounded-xl elevation-5" hide-default-footer>
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
          <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
          <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>
      <template v-slot:item.acciones="{ item }">
        <v-tooltip>
          <template v-slot:activator="{ on, attrs }" bottom>
            <v-btn class="mr-2" color="primary" icon outlined v-on="on"
              @click="getJugadoresByAccion(item.id_equipo_futbol, item)">
              <v-icon> mdi-eye</v-icon></v-btn>
          </template>
          <span> Ver jugadores</span>
        </v-tooltip>
        <v-btn class="mr-2" color="primary" icon outlined @click="openDialogNew(item.id_equipo_futbol, item)">
          <v-icon> mdi-plus</v-icon>
        </v-btn>
        <v-btn color="primary" icon outlined @click="
          createCredencial(
            item.id_equipo_futbol,
            item.equipo,
            item.torneo,
            item.categoria
          )
          ">
          <v-icon> mdi-printer</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.salida="{ item }">
        <span v-if="item.salida">{{ item.salida }}</span>
        <v-icon v-else color="red">mdi-close-circle</v-icon>
      </template>
    </v-data-table>

  

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="() => { dialog = false; tabs = null }">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Graficas de Entrada y Salida</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn dark icon @click="downloadImage">
            <v-icon>mdi-download</v-icon>
          </v-btn>

          <template v-slot:extension>
            <v-tabs v-model="tabs" centered dark class="primary">
              <v-tab href="#tab-1" @click="getDataChartDia">Por Dia</v-tab>
              <v-tab href="#tab-2" @click="getDataChartGenero">Por Genero</v-tab>
              <v-tab href="#tab-3" @click="getDataChartDiaSemana">Por Dias Semana</v-tab>
              <v-tab href="#tab-4" @click="getDataChartHora">Por Hora</v-tab>
              <v-tab href="#tab-5" @click="getDataChartEstancia">Por Tiempo Estancia</v-tab>
              <v-tab href="#tab-6" @click="getDataChartEdad">Por Edades</v-tab>
            </v-tabs>
          </template>
        </v-toolbar>
        <v-tabs-items v-model="tabs">
          <v-tab-item value="tab-1">
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartDia"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-2">
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartGenero"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-3">
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartDiaSemana"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-4">
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartHora"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-5">
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartEstancia"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-6">
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartEdad"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import XLSX from "xlsx";
import Chart from "chart.js";
import { saveAs } from "file-saver";
import isNull from "lodash/isNull";
import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
import isUndefined from 'lodash/isUndefined'
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Integral6,
  Ion6,
  IonBoardroom6,
  Kilter6,
  Green6,
  Celestial6,
} from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";
import {getDatosEstacionamientoService,getDatosEstacionamientoChartService,getDatosEstacionamientoChartGeneroService,getDatosEstacionamientoChartSemanaService,getDatosEstacionamientoChartHorasService,getDatosEstacionamientoChartEstanciaService,getDatosEstacionamientoChartEdadService} from '@/services/reporte_estacionamiento_service'

dayjs.extend(toObject);

const fechaI = ref('') //Fecha inicial en formato de BD
const fechaF = ref('') //Fecha final en formato de BD

const headersTabla = [
  { text: "Acción", value: "accion" },
  { text: "Persona", value: "persona" },
  { text: "Fecha", value: "fecha" },
  { text: "Entrada", value: "entrada" },
  { text: "Salida", value: "salida" },
  { text: "Tiempo", value: "tiempo" },
  { text: "Modelo", value: "modelo", align: "center" },
  { text: "Marca", value: "marca", align: "center" },
]
const itemsTabla = ref([])
const cve_espacio_deportivo = ref(0)

const dialog = ref(false)
const tabs = ref()
const ChartDia = ref(null)
const ChartGenero = ref(null)
const ChartDiaSemana = ref(null)
const ChartHora = ref(null)
const ChartEstancia = ref(null)
const ChartEdad = ref(null)
const search = ref('')

const filters = ref([
  { label: "Fecha inicio", key: "fechaI", value: "" },
  { label: "Fecha fin", key: "fechaF", value: "" },
  { label: "Horario", key: "hInicio", value: "" },
]);
const getBreadcrumb = [
  {
    text: "Dashboard",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    text: "Link 1",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    text: "Link 2",
    disabled: true,
    href: "breadcrumbs_link_2",
  },
];

const page = ref(1);
const itemsPerPage = ref(10);


watch(tabs, (newValue, oldValue) => { if (isNull(oldValue) && newValue === "tab-1") getDataChartDia() })

const entradaNum = computed(() => itemsTabla.value.map((i) => i.accion).length)
const salidaNum = computed(() => itemsTabla.value.map((i) => i.salida).filter((i) => !isNull(i)).length)
const estanciaNum = computed(() => itemsTabla.value.map((i) => i.salida).filter((i) => isNull(i)).length)
const LibresNumm = computed(() => 364 - estanciaNum.value)

const ctabla = computed(() => {
  if (cve_espacio_deportivo.value == 0) {
    return itemsTabla.value;
  } else {
    return itemsTabla.value.filter(
      (i) => i.cve_espacio_deportivo == cve_espacio_deportivo.value
    );
  }
})
const calcularTiempo = computed(() => {
  let datos = itemsTabla.value.filter((i) => !isNull(i.salida));
  let fecha = dayjs(
    datos
      .map((i) => parseInt(i.milisegundos))
      .reduce((acumulador, i) => acumulador + i, 0) / datos.length
  );
  return `${fecha.hour() - 18}:${fecha.minute()}`;
})
const calcularPorcentaje = computed(() => {
  return estanciaNum.value * 100 / 364
})


onMounted(() => {
  fechaI.value=dayjs().format('YYYY-MM-DD')
  fechaF.value=dayjs().format('YYYY-MM-DD')
  cargarTabla();
})


async function cargarTabla(filtros={}) {
  console.log('filtrosxxx',filtros)
  fechaI.value=filtros.fechaI 
  fechaF.value=filtros.fechaF

  // axios
  //   .post(
  //     "/reporteEstacionamientoController.php",
  //     qs.stringify({accion: 1,...filtros})
  //   )
  //   .then((res) => {
  //     itemsTabla.value = [];
  //     itemsTabla.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });

  const data=await getDatosEstacionamientoService(filtros)
  itemsTabla.value = data;
}

function exportarExcel() {
  let wb = new XLSX.utils.book_new();
  wb.SheetNames.push("Datos Entrada Salida");
  let encabezado = headersTabla.map((i) => i.text);

  let datos = itemsTabla.value.map((i) => [
    i.accion,
    i.socio,
    i.nombre,
    i.fecha,
    i.entrada,
    i.salida,
  ]);

  let ws_data = [encabezado].concat(datos); //a row with 2 columns
  let ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Datos Entrada Salida"] = ws;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "test.xlsx"
  );
}


async function getDataChartDia() {
  // let { data } = await axios.post(
  //   "/reporteEstacionamientoController.php",
  //   qs.stringify({
  //     accion: 2,
  //     fechaI: fechaI.value,
  //     fechaF: fechaF.value,
  //   })
  // );
const data=await getDatosEstacionamientoChartService(fechaI.value,fechaF.value)
  console.log("data--->", data);

  let ctx = document.getElementById("ChartDia");

  if (!isNull(ChartDia.value)) {
    ChartDia.value.destroy();
  }

  ChartDia.value = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: data.map(
        (item) =>
          `${dayjs(item.fecha).format("DD/MM/YYYY")}, ${item.total} Accesos`
      ),
      datasets: [
        {
          label: "Salidas registradas",
          data: data.map((item) => item.con_salida),
          backgroundColor: [
            ...Integral6,
            ...Ion6,
            ...IonBoardroom6,
            ...Kilter6,
            ...Green6,
            ...Celestial6,
          ],
        },
        {
          label: "Salidas sin registro",
          data: data.map((item) => item.sin_salida),
          backgroundColor: [
            ...Integral6,
            ...Ion6,
            ...IonBoardroom6,
            ...Kilter6,
            ...Green6,
            ...Celestial6,
          ],
        },
      ],
    },

    options: {
      plugins: {
        datalabels: {
          color: Array(18).fill("rgb(0, 0, 0)"),
          anchor: "end",
          align: "top",
          offset: 1,
        },
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              offsetGridLines: true,
            },
          },
        ],
      },
      responsive: true,
    },
  });
}

async function getDataChartGenero() {
  // let { data } = await axios.post(
  //   "/reporteEstacionamientoController.php",
  //   qs.stringify({
  //     accion: 3,
  //     fechaI: fechaI.value,
  //     fechaF: fechaF.value,
  //   })
  // );

  const data=await getDatosEstacionamientoChartGeneroService(fechaI.value,fechaF.value)

  console.log("data--->", data);

  let ctx = document.getElementById("ChartGenero");

  if (!isNull(ChartGenero.value)) {
    ChartGenero.value.destroy();
  }

  ChartGenero.value = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: data.map(i => i.fecha),
      datasets: [
        {
          label: "Num Salidas Hombre",
          data: data.map(i => i.con_salida_hombre),
          backgroundColor: [
            ...Integral6,
            ...Ion6,
            ...IonBoardroom6,
            ...Kilter6,
            ...Green6,
            ...Celestial6,
          ],
          stack: 1
        },
        {
          label: "Num Salidas Mujer",
          data: data.map(i => i.con_salida_mujer),
          backgroundColor: [
            //...Integral6,
            //...Ion6,
            //...IonBoardroom6,
            //...Kilter6,
            ...Green6,
            ...Celestial6,
          ],
          stack: 1
        },
        {
          label: "Num Sin Salidas Hombre",
          data: data.map(i => i.sin_salida_hombre),
          backgroundColor: [
            //...Integral6,
            //...Ion6,
            ...IonBoardroom6,
            ...Kilter6,
            ...Green6,
            ...Celestial6,
          ],
          stack: 2
        },
        {
          label: "Num Sin Salidas Mujer",
          data: data.map(i => i.sin_salida_mujer),
          backgroundColor: [
            //...Integral6,
            //...Ion6,
            //...IonBoardroom6,
            ...Kilter6,
            ...Green6,
            ...Celestial6,
          ],
          stack: 2
        }
      ],
    },

    options: {
      plugins: {
        datalabels: {
          color: Array(18).fill("rgb(0, 0, 0)"),
          anchor: "end",
          align: "top",
          offset: 1,
        },
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            stacked: true,
            gridLines: {
              offsetGridLines: true,
            },
          },
        ],
        xAxes: [{ stacked: true }]
      },
      responsive: true,
    },
  });
}

async function getDataChartDiaSemana() {

  // let { data } = await axios.post("/reporteEstacionamientoController.php",
  //   qs.stringify({
  //     accion: 4,
  //     fechaI: fechaI.value,
  //     fechaF: fechaF.value,
  //   }))

  const data=await getDatosEstacionamientoChartSemanaService(fechaI.value,fechaF.value)

  //let dias_semana=[{dia:1,text:'Domingo'},{dia:2,text:'Lunes'},{dia:3,text:'Martes'},{dia:4,text:'Miercoles'},{dia:5,text:'Juevez'},{dia:6,text:'Viernes'},{dia:7,text:'Sabado'}]

  console.log("data--->", data)

  let dom = data.find(i => parseInt(i.dia_num) === 1);
  let lun = data.find(i => parseInt(i.dia_num) === 2);
  let mar = data.find(i => parseInt(i.dia_num) === 3);
  let mie = data.find(i => parseInt(i.dia_num) === 4);
  let jue = data.find(i => parseInt(i.dia_num) === 5);
  let vie = data.find(i => parseInt(i.dia_num) === 6);
  let sab = data.find(i => parseInt(i.dia_num) === 7);

  let dias_semana = [
    `Domingo ${isUndefined(dom) ? 0 : dom.total}`,
    `Lunes ${isUndefined(lun) ? 0 : lun.total}`,
    `Martes ${isUndefined(mar) ? 0 : mar.total}`,
    `Miercoles ${isUndefined(mie) ? 0 : mie.total}`,
    `Jueves ${isUndefined(jue) ? 0 : jue.total}`,
    `Viernes ${isUndefined(vie) ? 0 : vie.total}`,
    `Sabado ${isUndefined(sab) ? 0 : sab.total}`,
  ]

  let data_setUno = [
    isUndefined(dom) ? 0 : dom.con_salida,
    isUndefined(lun) ? 0 : lun.con_salida,
    isUndefined(mar) ? 0 : mar.con_salida,
    isUndefined(mie) ? 0 : mie.con_salida,
    isUndefined(jue) ? 0 : jue.con_salida,
    isUndefined(vie) ? 0 : vie.con_salida,
    isUndefined(sab) ? 0 : sab.con_salida,
  ]

  let data_setDos = [
    isUndefined(dom) ? 0 : dom.sin_salida,
    isUndefined(lun) ? 0 : lun.sin_salida,
    isUndefined(mar) ? 0 : mar.sin_salida,
    isUndefined(mie) ? 0 : mie.sin_salida,
    isUndefined(jue) ? 0 : jue.sin_salida,
    isUndefined(vie) ? 0 : vie.sin_salida,
    isUndefined(sab) ? 0 : sab.sin_salida,
  ]


  let ctx = document.getElementById("ChartDiaSemana");

  if (!isNull(ChartDiaSemana.value)) { ChartDiaSemana.value.destroy(); }

  ChartDiaSemana.value = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: dias_semana,
      datasets: [
        {
          label: "Salidas registradas",
          data: data_setUno,
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        },
        {
          label: "Salidas sin registro",
          data: data_setDos,
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        }

      ]
    },

    options: {
      plugins: {
        datalabels: {
          color: Array(18).fill("rgb(0, 0, 0)"),
          anchor: "end",
          align: "top",
          offset: 1
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              offsetGridLines: true
            }
          }
        ]
      },
      responsive: true
    }
  });

}

async function getDataChartHora() {

  // let { data: { entradas, salidas } } = await axios.post("/reporteEstacionamientoController.php",
  //   qs.stringify({
  //     accion: 5,
  //     fechaI: fechaI.value,
  //     fechaF: fechaF.value,
  //   }))

  const {entradas, salidas} =await getDatosEstacionamientoChartHorasService(fechaI.value,fechaF.value)

  let data_horas = [...new Set([...entradas.map(i => i.hora_dia), ...salidas.map(i => i.hora_dia)])].sort((a, b) => a - b)
  let data_entradas = Array.from(data_horas, i => isUndefined(entradas.find(ii => ii.hora_dia == i)) ? { total: 0 } : entradas.find(ii => ii.hora_dia == i)).map(i => i.total)
  let data_salidas = Array.from(data_horas, i => isUndefined(salidas.find(ii => ii.hora_dia == i)) ? { total: 0 } : salidas.find(ii => ii.hora_dia == i)).map(i => i.total)

  let acumulador = 0;
  let linexxx = Array.from(data_horas, (item, index) => {
    if (isNull(data_entradas[index]) && index === 0) acumulador = 0;
    else if (!isNull(data_entradas[index]) && index === 0) acumulador = parseInt(data_entradas[index]);
    else {
      if (acumulador === 0) acumulador = acumulador + parseInt(data_entradas[index])
      else acumulador = (acumulador + parseInt(data_entradas[index])) - parseInt(data_salidas[index - 1]);
    }
    return acumulador;
  })

  let ctx = document.getElementById("ChartHora");

  if (!isNull(ChartHora.value)) { ChartHora.value.destroy(); }

  ChartHora.value = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: data_horas.map(i => isNull(i) ? 'en club' : `${i} horas`),
      datasets: [
        {
          label: "Entradas",
          data: data_entradas,
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        },
        {
          label: "Salidas",
          data: data_salidas,
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        },

        {
          type: 'line',
          label: "permanencia",
          data: linexxx,
          borderColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6],
          fill: false,
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        }

      ]
    },

    options: {
      plugins: {
        datalabels: {
          color: Array(18).fill("rgb(0, 0, 0)"),
          anchor: "end",
          align: "top",
          offset: 1
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              offsetGridLines: true
            }
          }
        ]
      },
      responsive: true
    }
  });

}

async function getDataChartEstancia() {

  // let { data } = await axios.post("/reporteEstacionamientoController.php",
  //   qs.stringify({
  //     accion: 6,
  //     fechaI: fechaI.value,
  //     fechaF: fechaF.value,
  //   }))

  const data=await getDatosEstacionamientoChartEstanciaService(fechaI.value,fechaF.value)

  function labels_data(i) {

    let data_l = '';
    if (i.seconds === 30) data_l += 'En club'
    if (i.minutes === 0 && i.hours === 0 && i.seconds === 0) data_l += 'de 1 min a 29 min'
    if (i.minutes === 30 && i.hours === 0 && i.seconds === 0) data_l += 'de 30 min a 59 min'
    if (i.minutes === 0 && i.hours > 0 && i.seconds === 0) data_l += `de ${i.hours} hora a ${i.hours} hora 29 min`
    if (i.minutes === 30 && i.hours > 0 && i.seconds === 0) data_l += `de ${i.hours} hora 30 min a ${i.hours} hora 59 min`
    return data_l;
  }

  let data_horas = data.map(i => dayjs(`${dayjs().format('YYYY-MM-DD')} ${i.estancia}`).toObject()).map(labels_data);



  let ctx = document.getElementById("ChartEstancia");

  if (!isNull(ChartEstancia.value)) { ChartEstancia.value.destroy(); }

  ChartEstancia.value = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: data_horas,
      datasets: [
        {
          label: "Salidas registradas",
          data: data.map(i => i.total),
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        }

      ]
    },

    options: {
      plugins: {
        datalabels: {
          color: Array(18).fill("rgb(0, 0, 0)"),
          anchor: "end",
          align: "top",
          offset: 1
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              offsetGridLines: true
            }
          }
        ]
      },
      responsive: true
    }
  });

}

async function getDataChartEdad() {

  // let { data } = await axios.post("/reporteEstacionamientoController.php",
  //   qs.stringify({
  //     accion: 7,
  //     fechaI: fechaI.value,
  //     fechaF: fechaF.value,
  //   }))

  const data=await getDatosEstacionamientoChartEdadService(fechaI.value,fechaF.value)

  console.log("data--->", data)

  let rango_edad = [
    { edad1: 0, edad2: 5, text: '0-5' },
    { edad1: 6, edad2: 10, text: '6-10' },
    { edad1: 11, edad2: 15, text: '11-15' },
    { edad1: 16, edad2: 20, text: '16-20' },
    { edad1: 21, edad2: 25, text: '21-25' },
    { edad1: 26, edad2: 30, text: '26-30' },
    { edad1: 31, edad2: 35, text: '31-35' },
    { edad1: 36, edad2: 40, text: '36-40' },
    { edad1: 41, edad2: 45, text: '41-45' },
    { edad1: 46, edad2: 50, text: '46-50' },
    { edad1: 51, edad2: 55, text: '51-55' },
    { edad1: 56, edad2: 60, text: '56-60' },
    { edad1: 61, edad2: 65, text: '61-65' },
    { edad1: 66, edad2: 70, text: '66-70' },
    { edad1: 71, edad2: 75, text: '71-75' },
    { edad1: 76, edad2: 80, text: '76-80' },
    { edad1: 81, edad2: 85, text: '81-85' },
    { edad1: 86, edad2: 90, text: '86-90' },
    { edad1: 91, edad2: 95, text: '91-95' },
    { edad1: 96, edad2: 100, text: '96-100' },
    { edad1: 101, edad2: 105, text: 'mas de 100' },
  ]

  let data_set = Array.from(rango_edad, i =>
    data.filter(ii => parseInt(ii.edad) >= i.edad1 && parseInt(ii.edad) <= i.edad2)
      .map(i => parseInt(i.total))
      .reduce((red, val) => red + val, 0))
  console.log(data_set)

  let ctx = document.getElementById("ChartEdad");

  if (!isNull(ChartEdad.value)) { ChartEdad.value.destroy(); }

  ChartEdad.value = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: rango_edad.map(i => i.text),
      datasets: [
        {
          label: "Acceso por edad",
          data: data_set,
          backgroundColor: [...Integral6, ...Ion6, ...IonBoardroom6, ...Kilter6, ...Green6, ...Celestial6]
        }

      ]
    },

    options: {
      plugins: {
        datalabels: {
          color: Array(18).fill("rgb(0, 0, 0)"),
          anchor: "end",
          align: "top",
          offset: 1
        }
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            gridLines: {
              offsetGridLines: true
            }
          }
        ]
      },
      responsive: true
    }
  });

}

function downloadImage() {

  let canvas = null;
  let title = ''

  if (tabs.value === 'tab-1') { canvas = document.getElementById('ChartDia'); title = 'EntradaSalidaPorDia.png' }
  if (tabs.value === 'tab-2') { canvas = document.getElementById('ChartGenero'); title = 'EntradaSalidaPorGenero.png' }
  if (tabs.value === 'tab-3') { canvas = document.getElementById('ChartDiaSemana'); title = 'EntradaSalidaPorDiaSemana.png' }
  if (tabs.value === 'tab-4') { canvas = document.getElementById('ChartHora'); title = 'EntradaSalidaPorHora.png' }
  if (tabs.value === 'tab-5') { canvas = document.getElementById('ChartEstancia'); title = 'EntradaSalidaPorEstancia.png' }
  if (tabs.value === 'tab-6') { canvas = document.getElementById('ChartEdad'); title = 'EntradaSalidaPorEdad.png' }

  canvas.toBlob(blob => saveAs(blob, title));
}



</script> 
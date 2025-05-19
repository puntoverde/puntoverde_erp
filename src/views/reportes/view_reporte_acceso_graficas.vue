<template>
  <div>
    <v-row>
      <v-col md="8" lg="8" xs="12">
        <v-card elevation="5">
          <v-card-title class="d-flex justify-space-between">
            Filtros
            <!-- <v-btn fab color="info" small><v-icon>mdi-magnify</v-icon></v-btn> -->
          </v-card-title>
          <v-card-text class="d-flex flex-row justify-space-around">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-on="on"
                  v-model="date"
                  prepend-inner-icon="mdi-calendar"
                  hide-details
                  class="mr-5"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                type="month"
                color="primary"
                locale="es"
                @input="updateGraficas"
              ></v-date-picker>
            </v-menu>

            <v-text-field
              label="Accion"
              hide-details
              class="mr-5"
              v-model="accion"
              @keyup.enter="buscarAccion"
              @change="buscarAccion"
              v-mask="accionMask"
            ></v-text-field>

            <v-select
              label="Socio"
              hide-details
              class="mr-5"
              v-model="cve_socio"
              :items="lista_socios"
              item-value="cve_socio"
              item-text="socio"
            ></v-select>

            <v-btn color="info" class="mr-3 mt-5" @click="updateGraficas"
              ><v-icon>mdi-magnify</v-icon> Buscar</v-btn
            >
            <!--
            <v-btn color="warning" class="mt-5"
              ><v-icon>mdi-account-search</v-icon> Buscar por
              Nombre</v-btn
            >
            -->
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="2" lg="2" xs="12">
        <v-card elevation="5">
          <v-card-title> Total Accesos Usuarios </v-card-title>
          <v-card-text class="display-2 text-center">
            <v-icon x-large="">mdi-motion-sensor</v-icon> {{ totalAcceso }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col xs="12">
        <v-card elevation="5">
          <v-card-title> Total Accesos Invitados </v-card-title>
          <v-card-text class="display-2 text-center">
            <v-icon x-large="">mdi-motion-sensor</v-icon>
            {{ totalAccesoInvitado }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-1x">
        <v-card id="fullScreenDias" elevation="5">
          <v-card-title class="d-flex justify-space-between">
            <span>
              Acceso por dia {{ fMes(date) }} de {{ fYear(date) }}
            </span>
            <span>
              <v-btn
                fab
                color="info"
                small
                class="mr-2"
                @click="downloadImage('myChartDias')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>

              <v-btn fab small @click="fullScreen('fullScreenDias')">
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </span>
          </v-card-title>
          <v-card-text class="chart-container">
            <canvas
              id="myChartDias"
              style="position: relative; height: 40vh; width: 100%"
            ></canvas>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-1x">
        <v-card id="fullScreenEdades" elevation="5">
          <v-card-title class="d-flex justify-space-between">
            Acceso por edades {{ fMes(date) }} de {{ fYear(date) }}
            <span>
              <v-btn
                fab
                color="info"
                small
                class="mr-2"
                @click="downloadImage('myChartEdades')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>

              <v-btn fab small @click="fullScreen('fullScreenEdades')">
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </span></v-card-title
          >
          <v-card-text
            class="chart-container"
            style="position: relative; height: 40vh"
          >
            <canvas id="myChartEdades"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-1x">
        <v-card id="fullScreenGenero" elevation="5">
          <v-card-title class="d-flex justify-space-between"
            >Acceso por genero {{ fMes(date) }} de {{ fYear(date) }}
            <span>
              <v-btn
                fab
                color="info"
                small
                class="mr-2"
                @click="downloadImage('myChartGenero')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>

              <v-btn fab small @click="fullScreen('fullScreenGenero')">
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </span></v-card-title
          >
          <v-card-text
            class="chart-container"
            style="position: relative; height: 40vh; width: 100%"
          >
            <canvas id="myChartGenero"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-1x">
        <v-card id="fullScreenDiasSemana" elevation="5">
          <v-card-title class="d-flex justify-space-between">
            Acceso por Dias Semana
            <span>
              <v-btn
                fab
                color="info"
                small
                class="mr-2"
                @click="downloadImage('myChartDiasSemana')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>

              <v-btn fab small @click="fullScreen('fullScreenDiasSemana')">
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </span></v-card-title
          >
          <v-card-text
            class="chart-container"
            style="position: relative; height: 40vh"
          >
            <canvas id="myChartDiasSemana"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="pa-1x">
        <v-card id="fullScreenEdades" elevation="5">
          <v-card-title class="d-flex justify-space-between">
            Acceso Horas
            <span>
              <v-btn
                fab
                color="info"
                small
                class="mr-2"
                @click="downloadImage('myChartHoras')"
              >
                <v-icon>mdi-download</v-icon>
              </v-btn>

              <v-btn fab small @click="fullScreen('fullScreenEdades')">
                <v-icon>mdi-fullscreen</v-icon>
              </v-btn>
            </span></v-card-title
          >
          <v-card-text
            class="chart-container"
            style="position: relative; height: 40vh"
          >
            <canvas id="myChartHoras"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref,watch,onMounted } from 'vue';
import {getReporteAccesoGraficaDiaService,getReporteAccesoGraficaEdadesService,getReporteAccesoGraficaGeneroService,getReporteAccesoGraficaDiasSemanaService,getReporteAccesoGraficaHorasService,getReporteAccesoGraficaTotalAccesoService,getReporteAccesoGraficaFindAccionService} from '@/services/reporte_acceso_service'
import XLSX from "xlsx";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Integral6,Ion6,IonBoardroom6,Kilter6,Green6,Celestial6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office'
import {SetOne7} from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer' 
import dayjs from 'dayjs'

import _ from "lodash";
import { saveAs } from "file-saver";
import numeral from "numeral";

Chart.plugins.unregister(ChartDataLabels);


      const menu=ref(false)
      const date=ref(new Date().toISOString().substr(0, 7))
      const accion=ref("")
      const cve_accion=ref(0)
      const cve_socio=ref(0)
      const lista_socios=ref([])

      const chartDias=ref(null)
      const chartGenero=ref(null)
      const chartEdades=ref(null)
      const chartDiasSemana=ref(null)
      const chartHora=ref(null)
      const totalAcceso=ref(0)
      const totalAccesoInvitado=ref(0)
      const fab=ref(false)

      const accionMask= {
        mask: "FFFFF",
        tokens: {
          F: {
            pattern: /[0-9a-zA-Z]/,
            transform(v) {
              return v.toLocaleUpperCase();
            }
          }
        }
      }

    //    watch(fechaI,(val)=> {
    //   if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
    // })
    // watch(fechaF,(val)=> {
    //   if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
    // })
    // watch(tipoReporte,(val)=> {
    //   console.log(val);
    //   if (val == 1) graficaDisabled.value = false;
    //   else graficaDisabled.value = true;
    // })

    onMounted(()=>{
    getDataChartDias();
    getDataChartEdades();
    getDataChartGenero();
    getDataChartDiasSemana();
    getDataChartHoras();
    getTotalAcceso();
    })


    async function getDataChartDias() {
      let diaInicio = `${date.value}-01`;
      let diaFin = `${date.value}-${dayjs(date.value).daysInMonth()}`;

      menu.value = false;

      // let { data } = await axios.get("/reporteAccesoGraficasController.php", {
      //   params: { accion: 7, diaInicio, diaFin,cve_accion:cve_accion.value,cve_socio:cve_socio.value }
      // });
      const data=await getReporteAccesoGraficaDiaService(diaInicio,diaFin,cve_accion.value,cve_socio.value)

      let ctx = document.getElementById("myChartDias");

      if (!_.isNull(chartDias.value)) {
        chartDias.value.destroy();
      }

      //  else{

      chartDias.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: data.socios.map(item => item.dia_nombre),
          datasets: [
            {
              label: "# Acceso Socios",
              data: data.socios.map(item => item.num_accesos),
              //backgroundColor: Array(31).fill("#26A69A") // Array(31).fill("rgb(253, 95, 0)")
              backgroundColor:[...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
            },
            {
              label: "# Acceso Invitados",
              data: data.invitado.map(item => item.num_accesos),
              backgroundColor: Array(31).fill("rgb(255, 214, 53)")
            }
          ]
        },

        options: {
          plugins: {
            datalabels: {
              color: Array(31).fill("rgb(0, 0, 0)"),
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
          responsive: true,
          title: {
            display: true,
            // text: ['Accesos:1500','socios:1200','invitados:300'],
            text: `Total de accesos: ${numeral(
              data.socios
                .map(item => item.num_accesos)
                .reduce((reductor, value) => reductor + parseInt(value), 0) +
                data.invitado
                  .map(item => item.num_accesos)
                  .reduce((reductor, value) => reductor + parseInt(value), 0)
            ).format("0,0")}  Usuarios: ${numeral(
              data.socios
                .map(item => item.num_accesos)
                .reduce((reductor, value) => reductor + parseInt(value), 0)
            ).format("0,0")}  Invitados: ${numeral(
              data.invitado
                .map(item => item.num_accesos)
                .reduce((reductor, value) => reductor + parseInt(value), 0)
            ).format("0,0")}`,
            padding: 1,
            // position:'bottom',
            fontSize: 16
          },
          tooltips: { enabled: false }
        }
      });
      // }

      // else{
      //   console.log(this.chartDias.data.datasets)
      //   this.chartDias.data.datasets[0].data=data.socios.map(item => item.num_accesos);
      //   this.chartDias.update();
      // }
    }
    async function getDataChartEdades() {
      let diaInicio = `${date.value}-01`;
      let diaFin = `${date.value}-${dayjs(date.value).daysInMonth()}`;

      menu.value = false;

      // let { data } = await axios.get("/reporteAccesoGraficasController.php", {
      //   params: { accion: 9, diaInicio, diaFin }
      // });

      const data=await getReporteAccesoGraficaEdadesService( diaInicio, diaFin)


      if (!_.isNull(chartEdades.value)) {
        chartEdades.value.destroy();
      }

      const rango_edades = [
        0,
        5,
        10,
        15,
        20,
        25,
        30,
        35,
        40,
        45,
        50,
        55,
        60,
        65,
        70,
        75,
        80,
        85,
        90,
        100,
        150
      ];
      let edades = [];

      rango_edades.forEach(item => {
        edades.push(
          data
            .filter(
              item2 =>
                parseInt(item2.edad) > item && parseInt(item2.edad) <= item + 5
            )
            .map(item => parseInt(item.num_accesos))
            .reduce((val, reductor) => val + reductor, 0)
        );
      });

      let ctx = document.getElementById("myChartEdades");

      chartEdades.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: [
            "0 - 5",
            "6 - 10",
            "11 - 15",
            "16 - 20",
            "21 - 25",
            "26 - 30",
            "31 - 35",
            "36 - 40",
            "41 - 45",
            "46 - 50",
            "51 - 55",
            "56 - 60",
            "61 - 65",
            "66 - 70",
            "71 - 75",
            "76 - 80",
            "81 - 85",
            "86 - 90",
            "91 - 95",
            "96 - 100",
            "mas de 100"
          ],
          datasets: [
            {
              label: "# de Acceso por edad",
              data: edades,
              backgroundColor:Integral6.concat(Ion6).concat(IonBoardroom6).concat(Kilter6),
              // backgroundColor: [
              //   "rgb(37, 131, 197)",
              //   "rgb(98, 194, 175)",
              //   "rgb(247, 238, 166)",
              //   "rgb(203, 122, 74)",
              //   "rgb(209, 97, 167)",
              //   "rgb(70, 157, 210)",
              //   "rgb(119, 193, 173)",
              //   "rgb(253, 95, 0)",
              //   "rgb(206, 173, 161)",
              //   "rgb(215, 14, 130)",
              //   "rgb(73, 166, 221)",
              //   "rgb(1, 178, 141)",
              //   "rgb(249, 232, 183)",
              //   "rgb(232, 143, 129)",
              //   "rgb(198, 140, 191)",
              //   "rgb(0, 185, 213)",
              //   "rgb(237, 22, 81)",
              //   "rgb(128, 113, 177)",
              //   "rgb(119, 182, 229)",
              //   "rgb(0, 169, 192)",
              //   "rgb(0, 0, 0)"
              // ],
              borderWidth: 1
            }
          ]
        },

        options: {
          plugins: {
            datalabels: {
              color: Array(21).fill("rgb(0, 0, 0)"),
              anchor: "end",
              align: "top",
              offset: 1
            },
            //colorschemes:{scheme: 'brewer.Paired12'}
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
    async function getDataChartGenero() {
      let diaInicio = `${date.value}-01`;
      let diaFin = `${date.value}-${dayjs(date.value).daysInMonth()}`;

      menu.value = false;

      // let { data } = await axios.get("/reporteAccesoGraficasController.php", {
      //   params: { accion: 8, diaInicio, diaFin }
      // });

      const data=await getReporteAccesoGraficaGeneroService(diaInicio, diaFin)

      console.log(data);

      let numHombres = data.find(item => item.genero == "Masculino")
        .num_accesos;
      let numMujeres = data.find(item => item.genero == "Femenino").num_accesos;

      let ctx = document.getElementById("myChartGenero");

      if (!_.isNull(chartGenero.value)) chartGenero.value.destroy();

      chartGenero.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
          labels: ["Hombres", "Mujeres"],
          datasets: [
            {
              label: "# de Visitas por dia",
              data: [numHombres, numMujeres],
              backgroundColor: ["#1976D2", "#E91E63"]
            }
          ]
        },

        options: {
          plugins: {
            datalabels: {
              formatter(value, context) {
                let valor = context.dataset.data[context.dataIndex];
                let total = context.dataset.data.reduce(
                  (reductor, value) => reductor + parseInt(value),
                  0
                );
                let porcentaje = (100 * valor) / total;
                // return numeral(`${valor}->${porcentaje}`).format('0,0')
                return `${numeral(valor).format("0,0")} 
  ${numeral(porcentaje).format("0,0")}%`;
              },
              font: { size: 20 },
              color: Array(2).fill("rgb(255, 255, 255)"),
              // anchor: "end",
              // align: "top",
              offset: 1
            }
          },
          maintainAspectRatio: false,
          // scales: {
          //   yAxes: [
          //     {
          //       gridLines: {
          //         offsetGridLines: true
          //       }
          //     }
          //   ]
          // },
          responsive: true
        }
      });
    }

    async function getDataChartDiasSemana() {
      let diaInicio = `${date.value}-01`;
      let diaFin = `${date.value}-${dayjs(date.value).daysInMonth()}`;

      menu.value = false;

      // let { data } = await axios.get("/reporteAccesoGraficasController.php", {
      //   params: { accion: 10, diaInicio, diaFin }
      // });

      const data=await getReporteAccesoGraficaDiasSemanaService(diaInicio, diaFin)

      let ctx = document.getElementById("myChartDiasSemana");

      if (!_.isNull(chartDiasSemana.value)) {
        chartDiasSemana.value.destroy();
      }

      //  else{

      chartDiasSemana.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: data.map(item => item.dia_nombre),
          datasets: [
            {
              label: "# Acceso Dias",
              data: data.map(item => item.num_accesos),
              backgroundColor: SetOne7//[
                // "rgb(244, 67, 54)",
                // "rgb(233, 30, 99)",
                // "rgb(156, 39, 176)",
                // "rgb(33, 150, 243)",
                // "rgb(63, 81, 181)",
                // "rgb(103, 58, 183)",
                // "rgb(3, 169, 244)"
                // "#4527A0",
                // "#512DA8",
                // "#5E35B1",
                // "#7E57C2",
                // "#9575CD",
                // "#B39DDB",
                // "#D1C4E9"
              //]
            }
            // {
            //   label: "# Acceso Invitados",
            //   data: data.map(item => item.num_accesos),
            //   backgroundColor: Array(31).fill("rgb(255, 214, 53)")
            // }
          ]
        },

        options: {
          plugins: {
            datalabels: {
              color: Array(7).fill("rgb(0, 0, 0)"),
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
      // }

      // else{
      //   console.log(this.chartDias.data.datasets)
      //   this.chartDias.data.datasets[0].data=data.socios.map(item => item.num_accesos);
      //   this.chartDias.update();
      // }
    }

    async function getDataChartHoras() {
      let diaInicio = `${date.value}-01`;
      let diaFin = `${date.value}-${dayjs(date.value).daysInMonth()}`;

      menu.value = false;

      // let { data } = await axios.get("/reporteAccesoGraficasController.php", {
      //   params: { accion: 11, diaInicio, diaFin }
      // });

      const data=await getReporteAccesoGraficaHorasService(diaInicio, diaFin)

      let ctx = document.getElementById("myChartHoras");

      if (!_.isNull(chartHora.value)) {
        chartHora.value.destroy();
      }

      //  else{

      chartHora.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: data.map(item => item.hora),
          datasets: [
            {
              label: "# Acceso por Horas",
              data: data.map(item => item.num_acceso),
              backgroundColor: [
                "rgb(0, 188, 212)",
                "rgb(0, 150, 136)",
                "rgb(76, 175, 80)",
                "rgb(139, 195, 74)",
                "rgb(205, 220, 57)",
                "rgb(255, 235, 59)",
                "rgb(255, 193, 7)",
                "rgb(255, 152, 0)",
                "rgb(255, 87, 34)",
                "rgb(121, 85, 72)",
                "rgb(96, 125, 139)",
                "rgb(142, 36, 170)",
                "rgb(216, 27, 96)",
                "rgb(66, 165, 245)",
                "rgb(0, 137, 123)",
                "rgb(97, 97, 97)",
                "rgb(0, 0, 0)",
                "rgb(213, 0, 0)"
              ]
            }
            // {
            //   label: "# Acceso Invitados",
            //   data: data.invitado.map(item => item.num_accesos),
            //   backgroundColor: Array(31).fill("rgb(255, 214, 53)")
            // }
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
      // }

      // else{
      //   console.log(this.chartDias.data.datasets)
      //   this.chartDias.data.datasets[0].data=data.socios.map(item => item.num_accesos);
      //   this.chartDias.update();
      // }
    }

    async function getTotalAcceso() {
      let diaInicio = `${date.value}-01`;
      let diaFin = `${date.value}-${dayjs(date.value).daysInMonth()}`;

      menu.value = false;

      // let { data } = await axios.get("/reporteAccesoGraficasController.php", {
      //   params: { accion: 12, diaInicio, diaFin }
      // });

      const data=await getReporteAccesoGraficaTotalAccesoService(diaInicio, diaFin)

      totalAcceso.value = numeral(data.socios).format("0,0");
      totalAccesoInvitado.value = numeral(data.invitados).format("0,0");
    }

    function fullScreen(id) {
      var elem = document.getElementById(id);

      if (!document.fullscreenElement) {
        elem.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    function downloadImage(id) {
      let canvas = document.getElementById(id);

      canvas.toBlob(blob => saveAs(blob, "grafica.png"));
    }

    function updateGraficas() {
      getDataChartDias();
      getDataChartEdades();
      getDataChartGenero();
      getDataChartDiasSemana();
      getDataChartHoras();
      getTotalAcceso();
    }

   async  function buscarAccion()
    {
      let indexTripartidas = -1;
      let numero_accion = 0;
      let clasificacion = 0;

      if (accion.value.indexOf("A") > -1) {
        indexTripartidas = accion.value.indexOf("A");
        clasificacion = 1;
      } else if (accion.value.indexOf("B") > -1) {
        indexTripartidas = accion.value.indexOf("B");
        clasificacion = 2;
      } else if (accion.value.indexOf("C") > -1) {
        indexTripartidas = accion.value.indexOf("C");
        clasificacion = 3;
      }

      numero_accion = accion.value;

      if (indexTripartidas > -1) {
        numero_accion = accion.value.substr(0, indexTripartidas);
      }

      console.log(numero_accion,clasificacion)

      // let {data} = await axios.get('/reporteAccesoGraficasController.php',{params:{accion:13,numero_accion,clasificacion}})
      const data=await getReporteAccesoGraficaFindAccionService(numero_accion,clasificacion)
      cve_accion.value=data.cve_accion;
      lista_socios.value=data.socios
    }


     function fMes(val) {
      let Meses = {
        "01": "Enero",
        "02": "Febrero",
        "03": "Marzo",
        "04": "Abril",
        "05": "Mayo",
        "06": "Junio",
        "07": "Julio",
        "08": "Agosto",
        "09": "Septiembre",
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre"
      };
      return Meses[val.substr(5, 6)];
    }
    function fYear(val) {
      return val.substr(0, 4);
    }


</script>

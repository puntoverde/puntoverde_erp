<template>
  <div>
    <v-row>
      <v-col cols="12" md="2" xs="12" sm="6" lg="2">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            Entradas
            <h2>{{entradaNum}}</h2>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" xs="12" sm="6" lg="2">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            Salidas
            <h2>{{salidaNum}}</h2>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" xs="12" sm="6" lg="2">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            En Club
            <h2>{{estanciaNum}}</h2>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" xs="12" sm="6">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            Promedio Estancia Club
            <h2>{{promedioEstancia}}</h2>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title class="primary white--text d-flex justify-space-between">
        <h3>
          <v-icon large color="white mr-2">mdi-clock</v-icon>Reporte de accesos con salidas registrada {{$vuetify.breakpoint.md}} {{$vuetify.breakpoint.lg}}
        </h3>

        <v-btn @click="exportarExcel" depressed rounded color="white" class="success--text" v-if="$vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl">
          <v-icon class="mr-1">mdi-file-excel-outline</v-icon>Excel
        </v-btn>
        <v-btn @click="dialog=true" depressed rounded color="white" class="success--text" v-if="$vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl">
          <v-icon class="mr-1">mdi-chart-bar</v-icon>
          Graficas
        </v-btn>

        <v-btn @click="dialog_salida=true" depressed rounded color="white" class="success--text" v-if="$vuetify.breakpoint.md || $vuetify.breakpoint.lg || $vuetify.breakpoint.xl">
          <v-icon class="mr-1">mdi-location-exit</v-icon>
          Dar Salida
        </v-btn>

        <div class="d-flex">
          <v-menu
            v-model="menuFechaI"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fechaIF"
                label="Fecha Inicio"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="white"
                dark
                class="mr-5"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="fechaI" no-title @input="menuFechaI = false"></v-date-picker>
          </v-menu>

          <v-menu
            v-model="menuFechaF"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fechaFF"
                label="Fecha Fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                color="white"
                dark
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="fechaF" no-title @input="menuFechaI = false"></v-date-picker>
          </v-menu>

          <v-btn outlined color="white" @click="buscar">Buscar</v-btn>
        </div>
      </v-card-title>
       <div class="mt-1 d-flex justify-end"><span style="width:250px"><v-text-field   prepend-inner-icon="mdi-magnify" outlined dense  label="Buscar" v-model="search"></v-text-field></span></div>
      <v-data-table
        id="tabla"
        :headers="headersTabla"
        :items="itemsTabla"
        :items-per-page="10"
        :calculate-widths="true"
        class="elevation-2"
        :search="search"
      >
        <template v-slot:item.salida="{item}">
          <span v-if="item.salida">{{item.salida}}</span>
          <v-icon v-else color="red">mdi-close-circle</v-icon>
        </template>

        <template v-slot:item.estancia="{item}">
          <span v-if="item.salida">{{estanciaClub(item.estancia)}}</span>
          <v-icon v-else color="red">mdi-close-circle</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="()=>{dialog = false;tabs=null}">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Graficas de Entrada y Salida</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-toolbar-items> -->
            <v-btn dark icon @click="downloadImage"><v-icon>mdi-download</v-icon></v-btn>
          <!-- </v-toolbar-items> -->

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
          <v-tab-item value="tab-2" >
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartGenero"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-3" >
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
          <v-tab-item value="tab-5" >
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartEstancia"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-6" >
            <v-card flat>
              <v-card-text style="position: relative; height:85vh;">
                <canvas id="ChartEdad"></canvas>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_salida" width="500" persistent>
           <v-card>
             <v-card-title><v-icon class="mr-2" color="warning">mdi-alert</v-icon>Alert</v-card-title>
             <v-card-text>
               Desea realmente realizar la salida total de los usuarios en caso de si dar click en la opcion <b>[Aceptar]</b> en caso contrario dar click en la opcion <b>[cancelar]</b>            
             </v-card-text>
             <v-card-actions>
               <v-spacer></v-spacer>
               <v-btn color="info" @click="realizarSalidaCompleta">Aceptar</v-btn>
               <v-btn color="error" @click="dialog_salida=false">Cancelar</v-btn>
             </v-card-actions>
           </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref,watch,computed, onMounted ,getCurrentInstance} from 'vue';
import XLSX from "xlsx";
import Chart from "chart.js";
import {getReporteAccesoV2Service,getReporteAccesoV2ChartDiaService,getReporteAccesoV2ChartGeneroService,getReporteAccesoV2ChartDiaSemanaService,getReporteAccesoV2ChartHoraService,getReporteAccesoV2ChartEstanciaService,getReporteAccesoV2ChartEdadService,setSalidaCompletaService} from '@/services/reporte_acceso_service'

import { saveAs } from "file-saver";
import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
import isNaN from "lodash/isNaN";
import isNull from "lodash/isNull";
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

dayjs.extend(toObject);

  const root=getCurrentInstance().proxy


      const menuFechaI=ref(false) //Ventana de dias, fecha inicial
      const menuFechaF=ref(false) //Ventana de dias, fecha final
      const fechaI=ref("")//Fecha inicial en formato de BD
      const fechaIF=ref("")//Fecha inicial en formato de usuario
      const fechaF=ref("")//Fecha final en formato de BD
      const fechaFF=ref("")//Fecha inicial en formato de usuario
      const headersTabla= [
        { text: "# Acción", value: "accion" },
        { text: "Socio", value: "socio" },
        { text: "Nombre", value: "nombre" },
        { text: "Fecha", value: "fecha" },
        { text: "Entrada", value: "entrada" },
        { text: "Salida", value: "salida", align: "center" },
        { text: "Estancia Club", value: "estancia" },
      ]
      const itemsTabla=ref([])
      const dialog=ref( false)
      const tabs=ref( null)
      const ChartDia=ref( null)
      const ChartGenero=ref(null)
      const ChartDiaSemana=ref(null)
      const ChartHora=ref(null)
      const ChartEstancia=ref(null)
      const ChartEdad=ref(null)
      const search=ref('')
      const dialog_salida=ref(false)



        const entradaNum=computed(()=> {
      return itemsTabla.value.map((i) => i.accion).length;
    })
    const salidaNum=computed(()=> {
      return itemsTabla.value.map((i) => i.salida).filter((i) => i != null)
        .length;
    })
    const estanciaNum=computed(()=> {
      return itemsTabla.value.map((i) => i.salida).filter((i) => i == null)
        .length;
    })
    const promedioEstancia=computed(()=> {
      let conSalida = itemsTabla.value
        .filter((i) => i.salida != null)
        .map((i) => i.estancia[2]);
      let milisegundos =
        conSalida.reduce((red, val) => red + val, 0) / conSalida.length;

      if (isNaN(milisegundos)) return 0;
      else {
        let { hours, minutes } = dayjs(milisegundos).toObject();
        return hours - 18 + ":" + minutes;
      }
    })


     watch(fechaI,(val)=> {
      fechaIF.value = parseFechaInput(fechaI.value);
    })
    watch(fechaF,(val)=> {
      if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
    })
    watch(tabs,(newValue, oldValue)=> {
      if (isNull(oldValue) && newValue === "tab-1") getDataChartDia();
    })


onMounted(()=>{
    fechaI.value = new Date().toISOString().substr(0, 10);
    fechaF.value = new Date().toISOString().substr(0, 10);
    cargarTabla();
})

function buscar() {
      cargarTabla();
    }

    async function cargarTabla() {
      // axios
      //   .post(
      //     "/reporteAccesoSalidaController.php",
      //     qs.stringify({
      //       accion: 1,
      //       fechaI: fechaI.value,
      //       fechaF: fechaF.value,
      //     })
      //   )

      const data=await getReporteAccesoV2Service(fechaI.value,fechaF.value)
        // .then((res) => {
          itemsTabla.value = [];
          itemsTabla.value = data;
          itemsTabla.value.forEach((i) => {
            let milisegundos = dayjs(`${i.fecha}${i.salida}`).diff(
              dayjs(`${i.fecha}${i.entrada}`)
            );
            let { hours, minutes } = dayjs(milisegundos).toObject();
            // this.$set(i, "estancia", [hours - 18, minutes, milisegundos]);
            i.estancia=[hours - 18, minutes, milisegundos];
          });
        // })
        // .catch(function (res) {
        //   alert(res);
        // });
    }

    function exportarExcel() {
      let wb = new XLSX.utils.book_new();
      wb.SheetNames.push("Datos Entrada Salida");
      let encabezado = headersTabla.value.map((i) => i.text);

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
    //Convierte fecha en formato aaaa-mm-dd a dd/mm/aaaa
    function parseFechaInput(fecha) {
      if (!fecha) return null;
      const [anio, mes, dia] = fecha.split("-");
      return `${dia}/${mes}/${anio}`;
    }

    async function getDataChartDia() {
      // let { data } = await axios.post(
      //   "/reporteAccesoSalidaController.php",
      //   qs.stringify({
      //     accion: 2,
      //     fechaI: fechaI.value,
      //     fechaF: fechaF.value,
      //   })
      // );

      const data=await getReporteAccesoV2ChartDiaService(fechaI.value,fechaF.value)

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
      //   "/reporteAccesoSalidaController.php",
      //   qs.stringify({
      //     accion: 3,
      //     fechaI: fechaI.value,
      //     fechaF: fechaI.value,,
      //   })
      // );

      const data=await getReporteAccesoV2ChartGeneroService(fechaI.value,fechaI.value)

      console.log("data--->", data);

      let ctx = document.getElementById("ChartGenero");

      if (!isNull(ChartGenero.value)) {
        ChartGenero.value.destroy();
      }

      ChartGenero.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: data.map(i=>i.fecha),
          datasets: [
            {
              label: "Num Salidas Hombre",
              data: data.map(i=>i.con_salida_hombre),
              backgroundColor: [
                ...Integral6,
                ...Ion6,
                ...IonBoardroom6,
                ...Kilter6,
                ...Green6,
                ...Celestial6,
              ],
              stack:1
            },
            {
              label: "Num Salidas Mujer",
              data: data.map(i=>i.con_salida_mujer),
              backgroundColor: [
                //...Integral6,
                //...Ion6,
                //...IonBoardroom6,
                //...Kilter6,
                ...Green6,
                ...Celestial6,
              ],
              stack:1
            },
            {
              label: "Num Sin Salidas Hombre",
              data: data.map(i=>i.sin_salida_hombre),
              backgroundColor: [
                //...Integral6,
                //...Ion6,
                ...IonBoardroom6,
                ...Kilter6,
                ...Green6,
                ...Celestial6,
              ],
              stack:2
            },
            {
              label: "Num Sin Salidas Mujer",
              data: data.map(i=>i.sin_salida_mujer),
              backgroundColor: [
                //...Integral6,
                //...Ion6,
                //...IonBoardroom6,
                ...Kilter6,
                ...Green6,
                ...Celestial6,
              ],
              stack:2
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
            xAxes:[{stacked: true}]
          },
          responsive: true,
        },
      });
    }

    async function getDataChartDiaSemana() {

      // let { data } = await axios.post("/reporteAccesoSalidaController.php",
      //     qs.stringify({
      //       accion: 4,
      //       fechaI: fechaI.value,
      //       fechaF: fechaF.value,
      //     }))

          const data=await getReporteAccesoV2ChartDiaSemanaService(fechaI.value,fechaF.value)

      //let dias_semana=[{dia:1,text:'Domingo'},{dia:2,text:'Lunes'},{dia:3,text:'Martes'},{dia:4,text:'Miercoles'},{dia:5,text:'Juevez'},{dia:6,text:'Viernes'},{dia:7,text:'Sabado'}]
    
       console.log("data--->",data)

      let dom=data.find(i=>parseInt(i.dia_num)===1);
      let lun=data.find(i=>parseInt(i.dia_num)===2);
      let mar=data.find(i=>parseInt(i.dia_num)===3);
      let mie=data.find(i=>parseInt(i.dia_num)===4);
      let jue=data.find(i=>parseInt(i.dia_num)===5);
      let vie=data.find(i=>parseInt(i.dia_num)===6);
      let sab=data.find(i=>parseInt(i.dia_num)===7);

      let dias_semana=[
        `Domingo ${isUndefined(dom)?0:dom.total}`,
        `Lunes ${isUndefined(lun)?0:lun.total}`,
        `Martes ${isUndefined(mar)?0:mar.total}`,
        `Miercoles ${isUndefined(mie)?0:mie.total}`,
        `Jueves ${isUndefined(jue)?0:jue.total}`,
        `Viernes ${isUndefined(vie)?0:vie.total}`,
        `Sabado ${isUndefined(sab)?0:sab.total}`,
      ]

      let data_setUno=[
        isUndefined(dom)?0:dom.con_salida,
        isUndefined(lun)?0:lun.con_salida,
        isUndefined(mar)?0:mar.con_salida,
        isUndefined(mie)?0:mie.con_salida,
        isUndefined(jue)?0:jue.con_salida,
        isUndefined(vie)?0:vie.con_salida,
        isUndefined(sab)?0:sab.con_salida,
        ]

      let data_setDos=[
        isUndefined(dom)?0:dom.sin_salida,
        isUndefined(lun)?0:lun.sin_salida,
        isUndefined(mar)?0:mar.sin_salida,
        isUndefined(mie)?0:mie.sin_salida,
        isUndefined(jue)?0:jue.sin_salida,
        isUndefined(vie)?0:vie.sin_salida,
        isUndefined(sab)?0:sab.sin_salida,
        ]

    
      let ctx = document.getElementById("ChartDiaSemana");

      if (!isNull(ChartDiaSemana.value)) {ChartDiaSemana.value.destroy();}

      ChartDiaSemana.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: dias_semana,
          datasets: [
            {
              label: "Salidas registradas",
              data: data_setUno,
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
        },
         {
              label: "Salidas sin registro",
              data: data_setDos,
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
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

      // let { data:{entradas,salidas} } = await axios.post("/reporteAccesoSalidaController.php",
      //     qs.stringify({
      //       accion: 5,
      //       fechaI: fechaI.value,
      //       fechaF: fechaF.value,
      //     }))

          const {entradas,salidas}=await getReporteAccesoV2ChartHoraService(fechaI.value,fechaF.value)

       let data_horas= [...new Set([...entradas.map(i=>i.hora_dia),...salidas.map(i=>i.hora_dia)])].sort((a,b)=>a-b)
       let data_entradas= Array.from(data_horas,i=>isUndefined(entradas.find(ii=>ii.hora_dia==i))?{total:0}:entradas.find(ii=>ii.hora_dia==i)).map(i=>i.total)
       let data_salidas= Array.from(data_horas,i=>isUndefined(salidas.find(ii=>ii.hora_dia==i))?{total:0}:salidas.find(ii=>ii.hora_dia==i)).map(i=>i.total)

       let acumulador=0;
       let linexxx=Array.from(data_horas,(item,index)=>{
         if(isNull(data_entradas[index]) && index===0) acumulador= 0;
         else if(!isNull(data_entradas[index]) && index===0) acumulador= parseInt(data_entradas[index]);
         else {
           if(acumulador===0)acumulador=acumulador+parseInt(data_entradas[index])
           else acumulador=(acumulador+parseInt(data_entradas[index]))-parseInt(data_salidas[index-1]);
         }         
         return acumulador;
       })
    
      let ctx = document.getElementById("ChartHora");

      if (!isNull(ChartHora.value)) {ChartHora.value.destroy();}

      ChartHora.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: data_horas.map(i=>isNull(i)?'en club':`${i} horas`),
          datasets: [
            {
              type:'bar',
              label: "Entradas",
              data: data_entradas,
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
        },
        {
              type:'bar',
              label: "Salidas",
              data: data_salidas,
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
        },
        {
              type:'line',
              label: "permanencia",
              data: linexxx,
              borderColor:[...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6],
              fill:false,
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
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

      // let { data } = await axios.post("/reporteAccesoSalidaController.php",
      //     qs.stringify({
      //       accion: 6,
      //       fechaI: fechaI.value,
      //       fechaF: fechaF.value,
      //     }))      
          const data=await getReporteAccesoV2ChartEstanciaService(fechaI.value,fechaF.value)

       function labels_data(i){
           
           let data_l='';
           if(i.seconds===30)data_l+='En club'
           if(i.minutes===0 && i.hours===0 && i.seconds===0) data_l+='de 1 min a 29 min'
           if(i.minutes===30 && i.hours===0 && i.seconds===0) data_l+='de 30 min a 59 min'
           if(i.minutes===0 && i.hours>0 && i.seconds===0) data_l+=`de ${i.hours} hora a ${i.hours} hora 29 min`
           if(i.minutes===30 && i.hours>0 && i.seconds===0) data_l+=`de ${i.hours} hora 30 min a ${i.hours} hora 59 min`
          return data_l;
       }

      let data_horas=data.map(i=>dayjs(`${dayjs().format('YYYY-MM-DD')} ${i.estancia}`).toObject()).map(labels_data);

      
    
      let ctx = document.getElementById("ChartEstancia");

      if (!isNull(ChartEstancia.value)) {ChartEstancia.value.destroy();}

      ChartEstancia.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: data_horas,
          datasets: [
            {
              label: "Salidas registradas",
              data: data.map(i => i.total),
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
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

      // let { data } = await axios.post("/reporteAccesoSalidaController.php",
      //     qs.stringify({
      //       accion: 7,
      //       fechaI: fechaI.value,
      //       fechaF: fechaF.value,
      //     }))

          const data=await getReporteAccesoV2ChartEdadService(fechaI.value,fechaF.value)
    
       console.log("data--->",data)

      let rango_edad=[
        {edad1:0,edad2:5,text:'0-5'},
        {edad1:6,edad2:10,text:'6-10'},
        {edad1:11,edad2:15,text:'11-15'},
        {edad1:16,edad2:20,text:'16-20'},
        {edad1:21,edad2:25,text:'21-25'},
        {edad1:26,edad2:30,text:'26-30'},
        {edad1:31,edad2:35,text:'31-35'},
        {edad1:36,edad2:40,text:'36-40'},
        {edad1:41,edad2:45,text:'41-45'},
        {edad1:46,edad2:50,text:'46-50'},
        {edad1:51,edad2:55,text:'51-55'},
        {edad1:56,edad2:60,text:'56-60'},
        {edad1:61,edad2:65,text:'61-65'},
        {edad1:66,edad2:70,text:'66-70'},
        {edad1:71,edad2:75,text:'71-75'},
        {edad1:76,edad2:80,text:'76-80'},
        {edad1:81,edad2:85,text:'81-85'},
        {edad1:86,edad2:90,text:'86-90'},
        {edad1:91,edad2:95,text:'91-95'},
        {edad1:96,edad2:100,text:'96-100'},
        {edad1:101,edad2:105,text:'mas de 100'},
        ]

        let data_set=Array.from(rango_edad,i=>
        data.filter(ii=>parseInt(ii.edad)>=i.edad1 && parseInt(ii.edad)<=i.edad2)
        .map(i=>parseInt(i.total))
        .reduce((red,val)=>red+val,0))
        console.log(data_set)
    
      let ctx = document.getElementById("ChartEdad");

      if (!isNull(ChartEdad.value)) {ChartEdad.value.destroy();}

      ChartEdad.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: rango_edad.map(i=>i.text),
          datasets: [
            {
              label: "Acceso por edad",
              data: data_set,
              backgroundColor: [...Integral6,...Ion6,...IonBoardroom6,...Kilter6,...Green6,...Celestial6]
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
      let title=''

      if(tabs.value==='tab-1'){canvas = document.getElementById('ChartDia');title='EntradaSalidaPorDia.png'}
      if(tabs.value==='tab-2'){canvas = document.getElementById('ChartGenero');title='EntradaSalidaPorGenero.png'}
      if(tabs.value==='tab-3'){canvas = document.getElementById('ChartDiaSemana');title='EntradaSalidaPorDiaSemana.png'}
      if(tabs.value==='tab-4'){canvas = document.getElementById('ChartHora');title='EntradaSalidaPorHora.png'}
      if(tabs.value==='tab-5'){canvas = document.getElementById('ChartEstancia');title='EntradaSalidaPorEstancia.png'}
      if(tabs.value==='tab-6'){canvas = document.getElementById('ChartEdad');title='EntradaSalidaPorEdad.png'}

      canvas.toBlob(blob => saveAs(blob, title));
    }

    async function realizarSalidaCompleta(){
      // let {data,status}=await root->.$axios.get('reporte-acceso-salida')
      const data=await setSalidaCompletaService()
      dialog_salida.value=false
      cargarTabla()
    }


function estanciaClub(val) {
      let horaMostrar = "";
      let [hora, minutos, mili] = val;
      if (hora === 1) horaMostrar += "1 Hora";
      if (hora > 1) horaMostrar += `${hora} Horas`;
      if (hora > 0 && minutos === 1) horaMostrar += " y 1 Minuto";
      if (hora > 0 && minutos > 1) horaMostrar += ` y ${minutos} Minutos`;
      if (hora === 0 && minutos === 1) horaMostrar = "1 Minuto";
      if (hora === 0 && minutos > 1) horaMostrar = `${minutos} Minutos`;
      return horaMostrar;
    }



</script> 
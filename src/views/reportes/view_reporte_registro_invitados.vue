<template>
   <div>
      <v-card>
         <v-toolbar color="primary" flat>
            <v-toolbar-title class="white--text"> <h3> Reporte Registro Invitados</h3></v-toolbar-title>
            <v-spacer/>
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field solo v-model="date" hide-details class="shrink mr-5" label="Fecha Inicio Registro" prepend-inner-icon="mdi-calendar" readonly="readonly" v-bind="attrs" v-on="on"/>
              </template>
              <v-date-picker v-model="date" :max="date1" @input="menu = false"/>
            </v-menu>

            <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field solo v-model="date1" hide-details class="shrink mr-5" label="Fecha Fin Registro" prepend-inner-icon="mdi-calendar" readonly="readonly" v-bind="attrs" v-on="on"/>
              </template>
              <v-date-picker v-model="date1" :min="date" @input="menu1 = false"/>
            </v-menu>

            <v-btn class="mr-2" dark tile @click="()=>{getDataChartDia();getRegistros()}" large> 
              <v-icon class="mr-2"> mdi-magnify</v-icon> Buscar
            </v-btn>

            <v-btn dark tile @click="exportarReporteExcel" large> 
              <v-icon class="mr-2"> mdi-file-excel-box</v-icon> Exportar
            </v-btn>

            <template v-slot:extension>
               <v-tabs v-model="tab" fixed-tabs background-color="primary" slider-size="3">
                 <v-tabs-slider class="white"/>
                 <v-tab href="#tab-datos"> 
                  <v-icon class="mr-2"> mdi-file-chart</v-icon> <h2> Reporte</h2>
                 </v-tab>
                 <v-tab href="#tab-grafica"> 
                  <v-icon class="mr-2"> mdi-chart-bar</v-icon> 
                  <h2> Graficas</h2>
                 </v-tab>
               </v-tabs>
            </template>
         </v-toolbar>
         <v-tabs-items v-model="tab">
            <v-tab-item value="tab-datos">
              <v-data-table class="mt-5" :headers="headersRegistros" :items="lst_registros">
                <template v-slot:item.invitado="{item}">
                   {{item.nombre_invitado}} {{item.paterno_invitado}} {{item.materno_invitado}}
                </template>
                <template v-slot:item.periodo="{item}"> 
                  {{item.fecha_inicio}} #[v-icon mdi-arrow-left-right-bold] {{item.fecha_fin}}
                </template>
                <template v-slot:item.socio="{item}"> 
                  {{item.nombre}} {{item.paterno}} {{item.materno}}
                </template>
                <template v-slot:item.estatus="{item}">
                   {{item.estatus==1?"Vigente":"Inactivo"}}
                </template>
              </v-data-table>
            </v-tab-item>
            <v-tab-item value="tab-grafica" style="height: 80vh">
              <canvas id="ChartRegistroDi"/>
            </v-tab-item>
         </v-tabs-items>
      </v-card>

      
      <v-dialog v-model="dialog" persistent>
        <v-card>
          <v-card-title class="black white--text d-flex justify-space-between">
            <h2> Listado de Invitados del Dia {{ fDate(diaSelected) }}</h2>
            <v-btn color="success align-self-start" tile text elevation="0" @click="exportarExcel"> 
              <v-icon> mdi-file-excel</v-icon> Exportar Excel
            </v-btn>
            <v-btn icon color="error" @click="dialog=false">
              <v-icon> mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-data-table :headers="headers" :items="lst_invitados">
            <template v-slot:item.invitado="{ item }">
              <label> {{ item.nombre_invitado }} {{ item.paterno_invitado }} {{ item.materno_invitado }}</label>
            </template>
            <template v-slot:item.fecha_inicio="{ item }">
              <label> {{ fDate(item.fecha_inicio) }}</label>
            </template>
            <template v-slot:item.fecha_fin="{ item }">
              <label> {{ fDate(item.fecha_fin) }}</label>
            </template>
            <template v-slot:item.socio="{ item }">
               {{ item.nombre }} {{ item.apellido_paterno }} {{ item.apellido_materno }}
            </template>
            <template v-slot:item.idpago="{ item }">
              <v-btn v-if="item.idpago > 0" icon outlined color="success">
                <v-icon> mdi-check</v-icon>
              </v-btn>              
              <v-btn v-else icon outlined color="error"> 
                <v-icon> mdi-minus</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>
   </div>

</template>

<script setup>
  import {ref} from 'vue'
import XLSX from "xlsx";
import Chart from "chart.js";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import numeral from "numeral";
import isNull from "lodash/isNull";
import uniqBy from 'lodash/uniqBy'
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
import {reporteRegistroInvitadosService,reporteRegistroInvitadosChartDiaService,reporteRegistroInvitadosHistoricoService} from '@/services/invitados_service'


    const date=ref(null);
    const menu=ref(false)
    const menu1=ref(false)
    const date1=ref(null)
    const ChartRegistroDia=ref(null)
    const diaSelected=ref('')
    const dialog=ref(false)
    const headers=ref([
      { text: "Invitado", value: "invitado" },
      { text: "Fecha Inicio", value: "fecha_inicio" },
      { text: "Fecha Fin", value: "fecha_fin" },
      { text: "Accion Invita", value: "accion" },
      { text: "Socio", value: "socio" },
      { text: "Pago", value: "idpago" },
    ])
    const lst_invitados=ref([])
    const tab = ref(null)

    const headersRegistros=ref([
      {text:'Accion',value:'accion_invitado',class:'hea'},
      {text:'Posicion',value:'posicion_invitado',class:'hea'},
      {text:'Nombre Invitado',value:'invitado',class:'hea'},
      {text:'Fecha Registro',value:'fecha_registro',class:'hea'},
      {text:'Periodo',value:'periodo',class:'hea'},
      {text:'Costo',value:'total',class:'hea'},
      {text:'Folio',value:'folio',class:'hea'},
      {text:'Fecha Pago',value:'fecha_cobro',class:'hea'},
      {text:'Accion Invita',value:'accion',class:'hea'},
      {text:'Posicion Socio',value:'posicion',class:'hea'},
      {text:'Socio Invita',value:'socio',class:'hea'},
      {text:'Estatus',value:'estatus',class:'hea'},
    ])

    const lst_registros=ref([])

    async function getDataChartDia() {
      // let {data: { total_invitado, total_cargos, total_pagos }} = await axios.post(
      //   "/reporteRegistroInvitadosController.php",
      //   qs.stringify({ accion: 1, fechaInicio:date.value, fechaFin:date1.value })
      // );
      const {total_invitado, total_cargos, total_pagos}=await reporteRegistroInvitadosChartDiaService(date.value,date1.value)
      
      let dias_grafica=uniqBy([...total_invitado,...total_cargos,...total_pagos],'fecha_registro').map(i=>i.fecha_registro).sort((a,b)=> dayjs(a).isAfter(dayjs(b)))
      let total_invitado_data=dias_grafica.map(i=>isUndefined(total_invitado.find(j=>j.fecha_registro==i))?0:total_invitado.find(j=>j.fecha_registro==i).total)
      let total_cargos_data=dias_grafica.map(i=>isUndefined(total_cargos.find(j=>j.fecha_registro==i))?0:total_cargos.find(j=>j.fecha_registro==i).total_cargado)
      let total_pagos_data=dias_grafica.map(i=>isUndefined(total_pagos.find(j=>j.fecha_registro==i))?0:total_pagos.find(j=>j.fecha_registro==i).total_pagado)

      let ctx = document.getElementById("ChartRegistroDia");

      let backgroundColor = [
        ...Integral6,
        ...Ion6,
        ...IonBoardroom6,
        ...Kilter6,
        ...Green6,
        ...Celestial6,
      ];

      if (!isNull(ChartRegistroDia.value))ChartRegistroDia.value.destroy();

      ChartRegistroDia.value = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          //labels: total_invitado.map(i => `${dayjs(i.fecha_registro).format("DD/MM/YYYY")}`),
          labels:dias_grafica,
          datasets: [
            {
              scale: 1000,
              scaleSteps: 1000,
              label: "Invitados Registrados por dia",
              data: total_invitado_data,
              type: "bar",
              backgroundColor,
              order:1,
              yAxisID: "first-y-axis",
            },
            {
              label: "Total de Cargos",
              data: total_cargos_data.map(i=>parseFloat(i)/1000),
              type: "line",
              fill: false,
              backgroundColor: "orange",
              borderColor: "orange",
              yAxisID: "second-y-axis",
              spanGaps:true,
            },
            {
              label: "Total de Pagos",
              data: total_pagos_data.map(i=>parseFloat(i)/ 1000),
              type: "line",
              fill: false,
              backgroundColor: "#3f2727",
              borderColor: "#4bc0c0",//"#3f2727",
              yAxisID: "second-y-axis",
              spanGaps:true,
            },
          ],
        },

        options: {
          title: {
            display: true,
            text: "Reporte de Registro de Invitados",
          },
          tooltips: {
            enable: true,
            callbacks: {
              label(tooltipItem, data) {
                if (tooltipItem.datasetIndex === 0)
                  return `${tooltipItem.value} registro`;
                else
                  return `${numeral(tooltipItem.value * 1000).format("0,0")}`;
              },
            },
          },

          plugins: {
            datalabels: {
              formatter(value, context) {
                if (context.datasetIndex === 0) return `${value} invitados`;
                else return numeral(value * 1000).format("0,0");
              },
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
                id: "first-y-axis",
                type: "linear",
                ticks: { beginAtZero: true, suggestedMin: 50, stepSize: 5 },
              },
              {
                id: "second-y-axis",
                type: "linear",
                position: "right",
                ticks: {
                  beginAtZero: true,
                  suggestedMin: 100,
                  callback(value, index, values) {
                    return `${value} Mil`;
                  },
                },
              },
            ],
          },
          responsive: true,
          onClick:this.historico
        },
      });
    }

    async function historico(e, dataset) {
      if (dataset.length > 0) {
        let fechaRegistro = dataset
          .find(i => i._datasetIndex === 0)
          ._model.label.split("/")
          .reverse()
          .join("-");

        diaSelected.value = fechaRegistro;

        // let {data} = await axios.get("/reporteRegistroInvitadosController.php", {
        //   params: { accion: 2, fechaRegistro },
        // });
        const data=await reporteRegistroInvitadosHistoricoService(fechaRegistro)
        lst_invitados.value = data;
        dialog.value = true;
      }
    }

    async function getRegistros()
    {
      try {
        // let {data,status}= await axios.get("/reporteRegistroInvitadosController.php",{params:{ accion: 3, fechaInicio:date.value, fechaFin:date1.value }})
        const data=await reporteRegistroInvitadosService(date.value,date1.value)
         lst_registros.value=data
      } catch (error) {
        console.error(error)        
      }
    }

   function exportarExcel() {
      let wb = new XLSX.utils.book_new();
      wb.SheetNames.push("Datos Entrada Salida");
      let encabezado = headers.value.map((i) => i.text);

      let datos = lst_invitados.value.map((i) => [
        `${i.nombre_invitado } ${ i.paterno_invitado } ${ i.materno_invitado}`,
        i.fecha_inicio,
        i.fecha_fin,
        i.accion,
        `${ i.nombre } ${ i.apellido_paterno } ${ i.apellido_materno }`,
        i.idpago,
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
    
    
    function exportarReporteExcel() {
      let wb = new XLSX.utils.book_new();
      wb.SheetNames.push("Datos Entrada Salida");
      let encabezado = headersRegistros.value.map((i) => i.text);

      let datos = lst_registros.value.map((i) => [
        i.accion_invitado,
        i.posicion_invitado,
        `${i.nombre_invitado } ${ i.paterno_invitado } ${ i.materno_invitado}`,
        i.fecha_registro,
        `${i.fecha_inicio} a  ${i.fecha_fin}`,
        i.total,
        i.folio,
        i.fecha_cobro,
        i.accion,
        i.posicion,
        `${ i.nombre } ${ i.apellido_paterno } ${ i.apellido_materno }`,
        i.estatus==1?"Vigente":"Inactivo",
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

   
    function fDate(val) {return dayjs(val).format("DD/MM/YYYY")}
 
</script>

<style>

.hea{background-color: #757575;color: white!important;font-size: 16px!important;}

</style>
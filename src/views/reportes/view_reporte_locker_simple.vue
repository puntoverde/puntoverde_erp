<template>
  <div style="height: 100%">
    {{filtros}}

    <v-item-group multiple v-model="filtros">
    <v-row>
     <v-col cols="12" md="2" xs="12" sm="6" lg="2">
        <v-item v-slot="{ active, toggle }" :value="1">
        <v-card :color="active ? 'primary white--text' : ''"  @click="toggle">
          <v-card-title class="d-flex justify-space-between">
            <v-icon v-if="active" color="white">mdi-check-circle</v-icon>
            Total
            <h2>{{total}}</h2>
          </v-card-title>
        </v-card>
        </v-item>
      </v-col>

      <v-col cols="12" md="2" xs="12" sm="6" lg="2">
        <v-item v-slot="{ active, toggle }" :value="2">
        <v-card :color="active ? 'primary white--text' : ''"  @click="toggle">
          <v-card-title class="d-flex justify-space-between">
            <v-icon v-if="active" color="white">mdi-check-circle</v-icon>
            Del Club.
            <h2>{{club}}</h2>
          </v-card-title>
        </v-card>
        </v-item>
      </v-col>

      <v-col cols="12" md="2" xs="12" sm="6" lg="3">
        <v-item v-slot="{ active, toggle }" :value="3">
        <v-card :color="active ? 'primary white--text' : ''"  @click="toggle">
          <v-card-title class="d-flex justify-space-between">
            <v-icon v-if="active" color="white">mdi-check-circle</v-icon>
            Independientes
            <h2>{{independientes}}</h2>
          </v-card-title>
        </v-card>
        </v-item>
      </v-col>

      <v-col cols="12" md="2" xs="12" sm="6" lg="2">
        <v-item v-slot="{ active, toggle }" :value="4">
        <v-card :color="active ? 'primary white--text' : ''"  @click="toggle">
          <v-card-title class="d-flex justify-space-between">
            <v-icon v-if="active" color="white">mdi-check-circle</v-icon>
            Libres.
            <h2>{{libres}}</h2>
          </v-card-title>
        </v-card>
        </v-item>
      </v-col>

      <v-col cols="12" md="2" xs="12" sm="6" lg="3">
        <v-item v-slot="{ active, toggle }" :value="5">
        <v-card :color="active ? 'primary white--text' : ''"  @click="toggle">
          <v-card-title class="d-flex justify-space-between">
            <v-icon v-if="active" color="white">mdi-check-circle</v-icon>
            Ocupados.
            <h2>{{ocupados}}</h2>
          </v-card-title>
        </v-card>
        </v-item>
      </v-col>

   


    </v-row>
    </v-item-group>

    <v-card style="height: calc(100% - 85px)" elevation="10" class="success">
      
      <v-card-text style="height: 100%" class="py-0 px-1 grey">
        <v-row style="height: 100%">
       
          <v-col cols="12" lg="12" class="mt-x pt-0x">
            <v-sheet
              elevation="1"
              dark
              color="white"
              class="pa-0"
              style="height: 100%"
            >
            <v-toolbar dense class="d-flex justify-end"> 

               <v-select
            v-model="edificio"
            solo-inverted
            dense
            class="mx-2"
            hide-details
            placeholder="Ubicacion"
            :items="lst_edificio"
            item-value="cve_edificio"
            item-text="nombre"
            clearable
            style="max-width:300px"
          ></v-select>
              
              <v-btn @click="exportarExcel"> 
                <v-icon color="success">mdi-microsoft-excel</v-icon> Exportar
              </v-btn>
              
            </v-toolbar>
              <v-data-table light :headers="headers" :items="lst_lockers">
                <template v-slot:item.rentado="{ value }">
                  <v-chip v-if="value == 1" color="error" small>
                    <v-avatar left> 
                      <v-icon small>mdi-minus-circle</v-icon>
                    </v-avatar>
                    Ocupado</v-chip
                  >
                  <v-chip v-else color="success" small>
                    <v-avatar left>
                      <v-icon small>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                    Libre</v-chip
                  >
                </template>
              </v-data-table>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import isNull from "lodash/isNull";
import round from 'lodash/round'
import XLSX from "xlsx";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Integral6,
  Ion6,
  IonBoardroom6,
  Kilter6,
  Green6,
  Celestial6,
} from "chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office";
import { saveAs } from "file-saver";
import {getEdificioReporteLocker,getReporteLocker,getLockerTotales,getLockerTotalesFiltros} from '@/services/reporte_locker'



    //#region variables
    //filtros
    const edificio = ref();
    const renta=ref();
    const propietario=ref()
    const estado=ref()
    const lst_edificio = ref([]);
    const lst_lockers = ref([]);
    const headers = [
      { text: "Num Locker", value: "numero_locker" },
      { text: "Propietario", value: "propietario" },
      { text: "Estado", value: "estado" },
      { text: "Ubicacion", value: "ubicacion_nombre" },
      { text: "Rentado", value: "rentado" },
    ];

    const total=ref(0)
    const club=ref(0)
    const independientes=ref(0)
    const libres=ref(0)
    const ocupados=ref(0)

    const filtros=ref([])

    let ChartElement=null;
    //#endregion

    watch(filtros,(val)=>{
      console.log(val)
      getLockersTotalesFilters();
    })

    //#region metodos
    async function getEdificios() {
      console.log("get edificio");
      try {
        // let { data, status } = await $axios.get("reporte-lockers/edificios");
        const data=await getEdificioReporteLocker()
        lst_edificio.value = data;
      } catch (error) {
        console.log("get edificio error->", error);
      }
    }

    async function getLockers() {
      try {
        // let { data, status } = await $axios.get("reporte-lockers",{params:{ubicacion:edificio.value,renta:renta.value,propietario:propietario.value,estado:estado.value}});
        const data =await getReporteLocker(edificio.value,renta.value,propietario.value,estado.value)
        lst_lockers.value = data;
        getDataChart(data)
      } catch (error) {
        console.log("get edificio error->", error);
      }
    }

    function exportarExcel() {
      let wb = new XLSX.utils.book_new();
      wb.SheetNames.push("Lockers");
      let encabezado = headers.map((i) => i.text);

      let datos = lst_lockers.value.map((i) => [
        i.numero_locker,
        i.propietario,
        i.estado,
        i.ubicacion_nombre,
        i.rentado,
      ]);

      let ws_data = [encabezado].concat(datos); //a row with 2 columns
      let ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets["Lockers"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf); //create uint8array as viewer
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "reporte-lockers.xlsx"
      );
    }

    function getDataChart(datos) {
      let cienporciento=datos.length;

      let ocupado=round((datos.filter(i=>i.rentado>0).length*100)/cienporciento,2);
      let libre=round((datos.filter(i=>i.rentado==0).length*100)/cienporciento,2)

      let ctx = document.getElementById("Chart");

      if (!isNull(ChartElement)) {
        ChartElement.destroy();
      }

      ChartElement = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "doughnut",
        data: {
          labels: ['Ocupado','Libre'],
          datasets: [
            {
              label: "Estado de Lockers",
              data: [ocupado,libre],
              backgroundColor: [
                  '#00afa9','#f6ce3c'
              ],
            }
          ],
        },

        options: {
          plugins: {
            datalabels: {
              formatter(value,cnxt){
                  console.log(cnxt)
                  return `${value}%`;
              },
              font:{size:'30'},
              color:["rgb(255, 255, 255)","rgb(0, 0, 0)"],
              anchor: "center",
              align: "center",
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



    async function getLockersTotales() {
      try {
        // let { data, status } = await $axios.get("reporte-lockers/totales",{params:{filters:filtros.value}});
        const data=await getLockerTotales(filtros.value)
        total.value=data.total
        club.value=data.d_pv
        independientes.value=data.no_d_pv
        libres.value=data.libres
        ocupados.value=data.ocupados
        getDataChart(data)
      } catch (error) {
        console.log("get edificio error->", error);
      }
    }

    async function getLockersTotalesFilters() {
      try {
        // let { data, status } = await $axios.get("reporte-lockers/totales-filter",{params:{filters:filtros.value}});
        const data=await getLockerTotalesFiltros(filtros.value)
        lst_lockers.value = data.data;
        // getDataChart(data)
      } catch (error) {
        console.log("get edificio error->", error);
      }
    }

    //#endregion

    getEdificios();
    getLockersTotales()

  
</script>

<template>
  <div style="height: 100%">
    <v-card style="height: 100%" elevation="10">
      <v-card-title class="pa-1"
        ><v-sheet
          elevation="1"
          dark
          class="pa-3 d-flex"
          style="height: 100%; width: 100%"
        >
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
            dark
          ></v-select>
          <v-select
            v-model="renta"
            solo-inverted
            dense
            class="mx-2"
            hide-details
            placeholder="Estatus Renta"
            :items="[
              { text: 'Ocupados', value: '1' },
              { text: 'Libres', value: '0' },
            ]"
            clearable
          ></v-select>
          <v-select
            v-model="propietario"
            solo-inverted
            dense
            class="mx-2"
            hide-details
            placeholder="Propietario"
            :items="[
              { text: 'Punto Verde', value: '1' },
              { text: 'Independiente', value: '0' },
            ]"
            clearable
          ></v-select>
          <v-select
          v-model="estado"
            solo-inverted
            dense
            class="mx-2"
            hide-details
            placeholder="Estado"
            :items="[
              { text: 'Regularizado', value: 'REGULARIZADO' },
              { text: 'No Regularizado', value: 'NOREGULARIZADO' },
            ]"
            clearable
          ></v-select>
          <v-btn @click="getLockers"> <v-icon>mdi-magnify</v-icon>Buscar</v-btn>
        </v-sheet></v-card-title
      >
      <v-card-text style="height: calc(100% - 72px)" class="py-0 px-1">
        <v-row style="height: 100%">
          <v-col cols="12" lg="4" class="mt-0 pt-0 pr-1" style="height: 100%"
            ><v-sheet
              elevation="1"
              dark
              color="#eeeeee"
              class="pa-5"
              style="height: 100%"
              >
              <canvas id="Chart"></canvas>
              </v-sheet
            ></v-col
          >
          <v-col cols="12" lg="8" class="mt-0 pt-0 pl-1">
            <v-sheet
              elevation="1"
              dark
              color="white"
              class="pa-0"
              style="height: 100%"
            >
            <v-toolbar dense class="d-flex justify-end"> <v-btn @click="exportarExcel"> <v-icon color="success">mdi-microsoft-excel</v-icon> Exportar</v-btn></v-toolbar>
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

                <template v-slot:item.periodo="{item}">
                     {{item.periodo_inicio}} - {{item.periodo_fin}}
                </template>

                <template v-slot:item.pago="{item}">                  
                     Pago:{{numeral(item.total).format('$0,0.00')}} - Folio:{{item.folio}}
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
import { defineComponent, onMounted, ref} from 'vue';
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
import numeral from 'numeral'
import {getEdificioReporteLocker,getReporteLocker} from '@/services/reporte_locker'


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
      { text: "Propietario", value: "propietario_nombre" },
      { text: "Estado", value: "estado" },
      { text: "Periodo", value:"periodo"},
      { text: "Pago", value:"pago"},
      { text: "Ubicacion", value: "ubicacion_nombre" },
      { text: "Rentado", value: "rentado" },
    ];

    let ChartElement=null;
    //#endregion

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
        const data=await getReporteLocker(edificio.value,renta.value,propietario.value,estado.value)
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

    //#endregion

    getEdificios();

  
</script>

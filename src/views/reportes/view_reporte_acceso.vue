<template>
  <div>
    <h1 class="title">Reporte de accesos</h1>
    <v-row justify="center">
      <span>Tipo de Reporte</span>
      <v-radio-group row v-model="tipoReporte">
        <v-radio label="Normal" :value="1"></v-radio>
        <v-radio label="Dias del mes" :value="4"></v-radio>
        <v-radio label="Por rango de horas" :value="5"></v-radio>
        <v-radio label="Accion Administrativa" :value="6"></v-radio>
      </v-radio-group>
    </v-row>

    <v-row justify="center" v-if="tipoReporte==4">
      <v-col lg="4">
        <v-select
          label="Selecciona un dia"
          :items="itemsDias"
          item-text="txt"
          item-value="val"
          v-model="nombreDia"
        ></v-select>
      </v-col>
    </v-row>

    <v-row justify="center" v-if="tipoReporte==5">
      <v-col lg="4">
        <v-select
          label="Selecciona un rango de horas"
          :items="itemsHoras"
          item-text="txt"
          item-value="val"
          v-model="rangoHoras"
        ></v-select>
      </v-col>
    </v-row>

    <template v-if="tipoReporte==1 || tipoReporte==5 || tipoReporte==6">
         
      <v-row justify="center">
        <v-col lg="3">
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
            <v-date-picker locale="es-mx" v-model="fechaI" no-title @input="menuFechaI = false"></v-date-picker>
          </v-menu>
        </v-col>
        <template v-if="fechaIF != ''">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on" @click="limpiarFechas(1)">mdi-window-close</v-icon>
            </template>
            <span>Quitar fecha inicial</span>
          </v-tooltip>
        </template>

        <!-- Hora de inicio -->
        <v-col lg="3" v-if="tipoReporte==1||tipoReporte==6">
          <v-dialog ref="dialog" v-model="modalTi" persistent full-width width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="horaI"
                label="Hora Inicial"
                prepend-icon="mdi-clock"
                readonly
                v-on="on"
                :disabled="todoElDia"
              ></v-text-field>
            </template>
            <v-time-picker v-if="modalTi" v-model="horaI" full-width :disabled="todoElDia">
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="modalTi = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="aber()">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-tooltip bottom v-if="horaI != ''">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="horaI=''">mdi-window-close</v-icon>
          </template>
          <span>Quitar hora inicial</span>
        </v-tooltip>
      </v-row>
      <v-row justify="center">
        <v-col lg="3">
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
                :disabled="(soloDia && todoElDia) || soloDia"
                v-validate="'min:10|max:10'"
                data-vv-name="fecha final"
                v-mask="'##/##/####'"
                :error="errors.has('fecha final')"
                :error-messages="errors.first('fecha final')"
              ></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="fechaF" no-title @input="menuFechaF = false"></v-date-picker>
          </v-menu>
        </v-col>
        <!-- Muestra  el icono cuando se escribe en el input, o se selecciona la fecha del menu -->
        <v-tooltip bottom v-if="fechaFF!=''">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="limpiarFechas(2)">mdi-window-close</v-icon>
          </template>
          <span>Quitar fecha final</span>
        </v-tooltip>
        <v-col lg="3" v-if="tipoReporte==1||tipoReporte==6">
          <v-dialog ref="dialog" v-model="modalTf" persistent full-width width="290px">
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="horaF"
                label="Hora Final"
                prepend-icon="mdi-clock"
                readonly
                v-on="on"
                :disabled="(soloDia && todoElDia) || todoElDia"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="modalTf"
              v-model="horaF"
              full-width
              :disabled="(soloDia && todoElDia) || todoElDia"
            >
              <div class="flex-grow-1"></div>
              <v-btn text color="primary" @click="modalTf = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="aber()">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-tooltip bottom v-if="horaF != ''">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="horaF=''">mdi-window-close</v-icon>
          </template>
          <span>Quitar hora final</span>
        </v-tooltip>
      </v-row>
      <v-row justify="center" v-if="tipoReporte==1||tipoReporte==6">
        <v-col offset-lgxxx="1" lg="3">
          <v-switch v-model="soloDia" label="Solo un día" @change="switchSoloDia()"></v-switch>
        </v-col>
        <v-col lg="3">
          <v-switch v-model="todoElDia" label="Todo el día" @change="switchTodoElDia()"></v-switch>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="tipoReporte==1">
        <v-col lg="4">
          <v-text-field
            @keyup.enter="cargarTabla()"
            @keyup="checkAccionCompuesta()"
            v-model="noAccion"
            label="Numero de Acción"
            prepend-icon="mdi-format-list-numbered"
          ></v-text-field>
        </v-col>
        <v-col v-if="noAccion <= 150&&noAccion!=''" lg="1">
          <v-select
            @change="cargarTabla()"
            ref="slcClasificacion"
            v-model="clasificacion"
            label="Clasificacion"
            :items="itemsClasificacion"
            item-text="txt"
            item-value="val"
          ></v-select>
        </v-col>
        <v-tooltip bottom v-if="noAccion != '' || clasificacion != ''">
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="noAccion='', clasificacion=''">mdi-window-close</v-icon>
          </template>
          <span>Quitar número de acción</span>
        </v-tooltip>
      </v-row>
    </template>
    <v-row justify="center">
      <!-- <v-col offset-lg="4" lg="2"> -->
      <v-btn class="white--text" color="blue" @click="cargarTabla()">Actualizar</v-btn>
    </v-row>
    <br />

    <v-btn @click="exportar()">
      Exportar
      <v-icon color="success">mdi-file-excel</v-icon>
    </v-btn>
    <v-btn @click="cargarGrafica()">
      Grafica
      <v-icon color="blue">mdi-chart-bar</v-icon>
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
        <label v-if="item.tipo == '1' || item.tipo =='2'">Entrada</label>
        <label v-else>Salida</label>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogGrafica" width="850" height="400" :disabled="graficaDisabled">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Grafica de Accesos</v-card-title>
        <v-card-text>
          <div>
            <h2 id="anclaGrafico">{{tituloGrafica}}</h2>
            <v-row justify="center">
              <v-radio-group
                @change="cargarGrafica()"
                label="Ver grafica por:"
                row
                v-model="tipoGrafica"
              >
                <v-radio :value="3" label="Edades"></v-radio>
                <v-radio :value="2" label="Genero"></v-radio>
              </v-radio-group>
            </v-row>
            <v-row justify="center">
              <div id="containerGrafo">
                <canvas id="myChart"></canvas>
              </div>
            </v-row>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialogGrafica = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref,watch,onMounted } from "vue";
import XLSX from "xlsx";
import Chart from "chart.js";
import {getReporteAccesoService,getReporteAccesoGraficaService} from '@/services/reporte_acceso_service'




      const menuFechaI=ref(false) //Ventana de dias, fecha inicial
      const menuFechaF=ref(false) //Ventana de dias, fecha final
      const fechaI=ref("") //Fecha inicial en formato de BD
      const fechaIF=ref("") //Fecha inicial en formato de usuario
      const horaI=ref("") //Hora inicial
      const horaItemp=ref("") //Hora inicial temporal, se almacena cuando se usa el switch de todo el dia
      const fechaF=ref("") //Fecha final en formato de BD
      const fechaFF=ref("") //Fecha inicial en formato de usuario
      const fechaFtemp=ref("") //Fecha final temporal, se almacena cuando se usa el switch de solo un dia
      const horaF=ref("") //Hora final
      const horaFtemp=ref("") //Hora final temporal, se almacena cuando se usa el switch de todo el dia
      const noAccion=ref("")
      const clasificacion=ref("")
      const soloDia=ref(false)
      const todoElDia=ref(false)
      const modalTi=ref(false) //Modal de picker de hora inicial
      const modalTf=ref(false) //Modal de picker de hora final
      const formatoFechaI=ref(false) //Para saber si fue asignada la fecha con formato de BD al momento de buscar
      const formatoFechaF=ref(false) //Para saber si fue asignada la fecha con formato de BD al momento de buscar
      const tituloGrafica=ref("")
      const tipoGrafica=ref(3)
      const tipoReporte=ref(1)
      const graficaDisabled=ref(false)
      const dialogGrafica=ref(false)

      const textoFiltros=ref("Mas filtros")
      const mostrarFiltros=ref(false)

      const nombreDia=ref("")
      const rangoHoras=ref("")

      const headersTabla= [
        { text: "Fecha", value: "fecha" },
        { text: "# Acción", value: "accion" },
        { text: "Socio", value: "socio" },
        { text: "Nombre", value: "nombre" },
        { text: "Típo", value: "tipo" }
      ]
      const headersTabla2= [
        { text: "Fecha", value: "fecha" },
        { text: "Numero de Accesos", value: "num" }
      ]
      const headersTabla3= [
        { text: "Fecha", value: "fecha" },
        { text: "Nombre", value: "nombre" },
        { text: "Típo", value: "tipo" }
      ]
      const headersTablaDefault= [
        { text: "Fecha", value: "fecha" },
        { text: "# Acción", value: "accion" },
        { text: "Socio", value: "socio" },
        { text: "Nombre", value: "nombre" },
        { text: "Típo", value: "tipo" }
      ]
      const itemsClasificacion= [
        { txt: "A", val: 1 },
        { txt: "B", val: 2 },
        { txt: "C", val: 3 }
      ]
      const itemsDias= [
        { txt: "Lunes", val: "Monday" },
        { txt: "Martes", val: "Tuesday" },
        { txt: "Miercoles", val: "Wednesday" },
        { txt: "Jueves", val: "Thursday" },
        { txt: "Viernes", val: "Friday" },
        { txt: "Sabado", val: "Saturday" },
        { txt: "Domingo", val: "Sunday" }
      ]
      const itemsHoras= [
        { txt: "5:00 a 11:59", val: "05:00:00,11:59:59" },
        { txt: "12:00 a 15:59", val: "12:00:00,15:59:59" },
        { txt: "16:00 a 22:00", val: "16:00:00,22:00:59" }
      ]
      const itemsTabla=ref([])


      watch(fechaI,(val)=> {
      if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
    })
    watch(fechaF,(val) =>{
      if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
    })
    watch(tipoReporte,(val)=> {
      console.log(val);
      if (val == 1) graficaDisabled.value = false;
      else graficaDisabled.value = true;
    })

onMounted(()=>cargarTabla())

    function aber() {
      modalTi.value = false;
      modalTf.value = false;
    }
    function switchSoloDia() {
      if (soloDia.value) {
        fechaFtemp.value = fechaFF.value;
        fechaFF.value = "";
      } else fechaFF.value = fechaFtemp.value;
    }
    function switchTodoElDia() {
      if (todoElDia.value) {
        horaItemp.value = horaI.value;
        horaFtemp.value = horaF.value;
        horaI.value = "";
        horaF.value = "";
      } else {
        horaI.value = horaItemp.value;
        horaF.value = horaFtemp.value;
      }
      // this.cargarTabla();
    }
    async function cargarTabla() {
      // this.$validator.validate().then(valid => {
        // if (valid) {
          switch (tipoReporte.value) {
            case 1:
              itemsTabla.value = [];
              headersTabla.value = headersTablaDefault.value;
              break;
            case 4:
              itemsTabla.value = [];
              headersTabla.value = headersTabla2.value;
              break;
            case 5:
              itemsTabla.value = [];
              headersTabla.value = headersTabla2.value;
              break;
            case 6:
              itemsTabla.value = [];
              headersTabla.value = headersTabla3.value;
              break;
          }
          // axios
          //   .post(
          //     "/reporteAccesoController.php",
          //     qs.stringify({
          //       accion:         tipoReporte.value,
          //       dia:            soloDia.value,
          //       fechaI:         fechaIF.value,
          //       fechaF:         fechaFF.value,
          //       horaI:          horaI.value,
          //       horaF:          horaF.value,
          //       noAccion:       noAccion.value,
          //       clasificacion:  clasificacion.value,
          //       nombreDia:      nombreDia.value,
          //       rangoHoras:     rangoHoras.value
          //     })
          //   )
          //   .then(res => {
          //     // console.log(typeof this.tipoReporte);
          //     itemsTabla.value = [];
          //     itemsTabla.value = res.data;
          //   })
          //   .catch(function(res) {
          //     alert(res);
          //   });

           itemsTabla.value=await getReporteAccesoService(tipoReporte.value,soloDia.value,fechaIF.value,fechaFF.value,horaI.value,horaF.value,noAccion.value,clasificacion.value,nombreDia.value,rangoHoras.value)




        // }
      // });
    }
    
    function checkAccionCompuesta() {
      if (noAccion.value > 150) clasificacion.value = "";
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
    
    async function cargarGrafica() {
      dialogGrafica.value = true;
      // var acc;
      // switch(tipo)
      // {
      //     case 2:
      //         acc = 2;
      //         break;
      //     case 3:
      //         acc = 3;
      //         break;
      // }
      // axios
      //   .post(
      //     "/reporteAccesoController.php",
      //     qs.stringify({
      //       accion:         tipoGrafica.value,
      //       dia:            soloDia.value,
      //       fechaI:         fechaIF.value,
      //       fechaF:         fechaFF.value,
      //       horaI:          horaI.value,
      //       horaF:          horaF.value,
      //       noAccion:       noAccion.value,
      //       clasificacion:  clasificacion.value
      //     })
      //   )
      //   .then(res => {

        const data=await getReporteAccesoGraficaService(tipoGrafica.value,soloDia.value,fechaIF.value,horaI.value,horaF.value,noAccion.value,clasificacion.value)
          var dss = [];
          if (tipoGrafica.value == 3) {
            //Arrays para un solo conjuento de datos
            var arrayVal = [];
            var arrayLabels = [];
            var arrayColores = [];
            var arrayColoresBordes = [];
            arrayVal.push(data[0].r0_5);
            arrayVal.push(data[0].r6_10);
            arrayVal.push(data[0].r11_15);
            arrayVal.push(data[0].r16_20);
            arrayVal.push(data[0].r21_25);
            arrayVal.push(data[0].r26_30);
            arrayVal.push(data[0].r31_35);
            arrayVal.push(data[0].r36_40);
            arrayVal.push(data[0].r41_45);
            arrayVal.push(data[0].r46_50);
            arrayVal.push(data[0].r51_55);
            arrayVal.push(data[0].r56_60);
            arrayVal.push(data[0].r61_65);
            arrayVal.push(data[0].r66_70);
            arrayVal.push(data[0].r71_75);
            arrayVal.push(data[0].r76_80);
            arrayVal.push(data[0].r81_85);
            arrayVal.push(data[0].r86_90);
            arrayVal.push(data[0].r91_95);
            arrayVal.push(data[0].r96_100);
            arrayVal.push(data[0].r101_x);
            arrayLabels.push("0 - 5");
            arrayLabels.push("6 - 10");
            arrayLabels.push("11 - 15");
            arrayLabels.push("16 - 20");
            arrayLabels.push("21 - 25");
            arrayLabels.push("26 - 30");
            arrayLabels.push("31 - 35");
            arrayLabels.push("36 - 40");
            arrayLabels.push("41 - 45");
            arrayLabels.push("46 - 50");
            arrayLabels.push("51 - 55");
            arrayLabels.push("56 - 60");
            arrayLabels.push("61 - 65");
            arrayLabels.push("66 - 70");
            arrayLabels.push("71 - 75");
            arrayLabels.push("76 - 80");
            arrayLabels.push("81 - 85");
            arrayLabels.push("86 - 90");
            arrayLabels.push("91 - 95");
            arrayLabels.push("96 - 100");
            arrayLabels.push("mas de 100");
            for (let index = 0; index <= 20; index++) {
              var color =
                "rgba(" +
                getRandomInt(0, 256) +
                ", " +
                getRandomInt(0, 256) +
                ", " +
                getRandomInt(0, 256);
              arrayColores.push(color + ", 0.2)");
              arrayColoresBordes.push(color + ", 1)");
            }
            dss.push({
              label: "Accesos",
              data: arrayVal,
              backgroundColor: arrayColores,
              borderColor: arrayColoresBordes,
              borderWidth: 1
            });
          } else if (tipoGrafica.value == 2) {
            //Arrays para dos conjuntos de datos(genero)
            tituloGrafica.value = "Grafica de accesos por genero";
            var arrayVal = [];
            var arrayVal2 = [];
            var arrayLabels = [];
            arrayVal.push(data[0].h);
            arrayVal2.push(data[0].m);
            arrayLabels.push("Accesos");
            dss.push({
              label: "Mujeres",
              data: arrayVal2,
              backgroundColor: "rgba(255, 0, 50, 0.2)",
              borderColor: "rgba(255, 0, 20, 1)",
              borderWidth: 1
            });
            dss.push({
              label: "Hombres",
              data: arrayVal,
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              borderColor: "rgba(0, 0, 255, 1)",
              borderWidth: 1
            });
          }

          document.getElementById("myChart").remove();
          document.getElementById("containerGrafo").innerHTML =
            '<canvas id="myChart" width="800" height="600"></canvas>';
          const ctx = document.getElementById("myChart");
          const myChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: arrayLabels,
              datasets: dss
            },
            options: {
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            }
          });
        // })
        // .catch(function(res) {
        //   alert(res);
        // });
    }
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
    function exportar() {
      // var wb = XLSX.utils.book_new();

      // var ws_name = "Sheet";
      // var ws_data = this.itemsTabla;
      // var ws = XLSX.utils.json_to_sheet(ws_data);
      // XLSX.utils.book_append_sheet(wb, ws, ws_name);

      var tbl = document.getElementById("tabla");
      var wb = XLSX.utils.table_to_book(tbl);
      XLSX.writeFile(wb, "aaa.xlsb");
    }
</script> 
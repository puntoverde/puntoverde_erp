<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
              Espacios deportivos:{{calcularTiempo}} {{fduracion(calcularTiempo)}}
              <div style="width:200px">
                 <v-select :items="itemEspaciosDeportivos" label="Espacios Deportivos" item-text="nombre" item-value="cve_espacio_deportivo" v-model="cve_espacio_deportivo"></v-select>     
              </div>
          </v-card-title>           
        </v-card>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title class="primary white--text d-flex justify-space-between">
        <h3>
          <v-icon large color="white mr-2">mdi-bike</v-icon>Reporte de citas por equipos
        </h3>

        <v-btn @click="exportarExcel"> Excel</v-btn>

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

      <v-data-table
        id="tabla"
        :headers="headersTabla"
        :items="ctabla"
        :items-per-page="10"
        :calculate-widths="true"
        class="elevation-2"
      >
        <template v-slot:item.salida="{item}">
          <span v-if="item.salida">{{item.salida}}</span>
          <v-icon v-else color="red">mdi-close-circle</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref,watch,computed, onMounted } from 'vue';
import XLSX from "xlsx";
import Chart from "chart.js";
import {getReporteApartadoEspaciosDeportivosService,getReporteApartadoEquipoService} from '@/services/apartados_services'
import {saveAs} from 'file-saver'


      const menuFechaI=ref(false) //Ventana de dias, fecha inicial
      const menuFechaF=ref(false) //Ventana de dias, fecha final
      const fechaI=ref("")//Fecha inicial en formato de BD
      const fechaIF=ref("")//Fecha inicial en formato de usuario
      const fechaF=ref("")//Fecha final en formato de BD
      const fechaFF=ref("")//Fecha inicial en formato de usuario
      const headersTabla=[
        { text: "Equipo", value: "nombre" },
        { text: "Fecha de cita", value: "fecha_registro" },
        { text: "Apartado inicio", value: "inicio" },
        { text: "Apartado final", value: "fin" },
        { text: "Duración", value: "duracion" },
        { text: "Acción", value: "accion", align: "center" },
        { text: "Nombre", value: "persona", align: "center" },
        
      ]
      const itemsTabla=ref([])
      const itemEspaciosDeportivos=ref([])
      const cve_espacio_deportivo=ref(0)

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
    const ctabla=computed(()=>{
      if(cve_espacio_deportivo.value == 0){
        return itemsTabla.value;
      }
      else{
      return itemsTabla.value.filter((i)=>i.cve_espacio_deportivo==cve_espacio_deportivo.value);
      } 
    })
    const calcularTiempo=computed(()=>{
       if(cve_espacio_deportivo.value == 0){
        return itemsTabla.value.map((i)=>parseInt(i.duracion)).reduce((acumulador,i)=>acumulador+i,0);
      }
      else{
        return itemsTabla.value.filter((i)=>i.cve_espacio_deportivo==cve_espacio_deportivo.value).map((i)=>parseInt(i.duracion)).reduce((acumulador,i)=>acumulador+i,0);
      }
      //console.log(array1.reduce(reducer));
    })


    watch(fechaI,(val) =>{
      fechaIF.value = parseFechaInput(fechaI.value);
    })
    watch(fechaF,(val)=> {
      if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
    })


onMounted(()=>{
listaEspacioDeportivo();
   fechaI.value = new Date().toISOString().substr(0, 10);
    fechaF.value = new Date().toISOString().substr(0, 10);
    cargarTabla();
})


        function buscar() {
      cargarTabla();
    }
    
    async function listaEspacioDeportivo(){
      // axios
      //   .post(
      //      "/reporteApartadoEquipoController.php",
      //      qs.stringify({
      //      accion: 2,
      //      })
      //   ).then (function(res){   
      //     let inicio =res.data;
      //     inicio.unshift({cve_espacio_deportivo:0,nombre:"Todos"})      
      //     itemEspaciosDeportivos.value = inicio  ;
      //   }).catch(function(error){
      //     console.log(error);
      //   })
      const inicio=await getReporteApartadoEspaciosDeportivosService()
      inicio.unshift({cve_espacio_deportivo:0,nombre:"Todos"})      
      itemEspaciosDeportivos.value = inicio  ;
    }

    async function cargarTabla() {
      // axios
      //   .post(
      //     "/reporteApartadoEquipoController.php",
      //     qs.stringify({
      //       accion: 1,
      //       fechaI: fechaI.value,
      //       fechaF: fechaF.value,
      //     })
      //   )
      //   .then((res) => {
      //     itemsTabla.value = [];
      //     itemsTabla.value = res.data;
      //   })
      //   .catch(function (res) {
      //     alert(res);
      //   });
      itemsTabla.value=await getReporteApartadoEquipoService(fechaI.value,fechaF.value)
    }

    function exportarExcel(){
      let wb=new XLSX.utils.book_new();
      wb.SheetNames.push("Datos Entrada Salida")
      let encabezado=headersTabla.value.map(i=>i.text);
      
      let datos=itemsTabla.value.map(i=>[i.accion,i.socio,i.nombre,i.fecha,i.entrada,i.salida]);

      let ws_data = [encabezado].concat(datos);  //a row with 2 columns
      let ws = XLSX.utils.aoa_to_sheet(ws_data);
      wb.Sheets["Datos Entrada Salida"] = ws;

      let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

          function s2ab(s) { 
                    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
                    var view = new Uint8Array(buf);  //create uint8array as viewer
                    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
                    return buf;    
    }

    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');

    }
    //Convierte fecha en formato aaaa-mm-dd a dd/mm/aaaa
    function parseFechaInput(fecha) {
      if (!fecha) return null;
      const [anio, mes, dia] = fecha.split("-");
      return `${dia}/${mes}/${anio}`;
    }

     function fduracion(variable){  
      if(variable == 0){
        return `Sin datos`
      }    
      else{
        return `Estas son las horas ${variable/60} Horas Aquí hay`;
      }
    }
</script> 
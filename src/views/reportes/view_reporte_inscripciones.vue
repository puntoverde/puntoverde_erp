<template>
     <v-card color="primary">        
      <v-toolbar color="secondary" >        
        <label class="text-h5 white--text font-weight-bold"
          >Reporte Inscripciones</label
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="BuscarData"
          color="primary"
          style="background-color: white"
          class="font-weight-bold mr-2"
          rounded
          outlined
          :loading="load_search"
          ><v-icon class="mr-2">mdi-magnify</v-icon> Buscar</v-btn
        > 
        <v-btn
          @click="exportPDF"
          color="red"
          style="background-color: white"
          class="font-weight-bold mr-2"
          rounded
          outlined
          :loading="load_search"
          ><v-icon class="mr-2">mdi-file-pdf-box</v-icon> PDF</v-btn
        > 
        <v-btn
          @click="exportExcel"
          color="green"
          style="background-color: white"
          class="font-weight-bold mr-2"
          rounded
          outlined
          :loading="load_search"
          ><v-icon class="mr-2">mdi-microsoft-excel</v-icon> Excel</v-btn
        >       
        <template v-slot:extension>
          <v-row>           
            <v-col>
              <v-select  
                v-model="cuota"             
                label="Cuotas de Inscripcion"
                solo-inverted
                dark
                dense
                hide-details
                :items="lst_cuotas"
                item-value="cve_cuota"
                item-text="cuota"
              ></v-select>
            </v-col>
            <v-col>
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                :nudge-right="40"
                offset-y
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dayjs(filter_fecha_incio).format('DD/MM/YYYY')"
                    label="Fecha Inicio"
                    solo-inverted
                    dark
                    dense
                    hide-details
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-on="on"
                    v-bind="attrs"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filter_fecha_incio"
                  locale="es-MX"
                  color="primary"
                  header-color="secondary"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition"
                :nudge-right="40"
                offset-y
                max-width="290">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dayjs(filter_fecha_final).format('DD/MM/YYYY')"
                    label="Fecha Fin"
                    solo-inverted
                    dark
                    dense
                    hide-details
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-on="on"
                    v-bind="attrs"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filter_fecha_final"
                  locale="es-MX"
                  color="primary"
                  header-color="secondary"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>          
          </v-row>
        </template>
      </v-toolbar>
      <div class="primary" style="height: 5px"></div>
      <v-data-table :headers="headers2" :items="lst_inscripciones">

              <template v-slot:item.folio="{ value }">            
                <span class="font-weight-bold" v-if="value"
                  >{{ value}}</span
                >
                <span v-else class="font-weight-bold red--text">NA</span>
              </template>

              <template v-slot:item.fecha_hora_cobro="{ value }">
                <span v-if="value"
                  >{{ value}}</span
                >
                <span v-else class="font-weight-bold red--text">NA</span>
              </template>

              <template v-slot:item.periodo="{ value }">
                <v-chip color="primary" class="font-weight-bold">
                  {{ value }}
                </v-chip>
              </template>              
            </v-data-table>
     </v-card>
</template>

<script setup>
import { defineComponent, ref ,getCurrentInstance} from 'vue'
import dayjs from 'dayjs'
import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from 'file-saver';
import {getReinscripcionesService,getCuotasReinscripcionServices} from '@/services/reporte_inscripcion_service'


      const root=getCurrentInstance().proxy

        const $axios = root.$axiosFinanzas;

        const menu1=ref(false)
        const menu2=ref(false)


        const cuota=ref()
        const filter_fecha_final=ref('')
        const filter_fecha_incio=ref('')

        const lst_cuotas=ref([])
        const lst_inscripciones=ref([])

        const load_search=ref(false)

         const headers2 = [
      { text: "Folio", value: "folio", class: "secondary white--text" },
      {
        text: "Nombre",
        value: "nombre",
        class: "secondary white--text",
      },
      {
        text: "Genero",
        value: "genero",
        class: "secondary white--text",
      },    
      {
        text: "edad",
        value: "edad",
        class: "secondary white--text",
      },
      {
        text: "accion",
        value: "accion",
        class: "secondary white--text",
      },
      {
        text: "fecha cargo",
        value: "fecha_cargo",
        class: "secondary white--text",
      },
      { text: "fecha pago", value: "fecha_hora_cobro", class: "secondary white--text" },
      { text: "Periodo", value: "periodo", class: "secondary white--text" },
      { text: "Socio", value: "usuario", class: "secondary white--text" },
    ];

        async function BuscarData(){
          //  let {data,status}=await $axios.get('reporte-inscripcion',{params:{cuota:cuota.value,fecha_inicio:filter_fecha_incio.value,fecha_fin:filter_fecha_final.value}})
          const data=await getReinscripcionesService(cuota.value,filter_fecha_incio.value,filter_fecha_final.value)
           lst_inscripciones.value=data
        }

        async function getCuotasInscripcion(){
          //  let {data,status}=await $axios.get('reporte-inscripcion/cuotas')
          const data=await getCuotasReinscripcionServices()
           lst_cuotas.value=data
        }

        function exportExcel(){
             let wb = XLSX.utils.book_new();
      wb.SheetNames.push("inscripciones");
      let ws_data1 = lst_inscripciones.value.map(item => [
        item.folio,
        item.nombre,
        item.genero,
        item.edad,
        item.accion,
        item.fecha_cargo,
        item.fecha_hora_cobro,
        item.periodo,
        item.usuario,
        item.concepto,
        item.concepto_actual]);
      
      let ws_data=_.concat([['Folio','Nombre','Genero','Edad','Accion','Fecha inscripcion','Fecha pago inscripcion'
      ,'Periodo','Usuario','Concepto','Concepto al dia']],ws_data1);

      
      let ws = XLSX.utils.aoa_to_sheet(ws_data, {origin: "B2"});

      wb.Sheets["inscripciones"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), `reporte_incripcion${dayjs().format("YYYMMDDHHmmss")}.xlsx`);

        }

        async function exportPDF(){

           const pdf = new jsPDF();   
           
    let imagen = await import("@/assets/punto_verde2.png");

    let img = new Image();
    img.src = imagen;
    
    let imagen_promise = await new Promise((resolve, reject) => {
          img.onload = function () {
            let canvas = document.createElement("CANVAS");
            let ctx = canvas.getContext("2d");
            let dataURL;
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL();
            resolve(dataURL);
          };
        });

          pdf.addImage(imagen_promise, 5, 1, 25, 25);
      
      pdf.setFontSize(25);
      pdf.text("Club Deportivo Punto Verde de León", 105, 10, null, null, "center");
      pdf.setFontSize(18);
      pdf.text(`Reporte Inscripciones`, 100, 18, null, null, "center");
      pdf.setFontSize(10);
      pdf.text(`Perido del ${filter_fecha_incio.value} al ${filter_fecha_final.value}`, 100, 25, null, null, "center");
      pdf.text(dayjs().format('DD-MM-YYYY'), 185, 25, null, null, "left");
      let bandera = 0;
      pdf.autoTable({
        theme: "grid",
        margin: { left: 5, right: 5,top:30 },
        headStyles: { fillColor: [115, 115, 115], cellWidth: "wrap" },
        bodyStyles:{fontSize:8},
        footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0]},
        columnStyles: {
          // total: { fillColor: [115, 115, 115], textColor: [255, 255, 255] }
          descripcion:{overflow:'ellipsize',cellWidth:70}
        },
        showHead:'firstPage',
        showFoot:'lastPage',
         
        columns: [ 
          { header: "Folio", dataKey: "folio"},
          { header: "Nombre", dataKey: "nombre" },
          { header: "Genero", dataKey: "genero" },
          { header: "Edad", dataKey: "edad" },
          { header: "Accion", dataKey: "accion" },
          { header: "Fecha Inscripcion", dataKey: "fecha_inscripcion" },
          { header: "Fecha pago", dataKey: "fecha_pago" },
          { header: "Periodo", dataKey: "periodo" },
          { header: "Usuario", dataKey: "usuario" },
        ],
        body: this.lst_inscripciones.map(item => ({
          folio: item.folio,
          nombre: item.nombre,
          genero: item.genero,
          edad:item.edad,
          accion:item.accion,
          fecha_inscripcion:item.fecha_cargo,
          fecha_pago: item.fecha_hora_cobro,
          periodo: item.periodo,
          usuario: item.usuario                    
        })),       
      });

      pdf.save(`reporte_inscripciones${dayjs().format("YYYYMMDDHHmmss")}.pdf`);

        }

        getCuotasInscripcion()

     
</script>
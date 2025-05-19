<template>
  <v-card>
      <v-card-title class="primary white--text d-flex justify-space-between">
        <h3>
          <v-icon large color="white mr-2">mdi-currency-usd</v-icon>Comercial Cancelados
        </h3>

        
        

        <div class="d-flex">
          <v-menu
            v-model="menuInicio"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fechaInicioFormat"
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
            <v-date-picker locale="es-mx" v-model="fechaInicio" no-title @input="menuInicio = false"></v-date-picker>
          </v-menu>

          <v-menu
            v-model="menuFin"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fechaFinFormat"
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
            <v-date-picker locale="es-mx" v-model="fechaFin" no-title @input="menuFin = false"></v-date-picker>
          </v-menu>

          <v-btn outlined color="white" @click="llenarTabla">Buscar</v-btn>
        </div>
      </v-card-title>
       <div class="mt-1 d-flex justify-end"><span style="width:250px"><v-text-field   prepend-inner-icon="mdi-magnify" outlined dense  label="Buscar" v-model="search"></v-text-field></span></div>


        <v-data-table :headers="headersTabla" :items="bodyTable">
    </v-data-table>


    </v-card>
</template>

<script setup>

import dayjs from "dayjs";
import {computed, ref,getCurrentInstance} from 'vue';
import {getReporteFacturaCanceladaService} from '@/services/factura_service'


    const root=getCurrentInstance().proxy

            const $axios=root.$axiosFinanzas;
            const menuInicio = ref(false);
            const fechaInicio = ref(dayjs().format("YYYY-MM-DD"))
            const menuFin = ref(false);
            const fechaFin = ref(dayjs().format("YYYY-MM-DD"))
            const fechaInicioFormat = computed(()=>dayjs(fechaInicio.value).format("DD/MM/YYYY"))
            const fechaFinFormat = computed(()=>dayjs(fechaFin.value).format("DD/MM/YYYY"))

            const search=ref('')

            const bodyTable = ref([]);
            const headersTabla=[   
                {text:"Número Accion", value:"accion"},
                {text:"Folio", value:"folio"},             
                {text:"Folio Comercial", value:"folio_compaq"},
                {text:"Metodo de Pago", value:"metodo_pago"},
                {text:"Uso CFDI", value:"uso_cfdi"},                
                {text:"Forma Pago", value:"forma_pago"},
                {text:"Fecha Factura", value:"fecha_factura"},
                {text:"Forma Cancelación", value:"fecha_cancelacion"},
                {text:"Error Contpaq", value:"mensaje_error_compaq"},
                {text:"Motivo Cancelación", value:"motivo"},
                {text:"Persona Cancela", value:"personaCancela"},
                
                ]
           
           async function llenarTabla(){
             let fecha_inicio=fechaInicio.value;
             let fecha_fin=fechaFin.value;
            //  let {data, status}=await $axios.get("/reporte-factura-cancelada/reporteFacturaCancelada",{params:{fecha_inicio,fecha_fin}})
            const data=await getReporteFacturaCanceladaService(fecha_inicio,fecha_fin)
             
              // if (status===200){
                bodyTable.value=data;
                // }
                
                 
           }

    
</script>

<style>

</style>
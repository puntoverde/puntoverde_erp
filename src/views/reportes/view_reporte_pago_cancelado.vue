<template>
  <div>
       
       <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Pagos Cancelados</h1>
    </div>

    <div class="d-flex justify-end mb-5">      

      <Search v-model="search" :filters="filters" @emit-buscar="llenarTabla">
         
         <template v-slot:fecha_inicio="{data}">
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
                :value="dayjs(data.value).isValid()?dayjs(data.value).format('DD-MMM-YYYY'):''"
                label="Fecha Inicio"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"                                         
                hide-details
                filled
              ></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="data.value" no-title @input="menuInicio = false"></v-date-picker>
          </v-menu>

         </template>

         <template v-slot:fecha_fin="{data}">
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
                :value="dayjs(data.value).isValid()?dayjs(data.value).format('DD-MMM-YYYY'):''"
                label="Fecha Fin"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"               
                hide-details
                filled
              ></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="data.value" no-title @input="menuFin = false"></v-date-picker>
          </v-menu>
         </template>


      </Search>
    </div>    


        <v-data-table :headers="headersTabla" :items="bodyTable" :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer>
       <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select
            v-model="itemsPerPage"
            dense
            hide-details
            style="max-width: 50px"
            :items="[5, 10, 50]"
          />
          <span class="mx-2 text-caption"
            >pagina {{ pagination.page }} de {{ pagination.pageCount }}</span
          >
          <v-pagination
            circle
            :total-visible="0"
            v-model="page"
            :length="pagination.pageCount"
          ></v-pagination>
        </div>
      </template>      

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>
        
        <template v-slot:item.folio="{value}">
        <span class="font-weight-bold">{{value}}</span>
      </template>

      <template v-slot:item.total="{value}">
        {{numeral(value).format('$0,0.[00]')}}
      </template>

      <template v-slot:item.fecha_hora_cobro="{value}">
        {{dayjs(value).format('DD-MMM-YYYY HH:mm')}}
      </template>

      <template v-slot:item.fecha_cancelacion="{value}">
        {{dayjs(value).format('DD-MMM-YYYY HH:mm')}}
      </template>

    </v-data-table>


    </div>
</template>

<script setup>

import {computed, ref,getCurrentInstance} from 'vue';
import dayjs from "dayjs";
import numeral from 'numeral'
import {getReportePagosCanceladosService} from '@/services/reporte_pagos_service'
    
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
                {text:"Total", value:"total"},
                {text:"Fecha Cobro", value:"fecha_hora_cobro"},
                {text:"Motivo", value:"motivo"},                
                {text:"Persona", value:"personaCancela"},
                {text:"Fecha Cancelación", value:"fecha_cancelacion"},
                
                ]

                 const page = ref(1);
const itemsPerPage = ref(10);

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

const filters = ref([
  { label: "Fecha inicio", key: "fecha_inicio", value: "", type: "date" },
  { label: "Fecha fin", key: "fecha_fin", value: "", type: "date" },
]);
           
           
           async function llenarTabla(filtros={}){
            //  let {data, status}=await $axios.get("/cancelar-pago/reportePagoCancelado",{params:filtros})
            const data=await getReportePagosCanceladosService(filtros)
              // if (status===200){
                bodyTable.value=data;
                // }
                
                 
           }

   
</script>

<style>

</style>
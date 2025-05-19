<template>
<div>

  <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Descuentos Cancelados</h1>
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


    </v-data-table>
</div>


</template>

<script setup>

import dayjs from "dayjs";
import {computed, ref} from 'vue';
import {getReporteDescuentoCanceladoService} from '@/services/descuento_service'

    

          
            const menuInicio = ref(false);        
            const menuFin = ref(false);

            const search=ref('')

            const bodyTable = ref([]);
            const headersTabla=[   
                {text:"Número Accion", value:"numero_accion"},
                {text:"Clasificación", value:"clasificacion"},
                {text:"Concepto", value:"concepto"},             
                {text:"Periodo", value:"periodo"},
                {text:"Monto", value:"monto"},
                {text:"Motivo", value:"motivoDescuento"},
                {text:"Fecha Cancelación", value:"fecha_eliminacion"},
                {text:"Persona", value:"personaElimina"},
                
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
           
           async function llenarTabla(options={}){
            
            //  let {data, status}=await $axios.get("/descuento/reporte",{params:options})
            const data=await getReporteDescuentoCanceladoService(options)
             
                bodyTable.value=data;
               
                
                 
           }

       
</script>

<style>

</style>
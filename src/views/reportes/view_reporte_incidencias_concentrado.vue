<template>
<div>

  <v-overlay v-model="overlay">
 <div class="d-flex">
   <v-progress-circular
      indeterminate
      color="white"
    ></v-progress-circular>
   <h3 class="ml-5">cargando</h3>
 </div>
  </v-overlay>
    <div class="d-flex justify-space-between align-end mb-5 redx">
    
      
      
        <h1 class="accent--text oswald--text">Reporte concentrado de incidencias</h1>

        <Search v-model="search" :filters="filters" @emit-buscar="fnReporteConcentradoIncidencias" >

          <template v-slot:producto="{data}">
             <v-autocomplete  v-model="data.value" :search-input.sync="search_autocomplete"  :items="cLstProducto" filled hide-details></v-autocomplete>
            </template>

          <template v-slot:proveedor="{data}">
             <v-autocomplete  v-model="data.value" :search-input.sync="search_autocomplete_proveedor"  :items="cLstProveedor" filled hide-details></v-autocomplete>
            </template>

            <template v-slot:departamento="{data}">
                <v-select v-model="data.value" :items="lst_departamentos" item-value="id_departamento" item-text="nombre" filled hide-details></v-select>
            </template>

            <template v-slot:subcategoria="{data}">
                <v-select v-model="data.value" :items="lst_subcategorias" item-value="id_subcategoria_producto_pv" item-text="nombre" filled hide-details></v-select>
            </template>

        </Search>
      
        
    </div>

    <v-data-table
      :headers="headers"
      :items="lst_productos"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">

            <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :outlined="attrs['aria-expanded'] == 'true'"
            color="primary"
            v-on="on"
            v-bind="attrs"
            fab
            small
            dark
            elevation="1"
            @click="exportar"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span>Descargar Reporte</span>
      </v-tooltip> -->


          <div class="d-flex align-center">
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
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:item.nombre="{ item }">    
        
        <span>{{item.nombre}}</span>
        <span class="font-weight-bold mx-1">{{item.apellido_paterno}}</span>
        <span class="font-italic">{{item.apellido_materno}}</span>
      </template>     
      
      <template v-slot:item.prima_dominical="{ value,item }">    
         
         <span v-if="value>0">
         
           {{item.horas_prima_dominical}}/{{value}}

         </span>

         <span v-else>
0
         </span>

        
      </template>     


    </v-data-table>
  </div>

</template>

<script setup>

import {onMounted, ref} from 'vue'
import {reporteIncidenciasConcentradoService,reporteIncidenciasConcentradoDepartamentosService} from '@/services/incidencias_service'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import concat from 'lodash/concat'

const lst_requisicion_producto=ref([])

const headers = [
  { text: "Numero Colaborador", align: "center", sortable: true, value: "nomina" },
  { text: "Nombre Colaborador", value: "nombre" },
  { text: "Departamento", value: "departamento" },
  { text: "Tolerancias", value: "tolerancia" },  
  { text: "Retardo menor", value: "retardo_menor" },
  { text: "Retardo mayor", value: "retardo_mayor", align: "center" },
  { text: "Faltas", value: "faltas", align: "center" },
  { text: "Dia asueto", value: "dias_asueto", align: "center" },
  { text: "Prima dominical hr/dias", value: "prima_dominical", align: "center" },
  { text: "Vacaciones", value: "vacaciones", align: "center" },
  { text: "Permisos", value: "permisos", align: "center" },
  { text: "Incidencias", value: "incidencias", align: "center" },
  { text: "Observacion", value: "Observaciones" },  
];

const search = ref("");
const overlay=ref(false)

const lst_productos=ref([])
const lst_departamentos=ref([])

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
  { label: "Departamento", key: "departamento"},
  { label: "Fecha pedido inicio", key: "fecha_inicio", value: "", type: "date" },
  { label: "Fecha pedido fin", key: "fecha_fin", value: "", type: "date" }, 
]);
      
      
      onMounted(()=>{
        fnGetDepartamentos()
      })

async function fnReporteConcentradoIncidencias(filter={})
{
  overlay.value=true
try {
  lst_productos.value=await reporteIncidenciasConcentradoService(filter)
} catch (error) {
    console.log(error)
}
finally{overlay.value=false}
}

async function fnGetDepartamentos(){

try {
  const data=await reporteIncidenciasConcentradoDepartamentosService()
  lst_departamentos.value= [{id_departamento:"0",nombre:"Todos"},...data]
} catch (error) {
  
}

}

function exportar() {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("reporte_entradas");
      let ws_data1 = lst_requisicion_producto.value.map(item => [
        item.folio,
        item.fecha_pedido,
        item.nombre_comercial,
        
        item.cambio==1?`${item.tipo.split('|')[0]==1?'producto':'servicio'}|${item.tipo.split('|')[1]==1?'producto':'servicio'}`:item.tipo==1?'producto':'servicio',
        item.clave,

        item.producto_name,
        item.cantidad_solicitada,
        item.cantidad_entregada,
        item.categoria,
        item.subcategoria,       
        item.costo,       
        item.descuento,       
        item.estatus_producto       
      ]);

      let ws_data=concat([['Folio pedido','Fecha pedido','Proveedor','Tipo producto',
      'Clave','Producto','Cantidad solicitada','Cantidad ingresa','Categoria','Subcategoria','Costo','descuento','estatus']],ws_data1);



      console.log(ws_data)
      let ws = XLSX.utils.aoa_to_sheet(ws_data, {origin: "B2"});

      wb.Sheets["reporte_entradas"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'reporte_entradas_amacen.xlsx');

    }

</script>
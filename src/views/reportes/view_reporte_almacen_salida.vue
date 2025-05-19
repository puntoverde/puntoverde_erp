<template>
<div>
    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Catalogo Salidas Almacen</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
        &nbsp;
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
            @click=""
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip> -->

      <Search v-model="search" :filters="filters" @emit-buscar="getAlmacenSalidaReporte" >

       

        </Search>
    </div>

    <v-data-table
      :headers="headers"
      :items="lst_almacen_entradas"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-space-between align-center">

            <v-tooltip bottom>
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
      </v-tooltip>


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

      <template v-slot:item.solicita="{ item }">
        {{ item.nombre }} {{ item.apellido_paterno }} {{ item.apellido_materno }}
      </template>

      <!-- <template v-slot:item.tipo_cuota="{ item }">
        <span v-if="item.tipo_cuota == 1">Persona</span>
        <span v-else>Accion</span>
      </template>

      <template v-slot:item.precio="{ item }">
        <span class="font-weight-black accent--text number--text">
          {{numeral(item.precio).format("$0,0.[00]")}}
        </span>
      </template>

      <template v-slot:item.opcion_iva="{ item }">
        <span v-if="item.opcion_iva == 1">Iva Incluido</span>
        <span v-else>Mas Iva</span>
      </template>

      <template v-slot:item.genero_aplica="{ item }">
        <v-icon v-if="item.genero_aplica === 'H'">mdi-human-male</v-icon>
        <v-icon v-else-if="item.genero_aplica === 'M'">mdi-human-female</v-icon>
        <v-icon v-else>mdi-human-male-female</v-icon>
      </template>

      <template v-slot:item.edad_aplica="{ item }">
        {{ item.edad_aplica == 0 ? "NA" : `${item.edad_aplica} Años` }}
      </template>

      <template v-slot:item.obligatoria="{ item }">
        <span class="font-weight-bold" :class="{'primary--text':item.obligatoria,'secondary--text':!item.obligatoria}">{{item.obligatoria?'SI':'NO'}}</span>
      </template>

      <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              x-small
              icon
              outlined
              color="secondary"
              fab
              @click="editar_cuota(item.cve_cuota)"
              ><v-icon>mdi-square-edit-outline</v-icon></v-btn
            >
          </template>
          <span>Editar Cuota</span>
        </v-tooltip>
      </template> -->
    </v-data-table>
  </div>

</template>

<script setup>

import {ref} from 'vue'
import {getSalidaAlmacenReporteService} from '@/services/reporte_almacen_service'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import concat from 'lodash/concat'

const lst_almacen_entradas=ref([])

const headers = [
  { text: "Folio salida", align: "center", sortable: true, value: "id_almacen_salida" },
  { text: "Fecha salida", value: "fecha_salida" },
  { text: "Solicito", value: "solicita" },
  { text: "Area solicita", align: "right", value: "espacio_fisico_name" },
  { text: "Clave producto", value: "clave", align: "center" },
  { text: "Producto", value: "producto_name" },
  { text: "Cantidad salida", align: "center", value: "cantidad" },
  { text: "Numero de piezas", align: "center", value: "piezas" },
];

const search = ref("");

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
  { label: "Cartegoria", key: "categoria", value: "", type: "select" },
  { label: "Subcategoria", key: "subcategoria", value: "", type: "select" },
  { label: "Clave producto", key: "clave", value: "", type: "text" }, 
  { label: "Area solicita", key: "area", value: "", type: "select" },
  { label: "Area destino", key: "area_destino", value: "", type: "select" },
]);


      
             

async function getAlmacenSalidaReporte(filter={})
{
try {
    lst_almacen_entradas.value=await getSalidaAlmacenReporteService(filter)
} catch (error) {
    console.log(error)
}
}


function exportar() {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("reporte_entradas");
      let ws_data1 = lst_almacen_entradas.value.map(item => [
        item.folio,
        item.fecha_solicitud,
        item.solicita,
        
        item.area_departamento,
        item.area_destino,
        item.nombre_comercial,
        item.producto_clave,

        item.producto_servicio,
        item.cantidad,
        item.costo,
        item.fecha_entrega       
      ]);

      console.log(ws_data1)



      let ws_data=concat([['Folio','Fecha requisicion','Persona solicita','Area solicita',
      'Area destino','Proveedor','Clave','Producto','Cantidad','Costo','Fecha entrada']],ws_data1);

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
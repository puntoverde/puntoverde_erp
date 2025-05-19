<template>
<div>
    <div class="d-flex justify-space-between align-end mb-5 redx">
    
      
      
        <h1 class="accent--text oswald--text">Reporte produto requisicion revision</h1>

        <Search v-model="search" :filters="filters" @emit-buscar="reporteProductoRequisicion" >

          <template v-slot:producto="{data}">
             <v-autocomplete  v-model="data.value" :search-input.sync="search_autocomplete"  :items="cLstProducto" filled hide-details></v-autocomplete>
            </template>

          <template v-slot:proveedor="{data}">
             <v-autocomplete  v-model="data.value" :search-input.sync="search_autocomplete_proveedor"  :items="cLstProveedor" filled hide-details></v-autocomplete>
            </template>

            <template v-slot:categoria="{data}">
                <v-select v-model="data.value" :items="lst_categorias" item-value="id_categoria_pv" item-text="nombre" filled hide-details></v-select>
            </template>

            <!-- <template v-slot:subcategoria="{data}">
                <v-select v-model="data.value" :items="lst_subcategorias" item-value="id_subcategoria_producto_pv" item-text="nombre" filled hide-details></v-select>
            </template> -->

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

      <template v-slot:item.categoria="{ item }">    
        <span class="font-weight-bold accent--text">{{ item.categoria_name }}</span> / <span class="font-italic">{{ item.subcategoria_name }}</span>
        
      </template>     


    </v-data-table>
  </div>

</template>

<script setup>

import {onMounted, ref} from 'vue'
import {reporteProductoRequisicionRevisonService} from '@/services/producto_service'
import {allCategoriaProducto} from '@/services/categoria_producto_service'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import concat from 'lodash/concat'

const lst_requisicion_producto=ref([])

const headers = [
  { text: "Codigo producto", align: "center", sortable: true, value: "clave" },
  { text: "Producto", value: "nombre" },
  { text: "Categoria", value: "categoria" },  
  { text: "Cantidad pedida", value: "cantidad_pedida" },
  { text: "Cantidad recibida", value: "cantidad_recibida" },

];

const search = ref("");

const lst_productos=ref([])
const lst_categorias=ref([])

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
  { label: "Fecha pedido inicio", key: "fecha_inicio", value: "", type: "date" },
  { label: "Fecha pedido fin", key: "fecha_fin", value: "", type: "date" }, 
  { label: "Categoria", key: "categoria", value: "", type: "select" }, 
]);

onMounted(()=>getCategoria())
          

async function reporteProductoRequisicion(filter={})
{
try {
  lst_productos.value=await reporteProductoRequisicionRevisonService(filter)
} catch (error) {
    console.log(error)
}
}

async function getCategoria()
{
  try {
    lst_categorias.value=await allCategoriaProducto()
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
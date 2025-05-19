<template>
<div>
    <div class="d-flex justify-space-between mb-5 redx">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->

      <div class="redx d-flex" style="gap:10px">
      
    
      <v-card class="rounded-xl" height="100">
        <v-card-title class="d-flex justify-space-around primary--text py-2">
          Total Pedidos
        </v-card-title>
        <v-card-text class="d-flex justify-space-around mt-2">
           <h1>{{ total_requisicion }}</h1>
        </v-card-text>
      </v-card>
   

    
      <v-card class="rounded-xl d-flex flex-row bluex " height="105" width="350" >
        <div class="redx d-flex justify-center align-center font-weight-bold primary--text text-h6" style="writing-mode:vertical-rl;transform:rotate(180deg);width:50px">
          Categoria
        </div>
        <!-- <div class="blue" style="width:100%"> -->
        <v-list dense class="py-0 rounded-xl overflow-y-auto" style="width:81%" >
          <v-list-item v-for="cate in total_producto_categoria" style="height:35px">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">{{cate.categoria}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action><v-chip label><h4>{{cate.size}}</h4></v-chip></v-list-item-action>
          </v-list-item>
        </v-list>
      <!-- </div> -->
      </v-card>
    
    
    
      <!-- <v-card class="rounded-xl d-flex flex-row bluex " height="105" width="350" >
        <div class="redx d-flex justify-center align-center font-weight-bold primary--text text-h6" style="writing-mode:vertical-rl;transform:rotate(180deg);width:20px">
          Area
        </div>
        <div class="redx d-flex justify-center align-center font-weight-bold primary--text text-h6" style="writing-mode:vertical-rl;transform:rotate(180deg);width:20px">
          Destino
        </div>
        <v-list dense class="py-0 rounded-xl overflow-y-auto" style="width:81%" >
          <v-list-item v-for="cate in total_area_destino" style="height:35px">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">{{cate.area_destino}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action><v-chip label><h4>{{cate.size}}</h4></v-chip></v-list-item-action>
          </v-list-item>
        </v-list>
     
      </v-card> -->

  </div>
      
      <div class="d-flex flex-column" style="row-gap:10px">
        <h1 class="accent--text oswald--text">Catalogo Pedido</h1>

        <Search v-model="search" :filters="filters" @emit-buscar="getRequisicionReporte" >

          <template v-slot:producto="{data}">
             <v-autocomplete  v-model="data.value" :search-input.sync="search_autocomplete"  :items="cLstProducto" filled hide-details></v-autocomplete>
            </template>

          <template v-slot:proveedor="{data}">
             <v-autocomplete  v-model="data.value" :search-input.sync="search_autocomplete_proveedor"  :items="cLstProveedor" filled hide-details></v-autocomplete>
            </template>

            <template v-slot:categoria="{data}">
                <v-select v-model="data.value" @change="getSubCategoria(data.value)" :items="lst_categorias" item-value="id_categoria_pv" item-text="nombre" filled hide-details></v-select>
            </template>

            <template v-slot:subcategoria="{data}">
                <v-select v-model="data.value" :items="lst_subcategorias" item-value="id_subcategoria_producto_pv" item-text="nombre" filled hide-details></v-select>
            </template>

        </Search>
      </div>
        
    </div>

    <v-data-table
      :headers="headers"
      :items="lst_requisicion_producto"
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

      <template v-slot:item.tipo="{ item }">    
        <span v-if="item.cambio==0">
          <span v-if="item.tipo == 1" class="font-weight-black accent--text">Producto</span>
          <span v-else class="font-weight-bold accent--text">Servicio</span>
        </span>
              <div v-else class="d-flex flex-column">
                 <span v-for="(item2,index) in item.tipo.split('|')" :class="{'black--text yellow rounded':index==1}">                  
                      <span v-if="item2 == 1" class="font-weight-black accent--text">Producto</span>
                      <span v-else class="font-weight-bold accent--text">Servicio</span>
                 </span>
              </div>
        
      </template>

      <template v-slot:item.clave="{item}">           
              <span v-if="item.cambio==0">{{item.clave}}</span>
              <div v-else class="d-flex flex-column">
                 <span v-for="(item,index) in item.clave.split('|')" :class="{'black--text yellow rounded':index==1}">
                      {{item}}
                 </span>
              </div>           
      </template>

      <template v-slot:item.producto_name="{item}">           
              <span v-if="item.cambio==0">{{item.producto_name}}</span>
              <div v-else class="d-flex flex-column">
                 <span v-for="(item,index) in item.producto_name.split('|')" :class="{'black--text yellow rounded':index==1}">
                      {{item}}
                 </span>
              </div>           
      </template>

      <template v-slot:item.categoria="{item}">           
              <div v-if="item.cambio==0">
                <span class="font-weight-bold accent--text">{{item.categoria}}</span> / <span class="accent--text">{{item.subcategoria}}</span>
              </div>
              <div v-else class="d-flex flex-column">
                 <span v-for="(item2,index) in item.categoria.split('|')" :class="{'black--text yellow rounded':index==1}">
                  <span class="font-weight-bold accent--text">{{item2}}</span> / <span class="accent--text">{{item.subcategoria.split('|')[index]}}</span>
                 </span>
              </div>           
      </template>

      <template v-slot:item.costo="{ value }">
        <span class="font-weight-bold accent--text number--textx">
          {{numeral(value).format("$0,0.[00]")}}
        </span>
      </template>

      <template v-slot:item.descuento="{ value }">
        <span class="font-weight-bold accent--text number--textx">
          {{numeral(value).format("$0,0.[00]")}}
        </span>
      </template>

      <template v-slot:item.id_pedido_almacen_revision_pv="{ value }">
        {{value>0?'revisado':'en curso'}}
      </template>
      
      <template v-slot:item.estatus_producto="{ value }">
        {{value>0?'aceptado':'producto rechazado'}}
      </template>

      <!-- <template v-slot:item.opcion_iva="{ item }">
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

import {ref,computed,watch,onMounted} from 'vue'
import {getPedidoReporteService} from '@/services/reporte_almacen_service'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import concat from 'lodash/concat'
import uniqBy from 'lodash/uniqBy'
import groupBy from 'lodash/groupBy'
import debounce from 'lodash/debounce'
import numeral from 'numeral'

import {allProductoByClaveName} from '@/services/producto_service'
import {allProveedorByName} from '@/services/proveedor_service'
import {allCategoriaProducto,allSubCategoriaProducto} from '@/services/categoria_producto_service'

const lst_requisicion_producto=ref([])

const headers = [
  { text: "Folio pedido", align: "center", sortable: true, value: "folio" },
  { text: "Fecha pedido", value: "fecha_pedido" },
  { text: "Proveedor", value: "nombre_comercial" },  
  { text: "Tipo producto", value: "tipo" },
  { text: "Clave producto", value: "clave", align: "center" },
  { text: "Producto", value: "producto_name" },
  { text: "Cantidad solicitada", align: "center", value: "cantidad_solicitada" },
  { text: "Cantidad ingresa", align: "center", value: "cantidad_entregada" },
  { text: "Categoria / Subcategoria", align: "center", value: "categoria" },  
  // { text: "Subcategoria", align: "center", value: "subcategoria" },
  { text: "Costo", align: "right", value: "costo" },
  { text: "Descuento", value: "descuento" },
  { text: "Estatus", align: "center", value: "estatus_producto", sortable: false },
  { text: "Estado", align: "center", value: "id_pedido_almacen_revision_pv", sortable: false },
];

const search = ref("");
const search_autocomplete = ref("");
const search_autocomplete_proveedor = ref("");
const producto_autocomplete=ref(0)
const lst_productos_autocomplete=ref([])
const lst_productos_autocomplete_proveedor=ref([])

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
  { label: "Folio pedido", key: "folio", value: "", type: "text" },
  { label: "Fecha pedido inicio", key: "fecha_inicio", value: "", type: "date" },
  { label: "Fecha pedido fin", key: "fecha_fin", value: "", type: "date" },  
  { label: "clave producto", key: "clave", value: "", type: "text" },
  { label: "Proveedor", key: "proveedor", value: "", type: "text" },
  { label: "Producto", key: "producto", value: ""},  
  { label: "Cartegoria", key: "categoria", value: "", type: "select" },
  { label: "Subcategoria", key: "subcategoria", value: "", type: "select" },  
]);


const total_requisicion=computed(()=>uniqBy(lst_requisicion_producto.value,'id_pedido_almacen_pv').length)

const total_producto_categoria=computed(()=>uniqBy(lst_requisicion_producto.value,"id_categoria_pv").map(({id_categoria_pv,categoria})=>({id_categoria_pv,categoria,size:lst_requisicion_producto.value.filter(i=>i.id_categoria_pv==id_categoria_pv).length})))

const total_area_destino=computed(()=>uniqBy(lst_requisicion_producto.value,"id_espacio_fisico").map(({id_espacio_fisico,area_destino})=>({id_espacio_fisico,area_destino,size:lst_requisicion_producto.value.filter(i=>i.id_espacio_fisico==id_espacio_fisico).length})))

const cLstProducto=computed(()=>lst_productos_autocomplete.value.map(i=>({value:i.id_producto_pv,text:i.nombre.toUpperCase()})))
const cLstProveedor=computed(()=>lst_productos_autocomplete_proveedor.value.map(i=>({value:i.id_proveedor,text:i.nombre_comercial.toUpperCase()})))

const lst_categorias=ref([])
const lst_subcategorias=ref([])

watch(search_autocomplete,debounce(async(value)=>{
  console.log(value)
 if(Boolean(value) && value.length>2)
 {
  console.log("entra al if")
  try {
    // console.log(await allProductoByClaveName(value.trim())    )
    lst_productos_autocomplete.value=await allProductoByClaveName(value.trim())        
  } catch (error) {
    console.log(error)
  }
 }
},500))

watch(search_autocomplete_proveedor,debounce(async(value)=>{
  console.log(value)
 if(Boolean(value) && value.length>2)
 {
  console.log("entra al if")
  try {
    // console.log(await allProductoByClaveName(value.trim())    )
    lst_productos_autocomplete_proveedor.value=await allProveedorByName(value.trim())        
  } catch (error) {
    console.log(error)
  }
 }
},500))
            

onMounted(()=>{
  getCategoria()
})

async function getRequisicionReporte(filter={})
{
try {
    lst_requisicion_producto.value=await getPedidoReporteService(filter)
} catch (error) {
    console.log(error)
}
}

async function getCategoria()
{
  try {
    lst_categorias.value= await allCategoriaProducto()
  } catch (error) {
    
  }
}

async function getSubCategoria(id_categoria)
{
  try {
    lst_subcategorias.value= await allSubCategoriaProducto(id_categoria)
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
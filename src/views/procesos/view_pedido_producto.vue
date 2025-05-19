<template>
  <div class="redx" style="height: 100%;">

    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Pedido {{ id_pedido }}</h1>
    </div>


    <div class="d-flex elevation-1" style="height: calc(100% - 57px);">

      <div class="accentx accent-ligethen-1" style="width: 20%;height: 100%;">
        <v-toolbar color="secondary" dark class="text-h6">
          <!-- <search></search> -->
          Productos Disponibles para agregar..
        </v-toolbar>
        <v-card v-for="item in lst_productos_libres" class="mt-3 mx-3" @click="addProductosPedido(item.id_requisicion_producto_pv)">
          <v-card-title>Folio Requisicion:{{ item.folio }}</v-card-title>
          <v-card-text>
            <div>{{ item.clave }}</div>
            <div>{{ item.nombre }}</div>
          </v-card-text>
        </v-card>
      </div>
      <div class="white" style="width: 80%;height: 100%;">
        <v-toolbar color="primary"></v-toolbar>
        <v-data-table :headers="headers" :items="lst_productos" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
          class="table-pv rounded-xl elevation-5 mx-5 my-5" hide-default-footer>
          <template v-slot:top="{ pagination }">
            <div class="d-flex justify-end align-center">
              <span class="mr-2 text-caption">filas por pagina</span>
              <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
              <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
              <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
            </div>
          </template>

          <template v-slot:footer="{ props }">
            <div>{{ props.pagination.itemsLength }} registro(s)</div>
          </template>

          

          
          
          <template v-slot:item.cantidad="{ item }">
            {{ item.cantidad }} {{ item.nombre_unidad_medida_compra }}
          </template>
          
          <template v-slot:item.tamano="{ item }">
            {{ item.tamano }} {{ item.nombre_unidad_medida_producto }}
          </template>


          <template v-slot:item.estatus="{ item }">
            
            <v-icon v-if="item.estatus==1" color="success">mdi-check-circle</v-icon>
            <v-icon v-else color="error">mdi-close-circle</v-icon>
          </template>

          <template v-slot:item.actions="{ item }">         

            <v-tooltip bottom v-if="item.estatus==1">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" x-small icon outlined color="secondary" fab
                  @click="eliminar_producto(item.id_pedido_almacen_producto_pv)"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>

          </template>
        </v-data-table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import numeral from 'numeral'
import { allProductosPedido,findProductoByRequisicionProveedor,agregarProductoPedido,eliminarProductoPedido } from '@/services/pedidos_service'
import Search from '@/components/ui/Search.vue'

const props = defineProps({ id_pedido: { type: String, default: 0 },id_proveedor:{type:String,default:0} })

const root = getCurrentInstance().proxy

const headers = ref([
  { text: "Clave", align: "center", sortable: true, value: "clave" },
  { text: "Nombre", value: "nombre_producto" },
  { text: "Descripcion", value: "descripcion_producto" },
  { text: "Marca", align: "right", value: "nombre_marca" },
  { text: "Modelo", value: "modelo" },
  { text: "Cantidad", value: "cantidad", align: "center" },
  { text: "Tamaño", value: "tamano", align: "center" },
  { text: "Categoria", value: "nombre_categoria" },
  { text: "Subcategoria", value: "nombre_subcategoria" },
  { text: "Requisicion", align: "center", value: "folio_requisicion" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);

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
  { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
  { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);

const lst_productos=ref([])
const lst_productos_libres=ref([])

onMounted(()=>{
  getProductosPedido()
  getPedidosDisponibleRequisicion()
})

async function getProductosPedido()
{
  try {
    lst_productos.value=await allProductosPedido(props.id_pedido)
  } catch (error) {
    
  }
}

async function getPedidosDisponibleRequisicion()
{
  try {
    lst_productos_libres.value=await findProductoByRequisicionProveedor(props.id_proveedor)
  } catch (error) {
    
  }
}

async function addProductosPedido(id_producto)
{
  try {
    const data=await agregarProductoPedido(props.id_pedido,id_producto)
    if(data>0){
      getProductosPedido()
      getPedidosDisponibleRequisicion()
    }else{
      alert('ya esta revisada')
    }
  } catch (error) {
    alert('ya esta revisada')
  }
}

async function eliminar_producto(id_producto_pedido)
{
try {
  const data=await eliminarProductoPedido(id_producto_pedido)
  if(data==2)alert("no se puede eliminar porque ya esta revisado...")
  else if(data==1){
    const index=lst_productos.value.findIndex(i=>i.id_pedido_almacen_producto_pv==id_producto_pedido)
    lst_productos.value[index].estatus=0
  }
  else alert("ocurrio un error...")
} catch (error) {
  
}
}
</script>

<style>
#table-requisicion table {
  /* border:1px solid #000; */
  border-collapse: collapse !important;
  border-radius: 10px !important;
}

#table-requisicion th {
  border: 1px solid #000
    /* border-collapse: collapse!important; */
}

#table-requisicion td {
  border: 1px solid #000;
  /* border-collapse: collapse!important; */
}
</style>
<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Cortes Almacen</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
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
            @click="openCreateCorte"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters"/>
    </div>

    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
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

      <template v-slot:item.fecha_corte="{ value }">
       {{ dayjs(value).format('DD [de] MMM [de] YYYY') }}
      </template>

      <template v-slot:item.hora_corte="{ value }">        
       {{dayjs(value,'HH:mm:ss').format('HH:mm')}}
      </template>

      <template v-slot:item.persona="{ item }">
       <span>{{item.nombre}}</span>
       <span class="font-weight-bold mx-1">{{item.apellido_paterno}}</span>
       <span class="font-italic">{{item.apellido_materno}}</span>
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
              @click="getCorteAlmacenDetalle(item.id_corte_almacen)"
              ><v-icon>mdi-square-edit-outline</v-icon></v-btn
            >
          </template>
          <span>Editar Cuota</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="580" persistent>

      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Generar Corte</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
             <template v-slot:activator="{on,attrs}">
              <v-btn icon outlined small class="mr-1" v-on="on" v-bind="attrs" @click="closeCreateCorte"><v-icon>mdi-close</v-icon></v-btn>
             </template>
             <span>cerrar</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text class="d-flex px-0">
            <v-date-picker v-model="fecha_registro" class="rounded-0" id="date-picker-header-pv"></v-date-picker>
            <v-time-picker v-model="hora_registro" class="rounded-0" format="24hr"></v-time-picker>
        </v-card-text>
        <v-divider></v-divider>
       <v-card-actions>
           <v-spacer></v-spacer>
           <v-btn color="secondary" @click="createCorte">generar corte almacen</v-btn>
       </v-card-actions>
      </v-card>

    </v-dialog>

    <v-dialog v-model="dialog_detalle" width="80vw" persistent>
      <v-card>
        <v-toolbar class="elevation-0 mb-5">
          <v-toolbar-title>Detalle corte</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDetalle">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
         
          <v-data-table
      :headers="headers_detalle"
      :items="items_detalle"    
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
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

    
      

      <template v-slot:item.persona="{ item }">
       <span>{{item.nombre}}</span>
       <span class="font-weight-bold mx-1">{{item.apellido_paterno}}</span>
       <span class="font-italic">{{item.apellido_materno}}</span>
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
              @click="getCorteAlmacenDetalle(item.id_corte_almacen)"
              ><v-icon>mdi-square-edit-outline</v-icon></v-btn
            >
          </template>
          <span>Editar Cuota</span>
        </v-tooltip>
      </template>
    </v-data-table>



        </v-card-text>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";
import {createCorteAlmacenService,getCorteAlmacenService,getCorteAlmacenDetalleService} from '@/services/corte_almacen_service'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from "dayjs";

dayjs.extend(customParseFormat)

const root = getCurrentInstance().proxy;
const $axios = root.$axiosFinanzas;

const fecha_registro=ref(dayjs().format('YYYY-MM-DD'))
const hora_registro=ref(dayjs().format('HH:mm:ss'))


const headers = ref([
  
  { text: "Fecha corte", value: "fecha_corte" },
  { text: "Hora corte", align: "right", value: "hora_corte" },
  { text: "Persona realiza", value: "persona" },
  // { text: "Genero aplica", value: "genero_aplica", align: "center" },
  // { text: "Edad miníma", value: "edad_aplica" },
  // { text: "Obligatoria", align: "center", value: "obligatoria" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);

const headers_detalle = ref([
  
  { text: "Clave", value: "clave" },
  { text: "Producto", align: "right", value: "nombre" },
  { text: "Descripcion", value: "descripcion" },
  { text: "Tipo", value: "tipo" },
  { text: "Marca", value: "marca_name" },
  { text: "Modelo", value: "modelo" },
  { text: "Categoria", value: "categoria_name" },
  { text: "Subcategoria", value: "subcategoria_name" },
  { text: "Unidad Compra", value: "unidad_medida_compra" },
  { text: "Cantidad", value: "cantidad" },
]);

const items = ref([]);
const items_detalle = ref([]);
const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const dialog=ref(false)
const dialog_detalle=ref(false)

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

onMounted(() => {
  $axios.get("cuotas").then(({ data }) => {
    console.log(data);
  });
  get_cortes();
});

async function get_cortes() {
  items.value=await getCorteAlmacenService();
}

function nueva_cuota() {
  root.$router.push({ name: "FormConcepto" });
}




function openCreateCorte()
{
  dialog.value=true
}

function closeCreateCorte()
{
  fecha_registro.value=dayjs().format('YYYY-MM-DD')
  hora_registro.value=dayjs().format('HH:mm:ss')
  dialog.value=false
}

function closeCreateCorteDetalle()
{
  items_detalle.value=[]
  dialog_detalle.value=false
}

async function createCorte()
{
  const cve_persona=root.$ls.get("user", { cve_persona: 0 }).cve_persona
  const fecha=fecha_registro.value
  const hora=hora_registro.value
  const data=await createCorteAlmacenService({cve_persona,fecha,hora})
  get_cortes()
  console.log(data)
}

async function getCorteAlmacenDetalle(id_corte)
{ 
  dialog_detalle.value=true
  items_detalle.value=await getCorteAlmacenDetalleService(id_corte)
}

function closeDetalle()
{
  dialog_detalle.value=false
  items_detalle.value=[]
}


</script>

<style >
#date-picker-header-pv .v-picker__title{
  /* background-color: red!important; */
  height: 102px;
}
</style>
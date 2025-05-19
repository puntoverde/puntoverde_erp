<template>
  <div>
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Reporte jugadores futbol</h1>
    <!-- </div>

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
      </v-tooltip> -->

      <!-- <Search v-model="search" :filters="filters"/> -->
      <v-select :items="lst_torneos" item-value="id_torneo_futbol" item-text="nombre" @change="fnGetJugadores" label="Torneo" filled style="max-width: 350px;" >

      </v-select>
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
        <div class="d-flex justify-space-between align-center">
          <v-btn @click="exportar" rounded color="#0F793E" dark> <v-icon class="mr-1">mdi-file-excel</v-icon> exportar</v-btn>

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
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:item.jugador="{ item }">
      <span>{{item.nombre}}</span>
      <span class="font-weight-bold mx-1">{{item.apellido_paterno}}</span>
      <span class="font-italic">{{item.apellido_materno}}</span>
      </template>

      <template v-slot:item.fecha_alta="{ value }">        
       {{dayjs(value).format('DD [de] MMMM [de] YYYY')}}
      </template>

    
      <template v-slot:item.estatus_accion="{ value }">
        <v-icon v-if="value==1" color="success">mdi-check-circle</v-icon>
        <v-icon v-else-if="value==2" color="warning">mdi-alert-box</v-icon>
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


  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import {getTorneoFutbolService,getReporteJugadoresService} from '@/services/equipo_futbol_service'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from "dayjs";
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import _concat from 'lodash/concat'

dayjs.extend(customParseFormat)

const headers = ref([
  
{ text: "Accion", value: "accion_name" },
  { text: "Nombre usuario", value: "jugador" },
  { text: "Usuario", value: "posicion" },
  { text: "Nombre equipo", value: "equipo_name" },
  { text: "Fecha ingreso al club", value: "fecha_alta" },
  { text: "Estataus accion", value: "estatus_accion" },
]);



const items = ref([]);
const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const lst_torneos=ref([])


onMounted(()=>{
  fnGetTorneos()
})


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

async function fnGetTorneos()
{
  lst_torneos.value=await  getTorneoFutbolService()
}

async function fnGetJugadores(id) {
  items.value=await getReporteJugadoresService(id);
}


function exportar() {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("jugadores");
      let ws_data1 = items.value.map(item => [
        item.accion_name,
        `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,
        item.posicion,
        item.equipo_name,
        item.fecha_alta,
        item.estatus_accion==1?'activo':item.estatus_accion==2?'bloqueado':'inactivo',
       ]);

      
      let ws_data=_concat([['Accion','Nombre usuario','Usuario','Nombre equipo','Fecha ingreso club','Estatus accion']],ws_data1);

      console.log(ws_data)
      let ws = XLSX.utils.aoa_to_sheet(ws_data, {origin: "B2"});

      wb.Sheets["jugadores"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'jugadores.xlsx');

    }

</script>

<style >
#date-picker-header-pv .v-picker__title{
  /* background-color: red!important; */
  height: 102px;
}
</style>
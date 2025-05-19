<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Reporte Apartado Estatus</h1>
    </div>

    <div class="d-flex justify-end mb-5">
      <Search v-model="search" :filters="filters" @emit-buscar="llenarTabla" />
    </div>

    <v-data-table
      :headers="headersTabla"
      :items="bodyTable"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
      :loading="loading"
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

      <template v-slot:item.nombre="{value}">
        <span class="font-weight-bold">{{value}}</span>
      </template>

      <template v-slot:item.fecha_inicio="{value}">
        <span class="font-weight-bold accent--text">{{dayjs(value).format('DD-MMM-YYYY HH:mm')}}</span>
      </template>

      <template v-slot:item.fecha_fin="{value}">
        <span class="font-weight-bold accent--text">{{dayjs(value).format('DD-MMM-YYYY HH:mm')}}</span>
      </template>

      <template v-slot:item.entrada="{value}">
        <span class="text-subtitle-1 font-italic accent--textx">{{dayjs(value,'HH:mm:ss').isValid()?dayjs(value,'HH:mm:ss').format('HH:mm'):'NA'}}</span>
      </template>

      <template v-slot:item.salida="{value}">
        <span class="text-subtitle-1 font-italic accent--textx">{{dayjs(value,'HH:mm:ss').isValid()?dayjs(value,'HH:mm:ss').format('HH:mm'):'NA'}}</span>
      </template>

      <template v-slot:item.fecha_registro="{value}">
        <span class="font-weight-bold accent--text">{{dayjs(value).format('DD-MMM-YYYY HH:mm')}}</span>
      </template>     

      <template v-slot:item.estatus="{ value }">        
        <v-chip v-if="value==1" color="primary">
          <v-icon left>mdi-check-circle</v-icon>
           Activo
        </v-chip>
        <v-chip v-else color="secondary">
          <v-icon left>mdi-close-circle</v-icon>
Cancelado
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {getApartadoEstatusService} from '@/services/apartados_services'
console.log('custo:',customParseFormat)
dayjs.extend(customParseFormat)

const loading=ref(false)
const search=ref('')

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
  {
    label: "Fecha Inicio",
    key: "fecha_inicio",
    value: dayjs().format('YYYY-MM-DD'),
    type: "date",
  }  
]);

const bodyTable = ref([]);
const headersTabla = [
  { text: "Apartado", value: "descripcion" },
  { text: "Usuario", value: "nombre" },
  { text: "Fecha Inicio", value: "fecha_inicio" },
  { text: "Fecha Fin", value: "fecha_fin" },
  { text: "Entrada", value: "entrada" },
  { text: "Salida", value: "salida" },
  // { text: "Posicion", value: "posicion" },
  // { text: "Acción", value: "numero_accion" },
  { text: "Fecha Registro", value: "fecha_registro" },
  { text: "Estatus", value: "estatus" ,align:'center'},
];

onMounted(()=>{
  llenarTabla({fecha_inicio:dayjs().format('YYYY-MM-DD')})
});

async function llenarTabla(filter = {}) {
  try{
    loading.value=true
  // let { data, status } = await $axios.get("/apartado", {
  //   params: filter,
  // });
  const data=await getApartadoEstatusService(filter)
  
    bodyTable.value = data;

  }
  catch(e)
  {
    console.log(e)
  }
  finally{loading.value=false}
}
</script>

<style>
</style>
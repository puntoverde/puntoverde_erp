<template>
  <div class="mx-5">
    <h1 class="grey--text">Proceso Asignar Lockers Masivo</h1>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="lst_locker_disponibles"
      show-select
      item-key="cve_locker"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-space-between align-center">
          <v-btn @click="asignarLocker" :loading="load" elevation="0" color="accent"
            >Asignar ({{ selected.length > 0 ? selected.length : "" }})
            Lockers</v-btn
          >

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

      <template v-slot:footer="{props}">
       <div>{{props.pagination.itemsLength}} registro(s)</div>
      </template>

      <template v-slot:item.rentador="{ item }">
        {{ item.nombre }} <span class="font-weight-bold">{{ item.apellido_paterno }}</span>
        {{ item.apellido_materno }}
      </template>

      <template v-slot:item.fecha_inicio="{ value }">
        {{ dayjs(value).format("DD-MMM-YYYY") }}
      </template>
      <template v-slot:item.fecha_fin="{ value }">
        {{ dayjs(value).format("DD-MMM-YYYY") }}
      </template>
      <template v-slot:item.costo="{ value }">
        <span class="font-weight-bold">{{ numeral(value).format("$0,0.00") }}</span>
      </template>
    </v-data-table>
   

  <v-snackbar v-model="snackbar" color="info">
      <div><span>Guardado con exito: </span><span>{{cargados}}</span></div>
      <div><span>Ya se encuentra ocupado: </span><span>{{no_cargados}}</span></div>
  </v-snackbar>

  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

import dayjs from "dayjs";
import numeral from "numeral";
import  debounce from 'lodash/debounce'

import {getLockerDisponiblesService,setAsignarLockerMasivamenteService} from '@/services/asignar_locker_service'

const cve_locker = ref(0);
const headers = ref([
  { text: "# Locker", value: "numero_locker" ,align:'center'},
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Accion de Socio", value: "accion" ,align:'center'},
  { text: "Socio Renta", value: "rentador" },
  { text: "Fecha Inicio", value: "fecha_inicio" ,align:'center'},
  { text: "Fecha Fin", value: "fecha_fin" ,align:'center'},
  { text: "Costo Renta", value: "costo",align:'right' },
]);
const lst_locker_disponibles = ref([]);

const selected = ref([]);
const load=ref(false)

const page = ref(1);
const itemsPerPage = ref(10);

const snackbar=ref(false)

const cargados=ref(0)
const no_cargados=ref(0)

onMounted(() => {
  getLockersDisponibles();
});

async function getLockersDisponibles() {
  try {  
    lst_locker_disponibles.value = await getLockerDisponiblesService();
  } catch (error) {}
}

const asignarLocker = debounce(async ()=> {
  let dataSend = selected.value.map((i) => ({
    cve_locker: i.cve_locker,
    cve_persona: i.rentador,
    cve_accion: i.cve_accion,
    concepto: "renta locker",
    total: i.costo,
    fecha_inicio:i.fecha_inicio,
    fecha_fin: i.fecha_fin,
    tipo: 3,//renueva
  }));
  console.log("🚀 ~ file: asignar_lockers_masivo.vue:115 ~ dataSend ~ dataSend", dataSend)  

  try {
    load.value=true 

    const data=await setAsignarLockerMasivamenteService(dataSend)
     
    cargados.value =data.filter(i=>i.cve_cargo>0).length;
    no_cargados.value =data.filter(i=>i.cve_cargo==0).length;
    snackbar.value=true
   

  } catch (error) {}
  finally{
    load.value=false
  }
},500)
</script>

<style>
.border-inactive {
  border-left-style: solid;
  border-left-width: 10px;
  border-left-color: var(--v-accent-darken2) !important;
}
.border-active {
  /* border-left-style: solid; */
  /* border-left-width: 10px; */
  border-left-color: var(--v-primary-base) !important;
}

.no-radius {
  border-radius: 0px !important;
}
</style>
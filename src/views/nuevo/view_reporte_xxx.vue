<template>
    <div>
      <div class="d-flex justify-space-between">
        <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs> -->
        <h1 class="accent--text oswald--text">Reporte Altas Bajas Colaborador</h1>
      <!-- </div>
  
      <div class="d-flex justify-space-between mb-5"> -->
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
              @click="nueva_cuota"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar Cuota</span>
        </v-tooltip> -->
       
        <div class="d-flex align-center" style="column-gap: 10px;">
          <span>Baja</span> <v-switch v-model="estatus" :true-value="1" :false-value="0"></v-switch> <span class="mr-10">Alta</span>
          <v-menu>
            <template v-slot:activator="{on,attrs}">
              <v-text-field :value="fecha_inicio" solo hide-details prepend-inner-icon="mdi-calendar" label="fecha inicio" v-on="on" v-bind="attrs"></v-text-field>
            </template>
            <v-date-picker v-model="fecha_inicio"></v-date-picker>
          </v-menu>
          <v-menu>
            <template v-slot:activator="{on,attrs}">
              <v-text-field :value="fecha_fin" solo hide-details prepend-inner-icon="mdi-calendar" label="fecha fin" v-on="on" v-bind="attrs"></v-text-field>
            </template>
            <v-date-picker v-model="fecha_fin"></v-date-picker>
          </v-menu>
          
          <v-btn large color="info" @click="fnGetAltasBajasColaboradores"><v-icon>mdi-magnify</v-icon> Buscar</v-btn>
        </div>
  
        <!-- <Search v-model="search" :filters="filters" @emit-buscar="" /> -->
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
  
        <template v-slot:item.tipo_cuota="{ item }">
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
  
        <template v-slot:item.fecha="{ item }">
          <!-- <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
          <v-icon v-else color="error">mdi-close-circle</v-icon> -->
          <span v-if="estatus==1">{{ item.fecha_ingreso }}</span>
          <span v-else>{{ item.fecha_baja }}</span>
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
        </template>
      </v-data-table>
    </div>
  </template>
  <script setup>
  import { onMounted, ref, getCurrentInstance } from "vue";
  import Search from "@/components/ui/Search.vue";
  import numeral from "numeral";
  import {getReporteAltasBajasColaboradorService} from '@/services/colaborador_service'
  
  const root = getCurrentInstance().proxy;

  const estatus=ref(1)
  const fecha_inicio=ref('')
  const fecha_fin=ref('')

  const headers = ref([
    { text: "No Empleado", align: "center", sortable: true, value: "nomina" },
    { text: "Nombre Completo", value: "nombre" },
    { text: "Area", value: "area_" },
    { text: "Departamento", align: "right", value: "depa_" },
    { text: "Puesto", value:null },
    { text: "Fecha", value: "fecha", align: "center" },
    // { text: "Fecha Baja", value: "edad_aplica" }
  ]);
  const items = ref([]);
  const search = ref("");
  
  const page = ref(1);
  const itemsPerPage = ref(10);


  
  // onMounted(() => {
  //   fnGetAltasBajasColaboradores();
  // });
  
  async function fnGetAltasBajasColaboradores() {
    items.value = await getReporteAltasBajasColaboradorService(fecha_inicio.value,fecha_fin.value,estatus.value);
  }

  
 
  
  </script>
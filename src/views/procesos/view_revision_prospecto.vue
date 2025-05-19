<template>
    <div>
      <div class="d-flex justify-space-between">
        <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <h1 class="accent--text oswald--text">Lista Solicitudes de Ingreso</h1>
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
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar Cuota</span>
        </v-tooltip>
  
        <Search v-model="search" :filters="filters" @emit-buscar="$event=>fnGetSolicitudes($event)">         
            
            <template v-slot:genero>
                  <v-radio-group row>
                    <v-radio label="Hombre"></v-radio>
                    <v-radio label="Mujer"></v-radio>
                    <v-radio label="Ambos"></v-radio>
                  </v-radio-group>
            </template>

        </Search>
      </div>
  
      <v-data-table
        :headers="headers"
        :items="lst_solicitudes"
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
        <template v-slot:item.acciones="{ item }">
          <v-tooltip>
            <template v-slot:activator="{ on, attrs }" bottom>
              <v-btn
                class="mr-2"
                color="primary"
                icon
                outlined
                v-on="on"
                @click="getJugadoresByAccion(item.id_equipo_futbol, item)"
              >
                <v-icon> mdi-eye</v-icon></v-btn
              >
            </template>
            <span> Ver jugadores</span>
          </v-tooltip>
          <v-btn
            class="mr-2"
            color="primary"
            icon
            outlined          
          >
            <v-icon> mdi-plus</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            icon
            outlined
            @click="
              createCredencial(
                item.id_equipo_futbol,
                item.equipo,
                item.torneo,
                item.categoria
              )
            "
          >
            <v-icon> mdi-printer</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.genero="{value}">
            {{ value==1?'Hombre':'Mujer' }}
        </template>

        <template v-slot:item.fecha_nacimiento="{value}">
            {{ dayjs().diff(value,'year') }} años
        </template>
      </v-data-table>
  
      <v-snackbar v-model="snackbar" :color="snackbar_color">
        {{ snackbar_menssage }}</v-snackbar
      >
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref,getCurrentInstance } from "vue";
  import {getSolicitudes} from '@/services/registro_prospecto'
  import Search from "@/components/ui/Search.vue";
  import dayjs from 'dayjs'
  
  const root = getCurrentInstance().proxy;
  
  const headers = ref([
    { text: "Accion", value: "accion" },
    { text: "Nombre", value: "nombre" },
    { text: "Apellido paterno", value: "paterno" },
    { text: "Apellido materno", value: "materno" },
    { text: "Genero", value: "genero" },
    { text: "Edad", value: "fecha_nacimiento", width: 160 },
    // { text: "Estado civil", value: "estado_civil", width: 160 },
    { text: "Curp", value: "curp", width: 160 },
    { text: "Rfc", value: "rfc", width: 160 },
    { text: "Parentesco", value: "parentesco", width: 160 },
    // { text: "Calle", value: "calle", width: 160 },
    // { text: "N ext", value: "numero_ext", width: 160 },
    // { text: "N int", value: "numero_int", width: 160 },
    // { text: "CP", value: "cp", width: 160 },
    // { text: "Colonia", value: "name_colonia", width: 160 },
    // { text: "Municipio", value: "name_municipio", width: 160 },
    // { text: "Estado", value: "name_estado", width: 160 },
]);
  
  const id_accion = ref();

  
  const search = ref();

  const lst_solicitudes = ref([]);
  
  
  const snackbar = ref(false);
  const snackbar_color = ref("success");
  const snackbar_menssage = ref("");
  
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
    { label: "Accion", key: "accion", value: "", type: "text" },
    { label: "Nombre", key: "nombre", value: "", type: "text" },
    { label: "Apellido paterno", key: "paterno", value: "", type: "text" },
    { label: "Apellido materno", key: "materno", value: "", type: "text" },
    { label: "Genero", key: "genero", value: "", type: "text" },
    { label: "Edad", key: "edad", value: "", type: "text" },
    { label: "Estado civil", key: "estado_civil", value: "", type: "select" },
    { label: "Curp", key: "curp", value: "", type: "text" },
    { label: "Rfc", key: "rfc", value: "", type: "text" },
    { label: "Parentesco", key: "parentesco", value: "", type: "select" },  
  ]);
  
  onMounted(() => {
    fnGetSolicitudes();
  });
  
 
  async function fnGetSolicitudes(p={}) {
    try {
        let data= await getSolicitudes(p);
        lst_solicitudes.value=data
    } catch (error) {}
  }
  
  </script>
  
  
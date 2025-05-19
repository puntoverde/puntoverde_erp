<template>
  <div>
    
    <v-dialog v-model="dialog" width="500" persistent scrollable>     
      <v-card>
        <v-toolbar color="secondary" dark elevation="0">
          <v-toolbar-title>Alta de Torneo</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeForm"><v-icon>mdi-close-box</v-icon></v-btn>
        </v-toolbar>  
        <div style="height:3px;background:#14bf98"></div>
        <v-card-text class="pt-5">
          <v-row>
            <!-- <v-col cols="12"
              ><v-select v-model="cve_accion" label="Nombre de Torneo" :items="lst_acciones" item-value="cve_accion" :item-text="(e)=>`${e.accion}-${e.nombre}`"></v-select
            ></v-col> -->
            <v-col cols="12"
              ><v-text-field filled
                v-model="nombre"
                label="Nombre de Torneo"
              ></v-text-field
            ></v-col>
            <v-col cols="12"
              ><v-select filled
                v-model="categoria"
                label="Categoria"
                :items="[{text:'Varonil',value:'1'},{text:'Femenil',value:'2'},{text:'Mixto',value:'3'}]"
              ></v-select
            ></v-col>
            <v-col cols="12"
              ><v-text-field filled
                v-model="limite_edad"
                label="Limite edad"
              ></v-text-field
            ></v-col>
            <v-col cols="12"
              ><v-text-field filled
                v-model="fecha_inicio"
                label="Fecha inicio"
                placeholder="2000-01-01"
              ></v-text-field
            ></v-col>
            <v-col cols="12"
              ><v-text-field filled
                v-model="fecha_fin"
                label="Fecha fin"
                placeholder="2000-01-01"
              ></v-text-field
            ></v-col>
           
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="createTorneo" block color="secondary"
                >Guardar</v-btn
              >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Torneo de Futbol</h1>
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
            @click="dialog = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" />
    </div>

    <v-data-table 
      :headers="headers" 
      :items="lst_torneos" 
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer>
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

      <template v-slot:footer="{props}">
        <div>{{props.pagination.itemsLength}} registro(s)</div>
      </template>

      <template v-slot:item.fecha_inicio="{value}">
        {{dayjs(value).format('DD-MMM-YYYY')}}
      </template>
      <template v-slot:item.fecha_fin="{value}">
        {{dayjs(value).format('DD-MMM-YYYY')}}
      </template>
      </v-data-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Search from '@/components/ui/Search.vue'
import dayjs from 'dayjs'
import {getAccionesTipoFutbolService,getTorneoFutbolService,setCreateTorneoFutbolService} from '@/services/equipo_futbol_service'
    

    const dialog = ref(false);
    const lst_torneos = ref([]);
    const lst_acciones=ref([])
    const headers = ref([
      { text: "Nombre Torneo", value: "nombre" },
      { text: "Categoria", value: "categoria" },
      { text: "Limite edad", value: "limite_edad" },
      { text: "Fecha Inicio", value: "fecha_inicio" },
      { text: "Fecha Fin", value: "fecha_fin" },
    ]);
    // const cve_accion = ref(0);
    const nombre = ref("");
    const categoria = ref("");
    const limite_edad = ref(0);
    const fecha_inicio = ref(null);
    const fecha_fin = ref(null);

    const search=ref('')
    
    const page= ref(1)
    const itemsPerPage=ref(10)

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


    getTorneos();
    getAcciones();

    async function getAcciones() {
      try {

        const data=await getAccionesTipoFutbolService()

        lst_acciones.value = data;    
      } catch (error) {}
    }

    async function getTorneos() {
      try {

        const data=await getTorneoFutbolService()
        lst_torneos.value = data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }

    async function createTorneo() {
      try {
        
        const data=await setCreateTorneoFutbolService(nombre.value,categoria.value,limite_edad.value,fecha_inicio.value,fecha_fin.value) 
        if(data>0)getTorneos()
      } catch (error) {}
    }

    function closeForm()
    {
    nombre.value =''
    categoria.value =''
    limite_edad.value =''
    fecha_inicio.value =''
    fecha_fin.value =''
    dialog.value=false
    }

    
</script>


<style>
</style>
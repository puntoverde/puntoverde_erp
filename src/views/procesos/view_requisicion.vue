<template>
    <div>
      <div class="d-flex justify-end">
        <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs> -->
        <h1 class="accent--text oswald--text">Listado Requisiciones</h1>
      </div>
  
      <div class="d-flex justify-space-between mb-5">
        <div class="d-flex" style="column-gap: 5px;">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn              
              color="primary"
              v-on="on"
              v-bind="attrs"
              fab
              small
              dark
              elevation="1"
              @click="nueva_requisicion"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar requisicion</span>
        </v-tooltip>        
        </div>
  
        <Search v-model="search" :filters="filters" @emit-buscar="get_requsiciones" />
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

        <template v-slot:item.folio="{value}">
           <v-chip label color="grey darken-2" class="white--text font-weight-bold">{{ value }}</v-chip>
        </template>
  
        <template v-slot:item.fecha_solicitud="{ value }">    
           <span> {{ dayjs(value).format('DD [de] MMMM [de] YYYY') }} </span>
        </template>
  
        <template v-slot:item.solicita="{ item }">
          <span>{{item.nombre}}</span>
          <span class="font-weight-bold mx-2">{{item.apellido_paterno}}</span>
          <span class="font-italic">{{item.apellido_paterno}}</span>
        </template>
  
        <template v-slot:item.estatus="{ item }">
          <!-- 0 que es rechazda en revison -->
          <v-chip v-if="item.estatus==0" color="error" style="width:180px;">
              <v-icon left >mdi-close-circle</v-icon> rechazada en revision
          </v-chip>
            <!-- 1 default pendiente -->
          <v-chip v-if="item.estatus==1"  color="warning" style="width:180px;">
            <v-icon left >mdi-alert-circle</v-icon> pendiente
          </v-chip>
          <!-- 2 revisada -->
          <v-chip v-else-if="item.estatus==2" color="info" style="width:180px;">
              <v-icon left>mdi-check-circle</v-icon> revisada
          </v-chip>
          <!-- 3 aprobada -->
          <v-chip v-else-if="item.estatus==3" color="success" style="width:180px;">
              <v-icon left >mdi-check-all</v-icon> aprobada
          </v-chip>          
          <!-- 4 que es rechazda en revison -->
          <v-chip v-else-if="item.estatus==4" color="error" style="width:180px;">
              <v-icon left >mdi-close-circle</v-icon> rechazada en aprobacion
          </v-chip>
        </template>
  
        <template v-slot:item.actions="{ item }">               
        
          <requisicion-detalle v-if="item.solicita==1" :id_requisicion="item.id_requisicion_pv" ></requisicion-detalle>
          
          
          <requisicion-detalle v-else-if="item.revisa==1 && (item.estatus==2 || item.estatus==3)" :id_requisicion="item.id_requisicion_pv" ></requisicion-detalle>
          <requisicion-revision v-else-if="item.revisa==1 && item.estatus==1" :id_requisicion="item.id_requisicion_pv" :estatus_requisicion="item.estatus" @emit-finaliza="FinalizaRequisicion" @emit-cancela="CancelaRequisicion"></requisicion-revision>
          
          <requisicion-detalle v-else-if="item.autoriza==1 && (item.estatus==1 || item.estatus==3)" :id_requisicion="item.id_requisicion_pv" ></requisicion-detalle>
          <requisicion-aprobacion v-else-if="item.autoriza==1 && item.estatus==2" :id_requisicion="item.id_requisicion_pv" :estatus_requisicion="item.estatus" @emit-finaliza="FinalizaRequisicion" @emit-cancela="CancelaRequisicion"></requisicion-aprobacion>

          <requisicion-detalle v-else-if="item.estatus==0 || item.estatus==4" :id_requisicion="item.id_requisicion_pv" ></requisicion-detalle>
        </template>
      </v-data-table>

      

      <v-snackbar v-model="snackbar_success" color="success">Finalizo la requisicion con exito.</v-snackbar>
      <v-snackbar v-model="snackbar_error" color="error">Se cancelo la requisicion.</v-snackbar>
    </div>
  </template>

  <script setup>
  import { onMounted, ref, getCurrentInstance } from "vue";
  import Search from "@/components/ui/Search.vue";
  import requisicionDetalle from "@/components/requisicion-detalle.vue";
  import requisicionRevision from "@/components/requisicion-revision.vue";
  import requisicionAprobacion from "@/components/requisicion-aprobacion.vue";
  import numeral from "numeral";
  import {getRequisiciones} from '@/services/requisicion_service'
  import dayjs from "dayjs";
  
  const root = getCurrentInstance().proxy;

  const headers = ref([
    { text: "Folio requisicion", align: "center", sortable: true, value: "folio" },
    { text: "Fecha solicitud requissicion", value: "fecha_solicitud" },
    { text: "Persona quien solicito", value: "solicita" },    
    { text: "Estatus actual requisicion", align: "center", value: "estatus" },
    { text: "", align: "center", value: "actions", sortable: false },
  ]);
  const items = ref([]);
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
    { label: "Folio", key: "folio", value: "", type: "text" },
    { label: "Fecha solicitud inicio", key: "fecha_solicitud_inicio", value: "", type: "date" },
    { label: "Fecha solicitud fin", key: "fecha_solicitud_fin", value: "", type: "date" },
    { label: "Solicito", key: "solicito", value: "", type: "text" },
    { label: "Estatus", key: "estatus", value: "", type: "select",items:[{value:'0',text:'rechazada'},{value:'1',text:'pendiente'},{value:'2',text:'revisada'},{value:'3',text:'Aprobada'}] },
  ]);

  const snackbar_success=ref(false)
  const text_success=ref('')

  const snackbar_error=ref(false)
  
  onMounted(() => { 
    get_requsiciones();
  });

  function FinalizaRequisicion()
  {
    snackbar_success.value=true
    get_requsiciones()
  }

  function CancelaRequisicion(){
    snackbar_error.value=true
    get_requsiciones()
  }
  
  async function get_requsiciones(filtros={}) {
    const id_persona=root.$ls.get("user",{cve_persona:0}).cve_persona;
    items.value = await getRequisiciones(id_persona,filtros)
  }
  
  function nueva_requisicion() {
    root.$router.push({ name: "requisicion_producto" });
  }  
 
  </script>
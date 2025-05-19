<template>
    <div>
      <div class="d-flex justify-space-between">
        
        <h1 class="accent--text oswald--text">Autos Usuarios</h1>
        <Search v-model="search" :filters="filters" @emit-buscar="" />
      </div>
  
      <!-- <div class="d-flex justify-space-between mb-5">
      
  
        
      </div> -->
  
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
  
        <template v-slot:item.color="{ value,item }">
          <v-menu :close-on-content-click="false" :nudge-right="40"  transition="scale-transition" offset-y max-width="290px" min-width="290px">
               <template v-slot:activator="{ on }">
                <v-btn elevation="1"  fab small :color="value" v-on="on"><v-icon :color="value=='#FFFFFFFF' || value=='#FFFFFF'?'grey':'white'">mdi-palette</v-icon></v-btn>                 
               </template>
               <v-color-picker v-model="value"  show-swatches disabledx hide-canvas hide-inputs swatches-max-height=100 :swatches="swatches_color" value="hex" @input="fnChangeColor(item.id_auto_usuario,value)"/>
             </v-menu>
        </template>
  
        <template v-slot:item.placas="{ value,item }">
          <!-- <span class="font-weight-black">
          </span> -->
          <v-menu :close-on-content-click="false" :nudge-right="40"  transition="scale-transition" offset-y max-width="290px" min-width="290px">
            <template v-slot:activator="{on,attrs}">

              <v-badge
              bordered
              color="primary"
              icon="mdi-pencil-outline"
              overlapx
              offset-y="15"
              offset-x="15"
              >
              <v-btn text class="font-weight-black" v-on="on" v-bind="attrs">                
                {{value}}
              </v-btn>
            </v-badge>
          </template>
          <v-card>
            <v-toolbar class="secondary" dark elevation="0" dense>
              <v-toolbar-title>Ingrese # placa</v-toolbar-title>
            </v-toolbar>
            <v-divider class="primary" style="min-height: 3px;"></v-divider>
            <v-card-text class="pt-5">
              <v-text-field v-model="value" filled hide-details></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="fnChangePlaca(item.id_auto_usuario,value)" color="secondary">cambiar</v-btn>
            </v-card-actions>
          </v-card>
          </v-menu>
        </template>
  
        <template v-slot:item.fecha_registro="{ value }">
          {{ dayjs(value).format('DD [de] MMM [de] YYYY') }}
        </template>
  
        <template v-slot:item.usuario="{ item }">
          <span>{{ item.nombre }}</span>
          <span class="font-weight-black mx-1">{{ item.apellido_paterno }}</span>
          <span class="font-italic">{{ item.apellido_materno }}</span>
        </template>
  
        <template v-slot:item.edad_aplica="{ item }">
          {{ item.edad_aplica == 0 ? "NA" : `${item.edad_aplica} Años` }}
        </template>
  
        <template v-slot:item.obligatoria="{ item }">
          <span class="font-weight-bold" :class="{'primary--text':item.obligatoria,'secondary--text':!item.obligatoria}">{{item.obligatoria?'SI':'NO'}}</span>
        </template>
  
        <template v-slot:item.estatus="{ item }">
          <v-icon v-if="item.estatus=='activo'" color="success">mdi-check-circle</v-icon>
          <v-icon v-else color="error">mdi-close-circle</v-icon>
        </template>
  
        <template v-slot:item.actions="{ item }">
          <v-tooltip bottom  v-if="item.estatus=='activo'">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                x-small
                icon
                outlined
                color="secondary"
                fab
                @click="setBajaAuto(item.id_auto_usuario)"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </template>
            <span>Dar baja</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </div>
  </template>
  <script setup>
  import { onMounted, ref, getCurrentInstance } from "vue";
  import Search from "@/components/ui/Search.vue";
  import numeral from "numeral";
  import dayjs from "dayjs";
  import {getAutosUsuarioService,setBajaAutoUsuarioService,setColorAutoUsuarioService,setPlacasAutoUsuarioService} from '@/services/autos_usuarios_service'
  
  const root = getCurrentInstance().proxy;
  const headers = [
    { text: "Accion usuario", align: "center", value: "accion_socio" },
    { text: "Usuario", align: "center", value: "posicion" },
    { text: "Nombre usuario", align: "center", value: "usuario" },
    { text: "Fecha registro", align: "center", value: "fecha_registro" },
    { text: "Tipo",  sortable: true, value: "tipo" },
    { text: "Marca", value: "marca" },
    { text: "Modelo", value: "modelo" },
    { text: "Placas", value: "placas" },
    { text: "Color", align: "right", value: "color" },
    { text: "Tipo tag", value: "repuve_tag" },
    { text: "Tag", value: "tag", align: "center" },
    { text: "Estatus", align: "center", value: "estatus" },
    { text: "", align: "center", value: "actions", sortable: false },
  ];
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
    { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
    { label: "Grado", key: "nivel_grado", value: "", type: "text" },
  ]);

  const swatches_color=[
        ['#FF0000', '#ffffff'],
        ['#FFFF00', '#AAAA00'],
        ['#00FF00', '#00AA00'],
        ['#00FFFF', '#00AAAA'],
        ['#0000FF', '#0000AA'],
      ]

      const color=ref()
  
  onMounted(() => {
    fnGetAutosUsuario();
  });
  
  async function fnGetAutosUsuario() {
    try {
      const data=await getAutosUsuarioService();
      items.value = data.map(i=>({...i,usuario:`${i.nombre} ${i.apellido_paterno} ${i.apellido_materno}`}))
      
    } catch (error) {
      
    }
  }

  async function setBajaAuto(id)
  {
    await setBajaAutoUsuarioService(id)
    fnGetAutosUsuario()
  }
  
  async function fnChangeColor(id,color)
  {
    try {
      await setColorAutoUsuarioService(id,color)
    } catch (error) {
      
    }
  }
  
  async function fnChangePlaca(id,placa)
  {
    try {
      await setPlacasAutoUsuarioService(id,placa);
    } catch (error) {
      
    }
  }

  
  </script>
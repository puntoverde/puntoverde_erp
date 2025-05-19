<template>
    <div>

        <div class="d-flex justify-space-between">
            <h1 class="accent--text oswald--text">Reporte Orden trabajo </h1>

            <div class="d-flex" style="column-gap: 15px;">
            <v-text-field label="folio" v-model="folio" filled></v-text-field>

            <v-menu v-model="menu_usuario_reporte" :close-on-click="false" :close-on-content-click="false">
                <template v-slot:activator="{on,attrs}">
                  <v-text-field :value="usuerio_reporte_text" label="usuario reporto(opcional)" readonly filled v-bind="attrs" class="menu-text" v-on="on" clearable @click:clear="usuerio_reporte_id=undefined">
                  <template v-slot:append>
                      <v-btn icon color="primary" ><v-icon>mdi-magnify</v-icon></v-btn>                    
                  </template>
                  </v-text-field>
                </template>
                <v-card>
                  <v-toolbar color="secondary" elevation="0">
                    <v-text-field v-model="search_usuarios" hide-details solo @keypress.enter="fnBuscarSocios"></v-text-field>
                  </v-toolbar>
                  <v-list>
                    <v-list-item v-for="user_ in lst_usuarios" @click="()=>{usuerio_reporte_text=`${user_.nombre} ${user_.apellido_paterno} ${user_.apellido_materno}`;usuerio_reporte_id=user_.cve_socio;menu_usuario_reporte=false;lst_usuarios=[];search_usuarios=undefined}">
                      <v-list-item-content>
                        <v-list-item-title>{{ user_.nombre }} {{ user_.apellido_paterno }} {{ user_.apellido_materno }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>

            <v-select label="departamento" v-model="departamento_selected" :items="lst_departamentos" item-value="id_departamento" item-text="nombre"
                style="max-width: 300px;" filled @change="fnGetOrdenesTrabajoByDepartamento">
            
                <template v-slot:prepend-item>
                     <v-list-item @click="fnGetOrdenesTrabajoByDepartamento()">Todos</v-list-item>
                </template>

            </v-select>

            <v-btn large color="secondary" @click="fnGetOrdenesTrabajoByDepartamento()">Buscar</v-btn>
        </div>
        </div>

        <v-card color="secondary" elevation=1 class="mb-10 rounded  d-flex justify-space-between align-center px-10" height="100">
            <span class="text-h4 white--text" >Total de actividades {{total_actividad_realizada}} de {{total_actividad_restantes}}</span>            
            <v-progress-linear height="80" color="secondary lighten-5" style="width: 500px;" :value="getPorcentajeAvance(total_actividad_realizada, total_actividad_restantes)">
                <strong class="text-h4 white--text">{{
                        numeral(getPorcentajeAvance(total_actividad_realizada,
                        total_actividad_restantes)).divide(100).format('0%')
                        }}</strong>
                </v-progress-linear>
        </v-card>

        <v-data-table :headers="headers" :items="lst_ordenes_trabajo" class="table-pv rounded-xl elevation-5"
            hide-default-footer :page.sync="page" :items-per-page="itemsPerPage">

            <template v-slot:top="{ pagination }">
                <div class="d-flex justify-end align-center">
                    <span class="mr-2 text-caption">filas por pagina</span>
                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount
                        }}</span>
                    <v-pagination circle :total-visible="0" v-model="page"
                        :length="pagination.pageCount"></v-pagination>
                </div>
            </template>

            <template v-slot:footer="{ props }">
                <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template>

            <template v-slot:item.nombre_evento="{ value, item }">
                <span @click="fnGetDepartamentoActividades(item.id_orden_trabajo)"
                    class="text-decoration-underline blue--text text--darken-5" style="cursor: pointer;">{{ value }}</span>
            </template>

            <template v-slot:item.responsable="{item}">
                {{ item.nombre }} <span class="font-weight-bold">{{
                                        item.apellido_paterno }}</span> <span class="font-italic">{{
                                        item.apellido_materno }}</span>
            </template>

            <template v-slot:item.actividades="{ value, item }">
                <div class="d-flex" style="column-gap: 10px;">
                <span class="font-weight-bold">actividades {{ item.actividad_completadas }}/{{ item.actividad_totales }}</span>
                <v-progress-linear style="max-width: 300px;" :color="getPorcentajeAvance(item.actividad_completadas, item.actividad_totales)==100?'success':'amber'" height="25"
                    :value="getPorcentajeAvance(item.actividad_completadas, item.actividad_totales)">
                    <strong>{{
                        numeral(getPorcentajeAvance(item.actividad_completadas,
                            item.actividad_totales)).divide(100).format('0%')
                        }}</strong>
                </v-progress-linear>
            </div>
            </template>

        </v-data-table>

        <v-dialog v-model="dialog_actividades" width="600" persistent scrollable>

            <v-card>
                <v-toolbar color="secondary" dark elevation="0">
                    <v-toolbar-title>Detalle de actividades</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_actividades = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-divider style="min-height: 3px;" class="primary"></v-divider>

                <v-list three-line>
                    <template v-for="(item, index) in lst_actividades">
                        <v-list-item class="list-pv">
                            <v-list-item-content>
                                <v-list-item-title> <v-icon>mdi-calendar-check</v-icon>.- {{ item.actividad
                                    }}</v-list-item-title>
                                <v-list-item-subtitle><v-icon small>mdi-account-hard-hat-outline</v-icon>
                                    <span>reponsable:</span> {{ item.nombre }} <span class="font-weight-bold">{{
                                        item.apellido_paterno }}</span> <span class="font-italic">{{
                                        item.apellido_materno }}</span></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-tooltip bottom v-if="item.estatus == 1">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" color="success">mdi-clock</v-icon>
                                    </template>
                                    <span>
                                        Terminada
                                    </span>
                                </v-tooltip>

                                <v-tooltip bottom v-else>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" color="warning">mdi-clock-start</v-icon>
                                    </template>
                                    <span>
                                        en proceso
                                    </span>
                                </v-tooltip>

                            </v-list-item-action>
                        </v-list-item>
                        <v-divider inset v-if="index < lst_actividades.length - 1"></v-divider>
                    </template>
                </v-list>

            </v-card>

        </v-dialog>

    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getReporteOrdenTrabajoDepartamentos, getReporteOrdenTrabajoByDepartamentoOrAll, getReporteOrdenTrabajoActividades } from '@/services/orden_trabajo_service'
import {getSociosByAccionNumeroClasificacionService} from '@/services/socios_service'
import numeral from 'numeral'

const headers = [
    { text: 'Orden de trabajo', value: 'nombre_evento' },
    { text: 'Descripcion Orden de trabajo', value: 'descripcion',width:400 },
    { text: 'Responsable', value: 'responsable' },
    { text: 'Departamento solicito', value: 'departamento_solicito' },
    { text: 'Departamento atiende', value: 'departamento_atiende' },
    { text: 'Actividades', value: 'actividades',width:500 },
    // { text: 'Avance', value: 'avace' },
    // { text: 'porcentaje', value: 'porcent' }
]

const folio=ref()

const search_usuarios=ref()
const lst_usuarios=ref([])

const menu_usuario_reporte=ref(false)
const usuerio_reporte_text=ref()
const usuerio_reporte_id=ref()


const lst_ordenes_trabajo = ref([])

const lst_departamentos = ref([])

const lst_actividades = ref([])

const departamento_selected=ref()

const page = ref(1);
const itemsPerPage = ref(10);

const dialog_actividades = ref(false)

const total_actividad_realizada=computed(()=>lst_ordenes_trabajo.value.map(i=>i.actividad_completadas).reduce((acu,value)=>acu+numeral(value).value(),0))
const total_actividad_restantes=computed(()=>lst_ordenes_trabajo.value.map(i=>i.actividad_totales).reduce((acu,value)=>acu+numeral(value).value(),0))

onMounted(() => {
    fnGetDEpartamentos()
})


async function fnGetDEpartamentos() {
    try {
        lst_departamentos.value = await getReporteOrdenTrabajoDepartamentos();
    } catch (error) {

    }
}

async function fnGetOrdenesTrabajoByDepartamento(id_departamento) {

    console.log("🚀 ~ file: view_reporte_orden_trabajo.vue:178 ~ fnGetOrdenesTrabajoByDepartamento ~ id_departamento:", id_departamento);

    try {
        if(!Boolean(id_departamento)){
            console.log("regresa a departamento_selected a un defined")    
            departamento_selected.value=undefined
        }
        lst_ordenes_trabajo.value = await getReporteOrdenTrabajoByDepartamentoOrAll(id_departamento,folio.value,usuerio_reporte_id.value)
    } catch (error) {

    }
}

async function fnGetDepartamentoActividades(id_orden_trabajo) {
    try {
        lst_actividades.value = await getReporteOrdenTrabajoActividades(id_orden_trabajo)
        dialog_actividades.value = true
    } catch (error) {

    }
}

function getPorcentajeAvance(completadas, totales) {
    const porcentaje = numeral(100).multiply(completadas).divide(totales).value()
    return isNaN(porcentaje) ? 0 : porcentaje
}

async function fnBuscarSocios()
{

  let indexTripartidas = -1;
  let numero_accion = 0;
  let clasificacion = 0;

  if (search_usuarios.value.indexOf("A") > -1) {
    indexTripartidas = search_usuarios.value.indexOf("A");
    clasificacion = 1;
  } else if (search_usuarios.value.indexOf("B") > -1) {
    indexTripartidas = search_usuarios.value.indexOf("B");
    clasificacion = 2;
  } else if (search_usuarios.value.indexOf("C") > -1) {
    indexTripartidas = search_usuarios.value.indexOf("C");
    clasificacion = 3;
  }

  numero_accion = search_usuarios.value;

  if (indexTripartidas > -1) {
    numero_accion = search_usuarios.value.substr(0, indexTripartidas);
  }

  console.log("numero_accion:", numero_accion);
  console.log("clasificacion:", clasificacion);

try {
  lst_usuarios.value=await getSociosByAccionNumeroClasificacionService(numero_accion,clasificacion)
} catch (error) {
  
}
}


</script>
<style>
.list-pv .v-list-item__title,
.v-list-item__subtitle {
    flex: 1 1 100%;
    overflow: visible !important;
    text-overflow: unset !important;
    white-space: initial !important;
}
</style>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import dayjs from "dayjs";
import { getActividadesReporteService,getTipoOrdenTrabajoActividadService } from '@/services/orden_trabajo_service'
import { getAllColaboradoresByAreaService } from '@/services/incidencias_service'

const fecha_inicio = ref()
const fecha_fin = ref()
const responsable = ref()
const tipo_actividad = ref()
const lst_coloboradores_departamento = ref([])
const lst_tipo_actividad=ref([])



const root = getCurrentInstance().proxy;
const headers = ref([
    { text: "Actividad", align: "center", sortable: true, value: "actividad" },
    { text: "Persona Asignada", value: "persona_asignada" },
    { text: "Tipo actividad", value: "tipo_actividad" },
    { text: "Fecha planeada", align: "right", value: "fecha_planeada" },
    { text: "Fecha finalizada", align: "right", value: "fecha_termino" },
    { text: "Terminado", value: "estatus" },
    { text: "Observaciones", value: "observacion" },
    { text: "Acciones", value: "actions" }
]);
const lst_actividades = ref([]);

const search = ref("");

const id_actividad=ref()


const page = ref(1);
const itemsPerPage = ref(10);




onMounted(() => {    
    fnGetColoboradoresByArea()
    fnGetTipoActividad()
});

async function fnGetActividades() {    
    lst_actividades.value = await getActividadesReporteService(fecha_inicio.value,fecha_fin.value,responsable.value,tipo_actividad.value,'')
}

async function fnGetColoboradoresByArea() {
    try {
        const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
        lst_coloboradores_departamento.value = await getAllColaboradoresByAreaService(cve_persona_session)
    } catch (error) {

    }
}
async function fnGetTipoActividad() {
    try {
        lst_tipo_actividad.value = await getTipoOrdenTrabajoActividadService()

    } catch (error) {

    }
}

function fnOpenFinalizar(id_actividad_) {
    id_actividad.value=id_actividad_
    dialog_finalizar.value = true
}

function fnCloseFinalizar()
{
    id_actividad.value=undefined
    fecha_finalizar.value=undefined
    observaciones.value=undefined
    dialog_finalizar.value=false
}



</script>

<template>
    <div>
        <div class="d-flex justify-space-between">

            <h1 class="accent--text oswald--text">Revision de actividades orden trabajo</h1>
        </div>


        <div class="d-flex justify-end mb-10" style="column-gap: 35px;">
            <v-menu max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-on="on" v-bind="attrs" :value="Boolean(fecha_inicio) ? dayjs(fecha_inicio).format('DD [de] MMM [de] YYYY') : ''"
                        label="fecha inicio" filled style="max-width: 350px;" prepend-inner-icon="mdi-calendar" hide-details>                        
                    </v-text-field>
                </template>                
                <v-date-picker v-model="fecha_inicio"  ></v-date-picker>                
            </v-menu>
            
            <v-menu max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-on="on" v-bind="attrs" :value="Boolean(fecha_fin) ? dayjs(fecha_fin).format('DD [de] MMM [de] YYYY') : ''"
                        label="fecha fin" filled style="max-width: 350px;" prepend-inner-icon="mdi-calendar" hide-details>                        
                    </v-text-field>
                </template>                
                <v-date-picker v-model="fecha_fin"></v-date-picker>                
            </v-menu>

            <v-select label="Persona asignada" style="max-width:350px" v-model="responsable"
                :items="lst_coloboradores_departamento" item-value="id_colaborador"
                :item-text="(item) => `${item.nomina} - ${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`"
                filled hide-details >

            </v-select>

            <v-select label="Tipo actividad" style="max-width:350px" v-model="tipo_actividad"
                :items="lst_tipo_actividad" item-value="id_orden_trabajo_actividad"
                item-text="nombre"
                filled hide-details >

            </v-select>

            <v-btn large color="primary" @click="fnGetActividades"><v-icon>mdi-magnify</v-icon> Buscar</v-btn>
        </div>

        <v-data-table :headers="headers" :items="lst_actividades" :search="search" :page.sync="page"
            :items-per-page="itemsPerPage" class="table-pv rounded-xl elevation-5" hide-default-footer>
            <template v-slot:top="{ pagination }">
                <div class="d-flex justify-end align-center">
                    <span class="mr-2 text-caption">filas por pagina</span>
                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
                    <v-pagination circle :total-visible="0" v-model="page"
                        :length="pagination.pageCount"></v-pagination>
                </div>
            </template>

            <template v-slot:footer="{ props }">
                <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template>

            <template v-slot:item.persona_asignada="{ item }">
                <span>{{ item.nombre }}</span>
                <span class="mx-1 font-weight-bold">{{ item.apellido_paterno }}</span>
                <span class="font-italic">{{ item.apellido_materno }}</span>
            </template>

            <template v-slot:item.fecha_planeada="{ value }">
                <span class="font-weight-black accent--text">
                    {{ dayjs(value).format("DD [de] MMMM [de] YYYY") }}
                </span>
            </template>
            <template v-slot:item.fecha_termino="{ value }">
                <span class="font-weight-black accent--text">
                    {{ dayjs(value).format("DD [de] MMMM [de] YYYY") }}
                </span>
            </template>
            
            <template v-slot:item.estatus="{ value }">
                <span v-if="value==1" class="font-weight-black primary--text">                    
                    Si
                </span>
                <span v-else class="font-weight-black secondary--text">No</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-if="item.estatus==0" v-on="on" small color="secondary" @click="fnOpenFinalizar(item.id_orden_trabajo_actividad)">finalizar actividad</v-btn>
                    </template>
                    <span>Finalizar Actividad</span>
                </v-tooltip>
            </template>
        </v-data-table>


    </div>
</template>
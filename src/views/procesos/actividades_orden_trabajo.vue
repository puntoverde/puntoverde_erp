<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";
import { getConceptosService } from '@/services/concepto_service'
import dayjs from "dayjs";
import { getActividadesByDepartamentoService, getActividadesByDepartamentoPendientesService,finalizarActividadesByDepartamentoService } from '@/services/orden_trabajo_service'
import { getAllColaboradoresByAreaService } from '@/services/incidencias_service'

const fecha = ref(dayjs().format('YYYY-MM-DD'))
const responsable = ref()
const lst_coloboradores_departamento = ref([])



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
const lst_actividades_fechas_pendientes = ref([]);
const search = ref("");

const id_actividad=ref()

const dialog_finalizar = ref(false)
const fecha_finalizar = ref()
const observaciones = ref()

const page = ref(1);
const itemsPerPage = ref(10);




onMounted(() => {
    fnGetActividades()
    fnGetColoboradoresByArea()
});

async function fnGetActividades() {
    const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
    lst_actividades.value = await getActividadesByDepartamentoService(cve_persona_session, fecha.value, responsable.value)
    fnGetActividadesPendientes()
}

async function fnGetActividadesPendientes() {
    const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
    lst_actividades_fechas_pendientes.value = await getActividadesByDepartamentoPendientesService(cve_persona_session, responsable.value)
}

async function fnGetColoboradoresByArea() {
    try {
        const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
        lst_coloboradores_departamento.value = await getAllColaboradoresByAreaService(cve_persona_session)
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

async function finalizarActividad()
{
    try {
        await finalizarActividadesByDepartamentoService(id_actividad.value,fecha_finalizar.value,observaciones.value)
        fnGetActividades()
        fnCloseFinalizar()
    } catch (error) {
        
    }
}

</script>

<template>
    <div>
        <div class="d-flex justify-space-between">

            <h1 class="accent--text oswald--text">Revision de actividades orden trabajo</h1>
        </div>


        <div class="d-flex justify-end" style="column-gap: 35px;">
            <v-menu max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="Boolean(fecha) ? dayjs(fecha).format('DD [de] MMM [de] YYYY') : ''"
                        label="dia actividad" filled style="max-width: 350px;">
                        <template v-slot:append-outer>
                            <v-badge :value="lst_actividades_fechas_pendientes.length>0" bordered color="error" icon="mdi-bell" overlap>
                                <v-btn icon v-on="on" v-bind="attrs">
                                    <v-icon>mdi-calendar</v-icon>
                                </v-btn>
                            </v-badge>
                        </template>
                    </v-text-field>
                </template>
                <!-- <v-card> -->
                <v-date-picker v-model="fecha" @input="fnGetActividades" :events="lst_actividades_fechas_pendientes.map(i=>i.fecha_planeada)" event-color="red"></v-date-picker>
                <!-- </v-card> -->
            </v-menu>

            <v-select label="Persona asignada" style="max-width:350px" v-model="responsable"
                :items="lst_coloboradores_departamento" item-value="id_colaborador"
                :item-text="(item) => `${item.nomina} - ${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`"
                filled hide-details @input="fnGetActividades">

            </v-select>
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
                    {{ dayjs(value).isValid()?dayjs(value).format("DD [de] MMMM [de] YYYY"):'' }}
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


        <v-dialog v-model="dialog_finalizar" width="500" persistent>
            <v-card>
                <v-toolbar color="secondary" dark>
                    <v-toolbar-title>Finalizar actividad</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="fnCloseFinalizar"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-item-group v-model="fecha_finalizar" class="d-flex mb-5" style="column-gap: 15px;">
                        <v-item v-slot="{ active, toggle }" class="flex-grow-1" :value="dayjs().subtract(1,'day').format('YYYY-MM-DD')">
                            <v-card rounded="lg" :class="{'primary lighten-3':active}" outlined @click="toggle">
                                <v-card-text class="text-center">
                                    <h1>Ayer</h1>
                                </v-card-text>
                                <v-card-actions class="justify-center">
                                    {{ dayjs().subtract(1,'day').format('DD-MMMM-YYYY') }}
                                </v-card-actions>
                            </v-card>
                    </v-item>
                        <v-item v-slot="{ active, toggle }" class="flex-grow-1" :value="dayjs().format('YYYY-MM-DD')">
                            <v-card rounded="lg" :class="{'primary lighten-3':active}" outlined @click="toggle">
                                <v-card-text class="text-center">
                                    <h1>Hoy</h1>
                                </v-card-text>
                                <v-card-actions class="justify-center">
                                    {{ dayjs().format('DD-MMMM-YYYY') }}
                                </v-card-actions>
                            </v-card>
                        </v-item>
                    </v-item-group>

                    <!-- <v-menu max-width="290">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                :value="Boolean(fecha_finalizar) ? dayjs(fecha_finalizar).format('DD [de] MMM [de] YYYY') : ''"
                                v-on="on" v-bind="attrs" label="dia actividad" filled prepend-inner-icon="mdi-calendar">
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="fecha_finalizar"></v-date-picker>
                    </v-menu> -->

                    <v-textarea label="descripcion" v-model="observaciones" filled></v-textarea>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="finalizarActividad" color="secondary"> <v-icon>mdi-check</v-icon> Finalizar actividad</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>
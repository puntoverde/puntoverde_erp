<template>
    <div>
        <div class="d-flex justify-space-between">
            <h1 class="accent--text oswald--text">Reporte Vacaciones</h1>
        </div>
        <v-toolbar color="grey" rounded>
            <span class="text-h6 font-weight-bold white--text">Buscar por departamento</span>
            <v-spacer></v-spacer>
            <div class="d-flex align-center" style="column-gap: 5px;">
                <v-text-field v-model="nombre" label="Nombre" hide-details solo clearable></v-text-field>
                <v-text-field v-model="nomina" label="Nomina" hide-details solo clearable></v-text-field>
                <v-select v-model="area" :items="lst_areas" item-value="id_area_rh" item-text="area_" label="Departamento" hide-details solo clearable></v-select>
                <v-btn large @click="fnReporteVacaciones">
                    <v-icon>mdi-magnify</v-icon>
                    Buscar</v-btn>
            </div>
        </v-toolbar>

        <v-container fluid>
            <v-card class="mt-5" rounded="xl">
                <v-list>
                    <template v-for="item in lst_vacaciones">
                        <v-list-item @click="fnReporteVacacionesByAnio(item.id_colaborador)">
                            <v-list-item-icon>
                                <v-chip>{{ item.nomina }}</v-chip>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <span>{{ item.nombre }}</span>
                                    <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
                                    <span class="font-italic">{{ item.apellido_materno }}</span>
                                </v-list-item-title>
                                <v-list-item-subtitle>Departamento: {{ item.area_ }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <div>Vacaciones disponibles: <span class="font-weight-bold mx-1">{{ item.dias_vacaciones
                                        }}</span></div>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider></v-divider>
                    </template>
                </v-list>
            </v-card>
        </v-container>

        <v-dialog v-model="dialog" width="700" scrollable persistent>
            <v-card rounded="xl" >
                <v-toolbar elevated="0">
                    <v-toolbar-title>
                        vacaciones por año
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="fnCloseDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-list>
                                <v-list-item v-for="item2 in lst_vacaciones_by_anio" @click="fnReporteVacacionesByAnioDetalle(item2.cve_colaborador,item2.anio)">
                                    <v-list-item-content>
                                        <v-list-item-title>Año <span class="font-weight-bold mx-1">{{ item2.anio }}</span></v-list-item-title>
                                        <v-list-item-subtitle>
                                            tomadas {{ item2.no_libres }},
                                            disponibles:{{ item2.libres }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                        total
                                {{ item2.total }}
                            </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-col>
                        <v-divider vertical></v-divider>
                        <v-col cols="12" md="6">
                            <v-list>
                                <v-list-item v-for="item3 in lst_vacaciones_by_anio_detalle">
                                    <v-list-item-content v-if="item3?.fecha_vacaciones">
                                        <v-list-item-title>Dia {{ item3.fecha_vacaciones }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            descripcion: {{ item3.descripcion }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-list-item-content v-else>
                                        <v-list-item-title>Dia disponible</v-list-item-title>                                        
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getReporteVacacionesService, getReporteVacacionesByAnioServices, getReporteVacacionesByAnioDetalleServices,getReporteVacacionesAreaServices } from '@/services/reporte_vacaciones'


//#region variables
const lst_vacaciones = ref([])
const lst_vacaciones_by_anio=ref([])
const lst_vacaciones_by_anio_detalle=ref([])
const lst_areas=ref([])
const nombre=ref()
const nomina=ref()
const area=ref()

const dialog = ref(false)
//#endregion variables

//#region funciones
async function fnReporteVacaciones() {
    try {
        lst_vacaciones.value = await getReporteVacacionesService(nombre.value,nomina.value,area.value)
    } catch (error) {

    }
}

async function fnReporteVacacionesByAnio(id_colaborador_) {
    console.log(id_colaborador_)
    try {
        lst_vacaciones_by_anio.value=await getReporteVacacionesByAnioServices(id_colaborador_)
        dialog.value = true
    } catch (error) {

    }
}

async function fnReporteVacacionesByAnioDetalle(id_colaborador_,anio_) {
    try {
        lst_vacaciones_by_anio_detalle.value= await getReporteVacacionesByAnioDetalleServices(id_colaborador_,anio_)
    } catch (error) {

    }
}

async function fnReporteVacacionesArea()
{
    try {
        lst_areas.value=await getReporteVacacionesAreaServices()
    } catch (error) {
        
    }
}

function fnCloseDialog()
{
    lst_vacaciones_by_anio.value=[]
    lst_vacaciones_by_anio_detalle.value=[]
    dialog.value=false
}
//#endregion funciones

onMounted(() => {
    // fnReporteVacaciones()
    fnReporteVacacionesArea()
})

</script>
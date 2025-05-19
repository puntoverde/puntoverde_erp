<template>
    <div>
        <v-card class="mb-5">
            <v-toolbar elevation="0">
                <v-toolbar-title>Reporte orden trabajo interno</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-card-text class="d-flex justify-end" style="column-gap: 10px;">
                <!-- <v-text-field v-model="folio" label="folio" hide-details filled style="max-width: 350px;"></v-text-field> -->
            
                <!-- estatus 0.-sin iniciar 1.-trabajando 2.-terminado 3.-cancelado 4.- rechazado -->
                <v-select v-model="estatus" label="estatus" hide-details filled style="max-width: 350px;" clearable :items="[{value:0,text:'sin iniciar'},{value:1,text:'trabajando'},{value:2,text:'terminado'},{value:3,text:'cancelado'},{value:4,text:'rechazado'}]" ></v-select>
                <v-btn @click="getOrdenTrabajoReporteSocios" color="secondary" large> <v-icon>mdi-magnify</v-icon> buscar</v-btn>
            </v-card-text>
        </v-card>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <!-- <th>Folio</th> -->
                        <th>Departamento aquien se dirije</th>
                        <th>Orden trabajo</th>
                        <th>Colaborador alta</th>
                        <th>Accion</th>
                        <th>Fecha alta</th>
                        <th>actividades totales</th>
                        <th>porcentaje avance</th>                        
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="orden in lst_ordenes_trabajo">
                        <!-- <td>{{ orden.folio }}</td> -->
                        <td>{{ orden.departamento }}</td>
                        <td>{{ orden.nombre_evento }}</td>
                        <td><span>{{ orden.nombre }}</span>  <span class="font-weight-bold">{{orden.apellido_paterno}}</span> <span class="font-italic">{{ orden.apellido_materno }}</span></td>
                        <td>{{ orden.accion_socio }}</td>
                        <td>{{ dayjs(orden.fecha_registro).format('DD [de] MMMM [de] YYYY HH:mm') }}</td>
                        <td>{{ orden.actividades }}</td>
                        <td>{{ orden.actividades_finalizada }} de {{ orden.actividades_pendiente }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {getReporteInternoOrdenTrabajoService} from '@/services/orden_trabajo_service'
import dayjs from 'dayjs';

const folio=ref()
const estatus=ref()
const lst_ordenes_trabajo=ref([])


async function getOrdenTrabajoReporteSocios()
{

    try {
        lst_ordenes_trabajo.value=await getReporteInternoOrdenTrabajoService(folio.value,estatus.value)
    } catch (error) {
        
    }

}


</script>
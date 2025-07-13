<template>
    <div>
        <h1 class="accent--text">Reporte de Cursos de Verano</h1>


        <v-card class="blue-grey lighten-5 mt-3" rounded="xl" style="height: calc(100vh - 200px);">

            <v-tabs v-model="tab" color="secondary" fixed-tabs icons-and-text>
                <v-tab> <span class="font-weight-bold text-h6">Todo</span> <v-icon
                        size="30">mdi-numeric-1-circle-outline</v-icon></v-tab>
                <v-tab><span class="font-weight-bold text-h6">Grupos</span> <v-icon
                        size="30">mdi-numeric-2-circle-outline</v-icon></v-tab>
                <v-tab><span class="font-weight-bold text-h6">Tipo inscripcion</span> <v-icon
                        size="30">mdi-numeric-3-circle-outline</v-icon></v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-card-text class="redx" style="height: 90%; overflow-y: auto;">


                <v-tabs-items v-model="tab">
                    <v-tab-item>
                        <v-data-table id="tabla" :headers="headersTablaAll" :items="lst_todo" :page.sync="page"
                            :items-per-page="itemsPerPage" :search="search" :calculate-widths="true"
                            class="table-pv rounded-xl elevation-5" hide-default-footer>

                            <template v-slot:top="{ pagination }">
                                <div class="d-flex justify-end align-center">
                                    <v-btn color="#0f783e" class="white--text" rounded
                                        @click="fnExportarExcel('todo')"><v-icon>mdi-file-excel</v-icon>Exportar</v-btn>
                                    <v-spacer></v-spacer>
                                    <span class="mr-2 text-caption">filas por pagina</span>
                                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px"
                                        :items="[5, 10, 50]" />
                                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{
                                        pagination.pageCount
                                    }}</span>
                                    <v-pagination circle :total-visible="0" v-model="page"
                                        :length="pagination.pageCount"></v-pagination>
                                </div>
                            </template>

                            <template v-slot:footer="{ props }">
                                <div>{{ props.pagination.itemsLength }} registro(s)</div>
                            </template>

                            <template v-slot:item.socio="{ item }">
                                {{ item.nombre }} <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
                                <span class="font-italic">{{ item.apellido_materno }}</span>
                            </template>


                            <template v-slot:item.nadar="{ value }">
                                <span v-if="value == 1" class="primary--text font-weight-bold">Si</span>
                                <span v-else class="secondary--text font-weight-bold">No</span>
                            </template>

                            <template v-slot:item.acciones_dueno="{ value }">
                                <span v-if="value">{{ value }}</span>
                            </template>

                            <template v-slot:item.estatus="{ item, value }">
                                
                                <v-icon v-if="Boolean(parseInt(item.estatus))" color="success">mdi-check-circle </v-icon>
                                <v-icon v-else color="error">mdi-close-circle</v-icon>
                            </template>

                            <template v-slot:item.estatus_accion="{ value }">
                                <v-chip color="success" v-if="value == 1">Activo</v-chip>
                                <v-chip color="error" v-else-if="value == 2">Inactivo</v-chip>
                                <v-chip color="warning" v-else-if="value == 3">Bloqueada</v-chip>
                                <v-chip color="info" v-else>No accion</v-chip>
                            </template>

                            <template v-slot:item.detalles="{ item }">
                                <v-btn @click="cargarDetalle(item);" v-if="item.cve_socio" color="secondary" rounded
                                    elevation="2" :loading="item.loading" style="text-transform: none;">
                                    <v-icon class="mr-2">mdi-eye</v-icon>Ver detalle
                                </v-btn>
                            </template>

                        </v-data-table>
                    </v-tab-item>

                    <v-tab-item>
                        <div class="d-flex">
                            <div class="d-flex flex-column pr-2" style="min-width: 250px;row-gap: 10px;">
                                <v-card width="100%" height="50px" color="blue-grey d-flex" v-for="grupo_ in lst_grupos"
                                    @click="getInscripcionesGrupo(grupo_.cve_curso_verano_programa_grupo)">
                                    <div class="redx white--text text-subtitle-1 pl-2 d-flex align-center"
                                        style="width: calc(100% - 50px);">
                                        {{ grupo_.nombre }}
                                    </div>
                                    <div class="bluex d-flex justify-center align-center" style="width: 50px;">
                                        <span class="white py-1 px-2 rounded-xl text-h6">{{ grupo_.cupo_actual }}-{{ grupo_.bajas }}</span>
                                    </div>
                                </v-card>
                            </div>
                            <v-data-table id="tabla" :headers="headersTablaAll" :items="lst_todo_grupos"
                                :page.sync="page" :items-per-page="itemsPerPage" :search="search"
                                :calculate-widths="true" class="table-pv rounded-xl elevation-5" hide-default-footer
                                style="width: calc(100% - 250px);">

                                <template v-slot:top="{ pagination }">
                                    <div class="d-flex justify-end align-center">
                                        <v-btn color="#0f783e" class="white--text" rounded
                                            @click="fnExportarExcel('grupo')"><v-icon>mdi-file-excel</v-icon>
                                            Exportar</v-btn>
                                        <v-spacer></v-spacer>
                                        <span class="mr-2 text-caption">filas por pagina</span>
                                        <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px"
                                            :items="[5, 10, 50]" />
                                        <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{
                                            pagination.pageCount
                                            }}</span>
                                        <v-pagination circle :total-visible="0" v-model="page"
                                            :length="pagination.pageCount"></v-pagination>
                                    </div>
                                </template>

                                <template v-slot:footer="{ props }">
                                    <div>{{ props.pagination.itemsLength }} registro(s)</div>
                                </template>

                                <template v-slot:item.socio="{ item }">
                                    {{ item.nombre }} <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
                                    <span class="font-italic">{{ item.apellido_materno }}</span>
                                </template>


                                <template v-slot:item.nadar="{ value }">
                                    <span v-if="value == 1" class="primary--text font-weight-bold">Si</span>
                                    <span v-else class="secondary--text font-weight-bold">No</span>
                                </template>

                                <template v-slot:item.acciones_dueno="{ value }">
                                    <span v-if="value">{{ value }}</span>
                                </template>

                                <template v-slot:item.estatus="{ item, value }">
                                    <v-icon v-if="Boolean(parseInt(item.estatus))" color="success">mdi-check-circle </v-icon>
                                <v-icon v-else color="error">mdi-close-circle</v-icon>
                                </template>

                                <template v-slot:item.estatus_accion="{ value }">
                                    <v-chip color="success" v-if="value == 1">Activo</v-chip>
                                    <v-chip color="error" v-else-if="value == 2">Inactivo</v-chip>
                                    <v-chip color="warning" v-else-if="value == 3">Bloqueada</v-chip>
                                    <v-chip color="info" v-else>No accion</v-chip>
                                </template>

                                <template v-slot:item.detalles="{ item }">
                                    <v-btn @click="cargarDetalle(item);" v-if="item.cve_socio" color="secondary" rounded
                                        elevation="2" :loading="item.loading" style="text-transform: none;">
                                        <v-icon class="mr-2">mdi-eye</v-icon>Ver detalle
                                    </v-btn>
                                </template>

                            </v-data-table>
                        </div>
                    </v-tab-item>

                    <v-tab-item>

                        <div class="d-flex pl-2 py-3" style="column-gap: 10px;">

                            <v-btn color="secondary" @click="getInscripcionesTipo('S')">Socios</v-btn>
                            <v-btn color="secondary" @click="getInscripcionesTipo('I')">Invitados</v-btn>
                            <v-btn color="secondary" @click="getInscripcionesTipo('C')">Colaboradores</v-btn>

                        </div>

                        <v-data-table id="tabla" :headers="headersTablaAll" :items="lst_todo_tipo" :page.sync="page"
                            :items-per-page="itemsPerPage" :search="search" :calculate-widths="true"
                            class="table-pv rounded-xl elevation-5" hide-default-footer>

                            <template v-slot:top="{ pagination }">
                                <div class="d-flex justify-end align-center">
                                    <v-btn color="#0f783e" class="white--text" rounded
                                        @click="fnExportarExcel('tipo')"><v-icon>mdi-file-excel</v-icon>
                                        Exportar</v-btn>
                                    <v-spacer></v-spacer>
                                    <span class="mr-2 text-caption">filas por pagina</span>
                                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px"
                                        :items="[5, 10, 50]" />
                                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{
                                        pagination.pageCount
                                    }}</span>
                                    <v-pagination circle :total-visible="0" v-model="page"
                                        :length="pagination.pageCount"></v-pagination>
                                </div>
                            </template>

                            <template v-slot:footer="{ props }">
                                <div>{{ props.pagination.itemsLength }} registro(s)</div>
                            </template>

                            <template v-slot:item.socio="{ item }">
                                {{ item.nombre }} <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
                                <span class="font-italic">{{ item.apellido_materno }}</span>
                            </template>


                            <template v-slot:item.nadar="{ value }">
                                <span v-if="value == 1" class="primary--text font-weight-bold">Si</span>
                                <span v-else class="secondary--text font-weight-bold">No</span>
                            </template>

                            <template v-slot:item.acciones_dueno="{ value }">
                                <span v-if="value">{{ value }}</span>
                            </template>

                            <template v-slot:item.estatus="{ item, value }">
                                <v-icon v-if="Boolean(parseInt(item.estatus))" color="success">mdi-check-circle </v-icon>
                                <v-icon v-else color="error">mdi-close-circle</v-icon>
                            </template>

                            <template v-slot:item.estatus_accion="{ value }">
                                <v-chip color="success" v-if="value == 1">Activo</v-chip>
                                <v-chip color="error" v-else-if="value == 2">Inactivo</v-chip>
                                <v-chip color="warning" v-else-if="value == 3">Bloqueada</v-chip>
                                <v-chip color="info" v-else>No accion</v-chip>
                            </template>

                            <template v-slot:item.detalles="{ item }">
                                <v-btn @click="cargarDetalle(item);" v-if="item.cve_socio" color="secondary" rounded
                                    elevation="2" :loading="item.loading" style="text-transform: none;">
                                    <v-icon class="mr-2">mdi-eye</v-icon>Ver detalle
                                </v-btn>
                            </template>

                        </v-data-table>
                    </v-tab-item>

                </v-tabs-items>


            </v-card-text>
        </v-card>





        <v-snackbar v-model="snackbar">Se actualizo el estatus del socio correctamente</v-snackbar>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getDataReporteCursoService, getGrupoCursoVeranoService } from "@/services/curso_verano_service.js"
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from 'dayjs';


const lst_todo = ref([])
const lst_todo_grupos = ref([])
const lst_todo_tipo = ref([])
const lst_grupos = ref([])


const tab = ref(0)

const headersTablaAll = [
    { text: "Folio", value: "folio_pago" },
    { text: "Folio Boleta", value: "folio_boleta" },
    { text: "Nombre completo", value: "socio" },
    { text: "Genero", value: "sexo" },
    { text: "Fecha Nacimiento", value: "fecha_nacimiento" },
    { text: "Edad", value: "edad" },
    { text: "Responsable", value: "responsable" },
    { text: "Telefono Contacto", value: "telefono_contacto" },
    { text: "Calle", value: "calle_numero" },
    { text: "Colonia", value: "colonia" },
    { text: "Semanas", value: "semanas" },
    { text: "Semana 1", value: "semana1" },
    { text: "Semana 2", value: "semana2" },
    { text: "Semana 3", value: "semana3" },
    { text: "Semana 4", value: "semana4" },
    { text: "Sabe Nadar", value: "nadar" },
    { text: "Programa", value: "programa" },
    { text: "Grado", value: "grupo" },
    { text: "Fecha Inscripcion", value: "fecha_inscripcion" },
    { text: "Numero Accion", value: "accion" },
    { text: "Estatus usuario", value: "estatus" },
    // { text: "Acciones", value: "detalles", width: "150px" },
]





const page = ref(1);
const itemsPerPage = ref(10);



async function cargarTabla() {

    try {

        lst_todo.value = await getDataReporteCursoService(1)

    } catch (error) {
    }
    finally {

    }

}


async function fnGetGruposCursoVerano() {
    const data = await Promise.allSettled([getGrupoCursoVeranoService(1), getGrupoCursoVeranoService(2)])
    lst_grupos.value = data.filter(i => i.status == 'fulfilled').map(i => i.value).flat()
}

function getInscripcionesGrupo(id_grupo) {
    console.log(id_grupo)
    lst_todo_grupos.value = lst_todo.value.filter(i => i.cve_curso_verano_programa_grupo == id_grupo)
}


function getInscripcionesTipo(tipo) {
    // console.log(id_grupo)
    lst_todo_tipo.value = lst_todo.value.filter(i => i.tipo == tipo)
}

function fnExportarExcel(tipo_reporte) {

    //tipo reporte 1.todo 2.grupos 3.tipo(socios,invitados,colaboradores)

    console.log(tipo_reporte)

    let data=[]

    if (tipo_reporte == 'todo') {
        data=lst_todo.value
    }
    else if(tipo_reporte =='grupo')
    {
        data=lst_todo_grupos.value
    }
    else if(tipo_reporte=='tipo')
    {
        data=lst_todo_tipo.value
    }



    //crea el libro excel
    let wb = XLSX.utils.book_new();
    //crea la hoja para el libro de excel
    wb.SheetNames.push("reporte_cursos_verano");
    //se obtienen los datos a exportar 
    let ws_data1 = data.map(item => [
        item.folio_pago,
        item.folio_boleta,
        `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,
        item.sexo,
        item.fecha_nacimiento,
        item.edad,
        item.responsable,
        item.telefono_contacto,
        item.calle_numero,
        item.colonia,
        item.semanas,
        item.semana1 ? '-' : '',
        item.semana2 ? '-' : '',
        item.semana3 ? '-' : '',
        item.semana4 ? '-' : '',
        item.nadar == 1 ? 'Si' : 'No',
        item.programa,
        item.grupo,
        item.fecha_inscripcion,
        item.accion,
        item.estatus == 1 ? 'activo' : 'baja',
        item.tipo == 'S' ? 'Socio' : item.tipo == 'I' ? 'Invitado' : 'Colaborador'
    ]);

    // console.log(ws_data1)



    let ws_data = [[
        'Folio',
        'Folio Boleta',
        'Nombre Completo',
        'Genero',
        'Fecha Nacimiento',
        'Edad',
        'Responsable',
        'Telefono Contacto',
        'Calle',
        'Colonia',
        'Semanas',
        'Semana1',
        'Semana2',
        'Semana3',
        'Semana4',
        'Sabe Nadar',
        'Programa',
        'Grupo',
        'Fecha Inscripcion',
        'Accion',
        'Estatus',
        'Tipo',
    ], ...ws_data1];

    // console.log(ws_data)
    let ws = XLSX.utils.aoa_to_sheet(ws_data, { origin: "B2" });

    wb.Sheets["reporte_cursos_verano"] = ws;

    let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `reporte_curso_verano_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);

}


onMounted(() => {


    cargarTabla()
    fnGetGruposCursoVerano()

})


</script>
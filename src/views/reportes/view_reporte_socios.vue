<template>
    <div>
        <h1 class="accent--text">Reporte de Usuarios</h1>
        <v-row justify="start" class="mb-5 mt-1">
            <v-col lg="3">
                <v-text-field v-model="nombre" label="Nombre del socio" outlined dense background-color="white" style="width: 350px;" hide-details></v-text-field>
            </v-col>

            <v-col lg="2">
                <v-text-field v-model="accion" label="Accion" outlined dense background-color="white" prepend-inner-icon="mdi-format-list-numbered" hide-details></v-text-field>
            </v-col>
            <v-col lg="2" class="d-flex align-center" style="column-gap: 15px;">
                <span class="text-subtitle-2">Estatus</span>
                <v-radio-group row v-model="estatus" class="mt-0" hide-details>
                    <v-radio :value="1" label="Activo" color="primary"></v-radio>
                    <v-radio :value="0" label="Inactivo" color="primary"></v-radio>
                </v-radio-group>
            </v-col>

            <v-col lg="3">
                <v-btn class="white--text mt-3" color="blue" @click="cargarTabla" :loading="loading">
                    <v-icon>mdi-magnify</v-icon>Buscar
                </v-btn>
            </v-col>
        </v-row>
        

        <v-data-table id="tabla" :headers="headersTabla" :items="itemsTabla" :page.sync="page"
            :items-per-page="itemsPerPage" :search="search" :calculate-widths="true" class="table-pv rounded-xl elevation-5"
            hide-default-footer>

            <template v-slot:top="{ pagination }">
                <div class="d-flex justify-end align-center">
                    <span class="mr-2 text-caption">filas por pagina</span>
                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
                    <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
                </div>
            </template>

            <template v-slot:footer="{ props }">
                <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template>

            <template v-slot:item.socio="{item}">
                 {{ item.nombre }} <span class="font-weight-bold">{{ item.apellido_paterno }}</span>  <span class="font-italic">{{ item.apellido_materno }}</span>
            </template>

            <template v-slot:item.numero_accion="{ item }">
                <label v-if="item.numero_accion === null" class="font-weight-bold text-subtitle-1 accent--text">(Socio Inactivo)</label>
                <label v-else-if="item.clasificacion == 1" class="font-weight-bold text-subtitle-1 accent--text">{{ item.numero_accion + 'A' }}-{{ item.posicion }}</label>
                <label v-else-if="item.clasificacion == 2" class="font-weight-bold text-subtitle-1 accent--text">{{ item.numero_accion + 'B' }}-{{ item.posicion }}</label>
                <label v-else-if="item.clasificacion == 3" class="font-weight-bold text-subtitle-1 accent--text">{{ item.numero_accion + 'C' }}-{{ item.posicion }}</label>
                <label v-else class="font-weight-bold text-subtitle-1 accent--text">{{ item.numero_accion }}</label>
                <label class="font-weight-bold text-subtitle-1 accent--text">{{ item.accion_name }}</label>
            </template>

            <template v-slot:item.posicion="{value}">
               <v-chip label>
                   <span class="font-weight-bold text-subtitle-1">{{ value }}</span>
               </v-chip>
            </template>
            
            <template v-slot:item.cve_accion_is_dueno="{value}">
               <span v-if="value" class="primary--text font-weight-bold">Si</span>
               <span v-else class="secondary--text">No</span>               
            </template>

            <template v-slot:item.acciones_dueno="{value}">
               <span v-if="value">{{ value }}</span>                             
            </template>

            <template v-slot:item.estatus_="{ item ,value}">              
                <v-chip color="success" v-if="Boolean(item.cve_socio) && Boolean(item.cve_accion) && value==2">Activo</v-chip>
                <v-chip color="warning" v-if="!Boolean(item.cve_socio)">No usuario</v-chip>
                <v-btn color="secondary" v-else-if="Boolean(item.cve_socio) && !Boolean(item.cve_accion)" @click="open(item.cve_socio)">Habilitar</v-btn>
            </template>

            <template v-slot:item.estatus_accion="{ value }">               
                <v-chip color="success" v-if="value == 1">Activo</v-chip>
                <v-chip color="error" v-else-if="value == 2">Inactivo</v-chip>
                <v-chip color="warning" v-else-if="value == 3">Bloqueada</v-chip>
                <v-chip color="info" v-else>No accion</v-chip>
            </template>

            <template v-slot:item.detalles="{ item }">
                <v-btn @click="cargarDetalle(item);" v-if="item.cve_socio" color="secondary" rounded elevation="2" :loading="item.loading" style="text-transform: none;">
                    <v-icon class="mr-2">mdi-eye</v-icon>Ver detalle
                </v-btn>
            </template>
            
        </v-data-table>

        <v-dialog v-model="dialog" max-width="500" scrollable persistent>
            <v-card width="500">
                <v-img id="imgSocio" contain class="white--text align-end" height="300px"
                    :src="foto">
                <!-- <v-img id="imgSocio" contain class="white--text align-end" height="300px"
                    :src="`http://192.168.2.111:85/upload/${detalle.foto}`"
                    @error="'http://192.168.2.111/upload/default.png'"> -->
                    <div style="background:rgba(55, 71, 79, 0.3);" class="text-center d-flex align-center justify-space-between pr-2">
                        <v-card-title>{{ detalle.nombre }}</v-card-title>
                        <v-menu v-model="menu_file" :close-on-click="false" :close-on-content-click="false">
                            <template v-slot:activator="{attrs}">
                        <v-btn fab small @click="open_file" v-bind="attrs"><v-icon>mdi-image</v-icon></v-btn>
                            </template>
                            <v-card>
                                <v-card-text class="text-h5 pt-5">¿Desea subir imagen?</v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn outlined @click="closeMenuConfirm">cancelar</v-btn>
                                    <v-btn color="secondary" @click="guardarFoto(detalle.cve_socio)">guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </div>
                </v-img>
                <v-card-text>
                    <v-list class="transparent" two-linexx>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-format-list-bulleted</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>Accion</b>
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ detalle.accion }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <b>Tipo Accion</b>
                                {{ detalle.tipo_accion }}
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-account-group</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>Parentesco</b>
                                </v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action class="text-right">{{ detalle.parentesco }}</v-list-item-action>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-map-marker</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>Dirección</b>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ detalle.calle }} {{ detalle.numero_exterior }} {{ detalle.colonia }} {{
                                        detalle.municipio }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-format-list-bulleted</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>Sexo</b>
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ detalle.sexo }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title class="text-right">
                                    <b>Fecha Nacimiento</b>
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-right">{{ detalle.fecha_nacimiento }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-icon>
                                <!-- <v-icon>mdi-format-list-bulleted</v-icon> -->
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>CURP</b>
                                </v-list-item-title>
                                <v-list-item-subtitle>{{ detalle.curp }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-content>
                                <v-list-item-title class="text-right">
                                    <b>RFC</b>
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-right">{{ detalle.rfc }}</v-list-item-subtitle>
                            </v-list-item-content>

                        </v-list-item>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>Fecha Ingreso</b>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ detalle.fecha_ingreso_club }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-calendar</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <b>historico</b>
                                </v-list-item-title>
                                <v-list-item-subtitle v-for="his_soc in detalle.historico?.split(',')">
                                    {{ his_soc }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                    </v-list>

                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="red darken-1" text @click="dialog = false"><v-icon small>mdi-close</v-icon> Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoConfirmar" width="350">
            <v-card>
                <v-card-title>Nueva Acción</v-card-title>
                <v-card-text>
                    <v-text-field v-model="accion_reactivar"></v-text-field>
                </v-card-text>                
                <v-card-actions>
                    <v-btn color="primary" block @click="toggleSocio" :loading="loading">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar">Se actualizo el estatus del socio correctamente</v-snackbar>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import {getSociosReporteService,getSocioDetalleReporteService,setToggleSocioService,saveFotoSocioService,getFotoSocioService} from '@/services/reporte_socios_service'
import {useFileDialog} from '@vueuse/core'

const {files,onChange,open:open_file,reset} =useFileDialog({accept:'image/*'})

const cve_socio = ref(0)
const nombre = ref(undefined)
const accion = ref(undefined)
const estatus = ref(1)
const accion_reactivar = ref("");
const foto=ref()

const headersTabla =[
    { text: "Nombre Socio", value: "socio" },
    { text: "Numero Accion", value: "numero_accion" },
    { text: "Usuario", value: "posicion" },
    { text: "Es dueño", value: "cve_accion_is_dueno" },
    { text: "Es dueño en acciones", value: "acciones_dueno" },
    { text: "Estatus usuario", value: "estatus_" },
    { text: "Estatus accion", value: "estatus_accion" },
    { text: "Acciones", value: "detalles" ,width:"150px"},
]

const dialog = ref(false)
const loading = ref(false)
const itemsTabla = ref([])
const detalle = ref({})
const snackbar = ref(false)
const dialogoConfirmar = ref(false)
const menu_file=ref(false)

const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

onChange(()=>menu_file.value=true)

async function cargarTabla() {
    loading.value = true
    let clasificacion = 0
    let numero_accion = accion.value;
    try {

    if ((accion.value??'').indexOf("A") > 0) { console.log("A"); clasificacion = 1; numero_accion = accion.value.substr(0, accion.value.indexOf("A")); }
    else if ((accion.value??'').indexOf("B") > 0) { console.log("B"); clasificacion = 2; numero_accion = accion.value.substr(0, accion.value.indexOf("B")); }
    else if ((accion.value??'').indexOf("C") > 0) {console.log("C"); clasificacion = 3; numero_accion = accion.value.substr(0, accion.value.indexOf("C")); }

    
        const data=await getSociosReporteService(nombre.value,numero_accion, clasificacion,estatus.value)
        itemsTabla.value = [];
        data.map(element => ({...element,loading:false}))
        itemsTabla.value = data;
        
    } catch (error) {
        loading.value = false
    }
    finally{
        loading.value = false
    }

}

async function cargarDetalle(item) {
    item.loading = true;

    const data=await getSocioDetalleReporteService(item.cve_socio)
    foto.value=await getFotoSocioService(item.cve_socio)

    dialog.value = true;
    detalle.value = data;

    item.loading = false;
}

async function toggleSocio() {
    loading.value = true;
    let clasificacion = 0
    let numero_accion = accion_reactivar.value;

    if (accion_reactivar.value.indexOf("A") > 0) { clasificacion = 1; numero_accion = accion_reactivar.value.substr(0, accion_reactivar.value.indexOf("A")); }
    else if (accion_reactivar.value.indexOf("B") > 0) { clasificacion = 2; numero_accion = accion_reactivar.value.substr(0, accion_reactivar.value.indexOf("B")); }
    else if (accion_reactivar.value.indexOf("C") > 0) { clasificacion = 3; numero_accion = accion_reactivar.value.substr(0, accion_reactivar.value.indexOf("C")); }
   
    const data=await setToggleSocioService(cve_socio.value,numero_accion, clasificacion)

    if (data === 1) {
        snackbar.value = true;
    }

    dialogoConfirmar.value = false;
    cargarTabla();
    loading.value = false;
}

function open(idSoc) {
    cve_socio.value = idSoc;
    dialogoConfirmar.value = true;
}

function closeMenuConfirm()
{
    reset()
    menu_file.value=false
}

async function guardarFoto(id)
{
    try {        
        await saveFotoSocioService(id,files.value?.[0])
        menu_file.value=false
        foto.value=await getFotoSocioService(id)
    } catch (error) {
        
    }
}


</script>
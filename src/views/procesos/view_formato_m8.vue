<template>
    <div>

        <!-- <input
      type="file"
      :id="`xFileFoto`"
      ref="file"
      @change="loadFile($event)"
      style="display: none"
    /> -->

        <!-- <div class="d-flex justify-space-between"> -->
            <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
                <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs> -->
            <!-- <h1 class="accent--text oswald--text">Formato M8</h1>
        </div> -->

        <div class="d-flex justify-space-between mb-5">
            <div>
                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small
                        dark elevation="1" @click="openBuscar" class="mx-1">
                        <v-icon>mdi-account-search</v-icon>
                    </v-btn>
                </template>
                <span>buscar persona</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="secondary" v-on="on" v-bind="attrs" fab small 
                        dark elevation="1" @click="openCreateObservacion" class="mx-1">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>registrar percance</span>
            </v-tooltip>

            
        </div>
        
        <div>   
            <span class="mr-5 text-h5 font-weight-bold">{{ accion_text }}</span>
            <span class="text-h5">{{ nombre_text }}</span>
        </div>

            <!-- <Search v-model="search" :filters="filters">

            </Search> -->
            <h1 class="accent--text oswald--text">Formato M8</h1>
        </div>

        <v-data-table :headers="headers" :items="lst_observaciones" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
            class="table-pv rounded-xl elevation-5" hide-default-footer>
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

            <template v-slot:item.fecha_registro="{value}">
                       {{ dayjs(value).format('DD-MMM-YYYY') }}
            </template>

            <template v-slot:item.responsable="{item}">
                       <span>{{ item.nombre }}</span> <span class="font-weight-bold">{{ item.apellido_paterno }}</span> <span class="font-italic">{{ item.apellido_materno }}</span>
            </template>

            <template v-slot:item.estatus="{value}">
                    <span class="font-weight-bold">{{ value==1?'revision':value==2?'Aceptada':'Rechazada' }}</span>
            </template>

            <template v-slot:item.acciones="{item}">
                   <v-btn v-if="item.estatus==1" @click="agregarRespuesta(item.id_formato_m8)" small class="mr-1" color="info">
                    Responder
                   </v-btn>
                   <v-btn @click="openFile(item.id_formato_m8)" small color="warning">
                    <v-icon>mdi-file-upload</v-icon>
                    Archivo
                   </v-btn>
            </template>

           
    </v-data-table>

        <v-dialog v-model="dialog" width="500" persistent scrollable>
            <v-card>
                <v-toolbar color="primary" extended extension-height="70">
                    <v-toolbar-title class="white--text">
                        Buscar Persona
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>

                    <template #extension>
                        <div class="d-flex flex-column flex-grow-1 mt-5" style="row-gap: 10px;">

                            <v-divider class="white"></v-divider>
                            <v-text-field v-model="nombre" dark outlinedx solo-inverted label="Nombre socio"
                                    @keyup.enter="fnAllPersonas"></v-text-field>
                        </div>
                    </template>
                </v-toolbar>
                <v-card-text class="pt-5">

                        <div class="pr-2" style="min-height:100%;width: 100%;">
                            
                            <v-list>
                                <v-list-item @click="fnFindPersonaById(persona.cve_socio)" v-for="persona in lst_personas"
                                    :key="persona.cve_socio">
                                    <v-list-item-icon class="font-weight-bold mr-1 px-1 text-subtitle-1 accent white--text rounded">{{ persona.accion_socio }}-{{ persona.posicion }}</v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ persona.nombre }} <span class="font-weight-bold">{{ persona.apellido_paterno}}</span> <span class="font-italic">{{ persona.apellido_materno }}</span></v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </div>
                       
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_create"  width="500" persistent scrollable>
            <v-card>

            
                <v-toolbar color="primary">
                    <v-toolbar-title>Alta de formato M8</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_create=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text class="pt-10">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="folio" filled label="Folio"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="descripcion" label="Descripción" filled>
                            </v-textarea>
                        </v-col>

                        <v-col cols="12">
                            <v-btn block :color="filesx?.[0]?'success':'info'" @click="openFileAgregar"> <v-icon class="mr-2">mdi-file-upload</v-icon> Adjuntar Archivo</v-btn>
                        </v-col>
                        
                        <v-col>

                            <v-menu v-model="menu_fecha_registro" min-width="290" :close-on-content-click="false">
                                <template #activator="{on,attrs}">
                                    <v-text-field label="Fecha alta" :value="fecha_registro" v-on="on" v-bind="attrs" readonly prepend-inner-icon="mdi-calendar"></v-text-field>
                                </template>
                                <v-date-picker v-model="fecha_registro" label="Fecha" format="24hr" @input="menu_fecha_registro = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col>

                            <v-select v-model="tipo_formato" :items="lst_tipo_m8" item-value="id_tipo_formato_m8" item-text="tipo" label="Tipo de solicitud"></v-select>
                        </v-col>
                        
                    </v-row>                                        
                    
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="dialog_create=false">
                        <v-icon>mdi-close</v-icon>
                        cancelar</v-btn>
                    <v-btn color="primary" @click="fnRegistrarObservacion">
                        <v-icon>mdi-content-save</v-icon>
                        guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_respuesta"  width="500" persistent>
            <v-card>

            
                <v-toolbar color="primary">
                    <v-toolbar-title>Agregar Respuesta</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_respuesta=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text class="mt-10">
                    <v-row>
                        <v-col cols="12" lg="12">
                            <v-textarea v-model="respuesta" label="Respuesta" filled/>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-menu v-model="menu_fecha_respuesta" min-width="290" :close-on-content-click="false">
                        <template #activator="{on,attrs}">
                            <v-text-field :value="dayjs(fecha_respuesta).format('DD [de] MMM [del] YYYY')" label="Fecha Respuesta" filled hide-details v-on="on" v-bind="attrs" readonly prepend-inner-icon="mdi-calendar"></v-text-field>
                        </template>
                        <v-date-picker v-model="fecha_respuesta" label="Fecha Respuesta" format="24hr" @input="menu_fecha_respuesta = false"></v-date-picker>
                    </v-menu>
                        </v-col>
                        <v-col cols="12" lg="6" class="d-flex align-center" style="column-gap: 10px;">
                            rechazada
                            <v-switch v-model="estatus" :true-value="2" :false-value="3"></v-switch>
                            aprobada
                        </v-col>
                    </v-row>
                    
                    
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="dialog_respuesta=false">
                        <v-icon>mdi-close</v-icon>
                        cancelar</v-btn>
                    <v-btn color="primary" @click="fnRegistrarRespuesta">
                        <v-icon>mdi-content-save</v-icon>
                        guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_file" width="350" persistent>
            <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title>Alert!</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pt-5 d-flex flex-column">
                <span class="font-weight-bold">Desea agregar el siguiente archivo:</span>
                <span v-if="files">{{ files[0].name }}</span>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="dialog_file=false" outlined color="accent"><v-icon class="mr-1">mdi-close</v-icon> Cancelar</v-btn>
                <v-btn @click="loadFile" color="primary"><v-icon class="mr-1">mdi-save-content</v-icon> Guardar</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>


        <v-snackbar v-model="snackbar">
            Nececitas buscar una persona
        </v-snackbar>

        <v-snackbar v-model="snackbar_create" color="success">
           <v-icon class="mr-2">mdi-check</v-icon> Se guardo con exito...
        </v-snackbar>

    </div>
</template>

<script setup>
import { onMounted, ref,getCurrentInstance } from 'vue'
import {useFileDialog} from '@vueuse/core'
import { allPersonas, findPersonaById,registrarObservacion,getObservaciones,registrarRespuestaService,saveFileRespuesta,getTiposFormatoM8Service} from '@/services/formato_m8_service'
import dayjs from 'dayjs'


const root = getCurrentInstance().proxy;

const {files,open,reset,onChange} =useFileDialog()
const {files:filesx,open:openx,reset:resetx,onChange:onChangex} =useFileDialog()

const search = ref();

const filters = ref([
    { label: "Accion", key: "accion", value: "", type: "text" },
    { label: "Nombre", key: "nombre", value: "", type: "text" },
]);

const getBreadcrumb = [
    // {
    //     text: "Dashboard",
    //     disabled: false,
    //     href: "breadcrumbs_dashboard",
    // },
    // {
    //     text: "Link 1",
    //     disabled: false,
    //     href: "breadcrumbs_link_1",
    // },
    // {
    //     text: "Link 2",
    //     disabled: true,
    //     href: "breadcrumbs_link_2",
    // },
];

const headers = ref([
    { text: "Fecha Registro", align: "center", sortable: true, value: "fecha_registro" },
    { text: "Descripcion de los sucedido", align: "right", value: "observacion" },
    { text: "Folio Pago", align: "right", value: "folio_pago_caja" },
    // { text: "Hora inicio Atencion", value: "hora_inicio" },
    // { text: "Hora finalizo Atencion", value: "hora_fin" },
    { text: "Fecha Respuesta", value: "fecha_agrego" },
    { text: "Respuesta", value: "respuesta" },
    { text: "Responsable", value: "responsable", align: "center" },
    { text: "Estatus", value: "estatus", align: "center" },
    { text: "Acciones", value: "acciones", align: "center" },

]);

const items = ref([]);

const page = ref(1);
const itemsPerPage = ref(10);

const dialog = ref(false)
const dialog_create=ref(false)
const dialog_respuesta=ref(false)
const dialog_file=ref(false)

const id_formato_m8=ref(0)
let id_socio=0
let id_persona=0
let cve_accion=0
const nombre = ref();

const nombre_text=ref('')
const accion_text=ref('')

const folio=ref('')
const descripcion=ref('')
const fecha_registro=ref('')
const tipo_formato=ref()
// const hora_inicio=ref()
// const hora_fin=ref()
const respuesta=ref('')
const fecha_respuesta=ref(dayjs().format("YYYY-MM-DD"))
const estatus=ref(3)

const lst_personas = ref([])

const lst_observaciones=ref([])

const lst_tipo_m8=ref([])

const snackbar=ref(0)
const snackbar_create=ref(false)

const menu_fecha_registro=ref(false)
const menu_fecha_respuesta=ref(false)


onMounted(()=>getFormatosM8())


async function fnAllPersonas() {

try {
  const dataSend = { nombre: nombre.value }
  const data = await allPersonas(dataSend)
  lst_personas.value = data
  console.log(data)
}
catch (e) { }

}

async function fnFindPersonaById(id)
{

try {
  
  const data = await findPersonaById(id)
  const data2 = await getObservaciones(id);
  
//   console.log(data)
  
// //datos de la persona salen de data
  id_socio=data.cve_socio
  id_persona=data.cve_persona
  cve_accion=data.cve_accion
  nombre_text.value=`${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`
  accion_text.value=data.accion
  dialog.value=false
  nombre.value=''

//   //datos de los percances sale de datos2
  console.log('data2,',data2)
  lst_observaciones.value=data2

  
}
catch (e) { }
}

async function fnRegistrarObservacion()
{
    try {
        const dataSend={                       
            cve_usuario:id_socio,
            descripcion:descripcion.value,
            fecha_registro:fecha_registro.value,
            tipo_formato:tipo_formato.value,
            archivo:filesx.value?.[0],
            folio:folio.value
        }

        const data=await registrarObservacion(dataSend)
      

        const data2 = await getObservaciones(id_socio);
        lst_observaciones.value=data2
        dialog_create.value=false
        snackbar_create.value=true
    } catch (error) {
        console.log('error->',error)
    }
}

function openCreateObservacion()
{
    if(id_persona>0){
        dialog_create.value = true
        descripcion.value=''
        fecha_registro.value=''
        tipo_formato.value=0
        resetx()
        // hora_inicio.value=''
        // hora_fin.value=''

    }
    else{
        snackbar.value=true
    }
}

function  openBuscar()
{
    dialog.value=true;
    nombre.value=''
    lst_personas.value=[]
}

function agregarRespuesta(id)
{
id_formato_m8.value=id
dialog_respuesta.value=true
respuesta.value=''
fecha_respuesta.value=dayjs().format("YYYY-MM-DD")
}


async function fnRegistrarRespuesta()
{
    try {
        
        const dataSend={
            respuesta:respuesta.value,
            fecha_agrego:fecha_respuesta.value,
            estatus:estatus.value
        }
        const data=await registrarRespuestaService(id_formato_m8.value,dataSend)
        console.log(data)

        const data2 = await getObservaciones(id_socio);
        lst_observaciones.value=data2
        dialog_respuesta.value=false
    } catch (error) {
        console.log('error->',error)
    }
}

function openFileAgregar()
{
    resetx()//limpia el files
    openx()//abre el dialog nativo del file
}

function openFile(id)
{
    id_formato_m8.value=id
    // document.getElementById("xFileFoto").click()
    reset()//limpia el files
    open()//abre el dialog nativo del file
}



onChange(([file])=>{
if(Boolean(file.type) && ["image/jpeg", "image/png", "image/jpg"].includes(file.type))dialog_file.value=true
else {reset()}
})
onChangex(([file])=>{
if(Boolean(file.type) && ["image/jpeg", "image/png", "image/jpg"].includes(file.type))true
else {resetx()}
})

function loadFile()
{
    console.log(files.value[0])
    // console.log(e.target.files)

    saveFileRespuesta(id_formato_m8.value,files.value[0],"clave")
    // saveFileRespuesta(id_formato_m8.value,e.target.files[0],"clave")
}

async function getFormatosM8()
{
    try {
        lst_tipo_m8.value=await getTiposFormatoM8Service()        
    } catch (error) {
        console.log('error')
    }
}

</script>
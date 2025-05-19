<template>
    <div>
        <div class="d-flex justify-space-between">
            <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
                <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>
            <h1 class="accent--text oswald--text">Observaciones de metas en deporte</h1>
        </div>

        <div class="d-flex justify-space-between mb-5">
            <div>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="secondary" v-on="on" v-bind="attrs" fab small 
                        dark elevation="1" @click="openCreateObservacion" class="mr-1">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>registrar percance</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small
                        dark elevation="1" @click="openBuscar" class="ml-1">
                        <v-icon>mdi-account-search</v-icon>
                    </v-btn>
                </template>
                <span>buscar persona</span>
            </v-tooltip>
        </div>
        
        <div>   
            <span class="mr-5 text-h5 font-weight-bold">{{ accion_text }}</span>
            <span class="text-h5">{{ nombre_text }}</span>
        </div>

            <Search v-model="search" :filters="filters">

            </Search>
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

            <template v-slot:item.paramedico="{item}">
                       <span>{{ item.nombre }}</span> <span class="font-weight-bold">{{ item.apellido_paterno }}</span> <span class="font-italic">{{ item.apellido_materno }}</span>
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
                                <v-list-item @click="fnFindPersonaById(persona.cve_persona)" v-for="persona in lst_personas"
                                    :key="persona.cve_persona">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ persona.nombre }} {{ persona.apellido_paterno
                                        }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </div>
                       
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_create"  width="500" persistent>
            <v-card>

            
                <v-toolbar color="primary">
                    <v-toolbar-title>percance</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_create=false"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text class="mt-10">
                    <v-textarea v-model="descripcion" label="descripcion" filled>

                    </v-textarea>
                    <v-menu min-width="290" :close-on-content-click="false">
                        <template #activator="{on,attrs}">
                            <v-text-field :value="fecha_registro" v-on="on" v-bind="attrs" readonly prepend-inner-icon="mdi-calendar"></v-text-field>
                        </template>
                        <v-date-picker v-model="fecha_registro" label="Fecha" format="24hr"></v-date-picker>
                    </v-menu>
                    
                    <v-row>
                        <v-col><v-menu min-width="290" :close-on-content-click="false">
                        <template #activator="{on,attrs}">
                            <v-text-field :value="hora_inicio" label="Hora de inicio" v-on="on" v-bind="attrs" readonly prepend-inner-icon="mdi-clock"></v-text-field>
                        </template>
                        <v-time-picker v-model="hora_inicio" format="24hr"></v-time-picker>
                    </v-menu></v-col>
                        <v-col><v-menu min-width="290" :close-on-content-click="false">
                        <template #activator="{on,attrs}">
                            <v-text-field :value="hora_fin" label="Hora de termino" v-on="on" v-bind="attrs" readonly prepend-inner-icon="mdi-clock"></v-text-field>
                        </template>
                        <v-time-picker v-model="hora_fin" format="24hr"></v-time-picker>
                    </v-menu></v-col>
                    </v-row>
                    
                    
                    
                </v-card-text>
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


        <v-snackbar v-model="snackbar">
            Nececitas buscar una persona
        </v-snackbar>

    </div>
</template>

<script setup>
import { onMounted, ref,getCurrentInstance, computed } from 'vue'
import { allPersonas, findPersonaById,registrarObservacion,getObservaciones} from '@/services/observacion_meta_deporte_service'
import dayjs from 'dayjs'


const root = getCurrentInstance().proxy;

const search = ref();

const filters = ref([
    { label: "Accion", key: "accion", value: "", type: "text" },
    { label: "Nombre", key: "nombre", value: "", type: "text" },
    { label: "Apellido paterno", key: "paterno", value: "", type: "text" },
    { label: "Apellido materno", key: "materno", value: "", type: "text" },
    { label: "Genero", key: "genero", value: "", type: "text" },
    { label: "Edad", key: "edad", value: "", type: "text" },
    { label: "Estado civil", key: "estado_civil", value: "", type: "select" },
    { label: "Curp", key: "curp", value: "", type: "text" },
    { label: "Rfc", key: "rfc", value: "", type: "text" },
    { label: "Parentesco", key: "parentesco", value: "", type: "select" },
]);

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

const headers = ref([
    { text: "Fecha Registro", align: "center", sortable: true, value: "fecha_registro" },
    { text: "Hora inicio Atencion", value: "hora_inicio" },
    { text: "Hora finalizo Atencion", value: "hora_fin" },
    { text: "Descripcion de los sucedido", align: "right", value: "observacion" },
    { text: "Paramedico", value: "paramedico", align: "center" },

]);

const items = ref([]);

const page = ref(1);
const itemsPerPage = ref(10);

const dialog = ref(false)
const dialog_create=ref(false)
let id_persona=0
const nombre = ref();

const nombre_text=ref('')
const accion_text=ref('')

const descripcion=ref('')
const fecha_registro=ref('')
const hora_inicio=ref()
const hora_fin=ref()

const lst_personas = ref([])

const lst_observaciones=ref([])

const snackbar=ref(0)

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
  const dataSend = { nombre: nombre.value }
  const data = await findPersonaById(id)
  const data2 = await getObservaciones(id);
  
  console.log(data)
  
//datos de la persona salen de data
  id_persona=data.cve_persona
  nombre_text.value=`${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`
  accion_text.value=data.accion
  dialog.value=false
  nombre.value=''

  //datos de los percances sale de datos2
  console.log('data2,',data2)
  lst_observaciones.value=data2
  console.log(lst_observaciones.value)

  
}
catch (e) { }
}

async function fnRegistrarObservacion()
{
    try {
        const encargado=root.$ls.get('user',{cve_persona:0}).cve_persona
        const dataSend={
            id_persona:id_persona,
            encargado:encargado,
            descripcion:descripcion.value,
            fecha_registro:fecha_registro.value,
            hora_inicio:hora_inicio.value,
            hora_fin:hora_fin.value,
        }
        const data=await registrarObservacion(dataSend)
        console.log(data)

        const data2 = await getObservaciones(id_persona);
        lst_observaciones.value=data2
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
        hora_inicio.value=''
        hora_fin.value=''

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

</script>
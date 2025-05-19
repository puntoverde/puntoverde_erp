<template>
  <div class="mt-5">
    <div class="d-flex justify-space-between mb-5">

      <h1 class="accent--text oswald--text">Validacion Nuevo Dueño</h1>
      <!-- <Search v-model="search" :filters="filters" @emit-buscar="getCupos" /> -->
      <!-- <div class="d-flex align-center" style="column-gap: 10px;"> 
        <v-menu v-model="menu_revisadas" :close-on-content-click="false">
            <template v-slot:activator="{on,attrs}">
              <v-btn style="height: 50px;" v-on="on" v-bind="attrs" >Buscar Validados</v-btn>
            </template>
            <v-card>
              <v-card-title>
                ingresa rango fechas para mostrar
              </v-card-title>
              <v-card-text class="d-flex flex-column" style="row-gap: 20px;">
                
              


                <v-menu>
                  <template v-slot:activator="{on,attrs}">
                   
                    <v-text-field :value="dayjs(fecha_inicio).format('DD [de] MMM [de] YYYY')" label="fecha inicio" v-on="on" v-bind="attrs" placeholder="2000-01-01" filled prepend-inner-icon="mdi-calendar" hide-details></v-text-field>
                  </template>
                   <v-date-picker v-model="fecha_inicio"></v-date-picker> 
                </v-menu>
                <v-menu>
                  <template v-slot:activator="{on,attrs}">
                <v-text-field :value="dayjs(fecha_fin).format('DD [de] MMM [de] YYYY')" label="fecha fin" v-on="on" v-bind="attrs" placeholder="2000-01-01" filled prepend-inner-icon="mdi-calendar" hide-details></v-text-field>
              </template>
                   <v-date-picker v-model="fecha_fin"></v-date-picker> 
                </v-menu>
              </v-card-text>
              <v-card-actions>
                <v-btn block @click="getRevisados" :disabled="!fecha_inicio && !fecha_fin">Buscar Validados</v-btn>
              </v-card-actions>
            </v-card>
        </v-menu>       
        <v-btn style="height: 50px;" @click="getPendientes">Mostrar Pendientes</v-btn>
      </div> -->
      <v-btn color="secondary" @click="dialog_validar=true" :disabled="selected_duenos.length==0">Validar</v-btn>
    </div>

 

    <v-data-table v-model="selected_duenos" :headers="headers" :items="items" :page.sync="page" :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5" hide-default-footer item-key="cve_dueno"
      show-select>
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

      <template v-slot:item.accion="{ value }">
        <span class="font-weight-bold">{{ value }}</span>
      </template>

      <template v-slot:item.usuario="{ item }">

        <span>{{ item.nombre }}</span>
        <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
        <span class="font-italic">{{ item.apellido_materno }}</span>

      </template>


      <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>

      <template v-slot:item.fecha_alta="{ value }">
        {{ Boolean(value)?dayjs(value).format('DD-MMM-YYYY'):''}}
      </template>

      <template v-slot:item.actions="{ item }">
        <span  v-if="item.fecha_aceptacion">revisión: {{ dayjs(item.fecha_aceptacion).format('DD-MMM-YYYY') }}</span>
        <v-tooltip bottom v-else>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="getIngresoNuevoUsuarioById(item.cve_dueno)"><v-icon>mdi-eye</v-icon></v-btn>
          </template>
          <span>Mostrar datos completos</span>
        </v-tooltip>
      </template>
    </v-data-table>


    <v-dialog v-model="dialog" width="85vw" height="95vh" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>
            Datos Completos de Usuario
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrarDetalle"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <div style="height: 3px;" class="primary"></div>
        <v-card-text>
          <div class="redx d-flex" style="height: 200px;">
            <div class="pinkx" style="width: 150px;">
              <v-img :src="foto" width="100%" height="170px" style="background-color: #f2f2f2;"></v-img>              
            </div>
            <div class="yellowx flex-grow-1 pa-5">
              <v-row>
                <v-col cols="12" lg="4"><v-text-field label="Nombre" :value="nombre" readonly></v-text-field></v-col>
                <v-col cols="12" lg="4"><v-text-field label="Apellido Paterno" :value="paterno"
                    readonly></v-text-field></v-col>
                <v-col cols="12" lg="4"><v-text-field label="Apellido Materno" :value="materno"
                    readonly></v-text-field></v-col>
                <v-col cols="12" lg="4"><v-text-field label="Genero" :value="genero" readonly></v-text-field></v-col>
                <v-col cols="12" lg="4"><v-text-field label="Fecha nacimiento"
                    :value="dayjs(fecha_nacimiento).format('DD [de] MMMM [de] YYYY')" readonly></v-text-field></v-col>
              </v-row>
            </div>
          </div>
          <div class="blue"></div>
          <v-row>
            <v-col cols="12" lg="4"><v-text-field label="Curp" :value="curp" readonly></v-text-field></v-col>
            <v-col cols="12" lg="4"><v-text-field label="Rfc" :value="rfc" readonly></v-text-field></v-col>
            <v-col cols="12" lg="4"><v-text-field label="Estado civil" :value="estado_civil"
                readonly></v-text-field></v-col>
            
     
            <v-col cols="12" lg="4"><v-text-field label="Telefono" :value="telefono" readonly></v-text-field></v-col>
            <v-col cols="12" lg="4"><v-text-field label="Celular" :value="celular" readonly></v-text-field></v-col>
          
            
            <v-col cols="12" lg="4"><v-text-field label="Calle" :value="calle" readonly></v-text-field></v-col>
            <v-col cols="12" lg="2"><v-text-field label="# ext" :value="n_ext" readonly></v-text-field></v-col>
            <v-col cols="12" lg="2"><v-text-field label="# int" :value="n_int" readonly></v-text-field></v-col>
            <v-col cols="12" lg="4"><v-text-field label="Colonia" :value="colonia" readonly></v-text-field></v-col>
            <v-col cols="12" lg="2"><v-text-field label="Cp" :value="cp" readonly></v-text-field></v-col>
            <v-col cols="12" lg="3"><v-text-field label="Municipio" :value="municipio" readonly></v-text-field></v-col>
            <v-col cols="12" lg="3"><v-text-field label="Estado" :value="estado" readonly></v-text-field></v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="secondary" @click="dialog_validar=true">Validar</v-btn> -->
          <!-- @click="validarIngresoUsuarios" -->
        </v-card-actions>
      </v-card>

    </v-dialog>

    <v-dialog v-model="dialog_validar" width="350" content-class="rounded-xl" persistent>
      <v-card  rounded="xl">
        <v-toolbar elevation="0">Ingrese contraseña</v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-text-field v-model="contrasena" filled hide-details></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="()=>{contrasena='';dialog_validar=false}" color="accent" text>Cancelar</v-btn>
          <v-btn @click="validarIngresoUsuarios" color="info" text>Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-snackbar v-model="snackbar" color="success">Accionista Validado</v-snackbar>
    <v-snackbar v-model="snackbar_error" color="error">Error al validar</v-snackbar>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getNuevoIngresoUsuariosService, getIngresoNuevoUsuarioByIdService, getIngresoNuevoUsuarioFotoService, setValidacionNuevoIngreso } from '@/services/revision_altas_duenos_service'
import dayjs from 'dayjs'
import { format } from 'mathjs';

const dialog = ref(false)
const cve_dueno = ref(0)
const accion = ref('')

const nombre = ref('')
const paterno = ref('')
const materno = ref('')
const genero = ref('')
const fecha_nacimiento = ref('')
const curp = ref('')
const rfc = ref('')
const estado_civil = ref('')


const nacionalidad = ref('')

const telefono = ref('')
const celular = ref('')
const foto = ref('')

const calle = ref('')
const n_ext = ref('')
const n_int = ref('')
const colonia = ref('')
const cp = ref('')
const municipio = ref('')
const estado = ref('')

const fecha_inicio=ref(dayjs().format('YYYY-MM-DD'))
const fecha_fin=ref(dayjs().format('YYYY-MM-DD'))
const menu_revisadas=ref(false)


const headers = ref([
  { text: "Accion", align: "center", sortable: true, value: "accion" },

  { text: "Usuario", value: "usuario" },
  { text: "Genero", align: "right", value: "sexo" },
  { text: "Fecha nacimiento", value: "fecha_nacimiento" },
  { text: "Estado civil", value: "estado_civil", align: "center" },
  { text: "Fecha alta", value: "fecha_alta" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const items = ref([]);

const page = ref(1);
const itemsPerPage = ref(10);

const filters = ref([
  { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
  { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);

const snackbar = ref(false)
const snackbar_error = ref(false)

const dialog_validar=ref(false)
const contrasena=ref()
const selected_duenos=ref([])

onMounted(() => getNuevoIngresoUsuarios())

function getRevisados()
{
  getNuevoIngresoUsuarios({fecha_inicio:fecha_inicio.value,fecha_fin:fecha_fin.value})
}

function getPendientes()
{
  getNuevoIngresoUsuarios()
}

async function getNuevoIngresoUsuarios(filtros={}) {
  try {
    items.value = await getNuevoIngresoUsuariosService(filtros)
  } catch (error) {
    console.log(error)
  }
}

async function getIngresoNuevoUsuarioById(id) {
  cve_dueno.value = id;

  dialog.value = true
  try {
    const data = await getIngresoNuevoUsuarioByIdService(id)
    accion.value = data.accion
 
    nombre.value = data.nombre
    paterno.value = data.apellido_paterno
    materno.value = data.apellido_materno
    genero.value = data.sexo
    fecha_nacimiento.value = data.fecha_nacimiento
    curp.value = data.curp
    rfc.value = data.rfc
    estado_civil.value = data.estado_civil


    nacionalidad.value = data.cve_pais

    telefono.value = data.telefono
    celular.value = data.celular
    // foto.value=data.foto
   
    calle.value = data.calle
    n_ext.value = data.numero_exterior
    n_int.value = data.numero_interior
    colonia.value = data.colonia_name
    cp.value = data.cp
    municipio.value = data.municipio_name
    estado.value = data.estado_name

    getFotoUsuario(data.foto)
    // getFotoUsuario(data.cve_dueno)

  } catch (error) {
    console.log(error)
  }
}

async function getFotoUsuario(foto_) {
  try {
    foto.value = undefined//para que no se quede la foto anterior
    foto.value = await getIngresoNuevoUsuarioFotoService(foto_)
  } catch (error) {
    console.log(error)
  }
}

async function validarIngresoUsuarios() {
  try {
    const ids_dueno=selected_duenos.value.map(i=>i.cve_dueno)
    const data = await setValidacionNuevoIngreso(ids_dueno,contrasena.value)
    if(data==0)
  {
    contrasena.value=''
    dialog_validar.value=false
    dialog.value = false
    snackbar_error.value = true    
  }
  else{
    contrasena.value=''
    dialog_validar.value=false
    dialog.value = false
    snackbar.value = true
    getNuevoIngresoUsuarios()
  }

  } catch (error) {

  }
}

function cerrarDetalle()
{
  dialog.value=false
  accion.value =""
  
    nombre.value = ""
    paterno.value = ""
    materno.value = ""
    genero.value = ""
    fecha_nacimiento.value = ""
    curp.value = ""
    rfc.value = ""
    estado_civil.value = ""

    nacionalidad.value = ""

    telefono.value = ""
    celular.value = ""
    // foto.value=data.foto
 
  
    calle.value = ""
    n_ext.value = ""
    n_int.value = ""
    colonia.value = ""
    cp.value = ""
    municipio.value = ""
    estado.value =""
}

</script>
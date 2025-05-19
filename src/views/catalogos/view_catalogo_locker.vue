<template>
  <div>
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Catalogo Lockers</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs }">
          <v-btn color="primary" v-bind="attrs" fab small dark elevation="1" @click="open_nuevo_locker">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="get_lista_locker" />
    </div>

    <v-data-table :headers="headers" :items="lst_locker" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
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

      <template v-slot:item.tipo_cuota="{ item }">
        <span v-if="item.tipo_cuota == 1">Persona</span>
        <span v-else>Accion</span>
      </template>

      <template v-slot:item.precio="{ item }">
        <span class="font-weight-black accent--text number--text">
          {{ numeral(item.precio).format("$0,0.[00]") }}
        </span>
      </template>

      <template v-slot:item.opcion_iva="{ item }">
        <span v-if="item.opcion_iva == 1">Iva Incluido</span>
        <span v-else>Mas Iva</span>
      </template>

      <template v-slot:item.genero_aplica="{ item }">
        <v-icon v-if="item.genero_aplica === 'H'">mdi-human-male</v-icon>
        <v-icon v-else-if="item.genero_aplica === 'M'">mdi-human-female</v-icon>
        <v-icon v-else>mdi-human-male-female</v-icon>
      </template>

      <template v-slot:item.edad_aplica="{ item }">
        {{ item.edad_aplica == 0 ? "NA" : `${item.edad_aplica} Años` }}
      </template>

      <template v-slot:item.obligatoria="{ item }">
        <span class="font-weight-bold"
          :class="{ 'primary--text': item.obligatoria, 'secondary--text': !item.obligatoria }">{{ item.obligatoria ? 'SI'
            : 'NO' }}</span>
      </template>

      <!-- <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template> -->

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="getLockerById(item.cve_locker)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
          </template>
          <span>Editar locker</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="500" scrollable persistent>

      <v-card>

        <v-toolbar color="primary" dark>
          <v-toolbar-title>Registrar nuevo locker</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">

          <v-row>
            <v-col cols="12"><v-text-field v-model="numero_locker" label="Numero locker"></v-text-field></v-col>
            <v-col cols="12"><v-select v-model="estado_locker" label="Estado" hide-details
                :items="['REGULARIZADO', 'NO REGULARIZADO']"></v-select></v-col>
            <v-col cols="12"><v-select v-model="tipo_locker" label="Tipo" hide-details
                :items="['DAMAS', 'CABALLEROS']"></v-select></v-col>
            <v-col cols="12"><v-select label="Ubicacion" hide-details v-model="edificio" :items="lst_edificios"
                item-value="cve_edificio" item-text="nombre"></v-select></v-col>
            <v-col cols="12">
              <v-autocomplete label="Escriba el nombre del nuevo dueño" :items="lst_duenos" v-model="dueno"
                item-text="rentador" item-value="cve_persona">

                <template v-slot:item="{ item, on, attrs }">
                  <v-list-item v-on="on" v-bind="attrs">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.rentador }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <span class="font-weight-bold mr-2">accion:</span>{{ item.accion }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>{{ item.tipo == 'd' ? 'dueño' : 'usuario' }}</v-list-item-action>
                  </v-list-item>
                </template>

              </v-autocomplete>
            </v-col>
          </v-row>






        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="createLocker">Guardar</v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>


    <v-dialog v-model="dialog_update" width="500" scrollable persistent>

      <v-card>

        <v-toolbar color="primary" dark>
          <v-toolbar-title>Actualizar locker</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="dialog_update = false" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">

          <v-row>
            <v-col cols="12"><v-text-field v-model="numero_locker" label="Numero locker"></v-text-field></v-col>
            <v-col cols="12"><v-select v-model="estado_locker" label="Estado" hide-details
                :items="['REGULARIZADO', 'NO REGULARIZADO']"></v-select></v-col>
            <v-col cols="12"><v-select v-model="tipo_locker" label="Tipo" hide-details
                :items="['DAMAS', 'CABALLEROS']"></v-select></v-col>
            <v-col cols="12"><v-select label="Ubicacion" hide-details v-model="edificio" :items="lst_edificios"
                item-value="cve_edificio" item-text="nombre"></v-select></v-col>
            <v-col cols="12">
              <v-autocomplete label="Escriba el nombre del nuevo dueño" :items="lst_duenos" v-model="dueno"
                item-text="rentador" item-value="cve_persona">
                <template v-slot:item="{ item, on, attrs }">
                  <v-list-item v-on="on" v-bind="attrs">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.rentador }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <span class="font-weight-bold mr-2">accion:</span>{{ item.accion }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>{{ item.tipo == 'd' ? 'dueño' : 'usuario' }}</v-list-item-action>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>


        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="modificarLocker">Actualizar</v-btn>
        </v-card-actions>

      </v-card>

    </v-dialog>

    <v-snackbar v-model="snackbar_success" color="success">
      se guardo con exito
    </v-snackbar>

    <v-snackbar v-model="snackbar_info" color="info">
      se actualizo con exito
    </v-snackbar>

    <v-snackbar v-model="snackbar_error" color="error">
      ocurrio un error
    </v-snackbar>

  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";

import { getListaLockerService, getLockerByIdService, crearLockerService, actualizarLockerService, getEdificiosService, getDuenosEditLockerService } from '@/services/catalogo_locker_service'

const root = getCurrentInstance().proxy;

const headers = ref([
  { text: "N. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Tipo", align: "right", value: "tipo" },
  { text: "Estado", value: "estado" },
  { text: "Ubicacion", value: "ubicacion_name" },
  { text: "Propietario", value: "propietario" },
  { text: "Rentador", value: "rentador", align: "center" },
  // { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const lst_locker = ref([]);
const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const getBreadcrumb = [
  {
    text: "Legal",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    text: "Catalogo",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    text: "Locker",
    disabled: true,
    href: "breadcrumbs_link_2",
  },
];

const filters = ref([
  { label: "Numero locker", key: "num_locker", value: "", type: "text" },
  { label: "Tipo", key: "tipo", value: "", type: "select", items:[{id:1,text:'CABALLEROS'},{id:2,text:'DAMAS'}],itemValue:'id',itemText:'text' },
  { label: "Estado", key: "estado", value: "", type: "select", items:[{id:1,text:'REGULARIZADO'},{id:2,text:'NO REGULARIZADO'}],itemValue:'id',itemText:'text'},
]);

const dialog = ref(false)
const dialog_update = ref(false)

const lst_edificios = ref([])
const edificio = ref(0)

const lst_duenos = ref([])
const dueno = ref({})

const numero_locker = ref()
const estado_locker = ref()
const tipo_locker = ref()


const snackbar_success = ref(false)
const snackbar_info = ref(false)
const snackbar_error = ref(false)

const cve_locker = ref()

onMounted(() => {
 
  get_lista_locker();

  getEdificios()
  getSociosEditarDueno()
});

async function get_lista_locker(filtros={}) {
  const data = await getListaLockerService(filtros);
  lst_locker.value = data.map(i => ({ ...i, propietario: `${i.nombre_prop} ${i.paterno_prop} ${i.materno_prop}`, rentador: `${i.nombre_rent ?? ''} ${i.paterno_rent ?? ''} ${i.materno_rent ?? ''}` }))
}

async function getLockerById(id) {
  try {
    const data = await getLockerByIdService(id)

    cve_locker.value = data.cve_locker
    numero_locker.value = data.numero_locker
    estado_locker.value = data.estado
    tipo_locker.value = data.tipo
    edificio.value = data.ubicacion
    dueno.value = data.propietario
    dialog_update.value = true

  } catch (error) {

  }
}

function open_nuevo_locker() {
  dialog.value = true
  numero_locker.value = ''
  tipo_locker.value = ''
  estado_locker.value = ''
  edificio.value = 0
  dueno.value = 0
}

function open_new_locker() {

}

async function getEdificios() {
  try {
    const data = await getEdificiosService();
    lst_edificios.value = data;
  } catch (error) { }
}

async function getSociosEditarDueno() {

  try {
    lst_duenos.value = await getDuenosEditLockerService('');
  } catch (error) { }
}

async function createLocker() {
  try {

    const data_send = {
      propietario: dueno.value,
      tipo: tipo_locker.value,
      estado: estado_locker.value,
      ubicacion: edificio.value,
      numero_locker: numero_locker.value,
    }

    const cve_locker_ = await crearLockerService(data_send)

    if (cve_locker_ > 0) {
      snackbar_success.value = true
    }
    else {
      snackbar_error.value = true
    }

    dialog.value = false
  } catch (error) {

  }
}


async function modificarLocker() {
  try {

    const data_send = {
      propietario: dueno.value,
      tipo: tipo_locker.value,
      estado: estado_locker.value,
      ubicacion: edificio.value,
      numero_locker: numero_locker.value,
    }

    const flag = await actualizarLockerService(cve_locker.value, data_send)

    if (flag > 0) {
      snackbar_info.value = true
      get_lista_locker()
    }
    else {
      snackbar_error.value = true
    }

    dialog_update.value = false
  } catch (error) {

  }
}

function exportExcel() { }
</script>
<template>
  <div>
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
</v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Grupo Seguridad</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <div class="d-flex" style="column-gap: 5px;">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small dark
              elevation="1" @click="fnOpenCreateUsuario">
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </template>
          <span>Agregar Cuota</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="info" v-on="on" v-bind="attrs" fab small dark
              elevation="1" @click="fnOpenAdminstrarPerfiles">
              <v-icon>mdi-shield-account</v-icon>
            </v-btn>
          </template>
          <span>Administrar perfiles</span>
        </v-tooltip>
      </div>

      <Search v-model="search" :filters="filters" @emit-buscar="fnGetUsuariosSistema" />
    </div>

    <v-data-table :headers="headers" :items="items" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
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

      <template v-slot:item.colaborador="{ item }">
        <span>{{ item.nombre }}</span>
        <span class="font-weight-black mx-1">{{ item.apellido_paterno }}</span>
        <span class="font-italic">{{ item.apellido_materno }}</span>
      </template>

      <template v-slot:item.perfiles="{ value,item }">

        <span v-if="value" @click="fnGetPerfilesByUsuario(item.id_usuario)">{{ value }}</span>
        <span v-else @click="fnGetPerfilesByUsuario(item.id_usuario)">Agregar</span>
      </template>

      <template v-slot:item.is_enmascarado="{ value }">
        <span v-if="value == 1">Si</span>
        <span v-else>No</span>
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
          :class="{ 'primary--text': item.obligatoria, 'secondary--text': !item.obligatoria }">{{ item.obligatoria ?
            'SI' : 'NO' }}</span>
      </template>

      <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="editar_cuota(item.cve_cuota)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
          </template>
          <span>Editar Cuota</span>
        </v-tooltip> -->
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="600" scrollable>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Crear usuario</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fnGetColaboradoresDisponibles(),dialog=false"> <v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-expansion-panels inset>
            <v-expansion-panel v-for="(item, i) in lst_colaboradores_disponibles" :key="i">
              <v-expansion-panel-header>
                <span>{{ item.nomina }}</span>
                <div>
                  <!-- <v-avatar color="grey"><v-icon>mdi-plus</v-icon></v-avatar> -->
                  <span>{{ item.nombre }}</span>
                  <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
                  <span class="font-italic">{{ item.apellido_materno }}</span>
                </div>
              </v-expansion-panel-header>
              <v-divider></v-divider>
              <v-expansion-panel-content class="pt-3">
                <v-text-field v-model="item.usuario" filled label="ingrese el usuario"></v-text-field>
                <v-select v-model="item.perfiles" filled label="perfiles" :items="lst_perfiles" item-value="cve_perfil"
                  item-text="nombre" multiple></v-select>
                <v-btn @click="fnCreateUsuario(item)"><v-icon>mdi-check</v-icon> Registrar usuario</v-btn>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_perfiles" width="800" scrollable>
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Administrar Perfiles modulos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_perfiles=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-5" style="height: 70vh;">
          <div class="d-flex redx pa-5" style="column-gap: 10px;height: 100%;">
            <v-card class="flex-grow-1">
              <v-card-title>Perfiles</v-card-title>
              <v-divider></v-divider>
              <v-card-text class="overflow-y-auto" style="height: calc(100% - 65px);">
                <v-list-item-group v-model="id_perfil_selected" color="primary">
                  <v-list>
                    <v-list-item v-for="item in lst_perfiles" @click="fnGetModuloByPerfil(item.cve_perfil)"
                      :value="item.cve_perfil">
                      <v-list-item-content>
                        <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-list-item-group>
              </v-card-text>
            </v-card>
            <v-card class="flex-grow-1">
              <v-card-title>Modulos</v-card-title>
              <v-divider></v-divider>
              <v-card-text class="overflow-y-auto" style="height: calc(100% - 65px);">
                <!-- <v-list-item-group
          color="primary"
        > -->
                <v-list>
                  <v-list-item v-for="item in lst_modulos_perfil" color="pink" @click="addOrRemoveModuloToPerfil(item)">
                    <v-list-item-action>
                      <v-checkbox :input-value="Boolean(item.cve_perfil)"></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.nombre }} </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <!-- </v-list-item-group> -->
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_usuario_perfil" width="500">
      <v-toolbar>
        <v-toolbar-title>Perfiles Usuario</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog_usuario_perfil=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-list>
        <v-list-item v-for="item in lst_perfiles_usuario" color="pink" @click="addOrRemovePerfilToUsario(item)">
          <v-list-item-action>
            <v-checkbox :input-value="Boolean(item.cve_usuario_perfil)"></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.nombre }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-dialog>

  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";
import { getUsuariosSistemaService, createUsuariosSistemaService, getColaboradoresDisponiblesService, getPerfilesService, getModuloByPerfilService, addModuloByPerfilService, removeModuloByPerfilService,getPerfilesByUsuarioService ,addPerfilesByUsuarioService,removePerfilesByUsuarioService} from '@/services/grupo_seguridad_service'

const root = getCurrentInstance().proxy;

//#region variables
const headers = ref([
  { text: "Colaborador", align: "center", sortable: true, value: "colaborador" },
  { text: "Nomina", value: "nomina" },
  { text: "Usuario", value: "usuario" },
  { text: "Enmascarado", align: "right", value: "is_enmascarado" },
  { text: "Perfiles", align: "right", value: "perfiles" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const items = ref([]);
const lst_colaboradores_disponibles = ref([])
const lst_perfiles = ref([])
const lst_modulos_perfil = ref([])
const id_perfil_selected = ref()
const lst_perfiles_usuario = ref()
const id_usuario_selected=ref()

const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

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

const filters = ref([
  { label: "Nombre", key: "nombre", value: "", type: "select" },
  { label: "Apellido", key: "apellido_paterno", value: "", type: "text" },
  { label: "Apellido", key: "apellido_materno", value: "", type: "text" },
]);

const dialog = ref(false)
const dialog_perfiles = ref(false)
const dialog_usuario_perfil = ref(false)

//#endregion variables

onMounted(() => {
  fnGetUsuariosSistema();
  fnGetPerfiles()
});

async function fnGetUsuariosSistema(filtros={}) {
  items.value = await getUsuariosSistemaService(filtros);
}

async function fnGetColaboradoresDisponibles() {
  const data = await getColaboradoresDisponiblesService()
  lst_colaboradores_disponibles.value = data.map(i => ({ ...i, usuario: '', perfiles: [] }))
}

async function fnOpenCreateUsuario() {
  await fnGetColaboradoresDisponibles()
  dialog.value = true
}

async function fnGetPerfiles() {
  lst_perfiles.value = await getPerfilesService()
}

async function fnCreateUsuario(colaborador) {
  console.log(colaborador)
  const { id_colaborador, usuario, perfiles } = colaborador
  await createUsuariosSistemaService({ id_colaborador, usuario, perfiles })
  await fnGetColaboradoresDisponibles()
}



function fnOpenAdminstrarPerfiles() {
  dialog_perfiles.value = true
}

async function fnGetModuloByPerfil(id_perfil_) {
  lst_modulos_perfil.value = await getModuloByPerfilService(id_perfil_)
}

async function addModuloByPerfil(id_perfil_, id_modulo_) {
  await addModuloByPerfilService(id_perfil_, id_modulo_)
  fnGetModuloByPerfil(id_perfil_)
}

async function removeModuloByPerfil(id_perfil_, id_modulo_) {
  await removeModuloByPerfilService(id_perfil_, id_modulo_)
  fnGetModuloByPerfil(id_perfil_)
}


async function addOrRemoveModuloToPerfil(modulo_) {
  console.log(modulo_)
  if (Boolean(modulo_?.cve_perfil)) {
    console.log("elimina modulo del perfil ")
    await removeModuloByPerfil(modulo_?.cve_perfil, modulo_?.cve_modulo)
    modulo_.cve_perfil = null
  }
  else {
    console.log("agrega modulo al perfil")
    await addModuloByPerfil(id_perfil_selected.value, modulo_.cve_modulo);
    modulo_.cve_perfil = id_perfil_selected.value
  }
}

async function fnGetPerfilesByUsuario(id_usuario_)
{
  id_usuario_selected.value=id_usuario_
  lst_perfiles_usuario.value=await getPerfilesByUsuarioService(id_usuario_)
  dialog_usuario_perfil.value=true
}

async function addPerfilByUsuario(id_perfil_,id_usuario_) {
  await addPerfilesByUsuarioService(id_perfil_, id_usuario_)
}

async function removePerfilByUsuario(id_perfil_,id_usuario_) {
  await removePerfilesByUsuarioService(id_perfil_,id_usuario_)
}

async function addOrRemovePerfilToUsario(modulo_) {
  console.log(modulo_)
  if (Boolean(modulo_?.cve_usuario_perfil)) {
    console.log("elimina modulo del perfil ")
    await removePerfilByUsuario(modulo_?.cve_perfil,id_usuario_selected.value )
    modulo_.cve_usuario_perfil = null
    fnGetUsuariosSistema()
  }
  else {
    console.log("agrega modulo al perfil")
    await addPerfilByUsuario(modulo_?.cve_perfil,id_usuario_selected.value);
    modulo_.cve_usuario_perfil = id_usuario_selected.value
    fnGetUsuariosSistema()
  }
}

</script>
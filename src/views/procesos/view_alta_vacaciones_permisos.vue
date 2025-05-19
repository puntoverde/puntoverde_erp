<template>
  <div>
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Alta de vacaciones y permisos</h1>
    </div>

    <div class="d-flex" style="column-gap: 15px">
      <v-card>
          <v-toolbar color="secondary">
            <v-text-field v-model="search_colaborador" label="Buscar colaborador" prepend-icon="mdi-magnify" solo hide-details></v-text-field>

          </v-toolbar>
      <div style="width: 400px;height: calc(100vh - 200px);" class="overflow-y-auto">
        <v-list two-line class="elevation-5 rounded">
          <v-subheader>Colaboradores a cargo</v-subheader>
          <v-list-item-group v-model="id_colaborador">
            <v-list-item
              v-for="item in cColaborador"
              :key="item.id_colaborador"
              :value="item.id_colaborador"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                <v-list-item-subtitle
                  ><span class="font-weight-bold mr-1">{{
                    item.apellido_paterno
                  }}</span>
                  <span class="font-italic">{{ item.apellido_materno }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                {{ item.nomina }}
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
      </v-card>

      <v-divider vertical></v-divider>

      <div class="flex-grow-1">
        <v-toolbar rounded color="secondary" elevation="0" class="mb-5" dark>
          <v-toolbar-title>Vacaciones</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!Boolean(id_colaborador)"
            @click="openAltaVacaciones"
            rounded
            color="primary"
            >alta vacacion</v-btn
          >
        </v-toolbar>

        <v-data-table
          :headers="headers"
          :items="lst_vacaciones"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          class="table-pv rounded-xl elevation-5"
          hide-default-footer
        >
          <template v-slot:top="{ pagination }">
            <div class="d-flex justify-end align-center">
              <span class="mr-2 text-caption">filas por pagina</span>
              <v-select
                v-model="itemsPerPage"
                dense
                hide-details
                style="max-width: 50px"
                :items="[5, 10, 50]"
              />
              <span class="mx-2 text-caption"
                >pagina {{ pagination.page }} de
                {{ pagination.pageCount }}</span
              >
              <v-pagination
                circle
                :total-visible="0"
                v-model="page"
                :length="pagination.pageCount"
              ></v-pagination>
            </div>
          </template>

          <template v-slot:footer="{ props }">
            <div>{{ props.pagination.itemsLength }} registro(s)</div>
          </template>

          <template v-slot:item.fecha_vacaciones="{ value }">
            {{ dayjs(value).locale("es-mx").format("D [de] MMMM [de] YYYY") }}
          </template>

          <!-- <template v-slot:item.estatus="{ item }">
            <v-icon v-if="item.estatus" color="success"
              >mdi-check-circle</v-icon
            >
            <v-icon v-else color="error">mdi-close-circle</v-icon>
          </template> -->

          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-show="
                    dayjs(item.fecha_vacaciones).isSameOrAfter(dayjs(), 'D')
                  "
                  v-on="on"
                  x-small
                  icon
                  outlined
                  color="secondary"
                  fab
                  @click="fnDeleteVacacion(item.id_colaborador_vaciones)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>
              <span>Eliminar dia de vacacion</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div>

      <!-- <v-divider vertical></v-divider>

      <div class="flex-grow-1">
        <v-toolbar rounded color="secondary" elevation="0" class="mb-5" dark>
          <v-toolbar-title>Permisos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!Boolean(id_colaborador)"
            @click="openAltaPermiso"
            rounded
            color="primary"
            >alta Permiso</v-btn
          >
        </v-toolbar>

        <v-data-table
          :headers="headers_permiso"
          :items="lst_permiso"
          :page.sync="page_permiso"
          :items-per-page="itemsPerPage_permiso"
          class="table-pv rounded-xl elevation-5"
          hide-default-footer
        >
          <template v-slot:top="{ pagination }">
            <div class="d-flex justify-end align-center">
              <span class="mr-2 text-caption">filas por pagina</span>
              <v-select
                v-model="itemsPerPage_permiso"
                dense
                hide-details
                style="max-width: 50px"
                :items="[5, 10, 50]"
              />
              <span class="mx-2 text-caption"
                >pagina {{ pagination.page }} de
                {{ pagination.pageCount }}</span
              >
              <v-pagination
                circle
                :total-visible="0"
                v-model="page"
                :length="pagination.pageCount"
              ></v-pagination>
            </div>
          </template>

          <template v-slot:footer="{ props }">
            <div>{{ props.pagination.itemsLength }} registro(s)</div>
          </template>

          <template v-slot:item.fecha_permiso="{ value }">
            {{ dayjs(value).locale("es-mx").format("D [de] MMMM [de] YYYY") }}
          </template>

          

          <template v-slot:item.actions="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-show="dayjs(item.fecha_permiso).isSameOrAfter(dayjs(), 'D')"
                  v-on="on"
                  x-small
                  icon
                  outlined
                  color="secondary"
                  fab
                  @click="fnDeletePermiso(item.id_colaborador_permiso)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>
              <span>Eliminar permiso</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </div> -->
    </div>

    <v-dialog v-model="dialog_vacaciones" width="650" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Alta dia vacaciones</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="dialog_vacaciones = false" fab outlined small
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pt-5">
          <div class="d-flex" style="column-gap: 10px;">
          <v-date-picker elevation="1"
            v-model="fecha_alta_vacacion"
            multiple
            no-title
            locale="es-mx"
            :allowed-dates="fnDisabledDays"
            ></v-date-picker>
            <!-- :disabled="fecha_alta_vacacion.length >= num_vacaciones_disponible" -->
            <!-- :min="dayjs().format('YYYY-MM-DD')" -->
          <v-alert
            v-if="iErrors.fecha_vacaciones"
            type="error"
            text
            style="font-size: 12px"
          >
            {{ iErrors.fecha_vacaciones }}</v-alert
          >
          <div class="d-flex flex-column justify-center flex-grow-1 redx" style="row-gap: 10px;">
          <span class="text-h1 grey lighten-3 rounded py-2 text-center" style="position: relative;">
            <span style="font-size: 14px;letter-spacing: 1px;position: absolute; left: 0;top: -40px;">vacaciones disponibles</span>
            <span style="font-size: 14px;letter-spacing: 1px;position: absolute; right: 0;bottom: -40px;">dias seleccionados</span>
            {{num_vacaciones_disponible}}-{{ fecha_alta_vacacion.length }}
          </span>
          <v-textarea
            v-model="descripcion_vacacion"
            filled
            class="my-mayus"
            label="descripcion"
            :error-messages="iErrors.descripcion"
            hide-details
          ></v-textarea>
        </div>
        </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnCreateVacacion" color="secondary">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_permisos" width="350" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Alta permiso</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="dialog_permisos = false" fab outlined small
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-date-picker
            v-model="fecha_alta_permiso"
            no-title
            locale="es-mx"
            :min="dayjs().format('YYYY-MM-DD')"
            :allowed-dates="fnDisabledDays"
          ></v-date-picker>
          <v-alert
            v-if="iErrorsP.fecha_permiso"
            type="error"
            text
            style="font-size: 12px"
          >
            {{ iErrorsP.fecha_permiso }}</v-alert
          >
          <v-radio-group
            v-model="tipo_permiso"
            class="mt-10"
            :error-messages="iErrorsP.tipo"
          >
            <v-radio label="CON GOCE DE SUELDO" value="1"></v-radio>
            <v-radio label="SIN GOCE DE SUELDO" value="2"></v-radio>
          </v-radio-group>

          <v-textarea
            v-model="descripcion_permiso"
            filled
            class="mt-5 my-mayus"
            label="descripcion"
            :error-messages="iErrorsP.descripcion"
          ></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnCreatePermiso" color="secondary">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, watch ,computed} from "vue";
import {
  getDiasDisabled,
  getVacionesService,
  getPermisoService,
  createVacionesService,
  createPermisosService,
  deleteVacionesService,
  deletePermisoService,
  getVacacionesDisponiblesService
} from "@/services/vacaciones_permisos_service";
import { getColaboradoresByAreaService } from "@/services/incidencias_service";
import { useValidacionVacacionPermiso } from "@/composables/useValidacionVacacionPermiso";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

const root = getCurrentInstance().proxy;

const { iValid, iErrors, iClear } = useValidacionVacacionPermiso();
const {
  iValid: iValidP,
  iErrors: iErrorsP,
  iClear: iClearP,
} = useValidacionVacacionPermiso(false);

const id_colaborador = ref(0);
const lst_colaboradores = ref([]);

const dialog_vacaciones = ref();
const dialog_permisos = ref();

const fecha_alta_vacacion = ref([]);
const descripcion_vacacion = ref();

const fecha_alta_permiso = ref();
const tipo_permiso = ref();
const descripcion_permiso = ref();

const lst_dias_disabled=ref(['2024-04-03','2024-04-11','2024-04-20'])

const num_vacaciones_disponible=ref(0)

const headers = ref([
  {
    text: "Dia vacacion",
    align: "center",
    sortable: true,
    value: "fecha_vacaciones",
  },
  { text: "Descripcion", value: "descripcion" },
  //   { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const lst_vacaciones = ref([]);
const page = ref(1);
const itemsPerPage = ref(10);

const headers_permiso = ref([
  {
    text: "Dia permiso",
    align: "center",
    sortable: true,
    value: "fecha_permiso",
  },
  {
    text: "Tipo permiso",
    align: "center",
    sortable: true,
    value: "tipo",
  },
  { text: "Descripcion", value: "descripcion" },
  //   { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const lst_permiso = ref([]);
const page_permiso = ref(1);
const itemsPerPage_permiso = ref(10);

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

const search_colaborador=ref('')

const cColaborador=computed(()=>{
  return lst_colaboradores.value.filter(({nombre,apellido_paterno,apellido_materno}) =>`${nombre} ${apellido_paterno} ${apellido_materno}`.toLowerCase().indexOf(search_colaborador.value.toLowerCase()) > -1);
})

watch(id_colaborador, (val) => {
  if (Boolean(val)) {
    fnGetVaciones();
    fnGetPermisos();
    fnGetDiasDisabled();
  }
  else{
    lst_vacaciones.value=[]
    lst_permiso.value =[]
  }
});

onMounted(() => {
  fnGetColaboradoresByArea();
});

async function fnGetColaboradoresByArea() {
  try {
    const cve_persona_session = root.$ls.get("user", {
      cve_persona: 0,
    }).cve_persona;
    const data = await getColaboradoresByAreaService(cve_persona_session);
    lst_colaboradores.value = data;
    console.log("🚀 ~ file: view_incidencias.vue:508 ~ data:", data);
  } catch (error) {}
}

async function fnGetVaciones() {
  try {
    lst_vacaciones.value = await getVacionesService(id_colaborador.value);
  } catch (error) {}
}

async function fnGetPermisos() {
  try {
    lst_permiso.value = await getPermisoService(id_colaborador.value);
  } catch (error) {}
}

async function openAltaVacaciones() {
  await fnVacacionesDisponibles()
  fecha_alta_vacacion.value = [];
  descripcion_vacacion.value = undefined;
  iClear();
  dialog_vacaciones.value = true;
}

function openAltaPermiso() {
  fecha_alta_permiso.value = undefined;
  descripcion_permiso.value = undefined;
  iClearP();
  dialog_permisos.value = true;
}

async function fnCreateVacacion() {
  try {
    const cve_persona_session = root.$ls.get("user", {
      cve_persona: 0,
    }).cve_persona;
    const data_send = {
      id_colaborador_encargado: cve_persona_session,
      id_colaborador: id_colaborador.value,
      fecha_vacaciones: fecha_alta_vacacion.value,
      descripcion: descripcion_vacacion.value,
    };
    const data_valid = await iValid(data_send);
    const data=await createVacionesService(data_valid);
    if(data>0){
      fnGetVaciones();
      fnGetDiasDisabled();
      }
    else root.$toast.error("Ocurrio un error, o es posible que el dia ya este otorgado a vacacion o permiso");
    dialog_vacaciones.value = false;
  } catch (error) {}
}

async function fnCreatePermiso() {
  try {
    const cve_persona_session = root.$ls.get("user", {
      cve_persona: 0,
    }).cve_persona;
    const data_send = {
      id_colaborador_encargado: cve_persona_session,
      id_colaborador: id_colaborador.value,
      fecha_permiso: fecha_alta_permiso.value,
      descripcion: descripcion_permiso.value,
      tipo: tipo_permiso.value,
    };
    const data_valid = await iValidP(data_send);
    const data=await createPermisosService(data_valid);
    if(data>0){fnGetPermisos();fnGetDiasDisabled();}
    else root.$toast.error("Ocurrio un error, o es posible que el dia ya este otorgado a vacacion o permiso");
    dialog_permisos.value = false;
  } catch (error) {}
}

async function fnDeleteVacacion(id) {
  try {
    const confirm = await root.$confirm(
      'Desea realmente eliminar el dia de vacacion, seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      await deleteVacionesService(id);
      await fnGetVaciones();
    }
  } catch (error) {}
}

async function fnDeletePermiso(id) {
  try {
    const confirm = await root.$confirm(
      'Desea realmente eliminar el permiso, seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      await deletePermisoService(id);
      await fnGetPermisos();
    }
  } catch (error) {}
}

function fnDisabledDays(v){

console.log("🚀 ~ file: view_alta_vacaciones_permisos.vue:512 ~ fnDisabledDays ~ v:", v);
return !lst_dias_disabled.value.some(i=>dayjs(i).isSame(dayjs(v),'D'))
}

async function fnGetDiasDisabled()
{
try {
  lst_dias_disabled.value=await getDiasDisabled(id_colaborador.value)
} catch (error) {
  
}
}

async function fnVacacionesDisponibles()
{
  try {
    num_vacaciones_disponible.value=await getVacacionesDisponiblesService(id_colaborador.value)
} catch (error) {
  
}
}



</script>

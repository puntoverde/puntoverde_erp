<template>
  <div>
    <!-- <h2>Administración de Apartados </h2>
    <br /> -->
    <div class="d-flex justify-space-between mb-5">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Administracion de apartados</h1>
      <!-- </div> -->

      <!-- <div class="d-flex justify-space-between mb-5"> -->
      <!-- <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :outlined="attrs['aria-expanded'] == 'true'"
            color="primary"
            v-on="on"
            v-bind="attrs"
            fab
            small
            dark
            elevation="1"
            @click="nueva_cuota"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip> -->

      <!-- <Search v-model="search" :filters="filters" @emit-buscar="" /> -->
    </div>

    <v-card rounded="xl">
      <v-tabs grow color="primary">
        <v-tab href="'#tab1'" class="text-h6">Apartados Activos</v-tab>
        <v-tab-item value="'tab1'" class="ma-5">
          <!-- <v-card flat tile> -->
          <!-- <v-card-text> -->
          <!-- <v-row justify="center"> -->
          <!-- <v-col lg="3"> -->
          <v-btn
            rounded
            color="secondary"
            @click="
              dialogNuevo = true;
              itemsEspaciosDeportivos();
            "
            class="mb-5"
            >crear Nuevo Apartado</v-btn
          >
          <!-- </v-col> -->
          <!-- </v-row> -->
          <v-data-table
            :headers="headersCancelar"
            :items="itemsCancelar"
            :calculate-widths="true"
            :items-per-page="itemsPerPage"
            hide-default-footer
            :page.sync="page"
            :search="search"
            class="table-pv rounded-xl elevation-5"
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

            <template v-slot:item.estatus="{ item }">
              <label v-if="item.estatus == 1">Activo</label>
              <label v-else>Cancelado</label>
            </template>
            <template v-slot:item.action="{ item }">
              <v-btn icon outlined @click="cancelarApartado(item.cve_apartado)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <!-- </v-card-text> -->
          <!-- </v-card> -->
        </v-tab-item>
        <v-tab href="'#tab2'" class="text-h6">Deshabilitar Canchas</v-tab>
        <v-tab-item value="'tab2'" class="pa-5">
          <!-- <v-card flat tile> -->
          <!-- <v-card-text> -->
          <v-data-table
            :headers="headersDeshabilitar"
            :items="itemsDeshabilitar"
            :calculate-widths="true"
            :items-per-page="itemsPerPage2"
            hide-default-footer
            :page.sync="page2"
            :search="search"
            class="table-pv rounded-xl elevation-5 mt-5"
          >
            <template v-slot:top="{ pagination }">
              <div class="d-flex justify-end align-center">
                <span class="mr-2 text-caption">filas por pagina</span>
                <v-select
                  v-model="itemsPerPage2"
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
                  v-model="page2"
                  :length="pagination.pageCount"
                ></v-pagination>
              </div>
            </template>

            <template v-slot:footer="{ props }">
              <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template>

            <template v-slot:item.estatus="{ item }">
              <label v-if="item.estatus == 1">Activo</label>
              <label v-else>Deshabilitado</label>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom v-if="item.estatus == 1">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="red"
                    icon
                    outlined
                    @click="
                      dialog = true;
                      itemDeshabilitar = item;
                    "
                    v-on="on"
                  >
                    <v-icon> mdi-cancel </v-icon>
                  </v-btn>
                </template>
                <span>Deshabilitar</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on }">
                  <v-icon
                    color="green"
                    @click="deshabilitarEquipo(item.cve_equipo, item.estatus)"
                    v-on="on"
                  >
                    mdi-check
                  </v-icon>
                </template>
                <span>Habilitar</span>
              </v-tooltip>
            </template>
          </v-data-table>
          <!-- </v-card-text> -->
          <!-- </v-card> -->
        </v-tab-item>
      </v-tabs>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title> Si </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="motivo"
                      label="Motivo de la deshabilitacion"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="dialog = false"
                >Cancelar</v-btn
              >
              <v-btn
                color="blue darken-1"
                text
                @click="
                  deshabilitarEquipo(
                    itemDeshabilitar.cve_equipo,
                    itemDeshabilitar.estatus
                  )
                "
                >Guardar</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogNuevo" persistent max-width="600px">
          <v-card>
            <v-toolbar color="secondary" dark elevation="0">
              <v-toolbar-title>Crear nuevo apartado</v-toolbar-title>
            </v-toolbar>
            <v-divider style="min-height:3px" class="primary"></v-divider>
            <v-card-text>
              <v-container>
                <v-row justify="center">
                  <v-col lg="10">
                    <v-select
                      @change="itemsEquipos()"
                      v-model="espacioDeportivo"
                      label="Espacio Deportivo"
                      :items="itemsEspacioD"
                      item-text="nombre"
                      item-value="cve_espacio_deportivo"
                      v-validate="'required'"
                      data-vv-name="espacio deportivo"
                      :error="errors.has('espacio deportivo')"
                      :error-messages="errors.first('espacio deportivo')"
                      filled
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row justify="center" v-if="espacioDeportivo != ''">
                  <v-col lg="10">
                    <v-select
                      v-model="equipo"
                      label="Equipo"
                      :items="itemsEquiposSlc"
                      item-text="nombre"
                      item-value="cve_equipo"
                      v-validate="'required'"
                      data-vv-name="equipo"
                      :error="errors.has('equipo')"
                      :error-messages="errors.first('equipo')"
                      filled
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col lg="5">
                    <v-menu
                      v-model="menuFechaI"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      persistent
                      max-width="290px"
                      min-width="290px"
                    >
                      <!-- @keyup.enter="fechaI = parseFecha(fechaIF)" -->
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="fechaIF"
                          label="Fecha Inicial"
                          hint="dd/mm/aaaa"
                          persistent-hint
                          prepend-inner-icon="mdi-calendar"
                          v-on="on"
                          v-validate="'min:10|max:10|required'"
                          data-vv-name="fecha inicial"
                          v-mask="'##/##/####'"
                          :error="errors.has('fecha inicial')"
                          :error-messages="errors.first('fecha inicial')"
                          filled
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="es-mx"
                        v-model="fechaI"
                        no-title
                        @input="menuFechaI = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col lg="5">
                    <!-- <v-dialog
                      ref="dialogRef"
                      v-model="modalTi"
                      persistent
                      full-width
                      width="290px"
                    > -->

                    <v-menu
                      v-model="modalTi"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      persistent
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="horaI"
                          label="Hora Inicial"
                          prepend-inner-icon="mdi-clock"
                          readonly
                          v-on="on"
                          v-validate="'required'"
                          data-vv-name="hora inicial"
                          :error="errors.has('hora inicial')"
                          :error-messages="errors.first('hora inicial')"
                          filled
                        ></v-text-field>
                      </template>
                      <v-time-picker v-if="modalTi" v-model="horaI" full-width format="24hr">
                        <div class="flex-grow-1"></div>
                        <v-btn text color="primary" @click="modalTi = false"
                          >Cancelar</v-btn
                        >
                        <v-btn text color="primary" @click="cerrarModals()"
                          >OK</v-btn
                        >
                      </v-time-picker>
                    <!-- </v-dialog> -->
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col lg="5">
                    <v-menu
                      v-model="menuFechaF"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      persistent
                      max-width="290px"
                      min-width="290px"
                    >
                      <!-- @keyup.enter="fechaI = parseFecha(fechaIF)" -->
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="fechaFF"
                          label="Fecha Final"
                          hint="dd/mm/aaaa"
                          persistent-hint
                          prepend-inner-icon="mdi-calendar"
                          v-on="on"
                          v-validate="'min:10|max:10|required'"
                          data-vv-name="fecha final"
                          v-mask="'##/##/####'"
                          :error="errors.has('fecha final')"
                          :error-messages="errors.first('fecha final')"
                          filled
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        locale="es-mx"
                        v-model="fechaF"
                        no-title
                        @input="menuFechaF = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col lg="5">
                    <!-- <v-dialog
                      ref="dialogRef2"
                      v-model="modalTf"
                      persistent
                      full-width
                      width="290px"
                    > -->

                    <v-menu
                      v-model="modalTf"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      full-width
                      persistent
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="horaF"
                          label="Hora Final"
                          prepend-inner-icon="mdi-clock"
                          readonly
                          v-on="on"
                          v-validate="'required'"
                          data-vv-name="hora final"
                          :error="errors.has('hora final')"
                          :error-messages="errors.first('hora final')"
                          filled
                        ></v-text-field>
                      </template>
                      <v-time-picker v-if="modalTf" v-model="horaF" full-width format="24hr">
                        <div class="flex-grow-1"></div>
                        <v-btn text color="primary" @click="modalTf = false"
                          >Cancelar</v-btn
                        >
                        <v-btn text color="primary" @click="cerrarModals()"
                          >OK</v-btn
                        >
                      </v-time-picker>
                    <!-- </v-dialog> -->
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn
                color="secondary"
                outlined
                @click="
                  dialogNuevo = false;
                  limpiarCamposNuevo();
                "
                >Cancelar</v-btn
              >
              <v-btn color="secondary" @click="guardar()">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from "vue";
import { isBoolean } from "lodash/isBoolean";
import {
  getApartadosService,
  getApartadosDesabilitadosService,
  getItemsEspaciosDeportivosService,
  getEquiposByService,
  getSaveEquipoService,
  getDesailitarEquipoService,
  getCancelarApartadoService,
} from "@/services/apartados_services";

const root = getCurrentInstance().proxy;

const accion = ref();
const headersCancelar = [
  //Columnas de la tabla
  { text: "Clave", value: "cve_apartado" },
  { text: "Equipo", value: "equipo" },
  { text: "Inicio", value: "fecha_inicio" },
  { text: "Fin", value: "fecha_fin" },
  { text: "Accion", value: "accion" },
  { text: "Nombre", value: "nombre" },
  // {text:"Estatus", value: "estatus"},
  { text: "", value: "action" },
];
const itemsCancelar = ref(); //Registros de la tabla
const headersDeshabilitar = [
  //Columnas de la tabla
  { text: "Clave", value: "cve_equipo" },
  { text: "Nombre", value: "nombre" },
  { text: "Descripcion", value: "descripcion" },
  { text: "Motivo", value: "motivo_inhabilitacion" },
  { text: "Estatus", value: "estatus" },
  { text: "", value: "action" },
];
const itemsDeshabilitar = ref([]); //Registros de la tabla
const headersReporte = ref([]);
const itemsReporte = ref([]);
const itemsEspacioD = ref([]);
const itemsEquiposSlc = ref([]);

//Fechas y horas

const menuFechaI = ref(false); //Ventana de dias, fecha inicial
const menuFechaF = ref(false); //Ventana de dias, fecha final
const fechaI = ref(""); //Fecha inicial en formato de BD
const fechaIF = ref(""); //Fecha inicial en formato de usuario
const horaI = ref(""); //Hora inicial
const fechaF = ref(""); //Fecha final en formato de BD
const fechaFF = ref(""); //Fecha inicial en formato de usuario
const horaF = ref(""); //Hora final

const modalTi = ref(false); //Modal de picker de hora inicial
const modalTf = ref(false); //Modal de picker de hora final
const dialog = ref(false); //Muestra u oculta el mensaje de confirmacion de eliminar profesion
const dialogNuevo = ref(false); //Dialog para registrar nuevos apartados
const itemDeshabilitar = ref(null); //Almacena los datos de la profesion a eliminar

const flagActualizar = ref(false); //Indica si se esta modificando una profesion
//Modelo
const espacioDeportivo = ref("");
const equipo = ref("");
const motivo = ref("");

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const page2 = ref(1);
const itemsPerPage2 = ref(10);

watch(dialog, (val) => {
  if (val) motivo.value = "";
});

watch(fechaI, (val) => {
  if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
});

watch(fechaF, (val) => {
  if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
});

onMounted(() => {
  itemsTablaCancelar();
  itemsTablaDeshabilitar();
});

async function cancelarApartado(cve) {
  try {
    await getCancelarApartadoService(cve);
    itemsTablaCancelar();
  } catch (error) {}
}

async function deshabilitarEquipo(cve, estatus) {
  try {
    await getDesailitarEquipoService(cve, estatus, motivo.value);
    itemsTablaDeshabilitar(); //Recarga la tabla
    dialog.value = false;
  } catch (error) {}
}

async function itemsTablaCancelar() {
  try {
    itemsCancelar.value = await getApartadosService();
  } catch (error) {}
}

async function itemsTablaDeshabilitar() {
  try {
    itemsDeshabilitar.value = await getApartadosDesabilitadosService();
  } catch (error) {}
}

async function itemsEspaciosDeportivos() {
  try {
    itemsEspacioD.value = await getItemsEspaciosDeportivosService();
  } catch (error) {}
}

async function itemsEquipos() {
  try {
    itemsEquiposSlc.value = await getEquiposByService(espacioDeportivo.value);
  } catch (error) {}
}

function parseFechaInput(fecha) {
  if (!fecha) return null;
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

function cerrarModals() {
  modalTi.value = false;
  modalTf.value = false;
}

async function guardar() {
  root.$validator.validate().then(async (valid) => {
    if (valid) {
      const data = await getSaveEquipoService(
        equipo.value,
        fechaIF.value,
        fechaFF.value,
        horaI.value,
        horaF.value
      );
      itemsTablaCancelar();
      limpiarCamposNuevo();
      dialogNuevo.value = false;
    }
  });
}

function limpiarCamposNuevo() {
  espacioDeportivo.value = "";
  equipo.value = "";
  fechaIF.value = "";
  fechaFF.value = "";
  horaI.value = "";
  horaF.value = "";
}
</script>
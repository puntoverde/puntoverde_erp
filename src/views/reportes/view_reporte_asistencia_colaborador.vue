<template>
  <div id="view-reporte-print">
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Reporte Incidencias</h1>
      <div class="d-flex" style="column-gap: 5px;">
        <v-btn fab dark small color="indigo" @click="modal = true">
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
      <v-btn fab dark small color="warning" @click="dialog = true">
        <v-icon>mdi-account-search</v-icon>
      </v-btn>
        <v-btn fab dark small color="purple" @click="print">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="open">
        <v-icon>mdi-table-arrow-up</v-icon>
      </v-btn>
      
      </div>
    </div>

    <v-card class="rounded tableuno">
      <div class="pt-1 secondary"></div>
      <v-card-text>
        <div id="grid-colaborador">
          <span class="text-subtitle-1 font-weight-bold accent--text"
            >No. Empleado</span
          >
          <span class="text-subtitle-1 font-weight-bold accent--text"
            >Nombre</span
          >
          <span class="text-subtitle-1 font-weight-bold accent--text"
            >Departamento</span
          >
          <span class="text-subtitle-1 font-weight-bold accent--text"
            >Periodo</span
          >
          <span class="text-subtitle-1 font-weight-bold accent--text"
            >Total Horas</span
          >

          <span>{{ nomina }}</span>
          <span>{{ nombre_colaborador }}</span>
          <span>{{ departamento }}</span>
          <span>
            {{ dayjs(date[0]).locale("es").format("DD [de] MMMM") }} al
            {{ dayjs(date[1]).locale("es").format("DD [de] MMMM") }}
          </span>
          <span>{{ numeral(cTotalHOras).format("0:0") }}</span>

          <div
            class="secondary white--text d-flex flex-column align-center rounded-l-lg"
          >
            <span class="text-subtitle-1 font-weight-bold">Faltas:</span>
            <span> {{ cFaltas }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center">
            <span class="text-subtitle-1 font-weight-bold"
              >Retardo Menor:
            </span>
            <span>{{ cRMenor }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center">
            <span class="text-subtitle-1 font-weight-bold"
              >Retardo Mayor:
            </span>
            <span>{{ cRMayor }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center">
            <span class="text-subtitle-1 font-weight-bold">Permisos: </span>
            <span>{{ cPermiso }}</span>
          </div>
          <div
            class="white--text secondary d-flex flex-column align-center rounded-r-lg"
          >
            <span class="text-subtitle-1 font-weight-bold">Vacaciones:</span>
            <span>{{cVacacion}}</span>
          </div>

          <div class="alerts-estatus pl-3">
            <div class="blue lighten-3 px-3 mt-2" style="width: 100%">
              Tolerancia
            </div>
            <div class="orange lighten-3 px-3 mt-2" style="width: 100%">
              Retardo Menor
            </div>
            <div class="yellow lighten-3 px-3 mt-2" style="width: 100%">
              Retardo Mayor
            </div>
            <div class="red lighten-3 px-3 mt-2" style="width: 100%">Falta</div>
            <div class="green lighten-3 px-3 mt-2" style="width: 100%">
              Asistencia
            </div>
          </div>
        </div>
      </v-card-text>
      <div class="pt-1 secondary"></div>
    </v-card>

    <div class="elevation-5 mt-5 rounded-xl" style="background-color: #fcfcfc">
      <div style="height: 48px; border-bottom: 2px solid #000"></div>
      <v-simple-table densex class="table">
        <thead style="background-color: white">
          <tr>
            <th>dias</th>
            <th>Horario</th>
            <th>Hora Entrada</th>
            <th>Hora Salida</th>
            <th>Hora Extra</th>
            <th>Tiempo</th>
            <th>Permisos</th>
            <th>Estatus</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(dia, ind) in lst_datos">
          

            <tr :key="ind" v-if="dia.descanso">
                <td
                  style="
                    background-color: #fffde7;
                    border-left: 5px solid #000;
                    box-sizing: content-box;
                  "
                >               
                  <span class="font-weight-bold mr-1">{{ dia.dia_name }}</span>
                  <span class="font-italic">{{
                    dayjs(dia.dia).locale("es").format("DD MMMM")
                  }} </span>
                </td> 
                <template v-if="dia?.asistencia">
                  <td style="text-align: left; background-color: #fffde7" class="font-weight-bold">Descanso</td>
                  <td style="text-align: left; background-color: #fffde7" class="px-0">
                   <div class="px-1">
                     <span class="font-weight-bold accent--text">{{
                      dia.asistencia_entrada
                    }}</span>
                    </div>
                  </td>
                  <td style="text-align: left; background-color: #fffde7" class="px-0">
                  <div class="px-1">
                     <span class="font-weight-bold accent--text">{{
                      dia.asistencia_salida
                    }}</span>
                    </div>
                  </td>  
                  <td style="text-align: left; background-color: #fffde7"></td> 
                  <td class="text-center" style="text-align: left; background-color: #fffde7">
                  <span
                    class="text-subtitle-1 font-weight-black rounded px-1"
                    style="border: 1px solid #000"
                    >{{ dia.rango_horas }}</span
                  >
                </td>
                
                <td style="width:200px;background-color: #fffde7 ">
                <div
                  v-for="(permiso, inde5) in dia.descripcion"
                  :key="inde5"
                  class="px-1 cpermiso"
                >
                  {{ permiso }}
                </div>
              </td>

                <td style="text-align: left; background-color: #fffde7"></td> 
              <td colspan="3" style="text-align: center;">

              </td>
                </template>
              
              <td v-else
                  colspan="7"
                  style="text-align: center; background-color: #fffde7"
                >
                  <b>Descanso</b>
                </td>

              </tr>

            <tr :key="ind" v-else>
              <td>
                <span class="font-weight-bold mr-1">{{ dayjs(dia.dia).format("dddd") }}</span>
                <span class="font-italic">{{dayjs(dia.dia).locale("es").format("DD MMMM")}}</span>
              </td>
              <td class="px-0">
                <div
                  v-for="(horario, inde2) in dia.horarios_full"
                  :key="inde2"
                  class="px-1 font-weight-bold"
                  :class="{ 'py-1': dia.horarios_full.length == 2 }"
                >
                  {{ horario }}
                </div>
              </td>
              <td class="px-0">
                <div
                  v-for="(asistencia_entrada, inde3) in dia.asistencia_entrada"
                  :key="inde3"
                  class="px-1"
                  :class="{ 'py-1': dia.asistencia_entrada.length == 2 }"
                >
                  <span
                    v-if="asistencia_entrada == 'Omisión'"
                    class="font-italic"
                    >{{ asistencia_entrada }}</span
                  >
                  <span v-else class="font-weight-bold accent--text">{{
                    asistencia_entrada
                  }}</span>
                </div>
              </td>
              <td class="px-0">
                <div
                  v-for="(asistencia_salida, inde4) in dia.asistencia_salida"
                  :key="inde4"
                  class="px-1"
                  :class="{ 'py-1': dia.asistencia_salida.length == 2 }"
                >
                  <span
                    v-if="asistencia_salida == 'Omisión'"
                    class="font-italic"
                    >{{ asistencia_salida }}</span
                  >
                  <span v-else class="font-weight-bold accent--text">{{
                    asistencia_salida
                  }}</span>
                </div>
              </td>
              <td style="width: 160px;">
                <span class="font-weight-bold accent--text">
                {{dia.extras_?.join(' a ')}}
              </span>
              </td>
              <td class="text-center">
                <span
                  class="text-subtitle-1 font-weight-black rounded px-1"
                  style="border: 1px solid #000"
                  >{{ dia.rango_horas }}</span
                >
              </td>

              <td style="width:200px">
                <div
                  v-for="(permiso, inde5) in dia.descripcion"
                  :key="inde5"
                  class="px-1 cpermiso"
                >
                  {{ permiso }}
                </div>
              </td>
              <td class="px-1x text-centerx" style="width: 130px">
                
                <v-chip
                  style="width: 100%"
                  class="text-center"
                  :color="dia.estatus_color"
                  >                  
                  {{ dia.estatus_text }}                                    
                  </v-chip
                >
                
              </td>
              <td style="width:100px" v-if="dia.is_rh==1">               
                <v-tooltip bottom v-if="[0,1,2,3,4,5].includes(dia.estatus)">
                  <template v-slot:activator="{on,attrs}">
                <v-btn fab x-small outlined v-on="on" v-bind="attrs" @click="fnOpenAddIncidencia(dia.Date)"><v-icon>mdi-plus</v-icon></v-btn>
                  </template>
                  <span>Agregar incidencia</span>
                </v-tooltip>
                <v-tooltip bottom v-if="[6,7,8,9].includes(dia.estatus)">
                  <template v-slot:activator="{on,attrs}">
                <v-btn fab x-small outlined v-on="on" v-bind="attrs" @click="fnOpenAddIncidenciaUpdate(dia.Date)"><v-icon>mdi-pencil</v-icon></v-btn>
                  </template>
                  <span>Modificar incidencia</span>
                </v-tooltip>
              </td> 
            </tr>
          </template>
        </tbody>
      </v-simple-table>
      <div style="height: 30px; border-top: 2px solid #000"></div>
    </div>

    <v-dialog persistent width="500px" v-model="dialog">
      <v-card>
        <v-toolbar color="secondary" elevation="0" dark>
          <v-toolbar-title> Buscar Colaborador </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <div class="pt-1 primary"></div>
        <v-card-text class="mt-5">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Nomina"
                placeholder="Buscar mediante numero de nomina"
                @keyup.enter="buscarByNomina"
                filled
                :error-messages="mensaje_colaborador"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                label="nombre colaborador"
                placeholder="Buscar mediante nombre Colaborador"
                :items="lst_colaboradores"
                :search-input.sync="search"
                hide-no-data
                item-text="empleado"
                item-value="id_colaborador"
                prepend-inner-icon="mdi-account"
                hide-details
                return-object
                @input="buscarByName"
                filled
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      ref="dialog_date"
      v-model="modal"
      :return-value.sync="date"
      persistent
      width="470px"
      @input="cambioDate"
    >
      <v-date-picker
        v-model="date"
        scrollable
        landscape
        range
        locale="es-mx"
        color="secondary"
      >
        <v-spacer></v-spacer>
        <v-btn text color="secondary" @click="modal = false"> Cancelar </v-btn>
        <v-btn text color="secondary" @click="$refs.dialog_date.save(date)">
          aceptar
        </v-btn>
      </v-date-picker>
    </v-dialog>



    <v-dialog v-model="dialog_incidencias" width="750" scrollable persistent>
      <v-card >
        <v-toolbar color="secondary" dark>Alta incidencia para el dia {{dayjs(fecha_incidencia??undefined).format('dddd DD [de] MMMM [de] YYYY')}}
        <v-spacer></v-spacer>
        <v-btn @click="dialog_incidencias=false" fab outlined small> <v-icon>mdi-close</v-icon> </v-btn>

        </v-toolbar>
        <v-card-text class="d-flex pt-5">
        <!-- <v-list width="350"> -->
        <v-list width="350" :color="Boolean(iErrors.id_tipo_incidencia)?'error':''">
          <!-- <v-subheader>seleccione incidencia</v-subheader> -->
          <v-list-item-group v-model="id_tipo_incidencia">
            <v-list-item
              v-for="item in lst_tipo_incidencia"
              :key="item.id_tipo_incidencia"
              :value="item.id_tipo_incidencia"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.nombre }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-divider vertical class="mx-3"></v-divider>

        <v-textarea v-model="descripcion" label="descripcion incidencia" placeholder="Descripción incidencia" filled rows="10"  :error-messages="iErrors.descripcion"></v-textarea>
        <!-- <v-textarea v-model="descripcion" label="descripcion incidencia" placeholder="Descripción incidencia" filled rows="10"></v-textarea> -->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnCreateIncidencia" color="secondary">Agregar incidencia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_incidencias_update" width="750" scrollable persistent>
      <v-card >
        <v-toolbar color="secondary" dark>Alta incidencia para el dia {{dayjs(fecha_incidencia??undefined).format('dddd DD [de] MMMM [de] YYYY')}}
        <v-spacer></v-spacer>
        <v-btn @click="dialog_incidencias_update=false" fab outlined small> <v-icon>mdi-close</v-icon> </v-btn>

        </v-toolbar>
        <v-card-text class="d-flex pt-5">
        <!-- <v-list width="350"> -->
        <v-list width="350" :color="Boolean(iErrors.id_tipo_incidencia)?'error':''">
          <!-- <v-subheader>seleccione incidencia</v-subheader> -->
          <v-list-item-group v-model="id_tipo_incidencia">
            <v-list-item
              v-for="item in lst_tipo_incidencia"
              :key="item.id_tipo_incidencia"
              :value="item.id_tipo_incidencia"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.nombre }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>

        <v-divider vertical class="mx-3"></v-divider>

        <v-textarea v-model="descripcion" label="descripcion incidencia" placeholder="Descripción incidencia" filled rows="10"  :error-messages="iErrors.descripcion"></v-textarea>
        <!-- <v-textarea v-model="descripcion" label="descripcion incidencia" placeholder="Descripción incidencia" filled rows="10"></v-textarea> -->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnUpdateIncidencia" color="secondary">Agregar incidencia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!-- <v-speed-dial v-model="fab" fixed right bottom direction="left">
      <template v-slot:activator>
        <v-btn v-model="fab" color="secondary" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-file-cog </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="purple" @click="print">
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      <v-btn fab dark small color="green" @click="open">
        <v-icon>mdi-table-arrow-up</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo" @click="modal = true">
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
      <v-btn fab dark small color="warning" @click="dialog = true">
        <v-icon>mdi-account-search</v-icon>
      </v-btn>
    </v-speed-dial> -->

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="150">
        <h3 class="pl-7">Subiendo Asistencias</h3>
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance } from "vue";
import numeral from "numeral";
import isUndefined from "lodash/isUndefined";
import _isEmpty from "lodash/isEmpty";
import _debounce from "lodash/debounce";
import zip from "lodash/zip";
import first from "lodash/first";
import last from "lodash/last";
import round from "lodash/round";
import printJS from "print-js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/es";
import { useFileDialog } from "@vueuse/core";
import {
  getColaboradorByNominaService,
  getColaboradoresByNameService,
  getAsistenciaColaboradorService,
  setUpdateTxtService,
} from "@/services/asistencia_colaborador_service";
import {
  getTipoIncidenciaService,
  createIncidenciaService,
  updateIncidenciaService
} from "@/services/incidencias_service";
import { el as $dom, setChildren as $setChildren } from "redom";
import {useValidacionIncidencia} from '@/composables/useValidacionIncidencias'

const root = getCurrentInstance().proxy;

const {iValid, iErrors, iClear } =useValidacionIncidencia()

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const { files, open, reset, onChange } = useFileDialog();

const id_colaborador = ref(0);
const nomina = ref(0);
const nombre_colaborador = ref("");
const departamento = ref("");
const lst_datos = ref([]);
const date = ref([]);
const menu = ref(false);
const dialog = ref(false);
const fab = ref(false);
const modal = ref(false);
const overlay = ref(false);
const lst_colaboradores = ref([]);
const search = ref("");


//tipo incidencia
const dialog_incidencias=ref(false)
const dialog_incidencias_update=ref(false)

const id_tipo_incidencia=ref()
const descripcion=ref()
const fecha_incidencia=ref()
const lst_tipo_incidencia=ref([])

const mensaje_colaborador=ref()

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

const cFaltas = computed(
  () =>
    lst_datos.value.filter(
      (i) => i.estatus === 0 && !Boolean(i.is_permiso) && !Boolean(i.is_asueto)
    ).length
);
const cRMenor = computed(
  () => lst_datos.value.filter((i) => i.estatus === 3).length
);
const cRMayor = computed(
  () => lst_datos.value.filter((i) => i.estatus === 4).length
);
const cPermiso = computed(
  () => lst_datos.value.filter((i) => i.estatus == 6).length
);
const cVacacion = computed(
  () => lst_datos.value.filter((i) => i.estatus == 7).length
);
const cTotalHOras = computed(() =>
  lst_datos.value
    .filter((i) => !isUndefined(i.rango_horas))
    .map((i) => i.rango_horas.split(":"))
    .reduce((red, [h, m, s]) => {
      let horas = red.add(numeral(h).value(), "h");
      let minutos = horas.add(numeral(m).value(), "m");
      let segundos = minutos.add(numeral(s).value(), "s");
      return segundos;
    }, dayjs().startOf("year"))
    .diff(dayjs().startOf("year"), "s")
);

watch(search, (val) => {
  getColaboradores(val);
  fnGetTipoIncidencia()
});

onChange(async () => {
  const [file] = files.value;

  console.log("🚀 ~ file: view_reporte_asistencia_colaborador.vue:434 ~ onChange ~ file:", file);


  const confirm = await root.$confirm(
    `Desea realmente adjuntar archivo con nombre " ${file.name} " en caso de si seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>`,
    { title: "info", width: 350, persistent: true }
  );

  if (confirm) {
    const form = new FormData();
    form.append("txt_accesos", file);
    overlay.value = true;
    await setUpdateTxtService(form);
    overlay.value = false;
    getAsistencia();
  } else reset();
});

function cambioDate() {
   date.value.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1)); //saca las dos fechas y las ordena
  if (id_colaborador.value > 0) getAsistencia();
}

async function buscarByNomina($event) {
  console.log($event.target.value);
  mensaje_colaborador.value=''
  if ($event.target.value > 0) {
    
    const data = await getColaboradorByNominaService($event.target.value);
    if(_isEmpty(data)){
      mensaje_colaborador.value=`Sin datos para nomina ${$event.target.value}`
      return 
    }
    nomina.value = $event.target.value;
    nombre_colaborador.value = data.empleado;
    id_colaborador.value = data.id_colaborador;
    departamento.value = data.departamento;
    getAsistencia();
    dialog.value = false;
  }
}

async function buscarByName(data) {
  console.log(data);
  nombre_colaborador.value = data.empleado;
  id_colaborador.value = data.id_colaborador;
  nomina.value = data.nomina;
  departamento.value = data.departamento;
  getAsistencia();
  dialog.value = false;
}

const getColaboradores = _debounce(async (name_or_nomina) => {
  try {
    const data = await getColaboradoresByNameService(name_or_nomina);
    lst_colaboradores.value = data;
  } catch (e) {}
}, 250);

async function getAsistencia() {
  try {
    const cve_persona_session = root.$ls.get("user", {cve_persona: 0}).cve_persona;
    const data = await getAsistenciaColaboradorService(
      id_colaborador.value,
      date.value,
      cve_persona_session
    );
    formatAsistencias(data.reverse());
  } catch (error) {}
}

function formatAsistencias(data) {
  //estatus
  //0->falta
  //1->asistencia
  //2->tolerancia
  //3->retardo menor
  //4->retardo mayor
  //5->omision
  //6->permiso
  //7->vacaciones
  //8->asueto
  //9->incidencia
  //10->dia que aun no es valido dia a futuro 
  try{

  lst_datos.value =data.map((i) => {    

    //hora entrada de su horario caso jose leon es de [16:15:00,18:00:00]
    const _hora_entrada = (i.hora_entrada ?? "").split(",").filter(Boolean);
    //hora salida de su horario caso jose leon es de [17:30:00,22:15:00]
    const _hora_salida = (i.hora_salida ?? "").split(",").filter(Boolean);

    
    //son el numero de checada pueden ser n cantidad jose leon ejemplo  [16:17:20,22:23:12]
    const asistencia_=(i.asistencia ?? "").split(",").filter(Boolean);
    const asistencia_revision_=(i.asistencia_revision ?? "").split(",").filter(Boolean);

    const _asistencia = [...asistencia_,...asistencia_revision_].sort((a,b)=>dayjs(a,'HH:mm:ss').isAfter(dayjs(b,'HH:mm:ss'),'m')? 1 : -1)

    //se buscan las horas extras
    const extras_=(i.extras ?? "").split(",").filter(Boolean);
    
    
    
    //es la descripcion de un permiso para la fecha que se recorre
    const descripcion = (i.descripcion ?? "").split("|").filter(Boolean);
    //bandera que indica que no se cuenta con dia de entrada y salida por ende es que no tiene horario dando como descanzo jose leon ejemplo domingo
    const descanso = !Boolean(i.dia_entrada) && !Boolean(i.dia_salida);
    //bandera que indica que el dia de entrada es el mismo de salida jose leon ejemplo 1=lunes es igua a 1=lunes pero ejemplo puga 1=lunes sale 2=martes
    const _flag_dia = i.dia_entrada === i.dia_salida;

    //indica que si es un dia valido osea un dia que ya paso no undia a futuro
    const is_day_valid=dayjs(i.Date).isSameOrBefore(dayjs(),'D');


    //hora_entrada [16:15:00,18:00:00]  hora salida [17:30:00,22:15:00]
    //con zip de lodash es [[16:15:00,17:30:00],[18:00:00,22:15:00]]
    const horarios_full = zip(_hora_entrada, _hora_salida).map(([i, ii]) =>
      [i.substring(0, 5), ii.substring(0, 5)].join(" a ")
    ); //['16:15 a 17:30', '18:00 a 22:15'] o ['09:00 a 15:00']

    
    const h_default={dia_name:i.dia_name,descanso,dia:i.dia,horarios_full,descripcion, is_rh:i.is_rh}

    //descanzo y sin registro de asistencia lo normal
    //el codigo que sigue abajo actua como el continues de un for normal
    if (descanso && _asistencia?.length === 0) return {...h_default};

    if (descanso && _asistencia?.length > 0){
        
        const [asistencia_entrada,asistencia_salida]=_asistencia
        if(Boolean(asistencia_salida)){
          const rango_horas = numeral(round(dayjs(asistencia_salida, "HH:mm:ss").diff(dayjs(asistencia_entrada, "HH:mm:ss"),"s"),2)).format("0:0");    
          return { ...h_default,asistencia:_asistencia,asistencia_entrada ,asistencia_salida:asistencia_salida,extras_,rango_horas};
        }
        else{
           return { ...h_default,asistencia:_asistencia,asistencia_entrada ,asistencia_salida:'Omisión',extras_,rango_horas:'Omisión'};
        }
        }
       

    //si no hay asistencia y no hay permiso ni es dia de asueto el falta o es que no checo por algun problema(olvido o el reloj checador no sirve con el...)
    if (_asistencia.length === 0 && i.is_permiso == 0 && i.is_vacaciones==0 && i.is_asueto == 0 && i.is_incidencia == 0 && is_day_valid) {    
      return {...h_default,rango_horas:'NA',estatus:0,estatus_text:'Falta',estatus_color:'red lighten-3',is_falta:1}
    }

    //indica que se tiene un permiso
        if (i.is_permiso == 1) {
        return {
          ...h_default,
          extras_,
          rango_horas: "NA",
          estatus: 6,
          estatus_text: "Permiso",
          estatus_color: "purple lighten-3",
        };
      }

      if (i.is_vacaciones == 1) {
        return {
          ...h_default,
          extras_,
          rango_horas: "NA",
          estatus: 7,
          estatus_text: "Vacaciones",
          estatus_color: "indigo lighten-3",
        };
      }
      
      if (i.is_asueto == 1) { 
        // const rango_horas = numeral(round(dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"), "s"), 2));

        console.log("rango en asueto:")

        const [asistencia_entrada, asistencia_salida] = _asistencia    
        const rango_horas = numeral(round(dayjs(asistencia_salida, "HH:mm:ss").diff(dayjs(asistencia_entrada, "HH:mm:ss"), "s"), 2)).format("0:0");
       
        
        return {
          ...h_default,
          extras_,
          rango_horas: rango_horas??"NA",
          estatus: 8,
          estatus_text: "Asueto",
          estatus_color: "pink lighten-3",
          // asistencia_entrada: [first(_asistencia)], asistencia_salida: [last(_asistencia)],
          asistencia_entrada: [asistencia_entrada], asistencia_salida: [asistencia_salida],
        };
      }
      
      if (i.is_incidencia == 1) {
        return {
          ...h_default,
          extras_,
          rango_horas: "NA",
          estatus: 9,
          estatus_text: "incidencia",
          estatus_color: "teal lighten-3",
          // estatus_color: "teal lighten-3",
        };
      }
     
     if (!is_day_valid) {
        return {
          ...h_default,
          extras_,
          rango_horas: "NA",
          estatus: 10,
          estatus_text: "dia sin registro",
          estatus_color: "grey lighten-3",
          // estatus_color: "teal lighten-3",
        };
      }

    let estatus=0
    let estatus_text=''
    let estatus_color=''

    //indica la entrada es menor del horario  es decir entraste a las 16:10 es menor o igual que tu horario 16:15
    const _entrada_antes = dayjs(
      first(_asistencia),
      "HH:mm:ss"
    ).isSameOrBefore(dayjs(first(_hora_entrada), "HH:mm:ss"), "m");
    //indica que la entrada esta en el horario y 5 min mas ejemplo entrada es 14:00 y 14:05 y el llego alas 14:03 esta en el rango
    const _entrada_tolerancia = dayjs(
      first(_asistencia),
      "HH:mm:ss"
    ).isBetween(
      dayjs(first(_hora_entrada), "HH:mm:ss"),
      dayjs(first(_hora_entrada), "HH:mm:ss").add(5, "m"),
      "m",
      "(]"
    );
    //indica que la entrada esta en el horario de 10 min mas eejmplo extrada es 14:05 por la toelerancia y maximo 14:10 ya 5 min mas de la tolerancia es retado mayor
    const _entrada_retardo_menor = dayjs(
      first(_asistencia),
      "HH:mm:ss"
    ).isBetween(
      dayjs(first(_hora_entrada), "HH:mm:ss").add(5, "m"),
      dayjs(first(_hora_entrada), "HH:mm:ss").add(10, "m"),
      "m",
      "(]"
    );
    //es cuando pasas de mas de 10 min tu hora de entrada indica si entraste a las 16:26:00 ya es mas que tuo hora mas 10 min osea 16:25:00
    const _entrada_retardo_mayor = dayjs(
      first(_asistencia),
      "HH:mm:ss"
    ).isAfter(dayjs(first(_hora_entrada), "HH:mm:ss").add(10, "m"), "m");

  
    //indican los estatus y los colores y textos de incidencias
    if (_entrada_antes) {
      estatus = 1; //asistencia
      estatus_color = "green lighten-3"; //color gris
      estatus_text = "Asistencia";
    } else if (_entrada_tolerancia) {
      estatus = 2; //tolerancia
      estatus_color = "blue lighten-3"; //el color cambia azul que es tolerancia
      estatus_text = "Tolerancia";
    } else if (_entrada_retardo_menor) {
      estatus = 3; //retardo menor
      estatus_color = "orange lighten-3"; //el color cambia naranja por retardo menor
      estatus_text = "Retardo Menor";
    } else if (_entrada_retardo_mayor) {
      estatus = 4; //retardo mayor
      estatus_color = "yellow lighten-3"; //el color cambia amarillo por retardo mayor
      estatus_text = "Retardo Mayor";
    }

    //ejemplo si es uno ['09:00 a 15:00'] no tiene horario de comida
    //indica que tien un dia corrido sin comida y hay un registro
    if (horarios_full.length === 1 && _asistencia.length == 1) {
      return  {...h_default,extras_,rango_horas:'Omisión',estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia)],asistencia_salida:["Omisión"]}
    }

    

    if (horarios_full.length === 1 && _asistencia.length > 1) {
     
      const _rango_horas=numeral(
        round(
          dayjs(last(_asistencia), "HH:mm:ss").diff(
            dayjs(first(_asistencia), "HH:mm:ss"),
            "s"
          ),
          2
        )
      ).format("0:0");

      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(
        dayjs(first(i.asistencia), "HH:mm:ss"),
        "s"
      );
      let tiempo_horario = dayjs(last(_hora_salida), "HH:mm:ss").diff(
        dayjs(first(i.hora_entrada), "HH:mm:ss"),
        "s"
      );
      if (tiempo_asistencia < tiempo_horario)
        estatus_color = "blue-grey lighten-3"; //color gris indica que puedo entrar antes o salir antes ???
      return {...h_default,extras_,rango_horas:_rango_horas,estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia)],asistencia_salida:[last(_asistencia)]}
    }

    

    if (horarios_full.length === 2 && _asistencia.length == 1) {    
      return {...h_default,extras_,rango_horas:"Omisión",estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), "Omisión"],asistencia_salida:["Omisión", "Omisión"]}
    }

    

    if (horarios_full.length === 2 && _asistencia.length == 2) {

      const _rango_horas=numeral(
        round(
          dayjs(last(_asistencia), "HH:mm:ss").diff(
            dayjs(first(_asistencia), "HH:mm:ss"),
            "s"
          ),
          2
        )
      ).format("0:0");
      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(
        dayjs(first(_asistencia), "HH:mm:ss"),
        "s"
      );
      let tiempo_horario_uno = dayjs(first(_hora_salida), "HH:mm:ss").diff(
        dayjs(first(_hora_entrada), "HH:mm:ss"),
        "s"
      );
      let tiempo_horario_dos = dayjs(last(_hora_salida), "HH:mm:ss").diff(
        dayjs(last(_hora_entrada), "HH:mm:ss"),
        "s"
      );
      let tiempo_horario = tiempo_horario_uno + tiempo_horario_dos;
      if (tiempo_asistencia < tiempo_horario)
        estatus_color = "blue-grey lighten-3";
      return {...h_default,extras_,rango_horas:_rango_horas,estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), "Omisión"],asistencia_salida:["Omisión", last(_asistencia)]}
    }

    

    if (horarios_full.length === 2 && _asistencia.length == 3) {
    
      const _rango_horas = numeral(
        round(
          dayjs(last(_asistencia), "HH:mm:ss").diff(
            dayjs(first(_asistencia), "HH:mm:ss"),
            "s"
          ),
          2
        )
      ).format("0:0");
      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(
        dayjs(first(_asistencia), "HH:mm:ss"),
        "s"
      );
      let tiempo_horario = dayjs(last(_hora_salida), "HH:mm:ss").diff(
        dayjs(first(_hora_entrada), "HH:mm:ss"),
        "s"
      );

      if (tiempo_asistencia < tiempo_horario)
        estatus_color = "blue-grey lighten-3"; //azul tolerancia
      return {...h_default,extras_,rango_horas:_rango_horas,estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), _asistencia[1]],asistencia_salida:["Omisión", last(_asistencia)]}
    }

    

    if (horarios_full.length === 2 && _asistencia.length > 3) {
      

      let rango_horas_1 = dayjs(last(_asistencia), "HH:mm:ss").diff(
        dayjs(first(_asistencia), "HH:mm:ss"),
        "s"
      );

      let rango_horas_2 = dayjs(_asistencia[2], "HH:mm:ss").diff(
        dayjs(_asistencia[1], "HH:mm:ss"),
        "s"
      );

      const _rango_horas = numeral(round(rango_horas_1 - rango_horas_2, 2)).format(
        "0:0"
      );

      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(
        dayjs(first(_asistencia), "HH:mm:ss"),
        "s"
      );
      let tiempo_horario_uno = dayjs(first(_hora_salida), "HH:mm:ss").diff(
        dayjs(first(_hora_entrada), "HH:mm:ss"),
        "s"
      );

      let tiempo_horario_dos = dayjs(last(_hora_salida), "HH:mm:ss").diff(
        dayjs(last(_hora_entrada), "HH:mm:ss"),
        "s"
      );

      let tiempo_horario = tiempo_horario_uno + tiempo_horario_dos;
      if (tiempo_asistencia < tiempo_horario)estatus_color = "blue-grey lighten-3";


      return {...h_default,extras_,rango_horas:_rango_horas,estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), _asistencia[2]],asistencia_salida:[_asistencia[1], last(_asistencia)]}
    }

  });

  }
  catch(e){
    console.log(e)
  }
}

function print() {
  /**table 1 */
  const table = $dom("table", {
    style: { width: "100%", borderCollapse: "collapse", marginBottom: "10px" },
  });
  const table_body = $dom("tbody");
  const table_body_row1 = $dom("tr", [
    $dom("td", "No. Empleado", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td", nomina.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", "Nombre", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td", nombre_colaborador.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", "faltas", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td", cFaltas.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
  ]);
  const table_body_row2 = $dom("tr", [
    $dom("td", "Departamento", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td", departamento.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", "Periodo", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom(
      "td",
      `${dayjs(date.value[0]).locale("es").format("DD [de] MMMM")} al ${dayjs(
        date.value[1]
      )
        .locale("es")
        .format("DD [de] MMMM")}`,
      { style: { border: "1px solid #000", fontSize: "12px" } }
    ),
    $dom("td", "Retardo Menor", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td", cRMenor.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
  ]);
  const table_body_row3 = $dom("tr", [
    $dom("td", "Total Horas", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td", numeral(cTotalHOras.value).format("0:0"), {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", "Retardo Mayor", {
      style: { border: "1px solid #000", fontSize: "12px" ,fontWeight:'bold'},
    }),
    $dom("td", cRMayor.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
  ]);
  const table_body_row4 = $dom("tr", [
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", "Permisos", {
      style: { border: "1px solid #000", fontSize: "12px" ,fontWeight:'bold'},
    }),
    $dom("td", cPermiso.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
  ]);
  const table_body_row5 = $dom("tr", [
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", "Vacaciones", {
      style: { border: "1px solid #000", fontSize: "12px",fontWeight:'bold' },
    }),
    $dom("td",cVacacion.value, { style: { border: "1px solid #000", fontSize: "12px" } }),
  ]);
  $setChildren(table_body, [
    table_body_row1,
    table_body_row2,
    table_body_row3,
    table_body_row4,
    table_body_row5,
  ]);
  $setChildren(table, [table_body]);

  /**table 2 */
  let [table2] = document.querySelectorAll(".table table");
  table2 = table2.cloneNode(true);

  table2.style.width = "100%";
  table2.style.borderCollapse = "collapse";

  const [thead, tbody2] = table2.children;

  Array.from(thead.children).forEach((tr) => {
    Array.from(tr.children).forEach((th) => {
      th.style.border = "1px solid #000";
      th.style.fontSize = "12px";
    });
  });

  Array.from(tbody2.children).forEach((tr) => {
    Array.from(tr.children).forEach((td) => {
      td.style.border = "1px solid #000";
      td.style.fontSize = "12px";
    });
  });

  const divPrint = $dom("div", { style: { fontFamily: "Arial" } }, [
    table,
    table2,
  ]);

  printJS({ printable: divPrint.outerHTML, type: "raw-html" });
}


//apartado para lo de incidencia por parte de rh

async function fnGetTipoIncidencia() {
  try {
    const data = await getTipoIncidenciaService();

    console.log("🚀 ~ file: view_incidencias.vue:600 ~ data:", data);

    lst_tipo_incidencia.value = data;
  } catch (error) {}
}

function fnOpenAddIncidencia(fecha) {
  id_tipo_incidencia.value=undefined
  descripcion.value=undefined
  fecha_incidencia.value=fecha
  dialog_incidencias.value = true;
  iClear()
}

function fnOpenAddIncidenciaUpdate(fecha) {
  id_tipo_incidencia.value=undefined
  descripcion.value=undefined
  fecha_incidencia.value=fecha
  dialog_incidencias_update.value = true;
  iClear()
}

async function fnCreateIncidencia()
{

  try {
    const id_colaborador_encargado = root.$ls.get("user", {cve_persona: 0}).cve_persona;
    const data_send={
	            id_tipo_incidencia:id_tipo_incidencia.value,
	            id_colaborador_encargado,
	            id_colaborador:id_colaborador.value,
	            // id_colaborador_acceso:null,
	            fecha_incidencia:fecha_incidencia.value,
	            descripcion:descripcion.value
}

    const data_valid=await iValid(data_send)

    console.log("🚀 ~ file: view_incidencias.vue:714 ~ data_valid:", data_valid);

    const data=await createIncidenciaService(data_valid)
    if(data>0)
    {
      const index= lst_datos.value.findIndex(i=>i.Date==fecha_incidencia.value)
      const incidencia_name=lst_tipo_incidencia.value.find(i=>i.id_tipo_incidencia==id_tipo_incidencia.value)?.nombre

lst_datos.value[index].estatus=9
lst_datos.value[index].estatus_text="incidencia"
lst_datos.value[index].estatus_color="teal lighten-3"
lst_datos.value[index].descripcion=[`INCIDENCIA ${incidencia_name}`,descripcion.value]

id_tipo_incidencia.value=undefined
descripcion.value=undefined

dialog_incidencias.value=false
    }
  } catch (error) {
    console.log(error)
  }
}


async function fnUpdateIncidencia()
{

  try {
    const id_colaborador_encargado = root.$ls.get("user", {cve_persona: 0}).cve_persona;
    const data_send={
	            id_tipo_incidencia:id_tipo_incidencia.value,
	            id_colaborador_encargado,
	            id_colaborador:id_colaborador.value,
	            // id_colaborador_acceso:null,
	            fecha_incidencia:fecha_incidencia.value,
	            descripcion:descripcion.value
}

    const data_valid=await iValid(data_send)

    console.log("🚀 ~ file: view_incidencias.vue:714 ~ data_valid:", data_valid);

    const data=await updateIncidenciaService(data_valid)
    if(data>0)
    {
      const index= lst_datos.value.findIndex(i=>i.Date==fecha_incidencia.value)
      const incidencia_name=lst_tipo_incidencia.value.find(i=>i.id_tipo_incidencia==id_tipo_incidencia.value)?.nombre

lst_datos.value[index].estatus=9
lst_datos.value[index].estatus_text="incidencia"
lst_datos.value[index].estatus_color="teal lighten-3"
lst_datos.value[index].descripcion=[`INCIDENCIA ${incidencia_name}`,descripcion.value]

id_tipo_incidencia.value=undefined
descripcion.value=undefined

dialog_incidencias_update.value=false
    }
  } catch (error) {
    console.log(error)
  }
}


</script>

<style scoped>
#grid-colaborador {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.alerts-estatus {
  grid-column-start: 6;
  grid-row-start: 1;
  grid-row-end: 4;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

>>> .table table {
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
}

.cpermiso:first-child {
  /* background-color: #7986cb; */
  background-color: #424242;
  color: white;
  font-weight: bold;
}

.cpermiso:last-child {
  /* color: #7986cb !important; */
  color: #424242 !important;
}
</style>
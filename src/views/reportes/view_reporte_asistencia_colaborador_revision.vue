<template>
  <div id="view-reporte-print">
    <div class="d-flex justify-space-between">

      <h1 class="accent--text oswald--text">Revision de Incidencias</h1>
      <div class="d-flex" style="column-gap: 5px;">
        <v-btn fab dark small color="indigo" @click="modal = true">
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
        <v-btn fab dark small color="warning" @click="dialog = true">
          <v-icon>mdi-account-search</v-icon>
        </v-btn>
      </div>
    </div>

    <v-card class="rounded tableuno">
      <div class="pt-1 secondary"></div>
      <v-card-text>
        <div id="grid-colaborador">
          <span class="text-subtitle-1 font-weight-bold accent--text">No. Empleado</span>
          <span class="text-subtitle-1 font-weight-bold accent--text">Nombre</span>
          <span class="text-subtitle-1 font-weight-bold accent--text">Departamento</span>
          <span class="text-subtitle-1 font-weight-bold accent--text">Periodo</span>
          <span class="text-subtitle-1 font-weight-bold accent--text">Total Horas</span>

          <span>{{ nomina }}</span>
          <span>{{ nombre_colaborador }}</span>
          <span>{{ departamento }}</span>
          <span>
            {{ dayjs(date[0]).locale("es").format("DD [de] MMMM") }} al
            {{ dayjs(date[1]).locale("es").format("DD [de] MMMM") }}
          </span>
          <span>{{ numeral(cTotalHOras).format("0:0") }}</span>

          <div class="secondary white--text d-flex flex-column align-center rounded-l-lg">
            <span class="text-subtitle-1 font-weight-bold">Faltas:</span>
            <span> {{ cFaltas }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center">
            <span class="text-subtitle-1 font-weight-bold">Retardo Menor:
            </span>
            <span>{{ cRMenor }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center">
            <span class="text-subtitle-1 font-weight-bold">Retardo Mayor:
            </span>
            <span>{{ cRMayor }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center">
            <span class="text-subtitle-1 font-weight-bold">Permisos: </span>
            <span>{{ cPermiso }}</span>
          </div>
          <div class="white--text secondary d-flex flex-column align-center rounded-r-lg">
            <span class="text-subtitle-1 font-weight-bold">Vacaciones:</span>
            <span>{{ cVacacion }}</span>
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
            <th>Días</th>
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

            <tr :key="ind" v-if="dia?.descanso">
              <td style="
                    background-color: #fffde7;
                    border-left: 5px solid #000;
                    box-sizing: content-box;
                  ">                  
                <span class="font-weight-bold mr-1">{{ dayjs(dia?.dia).format("dddd") }}</span>
                <span class="font-italic">{{ dayjs(dia?.dia).locale("es").format("DD MMMM") }}</span>
              </td>
              <template v-if="dia?.asistencia">
                <td style="text-align: left; background-color: #fffde7" class="font-weight-bold">Descanso</td>
                <td class="px-0" style="background-color: #fffde7">
                  <div class="px-1">
                    <span class="font-weight-bold accent--text">{{
                      dia?.asistencia_entrada.relog
                    }}</span>
                  </div>
                </td>
                <td  class="px-0" style="background-color: #fffde7">
                  <div class="px-1">
                    <span class="font-weight-bold accent--text">{{
                      dia?.asistencia_salida.relog
                    }}</span>
                  </div>
                </td>
                <td style="background-color: #fffde7"></td>
                <td class="text-center" style="background-color: #fffde7">
                  <span class="text-subtitle-1 font-weight-black rounded px-1" style="border: 1px solid #000">
                    {{ dia?.rango_horas }}
                  </span>
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
                <td style="background-color: #fffde7">

                </td>
              </template>

              <td v-else colspan="7" style="text-align: center; background-color: #fffde7">
                <b>Descanso</b>
              </td>

            </tr>

            <tr v-else>
              <td>
                <span class="font-weight-bold mr-1">{{ dayjs(dia?.dia).format("dddd") }}</span>
                <span class="font-italic">{{ dayjs(dia?.dia).locale("es").format("DD MMMM") }}</span>
              </td>
              <td class="px-0">
                <div v-for="(horario, inde2) in dia?.horarios_full" :key="inde2" class="px-1 font-weight-bold"
                  :class="{ 'py-1': dia?.horarios_full.length == 2 }">
                  {{ horario }}
                </div>
              </td>
              <td class="px-0">
                <div v-for="(asistencia_entrada, inde3) in dia?.asistencia_entrada"  class="px-1" :class="{ 'py-1': dia?.asistencia_entrada.length == 2 }">
                  <span v-if="asistencia_entrada == 'Omisión'" class="font-italic" @click="fnOpenHorario(dia.dia,asistencia_entrada, inde3)" style="cursor: pointer;">{{ asistencia_entrada }}
                  </span>

                  <span v-else-if="asistencia_entrada == '--'" class="font-italic" @click="fnOpenHorario(dia.dia,'Omisión', inde3)" style="cursor: pointer;">--N/A--
                  </span>

                    <v-badge v-else                      
                        :color="Boolean(asistencia_entrada?.union)?'black':'trasparent'"
                        :content="asistencia_entrada?.union?.relog"
                        :dot="!asistencia_entrada?.hover">

                      <v-hover v-model="asistencia_entrada.hover">
                          <span  class="font-weight-bold accent--text" :class="{'warning--text':Boolean(asistencia_entrada?.id_)}"  @click="fnOpenHorario(dia.dia,asistencia_entrada, inde3)" style="cursor: pointer;">{{asistencia_entrada?.relog}} </span>
                      </v-hover>
                    </v-badge>
                </div>
              </td>
              <td class="px-0">
                <div v-for="(asistencia_salida, inde4) in dia?.asistencia_salida" :key="inde4" class="px-1"                
                  :class="{ 'py-1': dia?.asistencia_salida.length == 2 }">                  

                  <span v-if="asistencia_salida == 'Omisión'" class="font-italic" style="cursor: pointer;" @click="fnOpenHorario(dia.dia,asistencia_salida, inde4)">{{ asistencia_salida }}</span>

                  <span v-else-if="asistencia_salida == '--'" class="font-italic" @click="fnOpenHorario(dia.dia,'Omisión', inde3)" style="cursor: pointer;">--N/A--
                  </span>

                  <v-badge v-else                      
                        :color="Boolean(asistencia_salida?.union)?'black':'trasparent'"
                        :content="asistencia_salida?.union?.relog"
                        :dot="!asistencia_salida?.hover">

                      <v-hover v-model="asistencia_salida.hover" >
                          <span  class="font-weight-bold accent--text" :class="{'warning--text':Boolean(asistencia_salida?.id_)}"  @click="fnOpenHorario(dia.dia,asistencia_salida, inde4)" style="cursor: pointer;">{{asistencia_salida?.relog}} </span>
                      </v-hover>
                    </v-badge>
                </div>
              </td>
              <td>
                <div>
                <span class="font-weight-bold accent--text" style="cursor: pointer;" @click="fnOpenHorario(dia.dia,dia.extras_[0], 1,1)">
                {{ dia.extras_[0]?.relog??'--extra--' }}
              </span>
            </div>
            <div>
                <span class="font-weight-bold accent--text" style="cursor: pointer;" @click="fnOpenHorario(dia.dia,dia.extras_[1], 1,1)">
                {{ dia.extras_[1]?.relog??'--extra--' }}
              </span>
            </div>
              </td>
              <td class="text-center">
                <span class="text-subtitle-1 font-weight-black rounded px-1" style="border: 1px solid #000">{{
                  dia?.rango_horas
                  }}</span>
              </td>

              <td style="width:200px">
                <div v-for="(permiso, inde5) in dia?.descripcion" :key="inde5" class="px-1 cpermiso">
                  {{ permiso }}
                </div>
              </td>
              <td class="px-1x text-centerx" style="width: 130px">

                <v-chip style="width: 100%" class="text-center" :color="dia?.estatus_color">
                  {{ dia?.estatus_text }}
                </v-chip>

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
              <v-text-field label="Nómina" placeholder="Buscar por Número de Nómina" @keyup.enter="buscarByNomina"
                filled :error-messages="mensaje_colaborador"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete label="Nombre Colaborador" placeholder="Buscar mediante Nombre Colaborador"
                :items="lst_colaboradores" :search-input.sync="search" hide-no-data item-text="empleado"
                item-value="id_colaborador" prepend-inner-icon="mdi-account" hide-details return-object
                @input="buscarByName" filled></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog ref="dialog_date" v-model="modal" :return-value.sync="date" persistent width="470px" @input="cambioDate">
      <v-date-picker v-model="date" scrollable landscape range locale="es-mx" color="secondary">
        <v-spacer></v-spacer>
        <v-btn text color="secondary" @click="modal = false"> Cancelar </v-btn>
        <v-btn text color="secondary" @click="$refs.dialog_date.save(date)">
          aceptar
        </v-btn>
      </v-date-picker>
    </v-dialog>


    <v-dialog v-model="dialog_time" width="463" persistent>
      <v-card rounded="xl">
        <v-toolbar color="secondaryx">
          Registro de entrada
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_time=false"> <v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>
<v-card-text class="mt-8">
  <div class="pv_time_ text-h1 d-flex justify-center my-5">
    <input id="input-time" v-model="time_revision_horas" placeholder="00:00:00"style="width: 100%; text-align: center" v-mask="timeMask"/>
  </div>

  
</v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-btn block color="primary" textx outlined rounded @click="fnCreateAsistenciaRevisionColaborador">guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


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
import _debounce from "lodash/debounce";
import zip from "lodash/zip";
import _zipObject from "lodash/zipObject";
import first from "lodash/first";
import _isEmpty from "lodash/isEmpty";
import last from "lodash/last";
import round from "lodash/round";
import printJS from "print-js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/es";
import {
  getColaboradorByNominaService,
  getColaboradoresByNameService,
  setUpdateTxtService,
  getAsistenciaRevisionColaboradorService,
  createAsistenciaRevisionColaboradorService,
  updateAsistenciaRevisionColaboradorService
} from "@/services/asistencia_colaborador_service";
import { el as $dom, setChildren as $setChildren } from "redom";

const root = getCurrentInstance().proxy;

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const id_colaborador = ref(0);
const nomina = ref(0);
const nombre_colaborador = ref("");
const departamento = ref("");
const lst_datos = ref([]);
const date = ref([]);
const dialog = ref(false);
const modal = ref(false);
const overlay = ref(false);
const lst_colaboradores = ref([]);
const search = ref("");

const dialog_time = ref(false)
const id_asistencia_reloj = ref()
const id_asistencia_revision = ref()


const time_revision_horas = ref('00:00')
const dia_selected = ref()
const tipo=ref(0)

const mensaje_colaborador=ref()

//^([01]?[0-9]|2[0-3]):[0-5][0-9]$

const timeMask = ref({
  mask: "FG:HI:MS",
  tokens: {
    F: {
      // pattern: /^([0-1][1-9]|[2][0-3])/,
      pattern: /^([0-1]|[2])/
    },
    G: {
      pattern: /[0-9]/,
      transform(v) {
        const hora_=time_revision_horas.value.at(0)
        if(hora_==2 && v>3)
        {
          return 0
        }
        else {
          return v
        }
      },
    },
    H: {
      pattern: /[0-5]/
    },
    I: {
      pattern: /[0-9]/,      
    },
    M: {
      pattern: /[0-5]/
    },
    S: {
      pattern: /[0-9]/,      
    }
  },
});


const cFaltas = computed(
  () =>
    lst_datos.value.filter(
      (i) => i?.estatus === 0 && !Boolean(i.is_permiso) && !Boolean(i.is_asueto)
    ).length
);
const cRMenor = computed(
  () => lst_datos.value.filter((i) => i?.estatus === 3).length
);
const cRMayor = computed(
  () => lst_datos.value.filter((i) => i?.estatus === 4).length
);
const cPermiso = computed(
  () => lst_datos.value.filter((i) => i?.estatus == 6).length
);
const cVacacion = computed(
  () => lst_datos.value.filter((i) => i?.estatus == 7).length
);
const cTotalHOras = computed(() =>
  lst_datos.value
    .filter((i) => !isUndefined(i?.rango_horas))
    .map((i) => i?.rango_horas.split(":"))
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
});

function cambioDate() {
  date.value.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1)); //saca las dos fechas y las ordena
  if (id_colaborador.value > 0) getAsistencia();
}

async function buscarByNomina($event) {
  
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
  } catch (e) { }
}, 250);

async function getAsistencia() {
  try {
    const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
    const data = await getAsistenciaRevisionColaboradorService(
      id_colaborador.value,
      date.value,
      cve_persona_session
    );
    formatAsistencias(data.reverse());
  } catch (error) { }
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
  try {

    lst_datos.value = data.map((i) => {
      
      //hora entrada de su horario caso jose leon es de [16:15:00,18:00:00]
      const _hora_entrada = (i.hora_entrada ?? "").split(",").filter(Boolean);
      //hora salida de su horario caso jose leon es de [17:30:00,22:15:00]
      const _hora_salida = (i.hora_salida ?? "").split(",").filter(Boolean);
      //son el numero de checada pueden ser n cantidad jose leon ejemplo  [16:17:20,22:23:12] 

      //asistencia reloj es la original ejemplo leon solo registro entrada 16:15:00 pero viene id|hora => {id,relog}
      const _asistencia_reloj = (i.asistencia ?? "").split(",").filter(Boolean).map(j => _zipObject(['id', 'relog'], j.split("|")))
      //asistencia revision o manual  leon solo registro entrada 16:15:00 pero no salida se agrega la salida manualmente y esta viene como id|id_|hora el id_ es el manual y id es el del relog o 0 si no existe pasa a =>{id,id_relog}
      const _asistencia_revision = (i.asistencia_revision ?? "").split(",").filter(Boolean).map(j => _zipObject(['id', 'id_', 'relog'], j.split("|")))
      //es extras de forma manual y son igual que revision solo que se identifican con el 1 o 0 y son id|id_|hora => {id,id_,hora}
      const _extras = (i.extras ?? "").split(",").filter(Boolean).map(j => _zipObject(['id', 'id_', 'relog'], j.split("|")))


      console.log('asistencia_relog: -->',_asistencia_reloj)
      console.log('asistencia_revision: -->',_asistencia_revision)

      console.log('asistencia_final: -->',_asistencia_reloj.filter(i=>!_asistencia_revision.some(j=>j.id==i.id)).map(({id,relog})=>({id,relog,hover:false})))


      //es un array con los revisados como base y los de reloj quitando los de reloj que estan relaccinados con los revisados
      const _asistencia=[
        //todo los horarios revisados
        ..._asistencia_revision.map(({id,id_,relog})=>({id,id_,relog,union:_asistencia_reloj.find(i=>i.id==id),hover:false})),
        //todos los horarios de reloj pero que no esten en lazados con algun horario revisado
        ..._asistencia_reloj.filter(i=>!_asistencia_revision.some(j=>j.id==i.id)).map(({id,relog})=>({id,relog,hover:false}))]
        //se ordenan 
        .sort((a,b)=>dayjs(a.relog,'HH:mm:ss').isAfter(dayjs(b.relog,'HH:mm:ss'),'m') ? 1 : -1)

        console.log(i.dia,'-->',_asistencia)
        

      //es la descripcion de un permiso para la fecha que se recorre se forma titulo|descripcion =>titutlo|descripcion
      const descripcion = (i.descripcion ?? "").split("|").filter(Boolean);

      //bandera que indica que no se cuenta con dia de entrada y salida por ende es que no tiene horario dando como descanzo jose leon ejemplo domingo
      const descanso = !Boolean(i.dia_entrada) && !Boolean(i.dia_salida);

      //hora_entrada [16:15:00,18:00:00]  hora salida [17:30:00,22:15:00]
      //con zip de lodash es [[16:15:00,17:30:00],[18:00:00,22:15:00]]
      const horarios_full = zip(_hora_entrada, _hora_salida).map(([i, ii]) => [i.substring(0, 5), ii.substring(0, 5)].join(" a ")
      ); //['16:15 a 17:30', '18:00 a 22:15'] o ['09:00 a 15:00']

      const [extra1,extra2]=_extras
      const extras_=[extra1??"-",extra2??"-"]

      // es lo que se regresa por default
      const h_default = { 
        dia: i.dia, 
        descanso, 
        horarios_full, 
        descripcion 
      }



      //descanzo y sin registro de asistencia lo normal
      //el codigo que sigue abajo actua como el continues de un for normal
      if (descanso && _asistencia?.length === 0) return { ...h_default };

      //es descanzo pero viene porq almenos hay una checada(asistencia en el reloj)
      if (descanso && _asistencia?.length > 0) {

        //obtiene posicion 0 y 1 de un array en caso de no venir seria undefined
        // ejemplo ['09:00:00',undefined]
        const [asistencia_entrada, asistencia_salida] = _asistencia        
        if (Boolean(asistencia_salida)) {
          const rango_horas = numeral(round(dayjs(asistencia_salida?.relog, "HH:mm:ss").diff(dayjs(asistencia_entrada?.relog, "HH:mm:ss"), "s"), 2)).format("0:0");
          return { ...h_default, asistencia: _asistencia, asistencia_entrada, asistencia_salida: asistencia_salida, rango_horas,extras_ };
        }
        else {
          return { ...h_default, asistencia: _asistencia, asistencia_entrada, asistencia_salida: 'Omisión', rango_horas: 'Omisión', extras_};
        }
      }


      //si no hay asistencia y no hay permiso ni es dia de asueto el falta o es que no checo por algun problema(olvido o el reloj checador no sirve con el...)
      // if (_asistencia.length === 0 && i.is_permiso == 0 && i.is_vacaciones==0 && i.is_asueto == 0 && i.is_incidencia == 0 && is_day_valid) {    
      if (_asistencia.length === 0 && i.is_permiso == 0 && i.is_vacaciones==0 && i.is_asueto == 0 && i.is_incidencia == 0) {    
        return {...h_default,rango_horas:'NA',estatus:0,estatus_text:'Falta',estatus_color:'red lighten-3',is_falta:1,   asistencia_entrada: ["Omisión"], asistencia_salida: ["Omisión"],extras_}
      }

      // indica que se tiene un permiso
        if (i.is_permiso == 1) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 6,
          estatus_text: "Permiso",
          estatus_color: "purple lighten-3",
          asistencia_entrada: ["--"], 
          asistencia_salida: ["--"],
          extras_
        };
      }

      if (i.is_vacaciones == 1) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 7,
          estatus_text: "Vacaciones",
          estatus_color: "indigo lighten-3",
          asistencia_entrada: ["--"], 
          asistencia_salida: ["--"],
          extras_
        };
      }

      if (i.is_asueto == 1) {

        const [asistencia_entrada, asistencia_salida] = _asistencia    
        const rango_horas = numeral(round(dayjs(asistencia_salida?.relog, "HH:mm:ss").diff(dayjs(asistencia_entrada?.relog, "HH:mm:ss"), "s"), 2)).format("0:0");
        return {
          ...h_default,
          rango_horas:rango_horas??"NA",
          estatus: 8,
          estatus_text: "Asueto",
          estatus_color: "pink lighten-3",
          asistencia_entrada:[asistencia_entrada??'--'],
          asistencia_salida:[asistencia_salida??'--'],
          extras_
        };
      }

      if (i.is_incidencia == 1) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 9,
          estatus_text: "incidencia",
          estatus_color: "teal lighten-3",
          asistencia_entrada: ["--"], 
          asistencia_salida: ["--"],
          extras_
        };
      }

      //  if (!is_day_valid) {
      //     return {
      //       ...h_default,
      //       rango_horas: "NA",
      //       estatus: 10,
      //       estatus_text: "dia sin registro",
      //       estatus_color: "grey lighten-3",
      //       // estatus_color: "teal lighten-3",
      //     };
      //   }

      let estatus = 0
      let estatus_text = ''
      let estatus_color = ''

      //2024-10-16 checadas
      //primera checada
      const FCHECK = first(_asistencia)?.relog
      const FCHECKDATE = dayjs(FCHECK, "HH:mm:ss")

      const HENTRADA = first(_hora_entrada)
      const HENTRADADATE = dayjs(HENTRADA, "HH:mm:ss")

      //indica la entrada es menor del horario  es decir entraste a las 16:10 es menor o igual que tu horario 16:15
      const _entrada_antes = FCHECKDATE.isSameOrBefore(HENTRADADATE, "m");
      //indica que la entrada esta en el horario y 5 min mas ejemplo entrada es 14:00 y 14:05 y el llego alas 14:03 esta en el rango
      const _entrada_tolerancia = FCHECKDATE.isBetween(HENTRADADATE, HENTRADADATE.add(5, "m"), "m", "(]");
      //indica que la entrada esta en el horario de 10 min mas eejmplo extrada es 14:05 por la toelerancia y maximo 14:10 ya 5 min mas de la tolerancia es retado mayor
      const _entrada_retardo_menor = FCHECKDATE.isBetween(HENTRADADATE.add(5, "m"), HENTRADADATE.add(10, "m"), "m", "(]");
      //es cuando pasas de mas de 10 min tu hora de entrada indica si entraste a las 16:26:00 ya es mas que tuo hora mas 10 min osea 16:25:00
      const _entrada_retardo_mayor = FCHECKDATE.isAfter(HENTRADADATE.add(10, "m"), "m");


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
        return { ...h_default, rango_horas: 'Omisión', estatus, estatus_text, estatus_color, asistencia_entrada: [first(_asistencia)], asistencia_salida: ["Omisión"],extras_ }
      }


      //horario corrido pero tiene mas de una checada
      if (horarios_full.length === 1 && _asistencia.length > 1) {

        const _rango_horas = numeral(round(dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(dayjs(first(_asistencia)?.relog, "HH:mm:ss"), "s"), 2)).format("0:0");

        let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(i.asistencia), "HH:mm:ss"), "s");
        let tiempo_horario = dayjs(last(_hora_salida), "HH:mm:ss").diff(dayjs(first(i.hora_entrada), "HH:mm:ss"), "s");

        if (tiempo_asistencia < tiempo_horario)
          estatus_color = "blue-grey lighten-3"; //color gris indica que puedo entrar antes o salir antes ???
        return { ...h_default, rango_horas: _rango_horas, estatus, estatus_text, estatus_color, asistencia_entrada: [first(_asistencia)], asistencia_salida: [last(_asistencia)],extras_ }
      }


      // es un horario con comida pero hay solo un registro 
      if (horarios_full.length === 2 && _asistencia.length == 1) {
        return { ...h_default, rango_horas: "Omisión", estatus, estatus_text, estatus_color, asistencia_entrada: [first(_asistencia), "Omisión"], asistencia_salida: ["Omisión", "Omisión"],extras_ }
      }


      //es horario con comida y existen dos registros 
      if (horarios_full.length === 2 && _asistencia.length == 2) {

        const _rango_horas = numeral(
          round(
            dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(
              dayjs(first(_asistencia)?.relog, "HH:mm:ss"),
              "s"
            ),
            2
          )
        ).format("0:0");
        let tiempo_asistencia = dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(
          dayjs(first(_asistencia)?.relog, "HH:mm:ss"),
          "s"
        );
        let tiempo_horario_uno = dayjs(first(_hora_salida)?.relog, "HH:mm:ss").diff(
          dayjs(first(_hora_entrada)?.relog, "HH:mm:ss"),
          "s"
        );
        let tiempo_horario_dos = dayjs(last(_hora_salida)?.relog, "HH:mm:ss").diff(
          dayjs(last(_hora_entrada)?.relog, "HH:mm:ss"),
          "s"
        );
        let tiempo_horario = tiempo_horario_uno + tiempo_horario_dos;
        if (tiempo_asistencia < tiempo_horario)
          estatus_color = "blue-grey lighten-3";
        return { ...h_default, rango_horas: _rango_horas, estatus, estatus_text, estatus_color, asistencia_entrada: [first(_asistencia), "Omisión"], asistencia_salida: ["Omisión", last(_asistencia)] ,extras_}
      }


      // es horario de comida y tiene 3 registros
      if (horarios_full.length === 2 && _asistencia.length == 3) {

        const _rango_horas = numeral(
          round(
            dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(
              dayjs(first(_asistencia)?.relog, "HH:mm:ss"),
              "s"
            ),
            2
          )
        ).format("0:0");
        let tiempo_asistencia = dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(
          dayjs(first(_asistencia)?.relog, "HH:mm:ss"),
          "s"
        );
        let tiempo_horario = dayjs(last(_hora_salida)?.relog, "HH:mm:ss").diff(
          dayjs(first(_hora_entrada)?.relog, "HH:mm:ss"),
          "s"
        );

        if (tiempo_asistencia < tiempo_horario)
          estatus_color = "blue-grey lighten-3"; //azul tolerancia
        return { ...h_default, rango_horas: _rango_horas, estatus, estatus_text, estatus_color, asistencia_entrada: [first(_asistencia), _asistencia[1]], asistencia_salida: ["Omisión", last(_asistencia)],extras_ }
      }


      
      if (horarios_full.length === 2 && _asistencia.length > 3) {


        let rango_horas_1 = dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(
          dayjs(first(_asistencia)?.relog, "HH:mm:ss"),
          "s"
        );

        let rango_horas_2 = dayjs(_asistencia[2]?.relog, "HH:mm:ss").diff(
          dayjs(_asistencia[1]?.relog, "HH:mm:ss"),
          "s"
        );

        const _rango_horas = numeral(round(rango_horas_1 - rango_horas_2, 2)).format(
          "0:0"
        );

        let tiempo_asistencia = dayjs(last(_asistencia)?.relog, "HH:mm:ss").diff(
          dayjs(first(_asistencia)?.relog, "HH:mm:ss"),
          "s"
        );
        let tiempo_horario_uno = dayjs(first(_hora_salida)?.relog, "HH:mm:ss").diff(
          dayjs(first(_hora_entrada)?.relog, "HH:mm:ss"),
          "s"
        );

        let tiempo_horario_dos = dayjs(last(_hora_salida)?.relog, "HH:mm:ss").diff(
          dayjs(last(_hora_entrada)?.relog, "HH:mm:ss"),
          "s"
        );

        let tiempo_horario = tiempo_horario_uno + tiempo_horario_dos;
        if (tiempo_asistencia < tiempo_horario) estatus_color = "blue-grey lighten-3";


        return { ...h_default, rango_horas: _rango_horas, estatus, estatus_text, estatus_color, asistencia_entrada: [first(_asistencia), _asistencia[2]], asistencia_salida: [_asistencia[1], last(_asistencia)],extras_ }
      }

    });

  }
  catch (e) {
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
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", nomina.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", "Nombre", {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", nombre_colaborador.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", "faltas", {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", cFaltas.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
  ]);
  const table_body_row2 = $dom("tr", [
    $dom("td", "Departamento", {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", departamento.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", "Periodo", {
      style: { border: "1px solid #000", fontSize: "12px" },
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
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", cRMenor.value, {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
  ]);
  const table_body_row3 = $dom("tr", [
    $dom("td", "Total Horas", {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", numeral(cTotalHOras.value).format("0:0"), {
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", { style: { border: "1px solid #000", fontSize: "12px" } }),
    $dom("td", "Retardo Mayor", {
      style: { border: "1px solid #000", fontSize: "12px" },
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
      style: { border: "1px solid #000", fontSize: "12px" },
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
      style: { border: "1px solid #000", fontSize: "12px" },
    }),
    $dom("td", cVacacion.value, { style: { border: "1px solid #000", fontSize: "12px" } }),
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

async function fnOpenHorario(dia_,data_, index_,tipo_=0) {

  console.log('data_:',data_)
  tipo.value=tipo_
  //ASIGNACION
  
 
  //se limpia la hora
  dialog_time.value = true
  time_revision_horas.value=''
  dia_selected.value=dia_

  // await new Promise(reject=>setTimeout(reject,500))
  // document.getElementById('input-time').focus()

  //Nuevo revision
  if (data_ === 'Omisión') {
    console.log("es nuevo horario que se sa de alta en la nueva tabla")
    //ES CUANDO SE CUENTA CON ASISTENCIA DEL RELOJ
  id_asistencia_reloj.value=undefined;
  //EN CUANDO VIENE DE UNA REVISION LA ASISTENCIA
  id_asistencia_revision.value=undefined
  }
  //Actualiza Revisado 
  else if (Boolean(data_?.id_)) {
    console.log("se Actualiza porq es un horario modificado")
    //ES CUANDO SE CUENTA CON ASISTENCIA DEL RELOJ
  id_asistencia_reloj.value=undefined;
  //EN CUANDO VIENE DE UNA REVISION LA ASISTENCIA
  id_asistencia_revision.value=data_?.id_
  }
  //nuevo revision pero se une con el anterior 
  else {
    console.log("se crea nuevo horario revision y se enlaza en union con el horario de reloj")
    //ES CUANDO SE CUENTA CON ASISTENCIA DEL RELOJ
  id_asistencia_reloj.value=data_?.id;
  //EN CUANDO VIENE DE UNA REVISION LA ASISTENCIA
  id_asistencia_revision.value=data_?.id_
  }

}

async function fnCreateAsistenciaRevisionColaborador()
{

  const data_send={
    cve_rh_colaborador_acceso:id_asistencia_reloj.value,
    cve_colaborador:Boolean(id_asistencia_revision.value)?undefined:Boolean(id_asistencia_reloj.value)?undefined:id_colaborador.value,
    hora_acceso:`${dia_selected.value} ${time_revision_horas.value}`,
    colaborador_registra:root.$ls.get("user", { cve_persona: 0 }).cve_persona,
    tipo:tipo.value
  }

try {
  if(Boolean(id_asistencia_revision.value))
  {  
    await updateAsistenciaRevisionColaboradorService(id_asistencia_revision.value,{hora_acceso:`${dia_selected.value} ${time_revision_horas.value}`})
    getAsistencia()
    dialog_time.value = false
  }
  else{    
    await createAsistenciaRevisionColaboradorService(data_send)
    getAsistencia()
    dialog_time.value = false
  }
} catch (error) {
  
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

>>>.table table {
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

.pv_time_{
  
}
</style>
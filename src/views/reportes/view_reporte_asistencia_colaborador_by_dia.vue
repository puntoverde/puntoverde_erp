<template>
  <div id="view-reporte-print">
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->

      <div class="d-flex align-center" style="column-gap: 10px;">
        <v-menu v-model="fecha_menu" :close-on-click="false" :close-on-content-click="false">
          <template v-slot:activator="{on,attrs}">
            <v-btn icon elevation="4" color="primary" v-on="on" v-bind="attrs"><v-icon>mdi-calendar</v-icon></v-btn>
          </template>
          <v-card>
            <v-date-picker :value="dayjs(fecha).format('YYYY-MM-DD')" @input="fnChangeDay"></v-date-picker>
          </v-card>
        </v-menu>
        <v-btn icon outlined @click="fnBackDay"><v-icon>mdi-menu-left</v-icon></v-btn>
        <v-btn icon outlined @click="fnNextDay"><v-icon>mdi-menu-right</v-icon></v-btn>
        <span>{{ dayjs(fecha).format('dddd DD [de] MMMM [de] YYYY') }}</span>
      </div>
      <h1 class="accent--text oswald--text">Reporte Incidencias por dia</h1>
    </div>


    <div class="elevation-5 mt-5 rounded-xl" style="background-color: #fcfcfc">
      <div style="height: 48px; border-bottom: 2px solid #000"></div>
      <v-simple-table densex class="table">
        <thead style="background-color: white">
          <tr>
            <th>No empleado</th>
            <th>Empleado</th>
            <th>Departamento</th>
            <th>Horario</th>
            <th>Hora Entrada</th>
            <th>Hora Salida</th>
            <th>Tiempo</th>
            <th>Estatus</th>
            <th>Detalle</th>
          </tr>
          <tr>
            <th colspan="9" v-if="loading_inasistencias">
              <v-progress-linear  indeterminate></v-progress-linear>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(dia, ind) in lst_datos">
          

            <!-- <tr :key="ind" v-if="dia.descanso" style="background-color: #e0e0e0;"> -->
            <tr :key="ind" v-if="dia.descanso" style="background-color: #fffde7;">
                <td
                  style="                    
                    border-left: 5px solid #000;
                    box-sizing: content-box;
                  "
                >               
                <span class="font-weight-bold">{{ numeral(dia.nomina).format('0000') }}</span>
                </td> 
                <td>
                <span class="font-weight-bold mr-1">{{ dia.apellido_paterno }}</span>
                <span class="font-italic mx-1">{{dia.apellido_materno}}</span>
                <span>{{dia.nombre  }}</span>
              </td>

              <td>                
                <span>{{dia.departamento_area  }}</span>
              </td>
              <td>
                Descanzo
              </td>

              <td class="px-0">
                <div
                  v-for="(asistencia_entrada, inde3) in dia.asistencia_entrada"
                  :key="inde3"
                  class="px-1"
                  :class="{ 'py-1': dia.asistencia_entrada.length == 2 }"
                >
                  <span
                    v-if="asistencia_entrada == 'Omision'"
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
                    v-if="asistencia_salida == 'Omision'"
                    class="font-italic"
                    >{{ asistencia_salida }}</span
                  >
                  <span v-else class="font-weight-bold accent--text">{{
                    asistencia_salida
                  }}</span>
                </div>
              </td>

              <td class="text-center">
                <span v-if="dia.rango_horas"
                  class="text-subtitle-1 font-weight-black rounded px-1"
                  style="border: 1px solid #000"
                  >{{ dia.rango_horas }}</span
                >
              </td>

              <td></td>
              <td></td>
                
              
            </tr>

            <tr v-else>
              <td>
                <span class="font-weight-bold">{{ numeral(dia.nomina).format('0000') }}</span>
              </td>
              <td>
                <span class="font-weight-bold mr-1">{{ dia.apellido_paterno }}</span>
                <span class="font-italic mx-1">{{dia.apellido_materno}}</span>
                <span>{{dia.nombre  }}</span>
              </td>
              <td>                
                <span>{{dia.departamento_area  }}</span>
              </td>
              <td class="px-0">                
                <div>

                  <div
                  v-for="(horario, inde2) in dia.horarios_full"
                  :key="inde2"
                  class="px-1 font-weight-bold"
                  :class="{ 'py-1': dia.horarios_full.length == 2 }"
                  >
                  {{ horario }}
                </div>
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
                    v-if="asistencia_entrada == 'Omision'"
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
                    v-if="asistencia_salida == 'Omision'"
                    class="font-italic"
                    >{{ asistencia_salida }}</span
                  >
                  <span v-else class="font-weight-bold accent--text">{{
                    asistencia_salida
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <span v-if="dia.rango_horas"
                  class="text-subtitle-1 font-weight-black rounded px-1"
                  style="border: 1px solid #000"
                  >{{ dia.rango_horas }}</span
                >
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
                <v-tooltip bottom >
                  <template v-slot:activator="{on,attrs}">
                    <v-btn fab x-small outlined v-on="on" v-bind="attrs"><v-icon>mdi-plus</v-icon></v-btn>
                  </template>
                  <span>Detalle</span>
                </v-tooltip>
              </td> 
              <td>
                <v-btn icon outlined @click="getDetalleAsistenciaColaborador(dia.id_colaborador)"> <v-icon>mdi-eye-outline</v-icon> </v-btn>
              </td>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
      <div style="height: 30px; border-top: 2px solid #000"></div>
    </div>
 

    <v-dialog v-model="dialog_detalle" width="400">
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title>Acceso Estacionamiento</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_detalle=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
           <v-simple-table>
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Salida</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detalle_auto in lst_detalle">
                <td>{{ detalle_auto.entrada }}</td>
                <td>{{ detalle_auto.salida }}</td>
              </tr>
            </tbody>
           </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance, onMounted } from "vue";
import numeral from "numeral";
import isUndefined from "lodash/isUndefined";
import _debounce from "lodash/debounce";
import zip from "lodash/zip";
import first from "lodash/first";
import last from "lodash/last";
import round from "lodash/round";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/es";
import {
  getAsistenciaColaboradorByDiaService,
  getAsistenciaColaboradorByDiaAutoService
} from "@/services/asistencia_colaborador_service";

const root = getCurrentInstance().proxy;

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const fecha = ref(dayjs().toDate());
const fecha_menu=ref(false)
const lst_datos=ref([])
const loading_inasistencias=ref(false)
const lst_detalle=ref([])
const dialog_detalle=ref(false)

onMounted(()=>{
  getAsistencia()
})

function fnNextDay()
{
fecha.value=dayjs(fecha.value).add(1,'day').toDate()
getAsistencia()
}

function fnBackDay()
{
  fecha.value=dayjs(fecha.value).subtract(1,'day').toDate()
  getAsistencia()
}

function fnChangeDay(dia_)
{
  fecha.value=dayjs(dia_).toDate()
  fecha_menu.value=false
  getAsistencia()
}

async function getAsistencia() {
  loading_inasistencias.value=true
  lst_datos.value=[]
  try {
    const fecha_=dayjs(fecha.value).format('YYYY-MM-DD')
    const data = await getAsistenciaColaboradorByDiaService(fecha_);
    formatAsistencias(data);
  } catch (error) {}
  finally{
    loading_inasistencias.value=false
  }
}

async function getDetalleAsistenciaColaborador(id_colaborador_)
{
  try {
    const fecha_=dayjs(fecha.value).format('YYYY-MM-DD')
    lst_detalle.value=await getAsistenciaColaboradorByDiaAutoService(fecha_,id_colaborador_)
    dialog_detalle.value=true

  } catch (error) {
    
  }
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

  lst_datos.value =data.map(({hora_entrada,hora_salida,asistencia,...i}) => {    

    //hora entrada de su horario caso jose leon es de [16:15:00,18:00:00]
    const _hora_entrada = (hora_entrada ?? "").split(",").filter(Boolean);
    //hora salida de su horario caso jose leon es de [17:30:00,22:15:00]
    const _hora_salida = (hora_salida ?? "").split(",").filter(Boolean);
    //son el numero de checada pueden ser n cantidad jose leon ejemplo  [16:17:20,22:23:12]
    const _asistencia = (asistencia ?? "").split(",").filter(Boolean);
    //bandera que indica que no se cuenta con dia de entrada y salida por ende es que no tiene horario dando como descanzo jose leon ejemplo domingo
    const descanso = !Boolean(i.dia_entrada) && !Boolean(i.dia_salida);
   

    //hora_entrada [16:15:00,18:00:00]  hora salida [17:30:00,22:15:00]
    //con zip de lodash es [[16:15:00,17:30:00],[18:00:00,22:15:00]]
    const horarios_full = zip(_hora_entrada, _hora_salida).map(([i, ii]) =>
      [i.substring(0, 5), ii.substring(0, 5)].join(" a ")
    ); //['16:15 a 17:30', '18:00 a 22:15'] o ['09:00 a 15:00']

    
    
    let estatus=0
    let estatus_text=''
    let estatus_color=''

    //indica la entrada es menor del horario  es decir entraste a las 16:10 es menor o igual que tu horario 16:15
    const _entrada_antes = dayjs(first(_asistencia),"HH:mm:ss").isSameOrBefore(dayjs(first(_hora_entrada), "HH:mm:ss"), "m");
    //indica que la entrada esta en el horario y 5 min mas ejemplo entrada es 14:00 y 14:05 y el llego alas 14:03 esta en el rango
    const _entrada_tolerancia = dayjs(first(_asistencia),"HH:mm:ss").isBetween(dayjs(first(_hora_entrada), "HH:mm:ss"),dayjs(first(_hora_entrada), "HH:mm:ss").add(5, "m"),"m","(]");
    //indica que la entrada esta en el horario de 10 min mas eejmplo extrada es 14:05 por la toelerancia y maximo 14:10 ya 5 min mas de la tolerancia es retado mayor
    const _entrada_retardo_menor = dayjs(first(_asistencia),"HH:mm:ss").isBetween(dayjs(first(_hora_entrada), "HH:mm:ss").add(5, "m"),dayjs(first(_hora_entrada), "HH:mm:ss").add(10, "m"),"m","(]");
    //es cuando pasas de mas de 10 min tu hora de entrada indica si entraste a las 16:26:00 ya es mas que tuo hora mas 10 min osea 16:25:00
    const _entrada_retardo_mayor = dayjs(first(_asistencia),"HH:mm:ss").isAfter(dayjs(first(_hora_entrada), "HH:mm:ss").add(10, "m"), "m");

  
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
      return  {
        ...i,
        horarios_full,
        descanso,
        rango_horas:'Omision',
        estatus,
        estatus_text,
        estatus_color,
        asistencia_entrada:[first(_asistencia)],
        asistencia_salida:["Omision"]}
    }
    

    else if (horarios_full.length === 1 && _asistencia.length > 1) {
     
      const _rango_horas=numeral(round(dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s"),2)).format("0:0");

      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(i.asistencia), "HH:mm:ss"),"s");
      let tiempo_horario = dayjs(last(_hora_salida), "HH:mm:ss").diff(dayjs(first(i.hora_entrada), "HH:mm:ss"),"s");
      if (tiempo_asistencia < tiempo_horario){estatus_color = "blue-grey lighten-3";} //color gris indica que puedo entrar antes o salir antes ???
      return {
        ...i,
        horarios_full,
        descanso,
        rango_horas:_rango_horas,
        estatus,
        estatus_text,
        estatus_color,
        asistencia_entrada:[first(_asistencia)],
        asistencia_salida:[last(_asistencia)]
      }
    }

    

    

    else if (horarios_full.length === 2 && _asistencia.length == 1) {    
      return {...i,horarios_full,descanso,rango_horas:"Omision",estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), "Omision"],asistencia_salida:["Omision", "Omision"]}
    }

    
    

    else if (horarios_full.length === 2 && _asistencia.length == 2) {

      const _rango_horas=numeral(round(dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s"),2)).format("0:0");
      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s");
      let tiempo_horario_uno = dayjs(first(_hora_salida), "HH:mm:ss").diff(dayjs(first(_hora_entrada), "HH:mm:ss"),"s");
      let tiempo_horario_dos = dayjs(last(_hora_salida), "HH:mm:ss").diff(dayjs(last(_hora_entrada), "HH:mm:ss"),"s");
      let tiempo_horario = tiempo_horario_uno + tiempo_horario_dos;
      if (tiempo_asistencia < tiempo_horario){estatus_color = "blue-grey lighten-3";}
      return {...i,horarios_full,descanso,rango_horas:_rango_horas,estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), "Omision"],asistencia_salida:["Omision", last(_asistencia)]}
    }

    

    else if (horarios_full.length === 2 && _asistencia.length == 3) {
    
      const _rango_horas = numeral(round(dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s"),2)).format("0:0");
      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s");
      let tiempo_horario = dayjs(last(_hora_salida), "HH:mm:ss").diff(dayjs(first(_hora_entrada), "HH:mm:ss"),"s");

      if (tiempo_asistencia < tiempo_horario){estatus_color = "blue-grey lighten-3";} //azul tolerancia
      return {...i,horarios_full,descanso,rango_horas:_rango_horas,estatus,estatus_text,estatus_color,asistencia_entrada:[first(_asistencia), _asistencia[1]],asistencia_salida:["Omision", last(_asistencia)]}
    }

    

    else if (horarios_full.length === 2 && _asistencia.length > 3) {
      

      let rango_horas_1 = dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s");

      let rango_horas_2 = dayjs(_asistencia[2], "HH:mm:ss").diff(dayjs(_asistencia[1], "HH:mm:ss"),"s");

      const _rango_horas = numeral(round(rango_horas_1 - rango_horas_2, 2)).format("0:0");

      let tiempo_asistencia = dayjs(last(_asistencia), "HH:mm:ss").diff(dayjs(first(_asistencia), "HH:mm:ss"),"s");
      let tiempo_horario_uno = dayjs(first(_hora_salida), "HH:mm:ss").diff(dayjs(first(_hora_entrada), "HH:mm:ss"),"s");

      let tiempo_horario_dos = dayjs(last(_hora_salida), "HH:mm:ss").diff(dayjs(last(_hora_entrada), "HH:mm:ss"),"s");

      let tiempo_horario = tiempo_horario_uno + tiempo_horario_dos;
      if (tiempo_asistencia < tiempo_horario)estatus_color = "blue-grey lighten-3";


      return {
        ...i,
        horarios_full,
        descanso,
        rango_horas:_rango_horas,
        estatus,
        estatus_text,
        estatus_color,
        asistencia_entrada:[first(_asistencia), _asistencia[2]],
        asistencia_salida:[_asistencia[1], last(_asistencia)]}
    }

 else{

   return { 
      ...i,
      horarios_full,
      descanso,
      estatus_text:'Sin registro',
      asistencia_entrada:[first(_asistencia)],
      asistencia_salida:[last(_asistencia)]
    }
  }
  });

  }
  catch(e){
    console.log(e)
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
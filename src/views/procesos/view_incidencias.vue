<template>
  <div id="view-reporte-print">
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Revision Incidencias</h1>
    </div>

    <div class="d-flex" style="column-gap: 15px">
      <div class="mt-5 d-flex flex-column" style="row-gap: 15px">
        <v-date-picker
          v-model="date"
          scrollable
          landscape
          range
          locale="es-mx"
          color="secondary"
          no-title
        >
          <v-spacer></v-spacer>
          <!-- <v-btn text color="secondary"> Cancelar </v-btn> -->
          <!-- <v-btn text color="secondary" @click=""> -->
          <!-- aceptar
        </v-btn> -->
        </v-date-picker>
        <v-card>
          <v-toolbar color="secondary">
            <v-text-field v-model="search_colaborador" label="Buscar colaborador" prepend-icon="mdi-magnify" solo hide-details></v-text-field>

          </v-toolbar>
          <v-list
          two-line
          :disabled="date?.length < 2"
          class="elevation-5 rounded overflow-y-auto"
          style="height: calc(100vh - 500px);"
        >
          <!-- <v-subheader>Colaboradores a cargo</v-subheader> -->
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
        </v-card>
        
      </div>

      <div
        class="elevation-5 mt-5 rounded-xl flex-grow-1"
        style="background-color: #fcfcfc"
      >
        <div style="height: 48px; border-bottom: 2px solid #000"></div>
        <v-simple-table densex class="table">
          <thead style="background-color: white">
            <tr>
              <th>Días</th>
              <th>Horario</th>
              <th>Hora Entrada</th>
              <th>Hora Salida</th>
              <th>Tiempo</th>
              <th>Permisos</th>
              <th>Estatus</th>
              <th>Revision</th>
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
                  <span class="font-weight-bold mr-1"> {{ dayjs(dia.dia).format("dddd") }}</span>
                  <span class="font-italic">{{
                    dayjs(dia.dia).locale("es").format("DD MMMM")
                  }}</span>
                </td> 
                <template v-if="dia?.asistencia">
                  <td style="text-align: left; background-color: #fffde7" class="font-weight-bold">Descanso</td>
                  <td style="background-color: #fffde7" class="px-0">
                   <div class="px-1">
                     <span class="font-weight-bold accent--text">{{
                      dia.asistencia_entrada
                    }}</span>
                    </div>
                  </td>
                  <td style="background-color: #fffde7" class="px-0">
                  <div class="px-1">
                     <span class="font-weight-bold accent--text">{{
                      dia.asistencia_salida
                    }}</span>
                    </div>
                  </td>   
                  <td class="text-center" style="background-color: #fffde7">
                  <span
                    class="text-subtitle-1 font-weight-black rounded px-1"
                    style="border: 1px solid #000"
                    >{{ dia.rango_horas }}</span
                  >
                </td>
              <td style="text-align: center; background-color: #fffde7">
                <div
                    v-for="(permiso, inde5) in dia.descripcion"
                    :key="inde5"
                    class="px-1 cpermiso"
                  >
                    {{ permiso }}
                    </div>
              </td>
              <td style="text-align: center; background-color: #fffde7">
                
              </td>
              <td style="text-align: center; background-color: #fffde7">
                <v-btn
                    @click="fnOpenAddIncidencia(dia.dia)"                    
                    class="ml-1"
                    rounded
                    small
                    color="secondary"
                  >
                    <v-icon left>mdi-receipt-text-plus</v-icon>
                    incidencia</v-btn
                  >
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
                  <span class="font-weight-bold accent--text mr-1">
                    {{ dayjs(dia.dia).format("dddd") }}
                  </span>
                  <span class="font-italic"> {{
                    dayjs(dia.dia).locale("es").format("DD MMMM") 
                  }} </span>
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
                    v-for="(
                      asistencia_entrada, inde3
                    ) in dia.asistencia_entrada"
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
                  <span
                    class="text-subtitle-1 font-weight-black rounded px-1"
                    style="border: 1px solid #000"
                    >{{ dia.rango_horas }}</span
                  >
                </td>

                <td style="width:250px">
                  <div
                    v-for="(permiso, inde5) in dia.descripcion"
                    :key="inde5"
                    class="px-1 cpermiso"
                  >
                    {{ permiso }}
                  </div>
                </td>
                <td class="px-1 text-center" style="width: 130px">
                  <v-chip
                    small
                    label
                    style="width: 100%"
                    class="text-center"
                    :color="dia.estatus_color"
                    >{{ dia.estatus_text }}</v-chip
                  >
                </td>
                <td class="text-center" style="width: 200px">
               

                  <v-btn
                    @click="fnOpenAddIncidencia(dia.dia)"
                    v-if="dia.estatus < 6 || dia.estatus==8"
                    class="ml-1"
                    rounded
                    small
                    color="secondary"
                  >
                    <v-icon left>mdi-receipt-text-plus</v-icon>
                    incidencia</v-btn
                  >
                </td>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
        <div style="height: 30px; border-top: 2px solid #000"></div>
      </div>
    </div>

    <v-dialog v-model="dialog" width="750" scrollable persistent>
      <v-card >
        <v-toolbar color="secondary" dark>Alta incidencia para el día {{dayjs(fecha_incidencia??undefined).format('dddd DD [de] MMMM [de] YYYY')}}
        <v-spacer></v-spacer>
        <v-btn @click="dialog=false" fab outlined small> <v-icon>mdi-close</v-icon> </v-btn>

        </v-toolbar>
        <v-card-text class="d-flex pt-5">
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

        <v-textarea v-model="descripcion" label="descripcion incidencia" placeholder="Descripcion incidencia" filled rows="10"  :error-messages="iErrors.descripcion"></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="fnCreateIncidencia" color="secondary">Agregar incidencia</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance, onMounted } from "vue";
import numeral from "numeral";
import isUndefined from "lodash/isUndefined";
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
  getAsistenciaColaboradorService,
  getColaboradoresByAreaService,
  getTipoIncidenciaService,
  createIncidenciaService
} from "@/services/incidencias_service";
import {useValidacionIncidencia} from '@/composables/useValidacionIncidencias'

const root = getCurrentInstance().proxy;

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const {iValid, iErrors, iClear } =useValidacionIncidencia()

const id_colaborador = ref(0);
const id_tipo_incidencia=ref()
const descripcion=ref('')
const fecha_incidencia=ref(undefined)

const lst_datos = ref([]);
const date = ref([]);
const lst_colaboradores = ref([]);

const lst_tipo_incidencia = ref([]);

const dialog = ref(false);

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

watch(id_colaborador, (val) => {
  if (Boolean(val)) getAsistencia();
  else {
    lst_datos.value = [];
  }
});

watch(date,(val)=>{
  console.log('val--->',val,Boolean(id_colaborador.value))
  if(val?.length===2 && Boolean(id_colaborador.value))
  {console.log('val---> asistenmcias if.....')
    getAsistencia()
  }
})

const search_colaborador=ref('')

const cColaborador=computed(()=>{
  return lst_colaboradores.value.filter(({nombre,apellido_paterno,apellido_materno}) =>`${nombre} ${apellido_paterno} ${apellido_materno}`.toLowerCase().indexOf(search_colaborador.value.toLowerCase()) > -1);
})

onMounted(() => {
  fnGetColaboradoresByArea();
  fnGetTipoIncidencia();
});

async function getAsistencia() {
  // ordena por fechas menor a mayor
  date.value.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

  try {
    const data = await getAsistenciaColaboradorService(
      id_colaborador.value,
      date.value
    );
    formatAsistencias(data.reverse());
  } catch (error) {}
}

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
  //10->dia es mayor a today
  try {
    lst_datos.value = data.map((i) => {
      //hora entrada de su horario caso jose leon es de [16:15:00,18:00:00]
      const _hora_entrada = (i.hora_entrada ?? "").split(",").filter(Boolean);
      //hora salida de su horario caso jose leon es de [17:30:00,22:15:00]
      const _hora_salida = (i.hora_salida ?? "").split(",").filter(Boolean);
      //son el numero de checada pueden ser n cantidad jose leon ejemplo  [16:17:20,22:23:12]
      const _asistencia = (i.asistencia ?? "").split(",").filter(Boolean);
      //es la descripcion de un permiso para la fecha que se recorre
      const descripcion = (i.descripcion ?? "").split("|").filter(Boolean);
      //bandera que indica que no se cuenta con dia de entrada y salida por ende es que no tiene horario dando como descanzo jose leon ejemplo domingo
      const descanso = !Boolean(i.dia_entrada) && !Boolean(i.dia_salida);
      //bandera que indica que el dia de entrada es el mismo de salida jose leon ejemplo 1=lunes es igua a 1=lunes pero ejemplo puga 1=lunes sale 2=martes
      const _flag_dia = i.dia_entrada === i.dia_salida;

      //indica que si es un dia valido osea un dia que ya paso no undia a futuro
      const is_day_valid=dayjs(i.dia).isSameOrBefore(dayjs(),'D');

      //hora_entrada [16:15:00,18:00:00]  hora salida [17:30:00,22:15:00]
      //con zip de lodash es [[16:15:00,17:30:00],[18:00:00,22:15:00]]
      const horarios_full = zip(_hora_entrada, _hora_salida).map(([i, ii]) =>
        [i.substring(0, 5), ii.substring(0, 5)].join(" a ")
      ); //['16:15 a 17:30', '18:00 a 22:15'] o ['09:00 a 15:00']

      const h_default = {
        id_row:i.index_row,
        dia_name: i.dia_name,
        descanso,
        dia: i.dia,
        horarios_full,
        descripcion,
      };

      //descanzo y sin registro de asistencia lo normal
      //el codigo que sigue abajo actua como el continues de un for normal
      if (descanso && _asistencia?.length === 0) return { ...h_default };

      if (descanso && _asistencia?.length > 0){
        
        const [asistencia_entrada,asistencia_salida]=_asistencia
        if(Boolean(asistencia_salida)){
          const rango_horas = numeral(round(dayjs(asistencia_salida, "HH:mm:ss").diff(dayjs(asistencia_entrada, "HH:mm:ss"),"s"),2)).format("0:0");    
          return { ...h_default,asistencia:_asistencia,asistencia_entrada ,asistencia_salida:asistencia_salida,rango_horas};
        }
        else{
           return { ...h_default,asistencia:_asistencia,asistencia_entrada ,asistencia_salida:'Omision',rango_horas:'Omision'};
        }
        }

      //si no hay asistencia y no hay permiso ni es dia de asueto el falta o es que no checo por algun problema(olvido o el reloj checador no sirve con el...)
      if (_asistencia.length === 0 && i.is_permiso == 0 && i.is_vacaciones==0 && i.is_asueto == 0 && i.is_incidencia == 0 && is_day_valid) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 0,
          estatus_text: "Sin registro",
          estatus_color: "red lighten-3",
        };
      }

      

      //indica que se tiene un permiso
      if (i.is_permiso == 1) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 6,
          estatus_text: "Permiso",
          estatus_color: "purple lighten-3",
        };
      }

      if (i.is_vacaciones == 1) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 7,
          estatus_text: "Vacaciones",
          estatus_color: "indigo lighten-3",
        };
      }
      
      if (i.is_asueto == 1) {

        console.log("rango en asueto:")

        const [asistencia_entrada, asistencia_salida] = _asistencia    
        const rango_horas = numeral(round(dayjs(asistencia_salida, "HH:mm:ss").diff(dayjs(asistencia_entrada, "HH:mm:ss"), "s"), 2)).format("0:0");
       
        
        return {
          ...h_default,
          rango_horas: rango_horas??"NA",
          estatus: 8,
          estatus_text: "Asueto",
          estatus_color: "pink lighten-3",
          // asistencia_entrada: [first(_asistencia)], asistencia_salida: [last(_asistencia)],
          asistencia_entrada: [asistencia_entrada], asistencia_salida: [asistencia_salida],
        };

        // return {
        //   ...h_default,
        //   rango_horas: "NA",
        //   estatus: 8,
        //   estatus_text: "Asueto",
        //   estatus_color: "pink lighten-3",
        // };
      }
      
      if (i.is_incidencia == 1) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 9,
          estatus_text: "incidencia",
          estatus_color: "teal lighten-3",
        };
      }

      if (!is_day_valid) {
        return {
          ...h_default,
          rango_horas: "NA",
          estatus: 10,
          estatus_text: "Fecha sin registro",
          estatus_color: "grey lighten-3",
        };
      }  

      let estatus = 0;
      let estatus_text = "";
      let estatus_color = "";

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
        return {
          ...h_default,
          rango_horas: "Omision",
          estatus,
          estatus_text,
          estatus_color,
          asistencia_entrada: [first(_asistencia)],
          asistencia_salida: ["Omision"],
        };
      }

      if (horarios_full.length === 1 && _asistencia.length > 1) {
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
          dayjs(first(i.asistencia), "HH:mm:ss"),
          "s"
        );
        let tiempo_horario = dayjs(last(_hora_salida), "HH:mm:ss").diff(
          dayjs(first(i.hora_entrada), "HH:mm:ss"),
          "s"
        );
        if (tiempo_asistencia < tiempo_horario)
          estatus_color = "blue-grey lighten-3"; //color gris indica que puedo entrar antes o salir antes ???
        return {
          ...h_default,
          rango_horas: _rango_horas,
          estatus,
          estatus_text,
          estatus_color,
          asistencia_entrada: [first(_asistencia)],
          asistencia_salida: [last(_asistencia)],
        };
      }

      if (horarios_full.length === 2 && _asistencia.length == 1) {
        return {
          ...h_default,
          rango_horas: "Omision",
          estatus,
          estatus_text,
          estatus_color,
          asistencia_entrada: [first(_asistencia), "Omision"],
          asistencia_salida: ["Omision", "Omision"],
        };
      }

      if (horarios_full.length === 2 && _asistencia.length == 2) {
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
        return {
          ...h_default,
          rango_horas: _rango_horas,
          estatus,
          estatus_text,
          estatus_color,
          asistencia_entrada: [first(_asistencia), "Omision"],
          asistencia_salida: ["Omision", last(_asistencia)],
        };
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
        return {
          ...h_default,
          rango_horas: _rango_horas,
          estatus,
          estatus_text,
          estatus_color,
          asistencia_entrada: [first(_asistencia), _asistencia[1]],
          asistencia_salida: ["Omision", last(_asistencia)],
        };
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

        const _rango_horas = numeral(
          round(rango_horas_1 - rango_horas_2, 2)
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
        return {
          ...h_default,
          rango_horas: _rango_horas,
          estatus,
          estatus_text,
          estatus_color,
          asistencia_entrada: [first(_asistencia), _asistencia[2]],
          asistencia_salida: [_asistencia[1], last(_asistencia)],
        };
      }
    });
  } catch (e) {
    console.log(e);
  }
}

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
  iClear()
  fecha_incidencia.value=fecha
  dialog.value = true;
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
      const index= lst_datos.value.findIndex(i=>i.dia==fecha_incidencia.value)
      const incidencia_name=lst_tipo_incidencia.value.find(i=>i.id_tipo_incidencia==id_tipo_incidencia.value)?.nombre

lst_datos.value[index].estatus=9
lst_datos.value[index].estatus_text="incidencia"
lst_datos.value[index].estatus_color="teal lighten-3"
lst_datos.value[index].descripcion=[`INCIDENCIA ${incidencia_name}`,descripcion.value]

id_tipo_incidencia.value=undefined
descripcion.value=undefined

dialog.value=false
    }
  } catch (error) {
    console.log(error)
  }
}



</script>

<style scoped>
>>> .table table {
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
}

.cpermiso:first-child {
  background-color: #424242;
  color: white;
  font-weight: bold;
}

.cpermiso:last-child {
  color: #424242 !important;
}
</style>
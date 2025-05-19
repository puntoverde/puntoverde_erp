<template>
  <div>
    <h1>Reporte de Acceso de Invitados</h1>
    <v-row justify="center">
      <v-col lg="2">
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
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="fechaIF"
              label="Fecha Inicial"
              hint="dd/mm/aaaa"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-on="on"
              v-validate="'min:10|max:10'"
              data-vv-name="fecha inicial"
              v-mask="'##/##/####'"
              :error="errors.has('fecha inicial')"
              :error-messages="errors.first('fecha inicial')"
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
      <template v-if="fechaIF != ''">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" @click="limpiarFechas(1)"
              >mdi-window-close</v-icon
            >
          </template>
          <span>Quitar fecha inicial</span>
        </v-tooltip>
      </template>

      <!-- Hora de inicio -->
      <v-col lg="2">
        <v-dialog
          ref="dialog"
          v-model="modalTi"
          persistent
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="horaI"
              label="Hora Inicial"
              prepend-icon="mdi-clock"
              readonly
              v-on="on"
              :disabled="todoElDia"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalTi"
            v-model="horaI"
            full-width
            :disabled="todoElDia"
          >
            <div class="flex-grow-1"></div>
            <v-btn text color="primary" @click="modalTi = false"
              >Cancelar</v-btn
            >
            <v-btn text color="primary" @click="aber()">OK</v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <v-tooltip bottom v-if="horaI != ''">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="horaI = ''">mdi-window-close</v-icon>
        </template>
        <span>Quitar hora inicial</span>
      </v-tooltip>
    </v-row>
    <v-row justify="center">
      <v-col lg="2">
        <v-menu
          v-model="menuFechaF"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <!-- @keyup.enter="fechaF = parseFecha(fechaFF)" -->
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="fechaFF"
              label="Fecha Final"
              hint="dd/mm/aaaa"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-on="on"
              :disabled="(soloDia && todoElDia) || soloDia"
              v-validate="'min:10|max:10'"
              data-vv-name="fecha final"
              v-mask="'##/##/####'"
              :error="errors.has('fecha final')"
              :error-messages="errors.first('fecha final')"
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
      <!-- Muestra  el icono cuando se escribe en el input, o se selecciona la fecha del menu -->
      <v-tooltip bottom v-if="fechaFF != ''">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="limpiarFechas(2)">mdi-window-close</v-icon>
        </template>
        <span>Quitar fecha final</span>
      </v-tooltip>
      <v-col lg="2">
        <v-dialog
          ref="dialog"
          v-model="modalTf"
          persistent
          full-width
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="horaF"
              label="Hora Final"
              prepend-icon="mdi-clock"
              readonly
              v-on="on"
              :disabled="(soloDia && todoElDia) || todoElDia"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="modalTf"
            v-model="horaF"
            full-width
            :disabled="(soloDia && todoElDia) || todoElDia"
          >
            <div class="flex-grow-1"></div>
            <v-btn text color="primary" @click="modalTf = false"
              >Cancelar</v-btn
            >
            <v-btn text color="primary" @click="aber()">OK</v-btn>
          </v-time-picker>
        </v-dialog>
      </v-col>
      <v-tooltip bottom v-if="horaF != ''">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="horaF = ''">mdi-window-close</v-icon>
        </template>
        <span>Quitar hora final</span>
      </v-tooltip>
    </v-row>
    <v-row justify="center">
      <v-col offset-lg="1" lg="2">
        <v-switch
          v-model="soloDia"
          label="Solo un día"
          @change="switchSoloDia()"
        ></v-switch>
      </v-col>
      <v-col lg="2">
        <v-switch
          v-model="todoElDia"
          label="Todo el día"
          @change="switchTodoElDia()"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col lg="2">
        <v-text-field
          @keyup.enter="cargarTabla()"
          @keyup="checkAccionCompuesta()"
          v-model="noAccion"
          label="Numero de Acción"
          prepend-icon="mdi-format-list-numbered"
        ></v-text-field>
      </v-col>
      <v-col v-if="noAccion <= 150 && noAccion !== ''" lg="1">
        <v-select
          @change="cargarTabla()"
          v-model="clasificacion"
          label="Clasificacion"
          :items="itemsClasificacion"
          item-text="txt"
          item-value="val"
        ></v-select>
      </v-col>
      <v-tooltip bottom v-if="noAccion != '' || clasificacion != ''">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" @click="(noAccion = ''), (clasificacion = '')"
            >mdi-window-close</v-icon
          >
        </template>
        <span>Quitar número de acción</span>
      </v-tooltip>
    </v-row>
    <v-row justify="center">
      <v-btn class="white--text" color="blue" @click="cargarTabla()"
        >Actualizar</v-btn
      > </v-row
    ><br />
    <v-btn @click="exportar()"
      >Exportar
      <v-icon color="success"> mdi-file-excel </v-icon>
    </v-btn>
    <v-data-table
      id="tabla"
      :headers="headersTabla"
      :items="itemsTabla"
      :items-per-page="10"
      :calculate-widths="true"
      class="elevation-2"
    >
      <template v-slot:item.tipo="{ item }">
        <label v-if="item.tipo == '1' || item.tipo == '2'">Entrada</label>
        <label v-else>Salida</label>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, watch,onMounted } from "vue";
import XLSX from "xlsx";
import {getReporteAccesoInvitadosService} from '@/services/reporte_acceso_service'

const menuFechaI = ref(false); //Ventana de dias, fecha inicial
const menuFechaF = ref(false); //Ventana de dias, fecha final
const fechaI = ref(""); //Fecha inicial en formato de BD
const fechaIF = ref(""); //Fecha inicial en formato de usuario
const horaI = ref(""); //Hora inicial
const horaItemp = ref(""); //Hora inicial temporal, se almacena cuando se usa el switch de todo el dia
const fechaF = ref(""); //Fecha final en formato de BD
const fechaFF = ref(""); //Fecha inicial en formato de usuario
const fechaFtemp = ref(""); //Fecha final temporal, se almacena cuando se usa el switch de solo un dia
const horaF = ref(""); //Hora final
const horaFtemp = ref(""); //Hora final temporal, se almacena cuando se usa el switch de todo el dia
const noAccion = ref("");
const clasificacion = ref("");
const soloDia = ref(false);
const todoElDia = ref(false);
const modalTi = ref(false); //Modal de picker de hora inicial
const modalTf = ref(false); //Modal de picker de hora final
const formatoFechaI = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const formatoFechaF = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const headersTabla = [
  { text: "Fecha", value: "fecha" },
  { text: "Invitado", value: "nombre" },
  { text: "Socio que invito", value: "socio" },
  { text: "# Acción", value: "accion" },
];
const itemsClasificacion = [
  { txt: "A", val: 1 },
  { txt: "B", val: 2 },
  { txt: "C", val: 3 },
];
const itemsTabla = ref([]);

watch(fechaI, (val) => {
  if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
});
watch(fechaF, (val) => {
  if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
});

onMounted(() => cargarTabla());

function aber() {
  modalTi.value = false;
  modalTf.value = false;
}
function switchSoloDia() {
  if (soloDia.value) {
    fechaFtemp.value = fechaFF.value;
    fechaFF.value = "";
  } else fechaFF.value = fechaFtemp.value;
}
function switchTodoElDia() {
  if (todoElDia.value) {
    horaItemp.value = horaI.value;
    horaFtemp.value = horaF.value;
    horaI.value = "";
    horaF.value = "";
  } else {
    horaI.value = horaItemp.value;
    horaF.value = horaFtemp.value;
  }
  // this.cargarTabla();
}
async function cargarTabla() {
//   this.$validator.validate().then((valid) => {
    // if (valid) {
      // axios
      //   .post(
      //     "/reporteAccesoInvitadosController.php",
      //     qs.stringify({
      //       accion: 1,
      //       dia: soloDia.value,
      //       fechaI: fechaIF.value,
      //       fechaF: fechaFF.value,
      //       horaI: horaI.value,
      //       horaF: horaF.value,
      //       noAccion: noAccion.value,
      //       clasificacion: clasificacion.value,
      //     })
      //   )
        // .then((res) => {
          // itemsTabla.value = [];
          // itemsTabla.value = res.data;
        // })
        // .catch(function (res) {
          // alert(res);
        // });

         const data=await getReporteAccesoInvitadosService(soloDia.value,fechaIF.value,fechaFF.value,horaI.value,horaF.value,noAccion.value,clasificacion.value)
         itemsTabla.value = data;


    // }
//   });
}
function limpiarFiltros() {
  fechaI.value = "";
  fechaF.value = "";
  horaI.value = "";
  horaF.value = "";
  soloDia.value = false;
  todoElDia.value = false;
}
function checkAccionCompuesta() {
  if (noAccion.value > 150) clasificacion.value = "";
}
function limpiarFechas(op) {
  if (op == 1) {
    fechaIF.value = "";
    fechaI.value = "";
    formatoFechaI.value = false;
  } else if (op == 2) {
    fechaFF.value = "";
    fechaF.value = "";
    formatoFechaF.value = false;
  }
}
function parseFecha(fecha) {
  if (!fecha) return null;
  menuFechaI.value = false;
  menuFechaF.value = false;
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
}
//Convierte fecha en formato aaaa-mm-dd a dd/mm/aaaa
function parseFechaInput(fecha) {
  if (!fecha) return null;
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
function exportar() {
  const tbl = document.getElementById("tabla");
  const wb = XLSX.utils.table_to_book(tbl);
  XLSX.writeFile(wb, "reporte_invitados.xlsb");
}
</script>
<style scoped lang="">
</style>
<template>
  <div>
    <h2>Administración de Apartados</h2>
    <br />
    {{ deshabilitar }}
    <v-tabs grow>
      <v-tab href="'#tab1'">Inventario</v-tab>
      <v-tab-item value="'tab1'">
        <v-card flat tile>
          <v-card-text>
            <v-data-table
              :headers="headersAlmacen"
              :items="itemsAlmacen"
              :items-per-page="10"
              :calculate-widths="true"
              class="elevation-1"
            >
            </v-data-table>
            <h2 id="anclaGrafico"></h2>
            <v-row justify="center">
              <div id="containerGrafo">
                <canvas id="myChart" width="800" height="530"></canvas>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab href="'#tab2'">Prestamos de Toallas</v-tab>
      <v-tab-item value="'tab2'">
        <v-card flat tile>
          <v-card-text>
            <v-row justify="center">
              <v-col lg="4">
                <v-text-field
                  @keyup.enter="cargarTabla()"
                  v-model="nombreB"
                  label="Nombre del socio"
                ></v-text-field>
              </v-col>
            </v-row>
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
                  <!-- @keyup.enter="fechaI = parseFecha(fechaIF)" -->
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
                  <v-icon v-on="on" @click="limpiarFechas(2)"
                    >mdi-window-close</v-icon
                  >
                </template>
                <span>Quitar fecha final</span>
              </v-tooltip>
            </v-row>
            <v-row justify="center">
              <v-btn
                @click="cargarTablaPrestamos"
                color="blue"
                class="white--text"
              >
                Actualizar
              </v-btn>
            </v-row>
            <v-data-table
              :headers="headersPrestamos"
              :items="itemsPrestamos"
              :items-per-page="10"
              :calculate-widths="true"
              class="elevation-1"
            >
              <template v-slot:item.estatus="{ item }">
                <label
                  v-if="
                    item.num_toallas_devueltas_a >= item.num_toallas_a &&
                    item.num_toallas_devueltas_b >= item.num_toallas_b
                  "
                  >Sin adeudos</label
                >
                <!-- <label v-else>Con adeudos</label> -->
                <v-tooltip bottom v-else>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="error"
                      @click="
                        dialogConfirmar = true;
                        cveCancelar = item.cve_prestamos_toallas;
                      "
                      >Cancelar</v-btn
                    >
                  </template>
                  <span>Quitar número de acción</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab href="'#tab3'">Toallas por Socio</v-tab>
      <v-tab-item value="'tab3'">
        <v-card flat tile>
          <v-card-text>
            <v-data-table
              :headers="headersToallasSocios"
              :items="itemsToallasSocios"
              :items-per-page="10"
              :calculate-widths="true"
              class="elevation-1"
            >
              <template v-slot:item.boton="{ item }">
                <template v-if="item.cantidad > 2">
                  <v-btn color="success">Cargar Cuota</v-btn>
                </template>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog v-model="dialogConfirmar" max-width="600px">
      <v-card>
        <v-card-title>
          Realmente quieres marcar este prestamo como pagado?
        </v-card-title>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="error" text @click="dialogConfirmar = false">No</v-btn>
          <v-btn color="blue darken-1" text @click="cancelarPrestamo()"
            >Si</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref,watch, onMounted } from "vue";
import {getToallaAlmacenService,getToallaPrestamoService,getToallaSociosService,getCancelarToallaPrestamoService} from '@/services/toallas_service'
import Chart from "chart.js";

const accion = ref(0);
const headersAlmacen = [
  //Columnas de la tabla
  { text: "Cantidad", value: "cantidad" },
  { text: "Producto", value: "producto" },
  { text: "Edificio", value: "edificio" },
];
const headersPrestamos = [
  //Columnas de la tabla
  { text: "Nombre", value: "nombre" },
  { text: "Fecha", value: "fecha_prestamo" },
  { text: "Toallas Alberca", value: "num_toallas_a" },
  { text: "Toallas Alberca Devueltas", value: "num_toallas_devueltas_a" },
  { text: "Toallas Baño", value: "num_toallas_b" },
  { text: "Toallas Baño Devueltas", value: "num_toallas_devueltas_b" },
  { text: "", value: "estatus" },
];
const headersToallasSocios = [
  { text: "Accion", value: "accion" },
  { text: "Posición", value: "posicion" },
  { text: "Fecha", value: "fecha_prestamo" },
  { text: "Nombre", value: "nombre" },
  { text: "Cantidad", value: "cantidad" },
  { text: "", value: "boton" },
];
const itemsAlmacen = ref([]); //Registros de la tabla
const itemsPrestamos = ref([]); //Registros de la tabla
const itemsToallasSocios = ref([]);
const headersReporte = ref([]);
const itemsReporte = ref([]);
const deshabilitar = ref(null);
const itemsEspacioD = ref([]);
const itemsEquiposSlc = ref([]);

const dialogConfirmar = ref(false); //Dialog para registrar nuevos apartados
const cveCancelar = ref(0); //Almacena los datos de la profesion a eliminar

const flagActualizar = ref(false); //Indica si se esta modificando una profesion
//Modelo
const nombreB = ref("");
const menuFechaI = ref(false); //Ventana de dias, fecha inicial
const menuFechaF = ref(false); //Ventana de dias, fecha final
const fechaI = ref(""); //Fecha inicial en formato de BD
const fechaIF = ref(""); //Fecha inicial en formato de usuario
const fechaF = ref(""); //Fecha final en formato de BD
const fechaFF = ref(""); //Fecha inicial en formato de usuario

watch(fechaI, (val) => {
  if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
});

watch(fechaF, (val) => {
  if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
});

onMounted(() => {
  cargarTablaAlmacen();
  // cargarTablaPrestamos();
  cargarTablaToallasSocios();
});

async function cargarTablaAlmacen() {
  // axios
  //   .post(
  //     "/toallasController.php",
  //     qs.stringify({
  //       accion: 1,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //       nombreB: nombreB.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsAlmacen.value = res.data;
  //     cargarGrafica();
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsAlmacen.value=await getToallaAlmacenService(fechaIF.value,fechaFF.value,nombreB.value)
  cargarGrafica();
}
async function cargarTablaPrestamos() {
  // axios
  //   .post(
  //     "/toallasController.php",
  //     qs.stringify({
  //       accion: 2,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //       nombreB: nombreB.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsPrestamos.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsPrestamos.value=await getToallaPrestamoService(fechaIF.value,fechaFF.value,nombreB.value)
}
async function cargarTablaToallasSocios() {
  // axios
  //   .post(
  //     "/toallasController.php",
  //     qs.stringify({
  //       accion: 4,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //       nombreB: nombreB.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsToallasSocios.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsToallasSocios.value=await getToallaSociosService(fechaIF.value,fechaFF.value,nombreB.value)
}
async function cancelarPrestamo() {
  // axios
  //   .post(
  //     "/toallasController.php",
  //     qs.stringify({
  //       accion: 3,
  //       cve: cveCancelar.value,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //       nombreB: nombreB.value,
  //     })
  //   )
  //   .then((res) => {
  //     if (res.data) {
  //       cargarTablaPrestamos();
  //       dialogConfirmar.value = false;
  //     } else alert("Ocurrio un error");
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  await getCancelarToallaPrestamoService(cveCancelar.value,fechaIF.value,fechaFF.value,nombreB.value)
  cargarTablaPrestamos();
  dialogConfirmar.value = false;
}
function cargarGrafica(esp) {
  //Arrays para dos conjuntos de datos(genero)
  var dss = [];
  var arrayVal = [];
  var arrayVal2 = [];
  var arrayVal3 = [];
  var arrayVal4 = [];
  var arrayVal5 = [];
  var arrayVal6 = [];
  var arrayVal7 = [];
  var arrayVal8 = [];
  var arrayColores = [];
  var arrayColoresBordes = [];
  itemsAlmacen.value.forEach((element) => {
    if (element.producto == "Toalla alberca limpia")
      arrayVal.push(element.cantidad);
    if (element.producto == "Toalla alberca sucia")
      arrayVal2.push(element.cantidad);
    if (element.producto == "Toalla alberca inutilizable")
      arrayVal3.push(element.cantidad);
    if (element.producto == "Toalla alberca alquilada")
      arrayVal4.push(element.cantidad);
    if (element.producto == "Toalla baño limpia")
      arrayVal5.push(element.cantidad);
    if (element.producto == "Toalla baño sucia")
      arrayVal6.push(element.cantidad);
    if (element.producto == "Toalla baño inutilizable")
      arrayVal7.push(element.cantidad);
    if (element.producto == "Toalla baño alquilada")
      arrayVal8.push(element.cantidad);
  });
  dss.push({
    label: "Toalla Alberca Limpia",
    data: arrayVal,
    backgroundColor: "rgba(255, 200, 0, 0.2)",
    borderColor: "rgba(255, 200, 0, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Alberca Sucia",
    data: arrayVal2,
    backgroundColor: "rgba(200, 255, 8, 0.2)",
    borderColor: "rgba(200, 255, 8, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Alberca Inutilizable",
    data: arrayVal3,
    backgroundColor: "rgba(200, 200, 200, 0.2)",
    borderColor: "rgba(200, 200, 200, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Alberca Alquilada",
    data: arrayVal4,
    backgroundColor: "rgba(143, 60, 1, 0.2)",
    borderColor: "rgba(143, 60, 1, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Baño Limpia",
    data: arrayVal5,
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderColor: "rgba(255, 0, 0, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Baño Sucia",
    data: arrayVal6,
    backgroundColor: "rgba(0, 255, 8, 0.2)",
    borderColor: "rgba(0, 255, 8, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Baño Inutilizable",
    data: arrayVal7,
    backgroundColor: "rgba(0, 255, 242, 0.2)",
    borderColor: "rgba(0, 255, 242, 1)",
    borderWidth: 1,
  });
  dss.push({
    label: "Toalla Baño Alquilada",
    data: arrayVal8,
    backgroundColor: "rgba(13, 0, 255, 0.2)",
    borderColor: "rgba(13, 0, 255, 1)",
    borderWidth: 1,
  });

  document.getElementById("myChart").remove();
  document.getElementById("containerGrafo").innerHTML =
    '<canvas id="myChart" width="800" height="500"></canvas>';
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Vestidor Hombres", "Vestidores Mujeres", "Lavanderia"],
      datasets: dss,
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
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
</script>
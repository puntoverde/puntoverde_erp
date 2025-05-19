<template>
  <div>
    <h1>Reporte de Pagos</h1>
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
          <v-icon v-on="on" @click="limpiarFechas(2)">mdi-window-close</v-icon>
        </template>
        <span>Quitar fecha final</span>
      </v-tooltip>
    </v-row>
    <v-tabs grow>
      <v-tab href="'#tab1'">Reporte General</v-tab>
      <v-tab-item value="'tab1'">
        <v-card flat tile>
          <v-card-text>
            <!--v-row justify="center">
                            
                            <v-col lg="3">
                                <v-select @change="cargarTablaDetalle()" multiple label="Cajera" v-model="cveCajera" :items="itemsCajeras" item-value="cve_persona" item-text="nombre">
                                    
                                </v-select>
                            </v-col>
                            <v-col lg="3">
                                <v-select @change="cargarTablaDetalle()" multiple label="Concepto" v-model="cveConcepto" :items="itemsConceptos" item-value="cve_cuota" item-text="descripcion">
                                    
                                </v-select>
                            </v-col>
                            <v-col lg="2">
                                <v-select @change="cargarFormasPagoSeleccionadas()" multiple label="Formas de Pago" v-model="cveFP" :items="itemsFP" item-value="clave" item-text="forma_pago">
                                </v-select>
                            </v-col>
            </v-row-->
            <v-row justify="center">
              <v-btn
                class="white--text"
                color="blue"
                @click="cargarTablaDetalle()"
                >Buscar</v-btn
              >
            </v-row>
            <br />
            <!-- <v-data-table :headers="headersTabla" :items="itemsTabla" :items-per-page="10" :calculate-widths="true" class="elevation-2">
                            <template v-slot:item.descripcion="{ item }">
                                <a href="#tablaDetalle" @click="mostrarTablaDetalle=true;cargarTablaDetalle(item.cve_cuota);tituloTablaDetalle=item.descripcion">{{item.descripcion}}</a>
                            </template>
                            <template v-slot:item.idpago="{ item }">
                                <label v-if="item.idpago !== null">Pagado</label>
                                <label v-else>Pendiente</label>
                            </template>
                            <template v-slot:item.descuento="{ item }">
                                <label v-if="item.descuento === null">0</label>
                                <label v-else>{{item.descuento}}</label>
                            </template>
                            <template v-slot:footer>
                                    <v-row justify="center">
                                        <v-col><b>&nbsp;Subtotal:</b> ${{cantidades.subtotal}}</v-col>
                                        <v-col><b>IVA:</b> ${{cantidades.iva}}</v-col>
                                        <v-col><b>Total:</b> ${{cantidades.total}}</v-col>
                                        <v-col><b>Descuentos:</b> ${{cantidades.descuento}}</v-col>
                                    </v-row>
                                    <v-row justify="center">
                                        &nbsp;
                                        <template v-for="item in formasPago">
                                            <v-col>
                                                <b>{{item.forma_pago}}:</b> ${{item.monto}}
                                            </v-col>
                                        </template>
                                    </v-row>
                            </template>
            </v-data-table>-->
            <template>
              <!-- <br><hr><h3>Pagos de {{tituloTablaDetalle}}</h3><br> -->
              <v-btn class="mr-2" @click="exportar()">
                Exportar
                <v-icon color="success">mdi-file-excel</v-icon>
              </v-btn>
              <v-btn @click="generar()">
                Generar
                <v-icon color="error">mdi-file-pdf</v-icon>
              </v-btn>
              <v-data-table
                id="tablaDetalle"
                :headers="headersTablaDetalle"
                :items="itemsTablaDetalle"
                :items-per-page="10"
                :calculate-widths="true"
                class="elevation-2 mt-3"
              >
                <!-- <template v-slot:item.subtotal="{item}">
                                    {{item.subtotal*item.cantidad}}
                </template>-->
                <template v-slot:item.descuento="{ item }">
                  <label v-if="item.descuento === null">0</label>
                  <label v-else>{{
                    numeral(item.descuento).format("$0,0.00")
                  }}</label>
                </template>
                <template v-slot:item.subtotal="{ item }">{{
                  numeral(item.subtotal).format("$0,0.00")
                }}</template>
                <template v-slot:item.iva="{ item }">{{
                  numeral(item.iva).format("$0,0.00")
                }}</template>
                <template v-slot:item.total="{ item }">{{
                  numeral(item.total).format("$0,0.00")
                }}</template>
                <template v-slot:item.folio="{ item }">
                  <label v-if="item.folio === null">N/A</label>
                  <label v-else>{{ item.folio }}</label>
                </template>
                <template v-slot:item.factura="{ item }">
                  <v-icon color="success" v-if="item.factura > 0"
                    >mdi-check</v-icon
                  >
                  <v-icon color="error" v-else>mdi-close</v-icon>
                </template>
                <!-- <template v-slot:item.formas_pago="{ item }">
                                    <template v-for="itemI in itemsFPTabla">
                                        <label v-if="itemI.idpago == item.idpago">{{itemI.forma_pago}}: {{itemI.monto}}</label>  
                                    </template>
                </template>-->

                <template v-slot:footer>
                  <v-row justify="center">
                    <v-col>
                      <b>&nbsp;Subtotal:</b>
                      ${{ cantidadesDetalle.subtotal.toFixed(2) }}
                    </v-col>
                    <v-col>
                      <b>IVA:</b>
                      ${{ cantidadesDetalle.iva.toFixed(2) }}
                    </v-col>
                    <v-col>
                      <b>Total:</b>
                      ${{ cantidadesDetalle.total.toFixed(2) }}
                    </v-col>
                    <v-col>
                      <b>Descuentos:</b>
                      ${{ cantidadesDetalle.descuento.toFixed(2) }}
                    </v-col>
                  </v-row>
                  <v-row justify="center">
                    <template v-for="(item, index) in itemsFPSeleccionadas">
                      <v-col v-if="item.forma_pago != null" :key="index">
                        <b>{{ item.forma_pago }}:</b>
                        ${{ item.monto }}
                      </v-col>
                    </template>
                  </v-row>
                </template>
              </v-data-table>
            </template>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab href="'#tab2'">Reporte por Conceptos</v-tab>
      <v-tab-item value="'tab2'">
        <br />
        <v-row justify="center">
          <v-btn
            class="white--text mr-2"
            color="blue"
            @click="cargarListaConceptos()"
            >Actualizar</v-btn
          >
          <v-btn class="white--text" color="error" @click="generar2()">
            <v-icon>mdi-file-pdf</v-icon>Generar
          </v-btn>
        </v-row>
        <v-row class="mx-5 mt-5">
          <v-simple-table style="width: 100%" class="elevation-3">
            <table>
              <thead>
                <tr>
                  <th>Cargo</th>
                  <th>Subtotal</th>
                  <th>Iva</th>
                  <th>Cantidad</th>
                  <th>Descuento</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in itemsConceptos" :key="index">
                  <td>{{ item.descripcion }}</td>
                  <td>{{ numeral(item.subtotal).format("$0,0.00") }}</td>
                  <td>{{ numeral(item.iva).format("$0,0.00") }}</td>
                  <td>{{ item.cantidad }}</td>
                  <td>{{ numeral(item.descuento).format("$0,0.00") }}</td>
                  <td>{{ numeral(item.total).format("$0,0.00") }}</td>
                </tr>
              </tbody>
            </table>
          </v-simple-table>
          <!-- <template v-for="(item,index) in itemsConceptos">
                        <v-card flat tile :key="index">
                            <v-card-text>
                                <v-card max-width="410" min-width="300" outlined elevation="8">
                                    <v-list-item three-line>
                                        <v-list-item-content>
                                            <v-list-item-title class="headline mb-1">{{item.descripcion}}</v-list-item-title>
                                            Cuotas cobradas: <b>{{item.cantidad}}</b>
                                            Subtotal: <div class="green--text">+${{item.subtotal}}</div>
                                            IVA: <div class="green--text">+${{item.iva}}</div>
                                            Total: <div class="green--text">+${{item.total}}</div>
                                            <template v-if="item.descuento===null">
                                                Descuentos: <div class="red--text">-$0</div>
                                            </template>
                                            <template v-else>
                                                Descuentos: <div class="red--text">-${{item.descuento}}</div>
                                            </template>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card>
                            </v-card-text>
                        </v-card>
          </template>-->
        </v-row>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import numeral from "numeral";
import _ from "lodash";
import {getAllPagosReporteService,getAllFormaPagosReporteService,getPagosReporteDetalleService,getPagosReporteDetalleTableService,getPagosReporteListaCajeraService,getPagosReporteListaConceptosService,getPagosReporteFormasPagoService,getPagosReporteFormasPagoSeleccionadasService} from '@/services/reporte_pagos_service'

const menuFechaI = ref(false); //Ventana de dias, fecha inicial
const menuFechaF = ref(false); //Ventana de dias, fecha final
const fechaI = ref(); //Fecha inicial en formato de BD
const fechaIF = ref(); //Fecha inicial en formato de usuario
const fechaF = ref(); //Fecha final en formato de BD
const fechaFF = ref(); //Fecha inicial en formato de usuario

const formatoFechaI = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const formatoFechaF = ref(false); //Para saber si fue asignada la fecha con formato de BD al momento de buscar
const mostrarTablaDetalle = ref(false);
const tituloTablaDetalle = ref();
const headersTabla = [
  { text: "Concepto", value: "descripcion" },
  { text: "Cantidad", value: "cantidad" },
  { text: "Subtotal", value: "subtotal" },
  { text: "IVA", value: "iva" },
  { text: "Total", value: "total" },
  { text: "Descuento", value: "descuento" },
  { text: "Estatus", value: "idpago" },
];
const headersTablaDetalle = [
  { text: "Folio", value: "folio" },
  { text: "Cargos", value: "cargos" },
  { text: "Periodo", value: "periodo" },
  { text: "Descuento", value: "descuento" },
  { text: "Subtotal", value: "subtotal" },
  { text: "IVA", value: "iva" },
  { text: "Total", value: "total" },
  { text: "Formas de Pago", value: "formas_pago" },
  { text: "Accion", value: "accion" },
  { text: "Nombre", value: "nombre" },
  { text: "Fecha", value: "fecha" },
  { text: "Cobro", value: "cajera" },
  { text: "Requiere Factura", value: "factura" },
];
const itemsTabla = ref([]);
const itemsTablaDetalle = ref([]);
const itemsCajeras = ref([]);
const itemsConceptos = ref([]);
const itemsFP = ref([]);
const itemsFPSeleccionadas = ref([]);

const itemsFPTabla = ref([]);
const formasPago = ref([]);
const cveCajera = ref([]);
const cveConcepto = ref([]);
const cveFP = ref([]);
const cantidades = ref({ total: 0.0, subtotal: 0.0, iva: 0.0, descuento: 0.0 });
const cantidadesDetalle = ref({
  total: 0.0,
  subtotal: 0.0,
  iva: 0.0,
  descuento: 0.0,
});

onMounted(() => {
  cargarListaCajeras();
  cargarListaConceptos();
});

watch(fechaI, (val) => {
  if (val.length > 1) fechaIF.value = parseFechaInput(fechaI.value);
});
watch(fechaF, (val) => {
  if (val.length > 1) fechaFF.value = parseFechaInput(fechaF.value);
});

async function cargarTabla() {
  // this.$validator.validate().then(valid => {
  // if (valid) {
  resetTotales(1);
  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 1,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsTabla.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
itemsTabla.value=await getAllPagosReporteService(fechaIF.value,fechaFF.value)


  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 2,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     formasPago.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });

formasPago.value=await getAllFormaPagosReporteService(fechaIF.value,fechaFF.value)

  // }
  // });
}
async function cargarTablaDetalle() {
  resetTotales(2);
  cargarFormasPago();
  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 3,
  //       cajeras: cveCajera.value,
  //       concepto: cveConcepto.value,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsTablaDetalle.value = res.data;
  //     itemsTablaDetalle.value.forEach((element) => {
  //       cantidadesDetalle.value.iva += parseFloat(element.iva);
  //       cantidadesDetalle.value.subtotal += parseFloat(element.subtotal);
  //       cantidadesDetalle.value.total += parseFloat(element.total);
  //       if (element.descuento !== null)
  //         cantidadesDetalle.value.descuento += parseFloat(element.descuento);
  //     });
  //     // this.cantidadesDetalle.iva.toFixed(2);
  //     // this.cantidadesDetalle.subtotal.toFixed(2);
  //     // this.cantidadesDetalle.total.toFixed(2);
  //     // this.cantidadesDetalle.descuento.toFixed(2);
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });

 const data=await getPagosReporteDetalleService(cveCajera.value,cveConcepto.value,fechaIF.value,fechaFF.value)
  itemsTablaDetalle.value = data;
  itemsTablaDetalle.value.forEach((element) => {
        cantidadesDetalle.value.iva += parseFloat(element.iva);
        cantidadesDetalle.value.subtotal += parseFloat(element.subtotal);
        cantidadesDetalle.value.total += parseFloat(element.total);
        if (element.descuento !== null)
          cantidadesDetalle.value.descuento += parseFloat(element.descuento);
      });

  // axios
  //   .post("/reportePagosController.php", qs.stringify({ accion: 8 }))
  //   .then((res) => {
  //     itemsFPTabla.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsFPTabla.value=await getPagosReporteDetalleTableService()
}
async function cargarListaCajeras() {
  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 4,
  //       cajeras: "",
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsCajeras.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });

itemsCajeras.value=await getPagosReporteListaCajeraService(fechaIF.value,fechaFF.value)

}
async function cargarListaConceptos() {
  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 5,
  //       cajeras: "",
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsConceptos.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
    itemsConceptos.value=await getPagosReporteListaConceptosService(fechaIF.value,fechaFF.value)
}
async function cargarFormasPago() {
  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 2,
  //       cajeras: cveCajera.value,
  //       concepto: cveConcepto.value,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     // this.itemsFP = res.data;
  //     itemsFPSeleccionadas.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsFPSeleccionadas.value=await getPagosReporteFormasPagoService(cveCajera.value,cveConcepto.value,fechaIF.value,fechaFF.value)
}
async function cargarFormasPagoSeleccionadas() {
  // axios
  //   .post(
  //     "/reportePagosController.php",
  //     qs.stringify({
  //       accion: 6,
  //       cajeras: cveCajera.value,
  //       concepto: cveConcepto.value,
  //       fpago: cveFP.value,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsFPSeleccionadas.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsFPSeleccionadas.value=await getPagosReporteFormasPagoSeleccionadasService(cveCajera.value,cveConcepto.value,cveFP.value,fechaIF.value,fechaFF.value)
}
function limpiarFiltros() {
  fechaI.value = "";
  fechaF.value = "";
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
function resetTotales(op) {
  switch (op) {
    case 1:
      cantidades.value.subtotal = 0;
      cantidades.value.iva = 0;
      cantidades.value.total = 0;
      cantidades.value.descuento = 0;
      break;
    case 2:
      cantidadesDetalle.value.subtotal = 0;
      cantidadesDetalle.value.iva = 0;
      cantidadesDetalle.value.total = 0;
      cantidadesDetalle.value.descuento = 0;
      break;
  }
}

//Convierte fecha en formato aaaa-mm-dd a dd/mm/aaaa
function parseFechaInput(fecha) {
  if (!fecha) return null;
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}
function exportar() {
  var tbl = document.getElementById("tablaDetalle");
  var wb = XLSX.utils.table_to_book(tbl);
  XLSX.writeFile(wb, "reporte_pagos.xlsb");
}
function generar() {
  const pdf = new jsPDF();

  pdf.text("Reporte de Corte Caja", 100, 10, null, null, "center");
  pdf.setFontSize(10);
  pdf.text(
    `perido ${fechaIF.value} al ${fechaFF.value}`,
    100,
    15,
    null,
    null,
    "center"
  );

  pdf.autoTable({
    theme: "grid",
    margin: { left: 5, right: 5, top: 20 },
    headStyles: { fillColor: [115, 115, 115], cellWidth: "wrap" },
    // head: [['Folio', 'Cargos', 'Descuento','Subtotal','Iva','Total','Forma Pago','Accion','Nombre','Fecha','Cobro']],
    columns: [
      { header: "Folio", dataKey: "folio" },
      { header: "Cargos", dataKey: "cargos" },
      { header: "Periodo", dataKey: "periodo" },
      { header: "Descuento", dataKey: "descuento" },
      { header: "Subtotal", dataKey: "subtotal" },
      { header: "Iva", dataKey: "iva" },
      { header: "Total", dataKey: "total" },
      { header: "Forma Pago", dataKey: "formas_pago" },
      { header: "Accion", dataKey: "accion" },
      { header: "Nombre", dataKey: "nombre" },
      { header: "Fecha", dataKey: "fecha" },
      { header: "Cobro", dataKey: "cajera" },
    ],
    body: itemsTablaDetalle.value,
  });

  pdf.autoTable({
    theme: "grid",
    margin: { left: 5, right: 5 },
    headStyles: { fillColor: [115, 115, 115], cellWidth: "wrap" },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    head: [
      {
        content: itemsFPSeleccionadas.value
          .map(
            (item) => `${item.forma_pago}:${numeral(item.monto).format("0,0")}`
          )
          .join(" | "),
      },
    ],
  });

  pdf.save("reporte_pagos.pdf");
}
function generar2() {
  const pdf = new jsPDF();

  pdf.text("Reporte de Corte Caja", 100, 10, null, null, "center");
  pdf.setFontSize(10);
  pdf.text(
    `perido ${fechaIF.value} al ${fechaFF.value}`,
    100,
    15,
    null,
    null,
    "center"
  );
  let bandera = 0;
  pdf.autoTable({
    theme: "grid",
    margin: { left: 5, right: 5, top: 20 },
    headStyles: { fillColor: [115, 115, 115], cellWidth: "wrap" },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      total: { fillColor: [115, 115, 115], textColor: [255, 255, 255] },
    },
    columns: [
      { header: "Concepto", dataKey: "descripcion" },
      { header: "Descuento", dataKey: "descuento" },
      { header: "Subtotal", dataKey: "subtotal" },
      { header: "Iva", dataKey: "iva" },
      { header: "Cantidad", dataKey: "cantidad" },
      { header: "Total", dataKey: "total" },
    ],
    body: itemsConceptos.value.map((item) => ({
      descripcion: item.descripcion,
      descuento: numeral(item.descuento).format("0,0[.]00"),
      subtotal: numeral(item.subtotal).format("0,0[.]00"),
      iva: numeral(item.iva).format("0,0[.]00"),
      cantidad: item.cantidad,
      total: numeral(item.total).format("0,0[.]00"),
    })),
    foot: [
      {
        total: numeral(
          itemsConceptos.value
            .map((item) => item.total)
            .reduce((red, val) => red + parseFloat(val), 0)
        ).format("0,0[.]00"),
        subtotal: numeral(
          itemsConceptos.value
            .map((item) => item.subtotal)
            .reduce((red, val) => red + parseFloat(val), 0)
        ).format("0,0[.]00"),
        descuento: numeral(
          itemsConceptos.value
            .map((item) => item.descuento)
            .reduce((red, val) => red + parseFloat(_.isNull(val) ? 0 : val), 0)
        ).format("0,0[.]00"),
        iva: numeral(
          itemsConceptos.value
            .map((item) => item.iva)
            .reduce((red, val) => red + parseFloat(val), 0)
        ).format("0,0[.]00"),
      },
    ],
  });

  pdf.autoTable({
    theme: "grid",
    margin: { left: 5, right: 5 },
    headStyles: { fillColor: [115, 115, 115], cellWidth: "wrap" },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    head: [
      {
        content: itemsFPSeleccionadas.value
          .map(
            (item) => `${item.forma_pago}:${numeral(item.monto).format("0,0")}`
          )
          .join(" | "),
      },
    ],
  });

  pdf.save("reporte_pagos.pdf");
}
</script>
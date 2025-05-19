<template>
  <div>
    <h1>Reporte de Pagos por Cortes de Caja</h1>
    <br />
    <v-data-table
      :headers="headersTabla"
      :items="itemsTabla"
      :items-per-page="10"
      :calculate-widths="true"
      class="elevation-2"
    >
      <template v-slot:item.ver="{ item }">
        <a
          href="#tablaDetalle"
          @click="
            mostrarTablaDetalle = true;
            mostrarTablaFP = false;
            cargarTablaDetalle(item.inicio, item.fin);
            tituloTablaDetalle = item.inicio + ' al ' + item.fin;
          "
          >Ver pagos</a
        >
      </template>
    </v-data-table>
    <template v-if="mostrarTablaDetalle">
      <br />
      <hr />
      <br />
      <h3>Pagos de {{ tituloTablaDetalle }}</h3>
      <br />
      <v-btn @click="exportar()"
        >Exportar
        <v-icon color="success"> mdi-file-excel </v-icon>
      </v-btn>
      <v-data-table
        id="tablaDetalle"
        :headers="headersTablaDetalle"
        :items="itemsTablaDetalle"
        :items-per-page="10"
        :calculate-widths="true"
        class="elevation-2"
      >
        <template v-slot:item.forma_pago="{ item }">
          <a
            href="#listaFP"
            @click="
              folioSeleccionado = item.idpago;
              mostrarTablaFP = true;
              cargarTablaFP(item.idpago);
            "
            >Ver</a
          >
        </template>
        <template v-slot:item.subtotal="{ item }">
          <label v-if="item.subtotal > 0">$ {{ item.subtotal }}</label>
          <label v-else>$ 0</label>
        </template>
        <template v-slot:item.iva="{ item }">
          <label v-if="item.iva > 0">$ {{ item.iva }}</label>
          <label v-else>$ 0</label>
        </template>
        <template v-slot:item.total="{ item }">
          <label v-if="item.total > 0">$ {{ item.total }}</label>
          <label v-else>$ 0</label>
        </template>
        <template v-slot:item.descuento="{ item }">
          <label v-if="item.descuento > 0">$ {{ item.descuento }}</label>
          <label v-else>$ 0</label>
        </template>
      </v-data-table>
    </template>
    <template v-if="mostrarTablaFP">
      <v-row justify="center">
        <v-col lg="3">
          <v-card class="mx-auto" tile>
            <v-list disabled id="listaFP">
              <v-subheader
                >Formas de pago (Folio {{ folioSeleccionado }})</v-subheader
              >
              <v-list-item-group v-model="itemsTablaFP" color="primary">
                <v-list-item v-for="(item, i) in itemsTablaFP" :key="i">
                  <v-list-item-icon>
                    <v-icon v-text="item.icono"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.forma_pago + ' - $' + item.monto"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import XLSX from "xlsx";
import {getReporteCorteCajaService,getReporteCorteCajaDetalleService,getReporteCorteCajaTablaFpService} from '@/services/reporte_corte_caja_service'

const mostrarTablaDetalle = ref(false);
const mostrarTablaFP = ref(false);
const tituloTablaDetalle = ref("");
const folioSeleccionado = ref("");
const headersTabla = [
  { text: "Inicio", value: "inicio" },
  { text: "Fin", value: "fin" },
  { text: "Cajero(a)", value: "cobro" },
  { text: "Ver", value: "ver" },
];
const headersTablaDetalle = [
  { text: "Folio", value: "idpago" },
  { text: "Accion", value: "accion" },
  { text: "Socio", value: "socio" },
  { text: "Subtotal", value: "subtotal" },
  { text: "IVA", value: "iva" },
  { text: "Total", value: "total" },
  { text: "Descuento", value: "descuento" },
  { text: "Formas de Pago", value: "forma_pago" },
  { text: "Fecha", value: "fecha" },
  { text: "Cobró", value: "cobro" },
];
const itemsTabla = ref([]);
const itemsTablaDetalle = ref([]);
const itemsTablaFP = ref([]);

onMounted(() => cargarTabla());

async function cargarTabla() {
  // axios
  //   .post(
  //     "/reporteCorteCajaController.php",
  //     qs.stringify({ accion: 1, fechaI: "", fechaF: "" })
  //   )
  //   .then((res) => {
  //     itemsTabla.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
 itemsTabla.value=await  getReporteCorteCajaService('','')
}
async function cargarTablaDetalle(fi, ff) {
  // axios
  //   .post(
  //     "/reporteCorteCajaController.php",
  //     qs.stringify({ accion: 2, cuota: 0, fechaI: fi, fechaF: ff })
  //   )
  //   .then((res) => {
  //     itemsTablaDetalle.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
  itemsTablaDetalle.value=await getReporteCorteCajaDetalleService(fi,ff)
}
async function cargarTablaFP(cvePago) {
  // axios
  //   .post(
  //     "/reporteCorteCajaController.php",
  //     qs.stringify({
  //       accion: 3,
  //       idpago: cvePago,
  //       fechaI: fechaIF.value,
  //       fechaF: fechaFF.value,
  //     })
  //   )
  //   .then((res) => {
  //     itemsTablaFP.value = res.data;
  //   })
  //   .catch(function (res) {
  //     alert(res);
  //   });
 itemsTablaFP.value= await getReporteCorteCajaTablaFpService(cvePago,fechaIF.value,fechaFF.value)
}
function exportar() {
  var tbl = document.getElementById("tablaDetalle");
  var wb = XLSX.utils.table_to_book(tbl);
  XLSX.writeFile(wb, "reporte_cortes_caja.xlsb");
}
</script>
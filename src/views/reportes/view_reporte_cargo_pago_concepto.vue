<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between"
        >Reporte de Cargosxxx
        <div>
          <v-btn color="primary" @click="buscar" v-if="!cValid" class="mr-3"
            ><v-icon>mdi-magnify</v-icon> Buscar Pagos</v-btn
          >
          <v-btn color="primary" @click="exportar" v-if="lst_pagos.length > 0">
            <v-icon>mdi-file-excel</v-icon>Exportar
          </v-btn>
        </div></v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              label="Acciones"
              v-mask="accionMask"
              v-model="accion"
              clearable
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              label="Concepto"
              v-model="concepto"
              :items="lst_conceptos"
              item-value="cve_cuota"
              item-text="descripcion"
              clearable
            ></v-select>
          </v-col>
          <v-col>
            <v-menu
              ref="menu3_ref"
              v-model="menu3"
              :close-on-content-click="false"
              :return-value.sync="date3"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date3"
                  label="Periodo"
                  prepend-icon="mdi-calendar-month"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date3"
                type="month"
                no-title
                scrollable
                color="primary"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu3 = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="$refs.menu3_ref.save(date3)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu
              ref="menu_ref"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="Dia Inicio"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu_ref.save(date)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-menu
              ref="menu2_ref"
              v-model="menu2"
              :close-on-content-click="false"
              :return-value.sync="date2"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date2"
                  label="Dia Fin"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker v-model="date2" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu2 = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="$refs.menu2_ref.save(date2)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-data-table
      id="tablaDetalle"
      :headers="headersTablaDetalle"
      :items="lst_pagos"
      :items-per-page="10"
      :calculate-widths="true"
      class="elevation-2"
      item-key="cve_cargo"
    >
      <template v-slot:header>
        <tr>
          <th colspan="5" class="text-center amber lighten-2">Cargos</th>
          <th colspan="7" class="text-center green accent-2">Pagos</th>
        </tr>
      </template>

      <template v-slot:item.monto_cargo="{ item }">
        {{ numeral(item.monto_cargo).format("$0,0.00") }}
      </template>

      <template v-slot:item.descuento="{ item }">
        {{ /*item.descuento*/ numeral(item.monto).format("$0,0.00") }}
      </template>
      <template v-slot:item.subtotal="{ item }">
        {{/*item.subtotal*/ /*item.monto_cargo-item.monto | fSubtotal numeral().format('$0,0.00')]*/}}
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{
          numeral(item.monto_cargo - item.monto)
            .divide(116)
            .multiply(100)
            .format("$0,0.00")
        }}</label>
      </template>
      <template v-slot:item.iva="{ item }">
        {{/*item.descuento*/ /*item.monto_cargo-item.monto | fIva numeral().format('$0,0.00')*/}}
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{
          numeral(item.monto_cargo - item.monto)
            .divide(116)
            .multiply(100)
            .multiply(0.16)
            .format("$0,0.00")
        }}</label>
      </template>
      <template v-slot:item.total="{ item }">
        {{/*item.total*/ /*item.monto_cargo-item.monto numeral().format('$0,0.00')*/}}
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{
          numeral(item.monto_cargo - item.monto).format("$0,0.00")
        }}</label>
      </template>
      <template v-slot:item.fecha_hora_cobro="{ item }">
        <label v-if="item.folio === null">N/A</label>
        <label v-else>
          {{
            dayjs(item.fecha_hora_cobro).format("DD/MM/YYYY hh:mm:ss")
          }}</label
        >
      </template>

      <template v-slot:item.sociox="{ item }">
        {{ item.sociox }}
      </template>

      <template v-slot:item.cajerox="{ item }">
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{ item.cajerox }}</label>
      </template>

      <template v-slot:item.folio="{ item }">
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{ item.folio }}</label>
      </template>

      <template v-slot:footer>
        <v-row justify="center">
          <v-col>
            <b>&nbsp;Total Cargo:</b>
            {{ numeral(CTotalCargo).format("$0,0.00") }}
          </v-col>
          <v-col>
            <b>Descuentos:</b>
            {{ numeral(cDescuento).format("$0,0.00") }}
          </v-col>
          <v-col>
            <b>Total:</b>
            {{ numeral(cTotal).format("$0,0.00") }}
          </v-col>
          <v-col>
            <b>&nbsp;Subtotal:</b>
            {{ numeral(cSubtotal).format("$0,0.00") }}
          </v-col>
          <v-col>
            <b>IVA:</b>
            {{ numeral(cIva).format("$0,0.00") }}
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import _ from "lodash";
import {getReporteCargoPagoService,getReporteCargoPagoConceptosService} from '@/services/cargo_service'

import XLSX from "xlsx";
import { saveAs } from "file-saver";
import numeral from "numeral";
import dayjs from "dayjs";

const accionMask = {
  mask: "FFFFF",
  tokens: {
    F: {
      pattern: /[0-9a-zA-Z]/,
      transform(v) {
        return v.toLocaleUpperCase();
      },
    },
  },
};
const accion = ref("");
const concepto = ref(0);
const menu = ref(false);
const menu_ref = ref(null);
const date = ref(null);
const menu2 = ref(false);
const menu2_ref = ref(null);
const date2 = ref(null);
const menu3 = ref(false);
const menu3_ref = ref(null);
const date3 = ref(null);
const lst_conceptos = ref([]);
const lst_pagos = ref([]);
const headersTablaDetalle = [
  { text: "Accion", value: "accion" },
  { text: "Cargo", value: "concepto" },
  { text: "Monto Cargo", value: "monto_cargo" },
  { text: "Descuento", value: "descuento" },
  { text: "Periodo", value: "periodo" },
  { text: "Nombre", value: "sociox" },

  { text: "Folio", value: "folio" },
  { text: "Total", value: "total" },
  { text: "Subtotal", value: "subtotal" },
  { text: "IVA", value: "iva" },
  { text: "Fecha", value: "fecha_hora_cobro" },
  { text: "Cobro", value: "cajerox" },
];




const cSubtotal = computed(() => {
  return (cTotal.value / 116) * 100;
});

const cIva = computed(() => {
  return cSubtotal.value * 0.16;
});
const cTotal = computed(() => {
  let descuento = lst_pagos.value
    .filter((item) => !_.isNull(item.folio))
    .map((item) => parseFloat(_.isNull(item.monto) ? 0 : item.monto))
    .reduce((reductor, value) => reductor + value, 0);
  let total_pagado = lst_pagos.value
    .filter((item) => !_.isNull(item.folio))
    .map(
      (item) =>
        parseFloat(_.isNull(item.monto_cargo) ? 0 : item.monto_cargo) -
        parseFloat(_.isNull(item.monto) ? 0 : item.monto)
    )
    .reduce((reductor, value) => reductor + value, 0);
  return total_pagado;
});
const cDescuento = computed(() => {
  return lst_pagos.value
    .map((item) => parseFloat(_.isNull(item.monto) ? 0 : item.monto))
    .reduce((reductor, value) => reductor + value, 0);
});
const CTotalCargo = computed(() => {
  return lst_pagos.value
    .map((item) =>
      parseFloat(_.isNull(item.monto_cargo) ? 0 : item.monto_cargo)
    )
    .reduce((reductor, value) => reductor + value, 0);
});

const cValid = computed(() => {
  return (
    (_.isNull(accion.value) ||
      _.isUndefined(accion.value) ||
      accion.value == "") &&
    (_.isNull(concepto.value) ||
      _.isUndefined(concepto.value) ||
      concepto.value == 0) &&
    (_.isNull(date3.value) ||
      _.isUndefined(date3.value) ||
      date3.value == "") &&
    (_.isNull(date.value) || _.isUndefined(date.value) || date.value == "") &&
    (_.isNull(date2.value) || _.isUndefined(date2.value) || date2.value == "")
  );
});

watch(cValid, (val) => {
  if (val) lst_pagos.value = [];
});

onMounted(() => {
  getConceptos();
});

async function getConceptos() {
  // axios
  //   .get("/reportePagoConceptoController.php", { params: { accion: 3 } })
  //   .then((res) => {
  //     lst_conceptos.value = res.data;
  //   });
  lst_conceptos.value=await getReporteCargoPagoConceptosService()
}

async function buscar() {
  let numero_accion = 0;
  let clasificacion = 0;
  let fecha_inicio =
    _.isNull(date.value) || _.isUndefined(date.value)
      ? null
      : date.value.concat(" 00:00:00");
  let fecha_fin =
    _.isNull(date2.value) || _.isUndefined(date2.value)
      ? null
      : date2.value.concat(" 23:59:00");
  let periodo =
    _.isNull(date3.value) || _.isUndefined(date3.value)
      ? null
      : dayjs(date3.value).format("MM-YYYY");

  let tripartida = /[ABC]/.exec(accion.value);

  if (Array.isArray(tripartida)) {
    numero_accion = accion.value.substr(0, tripartida.index);
    clasificacion = tripartida.reduce((reductor, value) => reductor[value], {
      A: 1,
      B: 2,
      C: 3,
    });
  } else numero_accion = isNaN(accion.value) ? 0 : accion.value;

  // axios
  //   .get("/reportePagoConceptoController.php", {
  //     params: {
  //       accion: 4,
  //       numero_accion,
  //       clasificacion,
  //       cve_cuota: concepto.value,
  //       periodo,
  //       fecha_inicio,
  //       fecha_fin,
  //     },
  //   })
    // .then((res) => {
      // lst_pagos.value = res.data;
    // });

    const data_send={numero_accion,
        clasificacion,
        cve_cuota: concepto.value,
        periodo,
        fecha_inicio,
        fecha_fin,}
    lst_pagos.value =await getReporteCargoPagoService(data_send)
}

function exportar() {
  let wb = XLSX.utils.book_new();
  wb.SheetNames.push("pagos");
  let ws_data1 = lst_pagos.value.map((item) => [
    item.accion,
    item.concepto,
    item.periodo,
    item.sociox,
    item.folio,
    parseFloat(item.monto_cargo),
    parseFloat(
      _.isNull(item.monto) || _.isUndefined(item.monto) ? 0 : item.monto
    ),
    _.isNull(item.folio)
      ? 0
      : _.round(
          parseFloat(
            item.monto_cargo -
              (_.isNull(item.monto) || _.isUndefined(item.monto)
                ? 0
                : item.monto)
          ),
          2
        ),
    _.isNull(item.folio)
      ? 0
      : _.round(
          parseFloat(
            ((item.monto_cargo -
              (_.isNull(item.monto) || _.isUndefined(item.monto)
                ? 0
                : item.monto)) /
              116) *
              100
          ),
          2
        ),
    _.isNull(item.folio)
      ? 0
      : _.round(
          parseFloat(
            ((item.monto_cargo -
              (_.isNull(item.monto) || _.isUndefined(item.monto)
                ? 0
                : item.monto)) /
              116) *
              100 *
              0.16
          ),
          2
        ),
    item.fecha_hora_cobro,
    item.cajerox,
  ]);

  let ws_data = _.concat(
    [
      [
        "Accion",
        "Concepto",
        "Periodo",
        "Usuario",
        "Folio",
        "Monto Cargo",
        "Descuento",
        "Total",
        "Subtotal",
        "Iva",
        "Fecha Pago",
        "Cajero(a)",
      ],
    ],
    ws_data1
  );

  console.log(ws_data);
  let ws = XLSX.utils.aoa_to_sheet(ws_data, { origin: "B2" });

  wb.Sheets["pagos"] = ws;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "test.xlsx"
  );
}
</script>

<style>
</style>
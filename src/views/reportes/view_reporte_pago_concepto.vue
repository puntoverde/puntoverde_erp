<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-5">
      <h1 class="accent--text oswald--text">Reporte de pagos</h1>
      <div>
        <v-btn color="primary mr-3" @click="buscar" v-if="!cValid" :loading="loading">
          <v-icon>mdi-magnify</v-icon>Buscar Pagos
        </v-btn>
        <v-btn
          color="primary mr-3"
          @click="exportarFactura"
          v-if="c_valid_fecha"
          :loading="loading_factura"
        >
          <v-icon>mdi-file-excel</v-icon>Exportar Facturas
        </v-btn>
        <v-btn
          color="primary mr-3"
          @click="exportar"
          v-if="lst_pagos.length > 0"
        >
          <v-icon>mdi-file-excel</v-icon>Exportar
        </v-btn>
        <v-btn color="error" @click="generar" v-if="lst_pagos.length > 0">
          <v-icon>mdi-file-pdf</v-icon>Generar
        </v-btn>
      </div>
    </div>
    <v-row>
      <v-col>
        <v-text-field
          label="Acciones"
          v-mask="accionMask"
          v-model="accion"
          clearable
          filled
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
          filled
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          label="Cajero(a)"
          v-model="cajero"
          :items="lst_cajero"
          item-value="cve_persona"
          item-text="cajero"
          clearable
          hide-details
          filled
        ></v-select>
      </v-col>
      <v-col>
        <v-menu
          ref="menu_ref_periodo"
          v-model="menu_periodo"
          :close-on-content-click="false"
          :return-value.sync="date_periodo"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="date_periodo"
              label="Periodo"
              prepend-inner-icon="mdi-calendar-month"
              readonly
              v-on="on"
              clearable
              filled
              @click:clear="date_periodo=undefined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date_periodo"
            type="month"
            locale="es-mx"
            no-title
            scrollable
            color="primary"
          >        
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu_periodo = false">cerrar</v-btn>
            <v-btn text color="primary" @click="$refs.menu_ref_periodo.save(date_periodo)"
              >aceptar</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-menu
          ref="menu_ref_fecha_inicio"
          v-model="menu_fecha_inicio"
          :close-on-content-click="false"
          :return-value.sync="date_fecha_inicio"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="date_fecha_inicio"
              label="Dia Inicio"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-on="on"
              clearable
              filled
               @click:clear="date_fecha_inicio=undefined"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date_fecha_inicio" no-title scrollable locale="es-mx">            
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu_fecha_inicio = false">cerrar</v-btn>
            <v-btn text color="primary" @click="$refs.menu_ref_fecha_inicio.save(date_fecha_inicio)"
              >aceptar</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-menu
          ref="menu_ref_fecha_fin"
          v-model="menu_fecha_fin"
          :close-on-content-click="false"
          :return-value.sync="date_fecha_fin"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              :value="date_fecha_fin"
              label="Dia Fin"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-on="on"
              clearable
              filled
              @click:clear="date_fecha_fin=undefined"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date_fecha_fin" :min="date_fecha_inicio" no-title scrollable locale="es-mx">            
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu_fecha_fin = false">Cerrar</v-btn>
            <v-btn text color="primary" @click="$refs.menu_ref_fecha_fin.save(date_fecha_fin)"
              >aceptar</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-data-table
      id="tablaDetalle"
      :headers="headersTablaDetalle"
      :items="lst_pagos"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :calculate-widths="true"
      class="table-pv rounded-xl elevation-5"
      item-key="cve_cargo"
      hide-default-footer
      :loading="loading"
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
            >pagina {{ pagination.page }} de {{ pagination.pageCount }}</span
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
        <div style="height:60px">
        <v-row justify="center">
          <v-col>
            <b>&nbsp;Cargo:</b>
            {{ numeral(cCargo).format("$0,0[.]00") }}
          </v-col>
          <v-col>
            <b>&nbsp;Subtotal:</b>
            {{ numeral(cSubtotal).format("$0,0[.]00") }}
          </v-col>
          <v-col>
            <b>IVA:</b>
            {{ numeral(cIva).format("$0,0[.]00") }}
          </v-col>
          <v-col>
            <b>Total:</b>
            {{ numeral(cTotal).format("$0,0[.]00") }}
          </v-col>
          <v-col>
            <b>Descuentos:</b>
            {{ numeral(cDescuento).format("$0,0[.]00") }}
          </v-col>
        </v-row>
        <v-divider class="mt-2"></v-divider>
        {{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:header>
        <tr>
          <th
            colspan="4"
            class="text-center red lighten-3"
            style="
              color: #263238 !important;
              border-bottom: 2px solid #b71c1c !important;
              border-top: 2px solid #b71c1c !important;
            "
          >
            Cargos
          </th>
          <th
            colspan="8"
            class="text-center teal lighten-3"
            style="
              color: #263238 !important;
              border-bottom: 2px solid #004d40 !important;
              border-top: 2px solid #004d40 !important;
            "
          >
            Pagos
          </th>
        </tr>
      </template>

      <template v-slot:item.descuento="{ item }">{{
        numeral(item.monto).format("$0,0[.]00")
      }}</template>
      <template v-slot:item.subtotal="{ item }">{{
        numeral(item.total - item.monto)
          .divide(116)
          .multiply(100)
          .format("$0,0.00")
      }}</template>
      <template v-slot:item.total2="{ item }">{{
        numeral(item.total - item.monto).format("$0,0[.]00")
      }}</template>
      <template v-slot:item.iva="{ item }">{{
        numeral(item.total - item.monto)
          .divide(116)
          .multiply(100)
          .multiply(0.16)
          .format("$0,0.00")
      }}</template>
      <template v-slot:item.total="{ item }">{{
        numeral(item.total).format("$0,0[.]00")
      }}</template>
      <template v-slot:item.fecha_hora_cobro="{ item }">{{
        dayjs(item.fecha_hora_cobro).format("DD [de] MMMM [de] YYYY HH:mm")
      }}</template>

      <template v-slot:item.sociox="{ item }">{{ item.sociox }}</template>

      <template v-slot:item.folio="{ item }">
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{ item.folio }}</label>
      </template>

      
    </v-data-table>
  </div>
</template>

<script setup>
import _ from "lodash";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import numeral from "numeral";
import dayjs from "dayjs";
import { computed, onMounted, ref, watch } from "vue";
import {getCajeroService,getConceptosService,getBuscarPagosService,getPagosExportarService} from '@/services/reporte_pagos_service'

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
const menu_fecha_inicio = ref(false);
const date_fecha_inicio = ref(undefined);
const menu_fecha_fin = ref(false);
const date_fecha_fin = ref(undefined);
const menu_periodo = ref(false);
const date_periodo = ref();
const cajero = ref(0);

const lst_cajero = ref([]);
const lst_conceptos = ref([]);
const lst_pagos = ref([]);

const headersTablaDetalle = [
  { text: "Accion", value: "accion" },
  { text: "Cargo", value: "concepto" },
  { text: "Periodo", value: "periodo" },
  { text: "Nombre usuario", value: "sociox" },

  { text: "Folio", value: "folio" },
  { text: "Monto Total del cargo", value: "total" },
  { text: "Descuento", value: "descuento" },
  { text: "Subtotal", value: "subtotal" },
  { text: "IVA", value: "iva" },
  { text: "Total", value: "total2" },

  { text: "Fecha pago", value: "fecha_hora_cobro" },
  { text: "Cajero en turno", value: "cajerox" },
];

const loading = ref(false);
const loading_factura = ref(false);

const page = ref(1);
const itemsPerPage = ref(10);

const cCargo = computed(() => lst_pagos.value.map(i => numeral(i.total).value()??0).reduce((reductor, value) => reductor + value, 0));

const cSubtotal = computed(() => (cTotal.value / 116) * 100);

const cIva = computed(() => (cTotal.value / 116) * 100 * 0.16);

const cTotal = computed(() => lst_pagos.value.map((item) =>numeral(item.total??0).subtract(item.monto??0).value()).reduce((reductor, value) => reductor + value, 0));

const cDescuento = computed(() => lst_pagos.value.map((item) => numeral(item.monto).value()??0).reduce((reductor, value) => reductor + value, 0));

const cValid = computed(() =>(!Boolean(accion.value) && !Boolean(concepto.value) && !Boolean(cajero.value) && !Boolean(date_periodo.value) && !Boolean(date_fecha_inicio.value) && !Boolean(date_fecha_fin.value)));

const c_valid_fecha = computed(() => (Boolean(date_fecha_inicio.value) && Boolean(date_fecha_fin.value)));

watch(cValid, (val) => {
  if (val) lst_pagos.value = [];
});

onMounted(() => {
  getConceptos();
  getCajero();
});

async function getCajero() {
  const data=await getCajeroService();
  lst_cajero.value = data.map(i => ({cve_persona: i.cve_persona,cajero: `${i.nombre} ${i.apellido_paterno} ${i.apellido_materno}`}))
}

async function getConceptos() {
  const data=await getConceptosService();
  lst_conceptos.value = data; 
}

async function buscar() {
   loading.value=true
  try{
  let numero_accion = 0;
  let clasificacion = 0;
  let fecha_inicio =!Boolean(date_fecha_inicio.value)? null: date_fecha_inicio.value.concat(" 00:00:00");
  let fecha_fin =!Boolean(date_fecha_fin.value)? null: date_fecha_fin.value.concat(" 23:59:00");
  let periodo =!Boolean(date_periodo.value)? null: dayjs(date_periodo.value).format("MM-YYYY");

  let tripartida = /[ABC]/.exec(accion.value);

  if (Array.isArray(tripartida)) {
    numero_accion = accion.value.substr(0, tripartida.index);
    clasificacion = tripartida.reduce((reductor, value) => reductor[value], {
      A: 1,
      B: 2,
      C: 3,
    });
  } else numero_accion = isNaN(accion.value) ? 0 : accion.value;

  const {conceptos}=await getBuscarPagosService(numero_accion,clasificacion,concepto.value,cajero.value,periodo,fecha_inicio,fecha_fin)
  lst_pagos.value=conceptos
  }
  catch(e)
  {}
  finally{
    loading.value=false
  }
}

function exportar() {
  let wb = XLSX.utils.book_new();
  wb.SheetNames.push("pagos");
  let ws_data1 = lst_pagos.value.map((item) => [
    item.accion,
    item.folio,
    item.folio_compaq,
    item.rfc,
    item.concepto,
    item.periodo,
    item.sociox,
    parseFloat(item.total),
    parseFloat(
      _.isNull(item.monto) || _.isUndefined(item.monto) ? 0 : item.monto
    ),
    _.round(parseFloat(((item.total - item.monto) / 116) * 100), 2),
    _.round(parseFloat(((item.total - item.monto) / 116) * 100 * 0.16), 2),
    _.round(parseFloat(item.total - item.monto), 2),
    item.fecha_hora_cobro,
    item.cajerox,
  ]);

  let ws_data = _.concat(
    [
      [
        "Accion",
        "Folio",
        "Folio Compac",
        "RFC",
        "Concepto",
        "Periodo",
        "Usuario",
        "Cargo",
        "Descuento",
        "Subtotal",
        "Iva",
        "Total",
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

async function exportarFactura() {
  let fecha_inicio =!Boolean(date_fecha_inicio.value)? null: date_fecha_inicio.value.concat(" 00:00:00");
  let fecha_fin =!Boolean(date_fecha_fin.value)? null: date_fecha_fin.value.concat(" 23:59:00");

  loading_factura.value = true;
  const data=await getPagosExportarService(fecha_inicio, fecha_fin)
  loading_factura.value = false;

  let wb = XLSX.utils.book_new();
  wb.SheetNames.push("Documentos");
  wb.SheetNames.push("Movimientos");
  wb.SheetNames.push("Cliente");

  let body_documentos = _.uniqBy(data, "folio").map((item) => [
    item.folio,
    "",
    "",
    item.total,
    numeral(item.descuento).format("0[.]00"),
    "",
    "",
    //item.periodo,
    item.cve_cuota,
    "I",
    dayjs(item.fecha_hora_cobro).format("DD/MM/YYYY"),
    item.acciones,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    1, //que es l clave de PUE pago en una sola exibicion
    parseInt(item.forma_pago.split(",")[0]),
    item.uso_cfdi,
  ]);

  let data_documentos = _.concat(
    [
      [
        "Folio",
        "NumMoneda",
        "TipoCambio",
        "Importe",
        "Descuento1",
        "Descuento2",
        "SistemaOrigen",
        "CodConcepto",
        "Serie",
        "Fecha",
        "CodigoCte",
        "IdCodigoCliente",
        "CodigoAgenteVendedor",
        "IdAgente",
        "aReferencia",
        "cObservaciones",
        "Afecta",
        "Gasto1",
        "Gasto2",
        "Gasto3",
        "TipoPago",
        "FormaPago",
        "UsoCFDI",
      ],
    ],
    body_documentos
  );

  let ws_documentos = XLSX.utils.aoa_to_sheet(data_documentos, {
    origin: "A1",
  });

  wb.Sheets["Documentos"] = ws_documentos;

  let body_movimientos = data.map((item) => [
    item.folio,
    "E48",
    item.cantidad,
    item.cve_cuota,
    item.total,
    "",
    item.concepto,
    3,
    1,
    "",
    "",
    "",
    16,
    "",
    numeral(item.descuento).format("0[.]00"),
  ]);

  let data_movimientos = _.concat(
    [
      [
        "FolioDoc",
        "UnidadBase",
        "Unidades",
        "CodProductoServicio",
        "Precio",
        "Costo",
        "DescripcionProductoServicio",
        "TipoProducto",
        "CodAlmacen",
        "Referencia",
        "Clasificacion",
        "IdProductoServicio",
        "Impuesto",
        "CobservaMov",
        "MovDescuento",
      ],
    ],
    body_movimientos
  );

  let ws_movimientos = XLSX.utils.aoa_to_sheet(data_movimientos, {
    origin: "A1",
  });

  wb.Sheets["Movimientos"] = ws_movimientos;

  let body_clientes = _.uniqBy(data, "folio").map((item) => [
    item.folio,
    item.razon_social,
    item.rfc,
    item.calle,
    item.num_ext,
    item.num_int,
    item.colonia,
    item.cp,
    item.municipio,
    item.estado,
    item.pais,
  ]);

  let data_clientes = _.concat(
    [
      [
        "FolioCli",
        "cRazonSocial",
        "cRFC",
        "cNombreCalle",
        "cNumeroExterior",
        "cNumeroInterior",
        "cColonia",
        "cCodigoPostal",
        "cCiudad",
        "cEstado",
        "cPais",
      ],
    ],
    body_clientes
  );

  let ws_clientes = XLSX.utils.aoa_to_sheet(data_clientes, {
    origin: "A1",
  });

  wb.Sheets["Cliente"] = ws_clientes;

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

function generar() {
  const pdf = new jsPDF({ orientation: "landscape" });

  let cajero_selected = lst_cajero.value.find(
    (item) => item.cve_persona == cajero.value
  );
  let cajeroText = _.isUndefined(cajero_selected)
    ? ""
    : `, Cajero(a): ${cajero_selected.cajero}`;

  pdf.text("Reporte de Corte Caja", 150, 10, null, null, "center");
  pdf.setFontSize(10);
  pdf.text(
    `Perido del ${dayjs(date_fecha_inicio.value).format("DD/MM/YYYY")} al ${dayjs(
      date_fecha_inicio.value
    ).format("DD/MM/YYYY")} ${cajeroText}`,
    150,
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
    bodyStyles: { fontSize: 8, overflow: "ellipsize" },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      //total: { fillColor: [115, 115, 115], textColor: [255, 255, 255] }
    },
    showHead: "firstPage",
    showFoot: "lastPage",
    columns: [
      { header: "Folio", dataKey: "folio" }, //
      { header: "Cargo", dataKey: "concepto" },
      { header: "Periodo", dataKey: "periodo" },
      { header: "Importe", dataKey: "importe" },
      { header: "Descuento", dataKey: "monto" },
      { header: "Total", dataKey: "total" },
      { header: "Subtotal", dataKey: "subtotal" },
      { header: "Iva", dataKey: "iva" },
      { header: "Accion", dataKey: "accion" },
      { header: "Nombre", dataKey: "sociox" },
      { header: "Fecha Cobro", dataKey: "fecha_hora_cobro" },
      { header: "Cobro", dataKey: "cajerox" },
    ],
    body: lst_pagos.value
      .sort((a, b) => a.periodo > b.periodo)
      .map((item) => ({
        folio: item.folio,
        concepto: item.concepto,
        periodo: item.periodo,

        importe: numeral(parseFloat(item.total)).format("0,0[.]00"),

        monto: numeral(
          parseFloat(
            _.isNull(item.monto) || _.isUndefined(item.monto) ? 0 : item.monto
          )
        ).format("0,0[.]00"),

        total: numeral(_.round(parseFloat(item.total - item.monto), 2)).format(
          "0,0[.]00"
        ),

        subtotal: numeral(
          _.round(parseFloat(((item.total - item.monto) / 116) * 100), 2)
        ).format("0,0[.]00"),
        iva: numeral(
          _.round(parseFloat(((item.total - item.monto) / 116) * 100 * 0.16), 2)
        ).format("0,0[.]00"),
        accion: item.accion,
        sociox: item.sociox,

        fecha_hora_cobro: dayjs(item.fecha_hora_cobro).format("DD/MM/YYYY"),
        cajerox: item.cajerox,
      })),
    foot: [
      {
        total: numeral(
          lst_pagos.value
            .map(
              (item) =>
                parseFloat(item.total * item.cantidad) -
                parseFloat(_.isNull(item.monto) ? 0 : item.monto)
            )
            .reduce((red, val) => red + parseFloat(val), 0)
        ).format("0,0[.]00"),
        subtotal: numeral(
          lst_pagos.value
            .map((item) => item.subtotal)
            .reduce((red, val) => red + parseFloat(val), 0)
        ).format("0,0[.]00"),
      },
    ],
  });

  pdf.save("reporte_pagos.pdf");
}
</script>
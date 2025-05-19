<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Reporte de Descuentos
        <div style="width:250px">
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
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu_ref.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </div>
        <div style="width:250px">
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
                label="Picker in menu"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date2" :min="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu2 = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu2_ref.save(date2)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </div>

        <v-btn color="primary" @click="buscar">
          <v-icon>mdi-magnify</v-icon>Buscar Pagos
        </v-btn>
        <v-btn color="primary" @click="exportar">
          <v-icon>mdi-file-excel</v-icon>Exportar
        </v-btn>
      </v-card-title>
    </v-card>

    <v-data-table
      id="tablaDetalle"
      :headers="headersTablaDetalle"
      :items="lst_pagos"
      :items-per-page="10"
      :calculate-widths="true"
      class="elevation-2 mt-5"
      item-key="cve_cargo"
    >
      <template v-slot:header>
        <tr>
          <th colspan="5" class="text-center red lighten-2">Cargos</th>
          <th colspan="3" class="text-center amber lighten-2">Descuentos</th>
          <th colspan="5" class="text-center green accent-2">Pagos</th>
        </tr>
      </template>

      <template v-slot:item.descuento="{ item }">{{ numeral(item.descuento).format('$0,0.00')}}</template>
      <template v-slot:item.monto="{ item }">{{ numeral(item.monto).format('$0,0.00')}}</template>
      <template v-slot:item.cargo="{ item }">{{ numeral(item.cargo).format('$0,0.00')}}</template>
      <template v-slot:item.total="{ item }">{{ numeral(item.total).format('$0,0.00')}}</template>
      <template
        v-slot:item.fecha_hora_cobro="{ item }"
      >{{ dayjs(item.fecha_hora_cobro).format("DD/MM/YYYY hh:mm:ss")}}</template>

      <!-- <template v-slot:item.sociox="{item}">{{item.sociox}}</template> -->

      <template v-slot:item.folio="{ item }">
        <label v-if="item.folio === null">N/A</label>
        <label v-else>{{item.folio}}</label>
      </template>

      <template v-slot:footer>
        <v-row justify="center">
          <v-col>
            <b>&nbsp;Subtotal:</b>
            {{numeral(cSubtotal).format('$0,0.00')}}
          </v-col>
          <v-col>
            <b>IVA:</b>
            {{ numeral(cIva).format('$0,0.00')}}
          </v-col>
          <v-col>
            <b>Total:</b>
            {{ numeral(cTotal).format('$0,0.00')}}
          </v-col>
          <v-col>
            <b>Descuentos:</b>
            {{ numeral(cDescuento).format('$0,0.00')}}
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref,computed, onMounted } from 'vue';

import _ from "lodash";
import numeral from 'numeral'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import dayjs from 'dayjs'
import {getConceptosService,getReportePagosDescuentoConcentradoService} from '@/services/reporte_pagos_service'


 const accionMask= {
        mask: "FFFFF",
        tokens: {
          F: {
            pattern: /[0-9a-zA-Z]/,
            transform(v) {
              return v.toLocaleUpperCase();
            }
          }
        }
      }
      const accion=ref("")
      const concepto=ref(0)
      const menu=ref(false)
      const menu_ref=ref(null)
      const date=ref(new Date().toISOString().substr(0, 10))
      const menu2=ref(false)
      const menu2_ref=ref(null)
      const date2=ref(new Date().toISOString().substr(0, 10))  
      const lst_conceptos=ref([])
      const lst_pagos=ref([])
      const headersTablaDetalle=[
        { text: "Periodo", value: "periodo" },
        { text: "Concepto", value: "concepto" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Monto", value: "cargo" },
        { text: "Nombre", value: "usuario" },

        { text: "Monto Descuento", value: "monto" },
        { text: "Desc Descuento", value: "descripcion" },
        { text: "Autoriza", value: "autorizo" },

        { text: "Folio", value: "folio" },
        { text: "Fecha Cobro", value: "fecha_hora_cobro" },
        { text: "Total Pago", value: "total" },
        { text: "Cajero(a)", value: "cajero" }
      ]


 const cSubtotal=computed(() =>{
      return lst_pagos.value
        .map(item => parseFloat(_.isNull(item.subtotal) ? 0 : item.subtotal))
        .reduce((reductor, value) => reductor + value, 0);
    })
   const cIva=computed(() =>{
      return lst_pagos.value
        .map(item => parseFloat(_.isNull(item.iva) ? 0 : item.iva))
        .reduce((reductor, value) => reductor + value, 0);
    })
    const cTotal=computed(() =>{
      return lst_pagos.value
        .map(item => parseFloat(_.isNull(item.total) ? 0 : item.total))
        .reduce((reductor, value) => reductor + value, 0);
    })
    const cDescuento=computed(()=> {
      return lst_pagos.value
        .map(item => parseFloat(_.isNull(item.descuento) ? 0 : item.descuento))
        .reduce((reductor, value) => reductor + value, 0);
    })

onMounted(()=>getConceptos())

     async function getConceptos() {
      // axios
      //   .get("/reportePagoConceptoController.php", { params: { accion: 3 } })
      //   .then(res => {
      //     lst_conceptos.value = res.data;
      //   });

     lst_conceptos.value=await getConceptosService()

    }


     async function buscar() {
      let fecha_inicio =
        _.isNull(date.value) || _.isUndefined(date.value)
          ? null
          : date.value.concat(" 00:00:00");
      let fecha_fin =
        _.isNull(date2.value) || _.isUndefined(date2.value)
          ? null
          : date2.value.concat(" 23:59:00");

      // axios
      //   .get("/reportePagoConceptoController.php", {
      //     params: {
      //       accion: 7,
      //       fecha_inicio,
      //       fecha_fin
      //     }
      //   })
      //   .then(res => {
      //     lst_pagos.value = res.data.conceptos;
      //   });
      const {conceptos}=await getReportePagosDescuentoConcentradoService(fecha_inicio,fecha_fin)
      lst_pagos.value=conceptos;
    }
     function exportar() {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("descuentos");
      let ws_data1 = lst_pagos.value.map(item => [
        item.periodo,
        item.concepto,
        item.cantidad,
        parseFloat(item.cargo),
        item.usuario,
        parseFloat(item.monto),
        item.descripcion,
        item.autorizo,
        item.folio,
        item.fecha_hora_cobro,
        parseFloat(item.total),
        item.cajero
      ]);
      
      let ws_data=_.concat([['Periodo','Concepto','Cantidad','Monto',
      'Nombre Usuario','Monto Descuento','Descripcion Descuento',
      'Autoriza Descuento','Folio','Fecha de Cobro','Total Pago','Cajero(a)']],ws_data1);

      console.log(ws_data)
      let ws = XLSX.utils.aoa_to_sheet(ws_data, {origin: "B2"});

      wb.Sheets["descuentos"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');

    }

</script>

<style>
</style>
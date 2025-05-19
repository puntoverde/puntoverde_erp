<template>
  <div>

    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Reporte de pagos ha detalle</h1>
    </div>

    <div class="d-flex justify-end mb-5">      
      <Search v-model="search" :filters="filters" @emit-buscar="buscar">
        <template v-slot:accion="{data}">
           <v-text-field label="Acciones" v-mask="accionMask" v-model="data.value" clearable hide-details filled></v-text-field>
        </template>
        <template v-slot:cajero="{data}">
          <v-select
              label="Cajero(a)"
              v-model="data.value"
              :items="lst_cajero"
              item-value="cve_persona"
              item-text="cajero"
              clearable
              hide-details
              filled
            ></v-select>
        </template>
        <template v-slot:fecha_inicio="{data}">
           <v-menu            
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="dayjs(data.value).isValid()?dayjs(data.value).format('DD-MMM-YYYY'):''"
                  label="Fecha Inicio"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  clearable
                  hide-details
                  filled
                  dense
                ></v-text-field>
              </template>
              <v-date-picker v-model="data.value" locale="es-mx" no-title @input="menu = false"/>                              
            </v-menu>
        </template>
        <template v-slot:fecha_fin="{data}">
           <v-menu            
              v-model="menu2"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="dayjs(data.value).isValid()?dayjs(data.value).format('DD-MMM-YYYY'):''"
                  label="Fecha Fin"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  clearable
                  hide-details
                  filled
                ></v-text-field>
              </template>
              <v-date-picker v-model="data.value" locale="es-mx" no-title @input="menu2 = false"/>                              
            </v-menu>
        </template>
      </Search>
    </div>


   

    <v-data-table 
      id="tablaDetalle"
      :headers="headersTablaDetalle"
      :items="lst_pagos"
      :calculate-widths="true"
      item-key="cve_cargo"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >

<template v-slot:top="{ pagination }">
        <div class="d-flex justify-space-between align-center">
           <div>

          <v-tooltip bottom>
            <template v-slot:activator={on}>
          <v-btn color="primary mr-3" fab elevation="1"  small v-on="on" @click="exportarFactura"  :loading="loading_factura">
            <!-- v-if="c_valid_fecha" -->
             <v-icon>mdi-file-excel</v-icon>
          </v-btn>
            </template>
            <label>Exportar Facturas</label>
          </v-tooltip>  

<v-tooltip bottom>
            <template v-slot:activator={on}>
          <v-btn color="primary mr-3" fab elevation="1" small v-on="on" @click="exportar" >
            <!-- v-if="lst_pagos.length>0" -->
            <v-icon>mdi-file-excel</v-icon>
          </v-btn>
          </template>
            <label>Exportar</label>
          </v-tooltip>

<v-tooltip bottom>
            <template v-slot:activator={on}>
          <v-btn color="error" fab elevation="1"  small v-on="on" @click="generar" >
            <!-- v-if="lst_pagos.length>0" -->
            <v-icon>mdi-file-pdf-box</v-icon>
          </v-btn>
          </template>
            <label>Exportar</label>
          </v-tooltip>
           </div>
<div class="d-flex align-center">
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
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div class="d-flex">
        <div class="mx-3">{{ props.pagination.itemsLength }} registro(s)</div>
         <div class="d-flex justify-space-between flex-grow-1 mr-5">
          <div>
            <b>&nbsp;Subtotal:</b>
            <b class="accent--text">&nbsp;{{numeral(cSubtotal).format('$0,0.[00]')}}</b>
          </div>
          <div>
            <b>IVA:</b>
            <b class="accent--text">&nbsp;{{ numeral(cIva).format('$0,0.[00]')}}</b>
          </div>
          <div>
            <b>Total:</b>
            <b class="accent--text">&nbsp;{{ numeral(cTotal).format('$0,0.[00]')}}</b>
          </div>
          <div>
            <b>Descuentos:</b>
            <b class="accent--text">&nbsp;{{ numeral(cDescuento).format('$0,0.[00]')}}</b>
          </div>
        </div>

        </div>
       
      </template>

      <template v-slot:item.subtotal="{ item }"><span class="font-weight-bold accent--text">{{  numeral(item.subtotal).divide(1.16).format('$0,0.[00]')}}</span></template>
      <template v-slot:item.total="{ item }"><span class="font-weight-bold accentx--text">{{ numeral(item.total).format('$0,0.[00]')}}</span></template>
      <template v-slot:item.iva="{ item }"><span class="font-weight-bold accent--text">{{ numeral(item.iva).format('$0,0.[00]')}}</span></template>
      <template v-slot:item.descuento="{ item }"><span class="font-weight-bold accent--text">{{ numeral(item.descuento).format('$0,0.[00]')}}</span></template>
      <template
        v-slot:item.fecha_hora_cobro="{ item }"
      >{{ dayjs(item.fecha_hora_cobro).format("DD-MMM-YYYY HH:mm")}}</template>

      

      <template v-slot:item.folio="{ item }">
        <label v-if="item.folio === null">N/A</label>
        <label v-else class="font-weight-bold secondary--text">{{item.folio}}</label>
      </template>
      <template v-slot:item.folio_compaq="{ value }">        
        <label class="font-weight-bold primary--text">{{value}}</label>
      </template>

      
    </v-data-table>
  </div>
</template>

<script setup>
import { ref,onMounted, computed, watch } from 'vue';
import _ from "lodash";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import numeral from "numeral";
import dayjs from 'dayjs'
import {getCajeroPagosDetalleService,getPagosDetalleService,getExportarPagosDetalleFacturaService} from '@/services/reporte_pagos_detalle_service'

     

      const accionMask= {
        mask: "#FFFFF",
        tokens: {
          F: {
            // pattern: /[0-9a-zA-Z]/,
            pattern: /[0-9a-cA-C]/,
            transform(v) {
              return v.toLocaleUpperCase();
            }
          },
          "#":{pattern: /\d/}
        }
      }
      const accion=ref('')
      const concepto=ref(0)
      const menu=ref(false)
      const date=ref(null)
      const menu2=ref(false)
      const date2=ref(null)
      const menu3=ref(false)
      const date3=ref(null)
      const cajero=ref(0)
      const lst_cajero=ref([])
      const lst_pagos=ref([])
      const headersTablaDetalle=[
        { text: "Accion", value: "accion",align:'center' },
        { text: "Folio", value: "folio",align:'center' },
        { text: "Folio Comercial", value: "folio_compaq",align:'right' },
        { text: "Total", value: "total",align:'right' },
        { text: "Sub-Total", value: "subtotal",align:'right' },
        { text: "IVA", value: "iva",align:'right' },
        { text: "Descuento", value: "descuento",align:'right' },
        { text: "Metodo Pago", value: "metodo_pago" },
        { text: "USO CFDI", value: "uso_cfdi" },        
        { text: "Forma Pago", value: "forma_pago" },
        { text: "UUID", value: "uuid" },
        { text: "RFC", value: "rfc" },
        { text: "Correo", value: "correo" },        
        { text: "Cobro", value: "cobra" },
        { text: "Fecha", value: "fecha_hora_cobro",width:"170px" }
      ]
      const loading_factura=ref(false)
      const search=ref()


const page = ref(1);
const itemsPerPage = ref(10);

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

const filters = ref([
  { label: "Accion", key: "accion", value: "", },
  { label: "Cajero(a)", key: "cajero", value: "" },
  { label: "Fecha Inicio", key: "fecha_inicio", value: "" },
  { label: "Fecha Fin", key: "fecha_fin", value: ""},
]);

      

      const cCargo=computed(()=> {
      return lst_pagos.value
        .map(item => parseFloat(_.isNull(item.total) ? 0 : item.total))
        .reduce((reductor, value) => reductor + value, 0);
    })
    const cSubtotal=computed(()=> {
       return (cTotal.value / 116) * 100;
    })
    const cIva=computed(()=> {
      return (cTotal.value / 116) * 100 * 0.16;
    })
    const cTotal=computed(()=> {
      return lst_pagos.value
        .map(item =>
          parseFloat(
              item.total
          )
        )
        .reduce((reductor, value) => reductor + value, 0);
    })
    const cDescuento=computed(()=> {
      return lst_pagos.value
        .map(item => parseFloat(_.isNull(item.monto) ? 0 : item.monto))
        .reduce((reductor, value) => reductor + value, 0);
    })
    const cValid=computed(()=> {
      return (
        (_.isNull(accion.value) ||
          _.isUndefined(accion.value) ||
          accion.value == "") &&
        (_.isNull(concepto.value) ||
          _.isUndefined(concepto.value) ||
          concepto.value == 0) &&
        (_.isNull(cajero.value) ||
          _.isUndefined(cajero.value) ||
          cajero.value == 0) &&
        (_.isNull(date3.value) ||
          _.isUndefined(date3.value) ||
          date3.value == "") &&
        (_.isNull(date.value) || _.isUndefined(date.value) || date.value == "") &&
        (_.isNull(date2.value) || _.isUndefined(date2.value) || date2.value == "")
      );
    })
    const c_valid_fecha=computed(()=>{ return !(_.isNull(date.value) || _.isUndefined(date.value) || date.value == "") && !(_.isNull(date2.value) || _.isUndefined(date2.value) || date2.value == "")})

   
   watch(cValid,(val) =>{
      if (val) lst_pagos.value = [];
    })

      onMounted(()=>{getCajero()})


     async  function getCajero() {
      // root.$axiosFinanzas
      //   .get("/reporte-pago-detalle/cajera")
      //   .then(res => {
      //     lst_cajero.value = res.data.map(item => {
      //       return {
      //         cve_persona: item.cve_persona,
      //         cajero: `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`
      //       };
      //     });
      //   });

    const data=await getCajeroPagosDetalleService()
     lst_cajero.value = data.map(item => ({cve_persona: item.cve_persona,cajero: `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}));

    }
    
    async function buscar(options={}) {
      let numero_accion = 0;
      let clasificacion = 0;                     

      let tripartida = /[ABC]/.exec(options.accion);

      if (Array.isArray(tripartida)) {
        numero_accion = options.accion.substr(0, tripartida.index);
        clasificacion = tripartida.reduce(
          (reductor, value) => reductor[value],
          { A: 1, B: 2, C: 3 }
        );
      } else numero_accion = isNaN(options.accion) ? 0 : options.accion;

      delete options.accion
      if(numero_accion>0)
      {
        options.numero_accion=numero_accion
        options.clasificacion=clasificacion
      }

      // root.$axiosFinanzas
      //   .get("/reporte-pago-detalle", {params:options})
      //   .then(res => {
      //     lst_pagos.value = res.data;
      //   });
const data=await getPagosDetalleService(options)

    lst_pagos.value=data 


    }

    function exportar() {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("pagos");
      let ws_data1 = lst_pagos.value.map(item => [
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
        item.cajerox
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
            "Cajero(a)"
          ]
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

      let fecha_inicio =
        _.isNull(date.value) || _.isUndefined(date.value)
          ? null
          : date.value.concat(" 00:00:00");
      let fecha_fin =
        _.isNull(date2.value) || _.isUndefined(date2.value)
          ? null
          : date2.value.concat(" 23:59:00");

      loading_factura.value=true;
      // let {data}=await root.$axiosFinanzas.get("/reporte-pago-detalle",{params:{fecha_inicio,fecha_fin}})
      const data=await getExportarPagosDetalleFacturaService(fecha_inicio,fecha_fin)


      loading_factura.value=false;

      
      
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("Documentos");
      wb.SheetNames.push("Movimientos");
      wb.SheetNames.push("Cliente");



      let body_documentos= _.uniqBy(data,'folio').map(item => [
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
        item.uso_cfdi
      ])

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
            "UsoCFDI"
          ]
        ],
        body_documentos
      );

      let ws_documentos = XLSX.utils.aoa_to_sheet(data_documentos, {
        origin: "A1"
      });

      wb.Sheets["Documentos"] = ws_documentos;

      let body_movimientos = data.map(item => [
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
        numeral(item.descuento).format("0[.]00")
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
            "MovDescuento"
          ]
        ],
        body_movimientos
      );

      let ws_movimientos = XLSX.utils.aoa_to_sheet(data_movimientos, {
        origin: "A1"
      });

      wb.Sheets["Movimientos"] = ws_movimientos;


      let body_clientes = _.uniqBy(data,'folio').map(item=>[
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
        item.pais
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
            "cPais"
          ]
        ],
        body_clientes
      );

      let ws_clientes = XLSX.utils.aoa_to_sheet(data_clientes, {
        origin: "A1"
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
      const pdf = new jsPDF({orientation: 'landscape'});

      let cajero_selected=lst_cajero.find(item=>item.cve_persona==cajero.value);
      let cajeroText= _.isUndefined(cajero_selected)?'':`, Cajero(a): ${cajero_selected.cajero}`;

      pdf.text("Reporte de Corte Caja", 150, 10, null, null, "center");
      pdf.setFontSize(10);
      pdf.text(
        `Perido del ${dayjs(date.value).format(
          "DD/MM/YYYY"
        )} al ${dayjs(date.value).format("DD/MM/YYYY")} ${cajeroText}`,
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
        showHead:'firstPage',
        showFoot:'lastPage',
        columns: [
          { header: "Folio", dataKey: "folio" },//
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
          { header: "Cobro", dataKey: "cajerox" }
        ],
        body: lst_pagos.value.sort((a,b)=>a.periodo>b.periodo).map(item => ({
          folio:item.folio,
          concepto: item.concepto,
          periodo: item.periodo,


         
          importe:numeral(parseFloat(item.total)).format('0,0[.]00'),
          
          monto:numeral(parseFloat(_.isNull(item.monto)|| _.isUndefined(item.monto)?0:item.monto)).format('0,0[.]00'),
          
          total: numeral(
            _.round(parseFloat(item.total - item.monto), 2)
          ).format("0,0[.]00"),

          subtotal: numeral(
            _.round(parseFloat(((item.total - item.monto) / 116) * 100), 2)
          ).format("0,0[.]00"),
          iva:numeral(_.round(parseFloat(((item.total-item.monto)/116*100)*.16),2)).format('0,0[.]00'),
           accion: item.accion,
          sociox: item.sociox,
          
          fecha_hora_cobro: dayjs(item.fecha_hora_cobro).format(
            "DD/MM/YYYY"
          ),
          cajerox: item.cajerox
        })),
        foot: [
          {
            total: numeral(
              lst_pagos.value
                .map(
                  item =>
                    parseFloat(item.total * item.cantidad) -
                    parseFloat(_.isNull(item.monto) ? 0 : item.monto)
                )
                //  .map(item =>  parseFloat(_.isNull(item.monto)?0:item.monto))
                .reduce((red, val) => red + parseFloat(val), 0)
            ).format("0,0[.]00"),
            subtotal: numeral(
              lst_pagos.value
                .map(item => item.subtotal)
                .reduce((red, val) => red + parseFloat(val), 0)
            ).format("0,0[.]00")
          
          }
        ]
      });

   

      pdf.save("reporte_pagos.pdf");
    }
  
</script>

<style>
</style>
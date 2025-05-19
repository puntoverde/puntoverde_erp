<template>
  <div>
    <div class="d-flex justify-space-between align-end mb-5 redx">



      <h1 class="accent--text oswald--text">Reporte produto requisicion cuadricula</h1>



      <div class="d-flex" style="column-gap: 10px;">

        <v-select v-model="categoria" label="categoria" :items="lst_categorias" item-value="id_categoria_pv"
          item-text="nombre" hide-details filled @change="SubcategoriaProducto"></v-select>
        <v-select v-model="subcategoria" label="subcategoria" :items="lst_subcategorias"
          item-value="id_subcategoria_producto_pv" item-text="nombre" hide-details filled></v-select>

        <v-select v-model="annio" label="año" :items="annios" hide-details filled></v-select>

        <v-btn x-large color="primary" @click="reporteProductoRequisicion"> <v-icon size="30">mdi-magnify</v-icon></v-btn>

      </div>

    </div>

    <div class="grid-content elevation-5">

      <div style="
      width: 100%;
      grid-column-start: line-star;
      grid-column-end: line-mes 12;
      justify-self: center;
      align-self: center;
      padding:10px 0;
      font-size: 1.8em;
      border-bottom:1px solid;
      text-align: center;
      ">
        Compras del año {{ annio }}
      </div>

      <div class="header-div-producto">producto</div>
      <div class="header-div">enero</div>
      <div class="header-div">febrero</div>
      <div class="header-div">marzo</div>
      <div class="header-div">abril</div>
      <div class="header-div">mayo</div>
      <div class="header-div">junio</div>
      <div class="header-div">julio</div>
      <div class="header-div">agosto</div>
      <div class="header-div">septiembre</div>
      <div class="header-div">octubre</div>
      <div class="header-div">noviembre</div>
      <div class="header-div">diciembre</div>

      <template v-for="item in lst_productos_name">

        <div class="div-data-producto" @click="openDetalle(item.id_producto_pv)"
          v-ripple="{ center: true, class: 'red--text' }">
          <v-icon color="white">mdi-information</v-icon>
          <span>{{ item.nombre }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.ene?.veces_comprado">#{{item.ene?.veces_comprado}}</span><span>{{ numeral(item.ene?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.feb?.veces_comprado">#{{item.feb?.veces_comprado}}</span><span>{{ numeral(item.feb?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.mar?.veces_comprado">#{{item.mar?.veces_comprado}}</span><span>{{ numeral(item.mar?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.abr?.veces_comprado">#{{item.abr?.veces_comprado}}</span><span>{{ numeral(item.abr?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.may?.veces_comprado">#{{item.may?.veces_comprado}}</span><span>{{ numeral(item.may?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.jun?.veces_comprado">#{{item.jun?.veces_comprado}}</span><span>{{ numeral(item.jun?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.jul?.veces_comprado">#{{item.jul?.veces_comprado}}</span><span>{{ numeral(item.jul?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.ago?.veces_comprado">#{{item.ago?.veces_comprado}}</span><span>{{ numeral(item.ago?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.sep?.veces_comprado">#{{item.sep?.veces_comprado}}</span><span>{{ numeral(item.sep?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.oct?.veces_comprado">#{{item.oct?.veces_comprado}}</span><span>{{ numeral(item.oct?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.nov?.veces_comprado">#{{item.nov?.veces_comprado}}</span><span>{{ numeral(item.nov?.promedio).format('$0,0[.]00') }}</span>
        </div>
        <div class="div-data" style="--bg:white;--text:#424242"><span v-if="item.dic?.veces_comprado">#{{item.dic?.veces_comprado}}</span><span>{{ numeral(item.dic?.promedio).format('$0,0[.]00') }}</span>
        </div>

      </template>



    </div>


    <v-dialog v-model="dialog" width="80vw" scrollable>
      <v-card width="80vw" height="80vh">
        <v-toolbar color="secondary" dark elevation="0">
          <v-toolbar-title>Detalle costo producto</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="d-flex">
          <v-menu max-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="fecha_inicio?dayjs(fecha_inicio).format('DD [de] MMM [de] YYYY'):''" label="fecha inicio" v-on="on" v-bind="attrs" hide-details filled
                prepend-inner-icon="mdi-calendar"></v-text-field>
            </template>
            <v-date-picker v-model="fecha_inicio"></v-date-picker>
          </v-menu>
          <v-menu max-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="fecha_fin?dayjs(fecha_fin).format('DD [de] MMM [de] YYYY'):''" label="fecha fin" v-on="on" v-bind="attrs" hide-details filled
                prepend-inner-icon="mdi-calendar"></v-text-field>
            </template>
            <v-date-picker v-model="fecha_fin"></v-date-picker>
          </v-menu>
          <v-btn @click="detalleProducto" elevation="1" tile x-large style="height: 100%;"><v-icon>mdi-magnify</v-icon> Buscar</v-btn>
        </div>
        <v-card-text style="height: calc(100% - 64px);">

          <canvas id="myChart" role="img" style="width: 100%;height: 100%;"></canvas>
        </v-card-text>

      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { reporteProductoRequisicionCuadriculaService, reporteProductoRequisicionCuadriculaDetalleService } from '@/services/producto_service'
import { allCategoriaProducto, allSubCategoriaProducto } from '@/services/categoria_producto_service'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import concat from 'lodash/concat'
import numeral from 'numeral';
import Chart from "chart.js";
import dayjs from 'dayjs'

numeral.zeroFormat('');
numeral.nullFormat('');

const id_producto_selected=ref()

const categoria = ref()
const subcategoria = ref()
const annio = ref()

const fecha_inicio=ref()
const fecha_fin=ref()

const lst_requisicion_producto = ref([])

const headers = [
  { text: "Codigo producto", align: "center", sortable: true, value: "clave" },
  { text: "Producto", value: "nombre" },
  { text: "Categoria", value: "categoria" },
  { text: "Cantidad pedida", value: "cantidad_pedida" },
  { text: "Cantidad recibida", value: "cantidad_recibida" },

];

const search = ref("");

const lst_productos_name = ref([])
const lst_categorias = ref([])
const lst_subcategorias = ref([])

const dialog = ref(false)

const filters = ref([
  { label: "Fecha pedido inicio", key: "fecha_inicio", value: "", type: "date" },
  { label: "Fecha pedido fin", key: "fecha_fin", value: "", type: "date" },
  { label: "Categoria", key: "categoria", value: "", type: "select" },
]);

const annios = Array.from({ length: 5 }, (_, index) => dayjs().year() - index)

let myChart=undefined;

onMounted(() => getCategoria())


async function reporteProductoRequisicion() {

  try {
    const { productos, meses } = await reporteProductoRequisicionCuadriculaService({
      annio: annio.value,
      categoria: categoria.value,
      subcategoria: subcategoria.value
    })

    lst_productos_name.value = productos.map(i => ({
      id_producto_pv: i.id_producto_pv,
      nombre: i.nombre,
      ene: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 1),
      feb: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 2),
      mar: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 3),
      abr: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 4),
      may: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 5),
      jun: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 6),
      jul: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 7),
      ago: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 8),
      sep: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 9),
      oct: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 10),
      nov: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 11),
      dic: meses.find(j => j.id_producto_pv == i.id_producto_pv && j.mes == 12),
    }))

  } catch (error) {
    console.log(error)
  }
}

async function getCategoria() {
  try {
    lst_categorias.value = await allCategoriaProducto()
  } catch (error) {

  }
}

async function SubcategoriaProducto() {
  try {
    lst_subcategorias.value = await allSubCategoriaProducto(categoria.value)
  } catch (error) {

  }
}

function openDetalle(id_producto){
  id_producto_selected.value=id_producto
  dialog.value=true
}

async function detalleProducto() {
 
  if(Boolean(myChart))
  {
    myChart.destroy()
  }

  const data = await reporteProductoRequisicionCuadriculaDetalleService({ id_producto:id_producto_selected.value, fecha_inicio:fecha_inicio.value, fecha_fin:fecha_fin.value }) 

  let ctx2 = document.getElementById("myChart");
  console.log(ctx2)

  myChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: data.map(i=>i.fecha_revision),
      datasets: [{
        label: 'costos',
        data: data.map(i=>i.costo),
        fill: false,
        backgroundColor: 'green',
        borderColor: 'green'
      }]
    },
    options: {
      scales: {
        xAxes: [{
        type: 'time',
        distribution: 'linear',
        time: {
          unit: 'month',
          // tooltipFormat: 'MMMM DD'
        }
      }],
      }
    }
  });

  // const chartDias2 = new Chart(ctx2, {
  //   // plugins: [ChartDataLabels],
  //   type: "line",
  //   data: {
  //     // labels: data.map(i => i.fecha_revision),
  //     labels: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
  //     datasets: [
  //       {
  //         label: "Precios compra",
  //         data: [{x:'enero',y:10},{x:'mayo',y:12}],
  //         backgroundColor: ['darkred', 'darkblue', 'yellow', 'fuchsia', 'purple'],
  //         fill:false
  //       }
  //     ]
  //     // datasets: [
  //     //   {
  //     //     label: "Precios compra",
  //     //     data: data.map(i => i.costo),
  //     //     backgroundColor: ['darkred', 'darkblue', 'yellow', 'fuchsia', 'purple']
  //     //   }
  //     // ]
  //   },

  //   options: {
  //     maintainAspectRatio: true,
  //     responsive: false,
  //   }
  // });


}

function exportar() {
  let wb = XLSX.utils.book_new();
  wb.SheetNames.push("reporte_entradas");
  let ws_data1 = lst_requisicion_producto.value.map(item => [
    item.folio,
    item.fecha_pedido,
    item.nombre_comercial,

    item.cambio == 1 ? `${item.tipo.split('|')[0] == 1 ? 'producto' : 'servicio'}|${item.tipo.split('|')[1] == 1 ? 'producto' : 'servicio'}` : item.tipo == 1 ? 'producto' : 'servicio',
    item.clave,

    item.producto_name,
    item.cantidad_solicitada,
    item.cantidad_entregada,
    item.categoria,
    item.subcategoria,
    item.costo,
    item.descuento,
    item.estatus_producto
  ]);

  let ws_data = concat([['Folio pedido', 'Fecha pedido', 'Proveedor', 'Tipo producto',
    'Clave', 'Producto', 'Cantidad solicitada', 'Cantidad ingresa', 'Categoria', 'Subcategoria', 'Costo', 'descuento', 'estatus']], ws_data1);



  console.log(ws_data)
  let ws = XLSX.utils.aoa_to_sheet(ws_data, { origin: "B2" });

  wb.Sheets["reporte_entradas"] = ws;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'reporte_entradas_amacen.xlsx');

}

function closeDialog()
{
  if(Boolean(myChart))
  {
    myChart.destroy()
  }

  dialog.value=false
}

</script>

<style>
.grid-content {
  background-color: #757575;
  width: 100%;
  display: grid;
  grid-template-columns: [line-star] 350px [line-end] repeat(12, 1fr [line-mes]);
  border-radius: 10px;
  color: white;
}

.grid-content div {
  padding: 8px;
}




.header-div {
  font-size: 1.1em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-div-producto {
  font-size: 1.8em;
  /* text-align: left; */
  display: flex;
  justify-content: start;
  align-items: center;
}

.div-data {
  background-color: var(--bg);  
  color: var(--text);
  font-weight: bold;
  display: flex;
  flex-direction: column;  
  justify-content: center;
  align-items: center;
}

.div-data-producto {
  display: flex;
  justify-content: start;
  align-items: center;
  column-gap: 5px;
}

.div-data-producto:hover {
  cursor: pointer;
}

.div-data:not(.div-data ~ .div-data) {
  border-top-left-radius: 50px !important;
}

.div-data:last-child {
  border-bottom-right-radius: 10px;
}
</style>

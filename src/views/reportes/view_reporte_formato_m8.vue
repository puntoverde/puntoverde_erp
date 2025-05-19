<template>
  <div>

    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text"> Reporte Formato M8</h1>
    </div>

 
        <div class="d-flex flex-wrap justify-center mb-5" style="column-gap: 10px; row-gap: 10px;">

          <v-card class="rounded-lg" v-for="tipo in lst_tipos_m8" style="width: 200px;">            
            <v-card-text class="d-flex flex-column align-center justify-space-around py-1">
              <h1 class="text-h3">{{ tipo.cantidad }}</h1>
              <span class="text-subtitle-1 font-weight-bold oswald--text text-truncate text-center" style="width: 100%;">{{ tipo.tipo }}</span>
            </v-card-text>
          </v-card>
        </div> 

    <div class="d-flex justify-space-between mb-5">
      <div>
        <v-btn color="secondary" class="mr-2" @click="generar">
          <v-icon class="mr-2">mdi-file-pdf-box</v-icon>
          Descargar
        </v-btn>
      </div>

      <Search v-model="search" :filters="filters" @emit-buscar="cargarTabla">

        <template v-slot:fecha_inicio="{ data }">
          <v-menu v-model="data.menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="dayjs(data.value).format('DD [de] MMM [del] YYYY')" prepend-inner-icon="mdi-calendar"
                readonly v-bind="attrs" v-on="on" filled hide-details></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="data.value" no-title @input="data.menu = false"></v-date-picker>
          </v-menu>
        </template>

        <template v-slot:fecha_fin="{ data }">
          <v-menu v-model="data.menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
            offset-y min-width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="dayjs(data.value).format('DD [de] MMM [del] YYYY')" prepend-inner-icon="mdi-calendar"
                readonly v-bind="attrs" v-on="on" filled hide-details></v-text-field>
            </template>
            <v-date-picker locale="es-mx" v-model="data.value" no-title @input="data.menu = false"></v-date-picker>
          </v-menu>
        </template>

      </Search>
    </div>

    <v-data-table :headers="headersTabla" :items="itemsTabla" :search="search" :page.sync="page"
      :items-per-page="itemsPerPage" class="table-pv rounded-xl elevation-5" hide-default-footer>
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
          <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
          <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>
      <template v-slot:item.acciones="{ item }">
        <v-tooltip>
          <template v-slot:activator="{ on, attrs }" bottom>
            <v-btn class="mr-2" color="primary" icon outlined v-on="on"
              @click="getJugadoresByAccion(item.id_equipo_futbol, item)">
              <v-icon> mdi-eye</v-icon></v-btn>
          </template>
          <span> Ver jugadores</span>
        </v-tooltip>
        <v-btn class="mr-2" color="primary" icon outlined @click="openDialogNew(item.id_equipo_futbol, item)">
          <v-icon> mdi-plus</v-icon>
        </v-btn>
        <v-btn color="primary" icon outlined @click="
          createCredencial(
            item.id_equipo_futbol,
            item.equipo,
            item.torneo,
            item.categoria
          )
          ">
          <v-icon> mdi-printer</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.socio="{ item }">
        {{ item.nombre }} <span class="font-weight-bold">{{ item.apellido_paterno }}</span> <span class="font-italic">{{
          item.apellido_materno }}</span>
      </template>
      <template v-slot:item.fecha_registro="{ value }">
        {{ dayjs(value).format('DD [de] MMM [del] YYYY') }}
      </template>

      <template v-slot:item.fecha_agrego="{ value }">
        {{ dayjs(value).format('DD [de] MMM [del] YYYY') }}
      </template>
      
      <template v-slot:item.observacion="{ item }">
        <span class="d-block">{{ item.observacion }}</span>
        <span v-if="item?.folio_pago_caja" class="text-subtitle-2 accent--text">folio caja:{{ item?.folio_pago_caja }}</span>
      </template>

      <template v-slot:item.archivo="{ value }">
        <v-btn v-if="value" icon @click="openFile(value)"> <v-icon>mdi-file</v-icon></v-btn>
      </template>

      <template v-slot:item.estatus="{ value }">
        <span class="font-weight-bold" v-if="value == 1">Revision</span>
        <span class="font-weight-bold" v-else-if="value == 2">Aceptado</span>
        <span class="font-weight-bold" v-else-if="value == 3">Rechazado</span>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog_imagen" width="500">
      <v-card width="500">
        <v-toolbar>
          <v-toolbar-title>imagen</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="downloadImagen"><v-icon>mdi-download</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-img :src="imagenFile" style="width: 100%;"></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReporteM8, getFileReporteM8 } from '@/services/reporte_formato_m8_service'
import { getTiposFormatoM8Service } from '@/services/formato_m8_service'
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
import jsPDF from "jspdf";
import "jspdf-autotable";
import _chunk from 'lodash/chunk'

dayjs.extend(toObject);

const headersTabla = [
  { text: "Acción", value: "accion" },
  { text: "Posicion", value: "posicion" },
  { text: "Socio", value: "socio" },
  { text: "Fecha", value: "fecha_registro" },
  { text: "Observacion", value: "observacion" },
  { text: "Fecha respuesta", value: "fecha_agrego" },
  { text: "Respuesta", value: "respuesta" },
  { text: "Tipo", value: "tipo" },
  { text: "Imagen", value: "archivo", align: "center" },
  { text: "Estatus", value: "estatus", align: "center" },
]
const itemsTabla = ref([])
const lst_tipos_m8 = ref([])

const search = ref('')

const filters = ref([
  { label: "Nombre", key: "nombre", value: "", type: 'text' },
  { label: "Fecha inicio", key: "fecha_inicio", value: "" },
  { label: "Fecha fin", key: "fecha_fin", value: "" },
]);
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

const page = ref(1);
const itemsPerPage = ref(10);

const imagenFile = ref()
const dialog_imagen = ref(false)



onMounted(async () => {
  cargarTabla()
})


async function cargarTabla(filtros = {}) {
  try {
    const data_m8 = await getReporteM8(filtros)
    itemsTabla.value = data_m8
    console.log(itemsTabla.value)
    const data_tipo = await getTiposFormatoM8Service()

    lst_tipos_m8.value = data_tipo.map(i => ({ ...i, cantidad: data_m8.filter(j => j.id_tipo_formato_m8 == i.id_tipo_formato_m8).length }))
  } catch (error) {
    console.log(error)
  }
}


function exportarExcel() {
  let wb = new XLSX.utils.book_new();
  wb.SheetNames.push("Datos Entrada Salida");
  let encabezado = headersTabla.map((i) => i.text);

  let datos = itemsTabla.value.map((i) => [
    i.accion,
    i.socio,
    i.nombre,
    i.fecha,
    i.entrada,
    i.salida,
  ]);

  let ws_data = [encabezado].concat(datos); //a row with 2 columns
  let ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Datos Entrada Salida"] = ws;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "test.xlsx"
  );
}

async function generar() {
  const pdf = new jsPDF();

  // let imagen = await import("@/assets/punto_verde2.png");
  const imagen = new URL('@/assets/punto_verde2.png', import.meta.url)

  console.log(imagen)
  // return 

  let img = new Image();
  img.src = imagen;

  let imagen_promise = await new Promise((resolve, reject) => {
    img.onload = function () {
      let canvas = document.createElement("CANVAS");
      let ctx = canvas.getContext("2d");
      let dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
  });

  pdf.addImage(imagen_promise, 5, 1, 25, 25);

  pdf.text("Reporte Formato M8", 100, 10, null, null, "center");
  pdf.setFontSize(10);
  // pdf.text(`Perido del ${this.date} al ${this.date2} ,  Cajero(a): ${this.lst_cajero.find(item=>item.cve_persona==this.cajero).cajero}`, 100, 15, null, null, "center");
  pdf.autoTable({
    theme: "grid",
    margin: { left: 5, right: 5, top: 30 },
    headStyles: { fillColor: [115, 115, 115], cellWidth: "wrap" },
    footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    columnStyles: {
      total: { fillColor: [115, 115, 115], textColor: [255, 255, 255] }
    },
    columns: [
      { header: "Accion", dataKey: "accion" },
      { header: "Posicion", dataKey: "posicion" },
      { header: "Socio", dataKey: "socio" },
      { header: "Fecha", dataKey: "fecha_registro" },
      { header: "Observacion", dataKey: "observacion" },
      { header: "Fecha respuesta", dataKey: "fecha_agrego" },
      { header: "Respuesta", dataKey: "respuesta" },
      { header: "Tipo", dataKey: "tipo" },
      { header: "Estatus", dataKey: "estatus" }
    ],
    body: itemsTabla.value.map(item => ({
      accion: 100,
      posicion: item.posicion,
      socio: `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,
      fecha_registro: item.fecha_registro,
      observacion: item.observacion,
      fecha_agrego: item.fecha_agrego,
      respuesta: item.respuesta,
      tipo: item.tipo,
      estatus: item.estatus == 1 ? 'Revision' : item.estatus == 2 ? 'Aceptado' : 'Rechazado',
    })),
  });

  pdf.save("reporte_fomato_m8.pdf");
}


async function openFile(file) {

  

  try {
    
    const data = await getFileReporteM8(file)
    console.log('file-blob:',data);
  
  if(['image/jpg','image/jpeg','image/png','image/svg'].some(i=>i===data.type))
  {
    imagenFile.value=await new Promise((resolve,reject)=>{
            const reader =new FileReader()
            reader.readAsDataURL(data)
            reader.onload=()=>{
              console.log(reader.result)
              resolve(reader.result)}
            reader.onerror=(e)=>reject(e)
        })
    dialog_imagen.value = true
  }
  else{
    saveAs(data,dayjs().format('YYYYMMDDHHmmss'))
  }
} catch (error) {
    alert('error no hay archivo...')
  }

  // window.open(window.URL.createObjectURL(data))
  // console.log("file--->",window.URL.createObjectURL(data))
}

function downloadImagen() {
  

 const [,mime] = imagenFile.value.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

 console.log(mime)
 console.log(typeof mime)

  var byteString = atob(imagenFile.value.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
  const blob = new Blob([ab], { type: 'image/png' });

  console.log(blob)

  saveAs(blob, `imagen-${dayjs().format('YYYYMMDDHHmmss')}`)
}
</script> 
<template>
  <div>
    <div class="d-flex justify-space-between mb-2">
      <v-btn @click="fnExportarExcel" rounded color="#0f783e" class="white--text"><v-icon
          color="white">mdi-file-excel</v-icon> Excel</v-btn>
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
</v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Reporte Libro Accionistas</h1>
    </div>



    <v-data-table :headers="headers" :items="lst_libros_acciones" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
      single-expand item-key="cve_accion" show-expand class="table-pv rounded-xl elevation-5" hide-default-footer
      @item-expanded="fnLoadHistorico">
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



      <template v-slot:item.nombre="{ item }">
        <span>{{ item.nombre }}</span>
        <span class="mx-1 font-weight-bold">{{ item.apellido_paterno }}</span>
        <span class="font-italic">{{ item.apellido_materno }}</span>
      </template>

      <template v-slot:item.tipo_accion_="{ value }">
        <span v-if="value == 'Familiar'" class="mx-1 font-weight-bold accent--text font-italic">{{ value }}</span>
        <span v-else>{{ value }}</span>
      </template>

      <template v-slot:item.fecha_adquisicion="{ value,item }">

        <v-menu offset-y v-model="item.menu" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-badge  color="" dark bottom borderedx left offset-y="10" offset-x="-2">
              <span @click="item.menu=true" v-bind="attrs" class="text-decoration-underline">{{ dayjs(value).format('DD MMM YYYY') }}</span>
              <template v-slot:badge>
                <v-icon color="secondary" size="15">mdi-pencil</v-icon>
              </template>
            </v-badge>
          </template>
          <v-date-picker v-model="item.fecha_adquisicion" @input="fnUpdateFecha(item)"></v-date-picker>
        </v-menu>


      </template>

      <template v-slot:item.fecha_alta="{ value ,item}">

        <v-menu offset-y v-model="item.menu2" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-badge  color="" dark bottom borderedx left offset-y="10" offset-x="-2">
              <span @click="item.menu2=true" v-bind="attrs" class="text-decoration-underline">{{ dayjs(value).format('DD MMM YYYY') }}</span>
              <template v-slot:badge>
                <v-icon color="secondary" size="15">mdi-pencil</v-icon>
              </template>
            </v-badge>
          </template>
          <v-date-picker v-model="item.fecha_alta" @input="fnUpdateFecha(item)"></v-date-picker>
        </v-menu>

        <!-- <v-badge color="" dark bottom borderedx left offset-y="10" offset-x="-2">
          <span class="text-decoration-underline">{{ dayjs(value).format('DD MMM YYYY') }}</span>
          <template v-slot:badge>
            <v-icon color="secondary" size="15">mdi-pencil</v-icon>
          </template>
        </v-badge> -->

      </template>

      <template v-slot:item.estatus="{ item }">

        <v-icon v-if="item.estatus == 1" color="success">mdi-check-circle</v-icon>
        <v-icon v-else-if="item.estatus == 2" color="warning">mdi-alert</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>

      <template v-slot:item.actions="{item,value}">
          <v-btn icon color="#0f783e" outlined small @click="fnExportarExcelHistorico(item.cve_accion)"><v-icon>mdi-file-excel</v-icon></v-btn>
      </template>



      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="grey lighten-2x">
          <div class="py-3">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th colspan="3" class="secondary lighten-4 text-center text-h6 white--text">
                      Dueño Anterior
                    </th>
                    <th colspan="3" class="primary lighten-1 text-center text-h6 white--text">
                      Dueño nuevo
                    </th>

                  </tr>
                  <tr>
                    <th class="secondaryx blue-grey lighten-5 text-center white--textx">Nombre</th>
                    <th class="blue-grey lighten-5 secondaryx lighten-4x text-center white--textx">Rfc</th>
                    <th class="blue-grey lighten-5 secondaryx lighten-4x text-center white--textx">Curp</th>
                    <th class="blue-grey lighten-5 primaryx lighten-1x text-center white--textx">Nombre</th>
                    <th class="blue-grey lighten-5 primaryx lighten-1x text-center white--textx">Rfc</th>
                    <th class="blue-grey lighten-5 primaryx lighten-1x text-center white--textx">Curp</th>
                    <!-- <th class="blue-grey lighten-5 primaryx lighten-1x text-center white--textx">Fecha</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item_ in lst_historico">
                    <td><span>{{ item_.nombre }}</span><span class="font-weight-bold mx-1">{{item_.apellido_paterno}}</span><span class="font-italic">{{ item_.apellido_materno }}</span></td>
                    <td>{{ item_.rfc }}</td>
                    <td>{{ item_.curp }}</td>
                    <td>{{ item_.nombre_actual }} <span class="font-weight-bold mx-1">{{item_.apellido_paterno_actual}}</span><span class="font-italic">{{ item_.apellido_materno_actual }}</span></td>
                    <td>{{ item_.rfc_actual }}</td>
                    <td>{{ item_.curp_actual }}</td>
                    <!-- <td>{{ item_.fecha_modificacion }}</td> -->
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </td>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import numeral from "numeral";
import { getLibroAccionistaService, getLibroAccionistaHistoricoService } from '@/services/accionistas_service'
import { updateFechasAccionService } from '@/services/acciones_service'
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from 'dayjs';

const root = getCurrentInstance().proxy;
const headers = ref([
  { text: "Accion", value: "no_accion" },
  { text: "Tipo Accion", align: "center", sortable: true, value: "tipo_accion_" },
  { text: "Dueño", value: "nombre" },
  { text: "Rfc", value: "rfc" },
  { text: "Curp", align: "right", value: "curp" },
  { text: "Fecha Adquisicion", align: "right", value: "fecha_adquisicion" },
  { text: "Fecha Alta", align: "right", value: "fecha_alta" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "xx", align: "center", value: "actions", sortable: false },
]);
const lst_libros_acciones = ref([]);
const search = ref("");

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
  { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
  { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);

const lst_historico = ref([])

onMounted(() => {
  fnGetLibroAccionista();
});

async function fnGetLibroAccionista() {
  const data=await getLibroAccionistaService();
  lst_libros_acciones.value = data.map(i=>({...i,menu:false,menu2:false}))
}

async function fnLoadHistorico({ item, value }) {

  if (value) {
    lst_historico.value = await getLibroAccionistaHistoricoService(item.cve_accion)
  }
  else {
    lst_historico.value = []
  }
}



function fnExportarExcel() {

  //tipo reporte 1.todo 2.grupos 3.tipo(socios,invitados,colaboradores)


  //crea el libro excel
  let wb = XLSX.utils.book_new();
  //crea la hoja para el libro de excel
  wb.SheetNames.push("reporte_libro_acciones");
  //se obtienen los datos a exportar 
  let ws_data1 = lst_libros_acciones.value.map(item => [
    item.no_accion,
    item.tipo_accion_,
    `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,
    item.rfc,
    item.curp,
    item.fecha_adquisicion,
    item.fecha_alta,
    item.estatus == 1 ? 'activo' : item.estatus == 2 ? 'bloqueado' : 'inactivo'

  ]);

  // console.log(ws_data1)



  let ws_data = [[
    'Accion',
    'Tipo Accion',
    'Dueño',
    'Rfc',
    'Curp',
    'Fecha Adquisicion',
    'Fecha Alta',
    'Estatus',
  ], ...ws_data1];

  // console.log(ws_data)
  let ws = XLSX.utils.aoa_to_sheet(ws_data, { origin: "B2" });

  wb.Sheets["reporte_libro_acciones"] = ws;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `reporte_libro_acciones_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);

}

function fnUpdateFecha(data_)
{
  console.log(data_)
  const {fecha_adquisicion,fecha_alta,cve_accion}=data_

  updateFechasAccionService(cve_accion,fecha_alta,fecha_adquisicion)
  data_.menu=false
  data_.menu2=false
}

async function fnExportarExcelHistorico(cve_accion)
{
const data=await getLibroAccionistaHistoricoService(cve_accion)

console.log("🚀 ~ data:", data);



  //crea el libro excel
  let wb = XLSX.utils.book_new();
  //crea la hoja para el libro de excel
  wb.SheetNames.push("reporte_libro_acciones_historio");
  //se obtienen los datos a exportar 
  let ws_data1 = data.map(item => [
    `${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`,
    item.rfc,
    item.curp,
    `${item.nombre_actual} ${item.apellido_paterno_actual} ${item.apellido_materno_actual}`,
    item.rfc_actual,
    item.curp_actual,
  ]);

  // console.log(ws_data1)



  let ws_data = [[
    'Dueño Anterior',
    'Dueño Anterior Rfc',
    'Dueño Anterior Curp',
    'Dueño Actual',
    'Dueño Actual Rfc',
    'Dueño Actual Curp',
  ], ...ws_data1];

  // console.log(ws_data)
  let ws = XLSX.utils.aoa_to_sheet(ws_data, { origin: "B2" });

  wb.Sheets["reporte_libro_acciones_historio"] = ws;

  let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    let view = new Uint8Array(buf); //create uint8array as viewer
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `reporte_libro_acciones_historio_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`);
}


</script>
<template>
  <div>

    <div class="d-flex justify-end">
    
      <h1 class="accent--text oswald--text"> Reporte Formato M8 por Accion</h1>
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
            <v-btn class="mr-2" icon outlined v-on="on" @click="fnVerDetalle(item.cve_accion)">
              <v-icon> mdi-eye</v-icon></v-btn>
          </template>
          <span> Ver detalle</span>
        </v-tooltip>

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

      <template v-slot:item.archivo="{ value }">
        <v-btn v-if="value" icon @click="openFile(value)"> <v-icon>mdi-file</v-icon></v-btn>
      </template>

      <template v-slot:item.estatus="{ value }">
        <span class="font-weight-bold" v-if="value == 1">Revision</span>
        <span class="font-weight-bold" v-else-if="value == 2">Aceptado</span>
        <span class="font-weight-bold" v-else-if="value == 3">Rechazado</span>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="650" scrollable>
      <v-card width="500">
        <v-toolbar>
          <v-toolbar-title>Detalle</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
     
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Documento</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detalle in lst_detalle">
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-subtitle-2 accent--text">{{ detalle.fecha_registro }}</span>
                      <span>
                        {{ detalle.observacion }}
                      </span>
                      <span v-if="detalle?.folio_pago_caja" class="text-subtitle-2 accent--text">Folio de pago:{{ detalle?.folio_pago_caja }}</span>
                    </div>
                  </td>
                  <td class="pa-2">

                    <Promised :promise="fnViewImagen(detalle.archivo)">
                      <template v-slot:pending>
                        <p>Loading...</p>
                      </template>
                     
                      <template v-slot="data">
                        <v-img :src="data" width="100"></v-img>
                      </template>
                     
                      <template v-slot:rejected="error">
                        <p>No imagen</p>
                      </template>
                    </Promised>

                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getReporteByAccionesM8, getReporteByAccionesDetalleM8, getReporteByAccionesDetalleArchivoM8 } from '@/services/reporte_formato_m8_service'
import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
import "jspdf-autotable";
import _chunk from 'lodash/chunk'
import { Promised } from 'vue-promised'

dayjs.extend(toObject);

const headersTabla = [
  { text: "Cantidad", value: "full_m8" },
  { text: "Acción", value: "numero_accion" },
  { text: "", value: "acciones", align: "center" },
]
const itemsTabla = ref([])

const search = ref('')
const page = ref(1);
const itemsPerPage = ref(10);
const dialog = ref(false)
const lst_detalle = ref([])

onMounted(async () => {
  cargarTabla()
})


async function cargarTabla(filtros = {}) {
  try {
    const data_m8 = await getReporteByAccionesM8(filtros)
    itemsTabla.value = data_m8
    console.log(itemsTabla.value)

  } catch (error) {
    console.log(error)
  }
}

async function fnVerDetalle(cve_accion) {
  try {
    lst_detalle.value = await getReporteByAccionesDetalleM8(cve_accion)
    dialog.value = true
  } catch (error) {

  }
}

async function fnViewImagen(img_) {

  if (Boolean(img_)) {
    const data_img = await getReporteByAccionesDetalleArchivoM8(img_)
    console.log(data_img)
    return data_img
  }
  else {
    return "NA"
  }

}

</script>
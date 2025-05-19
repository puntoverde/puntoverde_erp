<template>
  <div>
    <div class="d-flex justify-space-between mb-2">
      <span></span>
      <h1 class="accent--text oswald--text">Catalogo Celebracion</h1>
    </div>


    <v-card>
      <v-card-title>Alta celebracion</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="d-flex mb-3 rounded-xl align-center" style="column-gap: 30px;">
        <v-text-field v-model="celebracion" filled style="max-width: 300px;" hide-details></v-text-field>

        <v-menu>

          <template v-slot:activator="{ on, attrs }">

            <v-text-field :value="dayjs(fecha_celebracion).format('DD [de] MMM [de] YYYY')"
              prepend-inner-icon="mdi-calendar" filled style="max-width: 300px;" hide-details v-on="on"
              v-bind="attrs"></v-text-field>

          </template>

          <v-date-picker v-model="fecha_celebracion"></v-date-picker>

        </v-menu>
        <v-btn x-large color="primary" @click="fnCreateCelebracion">crear celebracion</v-btn>

      </v-card-text>

    </v-card>

    <v-data-table :headers="headers" :items="items" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5" hide-default-footer>
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

      <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom v-if="item.estatus==1">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="fnOpenDelete(item.id_celebracion)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
          <span>Eliminar celebracion</span>
        </v-tooltip>
      </template>
    </v-data-table>


    <v-dialog v-model="dialog" width="400" persistent>
      <v-card rounded="xl">
        <v-toolbar color="primary" class="mb-5">
          <v-toolbar-title>
            Cancelar celebracion
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseDelete"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-textarea v-model="motivo_cancela" label="Motivo" filled hide-details></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="fnDeleteCelebracion">aceptar</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import numeral from "numeral";
import dayjs from 'dayjs'
import { getCelebracionesService, getCelebracionByIdService, setCreateCelebracionService, setUpdateCelebracionService } from '@/services/celebracion_service'

const root = getCurrentInstance().proxy;
const headers = ref([
  { text: "Dia", align: "center", value: "fecha" },
  { text: "Celebracion", value: "celebracion" },
  { text: "Motivo", value: "motivo" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const items = ref([]);
const search = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const id_celebracion = ref()
const celebracion = ref()
const fecha_celebracion = ref()
const motivo_cancela = ref()

const dialog = ref(false)

onMounted(() => {
  fnGetCelebraciones();
});


function fnOpenDelete(id_) {
  id_celebracion.value = id_
  dialog.value = true
}
function fnCloseDelete()
{
  id_celebracion.value=undefined
  motivo_cancela.value=undefined
  dialog.value=false
}

async function fnGetCelebraciones() {
  items.value = await getCelebracionesService();
}
async function fnGetCelebracion() {
   await getCelebracionByIdService();
}
async function fnCreateCelebracion() {
  await setCreateCelebracionService({ celebracion: celebracion.value, fecha: fecha_celebracion.value });
  fnGetCelebraciones()
}
async function fnDeleteCelebracion() {
  await setUpdateCelebracionService(id_celebracion.value, { motivo: motivo_cancela.value });
  fnCloseDelete()
  fnGetCelebraciones()
}



</script>
<template>
  <div>
    <div class="d-flex justify-space-between mb-2">
      <span></span>
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
</v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Libro Accionistas</h1>
    </div>

    <!-- <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :outlined="attrs['aria-expanded'] == 'true'"
            color="primary"
            v-on="on"
            v-bind="attrs"
            fab
            small
            dark
            elevation="1"
            @click="nueva_cuota"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="" />
    </div> -->

    <v-data-table :headers="headers" :items="items" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
      single-expand item-key="id" show-expand class="table-pv rounded-xl elevation-5" hide-default-footer
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

      <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>

      <!-- <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="editar_cuota(item.cve_cuota)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
          </template>
          <span>Editar Cuota</span>
        </v-tooltip>
      </template> -->


      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="grey lighten-2">
          <div class="py-2">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th colspan="3" class="grey lighten-3">
                      Dueño Anterior
                    </th>
                    <th colspan="3" class="grey lighten-3">
                      Dueño nuevo
                    </th>
                    <th class="grey lighten-3"></th>
                  </tr>
                  <tr>
                    <th>Nombre</th>
                    <th>Rfc</th>
                    <th>Curp</th>
                    <th>Nombre</th>
                    <th>Rfc</th>
                    <th>Curp</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item_ in lst_historico">
                    <td>{{ item_.nombre }}</td>
                    <td>{{ item_.rfc }}</td>
                    <td>{{ item_.curp }}</td>
                    <td>{{ item_.nombre_actual }}</td>
                    <td>{{ item_.rfc_actual }}</td>
                    <td>{{ item_.curp_actual }}</td>
                    <td>{{ item_.fecha_modificacion }}</td>
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

const root = getCurrentInstance().proxy;
const headers = ref([
  { text: "Accion", value: "no_accion" },
  { text: "Posicion", align: "center", sortable: true, value: "id" },
  { text: "Dueño", value: "nombre" },
  { text: "Rfc", value: "rfc" },
  { text: "Curp", align: "right", value: "curp" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
const items = ref([]);
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
  items.value = await getLibroAccionistaService();
}

async function fnLoadHistorico({ item, value }) {
  if (value) {
    lst_historico.value=await getLibroAccionistaHistoricoService(item.cve_accion)
  }
  else{
    lst_historico.value=[]
  }
}

function nueva_cuota() {
  root.$router.push({ name: "FormConcepto" });
}

function editar_cuota(item) {
  root.$router.push({ name: "FormConcepto", params: { cve_cuota: item } });
}

</script>
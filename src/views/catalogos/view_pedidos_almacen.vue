<template>
  <div>
    <!-- <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
    <h1 class="accent--text oswald--text">Listado Pedidos</h1>
    <!-- </div> -->

    <div class="d-flex justify-space-between mb-5">
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
            @click="dialog = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="fnGetAllPedidos" />
    </div>

    <v-data-table
      :headers="headers"
      :items="lst_pedidos"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
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
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:item.fecha_pedido="{ value }">
        <span class="font-weight-bold accent--text">
          {{ dayjs(value).format("DD [de] MMMM [de] YYYY") }}</span
        >
      </template>

      <template v-slot:item.colaborador="{ item }">
        <span>{{ item.nombre }}</span>
        <span class="font-weight-bold mx-1">{{ item.apellido_paterno }}</span>
        <span class="font-italic">{{ item.apellido_materno }}</span>
      </template>

      <template v-slot:item.estatus="{ item }">
        <v-chip v-if="item.estatus == 1" color="info"
          ><v-icon left>mdi-check</v-icon> sin revision</v-chip
        >
        <v-chip v-else-if="item.estatus == 2" color="success"
          ><v-icon left>mdi-check-all</v-icon>Revisada</v-chip
        >
        <v-chip v-else-if="item.estatus == 3" color="warning"
          ><v-icon left>mdi-check-all</v-icon>terminado </v-chip
        >
        <v-chip v-else color="error"
          ><v-icon left>mdi-close-circle</v-icon> cancelada</v-chip
        >
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="item.estatus > 0"
              v-on="on"
              x-small
              icon
              outlined
              color="secondary"
              fab
              @click="
                editarPedido(item.id_pedido_almacen_pv, item.id_proveedor)
              "
              ><v-icon>mdi-square-edit-outline</v-icon></v-btn
            >
          </template>
          <span>Agregar productos</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="700" persistent>
      <v-card>
        <v-toolbar color="secondary" extension-height="70" dark>
          <v-toolbar-title>Crear Pedido</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>

          <template v-slot:extension>
            <v-select
              v-model="id_proveedor"
              :items="lst_proveedores"
              label="Proveedor"
              filled
              hide-details
              @change="fnGetProductosRequisicionProveedor"
            ></v-select>
          </template>
        </v-toolbar>
        <v-card-text class="mt-5">
          
<v-fade-transition mode="out-in">

          <v-item-group
            v-model="productos_selected"
            v-if="lst_productos.length > 0"
            multiple
            class="d-flex flex-column"
            style="row-gap: 15px"
            active-class="primary lighten-2"
          >
            <template v-for="(item, index) in lst_productos">
              <v-item
                v-slot="{ active, toggle }"
                :key="`item-${index}`"
                :value="item.id_requisicion_producto_pv"
              >
                <v-card @click="toggle">
                  <v-card-title>
                    <span>Requisicion: {{ item.folio }}</span>
                    <v-spacer></v-spacer>
                    <v-icon v-if="active">mdi-check</v-icon>
                  </v-card-title>
                  <v-card-text>{{ item.nombre }}</v-card-text>
                </v-card>
              </v-item>
            </template>
          </v-item-group>
       

          <v-card color="accent lighten-4" class="text-center py-10" v-else>
            <h1 class="text-h1">sin elementos</h1>
            <v-overlay absolute :value="loading_productos" color="secondary">
              <v-card
                width="250"
                height="50"
                class="d-flex flex-column justify-center align-center"
                rounded="xl"
                color="secondary"
              >
                cargando
                <v-progress-linear
                  indeterminate
                  color="primary"
                ></v-progress-linear>
              </v-card>
            </v-overlay>
          </v-card>

</v-fade-transition>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="fnCreatePedido"
            color="primary"
            :disabled="productos_selected.length == 0"
            ><v-icon class="mr-1">mdi-content-save</v-icon>Guardar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_info" width="500">

      <v-toolbar color="secondary" dark>
        <v-toolbar-title>cantidad de producto para agregar</v-toolbar-title>
      </v-toolbar>
      <v-list>
        <v-list-item v-for="item in lst_detalle_productos_libres" :key="item.id_categoria_pv">
          <v-list-item-content>
            <v-list-item-title>{{item.nombre}}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>{{item.total_libres}}</v-list-item-action>

        </v-list-item>
      </v-list>


    </v-dialog>


  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { allProveedor } from "@/services/proveedor_service";
import {
  allPedidos,
  createPedido,
  findProductoByRequisicionProveedor,
  detalleProductosLibresService
} from "@/services/pedidos_service";
import Search from "@/components/ui/Search.vue";
import dayjs from "dayjs";

const root = getCurrentInstance().proxy;
const headers = ref([
  { text: "Folio", align: "center", sortable: true, value: "folio" },
  { text: "Proveedor", value: "nombre_comercial" },
  { text: "Fecha Pedido", value: "fecha_pedido" },
  { text: "Persona realiza pedido", align: "right", value: "colaborador" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false },
]);
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

const id_proveedor = ref(0);

const dialog = ref(false);

const lst_proveedores = ref([]);
const lst_pedidos = ref([]);
const lst_productos = ref([]);

const loading_productos = ref(false);

const productos_selected = ref([]);

const dialog_info=ref(false)

const lst_detalle_productos_libres=ref([])

onMounted(() => {
  fnGetProveedores();
  fnGetAllPedidos();
  fnDetalleProductosLibres()
});

async function fnGetProveedores() {
  try {
    const data = await allProveedor();
    lst_proveedores.value = data.map((i) => ({
      value: i.id_proveedor,
      text: i.nombre_comercial,
    }));
  } catch (error) {}
}

async function fnGetAllPedidos() {
  try {
    lst_pedidos.value = await allPedidos();
  } catch (error) {}
}

async function fnGetProductosRequisicionProveedor(id_proveedor) {
  productos_selected.value=[]
  loading_productos.value = true;
  try {
    lst_productos.value=[]
    await new Promise((resolve)=>setTimeout(resolve,500))
    lst_productos.value = await findProductoByRequisicionProveedor(id_proveedor);
  } catch (error) {
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    loading_productos.value = false;
  }
}

async function fnCreatePedido() {
  const id_persona = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
  const data_send = {
    id_proveedor: id_proveedor.value,
    id_persona_pedido: id_persona,
    productos: productos_selected.value,
  };
  try {
    const id_pedido = await createPedido(data_send);
    console.log("id_pedido->", id_pedido);
    if (id_pedido > 0)
      root.$router.push({
        name: "pedido_producto",
        params: { id_pedido: id_pedido, id_proveedor: id_proveedor.value },
      });
  } catch (error) {
    console.log("error", error);
  }
}

function editarPedido(item, item2) {
  root.$router.push({
    name: "pedido_producto",
    params: { id_pedido: item, id_proveedor: item2 },
  });
}

async function fnDetalleProductosLibres()
{
  try{
    lst_detalle_productos_libres.value=await detalleProductosLibresService()
    dialog_info.value=true
  }
  catch(e){}
}

function exportExcel() {}
</script>
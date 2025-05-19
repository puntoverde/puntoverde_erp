<template>
  <div>
    <div class="d-flex justify-space-between">
      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Alta de Proveedor</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small dark
            elevation="1" @click="show_form = true">
            <!-- :disabled="!id_torneo" -->
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Dar alta proveedor</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="fnGetProveedores"/>
    </div>

    <v-data-table :headers="headers" :items="lst_proveedores" :search="search" :page.sync="page"
      :items-per-page="itemsPerPage" @page-count="pageCount = $event" class="table-pv rounded-xl elevation-5"
      hide-default-footer>
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

      <template v-slot:item.empleado="{ item }">
        {{ item.nombre }} <span class="font-weight-bold">{{ item.paterno }}</span> <span class="font-italic">{{
          item.materno }}</span>
      </template>


      <template v-slot:item.estatus="{ value }">
        <v-icon v-if="value" color="success">mdi-check-circle-outline</v-icon>
        <v-icon v-else color="error">mdi-close-circle-outline</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex">
          <proveedor-categoria :id_proveedor="item.id_proveedor"></proveedor-categoria>
          <i class="mx-1"></i>
          <proveedor-categoria-producto :id_proveedor="item.id_proveedor"></proveedor-categoria-producto>
          <i class="mx-1"></i>
          <v-btn @click="fnFindProveedorById(item.id_proveedor)" outlined x-small fab color="accent"><v-icon>mdi-pencil</v-icon></v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="show_form" width="800" scrollable persistent>
      <v-card class="mb-5x">
        <v-toolbar color="secondary" dark elevation="0">
          <v-toolbar-title> Formulario Alta de Proveedor </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="fnCancelar" icon> <v-icon>mdi-close-box</v-icon></v-btn>
        </v-toolbar>

        <div class="primary pt-1"></div>
        <v-card-text class="pt-8">
          <v-row>

            <v-col cols="12" md="6"><v-text-field v-model="codigo_proveedor" dense :hide-details="!iErrors.codigo"
                label="Código" class="my-mayus" filled :error-messages="iErrors.codigo"></v-text-field></v-col>

            <v-col cols="12" md="6"><v-text-field v-model="nombre_comercial" dense
                :hide-details="!iErrors.nombre_comercial" label="Nombre Comercial" class="my-mayus" filled
                :error-messages="iErrors.nombre_comercial"></v-text-field></v-col>

            <v-col cols="12" md="6"><v-text-field v-model="razon_social" dense
                :hide-details="!iErrors.razon_social" label="Razón Social" class="my-mayus" filled
                :error-messages="iErrors.razon_social"></v-text-field></v-col>

            <v-col cols="12" md="6"><v-text-field v-model="rfc" dense :hide-details="!iErrors.rfc" label="Rfc"
                class="my-mayus" filled :error-messages="iErrors.rfc"></v-text-field></v-col>

            <v-col cols="12" md="6">
              <v-select v-model="moneda_proveedor" :items="['MXN', 'USD', 'EUR']" dense
                :hide-details="!iErrors.moneda_proveedor" label="Moneda" class="my-mayus" filled
                :error-messages="iErrors.moneda_proveedor"></v-select></v-col>

            <v-col ols="12" md="6"><v-text-field v-model="telefono_empresa" dense :hide-details="!iErrors.telefono_empresa"
                label="Teléfono empresa" class="my-mayus" filled :error-messages="iErrors.telefono_empresa"></v-text-field></v-col>

            <v-col ols="12" md="12"><v-text-field v-model="persona_contacto" dense :hide-details="!iErrors.persona_contacto"
                label="Persona contactó" class="my-mayus" filled :error-messages="iErrors.persona_contacto"></v-text-field></v-col>

            <v-col ols="12" md="6"><v-text-field v-model="correo_contacto" dense :hide-details="!iErrors.correo_contacto"
                label="Correo contactó" class="my-mayus" filled :error-messages="iErrors.correo_contacto"></v-text-field></v-col>

            <v-col ols="12" md="6"><v-text-field v-model="whatsapp_contacto" dense :hide-details="!iErrors.whatsapp_contacto"
                label="Whatsapp contactó" class="my-mayus" filled :error-messages="iErrors.whatsapp_contacto"></v-text-field></v-col>

            <v-col ols="12" md="6"><v-text-field v-model="calle" dense :hide-details="!iErrors.calle" label="Calle"
                class="my-mayus" filled :error-messages="iErrors.calle"></v-text-field></v-col>

            <v-col cols="12" md="3"><v-text-field v-model="num_ext" dense :hide-details="!iErrors.n_ext"
                label="Número ext." class="my-mayus" filled :error-messages="iErrors.n_ext"></v-text-field></v-col>

            <v-col cols="12" md="3"><v-text-field v-model="num_int_" dense :hide-details="!iErrors.n_int"
                label="Número ext." class="my-mayus" filled :error-messages="iErrors.n_int"></v-text-field></v-col>

            <v-col cols="12" md="4"><v-text-field v-mask="'#####'" v-model="cp" @keyup="fnColonias" dense
                :hide-details="!iErrors.cp" label="Código Postal" filled
                :error-messages="iErrors.cp"></v-text-field></v-col>

            <v-col cols="12" md="8"><v-select label="Colonia" :hide-details="!iErrors.id_colonia" dense :value="colonia"
                :items="lst_colonias" return-object item-value="cve_colonia" item-text="nombre" v-on:input="changeColonia"
                class="my-mayus" filled :error-messages="iErrors.id_colonia"></v-select></v-col>



            <v-col cols="12" md="6"><v-text-field :value="municipio" dense hide-details label="Municipio" class="my-mayus"
                filled></v-text-field></v-col>

            <v-col cols="12" md="6"><v-text-field :value="estado" dense hide-details label="Estado" class="my-mayus"
                filled></v-text-field></v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-show="id_proveedor == 0" color="secondary" @click="fnCreateProveedor">
            <v-icon class="mr-1">mdi-check-circle</v-icon>Guardar
            Proveedor</v-btn>

          <v-btn v-show="id_proveedor > 0" color="secondary" @click="fnUpdateProveedor">
            <v-icon class="mr-1">mdi-pencil</v-icon>Actualizar Empleado</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar_open">
      {{ snackbar_ }}
    </v-snackbar>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { allProveedor, findProveedorById, createProveedor,updateProveedorService, getcolonias } from '@/services/proveedor_service'
import ProveedorCategoria from '@/components/proveedor-categoria.vue'
import ProveedorCategoriaProducto from '@/components/proveedor-categoria-producto.vue'
import { useValidacionProveedor } from '@/composables/useValidacionProveedor'

const { iValid, iErrors } = useValidacionProveedor()

const id_proveedor = ref(0);
const codigo_proveedor = ref()
const nombre_comercial = ref()
const razon_social = ref()
const rfc = ref()
const moneda_proveedor = ref()
const telefono_empresa=ref()

const persona_contacto=ref()
const correo_contacto=ref()
const whatsapp_contacto=ref()

const calle = ref()
const num_ext = ref()
const num_int_ = ref()
const cp = ref()
const cve_colonia = ref()
const colonia = ref()
const municipio = ref()
const estado = ref()

const lst_colonias = ref()


const lst_proveedores = ref([])

const show_form = ref(false);

const header = []
const search = ref("");

const page = ref(1);
const pageCount = ref(0);
const itemsPerPage = ref(10);

const snackbar_open = ref(false)
const snackbar_ = ref('')

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
  { label: "Código", key: "codigo", value: "", type: "text" },
  { label: "Nombre comercial", key: "nombre_comercial", value: "", type: "text" },
  { label: "Razón social", key: "razon_social", value: "", type: "text" },
  { label: "RFC", key: "rfc", value: "rfc", type: "text" },
  // { label: "Fecha Alta", key: "fecha_ingreso", value: "", type: "date" },
  // { label: "Estatus", key: "estatus", value: "", },
]);

const headers = [
  { text: "Código", value: "codigo" },
  { text: "Nombre comercial", value: "nombre_comercial" },
  { text: "Razón social", value: "razon_social" },
  { text: "Rfc", value: "rfc" },
  { text: "Persona contactó", value: "persona_contacto" },
  { text: "Whatsapp contactó", value: "whatsapp_contacto" },
  { text: "Correo contactó", value: "correo_contacto" },
  { text: "Calle", value: "calle" },
  { text: "Número ext.", value: "n_ext" },
  { text: "Código postal", value: "cp" },
  { text: "Colonia", value: "colonia_name" },
  { text: "Municipio", value: "municipio_name" },
  { text: "Estado", value: "estado_name" },
  { text: "Estatus", value: "estatus", align: 'center' },
  { text: "Acciones", value: "actions", align: 'center', width: '120px', cellClass: 'd-flex justify-space-between align-center px-2' },
];

onMounted(async () => {
  fnGetProveedores()
})

async function fnGetProveedores(filtros={}) {
  console.log("fnGetProveedores entra y carga...")
  try {
    lst_proveedores.value = await allProveedor(filtros)
  } catch (error) {
    console.log(error)
  }
}

async function fnCreateProveedor() {

  const data_send = {
    codigo: codigo_proveedor.value,
    nombre_comercial: nombre_comercial.value,
    razon_social:razon_social.value,
    telefono_empresa:telefono_empresa.value,
    rfc: rfc.value,
    moneda_proveedor: moneda_proveedor.value,
    persona_contacto:persona_contacto.value,
    correo_contacto:correo_contacto.value,
    whatsapp_contacto:whatsapp_contacto.value,
    calle: calle.value,
    n_ext: num_ext.value,
    n_int: num_int_.value,
    cp: cp.value,
    id_colonia: cve_colonia.value
  }
  try {
    const data_valid = await iValid(data_send)
    const data = await createProveedor(data_valid)
    if (data > 0) {
      snackbar_open.value = true
      snackbar_.value = "Se registro con exito al proveedor"
      fnCancelar()
      console.log("si creo y vuelvo  recargar fnGetProveedores")
      fnGetProveedores()
      console.log("despues de fnGetProveedores")
    }
  } catch (error) {
    console.log(error)
  }
}

async function fnUpdateProveedor() {
const data_send = {
    codigo: codigo_proveedor.value,
    nombre_comercial: nombre_comercial.value,
    razon_social:razon_social.value,
    telefono_empresa:telefono_empresa.value,
    rfc: rfc.value,
    moneda_proveedor: moneda_proveedor.value,
    persona_contacto:persona_contacto.value,
    correo_contacto:correo_contacto.value,
    whatsapp_contacto:whatsapp_contacto.value,
    calle: calle.value,
    n_ext: num_ext.value,
    n_int: num_int_.value,
    cp: cp.value,
    id_colonia: cve_colonia.value
  }
  try {
    const data_valid = await iValid(data_send)
    const data = await updateProveedorService(id_proveedor.value,data_valid)
    if (data > 0) {
      snackbar_open.value = true
      snackbar_.value = "Se actualizo con exito al proveedor"
      fnCancelar()
      console.log("si creo y vuelvo  recargar fnGetProveedores")
      fnGetProveedores()
      console.log("despues de fnGetProveedores")
    }
  } catch (error) {
    console.log(error)
  }
}

function changeColonia(a) {
  cve_colonia.value = a.cve_colonia;
  municipio.value = a.municipio;
  estado.value = a.estado;
}

function fnCancelar() {
  id_proveedor.value = 0;
  codigo_proveedor.value = ''
  nombre_comercial.value = ''
  razon_social.value = ''
  telefono_empresa.value=''
  rfc.value = ''
  moneda_proveedor.value = ''
  persona_contacto.value=''
  correo_contacto.value=''
  whatsapp_contacto.value=''
  calle.value = ''
  num_ext.value = ''
  num_int_.value = ''
  cp.value = ''
  colonia.value = ''
  municipio.value = ''
  estado.value = ''
  cve_colonia.value = 0
  show_form.value = false
}

async function fnColonias() {
  lst_colonias.value = [];
  if (cp.value.length >= 5) {
    lst_colonias.value = await getcolonias(cp.value);
  }
}


async function fnFindProveedorById(id)
{
  try {
    const data=await findProveedorById(id)
  id_proveedor.value = data.id_proveedor;
  codigo_proveedor.value = data.codigo
  nombre_comercial.value = data.nombre_comercial
  razon_social.value =data.razon_social
  rfc.value =data.rfc
  moneda_proveedor.value =data.moneda_proveedor
  telefono_empresa.value=data.telefono_proveedor
  calle.value =data.calle
  num_ext.value =data.n_ext
  num_int_.value =data.n_int
  cp.value =data.cp
  cve_colonia.value =data.id_colonia
  persona_contacto.value=data.persona_contacto
  correo_contacto.value=data.correo_contacto
  whatsapp_contacto.value=data.whatsapp_contacto
  colonia.value =data.colonia_name
  municipio.value =data.municipio_name
  estado.value =data.estado_name
  fnColonias()
  show_form.value = true
  } catch (error) {
    
  }
}


</script>
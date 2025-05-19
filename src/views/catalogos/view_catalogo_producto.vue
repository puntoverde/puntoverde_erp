<template>
  <div>
    <div class="d-flex justify-space-between">
      <h1 class="accent--text oswald--text">Alta de productos</h1>
    </div>

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
        <span>Crear producto</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="fnAllProducto">
        <template v-slot:tipo="{ data }">
          <v-radio-group row v-model="data.value">
            <v-radio label="Producto" value="1"></v-radio>
            <v-radio label="Servicio" value="0"></v-radio>
          </v-radio-group>
        </template>

        <template v-slot:categoria="{ data }">
          <v-select
            v-model="data.value"
            hide-details
            filled
            :items="lst_categorias"
            item-value="id_categoria_pv"
            item-text="nombre"
            @change="fnAllSubCategoriaProducto"
          ></v-select>
        </template>

        <template v-slot:subcategoria="{ data }">
          <v-select
            v-model="data.value"
            hide-details
            filled
            :items="lst_subcategorias"
            item-value="id_subcategoria_producto_pv"
            item-text="nombre"
          ></v-select>
        </template>

        <template v-slot:marca="{ data }">
          <v-select
            v-model="data.value"
            hide-details
            :items="lst_marcas"
            item-value="id_marca_productos_pv"
            item-text="nombre"
            label="Marca"
            filled
          ></v-select>
        </template>

        <template v-slot:unidad_compra="{ data }">
          <v-select
            v-model="data.value"
            hide-details
            :items="lst_unidad_medida"
            item-value="id_unidad_medida_producto_pv"
            item-text="nombre"
            label="Unidad de compra"
            filled
          >
          </v-select>
        </template>
      </Search>
    </div>

    <v-data-table
      :headers="headers"
      :items="lst_productos"
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

      <template v-slot:item.clave="{ value }">
        <v-chip label outlined>
          <v-icon lef color="accent mr-5">mdi-label</v-icon>
          {{ value }}
        </v-chip>
      </template>

      <template v-slot:item.nombre="{ value }">
        <span class="font-weight-bold accent--text">{{
         value
        }}</span>
      </template>

      <template v-slot:item.tipo="{ value }">
        <span v-if="value == 1" class="font-weight-bold accent--text"
          >producto</span
        >
        <span v-else class="font-weight-bold">servicio</span>
      </template>

      <template v-slot:item.categoria_name="{ item }">
        <span class="text-caption">{{ item.categoria_name }}</span
        >/
        <span class="accent--text text-caption">{{
          item.subcategoria_name
        }}</span>
      </template>

      <template v-slot:item.marca="{ item }">
        <span class="text-subtitle-1 mr-1">{{ item.marcas ?? "N/A" }}</span
        >-
        <span class="accent--text text-subtitle-2 mr-1">{{
          Boolean(item.modelo) ? item.modelo : "N/A"
        }}</span>
      </template>

      <template v-slot:item.presentaciones="{ value, item }">
        <span v-if="value.split(',').filter(Boolean).length == 0"> N/A </span>
        <span v-else-if="value.split(',').filter(Boolean).length == 1">
          {{ value.split(",")?.[0].split("|")?.[0] }} /<v-chip
            color="secondary"
            class="ml-1"
            labelx
            small
            >{{ value.split(",")?.[0].split("|")?.[1] }}
            {{ item.medida_producto }}</v-chip
          >
        </span>
        <span v-else>
          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                v-on="on"
                v-bind="attrs"
                style="text-transform: lowercase"
                outlined
                rounded
                color="secondary"
                >mas de una</v-btn
              >
            </template>
            <v-card>
              <v-list>
                <v-list-item v-for="prese in value.split(',')">
                  <v-list-item-title>
                    {{ prese.split("|")?.[0] }} /<v-chip
                      color="secondary"
                      class="ml-1"
                      labelx
                      small
                      >{{ prese.split("|")?.[1] }}
                      {{ item.medida_producto }}</v-chip
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </span>
      </template>

      <template v-slot:item.estatus="{ value }">
        <v-chip v-if="value == 1" color="success" small
          ><v-icon left small>mdi-check-circle</v-icon> activo
        </v-chip>
        <v-chip v-else color="error" small
          ><v-icon left small>mdi-close-circle</v-icon> inactivo
        </v-chip>
      </template>

      <!-- <template v-slot:item.acciones="{ item }">
                <v-btn class="mr-2" size="x-small" icon outlined @click="openDialogNew(item.id_equipo_futbol, item)">
                    <v-icon> mdi-delete</v-icon>
                </v-btn>
            </template> -->
    </v-data-table>

    <v-dialog v-model="dialog" width="1000" persistent scrollable>
      <v-card>
        <v-toolbar color="secondary" dark elevation="0">
          <v-toolbar-title> Alta de Producto o servicio </v-toolbar-title>
        </v-toolbar>
        <v-divider class="divider-color-pv"></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="3" class="pt-10">
                <v-card
                  width="100%"
                  height="200px"
                  color="#f1f1f1"
                  class="px-5"
                >
                  <!-- <v-card width="100%" height="235px" color="#f1f1f1" class="px-5"> -->

                  <v-avatar
                    color="#f1f1f1"
                    width="100%"
                    height="153px"
                    tile
                    class="flex-column rounded"
                  >
                    <img v-if="foto" :src="foto_view" />
                    <!-- src="https://cdn.vuetifyjs.com/images/john.jpg" -->
                  </v-avatar>
                  <v-card-actions class="">
                    <v-btn v-if="!foto" @click="open" text outlined color="info"
                      >buscar imagen</v-btn
                    >
                    <v-btn v-else @click="reset" text outlined color="error"
                      >cancelar imagen</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>

              <v-col cols="12" md="9" class="pt-0x">
                <div class="d-flex justify-end mb-3">
                  <div class="d-flex justify-space-aroundx align-center">
                    servicio
                    <v-switch
                      v-model="tipo"
                      hide-details
                      class="mt-0 mx-5"
                      :true-value="1"
                      :false-value="0"
                      :error-messages="iErrors.tipo"
                    ></v-switch>
                    producto
                  </div>
                </div>
                <v-row>
                  <v-col cols="12" md="4" class="pb-0">
                    <v-text-field
                      :value="clave"
                      label="Clave"
                      clearable
                      filled
                      :error-messages="iErrors.clave"
                      readonly
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="8" class="text-subtitle-1">
                    <div
                      class="grey rounded-xl d-flex align-center justify-center text-justify px-2"
                      style="min-height: 100%"
                    >               
                      <template
                        v-for="(name_d,index) in nombre_detalle"
                        
                      >
                        <span :key="index" v-if="name_d">{{ name_d }}&nbsp;</span>
                      </template>
                    </div>
                  </v-col>

                  <v-col cols="12" md="4" class="pb-0">
                    <v-text-field
                      v-model="nombre"
                      label="Nombre"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.nombre"
                      @input="fnObtenerDetalleNombre"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" class="pb-0">
                    <v-text-field
                      v-model="material"
                      label="Material"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.material"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="4" class="pb-0">
                    <v-text-field
                      v-model="medida1"
                      label="Medida 1"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.medida1"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>

              <v-col>
                <v-row>
                  <v-col cols="12" md="3" class="pb-0">
                    <v-text-field
                      v-model="medida2"
                      label="Medida 2"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.medida2"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" class="pb-0">
                    <v-text-field
                      v-model="forma"
                      label="Forma"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.forma"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" class="pb-0">
                    <v-text-field
                      v-model="tipo_cuerda"
                      label="Tipo cuerda"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.tipo_cuerda"
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3" class="pb-0">
                    <v-text-field
                      v-model="otros"
                      label="Otros"
                      class="my-mayus"
                      clearable
                      filled
                      :error-messages="iErrors.otros"
                    >
                    </v-text-field>
                  </v-col>

                  <!-- <v-col cols="12" md="4" class="pb-0">
                                        <v-text-field v-model="otros" label="Otros" class="my-mayus" clearable filled
                                            :error-messages="iErrors.nombre">

                                        </v-text-field>
                                    </v-col> -->

                  <!-- <v-col cols="12" md="7" class="py-0">
                                        <v-textarea v-model="descripcion" class="my-mayus" label="descripcion" rows="4" filled :error-messages="iErrors.descripcion"></v-textarea>                                       
                                    </v-col>

                                    

                                    <v-col cols="12" md="5" class="py-0">
                                        <v-text-field v-model="modelo" label="Modelo" clearable filled
                                            :error-messages="iErrors.modelo">
                                        </v-text-field>

                                        <v-select v-model="tipo_producto" :items="[{id_producto_tipo_pv:1,nombre:'CONSUMIBLE'},{id_producto_tipo_pv:2,nombre:'MOBILARIO'},{id_producto_tipo_pv:3,nombre:'HERRAMIENTA'}]" item-value="id_producto_tipo_pv" item-text="nombre" label="Tipo Producto"  clearable filled
                                            :error-messages="iErrors.id_tipo_producto">
                                        </v-select>
                                     
                                    </v-col> -->
                </v-row>
                <v-row>
                  <v-col cols="12" md="7" class="py-0">
                    <v-textarea
                      v-model="descripcion"
                      class="my-mayus"
                      label="descripcion"
                      rows="4"
                      filled
                      :error-messages="iErrors.descripcion"
                    ></v-textarea>
                  </v-col>

                  <v-col cols="12" md="5" class="py-0">
                    <v-text-field
                      v-model="modelo"
                      label="Modelo"
                      clearable
                      filled
                      :error-messages="iErrors.modelo"
                    >
                    </v-text-field>

                    <v-select
                      v-model="tipo_producto"
                      :items="[
                        { id_producto_tipo_pv: 1, nombre: 'CONSUMIBLE' },
                        { id_producto_tipo_pv: 2, nombre: 'MOBILARIO' },
                        { id_producto_tipo_pv: 3, nombre: 'HERRAMIENTA' },
                      ]"
                      item-value="id_producto_tipo_pv"
                      item-text="nombre"
                      label="Tipo Producto"
                      clearable
                      filled
                      :error-messages="iErrors.id_tipo_producto"
                    >
                    </v-select>
                  </v-col>
               
                </v-row>
              </v-col>
            </v-row>

            <span class="font-weight-bold">categoria de producto</span>
            <v-divider class="mb-5"></v-divider>

            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  v-model="categoria"
                  :items="lst_categorias"
                  item-value="id_categoria_pv"
                  item-text="nombre"
                  @change="fnAllSubCategoriaProducto"
                  label="Categoria"
                  clearable
                  filled
                >
                </v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="subcategoria"
                  :items="lst_subcategorias"
                  item-value="id_subcategoria_producto_pv"
                  item-text="nombre"
                  @change="fnAllSubSubCategoriaProducto"
                  label="Subcategoria"
                  clearable
                  filled
                  :error-messages="iErrors.id_subcategoria"
                >
                </v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="subsubcategoria"
                  :items="lst_subsubcategorias"
                  item-value="id_subsubcategoria_producto_pv"
                  item-text="nombre"
                  label="Subcategoria"
                  clearable
                  filled
                >
                </v-select>
              </v-col>
            </v-row>

            <span class="font-weight-bold">Unidad de medida del producto, observacion para requisicion</span>
            <v-divider class="mb-5"></v-divider>

            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="unidad_medida"
                  label="Unidad Medida Producto"
                  filled
                  :items="lst_unidad_medida"
                  item-value="id_unidad_medida_producto_pv"
                  item-text="nombre"
                  :error-messages="iErrors.id_unidad_medida"
                ></v-select>
              </v-col>
              <v-col>
                <v-textarea v-model="observacion_requisicion" filled rows="3" label="observacion requisicion" :error-messages="iErrors.observacion_requisicion"></v-textarea>
              </v-col>
            </v-row>

            <span class="font-weight-bold"
              >Presentaciones de producto y marca</span
            >
            <v-divider class="mb-5"></v-divider>

            <v-row>
              <v-col cols="8">
                <v-simple-table>
                  <template v-slot:default>
                    <thead class="grey">
                      <tr>
                        <th>Unidad Presentacion</th>
                        <th>Contenido</th>
                        <th style="width: 60px">
                          <v-menu
                            v-model="menu_presentacion"
                            :close-on-content-click="false"
                            :close-on-click="false"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                outlined
                                color="white"
                                small
                                v-on="on"
                                v-bind="attrs"
                                ><v-icon>mdi-plus</v-icon></v-btn
                              >
                            </template>
                            <v-card width="300">
                              <v-toolbar elevation="0"
                                ><v-toolbar-title
                                  >Agregar presentacion</v-toolbar-title
                                ></v-toolbar
                              >
                              <v-divider></v-divider>
                              <v-card-text>
                                <v-select
                                  v-model="unidad_medida_presentacion"
                                  :items="lst_unidad_medida"
                                  item-value="id_unidad_medida_producto_pv"
                                  item-text="nombre"
                                  label="Unidad de medida"
                                  filled
                                >
                                </v-select>
                                <v-text-field
                                  v-model="cantidad_presentacion"
                                  filled
                                ></v-text-field>
                              </v-card-text>
                              <v-divider></v-divider>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="fnCloseMenuPresentacion"
                                  >cancelar</v-btn
                                >
                                <v-btn @click="fnAddPresentacion"
                                  >Aceptar</v-btn
                                >
                              </v-card-actions>
                            </v-card>
                          </v-menu>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tr_presentacion in presentaciones">
                        <td>
                          {{ fnMostrarMedida(tr_presentacion.unidad_medida) }}
                        </td>
                        <td>{{ tr_presentacion.cantidad }}</td>
                        <td>
                          <v-btn icon outlined small
                            ><v-icon>mdi-delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>

              <v-col cols="4">
                <v-simple-table>
                  <template v-slot:default>
                    <thead class="grey">
                      <tr>
                        <th>Marca</th>
                        <th style="width: 60px">
                          <v-menu
                            v-model="menu_marca"
                            :close-on-content-click="false"
                            :close-on-click="false"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                outlined
                                color="white"
                                small
                                v-on="on"
                                v-bind="attrs"
                                ><v-icon>mdi-plus</v-icon></v-btn
                              >
                            </template>
                            <v-card width="300">
                              <v-toolbar elevation="0"
                                ><v-toolbar-title
                                  >Agregar Marca</v-toolbar-title
                                ></v-toolbar
                              >
                              <v-divider></v-divider>
                              <v-card-text>
                                <v-select
                                  v-model="marca_seleccionadas"
                                  filled
                                  multiple
                                  :items="lst_marcas"
                                  item-value="id_marca_productos_pv"
                                  item-text="nombre"
                                ></v-select>
                              </v-card-text>
                              <v-divider></v-divider>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="fnCloseMenuMarca"
                                  >cancelar</v-btn
                                >
                                <v-btn @click="fnAddMarca">Aceptar</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-menu>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tr_marca in marcas">
                        <td>{{ fnMostrarMarca(tr_marca) }}-{{ tr_marca }}</td>
                        <td>
                          <v-btn icon outlined small
                            ><v-icon>mdi-delete</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" outlined dark @click="closeDialog">
            <v-icon class="mr-1">mdi-close</v-icon> Cancelar
          </v-btn>

          <v-btn color="primary" dark @click="setGuardar">
            <v-icon class="mr-1">mdi-content-save</v-icon> Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup >
import { ref, getCurrentInstance, onMounted } from "vue";
import {
  allCategoriaProducto,
  allSubCategoriaProducto,
  allSubSubCategoriaProducto,
} from "@/services/categoria_producto_service";
import { allUnidadMedidaService } from "@/services/unidad_medida_service";
import { allMarcaProductoService } from "@/services/marca_producto_service";
import {
  allProducto,
  createProducto,
  saveImagenProducto,
  getDetalleNombreProducto,
} from "@/services/producto_service";
import { useFileDialog } from "@vueuse/core";
import { useValidacionProducto } from "@/composables/useValidacionProducto";
import _uniqBy from "lodash/uniqBy";
import _debounce from "lodash/debounce";

const root = getCurrentInstance().proxy;

const { files: foto, onChange, open, reset } = useFileDialog();

const { iValid, iErrors, iSchemaFile } = useValidacionProducto();

const categoria = ref(); //number|undefined
const subcategoria = ref(); //number|undefined
const subsubcategoria = ref(); //number|undefined
const unidad_medida = ref(); //number|undefined
const tipo_producto = ref(); //number|undefined
const nombre = ref(""); //string
const material = ref(""); //string
const medida1 = ref(""); //string
const medida2 = ref(""); //string
const forma = ref(""); //string
const tipo_cuerda = ref(""); //string
const otros = ref(""); //string
const descripcion = ref(""); //string
const modelo = ref(); //string|undefined
const clave = ref(""); //string
const foto_view = ref(""); //string
const marcas = ref([]); //number[]
const tipo = ref(1);
const presentaciones = ref([]); //{"unidad_medida":number,"cantidad":number}[]
const observacion_requisicion = ref(); //string

const lst_categorias = ref([]); //iCategoriaResponse[]
const lst_subcategorias = ref([]); //iSubCategoriaResponse[]
const lst_subsubcategorias = ref([]); //iSubSubCategoriaResponse[]
const lst_marcas = ref([]); //iMarcaResponse[]
const lst_unidad_medida = ref([]); //iUnidadMedidaResponse[] -- se usa como la global titen todo
const lst_productos = ref([]); //iProductoResponse[]

const unidad_medida_presentacion = ref(0); //number|undefined
const cantidad_presentacion = ref(0); //number|undefined

const marca_seleccionadas = ref([]);

const dialog = ref(false); //boolean
const search = ref(); //string|undefined

const menu_presentacion = ref(false); //boolean
const menu_marca = ref(false); //boolean

const nombre_detalle = ref("");

const headers = ref([
  { text: "Clave", value: "clave" },
  // { text: "tipo", value: "tipo" },
  { text: "Nombre", value: "nombre" },
  { text: "Categoria/subcategoria", value: "categoria_name" },
  { text: "Marca - Modelo", value: "marca" },
  { text: "Forma de Compra", value: "medida_producto" },
  { text: "Presentaciones", value: "presentaciones" },
  { text: "Estatus", value: "estatus" },
  // { text: "Acciones", value: "acciones" },
]);
const filters = ref([
  { label: "Clave", key: "clave", value: "", type: "text" },
  // { label: "Tipo producto", key: "tipo", value: "" },
  { label: "Nombre produto", key: "nombre", value: "", type: "text" },
  { label: "Categoria", key: "categoria", value: "", type: "select" },
  { label: "Subcategoria", key: "subcategoria", value: "", type: "select" },
  { label: "Marca", key: "marca", value: "", type: "select" },
  { label: "Unidad Compra", key: "unidad_compra", value: "", type: "select" },
]);
const getBreadcrumb = [
  {
    text: "Catalogo",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    text: "Finanzas",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    text: "Link 2",
    disabled: true,
    href: "producto",
  },
];

const page = ref(1); //number
const itemsPerPage = ref(10); //number

onChange(async (file) => {
  foto_view.value = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file[0]);
  });
});

async function fnGetCategoriaProductos() {
  try {
    lst_categorias.value = await allCategoriaProducto();
  } catch (error) {
    lst_categorias.value = [];
  }
}

async function fnAllSubCategoriaProducto(value) {
  console.log("🚀 ~ fnAllSubCategoriaProducto ~ value:", value)
  clave.value=lst_categorias.value.find(i=>i.id_categoria_pv==value)?.nombre?.substring(0,4)
  lst_subcategorias.value = await allSubCategoriaProducto(value);
}

async function fnAllSubSubCategoriaProducto() {
  lst_subsubcategorias.value = await allSubSubCategoriaProducto(
    subcategoria.value
  );
}

async function fnGetUnidadMedida() {
  try {
    lst_unidad_medida.value = await allUnidadMedidaService();
  } catch (error) {
    lst_categorias.value = [];
  }
}

async function getMarca() {
  try {
    lst_marcas.value = await allMarcaProductoService();
  } catch (error) {}
}

async function fnAllProducto(filtros = {}) {
  try {
    lst_productos.value = await allProducto(filtros);
  } catch (error) {}
}

async function setGuardar() {
  const dataSend = {
    tipo: tipo.value,
    id_subcategoria: subcategoria.value,
    id_subsubcategoria:subsubcategoria.value,
    id_unidad_medida: unidad_medida.value,
    id_tipo_producto: tipo_producto.value,
    nombre: nombre.value,

    material: material.value,
    medida1: medida1.value,
    medida2: medida2.value,
    forma: forma.value,
    tipo_cuerda: tipo_cuerda.value,
    otros: otros.value,

    clave: clave.value,
    descripcion: descripcion.value,
    modelo: modelo.value,
    marcas: marcas.value,
    presentaciones: presentaciones.value,

    observacion_requisicion:observacion_requisicion.value
  };

  try {
    const data_valid = await iValid(dataSend);
    if (Boolean(foto.value?.[0])) {
      data_valid.foto = await saveImagenProducto(foto.value?.[0], clave.value);
    }
    const data = await createProducto(data_valid);
    if (data > 0) {
      fnAllProducto();
      cleanForm();
      root.$toast.success("Producto guardado correctamente");
      dialog.value = false;
    }
  } catch (error) {
    console.log(error);
    if (
      error.name == "ValidationError" &&
      (error.type == "file-is-required" || error.type == "file-is-type")
    ) {
      root.$toast.warning("no existe imagen o no es imagen..");
    } else {
      root.$toast.error("Ocurrio un error");
    }
  }
}

function closeDialog() {
  dialog.value = false;
  cleanForm();
}

function cleanForm() {
  categoria.value =
    subcategoria.value =
    subsubcategoria.value =
    unidad_medida.value =
    tipo_producto.value =
      undefined;
  nombre.value =
    descripcion.value =
    modelo.value =
    clave.value =
    foto.value =
      "";
  lst_subcategorias.value = [];
  presentaciones.value = [];
  marcas.value = [];
  reset(); //es de vueuse dialog para limpiera el files
}

function fnAddPresentacion() {
  presentaciones.value.push({
    unidad_medida: unidad_medida_presentacion.value,
    cantidad: cantidad_presentacion.value,
  });
}

function fnAddMarca() {
  marcas.value = marca_seleccionadas.value;
}

function fnCloseMenuPresentacion() {
  menu_presentacion.value = false;
}

function fnCloseMenuMarca() {
  menu_marca.value = false;
}

function fnMostrarMedida(id_medida) {
  return lst_unidad_medida.value.find(
    (i) => i.id_unidad_medida_producto_pv == id_medida
  )?.nombre;
}

function fnMostrarMarca(id_marca) {
  return lst_marcas.value.find((i) => i.id_marca_productos_pv == id_marca)
    ?.nombre;
}

const fnObtenerDetalleNombre = _debounce(async () => {
  nombre_detalle.value = await getDetalleNombreProducto(nombre.value);
}, 500);



getMarca();
fnGetCategoriaProductos();
fnGetUnidadMedida();
fnAllProducto();
</script>
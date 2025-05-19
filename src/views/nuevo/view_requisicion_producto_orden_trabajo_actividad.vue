<template>
  <div style="height: 100%"> 
    <v-toolbar class="mb-5x" elevation="0">
      <v-toolbar-title>Requisicion Actividad orden control</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="fnCloseRequisicion"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <!-- <div class="d-flex justify-space-between">
    
      <h1 class="accent--text oswald--text">Nueva de Requisicion</h1>
    </div> -->

    <div class="d-flex" style="column-gap: 10px; height: calc(100% - 54px)">
      <div style="width: 30%; height: 100%">
        <v-card elevation="1" height="100%">
          <v-toolbar color="secondary">
            <v-toolbar-title class="white--text mr-2"
              >buscar producto:  </h1></v-toolbar-title
            >
              <!-- @input="findProducto" -->
            <v-autocomplete
              v-model="producto"
              :search-input.sync="search"
              :items="cLstProducto"
              @change="findProducto"
              solo-inverted
              dark
              hide-details
            ></v-autocomplete>
          </v-toolbar>
          <v-card-text style="height: calc(100% - 116px)">
            <v-row>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="clave"
                  readonly
                  label="Clave"
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="8">
                <v-text-field
                  :value="nombre"
                  readonly
                  label="Producto"
                  filled
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="12">
                <v-textarea
                  :value="descripcion"
                  readonly
                  label="descripcion"
                  rows="2"
                  filled
                  hide-details
                ></v-textarea>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  :value="categoria"
                  readonly
                  filled
                  hide-details
                  label="Categoria"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="6">
                <v-text-field
                  :value="subcategoria"
                  readonly
                  filled
                  hide-details
                  label="Subcategoria"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="medida_compra"
                  readonly
                  filled
                  hide-details
                  label="Medida Compra"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="marca"
                  readonly
                  filled
                  hide-details
                  label="Marca"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="modelo"
                  readonly
                  filled
                  hide-details
                  label="Modelo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="tamano"
                  readonly
                  filled
                  hide-details
                  label="Tamaño"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="medida_producto"
                  readonly
                  filled
                  hide-details
                  label="Medida Producto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" lg="4">
                <v-text-field
                  :value="piezas_contenido"
                  readonly
                  filled
                  hide-details
                  label="Piezas del contenido"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!Boolean(id_producto_pv)"
              color="primary"
              @click="fnOpenAgregarProducto"
            >
              Agregar Producto
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div class="flex-grow-1">
        <v-card
          class="d-flex justify-space-between align-center px-10 py-3"
          outlined
          height="120"
        >
          <img :src="imagen" width="100px" />
          <span class="text-h3">Club Deportivo Punto Verde</span>

          <v-btn
            height="100px"
            :disabled="lst_productos_requisicion.length==0"
            v-if="folio == 0"
            @click="fnCreateRequisicion"
            class="text-h6"
            color="secondary"
            >Guardar</v-btn
          >
        </v-card>

        <div class="d-flex justify-space-between my-5">
          <!-- <span style="width: 150px">
            <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn       
            v-if="!Boolean(id_requisicion_existente)"        
              color="secondary"
              v-on="on"
              v-bind="attrs"              
              smallx
              dark
              elevation="1"
              @click="fnGetRequisicionesByColaborador"
            >
              <v-icon>mdi-magnify</v-icon> Ligar requisicion
            </v-btn>
            <v-btn    v-else           
              color="info"
              v-on="on"
              v-bind="attrs"              
              smallx
              dark
              elevation="1"
              @click="id_requisicion_existente=undefined"
            >
              <v-icon>mdi-check</v-icon> Ligar
            </v-btn>
          </template>
          <span>Agregar requisicion de existente</span>
        </v-tooltip>
          </span> -->
          <span class="font-weight-bold">REQUISICIÓN</span>
          <span class="font-weight-bold" style="width: 150px"
            >FOLIO: {{ folio }}</span
          >
        </div>

        <div class="d-flex justify-end">
          <span style="width: 50px; height: 38px" class="re">Área:</span>
          <div
            style="width: 250px; height: 38px; border-bottom: 1px solid #000"
          >
            {{ departamento_text }}
          </div>
          <span style="width: 50px; height: 38px" class="re">Fecha:</span>
          <div
            style="width: 250px; height: 38px; border-bottom: 1px solid #000"
            class="text-right"
          >
            {{ dayjs().format("DD [de] MMMM [del] YYYY") }}
          </div>
        </div>

        <v-simple-table id="table-requisicion" class="mt-5" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">CANTIDAD</th>
                <th class="text-center">DESCRIPCION</th>
                <th class="text-center">OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in lst_productos_requisicion">
                <td style="width: 15%">{{ prod.cantidad }}</td>
                <td style="width: 35%">{{ prod.descripcion }}</td>
                <td style="width: 50%">{{ prod.observacion }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <div class="d-flex justify-space-between mt-15">
          <div class="d-flex flex-column align-center">
            <span style="width: 50px; height: 38px" class="re">Solicito:</span>
            <div
              style="width: 250px; height: 38px; border-bottom: 1px solid #000"
              class="text-center"
            >
              {{ solicito_text }}
            </div>
          </div>
          <div class="d-flex flex-column align-center">
            <span style="width: 50px; height: 38px" class="re">Reviso:</span>
            <div
              style="width: 250px; height: 38px; border-bottom: 1px solid #000"
              class="text-center"
            >
              {{ reviso_text }}
            </div>
          </div>
          <div class="d-flex flex-column align-center">
            <span style="width: 50px; height: 38px" class="re">Autorizo:</span>
            <div
              style="width: 250px; height: 38px; border-bottom: 1px solid #000"
              class="text-center"
            >
              {{ aprobo_text }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog" width="550" persistent>
      <v-card>
        <v-card-title color="secondary">
          Ingrese Cantidad y observacion
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-5">
          <span>Cantidad y presentacion</span>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="cantidad"
                v-mask="'#####'"
                label="Cantidad"
                filled
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                v-model="presentacion_producto"
                :items="lst_presentaciones_productos"
                item-value="id_producto_presentacion_pv"
                item-text="nombre"
                label="Presnetacion de producto"
                filled
              ></v-select>
            </v-col>
          </v-row>
          <span>Marca y observacion</span>
          <v-row>
            <v-col
              ><v-select
                v-model="marca_producto"
                :items="lst_marcas_asignar"
                item-value="id_marca_productos_pv"
                item-text="nombre"
                label="Marca"
                filled
              ></v-select>

              <v-select
                v-model="edificio"
                label="Area"
                filled
                :items="lst_edificios"
                item-value="cve_edificio"
                item-text="nombre"
              ></v-select>

              <v-select
                v-model="espacio_fisico"
                label="Lugar"
                filled
                :items="lst_espacios_fisicos"
                item-value="id_espacio_fisico"
                item-text="nombre"
              ></v-select>
            </v-col>
            <v-col
              ><v-textarea
                v-model="observacion"
                label="Observaciones"
                filled
                rows="7"
              ></v-textarea
            ></v-col>
          </v-row>

          <!-- <span>Espacio donde se adjudicara</span>
                    <v-row>
                        <v-col><v-select v-model="edificio" label="Edificio" filled :items="lst_edificios" item-value="cve_edificio"
                        item-text="nombre"></v-select></v-col>
                        <v-col><v-select v-model="espacio_fisico" label="Espacio" filled :items="lst_espacios_fisicos"
                        item-value="id_espacio_fisico" item-text="nombre"></v-select></v-col>
                    </v-row> -->
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" color="secondary" outlined>
            <v-icon>mdi-close</v-icon> close</v-btn
          >
          <v-btn @click="addProducto" color="secondary"
            ><v-icon class="mr-1">mdi-playlist-plus</v-icon> Agregar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog_nueva_existente" width="90%" persistent scrollable>
             <v-card>
              <v-toolbar color="secondary" dark>
                <v-toolbar-title>Requisiciones aprobadas</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog_nueva_existente=false,id_requisicion_existente=undefined"><v-icon>mdi-close</v-icon></v-btn>
              </v-toolbar>
              <v-card-text>

                <v-row>
                  <v-col cols="3">
                    <v-list>
                      <template v-for="requisicion_exis_ in lst_requisiciones_existentes">
                      <v-list-item @click="fnGetRequisicionExistDetalle(requisicion_exis_.id_requisicion_pv)">
                        <v-list-item-content>
                          <v-list-item-title>
                           <span>Folio: </span> {{ requisicion_exis_.folio }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ requisicion_exis_.observaciones }}
                          </v-list-item-subtitle>                        
                        </v-list-item-content>
                        <v-list-item-action>
                          {{ requisicion_exis_.fecha_solicitud }}
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider inset></v-divider>
                    </template>
                    </v-list>
                    
                  </v-col>
                  <v-divider vertical>
                  </v-divider>
                  <v-col>

                    <div class="d-flex redx mt-5">
                      <div class="d-flexx flex-columnx " style="width: 35%;">
                         <div style="height: 50%;"><span class="font-weight-bold accent--text text-subtitle-1">Folio:</span> {{ folio_existente }}</div>
                         <div style="height: 50%;"><span class="font-weight-bold accent--text text-subtitle-1">Fecha alta</span> {{fecha_existente}}</div>
                      </div>
                      <v-divider vertical class="mx-5"></v-divider>
                      <div class="greenx">
                        <div><span class="font-weight-bold accent--text text-subtitle-1">Solicito    </span> <span>{{solicito_existente[0]}}</span> <span class="font-weight-bold">{{solicito_existente[1]}}</span> <span class="font-italic">{{solicito_existente[2]}}</span></div>
                        <div><span class="font-weight-bold accent--text text-subtitle-1">Reviso      </span> <span>{{reviso_existente[0]}}</span><span class="font-weight-bold">{{reviso_existente[1]}}</span><span class="font-italic">{{reviso_existente[2]}}</span></div>
                        <div><span class="font-weight-bold accent--text text-subtitle-1">Autorizo    </span> <span>{{autorizo_existente[0]}}</span><span class="font-weight-bold">{{autorizo_existente[1]}}</span><span class="font-italic">{{autorizo_existente[2]}}</span></div>
                      </div>
                    </div>
                    
                    <!-- <v-simple-table>
                      <template v-slot:default>
                          <thead>
                            <tr>
                              <th>Folio</th>
                              <th>Fecha</th>
                              <th>Solicito</th>
                              <th>Reviso</th>
                              <th>Autorizo</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{{folio_existente}}</td>
                              <td>{{fecha_existente}}</td>
                              <td>{{solicito_existente}}</td>
                              <td>{{reviso_existente}}</td>
                              <td>{{autorizo_existente}}</td>
                            </tr>
                          </tbody>
                      </template>
                    </v-simple-table> -->

                    productos <v-divider></v-divider>

                    <v-simple-table>
                      <template v-slot:default>
                          <thead class="secondary">
                            <tr>
                              <th class="white--text">Cantidad</th>
                              <th class="white--text">Calve</th>
                              <th class="white--text">Producto</th>
                              <th class="white--text">Descripcion</th>
                              <th class="white--text">Marca</th>
                              <th class="white--text">Modelo</th>
                              <th class="white--text">Observacion</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="producotos_exist_ in lst_productos_requisicion_existentes">
                              <td>{{producotos_exist_.cantidad}}</td>
                              <td>{{producotos_exist_.clave}}</td>
                              <td>{{producotos_exist_.nombre}}</td>
                              <td>{{producotos_exist_.descripcion}}</td>
                              <td>{{producotos_exist_.marca}}</td>
                              <td>{{producotos_exist_.modelo}}</td>
                              <td>{{producotos_exist_.observaciones}}</td>
                            </tr>
                          </tbody>
                      </template>
                    </v-simple-table>



                  </v-col>
                </v-row>


              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <!-- <v-btn color="secondary" outlined>vinculada con ?</v-btn> -->
                <v-btn color="primary" :disabled="!Boolean(id_requisicion_existente)" @click="dialog_nueva_existente=false">continuar</v-btn>
              </v-card-actions>
             </v-card>
      </v-dialog>


  </div>
</template>

<script setup>
import { computed, ref, watch, getCurrentInstance, onMounted } from "vue";
import imagen from "./../../assets/punto_verde2.png";
import dayjs from "dayjs";
import numeral from "numeral";
import {
  allProductoByClaveName,
  findProductoById,
} from "@/services/producto_service";
import {
  createRequisicion,
  getDepartamentoAndColaboradores,
  getPersonaSolicitaRevisaAprueba,
  getPresentacionProductos,
  getMarcaAsignarService,
  getAllRequisicionByColaborador,
  getRequisicionExistDetalleService
} from "@/services/requisicion_service";
import {
  getEdificiosService,
  getEspacioFisicoByEdificioService,
  getEspacioFisicoFullService,
} from "@/services/edificio_service";
import debounce from "lodash/debounce";
// import {useValidacionRequisicion} from '@/composables/useValidacionRequisicion'

const props = defineProps({ id_actividad: { type: Number | String, default: 0 } });
const emit=defineEmits(['emit-close-requisicion'])

const root = getCurrentInstance().proxy;

// const {iValid,iErrors} =useValidacionRequisicion()

const search = ref("");
const producto = ref(0);

const getBreadcrumb = [
  {
    text: "Finanzas",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    text: "Proceso",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    text: "requisicion",
    disabled: true,
    href: "breadcrumbs_link_2",
  },
];

const lst_productos = ref([]);

const lst_productos_requisicion = ref([]);

const folio = ref(0);

const id_producto_pv = ref(0);
const clave = ref();
const nombre = ref();
const descripcion = ref();
const categoria = ref();
const subcategoria = ref();
const subsubcategoria = ref();
const medida_compra = ref();
const marca = ref();
const modelo = ref();
const foto = ref();
const tamano = ref();
const medida_producto = ref();
const piezas_contenido = ref();

const persona_revisa = ref();

const dialog = ref(false);

const dialog_revisa = ref(false);

const cantidad = ref(0);
const observacion = ref("");

const id_colaborador_solicita = ref(0);
const id_colaborador_revisa = ref(0);
const id_colaborador_aprueba = ref(0);

const departamento_text = ref();
const solicito_text = ref("");
const reviso_text = ref("");
const aprobo_text = ref("");

const lst_reviso = ref([]);

const edificio = ref();
const espacio_fisico = ref();

const lst_edificios = ref([]);
const lst_espacios_fisicos = ref([]);

const lst_presentaciones_productos = ref([]);
const lst_marcas_asignar = ref([]);

const marca_producto = ref();
const presentacion_producto = ref();



const dialog_nueva_existente=ref(false)

const lst_requisiciones_existentes=ref([])


const folio_existente=ref()
const fecha_existente=ref()
const solicito_existente=ref([])
const reviso_existente=ref([])
const autorizo_existente=ref([])

const lst_productos_requisicion_existentes=ref([])

const id_requisicion_existente=ref()




const cLstProducto = computed(() =>
  lst_productos.value.map((i) => ({
    value: i.id_producto_pv,
    text: i.nombre.toUpperCase(),
  }))
);



watch(
  search,
  debounce(async (value) => {
    if (value && value.length > 2) {
      lst_productos.value = await allProductoByClaveName(value.trim());
    }
  }, 500)
);

async function findProducto() {
  console.log("se busca el producto con id ", producto.value);
  try {
    const data = await findProductoById(producto.value);

    console.log(
      "🚀 ~ file: view_requisicion_producto.vue:449 ~ findProducto ~ data:",
      data
    );

    id_producto_pv.value = producto.value;
    clave.value = data.clave;
    nombre.value = data.nombre;
    descripcion.value = data.descripcion;
    categoria.value = data.categoria;
    subcategoria.value = data.subcategoria;
    subsubcategoria.value = data.subsubcategoria;
    medida_compra.value = data.medida_compra;
    marca.value = data.marca;
    modelo.value = data.modelo;
    foto.value = data.foto;
    tamano.value = data.tamano;
    medida_producto.value = data.medida_producto;
    piezas_contenido.value = data.piezas_contenido;

    observacion.value = data.observacion_requisicion;
  } catch (error) {
    console.log(error);
  }
}

function fnOpenAgregarProducto() {
  fnGetPresentacionProducto(producto.value);
  fnGetMarcaAsignar(producto.value);

  //if indica que ese producto ya esta agregado
  // if (lst_productos_requisicion.value.some((i) => i.id == producto.value)) {
  //   //se obtiene el indice del producto
  //   const index = lst_productos_requisicion.value.findIndex(
  //     (i) => i.id == producto.value
  //   );
  //   //se se obtiene la cantidad en ese momento
  //   const cantidad = lst_productos_requisicion.value[index].cantidad;
  //   //se modifica la pripiedad cantidad del objecto o producto con la nueva cantidad
  //   lst_productos_requisicion.value[index].cantidad = numeral(cantidad)
  //     .add(1)
  //     .value();
  // } else {
  //se limpia todo


  cantidad.value = undefined;
  // observacion.value = undefined;
  presentacion_producto.value = undefined;
  marca_producto.value = undefined;
  edificio.value = undefined;
  espacio_fisico.value = undefined;
  //se cierra el dialog
  dialog.value = true;
  // }
}

function addProducto(p) {
  lst_productos_requisicion.value.push({
    id: producto.value,
    cantidad: cantidad.value ?? 1,
    descripcion: nombre.value,
    observacion: observacion.value,
    espacio_fisico: espacio_fisico.value,
    presentacion: presentacion_producto.value,
    marca: marca_producto.value,
  });

  producto.value=undefined

  id_producto_pv.value = undefined;
  clave.value = undefined;
  nombre.value = undefined;
  descripcion.value = undefined;
  categoria.value = undefined;
  subcategoria.value = undefined;
  subsubcategoria.value = undefined;
  medida_compra.value = undefined;
  marca.value = undefined;
  modelo.value = undefined;
  foto.value = undefined;
  tamano.value = undefined;
  medida_producto.value = undefined;
  piezas_contenido.value = undefined;

  observacion.value = undefined;

  dialog.value = false;
}

async function fnCreateRequisicion() {

  try{

  const confirm=await root.$confirm('Desea crear la requision',{title:'info',width:350,persistent:true})
  if(!confirm)return;
  
  const persona_solicita = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
  const dataSend = {
    solicita: id_colaborador_solicita.value,
    revisa: id_colaborador_revisa.value,
    autoriza: id_colaborador_aprueba.value,
    productos: lst_productos_requisicion.value.map((i) => ({
      id: i.id,
      cantidad: i.cantidad,
      observacion: i.observacion,
      espacio_fisico: i.espacio_fisico,
      presentacion: i.presentacion,
      marca: i.marca,
    })),
    id_requisicion_existe:id_requisicion_existente.value,
    id_actividad:props.id_actividad
  };
  folio.value = await createRequisicion(dataSend);

  }
  catch(e){

  }
  
}

async function fnGetDepartamentoColaborador() {
  try {
    const persona_solicita = root.$ls.get("user", {
      cve_persona: 0,
    }).cve_persona;
    const data = await getDepartamentoAndColaboradores(persona_solicita);
    departamento_text.value = data.departamento.nombre;
    lst_reviso.value = data.colaboradores;
  } catch (error) {}
}

async function fnGetPersonaSolicitaRevisaAprueba() {
  try {
    const persona_solicita = root.$ls.get("user", {
      cve_persona: 0,
    }).cve_persona;
    const { solicita, revisa, aprueba } = await getPersonaSolicitaRevisaAprueba(
      persona_solicita
    );
    id_colaborador_solicita.value = solicita.id_colaborador;
    solicito_text.value = `${solicita.nombre} ${solicita.apellido_paterno} ${solicita.apellido_materno}`;

    id_colaborador_revisa.value = revisa.id_colaborador;
    reviso_text.value = `${revisa.nombre} ${revisa.apellido_paterno} ${revisa.apellido_materno}`;

    id_colaborador_aprueba.value = aprueba.id_colaborador;
    aprobo_text.value = `${aprueba.nombre} ${aprueba.apellido_paterno} ${aprueba.apellido_materno}`;

    console.log("   ->", solicita);
    console.log("revisa->", revisa);
    console.log("aprueba->", aprueba);
  } catch (error) {}
}

function SelectedReviso(p) {
  persona_revisa.value = p.cve_persona;
  reviso_text.value = `${p.nombre} ${p.apellido_paterno} ${p.apellido_materno}`;
  dialog_revisa.value = false;
}

async function fnGetEdificios() {
  try {
    lst_edificios.value = await getEdificiosService();
  } catch (error) {}
}

async function fnGetEspacioFisicoFull() {
  try {
    lst_espacios_fisicos.value = await getEspacioFisicoFullService();
  } catch (error) {}
}

async function fnGetPresentacionProducto(id) {
  try {
    lst_presentaciones_productos.value = await getPresentacionProductos(id);
  } catch (error) {}
}

async function fnGetMarcaAsignar(id) {
  try {
    lst_marcas_asignar.value = await getMarcaAsignarService(id);
  } catch (error) {}
}

onMounted(() => {
  const { nombre, apellido_paterno, apellido_materno } = root.$ls.get("user", {
    nombre: "-",
    apellido_paterno: "-",
    apellido_materno: "-",
  });
  // solicito_text.value=`${nombre} ${apellido_paterno} ${apellido_materno}`
  fnGetDepartamentoColaborador();
  fnGetPersonaSolicitaRevisaAprueba();
  fnGetEdificios();
  fnGetEspacioFisicoFull();
});




async function fnGetRequisicionesByColaborador()
  {
    try {
      const id_persona=root.$ls.get("user",{cve_persona:0}).cve_persona;
      lst_requisiciones_existentes.value=await getAllRequisicionByColaborador(id_persona)
      dialog_nueva_existente.value=true
    } catch (error) {
      
    }
  }

async function fnGetRequisicionExistDetalle(id_requisicion_){
   try {
    id_requisicion_existente.value=id_requisicion_
    const {requisicion:requisicion_,requisicion_productos}=await getRequisicionExistDetalleService(id_requisicion_)

    console.log("🚀 ~ file: view_requisicion_producto.vue:777 ~ fnGetRequisicionExistDetalle ~ requisicion_:", requisicion_);

    
    folio_existente.value=requisicion_.folio
    fecha_existente.value=requisicion_.fecha_solicitud
    solicito_existente.value=[requisicion_.nombre_solicita,requisicion_.paterno_solicita,requisicion_.materno_solicita]
    reviso_existente.value=[requisicion_.nombre_revisa,requisicion_.paterno_revisa,requisicion_.materno_revisa]
    autorizo_existente.value=[requisicion_.nombre_autoriza,requisicion_.paterno_autoriza,requisicion_.materno_autoriza]
    lst_productos_requisicion_existentes.value=requisicion_productos
   } catch (error) {
    
   }
}



function fnCloseRequisicion()
{

  folio.value=0
  lst_productos_requisicion.value=[]
  emit("emit-close-requisicion")
}

</script>

<style>
#table-requisicion table {
  /* border:1px solid #000; */
  border-collapse: collapse !important;
  border-radius: 10px !important;
}

#table-requisicion th {
  border: 1px solid #000;
  /* border-collapse: collapse!important; */
}

#table-requisicion td {
  border: 1px solid #000;
  /* border-collapse: collapse!important; */
}
</style>
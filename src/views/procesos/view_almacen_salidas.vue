<template>
    <div class="redx">

        <!-- <div class="d-flex justify-space-between">
            <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
                <template v-slot:divider>
                    <v-icon>mdi-chevron-right</v-icon>
                </template>
            </v-breadcrumbs>
            <h1 class="accent--text oswald--text">Catalogo Conceptos</h1>
        </div> -->

        <!-- <div class="d-flex justify-space-between mb-5">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small
                        dark elevation="1" @click="">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>Agregar Cuota</span>
            </v-tooltip>

            <Search v-model="search" :filters="filters" @emit-buscar="" />
        </div> -->

        <!-- <v-data-table :headers="headers" :items="lst_produtos" :search="search" :page.sync="page"
            :items-per-page="itemsPerPage" class="table-pv rounded-xl elevation-5" hide-default-footer>
            <template v-slot:top="{ pagination }">
                <div class="d-flex justify-end align-center">
                    <span class="mr-2 text-caption">filas por pagina</span>
                    <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
                    <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
                    <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
                </div>
            </template> -->

            <!-- <template v-slot:footer="{ props }">
                <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template> -->

            <!-- <template v-slot:item.tipo_cuota="{ item }">
        <span v-if="item.tipo_cuota == 1">Persona</span>
        <span v-else>Accion</span>
      </template>

      <template v-slot:item.precio="{ item }">
        <span class="font-weight-black accent--text number--text">
          {{numeral(item.precio).format("$0,0.[00]")}}
        </span>
      </template>

      <template v-slot:item.opcion_iva="{ item }">
        <span v-if="item.opcion_iva == 1">Iva Incluido</span>
        <span v-else>Mas Iva</span>
      </template>

      <template v-slot:item.genero_aplica="{ item }">
        <v-icon v-if="item.genero_aplica === 'H'">mdi-human-male</v-icon>
        <v-icon v-else-if="item.genero_aplica === 'M'">mdi-human-female</v-icon>
        <v-icon v-else>mdi-human-male-female</v-icon>
      </template>

      <template v-slot:item.edad_aplica="{ item }">
        {{ item.edad_aplica == 0 ? "NA" : `${item.edad_aplica} Años` }}
      </template>

      <template v-slot:item.obligatoria="{ item }">
        <span class="font-weight-bold" :class="{'primary--text':item.obligatoria,'secondary--text':!item.obligatoria}">{{item.obligatoria?'SI':'NO'}}</span>
      </template>

      <template v-slot:item.estatus="{ item }">
        <v-icon v-if="item.estatus" color="success">mdi-check-circle</v-icon>
        <v-icon v-else color="error">mdi-close-circle</v-icon>
      </template>
    
    -->

            <!-- <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-small icon outlined color="secondary" fab
                            @click="getProductoSalida(item.id_producto_pv)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
                    </template>
                    <span>Editar Cuota</span>
                </v-tooltip>
            </template>
        </v-data-table> -->

        <!-- <h1>almacen entradas</h1> -->

        <!-- <v-card v-for="(pedido, index) in lst_pedidos" :key="index"
            @click="saveEntradaAlmacen(pedido.id_pedido_almacen_pv)">
            <v-card-title>{{ pedido.nombre_comercial }}</v-card-title>
            <v-card-text>
                {{ pedido.folio }}
                {{ pedido.fecha_pedido }}
                {{ pedido.fecha_revision }}
            </v-card-text>
        </v-card> -->


        <!-- <v-dialog v-model="dialog_salida" fullscreen> -->
            <v-card color="purplex" style="height: calc(100vh - 150px)">
                <!-- <v-toolbar color="primary" dark>
                    <v-toolbar-title>Salida de Almacen</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon><v-icon>mdi-close</v-icon></v-btn> -->

                    <!-- <template v-slot:extension>
                        mexico
                    </template> -->
                <!-- </v-toolbar> -->
                <v-card-text class="d-flex pt-5">
                    <v-item-group v-model="producto_salida_seleccionado">
                        <v-text-field v-model="clave_producto" @keypress.enter="getProductoByClave" class="mr-2" outlined label="Buscar producto por clave" prepend-inner-icon="mdi-magnify"></v-text-field>
                        <div style="min-width: 300px;height: calc(100% ); row-gap: 15px;"
                        class="warninxg px-5 d-flex flex-column bluex">

                       

                            <template v-for="producto_salida in lst_producto_salida">
                                <v-item tag="div" v-slot="{ active, toggle }" :value="producto_salida">
                                    <v-card @click="toggle" class="rounded-xl"
                                        :style="[active ? { border: '5px solid var(--v-primary-base)', backgroundColor: 'primary' } : '']">

                                        <v-card-title class="primary rounded-xl">
                                            Folio ingreso:{{ producto_salida.id_almacen_entrada }}
                                        </v-card-title>
                                        <v-card-text>
                                            <v-row>
                                                <v-col cols="6" class="d-flex flex-column align-center">
                                                    <span>Cantidad</span>
                                                    <span class="font-weight-bold text-h5">{{
                                                        producto_salida.cantidad_restante }}</span>
                                                    <span>kilogramos</span>
                                                </v-col>
                                                <v-col cols="6" class="d-flex flex-column align-center">
                                                    <span>Piezas</span>
                                                    <span class="font-weight-bold text-h5">{{
                                                        producto_salida.piezas_restante }}</span>
                                                    <span>piezas</span>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-item>
                            </template>

                        </div>
                    </v-item-group>
                    <v-divider vertical></v-divider>
                    <div class="primaryx flex-grow-1 ml-5">

                        <v-card height="100%" class="rounded-xlx"
                            style="border:2px solid var(--v-secondary-base);border-radius: 30px;">
                            <v-toolbar elevation="0" color="secondaryx">
                                {{ /*producto_salida_seleccionado*/ }}
                                <v-toolbar-title class="text-h5 font-weight-bold">{{ nombre_producto }}</v-toolbar-title>
                            </v-toolbar>
                            <v-divider class="secondary"></v-divider>
                            <v-card-text class="px-16">
                                <span class="text-h4">En Stock</span>
                                <v-row style="column-gap: 35px;" class="mt-10">
                                    <v-col class="bluex d-flex justify-center flex-column align-center">
                                        <div class="text-h5">Cantidad de producto en existencia</div>
                                        <v-card color="grey lighten-2 rounded-xl" width="400">
                                            <v-card-text class="text-h1 text-center">
                                                {{ stock_cantidad_restante }}
                                            </v-card-text>
                                            <v-card-actions class="text-h3 justify-center">
                                                kilogramos
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                    <v-col v-if="stock_piezas_contenido>1" class="bluex d-flex justify-center flex-column align-center">
                                        <div class="text-h5">Piezas o contenido del producto en existencia</div>
                                        <v-card color="grey lighten-2 rounded-xl" width="400">
                                            <v-card-text class="text-h1 text-center">
                                                {{ stock_piezas_restante }}
                                            </v-card-text>
                                            <v-card-actions class="text-h3 justify-center">
                                                Piezas
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-card class="mt-10">
                                    <v-card-title>
                                        titulo
                                    </v-card-title>
                                    <v-card-text>

                                        <v-row>
                                            <v-col >                                             
                                                <v-item-group v-model="cantidad_or_pieza" mandatory class="d-flex align-center justify-center" style="column-gap: 15px;">
                                                    <v-item v-slot="{ active, toggle }" :value="true">
                                                    <v-card @click="toggle" height="100" class="flex-grow-1 text-h5 d-flex justify-center align-center font-weight-bold" :dark="active" :color="active?'secondary':'accent lighten-4'">UNIDAD</v-card>
                                                    </v-item>
                                                    <v-item  v-slot="{ active, toggle }" :value="false" v-if="stock_piezas_contenido>1">
                                                    <v-card @click="toggle" height="100" class="flex-grow-1 text-h5 d-flex justify-center align-center font-weight-bold" :dark="active" :color="active?'secondary':'accent lighten-4'">PIEZAS</v-card>
                                                    </v-item>                                        
                                                </v-item-group>
                                            </v-col>
                                            <v-col v-if="cantidad_or_pieza">
                                                <v-text-field v-model="cantidad" v-mask="'#########'" outlined
                                                     class="pv-size-input text-h3" :disabled="!stock_id_almacen_entrada"
                                                    height="100px" placeholder="Num Cantidad"></v-text-field>
                                               </v-col>
                                            <v-col v-else>                                                                                                                                                

                                                    <v-text-field v-model="piezas" v-mask="'#########'" outlined
                                                     class="pv-size-input text-h3" :disabled="!stock_id_almacen_entrada"
                                                    height="100px" placeholder="Num Piezas"></v-text-field>

                                                </v-col>
                                            
                                            <v-col>
                                                <v-btn @click="saveSalidaAlmacenPedido" block color="primary" class="text-h4 rounded-xl" style="height: 100px;" :loading="loading_salida" :disabled="!stock_id_almacen_entrada">
                                                    Salida
                                                    <template v-slot:loader>                                
                                                        <v-progress-circular indeterminate :size="50"></v-progress-circular>
                                                    </template>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-card-text>
                        </v-card>


                    </div>

                
                </v-card-text>
            </v-card>
        <!-- </v-dialog>-->

         <v-snackbar v-model="snackbar_open" color="info">
             <v-icon class="mr-2">mdi-information</v-icon>INFO: {{ snackbar_ }}
         </v-snackbar> 


    </div>
</template>
<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { getPedidosLibresService, saveEntradaAlmacenPedidoService, getProductosAlmacenService, getProductoExistenciaByIdService,saveSalidaAlmacenPedidoService } from '@/services/almacen_salida_service'
import {allProductoByClaveName} from '@/services/producto_service'
import numeral from 'numeral'

const stock_id_almacen_entrada=ref(0)
const stock_cantidad_restante=ref(0)
const stock_piezas_contenido=ref(0)
const stock_piezas_restante=ref(0)

const lst_produtos = ref([])

const lst_producto_salida = ref([])

const lst_pedidos = ref([])

const dialog_salida = ref(false)

const producto_salida_seleccionado = ref()

const cantidad = ref()
const piezas = ref()

const cantidad_or_pieza = ref(true)

const loading_salida=ref(false)

const headers = ref([
    { text: "Clave", align: "center", sortable: true, value: "clave" },
    { text: "Tipo", value: "nombre" },
    { text: "Concepto", value: "descripcion" },
    { text: "Precio", align: "right", value: "categoria" },
    { text: "Opción IVA", value: "subcategoria" },
    { text: "Genero aplica", value: "marca", align: "center" },
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

const snackbar_open=ref(false)
const snackbar_=ref('')

const id_producto_seleccionado=ref(0)


const clave_producto=ref('')

const nombre_producto=ref('')



onMounted(() => {
    // getPedidosLibres()
    getProductosAlmacen()
})


watch(producto_salida_seleccionado,(value,old_value)=>{
    if(Boolean(value))
    {
        stock_id_almacen_entrada.value=value.id_almacen_entrada
        stock_piezas_contenido.value=value.piezas_contenido
        stock_piezas_restante.value=value.piezas_restante
        stock_cantidad_restante.value=value.cantidad_restante 
    }
    else{
        stock_id_almacen_entrada.value=0
        stock_piezas_contenido.value=0
        stock_piezas_restante.value=0
        stock_cantidad_restante.value=0

        cantidad.value=''
        piezas.value=''
        cantidad_or_pieza.value=true
    }
})

watch(cantidad_or_pieza,()=>{
    cantidad.value=undefined
    piezas.value=undefined
})

async function getProductoByClave()
{
    try {
       const data= await allProductoByClaveName(clave_producto.value)
       if(data.length>0){
         const [prod] =data
         nombre_producto.value=prod.nombre
         getProductoSalida(prod.id_producto_pv)
       }
    } catch (error) {
        
    }
}

async function getPedidosLibres() {
    try {
        lst_pedidos.value = await getPedidosLibresService()
    } catch (error) {
        console.log(error)
    }
}

async function saveEntradaAlmacen(id_pedido) {
    try {
        await saveEntradaAlmacenPedidoService(id_pedido)
    } catch (error) {

    }
}

async function getProductosAlmacen() {
    try {
        lst_produtos.value = await getProductosAlmacenService({});
    } catch (error) {

    }
}

async function getProductoSalida(id_producto) {
    id_producto_seleccionado.value=id_producto;
    try {        
        const data = await getProductoExistenciaByIdService(id_producto)
        if(data.length){
            lst_producto_salida.value=data
            dialog_salida.value = true
        }
        else{
            snackbar_open.value=true;
            snackbar_.value="SIN STOCK DISPONIBLE"
        }
    } catch (error) {
   console.log(error)
    }
}

async function saveSalidaAlmacenPedido(){
    loading_salida.value=true
try {
    console.log("salida save...")
    const data=await saveSalidaAlmacenPedidoService(stock_id_almacen_entrada.value,{cantidad:cantidad.value,piezas:piezas.value})
    if(data?.code>0)
    {
        const data_ = await getProductoExistenciaByIdService( id_producto_seleccionado.value)
        if(data_.length){
            console.log(data_)
            lst_producto_salida.value=data_
            cantidad.value=''
            piezas.value=''
            cantidad_or_pieza.value=true
            producto_salida_seleccionado.value=undefined
            snackbar_open.value=true
            snackbar_.value=data?.message??'na'
        }
        else{
            lst_producto_salida.value=[]
            cantidad.value=''
            piezas.value=''
            cantidad_or_pieza.value=true
            producto_salida_seleccionado.value=undefined
            snackbar_open.value=true
            snackbar_.value=data?.message??'na'
            dialog_salida.value=false
        }

    }
    else{
        snackbar_open.value=true
        snackbar_.value=data?.message??'na'
    }
} catch (error) {
    console.log(error)
}
finally{
    loading_salida.value=false
}
}

</script>

<style scope>
.pv-size-input input[type='text'] {
    /* background-color: red; */
    min-height: 100%;
}
</style>
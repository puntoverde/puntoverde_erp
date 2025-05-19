<template>
    <div>
        <v-card>
            <v-toolbar color="primary" elevation="0" extension-height="100">
                <v-btn color="secondary" class="rounded-pill" @click="fnPedidoSinRevision"> <v-icon>mdi-magnify</v-icon>
                    Seleccionar
                    pedidos sin revision</v-btn>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="dialog_finalizar = true" v-on="on" v-bind="attrs" color="secondary"
                            :disabled="!pedido_selected" class="mx-1 rounded-pill">
                            <v-icon>mdi-check-circle-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Finalizar revision</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn iconx @click="open" outlinedx v-on="on" v-bind="attrs" color="secondary"
                            :disabled="!pedido_selected" class="mx-1 rounded-pill">
                            <v-icon>mdi-file-document-multiple</v-icon>
                        </v-btn>
                    </template>
                    <span>Agregar factura fiscal</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn iconx @click="dialog_notas = true" outlinedx v-on="on" v-bind="attrs" color="secondary"
                            class="mx-1 rounded-pill" :disabled="!pedido_selected">
                            <v-icon>mdi-notebook-edit-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Agregar notas a la revision</span>
                </v-tooltip>

                <template v-slot:extension>
                    <div style="width: 100%;">
                        <v-row class="redx">
                            <v-col class="white--text text-h6">Folio: <span v-if="pedido_selected">{{ pedido_selected.folio
                            }}</span></v-col>
                            <v-col class="white--text text-h6">Fecha pedido: <span v-if="pedido_selected">{{
                                pedido_selected.fecha_pedido ?? '' }}</span></v-col>
                            <v-col class="white--text text-h6">Proveedor: <span v-if="pedido_selected">{{
                                pedido_selected.nombre_comercial ?? '' }}</span></v-col>
                            <v-col class="white--text text-h6">RFC:<span v-if="pedido_selected"> {{ pedido_selected.rfc ??
                                ''
                            }}</span></v-col>
                        </v-row>
                        <v-row class="bluex">
                            <span class="text-h6 white--text">Domicilio:</span>
                            <v-col v-if="pedido_selected" class="white--text">Calle: {{ pedido_selected.calle ?? '' }} # {{
                                pedido_selected.n_ext ?? '' }} {{ pedido_selected.n_int ?? '' }}, cp:({{ pedido_selected.cp
        ?? ''
    }}) colonia: {{ pedido_selected.nombre ?? '' }}</v-col>
                        </v-row>
                    </div>
                </template>

            </v-toolbar>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr class="secondary">
                            <th class="white--text">clave</th>
                            <th class="white--text">Producto</th>
                            <th class="white--text">Descripion</th>
                            <th class="white--text">Marca</th>
                            <th class="white--text">Modelo</th>
                            <th class="white--text">Cantidad entrega</th>
                            <th class="white--text">Especificacion compra</th>
                            <th class="white--text">Precio unitario</th>
                            <th class="white--text">Descuento</th>
                            <th class="white--text">Descuento porcentaje</th>
                            <th class="white--text">Observacion</th>
                            <th class="white--text">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(producto, index) in lst_productos">
                         
                            <tr :class="{'tealx orange  lighten-4':producto.sustitucion_producto > 0,'teal lighten-4':(producto.agregado_revision&&producto.estatus_revision==1),'error lighten-4':(producto.agregado_revision&&producto.estatus_revision==0)}">
                                <td>{{ producto.clave }}</td>
                                <td>{{ producto.nombre_producto }}</td>
                                <td>{{ producto.descripcion }}</td>
                                
                                
                                <td><div class="d-flex"> {{ producto.marca }} 
                                    <v-menu :close-on-content-click="false">
                                        <template v-slot:activator="{on,attrs}">
                                            <v-btn icon x-small v-on="on" v-bind="attrs" @click="lst_marcas=[]"><v-icon>mdi-pencil</v-icon></v-btn>
                                        </template>
                                        <v-card>
                                            <v-toolbar color="secondary" elevation="0">
                                                <v-text-field hide-details solo @keyup.enter="fnFindMarcas"></v-text-field>
                                            </v-toolbar>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-item v-for="(marca_,index_) in lst_marcas" :key="`${index_}-marca`" @click="fnCambiarMarca(marca_.id_marca_productos_pv,producto.id_requisicion_producto_pv,marca_.nombre)">
                                                        <v-list-item-content>
                                                            <v-list-item-title>
                                                            {{ marca_.nombre }}
                                                            </v-list-item-title>
                                                        </v-list-item-content>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </v-menu> 
                                </div></td>
                                <td>
                                    <!-- <div class="d-flex">  -->
                                    {{ producto.modelo }} 
                                    <!-- <v-btn icon x-small><v-icon>mdi-pencil</v-icon></v-btn> </div> -->
                                </td>
                                <td>
                                    <v-text-field v-model="producto.cantidad_entregada" v-mask="'#######'" outlined dense
                                        hide-details v-if="producto.agregado_revision == 0"></v-text-field>
                                    <span v-else> {{ producto.cantidad_entregada }}</span>
                                </td>
                                <td>
                                    {{ producto.presentacion_compra }}
                                </td>
                                <td>
                                    <v-text-field v-model="producto.costo_producto"
                                        v-currency="{ currency: 'USD', locale: 'en' }" outlined dense hide-details
                                        v-if="producto.agregado_revision == 0"></v-text-field>
                                    <span v-else> {{ numeral(producto.costo_producto).format("$0,0[.]00") }}</span>
                                </td>
                                <td>
                                    <v-text-field v-model="producto.descuento"
                                        v-currency="{ currency: 'USD', locale: 'en' }" outlined dense hide-details
                                        v-if="producto.agregado_revision == 0"></v-text-field>
                                    <span v-else> {{ numeral(producto.descuento).format("$0,0[.]00") }}</span>
                                </td>
                                <td>
                                    <v-text-field v-model="producto.descuento_porcentaje" v-mask="'###'" outlined dense
                                        hide-details v-if="producto.agregado_revision == 0"></v-text-field>
                                    <span v-else> {{ numeral(producto.descuento_porcentaje).divide(100).format("0%")
                                    }}</span>
                                </td>
                                <td>
                                    <v-textarea v-model="producto.descripcion_revision" rows="2" filled hide-details
                                        outlined v-if="producto.agregado_revision == 0"></v-textarea>
                                    <span v-else> {{ producto.descripcion_revision }}</span>
                                </td>
                                <td style="width: 200px;">

                                    <template v-if="producto.agregado_revision == 0">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon color="success" outlined v-on="on" class="mr-1"
                                                    @click="fnAceptarProducto(producto)"><v-icon>mdi-check-circle</v-icon></v-btn>
                                            </template>
                                            <span>Aceptar Producto</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon color="error" outlined class="mx-1" v-on="on"
                                                    @click="fnRechazarProducto(producto)"><v-icon>mdi-cancel</v-icon></v-btn>
                                            </template>
                                            <span>Rechazar Producto</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon color="warning" outlined v-on="on" class="mx-1"
                                                    @click="openCambio(producto)"><v-icon>mdi-swap-horizontal</v-icon></v-btn>
                                            </template>
                                            <span>Cambio nuevo producto</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon color="info" outlined v-on="on" class="ml-1"
                                                    @click="openCambioProveedor(producto.id_pedido_almacen_producto_pv)"><v-icon>mdi-account-convert-outline</v-icon></v-btn>
                                            </template>
                                            <span>Cambio nuevo proveedor</span>
                                        </v-tooltip>
                                    </template>
                                    <v-chip v-else
                                        :color="producto.estatus_revision == 0 ? 'error' : producto.estatus_revision == 1 ? 'success' : 'warning'">
                                        <v-icon left v-if="producto.estatus_revision == 1">mdi-check</v-icon>
                                        <v-icon left v-else-if="producto.estatus_revision == 0">mdi-close</v-icon>
                                        <v-icon left v-else>mdi-file-refresh</v-icon>
                                        <span v-if="producto.estatus_revision == 1">aceptado</span>
                                        <span v-else-if="producto.estatus_revision == 0">rechazado</span>
                                        <span v-else>cambiado</span>
                                    </v-chip>
                                </td>
                            </tr>
                            <tr v-if="producto.sustitucion_producto > 0">
                                <td colspan="11" style="border-left: 5px solid #000; min-width:100%" class="tealx orange  lighten-5 xwhite--text">
                                    <div class="d-flex justify-space-around">
                                        <span><span class=" text-subtitle-1 font-weight-bold">Producto:</span> <span class="text-subtitle-1">{{ producto.nombre_producto_sustituye }}</span></span>
                                        <span><span class=" text-subtitle-1 font-weight-bold">Folio:</span> <span class="text-subtitle-1">{{ producto.clave_producto_sustituye }}</span></span>
                                        <span><span class=" text-subtitle-1 font-weight-bold">Cantidad:</span> <span class="text-subtitle-1">{{ producto.cantidad_producto_sustituye }}</span></span>
                                        <span><span class=" text-subtitle-1 font-weight-bold">Costo:</span> <span class="text-subtitle-1">{{ numeral(producto.costo_producto_sustituye).format('$0,0[.]00') }}</span></span>
                                    </div>
                                    </td>
                            </tr>
                        </template>
                    </tbody>
                </template>
            </v-simple-table>

        </v-card>


        <v-dialog v-model="dialog" width="500">
            <v-card>
                <v-toolbar color="primary" dark>
                    <v-toolbar-title>Pedidos Disponibles</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-list>
                    <v-list-item-group v-model="pedido_selected">
                        <v-list-item v-for="pedido in lst_pedidos_disponibles" :value="pedido"
                            @click="getProductosByPedido(pedido.id_pedido_almacen_pv)">
                            <v-list-item-avatar color="secondary" class="white--text">
                                {{ pedido.folio }}
                            </v-list-item-avatar>
                            <v-list-item-content>
                                <v-list-item-title>{{ pedido.nombre_comercial }}</v-list-item-title>
                                <v-list-item-subtitle>{{ pedido.fecha_pedido }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>

            </v-card>
        </v-dialog>


        <v-dialog v-model="dialog_cambio" width="500">
            <v-card>
                <v-toolbar color="secondary" dark>
                    <v-toolbar-title>busque Producto que sustituye</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeDialogCambiar"> <v-icon>mdi-close</v-icon></v-btn>
                    <template v-slot:extension>
                        <div class="redx d-flex align-center" style="width: 100%;column-gap: 10px;">
                            <v-text-field v-model="search_producto" dense hide-details solo-inverted
                                prepend-inner-icon="mdi-magnify" @keypress.enter="fnAllProductoByClaveName"></v-text-field>
                            <v-btn color="primary"><v-icon>mdi-plus</v-icon></v-btn>
                        </div>
                    </template>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-window v-model="wind">
                        <v-window-item>
                            <v-list>
                                <v-list-item v-for="prod_change  in lst_producto_cambio" @click="wind=1;prod_cambio_id=prod_change.id_producto_pv;prod_cambio_text=prod_change.nombre">
                                    <v-list-item-avatar tile color="primary" style="width:100px"
                                        class="rounded font-weigth-bold white--text">
                                        {{ prod_change.clave }}
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>{{ prod_change.nombre }}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-window-item>
                        <v-window-item>
                           producto:<span>{{ prod_cambio_text }}</span>
                           <v-text-field v-model="prod_cambio_cantidad" label="cantidad" v-mask="'###'"></v-text-field>
                           <v-text-field v-model="prod_cambio_costo" label="costo" v-currency="{ currency: 'USD', locale: 'en' }"></v-text-field>
                           <v-btn block color="secondary" @click="fnCambioProducto">Guardar</v-btn>
                        </v-window-item>
                    </v-window>

                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_finalizar" width="500">
            <v-card>
                <v-toolbar color="secondary" dark>
                    <v-toolbar-title>finalize revision de producto</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_finalizar = false"> <v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-text-field v-model="ieps" label="ieps" :error-messages="iErrors.ieps"
                        v-currency="{ currency: 'USD', locale: 'en' }"></v-text-field>
                    <v-text-field v-model="iva" label="iva" :error-messages="iErrors.iva"
                        v-currency="{ currency: 'USD', locale: 'en' }"></v-text-field>
                    <v-text-field v-model="subtotal" label="subtotal" :error-messages="iErrors.subtotal"
                        v-currency="{ currency: 'USD', locale: 'en' }"></v-text-field>
                    <v-text-field v-model="total" label="total" :error-messages="iErrors.total"
                        v-currency="{ currency: 'USD', locale: 'en' }"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="secondary" block @click="fnPedidoFinalizarRevision">finalizar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_notas" width="500">
            <v-card>
                <v-toolbar :color="iErrorsNota.id_pedido ? 'warning' : 'secondary'" dark>
                    <v-toolbar-title>Agergar Nota</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_notas = false"> <v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-textarea label="Nota descripcion" v-model="descripcion_nota" filled
                        :error-messages="iErrorsNota.nota"></v-textarea>
                    <v-btn :color="Boolean(files_nota) ? 'success' : 'info'" @click="openNota"><v-icon
                            class="mr-2">mdi-paperclip</v-icon>cargar nota</v-btn>
                    <span v-if="iErrorsNota.nota_file">
                        {{ iErrorsNota.nota_file }}
                    </span>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="secondary" block @click="fnAgregarNota">finalizar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_proveedor" width="500">
            <v-card>
                <v-toolbar color="secondary" dark>
                    <v-toolbar-title>Cambio Proveedor{{ proveedor_selected }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog_proveedor = false"> <v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-list>
                    <v-list-item-group v-model="proveedor_selected">
                    <v-list-item v-for="provee in lst_proveedores" :value="provee.id_proveedor">
                        <v-list-item-content>
                            <v-list-item-title>{{ provee.nombre_comercial }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                   </v-list-item-group>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="secondary" block @click="fnCambiarProveedor" :disabled="!proveedor_selected">Cambiar Proveedor</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar_selected" type="warning">
            selecciona un pedido para finalizar
        </v-snackbar>

        <v-snackbar v-model="snackbar_finalizar_ok" type="success">
            finalizo correctamente la revison del pedido
        </v-snackbar>

        <v-snackbar v-model="snackbar_finalizar_fail" type="error">
            no se puede finalizar porque aun hay produictos sin revision
        </v-snackbar>

        <v-snackbar v-model="snackbar_cambio_proveedor" type="error">
            se cambio el proveedor con exito
        </v-snackbar>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useValidacionRevision } from '@/composables/useValidacionRevision'
import { useValidacionRevisionNota } from '@/composables/useValidacionRevisionNota'
import { pedidoSinRevision, pedidoRevision, pedidoAceptarProducto, pedidoRechazarProducto, pedidoCambiarProducto, pedidoCancelar, pedidoFinalizarRevisionService, pedidoAgregarNotaService, pedidoAgregarFactura,cambiarProveedor,cambiarMarcaService } from '@/services/pedidos_service'
import { allProductoByClaveName } from '@/services/producto_service'
import { allProveedor, } from '@/services/proveedor_service'
import { allMarcaProductoByNameService } from '@/services/marca_producto_service'
import { useFileDialog } from '@vueuse/core'
import numeral from 'numeral'

const { iValid, iErrors } = useValidacionRevision()
const { iValid: iValidNota, iErrors: iErrorsNota } = useValidacionRevisionNota()
const { files, onChange, open, reset } = useFileDialog()
const { files: files_nota, onChange: onChangeNota, open: openNota, reset: resetNota } = useFileDialog()

const lst_pedidos_disponibles = ref([])
const lst_productos = ref([])
const dialog = ref(false)
const dialog_cambio = ref(false)
const dialog_finalizar = ref(false)
const dialog_notas = ref(false)
const dialog_proveedor = ref(false)
const pedido_selected = ref()
const lst_producto_cambio = ref([])

const ieps = ref()
const iva = ref()
const subtotal = ref()
const total = ref()

const descripcion_nota = ref()

const search_producto = ref('')

const snackbar_selected = ref(false)
const snackbar_finalizar_ok = ref(false)
const snackbar_finalizar_fail = ref(false)
const snackbar_cambio_proveedor = ref(false)

const wind=ref(0)

const prod_cambio_id=ref(0)
const prod_cambio_text=ref('')
const prod_cambio_cantidad=ref(0)
const prod_cambio_costo=ref(0)

const prod_selected=ref()
const pedido_prod_selected=ref()


const lst_proveedores=ref([])
const proveedor_selected=ref()

const lst_marcas=ref([])

onMounted(async () => {
    fnGetProveedores()
})

onChange(async () => {
    let id_pedido = 0;
    if (Boolean(pedido_selected.value)) id_pedido = pedido_selected.value.id_pedido_almacen_pv
    const [factura] = files.value


    if (factura.type == 'application/pdf' && id_pedido > 0) {
        await pedidoAgregarFactura(id_pedido, factura)
    }
    else {
        alert('no es un pdf')
    }

})

async function fnPedidoSinRevision() {
    try {
        lst_pedidos_disponibles.value = await pedidoSinRevision()
        dialog.value = true
    } catch (error) {

    }
}

async function getProductosByPedido(id) {
    try {
        lst_productos.value = await pedidoRevision(id)
        dialog.value = false
    } catch (error) {

    }
}

async function fnAceptarProducto(prod) {
    const data_send = {
        id: prod.id_pedido_almacen_producto_pv,
        descripcion: prod.descripcion_revision,
        cantidad: prod.cantidad_entregada,
        costo: numeral(prod.costo_producto).value(),
        descuento: numeral(prod.descuento).value(),
        descuento_porcentaje: prod.descuento_porcentaje
    }
    try {
        prod.agregado_revision = await pedidoAceptarProducto(data_send);
        prod.estatus_revision = 1;
    } catch (error) {

    }
}

async function fnRechazarProducto(prod) {

    const data_send = {
        id: prod.id_pedido_almacen_producto_pv,
        descripcion: prod.descripcion_revision,
        cantidad: prod.cantidad_entregada,
        costo: prod.costo_producto
    }
    try {
        prod.agregado_revision = await pedidoRechazarProducto(data_send)
        prod.estatus_revision = 0;
    } catch (error) {

    }
}

function openCambio(prod) {
    prod_selected.value=prod
    dialog_cambio.value = true
}

function openCambioProveedor(pedido_producto) {
    pedido_prod_selected.value=pedido_producto
    dialog_proveedor.value = true
}

async function fnCambioProducto()
{
console.log('cambia producto')


    const data_send = {
        id: prod_selected.value.id_pedido_almacen_producto_pv,
        descripcion: prod_selected.value.descripcion_revision,
        cantidad: prod_selected.value.cantidad_entregada,
        costo: numeral(prod_selected.value.costo_producto).value(),
        descuento: numeral(prod_selected.value.descuento).value(),
        descuento_porcentaje: prod_selected.value.descuento_porcentaje,
        id_producto:prod_cambio_id.value,
        costo_producto:numeral(prod_cambio_costo.value).value(),
        cantidad_producto:prod_cambio_cantidad.value        
    }

    console.log(data_send)

    try {
        prod_selected.value.agregado_revision=await pedidoCambiarProducto(data_send)
        prod_selected.value.estatus_revision=2
        prod_selected.value.sustitucion_producto=1//puede ser otro numero pero se pone mientras el uno para indicar que se cambio de producto
        // id_pedido_almacen_producto_pv
    } catch (error) {
        console.log(error)
    }
}

async function fnAllProductoByClaveName() {
    try {
        lst_producto_cambio.value = await allProductoByClaveName(search_producto.value);
    } catch (error) {

    }
}


async function fnPedidoFinalizarRevision() {
    try {


        const data_send = {
            ieps: ieps.value,
            iva: iva.value,
            subtotal: subtotal.value,
            total: total.value
        }

        console.log('Data Send:', data_send)

        const data_valid = await iValid(data_send)

        console.log(data_valid)

        if (pedido_selected.value !== undefined) {
            console.log("existe")
            const data = await pedidoFinalizarRevisionService(pedido_selected.value.id_pedido_almacen_pv, data_valid)
            if (data === 1) {
                snackbar_finalizar_ok.value = true;
                dialog_finalizar.value = false
            }
            else snackbar_finalizar_fail.value = true;
        }
        else {
            snackbar_selected.value = true
            console.log("no existe")
            return
        }
    } catch (error) {
        console.log(error)
    }
}

async function fnAgregarNota() {
    let nota_file = ''
    let id_pedido = 0
    console.log('existe data', Boolean(files_nota.value))
    if (Boolean(pedido_selected.value)) id_pedido = pedido_selected.value.id_pedido_almacen_pv
    if (Boolean(files_nota.value)) nota_file = files_nota.value[0]
    console.log('nota_file:', nota_file)
    try {
        const data_valid = await iValidNota({ id_pedido, nota: descripcion_nota.value, nota_file })
        console.log('data_valid:', data_valid)
        await pedidoAgregarNotaService(id_pedido, data_valid)
    } catch (error) {
        alert(error)
    }
}


function closeDialogCambiar()
{
    prod_cambio_id.value=0
    prod_cambio_text.value=0
    prod_cambio_costo.value=0
    prod_cambio_cantidad.value=0
    search_producto.value=''
    wind.value=0
    dialog_cambio.value=false
}


async function fnGetProveedores()
{
    lst_proveedores.value=await  allProveedor()
}

async function fnCambiarProveedor()
{
try {
   const data= await cambiarProveedor(pedido_prod_selected.value,proveedor_selected.value)
   if(data)snackbar_cambio_proveedor.value=true
   pedido_prod_selected.value=undefined
   proveedor_selected.value=undefined
   dialog_proveedor.value=false
} catch (error) {
    
}
}



async function fnFindMarcas(event)
{
   const name=event.target.value
   const data=await allMarcaProductoByNameService(name)
   event.target.value=''
   lst_marcas.value=data
}

async function fnCambiarMarca(id_marca,id_producto_requisicion,nombre)
{
    try {
        await cambiarMarcaService(id_producto_requisicion,id_marca)
        const index_=lst_productos.value.findIndex(i=>i.id_requisicion_producto_pv==id_producto_requisicion);
        if(index_ !== -1) lst_productos.value[index_].marca=nombre

    } catch (error) {
        
    }

}

</script>
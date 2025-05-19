<template>
    <div class="white mx-16 px-5 py-5 elevation-1" id="orden_compra_html">

        <v-speed-dial v-model="fab" direction="bottom" top left absolute>
            <template v-slot:activator>

                <v-btn fab color="secondary" :loading="loading">
                    <!-- <v-icon>mdi-magnify</v-icon> -->
                    <v-icon v-if="fab">
                        mdi-close
                    </v-icon>
                    <v-icon v-else>
                        mdi-plus
                    </v-icon>
                </v-btn>
            </template>

            <v-btn fab dark small color="info" @click="openDialog">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-btn fab dark small color="primary" @click="saveOrdenCompra" v-if="!is_orden && id_pedido">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <!-- v-if="is_orden && id_pedido" -->
            <v-btn fab dark small color="grey" @click="printer">
                <v-icon>mdi-printer</v-icon>
            </v-btn>
        </v-speed-dial>


        <div class="cabecera-orden bluex d-flex justify-space-between align-center pl-10 ">
            <v-img :src="logo" max-width="150" max-height="150" style="filter: grayscale(100%);"></v-img>
            <div class="d-flex flex-column align-center">
                <span class="font-weight-bold text-h4">PUNTO VERDE DE LEÓN, S.A. DE C.V.</span>
                <span class="text-cabcera">CLUB DEPORTIVO Y SOCIAL</span>
                <span class="text-cabcera">R.F.C. PLV-810617-EC3</span>
                <span class="text-cabcera">BLVD. PUNTO VERDE No. 314 COL. PUNTO VERDE</span>
                <span class="text-cabcera">TEL (477)711-12-93 y 711-18-67</span>
                <span class="text-cabcera">C.P. 37289 LEÓN, GTO.</span>
            </div>
            <div class="orden-folio d-flex flex-column align-center justify-center align-self-end">
                <span class="font-weight-bold text-h6">ORDEN DE COMPRA</span>
                <span class="font-weight-bold text-h4">{{ is_orden ? is_orden : '-' }}</span>
            </div>
        </div>

        <table class="table-productos">
            <thead>
                <tr>
                    <th rowspan="4" colspan="4" style="width: 50%;">
                        <div class="d-flex flex-column">
                            <span class="text-h5 font-weight-bold">PROVEEDOR</span>
                            <span>{{ nombre_comercial }}</span>
                        </div>
                    </th>
                    <th style="width: 25%;" class="text-h6 font-weight-bold">FECHA DE PEDIDO</th>
                    <th colspan="2" class="text-h6 font-weight-bold">FECHA DE ENTREGA</th>
                </tr>
                <tr>
                    <th>{{ fecha_pedido }}</th>
                    <th colspan="2">{{ fecha_revision }}</th>
                </tr>
                <tr>
                    <th>PEDIDO No.</th>
                    <th colspan="2">{{ folio }}</th>
                </tr>
                <tr>
                    <th colspan="3" class="text-left pl-2">CONDICIONES DE PAGO:</th>

                </tr>
                <tr>
                    <th style="width: 5%;">No.</th>
                    <th style="width: 10%;">CANTIDAD</th>
                    <th style="width: 10%;">UNIDAD</th>
                    <th colspan="2">DESCRIPCIÓN</th>

                    <th>PRECIO UNIT.</th>
                    <th>IMPORTE</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(producto, index) in lst_productos">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">{{ producto.cantidad }}</td>
                    <td class="text-center">{{ producto.unidad }}</td>
                    <td colspan="2">{{ producto.nombre }} , {{ producto.descripcion }}</td>
                    <td class="text-right font-weight-bold">{{ numeral(producto.costo).format('$0,0[.]00') }}</td>
                    <td class="text-right font-weight-bold">{{ numeral(producto.cantidad *
                        producto.costo).format('$0,0[.]00')
                    }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="5">
                        <span class="absolute left">ÁREA SOLICITANTE:</span>
                    </th>
                    <th>SUB-TOTAL:</th>
                    <th>{{ numeral(sub_total).format('$0,0[.]00') }}</th>
                </tr>
                <tr>
                    <th colspan="5" rowspan="2">
                        <div class="text-left text-fontweigth-bold">OBSERVACIONES:</div>
                        <v-textarea filled hide-details v-model="observaciones" v-if="!is_orden"></v-textarea>
                        <span v-else>{{ observaciones }}</span>
                    </th>
                    <th>I.V.A.</th>
                    <th>{{ numeral(iva).format('$0,0[.]00') }}</th>
                </tr>
                <tr>
                    <th>TOTAL:</th>
                    <th>{{ numeral(total).format('$0,0[.]00') }}</th>
                </tr>
            </tfoot>
        </table>

        <div class="redx mt-15 d-flex" style="justify-content: space-evenly;">

            <div class="d-flex flex-column firmas-span">
                <div style="border-bottom: 1px solid #000;">{{ firma_elaboro_text }}</div>
                <div>ELABORÓ</div>
            </div>

            <div class="d-flex flex-column firmas-span">
                <div style="border-bottom: 1px solid #000;">{{ firma_reviso_text }}</div>
                <div>REVISÓ</div>
            </div>

            <div class="d-flex flex-column firmas-span">
                <div style="border-bottom: 1px solid #000;">{{ firma_autorizo_text }}</div>
                <div>AUTORIZÓ</div>
            </div>
        </div>
        <div class="text-center my-5 text-h5 font-weight-bold">
            AUTORIZACIÓN DE TRANSFERENCIA
        </div>

        <div>
            <span class="span-tranferencia-title">PAGO A:</span>
            <span class="span-tranferencia">{{ nombre_comercial }}</span>
        </div>
        <div>
            <span class="span-tranferencia-title">LA CANTIDAD DE:</span>
            <span class="span-tranferencia">
                {{ numeral(total).format('$0,0[.]00') }}
            </span>
        </div>
        <div>
            <span class="span-tranferencia-title">POR CONCEPTO DE:</span>
            <span class="span-tranferencia">{{ pago_concepto }}</span>
        </div>

        <div class="redx mt-15 d-flex" style="justify-content: space-evenly;">

            <div class="d-flex flex-column firmas-span">
                <div style="border-bottom: 1px solid #000;">{{ firma_finanzas_text }}</div>
                <div>REVISADO FINANZAS</div>
            </div>

            <div class="d-flex flex-column firmas-span">
                <div style="border-bottom: 1px solid #000;">{{ firma_uno_text }}</div>
                <div>FIRMA AUTORIZADA 1</div>
            </div>

            <div class="d-flex flex-column firmas-span">
                <div style="border-bottom: 1px solid #000;">{{ firma_dos_text }}</div>
                <div>FIRMA AUTORIZADA 2</div>
            </div>
        </div>




        <v-dialog v-model="dialog" width="500" persistent scrollable>
            <v-card>
                <v-toolbar color="secondary" dark elevation="0">
                    <v-toolbar-title>
                        Pedidos Disponibles
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-divider class="primary" style="min-height:3px"></v-divider>
                <v-card-text class="px-0">

                <v-list>
                    <v-list-item v-for="pedido in lst_pedidos_revisados" :key="pedido.folio" @click="getPedidoDetalle(pedido.id_pedido_almacen_pv)">
                        <v-list-item-content>
                            <v-list-item-title>{{ pedido.nombre_comercial }}</v-list-item-title>
                            <v-list-item-subtitle><v-chip>folio:{{ pedido.folio }}</v-chip> fecha pedido:{{
                                pedido.fecha_pedido }} fecha revision:{{ pedido.fecha_revision }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            {{ numeral(pedido.total).format('$0,0[.]00') }}
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>



        <div id="printleo"></div>


    </div>
</template>

<script setup>
import { ref } from 'vue'
import logo from '@/assets/punto_verde2.png'
import numeral from 'numeral'
import printJs from 'print-js'
import { getOrdenCompraService, allPedidosRevisadosService, saveOrdenCompraService } from '@/services/orden_compra_service'
import { el as $dom, setStyle as $setStyle, setChildren as $setChildren, list as $list } from 'redom'
import chunk from 'lodash/chunk'

const lst_pedidos_revisados = ref([])


const nombre_comercial = ref('')
const descripcion = ref('')
const fecha_pedido = ref('')
const fecha_revision = ref('')
const folio = ref('')

const is_orden = ref()
const pago_concepto = ref()

const ieps = ref()
const iva = ref()
const sub_total = ref()
const total = ref()

const observaciones = ref()

const firma_elaboro = ref()
const firma_reviso = ref()
const firma_autorizo = ref()
const firma_finanzas = ref()
const firma_uno = ref()
const firma_dos = ref()

const firma_elaboro_text = ref()
const firma_reviso_text = ref()
const firma_autorizo_text = ref()
const firma_finanzas_text = ref()
const firma_uno_text = ref()
const firma_dos_text = ref()


const id_pedido = ref()

const lst_productos = ref([])

const dialog = ref(false)
const loading = ref(false)

const fab = ref(false)


async function openDialog() {
    loading.value = true
    try {
        lst_pedidos_revisados.value = await allPedidosRevisadosService();
        dialog.value = true
    } catch (error) {

    }
    finally {
        loading.value = false
    }
}

async function getPedidoDetalle(id) {

    //se asigna el id pedido
    id_pedido.value = id

    /*
    "datos_pedido": {
        "nombre_comercial": "EL TORNILLO",
        "fecha_pedido": "2023-09-07",
        fecha_revision
        "folio": 5,
        "is_orden": 0,
        "area_solicita": 0,
        "observacion": "",
        "pago": 0,
        "concepto": "",
        "elaboro": 0,
        "revision": 0,
        "autorizo": 0,
        "reviza_finanzas": 0,
        "autoriza_finanzas": 0,
        "autoriza_finanzas_dos": 0
    },


    {
            "id_pedido_almacen_pv": 5,
            "id_pedido_almacen_producto": 8,
            "estatus": 1,
            "id_producto_pv": 3,
            "clave": "SKU970767",
            "nombre": "CLAVO DE 4 PULGADAS GRIS OSCURO",
            "descripcion": "CLAVO DE 4 PULGADAS GRIS OSCURO",
            "cantidad": 1,
            "unidad": "kilogramo",
            "costo": 250
        },
    */
    try {
        const { datos_pedido, productos, firmas } = await getOrdenCompraService(id)

        nombre_comercial.value = datos_pedido.nombre_comercial
        descripcion.value = datos_pedido.descripcion
        fecha_pedido.value = datos_pedido.fecha_pedido
        fecha_revision.value = datos_pedido.fecha_revision
        folio.value = datos_pedido.folio
        is_orden.value = datos_pedido.is_orden

        ieps.value = datos_pedido.ipes
        iva.value = datos_pedido.iva
        sub_total.value = datos_pedido.subtotal
        total.value = datos_pedido.total
        observaciones.value = productos.map(i => i.descripcion_revision).join(", ")
        pago_concepto.value = productos.map(i => i.nombre).join(", ")

        //firmas id
        firma_elaboro.value = firmas?.elaboro
        firma_reviso.value = firmas?.reviso
        firma_autorizo.value = firmas?.autorizo
        firma_finanzas.value = firmas?.reviso_finanzas
        firma_uno.value = firmas?.firma_autorizada_1
        firma_dos.value = firmas?.firma_autorizada_2

        //firmas text
        firma_elaboro_text.value = firmas?.elabora_
        firma_reviso_text.value = firmas?.reviso_
        firma_autorizo_text.value = firmas?.autorizo_
        firma_finanzas_text.value = firmas?.finanzas_
        firma_uno_text.value = firmas?.firma_uno_
        firma_dos_text.value = firmas?.firma_dos_

        lst_productos.value = productos
    } catch (error) {
        console.log('error leo->', error)
    }
}

async function saveOrdenCompra() {
    const data_send = {
        id_pedido_almacen_pv: id_pedido.value,
        observaciones: observaciones.value,
        elaboro: firma_elaboro.value,
        reviso: firma_reviso.value,
        autorizo: firma_autorizo.value,
        reviza_finanzas: firma_finanzas.value,
        autoriza_finanza: firma_uno.value,
        autoriza_finanzas_dos: firma_dos.value
    }
    try {
        is_orden.value = await saveOrdenCompraService(data_send)
    } catch (error) {

    }
}



function printer() {

    const printProductos = chunk(lst_productos.value, 20)
    const pagesMap = printProductos.map((productos_, index_) => {

        const domDivPrint = $dom("div", {style:{
                fontFamily: "Roboto, sans-serif",
                height: "242mm",//"907px",
                padding: "0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#bde0fe",
                marginTop: "13mm",                    
        }})

    //header 
    const domDivHeader = $dom("div", { style: { display: 'flex', justifyContent: 'flex-end', width: "180mm", height: "22mm", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "#1E88E5" } })
    const domDivHeaderFolio = $dom("div", is_orden.value, { style: { width: "44mm", height: "18mm", display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5mm', boxSizing: "border-box", fontSize: "30px", backgroundColor: "#E3F2FD" } })
    $setChildren(domDivHeader, [domDivHeaderFolio])

    //table
    const domTable = $dom("table", { style: { borderCollapse: 'collapse', boxSizing: "border-box" } })
    const domThead = $dom("thead", { style: { borderCollapse: 'collapse', boxSizing: "border-box" } });
    const domTbody = $dom("tbody", { style: { borderCollapse: 'collapse', boxSizing: "border-box" } });
    const domTfoot = $dom("tfoot", { style: { borderCollapse: 'collapse', boxSizing: "border-box" } });

    //row headers
    const domTheadRow1 = $dom("tr", { style: { boxSizing: "border-box", borderCollapse: 'collapse' } }, [
        $dom("th", nombre_comercial.value, { style: { width: "93mm", fontSize: "14px", borderCollapse: 'collapse', boxSizing: "border-box", backgroundColor: "white" }, colSpan: 4, rowSpan: 4 }),
        $dom("th", { style: { width: "43.5mm", height: "4.5mm", borderCollapse: 'collapse', boxSizing: "border-box", fontSize: "0px", backgroundColor: "white" } }),
        $dom("th", { style: { width: "43.5mm", fontSize: "0px", borderCollapse: 'collapse', boxSizing: "border-box", backgroundColor: "white" }, colSpan: 2 })
    ]);

    const domTheadRow2 = $dom("tr", { style: { boxSizing: "border-box", borderCollapse: 'collapse' } }, [
        $dom("th", fecha_pedido.value, { style: { height: "6mm", fontSize: "10px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", fecha_revision.value, { style: { fontSize: "10px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 2 })
    ]);

    const domTheadRow3 = $dom("tr", { style: { boxSizing: "border-box", borderCollapse: 'collapse' } }, [
        $dom("th", { style: { height: "6.5mm", fontSize: "10px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", folio.value, { style: { fontSize: "10px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 2 })
    ]);

    const domTheadRow4 = $dom("tr", { style: { boxSizing: "border-box", borderCollapse: 'collapse' } }, [
        $dom("th", { style: { height: "5mm", fontSize: "10px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 3 })
    ]);
    const domTheadRow5 = $dom("tr", { style: { boxSizing: "border-box", borderCollapse: 'collapse' } }, [
        $dom("th", { style: { width: "11mm", height: "4.5mm", fontSize: "8px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", { style: { width: "15.5mm", fontSize: "8px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", { style: { width: "16mm", fontSize: "8px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", { style: { fontSize: "8px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 2 }),
        $dom("th", { style: { width: "26mm", fontSize: "8px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", { style: { fontSize: "8px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
    ]);

    $setChildren(domThead, [domTheadRow1, domTheadRow2, domTheadRow3, domTheadRow4, domTheadRow5])

    //Row tbody dinamicamente
    const fill_array = {
        "id_pedido_almacen_pv": 5,
        "id_pedido_almacen_producto": 0,
        "estatus": 0,
        "id_producto_pv": 0,
        "descripcion_revision": "",
        "clave": "",
        "nombre": "",
        "descripcion": "",
        "cantidad": undefined,
        "unidad": "",
        "costo": undefined
    }

    const total_prod = [...productos_, ...Array(20 - productos_.length).fill(fill_array)]

    const lstTR = total_prod.map((item, index) => {

        return $dom("tr", [
            $dom("td", { style: { height: "3.5mm", fontSize: "7px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
            $dom("td", item.cantidad, { style: { fontSize: "7px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
            $dom("td", item.unidad, { style: { fontSize: "7px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
            $dom("td", `${item.nombre}  ${item.descripcion}`, { style: { fontSize: "7px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 2 }),
            $dom("td", Boolean(item.costo) ? numeral(item.costo).format('$0,0[.]00') : '', { style: { fontSize: "7px", paddingRight: "15px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
            $dom("td", Boolean(item.cantidad) ? numeral(item.cantidad * item.costo).format('$0,0[.]00') : '', { style: { fontSize: "7px", paddingRight: "15px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        ])
    })

    $setChildren(domTbody,
        [
            $dom("tr",
                [$dom("td", { style: { height: "3mm", fontSize: "0px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 6 })]),
            ...lstTR,
            $dom("tr", [$dom("td", "20", { style: { height: "3.5mm", fontSize: "0px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 7 })]),
            $dom("tr", [$dom("td", "21", { style: { height: "3.5mm", fontSize: "0px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 7 })]),
            $dom("tr", [$dom("td", "22", { style: { height: "3.5mm", fontSize: "0px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 7 })]),
            $dom("tr", [$dom("td", "23", { style: { height: "3.5mm", fontSize: "0px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 7 })])
        ])


    //Row tfoot
    const domTfootRow1 = $dom("tr", [
        $dom("th", { style: { height: "10mm", fontSize: "5px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 5 }),
        $dom("th", { style: { backgroundColor: "white" } }),
        $dom("th", Boolean(sub_total.value) ? numeral(sub_total.value).format('$0,0[.]00') : '', { style: { fontSize: "12px", backgroundColor: "white" } })
    ])
    const domTfootRow2 = $dom("tr", [
        $dom("th", { style: { fontSize: "5px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" }, colSpan: 5, rowSpan: 2 }),
        $dom("th", { style: { height: "9.5mm", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", Boolean(iva.value) ? numeral(iva.value).format('$0,0[.]00') : '', { style: { fontSize: "12px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
    ])
    const domTfootRow3 = $dom("tr", [
        $dom("th", { style: { height: "10mm", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "white" } }),
        $dom("th", Boolean(total.value) ? numeral(total.value).format('$0,0[.]00') : '', { style: { fontSize: "12px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "transparent" } }),
    ])

    $setChildren(domTfoot, [domTfootRow1, domTfootRow2, domTfootRow3])
    $setChildren(domTable, [domThead, domTbody, domTfoot])

    const domDivTable = $dom("div", [domTable], { style: { width: "180mm", height: "143mm", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "#1976D2" } })

    //div de firmas
    const domDivFirmas = $dom("div", { style: { width: "180mm", height: "22mm", display: "flex", justifyContent: "space-between", alignItems: 'flex-end', paddingBottom: "5mm", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "#1565C0" } },
        [
            $dom("div", firma_elaboro_text.value ?? '', { style: { width: "45mm", height: "15px", fontSize: "9px", textAlign: "center", textOverflow: "ellipsis", backgroundColor: "white" } }),
            $dom("div", firma_reviso_text.value ?? '', { style: { width: "45mm", height: "15px", fontSize: "9px", textAlign: "center", textOverflow: "ellipsis", backgroundColor: "white" } }),
            $dom("div", firma_autorizo_text.value ?? '', { style: { width: "45mm", height: "15px", fontSize: "9px", textAlign: "center", textOverflow: "ellipsis", backgroundColor: "white" } }),
        ]
    )

    //div autorizacion
    const domDivAutorizacion = $dom("div", { style: { width: "180mm", height: "40mm", fontSize: "9px", boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "#0D47A1" } },
        [
            $dom("div", { style: { marginTop: "7.5mm" } }, [
                $dom("div", { style: { width: "35mm", display: "inline-block" } }),
                $dom("div", nombre_comercial.value, { style: { width: "140mm", fontSize: "10px", display: "inline-block" } })
            ]),
            $dom("div", { style: { marginTop: "5mm" } }, [
                $dom("div", { style: { width: "35mm", display: "inline-block" } }),
                $dom("div", Boolean(total.value) ? numeral(total.value).format('$0,0[.]00') : '', { style: { width: "140mm", fontSize: "10px", display: "inline-block" } })
            ]),
            $dom("div", { style: { marginTop: "5mm" } }, [
                $dom("div", { style: { width: "35mm", display: "inline-block" } }),
                $dom("div", pago_concepto.value ?? '', { style: { width: "140mm", fontSize: "10px", display: "inline-block" } })
            ]),
        ])

    //div autorizacion firmas
    const domDivFirmasConfirmacion = $dom("div", { style: { width: "180mm", height: "11mm", display: "flex", justifyContent: "space-between", alignItems: 'flex-end', boxSizing: "border-box", borderCollapse: 'collapse', backgroundColor: "#01579B" } },
        [
            $dom("div", firma_finanzas_text.value ?? '', { style: { width: "45mm", height: "4mm", fontSize: "9px", textAlign: "center", textOverflow: "ellipsis", backgroundColor: "white" } }),
            $dom("div", firma_uno_text.value ?? '', { style: { width: "45mm", height: "4mm", fontSize: "9px", textAlign: "center", textOverflow: "ellipsis", backgroundColor: "white" } }),
            $dom("div", firma_dos_text.value ?? '', { style: { width: "45mm", height: "4mm", fontSize: "9px", textAlign: "center", textOverflow: "ellipsis", backgroundColor: "white" } }),
        ]
    )

    $setChildren(domDivPrint, [
        domDivHeader,
        domDivTable,
        domDivFirmas,
        domDivAutorizacion,
        domDivFirmasConfirmacion,       
    ])

    //se regresa digamos siendo una pagina
    return $dom("div", [domDivPrint, $dom("div",`página ${index_+1} de ${printProductos.length}`,{style:{fontFamily: "Roboto, sans-serif",textAlign:'right',fontSize:'10px',marginTop:"10mm"}})], { style: { pageBreakAfter: "always", backgroundColor: "black" } });

})

printJS({
    printable: $dom("div", pagesMap,
        {
            style: {
                backgroundColor: '#d0f4de',
                // printColorAdjust: "exact",
                // webkitPrintColorAdjust: "exact",
                margin: 0,
                padding: 0
            }
        }
    ).outerHTML, type: "raw-html", style: ['@page { size: 215.9mm 279mm; margin: 5mm;}']
});

}
</script>

<style>
.orden-folio {
    border: 2px solid #232323;
    width: 250px;
    height: 100px;
}

.text-cabcera {
    font-size: 1.1em;
}

.table-productos {
    margin-top: 25px;
    width: 100%;
    border: 1px solid #000;
    border-width: 1px;
    border-collapse: collapse;

}

.table-productos th {

    border: 1px solid #000;
    padding: 5px
}

.table-productos td {

    border-left: 1px solid #000;
    padding: 10px
}

.firmas-span {
    text-align: center;
    display: block;
    width: 25% !important;
    height: 30px;
    /* background-color: aqua;   */
    /* border-top: 1px solid #000; */
}

.span-tranferencia {
    display: inline-block;
    /* background-color: aqua; */
    width: 70% !important;
    height: 30px;
    border-bottom: 1px solid #000;
}

.span-tranferencia-title {
    display: inline-block;
    width: 10% !important;
}</style>
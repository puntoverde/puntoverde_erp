<template>
    <v-dialog v-model="dialog" width="80%">
        <template v-slot:activator>
            
                    <v-btn color="primary" @click="open" :loading="loading">Iniciar aprovacion</v-btn>
                
        </template>
        <v-card>
            <v-toolbar color="secondaryx" elevation="0" dark>
                <v-toolbar-title>Revision y aprovacion de requisicion</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false" color="white"><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr class="secondaryx">
                            <th class="xwhite--text">Clave</th>
                            <th class="xwhite--text">Nombre</th>
                            <th class="xwhite--text">Marca</th>
                            <th class="xwhite--text">Cantidad</th>
                            <th class="xwhite--text">Observacion</th>
                            <th class="xwhite--text">Estatus</th>
                            <th class="xwhite--text">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(producto, index) in lst_productos" :key="index">
                            <td>{{ producto.clave }}</td>
                            <td>{{ producto.nombre }}</td>
                            <td>{{ producto.marca??'N/A' }}</td>
                            <td>
                               <span v-if="producto.id_presentacion">
                            {{ producto.cantidad }} {{ producto.m_presentacion }} ({{producto.cantidad_presentacion}} {{ producto.unidad_producto }})
                        </span>
                               <span v-else>{{ producto.cantidad }} {{ producto.unidad_producto }}</span>

                            </td>
                            <td>
                                <v-chip v-if="producto.estatus_confirmacion == 1" color="success">
                                    <v-icon left>mdi-check</v-icon>
                                    Aceptado
                                </v-chip>
                                <v-chip v-else color="error">
                                    <v-icon left>mdi-cancel</v-icon>
                                    Cancelado
                                </v-chip>
                            </td>
                            <td>
                                {{ producto.observaciones }}
                            </td>
                            <td style="width: 100px;">
                                <v-menu max-width="350" v-if="producto.estatus == 2 && producto.estatus_confirmacion == 1">
                                    <template v-slot:activator="{ on,attrs }">
                                        <v-btn v-on="on" v-bind="attrs" iconx outlined color="error">
                                            <v-icon>mdi-cancel</v-icon>
                                            cancelar
                                        </v-btn>
                                    </template>
                                    <v-card>
                                        <v-toolbar elevation="0" class="py-0">
                                            <v-icon class="mr-2">mdi-alert</v-icon>
                                            <v-toolbar-title>Alert</v-toolbar-title>
                                        </v-toolbar>
                                        <v-divider></v-divider>
                                        <v-card-text class="text-h6 text-center">
                                            ¿Desea dar de baja este producto de la requisicion?
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn outlined>cancelar</v-btn>
                                            <v-btn color="warning"
                                                @click="cancelarProducto(producto.id_requisicion_producto_pv)">Aceptar</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
            <v-divider></v-divider>
            <v-card-actions class="secondaryx">
                <v-spacer></v-spacer>
                <v-btn v-if="estatus_requisicion == 2" color="white" outlined @click="cancelarRequisicion"><v-icon
                        class="mr-1">mdi-close</v-icon> Cancelar Requisicion</v-btn>
                <v-btn v-if="estatus_requisicion == 2" color="primary" @click="marcarRevisionRequisicion"><v-icon
                        class="mr-1">mdi-check</v-icon> Marcar como Revisada</v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getDetalleAprobar, cancelarProductoRequisicionAprobacionService, finalizarRequisicionAprovacion } from '@/services/requisicion_service'

const props = defineProps({ id_requisicion: { type: [Number, String], default: 0 }, estatus_requisicion: { type: Number, default: 0 } })
const emit = defineEmits(['emit-finaliza', 'emit-cancela'])

const dialog = ref(false)
const loading = ref(false)
const lst_productos = ref([])

async function open() {
    loading.value = true
    try {
        lst_productos.value = await getDetalleAprobar(props.id_requisicion)
        dialog.value = true
    } catch (error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }
}

async function cancelarProducto(id_producto_requisicion) {
    try {
        const data = await cancelarProductoRequisicionAprobacionService(id_producto_requisicion)
        console.log(data)
        if (data > 0) {
            console.log("entra al if ")
            lst_productos.value = await getDetalleAprobar(props.id_requisicion)
        }
    } catch (error) {
        console.log(error)
    }
}

async function marcarRevisionRequisicion() {
    try {
        const data = await finalizarRequisicionAprovacion(props.id_requisicion)
        if (data > 0) {
            dialog.value = false
            emit('emit-finaliza')
        }
    } catch (error) {
        console.log(error)
    }
}

async function cancelarRequisicion() {
    try {
        const data = await CancelarRequisicion(props.id_requisicion)
        console.log(data)
        if (data > 0) {
            dialog.value = false
            emit('emit-cancela')
        }
    } catch (error) {
        console.log(error)
    }
}
</script>
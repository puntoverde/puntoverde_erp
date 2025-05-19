<template>
    <v-dialog v-model="dialog" width="80%" persistent>
        <template v-slot:activator>
            <v-btn color="info" @click="open" :loading="loading">Detalle requisicion </v-btn>
        </template>
        <v-card>
            <v-toolbar elevation="0" color="primaryx" dark>
                <v-toolbar-title>
                    Detalle Requisicion
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false" color="white"><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>

            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr class="secondaryx">
                            <th class="xwhite--text">Clave</th>
                            <th class="xwhite--text">Nombre</th>
                            <th class="xwhite--text">Marca</th>
                            <th class="xwhite--text">Cantidad Pedida</th>
                            <th class="xwhite--text">Observaciones</th>
                            <th class="xwhite--text text-center" style="width: 100px;">Estatus revision</th>
                            <th class="xwhite--text text-center" style="width: 100px;">Estatus aprobacion</th>
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
                            <!-- <td>{{ producto.tamano }} {{ producto.m_producto }}</td> -->
                            <td>{{ producto.observaciones }}</td>
                            <td class="text-center">
                                <v-icon v-if="producto.estatus == 0" color="error">mdi-cancel</v-icon>
                                <v-icon v-else-if="producto.estatus == 1">mdi-minus-circle</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 2 && producto.estatus_revision == 1">mdi-check</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 2 && producto.estatus_revision == 0">mdi-cancel</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 3 && producto.estatus_revision == 1">mdi-check</v-icon>
                                    <v-icon
                                    v-else-if="producto.estatus == 3 && producto.estatus_revision == 0">mdi-cancel</v-icon>
                            </td>
                            <td class="text-center">
                                
                                
                                <v-icon v-if="producto.estatus == 4" color="error">mdi-cancel</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 1 | producto.estatus == 2 | producto.estatus == 0">mdi-minus-circle</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 3  && producto.estatus_revision == 0">mdi-minus-circle</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 3  && producto.estatus_revision == 1 &&  producto.estatus_confirmacion == 1">mdi-check</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 3 &&  producto.estatus_revision == 1 && producto.estatus_confirmacion == 0">mdi-cancel</v-icon>
                                <!-- <v-icon v-if="producto.estatus == 4" color="error">mdi-cancel</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 1 | producto.estatus == 2 | producto.estatus == 0">mdi-minus-circle</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 3 && producto.estatus_revision == 1">mdi-check</v-icon>
                                <v-icon
                                    v-else-if="producto.estatus == 3 && producto.estatus_revision == 0">mdi-cancel</v-icon> -->
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

        </v-card>

    </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { getDetalleRequisicion } from '@/services/requisicion_service'

const props = defineProps({ id_requisicion: { type: [Number, String], default: 0 } })

const dialog = ref(false)
const loading = ref(false)
const lst_productos = ref([])

async function open() {
    loading.value = true
    try {
        lst_productos.value = await getDetalleRequisicion(props.id_requisicion)
        dialog.value = true
    } catch (error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }
}
</script>
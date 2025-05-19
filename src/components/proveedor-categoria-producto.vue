<template>
    <div>
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar color="secondary" dark>
                    <v-toolbar-title>Agregar productos especificos al proveedor</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
                    <template v-slot:extension>
                        <v-select v-model="id_categoria" :items="lst_categorias_producto" item-value="id_categoria_pv" item-text="nombre" @change="getProductosProveedor">

                        </v-select>
                    </template>
                </v-toolbar>
                <!-- {{ lst_productos_selected }} -->
                <!-- <v-card-text> -->
                <v-list>
                    <v-list-item-group v-model="lst_productos_selected" multiple>
                        <v-list-item v-for="(categoria, index) in lst_productos" :key="index"
                            :value="categoria.id_producto_pv">
                            <v-list-item-content>
                                <v-list-item-title>{{ categoria.nombre }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <!-- </v-card-text> -->
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn block color="primary" @click="saveProductos">
                        <v-icon class="mr-2"> mdi-playlist-check</v-icon>
                        Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-hover v-slot="{ hover }">
                    <v-btn style="background-color:white" fab x-small outlined :color="hover ? 'info' : 'accent'"
                        @click="open" v-on="on"><v-icon size="24">mdi-view-grid-plus</v-icon></v-btn>
                </v-hover>
            </template>
            <span>Agregar producto</span>
        </v-tooltip>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { allProductoProveedor, addProducto } from '@/services/proveedor_service'
import {allCategoriaProducto } from '@/services/categoria_producto_service'

const props = defineProps({ id_proveedor: { type: Number | String, default: 0 } });

const id_categoria=ref(0)

const dialog = ref(false)
const lst_productos = ref([])
const lst_productos_selected = ref([])

const lst_categorias_producto=ref([])

onMounted(() => {


})

async function open() {
    if(lst_categorias_producto.value.length===0)getCategorias();
    
    // await getProductosProveedor()
    dialog.value = true
}

function close()
{
    id_categoria.value=0
    lst_productos.value=[]
    lst_productos_selected.value=[]
    dialog.value=false
}

async function getProductosProveedor() {
    try {
        // const data= await allProductoProveedor(props.id_proveedor);
        const data= await allProductoProveedor(props.id_proveedor,id_categoria.value);
        lst_productos.value = data
        lst_productos_selected.value=data.filter(i=>i.agregado>0).map(i=>i.id_producto_pv);
    } catch (error) {

    }
}

async function saveProductos() {
    try {
        await addProducto(props.id_proveedor, lst_productos_selected.value)
    } catch (error) {

    }
}

async function getCategorias(){
    try {
        lst_categorias_producto.value=await allCategoriaProducto()
    } catch (error) {
        console.log(error)
    }
}
</script>
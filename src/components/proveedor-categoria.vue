<template>
    <div>
        <v-dialog v-model="dialog" width="500" persistent>
            <v-card>
                <v-toolbar color="secondary" dark>
                    <v-toolbar-title>Agregar categorías</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
                </v-toolbar>
                <!-- {{ lst_categorias_selected }} -->
                <!-- <v-card-text> -->
                <v-list>
                    <v-list-item-group v-model="lst_categorias_selected" multiple>
                        <v-list-item v-for="(categoria, index) in lst_categorias" :key="index"
                            :value="categoria.id_categoria_pv">
                            <v-list-item-content>
                                <v-list-item-title>{{ categoria.nombre }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
                <!-- </v-card-text> -->
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn block color="primary" @click="saveCategorias" :loading="loading"> <v-icon class="mr-2"> mdi-playlist-check</v-icon>
                        Agregar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-hover v-slot="{ hover }">
                    <v-btn style="background-color:white" fab x-small outlined :color="hover ? 'info' : 'accent'"
                        @click="open" v-on="on"><v-icon size="24">mdi-playlist-plus</v-icon></v-btn>
                </v-hover>
            </template>
            <span>Agregar categoria</span>
        </v-tooltip>

        <v-snackbar v-model="show">
              Categoria agregada con exito.
        </v-snackbar>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { allCategoriaProveedor, addCategoria } from '@/services/proveedor_service'

const props = defineProps({ id_proveedor: { type: Number | String, default: 0 } });

const dialog = ref(false)
const lst_categorias = ref([])
const lst_categorias_selected = ref([])
const loading=ref(false)
const show=ref(false)

onMounted(() => {


})

async function open() {
    await getCategoriasProveedor()
    dialog.value = true
}

function close()
{
    lst_categorias_selected.value=[]
    dialog.value=false
}

async function getCategoriasProveedor() {
    try {
        const data=await allCategoriaProveedor(props.id_proveedor);
        lst_categorias.value = data
        lst_categorias_selected.value= data.filter(i=>i.agregado>0).map(i=>i.id_categoria_pv)
    } catch (error) {

    }
}

async function saveCategorias() {
    loading.value=true
    try {
        const data=await addCategoria(props.id_proveedor, lst_categorias_selected.value)
        if(data==1)show.value=true
    } catch (error) {

    }
    finally{loading.value=false}
}
</script>
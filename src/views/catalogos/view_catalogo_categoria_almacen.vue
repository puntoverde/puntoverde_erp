<template>
    <v-container>

        <v-card class="rounded-xl">
            <v-toolbar color="primary" extended>
                <v-toolbar-title>
                    <h2 class="white--text">Creacion de categoria, subcategoria y sub-subcategoria</h2>
                </v-toolbar-title>
                <template v-slot:extension>
                   <span class="white--text"> Nota: si no se encuentra categoria o sub categoria puede crearse. </span>
                </template>
            </v-toolbar>
            <v-card-text class="d-flex justify-center">
                <div style="width: 50%;">

                    <v-combobox v-model="id_categoria" :search-input.sync="search_categoria" :items="lst_categorias" item-value="id_categoria_pv"
                    item-text="nombre" outlined   @change="fnChangeCategoria">

                    <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    No se encuentra la categoria "<strong>{{ search_categoria }}</strong>". Presiona <kbd>enter</kbd> para
                                    crear nueva categoria
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                </v-combobox>


          
                <v-combobox v-model="id_subcategoria" :search-input.sync="search_subcategoria" :items="lst_subcategoria" item-value="id_subcategoria_producto_pv"
                    item-text="nombre" outlined   @change="fnChangeSubCategoria">

                    <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    No se encuentra la subcategoria "<strong>{{ search_subcategoria }}</strong>". Presiona <kbd>enter</kbd> para
                                    crear nueva subcategoria
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                </v-combobox>


               
                <v-combobox v-model="id_subsubcategoria" :search-input.sync="search_subsubcategoria" :items="lst_subsubcategoria" item-value="id_subsubcategoria_pv"
                    item-text="nombre" outlined   @change="fnChangeSubSubCategoria">

                    <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    No se encuentra la subcategoria "<strong>{{ search_subsubcategoria }}</strong>". Presiona <kbd>enter</kbd> para
                                    crear nueva subcategoria
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>

                </v-combobox>

                </div>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                
            </v-card-actions>
        </v-card>

    </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { allCategoriaProducto,allSubCategoriaProducto,allSubSubCategoriaProducto,createCategoriaProducto,createSubCategoriaProducto,createSubSubCategoriaProducto} from '@/services/categoria_producto_service'
import _isPlainObject from 'lodash/isPlainObject'
import _isString from 'lodash/isString'


const id_categoria=ref()
const id_subcategoria=ref()
const id_subsubcategoria=ref()


// {
//     "id_categoria_pv": 1,
//     "nombre": "EQUIPO COMPUTO",
//     "descripcion": "se maneja todo lo referido a computacion",
//     "estatus": 1
// }
const lst_categorias = ref([])
const lst_subcategoria = ref([])
const lst_subsubcategoria = ref([])

const search_categoria = ref('')
const search_subcategoria = ref('')
const search_subsubcategoria = ref('')


onMounted(() => {
    getCategorias()
})


async function getCategorias() {
    try {
        lst_categorias.value = await allCategoriaProducto()
    } catch (error) {

    }
}

async function getAllSubCategoriaProducto()
{
    try {
        lst_subcategoria.value=await allSubCategoriaProducto(id_categoria.value?.id_categoria_pv)
    } catch (error) {
 console.log(error)       
    }
}

async function getAllSubSubCategoriaProducto()
{
    try {
        lst_subsubcategoria.value=await allSubSubCategoriaProducto(id_subcategoria.value?.id_subcategoria_producto_pv)
    } catch (error) {
 console.log(error)       
    }
}

//xcreate

async function fnCreateCategoriaProducto(nombre)
{
    try {
      const id_cat= await createCategoriaProducto(nombre)
      lst_categorias.value.push({id_categoria_pv: id_cat, nombre: nombre, descripcion: nombre, estatus:1})
      id_categoria.value=lst_categorias.value[lst_categorias.value.length-1]
      
    } catch (error) {
        
    }
}

async function fnCreateSubCategoriaProducto(nombre)
{
    try {
      const id_subcat= await createSubCategoriaProducto(id_categoria.value?.id_categoria_pv,nombre)
      lst_subcategoria.value.push({id_subcategoria_producto_pv: id_subcat,id_categoria_pv:id_categoria.value?.id_categoria_pv, nombre: nombre, descripcion: nombre, estatus:1})
      id_subcategoria.value=lst_subcategoria.value[lst_subcategoria.value.length-1]
    } catch (error) {
        
    }
}
async function fnCreateSubSubCategoriaProducto(nombre)
{
    try {
      const id_subsubcat= await createSubSubCategoriaProducto(id_subcategoria.value?.id_subcategoria_producto_pv,nombre)
      lst_subsubcategoria.value.push({id_subsubcategoria_producto_pv: id_subsubcat,id_subcategoria_producto_pv:id_subcategoria.value?.id_subcategoria_producto_pv, nombre: nombre, descripcion: nombre, estatus:1})
      id_subsubcategoria.value=lst_subsubcategoria.value[lst_subsubcategoria.value.length-1]
    } catch (error) {
        
    }
}



function fnChangeCategoria(e)
{

 if(_isPlainObject(e))
 {
    search_subcategoria.value=''
    search_subsubcategoria.value=''
    getAllSubCategoriaProducto()
 }
 else if(_isString(e))
 {
    fnCreateCategoriaProducto(e)
 }

 else{
    console.log('es null')
 }
 
}

function fnChangeSubCategoria(e)
{
 console.log('change--->',_isPlainObject(e))
 if(_isPlainObject(e))
 {
    search_subsubcategoria.value=''
    getAllSubSubCategoriaProducto()    
 }
 else if(_isString(e))
 {
    fnCreateSubCategoriaProducto(e)
 }

 else{
    console.log('es null')
 }
 
}

function fnChangeSubSubCategoria(e)
{
 console.log('change--->',_isPlainObject(e))
 if(_isPlainObject(e))
 {   
 }
 else if(_isString(e))
 {
    fnCreateSubSubCategoriaProducto(e)
 }

 else{
    console.log('es null')
 }
 
}

</script>
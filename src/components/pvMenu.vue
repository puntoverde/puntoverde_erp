<template>
  <v-navigation-drawer v-model="nombre" app id="menu-drawer">
    <v-toolbar color="primaryx darken-1x" elevation="2" class="tooleo">
      <template v-slot:img>
         <v-img :src="logo" contain height="64"></v-img>
      </template>      
    </v-toolbar>

<div class="secondaryx pa-3" style="border-bottom:1px solid #e0e0e0">
<v-text-field           
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        clearable
        hide-details        
        dense
        filled        
      ></v-text-field>

</div>
   
   
    <v-list dense nav id="menu-list">
      <v-list-item dense link to="/" color="primary">
         <v-list-item-icon>
            <v-icon>mdi-home
            </v-icon>
          </v-list-item-icon>
        <v-list-item-content>          
          <v-list-item-title>
          inicio
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        class="item-fullx"
        v-for="(modulo, index) in cMenu"
        :key="index"
        :to="modulo.ruta"
        link
        dense
        color="primary"
      >
        <v-list-item-icon>
            <v-icon>mdi-collage
            </v-icon>
          </v-list-item-icon>
        <v-list-item-content>
          <!-- <router-link :to="modulo.ruta">{{modulo.nombre}}</router-link> -->
          <v-list-item-title>

          {{ modulo.nombre }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted,computed } from "vue";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import logo from '@/assets/logo_blanco_horizontal.png'
import {getMenuService} from '@/services/menu_service'

const props = defineProps({nombre: {type: Boolean, default: true}});

const root=getCurrentInstance().proxy

const usuario = ref("");
const menu = ref([]);
const search = ref("");

onMounted(()=>{
  usuario.value = root.$ls.get("user", {});
  menu.value = root.$ls.get("menu", []);
  console.log(root.$ls.get("menu", []))
  fnGetMenu()
})

const cMenu=computed(()=> {
  if (isUndefined(search.value) || isNull(search.value) || search.value == "")
    return menu.value.sort((a,b)=>a.nombre.localeCompare(b.nombre));
  else
    return menu.value.filter(
      (item) =>
        item.nombre.toLowerCase().indexOf(search.value.toLowerCase()) > -1
    ).sort((a,b)=>a.nombre.localeCompare(b.nombre));
})

async function fnGetMenu(){
try {
  const menu_=await getMenuService()

  console.log('menu_ :',menu_.map(({cve_modulo,ruta})=>({key:`mod-${cve_modulo}`,value:ruta})))
  root.$ls.set("menu_",menu_.map(({cve_modulo,ruta})=>({key:`mod-${cve_modulo}`,value:ruta})));
  menu.value= menu_
} catch (error) {
  console.log(error)
}
}
</script>
<style>

#menu-drawer .v-navigation-drawer__content{
  /* height: 100%; */
  overflow-y: hidden !important;
  
}

.item-full {
  border: 1px solid #e1e1e1;
}
.v-list-item--active {
  border-left: 5px solid var(--v-primary-base);
}

.tooleo{

/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#113448+0,14bf98+100 */
background: #113448; /* Old browsers */
background: -moz-linear-gradient(45deg,  #113448 0%, #14bf98 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(45deg,  #113448 0%,#14bf98 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(45deg,  #113448 0%,#14bf98 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#113448', endColorstr='#14bf98',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */



}
</style>

<style>
#menu-list{
  height: calc(100vh - 129px);
  overflow-y: auto;
}
#menu-list .v-list-item__icon:first-child{
  margin-right: 10px!important;
}
</style>
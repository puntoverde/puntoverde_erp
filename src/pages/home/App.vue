
   
<template>
  <v-app id="inspire">
    <pvMenu :nombre="drawer" />
    <pvBaner @emit-abrir="menu" @emit-logout="logout" :cierre="!drawer" />
    <v-main>
      <v-dialog v-model="dialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Cerrar Sesion?</v-card-title>

          <v-card-text>Desea realmente cerrar la sesion </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red darken-1" text @click="dialog = false"
              >Cancelar</v-btn
            >

            <v-btn color="green darken-1" text @click="logoutOK">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-container
        fluid
        grid-list-xl
        style="height: calc(100vh - 100px); background-color: #f1f3f4;overflow-y:auto"     
      >
        <router-view />
      </v-container>
    </v-main>
    <pvFooter></pvFooter>
  </v-app>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import pvBaner from "@/components/pvBanner.vue";
import pvMenu from "@/components/pvMenu.vue";
import pvFooter from "@/components/pvFooter.vue";
import { useEventBus } from '@vueuse/core'

const root = getCurrentInstance().proxy;

const bus = useEventBus('news')

bus.on((str)=>{
  console.log('desde el interceptor...',root.$router.push({name:'session-finalize'}))
})

console.log("get root:", root.$leon);

const drawer = ref(false);
const dialog = ref(false);

function menu(dato) {
  drawer.value = dato;
}
function logout(p) {
  dialog.value = p;
}

function logoutOK() {
  root.$ls.clear();
  // root..$router.push({ name: "login" });
  console.log(`${import.meta.env.BASE_URL}login.html`)
  window.location.replace(`${import.meta.env.BASE_URL}login.html`);
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300&display=swap');


html,
body {
  overflow-y: hidden !important;
}

.my-mayus input {
  text-transform: uppercase;
}

.my-minus input {
  text-transform: lowercase;
}

.table-pv{
  background-color: #fcfcfc!important;
}

.table-pv table thead{
  background-color: white!important;;
}

.table-pv > div:first-child
{
  border-bottom:2px solid #272727;
  height:48px;
  /* border-top-left-radius: 24px !important; */
  /* border-top-right-radius: 24px !important; */
  padding-left: 20px !important;  
}

.table-pv >div:last-child
{
  border-top:2px solid #272727;
  height:30px;
  /* border-bottom-left-radius: 24px !important; */
  /* border-bottom-right-radius: 24px !important; */
  padding-left: 20px !important;
}

.oswald--text{font-family:  'Oswald', sans-serif;}
.number--text{font-family: consolas!important}
</style>
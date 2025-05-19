<template>
  <v-app-bar app color="#F1F3F4" darkx elevation="2">
    <v-app-bar-nav-icon @click.stop="abrirMenu"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-toolbar-title style="font-variant: small-caps" class="primary--text">CLUB PUNTO VERDE</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-divider vertical class="mx-2"></v-divider>

    <v-avatar size="36" color="primary">
      <span class="white--text text-h6">J</span>
    </v-avatar>

    <span class="ml-2">

      <span>{{ alias }}</span>
      -
      <span>{{ perfil?.nombre }}</span>



    </span>

    <!-- {{usuario.nombre}} {{usuario.apellido_paterno}} {{usuario.apellido_materno}}    -->
    <!-- <v-btn icon @click="logout">
      <v-icon>mdi-logout-variant</v-icon>
    </v-btn> -->
    <!-- <v-btn icon @click="logout">
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn> -->

    <v-menu rounded="xl">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-card width="300" rounded="xl">
        <!-- <v-avatar color="primary"></v-avatar> -->

        <v-card-title class="text-subtitle-1 d-flex justify-center">
          <span>{{ nombre_usuario }}</span>
          <span class="font-weight-bold mx-1">{{ paterno_usuario }}</span>
          <span class="font-italic ">{{ materno_usuario }}</span>
        </v-card-title>
        <v-divider inside></v-divider>

        <v-list dense nav>
          <v-subheader>Perfiles</v-subheader>
          <v-list-item v-for="perfil_ in perfiles" @click="fnSelectedPerfil(perfil_.cve_perfil)" dense
            :class="{ 'primary white--text': perfil_?.cve_perfil == perfil?.cve_perfil }">
            <v-list-item-content>
              <v-list-item-title>{{ perfil_.nombre }} </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon v-if="perfil_?.cve_perfil == perfil?.cve_perfil" small color="white">mdi-check-circle</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <!-- <v-list>
          <v-list-item @click="logout">
            <v-list-item-content>
              <v-list-item-title><v-icon>mdi-logout-variant</v-icon> cerrar session</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list> -->
        <v-card-actions class="pb-2">
          <v-btn block rounded @click="logout" color="secondary"> <v-icon class="mr-1">mdi-logout-variant</v-icon>cerrar
            sesion</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-menu rounded="xl">
      <template v-slot:activator="{ on, attrs }">

        <v-badge overlap dot offset-x="20" offset-y="20" :color="notificaciones.length>0?'primary':'transparent'">
          <v-btn icon v-on="on" v-bind="attrs">
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </v-badge>
      </template>
      <v-card max-width=550 max-height="700" rounded="xl">
        <v-list>
          <v-list-item v-for="noti in notificaciones">
            <v-list-item-content>
              <v-list-item-title>{{ noti.descripcion }}</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn iconx @click="fnNotificaciosVisto(noti.cve_notificacion)" small rounded="lg">
                <v-icon color="grey lighten-1">mdi-eye</v-icon> visto
              </v-btn>
            </v-list-item-action>

          </v-list-item>
        </v-list>

      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getNotificacionService, setNotificacionVistoService } from '@/services/login_service'


const props = defineProps({
  cierre: {
    type: Boolean,
    default: true
  },
});

const emit = defineEmits(['emit-abrir', 'emit-logout'])

const root = getCurrentInstance().proxy

const usuario = ref("");
const alias = root.$ls.get("alias", '-')
const nombre_usuario = root.$ls.get("nombre")
const paterno_usuario = root.$ls.get("paterno")
const materno_usuario = root.$ls.get("materno")

const perfil = root.$ls.get("perfil")
const perfiles = root.$ls.get("perfiles")

const notificaciones = ref([])

function abrirMenu() {
  emit("emit-abrir", props.cierre);
}
function logout() {
  // emit("emit-logout", true);
  root.$ls.clear();
  // root..$router.push({ name: "login" });
  console.log(`${import.meta.env.BASE_URL}login.html`)
  window.location.replace(`${import.meta.env.BASE_URL}login.html`);
}

// usuario.value = root.$ls.get("user", {});

function fnSelectedPerfil(perfil_) {
  const perfil_ls = perfiles.find(i => i.cve_perfil == perfil_)
  root.$ls.set("perfil", perfil_ls)
  window.location.replace(import.meta.env.BASE_URL);
}

async function fnGetNotificaciones() {
  try {
    notificaciones.value = await getNotificacionService()
  } catch (error) {

  }
}

async function fnNotificaciosVisto(id_notificacion) {
  try {
    await setNotificacionVistoService(id_notificacion)
    fnGetNotificaciones()
  } catch (error) {

  }
}

onMounted(() => {
  fnGetNotificaciones()
})

</script>

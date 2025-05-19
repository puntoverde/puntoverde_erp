<template>
  <div>
    <v-row>
      <v-col cols="4" v-for="(item, index) in lst_disponibles" :key="index">
        <v-card>
          <v-toolbar color="secondary" extended extension-height="80" dark>
            <v-toolbar-title>
              {{ item.equipo }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <span color="white--text">{{ item.descripcion }}</span>
            <template v-slot:extension>
              <div
                class="white--text rounded"
                :class="[item.cve_apartado ? 'primary' : 'amber']"
                style="width: 100%; height: 100%"
              >
                <v-row>
                  <v-col class="text-center">{{ item.inicio }}</v-col>
                  <v-col class="text-center">{{ item.fin }}</v-col>
                </v-row>
                <v-row>
                  <v-col class="text-center">
                    <span v-if="Boolean(item.cve_apartado)"
                      >disponible hasta las {{ item.disponible }}</span
                    >
                    <span v-else>disponible ahora</span>
                  </v-col>
                </v-row>
              </div>
            </template>
          </v-toolbar>
          <v-card-text>
            <!-- <v-row> -->
            <v-list>
              <v-list-item
                v-for="(soc, index) in item.socios"
                :key="`soc-${index}`"
              >
                <!-- esto es teporal es solo para que muestra la imagen mientras -->
                <!-- <span style="display: none">{{
                  getFoto(soc).then((i) => i)
                }}
                </span> -->
                <v-list-item-avatar color="secondary">
                  <v-img :src="soc.imagen" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ soc.nombre }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <span class="font-weight-bold mx-2">{{ soc.paterno }}</span
                    >{{ soc.materno }}</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <!-- <v-avatar color="secondary">j</v-avatar> -->
            </v-list>
            <!-- </v-row> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { disponibles } from "@/services/apartados_services";



const lst_disponibles = ref([]);

async function getCanchasEstado() {
  console.log("new");
  lst_disponibles.value = await disponibles();
}

// async function getFoto(soc) {
//   let reader = new FileReader();

//   const imagenPromise = new Promise(
//     (resolve, reject) => (reader.onload = (e) => resolve(reader.result))
//   );

//   if (Boolean(soc.foto)) {
//     try {
//       let { data, status } = await $axios.get(`socios/foto`, {
//         responseType: "blob",
//         params: { foto: soc.foto },
//       });
//       console.log(data, status);
//       if (status === 200) {
//         reader.readAsDataURL(data);
//         soc.imagen = await imagenPromise;
//       }
//     } catch (error) {
//       console.log(error);
//       soc.imagen = new URL("@/assets/user-profile3.svg", import.meta.url).href;
//     }
//   } else {
//     soc.imagen = new URL("@/assets/user-profile.svg", import.meta.url).href;
//   }
// }

getCanchasEstado();
setInterval(async () => {
  getCanchasEstado();
}, 60000);
</script>
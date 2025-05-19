<template>
  <div>
    <div class="d-flex justify-space-between">
      <span></span>
      <h1 class="accent--text oswald--text">Equipo de Futbol</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn  :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small dark
            elevation="1" @click="dialog_new_equipo = true" :disabled="!id_torneo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search_filter" :filters="filters" @emit-buscar="getEquipos">
        <template v-slot:id_torneo="{ data }">
          <v-select background-color="white" class="mr-2" v-model="data.value" :items="lst_torneos"
            item-value="id_torneo_futbol" item-text="nombre" label="Torneo" filled dense hideDetails clearable />
        </template>
        <template v-slot:id_accion="{ data }">
          <v-select background-color="white" class="ml-2" v-model="data.value" :items="lst_acciones"
            item-value="cve_accion" :item-text="(e) => `${e.accion} - ${e.nombre}`" label="Accion" filled dense
            hideDetails clearable />
        </template>
      </Search>
    </div>

    <v-data-table :headers="headers" :items="lst_equipos" :page.sync="page" :items-per-page="itemsPerPage" :search="search_filter"
      class="table-pv rounded-xl elevation-5" hide-default-footer>
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
          <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
          <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>
      <template v-slot:item.acciones="{ item }">
        <div class="grid-acciones-pv">
        <v-tooltip  bottom v-if="item.n_jugadores>0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn style="--position:1" color="secondary" iconx fab x-small elevation="3" outlinedx v-on="on" v-bind="attrs"
              @click="getJugadoresByAccion(item.id_equipo_futbol, item)">
              <v-icon> mdi-eye</v-icon></v-btn>
          </template>
          <span> Ver jugadores</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
        <v-btn style="--position:2" color="secondary" iconx outlinedx fab x-small elevation="3" v-on="on" v-bind="attrs"
          @click="openDialogNew(item.id_equipo_futbol, item)">
          <v-icon> mdi-plus</v-icon>
        </v-btn>
      </template>
          <span> Agregar jugadores</span>
        </v-tooltip>
        <v-tooltip bottom v-if="item.n_jugadores>0">
          <template v-slot:activator="{ on, attrs }">
        <v-btn style="--position:3" color="secondary" iconx outlinedx fab x-small elevation="3" v-on="on" v-bind="attrs" @click="
          createCredencial(
            item.id_equipo_futbol,
            item.equipo,
            item.torneo,
            item.categoria
          )
          ">
          <v-icon> mdi-printer</v-icon>
        </v-btn>
      </template>
          <span> Imprimir credeniales</span>
        </v-tooltip>
      </div>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog_new_equipo" width="500">
      <v-card>
        <v-toolbar dark color="secondary" elevation="0">
          <v-toolbar-title>
            Alta Equipo
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="closeNewEquipo">
            <v-icon> mdi-close-box</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="primary pt-1"></div>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12" lg="12">
              <v-select v-model="id_accion_2" :items="lst_acciones" item-value="cve_accion"
                :item-text="(e) => `${e.accion} - ${e.nombre}`" />
            </v-col>
            <v-col cols="12" lg="12">
              <v-text-field v-model="equipo_nombre" label="Nombre Equipo" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn block color="secondary" @click="createEquipo">
            Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog :value="dialog" width="500" persistent scrollable>
      <v-card>
        <v-toolbar color="secondary" dark elevation=0>
          <v-toolbar-title> Listado de Jugadores</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon> mdi-close-box</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider class="primary" style="min-height: 3px;"></v-divider>
        <v-card-text>
          <v-list>
            <v-list-item v-for="jugador in lst_jugadores" :key="jugador.id_equipo_futbol_jugador">
              <v-list-item-content>
                <v-list-item-title> {{ jugador.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  <b> Accion: {{ jugador.accion }}</b></v-list-item-subtitle>
                <v-list-item-subtitle class="d-flex">
                  <span> Posicion:</span>
                  <b> {{ jugador.posicion }}</b>
                  <v-spacer />
                  <span> edad:</span>
                  <b> {{ jugador.edad }}</b>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-switch v-model="jugador.estatus" @change="activateOrDesactivate($event, jugador.cve_socio)"
                  :true-value="1" :false-value="0" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog :value="dialog_new" width="500" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark elevation="0">
          <template v-slot:extension>
            <v-text-field v-model="search" @keypress.enter="getSocios" solo-inverted dense append-icon="mdi-magnify" />
          </template>
          <v-toolbar-title> Agregar jugador</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="dialog_new = false">
            <v-icon> mdi-close-box</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider class="primary" style="min-height: 3px;"></v-divider>
        <v-card-text class="pr-0">
          <v-list min-height="100">
            <v-subheader> listado de socios</v-subheader>
            <v-list-item v-for="socio in lst_socios" :key="socio.cve_socio">
              <v-list-item-content>
                <v-list-item-title> {{ socio.nombre }}<span class="font-weight-bold mx-1">{{ socio.apellido_paterno }}</span>
                  <span class="font-italic">{{ socio.apellido_materno }}</span> </v-list-item-title>
                <v-list-item-subtitle class="d-flex justify-space-between">
                  <div><span class="font-weight-bold">Accion:</span> {{ socio.accion }}</div>
                  <div><span class="font-weight-bold">Edad:</span> {{ socio.edad }}</div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu v-model="socio.menu" offset-y :close-on-content-click="false">
                  <template v-slot:activator>
                    <v-btn color="secondary" outlined icon @click="(socio.menu = true), (numero_jugador = '')">
                      <v-icon> mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <v-text-field v-model="numero_jugador" placeholder="Nunero de Jugador" outlined dense hideDetails />
                    </v-card-title>
                    <v-card-actions>
                      <v-btn block color="secondary" @click="addJugador(socio)" :loading="socio.loading">
                        <v-icon> mdi-content-save</v-icon> Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbar_color">
      {{ snackbar_menssage }}</v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, ref, set, getCurrentInstance } from "vue";
import Search from "@/components/ui/Search.vue";
import jsPDF from "jspdf";
import chunk from "lodash/chunk";
import { getTorneoFutbolService, getEquiposFutbolServices, getAccionesTipoFutbolService, getJugadoresByAccionService, getSociosAddJugadorService, setSocioAddJugadorService, activeOrDesactiveJugadorService, createEquipoService, getJugadoresActivosService, getFotoJugadorService } from '@/services/equipo_futbol_service'

const root = getCurrentInstance().proxy;

const headers = ref([
  { text: "Torneo", value: "torneo" },
  { text: "Accion", value: "accion" },
  { text: "Equipo", value: "equipo" },
  { text: "N Jujadores", value: "n_jugadores" },
  { text: "", value: "acciones", width: 100 },
]);

const id_torneo = ref();

const accion_selected = ref();
const nombre_equipo_selected = ref();
const accion_object_selected = ref({});

const search = ref();
const search_filter = ref();

const dialog = ref(false);
const dialog_new = ref(false);
const dialog_new_equipo = ref(false);

const lst_equipos = ref([]);
const lst_acciones = ref([]);
const lst_torneos = ref([]);
const lst_jugadores = ref([]);
const lst_socios = ref([]);

const numero_jugador = ref();

const nombre_torneo = ref();
const periodo_torneo = ref();

const loading_print = ref(false);

//apartado de nuevo equipo
const id_accion_2 = ref();
const equipo_nombre = ref("");

const snackbar = ref(false);
const snackbar_color = ref("success");
const snackbar_menssage = ref("");

const page = ref(1);
const itemsPerPage = ref(10);

const getBreadcrumb = [
  {
    text: "Dashboard",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    text: "Link 1",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    text: "Link 2",
    disabled: true,
    href: "breadcrumbs_link_2",
  },
];

const filters = ref([
  { label: "Torneo", key: "id_torneo", value: "", type: "select" },
  { label: "Equipo", key: "id_accion", value: "", type: "select" },
]);

onMounted(() => {
  getAcciones();
  getTorneos();
});

async function getEquipos(filter = {}) {
  id_torneo.value = filter.id_torneo
  try {
    lst_equipos.value = await getEquiposFutbolServices(filter);
  } catch (error) { }
}

async function getAcciones() {
  try {
    lst_acciones.value = await getAccionesTipoFutbolService();
  } catch (error) { }
}

async function getTorneos() {
  try {
    lst_torneos.value = await getTorneoFutbolService();
  } catch (error) {
    console.log(error);
  } finally {
  }
}

async function getJugadoresByAccion(id, item) {
  accion_selected.value = id;
  accion_object_selected.value = item;
  try {
    lst_jugadores.value = await getJugadoresByAccionService(id);
    dialog.value = true;
  } catch (error) { }
}

function openDialogNew(id, item) {
  accion_selected.value = id;
  accion_object_selected.value = item;
  dialog_new.value = true;
  lst_socios.value = [];
  search.value = "";
}

async function getSocios() {
  let numero_accion = undefined;
  let clasificacion = undefined;
  let nombre = undefined;

  if (search.value.length > 0) {
    //saber si el primer caracter es un numero es accion
    if (isNaN(search.value.charAt(0))) {
      nombre = search.value;
      numero_accion = undefined;
      clasificacion = undefined;
    } else {
      if (search.value.search(/[A-Ca-c]/) > 0) {
        nombre = undefined;
        numero_accion = search.value.substring(
          0,
          search.value.search(/[A-Ca-c]/)
        );
        clasificacion = ["0", "A", "B", "C"].findIndex(
          (i) =>
            i ==
            search.value.charAt(search.value.search(/[A-Ca-c]/)).toUpperCase()
        );
      } else {
        nombre = undefined;
        numero_accion = search.value;
        clasificacion = 0;
      }
    }
  }

  try {
    lst_socios.value = await getSociosAddJugadorService(nombre, numero_accion, clasificacion, id_torneo.value);
    lst_socios.value.forEach((i) => {
      set(i, "menu", false);
      set(i, "loading", false);
    });
  } catch (error) { }
}

async function addJugador(item) {
  try {
    if (!isNaN(parseInt(numero_jugador.value))) {
      item.menu = false; //cierra el menu
      item.loading = true;

      const data = await setSocioAddJugadorService(accion_selected.value, item.cve_socio, numero_jugador.value, id_torneo.value);

      if (data.ok == 0) {
        snackbar.value = true;
        snackbar_color.value = "error";
        snackbar_menssage.value =
          "El socio ya esta agregado aun equipo de este torneo";          
      } else {
        snackbar.value = true;
        snackbar_color.value = "success";
        snackbar_menssage.value = "Socio agregado como jugador.";
     
        dialog_new.value=false
        //getSocios();
        getEquipos({ id_torneo: id_torneo.value });
      }
    } else {
      alert("el numero es obligatorio...");
    }
  } catch (error) {
  } finally {
    item.loading = false;
  }
}

async function activateOrDesactivate(estatus, id_socio) {
  try {

    await activeOrDesactiveJugadorService(accion_selected.value, id_socio, estatus);
    let num_players = accion_object_selected.value.jugadores;
    getEquipos({ id_torneo: id_torneo.value });
  } catch (error) { }
}

function closeNewEquipo() {
  id_accion_2.value = undefined;
  equipo_nombre.value = "";
  dialog_new_equipo.value = false;
}

async function createEquipo() {
  try {
    await createEquipoService(id_torneo.value, id_accion_2.value, equipo_nombre.value)
    getEquipos({ id_torneo: id_torneo.value });
    dialog_new_equipo.value = false
  } catch (error) { }
}

async function createCredencial(id_equipo, equipo, torneo, periodo) {
  console.log(torneo);
  console.log(periodo);


  loading_print.value = true;
  try {

    const data = await getJugadoresActivosService(id_equipo);

    console.log("es el numero de jugadores que se muestran:", data);
    console.log(chunk(data, 10));

    const doc = new jsPDF();

    // let imagen = await import("@/assets/punto_verde2.png");
    let imagen = new URL("@/assets/punto_verde2.png", import.meta.url).href;
    console.log("🚀 ~ file: EquipoFutbol.vue:560 ~ imagen", imagen);

    let img = new Image();
    img.src = imagen;
    let imagen_promise = await new Promise((resolve, reject) => {
      img.onload = function () {
        let canvas = document.createElement("CANVAS");
        let ctx = canvas.getContext("2d");
        let dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL();
        resolve(dataURL);
      };
    });



    let indexDiez = 0;
    for (let nDiez of chunk(data, 10)) {
      let index = 0;
      console.log("es:", nDiez);
      if (indexDiez > 0) doc.addPage();
      for (let item of chunk(nDiez, 2)) {

        let index2 = 0;
        for await (let item2 of item) {
          let x = 85 * index2;
          let y = 56 * index;

          if (item2.edad >= 40 && item2.edad <= 44)
            doc.setFillColor(44, 167, 94);
          //rgb(44, 167, 94)
          else if (item2.edad >= 45 && item2.edad <= 49)
            doc.setFillColor(252, 198, 13);
          //rgb(252, 198, 13)
          else if (item2.edad >= 50) doc.setFillColor(216, 69, 6);
          //rgb(216, 69, 6)
          else doc.setFillColor(85, 146, 244); //rgb(85, 146, 244)

          doc.setTextColor(255, 255, 255);

          doc.setFontSize(12);
          doc.rect(x, y, 85, 56, "F");

          try {

            // let data = await getFotoJugadorService(item2.foto);
            let data = await getFotoJugadorService(item2.cve_socio);


            doc.addImage(data, x + 3, y + 19, 18, 25);
            console.log('x,y ->', x, y)

            console.log('is data:', data);
          } catch (error) {
            console.log("no hay foto...", error);
          }






          doc.rect(x + 2, y + 18, 20, 27);

          doc.setFillColor(27, 122, 102); //rgb(44, 167, 94) rgb(27, 122, 102)
          doc.rect(x, y, 85, 8, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.text(torneo, x + 42.5, y + 6, null, null, "center");


          doc.setFontSize(12);
          doc.text(equipo, x + 2, y + 15);

          doc.text(
            `No. ${item2.numero_jugador}`,
            x + 83,
            y + 15,
            null,
            null,
            "right"
          );

          doc.text("Años", x + 72, y + 23);

          doc.text(`${item2.edad}`, x + 74, y + 28);

          doc.setFontSize(12);
          doc.text(item2.paterno, x + 23, y + 23);
          doc.text(item2.materno, x + 23, y + 28);
          doc.text(item2.nombre_player, x + 23, y + 33);

          doc.addImage(imagen_promise, x + 72, y + 32, 10, 10);

          doc.setFontSize(10);
          doc.text(
            `${item2.id_equipo_futbol_jugador}`,
            x + 12,
            y + 49,
            null,
            null,
            "center"
          );
          doc.text(periodo, x + 83, y + 48, null, null, "right");

          if (item2.edad >= 40 && item2.edad <= 44)
            doc.setFillColor(44, 167, 94);
          //rgb(44, 167, 94)
          else if (item2.edad >= 45 && item2.edad <= 49)
            doc.setFillColor(252, 198, 13);
          //rgb(252, 198, 13)
          else if (item2.edad >= 50) doc.setFillColor(216, 69, 6);
          //rgb(216, 69, 6)
          else doc.setFillColor(85, 146, 244); //rgb(85, 146, 244)


          doc.rect(x, y + 51, 85, 5, "F");
          index2++;
        }


        index++;
      }

      indexDiez++;
    }


    doc.output("dataurlnewwindow");
  } catch (error) {
    console.log("error->", error);
  } finally {
    loading_print.value = false;
  }
}
</script>

<style>

.grid-acciones-pv{
display: grid;
grid-template-columns: repeat(3,32px);
justify-items: center;
column-gap: 2px;

}

.grid-acciones-pv > button{
  grid-column-start:var(--position)
}

</style>


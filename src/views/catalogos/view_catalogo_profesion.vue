<template>
  <div>
    <h2>Catalogo de Profesiones</h2>
    <hr />
    <v-row>
      <v-col lg="4" offset-lg="4">
        <v-text-field
          ref="primerInput"
          label="Nombre"
          v-model="nombre"
        ></v-text-field>
      </v-col>
      <v-col lg="4" offset-lg="4">
        <v-select
          label="Estatus"
          v-model="slcEstatus"
          :items="itemsEstatus"
          item-text="texto"
          item-value="val"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" offset-lg="4">
        <v-btn block color="primary" v-if="!flagActualizar" v-on:click="guardar"
          >Guardar</v-btn
        >
        <v-btn block color="info" v-if="flagActualizar" v-on:click="editarItem"
          >Actualizar</v-btn
        >
      </v-col>
    </v-row>
    <br />
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      :calculate-widths="true"
      class="elevation-1"
    >
      <template v-slot:item.estatus="{ item }">
        <label v-if="item.estatus == 1">Activo</label>
        <label v-else>Inactivo</label>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="cargarProfesion(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="abrirDialog(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Borrar registro?</v-card-title>

        <v-card-text>
          Realmente quieres borrar éste registro? Esta acción no se podrá
          deshacer.
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="eliminarItem">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  setProfesionService,
  editarProfesionService,
  deleteProfesionService,
  getProfesionByIdService,
  getProfesionAllService,
} from "@/services/profesion_service";

const accion = ref(0);
const sexo = ["Masculino", "Femenino"];
const sSexo = ref("");
const headers = [
  { text: "Clave", value: "cve_profesion" },
  { text: "Nombre", value: "nombre" },
  { text: "Estatus", value: "estatus" },
  { text: "Acciones", value: "action" },
];
const items = ref([]);
const slcEstatus = ref({});
const itemsEstatus = [
  { texto: "Activo", val: "1" },
  { texto: "Inactivo", val: "0" },
];
const sEstatus = ref("");
const dialog = ref(false);
// estatus: ["1", "0"],
//Modelo
const cve_profesion = ref(0);
const nombre = ref("");
const arrayParentescos = ref([]);
const itemEliminar = ref(null);
const flagActualizar = ref(false);

onMounted(() => {
    itemsTabla()
  });

function limpiarCampos() {
  nombre.value = "";
  sSexo.value = "";
  slcEstatus.value = ""; 
}
function abrirDialog(item) {
  itemEliminar.value = item;
  dialog.value = true;
}
async function guardar() {
  // axios.post("/profesionController.php", qs.stringify({accion: 1, nombre: nombre.value,sexo: sSexo.value,estatus: slcEstatus.value}))
  // .then(res=>{
  //     itemsTabla();
  //     limpiarCampos();
  //     })
  // .catch(function(res){alert(res)})
  await setProfesionService(nombre.value, sSexo.value, slcEstatus.value);
  itemsTabla();
  limpiarCampos();
}
async function editarItem() {
  // axios.post("/profesionController.php", qs.stringify({accion: 2, nombre: nombre.value, estatus: slcEstatus.value, cve_profesion: cve_profesion.value}))
  // .then(res=>{
  //         itemsTabla();
  //         limpiarCampos();
  //         flagActualizar.value = false;
  //     })
  // .catch(function(res){alert(res)})
  await editarProfesionService(
    nombre.value,
    slcEstatus.value,
    cve_profesion.value
  );
  itemsTabla();
  limpiarCampos();
  flagActualizar.value = false;
}
async function eliminarItem() {
  cve_profesion.value = itemEliminar.value.cve_profesion;
  // axios.post("/profesionController.php", qs.stringify({accion: 3, cve_profesion: cve_profesion.value}))
  // .then(res=>{
  //     itemsTabla();
  //     itemEliminar.value = null;
  //     dialog.value = false;
  //     })
  // .catch(function(res){alert(res)})
  await deleteProfesionService(cve_profesion.value);
  itemsTabla();
  itemEliminar.value = null;
  dialog.value = false;
}
async function cargarProfesion(item) {
  cve_profesion.value = item.cve_profesion;
  // axios.post("/profesionController.php", qs.stringify({accion: 5, cve_profesion: cve_profesion.value}))
  // .then(res=>{
  //         flagActualizar.value = true;
  //         nombre.value = res.data[0].nombre;
  //         slcEstatus.value = res.data[0].estatus;
  //         // $refs.primerInput.focus();
  //         window.scrollTo(0, 0);
  //     })
  // .catch(function(res){alert(res)})
  const data = await getProfesionByIdService(cve_profesion.value);
  flagActualizar.value = true;
  nombre.value = data[0].nombre;
  slcEstatus.value = data[0].estatus;
  window.scrollTo(0, 0);
}

async function itemsTabla() {
  // axios.post("/profesionController.php", qs.stringify({accion: 4}))
  // .then(res=>{items.value = res.data})
  // .catch(function(res){alert(res)})
  items.value = await getProfesionAllService();
}
</script>
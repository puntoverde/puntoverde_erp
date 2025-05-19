<template>
  <div>
    <v-row>
      <v-col lg="4" offset-lg="4">
        <v-text-field
          v-validate="'required'"
          data-vv-name="Nombre"
          :error="errors.has('Nombre')"
          :error-messages="errors.first('Nombre')"
          ref="primerInput"
          label="Nombre"
          v-model="nombre"
        ></v-text-field>
      </v-col>
      <v-col lg="4" offset-lg="4">
        <v-select
          v-validate="'required'"
          data-vv-name="Sexo"
          :error="errors.has('Sexo')"
          :error-messages="errors.first('Sexo')"
          label="Sexo"
          :items="sexo"
          v-model="sSexo"
        ></v-select>
      </v-col>
      <v-col lg="4" offset-lg="4">
        <v-select
          v-validate="'required'"
          data-vv-name="Estatus"
          :error="errors.has('Estatus')"
          :error-messages="errors.first('Estatus')"
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
        <v-icon small class="mr-2" @click="cargarParentesco(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="eliminarItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {setParentescoService,editarParentescoService,deleteParentescoService,getParentescoByIdService,getParentescoAllService} from '@/services/parentesco_service'

const accion = ref(0);
const cve_parentesco = ref(0);
const sexo = ["Masculino", "Femenino"]; //Items del combo sexo
const headers = [
  //Columnas de la tabla
  { text: "id", value: "cve_parentesco" },
  { text: "Clave Accion", value: "cve_tipo_accion" },
  { text: "Nombre", value: "nombre" },
  { text: "Sexo", value: "sexo" },
  { text: "Estatus", value: "estatus" },
  { text: "Acciones", value: "action" },
];
const items = ref([]); //Datos de la tabla
const itemsEstatus = [
  //Items del combo estatus
  { texto: "Activo", val: "1" },
  { texto: "Inactivo", val: "0" },
];
const flagActualizar = ref(false); //Indica si se esta editando algun parentesco
//Modelo
const nombre = ref("");
const sSexo = ref(""); //Almacena el valor seleccionado en el combo sexo
const slcEstatus = ref([]); //Almacena el valor seleccionado en el combo estatus

onMounted(() => {
  itemsTabla();
});

function limpiarCampos() {
  nombre.value = "";
  sSexo.value = "";
  slcEstatus.value = "";
}
async function guardar() {
  // this.$validator.validate().then(valid => {
  // if (valid) {
//   accion.value = 1;
//   axios
//     .post(
//       "/parentescoController.php",
//       qs.stringify({
//         accion: accion.value,
//         nombre: nombre.value,
//         sexo: sSexo.value,
//         estatus: slcEstatus.value,
//       })
//     )
//     .then((res) => {
//       itemsTabla(); //Se recarga la tabla
//       limpiarCampos();
//     })
//     .catch(function (res) {
//       alert(res);
//     });

await setParentescoService(nombre.value,sSexo.value,slcEstatus.value)
itemsTabla(); //Se recarga la tabla
      limpiarCampos();

  // }
  // });
}
async function editarItem() {
  // this.$validator.validate().then(valid => {
  // if (valid) {
//   accion.value = 2;
//   axios
//     .post(
//       "/parentescoController.php",
//       qs.stringify({
//         accion: accion.value,
//         nombre: nombre.value,
//         sexo: sSexo.value,
//         estatus: slcEstatus.value,
//         cve_parentesco: cve_parentesco.value,
//       })
//     )
//     .then((res) => {
//       itemsTabla(); //Se recarga la tabla
//       limpiarCampos();
//       flagActualizar.value = false; //Indica que no se esta editando ningun parentesco
//     })
//     .catch(function (res) {
//       alert(res);
//     });

await editarParentescoService(nombre.value,sSexo.value,slcEstatus.value,cve_parentesco.value)
itemsTabla(); //Se recarga la tabla
      limpiarCampos();
      flagActualizar.value = false; //Indica que no se esta editando ningun parentesco


  // }
  // });
}
async function eliminarItem(item) {
  accion.value = 3;
  cve_parentesco.value = item.cve_parentesco; //Se obtiene la clave del parentesco a eliminar
//   confirm("Seguro que quieres eliminar este parentesco?") && //Mensaje de confirmacion de eliminacion
  await deleteParentescoService(cve_parentesco.value)
    // axios
    //   .post(
    //     "/parentescoController.php",
    //     qs.stringify({
    //       accion: accion.value,
    //       cve_parentesco: cve_parentesco.value,
    //     })
    //   )
    //   .then((res) => {
    //     itemsTabla();
    //   }) //Se recarga la tabla
    //   .catch(function (res) {
    //     alert(res);
    //   });
}
async function cargarParentesco(item) {
  accion.value = 5;
  cve_parentesco.value = item.cve_parentesco; //Se obtiene la clave del parentesco a modificar
//   axios
//     .post(
//       "/parentescoController.php",
//       qs.stringify({
//         accion: accion.value,
//         cve_parentesco: cve_parentesco.value,
//       })
//     )
//     .then((res) => {
//       flagActualizar.value = true; //Indica que se esta editando un parentesco
//       nombre.value = res.data[0].nombre;
//       sSexo.value = res.data[0].sexo;
//       slcEstatus.value = res.data[0].estatus;
//       // $refs.primerInput.focus();//Enfoca el input de nombre
//       window.scrollTo(0, 0); //Mueve el scroll de la pagina hasta arriba
//     })
//     .catch(function (res) {
//       alert(res);
//     });

const data=await getParentescoByIdService(cve_parentesco.value)

      flagActualizar.value = true; //Indica que se esta editando un parentesco
      nombre.value = data[0].nombre;
      sSexo.value = data[0].sexo;
      slcEstatus.value = data[0].estatus;
      window.scrollTo(0, 0); //Mueve el scroll de la pagina hasta arriba

}
async function itemsTabla() {
  accion.value = 4;
//   axios
//     .post("/parentescoController.php", qs.stringify({ accion: accion.value }))
//     .then((res) => {
//       items.value = res.data;
//     })
//     .catch(function (res) {
//       alert(res);
//     });
const data=await getParentescoAllService()
items.value = data;
}
</script>
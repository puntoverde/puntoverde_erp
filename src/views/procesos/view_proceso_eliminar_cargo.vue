<template>
  <v-container>
    <h1 class="accent--text">Cancelar Cargos</h1>
    <v-row>
      <v-col cols="12" lg="4">
        <v-text-field
          clearable
          v-mask="accionMask"
          v-model="accion"
          prepend-inner-icon="mdi-two-factor-authentication"
          label="Número de acción"
          filled
          @keypress.enter="llenarTabla"
        />
      </v-col>
      <v-col>
        <v-btn @click="llenarTabla" color="primary">
          <v-icon> mdi-magnify</v-icon> Buscar
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headersTabla"
      :items="bodyTable"  
      :page.sync="page"
      :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5"
      hide-default-footer
    >
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select
            v-model="itemsPerPage"
            dense
            hide-details
            style="max-width: 50px"
            :items="[5, 10, 50]"
          />
          <span class="mx-2 text-caption"
            >pagina {{ pagination.page }} de {{ pagination.pageCount }}</span
          >
          <v-pagination
            circle
            :total-visible="0"
            v-model="page"
            :length="pagination.pageCount"
          ></v-pagination>
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:item.motivo="{ item }">
        <v-text-field
          v-model="item.motivo"
          label="motivo"
          hide-details
          filled
          dense
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          :disabled="!Boolean(item.motivo)"
          color="error"
          outlined
          @click="borrarCargo(item.cve_cargo, item.motivo,item.cve_cuota)"
        >
          <v-icon color="error"> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>

  </v-container>
</template>


<script setup>
import { ref, getCurrentInstance } from "vue";
import {
  getCargosByAccionService,
  getBorrarCargoService,
  getEstatusAccionByCargoService
} from "@/services/cargo_service";

const root = getCurrentInstance().proxy;

const accionMask = ref({
  mask: "#FFFF",
  tokens: {
    F: {
      pattern: /[0-9a-cA-C]/,
      transform(v) {
        return v.toLocaleUpperCase();
      },
    },
    "#": {
      pattern: /\d/,
    },
  },
});

const accion = ref("");

const headersTabla = [
  { text: "Número Accion", value: "numero_accion" },
  { text: "Concepto", value: "concepto" },
  { text: "Periodo", value: "periodo" },
  { text: "Persona", value: "nombre" },
  { text: "Cantidad", value: "cantidad" },
  { text: "Total", value: "total" },
  { text: "Motivo", value: "motivo" },
  { text: "Eliminar", value: "actions" },
];

const bodyTable = ref([]);

const page = ref(1);
const itemsPerPage = ref(10);

async function llenarTabla() {
  let clasificacion = 0;
  let numero_accion = accion.value;

  if (accion.value.indexOf("A") > 0) {
    clasificacion = 1;
    numero_accion = accion.value.substr(0, accion.value.indexOf("A"));
  } else if (accion.value.indexOf("B") > 0) {
    clasificacion = 2;
    numero_accion = accion.value.substr(0, accion.value.indexOf("B"));
  } else if (accion.value.indexOf("C") > 0) {
    clasificacion = 3;
    numero_accion = accion.value.substr(0, accion.value.indexOf("C"));
  }

  const data = await getCargosByAccionService(numero_accion, clasificacion);
  data.forEach((element) => {
    element.motivo = "";
  });
  bodyTable.value = data;

}

async function borrarCargo(id, motivo,cve_cuota) {

  try{

  

let activa_accion=0;
console.log("entra a borrar el cargo .....")

const eliminar_=await root.$confirm("Desea realmente eliminar este cargo.",{persistent:true,buttonTrueText:'SI',width:350})

console.log(eliminar_)

if(eliminar_)
{

const estatus=await getEstatusAccionByCargoService(id)

if(estatus==2)
{
  const accion_=await root.$confirm("La accion esta bloqueada desea activarla.",{persistent:true,buttonTrueText:'SI'})
  if(accion_)activa_accion=1
  else activa_accion=0
}

  let responsable_cancela = root.$ls.get("user", {
    cve_persona: 0,
  }).cve_persona;
  const data = await getBorrarCargoService(id, responsable_cancela, motivo,activa_accion);

  if(data==1)
  {
    root.$toast.success("Eliminado correctamente");
    llenarTabla();
  }
  else if(data==0 && cve_cuota==1007)
  {
    root.$toast.warning("Es un cargo de invitado y este aun sigue ligado al invitado");
  }

  else{
    root.$toast.error("Hubo un error, recarga el sitio he intenta de nuevo");
  }
}


}
catch(e){
  console.log("error:",e)
}
}
</script> 

<style>
.active {
  color: green;
}
#caja {
  border: 1px solid #000;
}
</style>



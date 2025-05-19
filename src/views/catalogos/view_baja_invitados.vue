<template>
  <div>   
    
    <div class="d-flex justify-space-between mb-5">
      
      <h1 class="accent--text oswald--text">Baja de Invitados</h1>

      <Search v-model="search" :filters="filters" />
    </div>

    <v-data-table
      :items="lst_socios"
      :headers="headers"
      :search="search"
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

      <template v-slot:item.pasado="{ item }">
        <v-chip v-if="item.pasado == 0" color="success"
          >Con Acceso Vigente</v-chip
        >
        <v-chip v-else color="error">Sin Acceso Vigente</v-chip>
      </template>
      <template v-slot:item.ac="{ item }">
        <v-btn
          v-if="item.estatus == 0"
          color="info"
          @click="
            (dialogReingreso = true),
              (cve_accion = item.cve_accion),
              (cve_invitado = item.id),
              (cve_persona = item.cve_persona)
          "
          >Reingresar{{ cve_accion }}</v-btn
        >
        <v-chip v-else>{{ item.fecha_fin }}</v-chip>
      </template>

      <template v-slot:item.eliminar="{ item }">
       
        <v-btn v-if="item.pagado==0" icon color="accent" @click="fnBajaInvitados(item.cve_socio,item.id)" outlined elevation="2"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </template>

      
    </v-data-table>

  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import {InvitadosCargosService,BajaInvitadosService} from '@/services/invitados_service'

const root = getCurrentInstance().proxy;
// #region variables
//tabla 
const headers = [
  { text: "Numero Acción", value: "accion" },
  { text: "Posicion", value: "posicion" },
  { text: "Nombre", value: "nombre" },
  { text: "Apellido Paterno", value: "apellido_paterno" },
  { text: "Apellido Materno", value: "apellido_materno" },
  { text: "Estatus", value: "pasado" },
  { text: "Fin Periodo", value: "fecha_fin" },  
  { text: "Eliminar", value: "eliminar" },
];
const search = ref(null);

//combos
const lst_socios = ref([]);


const page = ref(1);
const itemsPerPage = ref(10);


const nombre_invitado_search = ref("");


// #endregion variables


onMounted(() => {
  CargarInvitados();
});

// #region function


async function CargarInvitados(invitado) {
  // let { data, status } = await $axios.get("invitados", {params: { search_invitado: nombre_invitado_search.value }});
  const data=await InvitadosCargosService(nombre_invitado_search.value)
  lst_socios.value = data;
}

async function fnBajaInvitados(id_socio,id_invitado)
{

  try {
  const confirm=await root.$confirm('Desea realmente eliminar al invitado, seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',{title:'info',width:350,persistent:true})
  if(confirm)
  {
    const data =await BajaInvitadosService(id_socio,id_invitado)
    CargarInvitados()
  }
    
  } catch (error) {
    
  }

}

// #endregion
</script>
<style scoped lang="scss">
.v-input input {
  text-transform: uppercase;
}

.text--decorate {
  text-decoration: underline;
  font-weight: bold;
}
</style>
<template>
  <div>

    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Catalogo Documentos</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :outlined="attrs['aria-expanded'] == 'true'"
            color="primary"
            v-on="on"
            v-bind="attrs"
            fab
            small
            dark
            elevation="1"
            @click="dialog_form=true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="" />
    </div>
    
        <v-data-table
          :headers="headers"
          :items="items"
          :calculate-widths="true"          
          :page.sync="page"
          :search="search"
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

          <template v-slot:item.estatus="{ item }">
            <label v-if="item.estatus == 1">Activo</label>
            <label v-else>Inactivo</label>
          </template>
          <template v-slot:item.action="{ item }">
            <v-hover v-slot="{hover}">
                  <v-btn x-small fab :color="hover?'primary':'accent'" class="mr-1" outlined>
            <v-icon @click="cargarDocumento(item)">
              mdi-pencil
            </v-icon>

              </v-btn>
            </v-hover>
              <v-hover v-slot="{hover}">
              <v-btn x-small :color="hover?'error':'accent'" fab outlined>

            <v-icon @click="abrirDialog(item)"> mdi-delete </v-icon>
              </v-btn>
              </v-hover>
          </template>
        </v-data-table>
     
<v-dialog v-model="dialog_form" max-width="500">
     <v-card>
      <v-toolbar color="secondary" dark>
        <v-toolbar-title>Alta Documento</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="limpiarCampos" icon>
           <v-icon>mdi-close-box</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="primary pt-1">

      </div>
     
      <v-card-text class="pt-4">
        <v-row>
          <v-col lg="12">
            <v-text-field
              @keyup.enter="guardar()"
              
              ref="primerInput"
              label="Nombre"
              v-model="nombre"
            ></v-text-field>
          </v-col>          

          <v-col lg="12">
            <v-select
              :items="lst_tipos"
              item-value="id"
              item-text="tipo"
              v-model="tipo"
              label="Tipo"
              
            ></v-select>
            
          </v-col>

          <v-col lg="12">
            <v-select
            multiple
              :items="['SOCIOS','ACCIONISTA']"
              v-model="procesos"
              label="Proceso"
              
            ></v-select>
            
          </v-col>
        </v-row>
        <br />


      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
              v-if="cve_documento===0"            
              color="primary"
              class="white--text"
              v-on:click="guardar"
              > <v-icon class="mr-2">mdi-content-save</v-icon> Guardar</v-btn
            >
            <v-btn              
              color="primary"
              v-else
              v-on:click="editarItem"
              > <v-icon class="mr-2">mdi-pencil</v-icon> Actualizar</v-btn
            >
      </v-card-actions>
    </v-card>
    </v-dialog>


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
import { onMounted, ref } from "vue";
import isNull from 'lodash/isNull'
import {setDocumentoService,updateDocumentoService,deleteDocumentoService,getDocumentoByIdService,getDocumentoAllService} from '@/services/documentos_service'

   

    const headers = ref([
      { text: "Clave", value: "cve_documento" },
      { text: "Documento", value: "documento" },
      { text: "Tipo", value: "tipo" },
      { text: "Estatus", value: "estatus" },
      { text: "Acciones", value: "action" },
    ]);
    const items = ref([]); //Registros de la tabla
    const dialog = ref(false); //Muestra u oculta el dialog para confirmar una eliminacion
    const dialog_form = ref(false); //Muestra u oculta el dialog para confirmar una eliminacion
    const itemEliminar = ref(null); //Almacena los datos del item a eliminar, para usarlos en el metodo de eliminar
    
    const cve_documento = ref(0);
    const nombre = ref("");
    const tipo = ref();
    const estatus = ref();
    const lst_tipos = ref([
      { id: 1, tipo: "Imagen" },
      { id: 2, tipo: "PDF" },
      { id: 3, tipo: "Word" },
      { id: 4, tipo: "Excel" },
    ]);
    const procesos=ref([])

    const search = ref("");

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
  { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
  { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);


    onMounted(() => {
      itemsTabla();
    });

    function limpiarCampos() {
        cve_documento.value=0
      nombre.value = "";
      tipo.value=''
      estatus.value=0
      dialog_form.value=false
    }

    function abrirDialog(item) {
      itemEliminar.value = item; //Se guardan los datos del documento a eliminar en la variable
      dialog.value = true; //Se muestra el dialog de confirmacion
    }

    async function guardar() {
          // let { data } = await $axios.post("documentos", {
          //   documento: nombre.value,
          //   tipo: tipo.value,
          //   procesos:procesos.value
          // });
          await setDocumentoService(nombre.value,tipo.value,procesos.value)
          itemsTabla(); //Se recarga la tabla
          limpiarCampos();
    }

    async function editarItem() {

          // let { data } = await $axios.put(`documentos/${cve_documento.value}`, {
          //   documento: nombre.value,
          //   tipo: tipo.value,
          //   procesos:procesos.value,
          //   estatus: estatus.value
          // });

          await updateDocumentoService(cve_documento.value,nombre.value,tipo.value,procesos.value,estatus.value)

          itemsTabla(); //Se recarga la tabla
          limpiarCampos();
        
    }

    async function eliminarItem() {
      // await $axios.delete(`documentos/${itemEliminar.value.cve_documento}`);
      await deleteDocumentoService(itemEliminar.value.cve_documento)

      itemsTabla(); //Se recarga la tabla
      itemEliminar.value = null; //Se reinician los datos del documento a eliminar
      dialog.value = false; //Se oculta el dialog de confirmar eliminacion
    }

    async function cargarDocumento(item) {
      //Carga los datos del documento a modificar
      cve_documento.value=item.cve_documento
      // let { data } = await $axios.get(`documentos/${item.cve_documento}`);
      const data=await getDocumentoByIdService(item.cve_documento)

      
      nombre.value = data.documento;
      tipo.value = data.tipo;
      procesos.value=isNull(data.procesos)?[]:data.procesos.split(",")
      estatus.value = data.estatus;
      //$refs.primerInput.focus();//Enfoca al input de nombre del documento
      window.scrollTo(0, 0); //Mueve el scroll de la pagina hasta arriba
      dialog_form.value=true
    }

    async function itemsTabla() {
      // let { data } = await $axios.get("documentos");
      items.value = await getDocumentoAllService();
    }

</script>
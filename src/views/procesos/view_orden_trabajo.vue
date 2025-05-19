<template>
  <div>

    <div class="d-flex justify-space-between">

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small dark
            elevation="1" @click="fnOpenCreate">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Orden trabajo</span>
      </v-tooltip>

      <!-- <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs> -->
      <h1 class="accent--text oswald--text">Orden trabajo</h1>
    </div>

    <!-- <div class="d-flex justify-space-between mb-5">
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
            @click="fnOpenCreate"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Orden trabajo</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="" />
    </div> -->

    <v-data-table :headers="headers" :items="items" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
      class="table-pv rounded-xl elevation-5" hide-default-footer :single-expand="true" :expanded.sync="expanded"
      item-key="id_orden_trabajo" show-expand @item-expanded="fnCargarActividades">
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

      <template v-slot:item.tipo_cuota="{ item }">
        <span v-if="item.tipo_cuota == 1">Persona</span>
        <span v-else>Accion</span>
      </template>

      <template v-slot:item.precio="{ item }">
        <span class="font-weight-black accent--text number--text">
          {{ numeral(item.precio).format("$0,0.[00]") }}
        </span>
      </template>

      <template v-slot:item.opcion_iva="{ item }">
        <span v-if="item.opcion_iva == 1">Iva Incluido</span>
        <span v-else>Mas Iva</span>
      </template>

      <template v-slot:item.genero_aplica="{ item }">
        <v-icon v-if="item.genero_aplica === 'H'">mdi-human-male</v-icon>
        <v-icon v-else-if="item.genero_aplica === 'M'">mdi-human-female</v-icon>
        <v-icon v-else>mdi-human-male-female</v-icon>
      </template>

      <template v-slot:item.edad_aplica="{ item }">
        {{ item.edad_aplica == 0 ? "NA" : `${item.edad_aplica} Años` }}
      </template>

      <template v-slot:item.obligatoria="{ item }">
        <span class="font-weight-bold" :class="{
          'primary--text': item.obligatoria,
          'secondary--text': !item.obligatoria,
        }">{{ item.obligatoria ? "SI" : "NO" }}</span>
      </template>

      <template v-slot:item.estatus="{ item }">

        <v-chip>
          <span v-if="item.estatus == 0"><v-icon color="accent" left>mdi-alert-circle-outline</v-icon> sin iniciar</span>
          <span v-if="item.estatus == 1"><v-icon color="accent darken-1" left>mdi-timer-alert-outline</v-icon>
            trabajando</span>
          <span v-if="item.estatus == 2"><v-icon color="accent darken-2" left>mdi-check-circle-outline</v-icon>
            terminado</span>
          <span v-if="item.estatus == 3"><v-icon color="accent darken-3" left>mdi-cancel</v-icon> cancelado</span>
          <span v-if="item.estatus == 4"><v-icon color="accent darken-4" left>mdi-alert-outline</v-icon> rechazado</span>
        </v-chip>

      </template>

      <template v-slot:item.imagen="{ item }">

        <v-icon large style="cursor: pointer;" @click="fnOpenDialogImagen(item.id_orden_trabajo,item.imagen_evidencia_1,item.imagen_evidencia_2,item.imagen_evidencia_3)">
          mdi-image
        </v-icon>

      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom v-if="item.estatus == 0 && item.genero == 1">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="fnGetEditById(item.id_orden_trabajo)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
          </template>
          <span>Editar orden trabajo</span>
        </v-tooltip>

        <v-tooltip bottom v-if="item.estatus == 0 && item.genero == 1">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab class="mx-2"
              @click="fnCancelarRechazarOrden(item.id_orden_trabajo, 3)"><v-icon>mdi-cancel</v-icon></v-btn>
          </template>
          <span>Cancelar orden trabajo</span>
        </v-tooltip>

        <v-tooltip bottom v-if="item.estatus == 0 && item.atiende == 1">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" x-small icon outlined color="secondary" fab
              @click="fnCancelarRechazarOrden(item.id_orden_trabajo, 4)"><v-icon>mdi-alert-outline</v-icon></v-btn>
          </template>
          <span>rechazar orden trabajo</span>
        </v-tooltip>

      </template>

      <template v-slot:item.data-table-expand="{ on, attrs, expand, isExpanded, item }">
        <v-btn icon v-if="item.atiende == 1" v-on="on" v-bind="attrs" @click=expand(!isExpanded)>

          <v-icon v-if="isExpanded">
            mdi-arrow-down-drop-circle
          </v-icon>
          <v-icon v-else>
            mdi-arrow-up-drop-circle
          </v-icon>
        </v-btn>
      </template>


      <template v-slot:expanded-item="{ headers, item }">
        <!-- <div class="red" style="width:100%"> -->
        <td :colspan="headers.length" style="background-color:#f2f2f2" class="px-10">
          <div class="py-2">
            <div class=" d-flex justify-space-between align-center mb-5" v-if="item.estatus == 0">
              <v-btn color="secondary" class="mb-5" @click="fnOpenAgregarActividad(item)">
                Agregar Actividad
              </v-btn>
              <v-select label="Encargado de la orden trabajo" style="max-width:350px" v-model="encargado_orden_trabajo"
                :items="lst_coloboradores_departamento" item-value="id_colaborador"
                :item-text="(item) => `${item.nomina} - ${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`"
                filled hide-details></v-select>
              <v-btn @click="fnIniciarOrdenTrabajo(item.id_orden_trabajo)" color="primary"
                :disabled="!Boolean(encargado_orden_trabajo) && lst_actividades_orden_trabajo.length > 0">
                Iniciar Orden trabajo
              </v-btn>
            </div>
            <v-list outlined rounded elevation=2>
              <template v-for="(item_act, index) in lst_actividades_orden_trabajo">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ item_act.actividad }}</v-list-item-title>
                    <v-list-item-subtitle><v-icon small class="mr-3">mdi-account</v-icon>
                      <span>{{ item_act.nombre }}</span> <span>{{ item_act.apellido_paterno }}</span>
                      <span>{{ item_act.apellido_materno }}</span> </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action style="row-gap: 5px; width: 250px;">
                    <div class="d-flex justify-end" style="width: 100%;column-gap: 20px;">
                      <div class="d-flex flex-column justify-center align-center">
                        <v-avatar color="info" class="white--text" size="32">
                          {{ item_act.observaciones }}
                        </v-avatar>
                        observaciones
                      </div>
                      <div class="d-flex flex-column" style="row-gap: 5px;">
                        <v-btn outlined color="info" small
                          @click="fnOpenAgregarObservacion(item_act.id_orden_trabajo_actividad)">observaciones</v-btn>
                        <v-btn outlined color="success" small
                          @click="fnOpenAddRequisicion(item_act.id_orden_trabajo_actividad)">Agregar requisicion</v-btn>
                        <v-btn outlined color="warning" small v-if="item_act.estatus == 0"
                          @click="fnTerminarActividad(item_act.id_orden_trabajo_actividad)">terminar</v-btn>
                      </div>
                    </div>
                  </v-list-item-action>
                </v-list-item>
                <v-divider v-if="index < lst_actividades_orden_trabajo.length - 1" />
              </template>
            </v-list>

          </div>
        </td>
        <!-- </div> -->
      </template>


    </v-data-table>

    <v-dialog v-model="dialog" width="600" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Generar orden trabajo</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseCreate"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row class="mt-2">
            <v-col cols="12" md="3" class="py-0">
              <v-text-field :v-model="folio" label="Folio" filled :error-messages="iErrors.folio"></v-text-field>
            </v-col>
            <v-col cols="12" md="9" class="py-0">
              <v-text-field :value="departamento_text" label="Departamento" filled readonly></v-text-field>
            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-text-field v-model="nombre_evento" label="Nombre orden trabajo" class="my-mayus" filled
                :error-messages="iErrors.nombre_evento"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-select v-model="departamento_dirigido" :items="lst_departamentos" item-value="id_departamento"
                item-text="nombre" filled label="Departamento dirigido" class="my-mayus"
                :error-messages="iErrors.departamento_dirigido"></v-select>

            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-text-field :value="colaborador_text" label="Encargado del alta" filled readonly></v-text-field>

            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-select v-model="tipo_orden_trabajo" label="Tipo Orden de Trabajo" :items="lst_tipo_orden_trabajo"
                item-value="id_tipo_orden_trabajo" item-text="tipo_orden_trabajo" filled
                :error-messages="iErrors.id_tipo_orden_trabajo"></v-select>

            </v-col>
            <v-col cols="12" md="6" class="py-0">
              <v-select v-model="id_clasificacion_orden_trabajo" label="Clasificacion"
                :items="lst_clasificacion_orden_trabajo" item-value="id_orden_trabajo_clasificacion" item-text="nombre"
                filled :error-messages="iErrors.id_clasificacion_orden_trabajo"></v-select>

            </v-col>
            <v-col cols="12" md="12" class="py-0">
              <v-menu v-model="menu_usuario_reporte" :close-on-click="false" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field :value="usuerio_reporte_text" label="usuario reporto(opcional)" readonly filled
                    v-bind="attrs" class="menu-text">
                    <template v-slot:append-outer>
                      <v-btn large color="primary" v-on="on"><v-icon>mdi-magnify</v-icon></v-btn>
                    </template>
                  </v-text-field>
                </template>
                <v-card>
                  <v-toolbar color="secondary" elevation="0">
                    <v-text-field v-model="search_usuarios" hide-details solo
                      @keypress.enter="fnBuscarSocios"></v-text-field>
                  </v-toolbar>
                  <v-list>
                    <v-list-item v-for="user_ in lst_usuarios" :key="user_.cve_socio"
                      @click="() => { usuerio_reporte_text = `${user_.nombre} ${user_.apellido_paterno} ${user_.apellido_materno}`; usuerio_reporte_id = user_.cve_socio; menu_usuario_reporte = false; lst_usuarios = []; search_usuarios = undefined }">
                      <v-list-item-content>
                        <v-list-item-title>{{ user_.nombre }} {{ user_.apellido_paterno }} {{ user_.apellido_materno
                          }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-col>

          </v-row>
          <v-textarea v-model="descripcion" label="Descripcion orden trabajo" class="my-mayus" filled
            :error-messages="iErrors.descripcion"></v-textarea>

          <fieldset class="px-5 pt-5 d-flex rounded" style="column-gap: 10px;">
            <legend class="px-2 grey lighten-2 rounded font-weight-bold">Fechas(opcional)</legend>


            <v-menu v-model="menu_one" :close-on-click="true" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="dayjs(fecha_inicio_evento ?? null).isValid() ? dayjs(fecha_inicio_evento).format('D [de] MMMM [de] YYYY') : ''"
                  label="Fecha inicio" prepend-inner-icon="mdi-calendar" filled v-on="on" v-bind="attrs"
                  :error-messages="iErrors.fecha_inicio_evento" clearable
                  @click:clear="fecha_inicio_evento = undefined"></v-text-field>
              </template>
              <v-date-picker v-model="fecha_inicio_evento" color="secondary" locale="es-mx"
                @input="menu_one = false"></v-date-picker>
            </v-menu>

            <v-menu v-model="menu_two" :close-on-click="true" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="dayjs(fecha_fin_evento ?? null).isValid() ? dayjs(fecha_fin_evento).format('D [de] MMMM [de] YYYY') : ''"
                  label="Fecha conclusion" prepend-inner-icon="mdi-calendar" filled v-on="on" v-bind="attrs"
                  :error-messages="iErrors.fecha_fin_evento" clearable
                  @click:clear="fecha_fin_evento = undefined"></v-text-field>
              </template>
              <v-date-picker v-model="fecha_fin_evento" color="secondary" locale="es-mx"
                @input="menu_two = false"></v-date-picker>
            </v-menu>

          </fieldset>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn v-if="Boolean(id_orden_trabajo)" @click="fnUpdateOrdenTrabajo" block
            color="secondary">Actualizar</v-btn>
          <v-btn v-else @click="fnCreateOrdenTrabajo" block color="secondary">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_actividad" width=500 scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Agregar actividad a Orden trabajo {{ id_orden_trabajo }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pt-10">
          <v-select label="persona encargada" v-model="encargado_actividad" :items="lst_coloboradores_departamento"
            item-value="id_colaborador"
            :item-text="(item) => `${item.nomina} - ${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`"
            filled></v-select>
          <v-select label="tipo actividad" v-model="tipo_orden_trabajo_actividad"
            :items="lst_tipo_orden_trabajo_actividad" item-value="id_orden_trabajo_actividad" item-text="nombre"
            filled></v-select>
          <v-menu>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="Boolean(fecha_planeada) ? dayjs(fecha_planeada).format('DD-MM-YYYY') : ''"
                label="fecha planeada" prepend-inner-icon="mdi-calendar" v-on="on" v-bind="attrs" filled></v-text-field>
            </template>
            <v-date-picker v-model="fecha_planeada"></v-date-picker>
          </v-menu>
          <v-textarea v-model="actividad_descripcion" label="descripcion" filled></v-textarea>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer> <v-btn outlined color="secondary" @click="dialog_actividad = false">Cancelar</v-btn>
          <v-btn color="secondary" @click="fnAgregarActividad">Agregar Actividad</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog_observaciones" width=500 scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>alta observacion</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="fnCloseAgregarObservacion" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">

          <v-text-field label="fecha" filled :value="fecha_observacion" readonly></v-text-field>
          <!-- <v-select v-model="" label="responsable" filled></v-select> -->
          <v-select label="Responsable" v-model="responsable_observacion" :items="lst_coloboradores_departamento"
            item-value="id_colaborador"
            :item-text="(item) => `${item.nomina} - ${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`"
            filled></v-select>
          <v-textarea v-model="observacion" filled></v-textarea>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn block color="secondary" @click="fnAgregarObservacion">finalizar</v-btn>
        </v-card-actions>
      </v-card>


    </v-dialog>


    <v-dialog v-model="dialog_requisicion" fullscreenx persistent>
      <v-card width="100vw" height="100vh">
        <requisicion-producto :id_actividad="id_orden_trabajo_actividad"
          @emit-close-requisicion="dialog_requisicion = false"></requisicion-producto>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_imagen" width="650" persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>imagenes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogImagen">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="d-flex px-0 pt-5" style="justify-content: space-evenly;">
          <v-card width="200" height="252">
              <v-img v-if="foto_1" :src="foto_1" height="200"></v-img>
              <v-img v-else :src="img_default" width="200" height="200" class="d-flex justify-center align-center"><span>Sin foto</span></v-img>
              <v-card-actions class="white">
                <v-spacer></v-spacer>
                <v-btn color="error" icon :disabled="!Boolean(foto_1)" @click="fnCancelarFoto(1)"> <v-icon>mdi-delete</v-icon> </v-btn>
                <v-btn color="info" icon  @click="open_1"> <v-icon>mdi-upload</v-icon></v-btn>
                <v-btn color="success" icon :disabled="!Boolean(files_1?.length>0)" @click="fnUploadFoto(1)"> <v-icon>mdi-check</v-icon> </v-btn>                
              </v-card-actions>
          </v-card>
          <v-card width="200" height="252">
            <v-img v-if="foto_2" :src="foto_2" height="200"></v-img>
            <v-img v-else :src="img_default" width="200" height="200" class="d-flex justify-center align-center"><span>Sin foto</span></v-img>
            <v-card-actions class="white">
                <v-spacer></v-spacer>
                <v-btn color="error" icon :disabled="!Boolean(foto_2)" @click="fnCancelarFoto(2)"> <v-icon>mdi-delete</v-icon> </v-btn>
                <v-btn color="info" icon  @click="open_2"> <v-icon>mdi-upload</v-icon></v-btn>
                <v-btn color="success" icon :disabled="!Boolean(files_2?.length>0)" @click="fnUploadFoto(2)"> <v-icon>mdi-check</v-icon> </v-btn>                
              </v-card-actions>
          </v-card>
          <v-card width="200" height="252" >
            <v-img v-if="foto_3" :src="foto_3" height="200"></v-img>
            <v-img v-else :src="img_default" width="200" height="200" class="d-flex justify-center align-center"><span>Sin foto</span></v-img>
            <v-card-actions class="white">
                <v-spacer></v-spacer>
                <v-btn color="error" icon :disabled="!Boolean(foto_3)" @click="fnCancelarFoto(3)"> <v-icon>mdi-delete</v-icon> </v-btn>
                <v-btn color="info" icon  @click="open_3"> <v-icon>mdi-upload</v-icon></v-btn>
                <v-btn color="success" icon :disabled="!Boolean(files_3?.length>0)" @click="fnUploadFoto(3)"> <v-icon>mdi-check</v-icon> </v-btn>                
              </v-card-actions>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>
<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import numeral from "numeral";
import dayjs from 'dayjs'
import RequisicionProducto from '@/views/nuevo/view_requisicion_producto_orden_trabajo_actividad.vue'
import {
  getOrdenesTabajoService,
  getOrdenTrabajoByIdService,
  setCreateOrdenTrabajoService,
  updateOrdenTrabajoService,
  getDepartamentoService,
  getDepartamentosService,
  updateCancelarRechzarOrdenTrabajoService,
  getOrdenTrabajoActividadesService,
  createOrdenTrabajoActividadService,
  updateIniciarOrdenTrabajoService,
  terminarOrdenTrabajoActividadService,
  getTipoOrdenTrabajoService,
  getTipoOrdenTrabajoActividadService,
  createActividadesObservacionesService,
  getClasificacionOrdenTrabajoService,
  addFotoOrdenTrabajoService,
  cancelarFotoOrdenTrabajoService,
  getFotoOrdenTrabajoService 
} from "@/services/orden_trabajo_service";
import { getSociosByAccionNumeroClasificacionService } from '@/services/socios_service'
import { getAllColaboradoresByAreaService } from '@/services/incidencias_service'
import { useValidacionOrdenTrabajo } from '@/composables/useValidacionOrdenTrabajo'
import {useFileDialog} from '@vueuse/core'

const root = getCurrentInstance().proxy;

const { iValid, iErrors, iClear } = useValidacionOrdenTrabajo()
const {files:files_1,onChange:onChange_1,open:open_1,reset:reset_1}=useFileDialog({accept:'.png,.jpg'})
const {files:files_2,onChange:onChange_2,open:open_2,reset:reset_2}=useFileDialog({accept:'.png,.jpg'})
const {files:files_3,onChange:onChange_3,open:open_3,reset:reset_3}=useFileDialog({accept:'.png,.jpg'})

const id_orden_trabajo = ref(0)
const id_orden_trabajo_2 = ref(0)

const departamento_text = ref()
const colaborador_text = ref()

const id_departamento = ref()
const departamento_dirigido = ref()
const id_persona = ref()
const folio = ref()
const nombre_evento = ref()
const descripcion = ref()
const fecha_inicio_evento = ref()
const fecha_fin_evento = ref()
const tipo_orden_trabajo = ref()

const tipo_orden_trabajo_actividad = ref()
const fecha_planeada = ref()

const dialog = ref(false)
const menu_one = ref(false)
const menu_two = ref(false)

const lst_departamentos = ref([])
const lst_tipo_orden_trabajo = ref([])
const lst_tipo_orden_trabajo_actividad = ref([])


const lst_actividades_orden_trabajo = ref([])

const lst_coloboradores_departamento = ref([])
const encargado_orden_trabajo = ref()

const dialog_actividad = ref(false)
const actividad_descripcion = ref()
const encargado_actividad = ref()

const search_usuarios = ref()
const lst_usuarios = ref([])

const menu_usuario_reporte = ref(false)
const usuerio_reporte_text = ref()
const usuerio_reporte_id = ref()

const dialog_observaciones = ref(false)
const fecha_observacion = dayjs().format('DD [de] MMMM [de] YYYY')
const responsable_observacion = ref()
const observacion = ref()

const id_orden_trabajo_actividad = ref()


const dialog_requisicion = ref(false)

const lst_clasificacion_orden_trabajo = ref([])
const id_clasificacion_orden_trabajo = ref()

const dialog_imagen=ref(false)

const foto_1=ref()
const foto_2=ref()
const foto_3=ref()

const img_default = new URL('@/assets/image/image-outline.svg', import.meta.url).href



const headers = ref([
  { text: "Numero Orden", value: "id_orden_trabajo" },
  { text: "Nombre orden trabajo", value: "nombre_evento" },
  { text: "Tipo orden trabajo", value: "tipo_orden_trabajo" },
  { text: "Clasificacion orden trabajo", value: "clasificacion" },
  { text: "Descripcion", value: "descripcion" },
  { text: "Fecha registro", value: "fecha_registro" },
  { text: "Inicio", align: "right", value: "fecha_inicio_evento" },
  { text: "Conclusion", value: "fecha_fin_evento" },
  { text: "Encargado del alta", value: "nombre", align: "center" },
  { text: "Actividades con observacion", value: "observaciones", align: "center" },
  { text: "Imagen", value: "imagen", align: "center" },
  { text: "Estatus", align: "center", value: "estatus" },
  { text: "", align: "center", value: "actions", sortable: false, width: '150px' },
]);
const items = ref([]);
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

const expanded = ref([])

const filters = ref([
  // { label: "Tipo Accion", key: "nivel", value: "", type: "select" },
  // { label: "Grado", key: "nivel_grado", value: "", type: "text" },
]);

onMounted(() => {
  const nombre = root.$ls.get("user", { nombre: '' }).nombre
  const paterno = root.$ls.get("user", { apellido_paterno: '' }).apellido_paterno
  const materno = root.$ls.get("user", { apellido_materno: '' }).apellido_materno
  id_persona.value = root.$ls.get("user", { cve_persona: 0 }).cve_persona
  colaborador_text.value = `${nombre} ${paterno} ${materno}`
  fnGetOrdenesTrabajo();
  fnGetDepartamentosDisponibles()
  fnGetColoboradoresByArea()
  fnGetTipoOrdenTrabajo()
  fnGetTipoOrdenTrabajoActividad()
  getClasificacionOrdenTrabajo()
});

async function fnGetOrdenesTrabajo() {
  items.value = await getOrdenesTabajoService(id_persona.value);
}

async function fnGetDepartamento() {
  try {
    const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona
    const { id_departamento: id_depa, nombre } = await getDepartamentoService(cve_persona_session)
    departamento_text.value = nombre
    id_departamento.value = id_depa
  } catch (error) {

  }
}

async function fnGetDepartamentosDisponibles() {
  try {
    const data = await getDepartamentosService()
    lst_departamentos.value = data
  } catch (error) {

  }
}

async function fnOpenCreate() {
  await fnGetDepartamento();
  await getClasificacionOrdenTrabajo()
  dialog.value = true
}

function fnCloseCreate() {
  iClear();
  id_orden_trabajo.value = undefined

  folio.value = undefined
  departamento_dirigido.value = undefined
  nombre_evento.value = undefined
  descripcion.value = undefined
  fecha_inicio_evento.value = undefined
  fecha_fin_evento.value = undefined
  menu_usuario_reporte.value = false
  usuerio_reporte_text.value = undefined
  usuerio_reporte_id.value = undefined
  id_clasificacion_orden_trabajo.value = undefined
  dialog.value = false
}

async function fnGetEditById(id) {
  try {
    const data = await getOrdenTrabajoByIdService(id)
    id_orden_trabajo.value = id;
    departamento_dirigido.value = data.id_departamento_dirigido
    nombre_evento.value = data.nombre_evento
    descripcion.value = data.descripcion
    fecha_inicio_evento.value = data.fecha_inicio_evento
    fecha_fin_evento.value = data.fecha_fin_evento
    tipo_orden_trabajo.value = data.id_tipo_orden_trabajo
    id_clasificacion_orden_trabajo.value = data.id_orden_trabajo_clasificacion
    await fnGetDepartamento()
    await getClasificacionOrdenTrabajo()
    dialog.value = true
  } catch (error) {

  }
}

async function fnCreateOrdenTrabajo() {

  try {
    id_orden_trabajo.value = 0
    const data_send = {
      folio: folio.value,
      id_departamento: id_departamento.value,
      departamento_dirigido: departamento_dirigido.value,
      id_persona: id_persona.value,
      id_tipo_orden_trabajo: tipo_orden_trabajo.value,
      nombre_evento: nombre_evento.value,
      descripcion: descripcion.value,
      fecha_inicio_evento: fecha_inicio_evento.value,
      fecha_fin_evento: fecha_fin_evento.value,
      cve_socio: usuerio_reporte_id.value,
      id_clasificacion_orden_trabajo: id_clasificacion_orden_trabajo.value
    }

    const data_valid = await iValid(data_send)
    console.log("🚀 ~ data_valid:", data_valid)
    const data = await setCreateOrdenTrabajoService(data_valid)
    console.log("🚀 ~ data:", data)
    fnCloseCreate()
    fnGetOrdenesTrabajo()


  } catch (error) {

  }

}
async function fnUpdateOrdenTrabajo() {

  try {

    const data_send = {
      folio: folio.value,
      id_departamento: id_departamento.value,
      departamento_dirigido: departamento_dirigido.value,
      id_persona: id_persona.value,
      id_tipo_orden_trabajo: tipo_orden_trabajo.value,
      nombre_evento: nombre_evento.value,
      descripcion: descripcion.value,
      fecha_inicio_evento: fecha_inicio_evento.value,
      fecha_fin_evento: fecha_fin_evento.value,
      cve_socio: usuerio_reporte_id.value,
      id_clasificacion_orden_trabajo: id_clasificacion_orden_trabajo.value
    }

    const data_valid = await iValid(data_send)
    console.log("🚀 ~ data_valid:", data_valid)
    const data = await updateOrdenTrabajoService(id_orden_trabajo.value, data_valid)
    console.log("🚀 ~ data:", data)
    fnCloseCreate()
    fnGetOrdenesTrabajo()


  } catch (error) {

  }

}


async function fnCancelarRechazarOrden(id, estatus) {
  try {
    const data = await updateCancelarRechzarOrdenTrabajoService(id, estatus)
    console.log("🚀 ~ data:", data)
    fnGetOrdenesTrabajo()
  } catch (error) {

  }
}

async function fnGetColoboradoresByArea() {
  try {
    const cve_persona_session = root.$ls.get("user", { cve_persona: 0 }).cve_persona;
    lst_coloboradores_departamento.value = await getAllColaboradoresByAreaService(cve_persona_session)
  } catch (error) {

  }
}

function fnOpenAgregarActividad(orden) {
  console.log(orden)
  id_orden_trabajo_2.value = orden.id_orden_trabajo
  dialog_actividad.value = true
}

async function fnCargarActividades({ item, value }) {
  console.log(item, value)
  try {

    if (value) {
      id_orden_trabajo_2.value = item.id_orden_trabajo
      lst_actividades_orden_trabajo.value = await getOrdenTrabajoActividadesService(item.id_orden_trabajo)
    }
    else {
      id_orden_trabajo_2.value = undefined
    }

  } catch (error) {

  }


}

async function fnAgregarActividad() {
  try {
    await createOrdenTrabajoActividadService(id_orden_trabajo_2.value, encargado_actividad.value, actividad_descripcion.value, tipo_orden_trabajo_actividad.value, fecha_planeada.value)
    await fnCargarActividades({ item: { id_orden_trabajo: id_orden_trabajo_2.value }, value: true })

    id_orden_trabajo_2.value = undefined
    encargado_actividad.value = undefined
    actividad_descripcion.value = undefined
    tipo_orden_trabajo_actividad.value = undefined
    fecha_planeada.value = undefined
    dialog_actividad.value = false

  } catch (error) {

  }
}


async function fnIniciarOrdenTrabajo(id_orden_trabajo_) {

  try {
    const confirm = await root.$confirm(
      'Desea realmente iniciar orden de trabajo',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      await updateIniciarOrdenTrabajoService(id_orden_trabajo_, encargado_orden_trabajo.value)
      fnGetOrdenesTrabajo()
    }
  } catch (error) {

  }
}


async function fnTerminarActividad(id_actividad) {
  try {
    const confirm = await root.$confirm(
      'Desea realmente terminar la actividad',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      await terminarOrdenTrabajoActividadService(id_actividad)
      await fnCargarActividades({ item: { id_orden_trabajo: id_orden_trabajo.value }, value: true })
    }
  } catch (error) {

  }
}

async function fnGetTipoOrdenTrabajo() {
  try {
    lst_tipo_orden_trabajo.value = await getTipoOrdenTrabajoService()
  } catch (error) {

  }
}

async function fnGetTipoOrdenTrabajoActividad() {
  try {
    lst_tipo_orden_trabajo_actividad.value = await getTipoOrdenTrabajoActividadService()
  } catch (error) {

  }
}

async function fnBuscarSocios() {

  let indexTripartidas = -1;
  let numero_accion = 0;
  let clasificacion = 0;

  if (search_usuarios.value.indexOf("A") > -1) {
    indexTripartidas = search_usuarios.value.indexOf("A");
    clasificacion = 1;
  } else if (search_usuarios.value.indexOf("B") > -1) {
    indexTripartidas = search_usuarios.value.indexOf("B");
    clasificacion = 2;
  } else if (search_usuarios.value.indexOf("C") > -1) {
    indexTripartidas = search_usuarios.value.indexOf("C");
    clasificacion = 3;
  }

  numero_accion = search_usuarios.value;

  if (indexTripartidas > -1) {
    numero_accion = search_usuarios.value.substr(0, indexTripartidas);
  }

  console.log("numero_accion:", numero_accion);
  console.log("clasificacion:", clasificacion);

  try {
    lst_usuarios.value = await getSociosByAccionNumeroClasificacionService(numero_accion, clasificacion)
  } catch (error) {

  }
}


async function fnOpenAgregarObservacion(id_actividad_) {
  id_orden_trabajo_actividad.value = id_actividad_
  dialog_observaciones.value = true
}

function fnCloseAgregarObservacion() {
  id_orden_trabajo_actividad.value = undefined
  responsable_observacion.value = undefined
  observacion.value = undefined
  dialog_observaciones.value = false
}

async function fnAgregarObservacion() {
  await createActividadesObservacionesService(id_orden_trabajo_actividad.value, responsable_observacion.value, observacion.value)
  lst_actividades_orden_trabajo.value = await getOrdenTrabajoActividadesService(id_orden_trabajo_2.value)
  id_orden_trabajo_actividad.value = undefined
  responsable_observacion.value = undefined
  observacion.value = undefined
  dialog_observaciones.value = false

}


function fnOpenAddRequisicion(id_actividad_) {
  id_orden_trabajo_actividad.value = id_actividad_
  dialog_requisicion.value = true
}


async function getClasificacionOrdenTrabajo() {
  lst_clasificacion_orden_trabajo.value = await getClasificacionOrdenTrabajoService(id_departamento.value)
}

async function fnOpenDialogImagen(id_orden_trabajo_,imagen1,imagen2,imagen3)
{
try{
  foto_1.value= await getFotoOrdenTrabajoService(imagen1)
  foto_2.value= await getFotoOrdenTrabajoService(imagen2)
  foto_3.value= await getFotoOrdenTrabajoService(imagen3)
}catch(e){}

  id_orden_trabajo.value=id_orden_trabajo_
  dialog_imagen.value=true
}

function closeDialogImagen()
{
  id_orden_trabajo.value=undefined
  reset_1()
  reset_2()
  reset_3()
  foto_1.value=undefined
  foto_2.value=undefined
  foto_3.value=undefined
  dialog_imagen.value=false
}

onChange_1(async (files)=>{
   const [file_]=files
  foto_1.value=await new Promise((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload =()=>resolve(reader.result);
    reader.onerror = reject
    reader.readAsDataURL(file_)
  })
})

onChange_2(async (files)=>{
   const [file_]=files
  foto_2.value=await new Promise((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload =()=>resolve(reader.result);
    reader.onerror = reject
    reader.readAsDataURL(file_)
  })
})

onChange_3(async (files)=>{
   const [file_]=files
  foto_3.value=await new Promise((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload =()=>resolve(reader.result);
    reader.onerror = reject
    reader.readAsDataURL(file_)
  })
})

function fnUploadFoto(tipo)
{  


  try {

    if(tipo==1)
    {
      addFotoOrdenTrabajoService(id_orden_trabajo.value,files_1.value[0],1)
    }
    else if(tipo==2)
    {
      addFotoOrdenTrabajoService(id_orden_trabajo.value,files_2.value[0],2)
    }
    else{
      addFotoOrdenTrabajoService(id_orden_trabajo.value,files_3.value[0],3)
    }

    
  } catch (error) {
    
  }

}

async function fnCancelarFoto(tipo)
{  


  try {

    if(tipo==1)
    {
      await cancelarFotoOrdenTrabajoService(id_orden_trabajo.value,1)
      reset_1()
      foto_1.value=undefined
    }
    else if(tipo==2)
    {
      await cancelarFotoOrdenTrabajoService(id_orden_trabajo.value,2)
      reset_2()
      foto_2.value=undefined
    }
    else{
      await cancelarFotoOrdenTrabajoService(id_orden_trabajo.value,3)
      reset_3()
      foto_3.value=undefined
    }

    
  } catch (error) {
    
  }

}



</script>

<style>
.menu-text .v-input__append-outer {
  /* background-color: red!important; */
  margin-top: 5px;
  display: flex;
  align-items: center;
  /* height: 56px; */
}
</style>
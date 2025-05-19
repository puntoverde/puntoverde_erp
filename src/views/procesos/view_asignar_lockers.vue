<template>
  <div class="mx-5">

    <h1 class="grey--text mb-2">Proceso Asignar Lockers</h1>

    <v-toolbar class="grey rounded" content-class="pv-gap-toolbar" >

      <div class="d-flex" style=" width: 100%;column-gap: 15px;">

        
        <v-text-field v-model="numero_locker" label="Numero Locker" hide-details class="my-mayus" dense solo></v-text-field>
        <v-text-field v-model="numeroAccion" label="Numero Accion" v-mask="accionMask" hide-details dense
        solo></v-text-field>
        <v-text-field v-model="nombre" label="Nombre" hide-details solo dense></v-text-field>
        <v-select label="Ubicacion" hide-details solo v-model="edificio" :items="lst_edificios" item-value="cve_edificio"
        item-text="nombre" dense></v-select>
        <v-btn @click="getBuscarLockers"><v-icon>mdi-magnify</v-icon>Buscar</v-btn>
        
      </div>
    </v-toolbar>

    <v-row class="mt-5">
      <v-col lg="5" style="max-height:calc(100vh - 215px);overflow-y:auto">
        <v-item-group v-model="cve_locker">
          <v-item v-slot="{ active, toggle }" v-for="n in lst_lockers" :key="n.cve_locker" :value="n.cve_locker">
            <v-row>
              <v-col>
                <v-card elevation="5" class="border-inactive" :class="[{ 'border-active primary--text': active }]">
                  <v-card-title class="d-flex justify-space-between">
                    <div class="d-flex flex-column">
                      <span style="font-size:27px" class="mb-3">
                        Lockers #{{ n.numero_locker }}
                      </span>
                      <span style="font-size:17px;color:#000">
                        Locker Anterior #{{ n.numero_locker_anterior }} <v-btn :disabled="!active" fab x-small icon
                          depressed color="info"
                          @click="dialog_edit_nlocker = true"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                      </span>
                    </div>

                    <span class="d-flex justify-space-around align-center align-self-start">
                      <span class="subtitle-2">No Regularizado</span>
                      <v-switch v-model="n.estado" @change="cambioEstadoLocker(n.cve_locker, n.estado)" color="primary"
                        hide-details class="mt-0 pt-0 mx-2" true-value="REGULARIZADO"
                        false-value="NOREGULARIZADO"></v-switch>
                      <span class="subtitle-2">Regularizado</span></span>

                  </v-card-title>
                  <v-card-text>
                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title>
                          <h3 class="accent--text">
                            Propietario <v-btn :disabled="!active" fab x-small icon depressed color="info"
                              @click="dialog_edit_dueno = true"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                          </h3>
                        </v-list-item-title>
                        <v-list-item-subtitle><b>NOMBRE:</b>
                          {{ n.propietario }}</v-list-item-subtitle>
                        <v-list-item-subtitle><b>ACCION:</b>
                          {{ n.accion_propietario }}</v-list-item-subtitle>
                        <v-list-item-subtitle><b>UBICACION:</b>
                          {{ n.ubicacion_edificio }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title>
                          <h3 class="accent--text">
                            Rentador <v-btn :disabled="!active" fab x-small icon depressed color="info"
                              @click="dialog_edit = true"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                          </h3>
                        </v-list-item-title>
                        <v-list-item-subtitle><b>NOMBRE:</b>
                          {{ n.rentador }}</v-list-item-subtitle>
                        <v-list-item-subtitle><b>ACCION:</b>
                          {{ n.accion_rentador }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item three-line>
                      <v-list-item-content>
                        <v-list-item-title>
                          <h3 class="accent--text">
                            Permuta <v-btn :disabled="!active" fab x-small icon depressed color="info"
                              @click="dialog_permuta = true"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                          </h3>
                        </v-list-item-title>

                        <v-list-item-subtitle><b>PERMUTA CON:</b>
                          {{ n.permuta }}</v-list-item-subtitle>


                      </v-list-item-content>
                    </v-list-item>

                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="toggle" block :color="active ? 'primary' : 'grey'">Seleccionar Locker</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-item>
        </v-item-group>
      </v-col>
      <v-col lg="7">
        <v-card width="100%">
          <v-card-title class="d-flex justify-space-between">Historico
            <v-btn color="info" @click="dialog = true" :disabled="!cve_locker || flagAgregar"><v-icon
                class="mr-2">mdi-locker</v-icon>Asignar Locker</v-btn></v-card-title>
        </v-card>
        <v-list dense>

          <v-list-item v-for="(item, i) in lst_lockers_asignados" :key="i + '-historico'" class="elevation-1">
      
            <v-list-item-avatar>
              <v-menu open-on-hover top offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-on="on" v-bind="attrs" small fab depressed
                    :class="{ error: item.estatus == 0, success: item.estatus == 1 && item.activo == 1, warning: item.estatus == 1 && item.activo == 0 }">
                    <v-icon v-if="item.estatus == 0">mdi-alert-octagon</v-icon>
                    <v-icon v-if="item.estatus == 1 && item.activo == 1">mdi-alert-circle-check</v-icon>
                    <v-icon v-if="item.estatus == 1 && item.activo == 0">mdi-alert</v-icon>
                  </v-btn>
                </template>
                <v-card class="pa-3"
                  :class="{ error: item.estatus == 0, success: item.estatus == 1 && item.activo == 1, warning: item.estatus == 1 && item.activo == 0 }"
                  dark>
                  <span v-if="item.estatus == 0">Cancelado: {{ item.fecha_cancelacion }}</span>
                  <span v-if="item.estatus == 1 && item.activo == 1">Activo hasta: {{ item.fecha_fin }}</span>
                  <span v-if="item.estatus == 1 && item.activo == 0">Inactivo desde: {{ item.fecha_fin }}</span>
                </v-card>
              </v-menu>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.rentador }}, NumContrato:({{ item.folio_con }})</v-list-item-title>
              <v-list-item-subtitle>Periodo Renta: del {{dayjs(item.fecha_incio).year() === dayjs(item.fecha_fin).year() ? dayjs(item.fecha_incio).format('DD [de] MMM'):dayjs(item.fecha_incio).format('DD[de] MMM[del] YYYY') }} al {{ dayjs(item.fecha_fin).format('DD [de] MMM[del] YYYY') }}
                , Costo:{{ numeral(item.total).format('$0,0[.]00') }}, Folio Pago: {{ item.folio }}</v-list-item-subtitle>
              <v-list-item-subtitle>
                <v-btn fab x-small icon depressed color="info"
                  @click="openEditarObservacion(item)"><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                Observaciones:{{ item.observaciones }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="flex-row">             
              <v-btn icon color="error" outlined small class="mr-1" v-if="item.activo==1"
                @click="dialog_confirm_eliminar = true, cve_persona = item.cve_persona"><v-icon>mdi-delete</v-icon></v-btn>
              <v-btn icon color="info" outlined small class="ml-1"
                @click="detalleContrato(item.cve_asignacion_locker, item.cve_persona, item.documento)"><v-icon>mdi-{{
                  isNull(item.documento) ? 'paperclip' : 'file-edit' }}</v-icon></v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="60%" scrollable persistent content-class="no-radius">
      <v-card tile>
        <!-- <v-card-title class="d-flex justify-space-between"> -->
          <!-- Asignar Locker -->
          <!-- <div class="d-flex justify-space-around">
            <v-text-field v-model="nombre_socio" solo-inverted dense hide-details label="Nombre Socio"
              class="mr-2"></v-text-field>
            <v-text-field v-model="accion_socio" solo-inverted dense hide-details label="Accion" class="mr-2"
              v-mask="accionMask"></v-text-field>
            <v-btn color="info" @click="getSocios"><v-icon>mdi-magnify</v-icon> Buscar</v-btn>
          </div> -->
        <!-- </v-card-title> -->
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Asignar Locker</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex justify-space-around">
            <v-text-field v-model="nombre_socio" solo-inverted dense hide-details label="Nombre Socio"
              class="mr-2"></v-text-field>
            <v-text-field v-model="accion_socio" solo-inverted dense hide-details label="Accion" class="mr-2"
              v-mask="accionMask"></v-text-field>
            <v-btn color="#29485a" @click="getSocios"><v-icon>mdi-magnify</v-icon> Buscar</v-btn>
          </div>
        </v-toolbar>
        <v-divider class="primary" style="min-height: 3px;"></v-divider>
        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="8"><v-list dense>
                <v-subheader>Socios</v-subheader>
                <v-list-item-group v-model="cve_persona" color="primary">
                  <v-list-item v-for="(item, i) in lst_socios" :key="i + '-historico'" :value="item.cve_persona">
                    <v-list-item-icon>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.rentador }}</v-list-item-title>
                      <v-list-item-subtitle>Accion: {{ item.accion }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list></v-col>
            <v-col cols="4" style="text-align: center">
              <v-chip label color="primary" class="mb-1">{{
                cuota.descripcion
              }}</v-chip>
              <v-text-field outlined dense v-model="costo_cuota"></v-text-field>
              <v-date-picker v-model="dias_renta" range>
                <v-chip label style="width: 290px" class="p-auto">{{
                  mostrarFechas
                }}</v-chip>
              </v-date-picker>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" outlined @click="cerrarDialog"><v-icon>mdi-close</v-icon> Cancelar</v-btn>
          <v-btn color="secondary" :disabled="!flagGuardar" @click="dialog_confirm = true"><v-icon>mdi-content-save</v-icon> Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_confirm" width="400" persistent>
      <v-card>
        <v-card-title>Alert</v-card-title>
        <v-card-text>
          Desea realmente asignar el locker al usuario en caso de si sleccionar
          opcion [Aceptar] en caso contrario seleccione [Cancelar]
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog_confirm = false">Cancelar</v-btn>
          <v-btn color="info" @click="asignarLocker">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_confirm_eliminar" width="400" persistent>
      <v-card>
        <v-card-title>Alert</v-card-title>
        <v-card-text>
          Desea realmente eliminar la renta del locker, en caso de si seleccionar
          opcion [Aceptar] en caso contrario seleccione [Cancelar].
          <br>
          nota:describa el motivo
          <v-textarea v-model="motivo_cancelacion" filled rows="3" label="Motivo cancelacion. min 10 caracteres"></v-textarea>
        </v-card-text>        
        <v-card-actions>          
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog_confirm_eliminar = false">Cancelar</v-btn>
          <v-btn color="info" @click="eliminarRentaLocker" :disabled="motivo_cancelacion.trim().length<=10">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- dialog adjuntar contrato -->
    <v-dialog v-model="dialog_contrato" width="600" persistent>
      <v-card>        
        <v-toolbar color="secondary" dark elevation="0">
          <v-toolbar-title>
            Adjuntar Contrato
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseAdjuntar"> <v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>        
        <v-divider style="min-height: 3px;" class="primary"></v-divider>
        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12">
              <v-text-field label="Numero Contrato" v-model="numero_contrato"></v-text-field>
            </v-col>
            <v-col cols="12">
              <!-- <v-btn depressed tile @click="openFile">Adjuntar Documento</v-btn> -->
              <v-btn depressed tile @click="open" :color="doc_contrato?.[0]?'info':'grey'">Adjuntar Documento</v-btn>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Observacion" v-model="observaciones" filled>

              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveContrato" color="secondary">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_edit" width="500" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Editar Rentador</v-toolbar-title>
          <v-text-field v-model="nombre_editar" solo-inverted dense hide-details label="Nombre Socio" class="mx-2"
            @keypress.enter="getSociosEditar" prepend-inner-icon="mdi-magnify"></v-text-field>
          <v-btn icon @click="closeSocio"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider style="min-height: 3px;" class="primary"></v-divider>
        <v-card-text>
          <v-list dense>
            <v-subheader>Socios</v-subheader>
            <v-list-item-group v-model="cev_persona_editar" color="primary">
              <v-list-item v-for="(item, i) in lst_socios_editar" :key="i + '-historico'" :value="item.cve_persona">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.rentador }}</v-list-item-title>
                  <v-list-item-subtitle>Accion: {{ item.accion }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" :disabled="!cev_persona_editar" :loading="loading_edit_socios"
            @click="asignarLockerEditar"><v-icon class="mr-1">mdi-content-save</v-icon> Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_edit_dueno" width="500" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Editar Dueño</v-toolbar-title>
          <v-text-field v-model="nombre_editar_dueno" solo-inverted dense hide-details label="Nombre Socio" class="mx-2"
            @keypress.enter="getSociosEditarDueno" prepend-inner-icon="mdi-magnify"></v-text-field>
          <v-btn icon @click="closeDueno"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider style="min-height: 3px;" class="primary"></v-divider>
        <v-card-text>
          <v-list dense>
            <v-subheader>Socios</v-subheader>
            <v-list-item-group v-model="cev_persona_editar_dueno" color="primary">
              <v-list-item v-for="(item, i) in lst_socios_editar_dueno" :key="i + '-historico'" :value="item.cve_persona">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.rentador }}</v-list-item-title>
                  <v-list-item-subtitle>Accion: {{ item.accion }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" :disabled="!cev_persona_editar_dueno" :loading="loading_edit_duenos"
            @click="asignarLockerEditarDueno"><v-icon class="mr-1">mdi-content-save</v-icon> Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog de numero anterior -->
    <v-dialog v-model="dialog_edit_nlocker" width="350">
      <v-card>
        <v-divider class="white" style="min-height: 13px;"></v-divider>
        <v-toolbar elevation="0">
          <v-toolbar-title># Anterior:</v-toolbar-title>
          <v-text-field v-model="last_num_locker" class="ml-2" hide-details filled outlined dense></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="secondary" @click="dialog_edit_nlocker = false"><v-icon
              class="mr-2">mdi-close</v-icon>Cancelar</v-btn>
          <v-btn color="secondary" @click="editarNumeroLockerAnterior"><v-icon
              class="mr-2">mdi-check</v-icon>Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog de observacion -->
    <v-dialog v-model="dialog_edit_observacion" width="350" persistent>
      <v-card>
        <v-toolbar color="secondary" elevation="0" dark>
          <v-toolbar-title>Observaciones</v-toolbar-title>
        </v-toolbar>
        <v-divider class="primary" style="min-height: 3px;"></v-divider>
        <v-card-text class="pt-5">
          <v-textarea v-model="observaciones_text" filled hide-details>

          </v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="secondary" @click="dialog_edit_observacion = false,observaciones_text=''"><v-icon
              class="mr-2">mdi-close</v-icon>Cancelar</v-btn>
          <v-btn color="secondary" @click="editarObservacion"><v-icon
              class="mr-2">mdi-check</v-icon>Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog de buscar locker para la permuta... -->
    <v-dialog v-model="dialog_permuta" width="500" scrollable persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Buscar Locker:</v-toolbar-title>
          <v-text-field v-model="numero_locker_permuta" solo-inverted dense hide-details placeholder="Numero Locker"
            class="mx-2" @keypress.enter="getBuscarLockersPermuta" prepend-inner-icon="mdi-magnify"></v-text-field>
          <v-btn icon @click="dialog_permuta = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider style="min-height: 3px;" class="primary"></v-divider>
        <v-card-text>
          <v-list dense>
            <v-subheader>Seleccione locker: </v-subheader>
            <v-list-item-group v-model="cve_locker_permuta" color="primary">
              <v-list-item v-for="(item, i) in lst_locker_permuta" :key="i + '-historico'" :value="item.cve_locker">
                <v-list-item-icon>
                  <v-icon>mdi-locker</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Locker # {{ item.numero_locker }}</v-list-item-title>
                  <v-list-item-subtitle>Dueño: {{ item.propietario }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" :disabled="!cve_locker_permuta" @click="asignarPermuta"><v-icon class="mr-1">mdi-content-save</v-icon>  Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, getCurrentInstance } from 'vue';
import {getBuscarLockersService,getHistoricoLockerService,getSociosByNameOrAccionService,getDuenosByNameService,setAsignarLockerService,getCuotaLockerService,EliminarRentaLockerService,CambioEstadoLockerService,setSaveContratoLockerService,getEdificioLockerService,setAsignarLockerEditarService,setAsignarLockerEditarDuenoService,EditarNumeroLockerAnteriorDuenoService,EditarObservacionLockerService,getBuscarPermutaLockerService,setAsignarPermutaLockerService,getDetalleContratoService} from '@/services/asignar_locker_service'
import {useFileDialog} from '@vueuse/core'

const {files:doc_contrato,open,reset} = useFileDialog()

import dayjs from "dayjs";
import isNull from "lodash/isNull";
import numeral from 'numeral'


    const root = getCurrentInstance().proxy
    const cve_locker = ref(0);
    const numero_locker = ref("");
    const numeroAccion = ref("");
    const nombre = ref("");
    const lst_lockers = ref([]);
    const lst_lockers_asignados = ref([]);
    const dialog = ref(false);
    const nombre_socio = ref("");
    const accion_socio = ref("");
    const lst_socios = ref([]);
    const cve_persona = ref(0);
    const accionMask = {
      mask: "FFFFF",
      tokens: {
        F: {
          pattern: /[0-9a-zA-Z]/,
          transform(v) {
            return v.toLocaleUpperCase();
          },
        },
      },
    };
    const cuota = ref({ descripcion: "", cantidad: 0 });
    const dias_renta = ref([]);
    const fecha_inicio = ref(null);
    const fecha_fin = ref(null);
    const costo_cuota = ref(0);
    const dialog_confirm = ref(false);
    const dialog_confirm_eliminar = ref(false)
    const dialog_contrato = ref(false)
    const dialog_edit = ref(false)
    const dialog_edit_dueno = ref(false)
    const dialog_edit_nlocker = ref(false)
    const dialog_edit_observacion = ref(false)

    const numero_contrato = ref('')
    const observaciones = ref('')
    const id_contrato = ref('')

    const lst_edificios = ref([])
    const edificio = ref(0)

    const nombre_editar = ref()
    const lst_socios_editar = ref([])
    const cev_persona_editar = ref(0)

    const nombre_editar_dueno = ref()
    const lst_socios_editar_dueno = ref([])
    const cev_persona_editar_dueno = ref(0)

    const loading_edit_socios = ref(false)
    const loading_edit_duenos = ref(false)

    const observaciones_text = ref()

    const last_num_locker = ref()

    const dialog_permuta = ref(false)

    const lst_locker_permuta = ref([])

    const numero_locker_permuta = ref()
    const cve_locker_permuta = ref()

    const motivo_cancelacion=ref("")//string

    let id_asignacion = 0

    const mostrarFechas = computed(() => {
      if (!isNull(fecha_inicio.value) && !isNull(fecha_fin.value)) {
        return `${fecha_inicio.value} a ${fecha_fin.value}`;
      } else {
        return "";
      }
    });

    const flagGuardar = computed(() => {
      return (
        cve_persona.value > 0 &&
        !isNull(fecha_inicio.value) &&
        !isNull(fecha_fin.value)
      );
    });

    const flagAgregar = computed(() => lst_lockers_asignados.value.some(i => i.activo == 1))

    watch(dias_renta, (val) => {
      if (val.length === 1) {
        fecha_inicio.value = val[0];
        fecha_fin.value = null;
      } else if (val.length === 2) {
        if (dayjs(val[0]).isBefore(dayjs(val[1]))) {
          fecha_inicio.value = val[0];
          fecha_fin.value = val[1];
        } else {
          fecha_inicio.value = val[1];
          fecha_fin.value = val[0];
        }
      }
    });

    watch(cve_locker, (val) => {
      if (val > 0) getHistorico();
      else lst_lockers_asignados.value = []
    });

    watch(cve_persona, (val) => {
      if (val > 0) {
        costo_cuota.value = cuota.value.cantidad;
      } else {
        costo_cuota.value = cuota.value.cantidad;
        fecha_inicio.value = null;
        fecha_fin.value = null;
        dias_renta.value = [];
      }
    });

    onMounted(() => {
      getCuota();
      getEdificios()
    });

    function AccionAndClasificacion(numeroAccion) {
      let indexTripartidas = -1;
      let numero_accion = 0;
      let clasificacion = 0;

      if (numeroAccion.indexOf("A") > -1) {
        indexTripartidas = numeroAccion.indexOf("A");
        clasificacion = 1;
      } else if (numeroAccion.indexOf("B") > -1) {
        indexTripartidas = numeroAccion.indexOf("B");
        clasificacion = 2;
      } else if (numeroAccion.indexOf("C") > -1) {
        indexTripartidas = numeroAccion.indexOf("C");
        clasificacion = 3;
      }

      numero_accion = numeroAccion;

      if (indexTripartidas > -1) {
        numero_accion = numeroAccion.substr(0, indexTripartidas);
      }

      return { numero_accion, clasificacion };
    }

    async function getBuscarLockers() {
      //limpiar todo por nueva busqueda...
      lst_lockers.value = []
      cve_locker.value = undefined
      lst_lockers_asignados.value = []

      try {
        let { numero_accion, clasificacion } = AccionAndClasificacion(
          numeroAccion.value
        );    
        const data=await getBuscarLockersService(numero_locker.value,numero_accion,clasificacion,nombre.value,edificio.value)
         lst_lockers.value = data;
      } catch (error) { }
    }

    async function getHistorico() {
      try {
        const data=await getHistoricoLockerService(cve_locker.value)
        lst_lockers_asignados.value = data;
      } catch (error) { }
    }

    async function getSocios() {
      let { numero_accion, clasificacion } = AccionAndClasificacion(
        accion_socio.value
      );

      try {
        const data=await getSociosByNameOrAccionService(nombre_socio.value, numero_accion, clasificacion)
   
          cve_persona.value = null;
          lst_socios.value = data;
        
      } catch (error) { }
    }

    async function getSociosEditar() {

      try {

        const data=await getSociosByNameOrAccionService(nombre_editar.value)
      
          cev_persona_editar.value = null;
          lst_socios_editar.value = data;
          console.log("socios encontrados:", data)
    
      } catch (error) { }
    }

    async function getSociosEditarDueno() {

      try {
       
        const data=await getDuenosByNameService(nombre_editar_dueno.value);
    
          cev_persona_editar_dueno.value = null;
          lst_socios_editar_dueno.value = data;
          console.log("socios encontrados:", data)
    
      } catch (error) { }
    }

    async function asignarLocker() {
      let cve_accion = lst_socios.value.find(i => i.cve_persona === cve_persona.value)?.cve_accion;
      let dataSend = {
        cve_persona: cve_persona.value,
        cve_accion,
        fecha_inicio: fecha_inicio.value,
        fecha_fin: fecha_fin.value,
        concepto: cuota.value.descripcion,
        total: costo_cuota.value,
        tipo: 1,
      };
      try {        
        await setAsignarLockerService(cve_locker.value,dataSend);
        getHistorico();
        dialog_confirm.value = false;
      } catch (error) { }
    }

    async function getCuota() {
      try {
         cuota.value = await getCuotaLockerService();
      } catch (error) { }
    }

    function cerrarDialog() {
      dialog.value = false;
      lst_socios.value = [];
      cve_persona.value = 0;
      fecha_inicio.value = null;
      fecha_fin.value = null;
      dias_renta.value = [];
      nombre_socio.value = "";
      accion_socio.value = "";
    }

    async function eliminarRentaLocker() {
      try {
        const cve_persona_cancela=root.$ls.get('user',{cve_persona:0}).cve_persona
        const data=await EliminarRentaLockerService(cve_locker.value,cve_persona.value,cve_persona_cancela,motivo_cancelacion.value)
                
          getHistorico()
          dialog_confirm_eliminar.value = false;
          cve_persona.value = 0
        
      } catch (error) {

      }
    }

    async function detalleContrato(id, idpersona, documento) {
      if (!isNull(documento) && documento.indexOf('.pdf') > 0) {       
        const url_path=await getDetalleContratoService(documento)
        window.open(url_path)
      }
      else {
        id_contrato.value = id
        cve_persona.value = idpersona
        dialog_contrato.value = true
      }
    }

    async function cambioEstadoLocker(id, estado) {
      try {
        await CambioEstadoLockerService(id,estado)
      } catch (error) {

      }
    }

    async function saveContrato() {

        await setSaveContratoLockerService(cve_locker.value,id_contrato.value,doc_contrato.value[0],cve_persona.value,numero_contrato.value,observaciones.value)

        dialog_contrato.value = false
        getHistorico();//vuelve  cargar todo    

    }

    async function getEdificios() {
      try {
         lst_edificios.value = await getEdificioLockerService();
      } catch (error) { }
    }

    async function asignarLockerEditar() {
      loading_edit_socios.value = true      
      try {
        await setAsignarLockerEditarService(cve_locker.value,cev_persona_editar.value)
        await getBuscarLockers()
        closeSocio()
      } catch (error) { }
      finally { loading_edit_socios.value = false }
    }

    async function asignarLockerEditarDueno() {

      loading_edit_duenos.value = true
      let dataSend = { cve_persona: cev_persona_editar_dueno.value };
      try {      
        await setAsignarLockerEditarDuenoService(cve_locker.value,cev_persona_editar_dueno.value)
        await getBuscarLockers()
        closeDueno()
        // if (status === 200) getHistorico();
        // dialog_confirm.value = false;
      } catch (error) { }
      finally { loading_edit_duenos.value = false }
    }

    async function editarNumeroLockerAnterior() {

      loading_edit_duenos.value = true      
      try {       
        await EditarNumeroLockerAnteriorDuenoService(cve_locker.value,last_num_locker.value)
        await getBuscarLockers()
        closeDueno()
      } catch (error) { }
      finally { loading_edit_duenos.value = false }
    }

    function openEditarObservacion(item) {

      id_asignacion = item.cve_asignacion_locker
      observaciones_text.value = item.observaciones
      dialog_edit_observacion.value = true
    }

    async function editarObservacion() {

      loading_edit_duenos.value = true     
      try {
        await EditarObservacionLockerService(id_asignacion,observaciones_text.value)
        let data_index = lst_lockers_asignados.value.findIndex(i => i.cve_asignacion_locker == id_asignacion)
        lst_lockers_asignados.value[data_index].observaciones = observaciones_text.value;
        dialog_edit_observacion.value = false

      } catch (error) { }
      finally { loading_edit_duenos.value = false }
    }

    async function getBuscarLockersPermuta() {
      //limpiar todo por nueva busqueda...
      lst_locker_permuta.value = []
      cve_locker_permuta.value = undefined
      try {       
        lst_locker_permuta.value = await getBuscarPermutaLockerService(numero_locker_permuta.value);
      } catch (error) { }
    }

    async function asignarPermuta() {
      //limpiar todo por nueva busqueda... 
      try {        
        await setAsignarPermutaLockerService(cve_locker.value,cve_locker_permuta.value)
        await getBuscarLockers();
        dialog_permuta.value = false
      } catch (error) { }
    }

    function closeSocio() {
      lst_socios_editar.value = []
      cev_persona_editar.value = 0
      nombre_editar.value = ''
      dialog_edit.value = false
    }

    function closeDueno() {
      lst_socios_editar_dueno.value = []
      cev_persona_editar_dueno.value = 0
      nombre_editar_dueno.value = ''
      dialog_edit_dueno.value = false
    }

    function fnCloseAdjuntar()
    {
      dialog_contrato.value=false
      numero_contrato.value=''
      observaciones.value=''
      reset()
    }

</script>

<style scoped>
.border-inactive {
  border-left-style: solid;
  border-left-width: 10px;
  border-left-color: var(--v-accent-darken2) !important;
}

.border-active {
  /* border-left-style: solid; */
  /* border-left-width: 10px; */
  border-left-color: var(--v-primary-base) !important;
}

.no-radius {
  border-radius: 0px !important;
}

.pv-gap-toolbar{
  column-gap:15px
}
</style>
<template>
  <div>

    <!-- <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text"></h1>
    </div> -->

    <v-card>
      <v-card-title>
        <h2 class="accent--text">Cambio de forma de pago</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="Folio" v-model="folio" v-mask="'######'" dense hide-details></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Accion" dense hide-details v-model="accion" v-mask="accionMask"></v-text-field>
          </v-col>
          <v-col>
            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
              offset-y min-width="290px">
              <template v-slot:activator="{ on }">
                <v-text-field v-model="date" label="Dia" prepend-icon="mdi-calendar" readonly v-on="on" dense
                  hide-details></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="menu = false" color="primary"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <div class="d-flex">
              <v-btn color="primary" class="mr-2" @click="buscarPago">
                <v-icon>mdi-magnify</v-icon>Buscar
              </v-btn>
              <v-btn color="primary" @click="cancelar">
                <v-icon>mdi-close</v-icon>Cancelar
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-2">
      <v-card-title class="d-flex justify-space-between accent--text">
        <h3>Desccripcion del pago</h3>
        <div class="ml-10" style="width:300px!important">
          <v-select label="Selecciona pago" v-if="masDeunCargo.length > 1" :items="masDeunCargo" return-object
            v-model="cargoSelected" @change="mostrarPago">
            <template v-slot:selection="{ item, index }">Pago con folio:{{ item.folio }}</template>
            <template v-slot:item="{ item, index }">
              <v-chip class="mr-2">
                <span>{{ item.folio }}</span>
              </v-chip>
              <span class="accent--text caption display-2">{{/*item.accion*/ }} ( {{ item.fecha_hora_cobro }})</span>
            </template>
          </v-select>
        </div>
        <span></span>
        <!-- <v-btn color="primary" @click="dialog=true" :disabled="idpago==0">Cancelar Pago</v-btn> -->
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="elevation-3">
            <v-row>
              <v-col>
                <div style="font-size:19px;font-weight:bold">Accion</div>
                <div style="font-size:17px">{{ accionText }}</div>
              </v-col>
              <v-col>
                <div style="font-size:19px;font-weight:bold">Folio</div>
                <div>{{ folioText }}</div>
              </v-col>
              <v-col>
                <div style="font-size:19px;font-weight:bold">
                  <v-badge bordered color="transparent" offset-x="0" offset-y="10">
                        <template v-slot:badge>                          
                          <v-icon color="info" size="large">mdi-circle-edit-outline</v-icon>
                        </template>            
                        Fecha Pago           
                  </v-badge>
                  
                </div>
                <div>
                  <v-menu v-model="menu_fecha_edit" :close-on-content-click="false" :close-on-click="false">
                    <template v-slot:activator="{on,attrs}">
                  <!-- <v-badge bordered color="transparent" offset-y="10" offset-x="20">
                        <template v-slot:badge>                          
                          <v-icon color="info" size="large">mdi-circle-edit-outline</v-icon>
                        </template>             -->    
                        
                        <span v-on="on" >
                          <span v-if="dayjs(fechaText,'YYYY-MM-DD HH:mm:ss',true).isValid()" >({{ dayjs(fechaText).format("DD-MM-YYYY HH:mm") }} )</span>
                        </span>            
                  <!-- </v-badge> -->
                </template>
                <v-card>
                  <v-tabs v-model="tab" fixed-tabs>
                    <v-tab>Dia</v-tab>
                    <v-tab>Hora</v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item><v-date-picker v-model="fecha_edit"></v-date-picker></v-tab-item>
                    <v-tab-item><v-time-picker v-model="hora_edit" format="24hr"></v-time-picker> </v-tab-item>
                  </v-tabs-items>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" outlined @click="closeFechaEdit">cancelar</v-btn>
                    <v-btn color="secondary" v-if="Boolean(fecha_edit) && Boolean(hora_edit)" @click="fnUpdateFechaPago">Guardar</v-btn>
                  </v-card-actions>
                </v-card>
                
                </v-menu>
                  </div>
              </v-col>
              <v-col>
                <div style="font-size:19px;font-weight:bold">
                  
                  <v-badge bordered color="transparent" offset-x="0" offset-y="10">
                        <template v-slot:badge>                          
                          <v-icon color="info" size="large">mdi-circle-edit-outline</v-icon>
                        </template>            
                        Cajero          
                  </v-badge>
                </div>
                <v-menu v-model="menu_cajero_edit" :close-on-content-click="false" :close-on-click="false">
                    <template v-slot:activator="{on,attrs}">
                <div v-on="on">{{ cajeroText }}</div>
                </template>
                <v-card width="350">
                  <v-toolbar color="secondary" elevation="0" dark>
                    <v-toolbar-title>
                      Seleccione Colaborador
                    </v-toolbar-title>
                  </v-toolbar>
                  <v-divider class="primary" style="min-height: 3px;"></v-divider>
                  <v-card-text>
                    <v-list>
                      <v-list-item-group v-model="cajero_edit">
                      <template v-for="(cajero,index) in lst_cajeros" >
                      <v-list-item :value="cajero.cve_persona">
                        <v-list-item-content>
                          <v-list-item-title>{{ cajero.nombre }}</v-list-item-title>
                          <v-list-item-subtitle><span class="font-weight-bold">{{ cajero.apellido_paterno }}</span><span class="font-italic"> {{ cajero.apellido_materno }}</span></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider inset v-if="index<lst_cajeros.length-1"></v-divider>
                    </template>
                  </v-list-item-group>
                    </v-list>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeCajeroEdit" color="secondary" outlined>cancelar</v-btn>
                    <v-btn @click="fnUpdateCajero" color="secondary" v-if="cajero_edit">Guardar</v-btn>
                  </v-card-actions>
                </v-card>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>

          <v-col lg="12" v-if="idpago > 0">
            <v-row>
              <v-col lg=3>
                <v-card @click="addFormaPago">
                  <v-card-title class="pb-4"></v-card-title>
                  <v-card-text class="text-center py-7">
                    <h1>Agregar Forma de Pago</h1>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col lg="3" v-for="(forma_pago, index) in lst_formas_pago" :key="index">
                <v-card>
                  <v-card-title class="d-flex justify-space-between">
                    <div>
                      <v-btn icon color="info" @click="openSelectedFormas(forma_pago)">
                        <v-icon>mdi-circle-edit-outline</v-icon>
                      </v-btn>
                      {{ forma_pago.forma_pago }}
                    </div>

                    <v-menu>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="error" v-on="on" v-bind="attrs">
                          <v-icon>mdi-delete-outline</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>Desea eliminar la forma de pago.</v-card-title>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="error" outlined>
                            <v-icon>mdi-close</v-icon>Cancelar
                          </v-btn>
                          <v-btn color="info" outlined @click="eliminarFormaPago(forma_pago.idforma_pago)">
                            <v-icon>mdi-check</v-icon>Aceptar
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-menu>
                  </v-card-title>
                  <v-divider inset></v-divider>
                  <v-card-text class="text-center">
                    <v-fade-transition hide-on-leave>
                      <v-badge bordered color="transparent" v-if="!forma_pago.edit" @click="forma_pago.edit = true">
                        <template v-slot:badge>
                          <v-icon color="info" size="large">mdi-circle-edit-outline</v-icon>
                        </template>
                        <h1 @click="forma_pago.edit = true">{{ numeral(forma_pago.monto).format('$0,0.00') }}</h1>
                      </v-badge>
                      <v-text-field v-model="forma_pago.monto" v-else placeholder="Monto $"
                        @keypress.enter="cambiarMonto(forma_pago)"></v-text-field>
                    </v-fade-transition>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col>
            <v-simple-table class="elevation-7">
              <template v-slot:default>
                <thead>
                  <tr class="accent">
                    <th class="white--text title">Clave</th>
                    <th class="white--text title">Concepto</th>
                    <th class="white--text title">Periodo</th>
                    <th class="white--text title">Monto</th>
                  </tr>
                </thead>
                <tbody>

                  <tr v-for="(cargo, index) in cargos" :key="index" style="border:2px solid #d1d1d1">
                    <td class="title">
                      <v-menu v-model="cargo.menu" :close-on-content-click="false">
                        <template v-slot:activator>
                          <v-btn text @click="openCuota(cargo)"> {{ cargo.clave }}</v-btn>
                        </template>
                        <v-card>
                          <v-toolbar color="primary" dense class="pt-3">
                            <v-text-field v-model="numero_cuota" @keypress.enter="getCuotas" solo-inverted dark dense
                              single-line></v-text-field>
                          </v-toolbar>
                          <v-list>
                            <v-list-item v-for="cuota in lst_numero_cuotas" :key="cuota.cve_cuota"
                              @click="updateCuota(cuota, cargo)">
                              <v-list-item-avatar>{{ cuota.producto_servicio }}</v-list-item-avatar>
                              <v-list-item-title>{{ cuota.descripcion }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-card>
                      </v-menu>

                    </td>
                    <td class="title">{{ cargo.concepto }}</td>
                    <td class="title">{{ cargo.periodo }}</td>
                    <td class="title">

                      <v-fade-transition hide-on-leave>
                        <v-badge bordered color="transparent" v-if="!cargo.edit" @click="cargo.edit = true">
                          <template v-slot:badge>
                            <v-icon color="info" size="large">mdi-circle-edit-outline</v-icon>
                          </template>
                          <span @click="editCargo(cargo)">{{ numeral(cargo.total).format('$0,0.00') }}</span>
                        </v-badge>
                        <v-text-field v-model="cargo.total" v-else placeholder="Monto $"
                          @keypress.enter="cambiarMontoCargo(cargo)"></v-text-field>
                      </v-fade-transition>

                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style="border-top:1px solid #d3d3d3">
                    <td colspan="2"></td>
                    <td class="title accent--text">Descuento</td>
                    <td class="title">{{ numeral(cDescuento).format('$0,0.00') }}</td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="title accent--text">Total</td>
                    <td class="title">{{ numeral(cTotal).format('$0,0.00') }}</td>
                  </tr>
                </tfoot>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" width="500" persistent>
      <v-card>
        <v-card-title class="alert-border">Elije forma de pago</v-card-title>
        <v-card-text class="alert-border">
          <!-- <h3 class="accent--text">
            Desea Realmente Cancelar el pago con folio
            <span class="black--text font-weight-bold">{{ folioText }}</span>
          </h3>
          <v-textarea v-model="motivo" label="Motivo de Cancelacion..."></v-textarea>-->

          <v-list>
            <v-list-item-group v-model="forma_pago_selected_update">
              <template v-for="forma_sat in lst_formas_pago_sat">
                <v-list-item :key="`${forma_sat.clave}-item`" :value="forma_sat.clave">
                  <v-list-item-avatar>
                    <v-icon v-text="forma_sat.icono"></v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ forma_sat.forma_pago }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider inset :key="`${forma_sat.clave}-div`"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions class="alert-border">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog = false, motivo = ''">Cancelar</v-btn>
          <v-btn color="info" @click="cambiarFormaPago" :disabled="!forma_pago_selected_update">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="alert" color="primary">
      Pago Eliminado Correctamente
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="alert = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>

import { computed, ref, set, getCurrentInstance, onMounted } from 'vue';
import numeral from 'numeral'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {getPagoService,getFormasPagoByPagoService,getCatalogoFormaPagoService,setAddNewFormaPagoService,deleteFormaPagoService,updateFormaPagoService,updateMontoFormaPagoService,updateMontoCargoService,getListaCajerosService,updateCajeroPagoService,updateFechaPagoService,getCuotasService,updateCuotaCargoService} from '@/services/cambio_forma_pago_service'

dayjs.extend(customParseFormat)

const root = getCurrentInstance().proxy
const idpago = ref(0)
const folio = ref('')
const accion = ref('')
const date = ref(null)
const menu = ref(false)
const accionMask = ref({
  mask: "FFFFF",
  tokens: {
    F: {
      pattern: /[0-9a-zA-Z]/,
      transform(v) {
        return v.toLocaleUpperCase();
      }
    }
  }
})
const folioText = ref('')
const accionText = ref('')
const fechaText = ref('')
const cajeroText = ref('')
const cargos = ref([])
const cargoSelected = ref({})
const masDeunCargo = ref([])
const dialog = ref(false)
const alert = ref(false)
const motivo = ref('')

const lst_formas_pago = ref([])
const lst_formas_pago_sat = ref([])

const forma_pago_selected_update = ref()
const id_forma_pago_selected = ref()

const numero_cuota = ref()
const lst_numero_cuotas = ref([])

const cTotal = computed(() => cargos.value.map(item => parseFloat(item.total) - parseFloat(item.descuento)).reduce((reductor, value) => reductor + value, 0))
const cDescuento = computed(() => cargos.value.map(item => parseFloat(item.descuento)).reduce((reductor, value) => reductor + value, 0))

const tab=ref(0)
const menu_fecha_edit=ref(false)
const fecha_edit=ref()
const hora_edit=ref()

const lst_cajeros=ref()
const menu_cajero_edit=ref(false)
const cajero_edit=ref()

onMounted(()=>{
  fnGetCajeros()
})

async function buscarPago() {
  let numero_accion = 0;
  let clasificacion = 0;

  let tripartida = /[ABC]/.exec(accion.value);

  if (Array.isArray(tripartida)) {
    numero_accion = accion.value.substr(0, tripartida.index);
    clasificacion = tripartida.map(item => {
      switch (item) {
        case "A":
          return 1;
          break;
        case "B":
          return 2;
          break;
        case "C":
          return 3;
          break;
        default:
          0;
          break;
      }
    })[0];
  } else numero_accion = isNaN(accion.value) ? 0 : accion.value;

  // let { data, status } = await $axios.get("/cambiar-forma-pago", {
  //   params: {
  //     numero_accion: numero_accion,
  //     clasificacion: clasificacion,
  //     folio: folio.value,
  //     dia: date.value,
  //   }
  // }
  // )

  const data=await getPagoService(numero_accion,clasificacion,folio.value,date.value)


  if (data.length == 0) {
    idpago.value = 0;
    folioText.value = '';
    accionText.value = '';
    fechaText.value = '';
    cajeroText.value = '';
    cargos.value = [];
    masDeunCargo.value = [];
  }
  else if (data.length == 1) {

    idpago.value = parseInt(data[0].idpago);
    folioText.value = data[0].folio;
    accionText.value = data[0].accion;
    fechaText.value = data[0].fecha_hora_cobro;
    cajeroText.value = data[0].cajero;
    let cargosx = data[0].cargos.split("--");
    cargos.value = cargosx.map(item => item.split(",")).map(i => ({ cve_cargo: i[0], cve_cuota: i[1], clave: i[2], concepto: i[3], periodo: i[4], total: i[5], descuento: i[6], edit: false, menu: false }))
    getFormasPagoRecibo(data[0].idpago)

  } else {
    masDeunCargo.value = data;
  }
}

function cancelar() {
  idpago.value = 0;
  folio.value = ''
  accion.value = ''
  date.value = null
  folioText.value = '';
  accionText.value = '';
  fechaText.value = '';
  cajeroText.value = '';
  cargos.value = [];
  masDeunCargo.value = [];
  cargoSelected.value = {}
  motivo.value = ''
  lst_formas_pago.value = []
}

function mostrarPago() {
  idpago.value = cargoSelected.value.idpago;
  folioText.value = cargoSelected.value.folio;
  accionText.value = cargoSelected.value.accion;
  fechaText.value = cargoSelected.value.fecha_hora_cobro;
  cajeroText.value = cargoSelected.value.cjero;

  let cargosx = cargoSelected.value.cargos.split("--");
  cargos.value = cargosx.map(item => item.split(",")).map(i => ({ cve_cargo: i[0], cve_cuota: i[1], clave: i[2], concepto: i[3], periodo: i[4], total: i[5], descuento: i[6], edit: false, menu: false }))
  getFormasPagoRecibo(cargoSelected.value.idpago)
}

// async function cancelarPago() {
//   let { data } = await $axios.post("/cambiar-forma-pago", { idpago: idpago.value, accion_text: accionText.value, cve_persona: root.$ls.get('user', { cve_persona: 0 }).cve_persona, motivo: motivo.value });
//   if (data == 1) {
//     dialog.value = false
//     alert.value = true
//     cancelar();
//   }
// }

async function getFormasPagoRecibo(id) {
  try {
    // let { data } = await $axios.get(`/cambiar-forma-pago/pagos/${id}`);
    const data=await getFormasPagoByPagoService(id)
    lst_formas_pago.value = data
    lst_formas_pago.value.forEach(i => set(i, "edit", false))
  } catch (error) {

  }
}

async function eliminarFormaPago(id_forma_pago) {
  console.log(id_forma_pago)

  try {
    // let { data } = await $axios.delete(`/cambiar-forma-pago/forma-pago/${id_forma_pago}`);
    const data=await deleteFormaPagoService(id_forma_pago)
    console.log(data)
    if (data > 0) {
      console.log("entra")

      let index_delete = lst_formas_pago.value.findIndex(i => i.idforma_pago == id_forma_pago)
      console.log(lst_formas_pago.value)
      console.log(index_delete)
      lst_formas_pago.value.splice(index_delete, 1);
    }

  } catch (error) {

  }
}

async function openSelectedFormas(item) {
  console.log(item)
  id_forma_pago_selected.value = item.idforma_pago
  try {
    // let { data } = await $axios.get(`/cambiar-forma-pago/forma-pago`);
    const data=await getCatalogoFormaPagoService()
    console.log(data)
    lst_formas_pago_sat.value = data
  } catch (error) {

  }
  dialog.value = true
}

async function cambiarFormaPago() {
  console.log(id_forma_pago_selected.value, forma_pago_selected_update.value, lst_formas_pago_sat.value)
  try {
    // let { data } = await $axios.put(`/cambiar-forma-pago/forma-pago/${id_forma_pago_selected.value}`, { clave: forma_pago_selected_update.value });
    const persona=root.$ls.get('user', { cve_persona: 0 }).cve_persona
    const data=await updateFormaPagoService(id_forma_pago_selected.value,forma_pago_selected_update.value,persona)

    let index_update = lst_formas_pago.value.findIndex(i => i.idforma_pago == id_forma_pago_selected.value)

    let forma_pago_nombre = lst_formas_pago_sat.value.find(i => i.clave == forma_pago_selected_update.value).forma_pago

    lst_formas_pago.value[index_update].forma_pago = forma_pago_nombre;

    dialog.value = false

  } catch (error) {

  }
}

async function cambiarMonto(item) {
  console.log(id_forma_pago_selected.value, item)
  try {
    // let { data } = await $axios.put(`/cambiar-forma-pago/monto/${item.idforma_pago}`, { monto: item.monto });
    const persona=root.$ls.get('user', { cve_persona: 0 }).cve_persona
    await updateMontoFormaPagoService(item.idforma_pago,item.monto,persona)
  } catch (error) {

  }
  finally {
    item.edit = false
  }
}

async function addFormaPago() {
  console.log(idpago.value)
  try {
    // let { data } = await $axios.post(`/cambiar-forma-pago/forma-pago/${idpago.value}`);
    const data=await setAddNewFormaPagoService(idpago.value)
    console.log(data)
    lst_formas_pago.value.push({ idforma_pago: data, idpago: idpago.value, monto: 0, clave: 0, forma_pago: '', banco: '', numero_cheque: '', edit: false })

  } catch (error) {

  }
}

function editCargo(item) {

  console.log(item.edit = true)
}

async function cambiarMontoCargo(item) {
  console.log(item)
  try {
    // let { data } = await $axios.put(`/cambiar-forma-pago/cargo-monto/${item.cve_cargo}`, { monto: item.total });
    const persona=root.$ls.get('user', { cve_persona: 0 }).cve_persona
    await updateMontoCargoService(item.cve_cargo,item.total,persona)

  } catch (error) {

  }
  finally {
    item.edit = false
  }
}

function openCuota(item) {
  numero_cuota.value = ''
  lst_numero_cuotas.value = []
  item.menu = true
}

async function getCuotas() {
  try {
    // let { data } = await $axios.get(`/cambiar-forma-pago/cuotas`, { params: { numero_cuota: numero_cuota.value } });
    const data=await getCuotasService(numero_cuota.value)
    lst_numero_cuotas.value = data
  } catch (error) {

  }
}


async function updateCuota(item, item2) {
  console.log(item)
  console.log(item2)
  try {
    // let { data } = await $axios.put(`/cambiar-forma-pago/cuotas/${item2.cve_cargo}`, { cve_cuota: item.cve_cuota });
    await updateCuotaCargoService(item2.cve_cargo,item.cve_cuota)
    item2.clave = item.producto_servicio
    item2.menu = false
  } catch (error) {

  }
}

function closeFechaEdit()
{
  menu_fecha_edit.value=false
  fecha_edit.value=undefined
  hora_edit.value=undefined
  tab.value=0
}

async function fnUpdateFechaPago()
{
  const nueva_fecha=dayjs(`${fecha_edit.value} ${hora_edit.value}`).format('YYYY-MM-DD HH:mm:ss')
  console.log('nueva fecha:',nueva_fecha)
  const persona=root.$ls.get('user', { cve_persona: 0 }).cve_persona
  await updateFechaPagoService(idpago.value,nueva_fecha,persona)

  fechaText.value=nueva_fecha
  menu_fecha_edit.value=false;
  fecha_edit.value=undefined
  hora_edit.value=undefined
}

function closeCajeroEdit()
{
  menu_cajero_edit.value=false
  cajero_edit.value=undefined  
}

async function fnUpdateCajero()
{  
  const persona=root.$ls.get('user', { cve_persona: 0 }).cve_persona
  await updateCajeroPagoService(idpago.value,cajero_edit.value,persona)
  const cajero_=lst_cajeros.value.find(i=>i.cve_persona==cajero_edit.value)
  cajeroText.value=`${cajero_?.nombre} ${cajero_?.apellido_paterno} ${cajero_?.apellido_materno}`
  menu_cajero_edit.value=false
}

async function fnGetCajeros()
{
  lst_cajeros.value=await getListaCajerosService()
}

</script>

<style>
.alert-border {
  border-left-width: 5px;
  border-left-style: solid;
  border-left-color: var(--v-primary-base);
}
</style>
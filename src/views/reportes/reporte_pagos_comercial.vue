<template>
  <div>
    <v-data-iterator :items="lst_pagos"  :items-per-page.sync="itemsPerPage" :page.sync="page" hide-default-footer :loading="loading_pagos" style="border:3px solid #546e7a">
      
      <template v-slot:header>
          <v-toolbar
            dark
            color="infox blue-grey darken-1"
            class="mb-0"
          >
            <v-text-field
            v-model="n_accion"
              class="mr-1"
              clearable
              flat
              solo-inverted
              hide-details
              label="Accion"
              v-mask="accionMask"
              @keyup.enter="getPagos"
            ></v-text-field>
  
            <v-spacer></v-spacer>
            
            <v-text-field
            v-model="find_uuid"
              class="mx-1"
              clearable
              flat
              solo-inverted
              hide-details
              label="UUID"
            ></v-text-field>
            
            <v-spacer></v-spacer>
  
            <v-select
              class="mx-1"
              v-model="fecha_inicio"
              clearable
              flat
              solo-inverted
              hide-details
              label="Tipo"
            ></v-select>
            
            <v-spacer></v-spacer>
  
              <v-menu
          v-model="menu_date"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="fdate(fecha_inicio)"
              label="fecha inicio"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              solo-inverted
              hide-details
              class="mx-1"            
            ></v-text-field>
          </template>
          <v-date-picker
          color="blue-grey darken-1x"
            v-model="fecha_inicio"
            @input="menu_date = false"
            :max="fecha_fin"
          ></v-date-picker>
        </v-menu>
  
  
        <v-menu
          v-model="menu_date2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="fdate(fecha_fin)"
              label="fecha fin"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              solo-inverted
              hide-details
              class="mx-1"
            ></v-text-field>
          </template>
          <v-date-picker
          color="blue-grey"
            v-model="fecha_fin"
            @input="menu_date2 = false"
            :min="fecha_inicio"
          ></v-date-picker>
        </v-menu>
  
  
              <v-spacer></v-spacer>
             
            
            <v-btn large color="blue-grey lighten-4 black--text" rounded class="ml-1" @click="getPagos"><v-icon>mdi-magnify</v-icon>
              Buscar</v-btn>
          </v-toolbar>
        </template>
  
      <template v-slot:default="{ items, isExpanded, expand }">
        
        <v-expansion-panels focusable popout @change="getCargosAndFactura" class="pt-3 pb-3" tile>
          <v-expansion-panel v-for="(item, i) in items" :key="i" >
            <v-expansion-panel-header @click="panel=item.idpago">
              <!-- icono de factura a cliente  -->
              <v-tooltip bottom v-if="item.segmentada==0">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-0 pl-0" v-bind="attrs" v-on="on">  
                    mdi-alert
                  </v-icon>
                </template>
                <span>Pago sin facturar</span>
              </v-tooltip>
  
              <!-- icono de factura a cliente  -->
              <v-tooltip bottom v-if="item.segmentada==1 && item.global==0">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-0 pl-0" v-bind="attrs" v-on="on">  
                    mdi-badge-account
                  </v-icon>
                </template>
                <span>Factura Normal</span>
              </v-tooltip>
  
              <!-- icono de factura publico en general -->
              <v-tooltip bottom v-if="item.segmentada==1 && item.global==1">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-0 pl-0" v-bind="attrs" v-on="on">  
                    mdi-earth
                  </v-icon>
                </template>
                <span>Publico en General</span>
              </v-tooltip>
  
              <!-- icono de segmentada o dividida  -->
              <v-tooltip bottom v-if="item.segmentada==2">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-0 pl-0" v-bind="attrs" v-on="on">  
                    mdi-account-group
                  </v-icon>
                </template>
                <span>Segmentada o Dividida</span>
              </v-tooltip>
  
  
              <div class="" style="width: 90%">
                <div class="infox d-flex justify-space-between pr-10 primar my-3">
                  <label class="font-weight-black h1"
                    >Accion: <span class="accent--text">{{item.accion}}</span></label
                  >
                  <label class="font-weight-black h1"
                    >Folio: <span class="accent--text">{{item.folio}}</span></label
                  >
                  <label class="font-weight-black h1"
                    >Total: <v-chip outlined color="amber" label style="height: 25px;"><span class="accent--text">{{fcurrency(item.total)}}</span></v-chip></label
                  >
                  <label class="font-weight-black h1"
                    >Subtotal: <span class="accent--text">{{fcurrency(item.subtotal)}}</span></label
                  >
                  <label class="font-weight-black h1"
                    >Descuento: <span class="accent--text">{{ fcurrency(item.descuento)}}</span></label
                  >
                </div>
                <div
                  class="warningx d-flex justify-space-between pr-10 primaryx my-3"
                >
                  
                  <label class="font-weight-black h1"
                    >Fecha Pago:
                    <span class="accent--text">{{dayjs(item.fecha_hora_cobro).format('DD [de] MMM [del] YYYY hh:mm')}}</span></label
                  >
                  <label class="font-weight-black h1"
                    >Cajero(a):
                    <span class="accent--text">{{item.nombre}}</span></label
                  >
  
                  <div v-if="item.total>0">
                    <v-chip color="mr-1" :class="{success:item.factura_id>0}" small>
                      <v-icon left small v-if="item.factura_id>0">mdi-check-circle</v-icon>
                      <v-icon left small v-else>mdi-close-circle</v-icon>
                      PV
                    </v-chip>
                    <v-chip color="mr-1" :class="{error:(item.folio_compaq>0 && item.estado_compaq==4 && item.codigo_error_compaq==0)}" small>
                      <v-icon left small v-if="item.folio_compaq>0 && item.estado_compaq==4 && item.codigo_error_compaq==0">mdi-check-circle</v-icon>
                      <v-icon left small v-else>mdi-close-circle</v-icon>
                      COMERCIAL
                    </v-chip>
                    <v-chip color="gray" small
                      ><v-icon left small>mdi-close-circle</v-icon>XML</v-chip
                    >
                  </div>
                  <v-chip v-else color="warning black--text" small>
                    <v-icon left small>mdi-alert</v-icon>Pago en cero no facturable
                  </v-chip>
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
  
              <v-overlay v-model="item.loading">
                <v-dialog
        value="true"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color=""
          dark
        >
          <v-card-text>
            <h2 class="my-2 pt-2 text-center">{{text_loading}}</h2>
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
              </v-overlay>
  
              <v-card color="blue-grey lighten-5 mt-2" v-if="item.total>0">
               {{/**item*/}}
                <v-card-title class="py-1">factura  <v-spacer></v-spacer> 
               
               <v-btn depressed tile dark small class="mx-1" color="error" v-if="item.factura_id>0" @click="openCancelar(item.factura_id)"><v-icon class="mr-1">mdi-delete</v-icon>Eliminar</v-btn>
               <!--se muestra si no existe id factura en pv ni folio de campaq y el estado es 0 no facturado-->
                <facturaSegmentada  
               v-if="item.factura_id==0 && item.folio_compaq==0 && item.estado_compaq==0"
               :accion="item.cve_accion" 
               :numero_accion="item.accion" 
               :idpago="item.idpago" 
               :fpago="item.forma_pago" 
               :fpago_text="item.forma_pago_text"
               :monto="item.total" 
               :cargos_facturar="lst_cargos" 
               :foliopago="item.folio" 
               :fechaPago="item.fecha_hora_cobro"
               @emit-facturado="facturaOk($event,item)"              
               />
  
                <!--se muestra si no existe id factura en pv ni folio de campaq y el estado es 0 no facturado-->
                <facturaDividida  
               v-if="item.factura_id==0 && item.folio_compaq==0 && item.estado_compaq==0"
               :accion="item.cve_accion" 
               :numero_accion="item.accion" 
               :idpago="item.idpago" 
               :fpago="item.forma_pago" 
               :fpago_text="item.forma_pago_text"
               :monto="item.total" 
               :cargos_facturar="lst_cargos" 
               :foliopago="item.folio" 
               :fechaPago="item.fecha_hora_cobro"
               @emit-facturado="facturaOk($event,item)"              
               />
               
               
                  <!--se muestra cuando no existe id factura en pv, registrara factuar en local y en compac-->
               <formAltaRfc  
               v-if="item.factura_id==0" 
               :accion="item.cve_accion" 
               :numero_accion="item.accion" 
               :idpago="item.idpago" 
               :fpago="item.forma_pago" 
               :fpago_text="item.forma_pago_text"
               :monto="item.total" 
               :cargos_facturar="lst_cargos" 
               :foliopago="item.folio" 
               :fechaPago="item.fecha_hora_cobro"
               @emit-facturado="facturaOk($event,item)"
               />
  
               <!--se muestra si no existe id factura en pv ni folio de campaq y el estado es 0 no facturado-->
                <v-btn
                 v-if="item.factura_id==0 && item.folio_compaq==0 && item.estado_compaq==0"
                  depressed
                  tile
                  :value="true"
                  dark
                  small
                  class="mx-1"
                  :loading="item.loading"
                  @click="saveFacturaPublicoGeneral(item.idpago,item.folio,item.forma_pago,item.total,item.fecha_hora_cobro,item)"
                >
                  <v-icon color="white">mdi-earth</v-icon> FACTURA PUBLICO GENERAL PV
                </v-btn>
  
                <!--se muestra cuando ya existe factura en pv pero es de tipo global y no exista folio en comapc y el estado sea 0 no facturado y no se a segmentada(1 es no segmentada)-->
                <v-btn
                 v-if="item.factura_id>0 && item.global==1 && item.folio_compaq==0 && item.estado_compaq==0 && item.segmentada==1"
                  depressed
                  tile
                  :value="true"
                  dark
                  small
                  @click="saveFacturaPublicoGeneralCompac(item)"
                >
                  <v-icon color="white">mdi-earth</v-icon> FACTURA PUBLICO GENERAL COMPAC
                </v-btn>
                
                <!--se muestra cuando existe factura en pv pero no es global y no existe folio en compac y el estado es 0 no facturado y no se a segmentada(1 es no segmentada)-->
                <v-btn
                 v-if="item.factura_id>0 && item.global==0 && item.folio_compaq==0 && item.estado_compaq==0 && item.segmentada==1"
                  depressed
                  tile
                  :value="true"
                  dark
                  small
                  @click="saveFacturaCompac(item)"
                >
                  <v-icon color="white">mdi-archive-arrow-up</v-icon> FACTURAR EN COMERCIAL
                </v-btn>
                <!-- se muestra cuando esta facturado en pv y exiete folio de compac y el estado sea 1(con documento pero sin movimientos) y no se a segmentada(1 es no segmentada)-->
                <v-btn
                  v-if="item.folio_compaq>0 && item.folio_compaq>0 && item.estado_compaq==1 && item.segmentada==1"
                  depressed
                  tile
                  :value="true"
                  dark
                  small
                  class="py-2"
                >
                  <v-icon color="white">mdi-clipboard-arrow-up</v-icon> CORREGUIR MOVIMIENTOS
                </v-btn>
  
                <!-- se muestra cuando esta facturado en pv y existe folio de compac y el estado es 2(existe el documento y sus movimientos pero no esta saldado) y no se a segmentada(1 es no segmentada)-->
                <v-btn
                  v-if="item.factura_id>0 && item.folio_compaq>0 && item.estado_compaq==2 && item.segmentada==1"
                  depressed
                  tile
                  :value="true"
                  dark
                  small
                  class="py-2"
                  @click="saldar(item)"
                >
                  <v-icon color="white">mdi-clipboard-arrow-up</v-icon> SALDAR
                </v-btn>
  
                <!-- se muestra cuando esta facturado en pv y existe folio de compac y el estado es 3(existe el documento y sus movimientos y esta saldado pero no esta timbrado) -->
                <v-btn
                  v-if="item.folio_compaq>0 && item.folio_compaq>0 && item.estado_compaq==3 && item.segmentada==1"
                  depressed
                  tile
                  :value="true"
                  dark
                  small
                  class="py-2"
                >
                  <v-icon color="white">mdi-clipboard-arrow-up</v-icon> TIMBRAR
                </v-btn>
              <!-- </v-btn-toggle>  -->
              </v-card-title>
                <v-divider></v-divider>
              
            
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                        <tr class="blue-grey lighten-5">
                          <th>RFC</th>
                          <th>Razon social</th>
                          <th>uso cfdi</th>
                          <th>forma pago</th>
                          <th>metodo pago</th>
                          <th>uuid</th>
                        </tr>
                    </thead>
                    <tbody>
                         <tr v-for="(fact,ind) in lst_factura" :key="ind">
                           <td>{{fact.rfc}}</td>
                           <td>{{fact.razon_social}}</td>
                           <td>{{fact.uso_cfdi}}</td>
                           <td>{{fact.forma_pago}}</td>
                           <td>{{fact.metodo_pago}}</td>
                           <td>{{fact.uuid}}</td>
                         </tr>
                    </tbody>
                  </template>
                </v-simple-table>
  
              </v-card>
              
              <v-card  class="mt-2">
  
                <v-divider></v-divider>
                <v-simple-table darkx>
                  <template>
                    <thead>
                      <tr class="grey darken-4">
                        <th class="white--text">Clave</th>
                        <th class="white--text">Concepto</th>
                        <th class="white--text">Periodo</th>
                        <th class="white--text">Cantidad</th>
                        <th class="white--text">Subtotal</th>
                        <th class="white--text">Descuento</th>
                        <th class="white--text">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(cargo,index) in lst_cargos" :key="index">
                        <td>{{cargo.producto_servicio}}</td>
                        <td>{{cargo.concepto}}</td>
                        <td>{{cargo.periodo}}</td>
                        <td>{{cargo.cantidad}}</td>
                        <td>{{numeral(cargo.total).multiply(cargo.cantidad).divide(1.16).format('$0,0.00')}}</td>
                        <td>{{fcurrency(cargo.descuento)}}</td>
                        <td>
                          {{numeral(cargo.total).multiply(cargo.cantidad).subtract(cargo.descuento).format('$0,0.00')}}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
  
              </v-card>
              
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
  
      <template v-slot:footer>
        <v-toolbar
            dark
            color="infox blue-grey darken-1"
            class="mb-0"
            height="70px"
          >
          <v-row
            class="mt-0"
            align="center"
            justify="center"
          >
            <span class="">pagos por pagina</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  dark
                  text
                  color="white"
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
  
            <v-spacer></v-spacer>
  
            <span
              class="mr-4"
            >
              Pagina {{ page }} de {{ numberOfPages }}
            </span>
            <v-btn
              fab
              dark
              color="blue-grey darken-3"
              class="mr-1"
              small
              @click="formerPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              color="blue-grey darken-3"
              class="ml-1"
              small
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-toolbar>
        </template>
  
     <template v-slot:loading>
           <div style="height:100px" class="blue-grey darken-3">
             <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            class="subtitle-1 text-center"
            cols="12"
          >
            <label class="text-h5 white--text">Cargando los Pagos</label>
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="white"
              indeterminate
              rounded
              height="10"
            ></v-progress-linear>
          </v-col>
        </v-row> 
           </div>
     </template>
  
     <template v-slot:no-data>
       <div style="height:100px" class="blue-grey darken-3">
             <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            class="subtitle-1 text-center"
            cols="12"
          >
            <label class="text-h3 white--text"><h3>Sin Pagos Para Mostrar</h3></label>       
          </v-col>
        </v-row> 
           </div>
     </template>
  
    </v-data-iterator>
     <v-snackbar
        v-model="snackbar" 
        color="warning"
        class="black--text"  
        multi-line   
      >
        NO Facturable es necesario verificar datos de facturacion...      
      </v-snackbar>
  
      <v-dialog v-model="dialog_cancelar" width="500">
  
         <v-card>
           <v-card-title>Cancelar Factura</v-card-title>
           <v-card-text>
             <v-textarea label="Motivo de Cancelacion" v-model="motivo_cancelado"></v-textarea>
           </v-card-text>
           <v-card-actions>
             <v-spacer></v-spacer>
             <v-btn outlined color="error" @click="motivo_cancelado='',dialog_cancelar=false"><v-icon>mdi-delete</v-icon>Cancelar</v-btn>
             <v-btn outlined color="info" @click="EliminarFactura"><v-icon>mdi-check</v-icon>Aceptar</v-btn>
           </v-card-actions>
         </v-card>
  
      </v-dialog>
  </div>
  </template>
  
  <script setup>
  import { ref, defineComponent, onMounted, computed,set,getCurrentInstance } from "vue";
  import round from 'lodash/round'
  import numeral from 'numeral'
  import dayjs from 'dayjs'
  import isUndefined from 'lodash/isUndefined'
  import throttle from 'lodash/throttle'
  import formAltaRfc from './form_repote_pagos_comercial.vue'
  import facturaSegmentada from './form_repote_pagos_comercial_segmentado.vue'
  import facturaDividida from './form_repote_pagos_comercial_dividido.vue'
  import {mask} from 'vue-the-mask'
  
     const root=getCurrentInstance().proxy
     const $axios =root.$axiosFinanzas;
     const $axiosCompac=root.$axiosCompaq;
     //#region datos factura
  
     const lst_pagos=ref([])
     const lst_cargos=ref([])
     const lst_factura=ref([])
        
  
     const menu_date=ref(false)
     const menu_date2=ref(false)
     const fecha_inicio=ref()
     const fecha_fin=ref()
     const n_accion=ref('')
     const find_uuid=ref()
  
     const accionMask=ref({
       mask: "#FFFF",
          tokens: {
            F: {
              pattern: /[0-9a-cA-C]/,
              transform(v) {
                return v.toLocaleUpperCase();
              }
            },
            '#':{
              pattern:/\d/
            }
          }
        })
  
     const panel=ref(0)
  
  
     const itemsPerPage=ref(4)
     const itemsPerPageArray=ref([4, 8, 12])
     const page=ref(1)
  
     const loading_pagos=ref(false)
  
     const text_loading=ref('')
  
     const snackbar=ref(false)
  
     const dialog_cancelar=ref(false)
     const motivo_cancelado=ref('')
     const idfactura_cancelar=ref()
     const id_usuario_cancela=ref()
  
              //#endregion
  
     const numberOfPages=computed(()=>Math.ceil(lst_pagos.value.length / itemsPerPage.value))
  
     onMounted(()=>{})
  
     //#region  metodos
  
     async function getPagos()
     {
        lst_pagos.value=[]
        loading_pagos.value=true
  
        let numero_accion = n_accion.value;;
        let clasificacion = 0;
        
        if(n_accion!=null){
        if (n_accion.value.indexOf("A") > -1) {
          numero_accion = n_accion.value.substr(0, n_accion.value.indexOf("A"));
          clasificacion = 1;
        } else if (n_accion.value.indexOf("B") > -1) {
          numero_accion = n_accion.value.substr(0, n_accion.value.indexOf("B"));
          clasificacion = 2;
        } else if (n_accion.value.indexOf("C") > -1) {
          numero_accion = n_accion.value.substr(0, n_accion.value.indexOf("C"));
          clasificacion = 3;
        }      
  
        }//fin if null
  
       
  
        let dataSend={};
  
        if(numero_accion>0)dataSend.numero_accion=numero_accion;
        if(clasificacion>0)dataSend.clasificacion=clasificacion;
        if(fecha_inicio.value!='')dataSend.fecha_inicio=fecha_inicio.value
        if(fecha_fin.value!='')dataSend.fecha_fin=fecha_fin.value
        
  
       let {data,status} =await $axios.get('pago',{params:dataSend})
       lst_pagos.value=data
       lst_pagos.value.forEach(i=>{
         set(i,'loading',false)
       })
       loading_pagos.value=false
     }
  
     async function getCargosAndFactura(event)
     {
       console.log(event,panel.value)
       if(!isUndefined(event)){
       
       let {data,status}=await $axios.get(`pago/${panel.value}/cargos`)
       lst_cargos.value=data
  
       let {data:factura,status:status2}=await $axios.get(`pago/${panel.value}/factura`)
       lst_factura.value=factura
       }
     }
  
     async function facturaOk(data,pago)
     {
       pago.factura_id=data.idfactura
       pago.estado_compaq=data.factura_comercial.estado;
       pago.folio_compaq=data.factura_comercial.folio;
       pago.uuid=data.factura_comercial.uuid;
       pago.codigo_error_compaq=data.factura_comercial.IError;
       pago.mensaje_error_compaq=data.factura_comercial.IErrorMessage;
  
       // se agrega la linea para buscar los datos de facturacion mediante la peticion de http 
      let {data:factura,status:status2}=await $axios.get(`pago/${pago.idpago}/factura`)
        lst_factura.value=factura
   
     }
  
     function formerPage () {
          if (page.value - 1 >= 1) page.value -= 1
        }
  
        function nextPage () {
          if (page.value + 1 <= numberOfPages.value) page.value += 1
        }
  
        function updateItemsPerPage (number) {
          itemsPerPage.value = number
        }
  
  
        const saveFacturaCompac=throttle(async (item)=>{
  
          let datos_factura_first=lst_factura.value[0];
           
            if(datos_factura_first.estatus===1){          
  
            item.loading=true
            let cargos_map=lst_cargos.value.filter(i=>i.total>0).map(i=>({
              codigo_prod_serv:i.producto_servicio,
              unidades:i.cantidad,
              precio:round(numeral(i.total).value(), 2),
              descuento:round(numeral(i.descuento).value(),2)
              }))
  
            let descripcion=await lst_cargos.value.filter(i=>i.total>0).map(i=>`${i.concepto} ${i.periodo}`).join();
            let observaciones=`folio de pago:${item.folio} de la accion(${item.accion}) | los cargos son: ${descripcion}`;
            let total=round(numeral(item.total).value(),2);
            
               let dataSend={                         
                           id_datos_facturacion:datos_factura_first.id_datos_facturacion,
                           codigo_cliente:item.accion,
                           rfc:datos_factura_first.rfc,
                           razon_social:datos_factura_first.razon_social,
                           correo:datos_factura_first.correo,
                           cp:datos_factura_first.cp,
                           calle:datos_factura_first.calle,
                           num_ext:datos_factura_first.num_ext,
                           num_int:datos_factura_first.num_int,
                           colonia:datos_factura_first.colonia,
                           municipio:datos_factura_first.municipio,
                           estado:datos_factura_first.estado,
                           pais:datos_factura_first.pais,
                           idpago:item.idpago,
                           metodo_pago:"PUE",
                           uso_cfdi:"G03",
                           forma_pago:numeral(item.forma_pago).format('00'),
                           Documentos:cargos_map,
                           observaciones:observaciones,
                           fecha_pago:dayjs(item.fecha_hora_cobro).format('DD/MM/YYYY'),
                           folio_pv:item.folio
                            }
  
  
  try{
  let {data:datafactura,status}=await  $axiosCompac.post(`/factura/${item.accion}`,dataSend)
  if(status===200){
          
         
      let {data:facturaSaldada,status:statusx}=await $axios.put(`/pago/${item.factura_id}/update-factura`,{
           uuid:'',
           folio:datafactura.folio,
           estado:datafactura.estado,
           IError:datafactura.IError,
           IErrorMessage:datafactura.IErrorMessage
         })
  
         if(statusx===200){
              item.folio_compaq=datafactura.folio
              item.estado_compaq=datafactura.estado
              item.codigo_error_compaq=datafactura.IError
              item.mensaje_error_compaq=datafactura.IErrorMessage
              item.segmentada=1
         }
         else{alert('ocurrio error al saldar en pv verificar en compac')} 
  
        }
  }
  catch(e){
  
  }
  finally{item.loading=false;}
        
           }//if de valida estatus de los datos en facturacion  
           else{
            //  mostrar snackbar de que verifique los datos 
            snackbar.value=true
           }
        })
  
        const saveFacturaPublicoGeneral=throttle(async (idpago,foliopago,fpago,monto,fechaPago,pago)=>{
            
            let cargos_map=lst_cargos.value.filter(i=>i.total>0).map(i=>({
              codigo_prod_serv:i.producto_servicio,
              unidades:i.cantidad,
              precio:round(numeral(i.total).value(), 2),
              descuento:round(numeral(i.descuento).value(),2)
              }))
   
            let descripcion=await lst_cargos.value.filter(i=>i.total>0).map(i=>`${i.concepto} ${i.periodo}`).join();         
  
            let observaciones=`folio de pago:${foliopago} | los cargos son: ${descripcion}`;
  
               let dataSend={                         
                           id_datos_facturacion:1,
                           idpago:idpago,
                           metodo_pago:"PUE",
                           uso_cfdi:"G03",
                           forma_pago:numeral(fpago).format('00'),
                           cargos:cargos_map,
                           observaciones:observaciones,
                           fecha_pago:dayjs(fechaPago).format('DD/MM/YYYY'),
                           folio_pv:foliopago
                            }
  
  try{
    pago.loading=true
    text_loading.value="Relizando Factura Publico en General"
  let {data,status}=await $axios.post('pago/factura-publico-general',dataSend)
  if(status===200){
         
       pago.factura_id=data.idfactura
       pago.estado_compaq=data.factura_comercial.estado;
       pago.folio_compaq=data.factura_comercial.folio;
       pago.uuid=data.factura_comercial.uuid;
       pago.codigo_error_compaq=data.factura_comercial.IError;
       pago.mensaje_error_compaq=data.factura_comercial.IErrorMessage;
       pago.segmentada=1;
  
       // se agrega la linea para buscar los datos de facturacion mediante la peticion de http 
      let {data:factura,status:status2}=await $axios.get(`pago/${pago.idpago}/factura`)
      lst_factura.value=factura
  
        }//fin axiosn compac
  }
  catch(e){
  
  }
  finally{
    pago.loading=false
    text_loading.value=""
    }
          
          },2000)
  
  
         const saveFacturaPublicoGeneralCompac=throttle(async (item)=>{
  
   
            
            let cargos_map=lst_cargos.value.filter(i=>i.total>0).map(i=>({
              codigo_prod_serv:i.producto_servicio,
              unidades:i.cantidad,
              precio:round(numeral(i.total).value(), 2),
              descuento:round(numeral(i.descuento).value(),2)
              }))
  
            let descripcion=await lst_cargos.value.filter(i=>i.total>0).map(i=>`${i.concepto} ${i.periodo}`).join();
  
            let observaciones=`folio de pago:${item.folio} | los cargos son: ${descripcion}`;
  
               let dataSend={                         
                           id_datos_facturacion:1,
                           idpago: item.idpago,
                           metodo_pago:"PUE",
                           uso_cfdi:"G03",
                           forma_pago:numeral(item.forma_pago).format('00'),
                           Documentos:cargos_map,
                           observaciones:observaciones,
                           fecha_pago:dayjs(item.fecha_hora_cobro).format('DD/MM/YYYY'),
                           folio_pv:item.folio
                            }                          
  
  try{
    item.loading=true
  let {data:datafactura,status}=await $axiosCompac.post('/factura_publico_general',dataSend)
  if(status===200){
          
       item.factura_id=data.idfactura
       item.estado_compaq=data.factura_comercial.estado;
       item.folio_compaq=data.factura_comercial.folio;
       item.uuid=data.factura_comercial.uuid;
       item.codigo_error_compaq=data.factura_comercial.IError;
       item.mensaje_error_compaq=data.factura_comercial.IErrorMessage;
       item.segmentada=1;
  
         
      let {data:facturaSaldada,status:statusx}=await $axios.put(`/pago/${item.factura_id}/update-factura`,{
           uuid:'',
           folio:datafactura.folio,
           estado:datafactura.estado,
           IError:datafactura.IError,
           IErrorMessage:datafactura.IErrorMessage
         })
  
         if(statusx===200){
              item.folio_compaq=datafactura.folio
              item.estado_compaq=datafactura.estado
              item.codigo_error_compaq=datafactura.IError
              item.mensaje_error_compaq=datafactura.IErrorMessage
         }
         else{alert('ocurrio error al saldar en pv verificar en compac')}
  
  
           // se agrega la linea para buscar los datos de facturacion mediante la peticion de http 
      let {data:factura,status:status2}=await $axios.get(`pago/${pago.idpago}/factura`)
      lst_factura.value=factura
  
        
  
  
        }
  }
  catch(e){
  
  }
  finally{item.loading=false}
          
          },2000)
  
  
        const saldar=throttle(async (data)=>{
          data.loading=true
         let dataSend={
               codigo_cliente: data.accion,
               monto_total_factura:data.total,
               fecha_pago:data.fecha_hora_cobro,
               folio_compaq:data.folio_compaq
         }
  
         let {data:datafactura,status}=await $axiosCompac.post('/saldar',dataSend)
         if(status===200){
         
         let {data:facturaSaldada,status:statusx}=await $axios.put(`/pago/${data.factura_id}`,{
           estado:datafactura.estado,
           IError:datafactura.IError,
           IErrorMessage:datafactura.IErrorMessage
         })
  
         if(statusx===200){
              data.estado_compaq=3
         }
         else{alert('ocurrio error al saldar en pv verificar en compac')}
         
         }
         else{alert('ocurrio error')}
         text_loading.value=''
          data.loading=false
          
        },2000)
  
        
        const timbrar=throttle(async (data)=>{
          
        },2000)
  
  
        async function EliminarFactura()
        {
            await $axios.delete(`/pago/${idfactura_cancelar.value}`,{params:{motivo:motivo_cancelado.value,idpersona:id_usuario_cancela.value}})
            dialog_cancelar.value=false
            getPagos()
        }
  
        function openCancelar(id){
          dialog_cancelar.value=true
          motivo_cancelado.value=''
          idfactura_cancelar.value=id
          id_usuario_cancela.value=root.$ls.get('user',{cve_persona:0}).cve_persona
        }

        function fcurrency(val){return numeral(val).format('$0,0.00')}

        function fdate(val){
        if(!isUndefined(val))return dayjs(val).format('DD/MM/YYYY')
        else return ''
        }
        
        //#endregion
        
  
    // filters:{
    //   fcurrency(val){return numeral(val).format('$0,0.00')},
    //   fdate(val){
    //     if(!isUndefined(val))return dayjs(val).format('DD/MM/YYYY')
    //     else return ''
    //     }
    // }

  </script>
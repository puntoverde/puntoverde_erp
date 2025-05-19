<template>
  <v-container>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Descuentos</v-toolbar-title>
        <v-text-field
          flat
          hide-details
          label="accion"
          class="ml-5"
          style="max-width: 250px !important"
          prepend-inner-icon="mdi-magnify"
          v-model="numeroAccion"
          @keyup.enter="buscarAccion"
          v-mask="accionMask"
          clearable
        ></v-text-field>
        <template v-slot:extension>
          <v-tabs v-model="tabs" fixed-tabs icons-and-text>
            <v-tabs-slider></v-tabs-slider>
            <v-tab href="#tab-1" class="primary--text">
              Aplicar Descuentos
              <v-icon>mdi-phone</v-icon>
            </v-tab>

            <v-tab href="#tab-2" class="primary--text">
              Programar Descuentos
              <v-icon>mdi-information</v-icon>
            </v-tab>

            <v-tab href="#tab-3" class="primary--text">
              Cancelar descuentos
              <v-icon>mdi-account-box</v-icon>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tabs">
        <v-tab-item value="tab-1" class="px-3">
          <v-row>
            <v-col cols="12" lg="8">
              <v-card flat>
                <v-card-text>
                  <v-list flat subheader three-line>
                    <v-list-item-group v-model="selected" multiple active-class>
                      <v-list-item
                        v-for="cargo in lst_cargos"
                        :key="cargo.cve_cargo"
                        :disabled="cargo.iddescuento > 0"
                        :value="cargo"
                      >
                        <template v-slot:default="{ active }">
                          <v-list-item-action>
                            <v-checkbox
                              color="primary"
                              v-model="active"
                            ></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-title
                              >{{ cargo.concepto }}
                              {{ numeral(cargo.total).format("$0,0.00") }}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{
                              cargo.persona
                            }}</v-list-item-subtitle>
                            <v-list-item-subtitle
                              ><v-chip :class="{ primary: active }"
                                >Periodo {{ cargo.periodo }}</v-chip
                              >
                              &nbsp; &nbsp; Fecha Cargo:
                              {{
                                 dayjs(cargo.fecha_cargo).format("DD/MM/YYYY HH:mm")
                              }}</v-list-item-subtitle
                            >
                          </v-list-item-content>
                          <v-list-item-action>
                            <!-- <v-btn outlined v-if="active">{{
                              (cargo.total - cargo.descuento)
                                numeral().format('$0,0.00')
                            }}</v-btn> -->
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" lg="4">
              <v-row>
                <v-col cols="12" lg="12">
                  <v-card elevation="5" dark color="secondary">
                    <v-card-title>INGRESAR DESCUENTO</v-card-title>
                    <v-card-text class="title">
                      <v-row>
                        <v-col cols="12" lg="6">
                          <v-text-field
                            :disabled="cve_accion == 0"
                            label="Cantidad ha Pagar"
                            @keyup="keyCantidadPagar"
                            v-model="cantidadPagar"
                            v-currency="{ currency: 'USD', locale: 'en' }"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                          <v-text-field
                            :disabled="cve_accion == 0"
                            label="Cantidad Descuento"
                            @keyup="keyCantidadDescuento"
                            v-model="cantidadDescuento"
                            v-currency="{ currency: 'USD', locale: 'en' }"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" lg="6">
                  <v-card elevation="4" dark color="secondary">
                    <v-card-title>Adeudo</v-card-title>
                    <v-card-text class="title">{{
                      numeral(cTotalAdeudo).format("$0,0.00")
                    }}</v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-card elevation="4" dark color="secondary">
                    <v-card-title>Total Pagar</v-card-title>
                    <v-card-text class="title">{{
                      numeral(cTotalPagar).format("$0,0.00")
                    }}</v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="12">
                  <v-btn block color="primary" @click="aplicarDescuento">
                    <!-- v-if="cTotalAdeudo - cTotalPagar > 0" -->
                    <v-icon>mdi-save</v-icon>Aplicar Descuento
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
        <v-tab-item value="tab-2">
          <v-card flat>
            <v-card-text>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-card flat>
                    <v-card-text>
                      <v-list flat subheader three-line>
                        <template v-for="cuotas in cuotas_obligatorias">
                          <v-list-item
                            :key="cuotas.iddescuento_programado"
                            :value="cuotas"
                            @click="selectedCuota(cuotas)"
                          >
                            <v-list-item-avatar>
                              <v-icon class="primary" color="white"
                                >mdi-notebook</v-icon
                              >
                            </v-list-item-avatar>

                            <v-list-item-content>
                              <v-list-item-title>{{
                                cuotas.descripcion
                              }}</v-list-item-title>
                              <v-list-item-subtitle
                                >Costo:{{
                                  numeral(cuotas.cantidad).format("$0,0.00")
                                }}</v-list-item-subtitle
                              >
                            </v-list-item-content>

                            <v-list-item-action>
                              <v-btn icon>
                                <v-icon color="primary">mdi-plus-circle</v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
                          <v-divider
                            :key="`${cuotas.cve_cuota}-div`"
                          ></v-divider>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-expansion-panels>
                    <v-expansion-panel
                      v-for="(item, i) in sociosAplica"
                      :key="i"
                    >
                      <v-expansion-panel-header v-slot="{ open }">
                        <v-row no-gutters>
                          <!-- <v-col cols="2">usuario</v-col> -->
                          <v-col cols="11" class="text--secondary">
                            <v-fade-transition leave-absolute>
                              <span v-if="open" key="0">
                                Programe Descuento
                                <v-icon>mdi-arrow-expand-right</v-icon>
                                {{
                                  numeral(
                                    selectedProgramado.cantidad - item.cantidad
                                  ).format("$0,0.00")
                                }}
                              </span>
                              <span v-else key="1">
                                usuario: {{ item.nombre }}
                                {{ item.apellido_paterno }}
                                {{ item.apellido_materno }}
                                <v-icon>mdi-arrow-expand-right</v-icon>
                                {{
                                  numeral(selectedProgramado.cantidad).format(
                                    "$0,0.00"
                                  )
                                }}
                              </span>
                            </v-fade-transition>
                          </v-col>
                          <v-col cols="1">
                            <v-btn icon small color="primary">
                              <v-icon>mdi-check</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-row justify="space-around" no-gutters>
                          <v-col cols="5">
                            <v-text-field
                              v-model="item.cantidad"
                              label="Cantidad"
                              v-mask="'######'"
                              prepend-icon="mdi-currency-usd"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="6">
                            <v-menu
                              ref="menu"
                              v-model="item.menu"
                              :close-on-content-click="false"
                              :return-value.sync="item.periodos"
                              transition="scale-transition"
                              offset-y
                              full-width
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  :value="item.periodos"
                                  label="Periodos Aplicar"
                                  prepend-icon="mdi-calendar-month"
                                  readonly
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="item.periodos"
                                multiple
                                min="2019-09"
                                no-title
                                scrollable
                                type="month"
                                color="primary"
                              >
                                <div class="flex-grow-1"></div>
                                <v-btn
                                  text
                                  color="secundary"
                                  @click="item.menu = false"
                                  >Cancel</v-btn
                                >
                                <v-btn
                                  text
                                  color="secundary"
                                  @click="$refs.menu[i].save(item.periodos)"
                                  >OK</v-btn
                                >
                              </v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12">
                            <v-btn
                              v-if="
                                item.cantidad > 0 &&
                                item.cantidad <
                                  parseFloat(selectedProgramado.cantidad) &&
                                item.periodos.length
                              "
                              @click="crearDescucntoProgramado(item)"
                              block
                              color="primary"
                              >Aplicar Descuento Programado</v-btn
                            >
                          </v-col>
                        </v-row>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-3">
          <v-card flat>
            <v-card-text
              ><EliminarDescuento
                :accion="numeroAccion"
                :arrdescuentos="lst_cargos"
                @emit-actualizaTabla="buscarAccion"
            /></v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref,computed, watch,getCurrentInstance } from 'vue';
import numeral from 'numeral'
import round from 'lodash/round'
import _ from "lodash";
import debounce from 'lodash/debounce'
import dayjs from 'dayjs'

import EliminarDescuento from "@/components/descuento/procesoEliminarDescuento.vue";

import {getDescuentoByCargosService,setAplicarDescuentoService,getCuotasObligatoriasService,getFindDuenoAplicaService,getFindSocioAplicaService,setCreateDescuentoProgramadoService} from '@/services/descuento_service'

const root=getCurrentInstance().proxy

const numeroAccion=ref("")
const cve_accion=ref(0)
const lst_cargos=ref([])
const cuotas_obligatorias=ref("")
const selected=ref([])
const selectedProgramado=ref({})
const tabs=ref("tab-1")
const accionMask={
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
      }
      const cantidadPagar=ref(0)
      const cantidadDescuento=ref(0)


      const duenoAplica=ref({})
      const sociosAplica=ref([])
      const date=ref(null)
      // const periodo=ref(filterPeriodo.value)
      const periodo=ref()
      const menu=ref(false)
      const snackbar=ref(false)
      const snackbarText=ref("")
      const snackbarColor=ref("success")


     const  cCantidadPagar=computed(()=>{
      return numeral(cantidadPagar.value).value();//transforma de $0,0.00 a numero      
    })
    const cCantidadDescuento=computed(()=>{
      return numeral(cantidadDescuento.value).value();//transforma de $0,0.00 a numero
    })
    const cTotalAdeudo=computed(()=> {
      return round(selected.value.map(item => numeral(item.total).value()).reduce((red, val) => numeral(red).add(val).value(), 0),2);
    })
    const cTotalPagar=computed(() =>{
      return round(numeral(cTotalAdeudo.value).subtract(cCantidadDescuento.value).value(),2);
    })
    const filterPeriodo=computed(()=> {
      return periodo.value ? dayjs(periodo.value).format("MM-YYYY") : "";
    })

    watch(cTotalAdeudo,(totaladeudo)=>{
      cantidadPagar.value = numeral(0).format("$0,0.00")   
      cantidadDescuento.value=numeral(0).format("$0,0.00")
    })

    async function  buscarAccion() {
      let numero_accion =numeroAccion.value;
      let clasificacion = 0;

      if (numeroAccion.value.indexOf("A") > -1) {
        numero_accion = numeroAccion.value.substr(
          0,
          numeroAccion.value.indexOf("A")
        );
        clasificacion = 1;
      } else if (numeroAccion.value.indexOf("B") > -1) {
        numero_accion = numeroAccion.value.substr(
          0,
          numeroAccion.value.indexOf("B")
        );
        clasificacion = 2;
      } else if (numeroAccion.value.indexOf("C") > -1) {
        numero_accion = numeroAccion.value.substr(
          0,
          numeroAccion.value.indexOf("C")
        );
        clasificacion = 3;
      }

      
      try {
     
        
        const data=await getDescuentoByCargosService(numero_accion,clasificacion)
        // if(status===200)

        cve_accion.value = parseInt(data.cve_accion);
        lst_cargos.value = data.cargos;
        selected.value = [];
        getCuotasObligatorias();
      } catch (error) {}
    }

    const aplicarDescuento=debounce(async function(){
      
      let cargos = selected.value.map(i => ({cve_cargo:i.cve_cargo,monto:i.total}));

      try{
      const cve_persona=root.$ls.get("user", { cve_persona: 0 }).cve_persona
      const data=await setAplicarDescuentoService(cargos,cCantidadDescuento.value,cve_persona)
       
         
            cantidadDescuento.value = numeral(0).format("$0,0.00");
            cantidadPagar.value=numeral(0).format("$0,0.00");
            snackbarColor.value = "success";
            snackbarText.value = "Descuento Aplicado Correctamente...";
            snackbar.value = true;
            lst_cargos.value=[];
            selected.value = [];
            buscarAccion();
         
        }
        catch(e){
          snackbarColor.value = "error";
            snackbarText.value = "Ocurrio un error...";
            snackbar.value = true;
        }
    },500)

    async function getCuotasObligatorias() {      
      cuotas_obligatorias.value = await getCuotasObligatoriasService();
      
    }
    function keyCantidadPagar() {
      if(cCantidadPagar.value<=cTotalAdeudo.value)
      cantidadDescuento.value = numeral(cTotalAdeudo.value).subtract(cCantidadPagar.value).format('$0,0.00');
    }
    function keyCantidadDescuento() {
      cantidadPagar.value = numeral(cTotalPagar.value).format('$0,0.00');
    }
    function selectedCuota(cuota) {

      console.log("selecciono una cuota->",cuota)
      selectedProgramado.value = cuota;

      if (parseInt(cuota.tipo_cuota) === 2) {
        findDuenoAplica(cuota);
      } else {
        findSociosAplica(cuota);
      }
    }

    async function findDuenoAplica(cuota) {
      let membresias = cuota.membresias.split(",");


      const data=await getFindDuenoAplicaService(cve_accion.value,membresias)
      
            data.cantidad = 0;
           
            data.periodos = _.isNull(data.periodos) || data.periodos.length==0
              ? []
              : data.periodos.split(",").map((data) => `${data.split("-")[1]}-${data.split("-")[0]}`);
            data.date = "";
            data.menu = false;
          sociosAplica.value=[]
          sociosAplica.value.push(data)
      
    }

    async function findSociosAplica(cuota) {
      let parentescos = cuota.parentescos.split(",");     
      const data=await getFindSocioAplicaService(cve_accion.value,parentescos,cuota.edad_aplica)

          data.forEach((item) => {
            item.cantidad = 0;
           
            item.periodos = _.isNull(item.periodos) || item.periodos.length==0
              ? []
              : item.periodos.split(",").map((item) => `${item.split("-")[1]}-${item.split("-")[0]}`);
            item.date = "";
            item.menu = false;
          });
          sociosAplica.value = data; //llena el aarray de socios para despues seleccionar uno
       
    }

     async function crearDescucntoProgramado(p) {
      let periodos = p.periodos.map((periodo) =>
        dayjs(periodo).format("MM-YYYY")
      );
      const data=await setCreateDescuentoProgramadoService(cve_accion.value,p.cve_persona,selectedProgramado.value.cve_cuota,p.cantidad,periodos);
    }
    
</script>
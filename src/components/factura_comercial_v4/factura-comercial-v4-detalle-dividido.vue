<template>
  <v-dialog
    v-model="dialog"
    width="60%"
    persistent
    scrollable
    @input="initFactura"
  >
    <v-snackbar v-model="snackbar" color="warning">
      Alguna de las factura no especifico el uso del cfdi
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <template v-slot:activator="{ on }">
      <v-btn v-on="on" rounded dark smallx class="mx-1" color="primary">
        <v-icon color="white" class="mr-2">mdi-account-group</v-icon> DIVIDIDA
      </v-btn>
    </template>

    <v-card tile>
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-title
          >Factura Dividida ({{n_facturas}})</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>

        <template v-slot:extension>
          <v-tabs v-model="tab" centered fixed-tabs @change="clearTabs" color="primary">
            <v-tabs-slider color="primary"></v-tabs-slider>

            <v-tab> Listado de Clientes </v-tab>
            <v-tab disabled> Completar datos facturas </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-card-text class="mx-0 my-0 px-0 py-0">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-list subheaderxx three-line flat nav>
              <v-list-item-group v-model="factura">
                <v-list-item
                  v-for="datos_factura in lst_datos_facturacion"
                  :key="datos_factura.id_datos_facturacion"
                  :value="datos_factura"                 
                  :disabled="datos_factura.estatus==2"
                  :class="{'error--text':datos_factura.estatus==2}"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-action class="mr-2">
                      <v-checkbox
                        :value="active"
                        color="secundary"
                      ></v-checkbox>
                    </v-list-item-action>

                    <v-list-item-content class="py-1">
                      <v-list-item-title>{{
                        `RFC: ${datos_factura.rfc}`
                      }}</v-list-item-title>
                      <v-list-item-subtitle
                        >RSocial:{{
                          datos_factura.razon_social
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle>{{
                        `Domicilio:${datos_factura.calle} # ${datos_factura.num_ext}, ${datos_factura.colonia} cp:${datos_factura.cp} ${datos_factura.municipio} ${datos_factura.estado}`
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-tab-item>
          <v-tab-item >
            <v-carousel             
              :continuous="false"
              hide-delimiter-background
              hide-delimiters
            >
              <v-carousel-item
                v-for="(fact, ind) in CFacturasSelection"
                :key="ind"
              >
                <v-card tile height="100%">
                  <v-card-text class="">
                  <v-row class="mx-8">
                    <v-col cols="5" class="pb-0">
                      <v-text-field
                      label="RFC"
                        :value="fact.cliente.rfc"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="7" class="pb-0">
                      <v-text-field
                      label="Razon social"
                        :value="fact.cliente.razonSocial"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-textarea
                      label="Domicilio"
                        no-resize
                        rows="4"
                        row-height="20"
                        auto-grow
                        :value="`Calle ${fact.domicilio.calle} #ext:${fact.domicilio.num_ext} , #int:${fact.domicilio.num_int} Col:${fact.domicilio.colonia},  ${fact.domicilio.ciudad} ${fact.domicilio.estado}`"
                        hide-details
                        dense
                        readonly
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" lg="7" class="pb-0">
                      <v-select
                        label="Uso CFDI"
                        :items="lst_regimen_fiscal"
                        item-value="clave_sat"
                        item-text="nombre"
                        dense
                        hide-details
                        
                        filled
                        height="45"
                      >
                      
                      <template v-slot:item="{item}">
                       <v-chip class="primary font-weight-bold"> {{item.clave_sat}} </v-chip>
                       <label class="ml-3"> {{item.nombre}}</label>
                      </template>
                    <template v-slot:selection="{item}">
                      
                      <v-chip small class="primary font-weight-bold"> {{item.clave_sat}} </v-chip>
                      <label class="ml-3 d-inline-block text-truncate"> {{item.nombre}}</label>
                      
                    </template>
                      
                      </v-select>
                    </v-col>
                    <v-col cols="12" lg="5" class="pb-0">
                      <v-select
                        label="Uso CFDI"
                        :items="lst_uso_cfdi"
                        item-value="clave"
                        item-text="descripcion"
                        dense
                        hide-details
                        v-model="fact.uso_cfdi"
                        filled
                         height="45"
                      >
                      
                      <template v-slot:item="{item}">
                       <v-chip class="primary font-weight-bold"> {{item.clave}} </v-chip>
                       <label class="ml-3"> {{item.descripcion}}</label>
                      </template>
                    <template v-slot:selection="{item}">
                      <v-chip small class="primary font-weight-bold"> {{item.clave}} </v-chip>
                      <label class="ml-3 d-inline-block text-truncate"> {{item.descripcion}}</label>
                    </template>
                      
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-simple-table class="mt-8 mx-8">
                  <template v-slot:default>
                    <thead class="secondary">
                      <tr>
                        <th class="white--text text-left font-weight-bold text-body-1">
                          Concepto
                        </th>
                        <th class="white--text text-left font-weight-bold text-body-1">
                          Periodo
                        </th>
                        <th class="white--text text-left font-weight-bold text-body-1">
                          Precio
                        </th>
                      </tr>
                      <tr>
                        <td colspan="3" class="primary" style="height:5px"></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(car, ind2) in fact.movimientos" :key="ind2">
                        <td class="text-subtitle-1">{{ car.concepto }}</td>
                        <td width="25%" style="font-family: Consolas" class="text-center font-weight-bold">{{ car.periodo }}</td>
                        <td width="25%">
                          <v-text-field
                            solo-inverted
                            dense
                            reverse
                            hide-details
                            v-model="car.importe"
                            v-currency="{ currency: 'USD', locale: 'en' }"
                          ></v-text-field>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="3" class="secondary" style="height:3px">                         
                        </th>
                      </tr>
                    </tfoot>
                  </template>
                </v-simple-table>
                  </v-card-text>
                </v-card>
                
              </v-carousel-item>
            </v-carousel>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions class="secondary">

        <v-btn text class="mr-3 text-h6" dark>Total:{{ numeral(monto).format('$0,0.00') }}</v-btn>
         <v-btn text class="text-h6" dark>Capturado:{{ numeral(CTotal).format('$0,0.00') }}</v-btn>
        
      
        <v-spacer></v-spacer>
        <v-menu v-if="tab == 0 && factura" offset-y :close-on-click="true" :close-on-content-click="false">
          <template v-slot:activator="{on,attrs }">
           <v-btn v-on="on" v-bind="attrs" outlined color="primary">Continuar</v-btn>            
          </template>
          <v-card width="300">
            <v-toolbar dense color="secondary" dark>
              <v-toolbar-title>Numero de Facturas</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="primary" rounded @click="continuar">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="text-left redx d-flex flex-column" cols="12" lg="3">
                   <span class="text-h2 font-weight-light">{{n_facturas}}</span>
                   <span class="text-caption font-weight-light">facturas</span>          
                </v-col>
                <v-col class="bluex d-flex justify-center align-center ">
            <v-slider
            v-model="n_facturas"
  hide-details
  densex
  max="5"
  min="2"
  thumb-label
  ticks="always"
  tick-size="5"
></v-slider>
        </v-col>
              </v-row>

              
            </v-card-text>
          </v-card>
        </v-menu>
        <v-btn
          @click="saveFacturaDividida"
          v-if="tab == 1 && CTotal === monto && PrecioValid"
          color="primary"
          >Facturar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {
  ref,
  defineComponent,
  onMounted,
  computed,
  watch
,getCurrentInstance} from 'vue';


import isUndefined from "lodash/isUndefined";
import round from "lodash/round";
import throttle from "lodash/throttle";
import numeral from "numeral";
import dayjs from "dayjs";

const props=defineProps({
    //accion: { type: Number, default: 0 },
    numero_accion: { type: String, default: "" },
    idpago: { type: Number, default: 0 },
    fpago: { type: Number, default: 0 },
    fpago_text: { type: String, default: "" },
    cargos_facturar: { type: Array, default: () => [] },
    foliopago: { type: Number | String, default: "0" },
    fechaPago: { type: String, default: dayjs().format("YYYY-MM-DD") },
  })

const emit =defineEmits(["emit-facturado"])

    const root=getCurrentInstance().proxy
    const $axios = root.$axiosFinanzas;
     const stateFactura = root.$store.state.sFactura; 
    //#region variable
    const dialog = ref(false);
    const tab = ref(null);
    const items = ref(["web", "shopping", "videos", "images", "news"]);

    const lst_datos_facturacion = ref([]);

    const n_facturas=ref(2)

    

    const factura = ref({});
    const cve_persona_factura = ref("");

    const overlay = ref(false);
    const snackbar = ref(false);

    //#endregion

    const foliopago = computed(() => stateFactura.folio);
    const accion = computed(() => stateFactura.cve_accion);
    const numero_accion=computed(() => stateFactura.numero_accion);
    const idpago=computed(() => stateFactura.idpago);
    const fecha_pago=computed(() => stateFactura.fecha_pago);
    const monto=computed(() => stateFactura.monto);
    const metodo_pago=computed(() => stateFactura.forma_pago);
    const metodo_pago_texto=computed(() => stateFactura.forma_pago_text);
    const lst_forma_pago = computed(() => stateFactura.lst_forma_pago);
    const lst_uso_cfdi = computed(() => stateFactura.lst_uso_cfdi);
    const lst_regimen_fiscal = computed(() => stateFactura.lst_regimen_fiscal);


    const CFacturasSelection = ref([]);
    
    const CTotal = computed(() =>
      CFacturasSelection.value
        .map((i) => i.movimientos)
        .flat()
        .map((i) => i.importe)
        .reduce((red, val) => red + numeral(val).value(), 0)
    );
    
    const PrecioValid = computed(() =>
      CFacturasSelection.value
        .map((i) => i.movimientos)
        .flat()
        .map((i) => numeral(i.importe).value())
        .every((i) => i > 0)
    );
     
    function initFactura() {
      getDatosFacturacion();
    }

    async function getDatosFacturacion() {
      let { data, status } = await $axios.get("pago/datos-factura", {
        params: { cve_accion: accion.value },
      });
      lst_datos_facturacion.value = data;
    }

    const saveFacturaDividida = throttle(async () => {
     
      CFacturasSelection.value.forEach(i=>i.movimientos.forEach(j=>j.importe=numeral(j.importe).value()))

      if (
        CFacturasSelection.value.map((i) => i.uso_cfdi).every((i) => i != "")
      ) {
        
         overlay.value = true;
        
        for await(const i of CFacturasSelection.value) {
          
          //se convierte el precio de los documentos en double porq eu viene en cadena de esta forma $00.00
          //ademas se convierten en subtotales
          i.movimientos.forEach((j) => {
            j.importe = round(numeral(j.importe).value(), 2);
          });
          ////envia factura
          try {
        
            let { data, status } = await $axios.post(`facturacion-v4/factura/${numero_accion.value}`, i);
           
            if (status === 200) {
              emit("emit-facturado", data);
            }
          } catch (e) {
          } finally {
          }
        } //fin del for

      
        overlay.value = false;
      } else {
        snackbar.value = true;
      }
    }, 2000);

    function clearTabs(tabx) {
      if (tabx === 0) factura.value = undefined;
    }

    function continuar(){
      tab.value = 1

      console.log("numero facturas->",n_facturas.value)
      
       let observaciones = `folio de pago:${foliopago.value} de la accion(${numero_accion.value}) | los cargos son: ${props.cargos_facturar.filter((i) => i.total > 0).map((i) => `${i.concepto} ${i.periodo}`).join()}`;

      CFacturasSelection.value = Array(n_facturas.value).fill(factura.value).map((i) => ({
        
        cliente:{
                rfc:i.rfc,
                razonSocial:i.razon_social,
                curp:"NA",
                correo:i.correo,
                metodoPago:numeral(metodo_pago.value).format("00"),
                usoCFDI:"G03",
                regimenFiscal:"605"},
        domicilio:{
                calle:i.calle,
                numExt:i.num_ext,
                numInt:i.num_int,
                colonia:i.colonia,
                cp:i.cp,
                municipio:i.municipio,
                estado:i.estado,
                pais:i.pais},
        movimientos:props.cargos_facturar.map(i=>({
                concepto:i.concepto,
                periodo:i.periodo,
                codProducto:i.producto_servicio,
                unidades:i.cantidad,
                importe:0,
                descuento:numeral(i.descuento).value()})),
        fecha_pago:dayjs(fecha_pago.value).format("YYYY-MM-DD"),
        folio_pv:foliopago.value,
        observaciones,
        accion:accion.value,
        idpago:idpago.value,
        id_dato_factura:i.id_datos_facturacion        
      }));

      
    }


</script>

<style>
.my-mayus input {
  text-transform: uppercase;
}
</style>

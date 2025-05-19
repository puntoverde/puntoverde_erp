<template>
  <v-dialog
    v-model="dialog"
    width="50%"
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
      <v-btn v-on="on" depressed tile :value="false" dark small class="mx-1">
        <v-icon color="white">mdi-account-group</v-icon> FACTURAR DIVIDIDA
      </v-btn>
    </template>

    <v-card tile>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="text-h3"
          >Factura Dividida</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>

        <template v-slot:extension>
          <v-tabs v-model="tab" centered fixed-tabs @change="clearTabs">
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab> Listado de Clientes </v-tab>
            <v-tab disabled> Completar datos facturas </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-card-text style="height: 560px" class="mx-0 my-0 px-0 py-0">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-list subheaderxx three-line flat nav>
              <v-list-item-group v-model="factura">
                <v-list-item
                  v-for="datos_factura in lst_datos_facturacion"
                  :key="datos_factura.id_datos_facturacion"
                  :value="datos_factura"
                  class="mb-0xx"
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
          <v-tab-item class="primary" style="height: 560px">
            <v-carousel
              style="height: 560px"
              :continuous="false"
              hide-delimiter-background
              hide-delimiters
            >
              <v-carousel-item
                v-for="(fact, ind) in CFacturasSelection"
                :key="ind"
              >
                <v-card tile color="grey darken-2" height="auto">
                  <v-row class="px-2">
                    <v-col cols="5">
                      <v-text-field
                        :value="fact.rfc"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field
                        :value="fact.razon_social"
                        hide-details
                        readonly
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        no-resize
                        rows="2"
                        row-height="20"
                        auto-grow
                        :value="`Domicilio  Calle ${fact.calle} #ext:${fact.num_ext} , #int:${fact.num_int} Col:${fact.colonia},  ${fact.ciudad} ${fact.estado}`"
                        hide-details
                        dense
                        readonly
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" lg="4">
                      <v-select
                        label="uso cfdi"
                        :items="lst_uso_cfdi"
                        item-value="clave"
                        item-text="descripcion"
                        dense
                        hide-details
                        v-model="fact.uso_cfdi"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card>
                <v-simple-table>
                  <template v-slot:default>
                    <thead class="whitex">
                      <tr>
                        <th class="black--textx text-left subtitle-1">
                          Concepto
                        </th>
                        <th class="black--textx text-center subtitle-1">
                          Periodo
                        </th>
                        <th class="black--textx text-center subtitle-1">
                          Precio
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(car, ind2) in fact.cargos" :key="ind2">
                        <td>{{ car.concepto }}</td>
                        <td>{{ car.periodo }}</td>
                        <td>
                          <v-text-field
                            solo-inverted
                            dense
                            hide-details
                            v-model="car.precio"
                            v-currency="{ currency: 'USD', locale: 'en' }"
                          ></v-text-field>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="3">
                          <v-btn text
                            >Monto del Pago:{{ monto | currency }}, monto
                            capturado:{{ CTotal | currency }}</v-btn
                          >
                        </th>
                      </tr>
                    </tfoot>
                  </template>
                </v-simple-table>
              </v-carousel-item>
            </v-carousel>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions class="primary">
      
        <v-spacer></v-spacer>
        <v-btn v-if="tab == 0 && factura" @click="continuar">Continuar</v-btn>
        <v-btn
          @click="saveFacturaSegmentada"
          v-if="tab == 1 && CTotal === monto && PrecioValid"
          >Guardar y Facturar</v-btn
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
  watch,
  getCurrentInstance
} from "vue";
import { CurrencyDirective } from "vue-currency-input";
import { mask } from "vue-the-mask";
import isUndefined from "lodash/isUndefined";
import round from "lodash/round";
import throttle from "lodash/throttle";
import numeral from "numeral";
import dayjs from "dayjs";

// export default defineComponent({
  const props=defineProps({
    accion: { type: Number, default: 0 },
    numero_accion: { type: String, default: "" },
    idpago: { type: Number, default: 0 },
    fpago: { type: Number, default: 0 },
    fpago_text: { type: String, default: "" },
    monto: { type: Number, default: 0 },
    cargos_facturar: { type: Array, default: () => [] },
    foliopago: { type: Number | String, default: "0" },
    fechaPago: { type: String, default: dayjs().format("YYYY-MM-DD") },
  })

  const emit=defineEmits(["emit-facturado"])

  // directives: { mask, currency: CurrencyDirective },
  // setup(props, context) {
  const root=getCurrentInstance().proxy
    const $axios = root.$axiosFinanzas;
    //#region variable
    const dialog = ref(false);
    const tab = ref(null);
    const items = ref(["web", "shopping", "videos", "images", "news"]);

    const lst_datos_facturacion = ref([]);

    const lst_forma_pago = ref([]);
    const lst_uso_cfdi = ref([]);

    const factura = ref({});
    const cve_persona_factura = ref("");

    const overlay = ref(false);
    const snackbar = ref(false);

    //#endregion

    const CFacturasSelection = ref([]);
    const CTotal = computed(() =>
      CFacturasSelection.value
        .map((i) => i.cargos)
        .flat()
        .map((i) => i.precio)
        .reduce((red, val) => red + numeral(val).value(), 0)
    );
    const PrecioValid = computed(() =>
      CFacturasSelection.value
        .map((i) => i.cargos)
        .flat()
        .map((i) => numeral(i.precio).value())
        .every((i) => i > 0)
    );

    // watch(factura, () => {
    //   let observaciones = `folio de pago:${props.foliopago} de la accion(${
    //     props.numero_accion
    //   }) | los cargos son: ${props.cargos_facturar
    //     .filter((i) => i.total > 0)
    //     .map((i) => `${i.concepto} ${i.periodo}`)
    //     .join()}`;

    //   CFacturasSelection.value = factura.value.map((i) => ({
    //     idpago: props.idpago,
    //     id_datos_facturacion: i.id_datos_facturacion,
    //     codigo_cliente: props.numero_accion,
    //     razon_social: i.razon_social,
    //     rfc: i.rfc,
    //     correo: i.correo,
    //     cp: i.cp,
    //     calle: i.calle,
    //     num_ext: i.num_ext,
    //     num_int: i.num_int,
    //     colonia: i.colonia,
    //     municipio: i.municipio,
    //     estado: i.estado,
    //     pais: i.pais,
    //     cargos: props.cargos_facturar.map((j) => ({
    //       codigo_prod_serv: j.producto_servicio,
    //       unidades: j.cantidad,
    //       precio: 0,
    //       descuento: 0,
    //       concepto: j.concepto,
    //       periodo: j.periodo,
    //     })),
    //     monto_total: 0,
    //     monto_subtotal: 0,
    //     forma_pago: numeral(props.fpago).format("00"),
    //     metodo_pago: "PUE",
    //     uso_cfdi: "",
    //     observaciones: observaciones,
    //     fecha_pago: dayjs(props.fechaPago).format("DD/MM/YYYY"),
    //     folio_pv: props.foliopago,
    //   }));
    // });

    function initFactura() {
      getFormaPago();
      getUsoCfdi();
      getDatosFacturacion();
    }

    async function getDatosFacturacion() {
      let { data, status } = await $axios.get("pago/datos-factura", {
        params: { cve_accion: props.accion },
      });
      lst_datos_facturacion.value = data;
    }

    async function getFormaPago() {
      let { data, status } = await $axios.get("pago/forma-pago");
      lst_forma_pago.value = data;
    }

    async function getUsoCfdi() {
      let { data, status } = await $axios.get("pago/uso-cfdi");
      lst_uso_cfdi.value = data;
    }

    const saveFacturaSegmentada = throttle(async () => {
      if (
        CFacturasSelection.value.map((i) => i.uso_cfdi).every((i) => i != "")
      ) {
        
         overlay.value = true;
        ////CFacturasSelection.value.forEach(async (i,ind)=>{// no sirve con el await
        for await(const i of CFacturasSelection.value) {
          
          //se convierte el precio de los documentos en double porq eu viene en cadena de esta forma $00.00
          //ademas se convierten en subtotales
          i.cargos.forEach((j) => {
            j.precio = round(numeral(j.precio).value(), 2);
          });
          ////envia factura
          try {
        
            let { data, status } = await $axios.post("pago/cfactura", i);
           
            if (status === 200) {
              emit("emit-facturado", data);
            }
          } catch (e) {
          } finally {
          }
        } //fin del for
        ////})//fin if de for each

      
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
      
       let observaciones = `folio de pago:${props.foliopago} de la accion(${props.numero_accion}) | los cargos son: ${props.cargos_facturar.filter((i) => i.total > 0).map((i) => `${i.concepto} ${i.periodo}`).join()}`;

      CFacturasSelection.value = Array(2).fill(factura.value).map((i) => ({
        idpago: props.idpago,
        id_datos_facturacion: i.id_datos_facturacion,
        codigo_cliente: props.numero_accion,
        razon_social: i.razon_social,
        rfc: i.rfc,
        correo: i.correo,
        cp: i.cp,
        calle: i.calle,
        num_ext: i.num_ext,
        num_int: i.num_int,
        colonia: i.colonia,
        municipio: i.municipio,
        estado: i.estado,
        pais: i.pais,
        cargos: props.cargos_facturar.map((j) => ({
          codigo_prod_serv: j.producto_servicio,
          unidades: j.cantidad,
          precio: 0,
          descuento: 0,
          concepto: j.concepto,
          periodo: j.periodo,
        })),
        forma_pago: numeral(props.fpago).format("00"),
        metodo_pago: "PUE",
        uso_cfdi: "",
        observaciones: observaciones,
        fecha_pago: dayjs(props.fechaPago).format("DD/MM/YYYY"),
        folio_pv: props.foliopago,
      }));
    }
    
</script>

<style>
.my-mayus input {
  text-transform: uppercase;
}
</style>

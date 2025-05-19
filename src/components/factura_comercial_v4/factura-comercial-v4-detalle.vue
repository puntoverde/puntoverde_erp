<template>
  <div>
    <v-overlay v-model="loading" absolute color="secondary">
      <v-card dark color="secondary">
        <v-card-text>
          <h2 class="my-2 pt-2 text-center white--text">Recuperando informacion</h2>
          <v-progress-linear
            class="mb-0"
            indeterminate
            color="white"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-overlay>
    <v-card class="mt-2" color="blue-grey lighten-5" v-if="total > 0">
      <v-card-title class="py-1 text-h5 font-weight-medium">
        Factura
        <v-spacer></v-spacer>

        <!-- contiene las opciones para facturar si tiene un id de factura mostrara la opcion factura nomral 
         factura publico general y factura dividida o segmentada -->
        <template v-if="facturaId == 0">
          <v-menu
            v-model="menu_publico_general"
            offset-y
            :close-on-click="!loading_pgeneral"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="openPublicoGeneral"
                v-bind="attrs"
                color="primary"
                rounded
                dark
                class="mx-1"
              >
                <v-icon color="white"> mdi-earth </v-icon>
                <span class="ml-1"> PUBLICO GENERAL</span>
              </v-btn>
            </template>
            <v-card width="350">
              <v-toolbar color="secondary" height="5" elevation="0"></v-toolbar>
              <v-card-text class="text-h6">
                Facturar Pago con folio:
                <span class="font-weight-bold" v-text="folio_pv"></span>
                <v-combobox
                  class="my-mayus"
                  v-model="rs_pg"
                  :items="lst_razon_social_pg.map((i) => i.socio)"
                  filled
                  hide-details
                ></v-combobox>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  color="error"
                  @click="menu_publico_general = false"
                  :disabled="loading_pgeneral"
                >
                  Cancelar</v-btn
                >
                <v-btn
                  color="primary"
                  @click="facturaPublicoGeneral"
                  :loading="loading_pgeneral"
                >
                  Aceptar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
          <factura-normal
            :cargos_facturar="lst_cargos"
            @emit-factura-ok="EmitDatos"
          />
          <factura-segmentada :cargos_facturar="lst_cargos" :monto="10" />
          <factura-dividida :cargos_facturar="lst_cargos" />
        </template>
      </v-card-title>
      <v-simple-table>
        <template v-slot:default>
          <thead class="blue-greyx white lighten-5x">
            <tr>
              <th class="text-subtitle-2 font-weight-bold">RFC</th>
              <th class="text-subtitle-2 font-weight-bold">Razon social</th>
              <th class="text-subtitle-2 font-weight-bold">uso cfdi</th>
              <th class="text-subtitle-2 font-weight-bold">forma pago</th>
              <th class="text-subtitle-2 font-weight-bold">metodo pago</th>
              <th class="text-subtitle-2 font-weight-bold">uuid</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fact, ind) in lst_factura" :key="ind">
              <td>{{ fact.rfc }}</td>
              <td>{{ fact.razon_social }}</td>
              <td>{{ fact.uso_cfdi }}</td>
              <td>{{ fact.forma_pago }}</td>
              <td>{{ fact.metodo_pago }}</td>
              <td>{{ fact.uuid }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card class="mt-2">
      <v-divider></v-divider>
      <v-simple-table>
        <template>
          <thead class="primaryx secondary">
            <tr>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Clave
              </th>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Concepto
              </th>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Periodo
              </th>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Cantidad
              </th>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Subtotal
              </th>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Descuento
              </th>
              <th
                class="text-subtitle-1 font-weight-bold white--text text-center"
              >
                Total
              </th>
            </tr>
            <tr class="primary">
              <th colspan="7" style="height: 3px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cargo, index) in lst_cargos" :key="index">
              <td class="text-subtitle-1 text-center">
                {{ cargo.producto_servicio }}
              </td>
              <td class="text-subtitle-1 text-left">{{ cargo.concepto }}</td>
              <td class="text-subtitle-1 text-center">{{ cargo.periodo }}</td>
              <td class="text-subtitle-1 text-center">{{ cargo.cantidad }}</td>
              <td
                class="text-subtitle-1 text-right font-weight-bold number--text"
              >
                {{
                  numeral(cargo.total)
                    .multiply(cargo.cantidad)
                    .divide(1.16)
                    .format("$0,0.00")
                }}
              </td>
              <td class="text-subtitle-1 text-right font-weight-bold">
                {{ cargo.descuento }}
              </td>
              <td class="text-subtitle-1 text-right font-weight-bold">
                {{
                  numeral(cargo.total)
                    .multiply(cargo.cantidad)
                    .subtract(cargo.descuento)
                    .format("$0,0.00")
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script setup>
import {computed,ref,watch,getCurrentInstance, onMounted} from "vue";
import FacturaNormal from "./factura-comercial-v4-detalle-normal.vue";
import FacturaSegmentada from "./factura-comercial-v4-detalle-segmentado.vue";
import FacturaDividida from "./factura-comercial-v4-detalle-dividido.vue";
import numeral from "numeral";
import round from "lodash/round";
import {getCargosByPagosFacturarService,getFacturaService,createFacturaPublicoGeneralService,getNameSociosByAccionUseRazonSocialService} from '@/services/factura_service'

const props = defineProps({
  idPago: { type: Number, default: 0 },
  facturaId: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  cve_accion: { type: Number, default: 0 },
});
const emit = defineEmits(["emit-datos-factura"]);

const root = getCurrentInstance().proxy;
const $axios = root.$axiosFinanzas;
const stateFactura = root.$store.state.sFactura;

const folio_pv = computed(() => stateFactura.folio);

watch(
  () => props.idPago,
  (value, old) => {
    if (value) getCargosAndFactura();
  }
);

const loading = ref(false);

const loading_pgeneral = ref(false);

const menu_publico_general = ref(false);

const lst_cargos = ref([]);
const lst_factura = ref([]);

const lst_razon_social_pg = ref([]);

const rs_pg = ref("");


onMounted(()=>{getCargosAndFactura();})

async function getCargosAndFactura() {
  try {
  loading.value = true;
   await Promise.allSettled([fnGetCargos(),fnGetFactura()]);  
  } catch (error) {}
  finally{
    await new Promise(resolve=>setTimeout(resolve,1200))
    loading.value = false;
  }
}

async function fnGetCargos()
{
  try {
    lst_cargos.value=await getCargosByPagosFacturarService(props.idPago)
  } catch (error) {    
  }
}

async function fnGetFactura()
{
  try {
    lst_factura.value=await getFacturaService(props.idPago)
  } catch (error) {
    
  }
}

async function facturaPublicoGeneral() {
  console.log("razon social publico en general:", rs_pg.value);

  loading_pgeneral.value = true;

  const numero_accion = stateFactura.numero_accion;

  const movimientos = lst_cargos.value
    .filter((i) => i.total > 0)
    .map((i) => ({
      codProducto: i.producto_servicio,
      unidades: i.cantidad,
      importe: round(numeral(i.total).value(), 2),
      descuento: round(numeral(i.descuento).value(), 2),
    }));

  let observaciones = `folio de pago:${
    folio_pv.value
  } de la accion(${numero_accion}) | los cargos son: ${lst_cargos.value
    .filter((i) => i.total > 0)
    .map((i) => `${i.concepto} ${i.periodo}`)
    .join()}`;

  const dataSend = {
    accion: stateFactura.cve_accion,
    idpago: props.idPago,
    id_dato_factura: stateFactura.id_datos_facturacion,

    razonSocial: rs_pg.value,
    fecha_pago: stateFactura.fecha_pago,
    folio_pv: folio_pv.value,
    metodoPago: numeral(stateFactura.forma_pago).format("00"),
    movimientos,
    observaciones,
  };
  try {
    // const { data, status } = await $axios.post(`facturacion-v4/publico-general`,dataSend);
    const data=await createFacturaPublicoGeneralService(dataSend)

    
      //ejecuta de nuevo para tener los datos ya con la factura
      getCargosAndFactura();
      //data=response de api compac,1=es global (publico general),1=solo una factura
      emit("emit-datos-factura", data, 1, 1);
    
  } catch (e) {
  } finally {
    loading_pgeneral.value = false;
    menu_publico_general.value = false;
  }
}

function EmitDatos(payload) {
  //ejecuta de nuevo para tener los datos ya con la factura
  getCargosAndFactura();
  //payload=response de api compac,0=indica que no es global o sea no es publico en general,1=solo una factura
  emit("emit-datos-factura", payload, 0, 1);
}

async function openPublicoGeneral() {
  // const { data, status } = await $axios.get(`facturacion-v4/socios-pg/${props.cve_accion}`);
  const data=await getNameSociosByAccionUseRazonSocialService(props.cve_accion)
  lst_razon_social_pg.value = data;
  menu_publico_general.value = true;
}
</script>

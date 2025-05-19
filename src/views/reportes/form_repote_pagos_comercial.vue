<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
    scrollable
    @input="initFactura"
  >
    <v-dialog v-model="dialog_confirm" width="450">
      <v-card>
        <v-card-title>opciones</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                label="Metodo Pago"
                v-model="metodo_pago"
                class="mr-2"
                :items="['PUE', 'PPD']"
                hide-details
              ></v-select
            ></v-col>
            <v-col cols="12"
              ><v-select
                label="uso cfdi"
                v-model="uso_cfdi"
                :items="lst_uso_cfdi"
                item-value="clave"
                item-text="descripcion"
                hide-details
              ></v-select
            ></v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog_confirm = false">Cancelar</v-btn>
          <v-btn color="info" @click="saveFactura">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="error flex-column"
      style="z-index: 210"
    >
      <div>
        <div v-for="(value, name, index) in snackbatMensaje" :key="index">
          <b>{{ name }}:</b>
          <div v-for="(msj, ind) in value" :key="ind" class="pl-5">
            {{ msj }}
          </div>
        </div>
      </div>
    </v-snackbar>

    <v-overlay :value="overlay">
      <!-- <v-progress-circular indeterminate size="64"></v-progress-circular> -->
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

    <template v-slot:activator="{ on }">
      <v-btn v-on="on" depressed tile :value="false" dark small>
        <v-icon color="white">mdi-badge-account</v-icon> FACTURAR
      </v-btn>
    </template>

    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Datos de Facturacion </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>

        <template v-slot:extension>
          <v-tabs v-model="tab" centered fixed-tabs @change="clearTabs">
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab> Listado de Clientes </v-tab>
            <v-tab> Nuevo Cliente </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-card-text style="height: 560px">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-list subheaderxx three-line flat nav>
              <v-list-item-group v-model="factura">
                <v-list-item
                  v-for="datos_factura in lst_datos_facturacion"
                  :key="datos_factura.id_datos_facturacion"
                  :value="datos_factura"
                  class="mb-0xx"
                  :disabled="datos_factura.estatus == 2"
                  :class="{ 'error--text': datos_factura.estatus == 2 }"
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
                      <v-list-item-subtitle>
                        RSocial:{{
                          datos_factura.razon_social
                        }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle>{{
                        `Correo:${datos_factura.correo} `
                      }}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{
                        `Domicilio:${datos_factura.calle} # ${datos_factura.num_ext}, ${datos_factura.colonia} cp:${datos_factura.cp} ${datos_factura.municipio} ${datos_factura.estado}`
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <!-- <v-list-item-action>
                <v-btn icon outlined><v-icon>mdi-pencil</v-icon></v-btn>
                </v-list-item-action> -->
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="px-5">
              <v-card-text>
                <v-container>
                  <div class="d-flex justify-space-between">
                    <v-select
                      label="Pertenece ha"
                      class="mr-1"
                      v-model="cve_persona_factura"
                      hide-details
                      :items="lst_socios_accion"
                      item-value="cve_persona"
                      :item-text="
                        (i) =>
                          `${i.nombre} (${i.tipo == 1 ? 'usuario' : 'dueño'})`
                      "
                      @input="updateRazonsocial"
                      style="width: 50%"
                    >
                    </v-select>

                    <v-text-field
                      label="RFC"
                      v-model="rfc"
                      hide-details
                      class="my-mayus ml-1"
                      style="width: 30%"
                    ></v-text-field>
                  </div>

                  <v-text-field
                    label="Razon Social"
                    v-model="razon_social"
                    hide-details
                    class="my-mayus"
                  >
                  </v-text-field>

                  <v-divider></v-divider>

                  <v-text-field
                    label="Calle"
                    v-model="calle"
                    hide-details
                    class="my-mayus"
                  >
                  </v-text-field>

                  <div class="d-flex justify-space-between">
                    <v-text-field
                      label="Codigo Postal"
                      class="mr-2 my-mayus"
                      v-model="cp"
                      v-mask="'#####'"
                      hide-details
                    >
                    </v-text-field>

                    <v-text-field
                      label="num ext"
                      class="mr-2 my-mayus"
                      v-model="num_ext"
                      hide-details
                    >
                    </v-text-field>

                    <v-text-field
                      label="num int"
                      v-model="num_int"
                      hide-details
                      class="my-mayus"
                    >
                    </v-text-field>
                  </div>

                  <v-text-field
                    label="Colonia"
                    v-model="colonia"
                    hide-details
                    class="my-mayus"
                  >
                  </v-text-field>

                  <v-text-field
                    label="Municipio"
                    v-model="municipio"
                    hide-details
                    class="my-mayus"
                  >
                  </v-text-field>

                  <div class="d-flex justify-space-between">
                    <v-text-field
                      label="Estado"
                      class="mr-2 my-mayus"
                      v-model="estado"
                      hide-details
                    >
                    </v-text-field>

                    <v-text-field
                      label="Pais"
                      v-model="pais"
                      hide-details
                      class="my-mayus"
                    >
                    </v-text-field>
                  </div>

                  <v-text-field
                    label="Correo Electronico"
                    v-model="email"
                    hide-details
                  ></v-text-field>

                  <v-text-field
                    label="Forma Pago"
                    v-model="forma_pago"
                    hide-details
                    readonly
                  ></v-text-field>

                  <div class="d-flex justify-space-between">
                    <v-select
                      label="Metodo Pago"
                      v-model="metodo_pago"
                      class="mr-2"
                      :items="['PUE', 'PPD']"
                    ></v-select>
                    <v-select
                      label="uso cfdi"
                      v-model="uso_cfdi"
                      :items="lst_uso_cfdi"
                      item-value="clave"
                      item-text="descripcion"
                    ></v-select>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions class="primary">
        <v-spacer></v-spacer>
        <v-btn v-if="tab == 0 && factura" @click="editarDatos"
          ><v-icon>mdi-pencil</v-icon>Editar Datos</v-btn
        >
        <v-btn
          @click="confirmSaveFactura"
          v-if="tab == 0 && !isUndefined(factura)"
          >Facturar</v-btn
        >
        <v-btn @click="saveCreateDatosFactura" v-if="tab == 1"
          >Guardar y Facturar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineComponent, onMounted,getCurrentInstance } from "vue";
import { mask } from "vue-the-mask";
import isUndefined from "lodash/isUndefined";
import round from "lodash/round";
import debounce from "lodash/debounce";
import numeral from "numeral";
import dayjs from "dayjs";

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

const emit =defineEmits(['emit-facturado'])

  // directives: { mask },
  const root=getCurrentInstance().proxy
    const $axios = root.$axiosFinanzas;
    //#region variable
    const dialog = ref(false);
    const dialog_confirm = ref(false);
    const tab = ref(null);

    const lst_datos_facturacion = ref([]);

    let id_dato_factura = 0;
    const rfc = ref("");
    const razon_social = ref("");
    const curp = ref("");
    const calle = ref("");
    const cp = ref("");
    const num_ext = ref("");
    const num_int = ref("");
    const colonia = ref("");
    const municipio = ref("León de los Aldamas");
    const estado = ref("Guanajuato");
    const pais = ref("México");
    const email = ref("");
    const forma_pago = ref(props.fpago_text);
    const metodo_pago = ref("PUE");
    const uso_cfdi = ref("G03");
    const editable = ref(false);

    const lst_forma_pago = ref([]);
    const lst_uso_cfdi = ref([]);

    const factura = ref({});
    const lst_socios_accion = ref([]);
    const cve_persona_factura = ref("");

    const overlay = ref(false);
    const snackbar = ref(false);
    const snackbatMensaje = ref([]);

    const text_loading=ref('')

    //#endregion

    function initFactura() {
      getFormaPago();
      getUsoCfdi();
      getDatosFacturacion();
      getSociosAccion();
    }

    async function getDatosFacturacion() {
      let { data, status } = await $axios.get("pago/datos-factura", {
        params: { cve_accion: props.accion },
      });
      lst_datos_facturacion.value = data;
    }

    async function getSociosAccion() {
      let { data, status } = await $axios.get("pago/socios-accion", {
        params: { cve_accion: props.accion },
      });
      lst_socios_accion.value = data;
    }

    async function getFormaPago() {
      let { data, status } = await $axios.get("pago/forma-pago");
      lst_forma_pago.value = data;
    }

    async function getUsoCfdi() {
      let { data, status } = await $axios.get("pago/uso-cfdi");
      lst_uso_cfdi.value = data;
    }

    function confirmSaveFactura() {
      dialog_confirm.value = true;
    }

    const saveCreateDatosFactura = debounce(async () => {
      overlay.value = true;
      text_loading.value="Facturando Nuevo RFC"
      let cargos_map = props.cargos_facturar
        .filter((i) => i.total > 0)
        .map((i) => ({
          codigo_prod_serv: i.producto_servicio,
          unidades: i.cantidad,
          precio: round(numeral(i.total).value(), 2),
          descuento: round(numeral(i.descuento).value(), 2),
        }));

      let observaciones = `folio de pago:${props.foliopago} de la accion(${
        props.numero_accion
      }) | los cargos son: ${props.cargos_facturar
        .filter((i) => i.total > 0)
        .map((i) => `${i.concepto} ${i.periodo}`)
        .join()}`;

      let dataSend = {
        codigo_cliente: props.numero_accion,
        cve_persona: cve_persona_factura.value,
        rfc: rfc.value,
        razon_social: razon_social.value,
        correo: email.value,
        cp: cp.value,
        calle: calle.value,
        num_ext: num_ext.value,
        num_int: num_int.value,
        colonia: colonia.value,
        municipio: municipio.value,
        estado: estado.value,
        pais: pais.value,
        idpago: props.idpago,
        metodo_pago: metodo_pago.value,
        uso_cfdi: uso_cfdi.value,
        forma_pago: numeral(props.fpago).format("00"),
        cargos: cargos_map,
        observaciones: observaciones,
        fecha_pago: dayjs(props.fechaPago).format("DD/MM/YYYY"),
        folio_pv: props.foliopago,
      };

      try {
        if (id_dato_factura === 0) {
          let { data, status } = await $axios.post("pago", dataSend);
          if (status === 200) {
            emit("emit-facturado", data);
          }
        } else {
          let { data, status } = await $axios.put(
            `pago/${id_dato_factura}/update`,
            dataSend
          );
          if (status === 200) {
            emit("emit-facturado", data);
          }
        }
      } catch (err) {
        snackbar.value = true;
        snackbatMensaje.value = err.response.data;
      } finally {
        overlay.value = false;
        text_loading.value=""
      }
    }, 500);

    const saveFactura = debounce(async () => {
      dialog_confirm.value=false
       text_loading.value="Facturando..."
      overlay.value = true;
      let cargos_map = props.cargos_facturar
        .filter((i) => i.total > 0)
        .map((i) => ({
          codigo_prod_serv: i.producto_servicio,
          unidades: i.cantidad,
          precio: round(numeral(i.total).value(), 2),
          descuento: round(numeral(i.descuento).value(), 2),
        }));

      let observaciones = `folio de pago:${props.foliopago} de la accion(${
        props.numero_accion
      }) | los cargos son: ${props.cargos_facturar
        .filter((i) => i.total > 0)
        .map((i) => `${i.concepto} ${i.periodo}`)
        .join()}`;

      let dataSend = {
        id_datos_facturacion: factura.value.id_datos_facturacion,
        codigo_cliente: props.numero_accion,
        rfc: factura.value.rfc,
        razon_social: factura.value.razon_social,
        correo: factura.value.correo,
        cp: factura.value.cp,
        calle: factura.value.calle,
        num_ext: factura.value.num_ext,
        num_int: factura.value.num_int,
        colonia: factura.value.colonia,
        municipio: factura.value.municipio,
        estado: factura.value.estado,
        pais: factura.value.pais,
        idpago: props.idpago,
        metodo_pago: metodo_pago.value,
        uso_cfdi: uso_cfdi.value,
        forma_pago: numeral(props.fpago).format("00"),
        cargos: cargos_map,
        observaciones: observaciones,
        fecha_pago: dayjs(props.fechaPago).format("DD/MM/YYYY"),
        folio_pv: props.foliopago,
      };

      try {
        let { data, status } = await $axios.post("pago/cfactura", dataSend);
        if (status === 200) {
          emit("emit-facturado", data);
        }
      } catch (e) {
        snackbar.value = true;
        snackbatMensaje.value = e.response.data;

        setTimeout(() => {
          dialog.value = false;
        }, 5000);
      } finally {
        overlay.value = false;
      }
    }, 500);

    function updateRazonsocial(item) {
      razon_social.value = lst_socios_accion.value.find(
        (i) => i.cve_persona == item
      ).nombre;
    }

    function clearTabs(tabx) {
      if (tabx === 0) {
        factura.value = undefined;
      } else {
        id_dato_factura = 0;
        cve_persona_factura.value = 0;
        razon_social.value = "";
        rfc.value = "";
        calle.value = "";
        cp.value = "";
        num_ext.value = "";
        num_int.value = "";
        colonia.value = "";
        municipio.value = "León de los Aldama";
        estado.value = "Guanajuato";
        pais.value = "México";
        email.value = "";
      }
    }

    function editarDatos() {
      id_dato_factura = factura.value.id_datos_facturacion;
      cve_persona_factura.value = factura.value.cve_persona;
      rfc.value = factura.value.rfc;
      razon_social.value = factura.value.razon_social;
      curp.value = factura.value.curp;
      calle.value = factura.value.calle;
      cp.value = factura.value.cp;
      num_ext.value = factura.value.num_ext;
      num_int.value = factura.value.num_int;
      colonia.value = factura.value.colonia;
      municipio.value = factura.value.municipio;
      estado.value = factura.value.estado;
      pais.value = factura.value.pais;
      email.value = factura.value.correo;
      console.log(factura.value);
      tab.value = 1;
    }

    
</script>

<style>
.my-mayus input {
  text-transform: uppercase;
}
</style>

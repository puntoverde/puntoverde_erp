<template>
  <div>
    <input
      type="file"
      style="display: none"
      ref="inputFile"
      multiple
      @change="selectedFiles"
    />
    <v-card color="primary">
      <v-toolbar color="secondary" extension-height="110">
        <!-- <v-toolbar-title></v-toolbar-title> -->
        <label class="text-h5 white--text font-weight-bold"
          >Reporte Facturas XML ({{ title_importar }})</label
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="BuscarData"
          color="primary"
          style="background-color: white"
          class="font-weight-bold mr-2"
          rounded
          outlined
          :loading="load_search"
          ><v-icon class="mr-2">mdi-magnify</v-icon> Buscar</v-btn
        >

        <v-btn
          @click="openFile"
          color="primary"
          style="background-color: white"
          class="font-weight-bold mr-2"
          rounded
          outlined
          ><v-icon class="mr-2">mdi-file-upload-outline</v-icon> Subir
          XML</v-btn
        >

        <v-btn
          @click="downloadExcel"
          color="primary"
          style="background-color: white"
          class="font-weight-bold"
          rounded
          outlined
          :loading="load_excel"
          ><v-icon class="mr-2">mdi-microsoft-excel</v-icon> Generar
          Excel</v-btn
        >
        <template v-slot:extension>
          <v-row>
            <v-col>
              <v-text-field
                v-model="filter_rfc"
                label="RFC"
                solo-inverted
                dark
                dense
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="filter_razon_social"
                label="Razon Social"
                solo-inverted
                dark
                dense
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                :nudge-right="40"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dayjs(filter_fecha_incio).format('DD/MM/YYYY')"
                    label="Fecha Inicio"
                    solo-inverted
                    dark
                    dense
                    hide-details
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-on="on"
                    v-bind="attrs"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filter_fecha_incio"
                  locale="es-MX"
                  color="primary"
                  header-color="secondary"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col>
              <v-menu v-model="menu2" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dayjs(filter_fecha_final).format('DD/MM/YYYY')"
                    label="Fecha Fin"
                    solo-inverted
                    dark
                    dense
                    hide-details
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-on="on"
                    v-bind="attrs"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filter_fecha_final"
                  locale="es-MX"
                  color="primary"
                  header-color="secondary"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0">
              <v-tabs
                v-model="tab"
                color="primary"
                fixed-tabs
                darkx
                verticax
                @change="changeTitle"
              >
                <v-tabs-slider color="secondary"></v-tabs-slider>
                <v-tab class="text-h6">Recibidas</v-tab>
                <v-tab class="text-h6">Complemento</v-tab>
                <v-tab class="text-h6">Nomina</v-tab>
                <v-tab class="text-h6">Emitidas</v-tab>
              </v-tabs>
            </v-col>
          </v-row>
        </template>
      </v-toolbar>
      <div class="primary" style="height: 5px"></div>
      <!-- <v-tabs v-model="tab" color="red" fixed-tabs dark background-color="primary" vertical height="200" @change="changeTitle">
            <v-tab class="text-h6 ">Recibidas</v-tab>
            <v-tab class="text-h6 ">Complemento</v-tab>
            <v-tab class="text-h6 ">Nomina</v-tab>
            <v-tab class="text-h6 ">Emitidas</v-tab> 
           </v-tabs>-->

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card>
            <v-data-table :headers="headers" :items="lst_data_xml">
              <template v-slot:item.serie_folio="{ item }">
                <span class="font-weight-bold"
                  >{{ item.serie_comprobante
                  }}{{ item.folio_comprobante }}</span
                >
              </template>

              <template v-slot:item.total_comprobante="{ value }">
                <span class="font-weight-bold">
                  {{ numeral(value).format("$0,0.00") }}
                </span>
              </template>

              <template v-slot:item.show="{ item }">
                <v-btn color="primary" @click="getConceptosXML(item.file_name)">
                  mostrar
                </v-btn>
              </template>

              <template v-slot:item.erase="{ item }">
                <v-btn color="primary" @click="ElimnarFactura(item.file_name)">
                  eliminar
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-data-table :headers="headers" :items="lst_data_xml_complemento">
              <template v-slot:item.serie_folio="{ item }">
                <span class="font-weight-bold"
                  >{{ item.serie_comprobante
                  }}{{ item.folio_comprobante }}</span
                >
              </template>

              <template v-slot:item.total_comprobante="{ value }">
                <span class="font-weight-bold">
                  {{ numeral(value).format("$0,0.00") }}
                </span>
              </template>

              <template v-slot:item.show="{ item }">
                <v-btn
                  color="primary"
                  @click="getConceptosXMLComplemento(item.file_name)"
                >
                  mostrar
                </v-btn>
              </template>

               <template v-slot:item.erase="{ item }">
                <v-btn color="primary" @click="ElimnarFacturaComplemento(item.file_name)">
                  eliminar
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
           <v-card>
            <v-data-table :headers="headers2" :items="lst_data_xml_nomina">
              <template v-slot:item.serie_folio="{ item }">
                <span class="font-weight-bold"
                  >{{ item.serie_comprobante
                  }}{{ item.folio_comprobante }}</span
                >
              </template>

              <template v-slot:item.total_comprobante="{ value }">
                <span class="font-weight-bold">
                  {{ numeral(value).format("$0,0.00") }}
                </span>
              </template>

              <template v-slot:item.show="{ item }">
                <v-btn color="primary" @click="getDatosNominaExtraXML(item.file_name)">
                  mostrar
                </v-btn>
              </template>

               <template v-slot:item.erase="{ item }">
                <v-btn color="primary" @click="ElimnarFacturaNomina(item.file_name)">
                  eliminar
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
        <v-tab-item>
           <v-card>
            <v-data-table :headers="headers2" :items="lst_data_xml_emitidos">
              <template v-slot:item.serie_folio="{ item }">
                <span class="font-weight-bold"
                  >{{ item.serie_comprobante
                  }}{{ item.folio_comprobante }}</span
                >
              </template>

              <template v-slot:item.total_comprobante="{ value }">
                <span class="font-weight-bold">
                  {{ numeral(value).format("$0,0.00") }}
                </span>
              </template>

              <template v-slot:item.show="{ item }">
                <v-btn color="primary" @click="getEmitidoConceptosXML(item.file_name)">
                  mostrar
                </v-btn>
              </template>

               <template v-slot:item.erase="{ item }">
                <v-btn color="primary" @click="ElimnarFacturaEmitida(item.file_name)">
                  eliminar
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-dialog v-model="dialog" width="400" persistent>
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>{{ title_importar }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <div class="primary" style="height: 5px"></div>
        <v-card-text class="pt-5">
          se seleccionaron {{ num_files_selected }} xml para su importacion de
          los cuales {{ num_files_selected_valid }} son validos y seran los que
          se importen desea continuar en caso de si presionar aceptar en caso
          contrario cancelar...
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" color="error" outlined>cancelar</v-btn>
          <v-btn @click="saveXML" color="primary">aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_concepto" width="80%" >
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Conceptos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_concepto = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="primary" style="height: 5px"></div>
        <!-- <v-card-text class="pt-5"> -->
        <v-data-table :headers="headers_concepto" :items="lst_conceptos">
        </v-data-table>
        <!-- </v-card-text> -->
        <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog_concepto=false" color="error" outlined>cancelar</v-btn>
            <v-btn @click="saveXML" color="primary">aceptar</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_concepto_complemento" width="80%" >
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Conceptos Complemento</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_concepto_complemento = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="primary" style="height: 5px"></div>
        <!-- <v-card-text class="pt-5"> -->
        <v-data-table
          :headers="headers_concepto"
          :items="lst_conceptos_complemento"
        >
        </v-data-table>
        <!-- </v-card-text> -->
        <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog_concepto=false" color="error" outlined>cancelar</v-btn>
            <v-btn @click="saveXML" color="primary">aceptar</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_nomina" width="80%" >
      <v-card>
        <v-toolbar color="secondary" dark>
          <v-toolbar-title>Conceptos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_nomina = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>
        <div class="primary" style="height: 5px"></div>
        <!-- <v-card-text class="pt-5"> -->
        <v-data-table :headers="headers_nomina_extra" :items="lst_nomina_extra">
        </v-data-table>
        <!-- </v-card-text> -->
        <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog_concepto=false" color="error" outlined>cancelar</v-btn>
            <v-btn @click="saveXML" color="primary">aceptar</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <v-snackbar color="secondary" v-model="snackbar">
      <v-icon>mdi-alert-circle-outline</v-icon>
      Lo sentimos ningun archivo xml es valido...
    </v-snackbar>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import numeral from "numeral";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import {getDataXmlService,getDataXmlComplementoService,getConceptosXmlService,getConceptosComplementoXmlService,getEmitidoConceptosXmlService,getDatosNominaExtraXMLService,getDataNominaXMLService,getDataEmitidosXmlService,upFacturaRecibidaXmlService,upFacturaRecibidaComplementariaXmlService,upFacturaNominaXmlService,upFacturaEmitidaXmlService,downloadExcelNominaXmlService,downloadExcelFacturaXmlService,downloadExcelFacturaComplementoXmlService,downloadExcelFacturaEmitidaXmlService,ElimnarFacturaXmlService,ElimnarFacturaComplementoXmlService,ElimnarFacturaNominaXmlService,ElimnarFacturaEmitidaXmlService} from '@/services/reporte_sat_xml_service'
  
 

    const inputFile = ref(null);
    const headers = ref([
      { text: "Folio", value: "serie_folio", class: "secondary white--text" },
      {
        text: "Rfc emisor",
        value: "rfc_emisor",
        class: "secondary white--text",
      },
      {
        text: "Nombre emisor",
        value: "nombre_emisor",
        class: "secondary white--text",
      },     
      {
        text: "Uso cfdi receptor",
        value: "usocfdi_receptor",
        class: "secondary white--text",
      },
      {
        text: "Total",
        value: "total_comprobante",
        class: "secondary white--text",
      },
      {
        text: "Version",
        value: "version_comprobante",
        class: "secondary white--text",
      },
      { text: "uuid", value: "uuid_timbre", class: "secondary white--text" },
      { text: "Show", value: "show", class: "secondary white--text" },
      { text: "Eliminar", value: "erase", class: "secondary white--text" },
    ]);

    const headers2 = ref([
      { text: "Folio", value: "serie_folio", class: "secondary white--text" },
      {
        text: "Rfc receptor",
        value: "rfc_receptor",
        class: "secondary white--text",
      },
      {
        text: "Nombre receptor",
        value: "nombre_receptor",
        class: "secondary white--text",
      },    
      {
        text: "Uso cfdi receptor",
        value: "usocfdi_receptor",
        class: "secondary white--text",
      },
      {
        text: "Total",
        value: "total_comprobante",
        class: "secondary white--text",
      },
      {
        text: "Version",
        value: "version_comprobante",
        class: "secondary white--text",
      },
      { text: "uuid", value: "uuid_timbre", class: "secondary white--text" },
      { text: "Show", value: "show", class: "secondary white--text" },
      { text: "Eliminar", value: "erase", class: "secondary white--text" },
    ]);

    const dialog = ref(false);
    const dialog_concepto = ref(false);
    const dialog_concepto_complemento = ref(false);
    const dialog_nomina = ref(false);

    const headers_concepto = ref([
      { text: "Descripcion", value: "descripcion" },
      { text: "Cantidad", value: "cantidad" },
      { text: "Unidad", value: "unidad" },
      { text: "Precio Unitario", value: "valorunitario" },
      { text: "Importe", value: "importe" },
      { text: "Base impuesto", value: "base_impuestos" },
    ]);

    const headers_nomina_extra = ref([
      { text: "Tipo", value: "tipo" },
      { text: "Clave tipo", value: "clave_tipo" },
      { text: "Clave", value: "clave" },
      { text: "Concepto", value: "concepto" },
      { text: "Importe", value: "importe" },
    ]);

    const lst_conceptos = ref([]);
    const lst_conceptos_complemento = ref([]);

    const num_files_selected = ref(0);
    const num_files_selected_valid = ref(0);

    const lst_data_xml = ref([]);
    const lst_data_xml_nomina = ref([]);
    const lst_data_xml_emitidos = ref([]);

    const lst_data_xml_complemento = ref([]);

    const lst_nomina_extra=ref([])

    const tab = ref(null);

    const titles = ["Recibidas", "Complementarias", "Nomina", "Emitidas"];
    const title_importar = ref(titles[0]);

    const filter_rfc = ref();
    const filter_razon_social = ref();
    const filter_fecha_incio = ref(dayjs().format("YYYY-MM-DD"));
    const filter_fecha_final = ref(dayjs().format("YYYY-MM-DD"));

    const menu1 = ref(false);
    const menu2 = ref(false);

    const load_excel = ref(false);
    const load_search = ref(false);

    const snackbar = ref(false);

    onMounted(() => {});

    function BuscarData() {
      const filter_data = {};

      if (!isEmpty(filter_rfc.value) && filter_rfc.value.trim().length > 0)
        filter_data.rfc = filter_rfc.value;
      if (
        !isEmpty(filter_razon_social.value) &&
        filter_razon_social.value.trim().length > 0
      )
        filter_data.razonsocial = filter_razon_social.value;
      if (filter_fecha_incio.value.length > 0)
        filter_data.fecha_incio = filter_fecha_incio.value;
      if (filter_fecha_final.value.length > 0)
        filter_data.fecha_fin = filter_fecha_final.value;

      switch (tab.value) {
        case 0:
          getDataXml(filter_data);
          break;
        case 1:
          getDataXmlComplemento(filter_data);
          break;
        case 2:
          getDataNominaXml(filter_data);
          break;
        case 3:
          getDataEmitidosXml(filter_data)
          break;
      }
    }

    function downloadExcel() {
      const filter_data = {};

      if (!isEmpty(filter_rfc.value) && filter_rfc.value.trim().length > 0)
        filter_data.rfc = filter_rfc.value;
      if (
        !isEmpty(filter_razon_social.value) &&
        filter_razon_social.value.trim().length > 0
      )
        filter_data.razonsocial = filter_razon_social.value;
      if (filter_fecha_incio.value.length > 0)
        filter_data.fecha_incio = filter_fecha_incio.value;
      if (filter_fecha_final.value.length > 0)
        filter_data.fecha_fin = filter_fecha_final.value;

      switch (tab.value) {
        case 0:
          downloadExcelFactura(filter_data);
          break;
        case 1:
          downloadExcelFacturaComplemento(filter_data);
          break;
        case 2:
          downloadExcelNomina(filter_data);
          break;
        case 3:
          downloadExcelFacturaEmitida(filter_data);
          break;
      }
    }

    async function getDataXml(p) {
      load_search.value = true;
      try {
        // let { data, status } = await $axios.get("sat-xml", { params: p });
        const data=await getDataXmlService(p)
        console.log(data);
        lst_data_xml.value = data;
      } catch (e) {
      } finally {
        load_search.value = false;
      }
    }

    async function getDataXmlComplemento(p) {
      load_search.value = true;
      try {
        // let { data, status } = await $axios.get("sat-xml/complementos", {
        //   params: p,
        // });
        const data=await getDataXmlComplementoService(p)
        console.log(data);
        lst_data_xml_complemento.value = data;
      } catch (e) {
      } finally {
        load_search.value = false;
      }
    }

    async function getConceptosXML(uuid) {
      // let { data, status } = await $axios.get(`sat-xml/conceptos/${uuid}`);
      const data=await getConceptosXmlService(uuid)
      lst_conceptos.value = data;
      dialog_concepto.value = true;
    }

    async function getConceptosXMLComplemento(uuid) {
      // let { data, status } = await $axios.get(
      //   `sat-xml/conceptos/${uuid}/complementos`
      // );
      const data=await getConceptosComplementoXmlService(uuid)
      lst_conceptos_complemento.value = data;
      dialog_concepto_complemento.value = true;
    }

    async function getEmitidoConceptosXML(uuid) {
      // let { data, status } = await $axios.get(`sat-xml/emitido/conceptos/${uuid}`);
      const data=await getEmitidoConceptosXmlService(uuid)
      lst_conceptos.value = data;
      dialog_concepto.value = true;
    }

    async function getDatosNominaExtraXML(uuid) {
      // let { data, status } = await $axios.get(`sat-xml/nomina/extras/${uuid}`);
      const data=await getDatosNominaExtraXMLService(uuid)
      lst_nomina_extra.value = data;
      dialog_nomina.value = true;
    }


    async function getDataNominaXml(p) {
      load_search.value = true;
      try {
        // let { data, status } = await $axios.get("sat-xml/nomina", { params: p });
        const data=await getDataNominaXMLService(p)
        console.log(data);
        lst_data_xml_nomina.value = data;
      } catch (e) {
      } finally {
        load_search.value = false;
      }
    }

    async function getDataEmitidosXml(p) {
      load_search.value = true;
      try {
        // let { data, status } = await $axios.get("sat-xml/emitido", { params: p });
        const data=await getDataEmitidosXmlService(p)
        console.log(data);
        lst_data_xml_emitidos.value = data;
      } catch (e) {
      } finally {
        load_search.value = false;
      }
    }

    function openFile() {
      inputFile.value.click();
    }

    async function selectedFiles() {
      num_files_selected.value = inputFile.value.files.length;

      let formData = new FormData();
      for (const i of inputFile.value.files) {
        let flag_xml = await validXml(i, tab.value);
        if (flag_xml) formData.append(`filexml[]`, i);
      }

      num_files_selected_valid.value = formData.getAll("filexml[]").length;

      if (num_files_selected_valid.value > 0) dialog.value = true;
      else snackbar.value = true;
    }

    async function saveXML() {
      if (tab.value == 0) {
        console.log("factura");
        upFacturaRecibida();
      } else if (tab.value == 1) {
        console.log("complementaria");
        upFacturaRecibidaComplementaria();
      } else if (tab.value == 2) {
        console.log("nomina");
        upFacturaNomina();
      } else if (tab.value == 3) {
        console.log("emitida");
        upFacturaEmitida();
      }
    }

    async function validXml(fileXML, flag) {
      return new Promise((resolve, reject) => {
        try {
          let reader = new FileReader();
          reader.onload = (e) => {
            let readXml = e.target.result;
            let parser = new DOMParser();
            let doc = parser.parseFromString(readXml, "application/xml");

            let tipo_doc = doc
              .getElementsByTagName("cfdi:Comprobante")[0]
              .getAttribute("TipoDeComprobante");
            let emisor = doc
              .getElementsByTagName("cfdi:Emisor")[0]
              .getAttribute("Rfc");
            let receptor = doc
              .getElementsByTagName("cfdi:Receptor")[0]
              .getAttribute("Rfc");

            console.log("Emisor y Receptor:", emisor, receptor);

            if (flag == 0 && tipo_doc == "I" && receptor == "PVL810617EC3")
              resolve(true);
            else if (flag == 1 && tipo_doc == "P" && receptor == "PVL810617EC3")
              resolve(true);
            else if (flag == 2 && tipo_doc == "N" && emisor == "PVL810617EC3")
              resolve(true);
            else if (flag == 3 && tipo_doc == "I" && emisor == "PVL810617EC3")
              resolve(true);
            else resolve(false);

            //  if(tipo.includes(tipo_doc))
          };
          reader.readAsText(fileXML);
        } catch (error) {
          reject("error");
        }
      });
    }

    async function upFacturaRecibida() {
      try {
        let formData = new FormData();
        for (const i of inputFile.value.files) {
          let flag_xml = await validXml(i, 0);
          if (flag_xml) formData.append(`filexml[]`, i);
        }
        // let { data, status } = await $axios.post("sat-xml", formData, {headers: { "Content-Type": "multipart/form-data" }});
        const data=await upFacturaRecibidaXmlService(formData)
        if(data==1)dialog.value=false
      } 
      catch (error) {
        console.log(error);
      }
    }

    async function upFacturaRecibidaComplementaria() {
      try {
        let formData = new FormData();
        for (const i of inputFile.value.files) {
          let flag_xml = await validXml(i, 1);
          if (flag_xml) formData.append(`filexml[]`, i);
        }
        // let { data, status } = await $axios.post("sat-xml", formData, {headers: { "Content-Type": "multipart/form-data" }});
        const data=await upFacturaRecibidaComplementariaXmlService(formData)
        if(data==1)dialog.value=false
      } catch (error) {
        console.log(error);
      }
    }

    async function upFacturaNomina() {
      try {
        let formData = new FormData();
        for (const i of inputFile.value.files) {
          let flag_xml = await validXml(i, 2);
          if (flag_xml) formData.append(`filexml[]`, i);
        }
        // let { data, status } = await $axios.post("sat-xml/nomina", formData, {headers: { "Content-Type": "multipart/form-data" },});
        const data=await upFacturaNominaXmlService(formData)
        if(data==1)dialog.value=false
      } catch (error) {
        console.log(error);
      }
    }

    async function upFacturaEmitida() {
      try {
        let formData = new FormData();
        for (const i of inputFile.value.files) {
          let flag_xml = await validXml(i, 3);
          if (flag_xml) formData.append(`filexml[]`, i);
        }
        // let { data, status } = await $axios.post("sat-xml/emitido", formData, {headers: { "Content-Type": "multipart/form-data" },});
        const data=await upFacturaEmitidaXmlService(formData)
        if(data==1)dialog.value=false
      } catch (error) {
        console.log(error);
      }
    }

    async function downloadExcelNomina(p) {
      load_excel.value = true;
      try {
        // let { data, status } = await $axios.request({url: "sat-xml/nomina/excel",responseType: "arraybuffer",method: "get",params: p,headers: { "Content-Type": "blob" },});
        const data=await downloadExcelNominaXmlService(p)

        saveAs(
          new Blob([data], { type: "application/octet-stream" }),
          `reporte_factura_nomina_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`
        );
      } catch (e) {
      } finally {
        load_excel.value = false;
      }
    }

    async function downloadExcelFactura(p) {
      load_excel.value = true;
      try {
        // let { data, status } = await $axios.request({
        //   url: "sat-xml/excel",
        //   responseType: "arraybuffer",
        //   method: "get",
        //   params: p,
        //   headers: { "Content-Type": "blob" },
        // });

        const data=await downloadExcelFacturaXmlService(p)

        saveAs(
          new Blob([data], { type: "application/octet-stream" }),
          `reporte_factura_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`
        );
      } catch (e) {
      } finally {
        load_excel.value = false;
      }
    }

    async function downloadExcelFacturaComplemento(p) {
      load_excel.value = true;
      try {
        // let { data, status } = await $axios.request({
        //   url: "sat-xml/complementos/excel",
        //   responseType: "arraybuffer",
        //   method: "get",
        //   params: p,
        //   headers: { "Content-Type": "blob" },
        // });
        const data=await downloadExcelFacturaComplementoXmlService(p)

        saveAs(
          new Blob([data], { type: "application/octet-stream" }),
          `reporte_factura_complemento_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`
        );
      } catch (e) {
      } finally {
        load_excel.value = false;
      }
    }

    async function downloadExcelFacturaEmitida(p) {
      console.log("emitido excel");
      load_excel.value = true;
      try {
        // let { data, status } = await $axios.request({
        //   url: "sat-xml/emitido/excel",
        //   responseType: "arraybuffer",
        //   method: "get",
        //   params: p,
        //   headers: { "Content-Type": "blob" },
        // });

        const data =await downloadExcelFacturaEmitidaXmlService(p)

        saveAs(
          new Blob([data], { type: "application/octet-stream" }),
          `reporte_factura_emitida_${dayjs().format("YYYYMMDDHHmmss")}.xlsx`
        );
      } catch (e) {
      } finally {
        load_excel.value = false;
      }
    }

    function changeTitle(index) {
      title_importar.value = titles[index];
    }

    async function ElimnarFactura(file_name)
    {        
      try {
        // let { data, status } = await $axios.put(`sat-xml/recibida/${file_name}`);
        const data=await ElimnarFacturaXmlService(file_name)
        BuscarData()       
      } catch (e) {
      } finally {      
      }
    }

     async function ElimnarFacturaComplemento(file_name)
    {
       try {
        // let { data, status } = await $axios.put(`sat-xml/complemento/${file_name}`)
        const data=await ElimnarFacturaComplementoXmlService(file_name)
        BuscarData()       
      } catch (e) {
      } finally {      
      }
    }

     async function ElimnarFacturaNomina(file_name)
    {
       try {
        // let { data, status } = await $axios.put(`sat-xml/nomina/${file_name}`);
        const data=await ElimnarFacturaNominaXmlService(file_name)
        BuscarData()      
      } catch (e) {
      } finally {      
      }
    }

     async function ElimnarFacturaEmitida(file_name)
    {
       try {
        // let { data, status } = await $axios.put(`sat-xml/emitido/${file_name}`);
        const data=await ElimnarFacturaEmitidaXmlService(file_name)
        BuscarData()    
      } catch (e) {
      } finally {      
      }
    }
</script>

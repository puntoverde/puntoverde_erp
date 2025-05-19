<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-title>
          <v-icon>mdi-folder-account</v-icon>Portafolio Digital
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card tile>
      <v-toolbar color="primary" dark>
        <h2>Porta Folio Digital</h2>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" icon outlined small class="mr-2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-title></v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            lg="4"
            v-for="(doc, index) in lst_documentos"
            :key="doc.cve_documento"
            :ref="addInputFiles(index)"
          >
            <v-card elevation="10" color="#ebf0f3" class="pt-5">
              {{ doc.tipo.toLowerCase() }}
              <v-img
                :contain="doc.tipo != 'IMAGEN'"
                height="250"
                :src="getImageUrl(doc.tipo)"
              ></v-img>
              <v-card-title>
                <h2 class="accent--text">{{ doc.documento }}</h2>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <input
                  type="file"
                  style="display: none"
                  :id="`xfile-${index}`"
                  :data-documento="doc.cve_documento"
                  :data-index="index"
                  @change="cargarFile($event, doc)"
                  :accept="doc.mime"
                />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="success"
                      fab
                      small
                      :disabled="isNull(doc.cve_documento_socio)"
                      @click="downloadFile(doc.ruta, doc.mime)"
                      v-bind="attrs"
                      v-on="on"
                      class="mr-2"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  <span>Descargar Documento</span>
                </v-tooltip>

                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="warning"
                  fab
                  small
                  :disabled="isNull(doc.cve_documento_socio)"
                  v-bind="attrs" v-on="on"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
                </template>
                  <span>Mostrar Documento</span>
                </v-tooltip>-->

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="error"
                      fab
                      small
                      :disabled="isNull(doc.cve_documento_socio)"
                      @click="deleteDocumento(doc)"
                      v-bind="attrs"
                      v-on="on"
                      class="mr-2"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Eliminar Documento</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="info"
                      fab
                      small
                      :loading="doc.loading"
                      @click="openInputFile(index)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-file-upload</v-icon>
                    </v-btn>
                  </template>
                  <span>Adjuntar Documento</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import isNull from "lodash/isNull";
import { saveAs } from "file-saver";
import {documentosSocioService,cargarDocumentoSocioService,deleteDocumentosSocioService} from '@/services/socios_service'

const props = defineProps({
  cve_socio: { type: Number, default: 0 },
  cve_accion: { type: Number, default: 0 },
});

const dialog = ref(false);
const loading = ref(false);
const lst_documentos = ref([]);
const inputFiles = ref([]);

onMounted(() => {
  console.log("se creo");
});

watch(dialog, (val) => {
  if (val) getDocumentos();
});

async function getDocumentos() {
  // let { data } = await $axios.get(`socios/${props.cve_socio}/documentos`);
  const data=await documentosSocioService(props.cve_socio)
  data.forEach((i) => {
    i.loading = false;
    if (i.tipo == "IMAGEN") i.mime = "image/*";
    else if (i.tipo == "PDF") i.mime = "application/pdf";
    else if (i.tipo == "WORD")
      i.mime =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (i.tipo == "EXCEL")
      i.mime =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  });
  lst_documentos.value = data;
}

function addInputFiles(index) {
  console.log(document.getElementById(`xfile-${index}`));
  inputFiles.value[index] = document.getElementById(`xfile-${index}`);
}

function openInputFile(index) {
  console.log(document.getElementById(`xfile-${index}`));
  document.getElementById(`xfile-${index}`).click();
}

async function cargarFile(e, doc) {
  doc.loading = true;
  let element = e.target;

  try {
    if (Math.round(element.files[0].size / 1024) <= 4096 /*2048*/) {
      // let formData = new FormData();
      // formData.append("documento", element.files[0]);
      // let { data: file } = await $axios.post("socios/upload-file", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      // let { data } = await $axios.post(`socios/${props.cve_socio}/documento`, {
      //   cve_documento: element.dataset.documento,
      //   documento: file,
      //   cve_accion: props.cve_accion,
      // });
      
      const {data,documento:file}= await cargarDocumentoSocioService(props.cve_socio,props.cve_accion,element.dataset.documento,element.files[0])

      doc.cve_documento_socio = data;
      doc.ruta = file;
    } else {
      alert("El documento sobrepasa los 2mb de tamaño...");
    }
  } catch (e) {
  } finally {
    doc.loading = false;
  }
}

async function deleteDocumento(doc) {
  // let { status } = await $axios.delete(`socios/${props.cve_socio}/documento`, {
  //   params: { cve_documento: doc.cve_documento },
  // });
  const status=deleteDocumentosSocioService(props.cve_socio,doc.cve_documento)
  if (status === 204) {
    console.log("se da de baja...");
    doc.cve_documento_socio = null;
    doc.ruta = null;
  }
}

async function downloadFile(documento, mime) {

  // window.open(`${$axios.defaults.baseURL}/socios/${props.cve_socio}/documento-file?documento=${documento}`);
  window.open(`${import.meta.env.VITE_APP_RUTA_API}/socios/${props.cve_socio}/documento-file?documento=${documento}`);
}

function getImageUrl(name) {
  //return new URL(`./dir/${name}.png`, import.meta.url).href
  return new URL(`@/assets/${name.toLowerCase()}.svg`, import.meta.url).href;
}
</script>
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field clearable v-model="acciones" prepend-inner-icon="mdi-two-factor-authentication"
          label="Número de acción" @keypress.enter="buscar" />
      </v-col>
      <v-col>
        <v-select clearable v-model="clasificacion" prepend-inner-icon="mdi-book-variant" label="Clasificación"
          :items="clasificacion_array" item-value="id" item-text="nombre" />
      </v-col>
      <v-col>
        <v-select clearable v-model="tipo_accion" prepend-inner-icon="mdi-format-list-bulleted-type"
          label="Tipo de acción" :items="tipo_accion_array" item-value="id" item-text="nombre" />
      </v-col>
      <v-col>
        <v-select clearable v-model="estatus" prepend-inner-icon="mdi-album" label="Estatus"
          :items="[{ id: 1, nombre: 'Activo' }, { id: 3, nombre: 'Baja' }, { id: 2, nombre: 'Bloqueado' },]"
          item-value="id" item-text="nombre" />
      </v-col>
      <v-col> <v-btn @click="buscar" color="primary"> <v-icon> mdi-magnify</v-icon> Buscar</v-btn></v-col>
      <v-col> <v-btn @click="limpiar" color="error"> <v-icon> mdi-broom</v-icon> Limpiar</v-btn></v-col>
      <v-col> <v-btn @click="datosExportar" color="primary"> <v-icon> mdi-file-excel</v-icon> Exportar</v-btn></v-col>
    </v-row>
    <v-row wrap>
      <v-col v-for="item in acciones_array" :key="item.cve_accion">
        <v-card class="mx-auto border-estatus" max-width="344">
          <v-card-title class="d-flex justify-space-between">
            | Acción: {{ item.numero_accion }}{{ clasi(item.clasificacion) }}
            <v-icon large :color="colors[item.estatus - 1]"> mdi-traffic-light</v-icon>
          </v-card-title>
          <v-card-text> Tipo: {{ item.tipo_accion }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="detalle(item)" color="indigo" text>
              <v-icon> mdi-eye</v-icon> ver Detalle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-overlay :value="loader" z-index="1000">
          <v-progress-circular indeterminate size="64">
          </v-progress-circular>
        </v-overlay>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import {getTipoAccionService,findAccionByParameterService} from '@/services/acciones_service'


    const root = getCurrentInstance().proxy
    const acciones = ref("");
    const clasificacion = ref("");
    const tipo_accion = ref("");
    const estatus = ref("");
    const acciones_array = ref([]);
    const clasificacion_array = ref([
      { id: 1, nombre: "A" },
      { id: 2, nombre: "B" },
      { id: 3, nombre: "C" },
    ]);
    const tipo_accion_array = ref([]);
    const loader = ref(false);
    const colors = ref(["green", "amber", "red"]);


    onMounted(() => { tipos_accion() })

    async function tipos_accion() {
      // let { data } = await $axios.get("tipo-accion");
      tipo_accion_array.value = await getTipoAccionService();
    }

    async function buscar() {
      loader.value = true;
      try {
        // let { data } = await $axios.get("accionesx", {
        //   params: {
        //     numero_accion: acciones.value,
        //     clasificacion: clasificacion.value,
        //     tipo_accion: tipo_accion.value,
        //     estatus: estatus.value,
        //   },
        // });
        const data=await findAccionByParameterService(acciones.value,clasificacion.value,tipo_accion.value,estatus.value)
        acciones_array.value = data;
      } catch (error) {
        console.log(error)
      }
      finally { loader.value = false; }

    }

    function detalle(item) {
      console.log(item.cve_accion)
      root.$router.push({ name: "AccionDetalle", params: { cve_accion: item.cve_accion } });
    }

    function limpiar() {
      acciones.value = clasificacion.value = tipo_accion.value = estatus.value = "";
      acciones_array.value = [];
    }

    async function datosExportar() {
      // axios
      //   .get("/accionController.php", { params: { accion: 13 } })
      //   .then((res) => {
      //     let data = res.data;
      //     exportar(data);
      //   })
      //   .catch((err) => console.error(err));
      const data=await getAccionesExportarService()
      exportar(data)
    }

    function exportar(lista) {
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("acciones");
      let ws_data1 = lista.map((item) => [
        item.accion,
        item.tipo_accion,
        item.fecha_adquisicion,
        item.estatus_accion,
        item.dueno,
        item.telefono_dueno,
        item.celular_dueno,
        item.rfc_dueno,
        item.estatus_dueno,
        item.socio,
        item.fecha_nacimiento,
        item.sexo,
        item.estado_civil,
        item.nip,
        item.profesion,
        item.parentesco,
        item.domicilio,
        item.telefono_socio,
        item.celular_socios,
        item.correo_electronico,
        item.fecha_alta,
        item.estatus_socio,
      ]);

      let ws_data = _.concat(
        [
          [
            "Accion",
            "Tipo Accion",
            "Fecha Adquisicion",
            "Estatus Accion",
            "Dueño Accion",
            "Telefono Dueño",
            "Celular Dueño",
            "RFC Dueño",
            "Estatus Dueño",
            "Socio",
            "Fecha Nacimiento",
            "Genero",
            "Estado Civil",
            "Nip",
            "Profesion",
            "Parentesco",
            "Domicilio",
            "Telefono Socio",
            "Celular Socio",
            "Correo",
            "Fecha Alta",
            "Estatus Socio",
          ],
        ],
        ws_data1
      );

      console.log(ws_data);
      let ws = XLSX.utils.aoa_to_sheet(ws_data, { origin: "B2" });

      wb.Sheets["acciones"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
        "acciones.xlsx"
      );
    }

    
    function clasi(val) {
      let clasificacion = ["A", "B", "C"];
      return clasificacion[parseInt(val) - 1];
    }
</script>

<style scoped>
.border-activo {
  color: green;
  border-top: 2px solid;
}

.border-baja {
  color: red;
  border-top: 2px solid;
}

.border-bloqueado {
  color: #ffbf00;
  border-top: 2px solid;
}
</style>
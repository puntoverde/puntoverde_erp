<template>
  <v-dialog v-model="dialog">
    
    <template v-slot:activator>
          <v-tooltip bottom>
              <template v-slot:activator="{on,attrs}">
                     <v-btn v-on="on" v-bind="attrs" @click="dialog=true"><v-icon>mdi-account-plus</v-icon></v-btn>
              </template>
              <span>Agregar Dueño No Existente a Historico</span>
            </v-tooltip>
    </template>
     
    <v-card>
      <v-container>
        <v-row class="primary py-">
          <v-col lg="12">
            <h2 class="white--text">Registro de Dueño a historicos</h2>
            <!-- <v-chip
              class="ma-2"
              @click="Regresar"
              color="teal"
              text-color="white"
            >
              <v-avatar left>
                <v-icon>mdi-arrow-left</v-icon>
              </v-avatar>
              <span class="title">{{ cve_accion }}--{{ cve_dueno }}</span>
            </v-chip> -->
          </v-col>
          <v-col>{{ titulo }}</v-col>
        </v-row>
        <h3 class="accent--text">Datos Personales</h3>
        <v-row wrap>
          <v-col>
            <v-text-field
              label="Nombre"
              v-model="nombre"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="paterno"
              label="Apellido Paterno"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              uppercase
              v-model="materno"
              label="Apellido Materno"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <label class="accent--text">Genero</label>
            <v-radio-group v-model="genero" row class="mt-0">
              <v-radio label="Femenino" color="primary" :value="2"></v-radio>
              <v-radio label="Masculino" color="primary" :value="1"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="fecha_nac"
              label="Fecha de nacimiento"
              prepend-icon="mdi-calendar"
              v-mask="'####-##-##'"
            ></v-text-field>
          </v-col>

          <v-col>
            <v-select
              :items="lst_nacionalidad"
              item-value="cve_pais"
              item-text="nombre"
              v-model="cve_pais"
              label="Nacionalidad"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              uppercase
              v-model="curp"
              label="CURP"
              v-mask="'AAAA######XXXXXXXX'"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              uppercase
              v-model="rfc"
              label="RFC"
              v-mask="'AAAA######XXX'"
              class="my-mayus"
            ></v-text-field>
          </v-col>
        </v-row>

        <h3 class="accent--text">Datos Contacto y Domicilio</h3>

        <v-row>
          <v-col lg="3">
            <v-text-field
              v-model="fecha_adquisicion"
              label="Fecha de adquisición"
              prepend-icon="mdi-calendar"
              v-mask="'####-##-##'"
            ></v-text-field>
          </v-col>
          <v-col lg="3">
            <v-text-field
              v-mask="'###-###-####'"
              v-model="telefono"
              label="Teléfono"
            ></v-text-field>
          </v-col>
          <v-col lg="3">
            <v-text-field
              v-mask="'###-###-####'"
              v-model="celular"
              label="Celular"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col lg="5">
            <v-text-field
              v-model="calle"
              label="Calle"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="num_ext"
              maxlength="2"
              label="Número exterior"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="num_int"
              maxlength="2"
              label="Número interior"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-mask="'#####'"
              @keyup="Colonias"
              maxlength="5"
              v-model="cp"
              label="Código postal"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              :items="lst_colonias"
              return-object
              item-value="cve_colonia"
              item-text="nombre"
              v-model="colonia_seleccionada"
              v-on:input="changeColonia(`${colonia_seleccionada}`)"
              label="Colonias"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              :disabled="true"
              v-model="municipio"
              label="Municipio"
              class="my-mayus"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :disabled="true"
              v-model="estado"
              label="Estado"
              class="my-mayus"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="cve_dueno === 0 && cve_accion > 0" class="text-right">
            <v-btn color="success" @click="Guardar">
              <v-icon>mdi-content-save</v-icon> Guardar</v-btn
            >
          </v-col>
          <v-col v-else class="text-right">
            <v-btn color="info" @click="Modificar">
              <v-icon>mdi-pencil</v-icon> Modificar información</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-snackbar
              v-model="snackbar"
              :bottom="true"
              :multi-line="true"
              :color="color_mensaje"
            >
              {{ mensaje_alerta }}
              <v-icon color="white" @click="snackbar = false"
                >mdi-close-circle</v-icon
              >
            </v-snackbar>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watch,getCurrentInstance } from "vue";
import {getNacionalidadesService,getColoniasByCpService} from '@/services/domicilio_service'
import {getAccionistaByIdService,updateAccionistaService,createHistoricoAccionistaService} from '@/services/accionistas_service'

import isPlainObject from "lodash/isPlainObject";

  const props=defineProps({
    cve_accion: {
      type: Number,
      default: 0,
    },
    cve_dueno: {
      type: Number,
      default: 0,
    },
  })
  
    const root=getCurrentInstance().proxy

    const cve_accion_l = 0;
    const cve_dueno_l = 0;
    const nombre = ref("");
    const paterno = ref("");
    const materno = ref("");
    const genero = ref("");
    const fecha_nac = ref("");
    const cve_pais = ref(121);
    const curp = ref("");
    const rfc = ref("");
    const calle = ref("");
    const num_ext = ref("");
    const num_int = ref("");
    const cve_colonia = ref("");
    const celular = ref("");
    const telefono = ref("");
    const expediente = ref("");
    const estado_civil = ref("");
    const lst_nacionalidad = ref([]);
    const lst_colonias = ref([]);
    const cp = ref("");
    const detalle_accion = ref([]);
    const colonia_seleccionada = ref([]);
    const municipio = ref("");
    const estado = ref("");
    const mensaje_alerta = ref("");
    const snackbar = ref(false);
    const color_mensaje = ref("");
    const titulo = ref("");
    const fecha_adquisicion = ref("");

    const dialog=ref(false)

    onMounted(() => {
      if (props.cve_dueno > 0) CargarDueno();
      Nacionalidad();
    });

    async function Nacionalidad() {
      lst_nacionalidad.value = [];
      // let { data } = await $axios.get("domicilios/nacionalidades");
      const data=await getNacionalidadesService()
      lst_nacionalidad.value = data;
    }

    async function Colonias() {
      lst_colonias.value = [];
      if (cp.value.length >= 5) {
        // let { data } = await $axios.get("domicilios", {
        //   params: { cp: cp.value },
        // });
        const data=await getColoniasByCpService(cp.value)
        lst_colonias.value = data;
      }
    }

    function changeColonia() {
      cve_colonia.value = colonia_seleccionada.value.cve_colonia;
      municipio.value = colonia_seleccionada.value.municipio;
      estado.value = colonia_seleccionada.value.estado;
    }

    async function Guardar() {
      const dataSend = {
        nombre: nombre.value,
        apellido_paterno: paterno.value,
        apellido_materno: materno.value,
        sexo: genero.value,
        fecha_nacimiento: fecha_nac.value,
        cve_pais: cve_pais.value,
        curp: curp.value,
        rfc: rfc.value,
        estado_civil: estado_civil.value,
        calle: calle.value,
        numero_exterior: num_ext.value,
        numero_interior: num_int.value,
        cve_colonia: cve_colonia.value,
        celular: celular.value,
        telefono: telefono.value,
        expediente: expediente.value,
        cve_accion: props.cve_accion,
      };

      // let { data } = await $axios.post("accionistas/historico", dataSend);

      const data=await createHistoricoAccionistaService(dataSend)

      if (eval(data) > 0) {
        //detalle_accion.cve_dueno = data;
        mensaje_alerta.value = "Guardado correctamente";
        color_mensaje.value = "success";
        snackbar.value = true;
        setTimeout(
          () =>
            root.$router.push({
              name: "detalle",
              params: { accion: detalle_accion.value },
            }),
          2000
        );
      } else {
        mensaje_alerta.value =
          "Hubo un error, recarga el sitio he intenta de nuevo";
        color_mensaje.value = "error";
        snackbar.value = true;
      }
    }

    async function Modificar() {
      const dataSend = {
        nombre: nombre.value,
        apellido_paterno: paterno.value,
        apellido_materno: materno.value,
        sexo: genero.value,
        fecha_nacimiento: fecha_nac.value,
        cve_pais: cve_pais.value,
        curp: curp.value,
        rfc: rfc.value,
        estado_civil: estado_civil.value,
        calle: calle.value,
        numero_exterior: num_ext.value,
        numero_interior: num_int.value,
        cve_colonia: cve_colonia.value,
        celular: celular.value,
        telefono: telefono.value,
        expediente: expediente.value,
      };

      // let { data } = await $axios.put(
      //   `accionistas/${props.cve_dueno}`,
      //   dataSend
      // );
      const data=await updateAccionistaService(props.cve_dueno,dataSend)

      if (eval(data) == 1) {
        mensaje_alerta.value = "Modificado correctamente";
        color_mensaje.value = "info";
        snackbar.value = true;

        //detalle_accion.value.fecha_adquisicion= fecha_adquisicion.value;
        setTimeout(
          () =>
            root.$router.push({
              name: "detalle",
              params: { accion: detalle_accion.value },
            }),
          4000
        );
      } else {
        mensaje_alerta.value =
          "Hubo un error, recarga el sitio he intenta de nuevo";
        color_mensaje.value = "error";
        snackbar.value = true;
      }
    }

    function Limpiar() {
      //this.dueno.Limpiar_dueno();
      cp.value = "";
      lst_colonias.value = [];
    }

    function Regresar() {
      root.$router.replace({
        name: "AccionDetalle",
        params: { cve_accion: props.cve_accion },
      });
    }

    async function CargarDueno() {
      // let { data } = await $axios.get(`accionistas/${props.cve_dueno}`);
      const data=await getAccionistaByIdService(props.cve_dueno)

      if (isPlainObject(data)) {
        nombre.value = data.nombre;
        paterno.value = data.apellido_paterno;
        materno.value = data.apellido_materno;
        curp.value = data.curp;
        rfc.value = data.rfc;
        genero.value = data.sexo;
        fecha_nac.value = data.fecha_nacimiento;
        fecha_adquisicion.value = data.fecha_adquisicion;
        cve_pais.value = data.cve_pais;
        telefono.value = data.telefono;
        celular.value = data.celular;
        cp.value = data.cp;
        calle.value = data.calle;
        num_ext.value = data.numero_exterior;
        num_int.value = data.numero_interior;
        cve_colonia.value = data.cve_colonia;
        colonia_seleccionada.value.cve_colonia = data.cve_colonia;
        municipio.value = data.municipio;
        estado.value = data.estado;
        Colonias();
      } else {
        mostrar_modificar.value = false;
        mensaje_alerta.value =
          "Revisar la relación de los datos, contacta a soporte técnico";
        color_mensaje.value = "error";
        snackbar.value = true;
      }
    }
   
</script>
<template>
  <v-card>
    <v-toolbar color="secondaryx" elevation="0" class="pv-toolbar-socios">
      <v-toolbar-items
        ><v-btn @click="Regresar" color="secondaryx" elevation="0"
          ><v-icon>mdi-arrow-left-thick</v-icon>
        </v-btn></v-toolbar-items
      >
      <v-toolbar-title class="text-h4 ml-10 accent--text">
        accion: {{ accion_text }} </v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-select
        v-if="cve_socio === 0"
        clearable
        label="Posiciones disponibles"
        v-model="nueva_posicion"
        :items="lst_posicion"
        item-value="id"
        item-text="nombre"
        filled
        :hide-details="!iErrors.posicion"
        style="max-width: 250px"
        :error-messages="iErrors.posicion"
      ></v-select>
    </v-toolbar>
    <v-card-text>
      <h1 class="accent--text mb-2">Datos Personales</h1>
      <v-divider inset></v-divider>

      <v-row class="mt-5">
        <v-col lg="3">
          <v-text-field
            label="Nombre"
            v-model="nombre"
            class="my-mayus"
            filled
            :error-messages="iErrors.nombre"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Apellido Paterno"
            v-model="paterno"
            class="my-mayus"
            filled
            :error-messages="iErrors.apellido_paterno"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Apellido Materno"
            v-model="materno"
            class="my-mayus"
            filled
            :error-messages="iErrors.apellido_materno"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <label class="accent--text">Genero</label>
          <v-radio-group
            row
            v-model="genero"
            class="mt-0"
            :error-messages="iErrors.sexo"
          >
            <v-radio label="Masculino" color="primary" :value="1"></v-radio>
            <v-radio label="Femenino" color="primary" :value="2"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="fecha_nac"
            label="Fecha Nacimiento"
            prepend-inner-icon="mdi-calendar"
            v-mask="'####-##-##'"
            filled
            :error-messages="iErrors.fecha_nacimiento"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="curp"
            label="Curp"
            v-mask="'AAAA######XXXXXXXX'"
            class="my-mayus"
            filled
            :error-messages="iErrors.curp"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="rfc"
            label="RFC"
            v-mask="'AAAA######XXX'"
            class="my-mayus"
            filled
            :error-messages="iErrors.rfc"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-select
            :items="lst_nacionalidad"
            item-value="cve_pais"
            item-text="nombre"
            v-model="cve_pais"
            label="Nacionalidad"
            filled
            :error-messages="iErrors.cve_pais"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-select
            label="Estado Civil"
            v-model="estado_civil"
            :items="['Casado', 'Soltero', 'Divorciado']"
            filled
            :error-messages="iErrors.estado_civil"
          ></v-select>
        </v-col>

        <v-col lg="3">
          <v-checkbox
            color="primary"
            label="capacidad diferente"
            v-model="capacidad"
            :true-value="1"
            :false-value="0"
            :error-messages="iErrors.capacidad"
          ></v-checkbox>
        </v-col>
      </v-row>

      <h3 class="accent--text">Datos Contacto y Domicilio</h3>

      <v-row>
        <v-col lg="3">
          <v-text-field
            label="Celular"
            v-model="celular"
            prepend-inner-icon="mdi-cellphone-android"
            filled
            :error-messages="iErrors.celular"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Telefoo"
            v-model="telefono"
            prepend-inner-icon="mdi-phone"
            filled
            :error-messages="iErrors.telefono"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="calle"
            label="Calle"
            class="my-mayus"
            filled
            :error-messages="iErrors.calle"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="num_ext"
            maxlength="6"
            label="Número exterior"
            class="my-mayus"
            filled
            :error-messages="iErrors.numero_exterior"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="num_int"
            maxlength="6"
            label="Número interior"
            class="my-mayus"
            filled
            :error-messages="iErrors.numero_interior"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-mask="'#####'"
            @keyup="fnColonias"
            maxlength="5"
            v-model="cp"
            label="Código postal"
            filled
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-select
            label="Colonia"
            :items="lst_colonias"
            return-object
            item-value="cve_colonia"
            item-text="nombre"
            v-model="colonia_seleccionada"
            v-on:input="changeColonia"
            filled
            :error-messages="iErrors.cve_colonia"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Correo"
            v-model="correo"
            prepend-inner-icon="mdi-at"
            filled
            :error-messages="iErrors.correo"
          ></v-text-field>
        </v-col>
      </v-row>

      <h3 class="accent--text">Datos Complementarios</h3>

      <v-row>
        <v-col lg="3">
          <v-text-field
            label="Grado de Estudios"
            v-model="grado_estudio"
            class="my-mayus"
            filled
            :error-messages="iErrors.grado_estudio"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Institucion Academica"
            v-model="inst_escolar"
            class="my-mayus"
            filled
            :error-messages="iErrors.institucion_escolar"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-select
            label="Profesion"
            v-model="cve_profesion"
            :items="lst_profesion"
            item-value="cve_profesion"
            item-text="nombre"
            filled
            :error-messages="iErrors.cve_profesion"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Institucion Laboral"
            v-model="inst_laboral"
            class="my-mayus"
            filled
            :error-messages="iErrors.institucion_laboral"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Puesto ocupa"
            v-model="puesto_ejerce"
            class="my-mayus"
            filled
            :error-messages="iErrors.puesto_ejerce"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Experiencia"
            v-model="experiencia"
            class="my-mayus"
            filled
            :error-messages="iErrors.experiencia"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            label="Giro de Institucion Laboral"
            v-model="giro_inst"
            class="my-mayus"
            filled
            :error-messages="iErrors.giro_institucion"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-select
            label="Parentesco"
            v-model="cve_parentesco"
            :items="lst_parentesco"
            item-value="cve_parentesco"
            item-text="nombre"
            filled
            :error-messages="iErrors.cve_parentesco"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-select
            label="Estado de acción"
            v-model="estado_accion"
            :items="lst_estado_accion"
            item-value="id"
            item-text="accion"
            filled
            :error-messages="iErrors.estado_accion"
          ></v-select>
        </v-col>

        <v-col lg="3">
          <v-text-field
            v-model="fecha_alta"
            label="Fecha Alta Accion"
            prepend-inner-icon="mdi-calendar"
            v-mask="'####-##-##'"
            clearable
            filled
            :error-messages="iErrors.fecha_alta"
          ></v-text-field>
        </v-col>
        <v-col lg="3">
          <v-text-field
            v-model="fecha_ingreso_club"
            label="Fecha Ingreso al Club"
            prepend-inner-icon="mdi-calendar"
            v-mask="'####-##-##'"
            clearable
            filled
            :error-messages="iErrors.fecha_ingreso_club"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="secondary" outlined @click="Limpiar">
        <v-icon>mdi-close</v-icon> Limpiar</v-btn
      >

      <v-btn v-if="cve_socio === 0" color="primary" @click="fnGuardar">
        <v-icon>mdi-content-save</v-icon> Guardar</v-btn
      >

      <v-btn v-else color="info" @click="fnModificar"
        >Modificar información</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { onMounted, ref, inject, getCurrentInstance } from "vue";
import isPlainObject from "lodash/isPlainObject";
import { getSocioService } from "@/services/socios_service";
import { useSociosValidacion } from "@/composables/useSocioValidacion";
import {
  getPosicionesByAccionService,
  createSocioService,
  updateSocioService,
  getSocioByIdService
} from "@/services/socios_service";
import { getNacionalidadesService } from "@/services/domicilio_service";
import { getProfesioncoService } from "@/services/profesion_service";
import { getParentescoByTipoAccionService } from "@/services/parentesco_service";
import { getcolonias } from "@/services/proveedor_service";
import numeral from 'numeral'

const props = defineProps({
  cve_accion: {
    type: Number,
    default: 0,
  },
  cve_socio: {
    type: Number,
    default: 0,
  },
  accion_text: {
    type: String,
    default: "",
  },
});

const { iValid, iErrors, iClear } = useSociosValidacion();

const root = getCurrentInstance().proxy;

const nombre = ref("");
const paterno = ref("");
const materno = ref("");
const genero = ref(0);
const fecha_nac = ref("");
const cve_pais = ref(121);
const curp = ref("");
const rfc = ref("");
const estado_civil = ref("");
const calle = ref("");
const num_ext = ref("");
const num_int = ref("");
const cp = ref("");
const cve_colonia = ref(null);
const posicion = ref(null);
const celular = ref("");
const telefono = ref("");
const correo = ref("");
const grado_estudio = ref("");
const inst_escolar = ref("");
const inst_laboral = ref("");
const puesto_ejerce = ref("");
const experiencia = ref("");
const giro_inst = ref("");
const estado_accion = ref(null);
const fecha_alta = ref("");
const fecha_ingreso_club = ref("");
const cve_profesion = ref(null);
const cve_parentesco = ref(null);

const lst_posicion = ref([]);
const nueva_posicion = ref();
const lst_nacionalidad = ref([]);
const lst_colonias = ref([]);
const colonia_seleccionada = ref({});
const lst_profesion = ref([]);
const lst_parentesco = ref([]);
const lst_estado_accion = ref([
  { id: 1, accion: "Prestada" },
  { id: 2, accion: "Rentada" },
  { id: 3, accion: "Propia" },
]);

const capacidad = ref(0); //es incapacidad

let cve_persona = 0;
let cve_direccion = 0;

onMounted(async () => {
  await Promise.allSettled([
    fnNacionalidad(),
    fnGetProfesion(),
    fnGetParentesco(),
    fnPosicionesAccion(),
  ]);
  if (props.cve_socio > 0) CargarSocio();
});

async function fnNacionalidad() {
  try {
    lst_nacionalidad.value = [];  
    const data = await getNacionalidadesService();
    lst_nacionalidad.value = data;
  } catch (error) {}
}

async function fnGetProfesion() {
  try {   
    const data = await getProfesioncoService();
    lst_profesion.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function fnGetParentesco() {
  try {   
    const data = await getParentescoByTipoAccionService(props.cve_accion);
    lst_parentesco.value = data;
  } catch (e) {
    console.error(e);
  }
}

async function fnPosicionesAccion() { 
  const data = await getPosicionesByAccionService(props.cve_accion);

  console.log(
    "🚀 ~ file: FormSocio.vue:390 ~ fnPosicionesAccion ~ data:",
    data
  );

  if (Object.keys(data).length > 0) {
    posicionesDisponibles(data);
  } else {
    lst_posicion.value.push({ id: 0, nombre: "Posición: 0" });
  }
}

function posicionesDisponibles(data) {
  lst_posicion.value = [];
  let posiciones_accion = [];
  let posiciones_array = [];
  let valor_mayor = 0;

  data.forEach((item, index) => {
    posiciones_array.push(eval(item.posicion));
  });

  valor_mayor = Math.max.apply(null, posiciones_array);

  for (let i = 0; i < valor_mayor; i++) {
    posiciones_accion.push(0);
  }

  if (data.length > 0) {
    data.forEach((item, index) => {
      posiciones_accion[item.posicion] = 1;
    });
  }

  for (let i = 0; i < posiciones_accion.length; i++) {
    if (posiciones_accion[i] == 0) {
      lst_posicion.value.push({ id: i, nombre: `Posición: ${i}` });
    }

    if (i == posiciones_accion.length - 1) {
      lst_posicion.value.push({
        id: posiciones_accion.length,
        nombre: `Posición:  ${posiciones_accion.length}`,
      });
      break;
    }
  }
}

async function fnColonias() {
  lst_colonias.value = [];
  if (cp.value.length >= 5) {
    const data = await getcolonias(cp.value);
    lst_colonias.value = data;
  }
}

function Regresar() {
  root.$router.replace({
    name: "AccionDetalle",
    params: { cve_accion: props.cve_accion },
  });
}

function changeColonia(a) {
  cve_colonia.value = colonia_seleccionada.value.cve_colonia;
}

async function fnGuardar() {
  let data_send = {
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
    posicion: nueva_posicion.value,
    celular: celular.value,
    telefono: telefono.value,
    correo: correo.value,
    grado_estudio: grado_estudio.value,
    institucion_escolar: inst_escolar.value,
    institucion_laboral: inst_laboral.value,
    puesto_ejerce: puesto_ejerce.value,
    experiencia: experiencia.value,
    giro_institucion: giro_inst.value,
    estado_accion: estado_accion.value,
    fecha_alta: fecha_alta.value,
    fecha_ingreso_club: fecha_ingreso_club.value,
    cve_accion: props.cve_accion,
    cve_profesion: cve_profesion.value,
    cve_parentesco: cve_parentesco.value,
    capacidad: capacidad.value,
  };

  const data_valid = await iValid(data_send,props.cve_socio);

  // let {data}=await $axios.post('socios',data_valid)
  const data = await createSocioService(data_valid);

  if (data > 0) {
    root.$toast.success("Guardado correctamente");
    await new Promise(resolve=>setTimeout(resolve,2000))
      
    root.$router.replace({name: "AccionDetalle",params: { cve_accion: props.cve_socio }})

  } else {
    root.$toast.error("Hubo un error, recarga el sitio he intenta de nuevo");
  }
}

async function fnModificar() {
  let data_send = {
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
    correo: correo.value,
    grado_estudio: grado_estudio.value,
    institucion_escolar: inst_escolar.value,
    institucion_laboral: inst_laboral.value,
    puesto_ejerce: puesto_ejerce.value,
    experiencia: experiencia.value,
    giro_institucion: giro_inst.value,
    estado_accion: estado_accion.value,
    fecha_alta: fecha_alta.value,
    fecha_ingreso_club: fecha_ingreso_club.value,
    cve_profesion: cve_profesion.value,
    cve_parentesco: cve_parentesco.value,
    cve_persona: cve_persona,
    cve_direccion: cve_direccion,
    capacidad: capacidad.value,
  };

  const data_valid = await iValid(data_send,props.cve_accion);

  // let { data } = await $axios.put(`socios/${props.cve_socio}`, dataSend);
  const data=await updateSocioService(props.cve_socio,data_valid)

  if (eval(data) == 1) {
    root.$toast.info("Modificado correctamente");
    
    await new Promise(resolve=>setTimeout(resolve,3000))

    root.$router.replace({name: "AccionDetalle",params: { cve_accion: props.cve_accion }})

  } else {
    root.$toast.error("Hubo un error, recarga el sitio he intenta de nuevo");
  }
}

async function CargarSocio() {
  // let { data } = await $axios.get(`socios/${props.cve_socio}`);
  const data=await getSocioByIdService(props.cve_socio)

  console.log("🚀 ~ file: FormSocio.vue:642 ~ CargarSocio ~ data:", data);


  if (isPlainObject(data)) {
    cve_persona = data.cve_persona;
    cve_direccion = data.cve_direccion;

    nombre.value = data.nombre;
    paterno.value = data.apellido_paterno;
    materno.value = data.apellido_materno;
    genero.value = numeral(data.sexo).value()??0;
    fecha_nac.value = data.fecha_nacimiento;
    estado_civil.value = data.estado_civil;
    cve_pais.value = numeral(data.cve_pais).value()??0;
    curp.value = data.curp;
    rfc.value = data.rfc;
    cp.value = data.cp;
    calle.value = data.calle;
    num_ext.value = data.numero_exterior;
    num_int.value = data.numero_interior;
    cve_colonia.value = data.cve_colonia;
    colonia_seleccionada.value.cve_colonia = data.cve_colonia;
    inst_escolar.value = data.institucion_escolar;
    telefono.value = data.telefono;
    celular.value = data.celular;
    correo.value = data.correo_electronico;
    cve_profesion.value = numeral(data.cve_profesion).value()??0;
    cve_parentesco.value = numeral(data.cve_parentesco).value()??0;
    posicion.value = data.posicion;
    grado_estudio.value = data.grado_estudio;
    inst_escolar.value = data.institucion_escolar;
    inst_laboral.value = data.institucion_laboral;
    giro_inst.value = data.giro_institucion;
    puesto_ejerce.value = data.puesto_ejerce;
    experiencia.value = data.experiencia;
    estado_accion.value = numeral(data.estado_accion).value()??0;
    fecha_alta.value = data.fecha_alta;
    fecha_ingreso_club.value = data.fecha_ingreso_club;

    capacidad.value = parseInt(data.capacidad);

    fnColonias();
  } else {
    root.$toast.warning("Revisar la relación de los datos, contacta a soporte técnico");
  }
}

function Limpiar() {
  cp.value = "";
  lst_colonias.value = [];
  iClear();
}

</script>

<style>
.pv-toolbar-socios .v-toolbar__content {
  padding-left: 0 !important;
}
</style>
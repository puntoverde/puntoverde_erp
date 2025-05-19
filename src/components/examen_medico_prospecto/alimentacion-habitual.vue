<template>
  <v-stepper-content step="3">
    <v-card class="mb-12 pa-5 overflow-y-auto" color="grey lighten-3" height="600px">

      <v-row>
        <v-col>
          <v-textarea v-model="desayuno" label="Desayuno" filled rows="3" :error-messages="iError.desayuno"></v-textarea>
        </v-col>
        <v-col>
          <v-textarea v-model="comida" label="Comida" filled rows="3" :error-messages="iError.comida"></v-textarea>
        </v-col>
        <v-col>
          <v-textarea v-model="cena" label="Cena" filled rows="3" :error-messages="iError.cena"></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="peso" label="Peso" suffix="kg" filled :error-messages="iError.peso"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="estatura" label="Estatura" suffix="mts" filled
            :error-messages="iError.estatura"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="fc" label="FC" filled :error-messages="iError.fc"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="pa" label="PA(mmHg)" filled :error-messages="iError.pa"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="edad_ejercicio" label="Edad inicio practica ejercicio" filled
            :error-messages="iError.edad_ejercicio"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="deporte_inicia" label="Ejercicio o deporte inicial" filled
            :error-messages="iError.deporte_inicia"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="deporte_actual" label="Ejercicio o deporte actual" filled
            :error-messages="iError.deporte_actual"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="frecuencia" label="Frecuencia" filled :error-messages="iError.frecuencia"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="intesidad" label="Intensidad" filled :error-messages="iError.intesidad"></v-text-field>
        </v-col>
      </v-row>

    </v-card>


    <v-btn color="secondary mr-3" @click="back">
      <v-icon class="mr-1">mdi-arrow-left</v-icon>
      Anterior
    </v-btn>

    <v-btn color="primary" @click="next">
      Siguiente
      <v-icon class="ml-1">mdi-arrow-right</v-icon>
    </v-btn>


  </v-stepper-content>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { object, string } from 'yup';
import isEmpty from 'lodash/isEmpty'
import { getAlimentacionHabitual, saveAlimentacionHabitual, updateAlimentacionHabitual } from '@/services/examen_medico_service'

const props = defineProps({ edit: { type: Boolean, default: false }, id_examen: { type: Number | String, default: 0 } })
const emit = defineEmits(['emit-next', 'emit-back']);

const schema = object().shape({
  desayuno: string().required().uppercase().trim().label("Desayuno"),
  comida: string().required().uppercase().trim().label("Comida"),
  cena: string().required().uppercase().trim().label("Cena"),
  peso: string().required().uppercase().trim().label("Peso"),
  estatura: string().required().uppercase().trim().label("Estatura"),
  fc: string().required().uppercase().trim().label("Fc"),
  pa: string().required().uppercase().trim().label("Pa"),
  edad_ejercicio: string().required().uppercase().trim().label("Edad inicio practica ejercicio"),
  deporte_inicia: string().required().uppercase().trim().label("Ejercicio o deporte que inicio"),
  deporte_actual: string().required().uppercase().trim().label("Ejercicio o deporte actual"),
  frecuencia: string().required().uppercase().trim().label("Frecuencia"),
  intesidad: string().required().uppercase().trim().label("Intesidad"),
})

const iError = reactive(
  {
    desayuno: "",
    comida: "",
    cena: "",
    peso: "",
    estatura: "",
    fc: "",
    pa: "",
    edad_ejercicio: "",
    deporte_inicia: "",
    deporte_actual: "",
    frecuencia: "",
    intesidad: "",
  }
)

watch(() => props.edit, (val) => {
  if (val) {
    console.log("ejecuta la busqueda:", props.id_examen)
    fnGetAlimentacionHabitual()
  }
})

let id_alimentacion = 0
const desayuno = ref('')
const comida = ref('')
const cena = ref('')
const peso = ref()
const estatura = ref()
const fc = ref()
const pa = ref()
const edad_ejercicio = ref()
const deporte_inicia = ref()
const deporte_actual = ref()
const frecuencia = ref()
const intesidad = ref()



async function fnGetAlimentacionHabitual() {
  try {
    const data = await getAlimentacionHabitual(props.id_examen)
    if (!isEmpty(data)) {
      id_alimentacion = data.id_examen_medico_alimentacion
      desayuno.value = data.desayuno
      comida.value = data.comida
      cena.value = data.cena
      peso.value = data.peso
      estatura.value = data.estatura
      fc.value = data.fc
      pa.value = data.pa
      edad_ejercicio.value = data.edad_inicio
      deporte_inicia.value = data.deporte_inicia
      deporte_actual.value = data.deporte_actual
      frecuencia.value = data.frecuencia
      intesidad.value = data.instensidad
    }
  } catch (error) {

  }
}

function back() {
  emit('emit-back', 2)
}

async function next() {
  const dataSend = {
    id_examen_medico:props.id_examen,
    desayuno: desayuno.value,
    comida: comida.value,
    cena: cena.value,
    peso: peso.value,
    estatura: estatura.value,
    fc: fc.value,
    pa: pa.value,
    edad_ejercicio: edad_ejercicio.value,
    deporte_inicia: deporte_inicia.value,
    deporte_actual: deporte_actual.value,
    frecuencia: frecuencia.value,
    intesidad: intesidad.value,
  }
  try {
    Object.entries(iError).forEach(([key]) => iError[key] = '');
    const dataValid = await schema.validate(dataSend, { abortEarly: false })
    if (id_alimentacion == 0) {
      id_alimentacion = await saveAlimentacionHabitual(dataValid)
      if (id_alimentacion > 0) {
        emit('emit-next', 4)
      }
    }
    else {
      await updateAlimentacionHabitual(id_alimentacion, dataValid);
      emit('emit-next', 4)
    }

  } catch (error) {
    console.log(error);

    error.inner.forEach(({ path, message }) => iError[path] = message)

  }
}

</script>
<template>
  <div>
    <div class="d-flex justify-space-between">
      <v-breadcrumbs class="bread pl-0" :items="getBreadcrumb">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <h1 class="accent--text oswald--text">Examen Medico</h1>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small dark
            elevation="1" @click="dialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Agregar Cuota</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters">

      </Search>
    </div>

    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          Antecedentes Familiares
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 2" step="2">
          Historia Medica Personal
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 3" step="3">
          Alimentacion Habitual
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="step > 4" step="4">
          Exploracion Fisica
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="5">
          Finalizar
        </v-stepper-step>

      </v-stepper-header>

      <v-stepper-items>

        <antecedentes-familiares @emit-next="$event => step = $event" :edit="edit" :id_examen="id_examen_medico"></antecedentes-familiares>
        <historia-medica @emit-next="$event => step = $event" @emit-back="$event => step = $event" :edit="edit" :id_examen="id_examen_medico"></historia-medica>
        <alimentacion-habitual @emit-next="$event => step = $event" @emit-back="$event => step = $event" :edit="edit" :id_examen="id_examen_medico"></alimentacion-habitual>
        <exploracion-fisica @emit-next="$event => step = $event" @emit-back="$event => step = $event" :edit="edit" :id_examen="id_examen_medico"></exploracion-fisica>
        <finalizar-examen @emit-next="$event => step = $event" @emit-back="$event => step = $event" :edit="edit" :id_examen="id_examen_medico"></Finalizar>

      </v-stepper-items>

    </v-stepper>


    <v-dialog v-model="dialog" width="900" persistent>
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title>
            Generar examen medico
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <div class="d-flex" style="height:500px">

            <div class="redx fill-heightxx pr-2" style="min-height:100%;width: 50%;">
              <v-text-field v-model="nombre" outlined label="Nombre socio" @keyup.enter="fnAllPersonas"></v-text-field>
              <v-list>
                <v-list-item @click="fnFindPersonaById(persona.cve_persona)" v-for="persona in lst_personas" :key="persona.cve_persona">
                  <v-list-item-content>
                    <v-list-item-title>{{ persona.nombre }} {{ persona.apellido_paterno }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <v-divider vertical></v-divider>
            <div class=" d-flex flex-column bluex pl-2" style="min-height:100%;width: 50%;">
               <span class="text-h6">Persona:</span> 
               <span class="ml-10 text-subtitle-1">{{ nombre_text }}</span>
               <span class="text-h6">Accion:</span>
               <span class="ml-10 text-subtitle-1">{{ accion_text }}</span>
               <span v-if="id_examen_medico">Ya cuenta con examen medico</span>
               <span class="my-10"></span>

               <v-btn color="secondary" v-if="id_examen_medico" @click="fnCargarExamenMedico">
               Modificar examen medico
               </v-btn>

               <v-btn v-else color="primary" @click="fnCreateExamenMedico">
               Crear examen medico
               </v-btn>
              
               




            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>

import { ref } from 'vue'
import { allPersonasService, findPersonaByIdService ,createExamenMedicoService} from '@/services/examen_medico_service'

import AntecedentesFamiliares from '@/components/examen_medico_prospecto/antecedentes-familiares.vue'
import HistoriaMedica from '@/components/examen_medico_prospecto/historia-medica.vue'
import AlimentacionHabitual from '@/components/examen_medico_prospecto/alimentacion-habitual.vue'
import ExploracionFisica from '@/components/examen_medico_prospecto/exploracion-fisica.vue'
import Finalizar from '@/components/examen_medico_prospecto/finalizar-examen.vue'

const search = ref(); 

const filters = ref([
  { label: "Accion", key: "accion", value: "", type: "text" },
  { label: "Nombre", key: "nombre", value: "", type: "text" },
  { label: "Apellido paterno", key: "paterno", value: "", type: "text" },
  { label: "Apellido materno", key: "materno", value: "", type: "text" },
  { label: "Genero", key: "genero", value: "", type: "text" },
  { label: "Edad", key: "edad", value: "", type: "text" },
  { label: "Estado civil", key: "estado_civil", value: "", type: "select" },
  { label: "Curp", key: "curp", value: "", type: "text" },
  { label: "Rfc", key: "rfc", value: "", type: "text" },
  { label: "Parentesco", key: "parentesco", value: "", type: "select" },
]);

const getBreadcrumb = [
  {
    text: "Dashboard",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    text: "Link 1",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    text: "Link 2",
    disabled: true,
    href: "breadcrumbs_link_2",
  },
];

const dialog = ref(false)
const step = ref(1)
const edit =ref(false)

let id_persona=0;
const  id_examen_medico=ref(0);

const nombre = ref();

const nombre_text=ref('')
const accion_text=ref('')

const lst_personas = ref([])

async function fnAllPersonas() {

  try {
    const dataSend = { nombre: nombre.value }
    const data = await allPersonasService(dataSend)
    lst_personas.value = data
    console.log(data)
  }
  catch (e) { }

}

async function fnFindPersonaById(id)
{
  
  try {
    const dataSend = { nombre: nombre.value }
    const data = await findPersonaByIdService(id)
    id_persona=data.cve_persona
    id_examen_medico.value=data.id_examen_medico
    nombre_text.value=`${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`
    accion_text.value=data.accion
    console.log(data)
  }
  catch (e) { }
}


async function fnCreateExamenMedico() {
  try {
    const dataSend = { id_persona:id_persona,encargado:1 }
    const data = await createExamenMedicoService(dataSend)
    console.log(data)
  }
  catch (e) { }
}

function fnCargarExamenMedico()
{
  edit.value=true
}


</script>
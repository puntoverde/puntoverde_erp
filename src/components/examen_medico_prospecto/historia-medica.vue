<template>
  <v-stepper-content step="2">
    <v-card class="mb-12 d-flex" style="column-gap: 25px;" color="grey lighten-3 pa-5 overflow-y-auto" height="600px"
      elevation="0">

      <div>
        <v-item-group v-model="alergias">
          <div class="text-h5 mb-3">
            1.-Alergias
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

        <v-item-group v-model="asma" class="mt-6">
          <div class="text-h5 mb-3">
            2.-Asma, tos crónica, neumonía, tuberculosis
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>
 

        <v-item-group v-model="cardiaca" class="mt-6">
          <div class="text-h5 mb-3">
            3.-Enfermedad cardiaca, presión arterial elevada, soplo
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>
      

        <v-item-group v-model="torax" class="mt-6">
          <div class="text-h5 mb-3">
            4.-Dolor en el tórax,dificultad respiratoria
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>
      


        <v-item-group v-model="epilepsia" class="mt-6">
          <div class="text-h5 mb-3">
            5.-Epilepsia, pérdida del conocimiento,ansiedad
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>



        <v-item-group v-model="diabetes" class="mt-6">
          <div class="text-h5 mb-3">
            6.-Diabetes
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>


        <v-item-group v-model="cancer" class="mt-6">
          <div class="text-h5 mb-3">
            7.-Cancer
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

        <v-item-group v-model="ulcera" class="mt-6">
          <div class="text-h5 mb-3">
            8.-Úlcera, hernia hiatal, gastritis,trastorno digestivo
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

     

      </div>

      <div>


        <v-item-group v-model="riñon" class="mt-6">
          <div class="text-h5 mb-3">
            9.-Pérdida de un riñón u otro órgano
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

        <v-item-group v-model="perdida_peso" class="mt-6">
          <div class="text-h5 mb-3">
            10.-Pérdida inexplicable de peso
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>


        <v-item-group v-model="visuales" class="mt-6">
          <div class="text-h5 mb-3">
            11.-Problemas visuales
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>


        <v-item-group v-model="audicion" class="mt-6">
          <div class="text-h5 mb-3">
            12.-Problemas de audición
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

        <v-item-group v-model="reumaticos" class="mt-6">
          <div class="text-h5 mb-3">
            13.-Padecimientos reumáticos
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

        <v-item-group v-model="cirugias" class="mt-6">
          <div class="text-h5 mb-3">
            14.-Cirugías
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>


        <v-item-group v-model="menstruales">
          <div class="text-h5 mb-3">
            15.-Alteraciones menstruales
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>


        <v-item-group v-model="esguinses" class="mt-6">
          <div class="text-h5 mb-3">
            16.-Esguinces, fracturas, lesión muscular,luxación
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>




        </div>

<div>

   

        <v-item-group v-model="fuma" class="mt-6">
          <div class="text-h5 mb-3">
            17.-Fuma
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

        <v-item-group v-model="alcohol" class="mt-6">
          <div class="text-h5 mb-3">
            18.-Ingestion de alcohol
          </div>
          <div class="d-flex ml-5" style="gap:15px">
            <div v-for="n in 3" :key="n">
              <v-item v-slot="{ active, toggle }" :value="n">
                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark width="110" height="55"
                  @click="toggle">
                  <!-- <v-scroll-y-transition> -->
                  <div class="text-h4 flex-grow-1 text-center">
                    {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                  </div>
                  <!-- </v-scroll-y-transition> -->
                </v-card>
              </v-item>
            </div>
          </div>
        </v-item-group>

       
          <div class="text-h5 mb-3 mt-6">
            19.-Edad Primera Mestruacion
          </div>
          <div class="d-flex ml-5" style="gap:15px">
                <v-card color="info" @click="edad_mestruacion--" class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center">
                   -
                  </div>
                </v-card>

                <v-card color="white"  class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center black--text">
                   {{ edad_mestruacion }}
                  </div>
                </v-card>

                <v-card color="info" @click="edad_mestruacion++" class="d-flex align-center" dark width="110" height="55"
                 >
                  <div class="text-h4 flex-grow-1 text-center">
                   +
                  </div>
                </v-card>
          </div>

     
          <div class="text-h5 mb-3 mt-6">
            20.-Numero embarazos
          </div>
          <div class="d-flex ml-5" style="gap:15px">
                <v-card color="info" @click="numero_embarazo--" class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center">
                   -
                  </div>
                </v-card>

                <v-card color="white"  class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center black--text">
                   {{ numero_embarazo }}
                  </div>
                </v-card>

                <v-card color="info" @click="numero_embarazo++" class="d-flex align-center" dark width="110" height="55"
                 >
                  <div class="text-h4 flex-grow-1 text-center">
                   +
                  </div>
                </v-card>
          </div>

      
          <div class="text-h5 mb-3 mt-6">
            21.-Numero partos
          </div>
          <div class="d-flex ml-5" style="gap:15px">
                <v-card color="info" @click="numero_partos--" class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center">
                   -
                  </div>
                </v-card>

                <v-card color="white"  class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center black--text">
                   {{ numero_partos }}
                  </div>
                </v-card>

                <v-card color="info" @click="numero_partos++" class="d-flex align-center" dark width="110" height="55"
                 >
                  <div class="text-h4 flex-grow-1 text-center">
                   +
                  </div>
                </v-card>
          </div>
     

       
          <div class="text-h5 mb-3 mt-6">
            22.-Cesáreas
          </div>
          <div class="d-flex ml-5" style="gap:15px">
                <v-card color="info" @click="cesareas--" class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center">
                   -
                  </div>
                </v-card>

                <v-card color="white"  class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center black--text">
                   {{ cesareas }}
                  </div>
                </v-card>

                <v-card color="info" @click="cesareas++" class="d-flex align-center" dark width="110" height="55"
                 >
                  <div class="text-h4 flex-grow-1 text-center">
                   +
                  </div>
                </v-card>
          </div>

      
          <div class="text-h5 mb-3 mt-6">
            23.-Numero abortos
          </div>
          <div class="d-flex ml-5" style="gap:15px">
                <v-card color="info" @click="numero_abortos--" class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center">
                   -
                  </div>
                </v-card>

                <v-card color="white"  class="d-flex align-center" dark width="110" height="55"
                  >
                  <div class="text-h4 flex-grow-1 text-center black--text">
                   {{ numero_abortos }}
                  </div>
                </v-card>

                <v-card color="info" @click="numero_abortos++" class="d-flex align-center" dark width="110" height="55"
                 >
                  <div class="text-h4 flex-grow-1 text-center">
                   +
                  </div>
                </v-card>
          </div>
       

      </div>


    </v-card>



    <v-btn color="secondary mr-3" @click="back">
      <v-icon class="mr-1">mdi-arrow-left</v-icon>
      Anterior
    </v-btn>

    <v-btn color="primary" @click="next">
      Siguiente
      <v-icon class="ml-1">mdi-arrow-right</v-icon>
    </v-btn>

    <v-snackbar v-model="showError" type="warning">
           {{ errorMenssage }}
        </v-snackbar>


  </v-stepper-content>
</template>

<script setup>
import { ref,watch  } from 'vue'
import {object,number} from 'yup'
import {getHistoriaMedica,saveHistoriaMedica,updateHistoriaMedica} from '@/services/examen_medico_service'

const props=defineProps({edit:{type:Boolean,default:false},id_examen:{type:Number|String,default:0}})
const emit = defineEmits(['emit-next', 'emit-back']);

const schema = object().shape({
  alergias: number().required().oneOf([1, 2, 3]).label("Tos cronica"),
  asma: number().required().oneOf([1, 2, 3]).label("Asma"),
  
  cardiaca: number().required().oneOf([1, 2, 3]).label("Cardiaca"),
 
  torax: number().required().oneOf([1, 2, 3]).label("Torax"),

 
  epilepsia: number().required().oneOf([1, 2, 3]).label("Epilepsia"),
 
  diabetes: number().required().oneOf([1, 2, 3]).label("Diabetes"),
  cancer: number().required().oneOf([1, 2, 3]).label("Cancer"),
  ulcera: number().required().oneOf([1, 2, 3]).label("Ulcera"),
  
  riñon: number().required().oneOf([1, 2, 3]).label("Riñon"),
  perdida_peso: number().required().oneOf([1, 2, 3]).label("Perdida Peso"),
  visuales: number().required().oneOf([1, 2, 3]).label("Problemas visuales"),
  audicion: number().required().oneOf([1, 2, 3]).label("Problemas Audicion"),
  reumaticos: number().required().oneOf([1, 2, 3]).label("Dolores reumaticos"),
  cirugias: number().required().oneOf([1, 2, 3]).label("Cirugias"),

  menstruales: number().required().oneOf([1, 2, 3]).label("Alteraciones mestruales"),
  esguinses: number().required().oneOf([1, 2, 3]).label("Esguinses"),
 
  fuma: number().required().oneOf([1, 2, 3]).label("Fuma"),
  alcohol: number().required().oneOf([1, 2, 3]).label("Ingestion de alcohol"),
  edad_mestruacion: number().required().oneOf([1, 2, 3]).label("Edad primera mestruacion"),
})

watch(()=>props.edit,(val)=>{
    if(val){
        console.log("ejecuta la busqueda:",props.id_examen)
        fnGetHistoriaMedica()
    }
})

let id_historia_medica=0;

const alergias = ref()
const asma = ref()

const cardiaca = ref()

const torax = ref()

const epilepsia = ref()

const diabetes = ref()
const cancer = ref()
const ulcera = ref()

const riñon = ref()
const perdida_peso = ref()
const visuales = ref()
const audicion = ref()
const reumaticos = ref()
const cirugias = ref()

const menstruales = ref()
const esguinses = ref()

const fuma = ref()
const alcohol = ref()
const edad_mestruacion = ref(0)

const numero_embarazo = ref(0)
const numero_partos = ref(0)
const cesareas = ref(0)
const numero_abortos = ref(0)

const showError=ref(false);
const errorMenssage=ref('')

async function fnGetHistoriaMedica()
{
  try {   
     const data= await getHistoriaMedica(props.id_examen);
     if(data)
     {
      id_historia_medica=data.id_examen_medico_historia_medica
      alergias.value=parseInt(data.alergias);
      asma.value=parseInt(data.asma)
      cardiaca.value=parseInt(data.cardiaca)
      torax.value=parseInt(data.torax)
      epilepsia.value=parseInt(data.epilepsia)
      diabetes.value=parseInt(data.diabetes)
      cancer.value=parseInt(data.cancer)
      ulcera.value=parseInt(data.ulcera)
      riñon.value=parseInt(data.rinon)
      perdida_peso.value=parseInt(data.perdida_peso)
      visuales.value=parseInt(data.visual)
      audicion.value=parseInt(data.audicion)
      reumaticos.value=parseInt(data.reumaticos)
      cirugias.value=parseInt(data.cirugias)
      menstruales.value=parseInt(data.menstruales)
      esguinses.value=parseInt(data.esguince)
      fuma.value=parseInt(data.fuma)
      alcohol.value=parseInt(data.ingestion_alcohol)
      edad_mestruacion.value=data.primera_mestruacion
      numero_embarazo.value=data.n_embarazos
      numero_partos.value=data.n_partos
      cesareas.value=data.n_cesareas
      numero_abortos.value=data.n_abortos
     }    
  } catch (error) {
    
  }
}

function back() {
  emit('emit-back', 1)
}

async function next() {
const dataSend={
id_examen_medico:props.id_examen,
alergias:alergias.value,
asma:asma.value,
cardiaca:cardiaca.value,
torax:torax.value,
epilepsia:epilepsia.value,
diabetes:diabetes.value,
cancer:cancer.value,
ulcera:ulcera.value,
riñon:riñon.value,
perdida_peso:perdida_peso.value,
visuales:visuales.value,
audicion:audicion.value,
reumaticos:reumaticos.value,
cirugias:cirugias.value,
menstruales:menstruales.value,
esguinses:esguinses.value,
fuma:fuma.value,
alcohol:alcohol.value,
edad_mestruacion:edad_mestruacion.value,
numero_embarazo:numero_embarazo.value,
numero_partos:numero_partos.value,
cesareas:cesareas.value,
numero_abortos:numero_abortos.value,
}
    try {
        const dataValid=await schema.validate(dataSend)
        if(id_historia_medica==0)
        {
          id_historia_medica=await saveHistoriaMedica(dataValid);
          if(id_historia_medica) emit('emit-next', 3)
        }
        else{
          await updateHistoriaMedica(id_historia_medica,dataValid);
          emit('emit-next', 3)
        }
       
    } catch (error) {
        console.log(error);
        showError.value=true
        errorMenssage.value=error
    }
    

}


</script>
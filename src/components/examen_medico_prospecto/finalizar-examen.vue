<template>
    <v-stepper-content step="5">
        <v-card class="mb-12" style="column-gap: 25px;" color="grey lighten-3 pa-5 overflow-y-auto" height="600px"
            elevation="0">

          <v-row>
            <v-col>
                <v-textarea v-model="observacion" filled label="Observacion" :error-messages="iError.observacion"></v-textarea>
            </v-col>
            <v-col>
                <v-textarea v-model="factores_riesgo" filled label="Factores de riesgo Cardiovasculares" :error-messages="iError.factores_riesgo"></v-textarea>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
                <v-item-group class="mt-6" v-model="resultado">
                    <div class="text-h5 mb-3">
                        Resultado de inspeccion y prueba de ingreso <span v-if="iError.resultado" class="text-subtitle-1 red--text">Seleccione una opcion</span>
                    </div>
                    <div class="d-flex" style="gap:15px">
                        <div>
                            <v-item v-slot="{ active, toggle }" :value="1">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="200" height="70" @click="toggle">
                                    <div class="text-h5 flex-grow-1 text-center">
                                        Aprobado
                                    </div>
                                </v-card>
                            </v-item>
                        </div>
                        <div>
                            <v-item v-slot="{ active, toggle }" :value="2">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="200" height="70" @click="toggle">
                           
                                    <div class="text-h5 flex-grow-1 text-center">
                                       Aprobado con recomendaciones
                                    </div>
                                 
                                </v-card>
                            </v-item>
                        </div>
                        <div>
                            <v-item v-slot="{ active, toggle }" :value="3">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="200" height="70" @click="toggle">
                                    <div class="text-h5 flex-grow-1 text-center">
                                        No aprobado
                                    </div>
                                </v-card>
                            </v-item>
                        </div>
                    </div>
                </v-item-group>
            </v-col>
          </v-row>

          <v-row class="mb">
            <v-col cols="12" lg="6">
                <v-textarea v-model="motivo" filled label="motivo de no aprobar y recomendacion " :error-messages="iError.motivo"></v-textarea>
            </v-col>
          </v-row>


        </v-card>

        <v-btn color="secondary" @click="back" class="mr-2">
            <v-icon class="mr-1">mdi-arrow-left</v-icon>
            Anterior
        </v-btn>
        
        <v-btn color="warning" @click="terminar">
            <v-icon class="mr-1">mdi-clipboard-check-outline</v-icon>
            Terminar
        </v-btn>
    </v-stepper-content>
</template>

<script setup>
import {ref,reactive,watch } from 'vue'
import {object,string,number} from 'yup'
import isEmpty from 'lodash/isEmpty'
import {getExamenMedico,finalizarExamenMedico} from '@/services/examen_medico_service'

const props=defineProps({edit:{type:Boolean,default:false},id_examen:{type:Number|String,default:0}})
const emit = defineEmits(['emit-next','emit-back']);

const schema = object().shape({
    observacion: string().required().trim().uppercase().label("Observacion"),
    factores_riesgo: string().required().trim().uppercase().label("Factores de riesgo"),
    resultado: number().required().oneOf([1, 2, 3]).label("Resultado"),
    motivo: string().when('resultado',{is:3,then:(s)=>s.required(),otherwise:(s)=>s.notRequired()}).trim().uppercase().label("Motivo"),
 })

 const iError=reactive(
  {
    observacion:"",
    factores_riesgo:"",
    resultado:"",
    motivo:"",
}
)


watch(()=>props.edit,(val)=>{
    if(val){
        console.log("ejecuta la busqueda:",props.id_examen)
        fnGetExamenMedico()
    }
})

let id_examen_medico=0
const observacion=ref('')
const factores_riesgo=ref('')
const resultado=ref('')
const motivo=ref('');

async function fnGetExamenMedico()
{
    try {
        const data=await getExamenMedico(props.id_examen)
        if(isEmpty(data))
        {
            observacion.value=data.observacion
            factores_riesgo.value=data.factores_riesgo
            resultado.value=data.resultado
            motivo.value=data.motivo
        }
    } catch (error) {
        
    }
}

function back() {
  emit('emit-back', 4)
}

async function terminar()
{
    console.log("termina la solicitud")
    const dataSend={
        observacion:observacion.value,
        factores_riesgo:factores_riesgo.value,
        resultado:resultado.value,
        motivo:motivo.value,
   }
  try {
    console.log("termina la solicitud TRY")
    Object.entries(iError).forEach(([key])=>iError[key]='');
        const dataValid=await schema.validate(dataSend,{abortEarly:false})
        if(props.id_examen>0){
            id_examen_medico=await finalizarExamenMedico(props.id_examen,dataValid)
          if(id_examen_medico>0){
            emit('emit-next', 4)
          }
        }        
        
    } catch (error) {
        console.log("termina la solicitud CATCH")
        console.log(error);

        error.inner.forEach(({ path, message }) => iError[path] = message)
       
    }
}


</script>
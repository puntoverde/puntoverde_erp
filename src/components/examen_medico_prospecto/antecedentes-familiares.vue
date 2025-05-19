<template>
    <v-stepper-content step="1">
        <v-card class="mb-12 d-flex" style="column-gap: 50px;" color="grey lighten-3 pa-5 overflow-y-auto" height="600px"
            elevation="0">

            <div>
                <v-item-group v-model="cardiovascular">
                    <div class="text-h5 mb-3">
                    1.-Enfermedad cardiovascular antes de los 40 años
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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

                <v-item-group class="mt-6" v-model="presion">
                    <div class="text-h5 mb-3">
                        2.-Presion arterial elevada
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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

                <v-item-group class="mt-6" v-model="diabetes">
                    <div class="text-h5 mb-3">
                       3.-Diabetes mellitus
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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


                <v-item-group class="mt-6" v-model="cancer">
                    <div class="text-h5 mb-3">
                        4.-Cancer
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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
            <v-divider vertical></v-divider>
            <div>

                <v-item-group v-model="tuberculosis">
                    <div class="text-h5 mb-3">
                        5.-Tuberculosis
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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


                <v-item-group class="mt-6" v-model="neurologica">
                    <div class="text-h5 mb-3">
                        6.-Enfermedad neurologica o nerviosa
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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


                <v-item-group class="mt-6" v-model="asma">
                    <div class="text-h5 mb-3">
                        7.-Asma y/o alergias
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
                                    <div class="text-h4 flex-grow-1 text-center">
                                        {{ n == 1 ? 'SI' : n == 2 ? 'NO' : 'NA' }}
                                    </div>
                                </v-card>
                            </v-item>
                        </div>
                    </div>
                </v-item-group>

                <v-item-group class="mt-6" v-model="reumatica">
                    <div class="text-h5 mb-3">
                        8.-Enfermedad reumatica
                    </div>
                    <div class="d-flex ml-10" style="gap:15px">
                        <div v-for="n in 3" :key="n">
                            <v-item v-slot="{ active, toggle }" :value="n">
                                <v-card :color="active ? 'primary' : 'secondary'" class="d-flex align-center" dark
                                    width="110" height="55" @click="toggle">
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


        </v-card>

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
import {ref, watch} from 'vue'
import {object,number} from 'yup'
import debounce  from 'lodash/debounce'
import {getAntecedentesFamiliares,saveAntecedentesFamiliares,updateAntecedentesFamiliares} from '@/services/examen_medico_service'

const props=defineProps({edit:{type:Boolean,default:false},id_examen:{type:Number|String,default:0}})
const emit = defineEmits(['emit-next']);

const schema=object().shape({
    cardiovascular:number().required().oneOf([1,2,3]).label("Cardio vascular"),
    presion:number().required().oneOf([1,2,3]).label("Presion arterial"),
    diabetes:number().required().oneOf([1,2,3]).label("Diabetes mellitus"),
    cancer:number().required().oneOf([1,2,3]).label("Cancer"),
    tuberculosis:number().required().oneOf([1,2,3]).label("Tuberculosis"),
    neurologica:number().required().oneOf([1,2,3]).label("Neurologica o nerviosa"),
    asma:number().required().oneOf([1,2,3]).label("Asma y/o alergias"),
    reumatica:number().required().oneOf([1,2,3]).label("Reumatica"),
})

watch(()=>props.edit,(val)=>{
    if(val){
        console.log("ejecuta la busqueda:",props.id_examen)
        fnGetAntecedentesFamiliares()
    }
})

let id_datos_familiares=0;
const cardiovascular=ref();
const presion=ref()
const diabetes=ref()
const cancer=ref()
const tuberculosis=ref()
const neurologica=ref()
const asma=ref()
const reumatica=ref()

const showError=ref(false);
const errorMenssage=ref('')


async function fnGetAntecedentesFamiliares()
{
    try {
        const data=await getAntecedentesFamiliares(props.id_examen)
        id_datos_familiares=data.id_examen_medico_antecedentes
        cardiovascular.value=parseInt(data.cardio_vascular)
        presion.value=parseInt(data.presion)
        diabetes.value=parseInt(data.diabetes)
        cancer.value=parseInt(data.cancer)
        tuberculosis.value=parseInt(data.tuberculosis)
        neurologica.value=parseInt(data.neurologica)
        asma.value=parseInt(data.asma)
        reumatica.value=parseInt(data.reumatica)

        console.log(data)
    } catch (error) {
        
    }
}


const next=debounce(async ()=>{
console.log("nex")
const dataSend={
    id_examen_medico:props.id_examen,
    cardiovascular:cardiovascular.value,
    presion:presion.value,
    diabetes:diabetes.value,
    cancer:cancer.value,
    tuberculosis:tuberculosis.value,
    neurologica:neurologica.value,
    asma:asma.value,
    reumatica:reumatica.value,
}
    try {
        const dataValid=await schema.validate(dataSend);
        if(id_datos_familiares==0){
            id_datos_familiares=await saveAntecedentesFamiliares(dataValid);
            if(id_datos_familiares>0)emit('emit-next', 2);
        }
        else{
            const data=await updateAntecedentesFamiliares(id_datos_familiares,dataValid);
            if(data>0)emit('emit-next', 2);
        }
        
    } catch (error) {        
        showError.value=true
        errorMenssage.value=error
    }
    

},500)

</script>
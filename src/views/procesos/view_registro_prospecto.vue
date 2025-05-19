<template>
    <div class="d-flex justify-center align-center redx fill-height">

        <div v-if="flag" class="d-flex justify-center align-center redx fill-height" style="width: 100%;">
            <v-hover v-slot="{ hover }" open-delay="50">
                <v-card class="primary rounded-xl d-flex justify-center align-center" width="250" height="250"
                    :elevation="hover ? 16 : 2" :class="{ 'on-hover': hover }" @click="() => selectedOption(3)">
                    <span class="white--text text-h4 font-weight-bold">
                        familiar
                    </span>
                </v-card>
            </v-hover>

            <v-hover v-slot="{ hover }" open-delay="50">
                <v-card class="secondary rounded-xl d-flex justify-center align-center" width="250" height="250"
                    :elevation="hover ? 16 : 2" :class="{ 'on-hover': hover }" @click="() => selectedOption(2)">
                    <span class="white--text text-h4 font-weight-bold">Empresarial</span>
                </v-card>
            </v-hover>
        </div>

        <div v-else class="d-flex flex-column align-center">
            <h1 class="primary--text mb-5">
                <v-btn class="mr-3" icon color="secondary" outlined @click="returnOption">
                    <svg-icon type="mdi" :path="mdiArrowLeftTop" />
                </v-btn>Registro de Prospecto(<span class="secondary--text">{{ tipo == 3 ? 'Familiar' : 'Multiple'
                }}</span>)
            </h1>

            <v-form style="width: 550px;">

                <div class="d-flex align-center mb-8">
                    <v-text-field v-model="accion" @keyup.enter="buscarAccion" :loading="loading" placeholder="Accion"
                        v-mask="accionMask" hide-details class="text-h5 my-mayus" outlined solo style="max-width: 100px;">
                        <template v-slot:progress>
                            <v-progress-linear color="secondary" absolute indeterminate />
                        </template>
                    </v-text-field>
                    <div>
                        <div class="accent--text text-h5 font-weight-bold">{{ nombre_dueno }}</div>
                        <div class="accent--text text--accent text-subtitle-2 font-italic font-weight-thin">{{ tipo_accion
                        }}</div>
                    </div>
                </div>
                <v-text-field v-model="interesado" label="Interesado" class="my-mayus" :disabled="cve_accion == 0 || !(tipo == cve_tipo_accion)" :error-messages="iErrors.interesado">

                </v-text-field>
                <v-text-field v-model="email" label="Correo" class="my-minus"
                    :disabled="cve_accion == 0 || !(tipo == cve_tipo_accion)" :error-messages="iErrors.correo"></v-text-field>
                <template v-if="tipo == 3">
                    <span>espacios {{ cantidad }}</span>
                    <v-slider 
                    v-model="cantidad" 
                    :disabled="cve_accion == 0 || !(tipo == cve_tipo_accion)"
                    :max="6"
                    :min="2"            
                    step="1"
                    ticks="always" 
                    tick-size="5"
                    track-color="grey"
                    :error-messages="iErrors.cantidad_usuarios"></v-slider>
                </template>
                <v-btn @click="fnSaveSolicitud" :disabled="cve_accion == 0 || !(tipo == cve_tipo_accion)" color="primary" block>Registrar</v-btn>
            </v-form>
        </div>


        <v-dialog v-model="show" persistent width="500">
            <v-card>
                <v-toolbar elevation="0">
                    <v-icon class="mr-3">mdi-alert</v-icon>
                    <v-toolbar-title>
                        informacion
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text class="d-flex flex-column align-center">

                <h2>{{interesado}}</h2>
                <h3>{{email}}</h3>
                <v-sheet class="ma-5">
                  <h4>Folio: {{ folio_show }}</h4>
                  <h4>Clave: {{ clave_show }}</h4>
                </v-sheet>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" elevation="0" @click="()=>show=false">Cerrar</v-btn>
                    <v-btn color="info" elevation="0">Reenviar Correo</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { mdiArrowLeftTop } from '@mdi/js'
import throttle from 'lodash/throttle'
import { findAccion,saveSolicitud } from '@/services/registro_prospecto'
import { object, string, number } from 'yup'

const schema = object().shape({
    interesado: string().required().trim().uppercase().label("Nombre Interesado"),
    correo: string().required().email().trim().lowercase().label("Correo"),
    tipo: number().required().oneOf([2,3]).label("Tipo"),
    cantidad_usuarios: number().required().when('tipo',{is:3,then:sc=>sc.min(2),otherwise:sc=>sc.min(1)}).max(8).label("Cantidad"),
    cve_accion: number().required().label("Accion"),
    accion: string().required().trim().uppercase().label("Accion Nombre"),
})
const iErrors = reactive({
    interesado: '',
    correo: '',
    tipo: '',
    cantidad_usuarios: '',
    cve_accion: '',
    accion: ''
})

const flag = ref(true)
const loading = ref(false)

const tipo = ref(0)
const cve_accion = ref(0)

const accion = ref('')
const nombre_dueno = ref('---')
const tipo_accion = ref('NA')
const cve_tipo_accion = ref()

const accionMask = ref({
    mask: "#FFFF",
    tokens: {
        F: {
            pattern: /[0-9a-cA-C]/,
            transform(v) {
                return v.toLocaleUpperCase();
            },
        },
        "#": {
            pattern: /\d/,
        },
    },
});

const interesado = ref('')
const email = ref('')
const cantidad = ref(1)

const folio_show=ref('')
const clave_show=ref('')
const show=ref(false)


function selectedOption(t) {
    flag.value = false;
    tipo.value = t;
    if(t==2)cantidad.value=1
    else cantidad.value=2
}

function returnOption() {
    cve_accion.value = 0;
    flag.value = true
    tipo.value = 0;
    accion.value = '';
    nombre_dueno.value = '---'
    tipo_accion.value = 'NA'
    interesado.value=''
    email.value=''
    cantidad.value=1
}

const buscarAccion = throttle(async () => {
    loading.value = true;
    let numero_accion = accion.value;
    let clasificacion = 0;

    if (accion.value.indexOf("A") >= 0) {
        numero_accion = accion.value.substr(0, accion.value.indexOf("A"));
        clasificacion = 1;
    } else if (accion.value.indexOf("B") >= 0) {
        numero_accion = accion.value.substr(0, accion.value.indexOf("B"));
        clasificacion = 2;
    } else if (accion.value.indexOf("C") >= 0) {
        numero_accion = accion.value.substr(0, accion.value.indexOf("C"));
        clasificacion = 3;
    }

    try {
        const data = await findAccion(numero_accion, clasificacion)
        cve_accion.value = data.cve_accion
        cve_tipo_accion.value = data.cve_tipo_accion
        nombre_dueno.value = data.dueno
        tipo_accion.value = data.tipo
    } catch (error) {
        console.log(error)
    }
    finally {
        loading.value = false
    }


}, 200)

async function fnSaveSolicitud() {
    Object.entries(iErrors).forEach(([key]) => iErrors[key] = '');
    try {
        const dataSend = {
            interesado: interesado.value,
            correo: email.value,
            tipo: tipo.value,
            cantidad_usuarios: cantidad.value,
            cve_accion: cve_accion.value,
            accion: accion.value
        }
       const dataValid= await schema.validate(dataSend, { abortEarly: false })
       const data=await saveSolicitud(dataValid)
       folio_show.value=data.folio
       clave_show.value=data.clave
       show.value=true

    } catch (error) {
        console.log(error)
        if (error.name === "ValidationError") { error.inner.forEach(({ path, message }) => iErrors[path] = message) }
    }
}

</script>

<style scoped>
.d-flex {
    column-gap: 50px;
}
</style>
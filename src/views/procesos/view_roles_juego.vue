<template>
    <div class="white rounded-lg px-2 py-3" style="height: 100%;">
        <h1 class="text-h4 accent--text font-weight-bold mb-1">Roles de juego</h1>
        <v-toolbar rounded="lg" elevation="1" color="grey lighten-4">
            <div>
                <span class="text-h5 bluex">Torneo:</span>
                <v-menu v-model="menu_torneo">
                    <template v-slot:activator="{ on, attrs }">
                        <span class="text-decoration-underline redx" @click="fnOpenMenuTorneo" v-bind="attrs">
                            {{ Boolean(cTorneoName) ? cTorneoName : 'Seleccione un torneo' }}
                        </span>
                    </template>
                    <v-card>
                        <v-list>
                            <v-list-item v-for="torneo_ in lst_torneos"
                                @click="fnSelectedTorneo(torneo_.id_torneo_futbol)">
                                <v-list-item-content>
                                    <v-list-item-title>{{ torneo_.nombre }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>
                equipos:
                {{ lst_equipos.length }}
            </div>
            <v-spacer></v-spacer>
            <v-btn @click="fnCreateFixture">Guardar</v-btn>
        </v-toolbar>

        <div class="greyx d-flex justify-space-around flex-wrap pa-5" style="height: calc(100% - 100px); overflow-y: auto; column-gap: 30px; row-gap: 30px;" >

            <div v-for="(jornada_,index_jornada) in jornadas_fixture" style=" width: 400px; row-gap: 30px;" class="d-flex flex-column align-center white elevation-1x rounded-xl pt-8 greyx lighten-4x" >
                <div class="secondary white--text py-1 rounded text-center text-h6" style="width: 100%;">jornada {{ index_jornada + 1 }}</div>
                <div v-for="partidos_ in jornada_">
                <div class="d-flex justify-center greyx" style="width: 100%; border-bottom: 2px solid #14bf98;">
                    <div style="width: 185px; column-gap: 5px;" class="d-flex">
                        
                        <img src="@/assets/image/city.png" width="30"></img>{{ partidos_.local }}
                        <!-- <v-avatar color="white" size="30"> -->
                            <!-- {{ partidos_.local?.id_equipo_futbol }} -->
                        <!-- </v-avatar> -->
                        <span class="d-inline-block text-truncate">
                            {{ partidos_.local_nombre }}
                        </span>
                    </div>
                    <div style="width: 30px; color: white;border-top-left-radius: 5px;border-top-right-radius: 5px;" class="primary text-center">vs</div>
                    <div  style="width: 185px; column-gap: 5px;" class="d-flex justify-end">
                        <span class="d-inline-block text-truncate">
                             {{ partidos_.visita_nombre }}
                        </span>
                        
                        <!-- <v-avatar color="white" size="30" >                            
                            {{ partidos_.visita?.id_equipo_futbol }}
                        </v-avatar> -->
                        {{ partidos_.visita }}
                        <img src="@/assets/image/unite.png" width="30"></img>
                    </div>
                </div>
                <div class="text-subtitle-2 accent--text text-center" v-if="Boolean(partidos_?.cve_torneo_futbol_fixture)">
                    <v-btn text color="info" @click="fnOpenAddFecha(partidos_)"><v-icon class="mr-1" >mdi-calendar</v-icon> 
                        <span class="text-decoration-underline">
                            {{ Boolean(partidos_?.fecha)?dayjs(partidos_?.fecha).format('DD MMM YYYY HH:mm'):'Sin fecha' }}
                        </span>
                    </v-btn>
                    </div>
                </div>
            </div>


        </div>
<!-- {{ jornadas_fixture }} -->


<v-dialog v-model="dialog_fecha" width="580" content-class="rounded-xl" persistent>
<v-card rounded="xl">
    <v-toolbar class="toolbar-fecha" elevation="0">
        <v-toolbar-items color="">
            <v-btn @click="fnAddFecha" :disabled="!(Boolean(fecha_) && Boolean(hora_))">
                <v-icon>mdi-check</v-icon>
            </v-btn>
        </v-toolbar-items>
        <!-- <v-spacer></v-spacer> -->
        <v-toolbar-title class="pl-10 text-h4 accent--text">
             {{ Boolean(fecha_)?dayjs(fecha_).format("DD MMM YYYY"):'fecha' }} {{ Boolean(hora_)?hora_:'hora' }} 
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="fnCloseDialogFecha"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-divider></v-divider>
<v-date-picker v-model="fecha_" :min="dayjs().format('YYYY-MM-DD')" landscape locale="es-mx" no-title class="rounded-xl"></v-date-picker>
<v-time-picker v-model="hora_" no-title class="rounded-xl" flat format="24hr" ref="hora_ref" @click:minute="fnMinutesReturnHours"></v-time-picker>
<v-card-actions>
    <div class="redx text-center accent--text font-weight-bold" style="width: 100%;">
        {{ texto_partido }}
    </div>
</v-card-actions>
</v-card>
</v-dialog>
        

    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { getTorneosService, getEquiposByTorneosService,getFixtureService,setCreateFixtureService ,addFechaService} from '@/services/roles_juego_service'
import dayjs from 'dayjs'

const lst_torneos = ref([])
const lst_equipos = ref([])
const menu_torneo = ref(false)
const torneo_selected = ref()

const partido_selected=ref()

const jornadas_fixture=ref([])


const dialog_fecha =ref(false)
const fecha_=ref()
const hora_=ref()
const hora_ref=ref(null)
const texto_partido=ref()


const cTorneoName = computed(() => lst_torneos.value.find(i => i.id_torneo_futbol == torneo_selected.value)?.nombre)


function fnOpenMenuTorneo() {
    menu_torneo.value = true
}

async function fnGetTorneos() {

    try {
        lst_torneos.value = await getTorneosService();
    } catch (error) {

    }



}

async function fnSelectedTorneo(id_torneo_) {

    // jornadas_fixture.value=[]

    torneo_selected.value = id_torneo_

    const data=await getFixtureService(id_torneo_)

    if(data.length>0)
{

    const result = Object.groupBy(data, ({ jornada }) =>jornada);


    console.log("🚀 ~ fnSelectedTorneo ~ result:", result);

    const result_array=Object.values(result);

    console.log("🚀 ~ fnSelectedTorneo ~ result_array:", result_array);

    jornadas_fixture.value=result_array


}
else{
    lst_equipos.value = await getEquiposByTorneosService(id_torneo_)

    fnBuildFixture(lst_equipos.value.map(i=>i))

}




}



function fnBuildFixture(equipos_) {

    console.log('equipos_:--->', equipos_)

    // const equipos = 17;
    const equipos = equipos_.length;
    const par = Boolean(equipos % 2); //si es par el falso y impar es true  18 equipos es falso , 17 equipos es true
    const jornadas = par ? equipos : equipos - 1;//impar misma cantidad de jornadas que equipos y si es par es menos una jornada
    const partido_jornada = par ? ((equipos - 1) / 2) : equipos / 2;
    const total_partidos = jornadas * partido_jornada;
    const equipo_array = equipos_
    equipo_array.reverse();

    jornadas_fixture.value=[]

    //estos son pares se queda fijo el 1 que es la posicion 0
    if (!par) {

        //se quita el primero porque es par y se nececita uno fijo 
        const fijo = equipo_array.shift();    

        //for que cicla las jornadas ejemplo 18 equipos son 17 jornadas
        for (var i = 0; i < jornadas; i++) {

            const partidos_jornada=[]

            //aqui siempre se inserta enl uno en el primera posicion ejemplo 1
            //el ejemplo 6 equipos son [1,2,3,4,5,6] primero se quita el 1 quedando [2,3,4,5,6] y a esto se le da reversa siendo [6,5,4,3,2]
            //y luego juntando seria [1,6,5,4,3,2] y los que se va air moviendo serian los demas menos el uno en la sigueinte vuelta seria [1,2,6,5,4,3] 
            const equipos_acomodo = [fijo, ...equipo_array] //ejemplo [1,...[6,5,4,3,2]]= [1,6,5,4,3,2]
            //esuna bandera para saber como cortar el el array , ejemplo [1,6,5,4,3,2] se parte en [1,6,5] y [4,3,2]
            const flag_corte = Math.ceil(equipos_acomodo.length / 2);

            //[1,6,5,4,3,2] = [1,6,5] esto columna se tomaria como local 
            const columna_local = equipos_acomodo.slice(0, flag_corte)
            //[1,6,5,4,3,2] = [4,3,2] y pero como extra se realiza un reverse quedando [2,3,4]
            const columna_visitante = equipos_acomodo.slice(flag_corte).reverse()

            //se quita el ultimo elemento del array [6,5,4,3,2] =[6,5,4,3]
            //item seria el que se quito es  = 2
            const item = equipo_array.pop();
            //el item que se quito se agrega al inicio [2,6,5,4,3]
            equipo_array.unshift(item);


            console.log(`-----jornada ${i + 1}-----`)
            for (var j = 0; j < partido_jornada; j++) {
                console.log(`partido ${j + 1} equipo-${columna_local[j].nombre} vs equipo-${columna_visitante[j].nombre}`)
                partidos_jornada.unshift({
                    torneo:torneo_selected.value,
                    jornada:(i+1),
                    local:columna_local[j].id_equipo_futbol,
                    local_nombre:columna_local[j].nombre,
                    visita:columna_visitante[j].id_equipo_futbol,
                    visita_nombre:columna_visitante[j].nombre
                })
            }

            jornadas_fixture.value.unshift(partidos_jornada)



        }
    }
    //estos son inpares
    else {
        console.log("aqui es cuando no es par y por ende descanza uno")

        //aarray vien como [5,4,3,2,1] y iene que ser [1,5,4,3,2]
        const item = equipo_array.pop()
        equipo_array.unshift(item)

        for (var i = 0; i < jornadas; i++) {

            const partidos_jornada=[]

            // con esto quitamos el que descanza ejemplo [1,2,3,4,5] =[2,3,4,5] y se que da el 1 como descanzo
            const descanza = equipo_array.shift()
            // aqui se quitara el primer registro y se colocara hasta el fondo pero en la ultima ejemplo [1,2,3,4,5] quitas y queda [2,3,4,5]
            const equipos_acomodo = equipo_array //[2,3,4,5]
            //esuna bandera para saber como cortar el el array , ejemplo [2,3,4,5] se parte en [2,3] y [4,5]
            const flag_corte = Math.ceil(equipos_acomodo.length / 2);

            //[2,3,4,5] = [2,3] esto columna se tomaria como local 
            const columna_local = equipos_acomodo.slice(0, flag_corte)
            //[2,3,4,5] = [4,5] esta columna se toma com local 
            const columna_visitante = equipos_acomodo.slice(flag_corte).reverse()

            //el equipo_array es [2,3,4,5]
            //el que descanza se agrega al final quedando [2,3,4,5,1] y para la siguiente vuelta el que descanza seria el 2 
            equipo_array.push(descanza);


            console.log(`-----jornada ${i + 1}-----`)
            console.log(`**descanza el ${descanza}**`)
            for (var j = 0; j < partido_jornada; j++) {
                console.log(`partido ${j + 1} equipo-${columna_local[j].nombre} vs equipo-${columna_visitante[j].nombre}`)
                // partidos_jornada.unshift({torneo:torneo_selected.value,jornada:(j+1),local:columna_local[j],visita:columna_visitante[j]})
                partidos_jornada.unshift({
                    torneo:torneo_selected.value,
                    jornada:(i+1),
                    local:columna_local[j].id_equipo_futbol,
                    local_nombre:columna_local[j].nombre,
                    visita:columna_visitante[j].id_equipo_futbol,
                    visita_nombre:columna_visitante[j].nombre
                })
            }

            jornadas_fixture.value.unshift(partidos_jornada)


        }
    }


}


async function fnCreateFixture()
{    
    const data_send_=jornadas_fixture.value.flat().map(({local,visita,torneo,jornada})=>({cve_torneo_futbol:torneo,jornada,local,visita}))
    // console.log(data_send_)
    setCreateFixtureService(data_send_)
}

async function fnOpenAddFecha(partido)
{
console.log(partido)
partido_selected.value=partido?.cve_torneo_futbol_fixture
texto_partido.value=`jornada ${partido?.jornada}, ${partido?.local_nombre} vs ${partido?.visita_nombre}`
dialog_fecha.value=true
}

async function fnAddFecha()
{

    const data=await addFechaService(partido_selected.value,`${fecha_.value} ${hora_.value}`)
    if(data){
        jornadas_fixture.value.flat().find(i=>i.cve_torneo_futbol_fixture==partido_selected.value).fecha=`${fecha_.value} ${hora_.value}`
    }
}

function fnCloseDialogFecha()
{
    //regresa a vista de hours
    hora_ref.value.selecting=1
    fecha_.value=undefined
    hora_.value=undefined
    dialog_fecha.value=false
}

async function fnMinutesReturnHours(){
    console.log("click en minute")
    await new Promise(resolve=>setTimeout(resolve,1000))
    hora_ref.value.selecting=1
}

onMounted(() => {
    fnGetTorneos()
})

</script>

<style scoped>
/deep/.toolbar-fecha .v-toolbar__content{
    padding-left: 0;
}
</style>
<template>
<div>


    <v-card>
        <v-toolbar id="bar-candado" elevation="1" color="secondary" dark extended extension-height=5>
            <v-avatar color="primary" size="38" class="mx-3">
            <v-icon color="secondary">mdi-locker</v-icon>
            </v-avatar>
            <v-toolbar-title>Liberar Locker</v-toolbar-title>
            <template v-slot:extension><div class="primary" style="height:100%;width:100%"></div></template>
        </v-toolbar>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="12" lg="2">
                        <v-text-field v-model="numero_locker" label="# locker" filled dense></v-text-field>
                    </v-col>
                    <v-col lg="5">
                        <v-select label="Ubicacion" dense filled v-model="edificio" :items="lst_edificios" item-value="cve_edificio" item-text="nombre" dense></v-select>
                    </v-col> 
                    <!-- <v-col>
                        <label>Baño de:</label>
                        <v-radio-group row class="mt-0">
                            <v-radio label="Hombres"></v-radio>
                            <v-radio label="Mujeres"></v-radio>
                        </v-radio-group>
                    </v-col> -->
                    <v-col cols="12" lg="2" class="pt-6">
                        <v-btn @click="getBuscarLockers" fabx smallx color="primary">Buscar<v-icon>mdi-magnify</v-icon></v-btn>
                    </v-col>
                                       
                </v-row>

                <v-sheet color="primary lighten-1" class="pa-10 rounded-xl">
                    
                    <v-row>
                        <v-col cols="12" lg="8">

                         <div class="my-3 text-h6"><span class="text-h5 font-weight-black white--text mr-2">Locker: #</span>      <span class="secondary--text font-weight-bold">{{locker.numero_locker}}</span></div>
                         <div class="my-3 text-h6"><span class="text-h5 font-weight-black white--text mr-2">Locker: #</span>      <span class="secondary--text font-weight-bold">{{locker.numero_locker}}</span></div>
                         <div class="my-3 text-h6"><span class="text-h5 font-weight-black white--text mr-2">Ubicacion:</span>     <span class="secondary--text font-weight-bold">{{locker.ubicacion_edificio}}</span></div>
                         <div class="my-3 text-h6"><span class="text-h5 font-weight-black white--text mr-2">Propietario: </span>  <span class="secondary--text font-weight-bold">{{locker.propietario}}</span></div>
                         <div class="my-3 text-h6"><span class="text-h5 font-weight-black white--text mr-2">Arrendatario: </span> <span class="secondary--text font-weight-bold">{{locker.rentador}}</span></div>
                         
                        </v-col>
                        <v-col cols="12" lg="4" class="d-flex flex-column">
                            <v-btn block color="secondary" class="mb-1 text-h6" @click="getHistorico">Mostrar Historico</v-btn>

                            <v-btn block color="secondary" class="mt-1 text-h6" @click="getSocios">Liberacion de Locker</v-btn>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-container>
        </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" width="500">
        <v-card>
            <v-toolbar color="secondary" dark>
                <v-toolbar-title>Selecciona Locker</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>
            <div class="primary" style="height:4px;"></div>
            <v-card-text>
                <v-list two-line>
                    <v-list-item v-ripple="{class:'primary--text'}" @click="selectedLocker(locker)" v-for="(locker,index) in lst_lockers" :key="index">
                        <v-list-item-content>
                        <v-list-item-title>Locker # {{locker.numero_locker}}</v-list-item-title>
                        <v-list-item-subtitle>Ubicacion: {{locker.ubicacion_edificio}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_historico" width="600" persistent>
        <v-card >
        <v-toolbar color="secondary" dark>
            <v-toolbar-title>historico</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_historico=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <div class="primary" style="height:4px;"></div>
        <v-card-text>
<v-list two-line>
                    <v-list-item v-ripple="{class:'primary--text'}" @click="selectedLocker(locker)" v-for="(histo,index) in lst_historico" :key="index">
                        <v-list-item-content>
                        <v-list-item-title>Socio: {{histo.nombre}}</v-list-item-title>
                        <v-list-item-subtitle>Motivo: {{histo.motivo}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-chip>

                            {{dayjs(histo.fecha).format('DD MMMM YYYY')}}
                            </v-chip>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
        </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_liberacion" width="350" persistent scrollable>
        <v-card >
        <v-toolbar color="secondary" dark extended dense>
            <v-toolbar-title>Solicito</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog_liberacion=false"><v-icon>mdi-close</v-icon></v-btn>
            <template v-slot:extension>
               <v-text-field append-icon="mdi-account-search" v-model="nombre_socio" dense hide-details @keypress.enter="getSociosBuscar" class="mx-2" solo-inverted label="Nombre de socio"></v-text-field>
            </template>
        </v-toolbar>
        <div class="primary" style="height:4px;"></div>
        <v-card-text class="pa-0">
            <v-window v-model="paSocio">
               <v-window-item>
                   <v-list two-line>
                    <v-list-item v-ripple="{class:'primary--text'}" @click="nextWindows(socio.cve_persona)" v-for="(socio,index) in lst_socios" :key="index">
                        <v-list-item-content>
                        <v-list-item-title>Usuario # {{socio.rentador}}</v-list-item-title>
                        <v-list-item-subtitle>Accion: {{socio.accion}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                   </v-list>
               </v-window-item>
               <v-window-item class="pa-3">
                <v-text-field v-model="authoriza" label="autoriza" filled dense></v-text-field>
                <v-text-field v-model="realiza" label="realiza" filled dense></v-text-field>
                <v-textarea v-model="motivo" label="motivo" hide-details filled no-resize rows="2" class="mb-2">
                  
                </v-textarea>
                <v-btn @click="saveLiberacion" block color="primary">
                  Guardar
                </v-btn>
               </v-window-item>
            </v-window>
           
        </v-card-text>
        </v-card>
    </v-dialog>

</div>
</template>

<script setup>
import { defineComponent,onMounted,ref } from 'vue'
import dayjs from 'dayjs'
import {getEdificiosService,getLockerByNumeroOrUbicacionService,getHistoricoLockerService,getSociosLockerService,setLiberarLockerService} from '@/services/catalogo_locker_service'


        const lst_edificios=ref([])
        const numero_locker=ref()
        const edificio=ref()
        const lst_lockers=ref([])
        const cve_locker=ref(undefined)
        const lst_lockers_asignados=ref([])
        const locker=ref({})
        const nombre_socio=ref()

        const cve_persona=ref()
        const lst_socios=ref([])
        const lst_historico=ref([])

        const dialog=ref(false)
        const dialog_historico=ref(false)
        const dialog_liberacion=ref(false)

        const paSocio=ref(0)
        const motivo=ref()
        const authoriza=ref()
        const realiza=ref()


        onMounted(() => {
      getEdificios()
    });


        async function getEdificios()
    {
       try {
       
        lst_edificios.value = await getEdificiosService();
      } catch (error) {}
    }

    async function getBuscarLockers() {
      //limpiar todo por nueva busqueda...
      lst_lockers.value=[]
      cve_locker.value=undefined
      lst_lockers_asignados.value=[]

      try {   
       
        const data=await getLockerByNumeroOrUbicacionService(numero_locker.value,edificio.value)

        
            console.log(data.length)
            if(data.length==1)
            {
             let [lock]=data;
             locker.value=lock
            }
            else{
            console.log("entra al else")
            lst_lockers.value = data;
            dialog.value=true

            }
    
        
      } catch (error) {}
    }
       
    function selectedLocker(lockerSelected)
    {
      console.log("locker selected:",lockerSelected)
      locker.value=lockerSelected
      dialog.value=false
    }

    async function getHistorico()
    {
    try {
           
            const data=await getHistoricoLockerService(locker.value.cve_locker)
            lst_historico.value=data
        } catch (error) {
            
        }
    dialog_historico.value=true
    }

    async function getSocios()
    {
  dialog_liberacion.value=true
    }

    async function getSociosBuscar() {   
        console.log("buscar socio")  
      try {
             
            const data=await getSociosLockerService(nombre_socio.value)
          lst_socios.value = data;
          paSocio.value=0
     
      } catch (error) {}
    }

    function nextWindows(id)
    {
      paSocio.value=1
      cve_persona.value=id
    }

    async function saveLiberacion()
    {
        try {
       
        const data=await setLiberarLockerService(locker.value.cve_locker,cve_persona.value,motivo.value,authoriza.value,realiza.value)
          dialog_liberacion.value=false
        } catch (error) {
            
        }
   console.log("se guarda liberacion:",locker.value,cve_persona.value,motivo.value)
    }

 
</script>

<style>
#bar-candado .v-toolbar__content, .v-toolbar__extension{
    padding: 0!important;    
}
</style>

<template>
<div>
  <v-row class="pa-0">
    <v-col cols="12" lg="12" class="pa-1" style="height:230px">
      <v-card  height="230">
        <v-card-title>
          <v-autocomplete 
                       style="max-width:300px;" 
                       class="mx-1" 
                       label="Nombre de usuario" 
                       v-model="socio" 
                       auto-select-first 
                       background-color="white" 
                       outlined 
                       hide-details 
                       hide-no-data
                       :items="lst_socios"
                       item-value="cve_socio"
                       item-text="socio"
                       :search-input.sync="nombre_search"
                       dense
                       clearable
                       @change="()=>{estatusTipoAccion();getDatosSocio();}"
                       >        
        </v-autocomplete>

        <!-- <v-text-field label="CURP" style="max-width:250px;" outlined hide-details dense class="mx-1" background-color="white"></v-text-field>
        <v-text-field label="RFC" style="max-width:250px;" outlined hide-details dense class="mx-1" background-color="white"></v-text-field> -->
        <v-spacer></v-spacer>
        <v-btn color="error mr-1" @click="dialog=true"><v-icon class="mr-1">mdi-account</v-icon>Agregar Socio a Historico</v-btn>
        <ExpedienteDigital :cve_socio="socio" width="150px"/>
        
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>                  
        <div >
          <v-row>
            <v-col cols="12" lg="4"><b>Nombre:</b> {{nombre}}</v-col>
            <v-col cols="12" lg="4"><b>RFC:</b> {{rfc}}</v-col>
            <v-col cols="12" lg="4"><b>Curp:</b> {{curp}}</v-col>
            <v-col cols="12" lg="12"><b>Domicilio:</b> {{domicilio}}</v-col>
            <v-col cols="12" lg="4"><b>Celular:</b> {{celular}}</v-col>
            <v-col cols="12" lg="4"><b>Telefono:</b> {{telefono}}</v-col>
            <v-col cols="12" lg="4"><b>Correo:</b> {{correo}}</v-col>
          </v-row>
        </div>
        </v-card-text>
      </v-card>
    </v-col> 
    <v-col cols="12">
        <v-data-table class="elevation-1" :headers="[{text:'Accion',value:'accion'},{text:'Nip',value:'nip'},{text:'Fecha Alta',value:'fecha_alta'},{text:'Fecha Baja',value:'fecha_baja'},{text:'Fecha Movimiento',value:'fecha_hora_movimiento'},{text:'Movimiento',value:'movimiento'}]" :items="lst_historico">
             <template v-slot:item.nip="{item}">
               {{item.nip.startsWith(item.accion)?item.nip:`${item.accion}-${item.nip}`}}
             </template>
        </v-data-table>
    </v-col>  
  </v-row>
  <v-dialog v-model="dialog">
    <v-card>

    <FormSocio/>
    </v-card>
  </v-dialog>
  
</div>
  
</template>

<script setup>
import { defineComponent, ref, watch ,getCurrentInstance} from 'vue';
import isPlainObject from 'lodash/isPlainObject'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import debounce from 'lodash/debounce'

import ExpedienteDigital from "@/components/reporte_socio_historico/ExpedienteDigitalSocioBaja.vue";
import FormSocio from "@/components/reporte_socio_historico/FormSocioBaja.vue";
import {getSociosHistoricoReporteService,getSocioHistoricoByIdReporteService,getDatosSocioHistoricoByIdReporteService} from '@/services/reporte_socios_service'

   
    const socio =ref('')
    const nombre_search=ref(null)
    const lst_socios=ref([])
    const lst_historico=ref([])

    const nombre=ref('')
    const rfc=ref('')
    const curp=ref('')
    const telefono=ref('')
    const celular=ref('')
    const correo=ref('')
    const domicilio=ref('')

    const dialog=ref(false)
   
    watch(nombre_search,(val)=>{
      console.log('val:',val)
      if(!isUndefined(val) && !isNull(val))buscarSocio(val)
      else{
        lst_socios.value=[];
        lst_historico.value=[];
        nombre.value=''
        rfc.value=''
        curp.value=''
        telefono.value=''
        celular.value=''
        correo.value=''
        domicilio.value=''
        }
      })

    const buscarSocio=debounce(async (campo)=>{
        try{
          // let {data,status}=await $axios.get('reporte-historico-socios',{params:{nombre:campo}})
          const data=await getSociosHistoricoReporteService(campo)
          console.log(data)
          lst_socios.value=data
        }
        catch(e){}
      },500)

    async function estatusTipoAccion()
    {
       try {
        // let {data,status} =await $axios.get(`reporte-historico-socios/${socio.value}`)
        const data=await getSocioHistoricoByIdReporteService(socio.value)
        lst_historico.value=data
      } catch (error) {
        console.log('error en busqueda de socios')
      }
    }

    async function getDatosSocio()
    {

    //  let {data,status}=await $axios.get(`reporte-historico-socios/datos/${socio.value}`)
    const data=await getDatosSocioHistoricoByIdReporteService(socio.value)
     nombre.value=data.socio
     rfc.value=data.rfc
     curp.value=data.curp
     telefono.value=data.telefono
     celular.value=data.celular
     correo.value=data.correo_electronico
     domicilio.value=` Calle ${data.calle} Num ext:${data.numero_exterior} e int:${data.numero_interior}, Colonia: ${data.nombre} CP:${data.cp}, ${data.nom_municipio} ${data.nom_estado} ${data.nom_pais}`

    }


</script>




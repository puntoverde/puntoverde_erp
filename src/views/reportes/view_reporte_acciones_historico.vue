<template>
  <v-row class="greenxx pa-0" style="height:calc(100vh - 88px)">
    
    <v-col cols="12" lg="12" style="height:10%" class="pa-1">
      <v-card  height="100%">
        <v-card-text class="d-flex">          
        <v-text-field class="mx-1" label="Accion" v-model="accion" v-mask="accionMask" background-color="white" outlined hide-details dense></v-text-field>
        <v-btn @click="buscar" dark class="mx-1"><v-icon class="mr-1">mdi-magnify</v-icon>Buscar</v-btn>
        <v-text-field v-model="dueno" class="mr-2 ml-5 sherink" background-color="white" readonly  reversex hide-details dense></v-text-field>
        <v-text-field style="max-width:100px" :value="lst_estatus_text[estatus_accion]" class="mx-2 sherink" background-color="white" readonly  reversex hide-details dense></v-text-field>
        <v-text-field style="max-width:100px" v-model="tipo_accion" class="mx-2 sherink" background-color="white" readonly  reversex hide-details dense></v-text-field>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4" class="elevation-15xx pa-1" style="height:28%">
      <v-card color="purplexx" dark  class="pa-2xx" height="100%" style="overflow-y:auto">
        <v-list two-line>          
            <v-subheader>
            Dueños 
            <v-spacer></v-spacer>
            <FormDueno :cve_accion="cve_accion"/>
           </v-subheader>
            <v-divider></v-divider>
            <v-list-item v-for="i in lst_duenos" :key="i">
              <!-- <v-list-item-avatar>
                <v-img :src="item"></v-img>avatar
              </v-list-item-avatar> -->
              <v-list-item-content>
                <v-list-item-title >{{i.nombre}}</v-list-item-title>
                <v-list-item-subtitle>fecha de alta:{{i.fecha_alta}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4" style="height:28%;" class="pa-1">
      <v-card dark  class="pa-2xx" height="100%" style="overflow-y:auto">
        <v-list two-line>          
            <v-subheader>Usuarios</v-subheader>
            <v-divider></v-divider>
            <v-list-item v-for="i in lst_socios" :key="i">
              <v-list-item-content>
                <v-list-item-title >{{i.nip}}, {{i.socio}}</v-list-item-title>
                <v-list-item-subtitle>{{i.movimiento}}, {{i.fecha_hora_movimiento}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4" style="height:28%;overflow-y:auto" class="pa-1">
      <v-card dark  class="pa-2xx" height="100%" style="overflow-y:auto">
        <v-list two-line>          
            <v-subheader>Tipo Accion</v-subheader>
            <v-divider></v-divider>
            <v-list-item v-for="i in lst_tipo_accion" :key="i">
              <v-list-item-content>
                <v-list-item-title >Cambio a {{i.nombre}}</v-list-item-title>
                <v-list-item-subtitle>fecha de cambio:{{i.fecha_modificacion}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" lg="8" style="height:57%;" class="pa-1">
      <v-card height="100%" dark  style="overflow-y:auto"> 
        <v-data-table dark :headers="[{text:'Periodo',value:'periodo'},{text:'Concepto',value:'concepto'},{text:'Cargo',value:'cargo_total'},{text:'Descuento',value:'monto_descuento'},{text:'Total',value:'monto_total'},{text:'Folio',value:'folio'}]" :items="lst_cargos">

        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="12" lg="4" style="height:57%;" class="pa-1">
     <v-card dark  class="pa-2xx" height="100%" style="overflow-y:auto">
        <v-list two-line>          
            <v-subheader>Cambio de Estatus</v-subheader>
            <v-divider></v-divider>
            <v-list-item v-for="i in lst_estatus" :key="i">
              <v-list-item-content>
                <v-list-item-title >{{i.observacion}} en fecha {{i.fecha_modificacion}}</v-list-item-title>
                <v-list-item-subtitle>Estatus Actual:{{i.estatus_actual}}, Estatus Anterior:{{i.estatus_anterior}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import FormDueno from '@/components/reporte_accion_historico/FormDuenoBaja.vue'
import isPlainObject from 'lodash/isPlainObject'
import {getAccionesHistoricoReporteService,getAccionesHistoricoDuenoReporteService,getAccionesHistoricoSociosReporteService,getAccionesHistoricoCargosReporteService,getAccionesHistoricoEstatusTipoReporteService} from '@/services/reporte_acciones_service'

 
    const cve_accion=ref(0);
    const accion =ref('')
    const lst_duenos=ref([])
    const lst_socios=ref([])
    const lst_cargos=ref([])
    const lst_tipo_accion=ref([])
    const lst_estatus=ref([])

    const dueno=ref('')
    const estatus_accion=ref('')
    const tipo_accion=ref('')
    

    const lst_estatus_text=["-","Activa","Bloqueada","Baja"]

    const accionMask= {
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
      }

    async function buscar(){
        let numero_accion=0,clasificacion=0;
        numero_accion=accion.value
        
        if(accion.value.indexOf('A')>0)
        {
          console.log('encuentra la a')
          numero_accion=accion.value.substr(0,accion.value.indexOf('A'))
          clasificacion=1
        }
        if(accion.value.indexOf('B')>0)
        {
          console.log('encuentra la b')
          numero_accion=accion.value.substr(0,accion.value.indexOf('B'))
          clasificacion=2
        }
        if(accion.value.indexOf('C')>0)
        {
          console.log('encuentra la c')
          numero_accion=accion.value.substr(0,accion.value.indexOf('C'))
          clasificacion=3
        }
        try{
        // let {data,status}=await $axios.get('reporte-historico-accion',{params:{numero_accion,clasificacion}})
        const data=await getAccionesHistoricoReporteService(numero_accion,clasificacion)
        console.log('data:',data)
        if(isPlainObject(data)){
          dueno.value=data.dueno
          estatus_accion.value=data.estatus
          tipo_accion.value=data.tipo

          cve_accion.value=data.cve_accion

           console.log('si existe la accion')
           buscarDuenos(data.cve_accion);
           buscarSocios(data.cve_accion);
           buscarCargos(data.cve_accion);
           estatusTipoAccion(data.cve_accion);
        }
        }
        catch(e){
          console.log('no existe accion')
        }
    }

    async function buscarDuenos(id)
    {
      try {
        // let {data,status} =await $axios.get(`reporte-historico-accion/${id}`)
        const data=await getAccionesHistoricoDuenoReporteService(id)
        lst_duenos.value=data
      } catch (error) {
        console.log('error en busqueda de dueños')
      }
    }

    async function buscarSocios(id)
    {
       try {
        // let {data,status} =await $axios.get(`reporte-historico-accion/socios/${id}`)
        const data=await getAccionesHistoricoSociosReporteService(id)
        lst_socios.value=data
      } catch (error) {
        console.log('error en busqueda de socios')
      }
    }

    async function buscarCargos(id)
    {
       try {
        // let {data,status} =await $axios.get(`reporte-historico-accion/cargos/${id}`)
        const data=await getAccionesHistoricoCargosReporteService(id)
        lst_cargos.value=data
      } catch (error) {
        console.log('error en busqueda de socios')
      }
    }

    async function estatusTipoAccion(id)
    {
       try {
        const data=await getAccionesHistoricoEstatusTipoReporteService(id)
        lst_tipo_accion.value=data.tipo_accion
        lst_estatus.value=data.estatus_accion
      } catch (error) {
        console.log('error en busqueda de socios')
      }
    }

</script>




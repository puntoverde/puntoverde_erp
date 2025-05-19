<template>
     <v-card>
        <v-toolbar color="secondary" dark elevation="1">
            <v-toolbar-title>
                Reporte de Candados rotos de lockers
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu v-model="menu1" offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="dayjs(fecha_inicio).format('DD MMMM YYYY')" readonly label="Fecha Inicio" v-on="on" v-bind="attrs" solo-inverted class="mr-1" hide-details dense prepend-inner-icon="mdi-calendar"></v-text-field>
                </template>
                <v-date-picker v-model="fecha_inicio" @input="menu1 = false" locale="es-MX" :max="fecha_fin" color="primary" header-color="secondary"></v-date-picker>
            </v-menu>
            <v-menu v-model="menu2" offset-y :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
            <v-text-field :value="dayjs(fecha_fin).format('DD MMMM YYYY')" readonly label="Fecha Fin" v-on="on" v-bind="attrs" solo-inverted class="ml-1" hide-details dense prepend-inner-icon="mdi-calendar"></v-text-field>
            </template>
                <v-date-picker v-model="fecha_fin" @input="menu2 = false" locale="es-MX" :min="fecha_inicio" color="secondary"></v-date-picker>
            </v-menu>
            <v-spacer></v-spacer>
            <v-btn @click="getReporte" color="primary">
                <v-icon class="mr-2">mdi-magnify</v-icon> Buscar
            </v-btn>
        </v-toolbar>
        <div class="primary" style="height:4px;"></div>
        <v-card-text>            
            <v-data-table        
            class="elevation-1 tbl-foo"
            :headers="[
            {text:'Locker',value:'numero_locker',class:'secondary white--text rounded-tl text-subtitle-1 font-weight-bold',align:'center'},
            {text:'usuario',value:'nombre',class:'secondary white--text rounded-tl text-subtitle-1 font-weight-bold'},
            {text:'Motivo',value:'motivo',class:'secondary white--text text-subtitle-1 font-weight-bold'},
            {text:'Fecha aplico',value:'fecha',class:'secondary white--text rounded-tr text-subtitle-1 font-weight-bold',width:'250px',align:'center'}]"
            :items="lst_historico"
            >
               
               <template v-slot:item.fecha="{value}">
                    {{dayjs(value).format('DD [de] MMMM [del] YYYY HH:mm')}}
               </template>
               
               <template v-slot:header>
                
                <tr>
                    <th colspan="4" style="height:5px" class="primary"></th>
                </tr>
                  
               </template>
               
               <template v-slot:body.append>
                  <tr>
                    <th colspan="4" style="height:5px" class="primary"></th>
                </tr>
               </template>
            </v-data-table>        
        </v-card-text>
     </v-card>
</template>

<script setup>
import { defineComponent,ref} from 'vue'
import dayjs from 'dayjs'
import {getReporteCandadoLocker} from '@/services/reporte_locker'

        const menu1=ref(false)
        const menu2=ref(false)
        const fecha_inicio=ref(dayjs().format('YYYY-MM-DD'))
        const fecha_fin=ref(dayjs().format('YYYY-MM-DD'))

        const lst_historico=ref([])
         
        async function getReporte()
        {
            console.log("getReporte")
          try {
            // let { data, status } = await $axios.get("lockers/reporte-liberar-historico", {params: {fechaI:fecha_inicio.value,fechaF:fecha_fin.value}});
            const data=await getReporteCandadoLocker(fecha_inicio.value,fecha_fin.value)
            lst_historico.value=data
          } catch (error) {
            console.log(error)
          }

        }

</script>

<style>
.tbl-foo .v-data-footer{
    background-color: var(--v-secondary-base)!important;
    color: white;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.tbl-foo .v-data-footer .v-input{background-color: white;}
.tbl-foo .v-data-footer .v-data-footer__icons-before{background-color: var(--v-primary-base);}
.tbl-foo .v-data-footer .v-data-footer__icons-after{background-color: var(--v-primary-base);}
</style>

<template>
    <div>
        <div class="d-flex justify-space-between">
            <v-menu v-model="menu_years" :close-on-click="true" :close-on-content-click="false">
                <template v-slot:activator="{on,attrs}">
                    <v-text-field :value="periodo" label="Seleccionar periodo consultar" readonly  v-on="on" v-bind="attrs" style="max-width: 300px;" outlined dense background-color="white" append-icon="mdi-calendar"></v-text-field>
                </template>
                <v-card>
                    <v-window v-model="window_pais">
                        <v-window-item v-for="(annios_,index) in lst_pais" :value="index">
                            <div class="pa-5" style="display: grid; grid-template-columns: repeat(3,1fr);grid-template-rows: repeat(3,1fr);gap: 15px;">
                                <v-btn @click="fnSelectedYear(annio_)" elevation="0" class="text-h6" :color="periodo==annio_?'primary':'secondary'" v-for="(annio_,index_) in annios_">{{ annio_ }}</v-btn>
                            </div>
                            </v-window-item>
                        </v-window>
                    <v-card-actions>
                        <v-btn small @click="lastYears" :disabled="window_pais==0"> <v-icon>mdi-chevron-left</v-icon> </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn small @click="nextYears" :disabled="window_pais==9"> <v-icon>mdi-chevron-right</v-icon> </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
            <h1 class="accent--text oswald--text">Reporte Estadistico de Lockers</h1>
        </div>

        <div class="d-flex justify-space-around mt-10">
            <v-card width="250" min-height="200">
                <v-overlay absolute :value="loading_cards"><v-progress-circular indeterminate></v-progress-circular></v-overlay>
                <v-card-title class="text-h5">Rentados ({{ (periodo??1)-1 }})</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-center text-h4">
                    {{ rentados }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="fnDetalleRentados" text style="text-transform: none;" class="text-decoration-underline">Detalle</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-show="flag==1" icon color="success"><v-icon>mdi-flag</v-icon></v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="250" min-height="200">
                <v-overlay absolute :value="loading_cards"><v-progress-circular indeterminate></v-progress-circular></v-overlay>
                <v-card-title class="text-h5">Sin renovacion</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-center text-h4">
                    {{ sin_renovar }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="fnDetalleNoRenovado" text style="text-transform: none;" class="text-decoration-underline">Detalle</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-show="flag==2" icon color="success"><v-icon>mdi-flag</v-icon></v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="250" min-height="200">
                <v-overlay absolute :value="loading_cards"><v-progress-circular indeterminate></v-progress-circular></v-overlay>
                <v-card-title class="text-h5">Pertenecen al club</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-center text-h4">
                    {{ pertenece_club }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="fnDetallePerteneceClub" text style="text-transform: none;" class="text-decoration-underline">Detalle</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-show="flag==3" icon color="success"><v-icon>mdi-flag</v-icon></v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="250" min-height="200">
                <v-overlay absolute :value="loading_cards"><v-progress-circular indeterminate></v-progress-circular></v-overlay>
                <v-card-title class="text-h5">Dueño externo</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-center text-h4">
                    {{ pertenece_externo }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="fnDetallePerteneceExterno" text style="text-transform: none;" class="text-decoration-underline">Detalle</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-show="flag==4" icon color="success"><v-icon>mdi-flag</v-icon></v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="250" min-height="200">
                <v-overlay absolute :value="loading_cards"><v-progress-circular indeterminate></v-progress-circular></v-overlay>
                <v-card-title class="text-h5">Cargos /Pagados</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-center text-h4">
                    {{ cargos }}/{{ cargos_pagados }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="fnDetalleCargosOrPagos" text style="text-transform: none;" class="text-decoration-underline">Detalle</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-show="flag==5" icon color="success"><v-icon>mdi-flag</v-icon></v-btn>
                </v-card-actions>
            </v-card>

            <v-card width="250" min-height="200">
                <v-overlay absolute :value="loading_cards"><v-progress-circular indeterminate></v-progress-circular></v-overlay>
                <v-card-title class="text-h5">Libres</v-card-title>
                <v-divider></v-divider>
                <v-card-text class="text-center text-h4">
                    {{ libres }}
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="fnDetalleCargosLibres" text style="text-transform: none;" class="text-decoration-underline">Detalle</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn v-show="flag==6" icon color="success"><v-icon>mdi-flag</v-icon></v-btn>
                </v-card-actions>
            </v-card>
        </div>

        <v-data-table :headers="headers" :items="items" :search="search" :page.sync="page" :items-per-page="itemsPerPage"
            class="table-pv rounded-xl elevation-5 mt-5" hide-default-footer :loading="loading_detalle">
            
            <template v-slot:top="{ pagination }">
                <div class="d-flex justify-space-between align-center">

                    <v-btn @click="exportar_excel" color="green lighten-1" rounded :disabled="items.length==0"><v-icon color="white">mdi-file-excel</v-icon></v-btn>                    

                    <div class="d-flex align-center">
                        <span class="mr-2 text-caption">filas por pagina</span>
                        <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
                        <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
                        <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
                    </div>
                </div>
            </template>

            <template v-slot:footer="{ props }">
                <div>{{ props.pagination.itemsLength }} registro(s)</div>
            </template>

            <template v-slot:item.numero_locker="{ value }">
               <v-chip label color="grey darken-3" small class="font-weight-bold text-subtitle-1 white--text">{{ value }}</v-chip>
            </template>

            <template v-slot:item.persona="{ item }">
                <span>{{ item.nombre }}</span><span class="mx-1 font-weight-bold">{{ item.apellido_paterno }}</span><span class="font-italic">{{ item.apellido_materno }}</span>
            </template>

            <template v-slot:item.periodo_renta="{ item }">
                <span v-if="dayjs(item.fecha_incio).isValid()">
                    {{ dayjs(item.fecha_incio).format('DD [de] MMM') }} - {{ dayjs(item.fecha_fin).format('DD [de] MMM [de] YYYY') }}
                </span>                
                <span v-else>N/A</span>
            </template>

            <template v-slot:item.accion="{ value }">
                <v-chip label small color="secondary" class="text-subtitle-1" outlined>{{ value }}</v-chip>
            </template>

            <template v-slot:item.total="{ value }">
                <span class="font-weight-black accent--text number--text">
                    {{ numeral(value).format("$0,0.[00]") }}
                </span>
            </template>
            
            <template v-slot:item.estatus_pago="{ value }">
                <v-chip v-if="value==1" color="success">pagado</v-chip>
                <v-chip v-else-if="value==0" color="error">no pago</v-chip>
                <v-chip v-else color="warning">N/A</v-chip>
            </template>
            
            <template v-slot:item.observaciones="{ item }">
                <span>{{ item.observaciones }}</span>
                <span>{{ item.motivo_cancelacion }}</span>
            </template>

            <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" x-small icon outlined color="secondary" fab
                            @click="editar_cuota(item.cve_cuota)"><v-icon>mdi-square-edit-outline</v-icon></v-btn>
                    </template>
                    <span>Editar Cuota</span>
                </v-tooltip>
            </template>
        </v-data-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {getReporteEstadisticaCardsService,getReporteEstadisticaRentadosService,getReporteEstadisticaNoRenovadoService,getReporteEstadisticaPerteneceClubService,getReporteEstadisticaPerteneceExternoService,getReporteEstadisticaCargosOrPagosService,getReporteEstadisticaLibresService} from '@/services/reporte_estadistica_locker_service'
import _groupBy from 'lodash/groupBy'
import _chunk from 'lodash/chunk'
import dayjs from 'dayjs'
import numeral from 'numeral'
import XLSX from "xlsx";
import { saveAs } from 'file-saver';
import concat from 'lodash/concat'

const headers = ref([
  { text: "No. locker", align: "center", sortable: true, value: "numero_cuota" },
  { text: "Ubicacion", value: "tipo_cuota" },
  { text: "Persona", value: "cuota" },
  { text: "Accion", align: "rightx", value: "precio" },
  { text: "Cargo", value: "opcion_iva" },
  { text: "Folio pago", value: "genero_aplica", align: "center" },
  { text: "Periodo renta", value: "edad_aplica" },  
]);

const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const items=ref([])
const periodo=ref()
const rentados=ref()
const sin_renovar=ref()
const pertenece_club=ref()
const pertenece_externo=ref()
const cargos=ref()
const cargos_pagados=ref()
const libres=ref()

const flag=ref()

const loading_cards=ref(false)
const loading_detalle=ref(false)

//es para el menu de paises
const lst_pais=ref([])
const window_pais=ref(0)
const menu_years=ref(false)

onMounted(()=>{
let annio_start=dayjs().year()
const _paises=[]
for(let i=1;i<=90;i++)
{ _paises.push(annio_start--)}
lst_pais.value=_chunk(_paises,9)
})

function lastYears()
{
    if(window_pais.value>0)window_pais.value=window_pais.value-1
}

function nextYears()
{    
    if(window_pais.value<10)window_pais.value=window_pais.value+1
}

function fnSelectedYear(year){
periodo.value=year
menu_years.value=false
console.log(year);
fnChangePeriodo(year)
}

async function fnChangePeriodo(periodo)
{
    loading_cards.value=true
    items.value=[]
    try {
        
    const {
        rentados:data_rentados,
        sin_renovar:data_sin_renovar,
        pertenece_club:data_pertenece_club,
        pertenece_externo:data_pertenece_externo,
        cargos_pagos:data_cargos_pagos,
        libres:data_libres,
    }=await getReporteEstadisticaCardsService(periodo);
    rentados.value=data_rentados
    sin_renovar.value=data_sin_renovar
    pertenece_club.value=data_pertenece_club
    pertenece_externo.value=data_pertenece_externo    
    cargos.value=data_cargos_pagos?.split('/')?.[0]
    cargos_pagados.value=data_cargos_pagos?.split('/')?.[1]
    libres.value=data_libres
    } catch (error) {
        
    }
    finally{
        loading_cards.value=false
    }
}

async function fnDetalleRentados()
{
    loading_detalle.value=true
    flag.value=1
    try {
      headers.value =[
  { text: "No. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Persona", value: "persona" },
  { text: "Accion", align: "center", value: "accion" },
  { text: "Folio pago", value: "folio", align: "center" },
  { text: "Monto pago", value: "total" },
  { text: "Periodo renta", value: "periodo_renta" },  
];
        items.value=await getReporteEstadisticaRentadosService(periodo.value)
    } catch (error) {
        console.log('error',error)
    }
    finally{loading_detalle.value=false}
}

async function fnDetalleNoRenovado()
{
    loading_detalle.value=true
    flag.value=2
    try {
      headers.value =[
  { text: "No. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Persona", value: "persona" },
  { text: "Accion", align: "center", value: "accion" },
  { text: "Folio pago", value: "folio", align: "center" },
  { text: "Monto pago", value: "total" },
  { text: "Periodo renta", value: "periodo_renta" },  
];
        items.value=await getReporteEstadisticaNoRenovadoService(periodo.value)
    } catch (error) {
        console.log('error',error)
    }
    finally{loading_detalle.value=false}
}

async function fnDetallePerteneceClub()
{
    loading_detalle.value=true
    flag.value=3
    try {
      headers.value =[
  { text: "No. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Dueño", value: "persona" },
  { text: "Accion", align: "center", value: "accion" },
  { text: "Folio pago", value: "folio", align: "center" },
  { text: "Monto pago", value: "total" },
  { text: "Periodo renta", value: "periodo_renta" },  
];
        items.value=await getReporteEstadisticaPerteneceClubService(periodo.value)
    } catch (error) {
        console.log('error',error)
    }
    finally{loading_detalle.value=false}
}

async function fnDetallePerteneceExterno()
{
    loading_detalle.value=true
    flag.value=4
    try {
      headers.value =[
  { text: "No. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Dueño", value: "persona" },
  { text: "Accion", align: "center", value: "accion" },
];
        items.value=await getReporteEstadisticaPerteneceExternoService(periodo.value)
    } catch (error) {
        console.log('error',error)
    }
    finally{loading_detalle.value=false}
}

async function fnDetalleCargosOrPagos()
{
    loading_detalle.value=true
    flag.value=5
    try {
      headers.value =[
  { text: "No. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Persona", value: "persona" },
  { text: "Accion", align: "center", value: "accion" },
  { text: "Folio pago", value: "folio", align: "center" },
  { text: "Monto pago", value: "total" },
  { text: "Periodo renta", value: "periodo_renta" },  
  { text: "Estatus", value: "estatus_pago" },  
];
        items.value=await getReporteEstadisticaCargosOrPagosService(periodo.value)
    } catch (error) {
        console.log('error',error)
    }
    finally{loading_detalle.value=false}
}
async function fnDetalleCargosLibres()
{
    loading_detalle.value=true
    flag.value=6
    try {
      headers.value =[
  { text: "No. locker", align: "center", sortable: true, value: "numero_locker" },
  { text: "Ubicacion", value: "ubicacion" },
  { text: "Persona", value: "persona" },
  { text: "Folio pago", value: "folio", align: "center" },
  { text: "Monto pago", value: "total" },
  { text: "Periodo renta", value: "periodo_renta" },  
  { text: "Observaciones", value: "observaciones" },  
  { text: "Estatus", value: "estatus_pago" },  
];
        items.value=await getReporteEstadisticaLibresService(periodo.value)
    } catch (error) {
        console.log('error',error)
    }
    finally{loading_detalle.value=false}
}

function exportar_excel()
{
      let wb = XLSX.utils.book_new();
      wb.SheetNames.push("reporte_entradas");
      let ws_data1 =  items.value.map(({nombre,apellido_paterno,apellido_materno,fecha_incio,fecha_fin,...i})=>({...i,persona:`${nombre??''} ${apellido_paterno??''} ${apellido_materno??''}`,periodo_renta:`${fecha_incio??''} - ${fecha_fin??''}`})).map(i=>{
        const az=[]
        headers.value.forEach(j=>az.push((i[j.value])));
        return az
    })
       
      let ws_data=concat([headers.value.map(i=>i.text)],ws_data1);

      let ws = XLSX.utils.aoa_to_sheet(ws_data, {origin: "B2"});

      wb.Sheets["reporte_entradas"] = ws;

      let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

      function s2ab(s) {
        let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        let view = new Uint8Array(buf); //create uint8array as viewer
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
        return buf;
      }

      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'reporte_entradas_amacen.xlsx');    
}

</script>
<template>
  <v-container>
   
    <div class="d-flex v-card v-sheet theme--light elevation-5 mb-5 pa-5">
      <v-chip class="ma-2" to="cuotas" color="teal" text-color="white">
        <v-avatar>
          <v-icon>mdi-arrow-left</v-icon>
        </v-avatar>
      </v-chip>
      <h1 class="accent--text">Catalogo Cuotas</h1>
    </div>
    <v-card outlinedx elevation="5">
     <v-card-text>
    <v-row>
      <v-col lg="4" class="pb-0">
        
        <v-text-field filled label="Codigo Producto o Servicio COMERCIAL" dense v-model="clave"  @keypress.enter="getCuotaByClave" :loading="load_servicio" :hint="msg_servicio" persistent-hint append-icon="mdi-magnify" @click:append="findCuotas"></v-text-field>

      </v-col>
    </v-row>
    <v-row>

      <v-col lg="2">
        
        <v-text-field
          label="Numero Cuota"
          v-mask="'##########'"
          v-model="numero_cuota"
          
        ></v-text-field>
      </v-col>
      <v-col lg="4">
        
        <v-text-field
          label="Concepto de la Cuota"
          v-model="cuota"
          
          class="my-mayus"
        ></v-text-field>
      </v-col>
      <v-col lg="2">
        
        <v-text-field
          label="Importe Cuota"
          v-currency="{ currency: 'USD', locale: 'en' }"
          v-model="importe"
          
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <label class="accent--text">opcion iva</label>
        <v-radio-group row v-model="opcion_iva" class="mt-0">
          <v-radio color="primary" :value="1" label="Iva Incluido"></v-radio>
          <v-radio color="primary" :value="2" label="+ iva"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col lg="3">
        <label class="accent--text">Cuota aplica ha</label>
        <v-radio-group row v-model="tipo_cuota" class="mt-0">
          <v-radio color="primary" :value="1" label="Persona"></v-radio>
          <v-radio color="primary" :value="2" label="Accion"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col lg="3" v-if="tipo_cuota === 2">
        
        <v-select
          label="Membresia a los que aplica"
          v-model="membresias"
          :items="lst_membresias"
          item-text="nombre"
          item-value="id"
          multiple
          clearable
          
        ></v-select>
      </v-col>
      <v-col lg="3" v-else>
        
        <v-select
          label="Parentesco a los que aplica"
          v-model="parentescos"
          multiple
          :items="lst_parentescos"
          item-text="nombre"
          item-value="cve_parentesco"
          clearable
          
        ></v-select>
      </v-col>
      <v-col lg="3">
        <label class="mt-0 pt-0 accent--text">Genero aplica</label>
        <br>
        <v-btn-toggle
          v-model="genero_aplica"
          dense
          rounded
          color="success"
          
          mandatory
          active-class="active_genero"
        >
          <v-btn value="H" small>
            <v-icon>mdi-human-male</v-icon>
          </v-btn>
          <v-btn value="M" small>
            <v-icon>mdi-human-female</v-icon>
          </v-btn>
          <v-btn value="A" small>
            <v-icon>mdi-human-male-female</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col lg="2">
        <v-text-field
          prepend-icon="mdi-greater-than-or-equal"
          v-model="edad_aplica"
          v-mask="'###'"
          label="Edad"
          suffix="Años"
        ></v-text-field>
      </v-col>
      <v-col lg="2">
        <label class="mt-0 pt-0 accent--text">Restringe acceso</label>        
        <v-radio-group row v-model="acceso" class="mt-0">
          <v-radio color="primary" :value="1" label="SI"></v-radio>
          <v-radio color="primary" :value="0" label="NO"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col lg="2">
        <v-text-field
          v-model="limite_pago"
          label="Día límite a pagar"
          suffix="Días"
        ></v-text-field>
      </v-col>

      <v-col lg="3">
        <v-row align="center" class="my-0 py-0">
          <v-checkbox color="primary" v-model="check_veces_aplica" hide-details class="shrink ml-3 mr-0 mt-0"></v-checkbox>
          <v-text-field
            label="No. de pagos permitidos por período"
            v-model="veces_aplica"
            :disabled="!check_veces_aplica"
          ></v-text-field>
        </v-row>
      </v-col>
      <v-col lg="1">
        <v-checkbox color="primary" label="Editable" v-model="editable" :true-value="1" :false-value="0"></v-checkbox>
      </v-col>
    </v-row>
     </v-card-text>
    </v-card>
    <v-row class="mt-5">
      <v-col lg="6">
        <v-card outlinedx elevation="5">
          <v-card-title>
            <v-switch
          v-model="carga_automatica"
          color="blue darken-3"
          :true-value="1"
          :false-value="0"
          label="Carga Automatica"
          dense
          class="mt-0"
        ></v-switch>
          </v-card-title>
          <v-card-text v-if="carga_automatica">
            <v-row >
      <v-col>
        
        <v-text-field v-model="ciclo" label="Aplicar cada" ></v-text-field>

      </v-col>
      <v-col>
        
        <v-select
          clearable
          :items="lst_tipo_ciclo"
          v-model="tipo_ciclo"
          item-text="text"
          item-value="id"
          label="Periodicidad"
          persistent-hint
          
        ></v-select>
      </v-col>
      <v-col>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on }">
            
            <v-text-field
              v-model="fecha_vigor"
              label="Fecha para entrar en vigor"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="fecha_vigor"
            locale="es-es"
            @input="menu = false"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col lg="6">
        <v-card outlinedx elevation="5">
          <v-card-title>
            <v-switch
          v-model="recargo_aplica"
          :true-value="1"
          :false-value="0"
          label="Aplica recargos"
          color="blue darken-3"
          dense
          class="mt-0"
        ></v-switch>
          </v-card-title>
          <v-card-text v-if="recargo_aplica">
            <v-row >
      <v-col class="py-0">
        <v-checkbox color="primary" label="Único" v-model="recargo_unico" :true-value="1" :false-value="0"></v-checkbox>
      </v-col>      
      <v-col class="py-0">
        
        <v-text-field
          label="Monto recargo"
          v-model="recargo_cantidad"
          v-currency="{ currency: 'USD', locale: 'en' }"
          
        ></v-text-field>
      </v-col>
      <v-col class="py-0">
        
        <v-text-field
          :disabled="recargo_unico===1"
          label="Recargo cada"
          v-model="recargo_cada"
          suffix="Días"
          
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0"> 
        <v-checkbox color="primary" label="Cargar Mes Siguiente" v-model="mes_siguiente" :true-value="1" :false-value="0"></v-checkbox>
      </v-col>
    </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

        <v-btn :class="{primary:cve_cuota==0,info:cve_cuota>0}" @click="saveOrUpdate" absolute right bottom>{{cve_cuota>0?'Actualizar':'Guardar'}}</v-btn>
     
    <v-row>
      <v-col>
        <v-snackbar v-model="snackbar" :bottom="true" :multi-line="true" :color="snackbar_color">
          {{mensaje_alerta}}
          <v-icon color="white" @click="snackbar=false">mdi-close-circle</v-icon>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" scrollable max-width="500" persistent>
        <v-card>
          <v-card-title class="primary"><v-text-field label="Buscar Cuota" dark hide-details> </v-text-field></v-card-title>
          <v-card-text style="height:400px" class="mx-0 px-0">
              <v-list>
                <v-list-item link v-for="prod_serv in lst_prod_serv" :key="prod_serv.codigo_prod_serv" @click="selectedServicio(prod_serv.codigo_prod_serv)">
                  <v-list-item-avatar color="primary white--text">
                    {{prod_serv.codigo_prod_serv}}
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title color="primary">{{prod_serv.nombre_prod_serv}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-card-text>
        </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { onMounted, ref } from "vue";


import isNull from 'lodash/isNull'
import {round} from 'mathjs'
import numeral from 'numeral'
import throttle from 'lodash/throttle'
import {getConceptoByIdService,setCreateConceptoService,setUpdateConceptoService} from '@/services/concepto_service'
import {getMembresiasService} from '@/services/tipo_accion_service'
import {getParentescoService} from '@/services/parentesco_service'
import {getProductoByClaveCompaqService,getAllProductoCompaqService} from '@/services/compaq_service'


    const props=defineProps({cve_cuota: { type: Number, default: 0 }})
 

    //#region variables
    let id_cuota = 0;
    const clave = ref('');
    let producto_servicio=null;
    const numero_cuota=ref('')
    const cuota = ref("");
    const opcion_iva = ref(1);
    const importe = ref("");
    const tipo_cuota = ref(1);
    const genero_aplica = ref("A");
    const edad_aplica = ref(0);
    const carga_automatica = ref(0); //es para la carga automatica
    const acceso = ref(0); //es para restringir el acceso
    const ciclo = ref(0); //aplica cada ciclo
    const tipo_ciclo = ref(0);
    const mes = ref(0);
    const dia = ref(0);
    const limite_pago = ref(0);
    const check_veces_aplica= ref(false)
    const veces_aplica = ref(0);
    const recargo_aplica = ref(0); //para saber si implementara recargos
    const recargo_unico = ref(0);
    const recargo_cantidad = ref(0);
    const recargo_cada = ref(0);
    const fecha_vigor = ref("");
    const editable = ref(0);
    const mes_siguiente=ref(0);
    const estatus = ref(true);

    const membresias = ref([]);
    const parentescos = ref([]);

    const lst_tipo_cuota = [
      { id: 1, tipo: "Persona" },
      { id: 2, tipo: "Acción" },
    ];
    const lst_genero_aplica = [
      { id: "M", genero: "Femenino" },
      { id: "H", genero: "Masculino" },
      { id: "A", genero: "Ambos" },
    ];
    const lst_tipo_ciclo = [
      { id: 0, text: "NA" },
      { id: 1, text: "Año" },
      { id: 2, text: "Mes" },
      { id: 3, text: "Dia" },
    ];
    const lst_membresias = ref([]);
    const lst_parentescos = ref([]);

    const menu = ref(false);

    const load_servicio=ref(false)
    const msg_servicio=ref('')
    const dialog=ref(false)
    const lst_prod_serv=ref([])

    const snackbar=ref(false)
    const mensaje_alerta=ref('')
    const snackbar_color=ref('info')
    //#endregion

    onMounted(() => {
      if(props.cve_cuota>0)getCuota();
      getMembresias();
      getParentescos();
    });
 
    //#region funciones
    async function getCuota(){

     try {
      //  let {data,status} = await $axios.get(`/cuotas/${props.cve_cuota}`)
      //  if(status===200){         
         const data=await getConceptoByIdService(props.cve_cuota)
         clave.value=data.producto_servicio;
         numero_cuota.value=data.numero_cuota;
         cuota.value=data.cuota
         tipo_cuota.value=data.tipo_cuota
         importe.value=numeral(data.precio).format('$00,00.00')
         opcion_iva.value=data.opcion_iva
         membresias.value=isNull(data.membresias)?[]:data.membresias.split(',').map(i=>parseInt(i))
         parentescos.value=isNull(data.parentescos)?[]:data.parentescos.split(',').map(i=>parseInt(i))
         genero_aplica.value=data.genero_aplica
         edad_aplica.value=data.edad_aplica
         acceso.value=data.obligatoria_acceso
         limite_pago.value=data.limite_pago
         veces_aplica.value=data.veces_aplicar
         if(data.veces_aplicar>0)check_veces_aplica.value=true
         editable.value=data.editable
         carga_automatica.value=data.carga_automatica
         if(data.carga_automatica===1)
         {
           ciclo.value=data.ciclo
           tipo_ciclo.value=data.tipo_ciclo
           fecha_vigor.value=data.fecha_entrar_vigor
         }
         recargo_aplica.value=data.aplicar_recargo        
         if(data.aplicar_recargo===1)
         {
           recargo_unico.value=data.recargo_unico
           recargo_cantidad.value=data.cantidad_recargo
           recargo_cada.value=data.recargo_cada
           mes_siguiente.value=data.recargo_siguiente_mes
         }
         getCuotaByClave();//ejecuta para buscar en el servicio de compaq
      //  }
     } catch (error) {
       
     }

    }

    const  saveOrUpdate=throttle(()=> {
      let dataSend = {
        clave: clave.value,
        numero_cuota:numero_cuota.value,
        cuota: cuota.value,
        importe: numeral(importe.value).value(),
        opcion_iva: opcion_iva.value,
        tipo_cuota: tipo_cuota.value,
        parentescos: parentescos.value,
        membresias: membresias.value,
        genero_aplica: genero_aplica.value,
        edad_aplica: edad_aplica.value,
        acceso: acceso.value,
        limite_pago: limite_pago.value,
        veces_aplica: veces_aplica.value,
        carga_automatica: carga_automatica.value,
        ciclo: ciclo.value,
        tipo_ciclo: tipo_ciclo.value,
        fecha_vigor: fecha_vigor.value,
        recargo_aplica: recargo_aplica.value,
        recargo_unico: recargo_unico.value,
        recargo_cantidad: numeral(recargo_cantidad.value).value(),
        recargo_cada:recargo_cada.value,
        editable: editable.value,
        mes_siguiente:mes_siguiente.value
      };
      if (props.cve_cuota === 0 && producto_servicio>0) guardar(dataSend);
      else if (props.cve_cuota >0 && producto_servicio>0)actualizar(props.cve_cuota,dataSend);
      else {
        mensaje_alerta.value="No se cuenta con el codigo de servicio o producto de comercial"
        snackbar_color.value="warning"
        snackbar.value=true
      }

      console.log(dataSend);
    },2000)

    async function guardar(send) {

       try {
        //  let {data,status}=await $axios.post('cuotas',send);
         const data=await setCreateConceptoService(send);
        //  if(status===200 && data>0){           
           mensaje_alerta.value='Cuota guardado con exito'
           snackbar_color.value='success'
           snackbar.value=true
        //  }
       } catch (error) {
         if(error.response.status===422)
         {
           mensaje_alerta.value='campos requeridos faltantes revisar y llenar'
           snackbar_color.value='warning'
           snackbar.value=true
         }
         else{
           mensaje_alerta.value='Ocurrio un error intentarlo de nuevo'
           snackbar_color.value='error'
           snackbar.value=true
         }
       }

    }

    async function actualizar(id,send) {

        try {
        //  let {data,status}=await $axios.put(`cuotas/${id}`,send);
        const data=await setUpdateConceptoService(id,send)
        //  if(status===200 && data>0){           
           mensaje_alerta.value='Cuota actualizada con exito'
           snackbar_color.value='info'
           snackbar.value=true
        //  }
       } catch (error) {
         if(error.response.status===422)
         {
           mensaje_alerta.value='campos requeridos faltantes revisar y llenar'
           snackbar_color.value='warning'
           snackbar.value=true
         }
         else{
           mensaje_alerta.value='Ocurrio un error intentarlo de nuevo'
           snackbar_color.value='error'
           snackbar.value=true
         }
       }

    }

    async function getMembresias() {
      try {
        // let { data, status } = await $axios_legal.get("/tipo-accion");
        
        // if (status === 200) 
        lst_membresias.value = await getMembresiasService();
      } catch (error) {}
    }

    async function getParentescos() {
      try {
        // let { data, status } = await $axios_legal.get("/parentescos");
        // if (status === 200) 
        lst_parentescos.value = await getParentescoService();
      } catch (error) {}
    }

    async function getCuotaByClave(){
      try {
        load_servicio.value=true
        // let {data,status}=await $axios_compaq.get(`/productos/${clave.value}`)
        const data=await getProductoByClaveCompaqService(clave.value);
        if(isNull(data)){
          msg_servicio.value=`No Hay Servicio con Clave ${clave.value}`;
          producto_servicio=null;
          cuota.value="";
          importe.value="";
          }
        else {
          producto_servicio=data.codigo_prod_serv;
          msg_servicio.value=data.nombre_prod_serv;
          if(props.cve_cuota===0){
          cuota.value=data.nombre_prod_serv;
          importe.value=numeral(round(numeral(data.precio).value(),2)).format("$00,00.00")
          }//fin if de valida props accion es para cuando sea guardar
          }
      } catch (error) {
        
        }
      finally{
        load_servicio.value=false
      }
    }

    async function findCuotas(){
       try {
        load_servicio.value=true
        // let {data,status}=await $axios_compaq.get(`/productos`)        
        lst_prod_serv.value=await getAllProductoCompaqService();
        dialog.value=true
      } catch (error) {
        
        }
      finally{
        load_servicio.value=false
      }
    }

    function selectedServicio(clavex){
        clave.value=clavex
        let producto=lst_prod_serv.value.find(i=>i.codigo_prod_serv==clavex)
        msg_servicio.value=producto.nombre_prod_serv
        producto_servicio=clavex;
        cuota.value=producto.nombre_prod_serv;
        importe.value=numeral(round(numeral(producto.precio).value(),2)).format("$00,00.00")
        dialog.value=false
    }

    //#endregion

</script>
<style>
   .active_genero{
     background-color:var(--v-primary-base)!important;
   }

   .active_genero > span >i{
     color:white!important;
   }

   .my-mayus input{
  text-transform: uppercase
}
</style>
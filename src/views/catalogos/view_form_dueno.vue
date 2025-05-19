<template>
<v-card>
    <v-toolbar color="secondaryx" elevation="0" class="pv-toolbar-socios">
      <v-toolbar-items
        ><v-btn @click="Regresar" color="secondaryx" elevation="0"
          ><v-icon>mdi-arrow-left-thick</v-icon>
        </v-btn></v-toolbar-items
      >
      <v-toolbar-title class="text-h4 ml-10 accent--text">
        accion: {{ accion_text }} </v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-select
        v-if="cve_socio === 0"
        clearable
        label="Posiciones disponibles"
        v-model="nueva_posicion"
        :items="lst_posicion"
        item-value="id"
        item-text="nombre"
        filled
        :hide-details="!iErrors.posicion"
        style="max-width: 250px"
        :error-messages="iErrors.posicion"
      ></v-select>
    </v-toolbar>
    <v-card-text>
      <h1 class="accent--text mb-2">Datos Personales</h1>
      <v-divider inset></v-divider>
  <!-- <v-container>
    <v-row>
      <v-col lg="3">
        <v-chip class="ma-2" @click="Regresar" color="teal" text-color="white">
          <v-avatar left>
            <v-icon>mdi-arrow-left</v-icon>
          </v-avatar>
          <h2>{{accion_text}}</h2>
        </v-chip>
      </v-col>
      <v-col>{{titulo}}</v-col>
    </v-row>
    <h3 class="accent--text">Datos Personales</h3> -->
    <v-row wrap class="mt-5">
      <v-col>
        <v-text-field
          label="Nombre"
          v-model="nombre"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="paterno"
          label="Apellido Paterno"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="materno"
          label="Apellido Materno"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <label class="accent--text">Genero</label>
        <v-radio-group
          v-model="genero"
          row class="mt-0"
        >
          <v-radio label="Femenino" color="primary" :value="2"></v-radio>
          <v-radio label="Masculino" color="primary" :value="1"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      
      <v-col>
            <v-text-field
              v-model="fecha_nac"
              label="Fecha de nacimiento"
              prepend-inner-icon="mdi-calendar"
              v-mask="'####-##-##'"
              filled
            ></v-text-field>
      </v-col>
      
      <v-col>
        <v-select
          :items="lst_nacionalidad"
          item-value="cve_pais"
          item-text="nombre"
          v-model="cve_pais"
          label="Nacionalidad"
          filled
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field
          v-model="curp"
          label="CURP"
          v-mask="'AAAA######XXXXXXXX'"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="rfc"
          label="RFC"
          v-mask="'AAAA######XXX'"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
    </v-row>

<h3 class="accent--text">Datos Contacto y Domicilio</h3>

    <v-row >
      <v-col lg="3">
        <v-text-field
              v-model="fecha_adquisicion"
              label="Fecha de adquisición"
              prepend-inner-icon="mdi-calendar"
              v-mask="'####-##-##'"
              filled
            ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field v-mask="'###-###-####'" v-model="telefono" label="Teléfono" filled></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          v-mask="'###-###-####'"
          v-model="celular"
          label="Celular"
          filled
        ></v-text-field>
      </v-col>
      
    </v-row>
    <v-row>
      <v-col lg="5">
        <v-text-field
          v-model="calle"
          label="Calle"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="num_ext"
          maxlength="6"
          label="Número exterior"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="num_int"
          maxlength="6"
          label="Número interior"
          class="my-mayus"
          filled
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-mask="'#####'"
          @keyup="Colonias"
          maxlength="5"
          v-model="cp"
          label="Código postal"
          filled
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          :items="lst_colonias"
          return-object
          item-value="cve_colonia"
          item-text="nombre"
          v-model="colonia_seleccionada"
          v-on:input="changeColonia(`${colonia_seleccionada}`)"
          label="Colonias"
          filled
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field :disabled="true" v-model="municipio" label="Municipio" class="my-mayus" filled></v-text-field>
      </v-col>
      <v-col>
        <v-text-field :disabled="true" v-model="estado" label="Estado" class="my-mayus" filled></v-text-field>
      </v-col>
    </v-row>
   


    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
    
        <v-btn v-if="cve_dueno===0 && cve_accion>0" color="success" @click="Guardar"> <v-icon>mdi-content-save</v-icon> Guardar</v-btn>
  
     
        <v-btn v-else color="info" @click="Modificar"> <v-icon>mdi-pencil</v-icon> Modificar información</v-btn>
     
    </v-card-actions>
  </v-card>
    
  <!-- </v-container> -->
</template>

<script setup>


import { onMounted, ref ,watch,getCurrentInstance} from 'vue';
import {getNacionalidadesService,getColoniasByCpService} from '@/services/domicilio_service'
import {setAccionistaService,updateAccionistaService,getAccionistaByIdService} from '@/services/accionistas_service'

import isPlainObject from 'lodash/isPlainObject'

const props=defineProps({
    cve_accion: {
      type: Number,
      default: 0
    },
    cve_dueno: {
      type: Number,
      default: 0
    },
    accion_text:{
      type:String,
      default:''
    }})


    const root=getCurrentInstance().proxy

    const cve_accion_l=0
    const cve_dueno_l=0
    const nombre =ref('')
    const paterno =ref('')
    const materno =ref('')
    const genero =ref('')
    const fecha_nac =ref('')
    const cve_pais =ref(121)
    const curp =ref('')
    const rfc =ref('')
    const calle =ref('')
    const num_ext =ref('')
    const num_int =ref('')
    const cve_colonia =ref('')
    const celular =ref('')
    const telefono =ref('')
    const expediente =ref('')
    const estado_civil =ref('')
    const lst_nacionalidad=ref([])
    const lst_colonias=ref([])
    const cp=ref('')
    const detalle_accion=ref([])
    const colonia_seleccionada=ref([])
    const municipio=ref('')
    const estado=ref('')
    const titulo =ref('')
    const fecha_adquisicion=ref('')


    onMounted(()=>{
      
      if(props.cve_dueno>0)CargarDueno();
      Nacionalidad()
      })
    

    async function Nacionalidad() {
      lst_nacionalidad.value = [];
      // let {data}= await $axios.get("domicilios/nacionalidades")
      const data=await getNacionalidadesService()
      lst_nacionalidad.value = data;
    }

    async function Colonias() {
      lst_colonias.value = [];
      if (cp.value.length >= 5) {
        // let {data}= await $axios.get("domicilios",{params:{cp:cp.value}})
        const data=await getColoniasByCpService(cp.value)
        lst_colonias.value = data;
      }
    }

    
    function changeColonia() {
      cve_colonia.value = colonia_seleccionada.value.cve_colonia;
      municipio.value = colonia_seleccionada.value.municipio;
      estado.value = colonia_seleccionada.value.estado;
    }

    async  function Guardar() {
         
          const dataSend={
    nombre:nombre.value,
    apellido_paterno:paterno.value,
    apellido_materno:materno.value,
    sexo:genero.value,
    fecha_nacimiento:fecha_nac.value,
    cve_pais:cve_pais.value,
    curp:curp.value,
    rfc:rfc.value,
    estado_civil:estado_civil.value,
    calle:calle.value,
    numero_exterior:num_ext.value,
    numero_interior:num_int.value,
    cve_colonia:cve_colonia.value,
    celular:celular.value,
    telefono:telefono.value,
    expediente:expediente.value,
    fecha_adquisicion:fecha_adquisicion.value,
    cve_accion:props.cve_accion
}

          // let {data}=await $axios.post("accionistas",dataSend);
          const data=await setAccionistaService(dataSend)

              if (eval(data) > 0) {
                //detalle_accion.cve_dueno = data;
                  root.$toast.success("Guardado correctamente");
                  await new Promise(resolve=>setTimeout(resolve,2000))
                
                    root.$router.replace({
                      name: "detalle",
                      params: { accion: detalle_accion.value }
                    })
              } else {
                root.$toast.error("Hubo un error, recarga el sitio he intenta de nuevo");
              }
    }


      async function Modificar() {
         
         const dataSend={
    nombre:nombre.value,
    apellido_paterno:paterno.value,
    apellido_materno:materno.value,
    sexo:genero.value,
    fecha_nacimiento:fecha_nac.value,
    cve_pais:cve_pais.value,
    curp:curp.value,
    rfc:rfc.value,
    estado_civil:estado_civil.value,
    calle:calle.value,
    numero_exterior:num_ext.value,
    numero_interior:num_int.value,
    cve_colonia:cve_colonia.value,
    celular:celular.value,
    telefono:telefono.value,
    expediente:expediente.value,
    fecha_adquisicion:fecha_adquisicion.value,
    cve_accion:props.cve_accion
}

          // let {data}= await $axios.put(`accionistas/${props.cve_dueno}`,dataSend)
          const data=await updateAccionistaService(props.cve_dueno,dataSend)
            
              if (eval(data) == 1) {
                root.$toast.info("Modificado correctamente");
    
    await new Promise(resolve=>setTimeout(resolve,3000))

                    root.$router.replace({
                      name: "AccionDetalle",
                      params: { cve_accion: props.cve_accion }
                    })
              } else {
                root.$toast.error("Hubo un error, recarga el sitio he intenta de nuevo");
              }
    }

    function Limpiar() {
      //this.dueno.Limpiar_dueno();
      cp.value = "";
      lst_colonias.value = [];
    }

    function Regresar() {
      root.$router.replace({name: "AccionDetalle",params: { cve_accion: props.cve_accion}});
    }


    async function CargarDueno() {
      // let {data}= await $axios.get(`accionistas/${props.cve_dueno}`);
      const data=await getAccionistaByIdService(props.cve_dueno)
         
          if (isPlainObject(data)) {
            nombre.value = data.nombre;
            paterno.value = data.apellido_paterno;
            materno.value = data.apellido_materno;
            curp.value=data.curp
            rfc.value = data.rfc;
            genero.value = data.sexo;
            fecha_nac.value = data.fecha_nacimiento;
            fecha_adquisicion.value = data.fecha_adquisicion;
            cve_pais.value = data.cve_pais;
            telefono.value = data.telefono;
            celular.value = data.celular;
            cp.value = data.cp;
            calle.value = data.calle;
            num_ext.value = data.numero_exterior;
            num_int.value = data.numero_interior;
            cve_colonia.value = data.cve_colonia;
            colonia_seleccionada.value.cve_colonia = data.cve_colonia;
            municipio.value = data.municipio;
            estado.value = data.estado;
            Colonias();            
            
          } else {
          
            root.$toast.warning("Revisar la relación de los datos, contacta a soporte técnico");
          }
          
    }
  
</script>

<style>
.pv-toolbar-socios .v-toolbar__content {
  padding-left: 0 !important;
}
</style>
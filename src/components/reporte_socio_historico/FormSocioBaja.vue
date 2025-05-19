<template>
  <v-container>
    <!-- <v-row wrap>
      <v-col md="2">
        <v-chip class="my-5 elevation-5" @click="Regresar" color="teal" text-color="white">
          <v-avatar left>
            <v-icon>mdi-arrow-left</v-icon>
          </v-avatar>
          <h2>
          {{accion_text}}
          </h2>
        </v-chip>
      </v-col>
      <v-col md="2"  v-if="cve_socio===0">
        <v-select
            clearable
            label="Posiciones disponibles"
            v-model="nueva_posicion"
            :items="lst_posicion"
            item-value="id"
            item-text="nombre"
          ></v-select>
          
      </v-col>
      <v-col lg="2" v-else>
        <v-text-field readonly="readonly" label="Posicion" v-model="posicion" />
      </v-col>
    </v-row> -->
    <h3 class="accent--text">Datos Personales</h3>
    <v-row >
      <v-col cols="3"><v-text-field v-model="numero_accion" label="accion"></v-text-field></v-col>
    </v-row>
    <v-row>
      <v-col lg="3">
        <v-text-field label="Nombre" v-model="nombre" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Apellido Paterno" v-model="paterno" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Apellido Materno" v-model="materno" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <label class="accent--text">Genero</label>
        <v-radio-group row v-model="genero" class="mt-0">
          <v-radio label="Masculino" color="primary" :value="1"></v-radio>
          <v-radio label="Femenino" color="primary" :value="2"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col lg="3">
        <!-- <v-menu
          ref="menu"
          v-model="modalDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }"> -->
            <v-text-field
              v-model="fecha_nac"
              label="Fecha Nacimiento"
              prepend-inner-icon="mdi-calendar"
              v-mask="'####-##-##'"
             
            ></v-text-field>
          <!-- </template>
          <v-date-picker
            ref="picker"
            v-model="socio.fecha_nacimiento"
            :max="new Date().toISOString().substr(0, 10)"
            min="1950-01-01"
            @change="openDatePicker"
          ></v-date-picker>
        </v-menu> -->
      </v-col>
      <v-col lg="3">
         <v-text-field
              v-model="curp"
              label="Curp"
              v-mask="'AAAA######XXXXXXXX'"
              class="my-mayus"
            ></v-text-field>
      </v-col>
      <v-col lg="3">
         <v-text-field
              v-model="rfc"
              label="RFC"
              v-mask="'AAAA######XXX'"
              class="my-mayus"
            ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-select
          :items="lst_nacionalidad"
          item-value="cve_pais"
          item-text="nombre"
          v-model="cve_pais"
          label="Nacionalidad"
        ></v-select>
      </v-col>
      <v-col lg="3">
        <v-select
          label="Estado Civil"
          v-model="estado_civil"
          :items="['Casado','Soltero','Divorciado']"
        ></v-select>
      </v-col>
    </v-row>

   <h3 class="accent--text">Datos Contacto y Domicilio</h3>

    <v-row>
      <v-col lg="3">
        <v-text-field
          label="Celular"
          v-model="celular"
          prepend-inner-icon="mdi-cellphone-android"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          label="Telefoo"
          v-model="telefono"
          prepend-inner-icon="mdi-phone"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          v-model="calle"
          label="Calle"
          class="my-mayus"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          v-model="num_ext"
          maxlength="6"
          label="Número exterior"
          class="my-mayus"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          v-model="num_int"
          maxlength="6"
          label="Número interior"
          class="my-mayus"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          v-mask="'#####'"
          @keyup="Colonias"
          maxlength="5"
          v-model="cp"
          label="Código postal"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-select
           label="Colonia"
          :items="lst_colonias"
          return-object
          item-value="cve_colonia"
          item-text="nombre"
          v-model="colonia_seleccionada"
           v-on:input="changeColonia"
        ></v-select>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Correo" v-model="correo" prepend-inner-icon="mdi-at"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          label="Facebook"
          v-model="facebook"
          prepend-inner-icon="mdi-facebook-box"
          class="my-mayus"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field
          label="Instagram"
          v-model="instagram"
          prepend-inner-icon="mdi-instagram"
          class="my-mayus"
        ></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Twitter" v-model="twitter" prepend-inner-icon="mdi-twitter-box" class="my-mayus"></v-text-field>
      </v-col>
    </v-row>
    
    <h3 class="accent--text">Datos Complementarios</h3>

     <v-row>
      <v-col lg="3">
        <v-text-field label="Grado de Estudios" v-model="grado_estudio" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Institucion Academica" v-model="inst_escolar" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-select
          label="Profesion"
          v-model="cve_profesion"
          :items="lst_profesion"
          item-value="cve_profesion"
          item-text="nombre"
        ></v-select>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Institucion Laboral" v-model="inst_laboral" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Puesto ocupa" v-model="puesto_ejerce" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Experiencia" v-model="experiencia" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-text-field label="Giro de Institucion Laboral" v-model="giro_inst" class="my-mayus"></v-text-field>
      </v-col>
      <v-col lg="3">
        <v-select
          label="Parentesco"
          v-model="cve_parentesco"
          :items="lst_parentesco"
          item-value="cve_parentesco"
          item-text="nombre"
        ></v-select>
      </v-col>
      <v-col lg="3">
        <v-select
          label="Estado de acción"
          v-model="estado_accion"
          :items="lst_estado_accion"
          item-value="id"
          item-text="accion"
        ></v-select>
      </v-col>
     
      <v-col lg="3">
        <!-- <v-menu
          v-model="modalDate1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }"> -->
            <v-text-field
              v-model="fecha_alta"
              label="Fecha Alta Accion"
              prepend-inner-icon="mdi-calendar"
              v-mask="'####-##-##'"
               
              clearable
            ></v-text-field>
          <!-- </template>
          <v-date-picker v-model="socio.fecha_alta" @input="modalDate1 = false"></v-date-picker>
        </v-menu> -->
      </v-col>
      <v-col lg="3">
        <!-- <v-menu
          v-model="modalDate2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <template v-slot:activator="{ on }"> -->
            <v-text-field
              v-model="fecha_ingreso_club"
              label="Fecha Ingreso al Club"
              prepend-inner-icon="mdi-calendar"
              v-mask="'####-##-##'"
              
              clearable
            ></v-text-field>
          <!-- </template>
          <v-date-picker v-model="socio.fecha_ingreso_club" @input="modalDate2 = false"></v-date-picker>
        </v-menu> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="cve_socio===0" class="text-right">
        <v-btn color="success" @click="Guardar">Guardar</v-btn>
      </v-col>
      <v-col v-else class="text-right">
        <v-btn color="info" @click="Modificar">Modificar información</v-btn>
      </v-col>

      <v-col class="text-left">
        <v-btn color="error" @click="Limpiar">Limpiar</v-btn>
      </v-col>

    </v-row>
    <v-row>
      <v-col>
        <v-snackbar v-model="snackbar" :bottom="true" :multi-line="true" :color="color_mensaje">
          <div v-html="mensaje_alerta"></div>
          <v-icon color="white" @click="snackbar=false">mdi-close-circle</v-icon>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>

import { onMounted, ref ,inject,getCurrentInstance} from 'vue';
import isPlainObject from 'lodash/isPlainObject'
import forIn from 'lodash/forIn'
import {getColoniasByCpService,getNacionalidadesService} from '@/services/domicilio_service'
import {getProfesioncoService} from '@/services/profesion_service'
import {getParentescoService} from '@/services/parentesco_service'
import {getPosicionesByAccionService,createSocioService,updateSocioService,getSocioByIdService,saveReporteHistoricoSocioService} from '@/services/socios_service'


  const props=defineProps({
    cve_accion:{
      type: Number,
      default: 0
    },
    cve_socio: {
      type: [Number,String],
      default: 0
    },
    accion_text:{
      type:String,
      default:''
    }
  })
  
    const root=getCurrentInstance().proxy   
    const nombre=ref('')
    const paterno=ref('')
    const materno=ref('')
    const genero=ref(0)
    const fecha_nac=ref('')
    const cve_pais=ref(121)
    const curp=ref('')
    const rfc=ref('')
    const estado_civil=ref(0)
    const calle=ref('')
    const num_ext=ref('')
    const num_int=ref('')
    const cp=ref('')
    const cve_colonia=ref(null)
    const posicion=ref(null)   
    const celular=ref('')
    const telefono=ref('')
    const correo=ref('')
    const facebook=ref('')
    const instagram=ref('')
    const twitter=ref('')
    const grado_estudio=ref('')
    const inst_escolar=ref('')
    const inst_laboral=ref('')
    const puesto_ejerce=ref('')
    const experiencia=ref('')
    const giro_inst=ref('')
    const estado_accion=ref(null)
    const fecha_alta=ref('')
    const fecha_ingreso_club=ref('')
    const cve_profesion=ref(null)
    const cve_parentesco=ref(null)

    const lst_posicion=ref([])
    const nueva_posicion=ref(0)
    const lst_nacionalidad=ref([])
    const lst_colonias=ref([])
    const colonia_seleccionada=ref({})
    const lst_profesion=ref([])
    const lst_parentesco=ref([])
    const lst_estado_accion=ref([{id:1,accion:"Prestada"},{id:2,accion:"Rentada"},{id:3,accion:"Propia"}])
    const color_mensaje=ref('')
    const mensaje_alerta=ref('')
    const snackbar=ref(false)

    const numero_accion=ref('')

    let cve_persona=0
    let cve_direccion=0


    onMounted(()=>{
      Nacionalidad()
      getProfesion()
      getParentesco()
      PosicionesAccion()
      if(props.cve_socio>0)CargarSocio()
      })

      


    async function Nacionalidad() {
      lst_nacionalidad.value = [];
      // let {data}= await $axios.get("domicilios/nacionalidades")
      const data=await getNacionalidadesService()
      lst_nacionalidad.value = data
    }

    async function getProfesion() {
      try {
        // let { data } = await $axios.get('profesiones');
        const data=await getProfesioncoService()
        lst_profesion.value = data;
      } catch (e) {
        console.error(e);
      }
    }

    async function getParentesco() {
      try {
        // let { data } = await $axios.get('parentescos');
        const data=await getParentescoService()
        lst_parentesco.value = data;
      } catch (e) {
        console.error(e);
      }
    }

    async function PosicionesAccion() {
     
      // let {data}= await $axios.get('socios/posiciones',{params:{cve_accion:props.cve_accion}})
      const data=getPosicionesByAccionService(props.cve_accion)
      
         console.log('keys',Object.keys(data).length);

          if(Object.keys(data).length > 0){
            posicionesDisponibles(data);
          }else{
            lst_posicion.value.push({id:0,nombre: "Posición: 0"});
          }
      
    }

    function posicionesDisponibles(data) {
      lst_posicion.value = [];
      let posiciones_accion = [];
      let posiciones_array=[]
      let valor_mayor=0
      
      data.forEach((item, index)=>{
        posiciones_array.push(eval(item.posicion));
      });

      valor_mayor = Math.max.apply(null,posiciones_array);

      for (let i = 0; i < valor_mayor; i++) {
        posiciones_accion.push(0);
      }

      if (data.length > 0) {
        data.forEach((item, index) =>{posiciones_accion[item.posicion] = 1;});
      }

      for (let i = 0; i < posiciones_accion.length; i++) {
        if (posiciones_accion[i] == 0) {
          lst_posicion.value.push({id: i ,nombre: `Posición: ${i}`});
        }

        if (i == posiciones_accion.length - 1) {
          lst_posicion.value.push({
            id: posiciones_accion.length,
            nombre: `Posición:  ${( posiciones_accion.length)}`
          });
          break;
        }
      }
     
    }

    async function Colonias() {
      lst_colonias.value = [];
      if (cp.value.length >= 5) {
        // let {data}= await $axios.get("domicilios",{params:{cp:cp.value}})
        const data=await getColoniasByCpService(cp.value)
        lst_colonias.value = data;
      }
    }

    function Regresar() {
      root.$router.replace({name: "AccionDetalle",params: { cve_accion: props.cve_accion }});
    }

    function changeColonia(a) {
      cve_colonia.value = colonia_seleccionada.value.cve_colonia; 
    }

    async function Guardar() {
          //nueva_posicion;
          let dataSend={
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
    posicion:nueva_posicion.value,    
    celular:celular.value,
    telefono:telefono.value,
    correo:correo.value,
    facebook:facebook.value,
    instagram:instagram.value,
    twiter:twitter.value,
    grado_estudio:grado_estudio.value,
    institucion_escolar:inst_escolar.value,
    institucion_laboral:inst_laboral.value,
    puesto_ejerce:puesto_ejerce.value,
    experiencia:experiencia.value,
    giro_institucion:giro_inst.value,
    estado_accion:estado_accion.value,
    fecha_alta:fecha_alta.value,
    fecha_ingreso_club:fecha_ingreso_club.value,
    cve_accion:props.cve_accion,
    cve_profesion:cve_profesion.value,
    cve_parentesco:cve_parentesco.value
          }
          try{
          // let {data}=await $axios.post('socios',dataSend)
          const data=createSocioService(dataSend)
        
              if (eval(data) > 0) {
               
                mensaje_alerta.value = "Guardado correctamente";
                color_mensaje.value = "success";
                snackbar.value = true;
                // setTimeout(
                //   () =>
                //     root.$router.replace({
                //       name: "AccionDetalle",
                //       params: { cve_accion:props.cve_accion }
                //     }),
                //   2000
                // );
                GurdarHistorico(data)//se agrega para guardar el historico con la accion a la que pertenece...
              } else {
                mensaje_alerta.value =
                  "Hubo un error, recarga el sitio he intenta de nuevo";
                color_mensaje.value = "error";
                snackbar.value = true;
              }
          }
          catch(e){
            let mensajes='';
            console.log(e.response.data)
            forIn(e.response.data,(value,key)=>{
              console.log(value.join(' <br> '))
              mensajes+=value.join()+'<br>'
            })
            mensaje_alerta.value =mensajes;
                color_mensaje.value = "error";
                snackbar.value = true;
          }
    }

    async function Modificar() {

      let dataSend={
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
    // posicion:nueva_posicion.value,    
    celular:celular.value,
    telefono:telefono.value,
    correo:correo.value,
    facebook:facebook.value,
    instagram:instagram.value,
    twiter:twitter.value,
    grado_estudio:grado_estudio.value,
    institucion_escolar:inst_escolar.value,
    institucion_laboral:inst_laboral.value,
    puesto_ejerce:puesto_ejerce.value,
    experiencia:experiencia.value,
    giro_institucion:giro_inst.value,
    estado_accion:estado_accion.value,
    fecha_alta:fecha_alta.value,
    fecha_ingreso_club:fecha_ingreso_club.value,
    cve_profesion:cve_profesion.value,
    cve_parentesco:cve_parentesco.value,
    cve_persona:cve_persona,
    cve_direccion:cve_direccion
          }
         
          // let {data}=await $axios.put(`socios/${props.cve_socio}`,dataSend)
          const data=await updateSocioService(props.cve_socio,dataSend)
  
              if (eval(data) == 1) {
                mensaje_alerta.value = "Modificado correctamente";
                color_mensaje.value = "info";
                snackbar.value = true;
                
                setTimeout(
                  () =>
                    root.$router.replace({
                      name: "AccionDetalle",
                      params: { cve_accion: props.cve_accion }
                    }),
                  3000
                );
              } else {
                mensaje_alerta.value ="Hubo un error, recarga el sitio he intenta de nuevo";
                color_mensaje.value = "error";
                snackbar.value = true;
              }
    }

    async function CargarSocio() {
      // let {data}=await $axios.get(`socios/${props.cve_socio}`)
      const data=await getSocioByIdService(props.cve_socio)
            
          if (isPlainObject(data)) {
              cve_persona= data.cve_persona;
              cve_direccion= data.cve_direccion;

              nombre.value= data.nombre;
              paterno.value= data.apellido_paterno;
              materno.value= data.apellido_materno;
              genero.value= data.sexo
              fecha_nac.value= data.fecha_nacimiento;
              estado_civil.value= data.estado_civil;
              cve_pais.value= data.cve_pais;
              curp.value=data.curp;
              rfc.value=data.rfc
              cp.value = data.cp;
              calle.value= data.calle;
              num_ext.value= data.numero_exterior;
              num_int.value= data.numero_interior;
              cve_colonia.value= data.cve_colonia;
              colonia_seleccionada.value.cve_colonia = data.cve_colonia;
              inst_escolar.value= data.institucion_escolar;

              telefono.value= data.telefono;
              celular.value= data.celular;
              correo.value= data.correo_electronico;
              cve_profesion.value= data.cve_profesion;
              cve_parentesco.value= data.cve_parentesco;
              posicion.value= data.posicion;
              facebook.value= data.facebook;
              instagram.value= data.instagram;
              twitter.value= data.twiter;
              
              
              
              grado_estudio.value= data.grado_estudio;
              inst_escolar.value= data.institucion_escolar;
              inst_laboral.value= data.institucion_laboral;
              giro_inst.value= data.giro_institucion;
              puesto_ejerce.value= data.puesto_ejerce;
              experiencia.value= data.experiencia;
              estado_accion.value = data.estado_accion;
              fecha_alta.value= data.fecha_alta;
              fecha_ingreso_club.value= data.fecha_ingreso_club; 
              
              
              Colonias();
            
            
          } else {

            mensaje_alerta.value =
              "Revisar la relación de los datos, contacta a soporte técnico";
            color_mensaje.value = "error";
            snackbar.value = true;
          }
         
    }

    function Limpiar() {
      //this.socio.Limpiar_socio();
      cp.value = "";
      lst_colonias.value = [];
    }

    function openDatePicker(date) {
      $refs.menu.save(date);
    }

    async function GurdarHistorico(cve_socio){
          
      let n_accion = numero_accion.value;
      let clasificacion = 0;

      if (numero_accion.value.indexOf("A") > -1) {
        n_accion=numero_accion.value.substr(0,numero_accion.value.indexOf('A'))
        clasificacion = 1;
      } else if (numero_accion.value.indexOf("B") > -1) {
        n_accion=numero_accion.value.substr(0,numero_accion.value.indexOf('B'))
        clasificacion = 2;
      } else if (numero_accion.value.indexOf("C") > -1) {
        n_accion=numero_accion.value.substr(0,numero_accion.value.indexOf('C'))
        clasificacion = 3;
      }

          //  let {data}=await $axios.post('reporte-historico-socios',{numero_accion:n_accion,clasificacion,cve_socio})         
          const data=saveReporteHistoricoSocioService(n_accion,clasificacion,cve_socio)

    }

</script>
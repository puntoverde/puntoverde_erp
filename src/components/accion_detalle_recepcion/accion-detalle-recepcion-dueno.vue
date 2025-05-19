<template>
    <v-card pt="0" class="mx-auto" :outlined="true" :raised="true">
      <v-card-title class="d-flex justify-space-between accent--text">
        <h4 class="accent--text">Dueño</h4>        
      </v-card-title>
      <v-divider inset class="accent lighten-3"></v-divider>
      <v-card-text>
        <v-row row wrap>
          <v-col class>
            <v-list three-line>
              <template>
                <v-list-item>                  
                  <v-list-item-avatar size="100">
                    <v-img src="./../../assets/perfil.svg"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{nombre}} {{paterno}} {{materno}}</v-list-item-title>
                    <v-list-item-title>RFC: {{rfc}} </v-list-item-title>
                    <v-list-item-subtitle>Celular: {{celular}}</v-list-item-subtitle>
                    <v-list-item-subtitle>Dirección: {{calle}}, N. exterior: #{{num_ext}}, N. interior: #{{num_int}}, C.P.: {{cp}}</v-list-item-subtitle>
                    <v-list-item-subtitle>Fecha de adquisición: {{dayjs(fecha_adquisicion).format('DD/MM/YYYY')}}</v-list-item-subtitle>
                    <!-- cambio -->
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        {{dueno.cantidad}}
      </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import {getAccionistaByIdService} from '@/services/accionistas_service'
import dayjs from 'dayjs'

  const props=defineProps({
    cve_dueno: {type: Number,default:0}
  })

      const dueno=ref({})
      const nombre=ref('')
      const paterno=ref('')
      const materno=ref('')
      const rfc=ref('')
      const celular=ref('')
      const calle=ref('')
      const num_ext=ref('')
      const num_int=ref('')
      const cp=ref('')
      const fecha_adquisicion=ref('')      
      const foto=ref('')
      

      watch(()=>props.cve_dueno,()=>{
        getDueno()
      })



    async function getDueno(){
      // let {data}=await $axios.get(`accionistas/${props.cve_dueno}`);
      const data=await getAccionistaByIdService(props.cve_dueno)
      nombre.value = data.nombre;
      paterno.value= data.apellido_paterno
      materno.value = data.apellido_materno
      celular.value=data.celular
      rfc.value= data.rfc
      calle.value= data.calle
      num_ext.value= data.numero_exterior
      num_int.value= data.numero_interior
      cp.value= data.cp
      fecha_adquisicion.value= data.fecha_adquisicion
      foto.value=data.foto
    }

</script>
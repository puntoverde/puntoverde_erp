<template>
  <v-dialog v-model="dialog" fullscreen>
      <template v-slot:activator="{on,attrs}">
        <!-- <v-hover v-slot="{hover}">
          <v-btn style="background-color:white" fab x-small outlined :color="hover?'secondary':'accent'" v-on="on" v-bind="attrs"><v-icon size="24">mdi-account-clock</v-icon></v-btn>
        </v-hover> -->
        <v-list-item v-on="on" v-bind="attrs">
        <v-list-item-icon >
                  <v-icon>mdi-account-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Horario empleado</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
      </template>
    <v-card>
      <v-btn @click="dialog=false" block tile color="error"><v-icon>mdi-close</v-icon> Cerrar</v-btn>
      <v-card-title class="d-flex justify-space-between my-0">
        <div>
          <!-- <v-text-field
            v-model="nomina_reloj"
            prepend-inner-icon="mdi-account-clock-outline"
            label="numero en reloj checador"
          >
          </v-text-field> -->
         {{nombreColaborador}}
        </div>
        <div>
          <v-btn
            color="error"
            class="mr-5"
            outlined
            @click="dialog_full_delete=true"
            :disabled="disable"
            >Eliminar</v-btn
          >
          <v-btn color="primary" outlined @click="guardar" :disabled="disable"
            >Guardar</v-btn
          >
        </div>
        
      </v-card-title>
      <v-card-text class="my-0">
        <v-row>
          <v-col>
            <v-select
              label="Dia Entrada"
              v-model="diaEntrada"
              :items="dias"
              item-value="id"
              item-text="dia"
              multiple
              :disabled="disable"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip small v-if="index === 0">{{ item.dia }}</v-chip>
                <span v-if="index === 1">
                  +{{ diaEntrada.length - 1 }} dias</span
                >
              </template>
            </v-select></v-col
          >
          <v-col
            ><v-menu
              ref="menu_ref"
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="horaEntrada"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="horaEntrada"
                  label="Hora Entrada"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                  :disabled="disable"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu"
                v-model="horaEntrada"
                format="24hr"
                color="primary"
                full-width
                @click:minute="$refs.menu_ref.save(horaEntrada)"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col
            ><v-select
              label="Dia Salida"
              v-model="diaSalida"
              :items="dias"
              item-value="id"
              item-text="dia"
              multiple
              :disabled="disable"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip small v-if="index === 0">{{ item.dia }}</v-chip>
                <span v-if="index === 1">
                  +{{ diaSalida.length - 1 }} dias</span
                >
              </template>
            </v-select></v-col
          >
          <v-col>
            <v-menu
              ref="menu1_ref"
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="horaSalida"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="horaSalida"
                  label="Hora Salida"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                  :disabled="disable"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu1"
                v-model="horaSalida"
                format="24hr"
                color="primary"
                full-width
                @click:minute="$refs.menu1_ref.save(horaSalida)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-simple-table class="elevation-1">
          <!-- <table> -->
            <template>
            <thead>
              <tr>
                <th>Dia Entrada</th>
                <th>Hora Entrada</th>
                <th>Dia Salida</th>
                <th>Hora Salida</th>
                <th style="width:100px">Eliminar por dia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(hor, index) in lst_horario" :key="index">
                <td>{{ fDia(hor.dia_entrada) }}</td>
                <td>{{ hor.hora_entrada }}</td>
                <td>{{ fDia(hor.dia_salida) }}</td>
                <td>{{ hor.hora_salida }}</td>
                <td><v-btn color="error" outlined icon  small @click="eliminarpordia(hor.id_colaborador_horario)"><v-icon>mdi-delete</v-icon></v-btn></td>
              </tr>
            </tbody>
          <!-- </table> -->
            </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog_full_delete" width="500" persistent content-class="no-radius">
        <v-card tile>
            <v-card-title><v-icon>mdi-information</v-icon> Information</v-card-title>
            <v-card-text>
                <div class="orange lighten-4 pa-5">
                    Desea Eliminar todo el Horario del Colaborador en caso de Si presionar la opcion <b>[Aceptar]</b> en caso contrario presionar la opcion <b>[Cancelar]</b>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" depressed tile text @click="dialog_full_delete=false"><v-icon>mdi-close-box</v-icon>Cancelar</v-btn>
                <v-btn color="info" depressed  tile text @click="eliminar"><v-icon>mdi-check-circle</v-icon>Aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" color="warning warning--text text--darken-4">
        <v-icon class="mr-3">mdi-alert</v-icon><b style="font-size:18px">No Coincide en numero de dias entrada y salida...</b>
    </v-snackbar>
  </v-dialog>
</template>


<script setup>
import { ref, watch ,getCurrentInstance} from 'vue';
import {getColaboradorHorarioService,setColaboradorHorarioService,deleteColaboradorHorarioService,deleteColaboradorHorarioByDayService} from '@/services/colaborador_service'

  const props=defineProps({
      idColaborador:{type:[String,Number],default:0},
      nombreColaborador:{type:String,default:''}
      })

    const root=getCurrentInstance().proxy

    const nomina = ref("");
    const nomina_reloj = ref("");
    const empleado = ref({});
    const diaEntrada = ref([]);
    const horaEntrada = ref("");
    const diaSalida = ref([]);
    const horaSalida = ref("");
    const lst_horario = ref([]);
    const menu = ref(false);
    const menu1 = ref(false);
    const disable = ref(false);
    const dias = [
      { id: 1, dia: "Lunes" },
      { id: 2, dia: "Martes" },
      { id: 3, dia: "Miercoles" },
      { id: 4, dia: "Jueves" },
      { id: 5, dia: "Viernes" },
      { id: 6, dia: "Sabado" },
      { id: 7, dia: "Domingo" },
    ];

    const dialog=ref(false)
    const snackbar=ref(false)
    const dialog_full_delete=ref(false)

    
    

    async function getHorario()
    {
        try {
            // let {data,status}=await $axios.get(`/colaboradores-horario/${props.idColaborador}`)
            const data=await getColaboradorHorarioService(props.idColaborador)
            lst_horario.value=data
        } catch (error) {
            
        }
    }

    watch(dialog,(val)=>{
        if(val)getHorario()
        })

    async function guardar() {
      if (diaEntrada.value.length === diaSalida.value.length) {
          console.log(diaEntrada.value)
        let entrada = diaEntrada.value.sort().map((item, index) =>({dia_entrada:item,hora_entrada:horaEntrada.value}));
        let salida = diaSalida.value.sort().map((item, index) =>({dia_salida:item,hora_salida:horaSalida.value}));
        let dataSend=entrada.map((item,ind)=>Object.assign(item,salida[ind]))
        try {
            // let {data,status}=await $axios.post(`colaboradores-horario/${props.idColaborador}`,dataSend)
            const data=await setColaboradorHorarioService(props.idColaborador,dataSend)
            getHorario();
            console.log(data)
        } catch (error) {
            
        }
      }
      else{
          snackbar.value=true
      }
    }

    async function eliminar(){
           try {
              //  let {data,status}=await $axios.delete(`colaboradores-horario/${props.idColaborador}`)
              const data=await deleteColaboradorHorarioService(props.idColaborador)
               lst_horario.value=[]
               dialog_full_delete.value=false
           } catch (error) {
               
           }
    }

    async function eliminarpordia(id){
           try {
              //  let {data,status}=await $axios.delete(`colaboradores-horario/dia/${id}`)
              const data=deleteColaboradorHorarioByDayService(id)
               getHorario()
           } catch (error) {
               
           }
    }

   
  
      function  fDia(dia){
          let dias=['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']
          return dias[dia-1]
      }
  
</script>

<style scoped>

/deep/.no-radius{
    border-radius: 0;
}

</style>
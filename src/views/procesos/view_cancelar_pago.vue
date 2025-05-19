<template>
  <div>
    <v-card>
      <v-card-title> <h2 class="accent--text">Buscar Pago ha Cancelar</h2></v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="Folio" v-model="folio" v-mask="'######'" dense hide-details></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Accion" dense hide-details v-model="accion" v-mask="accionMask"></v-text-field>
          </v-col>
          <v-col>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="date"
                  label="Dia"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  dense
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="menu = false" color="primary"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <div class="d-flex">
              <v-btn color="primary" class="mr-2" @click="buscarPago">
                <v-icon>mdi-magnify</v-icon>Buscar
              </v-btn>
              <v-btn color="primary" @click="cancelar">
                <v-icon>mdi-close</v-icon>Cancelar
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mt-2">
      <v-card-title class="d-flex justify-space-between accent--text">
        <h3>Desccripcion del pago</h3>
        <div class="ml-10" style="width:300px!important">
          <v-select label="Selecciona pago" v-if="masDeunCargo.length>1" :items="masDeunCargo" return-object v-model="cargoSelected" @change="mostrarPago">
            <template v-slot:selection="{item,index}">                            
              Pago con folio:{{item.folio}}
            </template>
            <template v-slot:item="{ item, index }">
              <v-chip class="mr-2">
                <span>{{ item.folio}}</span> 
              </v-chip>
              <span class="accent--text caption display-2"> {{/*item.accion*/}} ( {{item.fecha_hora_cobro}})</span>
            </template>
          </v-select>
        </div>
        <v-btn color="primary" @click="dialog=true" :disabled="idpago==0">Cancelar Pago</v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-list elevation="7">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Accion</v-list-item-title>
                  <v-list-item-subtitle>{{accionText}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Folio</v-list-item-title>
                  <v-list-item-subtitle>{{folioText}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Fecha Pago</v-list-item-title>
                  <v-list-item-subtitle>{{ dayjs(fechaText).format("DD-MM-YYYY hh:mm:ss")}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Cajero</v-list-item-title>
                  <v-list-item-subtitle>{{cajeroText}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col>
            <v-simple-table class="elevation-7">
              <template v-slot:default>
                <thead>
                  <tr class="accent">
                    <th class="white--text title">Clave</th>
                    <th class="white--text title">Concepto</th>
                    <th class="white--text title">Periodo</th>
                    <th class="white--text title">Cantidad</th>
                  </tr>
                </thead>
                <tbody >
                  <tr v-for="(cargo,index) in cargos" :key="index" style="border:2px solid #d1d1d1">
                    <td class="title">{{cargo[0]}}</td>
                    <td class="title">{{cargo[1]}}</td>
                    <td class="title">{{cargo[2]}}</td>
                    <td class="title">{{numeral(cargo[3]).format('$0,0.00')}}</td>
                  </tr>
                </tbody>
                <tfoot >
                  <tr style="border-top:1px solid #d3d3d3">
                    <td colspan="2"></td>
                    <td class="title accent--text">Descuento</td>
                    <td class="title">{{numeral(cDescuento).format('$0,0.00')}}</td>
                  </tr>
                  <tr>
                    <td colspan="2"></td>
                    <td class="title accent--text">Total</td>
                    <td class="title">{{numeral(cTotal).format('$0,0.00')}}</td>
                  </tr>
                </tfoot>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" width="500" persistent>
      <v-card >
        <v-card-title class="alert-border">info</v-card-title>
        <v-card-text class="alert-border">
          <h3 class="accent--text"> Desea Realmente Cancelar el pago con folio <span class="black--text font-weight-bold">{{folioText}}</span></h3>
        <v-textarea v-model="motivo" label="Motivo de Cancelacion..."></v-textarea>
        </v-card-text>
        <v-card-actions class="alert-border">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="dialog=false,motivo=''">Cancelar</v-btn>
          <v-btn color="info" @click="cancelarPago" :disabled="motivo=='' || motivo.length<5">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-snackbar
      v-model="alert"
      color="primary"
    >
      Pago Eliminado Correctamente

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="alert = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script setup>

import { computed,ref ,getCurrentInstance} from 'vue';
import numeral from 'numeral'
import dayjs from 'dayjs'
import {getPagosHaCancelarService,setCancelarPagosService} from '@/services/pagos_service'


    const root=getCurrentInstance().proxy

      const idpago=ref(0)
      const folio=ref('')
      const accion=ref('')
      const date=ref(null)
      const menu=ref(false)
      const accionMask=ref({
        mask: "FFFFF",
        tokens: {
          F: {
            pattern: /[0-9a-zA-Z]/,
            transform(v) {
              return v.toLocaleUpperCase();
            }
          }
        }
       })
      const folioText=ref('')
      const accionText=ref('')
      const fechaText=ref('')
      const cajeroText=ref('')
      const cargos=ref([])
      const cargoSelected=ref({})
      const masDeunCargo=ref([])
      const dialog= ref(false)
      const alert= ref(false)
      const motivo=ref('')

      const cTotal=computed(()=> cargos.value.map(item => parseFloat(item[3])-parseFloat(item[4])).reduce((reductor, value) => reductor + value, 0))
      const cDescuento=computed(()=>cargos.value.map(item => parseFloat(item[4])).reduce((reductor, value) => reductor + value, 0))

      async function buscarPago() {
      let numero_accion = 0;
      let clasificacion = 0;

      let tripartida = /[ABC]/.exec(accion.value);

      if (Array.isArray(tripartida)) {
        numero_accion = accion.value.substr(0, tripartida.index);
        clasificacion = tripartida.map(item => {
          switch (item) {
            case "A":
              return 1;
              break;
            case "B":
              return 2;
              break;
            case "C":
              return 3;
              break;
            default:
              0;
              break;
          }
        })[0];
      } else numero_accion = isNaN(accion.value) ? 0 : accion.value;

        const data=await getPagosHaCancelarService(numero_accion,clasificacion,folio.value,date.value)
          
          if(data.length==0)
          {
            idpago.value=0;
            folioText.value = '';
            accionText.value = '';
            fechaText.value = '';
            cajeroText.value = '';
            cargos.value = [];
            masDeunCargo.value = [];
          }
          else if (data.length == 1) {
            idpago.value=parseInt(data[0].idpago);
            folioText.value = data[0].folio;
            accionText.value = data[0].accion;
            fechaText.value = data[0].fecha_hora_cobro;
            cajeroText.value = data[0].cjero;
            let cargosx = data[0].cargos.split("--");
            cargos.value = cargosx.map(i => i.split(","));
          } else {
            masDeunCargo.value = data;
          }
    }

     function cancelar() {
            idpago.value=0;
            folio.value=''
            accion.value=''
            date.value=null
            folioText.value = '';
            accionText.value = '';
            fechaText.value = '';
            cajeroText.value = '';
            cargos.value = [];
            masDeunCargo.value = [];
            cargoSelected.value={}
            motivo.value=''
    }

    function mostrarPago(){
      idpago.value=cargoSelected.value.idpago;
      folioText.value = cargoSelected.value.folio;
      accionText.value = cargoSelected.value.accion;
      fechaText.value = cargoSelected.value.fecha_hora_cobro;
      cajeroText.value = cargoSelected.value.cjero;
      let cargosx = cargoSelected.value.cargos.split("--");
      cargos.value = cargosx.map(item => item.split(","));
    }

     async function cancelarPago()
    {
      const cve_persona=root.$ls.get('user',{cve_persona:0}).cve_persona
      const data=await setCancelarPagosService(idpago.value,accionText.value,cve_persona,motivo.value)
      if(data==1){
        dialog.value=false
        alert.value=true
        cancelar();
        }
    }

   
</script>

<style>
.alert-border{
border-left-width: 5px;
border-left-style: solid;
border-left-color: var(--v-primary-base);
}
</style>
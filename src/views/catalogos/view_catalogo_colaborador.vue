<template>
  <div>
    <div class="d-flex align-center justify-space-between">
    
      <h1 class="accent--text oswald--text">Alta Colaborador</h1>
      <v-chip>
        <h5>v 1.1</h5>
      </v-chip>
    </div>

    <div class="d-flex justify-space-between mb-5">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn :outlined="attrs['aria-expanded'] == 'true'" color="primary" v-on="on" v-bind="attrs" fab small dark
            elevation="1" @click="show_form = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Dar alta colaborador</span>
      </v-tooltip>

      <Search v-model="search" :filters="filters" @emit-buscar="getColaboradores">
        <template v-slot:estatus="{ data }">
          <v-btn-toggle v-model="data.value" style="min-width:100%" color="primary">
            <v-btn value="1" style="min-width:50%"><v-icon>mdi-check</v-icon> Activo</v-btn>
            <v-btn value="0" style="min-width:50%"><v-icon>mdi-close</v-icon> Inactivo</v-btn>
          </v-btn-toggle>
        </template>
      </Search>
    </div>

    <v-data-table :headers="headers" :items="lst_colaboradores" :search="search" :page.sync="page"
      :items-per-page="itemsPerPage" @page-count="pageCount = $event" class="table-pv rounded-xl elevation-5"
      hide-default-footer>
      <template v-slot:top="{ pagination }">
        <div class="d-flex justify-end align-center">
          <span class="mr-2 text-caption">filas por pagina</span>
          <v-select v-model="itemsPerPage" dense hide-details style="max-width: 50px" :items="[5, 10, 50]" />
          <span class="mx-2 text-caption">pagina {{ pagination.page }} de {{ pagination.pageCount }}</span>
          <v-pagination circle :total-visible="0" v-model="page" :length="pagination.pageCount"></v-pagination>
        </div>
      </template>

      <template v-slot:footer="{ props }">
        <div>{{ props.pagination.itemsLength }} registro(s)</div>
      </template>

      <template v-slot:item.empleado="{ item }">
        <span>{{ item.nombre }}</span>
        <span class="font-weight-bold mx-1">{{ item.paterno }}</span>
        <span class="font-italic">{{item.materno }}</span>
      </template>

      <template v-slot:item.fecha_ingreso="{ value }">
        <span class="font-weight-bold accent--text">{{ dayjs(value).format('DD [de] MMMM [de] YYYY') }}</span>
      </template>


      <template v-slot:item.estatus="{ value }"> 
        <v-icon v-if="value==0" color="error">mdi-close-circle-outline</v-icon>
        <v-icon v-if="value==1" color="success">mdi-check-circle-outline</v-icon>
        <v-icon v-if="value==2" color="warning">mdi-check-underline-circle-outline</v-icon>
        <v-icon v-if="value==3" color="success">mdi-check-circle</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">

        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs"><v-icon>mdi-dots-vertical</v-icon></v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item  @click="fnOpenBeneficiario(item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Beneficiario</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="fnOpenEscolaridad(item.id_colaborador)">

                <v-list-item-icon >
                  <v-icon>mdi-account-school</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Escolaridad</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="getColaborador(item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-account-edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Editar Empleado</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
                <Horario :nombreColaborador="item.empleado" :idColaborador="item.id_colaborador" />
              
              <v-list-item v-if="['1','2','3'].includes(item.estatus)" @click="addJefeDepartamento(item.id_departamento, item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-account-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Asignar jefe de area</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="['1','2','3'].includes(item.estatus)" @click="bajaColaborador(item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-account-cancel</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Baja empleado</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-else @click="reingresoColaborador(item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-account-reactivate</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Reingreso empleado</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="fnOpenExpediente(item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-folder-account-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Expediente empleado</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="fnHistoricoColaboradorPermanencia(item.id_colaborador)">
                <v-list-item-icon>
                  <v-icon>mdi-calendar-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Historico empleado</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        
      </template>
    </v-data-table>

    <v-dialog v-model="show_form" width="800" persistent scrollable content-class="rounded-xl">
      <v-card class="mb-5x" rounded="xl" >
        <v-toolbar color="white" dark elevation="0">
          <v-toolbar-title class="secondary--text"> Formulario Alta de Empleado </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="cancelar" icon color="secondary"> <v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-divider></v-divider>
        <!-- <div class="secondary pt-1"></div> -->
        <v-card-text class="pt-8">
          <v-row>
            <v-col cols="12" md="4"><v-text-field v-model="nombre" dense hide-details label="Nombre"
                class="my-mayus" filled :error-messages="iErrors.nombre"></v-text-field></v-col>

            <v-col cols="12" md="4"><v-text-field v-model="paterno" dense hide-details label="Apellido Paterno"
                class="my-mayus" filled :error-messages="iErrors.paterno"></v-text-field></v-col>

            <v-col cols="12" md="4"><v-text-field v-model="materno" dense hide-details label="Apellido Materno"
                class="my-mayus" filled :error-messages="iErrors.materno"></v-text-field></v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0" cols="12" md="6">
              <label>Genero</label>
              <v-radio-group v-model="genero" row hide-details class="mt-0" :error-messages="iErrors.genero">
                <v-radio color="primary" label="Masculino" value="Masculino"></v-radio>
                <v-radio color="primary" label="Femenino" value="Femenino"></v-radio>
              </v-radio-group>
            </v-col>

            <v-col cols="12" md="6">
              <v-menu ref="menu" v-model="menu_date" :close-on-content-click="false" transition="scale-transition"
                offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-bind="attrs" v-on="on" :value="Boolean(fecha_nac)?dayjs(fecha_nac).format('DD [de] MMMM [de] YYYY'):''" dense hide-details label="Fecha Nacimiento"
                    prepend-inner-icon="mdi-calendar" filled :error-messages="iErrors.fecha_nac"></v-text-field>
                </template>
                <v-date-picker v-model="fecha_nac" :active-picker.sync="activePicker" :max="new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .substr(0, 10)
                  " min="1950-01-01" @change="save" locale="es-mx"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" md="6"><v-text-field v-model="curp" dense hide-details label="CURP"
                class="my-mayus" filled :error-messages="iErrors.curp"></v-text-field></v-col>

            <v-col cols="12" md="6"><v-text-field v-model="rfc" dense hide-details label="RFC"
                class="my-mayus" filled :error-messages="iErrors.rfc"></v-text-field></v-col>

            <v-col cols="12" md="6"><v-select v-model="estado_civil" :items="[
              'Soltero',
              'Casado',
              'Divorciado',
              'Union Libre',
              'Viudo',
            ]" dense hide-details label="Estado Civil" class="my-mayus" filled :error-messages="iErrors.estado_civil"></v-select></v-col>
            <v-col cols="12" md="6">
              <v-select label="Departamento" dense hide-details v-model="id_departamento" :items="lst_departamentos"
                item-value="id_departamento" item-text="nombre" @change="getAreas($event)" filled :error-messages="iErrors.id_departamento">
              </v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-select label="Areas" dense hide-details v-model="id_area" :items="lst_areas" item-value="id_area_rh"
                item-text="nombre" filled :error-messages="iErrors.id_area">
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col ols="12" md="6"><v-text-field v-model="calle" dense hide-details label="Calle"
                class="my-mayus" filled :error-messages="iErrors.calle"></v-text-field></v-col>

            <v-col cols="12" md="3"><v-text-field v-model="num_ext" dense hide-details label="Num Exterior"
                class="my-mayus" filled :error-messages="iErrors.num_ext"></v-text-field></v-col>

            <v-col cols="12" md="3"><v-text-field v-model="num_int_" dense hide-details label="Num Interior"
                class="my-mayus" filled></v-text-field></v-col>

            <v-col cols="12" md="4"><v-text-field v-mask="'#####'" v-model="cp" @keyup="Colonias" dense hide-details
                label="Codigo Postal" filled></v-text-field></v-col>

            <v-col cols="12" md="8">
              <v-select label="Colonia" hide-details dense :value="colonia_temp"
                :items="lst_colonias" return-object item-value="cve_colonia" item-text="nombre"
                v-on:input="changeColonia" class="my-mayus" filled :error-messages="iErrors.cve_colonia"></v-select></v-col>



            <v-col cols="12" md="6"><v-text-field :value="municipio" dense hide-details label="Municipio"
                class="my-mayus" filled disabled></v-text-field></v-col>

            <v-col cols="12" md="6"><v-text-field :value="estado" dense hide-details label="Estado"
                class="my-mayus" filled disabled></v-text-field></v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3"><v-text-field v-model="nomina" dense hide-details label="Nomina"
                class="my-mayus" filled :error-messages="iErrors.nomina"></v-text-field></v-col>

            <v-col cols="12" md="3"><v-text-field v-model="nomina_reloj" dense hide-details label="Nomina Reloj"
                class="my-mayus" filled :error-messages="iErrors.nomina_reloj"></v-text-field></v-col>

            <v-col cols="12" md="6">
              <v-menu ref="menu_ingreso" v-model="menu_date_ingreso" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-bind="attrs" v-on="on" :value="Boolean(fecha_ingreso)?dayjs(fecha_ingreso).format('DD [de] MMMM [de] YYYY'):''" dense hide-details
                    label="Fecha Ingreso"  prepend-inner-icon="mdi-calendar" filled :error-messages="iErrors.fecha_ingreso"></v-text-field>
                </template>
                <v-date-picker v-model="fecha_ingreso" :max="new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .substr(0, 10)
                  " min="1950-01-01" @change="save_ingreso" local="es-mx"></v-date-picker>
              </v-menu>
            </v-col>

            <!-- <v-col cols="12" md="6">
              <v-menu ref="menu_baja" v-model="menu_date_baja" :close-on-content-click="false"
                transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-bind="attrs" v-on="on" v-model="fecha_baja" dense hide-details label="Fecha Baja"
                    class="my-mayus" prepend-inner-icon="mdi-calendar" filled></v-text-field>
                </template>
                <v-date-picker v-model="fecha_baja" :active-picker.sync="activePicker" :max="new Date(
                  Date.now() - new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .substr(0, 10)
                  " min="1950-01-01" @change="save_baja"></v-date-picker>
              </v-menu>
            </v-col> -->
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-show="id_colaborador == 0" class="secondary--text" @click="setColaborador">
            <v-icon class="mr-1">mdi-content-save</v-icon>Guardar</v-btn>

          <v-btn v-show="id_colaborador > 0" class="secondary--text" @click="updateColaborador">
            <v-icon class="mr-1">mdi-pencil</v-icon>Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog_beneficiario" width="1200" scrollable persistent content-class="rounded-xl">
      <v-card rounded="xl">
        <v-card-title>
          Agregar Beneficiario
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseBeneficiario"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider inset></v-divider>
        <v-card-text class="pt-5">
          <div class="d-flex">
            <div style="width: 300px;">
              <v-select v-model="id_parentesco_colaborador" :items="lst_parentescos" item-value="cve_rh_parentesco"
                item-text="nombre" filled label="Parentesco" :error-messages="iErrorsBeneficiario.id_parentesco"></v-select>
              <v-text-field v-model="nombre_colaborador" filled label="Nombre"
                :error-messages="iErrorsBeneficiario.nombre"></v-text-field>
              <v-text-field v-model="paterno_colaborador" filled label="Apellido paterno"
                :error-messages="iErrorsBeneficiario.paterno"></v-text-field>
              <v-text-field v-model="materno_colaborador" filled label="Apellido materno"
                :error-messages="iErrorsBeneficiario.materno"></v-text-field>
              <v-text-field v-model="contacto_colaborador" filled label="Contacto"
                :error-messages="iErrorsBeneficiario.contacto"></v-text-field>
              <v-textarea v-model="domicilio_colaborador" filled label="Domicilio"
                :error-messages="iErrorsBeneficiario.domicilio"></v-textarea>
              <v-btn block class="secondary--text" @click="fnCreateBeneficiario">
                <v-icon>mdi-content-save</v-icon>
                guardar</v-btn>
            </div>
            <v-divider vertical class="mx-2"></v-divider>
            <div class="flex-grow-1 redx pa-1">
              <v-simple-table style="border-top-left-radius: 10px;border-top-right-radius: 10px; overflow: hidden;">
                <template v-slot:default>
                  <thead>
                    
                    <tr class="grey lighten-1 rounded-xl">
                      <th>parentesco</th>
                      <th>nombre</th>
                      <th>contacto</th>
                      <th>domicilio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="beneficiario_ in lst_beneficiario">
                      <td>{{ beneficiario_.parentesco_name }}</td>
                      <td>
                        <span>{{ beneficiario_.nombre }}</span>
                        <span class="font-weight-bold mx-1">{{ beneficiario_.paterno }}</span>
                        <span class="font-italic">{{ beneficiario_.materno }}</span>
                      </td>
                      <td>{{ beneficiario_.contacto }}</td>
                      <td>{{ beneficiario_.domicilio }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog_escolaridad" width="900" scrollable persistent content-class="rounded-xl">
      <v-card rounded="xl">
        <v-card-title>
          Agregar escolaridad
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseEscolaridad"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider inset></v-divider>
        <v-card-text class="pt-5">
          <div class="d-flexx">
            <div style="">


              <v-row>
                <v-col cols="12" md="4">
                  <v-select v-model="nivel_escolaridad"
                    :items="['Primaria', 'Secundaria', 'Preparatoria/Bachillerato', 'Tecnico', 'Tecnico superior', 'Universitario', 'Otros']"
                    filled label="Nivel escolaridad" :error-messages="iErrorsEscolaridad.nivel_escolaridad"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="institucion_curso" filled label="Institucion Curso"
                    :error-messages="iErrorsEscolaridad.nombre_institucion_curso"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="annio_curso" filled label="Año curso"
                    :error-messages="iErrorsEscolaridad.anio_curso"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="estatus_escolaridad" :items="['Terminado', 'Trunca']" filled label="Estatus"
                    :error-messages="iErrorsEscolaridad.estatus"></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <!-- evidencia_escolaridad -->
                  <v-btn x-large :color="iErrorsEscolaridad.evidencia?'error':'btnsucces'" :outlined="Boolean(files)" class="white--text" @click="fnOpenFilesEscolaridad">
                    <v-icon>mdi-file-upload-outline</v-icon>
                    {{iErrorsEscolaridad.evidencia?'no evidencia':'evidencia'}}
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn block color="btnsucces" class="white--text" @click="fnCreateEscolaridad">guardar</v-btn>
                </v-col>
              </v-row>
            </div>
            <v-divider class="mx-2 mb-2"></v-divider>
            <div class="flex-grow-1">

              <v-simple-table style="border-top-left-radius: 10px;border-top-right-radius: 10px;overflow: hidden;">
                <template v-slot:default>
                  <thead>
                    <!-- <tr class="grey darken-2">
                      <th colspan="5" class="pl-5 white--text text-subtitle-1" style="font-size: 15px;">
                        Listado de escolaridad
                      </th>
                    </tr> -->
                    <tr class="grey lighten-1 rounded-xl">
                      <th>Nivel escolaridad</th>
                      <th>Institucion curso</th>
                      <th>Año curso</th>
                      <th>estatus</th>
                      <th>Evidencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="beneficiario_ in lst_escolaridad">
                      <td>{{ beneficiario_.nivel_escolaridad }}</td>
                      <td>
                        <span>{{ beneficiario_.nombre_institucion_curso }}</span>
                      </td>
                      <td>{{ beneficiario_.anio_curso }}</td>
                      <td>{{ beneficiario_.estatus }}</td>
                      <td>
                        <v-btn icon color="btnexp"
                          @click="fnDownloadEvidencia(beneficiario_.evidencia)"><v-icon>mdi-download</v-icon></v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>       
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="dialog_expediente" width="500" scrollable persistent>
      <v-card rounded="xl">
        <v-card-title>
          Expediente digital
          <v-spacer></v-spacer>
          <v-btn icon @click="fnCloseExpediente"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider insetx></v-divider>
        <v-card-text class="pa-0">
          
          <v-list>
            <template v-for="expediente_ in lst_expediente">
              <v-list-item  @click="openFileExpediente(expediente_)">
                <v-list-item-icon>
                  <v-icon v-if="Boolean(expediente_.cve_rh_colaborador_expediente)" color="success">mdi-check-circle</v-icon>
                  <v-icon v-else>mdi-minus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ expediente_.nombre }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
            </template>
          </v-list>

        </v-card-text>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog_historico" width="350" persistent class="" style="border-radius: 50%;">
      <v-card rounded="xl">
        <v-toolbar elevation=0>
          <v-toolbar-title>historico permanencia</v-toolbar-title>        
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog_historico=false"> <v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <div class="d-flex py-1" style="justify-content: space-evenly;" v-for="_hist in lst_historico">
            <div cols="6" class="text-center d-flex flex-column flex-grow-1 redx" style="width: 135px;">
              <span>
                {{ dayjs(_hist?.fecha_inicio).format("DD [de] MMM [de] YYYY") }}
              </span>
              <span>
                {{ _hist?.estatus_inicio==1?'ingreso':'reingreso' }}
              </span>
            </div>
            <span v-if="Boolean(_hist?.fecha_fin)" class="yellowx flex-grow-1" style="width: 25px;"><v-icon>mdi-arrow-expand-horizontal</v-icon></span>
            <span v-else class="yellowx flex-grow-1" style="width: 25px;"><v-icon>mdi-arrow-expand-right</v-icon></span>
            <div cols="6" class="text-center flex-grow-1 bluex" style="width: 135px;">
              <template v-if="Boolean(_hist?.fecha_fin)">
                <span>
                {{ Boolean(_hist?.fecha_fin)?dayjs(_hist?.fecha_fin).format("DD [de] MMM [de] YYYY"):'' }}
              </span>
              <span>
                baja
              </span>
              </template>
              

            </div>
        </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-snackbar color="success" v-model="snackbarok">
      <v-icon>mdi-check-circle</v-icon> Accion Realizada con exito
    </v-snackbar>

    <v-snackbar color="warning" v-model="snackbaralert">
      <v-icon>mdi-alert</v-icon> Algo salio mal verificar los datos
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from "vue";
import dayjs from 'dayjs'

import Horario from "@/components/colaborador/HorarioColaborador.vue";
import isNull from "lodash/isNull";
import {
  getDepartamentoColaboradoresService, getColaboradoresService, getColaboradorByIdService, setColaboradorService, updateColaboradorService, getAreaColaboradoresService, setJefeDepartamentoService, deleteColaboradorService,reingresoColaboradorService,
  getColaboradorBeneficiarioService, createColaboradorBeneficiarioService, getColaboradorEscolaridadService, createColaboradorEscolaridadService, getParentescoService, getDownloadEvidencia,getExpedienteService,createColaboradorExpedienteService,
  HistoricoColaboradorPermanenciaService,deleteColaboradorExpedienteDocService
} from '@/services/colaborador_service'
import { getColoniasByCpService } from '@/services/domicilio_service'
import {useValidacionColaborador, useValidacionColaboradorBeneficiario,useValidacionColaboradorEscolaridad } from '@/composables/useValidacionColaborador'
// import { useValidacionColaboradorEscolaridad } from '@/composables/useValidacionColaboradorEscolaridad'
import { useFileDialog } from '@vueuse/core'
import { saveAs } from 'file-saver';

const { iValid , iErrors,iClear } = useValidacionColaborador()
const { iValid: iValidBeneficiario, iErrors:  iErrorsBeneficiario,iClear:iClearBeneficiario } = useValidacionColaboradorBeneficiario()
const { iValid: iValidEscolaridad, iErrors: iErrorsEscolaridad,iClear:iClearEscolaridad } = useValidacionColaboradorEscolaridad()
const { files, open, reset, onChange } = useFileDialog()
const { files:files_exp, open:open_exp, reset:reset_exp, onChange:onChange_exp } = useFileDialog()

const root = getCurrentInstance().proxy;
const id_colaborador = ref(0);
const nombre = ref();
const paterno = ref("");
const materno = ref("");
const genero = ref("");
const fecha_nac = ref();
const curp = ref();
const rfc = ref();
const estado_civil = ref();

const cp = ref("");
const calle = ref("");
const num_ext = ref("");
const num_int_ = ref("");
const cve_colonia = ref("");
const municipio = ref("");
const estado = ref("");

const nomina = ref("");
const nomina_reloj = ref("");
const fecha_ingreso = ref();
const fecha_baja = ref("");
const id_departamento = ref();
const id_area = ref();

const show_form = ref(false);
const menu_date = ref(false);
const activePicker = ref(null);

const menu_date_ingreso = ref(false);
const menu_date_baja = ref(false);

let cve_persona = 0;
let cve_direccion = 0;

const colonia_temp = ref({ cve_colonia: 0, municipio: "", estado: "" });

const snackbarok = ref(false);
const snackbaralert = ref(false);

const search = ref("");

const page = ref(1);
const pageCount = ref(0);
const itemsPerPage = ref(10);

const lst_parentescos = ref([])
const dialog_beneficiario = ref(false)
const dialog_escolaridad = ref(false)
const dialog_expediente = ref(false)

const lst_beneficiario = ref([])
const lst_escolaridad = ref([])
const lst_expediente = ref([])

const id_parentesco_colaborador = ref()
const nombre_colaborador = ref()
const materno_colaborador = ref()
const paterno_colaborador = ref()
const contacto_colaborador = ref()
const domicilio_colaborador = ref()

const id_escolaridad = ref()
const nivel_escolaridad = ref()
const institucion_curso = ref()
const annio_curso = ref()
const estatus_escolaridad = ref()
const evidencia_escolaridad = ref()

const cve_rh_documento=ref()

const dialog_historico=ref(false)
const lst_historico=ref([])


const filters = ref([
  { label: "Nomina", key: "nomina", value: "", type: "text" },
  { label: "Colaborador", key: "colaborador", value: "", type: "text" },
  { label: "Curp", key: "curp", value: "", type: "text" },
  { label: "RFC", key: "rfc", value: "", type: "text" },
  { label: "Fecha Alta", key: "fecha_ingreso", value: "", type: "date" },
  { label: "Estatus", key: "estatus", value: "", },
]);

watch(menu_date, (val) => {
  val && setTimeout(() => (activePicker.value = "YEAR"));
});

const headers = [
  { text: "Nomina", value: "nomina" },
  { text: "Reloj", value: "nomina_reloj" },
  { text: "Empleado", value: "empleado" },
  { text: "Curp", value: "curp" },
  { text: "Rfc", value: "rfc" },
  { text: "Fecha Ingreso", value: "fecha_ingreso" },
  { text: "Area", value: "area_colaborador" },
  { text: "Estatus", value: "estatus", align: 'center' },
  { text: "acciones", value: "actions", align: 'center', width: '50px', cellClass: 'd-flex justify-space-between align-center px-2' },
];

const lst_colaboradores = ref([]);
const lst_colonias = ref([]);
const lst_departamentos = ref([]);
const lst_areas = ref([])

onChange((files) => {
  /** do something with files */
})


async function getColaboradores(filtros = {}) {
  try {
    // let { data, status } = await $axios.get("colaboradores", { params: filtros });
    const data = await getColaboradoresService(filtros)
    lst_colaboradores.value = data;
  } catch (error) { }
}

async function getColaborador(id) {
  try {
    // let { data, status } = await $axios.get(`colaboradores/${id}`);
    const data = await getColaboradorByIdService(id)
    show_form.value = true;
    id_colaborador.value = data.id_colaborador;
    nombre.value = data.nombre;
    paterno.value = data.apellido_paterno;
    materno.value = data.apellido_materno;
    genero.value = data.sexo;
    fecha_nac.value = data.fecha_nacimiento;
    curp.value = data.curp;
    rfc.value = data.rfc;
    estado_civil.value = data.estado_civil;
    id_departamento.value = data.id_departamento
    id_area.value = data.id_area ?? 0
    calle.value = data.calle;
    cp.value = data.cp;
    cve_colonia.value = data.cve_colonia;
    num_ext.value = data.numero_exterior;
    num_int_.value = data.numero_interior;
    municipio.value = data.municipio;
    estado.value = data.estado;
    nomina.value = data.nomina;
    nomina_reloj.value = data.nomina_reloj;
    fecha_ingreso.value = data.fecha_ingreso;
    fecha_baja.value = data.fecha_baja;
    cve_direccion = data.cve_direccion;
    cve_persona = data.cve_persona;
    if (!isNull(data.cp)) {
      Colonias();
      // colonia_temp.value=data.colonia
      colonia_temp.value.cve_colonia = data.cve_colonia;
    }
    if ((data.id_departamento ?? 0) > 0) {
      getAreas(data.id_departamento)
    }
  } catch (error) {
    console.log(error);
  }
}

async function setColaborador() {
  let dataSend = {
    nombre: nombre.value,
    paterno: paterno.value,
    materno: materno.value,
    genero: genero.value,
    fecha_nac: fecha_nac.value,
    curp: curp.value,
    rfc: rfc.value,
    estado_civil: estado_civil.value,
    calle: calle.value,
    num_ext: num_ext.value,
    num_int: num_int_.value,
    cve_colonia: cve_colonia.value,
    nomina: nomina.value,
    nomina_reloj: nomina_reloj.value,
    fecha_ingreso: fecha_ingreso.value,
    // fecha_baja: fecha_baja.value,
    id_departamento: id_departamento.value,
    id_area: id_area.value
  };

  try {

    const data_valid=await iValid(dataSend)
   
    const data = await setColaboradorService(data_valid)
    if (data > 0) {      
      snackbarok.value = true;
      cancelar();
      getColaboradores();
    } else snackbaralert.value = true;
  } catch (error) {
    // snackbaralert.value = true;
  }
}

async function updateColaborador() {
  let dataSend = {
    nombre: nombre.value,
    paterno: paterno.value,
    materno: materno.value,
    genero: genero.value,
    fecha_nac: fecha_nac.value,
    curp: curp.value,
    rfc: rfc.value,
    estado_civil: estado_civil.value,
    calle: calle.value,
    num_ext: num_ext.value,
    num_int: num_int_.value,
    cve_colonia: cve_colonia.value,
    nomina: nomina.value,
    nomina_reloj: nomina_reloj.value,
    fecha_ingreso: fecha_ingreso.value,
    // fecha_baja: fecha_baja.value,
    cve_persona: cve_persona,
    cve_direccion: cve_direccion,
    id_departamento: id_departamento.value,
    id_area: id_area.value
  };

  try {   
    const data_valid=await iValid(dataSend)
  
    const data = await updateColaboradorService(id_colaborador.value, data_valid)

    if (data > 0) {
      snackbarok.value = true;
      cancelar();
      getColaboradores();
    } else snackbaralert.value = true;
    cancelar();
  } catch (error) {
    console.log(error);
    snackbaralert.value = true;
  }
}

function save() {
  root.$refs.menu.save(fecha_nac.value);
}

function save_ingreso() {
  root.$refs.menu_ingreso.save(fecha_nac.value);
}

function save_baja() {
  root.$refs.menu_baja.save(fecha_nac.value);
}

async function Colonias() {
  lst_colonias.value = [];
  if (cp.value.length >= 5) {
    // let { data } = await $axios.get("domicilios", {
    //   params: { cp: cp.value },
    // });
    const data = await getColoniasByCpService(cp.value)
    lst_colonias.value = data;
  }
}

function changeColonia(a) {
  cve_colonia.value = a.cve_colonia;
  municipio.value = a.municipio;
  estado.value = a.estado;
}

function cancelar() {
  show_form.value = false;
  id_colaborador.value = 0;
  nombre.value = "";
  paterno.value = "";
  materno.value = "";
  genero.value = "";
  fecha_nac.value = undefined;
  curp.value = "";
  rfc.value = "";
  estado_civil.value = "";
  calle.value = "";
  cp.value = "";
  cve_colonia.value = "";
  colonia_temp.value={ cve_colonia: 0, municipio: "", estado: "" }
  num_ext.value = "";
  num_int_.value = "";
  municipio.value = "";
  estado.value = "";
  nomina.value = "";
  nomina_reloj.value = "";
  fecha_ingreso.value = undefined;
  fecha_baja.value = "";
  lst_colonias.value=[]
  iClear()
}

async function getDepartamentos() {
  try {
    // let { data, status } = await $axios.get("colaboradores/departamentos");
    const data = await getDepartamentoColaboradoresService()
    lst_departamentos.value = data;
  } catch (error) { }
}

async function getAreas(id) {
  try {
    // let { data, status } = await $axios.get(`colaboradores/areas/${id}`);
    const data = await getAreaColaboradoresService(id)
    lst_areas.value = data;
  } catch (error) { }
}

async function addJefeDepartamento(id_departamento, id_colaborador) {
  try {
    // let { data, status } = await $axios.put("colaboradores/jefe-area",{id_departamento,id_colaborador});
    const data = await setJefeDepartamentoService(id_departamento, id_colaborador);
console.log('data_ :',data)
if(data)
{
  root.$toast.success("se guardo correctamente");
}
else{
  root.$toast.error("ocurrio un error");
}
  } catch (error) {

  }
}


async function bajaColaborador(id) {
  try {
    const confirm = await root.$confirm('Desea realmente de baja al colaborador seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>', { title: 'info', width: 350, persistent: true })
    if (confirm) {
      // let { data, status } = await $axios.delete(`colaboradores/${id_colaborador.value}`);
      await deleteColaboradorService(id)
      getColaboradores()
    }
  } catch (error) { }
}
async function reingresoColaborador(id) {
  try {
    const confirm = await root.$confirm('Desea realmente reingresar al colaborador seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>', { title: 'info', width: 350, persistent: true })
    if (confirm) {
      // let { data, status } = await $axios.delete(`colaboradores/${id_colaborador.value}`);
      await reingresoColaboradorService(id)
      getColaboradores()
    }
  } catch (error) { }
}

async function fnOpenBeneficiario(id_colaborador_) {
  id_colaborador.value = id_colaborador_
  const data = await getColaboradorBeneficiarioService(id_colaborador_)
  lst_beneficiario.value = data
  dialog_beneficiario.value = true

}


function fnCloseBeneficiario() {
  lst_beneficiario.value = []
  id_parentesco_colaborador.value = 0
  nombre_colaborador.value = ''
  materno_colaborador.value = ''
  paterno_colaborador.value = ''
  contacto_colaborador.value = ''
  domicilio_colaborador.value = ''
  dialog_beneficiario.value = false
  iClearBeneficiario()

}


async function fnCreateBeneficiario() {

  try {

    const data_send = {
      id_colaborador: id_colaborador.value,
      id_parentesco: id_parentesco_colaborador.value,
      nombre: nombre_colaborador.value,
      paterno: paterno_colaborador.value,
      materno: materno_colaborador.value,
      contacto: contacto_colaborador.value,
      domicilio: domicilio_colaborador.value,
    }

    const data_valid = await iValidBeneficiario(data_send)

    const data = await createColaboradorBeneficiarioService(data_valid)
    const data_beneficiarios = await getColaboradorBeneficiarioService( id_colaborador.value)
    lst_beneficiario.value = data_beneficiarios



  } catch (error) {

  }
}

function fnOpenFilesEscolaridad()
{
  if(Boolean(files.value))
{
reset()
}
else{
  iClearEscolaridad()
  open()
}
}

async function fnOpenEscolaridad(id_colaborador_) {
  id_colaborador.value = id_colaborador_
  const data = await getColaboradorEscolaridadService(id_colaborador_)
  lst_escolaridad.value = data
  dialog_escolaridad.value = true
}

function fnCloseEscolaridad() {
  lst_escolaridad.value = []
  id_escolaridad.value = 0
  nivel_escolaridad.value = ''
  institucion_curso.value = ''
  annio_curso.value = ''
  estatus_escolaridad.value = ''
  reset()
  dialog_escolaridad.value = false
  iClearEscolaridad()

}


async function fnCreateEscolaridad() {
  
  try {
    const data_send = {
      id_colaborador: id_colaborador.value,
      nivel_escolaridad: nivel_escolaridad.value,
      nombre_institucion_curso: institucion_curso.value,
      anio_curso: annio_curso.value,
      estatus: estatus_escolaridad.value,
      evidencia: files.value?.[0]
    }

    const data_valid = await iValidEscolaridad(data_send)

    const data = await createColaboradorEscolaridadService(data_valid)
    const data_ = await getColaboradorEscolaridadService(id_colaborador.value)
    lst_escolaridad.value = data_

  } catch (error) {

  }
}

async function fnGetParentesco() {
  try {
    lst_parentescos.value = await getParentescoService()
  } catch (error) {

  }
}

async function fnDownloadEvidencia(evidencia) {
  try {
    const file_evidencia = await getDownloadEvidencia(evidencia)
    saveAs(file_evidencia)
  } catch (error) {

  }
}

async function fnOpenExpediente(id_colaborador_) {
  id_colaborador.value = id_colaborador_
  const data = await getExpedienteService(id_colaborador_)
  lst_expediente.value = data
  dialog_expediente.value = true
}

function fnCloseExpediente() {
  // lst_escolaridad.value = []
  // id_escolaridad.value = 0
  // nivel_escolaridad.value = ''
  // institucion_curso.value = ''
  // annio_curso.value = ''
  // estatus_escolaridad.value = ''
  // reset()
  dialog_expediente.value = false

}

async function openFileExpediente(exp_)
{
  if(!Boolean(exp_.cve_rh_colaborador_expediente))
  {
    open_exp()
    cve_rh_documento.value=exp_.cve_rh_documento
  }
  else{
    const confirm = await root.$confirm(
      'Desea realmente eliminar este documento, seleccione opción <b>"Aceptar"</b> en caso contrario la opción <b>"Cancelar"</b>',
      { title: "info", width: 350, persistent: true }
    );
    if (confirm) {
      
      const data_ = await deleteColaboradorExpedienteDocService(exp_.cve_rh_colaborador_expediente);    
      const data = await getExpedienteService(id_colaborador.value)
      lst_expediente.value = data      
    }
  }
}

onChange_exp(async ()=>
{
  const data_send={
    cve_colaborador:id_colaborador.value,
    cve_rh_documento:cve_rh_documento.value,
    documento:files_exp.value?.[0]
  }
  await createColaboradorExpedienteService(data_send)
  const data = await getExpedienteService(id_colaborador.value)
  lst_expediente.value = data
})

async function fnHistoricoColaboradorPermanencia(id)
{
  try {
    lst_historico.value= await HistoricoColaboradorPermanenciaService(id)
    dialog_historico.value=true
  } catch (error) {
    
  }
}

fnGetParentesco()
getColaboradores();
getDepartamentos();
</script>

<style scoped>
.my-mayus input {
  text-transform: uppercase;
}
</style>
